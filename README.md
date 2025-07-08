# 🔐 Secrets Web Application:
A secure web application that allows users to register, log in, submit secrets, 
and reset their passwords. Built using
1. Node.js
2. Express
3. MongoDb
4. EJS
5. JWT

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
├── public/ # (CSS, images, JS)
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

| Method | Route       | Purpose                          |
|--------|-------------|----------------------------------|
| GET    | /register   | Showing user Register Form       |
| POST   | /register   | Create a new user account        |
| GET    | /login      | Load the login interface         |
| POST   | /login      | Validate credentials & issue JWT |
| GET    | /logout     | Clear token and end user session |


🔐 Slide 2: Protected – Secrets Area

| Method | Route     | Purpose                                      |
|--------|-----------|----------------------------------------------|
| GET    | /secret   | Display secrets for the logged-in user       |
| GET    | /submit   | Show form to add a new secret (requires auth)|
| POST   | /submit   | Store the submitted secret in the database   |


🔁 Slide 3: Password Reset Flow

| Method | Route                      | Purpose                                      |
|--------|----------------------------|----------------------------------------------|
| GET    | /forget                    | Display form to initiate password reset      |
| POST   | /forget                    | Email a reset link to the user               |
| GET    | /reset_password            | Display the interface to set a new password  |
| POST   | /reset_password            | Update the password                          |



📄 Slide 4: Static Pages & Home

| Method | Route      | Purpose                        |
|--------|------------|--------------------------------|
| GET    | /          | Home Page                      |
| GET    | /about     | Display the information of secret Website |
| GET    | /contact   | Show contact details page      |


✅ Slide 5: Auth Summary (Optional)

JWT Auth is used with:
- Cookies (httpOnly)
- Middleware protected routes
- Token expiration: 1 hour

## Start MongoDB
check for MongoDB is running locally on default port (27017).

## Run the App
node app.js

Visit: http://localhost:5000




