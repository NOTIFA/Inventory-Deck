# Simple REST API

A small Express.js REST API demonstrating full CRUD (Create, Read, Update, Delete) on a `products` resource, with input validation and centralized error handling.

## Project structure

```
simple-rest-api/
├── server.js                     # App entry point, middleware, listens on PORT
├── routes/products.js            # Maps HTTP verbs + paths to controller functions
├── controllers/productController.js  # Business logic + validation for each route
├── data/products.js              # In-memory data store (swap for a real DB later)
├── middleware/errorHandler.js    # ApiError class + centralized error/404 handling
└── package.json
```

## Setup

```bash
npm install
npm start          # or: npm run dev  (auto-restarts with nodemon)
```

The server runs on `http://localhost:3000` by default (override with `PORT` env var).

## Endpoints

| Method | Path                 | Description          | Body (JSON)                              |
|--------|----------------------|-----------------------|-------------------------------------------|
| GET    | `/api/products`      | List all products     | –                                          |
| GET    | `/api/products/:id`  | Get one product       | –                                          |
| POST   | `/api/products`      | Create a product      | `{ "name": "...", "price": 0, "quantity": 0 }` |
| PUT    | `/api/products/:id`  | Update a product      | Any subset of `name`, `price`, `quantity`  |
| DELETE | `/api/products/:id`  | Delete a product      | –                                          |

All responses follow the shape `{ "success": true/false, "data" | "error": ... }`.

### HTTP status codes used

- `200` – successful GET / PUT / DELETE
- `201` – successful POST (resource created)
- `400` – invalid input (e.g., missing `name`, negative `price`, non-integer id)
- `404` – product or route not found
- `500` – unexpected server error

## Testing with Postman or Thunder Client

1. Import/create a new request collection pointed at `http://localhost:3000`.
2. Try each endpoint:
   - **GET** `http://localhost:3000/api/products`
   - **GET** `http://localhost:3000/api/products/1`
   - **POST** `http://localhost:3000/api/products` with body (raw JSON):
     ```json
     { "name": "Webcam", "price": 45.50, "quantity": 10 }
     ```
   - **PUT** `http://localhost:3000/api/products/2` with body:
     ```json
     { "price": 49.99 }
     ```
   - **DELETE** `http://localhost:3000/api/products/3`
3. Try an invalid payload (e.g., `{ "name": "" }`) to confirm you get a `400` with a helpful error message.
4. Try a non-existent id (e.g., `GET /api/products/999`) to confirm a `404`.

You can also use `curl`:

```bash
curl http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam","price":45.5,"quantity":10}'
```

## Notes

- Data is stored **in memory** and resets whenever the server restarts. Swap `data/products.js` for a real database (MongoDB, PostgreSQL, etc.) when you're ready to persist data.
- Validation lives in `controllers/productController.js` — extend it if you add more fields.
- Errors are thrown as `ApiError(statusCode, message)` and automatically caught by Express's synchronous error handling, then formatted by `middleware/errorHandler.js`.
