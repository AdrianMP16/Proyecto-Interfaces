let size = 16;
function aumentar() {
    size+=2;
    document.getElementById("texto").style.fontSize=size+"px";
}
function disminuir() {
    size-=2;
    document.getElementById("texto").style.fontSize=size+"px";
}