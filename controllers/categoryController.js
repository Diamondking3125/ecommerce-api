const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return next(new AppError(`${field} already exists`, 400));
    }
    return next(new AppError("Error creating category", 500));
  }
});

const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ status: "success", data: categories });
});

const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));
  res.status(200).json({ status: "success", data: category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!updatedCategory) return next(new AppError("Category not found", 404));
  res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError("Category not found", 404));
  res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      data: null,
    });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
