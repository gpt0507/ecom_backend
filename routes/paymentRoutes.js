const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, sendOrderMail } = require("../controllers/paymentController");

// CREATE ORDER
router.post("/create-order", createOrder);

// VERIFY PAYMENT
router.post("/verify-payment", verifyPayment);

// SEND MAIL
router.post("/send-order-mail", sendOrderMail);

module.exports = router;