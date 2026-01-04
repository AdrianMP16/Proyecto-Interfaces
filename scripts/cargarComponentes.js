fetch("components/header.html")//busca el archivo y lo descarga
  .then((res) => res.text())//convierte el archivo encontrado en texto html
  .then((data) => {//data es el texto html que recibe
    document.getElementById("header").innerHTML = data;//seleccciona <div id="header"> y coloca dentrto de este el texto antes cargado
  });


fetch("components/footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
fetch("components/fondo.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("area").innerHTML = data;
});