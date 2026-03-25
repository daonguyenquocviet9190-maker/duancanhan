// =================== ADMIN DASHBOARD FULL CODE ===================

const API = "http://localhost:3000";
const PRODUCTS_API = `${API}/products`;
const CATEGORIES_API = `${API}/loai`;

// ====== KHỞI TẠO ======
document.addEventListener("DOMContentLoaded", async () => {
  setupTabSwitch();
  await loadProducts();
  loadCustomers();
  loadOrders();
  loadCategories();
  updateDashboard();
});

// ====== CHUYỂN TAB ======
function setupTabSwitch() {
  const tabs = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.tab;
      sections.forEach((s) => s.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");

      localStorage.setItem("currentTab", target);

      if (target === "customers") loadCustomers();
      if (target === "orders") loadOrders();
      if (target === "products") loadProducts();
      if (target === "categories") loadCategories();
      if (target === "dashboard") updateDashboard();
    });
  });

  const savedTab = localStorage.getItem("currentTab");
  if (savedTab) {
    document.querySelector(`.nav-btn[data-tab="${savedTab}"]`)?.click();
  }
}

// =================== DASHBOARD ===================
const totalProductsEl = document.getElementById("totalProducts");
const totalRevenueEl = document.getElementById("totalRevenue");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalOrdersEl = document.getElementById("totalOrders");

async function updateDashboard() {
  try {
    const res = await fetch(PRODUCTS_API);
    const products = await res.json();

    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    totalProductsEl.textContent = totalProducts;
    totalRevenueEl.textContent = totalRevenue.toLocaleString("vi-VN") + " VND";
    totalCustomersEl.textContent = users.length;
    totalOrdersEl.textContent = orders.length;

    renderSalesChart(orders);
  } catch (err) {
    console.error("❌ Không thể tải dữ liệu tổng quan:", err);
  }
}

function renderSalesChart(orders = []) {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  const sales = new Array(12).fill(0);
  orders.forEach((o) => {
    const m = new Date(o.time || Date.now()).getMonth();
    sales[m] += Number(o.total) || 0;
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: sales,
          backgroundColor: "#d4af37",
          borderRadius: 6,
        },
      ],
    },
    options: { responsive: true, plugins: { legend: { display: false } } },
  });
}

// =================== QUẢN LÝ SẢN PHẨM ===================
const productsTableBody = document.querySelector("#productsTable tbody");
const productForm = document.getElementById("productForm");
const p_name = document.getElementById("p_name");
const p_price = document.getElementById("p_price");
const p_image = document.getElementById("p_image");
const p_desc = document.getElementById("p_desc");
const previewAdd = document.getElementById("previewAdd");

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const editForm = document.getElementById("editForm");
const e_id = document.getElementById("e_id");
const e_name = document.getElementById("e_name");
const e_price = document.getElementById("e_price");
const e_desc = document.getElementById("e_desc");
const e_image = document.getElementById("e_image");
const previewEdit = document.getElementById("previewEdit");

if (closeModalBtn) closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
if (modal)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

// ====== LOAD SẢN PHẨM ======
async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_API);
    const products = await res.json();
    renderProducts(products);
    updateDashboard();
  } catch (err) {
    console.error("❌ Không thể tải sản phẩm:", err);
  }
}

async function renderProducts(products) {
  if (!productsTableBody) return;

  const resLoai = await fetch(CATEGORIES_API);
  const loaiList = await resLoai.json();
  const loaiMap = {};
  loaiList.forEach((l) => (loaiMap[l.id] = l.ten_loai));

  productsTableBody.innerHTML = products
    .map(
      (p) => `
      <tr data-id="${p.id}">
        <td><img src="${fixImagePath(p.image)}" style="width:70px;height:45px;border-radius:6px;object-fit:cover"></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${Number(p.price).toLocaleString()} VND</td>
        <td>${escapeHtml(p.desc || "")}</td>
        <td>${escapeHtml(loaiMap[p.id_loai] || "Không xác định")}</td>
        <td>
          <button onclick="onEditProduct(${p.id})">✏️</button>
          <button onclick="onDeleteProduct('${p.id}')">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

function fixImagePath(img) {
  if (!img) return "../image/placeholder.png";
  if (img.startsWith("data:") || img.startsWith("http")) return img;
  return img.startsWith("../") ? img : "../" + img;
}

// ====== THÊM SẢN PHẨM ======
if (p_image) {
  p_image.addEventListener("change", () => {
    const file = p_image.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => (previewAdd.src = e.target.result);
    reader.readAsDataURL(file);
  });
}

if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const base64Img = previewAdd.src.startsWith("data:") ? previewAdd.src : "";

    const payload = {
      name: p_name.value.trim(),
      price: Number(p_price.value),
      desc: p_desc.value.trim(),
      image: base64Img || "image/default.jpg",
      id_loai: 1,
    };

    await fetch(PRODUCTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ Thêm sản phẩm thành công!");
    productForm.reset();
    previewAdd.src = "";
    await loadProducts();
  });
}

// ====== XÓA SẢN PHẨM ======
async function onDeleteProduct(id) {
  if (!confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này?")) return;
  await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
  alert("✅ Đã xóa sản phẩm!");
  loadProducts();
}

// ====== SỬA SẢN PHẨM ======
async function onEditProduct(id) {
  const res = await fetch(`${PRODUCTS_API}/${id}`);
  const p = await res.json();

  e_id.value = p.id;
  e_name.value = p.name;
  e_price.value = p.price;
  e_desc.value = p.desc;
  previewEdit.src = fixImagePath(p.image);
  modal.classList.remove("hidden");
}

if (e_image) {
  e_image.addEventListener("change", () => {
    const file = e_image.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => (previewEdit.src = e.target.result);
    reader.readAsDataURL(file);
  });
}

if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = e_id.value;
    const base64Img = previewEdit.src.startsWith("data:") ? previewEdit.src : previewEdit.src;

    const payload = {
      name: e_name.value.trim(),
      price: Number(e_price.value),
      desc: e_desc.value.trim(),
      image: base64Img,
    };

    await fetch(`${PRODUCTS_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ Cập nhật thành công!");
    modal.classList.add("hidden");
    loadProducts();
  });
}

// =================== QUẢN LÝ KHÁCH HÀNG (LOCALSTORAGE) ===================
const customersTableBody = document.querySelector("#usersTable tbody");

function loadCustomers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!customersTableBody) return;
  customersTableBody.innerHTML =
    users.length === 0
      ? `<tr><td colspan="6" style="text-align:center;color:gray;">Chưa có khách hàng nào</td></tr>`
      : users
          .map(
            (u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(u.username || "Không rõ")}</td>
          <td>${escapeHtml(u.email || "Không có email")}</td>
          <td>${u.role || "user"}</td>
          <td>${u.lastLogin || "Chưa đăng nhập"}</td>
          <td><button onclick="deleteCustomer(${i})">🗑️</button></td>
        </tr>`
          )
          .join("");
}

function deleteCustomer(index) {
  if (!confirm("Xóa khách hàng này?")) return;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadCustomers();
  updateDashboard();
}

// =================== QUẢN LÝ ĐƠN HÀNG (LOCALSTORAGE) ===================
const ordersTableBody = document.querySelector("#ordersTable tbody");

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (!ordersTableBody) return;
  ordersTableBody.innerHTML =
    orders.length === 0
      ? `<tr><td colspan="7" style="text-align:center;color:gray;">Chưa có đơn hàng nào</td></tr>`
      : orders
          .map(
            (o, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(o.fullname || "Ẩn danh")}</td>
          <td>${escapeHtml(o.phone || "")}</td>
          <td>${Number(o.total || 0).toLocaleString("vi-VN")} VND</td>
          <td>${new Date(o.time || Date.now()).toLocaleString("vi-VN")}</td>
          <td>${escapeHtml(o.status || "Chờ xử lý")}</td>
          <td>
            <button onclick="editOrderStatus(${i})">✏️</button>
            <button onclick="deleteOrder(${i})">🗑️</button>
          </td>
        </tr>`
          )
          .join("");
}

function editOrderStatus(index) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders[index];
  const newStatus = prompt("Cập nhật trạng thái:", order.status || "Chờ xử lý");
  if (!newStatus) return;
  orders[index].status = newStatus;
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
  updateDashboard();
}

function deleteOrder(index) {
  if (!confirm("Xóa đơn hàng này?")) return;
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
  updateDashboard();
}

// =================== QUẢN LÝ LOẠI SẢN PHẨM ===================
const categoriesTableBody = document.querySelector("#categoriesTable tbody");
const categoryForm = document.getElementById("categoryForm");
const c_name = document.getElementById("c_name");

async function loadCategories() {
  try {
    const res = await fetch(CATEGORIES_API);
    const categories = await res.json();
    renderCategories(categories);
  } catch (err) {
    console.error("❌ Không thể tải dữ liệu loại:", err);
  }
}

function renderCategories(categories) {
  if (!categoriesTableBody) return;
  categoriesTableBody.innerHTML = categories
    .map(
      (l) => `
    <tr data-id="${l.id}">
      <td>${l.id}</td>
      <td>${escapeHtml(l.ten_loai)}</td>
      <td>
        <button onclick="onEditCategory(${l.id})">✏️ Sửa</button>
        <button onclick="onDeleteCategory(${l.id})">🗑️ Xóa</button>
      </td>
    </tr>`
    )
    .join("");
}

if (categoryForm) {
  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tenLoai = c_name.value.trim();
    if (!tenLoai) return alert("⚠️ Vui lòng nhập tên loại!");

    const res = await fetch(CATEGORIES_API);
    const categories = await res.json();
    const newId =
      categories.length > 0
        ? Math.max(...categories.map((c) => Number(c.id) || 0)) + 1
        : 1;

    const payload = { id: newId, ten_loai: tenLoai };

    await fetch(CATEGORIES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ Thêm loại thành công!");
    categoryForm.reset();
    loadCategories();
  });
}

async function onEditCategory(id) {
  const res = await fetch(`${CATEGORIES_API}/${id}`);
  const loai = await res.json();
  const newName = prompt("Nhập tên mới cho loại:", loai.ten_loai);
  if (!newName) return;

  await fetch(`${CATEGORIES_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...loai, ten_loai: newName.trim() }),
  });

  alert("✅ Cập nhật loại thành công!");
  loadCategories();
}

async function onDeleteCategory(id) {
  if (!confirm("🗑️ Bạn có chắc muốn xóa loại này?")) return;
  await fetch(`${CATEGORIES_API}/${id}`, { method: "DELETE" });
  alert("✅ Đã xóa loại thành công!");
  loadCategories();
}

// =================== CHỐNG LỖI HTML ===================
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (s) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s] || s)
  );
}
