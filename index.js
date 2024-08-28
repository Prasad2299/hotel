//mongoose npm package which is used to connect node with mongodb database
const express = require("express");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
require("./db/config");
const User = require("./db/User");
const product = require("./db/Product");
const Product = require("./db/Product");
require("dotenv").config();
const app = express();
app.use(express.json()); //middleware use to access json data sent by postman or react application
app.use(cors());
const Jwtkey = process.env.Jwtkey;
const PORT = process.env.PORT || 4000;

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.log("middleware is calling", token);
    jsonwebtoken.verify(token, Jwtkey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "pleaser provide valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "pleaser provide token with headers" });
  }
};

app.get("/",(req,res)=>{
  console.log("API IS WORKING FINE");
  res.send("API IS WORKING FINE");
});
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jsonwebtoken.sign({ result }, Jwtkey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send("something went wrong,try after some time!");
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jsonwebtoken.sign({ user }, Jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send("something went wrong ,please try after sometime!");
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No user Found!" });
    }
  } else {
    res.send("No user Found");
  }
});

app.post("/add-product", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  console.log("product added==>", result);
  res.send(result);
});

app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find({});
  if (products.length > 0) {
    console.log("product==", products);
    res.send(products);
  } else {
    res.send({ result: "no products found" });
  }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
  let deleteData = await Product.deleteOne({ _id: req.params.id });
  res.send(deleteData);
});

app.get("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.find({ _id: req.params.id });
  console.log(result);
  res.send(result);
});

app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  console.log(result);
  if (result) {
    res.send(result);
  }
});

app.get("/search/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { productName: { $regex: req.params.key } },
      { productPrice: { $regex: req.params.key } },
      { productCompany: { $regex: req.params.key } },
      { productCategory: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

app.listen(PORT, () => {
  console.log("server started on port-=>", PORT);
});
