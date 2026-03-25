document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLienHe");
  if(!form) return;
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();
    if(!name || !email || !message) return alert("Nhập đầy đủ thông tin.");
    // chỉ demo -> không gửi server
    alert("Cảm ơn! Yêu cầu của bạn đã được ghi nhận.");
    form.reset();
  });
});
