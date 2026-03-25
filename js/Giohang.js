// ================= GIỎ HÀNG - HOẠT ĐỘNG =================

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) {
    const total = cart.reduce((sum, item) => sum + (item.qty || item.quantity || 0), 0);
    el.textContent = total;
  }
}

// Thêm vào giỏ từ Models.html
function addToCartById(id) {
  const product = window.PRODUCTS.find(p => p.id === Number(id));
  if (!product) return alert("❌ Không tìm thấy sản phẩm!");

  let found = cart.find(item => item.id === product.id);
  if (found) {
    found.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartCount();
  alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
}

function renderCart() {
  const container = document.getElementById("cartContainer");
  const summary = document.getElementById("cartSummary");

  if (!container || !summary) return;

  container.innerHTML = "";
  summary.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:50px; color:#888;">
          🛒 Giỏ hàng của bạn đang trống.<br><br>
          <a href="Models.html" style="color:#c90;">← Quay lại mua hàng</a>
        </td>
      </tr>`;
    summary.innerHTML = `<p><strong>Tổng cộng:</strong> 0 VND</p>`;
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const qty = item.qty || 1;
    const subtotal = item.price * qty;
    total += subtotal;

    container.innerHTML += `
      <tr>
        <td><img src="${item.image}" style="width:80px; height:60px; object-fit:cover; border-radius:6px;"></td>
        <td>${item.name}</td>
        <td>${item.price.toLocaleString("vi-VN")} VND</td>
        <td>
          <button onclick="changeQty(${index}, -1)" style="width:30px;">-</button>
          <span style="margin:0 12px; font-weight:bold;">${qty}</span>
          <button onclick="changeQty(${index}, 1)" style="width:30px;">+</button>
        </td>
        <td>${subtotal.toLocaleString("vi-VN")} VND</td>
        <td><button onclick="removeItem(${index})" style="color:red;">❌</button></td>
      </tr>`;
  });

  summary.innerHTML = `
    <div style="text-align:right; margin-top:20px;">
      <p><strong>Tổng cộng: ${total.toLocaleString("vi-VN")} VND</strong></p>
      <button onclick="checkout()" 
        style="background:#c90; color:white; padding:12px 24px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">
        Thanh toán
      </button>
    </div>`;
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty < 1) cart.splice(index, 1);
  
  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(index) {
  if (confirm("Xóa sản phẩm này?")) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
  }
}

function checkout() {
  if (cart.length === 0) return alert("Giỏ hàng trống!");
  saveCart();
  window.location.href = "Dathang.html";
}

// Khởi tạo khi vào trang giỏ hàng
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});