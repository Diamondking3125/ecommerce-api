const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const clientMessage = err.isOperational
    ? message
    : "Something went wrong! Please try again later.";

  const body = {
    status: statusCode >= 500 ? "error" : "fail",
    statusCode,
    message: clientMessage,
    data: null,
  };

  if (process.env.NODE_ENV === "development") {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = errorHandler;