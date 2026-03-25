document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("headerRoot");
  if (!header) return;

  header.innerHTML = `
    <div class="brand">
      <div class="logo">LB</div>
      <div>
        <div style="font-weight:700">Acc free free Q$V</div>
        <div style="font-size:12px;color:var(--muted)">Demo</div>
      </div>
    </div>
    <nav class="menu">
      <a href="index.html">Trang Chủ</a>
      <a href="Models.html">Models</a>
      <a href="Showroom.html" class="active">Showroom</a>
      <a href="Lienhe.html">Liên hệ</a>
      <div id="authButtons">
        <a href="Dangnhap.html">Đăng nhập</a>
        <a href="Dangky.html">Đăng ký</a>
      </div>
      <a href="Giohang.html" class="cart-link">Giỏ hàng <span id="cartCount" class="cart-count">0</span></a>
    </nav>
  `;
});
