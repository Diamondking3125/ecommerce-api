const Cart =         require('../models/Cart');
const Product =      require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError =     require('../utils/AppError');
const ok =           require('../utils/ok');

const recalculateCart = (cart) => {
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
};

const getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate('items.product', 'name price image stock inStock');
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }
  ok(res, cart, "Cart fetched successfully");
});

const addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));
  if (product.stock < quantity) return next(new AppError('Insufficient items in stock', 400));

  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [], totalPrice: 0 });

  const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQty) return next(new AppError('Cannot add more items than available stock', 400));
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  recalculateCart(cart);
  await cart.save();
  ok(res, cart, "Item added to cart successfully");
});

const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) return next(new AppError('Quantity must be greater than 0', 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError('Product matching items not found', 404));
  if (product.stock < quantity) return next(new AppError('Requested quantity exceeds available stock', 400));

  const cart = await Cart.findOne();
  if (!cart) return next(new AppError('Cart dynamic session not found', 404));

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) return next(new AppError('Item not found in current cart context', 404));

  cart.items[itemIndex].quantity = quantity;
  recalculateCart(cart);
  await cart.save();

  ok(res, cart, "Cart Item updated successfully");
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