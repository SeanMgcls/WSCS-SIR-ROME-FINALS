const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const Cart = require("../models/Cart");

/**
 * Checkout: Converts cart to order, clears cart.
 */
module.exports.checkout = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart || cart.cartItems.length < 1) {
                return res.status(404).send({ error: "No Items to Checkout" });
            }

            let newOrder = new Order({
                userId: req.user.id,
                productsOrdered: cart.cartItems,
                totalPrice: cart.totalPrice,
                status: "pending" // Set default status on creation
            });

            // Remove cart and create order
            Cart.findByIdAndDelete(cart._id.toString())
                .then(() => {
                    newOrder.save()
                        .then(() => res.status(201).send(true))
                        .catch(err => res.status(500).send({ error: "Internal Server Error", details: err }));
                });
        })
        .catch(err => res.status(500).send({ error: "Internal Server Error", details: err }));
};

/**
 * Get orders for the current user.
 */
module.exports.getMyOrders = (req, res) => {
    return Order.find({ userId: req.user.id })
        .then(orders => {
            if (orders.length > 0) {
                return res.status(200).send({ orders });
            } else {
                return res.status(404).send({ error: "No Orders Found" });
            }
        })
        .catch(err => res.status(500).send({ message: "Error in Find", details: err }));
};

/**
 * Get all orders (admin).
 */
module.exports.getAllOrders = (req, res) => {
    return Order.find()
        .then(orders => res.status(200).send({ orders }))
        .catch(err => res.status(500).send({ message: "Error in Find", details: err }));
};

/**
 * Update order status (admin).
 * PATCH /orders/:orderId/status
 * Expects { status: "pending" | "on_delivery" | "completed" | "cancelled" }
 */
module.exports.updateOrderStatus = (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "on_delivery", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).send({ error: "Invalid status provided" });
    }

    Order.findByIdAndUpdate(orderId, { status }, { new: true })
        .then(order => {
            if (!order) {
                return res.status(404).send({ error: "Order not found" });
            }
            return res.status(200).send({ message: "Order status updated", order });
        })
        .catch(err => res.status(500).send({ error: "Internal Server Error", details: err }));
};