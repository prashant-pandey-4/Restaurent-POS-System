// pos-backend/src/models/MenuItem.js

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },

  imageUrl: { type: String, default: "https://i.imgur.com/fallback.png" },
  isAvailable: { type: Boolean, default: true },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;
