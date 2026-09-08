const API_BASE = "http://localhost:3000";
const PRODUCTS_URL = `${API_BASE}/api/products`;

const rowsEl = document.getElementById("productRows");
const formEl = document.getElementById("productForm");
const submitBtn = document.getElementById("submitBtn");
const formMsgEl = document.getElementById("formMsg");
const refreshBtn = document.getElementById("refreshBtn");
const connDot = document.getElementById("connDot");
const connLabel = document.getElementById("connLabel");

let products = [];
let editingId = null;

// ---------- Formatting helpers ----------

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Connection status ----------

async function checkConnection() {
  try {
    const res = await fetch(API_BASE, { method: "GET" });
    if (!res.ok) throw new Error("Bad response");
    connDot.className = "conn-dot online";
    connLabel.textContent = "API connected";
    return true;
  } catch (err) {
    connDot.className = "conn-dot offline";
    connLabel.textContent = "API unreachable — is the server running?";
    return false;
  }
}

// ---------- Rendering ----------

function renderRows() {
  if (products.length === 0) {
    rowsEl.innerHTML = `<tr class="state-row"><td colspan="5">No entries on the ledger yet. Add one on the left.</td></tr>`;
    return;
  }

  rowsEl.innerHTML = products
    .map((p) => {
      if (editingId === p.id) {
        return `
          <tr data-id="${p.id}" class="editing">
            <td class="id-cell">${p.id}</td>
            <td><input type="text" class="edit-name" value="${escapeHtml(p.name)}"></td>
            <td class="num"><input type="number" class="edit-price" min="0" step="0.01" value="${p.price}"></td>
            <td class="num"><input type="number" class="edit-quantity" min="0" step="1" value="${p.quantity}"></td>
            <td class="actions-col">
              <div class="row-actions">
                <button type="button" class="save-btn" data-action="save" data-id="${p.id}">Save</button>
                <button type="button" class="cancel-btn" data-action="cancel" data-id="${p.id}">Cancel</button>
              </div>
            </td>
          </tr>`;
      }

      return `
        <tr data-id="${p.id}">
          <td class="id-cell">${p.id}</td>
          <td>${escapeHtml(p.name)}</td>
          <td class="num">${formatPrice(p.price)}</td>
          <td class="num">${p.quantity}</td>
          <td class="actions-col">
            <div class="row-actions">
              <button type="button" class="edit-btn" data-action="edit" data-id="${p.id}">Edit</button>
              <button type="button" class="delete-btn" data-action="delete" data-id="${p.id}">Delete</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

function showFormMessage(text, type) {
  formMsgEl.textContent = text;
  formMsgEl.className = `form-msg ${type || ""}`;
}

// ---------- Data loading ----------

async function loadProducts() {
  rowsEl.innerHTML = `<tr class="state-row"><td colspan="5">Loading ledger…</td></tr>`;

  const online = await checkConnection();
  if (!online) {
    rowsEl.innerHTML = `<tr class="state-row"><td colspan="5">Can't reach the API. Start it with "npm start" in the API folder, then hit Refresh.</td></tr>`;
    return;
  }

  try {
    const res = await fetch(PRODUCTS_URL);
    const body = await res.json();
    if (!res.ok || !body.success) throw new Error(body.error || "Failed to load products");
    products = body.data;
    editingId = null;
    renderRows();
  } catch (err) {
    rowsEl.innerHTML = `<tr class="state-row"><td colspan="5">${escapeHtml(err.message)}</td></tr>`;
  }
}

// ---------- Create ----------

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("fName").value.trim();
  const price = parseFloat(document.getElementById("fPrice").value);
  const quantity = parseInt(document.getElementById("fQuantity").value, 10);

  submitBtn.disabled = true;
  showFormMessage("Adding…", "");

  try {
    const res = await fetch(PRODUCTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) throw new Error(body.error || "Could not add product");

    formEl.reset();
    showFormMessage(`Added "${body.data.name}" to the ledger.`, "success");
    await loadProducts();
  } catch (err) {
    showFormMessage(err.message, "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------- Edit / save / cancel / delete (event delegation) ----------

rowsEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const { action, id } = btn.dataset;
  const productId = Number(id);

  if (action === "edit") {
    editingId = productId;
    renderRows();
    return;
  }

  if (action === "cancel") {
    editingId = null;
    renderRows();
    return;
  }

  if (action === "delete") {
    const target = products.find((p) => p.id === productId);
    if (!confirm(`Remove "${target ? target.name : "this item"}" from the ledger?`)) return;

    try {
      const res = await fetch(`${PRODUCTS_URL}/${productId}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error || "Could not delete product");
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
    return;
  }

  if (action === "save") {
    const row = rowsEl.querySelector(`tr[data-id="${productId}"]`);
    const name = row.querySelector(".edit-name").value.trim();
    const price = parseFloat(row.querySelector(".edit-price").value);
    const quantity = parseInt(row.querySelector(".edit-quantity").value, 10);

    try {
      const res = await fetch(`${PRODUCTS_URL}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, quantity }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error || "Could not save changes");
      editingId = null;
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  }
});

// ---------- Init ----------

refreshBtn.addEventListener("click", loadProducts);
loadProducts();
