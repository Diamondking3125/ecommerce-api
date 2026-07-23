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
    name: "Clothing",
    description: "A wide range of wear for casual, formal and sports",
    slug: "clothing",
  },
  {
    name: "Home & Living",
    description: "Home appliances for a comfortable living",
    slug: "home-living",
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
        name: "Iphone 14",
        description: "Flagship smartphone with elite display specs",
        price: 799,
        stock: 10,
        category: createdCategories[0]._id,
        images: ["Iphone 14.png"],
      },
      {
        name: "Dell Laptop",
        description: "Laptop with premium display and specs",
        price: 999,
        stock: 7,
        category: createdCategories[0]._id,
        images: ["Dell Laptop.png"],
      },
      {
        name: "Men T-Shirt",
        description:
          "A T-Shirt for men",
        price: 19,
        stock: 25,
        category: createdCategories[1]._id,
        images: ["Men T-Shirt.png"],
      },
      {
        name: "Blue Jeans",
        description: "A casual blue jeans",
        price: 49,
        stock: 15,
        category: createdCategories[1]._id,
        images: ["Blue Jeans.png"],
      },
      {
        name: "Sofa",
        description: "A comfortable place to sit",
        price: 299,
        stock: 5,
        category: createdCategories[2]._id,
        images: ["Sofa.png"],
      },
      {
        name: "Table Lamp",
        description: "A lamp with strong, and comfortable light designed for tables",
        price: 29,
        stock: 20,
        category: createdCategories[2]._id,
        images: ["Table Lamp.png"],
      }
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
