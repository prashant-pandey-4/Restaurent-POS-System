

const express = require("express");
const {
  placeOrder,

  updateOrderStatus,
  getActiveOrders,
} = require("../controllers/OrderController");

const router = express.Router();

router.route("/place").post(placeOrder);


router.route("/update-status/:id").put(updateOrderStatus);
router.route("/").get(getActiveOrders);

module.exports = router;
