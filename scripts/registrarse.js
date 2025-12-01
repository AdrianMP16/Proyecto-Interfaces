const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", function(e){
    e.preventDefault();

    const datos = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    localStorage.setItem("datoUsuario", JSON.stringify(datos));

    alert("Usuario registrado correctamente");
    window.location.href="login.html";

    formRegistro.reset();
});

