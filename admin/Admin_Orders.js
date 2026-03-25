// ======================== QUẢN LÝ ĐƠN HÀNG ========================
const API = "http://localhost:3000/orders";
const orderTable = document.getElementById("orderTable");

// 📥 Lấy danh sách đơn hàng
async function loadOrders() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    renderOrders(data);
  } catch (err) {
    console.error("❌ Lỗi tải đơn hàng:", err);
  }
}

// 🧾 Hiển thị danh sách đơn hàng
function renderOrders(orders) {
  orderTable.innerHTML = orders
    .map(
      (o) => `
      <tr>
        <td>${o.id}</td>
        <td>${o.customer}</td>
        <td>${o.items.join(", ")}</td>
        <td>${Number(o.total).toLocaleString()} $</td>
        <td>
          <select onchange="updateStatus(${o.id}, this.value)">
            <option value="pending" ${o.status === "pending" ? "selected" : ""}>Chờ xử lý</option>
            <option value="done" ${o.status === "done" ? "selected" : ""}>Hoàn tất</option>
            <option value="cancel" ${o.status === "cancel" ? "selected" : ""}>Hủy</option>
          </select>
        </td>
        <td>
          <button onclick="deleteOrder(${o.id})">🗑️ Xóa</button>
        </td>
      </tr>`
    )
    .join("");
}

// 🔄 Cập nhật trạng thái đơn hàng
async function updateStatus(id, status) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    alert("✅ Cập nhật trạng thái thành công!");
  } catch (err) {
    console.error("❌ Lỗi cập nhật trạng thái:", err);
  }
}

// 🗑️ Xóa đơn hàng
async function deleteOrder(id) {
  if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
  try {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    alert("✅ Đã xóa đơn hàng!");
    loadOrders();
  } catch (err) {
    console.error("❌ Lỗi xóa đơn hàng:", err);
  }
}

// 🚀 Khi trang tải xong
loadOrders();
