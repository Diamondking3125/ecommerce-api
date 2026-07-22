const Product =      require("../models/Product");
const Category =     require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const AppError =     require("../utils/AppError");
const ok =           require('../utils/ok');

const createProduct = asyncHandler(async (req, res, next) => {
  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) return next(new AppError("Category not found", 404));
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Product created",
    data: newProduct,
  });
});

const bulkCreateProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.insertMany(req.body.products);
  res.status(201).json({
    status: "success",
    message: `${products.length} products created`,
    data: products,
  });
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice } = req.query;
  const filter = {};
  if (category)  filter.category = category;
  if (minPrice)  filter.price = { $gte: Number(minPrice) };
  if (maxPrice)  filter.price = { $lte: Number(maxPrice) };
  const products = await Product.find(filter).sort({ createdAt: -1 }).select('-__v');
  ok(res, products, 'Products fetched successfully');
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description",
  );
  if (!product) return next(new AppError("Product not found", 404));
 ok(res, product, "Product found");
});

const updateProduct = asyncHandler(async(req, res, next) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!updated) return next(new AppError("Product not found", 404));

  ok(res, updated, "Product updated successfully");
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  ok(res, null, "Product deleted")
});

module.exports = {
  createProduct,
  bulkCreateProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
