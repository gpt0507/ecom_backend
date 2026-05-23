const cloudinary = require("../Cloudinary/cloudinary");
const adminDB = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;


// ================= REGISTER ADMIN =================
const registerAdminController = async (req, res) => {
  try {
    // console.log("admin registered api hitted")
    const { firstname, lastname, email, password, confirmpassword } = req.body;

    // VALIDATION
    if (!firstname || !lastname || !email || !password || !confirmpassword || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // CHECK EXISTING ADMIN
    const preadmin = await adminDB.findOne({ email });
    if (preadmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // PASSWORD MATCH CHECK
    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Password and Confirm Password do not match" });
    }

    // CLOUDINARY UPLOAD
    const file = req.file.path;
    const uploadedImage = await cloudinary.uploader.upload(file);

    // CREATE ADMIN
    const adminData = new adminDB({ firstname, lastname, email, password, adminprofile: uploadedImage.secure_url });

    // console.log("admin uploaded url is", uploadedImage.secure_url);

    // SAVE ADMIN
    const savedAdmin = await adminData.save();

    res.send("Admin registered successfully");

  } catch (error) {
    // console.log("Register Admin Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// ================= LOGIN ADMIN =================

const loginAdminController = async (req, res) => {
  // console.log("admin login api hitted");

  const { email, password } = req.body;
  // console.log("req body is", req.body);

  // VALIDATION
  if (!email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    // FIND ADMIN
    const adminValid = await adminDB.findOne({ email });

    if (!adminValid) {
      return res.status(400).json({ error: "Invalid Details" });
    }

    // PASSWORD MATCH
    const isMatch = await bcrypt.compare(password, adminValid.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Details" });
    }

    // REMOVE EXPIRED TOKENS
    adminValid.tokens = adminValid.tokens.filter((t) => {
      try {
        jwt.verify(t.token, SECRET_KEY);
        return true;
      } catch {
        return false;
      }
    });

    // GENERATE NEW TOKEN
    const token = await adminValid.generateadminAuthToken();

    // LIMIT MAX 3 TOKENS
    if (adminValid.tokens.length > 3) {
      adminValid.tokens = adminValid.tokens.slice(-3);
    }
    await adminValid.save();


    // console.log("admin valid and token is", { adminValid, token });

    // RESPONSE
    res.status(200).json({ adminValid, token });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const adminverifyController = async (req, res) => {
  try {
    res.status(200).json({ valid: true, admin: req.rootAdmin });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};


// ================= LOGOUT ADMIN =================

const logoutController = async (req, res) => {
  try {
    const admin = req.rootAdmin;
    const token = req.token;
    // REMOVE CURRENT TOKEN
    admin.tokens = admin.tokens.filter((t) => t.token !== token);

    await admin.save();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // console.log("Logout Error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};


module.exports = { registerAdminController, loginAdminController, adminverifyController, logoutController };