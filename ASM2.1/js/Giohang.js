// ================= GIỎ HÀNG Acc free free Q$V =================

// --- Đường dẫn đến JSON-server ---
const API = "http://localhost:3000/products";

// --- Giỏ hàng từ localStorage ---
let cart = JSON.parse(localStorage.getItem("CART") || "[]");

// --- Lưu giỏ hàng ---
function saveCart() {
  localStorage.setItem("CART", JSON.stringify(cart));
}

// --- Cập nhật số lượng hiển thị trên icon ---
function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) {
    const totalQty = cart.reduce((sum, sp) => sum + sp.qty, 0);
    el.textContent = totalQty;
  }
}

// --- Thêm sản phẩm vào giỏ bằng ID (lấy từ products.json) ---
async function addToCartById(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm!");
    const sp = await res.json();

    let found = cart.find((item) => item.id === sp.id);
    if (found) {
      found.qty++;
    } else {
      cart.push({
        id: sp.id,
        name: sp.name,
        price: sp.price,
        image: sp.image,
        qty: 1,
      });
    }

    saveCart();
    updateCartCount();
    alert(`✅ Đã thêm "${sp.name}" vào giỏ hàng!`);
  } catch (err) {
    console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
  }
}

// --- Render giỏ hàng (trang Giohang.html) ---
function renderCart() {
  const container = document.getElementById("cartContainer");
  const summary = document.getElementById("cartSummary");

  if (!container || !summary) return;

  container.innerHTML = "";
  summary.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <tr><td colspan="6" style="text-align:center;padding:20px;color:#999">
        🛒 Giỏ hàng của bạn đang trống.
      </td></tr>`;
    summary.innerHTML = `<p><strong>Tổng cộng:</strong> 0 VND</p>`;
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const subTotal = item.price * item.qty;
    total += subTotal;

    container.innerHTML += `
      <tr>
        <td><img src="${item.image}" style="width:80px;height:60px;object-fit:cover;border-radius:6px"></td>
        <td>${item.name}</td>
        <td>${item.price.toLocaleString("vi-VN")} VND</td>
        <td>
          <button onclick="changeQty(${index}, -1)">-</button>
          <span style="margin:0 8px">${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </td>
        <td>${subTotal.toLocaleString("vi-VN")} VND</td>
        <td><button onclick="removeItem(${index})">❌</button></td>
      </tr>
    `;
  });

  summary.innerHTML = `
    <div style="margin-top:20px;text-align:right">
      <p><strong>Tổng cộng:</strong> ${total.toLocaleString("vi-VN")} VND</p>
      <button onclick="checkout()" 
        style="background:#c90;padding:8px 16px;border:none;
        border-radius:6px;cursor:pointer;color:#fff;font-weight:bold">
        Thanh toán
      </button>
    </div>
  `;
}

// --- Thay đổi số lượng ---
function changeQty(index, delta) {
  if (cart[index].qty + delta > 0) {
    cart[index].qty += delta;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
  updateCartCount();
}

// --- Xóa sản phẩm ---
function removeItem(index) {
  if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
  }
}

// --- Chuyển đến trang đặt hàng ---
function checkout() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  // Lưu giỏ hàng hiện tại để hiển thị trên Dathang.html
  saveCart();
  window.location.href = "Dathang.html";
}

// --- Khi tải trang ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});
