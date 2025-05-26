// Setup the dependencies
const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const orderController = require("../controllers/orderController");

// Checkout route
router.post("/checkout", verify, orderController.checkout);

// Get orders for the logged-in user
router.get("/my-orders", verify, orderController.getMyOrders);

// Get all orders (admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// Update order status (admin only)
// PATCH /orders/:orderId/status  with { status: "pending"|"on_delivery"|"completed"|"cancelled" }
router.patch("/:orderId/status", verify, verifyAdmin, orderController.updateOrderStatus);

module.exports = router;