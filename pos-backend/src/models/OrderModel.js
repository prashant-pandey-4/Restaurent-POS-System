// pos-backend/src/models/OrderModel.js

const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  notes: { type: String }, 
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  tableNumber: { type: String, default: "N/A" },
  subTotal: { type: Number, required: true }, 
  tax: { type: Number, default: 0 }, 
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Paid", "Failed", "Pending", "Processing", "Completed"],
  },
  paymentDetails: { type: Object }, // Razorpay ka response (Optional)
  orderTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
