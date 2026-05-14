const cloudinary = require("../Cloudinary/cloudinary");
const userDB = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER SECRET KEY"

const registerUserController = async (req, res) => {
  console.log('user route called\n register api called')
  console.log('request body is', req.body)
  // console.log('request file is', req.file)
  // res.send('user registered successfully');

  const { firstname, lastname, email, password, confirmpassword } = req.body;


  if (!firstname || !email || !lastname || !password || !confirmpassword || !req.file) {
    return res.status(400).json({ error: "all fileds are required" })
  }

  const file = req.file?.path;
  const upload = await cloudinary.uploader.upload(file);

  console.log('file path is', file)
  console.log("upload url is", upload.url)
  // res.send('user registered successfully');


  try {
    const preuser = await userDB.findOne({ email: email });
    console.log('preuser is', preuser)

    if (preuser) {
      return res.status(400).json({ error: "this user is already exist" });
    } else if (password !== confirmpassword) {
      return res.status(400).json({ error: "password and confirm password not match" });
    } else {
      const userData = new userDB({
        firstname, lastname, email, password, userprofile: upload.secure_url
      });

      console.log("userdata is", userData)

      // here password hashing
      let data = await userData.save();
      console.log("data is", data)

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

    res.status(200).json({
      userValid,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const userverifyController = async (req, res) => {
  try {
    res.status(200).json({
      valid: true,
      user: req.rootUser
    });
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



// const loginUserController = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "All fields required" });
//   }

//   try {
//     const userValid = await userDB.findOne({ email });

//     if (!userValid) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     const isMatch = await bcrypt.compare(password, userValid.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     // ✅ STEP 1: Remove expired tokens
//     let validTokens = [];

//     for (let t of userValid.tokens) {
//       try {
//         jwt.verify(t.token, SECRET_KEY);
//         validTokens.push(t);
//       } catch {
//         // expired → skip
//       }
//     }

//     userValid.tokens = validTokens;

//     // ✅ STEP 2: Limit to max 3 devices
//     if (userValid.tokens.length >= 3) {
//       // remove oldest device
//       userValid.tokens.shift();
//     }

//     // ✅ STEP 3: Generate NEW token (always)
//     const device = req.headers["user-agent"] || "unknown";

//     const newToken = jwt.sign(
//       { _id: userValid._id },
//       SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     userValid.tokens.push({
//       token: newToken,
//       device,
//       createdAt: new Date()
//     });

//     await userValid.save();

//     res.status(200).json({
//       userValid,
//       token: newToken,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// };



// const loginUserController = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "All fields required" });
//   }

//   try {
//     const userValid = await userDB.findOne({ email });

//     if (!userValid) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     const isMatch = await bcrypt.compare(password, userValid.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     // ✅ STEP 1: Remove expired tokens
//     userValid.tokens = userValid.tokens.filter(t => {
//       try {
//         jwt.verify(t.token, SECRET_KEY);
//         return true;
//       } catch {
//         return false;
//       }
//     });

//     // ✅ NEW CONDITION: limit max 3 tokens
//     if (userValid.tokens.length > 3) {
//       userValid.tokens = userValid.tokens.slice(-3); // last 3 tokens rakho
//     }

//     await userValid.save();



//     let token;

//     // ✅ STEP 2: Reuse existing token
//     if (userValid.tokens.length > 0) {
//       token = userValid.tokens[0].token;
//       console.log("Using existing token:", token);
//     }

//     // ✅ STEP 3: Generate new if none exists
//     if (!token) {
//       token = await userValid.generateuserAuthToken();
//       console.log("Generated new token:", token);
//     }

//     res.status(200).json({
//       userValid,
//       token,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// };


// const loginUserController = async (req, res) => {
//   console.log('request body is', req.body);

//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "All fields required" });
//   }

//   try {
//     const userValid = await userDB.findOne({ email });

//     if (!userValid) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     const isMatch = await bcrypt.compare(password, userValid.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid Details" });
//     }

//     let token;

//     // ✅ STEP 1: Check existing tokens
//     if (userValid.tokens && userValid.tokens.length > 0) {
//       for (let t of userValid.tokens) {
//         try {
//           // ✅ STEP 2: verify token
//           const decoded = jwt.verify(t.token, SECRET_KEY);

//           // ✅ valid token found → reuse it
//           token = t.token;
//           console.log("Using existing valid token:", token);
//           break;

//         } catch (err) {
//           // ❌ expired/invalid → ignore
//         }
//       }
//     }

//     // ✅ STEP 3: If no valid token → generate new
//     if (!token) {
//       token = await userValid.generateuserAuthToken();
//       console.log("Generated new token:", token);
//     }

//     const result = {
//       userValid,
//       token,
//     };

//     res.status(200).json(result);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// };






// const loginUserController = async (req, res) => {
//   console.log('request body is', req.body)

//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "all field require" })
//   }

//   try {
//     const userValid = await userDB.findOne({ email: email });
//     console.log('user valid is', userValid)

//     if (userValid) {
//       const isMatch = await bcrypt.compare(password, userValid.password);

//       if (!isMatch) {
//         res.status(400).json({ error: "Invalid Details" })
//       } else {
//         // token generate
//         const token = await userValid.generateuserAuthToken();

//         console.log('token is', token)

//         const result = {
//           userValid,
//           token
//         }
//         console.log("result is", result)

//         res.status(200).json(result)
//       }
//     } else {
//       res.status(400).json({ error: "invalid details" })
//     }
//   } catch (error) {
//     res.status(400).json(error)

//   }
// }


// userverify




// const userverifyController = async (req, res) => {
//   try {
//     const verifyUser = await userDB.findOne({ _id: req.userId });
//     console.log('verify user is', verifyUser)


//     // res.status(200).json(verifyUser)
//     // res.send("verified")
//   } catch (error) {
//     res.status(400).json(error)
//   }
// }

// logout
// const logoutController = async (req, res) => {
//   try {
//     req.rootUser.tokens = req.rootUser.tokens.filter((currentElement) => {
//       return currentElement.token !== req.token
//     });

//     req.rootUser.save();
//     res.status(200).json({ message: "user Succesfully Logout" })
//   } catch (error) {
//     res.status(400).json(error)

//   }
// }

