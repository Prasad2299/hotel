const mongoose = require("mongoose");
const mongodburl = process.env.MONGODB_URL;
mongoose.connect(mongodburl);
