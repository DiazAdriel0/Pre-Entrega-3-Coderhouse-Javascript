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
    let subTotales = [];
    if(localStorage.length == 0){
        alert("Aún no agregó productos a la bolsa");//Reemplazar con Toastify
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

//Esto es para que cuando se haga click por fuera del div de la bolsa de compras el contenido se deje de mostrar
document.addEventListener('click', function(event) {
    let div = document.getElementById('collapseWidthExample');
    let bolsa = document.getElementById('bolsa')
    if (!bolsa.contains(event.target)) {
      div.classList.remove('show');
    }
});

let vaciarBolsa = document.getElementById("vaciarBolsa");
vaciarBolsa.addEventListener("click", vaciarBolsaDeCompras);

function vaciarBolsaDeCompras() {
    localStorage.removeItem('productosBolsa')
    //Este es el array de la funcion agregarProducto que estaba lleno de los productos del Storage entonces lo vacío
    productosBolsa = []
    let div = document.getElementById('collapseWidthExample');
    div.classList.remove('show');
    alert("Bolsa de compras vacía")//Reemplazar con Toastify
}