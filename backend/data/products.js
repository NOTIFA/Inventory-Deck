// In-memory "database" for products.
// Replace this with a real database (MongoDB, PostgreSQL, etc.) in production.

let products = [
  { id: 1, name: "Yamaha Keyboard", price: 19.99, quantity: 50 },
  { id: 2, name: "Fender Bass Guitar", price: 59.99, quantity: 30 },
  { id: 3, name: "Montage Synthesizer", price: 24.99, quantity: 7 },
  { id: 4, name: "Bellringher Bass combo", price: 50.99, quantity: 2 },
  { id: 5, name: "JBL Speaker", price: 30.99, quantity: 5 },
  { id: 6, name: "Double UW subwoofer", price: 84.99, quantity: 4 },
  { id: 7, name: "2b Drumsticks", price: 64.99, quantity: 50 },
  { id: 8, name: "Premier Saxophone", price: 30.99, quantity: 75 },
  { id: 9, name: "Climax Trumpet", price: 12.99, quantity: 73 },
  { id: 10, name: "Shure Microphone", price: 56.99, quantity: 35 },
  { id: 11, name: "Conga Drums", price: 34.99, quantity: 15 },
];

let nextId = 12;

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
