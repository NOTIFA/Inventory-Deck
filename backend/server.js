const express = require("express");
const productRoutes = require("./routes/products");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies.
app.use(express.json());

// Allow the frontend (served from a different origin/port, e.g. Live Server on :5500)
// to call this API. For a real production app, restrict this to your actual frontend domain.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Simple request logger.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Simple REST API is running.",
    endpoints: {
      "GET /api/products": "List all products",
      "GET /api/products/:id": "Get a single product",
      "POST /api/products": "Create a product",
      "PUT /api/products/:id": "Update a product",
      "DELETE /api/products/:id": "Delete a product",
    },
  });
});

// API routes.
app.use("/api/products", productRoutes);

// 404 handler for unmatched routes.
app.use(notFound);

// Centralized error handler (must be registered last).
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
