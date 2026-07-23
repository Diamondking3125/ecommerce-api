const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);

router.get("/:id", categoryController.getOneCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;