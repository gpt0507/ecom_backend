const express = require("express");
const router = new express.Router();

const { registerUserController, loginUserController, logoutController, userverifyController, logoutAllController } = require("../controllers/userController");
const userUpload = require("../multerconfig/user/userStorageConfig");
const userMiddleware = require("../middleware/userMiddleware")


// user Auth Routes
router.post("/register", userUpload.single("userprofile"), registerUserController);
router.post("/login", loginUserController);

router.get("/userverify", userMiddleware, userverifyController);
router.get("/logout", userMiddleware, logoutController);
router.get("/logoutAll", userMiddleware, logoutAllController);


module.exports = router