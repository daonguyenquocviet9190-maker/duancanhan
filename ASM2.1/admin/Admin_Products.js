// ==================== QUẢN LÝ SẢN PHẨM ====================
const USE_API = false; // 🔁 nếu có JSON Server thì đổi thành true
const API_URL = "http://localhost:3000/products";

let products = [];
let categories = JSON.parse(localStorage.getItem("categories") || `["Siêu xe","SUV","Sport"]`);

const form = document.getElementById("formAddProduct");
const tb = document.getElementById("productTable");
const sel = document.getElementById("pCategory");
const imgPreview = document.getElementById("imgPreview");

// ========== Khởi tạo ========== //
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  loadProducts();
});

// ========== Render danh mục ========== //
function renderCategories() {
  sel.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ========== Load sản phẩm ========== //
async function loadProducts() {
  if (USE_API) {
    const res = await fetch(API_URL);
    products = await res.json();
  } else {
    products = JSON.parse(localStorage.getItem("products") || "[]");
  }
  renderTable();
}

// ========== Render bảng sản phẩm ========== //
function renderTable() {
  tb.innerHTML = products.map((p, i) => `
    <tr>
      <td>${p.name}</td>
      <td>${Number(p.price).toLocaleString()} $</td>
      <td>${p.category}</td>
      <td><img src="${p.image}" width="60"></td>
      <td>
        <button class="delete" onclick="deleteProduct(${i}, ${p.id || 'null'})">Xóa</button>
      </td>
    </tr>
  `).join("");

  if (!USE_API) localStorage.setItem("products", JSON.stringify(products));
}

// ========== Thêm sản phẩm ========== //
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("pName").value.trim();
  const price = Number(document.getElementById("pPrice").value);
  const category = document.getElementById("pCategory").value;
  const desc = document.getElementById("pDesc").value;
  const imageUrl = document.getElementById("pImageUrl").value.trim();
  const file = document.getElementById("pImageFile").files[0];

  let image = imageUrl;
  if (file) {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      image = ev.target.result;
      await saveProduct({ name, price, category, description: desc, image });
    };
    reader.readAsDataURL(file);
  } else {
    await saveProduct({ name, price, category, description: desc, image });
  }

  e.target.reset();
  imgPreview.style.display = "none";
});

// ========== Lưu sản phẩm ========== //
async function saveProduct(p) {
  if (USE_API) {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
  } else {
    products.push(p);
    localStorage.setItem("products", JSON.stringify(products));
  }
  loadProducts();
}

// ========== Xóa sản phẩm ========== //
async function deleteProduct(i, id) {
  if (!confirm("Xóa sản phẩm này?")) return;

  if (USE_API && id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } else {
    products.splice(i, 1);
    localStorage.setItem("products", JSON.stringify(products));
  }
  loadProducts();
}

// ========== Xem trước ảnh khi chọn file ========== //
document.getElementById("pImageFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imgPreview.src = ev.target.result;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});
