const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"]
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);