const productDB = require("../models/productModel");

const getAllProductsController = async (req, res) => {
  console.log("all product request received from user");

  try {
    const products = await productDB.find();

    res.status(200).json(products);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


const getSingleProductController = async (req, res) => {
  console.log("single product request received from user");

  try {
    const { id } = req.params;
    const product = await productDB.findOne({ id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};



// // ADD PRODUCT
// const addProductController = async (req, res) => {
//   try {
//     const { id, title, price, description, category, image, rating } = req.body;
//     const newProduct = new productDB({ id, title, price, description, category, image, rating });
//     await newProduct.save();
//     res.status(201).json({ message: "Product Added Successfully", product: newProduct });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// };

module.exports = { getAllProductsController, getSingleProductController };
// module.exports = { getAllProductsController, getSingleProductController, addProductController };




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