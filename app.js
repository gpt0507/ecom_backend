require('dotenv').config();
const express = require("express");
const app = express();

const cors = require('cors');
const port = 4009
require('./config/db')

app.use(cors());
app.use(express.json());

// user route
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// products route
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


// // admin route
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/users", adminRoutes);

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

