const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER SECRET KEY"

const userSchema = new mongoose.Schema({
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
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  userprofile: {
    type: String, // image url
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  // for forgotpassword
  verifytoken: {
    type: String
  }

}, { timestamps: true });


userSchema.pre("save", async function () {
  try {
    if (this.isModified("password")) {
      // console.log("Before hash:", this.password);
      this.password = await bcrypt.hash(this.password, 12);
      // console.log("After hash:", this.password);
    }
  } catch (error) {
    // console.log("error in pre method password hashing", error);
    throw error; // ✅ important
  }
});

// token generate
userSchema.methods.generateuserAuthToken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: "31d"
    });

    this.tokens = this.tokens.concat({ token: newtoken });

    await this.save()
    return newtoken;
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

// user model
const userDB = new mongoose.model("users", userSchema);

module.exports = userDB;