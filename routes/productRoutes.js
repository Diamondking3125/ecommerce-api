const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.post("/bulk", productController.bulkCreateProducts);

router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
