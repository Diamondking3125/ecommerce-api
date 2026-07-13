const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const createProduct = asyncHandler(async (req, res, next) => {
  const categoryExists = await Category.findById(req.body.category);
  if (!categoryExists) return next(new AppError('Category not found', 404));

  const newProduct = await Product.create(req.body);
  res.status(201).json({ status: 'success', message: 'Product created', data: newProduct });
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let filters = JSON.parse(queryStr);

  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
    delete filters.search;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {};
    if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    delete filters.minPrice;
    delete filters.maxPrice;
  }
  if (req.query.inStock === 'true') {
    filters.inStock = true;
  }

  const products = await Product.find(filters);
  res.status(200).json({ status: 'success', count: products.length, data: products });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', data: product });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) return next(new AppError('Category not found', 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedProduct) return next(new AppError('Product not found', 404));

  updatedProduct.inStock = updatedProduct.stock > 0;
  await updatedProduct.save();

  res.status(200).json({ status: 'success', data: updatedProduct });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError('Product not found', 404));
  res.status(200).json({ status: 'success', message: 'Product deleted', data: null });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};