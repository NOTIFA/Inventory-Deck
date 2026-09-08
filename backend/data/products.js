// In-memory "database" for products.
// Replace this with a real database (MongoDB, PostgreSQL, etc.) in production.

let products = [
  { id: 1, name: "Wireless Mouse", price: 19.99, quantity: 50 },
  { id: 2, name: "Mechanical Keyboard", price: 59.99, quantity: 30 },
  { id: 3, name: "USB-C Hub", price: 24.99, quantity: 75 },
];

let nextId = 4;

module.exports = {
  getAll: () => products,
  getById: (id) => products.find((p) => p.id === id),
  create: (data) => {
    const newProduct = { id: nextId++, ...data };
    products.push(newProduct);
    return newProduct;
  },
  update: (id, data) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id };
    return products[index];
  },
  remove: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};
