
// LOGIN
const formLogin = document.getElementById("formLogin");
let errorMensaje = document.getElementById("error");
formLogin.addEventListener("submit", function(e){
    errorMensaje.textContent = "";
    e.preventDefault();

    const usuarioIngresado = document.getElementById("email").value;
    const passwordIngresado = document.getElementById("clave").value;

    const datosGuardados = JSON.parse(localStorage.getItem("datoUsuario"));

    if(!datosGuardados){
        errorMensaje.textContent = "No hay usuarios registrados";
        return;
    }

    if(usuarioIngresado === datosGuardados.email &&
       passwordIngresado === datosGuardados.password){

        window.location.href="planificador.html";
    } else {
        errorMensaje.textContent = "Usuario o contraseña incorrectos";
    }
});
