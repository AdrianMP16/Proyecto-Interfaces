document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnMenu");         // coincide con id en HTML
  const nav = document.querySelector(".nav-links");      // coincide con class en HTML

  if (!btn || !nav) {
    console.warn("menu: btn o nav no encontrado");
    return;
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("activo");
    btn.textContent = nav.classList.contains("activo") ? "✖" : "☰";
  });

  // cerrar al click fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu") && nav.classList.contains("activo")) {
      nav.classList.remove("activo");
      btn.textContent = "☰";
    }
  });
});
