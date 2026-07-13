const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ status: "success", message: "Cart route is available" });
});

router.route("/checkout").post(cartController.checkout);

module.exports = router;
