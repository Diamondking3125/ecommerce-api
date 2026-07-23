const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);

router.get("/:id", productController.getOneProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

router.post("/bulk", productController.bulkCreateProducts);

module.exports = router;
