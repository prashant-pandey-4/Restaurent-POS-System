const Order = require("../models/OrderModel");
const MenuItem = require("../models/MenuItem");

exports.placeOrder = async (req, res) => {
  const {
    cartItems,
    subTotal,
    tax,
    totalAmount,
    paymentDetails = null,
    status = "Pending",
    tableNumber = "N/A",
  } = req.body;

  if (!cartItems || !totalAmount || !subTotal) {
    return res.status(400).json({
      success: false,
      message: "Missing required order details (cartItems, subTotal, totalAmount).",
    });
  }

  const itemsForModel = cartItems.map((item) => ({
    menuItemId: item.menuItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  try {
    const newOrder = await Order.create({
      items: itemsForModel,
      tableNumber: tableNumber,
      subTotal: subTotal,
      tax: tax,
      totalAmount: totalAmount,
      status,
      paymentDetails,
      orderTime: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: `Order Placed Successfully! Status: ${status}`,
      order: newOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save final order to database",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status, paymentDetails } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ 
      success: false, 
      message: "New status is required." 
    });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found." 
      });
    }

    order.status = status;

    if (paymentDetails) {
      order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order ${id.substring(18)} status updated to ${status}.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};

exports.getActiveOrders = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      status: { $in: ["Pending", "Processing", "Served", "Paid"] },
    })
      .sort({ orderTime: -1 })
      .limit(50);

    res.status(200).json(activeOrders);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch active orders", 
      error: error.message 
    });
  }
};