const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// ================= ADMIN SCHEMA =================
const adminSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  adminprofile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],

  // FORGOT PASSWORD TOKEN
  verifytoken: {
    type: String
  }
}, {
  timestamps: true
});


// ================= PASSWORD HASHING =================
adminSchema.pre("save", async function () {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  } catch (error) {
    // console.log("Password Hashing Error:", error);
    throw error;
  }
});


// ================= GENERATE AUTH TOKEN =================
adminSchema.methods.generateadminAuthToken = async function () {
  try {
    const newtoken = jwt.sign({ _id: this._id }, SECRET_KEY, { expiresIn: "180d" });
    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (error) {
    // console.log("Token Generation Error:", error);
    throw error;
  }
};

// ================= ADMIN MODEL =================
const adminDB = mongoose.model("admins", adminSchema);
module.exports = adminDB;