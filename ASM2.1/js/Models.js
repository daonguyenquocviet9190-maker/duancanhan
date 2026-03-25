// ====================== CẤU HÌNH ======================
let MODELS = [];
let currentPage = 1;
const itemsPerPage = 4;

// ====================== HÀM LOAD DỮ LIỆU ======================
async function fetchModels() {
  try {
    const res = await fetch("http://localhost:3000/products");
    MODELS = await res.json();
    renderModelsTo();
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);
  }
}

// ====================== HIỂN THỊ DANH SÁCH ======================
function renderModelsTo(containerId = "listModels") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = MODELS.slice(start, end);

  pageItems.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}">
      <div class="meta">
        <div style="font-weight:700">${m.name}</div>
        <div class="small">${m.desc || ""}</div>
        <div class="price">${m.price.toLocaleString()} $</div>
        <div>
          <button onclick="openDetail(${m.id})">Mua ngay</button>
          <button class="primary" onclick="addToCartById(${m.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination();
}

// ====================== PHÂN TRANG ======================
function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  const totalPages = Math.ceil(MODELS.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderModelsTo();
    });
    pagination.appendChild(btn);
  }
}

// ====================== HÀM TIỆN ÍCH ======================
function getModelById(id) {
  return MODELS.find(m => m.id === Number(id));
}

function openDetail(id) {
  window.location.href = `Chitietsanpham.html?id=${id}`;
}

function addToCartById(id) {
  const model = getModelById(id);
  if (!model) return alert("Sản phẩm không tồn tại");
  addToCart(model.name, model.price, model.image);
}

// ====================== KHỞI TẠO ======================
document.addEventListener("DOMContentLoaded", fetchModels);
