const Cart =         require('../models/Cart');
const Product =      require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError =     require('../utils/AppError');
const ok =           require('../utils/ok');

const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate('items.product', 'name price image stock inStock');
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  ok(res, cart, "Cart fetched successfully");
});

const addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  if (!quantity || quantity < 0) return next(new AppError("Quantity must be a positive integer", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
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

const updateCartItem = asyncHandler(async (req, res, next) => {
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

const removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('Cart entity matching not found', 404));

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  recalculateCart(cart);
  await cart.save();

  ok(res, cart, "Removed cart item successfully");
});

const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('cart not found', 404));

  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  ok(res, cart, 'Cart cleared successfully');
});

module.exports = {
  getCart, 
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
}