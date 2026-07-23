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
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be less than 0"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
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