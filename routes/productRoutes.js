const express = require("express");
const { getAllProductsController, getSingleProductController, addProductController } = require("../controllers/productController");
const productUpload = require("../multerconfig/products/productStorageConfig");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = new express.Router();

router.get("/getallproducts", getAllProductsController);
router.get("/getsingleproduct/:id", getSingleProductController);
router.post("/addproduct", adminMiddleware, productUpload.single("productimage"), addProductController);


module.exports = router
