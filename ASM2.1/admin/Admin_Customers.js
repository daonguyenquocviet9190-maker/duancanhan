// ======================== QUẢN LÝ KHÁCH HÀNG ========================
const API = "http://localhost:3000/customers";
const cusTable = document.getElementById("cusTable");

// 📥 Tải danh sách khách hàng
async function loadCustomers() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    renderCustomers(data);
  } catch (err) {
    console.error("❌ Lỗi tải khách hàng:", err);
  }
}

// 🧾 Hiển thị danh sách
function renderCustomers(customers) {
  cusTable.innerHTML = customers
    .map(
      (c) => `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>
          <button onclick="deleteCustomer(${c.id})">🗑️ Xóa</button>
        </td>
      </tr>`
    )
    .join("");
}

// 🗑️ Xóa khách hàng
async function deleteCustomer(id) {
  if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    alert("✅ Đã xóa khách hàng!");
    loadCustomers();
  } catch (err) {
    console.error("❌ Lỗi xóa khách hàng:", err);
  }
}

// 🚀 Khi tải trang
loadCustomers();
