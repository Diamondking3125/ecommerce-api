const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Cart route is available" });
});

router.post("/checkout", cartController.checkout);

module.exports = router;
