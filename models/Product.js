const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      minlength: [3, "Product name must be at least 3 characters long"]
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be less than 0"],
      max: [99999, "Price cannot exceed 99999"]
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a valid category"]
    },
    images: [{
      type: String
    }],
    inStock: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.inStock = this.stock > 0;
  next();
});

module.exports = mongoose.model("Product", productSchema);