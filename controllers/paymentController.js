const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// ================= RAZORPAY INSTANCE =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ================= NODEMAILER =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {

    console.log("CREATE ORDER ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });

  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      carts,
      totalQty,
      totalPrice,
    } = req.body;

    // ================= GENERATE SIGNATURE =================
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // ================= VERIFY =================
    if (generated_signature === razorpay_signature) {

      // SUCCESS RESPONSE FIRST
      res.status(200).json({
        success: true,
        message: "Payment Verified Successfully",
      });

      // ================= SEND MAIL AFTER RESPONSE =================
      try {

        const templatePath = path.join(
          __dirname,
          "../views/ordertemplate.ejs"
        );

        const html = await ejs.renderFile(templatePath, {
          user,
          carts,
          totalQty,
          totalPrice,
        });

        await transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          subject: "Order Confirmed 🎉",
          html: html,
        });

        console.log("MAIL SENT SUCCESSFULLY");

      } catch (mailError) {

        console.log("MAIL ERROR =>", mailError);

      }

    } else {

      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });

    }

  } catch (error) {

    console.log("VERIFY PAYMENT ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};





















// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const ejs = require("ejs");
// const path = require("path");


// // RAZORPAY INSTANCE
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // NODEMAILER TRANSPORTER
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
// });

// // ================= CREATE ORDER =================
// exports.createOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const options = {
//       amount: amount * 100,
//       currency: "INR",
//       receipt: "receipt_order",
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   }
//   catch (error) {
//     // console.log(error);
//     res.status(500).json({ success: false, message: "Order creation failed", });
//   }
// };




// // ================= VERIFY PAYMENT =================

// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       user,
//       carts,
//       totalQty,
//       totalPrice,
//     } = req.body;



//     // GENERATE SIGNATURE
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");


//     // VERIFY PAYMENT
//     if (generated_signature === razorpay_signature) {
//       // EJS TEMPLATE PATH
//       const templatePath = path.join(__dirname, "../views/ordertemplate.ejs");

//       // RENDER HTML
//       const html = await ejs.renderFile(templatePath, { user, carts, totalQty, totalPrice, });

//       // SEND MAIL
//       await transporter.sendMail({
//         from: process.env.EMAIL,
//         to: user.email,
//         subject: "Order Confirmed 🎉",
//         html: html,
//       });
//       // return res.status(200).json({ success: true, message: "Payment Verified & Mail Sent", });
//       return res.status(200).json({ success: true, message: "Payment Verified" });
//     }
//     else {
//       return res.status(400).json({ success: false, message: "Payment Verification Failed", });
//     }
//   }
//   catch (error) {
//     // console.log(error);
//     res.status(500).json({ success: false, message: "Server Error", });
//   }
// };