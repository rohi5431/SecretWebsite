require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer")

if(!process.env.JWT_SECRET){
    console.error("JWT_SECRET not set in .env file");
    process.exit(1);
}

const app = express()
app.set('view engine',"ejs")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => console.log("MongoDB Database connected successfully"))
  .catch(err => console.log("Database error:", err));

const secretSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    secret: String,
})

const User = mongoose.model("User", secretSchema);

function authenticationjwtToken(req,res,next){
    const token = req.cookies.authToken
    console.log("Receive JWT:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    if(!token){
      console.log("No token found");
      return res.redirect("/login")
    }
    try{
       const decodes = jwt.verify(token,process.env.JWT_SECRET)
       console.log("Decoded JWT:", decodes);
       req.userId = decodes.userId
       next();
    }
    catch(err){
       console.error("jwt verification will be failed",err);
       return res.redirect("/login")
    }
}

app.get("/",function(req,res){
    res.render("home")
});

app.get("/register", function(req, res){
    const error = req.query.error || null;
    res.render("register", { error }); 
});
app.post("/register", async function(req,res){
    try{
        const userEmail = req.body.username;
        const userCheck = await User.findOne({ email: userEmail });
        if(userCheck){
            return res.redirect("/register?error=" + encodeURIComponent("User already exists. Please login."));
        }
        const users = await User.find({});
        for(const user of users){
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if(passwordMatch){
               return res.redirect("/register?error=" + encodeURIComponent("Please choose a different password. This one has been used before."));
            }
        }
        const securePass = await bcrypt.hash(req.body.password, 10);
        const newPerson = new User({
           name: req.body.name,
           email: req.body.username,
           password: securePass,
        });
        await newPerson.save();
        const payload = { userId: newPerson._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.redirect("/submit");
    }
    catch(err){
        console.log("Registration error",err);
        return res.status(500).send("try again.");
    }
});

app.get("/login", function(req, res){
   res.render("login");
});

app.post("/login", async function(req, res){
  try{
       const userName = req.body.username;
       const pass = req.body.password;
   
       console.log("Username:", userName);
       console.log("Password:", pass);

        if(!userName || !pass){
           console.log("username or password is Missing");
           return res.status(400).send("Missing credentials");
        }
        const { username } = req.body;
        const userFound = await User.findOne({ email: username });
  
        if(!userFound){
            return res.status(401).send("Invalid Username");
        }
  
        console.log("AC user password in DB:", userFound.password);
  
        const match = await bcrypt.compare(pass, userFound.password);
        if(match){
           const tokenPayload = { userId: userFound._id}
           const jwtSeccret = process.env.JWT_SECRET;
           const authToken = jwt.sign(tokenPayload,jwtSeccret, {expiresIn : "1h"})
           res.cookie("authToken", authToken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'lax'
      });
      res.redirect("/secret");
    } 
    else{
      res.status(401).send("Invalid username or password");
    }
  } 
  catch(err){
    console.error("Login failure:", err);
    res.status(500).send("Server error");
  }
});
app.get("/logout",function(req,res){
    res.clearCookie("authToken");
    res.redirect("/login");
});

app.get("/secret", authenticationjwtToken, async function(req, res){
    const userDetails = await User.findById(req.userId).select("name email secret");
    res.render("secret", { userDetails });
});
app.get("/submit", authenticationjwtToken, async function(req, res){
    try{
        const userData = await User.findById(req.userId).select("name");
        if(!userData){
            return res.redirect("/login");
        }

        res.render("submit", { userData });
    } 
    catch(err){
        console.error("Submission error:", err);
        res.status(500).send("Server Error");
    }
});

app.post("/submit", authenticationjwtToken, async function(req, res){
    try{
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.redirect("/login");
        }    
        userData.secret = req.body.secret;
        await userData.save();

        res.redirect("/secret");
    } 
    catch(err){
        console.error("Error submitting secret:", err);
        res.status(500).send("Error submitting secret");
    }
});

app.get("/forget", function(req, res){
    res.render("forget");
});
app.post("/forget", async function(req, res){
    const email = req.body.username;
    const resetUserPass = await User.findOne({ email });

    if(!resetUserPass){
        return res.status(404).send("This email does not exits.");
    }
    const token = jwt.sign(
        { userId: resetUserPass._id },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const url = process.env.BASE_URL || "http://localhost:5000";
    const resetPassLink = `${url}/reset-password/${token}`;
    const emailSender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS         
        }
    });

    const emailContent = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        html: `<p> To reset your password, Click <a href="${resetPassLink}">here</a></p>`
    };

    try{
        await emailSender.sendMail(emailContent);
        res.send("We've emailed you the link to reset your password.");
    } 
    catch(err){
        console.error("Error sending email:", err);
        res.status(500).send("Failed to send reset email.");
    }
});

app.get("/reset_password/:token", function(req, res){
    try{
        const resetToken = req.params.token;
        jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
        res.render("reset-password", { resetToken });
    } 
    catch(err){
        res.status(400).send("Expired reset token.");
    }
});
app.post("/reset_password/:token", async function(req, res){
    const resetToken = req.params.token;
    const updatePassword = req.body.newPassword;

    try{
        if(!updatePassword || updatePassword.length < 6){
            return res.status(400).send("Password contain minimum 6 char.");
        }
        const decodes = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
        const hashedPassword = await bcrypt.hash(updatePassword, 10);

        await User.findByIdAndUpdate(decodes.userId, {
            password: hashedPassword
        });

        res.send("Password reset successfully. <a href='/login'>Login now</a>");
    } 
    catch(err){
        console.error("Reset error:", err);
        res.status(400).send("Expired reset token.");
    }
});

app.get("/about",function(req,res){
    res.render("about")
});
app.get("/contact",function(req,res){
    res.render("contact")
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
