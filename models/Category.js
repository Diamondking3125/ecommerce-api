const mongoose = require("mongoose");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
}

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
      required: false,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

categorySchema.pre("slug", function (next) {
  if (!this.isModified('title')) {
    return next();
  }

  this.slug = slugify(this.title);
  next();
});

Category = mongoose.model("Category", categorySchema);

module.exports = Category