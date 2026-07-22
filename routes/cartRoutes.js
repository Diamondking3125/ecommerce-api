const express = require("express");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.get("/", cartController.getCart);
router.delete("/", cartController.clearCart);

router.post("/items", cartController.addItemToCart);
router.patch("/items/:productId", cartController.updateCartItem);
router.delete("/items/:productId", cartController.removeCartItem);

router.post("/checkout", orderController.checkout);

module.exports = router;
