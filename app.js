require('dotenv').config();
const express = require("express");
const app = express();
const Razorpay = require("razorpay");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const cors = require('cors');
const port = 4009
require('./config/db')

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// view engine
app.set("view engine", "ejs");

// static folder
app.use(express.static("public"));


// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


// user route
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// products route
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


// admin route
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// admin route
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

// // order route
// const orderRoutes = require("./routes/orderRoutes");
// app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;