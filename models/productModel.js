const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "men's clothing",
      "women's clothing",
      "jewelery",
      "electronics"
    ]
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: ratingSchema,
    required: true
  }
}, {
  timestamps: true
});

const productDB = mongoose.model("products", productSchema);

module.exports = productDB;