const productStore = require("../data/products");
const { ApiError } = require("../middleware/errorHandler");

// Basic validation for create/update payloads.
function validateProductInput(body, { partial = false } = {}) {
  const { name, price, quantity } = body;

  if (!partial || name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new ApiError(400, "Field 'name' is required and must be a non-empty string.");
    }
  }

  if (!partial || price !== undefined) {
    if (typeof price !== "number" || price < 0) {
      throw new ApiError(400, "Field 'price' is required and must be a non-negative number.");
    }
  }

  if (!partial || quantity !== undefined) {
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 0) {
      throw new ApiError(400, "Field 'quantity' is required and must be a non-negative integer.");
    }
  }
}

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Product id must be a positive integer.");
  }
  return id;
}

// GET /api/products
exports.getAllProducts = (req, res) => {
  res.status(200).json({ success: true, data: productStore.getAll() });
};

// GET /api/products/:id
exports.getProductById = (req, res) => {
  const id = parseId(req.params.id);
  const product = productStore.getById(id);

  if (!product) {
    throw new ApiError(404, `Product with id ${id} not found.`);
  }

  res.status(200).json({ success: true, data: product });
};

// POST /api/products
exports.createProduct = (req, res) => {
  validateProductInput(req.body);
  const newProduct = productStore.create(req.body);
  res.status(201).json({ success: true, data: newProduct });
};

// PUT /api/products/:id  (full or partial update)
exports.updateProduct = (req, res) => {
  const id = parseId(req.params.id);
  validateProductInput(req.body, { partial: true });

  const updated = productStore.update(id, req.body);
  if (!updated) {
    throw new ApiError(404, `Product with id ${id} not found.`);
  }

  res.status(200).json({ success: true, data: updated });
};

// DELETE /api/products/:id
exports.deleteProduct = (req, res) => {
  const id = parseId(req.params.id);
  const wasDeleted = productStore.remove(id);

  if (!wasDeleted) {
    throw new ApiError(404, `Product with id ${id} not found.`);
  }

  res.status(200).json({ success: true, message: `Product ${id} deleted.` });
};
