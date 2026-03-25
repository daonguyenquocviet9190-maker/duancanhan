// ======================== XỬ LÝ ĐĂNG KÝ ========================
const formDangKy = document.getElementById("formDangKy");
if (formDangKy) {
  formDangKy.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Lấy danh sách user đã có
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra email đã tồn tại chưa
    if (users.some((u) => u.email === email)) {
      alert("❌ Email này đã được đăng ký!");
      return;
    }

    // Thêm user mới
    users.push({
      username,
      email,
      password,
      role: "Khách hàng",
      active: false,
      lastLogin: null,
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("✅ Đăng ký thành công! Hãy đăng nhập.");
    window.location.href = "Dangnhap.html";
  });
}

// ======================== XỬ LÝ ĐĂNG NHẬP ========================
const formDangNhap = document.getElementById("formDangNhap");
if (formDangNhap) {
  formDangNhap.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("❌ Email hoặc mật khẩu không đúng!");
      return;
    }

    // ✅ Cập nhật trạng thái và thời gian đăng nhập
    user.active = true;
    user.lastLogin = new Date().toLocaleString("vi-VN");

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("✅ Đăng nhập thành công!");
    window.location.href = "index.html";
  });
}

// ======================== HIỂN THỊ USER Ở MENU TRANG CHỦ ========================
document.addEventListener("DOMContentLoaded", () => {
  const authButtons = document.getElementById("authButtons"); // vùng chứa nút đăng nhập / đăng ký
  const userInfo = document.getElementById("userInfo"); // vùng hiển thị thông tin user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    if (authButtons) authButtons.style.display = "none";

    if (userInfo) {
      userInfo.style.display = "flex";
      userInfo.innerHTML = `
        <img src="image/avata.jpg" class="avatar" alt="avatar">
        <span style="margin-left:6px;">${currentUser.username}</span>
        <button class="logout-btn">Đăng xuất</button>
      `;

      // ====== XỬ LÝ ĐĂNG XUẤT ======
      const logoutBtn = userInfo.querySelector(".logout-btn");
      logoutBtn.addEventListener("click", () => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const u = users.find((x) => x.email === currentUser.email);
        if (u) u.active = false; // cập nhật trạng thái
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.removeItem("currentUser");
        alert("👋 Đã đăng xuất!");
        window.location.href = "index.html";
      });
    }
  }
});
