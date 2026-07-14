require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce-api",
};

module.exports = config;
