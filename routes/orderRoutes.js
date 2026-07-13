const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/", orderController.checkout);
router.get("/", orderController.getAllOrders);

router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
