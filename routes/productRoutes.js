const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.post("/bulk", productController.bulkCreateProducts);

module.exports = router;
