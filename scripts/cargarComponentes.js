fetch("components/header.html")
  .then((res) => res.text())
  .then((data) => {
    // 1. Metemos el HTML del menú
    document.getElementById("header").innerHTML = data;

    // 2. ACTIVAMOS EL MENÚ: Creamos el script dinámicamente
    // Esto asegura que el JS encuentre el botón ☰ porque ya existe en el HTML
    const script = document.createElement("script");
    script.src = "scripts/menuHamburguesa.js"; 
    document.body.appendChild(script);
  });

fetch("components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });

