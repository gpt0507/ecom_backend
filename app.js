require('dotenv').config();
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const cors = require('cors');
const port = 4009
require('./config/db')

app.use(cors());
app.use(express.json());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "codewalesir@gmail.com",
    pass: "vkixpbelvyqedylm"
  }
});



// ================= SEND ORDER MAIL =================
app.post("/send-order-mail", async (req, res) => {
  try {
    const { user, carts, totalQty, totalPrice } = req.body;

    console.log('user is', user);
    console.log('carts is', carts);
    console.log('totalQty is', totalQty);
    console.log('totalPrice is', totalPrice);


    // ====== EJS TEMPLATE RENDER ======
    const templatePath = path.join(__dirname, "views", "ordertemplate.ejs");
    console.log("template path is", templatePath)

    const html = await ejs.renderFile(templatePath, { user, carts, totalQty, totalPrice });
    console.log("html file is", html)

    // ====== SEND MAIL ======

    const info = await transporter.sendMail({
      from: "Gaurav Agrawal <codewalesir@gmail.com>",
      to: user.email,
      subject: "Your Order Confirmed 🎉",
      html: html
    });

    res.status(200).json({ success: true, message: "Order Mail Sent Successfully", info });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed To Send Mail", error });
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

// // cart route
// const cartRoutes = require("./routes/cartRoutes");
// app.use("/api/cart", cartRoutes);

// // order route
// const orderRoutes = require("./routes/orderRoutes");
// app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});


module.exports = app;




// // admin route
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/users", adminRoutes);


// // product route
// const productRoutes = require("./routes/productRoutes");
// app.use("/api/products", productRoutes);

// // cart route
// const cartRoutes = require("./routes/cartRoutes");
// app.use("/api/cart", cartRoutes);

// // order route
// const orderRoutes = require("./routes/orderRoutes");
// app.use("/api/orders", orderRoutes);

