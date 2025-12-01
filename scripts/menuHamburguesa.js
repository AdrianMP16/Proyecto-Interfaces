document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnMenu");
  const nav = document.querySelector(".nav-links");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("activo");
    btn.textContent = nav.classList.contains("activo") ? "✖" : "☰";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu") && nav.classList.contains("activo")) {
      nav.classList.remove("activo");
      btn.textContent = "☰";
    }
  });
});

