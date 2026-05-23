const userDB = require("../models/userModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER SECRET KEY"


const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const verifyToken = jwt.verify(token, SECRET_KEY);

    // ✅ check token exists in DB
    const rootUser = await userDB.findOne({
      _id: verifyToken._id,
      "tokens.token": token
    });

    if (!rootUser) {
      throw new Error("User not found or token invalid");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    // console.log("Middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = userMiddleware;


// const userMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     // ✅ FIX: remove "Bearer "
//     const token = authHeader.split(" ")[1];

//     console.log("token after split:", token);

//     const verifyToken = jwt.verify(token, SECRET_KEY);

//     const rootUser = await userDB.findOne({ _id: verifyToken._id });

//     if (!rootUser) {
//       throw new Error("User not found");
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.log("Middleware error:", error);
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };

// const userMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     console.log('token in middeleware is', token);

//     if (!authHeader) {
//       return res.status(401).json({ error: "No token provided" });
//     }


//     const verifyToken = jwt.verify(token, SECRET_KEY);
//     console.log('verify token is', verifyToken);

//     const rootUser = await userDB.findOne({ _id: verifyToken._id });
//     console.log('root user is', rootUser);


//     if (!rootUser) { throw new Error("user not found") }

//     req.token = token
//     req.rootUser = rootUser
//     req.userId = rootUser._id
//     req.userMainId = rootUser.id

//     next();

//   } catch (error) {
//     res.status(400).json({ error: "Unauthorized No token Provide" })
//   }
// }

// module.exports = userMiddleware;