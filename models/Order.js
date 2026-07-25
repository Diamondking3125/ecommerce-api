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
        values: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        message: "Status must be either Pending, Confirmed, Shipped, Delivered, or Cancelled",
      },
      default: "Pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      country: String,
    },
  },
  { timestamps: true },
);

Order = mongoose.model("Order", orderSchema);
module.exports = Order;