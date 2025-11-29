//jQuery es una librería de JavaScript que te permite escribir cosas difíciles de manera más corta y fácil.

(function () {//se llama inmediantamente al cargarse el sprit sin llamarse desde afuera
  "use strict";//El modo estricto hace que JavaScript sea más seguro, más predecible y menos permisivo, evitando errores silenciosos y prácticas incorrectas.

  var carousels = function () {
    //$ es el signo de jquery
    $(".owl-carousel1").owlCarousel({//convierte cuaquier elemento de .owl-carousel1 en un carrusel
      loop: true,//crea un loop infinito
      center: true,//centra los elementos
      margin: 0,//no hay espacio entre los elementos
      responsiveClass: true,//agregue clases automáticas según el tamaño actual de la pantalla
      //nav: false,//Oculta los botones de navegación por defecto.
      responsive: {//cambia el número de elementos visibles según el ancho de la pantalla
        0: {//muestra 1 elemento
          items: 1,
          nav: false
        },
        680: {
          items: 2,//2 elemento
          nav: false,
          loop: true//no habra loop
        },
        1000: {//3 elementos
          items: 3,
          nav: true
        }
      }
    });
  };

  (function ($) {//se inicializa el carrusel
    carousels();
  })(jQuery);
})();

function toggleCard(card){
  //querySelector permite buscar elementos dentro de otro elemento, no en toda la página.
  const img = card.querySelector(".card_img");//no estamos usando id pero debemos controlar todos los elementos de una clase
  const txt = card.querySelector(".card_txt");

  if (img.style.display != "none") {
    img.style.display = "none";
    txt.style.display = "block";
  }else{
    img.style.display = "block";
    txt.style.display = "none";
  }
}