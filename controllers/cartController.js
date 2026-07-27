const Cart =         require('../models/cart.model');
const Product =      require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError =     require('../utils/AppError');
const ok =           require('../utils/ok');

exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate('items.product', 'name price image stock inStock');
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  ok(res, cart, "Cart fetched successfully");
});

exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (!quantity) return next(new AppError("Quantity is required", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product is required', 404));
  if (product.stock <= 0) return next(new AppError('Product is out of stock', 400));

  let cart = (await Cart.findOne() || await Cart.create({ items: [], totalPrice: 0 }))

  try {
    cart.addItem(product, quantity);
    await cart.save();
    ok(res, cart, "Item added to cart successfully");
  } catch (err) {
    return next(new AppError(err.message, 400))
  }
});

exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('Cart dynamic session not found', 404));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));

  try {
    cart.updateItem(product, quantity);
    await cart.save();
    ok(res, cart, "Cart Item updated successfully");
  } catch (err) {
    return next(new AppError(err.message, 400))
  }
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('Cart entity matching not found', 404));

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  cart.recalculateTotal();
  await cart.save();

  ok(res, cart, "Removed cart item successfully");
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('cart not found', 404));

  cart.clear()
  await cart.save();


  ok(res, cart, 'Cart cleared successfully');
});
