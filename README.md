# E-Commerce Backend API Platform

A RESTful E-Commerce API built with Node.js, Express.js, MongoDB, and Mongoose. It provides endpoints for managing categories, products, shopping carts, and customer orders with stock validation and checkout functionality.

---

## Features

- Categories API (CRUD operations)
- Products API (CRUD operations)
- Shopping Cart API
- Orders API
- Checkout with stock validation
- Dynamic product filtering
- Global error handling
- Custom response helpers
- MongoDB aggregation pipelines
- Request validation

---

## Technology
* **Runtime Engine:** Node.js
* **Application Framework:** Express.js
* **Database Layer:** MongoDB Engine
* **Object Data Modeling Interface:** Mongoose ODM

---

## Prerequisites & Local Installation

### Prerequisites
* Ensure **Node.js (v16+)** and **npm** are installed on your workstation.
* A running local instance of **MongoDB Community Server** or connection access to an Atlas Cloud Cluster string.

### Step-by-Step Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Diamondking3125/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the required environment variables.

### Example .env

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. Start the development server

   ```bash
   npm run dev
   ```

> **Tip:** A Postman Collection and Environment are included in the `postman/` directory to simplify API testing.
---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `NODE_ENV` | Application environment (`development` or `production`) |
| `MONGO_URI` | MongoDB connection string |

---

## Base URL

```text
http://localhost:3000/api
```

All API endpoints in this document are relative to the following base URL::

> **Note:** A Postman Collection and Environment are included in the `postman/` directory for testing all endpoints.

---

## API Endpoints

### Categories
| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/categories` | Retrieve all categories. |
| GET | `/categories/:id` | Retrieve a category by its ID. |
| POST | `/categories` | Create a new category. |
| PUT | `/categories/:id` | Update an existing category. |
| DELETE | `/categories/:id` | Delete a category. |

### Products
| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/products` | Retrieve all products. |
| GET | `/products/:id` | Retrieve a product by its ID. |
| POST | `/products` | Create a new product. |
| POST | `/products/bulk` | Create multiple products in a single request. |
| PUT | `/products/:id` | Update an existing product. |
| DELETE | `/products/:id` | Delete a product. |

### Cart
| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/cart` | Retrieve the current shopping cart. |
| POST | `/cart` | Add a product to the shopping cart. |
| PUT | `/cart/:productId` | Update the quantity of a product in the shopping cart. |
| DELETE | `/cart/:productId` | Remove a product from the shopping cart. |
| DELETE | `/cart` | Remove all products from the shopping cart. |

### Orders
| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/orders` | Retrieve all orders. |
| GET | `/orders/:id` | Retrieve an order by its ID. |
| POST | `/orders` | Create a new order from the current shopping cart. |
| POST | `/orders/:id/checkout` | Complete the checkout process for a pending order. |
| PATCH | `/orders/:id/status` | Update the status of an existing order. |

---

## Project Structure
```text
.
├── config/
├── controllers/
├── db/
├── middleware/
├── models/
├── postman/
├── routes/
├── utils/
├── app.js
├── seed.js
└── package.json
```

### Folder Descriptions

- **config/** — Contains application and server configuration.
- **controllers/** — Contains request handlers and business logic.
- **db/** — Contains database connection logic.
- **middleware/** — Contains custom middleware (error handling, validation, etc.).
- **models/** — Contains all Mongoose schemas.
- **routes/** — Defines API routes.
- **utils/** — Shared helper functions.
- **postman/** — Contains the exported Postman collection and environment.
- **app.js** — Configures the Express application, middleware, and routes.
- **seed.js** — Seeds the database with sample data.
- **package.json** — Contains project metadata and dependencies.

---

## Postman

The project includes a Postman Collection and Environment inside the `postman/` folder.

Import both files into Postman to test the API quickly.

---
