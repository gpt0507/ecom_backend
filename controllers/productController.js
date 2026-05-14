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

module.exports = { getAllProductsController, getSingleProductController }




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