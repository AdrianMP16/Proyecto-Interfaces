// Eliminamos el DOMContentLoaded porque el fetch ya maneja el tiempo
const btn = document.getElementById("btnMenu");
const nav = document.querySelector(".nav-links");

// Verificación de seguridad para evitar errores en consola
if (btn && nav) {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("activo"); // Coincide con tu CSS .nav-links.activo
    btn.textContent = nav.classList.contains("activo") ? "✖" : "☰";
  });

  document.addEventListener("click", (e) => {
    // Si el clic no es en el menú y el menú está abierto, lo cerramos
    if (!e.target.closest(".menu") && nav.classList.contains("activo")) {
      nav.classList.remove("activo");
      btn.textContent = "☰";
    }
  });
}