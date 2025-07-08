# 🔐 Secrets Web Application:
A secure web application that allows users to register, log in, submit secrets, 
and reset their passwords. Built using **Node.js**, **Express**, **MongoDB**, **EJS**, and **JWT**.

---
Live server: https://secretwebsite-5.onrender.com

## ✨ Features

- 🧑 User Registration and Login
- 🔐 Password Hashing with **bcrypt**
- 🪪 JWT Authentication via **Cookies**
- ✉️ Password Reset via **Nodemailer**
- 📂 Secrets Submission and Viewing
- ✅ Protected Routes using Middleware
- 🖥 Server-side Rendering with **EJS**
- 🔎 Email verification via password reset

---

## 📂 Project Structure
├── views/ # EJS templates (login, register, submit,about,contact,forget,home,resetPassword,secret etc.)
├── public/ # Static assets (CSS, images, JS)
├── .env # Environment variables
├── app.js # Main server file
├── package.json
├── package-lock.json
└── README.md

## ⚙️ Technologies Used

- [Express.js](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [EJS Templating](https://ejs.co/)
- [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [nodemailer](https://nodemailer.com/about/)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## Set up your .env file
JWT_SECRET=YourSuperSecretKey
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your_gmail_app_password
🔐 For Gmail password, use an App Password if you have 2FA enabled.

🌐 Slide 1: Auth – Registration & Login

| Method | Route       | Description                |
|--------|-------------|----------------------------|
| GET    | /register   | Show registration form     |
| POST   | /register   | Register a new user        |
| GET    | /login      | Show login form            |
| POST   | /login      | Authenticate user & login  |
| GET    | /logout     | Logout and clear cookie    |

🔐 Slide 2: Protected – Secrets Area

| Method | Route     | Description                        |
|--------|-----------|------------------------------------|
| GET    | /secret   | View submitted secrets (protected) |
| GET    | /submit   | Form to submit a secret (protected)|
| POST   | /submit   | Save new secret to database        |

🔁 Slide 3: Password Reset Flow

| Method | Route                      | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | /forget                    | Request password reset          |
| POST   | /forget                    | Send reset email                |
| GET    | /reset_password/:token     | Show password reset form        |
| POST   | /reset_password/:token     | Save new password after reset   |

📄 Slide 4: Static Pages & Home

| Method | Route      | Description      |
|--------|------------|------------------|
| GET    | /          | Home page        |
| GET    | /about     | About page       |
| GET    | /contact   | Contact page     |

✅ Slide 5: Auth Summary (Optional)

JWT Auth is used with:
- Cookies (httpOnly)
- Middleware protected routes
- Token expiration: 1 hour

## Start MongoDB
Make sure MongoDB is running locally on default port (27017).

## Run the App
node app.js

Visit: http://localhost:5000




