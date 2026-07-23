const Category =     require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError =     require("../utils/AppError");
const ok =           require('../utils/ok');

const createCategory = asyncHandler(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  ok(res, newCategory, "Category created successfully", 201);
});

const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  ok(res, categories, "Categories fetched successfully");
});

const getOneCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));

  ok(res, category, "Category fetched successfully");
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!updatedCategory) return next(new AppError("Category not found", 404));
  
  ok(res, updatedCategory, "Category updated successfully");
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));
  ok(res, null, "Category deleted successfully");
});

module.exports = {
  createCategory,
  getAllCategories,
  getOneCategorys,
  updateCategory,
  deleteCategory,
};
