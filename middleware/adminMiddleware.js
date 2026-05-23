const adminDB = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ADMIN_SECRET_KEY;

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // CHECK AUTH HEADER
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    // TOKEN EXTRACT
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    // VERIFY TOKEN
    const verifyToken = jwt.verify(token, SECRET_KEY);

    // FIND ADMIN
    const rootAdmin = await adminDB.findOne({ _id: verifyToken._id, "tokens.token": token });

    // ADMIN NOT FOUND
    if (!rootAdmin) {
      return res.status(401).json({ error: "Admin not found" });
    }

    // STORE DATA IN REQUEST
    req.token = token;
    req.rootAdmin = rootAdmin;
    req.adminId = rootAdmin._id;
    next();

  } catch (error) {
    // console.log("Middleware Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = adminMiddleware;