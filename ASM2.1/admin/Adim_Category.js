// ========================== QUẢN LÝ DANH MỤC ==========================
const API = "http://localhost:3000/categories";
const catTable = document.getElementById("catTable");
const inputCat = document.getElementById("catName");
const btnAdd = document.getElementById("btnAdd");

// 🧩 Hiển thị danh mục
async function loadCats() {
  const res = await fetch(API);
  const data = await res.json();
  renderCats(data);
}

function renderCats(categories) {
  catTable.innerHTML = categories
    .map(
      (cat) => `
      <tr>
        <td>${cat.id}</td>
        <td>
          <span id="text-${cat.id}">${cat.name}</span>
          <input id="input-${cat.id}" type="text" value="${cat.name}" style="display:none">
        </td>
        <td>
          <button onclick="editCat(${cat.id})">Sửa</button>
          <button onclick="deleteCat(${cat.id})">Xóa</button>
        </td>
      </tr>`
    )
    .join("");
}

// ➕ Thêm danh mục
btnAdd.addEventListener("click", async () => {
  const name = inputCat.value.trim();
  if (!name) return alert("Vui lòng nhập tên danh mục!");

  const res = await fetch(API);
  const cats = await res.json();
  const newId = cats.length ? Math.max(...cats.map((c) => +c.id)) + 1 : 1;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: newId, name }),
  });

  inputCat.value = "";
  loadCats();
});

// ✏️ Sửa danh mục
async function editCat(id) {
  const span = document.getElementById(`text-${id}`);
  const input = document.getElementById(`input-${id}`);

  if (input.style.display === "none") {
    // Chuyển sang chế độ nhập
    input.style.display = "inline-block";
    span.style.display = "none";
    input.focus();
  } else {
    // Lưu lại
    const newName = input.value.trim();
    if (!newName) return alert("Tên không được rỗng!");
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: newName }),
    });
    loadCats();
  }
}

// 🗑️ Xóa danh mục
async function deleteCat(id) {
  if (!confirm("Xóa danh mục này?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadCats();
}

// 🚀 Gọi khi load trang
loadCats();
