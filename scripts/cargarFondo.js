fetch("components/fondo.html")
  .then((res) => res.text())
  .then((data) => {
    // Esto lo coloca al puro inicio del body
    document.body.insertAdjacentHTML('afterbegin', data);
  });