require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce-api",
};

module.exports = config;
