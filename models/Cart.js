const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"]
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

cartSchema.methods.recalculateTotal = function () {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
};

cartSchema.methods.addItem = function (product, quantity) {
  const existingIndex = this.items.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  if (existingIndex > -1) {
    const newQty = this.items[existingIndex].quantity + quantity;
    if (product.stock < newQty) throw new Error("Cannot add more items than available stock");
    this.items[existingIndex].quantity = newQty;
    this.items[existingIndex].price = product.price;
  } else {
    if (product.stock < quantity) throw new Error("Insufficient items in stock");
    this.items.push({ product: product._id, quantity, price: product.price });
  }

  this.recalculateTotal();
};


cartSchema.methods.updateItem = function (product, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    this.items.splice(itemIndex, 1);
  } else {
    if (product.stock < quantity) {
      throw new Error("Requested quantity exceeds available stock");
    }
    this.items[itemIndex].quantity = quantity;
    this.items[itemIndex].price = product.price;
  }

  this.recalculateTotal();
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;