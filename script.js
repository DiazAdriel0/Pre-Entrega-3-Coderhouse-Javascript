let id = 0;
class Producto{
    constructor(nombre,precio){
        this.id = id++
        this.nombre = nombre;
        this.medidas = ["Almond","Medium Square","Medium Coffin","Long Stiletto","Long Coffin","Long Tapered Square","Extra Long Stiletto","Extra Long Tapered Square","Extra Long Coffin","Triple Extra Long Tapered Square"];
        this.precio = precio;
    }
}

function crearArrayDePrecios(precio) {
    let arrayDePrecios = [precio,Math.round(precio*1.1),Math.round(precio*1.1),Math.round(precio*1.3),Math.round(precio*1.3),Math.round(precio*1.3),Math.round(precio*1.6),Math.round(precio*1.6),Math.round(precio*1.6),Math.round(precio*2)];
    return arrayDePrecios;
}


const nombres = [document.getElementById("nombre0").textContent,document.getElementById("nombre1").textContent,document.getElementById("nombre2").textContent,document.getElementById("nombre3").textContent,document.getElementById("nombre4").textContent,document.getElementById("nombre5").textContent,document.getElementById("nombre6").textContent,document.getElementById("nombre7").textContent];

//Precios segun el diseño
const precios = [2500,3200,2800,2700,5000,8200,10000,10000];

const productos = []

for (let i = 0; i < nombres.length; i++) {
    const nombre = nombres[i];
    let arrayDePrecios = crearArrayDePrecios(precios[i])
    const producto = new Producto(nombre,arrayDePrecios)
    productos.push(producto)
}

let medidasDom = [];
for (let i = 0; i < 8; i++) {
    medidasDom.push(document.getElementById(`medida${i}`)) 
}

for (let i = 0; i < medidasDom.length; i++) {
    const element = medidasDom[i];
    element.addEventListener("change", function(e) {
        mostrarPrecio(e, productos[i].id);
    });
}

function mostrarPrecio(e, id){
    let medidaSeleccionada = e.target.value;
    let preciosDom = []
    for (let j = 0; j < 8; j++) {
        preciosDom.push(document.getElementById(`precio${j}`))
    }
    let span = document.createElement("span")
    let medidas = productos[id].medidas
    for (let i = 0; i < medidas.length; i++) {
        const element = medidas[i];
        if(element === medidaSeleccionada){
            span.innerHTML = `${productos[id].precio[i]}`
        }
    }
    preciosDom[id].innerHTML = ""
    preciosDom[id].appendChild(span)
}

const botonesAgregar = [];

for (let i = 0; i < 8; i++) {
    botonesAgregar.push(document.getElementById(`agregarALaBolsa${i}`));
}

const cantidadesDom = [];

for (let i = 0; i < 8; i++) {
    cantidadesDom.push(document.getElementById(`cantidad${i}`))
}



for (let i = 0; i < botonesAgregar.length; i++) {
    const element = botonesAgregar[i];
    element.addEventListener("click", function() {
        agregarProducto(productos[i].id);
    });
}

let productosBolsa = [];
if (localStorage.length > 0) {
    productosBolsa.push(...JSON.parse(localStorage.getItem('productosBolsa')));
}

const rutasDeImagenes = [];

for (let i = 0; i < 8; i++) {
    const imagen = document.getElementById(`img${i}`);
    const ruta = imagen.getAttribute('src');
    rutasDeImagenes.push(ruta)    
}

function agregarProducto(ident){
    let productoElegido = {
        nombre: productos[ident].nombre,
        medida: document.getElementById(`medida${ident}`).value,
        precio: document.getElementById(`precio${ident}`).textContent,
        cantidad: cantidadesDom[ident].value,
        ruta: rutasDeImagenes[ident],
    }
    if (productoElegido["medida"] == "") {
        alert("Seleccione una medida") //Reemplazar por Toastify
    }else if (productoElegido["cantidad"] == ""){
        alert("Seleccione cantidad de productos") //Reemplazar por Toastify
    }
    else{
        productosBolsa.push(productoElegido);
    }
    //Recorro productosBolsa para eliminar un producto repetido y sumarle 1 a cantidad
    for (let i = 0; i < productosBolsa.length; i++) {
        const producto = productosBolsa[i]
        for (let j = 0; j < productosBolsa.length; j++) {
            const element = productosBolsa[j]
            if (i == j){
                continue;
            }
            if (producto.nombre == element.nombre && producto.medida == element.medida){
                producto.cantidad = Number(producto.cantidad) + Number(element.cantidad);
                productosBolsa.splice(j,1)
                localStorage.removeItem(element)
            }
        } 
    }
    localStorage.setItem("productosBolsa", JSON.stringify(productosBolsa))
    //Meter un Toastify de producto agregado a la bolsa
}



const bolsaBoton = document.getElementById("bolsaBoton");
bolsaBoton.addEventListener("click", mostrarBolsaDeCompras);

function mostrarBolsaDeCompras() {
    let productosEnLocalStorage = [];
    const bolsa = document.getElementById("bolsa");
    bolsa.innerHTML = ""
    if(localStorage.length == 0){
        alert("Aún no agregó productos a la bolsa");//Reemplazar con Toastify
    }else{
        productosEnLocalStorage.push(...JSON.parse(localStorage.getItem('productosBolsa')));
        for (let i = 0; i < productosEnLocalStorage.length; i++) {
            const element = productosEnLocalStorage[i];
            const subTotal = element.precio * element.cantidad;
            let div = document.createElement('div');

            div.innerHTML = `<div class="container">
            <div class="row row-cols-1 row-cols-lg-3 mt-3 justify-content-around">
                <img src="${element.ruta}" class="col-8 col-md-6 col-lg rounded-5 float-start">
                <div class="col">
                    <p>${element.nombre}</p>
                    <hr>
                    <p>Medida: ${element.medida}</p>
                </div>
                <div class="col">
                    <p>Cantidad: ${element.cantidad}</p>
                    <hr>
                    <p>Precio Unitario: ${element.precio}</p>
                    <hr>
                    <p>Subtotal: ${subTotal}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <hr>
                </div>
            </div>
        </div>`;
            bolsa.appendChild(div);
        } 
    }
}

//Esto es para que cuando se haga click por fuera del div de la bolsa de compras el contenido se deje de mostrar
document.addEventListener('click', function(event) {
    let div = document.getElementById('collapseWidthExample');
    if (!div.contains(event.target)) {
      div.classList.remove('show');
    }
});

let vaciarBolsa = document.getElementById("vaciarBolsa");
vaciarBolsa.addEventListener("click", vaciarBolsaDeCompras);

function vaciarBolsaDeCompras() {
    let productosEnBolsa = [];
    localStorage.setItem('productosBolsa', JSON.stringify(productosEnBolsa));
    mostrarBolsaDeCompras();
}
/* let botonesEliminar = [];
for (let i = 0; ; i++) {
    const boton = document.getElementById(`eliminarProducto${i}`)
    if (boton){
    botonesEliminar.push(boton)
    }else{
        break;
    }
}*/

/* for (let i = 0; i < botonesEliminar.length; i++) {
    const element = botonesEliminar[i];
    element.addEventListener("click", function() {
        eliminarDeLaBolsa(i);
    }); 
} */

/* const eliminarBotones = document.querySelectorAll("[data-indice]"); */
/* const eliminarBotones = document.querySelectorAll('.botones-eliminar');
eliminarBotones.forEach((boton) => {
    boton.addEventListener('click', function() {
        const indice = parseInt(this.getAttribute('data-indice'));
        eliminarProducto(indice);
    });
}); */



/* function eliminarDeLaBolsa(id){
   let productosEnBolsa = JSON.parse(localStorage.getItem('productosBolsa'));
   productosEnBolsa.splice(id,1);
   localStorage.setItem("productosBolsa", JSON.stringify(productosEnBolsa));
} */
/* alert("Producto eliminado de la bolsa")
div.classList.remove('show') */

/* let productosEnLocalStorage = [];
productosEnLocalStorage.push(...JSON.parse(localStorage.getItem(productosBolsa))) */