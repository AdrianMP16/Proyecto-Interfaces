function validar(){
    let nombre = document.getElementById("nombre").value;
    let cedula = document.getElementById("cedula").value;

    if (nombre === "") {
        document.getElementById("error").textContent = "Porfavor ingrese su nombre";
    }else{
        document.getElementById("error").textContent = "";
        alert("Enviado!");
    }
    if (cedula === "") {
        document.getElementById("error2").textContent = "Porfavor ingrese su cedula";
    }else{
        document.getElementById("error2").textContent = "";
        alert("Enviado!");
    }
}