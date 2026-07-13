require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./db/connect");

const Category = require("./models/Category");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

const categories = [
  {
    name: "Electronics",
    description: "Gadgets, devices and smart appliances",
    slug: "electronics",
  },
  {
    name: "Books",
    description: "Educational and fictional literature media books",
    slug: "books",
  },
  {
    name: "Apparel",
    description: "Clothing line outfits garments items",
    slug: "apparel",
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log("Cleaning collections...");
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Collections cleared.");

    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories successfully.`);

    const products = await Product.insertMany([
      {
        name: "Smartphone Pro Max",
        description: "Flagship smartphone with elite display specs",
        price: 999.99,
        stock: 15,
        category: createdCategories[0]._id,
        images: ["phone.png"],
      },
      {
        name: "Wireless Audio Earbuds",
        description: "Noise cancelling Bluetooth earbuds",
        price: 149.99,
        stock: 40,
        category: createdCategories[0]._id,
        images: ["earbuds.png"],
      },
      {
        name: "Data Structures Textbook",
        description:
          "Comprehensive guide to mastering computer science algorithms",
        price: 59.99,
        stock: 12,
        category: createdCategories[1]._id,
        images: ["dsa_book.png"],
      },
      {
        name: "Premium Cotton Hoodie",
        description: "Heavyweight oversized casual wear styling garment",
        price: 65.0,
        stock: 25,
        category: createdCategories[2]._id,
        images: ["hoodie.png"],
      },
      {
        name: "Athletic Running Sneakers",
        description: "Performance foam tech footwear",
        price: 120.0,
        stock: 0,
        category: createdCategories[2]._id,
        images: ["sneakers.png"],
      },
    ]);
    console.log(`Seeded ${products.length} products successfully.`);

    console.log("Seeding completed!");
  } catch (err) {
    console.error("Seed failed: ", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Mongoose disconnected safely.");
    process.exit(0);
  }
};

seed();
