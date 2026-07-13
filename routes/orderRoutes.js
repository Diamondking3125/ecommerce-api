const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router
  .route("/")
  .post(orderController.checkout)
  .get(orderController.getAllOrders);

router.route("/:id")
  .get(orderController.getOrderById);

router.route("/:id/status")
  .patch(orderController.updateOrderStatus);

module.exports = router;
