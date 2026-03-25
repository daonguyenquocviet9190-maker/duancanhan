// ====================== SLIDER ======================
let slideIndex = 0;
let slideTimer = null;

function initSlider() {
  const container = document.querySelector(".banner-slider .slides");
  if (!container) return;

  const slides = container.children;
  const total = slides.length;
  container.style.transform = `translateX(0%)`;

  slideTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % total;
    container.style.transform = `translateX(-${slideIndex * 100}%)`;
  }, 4000);
}

function changeSlide(step) {
  const container = document.querySelector(".banner-slider .slides");
  if (!container) return;
  const total = container.children.length;
  slideIndex = (slideIndex + step + total) % total;
  container.style.transform = `translateX(-${slideIndex * 100}%)`;
}

// ====================== GIỎ HÀNG ======================
function addToCart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const found = cart.find(i => i.name === name);

  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} đã được thêm vào giỏ hàng.`);
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

// ====================== XÁC THỰC NGƯỜI DÙNG ======================
function checkAuth() {
  const current = JSON.parse(localStorage.getItem("currentUser") || "null");
  const authButtons = document.getElementById("authButtons");
  const userInfo = document.getElementById("userInfo");

  if (current) {
    if (authButtons) authButtons.style.display = "none";
    if (userInfo) {
      userInfo.style.display = "flex";
      userInfo.querySelector(".avatar")?.setAttribute(
        "title",
        current.username || current.email
      );
    }
  } else {
    if (authButtons) authButtons.style.display = "flex";
    if (userInfo) userInfo.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  checkAuth();
  alert("Bạn đã đăng xuất.");
}

// ====================== SẢN PHẨM ======================
let allProducts = [];

async function showProducts() {
  const productContainer = document.getElementById("listProducts");
  if (!productContainer) return;

  try {
    const res = await fetch("http://localhost:3000/products");
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error("❌ Lỗi tải sản phẩm:", err);
  }
}

function renderProducts(list) {
  const productContainer = document.getElementById("listProducts");
  productContainer.innerHTML = "";
  list.forEach(p => {
    productContainer.innerHTML += `
      <div class="product" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">${p.price.toLocaleString("en-US")} $</p>
        <p class="desc">${p.desc || ""}</p>
        <div class="actions">
          <button onclick="window.location.href='Chitietsanpham.html?id=${p.id}'">Mua ngay</button>
          <button onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  });
}

function filterByPrice() {
  const val = document.getElementById("priceFilter").value;
  if (val === "all") {
    renderProducts(allProducts);
  } else {
    const [min, max] = val.split("-").map(Number);
    const filtered = allProducts.filter(p => p.price >= min && p.price <= max);
    renderProducts(filtered);
  }
}

// ====================== FOOTER ======================
function renderFooter() {
  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-col">
          <h3>Acc free free Q$V</h3>
          <p class="small">375 Lê Văn Thọ, Gò Vấp, TP.HCM</p>
          <p class="small">Hotline: +84 123 567 890</p>
        </div>
        <div class="footer-col">
          <h4>Menu</h4>
          <ul>
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="Models.html">Models</a></li>
            <li><a href="Showroom.html">Showroom</a></li>
            <li><a href="Lienhe.html">Liên hệ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Theo dõi chúng tôi</h4>
          <div class="social">
            <a href="https://facebook.com" target="_blank" title="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" title="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="https://youtube.com" target="_blank" title="YouTube"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© 2025 Acc free free Q$V</div>
    </footer>
  `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

// ====================== KHỞI TẠO ======================
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  checkAuth();
  updateCartCount();
  showProducts();
  renderFooter();
});
