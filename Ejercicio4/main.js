function contar() {
    let texto = document.getElementById("entrada").value;
    document.getElementById("contador").textContent = texto.length + " caracteres";
// return texto;
} 
// function cambiarTexto(){
//     texto=contar();
//     document.getElementById("contador").textContent = texto.length + " caracteres";
// }