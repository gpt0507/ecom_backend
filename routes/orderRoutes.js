// const express = require("express");
// const router = express.Router();

// const Razorpay = require("razorpay");
// const path = require("path");
// const crypto = require("crypto");

// // razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // create order route
// router.post("/create-order", async (req, res) => {
//   try {

//     const options = {
//       amount: Number(req.body.amount), // amount in paise
//       currency: "INR",
//       receipt: "order_rcptid_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ error: error.message, });
//   }
// });

// // verify payment route
// router.post("/verify-payment", async (req, res) => {
//   try {

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     // create generated signature
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     // compare signatures
//     if (generated_signature === razorpay_signature) {
//       res.status(200).json({ success: true, message: "Payment verified successfully", });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//   } catch (error) {
//     res.status(500).json({ error: error.message, });
//   }
// });

// // payment success route
// router.get("/payment-success", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "success.html"));
// });

// module.exports = router