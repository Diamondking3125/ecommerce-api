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
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: "Status must be either Pending, Confirmed, Shipped, Delivered, or Cancelled",
      },
      default: "pending",
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "Street is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      required: [true, "Shipping Adress is required"]
    },
  },
  { timestamps: true },
);

orderSchema.statics.generateOrderNumber = function () {
  return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

orderSchema.methods.updateStatus = function (status) {
    this.status = status;
};

orderSchema.statics.calculateTotal = function (items) {
    return items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
};

Order = mongoose.model("Order", orderSchema);
module.exports = Order;