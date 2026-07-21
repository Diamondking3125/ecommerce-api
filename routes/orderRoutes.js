const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
