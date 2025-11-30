// REGISTRO
const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", function(e){
    e.preventDefault();

    const datos = {
        nombres: document.getElementById("regNombres").value,
        apellidos: document.getElementById("regApellidos").value,
        cedula: document.getElementById("regCedula").value,
        fechaNac: document.getElementById("regFechaN").value,
        correo: document.getElementById("regCorreo").value,
        direccion: document.getElementById("regDireccion").value,
        usuario: document.getElementById("regUsuario").value,
        password: document.getElementById("regPassword").value
    };
    console.log("Datos capturados: ", datos);
    localStorage.setItem("datoUsuario", JSON.stringify(datos));

    alert("Usuario registrado correctamente");
    window.location.href="login.html";

    formRegistro.reset();
});


// LOGIN
const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function(e){
    e.preventDefault();

    const usuarioIngresado = document.getElementById("logUsuario").value;
    const passwordIngresado = document.getElementById("logPassword").value;

    const datosGuardados = JSON.parse(localStorage.getItem("datoUsuario"));

    if(!datosGuardados){
        alert("No hay usuarios registrados");
        return;
    }

    if(usuarioIngresado === datosGuardados.usuario &&
       passwordIngresado === datosGuardados.password){

        mostrarSistema(datosGuardados);
        window.location.href="dashboard.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});


// MOSTRAR SISTEMA
function mostrarSistema(datos){
    document.getElementById("registroCard").classList.add("hidden");
    document.getElementById("loginCard").classList.add("hidden");

    document.getElementById("sistemaCard").classList.remove("hidden");

    document.getElementById("bienvenida").textContent =
        'Hola, ${datos.nombres} ${datos.apellidos}'

    document.getElementById("datosUsuario").innerHTML = `
        <li><strong>Cédula:</strong> ${datos.cedula}</li>
        <li><strong>Fecha de Nacimiento:</strong> ${datos.fechaNac}</li>
        <li><strong>Correo:</strong> ${datos.correo}</li>
        <li><strong>Dirección:</strong> ${datos.direccion}</li>
        <li><strong>Usuario:</strong> ${datos.usuario}</li>
    `;
}


// CERRAR SESIÓN
document.getElementById("cerrarSesion").addEventListener("click", () => {
    document.getElementById("sistemaCard").classList.add("hidden");
    document.getElementById("registroCard").classList.remove("hidden");
    document.getElementById("loginCard").classList.remove("hidden");
});
