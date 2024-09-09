const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  owner: String,
  name: String,
  image: String,
  description: String,
  points: Number,
  price: Number,
});

module.exports = mongoose.model("product", productSchema);
