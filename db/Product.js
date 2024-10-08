const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  productPrice: String,
  productCategory: String,
  userId: String,
  productCompany: String,
});

module.exports = mongoose.model("products", productSchema);
