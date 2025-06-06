// Navegación entre apartados
function mostrarApartado(id) {
    document.querySelectorAll('.apartado').forEach(el => el.classList.remove('activo'));
    document.getElementById(id).classList.add('activo');
}
window.onload = () => mostrarApartado('productos');

// Productos en un array local
let productos = [
  {
    "nombre": "Cuaderno",
    "precio": 50,
    "imagen": "https://http2.mlstatic.com/D_NQ_NP_698724-MLM72077843473_102023-O.webp"
  },
  {
    "nombre": "Lápices",
    "precio": 10,
    "imagen": "https://production-tailoy-repo-magento-statics.s3.amazonaws.com/imagenes/872x872/productos/i/f/a/faber-castell-lapiz-tecnico-f-16152014-default-1.jpg"
  },
  {
    "nombre": "Borrador",
    "precio": 5,
    "imagen": "https://tse2.mm.bing.net/th/id/OIP.UUXoV9tk4tsI-ByuW2y77AAAAA?rs=1&pid=ImgDetMain"
  },
  {
    "nombre": "Regla",
    "precio": 15,
    "imagen": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-lmyzn595pd3iaa"
  },
  {
    "nombre": "Colores",
    "precio": 60,
    "imagen": "https://http2.mlstatic.com/lapices-de-colores-prismacolor-escolar-36-piezas-D_NQ_NP_134405-MLM20868023209_082016-F.jpg"
  },
  {
    "nombre": "Marcadores",
    "precio": 20,
    "imagen": "https://janamx.com/cdn/shop/products/StabiloPastel3-min.jpg?v=1674840145&width=1445"
  },
  {
    "nombre": "Hojas de Color",
    "precio": 30,
    "imagen": "https://th.bing.com/th/id/R.316d183917d65ffd177ef4dad3481e78?rik=FByG9FzSZWjCZw&pid=ImgRaw&r=0"
  },
  {
    "nombre": "Tijeras",
    "precio": 25,
    "imagen": "https://giselestephanie.b-cdn.net/wp-content/uploads/2024/01/0005291.jpg"
  }
];

let carrito = [];
let direccionGuardada = "";
let pagoExitoso = false;
let datosPago = {};
const productosGrid = document.querySelector(".productos-grid");
const carritoContenido = document.getElementById("carrito-contenido");
const resumenCompra = document.getElementById("resumen-compra");
const domicilioForm = document.getElementById("domicilio-form");
const calleInput = document.getElementById("calle");
const coloniaInput = document.getElementById("colonia");
const municipioInput = document.getElementById("municipio");
const detallesInput = document.getElementById("detalles");
const direccionMsg = document.getElementById("direccion-guardada");
const pagoForm = document.getElementById("pago-form");
const pagoExito = document.getElementById("pago-exito");
const botonPDF = document.getElementById("generar-pdf");

// Renderizar productos
function renderizarProductos() {
    productosGrid.innerHTML = "";
    productos.forEach((producto, idx) => {
        const productoHTML = `
            <div class="producto" data-index="${idx}">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3 class="info-rosa">${producto.nombre}</h3>
                <p class="info-rosa">Precio: $${producto.precio}</p>
                <button class="agregar-carrito">Agregar al carrito</button>
            </div>
        `;
        productosGrid.innerHTML += productoHTML;
    });
    // Agregar evento a los botones
    document.querySelectorAll(".agregar-carrito").forEach((button, idx) => {
        button.addEventListener("click", () => {
            const producto = productos[idx];
            const itemEnCarrito = carrito.find(p => p.nombre === producto.nombre);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad += 1;
            } else {
                carrito.push({...producto, cantidad: 1});
            }
            actualizarCarrito();
        });
    });
}
renderizarProductos();

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoContenido.innerHTML = "<p class='info-rosa'>El carrito está vacío.</p>";
        resumenCompra.style.display = "none";
        domicilioForm.style.display = "none";
        pagoForm.style.display = "none";
        botonPDF.style.display = "none";
        return;
    }
    carritoContenido.innerHTML = carrito.map(item => `
        <div>
            ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
            <button class="eliminar" data-producto="${item.nombre}">Eliminar</button>
        </div>
    `).join("");
    document.querySelectorAll(".eliminar").forEach(b => {
        b.addEventListener("click", e => {
            const nombre = e.target.getAttribute("data-producto");
            carrito = carrito.filter(item => item.nombre !== nombre);
            actualizarCarrito();
        });
    });
    mostrarResumenCompra();
    domicilioForm.style.display = "block";
    pagoForm.style.display = direccionGuardada ? "block" : "none";
    botonPDF.style.display = "none";
    pagoExito.textContent = "";
}

function mostrarResumenCompra() {
    let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    resumenCompra.innerHTML = "<h3>Resumen de compra</h3>" +
        carrito.map(item => `<div>${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}</div>`).join("") +
        `<hr><strong>Total: $${total}</strong>`;
    resumenCompra.style.display = "block";
}

// Formulario de domicilio con campos corregidos
domicilioForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const calle = calleInput.value.trim();
    const colonia = coloniaInput.value.trim();
    const municipio = municipioInput.value.trim();
    const detalles = detallesInput.value.trim();

    if (calle.length > 0 && colonia.length > 0 && municipio.length > 0) {
        direccionGuardada = `Calle: ${calle}, Colonia: ${colonia}, Municipio: ${municipio}`;
        if (detalles.length > 0) {
            direccionGuardada += `. Detalles: ${detalles}`;
        }
        direccionMsg.textContent = "¡Dirección guardada!\n" + direccionGuardada;
        pagoForm.style.display = "block";
    } else {
        direccionMsg.textContent = "Por favor completa todos los campos obligatorios.";
    }
});

pagoForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre-tarjeta").value.trim();
    const numero = document.getElementById("numero-tarjeta").value.trim();
    const fecha = document.getElementById("fecha-exp").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    if (nombre && numero.length >= 16 && fecha && cvv.length >= 3) {
        datosPago = {
            nombre,
            numero: "**** **** **** " + numero.slice(-4),
            fecha,
        };
        pagoExito.textContent = "¡Pago realizado con éxito!";
        pagoExitoso = true;
        botonPDF.style.display = "inline-block";
    } else {
        pagoExito.textContent = "Datos incorrectos. Revisa los campos.";
    }
});

botonPDF.addEventListener("click", () => {
    if(!pagoExitoso || !direccionGuardada) {
        alert("Primero paga y pon tu dirección.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(14);
    doc.text("Ticket de compra JOLMAR", 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleString(), 10, y);
    y += 10;
    doc.text("Dirección de envío:", 10, y);
    y += 8;
    doc.text(direccionGuardada, 10, y);
    y += 10;
    doc.text("Productos:", 10, y);
    y += 8;
    let total = 0;
    carrito.forEach(item => {
        doc.text(`${item.nombre} x${item.cantidad} = $${item.precio * item.cantidad}`, 12, y);
        y += 8;
        total += item.precio * item.cantidad;
    });
    y += 5;
    doc.text(`Total: $${total}`, 10, y);
    y += 10;
    doc.text("Pago realizado con:", 10, y);
    y += 8;
    doc.text(`Titular: ${datosPago.nombre || ""}`, 10, y);
    y += 7;
    doc.text(`Tarjeta: ${datosPago.numero || ""}`, 10, y);
    y += 7;
    doc.text(`Expira: ${datosPago.fecha || ""}`, 10, y);
    doc.save("ticket-jolmar.pdf");
});