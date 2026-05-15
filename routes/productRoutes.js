const express = require("express");
const { getAllProductsController, getSingleProductController } = require("../controllers/productController");
const router = new express.Router();

router.get("/getallproducts", getAllProductsController);
router.get("/getsingleproduct/:id", getSingleProductController);
// router.post("/addproduct", addProductController);


module.exports = router
