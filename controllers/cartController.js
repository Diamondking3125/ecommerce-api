const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const checkout = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) return next(new AppError('Shipping address details must be provided', 400));

  const cart = await Cart.findOne().populate('items.product');
  if (!cart || cart.items.length === 0) return next(new AppError('Your shopping cart is currently empty', 400));

  for (const item of cart.items) {
    if (!item.product) return next(new AppError('One of the products in your cart no longer exists.', 404));
    if (item.product.stock < item.quantity) {
      return next(new AppError(`Product "${item.product.name}" is out of stock or quantity mismatch.`, 400));
    }
  }

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity
  }));

  const totalPrice = cart.totalPrice;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    item.product.inStock = item.product.stock > 0;
    await item.product.save();
  }

  const newOrder = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice,
    shippingAddress,
    status: 'Pending'
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: 'success', message: 'Order generated successfully', data: newOrder });
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({ status: 'success', count: orders.length, data: orders });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order identifier record not found', 404));
  res.status(200).json({ status: 'success', data: order });
});

const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order target element could not be verified', 404));

  order.status = status;
  await order.save();

  res.status(200).json({ status: 'success', message: 'Status property modified successfully', data: order });
});

module.exports = {
  checkout,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};