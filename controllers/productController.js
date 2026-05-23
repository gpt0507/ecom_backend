const productDB = require("../models/productModel");
const cloudinary = require("../Cloudinary/cloudinary");

const getAllProductsController = async (req, res) => {
  // console.log("all product request received from user");

  try {
    const products = await productDB.find();

    res.status(200).json(products);

  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


const getSingleProductController = async (req, res) => {
  // console.log("single product request received from user");

  try {
    const { id } = req.params;
    const product = await productDB.findOne({ id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};



// ADD PRODUCT
const addProductController = async (req, res) => {
  try {
    // console.log('product controller called\n add product api called')
    // console.log('request body is', req.body)
    // console.log('request file is', req.file)
    // res.send('product inserted successfully');

    const { id, title, price, description, category, rate, count } = req.body;


    // validation
    if (!id || !title || !price || !description || !category || !rate || !count || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }


    // cloudinary upload
    const filePath = req.file?.path;
    const uploadedImage = await cloudinary.uploader.upload(filePath);


    // console.log('file path is', filePath)
    // console.log("upload url is", uploadedImage.url)
    // res.send('product inserted successfully');


    // save in DB
    const newProduct = new productDB({
      id,
      title,
      price,
      description,
      category,
      image: uploadedImage.secure_url,
      rating: { rate, count }
    });

    await newProduct.save();

    res.status(201).json({ message: "Product Added Successfully", product: newProduct });
  } catch (error) {

    // console.log("FULL ERROR => ", error);
    res.status(500).json({ success: false, message: error.message, error });
  }
};


// module.exports = { getAllProductsController, getSingleProductController };
module.exports = { getAllProductsController, getSingleProductController, addProductController };




// const data = require('../utils/data.json')
// const getAllProductsController = async (req, res) => {
//   console.log("all product request recieved from user")



//   res.send(data)

// }

// const getSingleProductController = async (req, res) => {
//   console.log("single product request recieved from user")

//   const { id } = req.params
//   const singleProduct = data.find(product => product.id == id)

//   res.send(singleProduct)


// }


// module.exports = { getAllProductsController, getSingleProductController }