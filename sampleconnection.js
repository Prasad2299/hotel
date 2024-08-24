//mongoose npm package which is used to connect node with mongodb database
const express = require("express");
require("./db/config");
const mongoose = require("mongoose");
const app = express();

const connectDB = async () => {
  mongoose.connect("mongodb://localhost:27017/e-commerce");
  const productSchema = new mongoose.Schema({});
  const product = mongoose.model("users", productSchema);
  const data = await product.find();
  console.log("results==>", data);
};
connectDB();
app.listen(4000);

//SignUp API
//Make db and collection
//make config file
//make model
//make route for api
//test api with postman
