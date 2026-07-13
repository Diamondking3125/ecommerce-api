require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Category = require("./models/Category");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

const categories = [
  { name: "Electronics" },
  { name: "Books" },
  { name: "Clothes" },
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

    const products = [
      {
        name: "Smartphone",
        description: "Flagship smart phone with elite display unit specs",
        price: 999.99,
        stock: 15,
        category:createdCategories[0]._id,
      },
      {
        name: "Wireless Audio Earbuds",
        description: "Noise cancelling deep bass Bluetooth system sound core",
        price: 149.99,
        stock: 40,
        category:createdCategories[0]._id,
      },
      {
        name: "Data Structures and Algorithms Textbook",
        description: "A guide to mastering computer science algorithms",
        price: 59.99,
        stock: 12,
        category:createdCategories[1]._id,
      },
      {
        name: "Science Fiction Novel",
        description: "Epic space odyssey bestselling literature entry",
        price: 14.99,
        stock: 8,
        category:createdCategories[1]._id,
      },
      {
        name: "Premium Hoodie",
        description: "Heavyweight oversized casual wear styling garment",
        price: 65.0,
        stock: 25,
        category:createdCategories[2]._id,
      },
      {
        name: "Athletic Sneakers",
        description: "Foam tech footwear for outdoor sports trainers",
        price: 120.0,
        stock: 0,
        category:createdCategories[2]._id,
      },
    ];

    const products = await Product.insertMany(products);
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
