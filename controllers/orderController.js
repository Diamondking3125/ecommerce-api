const Order =        require('../models/Order');
const Cart =         require('../models/Cart');
const Product =      require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError =     require('../utils/AppError');
const ok =           require('../utils/ok');

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne().populate('items.product');
  if (!cart || cart.items.length === 0) return next(new AppError('Your shopping cart is currently empty', 400));

  validateStock(cart);

  const orderItems = buildOrderItems(cart);

  const order = await Order.create({
    orderNumber: Order.generateOrderNumber(),
    items: orderItems,
    totalPrice: Order.calculateTotal(orderItems),
    shippingAddress,
    status: 'pending',
  });

  ok(res, order, 'Order created successfully', 201);
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate("items.product", "name price");;
  ok(res, orders, "Orders fetched successfully");
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("items.product", "name price");
  if (!order) return next(new AppError('Order identifier record not found', 404));

  ok(res, order, "Order fetched successfully");
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order target element could not be verified', 404));

  order.updateStatus(status);
  await order.save();

 ok(res, order, 'Status property modified successfully');
});

exports.checkout = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return next(new AppError("Order not found", 404));

  if (order.status !== "pending")
    return next(new AppError("Order has already been checked out", 400));

  const cart = await Cart.findOne().populate("items.product");

  validateStock(cart);

  await updateStock(cart);

  cart.clear();
  await cart.save();

  order.status = "confirmed";
  await order.save();

  ok(res, order, "Checkout completed successfully");
});

function buildOrderItems(cart) {
  return cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));
}

function validateStock(cart) {
  for (const item of cart.items) {
    if (!item.product)
      throw new AppError("One of the products in your cart no longer exists.", 404);

    if (item.product.stock < item.quantity)
      throw new AppError(`Product "${item.product.name}" only has ${item.product.stock} items available in stock.`,400);
  }
}

async function updateStock(cart) {
  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    item.product.inStock = item.product.stock > 0;
    await item.product.save();
  }
}
