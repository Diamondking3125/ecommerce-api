require("dotenv").config();

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const config = require("./config/config");
const connectDB = require("./db/connect");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");

const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");

const app = express();

app.use(express.json());
app.use(mongoSanitize());

app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
