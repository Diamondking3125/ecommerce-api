const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        message: "Status must be either Pending, Processing, Shipped, Delivered, or Cancelled",
      },
      default: "Pending",
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
    },
  },
  { timestamps: true },
);

Order = mongoose.model("Order", orderSchema);
module.exports = Order;