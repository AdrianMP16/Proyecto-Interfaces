function eliminar() {
    let lista = document.getElementById("lista");
    lista.removeChild(lista.lastElementChild);
}
function agregarItem() {
    let valor = document.getElementById("item").value;
    let li = document.createElement("li");

    li.textContent = valor;
    document.getElementById("lista").appendChild(li);
    document.getElementById("item").value = "";
}