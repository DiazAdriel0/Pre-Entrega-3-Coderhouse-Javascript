//Declaración de variables
const nombres = [document.getElementById("nombre0").textContent,document.getElementById("nombre1").textContent,document.getElementById("nombre2").textContent,document.getElementById("nombre3").textContent,document.getElementById("nombre4").textContent,document.getElementById("nombre5").textContent,document.getElementById("nombre6").textContent,document.getElementById("nombre7").textContent];
//Precios segun el diseño
const precios = [2500,3200,2800,2700,5000,8200,10000,10000];
const productos = [];
let medidasDom = [];
const botonesAgregar = [];
const cantidadesDom = [];
let productosBolsa = [];
const rutasDeImagenes = [];
const bolsaBoton = document.getElementById("bolsaBoton");
let vaciarBolsa = document.getElementById("vaciarBolsa");
let productosEnLS = [];
let contador = productosEnLS.length;
let contadorProductos = document.getElementById('contadorProductos');
let span = document.createElement('span');
class Producto{
    constructor(nombre,precio){
        this.nombre = nombre;
        this.medidas = ["Almond","Medium Square","Medium Coffin","Long Stiletto","Long Coffin","Long Tapered Square","Extra Long Stiletto","Extra Long Tapered Square","Extra Long Coffin","Triple Extra Long Tapered Square"];
        this.precio = precio;
    }
}

//Declaración de funciones
function crearArrayDePrecios(precio) {
    let arrayDePrecios = [precio,Math.round(precio*1.1),Math.round(precio*1.1),Math.round(precio*1.3),Math.round(precio*1.3),Math.round(precio*1.3),Math.round(precio*1.6),Math.round(precio*1.6),Math.round(precio*1.6),Math.round(precio*2)];
    return arrayDePrecios;
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
function agregarProducto(ident){
    let productoElegido = {
        nombre: productos[ident].nombre,
        medida: document.getElementById(`medida${ident}`).value,
        precio: document.getElementById(`precio${ident}`).textContent,
        cantidad: cantidadesDom[ident].value,
        ruta: rutasDeImagenes[ident],
    }
    if (productoElegido["medida"] == "") {
        swal({
            text: "Para agregar un producto debe seleccionar el tamaño",
        });
    }else if (productoElegido["cantidad"] == ""){
        swal({
            text: "Para agregar un producto debe seleccionar cantidad",
        });
    }
    else{
        productosBolsa.push(productoElegido);
        //Recorro productosBolsa para eliminar un producto repetido y sumarle la cantidad
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
        Toastify({
            text: "Producto agregado a la bolsa",
            duration: 1500,
            gravity: "top",
            position: "center",
            offset: {
                y: 80,
            },
            style: {
            background: "linear-gradient(to right, #e600ac, #bd008e)",
            },
        }).showToast();
        if(localStorage.getItem('productosBolsa')){
            productosEnLS = [];
            productosEnLS.push(...JSON.parse(localStorage.getItem('productosBolsa')));
            contador = productosEnLS.length;
            span.innerHTML = "";
            span.innerHTML = `<span>${contador}</span>`;
            contadorProductos.appendChild(span)
        }
    } 
}
function mostrarBolsaDeCompras() {
    let productosEnLocalStorage = [];
    const bolsa = document.getElementById("bolsa");
    bolsa.innerHTML = ""
    let subTotales = [];
    if(localStorage.length == 0){
        Toastify({
            text: "Aún no agregó productos a la bolsa",
            duration: 2000,
            gravity: "top",
            position: "center",
            style: {
              background: "linear-gradient(to right, #e600ac, #bd008e)",
            },
        }).showToast();
    }else{
        productosEnLocalStorage.push(...JSON.parse(localStorage.getItem('productosBolsa')));
        for (let i = 0; i < productosEnLocalStorage.length; i++) {
            const element = productosEnLocalStorage[i];
            const subTotal = element.precio * element.cantidad;
            subTotales.push(subTotal)
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
        let div2 = document.createElement('div');
        let total = subTotales.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        div2.innerHTML = `<div class="container">
        <div class="row justify-content-center">
            <div class="col-12 align-self-center text-center">
                <p class="text-light mx-5">Total: $${total}</p>
            </div>
            <div class="col-12 align-self-center text-center">
                <button type="submit" class="btn btn-outline-light mx-5 mb-2" id="comprar">Comprar</button>
            </div>
        </div>
        </div>`
        bolsa.appendChild(div2)
    }
}
function vaciarBolsaDeCompras() {
    localStorage.removeItem('productosBolsa')
    productosBolsa = []
    let div = document.getElementById('collapseWidthExample');
    div.classList.remove('show');
    Toastify({
        text: "Bolsa de compras vacía",
        duration: 1500,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #e600ac, #bd008e)",
        },
    }).showToast();
    //Borro el span que contaba productos en la bolsa
    contadorProductos.appendChild(span)
    contadorProductos.removeChild(span)
}
function crearNuevoProducto(i) {
    const nombre = nombres[i];
    let arrayDePrecios = crearArrayDePrecios(precios[i]);
    const producto = new Producto(nombre,arrayDePrecios);
    productos.push(producto);
}
function obtenerRutasDeImagenes(i) {
    const imagen = document.getElementById(`img${i}`);
    const ruta = imagen.getAttribute('src');
    rutasDeImagenes.push(ruta)
}

//Obtengo elementos al DOM
for (let i = 0; i < nombres.length; i++) {
    medidasDom.push(document.getElementById(`medida${i}`)) 
}
for (let i = 0; i < nombres.length; i++) {
    botonesAgregar.push(document.getElementById(`agregarALaBolsa${i}`));
}
for (let i = 0; i < nombres.length; i++) {
    cantidadesDom.push(document.getElementById(`cantidad${i}`))
}
for (let i = 0; i < nombres.length; i++) {
    obtenerRutasDeImagenes(i);
}

//Creo los productos
for (let i = 0; i < nombres.length; i++) {
    crearNuevoProducto(i)
}

//Eventos
for (let i = 0; i < medidasDom.length; i++) {
    const element = medidasDom[i];
    element.addEventListener("change", function(e) {
        mostrarPrecio(e, i);
    });
}
for (let i = 0; i < botonesAgregar.length; i++) {
    const element = botonesAgregar[i];
    element.addEventListener("click", function() {
        agregarProducto(i);
    });
}
bolsaBoton.addEventListener("click", mostrarBolsaDeCompras);
vaciarBolsa.addEventListener("click", vaciarBolsaDeCompras);
//Esto es para que cuando se haga click por fuera del div de la bolsa de compras el contenido se deje de mostrar
document.addEventListener('click', function(event) {
    let div = document.getElementById('collapseWidthExample');
    let bolsa = document.getElementById('bolsa')
    if (!bolsa.contains(event.target)) {
      div.classList.remove('show');
    }
});

//Si había algo en el local storage lo muestro en la bolsa
if (localStorage.length > 0) {
    productosBolsa.push(...JSON.parse(localStorage.getItem('productosBolsa')));
}

//Contador de productos que hay en la bolsa
if(localStorage.getItem('productosBolsa')){
    productosEnLS = [];
    productosEnLS.push(...JSON.parse(localStorage.getItem('productosBolsa')));
    contador = productosEnLS.length;
    span.innerHTML = "";
    span.innerHTML = `<span>${contador}</span>`;
    contadorProductos.appendChild(span);
}

function initMap() {
    const blackParadoxCoord = { lat: -33.001175, lng: -60.675524 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: blackParadoxCoord,
        zoom: 16,
    });
    const marker = new google.maps.Marker({
      position: blackParadoxCoord,
      map: map,
    });
  }
  
window.initMap = initMap;

/* function initMap() {
    const coord = { lat: -33.001175, lng: -60.675524 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: coord,
      });
} */
/* let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.001175, lng: -60.675524 },
    zoom: 8,
  });
}

window.initMap = initMap;

fetch("https://www.google.com/maps/embed/v1/place?key=AIzaSyDwjQn_3CPc6iRaL9XYqCbT59sSKgcNgrk&q=EkRBdmVuaWRhIE92aWRpbyBMYWdvcyA1NDMxLCBSb3NhcmlvLCBQcm92aW5jaWEgZGUgU2FudGEgRmUsIEFyZ2VudGluYSIxEi8KFAoSCYO27dEJrLeVEekHoPsdMeluELcqKhQKEgnNbSAwiqu3lRGYnpkjXhefSg")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    }) */


/* function initMap() {
    const myLatLng = { lat: -33.001175, lng: -60.675524 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: myLatLng,
    });
  
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }
  
  window.initMap = initMap; */