const express = require("express");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addItemToCart);
router.delete("/", cartController.clearCart);

router.patch("/:productId", cartController.updateCartItem);
router.delete("/:productId", cartController.removeCartItem);

router.post("/checkout", orderController.checkout);

module.exports = router;
