// ================== THỐNG KÊ ADMIN ==================

// Lấy dữ liệu từ localStorage hoặc dữ liệu mẫu nếu chưa có
const orders = JSON.parse(localStorage.getItem("orders") || `[
  {"items":["Bán Nick FreeFire Giá Rẻ","Acc free fire VIP"],"total":650000,"status":"pending"},
  {"items":["Huracan"],"total":320000,"status":"done"}
]`);

const products = JSON.parse(localStorage.getItem("products") || `[
  {"name":"Bán Nick FreeFire Giá Rẻ","price":500000,"category":"Acc xịn","vừa":5},
  {"name":"Acc free fire sinh viên","price":320000,"category":"Acc xịn","vừa":3},
  {"name":"Acc free fire VIP","price":280000,"category":"Acc xịn","vừa":2}
]`);

const categories = JSON.parse(localStorage.getItem("categories") || `["Acc xịn","Acc vừa tiền","Acc ngon"]`);
const customers = JSON.parse(localStorage.getItem("customers") || `[
  {"name":"Nguyen Van A","email":"a@gmail.com","phone":"0123456789"},
  {"name":"Tran Thi B","email":"b@gmail.com","phone":"0987654321"}
]`);

// ========== TÍNH TOÁN ==========
const totalOrders = orders.length;
const totalCustomers = customers.length;
const totalProducts = products.length;
const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

// ========== HIỂN THỊ TỔNG QUAN ==========
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("h2");
  header.insertAdjacentHTML("afterend", `
    <div class="summary">
      <div><b>Tổng đơn hàng:</b> ${totalOrders}</div>
      <div><b>Tổng sản phẩm:</b> ${totalProducts}</div>
      <div><b>Tổng khách hàng:</b> ${totalCustomers}</div>
      <div><b>Doanh thu:</b> ${totalRevenue.toLocaleString()} $</div>
    </div>
  `);

  drawCharts();
});

// ========== XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ==========
function drawCharts() {
  // Số lần sản phẩm được đặt
  const countByProd = {};
  orders.forEach(o => o.items.forEach(i => countByProd[i] = (countByProd[i] || 0) + 1));

  // Doanh thu từng đơn
  const orderLabels = orders.map((o, i) => `Đơn ${i + 1}: ${o.items.join(", ")}`);
  const orderTotals = orders.map(o => o.total);

  // Tồn kho
  const prodNames = products.map(p => p.name);
  const prodStocks = products.map(p => p.stock || 0);

  // ========== BIỂU ĐỒ 1: Sản phẩm được đặt ==========
  new Chart(document.getElementById("chart1"), {
    type: "bar",
    data: {
      labels: Object.keys(countByProd),
      datasets: [{
        label: "Sản phẩm được đặt",
        data: Object.values(countByProd),
        backgroundColor: "orange"
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // ========== BIỂU ĐỒ 2: Doanh thu ==========
  new Chart(document.getElementById("chart2"), {
    type: "pie",
    data: {
      labels: orderLabels,
      datasets: [{
        data: orderTotals,
        backgroundColor: ["#f39c12", "#27ae60", "#c0392b", "#2980b9", "#8e44ad"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // ========== BIỂU ĐỒ 3: Hàng tồn ==========
  new Chart(document.getElementById("chart3"), {
    type: "bar",
    data: {
      labels: prodNames,
      datasets: [{
        label: "Tồn kho",
        data: prodStocks,
        backgroundColor: "#3498db"
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
