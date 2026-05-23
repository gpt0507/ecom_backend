const cloudinary = require("../Cloudinary/cloudinary");
const userDB = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER SECRET KEY"

const registerUserController = async (req, res) => {
  // console.log('user route called\n register api called')
  // console.log('request body is', req.body)
  // console.log('request file is', req.file)
  // res.send('user registered successfully');

  const { firstname, lastname, email, password, confirmpassword } = req.body;


  if (!firstname || !email || !lastname || !password || !confirmpassword || !req.file) {
    return res.status(400).json({ error: "all fileds are required" })
  }

  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);

  // console.log('file path is', file)
  // console.log("upload url is", upload.url)
  // res.send('user registered successfully');


  try {
    const preuser = await userDB.findOne({ email: email });
    // console.log('preuser is', preuser)

    if (preuser) {
      return res.status(400).json({ error: "this user is already exist" });
    } else if (password !== confirmpassword) {
      return res.status(400).json({ error: "password and confirm password not match" });
    } else {
      const userData = new userDB({
        firstname, lastname, email, password, userprofile: upload.secure_url
      });

      // console.log("userdata is", userData)

      // here password hashing
      let data = await userData.save();
      // console.log("data is", data)

      // res.status(200).json(userData);
      // res.status(200).json(data);
      // res.status(200).json({ "data": "user registered successfully" });
      res.send('user registered successfully');
    }
  } catch (error) {
    res.status(400).json(error)
  }

  // res.send('user registered successfully');

}

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  // console.log("req body is", req.body)

  if (!email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const userValid = await userDB.findOne({ email });

    if (!userValid) {
      return res.status(400).json({ error: "Invalid Details" });
    }

    const isMatch = await bcrypt.compare(password, userValid.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Details" });
    }

    // ✅ STEP 1: Remove expired tokens
    userValid.tokens = userValid.tokens.filter(t => {
      try {
        jwt.verify(t.token, SECRET_KEY);
        return true;
      } catch {
        return false;
      }
    });

    // ✅ STEP 2: Generate NEW token (multi-device support)
    const token = await userValid.generateuserAuthToken();

    // ✅ STEP 3: Limit max 3 tokens
    if (userValid.tokens.length > 3) {
      userValid.tokens = userValid.tokens.slice(-3); // last 3 tokens
    }
    await userValid.save();

    res.status(200).json({ userValid, token, });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const userverifyController = async (req, res) => {
  try {
    res.status(200).json({ valid: true, user: req.rootUser });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};

const logoutController = async (req, res) => {
  try {
    const user = req.rootUser;
    const token = req.token;
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();
    res.status(200).json({ message: "Logged out from this device" });

  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

const logoutAllController = async (req, res) => {
  try {
    const user = req.rootUser;

    user.tokens = [];
    await user.save();

    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    res.status(500).json({ error: "Logout all failed" });
  }
};

module.exports = { registerUserController, loginUserController, userverifyController, logoutController, logoutAllController }