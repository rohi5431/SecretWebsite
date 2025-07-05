const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer")

require('dotenv').config();


app.use(cookieParser());
app.set('view engine',"ejs")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/secrets", {
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

app.get("/",function(req,res){
    res.render("home")
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
   res.render("login");
});
app.get("/forget", function(req, res){
    res.render("forget");
});

app.get("/about",function(req,res){
    res.render("about")
});
app.get("/contact",function(req,res){
    res.render("contact")
});
app.get("/logout",function(req,res){
    res.clearCookie("sessionToken");
    res.redirect("/login");
});

app.get("/secret", authenticationJWT, async function(req, res){
    const userSecretInfo = await User.findById(req.userId).select("name email secret");
    res.render("secret", { userSecretInfo });
});

app.post("/register", async function(req,res){
    try{
        const securePass = await bcrypt.hash(req.body.password, 10);
        const newPerson = new User({
           name: req.body.name,
           email: req.body.username,
           password: securePass,
        })
        await newPerson.save();
        res.redirect("/login");
    }
    catch(err){
        console.log("Registration error",err);
        console.log("try again!")
    }
})

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
        const userFound = await User.findOne({ email: userName});
  
        if(!userFound){
            return res.status(401).send("Invalid Username");
        }
  
        console.log("Found user password in DB:", userFound.password);
  
        const match = await bcrypt.compare(pass, userFound.password);
        if(match){
           const sessionToken = jwt.sign({ userId: userFound._id }, "AuthSecretKey", { expiresIn: "1h" });
           res.cookie("sessionToken", sessionToken, {
           httpOnly: true,
           secure: false,
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

app.post("/submit", authenticationJWT, async function(req, res){
    try{
        const userData = await User.findById(req.userId);
        if (!userData) return res.redirect("/login");

        userData.secret = req.body.secret;
        await userData.save();

        res.redirect("/secret");
    } 
    catch(err){
        console.error("Error submitting secret:", err);
        res.status(500).send("Error submitting secret");
    }
});

app.get("/submit", authenticationJWT, async function(req, res){
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


app.post("/forget", async function(req, res){
    const email = req.body.username;
    const resetUserPass = await User.findOne({ email });

    if(!resetUserPass){
        return res.status(404).send("This email does not exits.");
    }
    const token = jwt.sign(
        { userId: resetUserPass._id },
        "ResetPasswordSecretKey",
        { expiresIn: '15m' }
    );

    const resetPassLink = `http://localhost:5000/reset-password/${token}`;
    const emailSender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS         
        }
    });

    const emailContent = {
        from: 'yourgmail@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        html: `<p> To reset your password, Click <a href="${resetPassLink}">here</a></p>`
    };

    try{
        await emailSender.sendMail(emailContent);
        res.send("Password reset link sent to your email.");
    } 
    catch(err){
        console.error("Error sending email:", err);
        res.status(500).send("Failed to send reset email.");
    }
});

app.get("/reset_password/:token", function(req, res){
    const resetToken = req.params.token;
    res.render("reset-password", { resetToken });
});

app.post("/reset_password/:token", async function(req, res){
    const resetToken = req.params.token;
    const updatePassword = req.body.newPassword;

    try{
        const decodes = jwt.verify(resetToken, "ResetPasswordSecretKey");
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


function authenticationJWT(req,res,next){
   const tokens = req.cookies.sessionToken

   if(!tokens){
     return res.redirect("/login")
   }
   try{
      const decodes = jwt.verify(tokens,"AuthSecretKey")
      req.userId = decodes.userId
      next();
   }
   catch(err){
      console.error("JWT verification will be failed",err);
      return res.redirect("/login")
   }
}

app.listen(5000, function(){
   console.log("Server Started at 5000")
});