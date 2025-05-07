document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("bK2FiyMbUsmnkDiz2");

  const secciones = {
    inicio: document.getElementById("inicio"),
    formulario: document.getElementById("formulario-seccion"),
    detalle: document.getElementById("detalle-seccion"),
    tarjeta: document.getElementById("tarjeta-seccion"),
    efectivo: document.getElementById("efectivo-seccion"),
    domicilio: document.getElementById("domicilio-seccion"),
    pdf: document.getElementById("pdf-opciones"),
    despedida: document.getElementById("despedida"),
  };

  const mostrarSeccion = (id) => {
    Object.values(secciones).forEach((sec) => sec.classList.remove("activa"));
    secciones[id].classList.add("activa");
  };

  let detallePedido = "";
  let tipoEntrega = "";
  let metodoPago = "";

  document.getElementById("comenzar").addEventListener("click", () => {
    mostrarSeccion("formulario");
  });

  document.getElementById("calcular").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("Fecha").value;

    const pizza1 = parseFloat(document.getElementById("Pizza1").value) || 0;
    const pizza2 = parseFloat(document.getElementById("Pizza2").value) || 0;
    const pizza3 = parseFloat(document.getElementById("Pizza3").value) || 0;

    const extras = [
      { id: "queso1", texto: "Extra Queso", precio: 20 },
      { id: "refresco", texto: "Refresco", precio: 15 },
      { id: "orilla", texto: "Orilla de Queso", precio: 34 },
      { id: "papas", texto: "Papas", precio: 50 },
    ];

    let total = pizza1 + pizza2 + pizza3;
    let extrasTexto = "";

    extras.forEach((extra) => {
      if (document.getElementById(extra.id).checked) {
        total += extra.precio;
        extrasTexto += `\n- ${extra.texto}: $${extra.precio}`;
      }
    });

    detallePedido = `Nombre: ${nombre}\nFecha: ${fecha}\n\nPizzas:\n- Pizza 1: $${pizza1}\n- Pizza 2: $${pizza2}\n- Pizza 3: $${pizza3}${extrasTexto}\n\nTotal: $${total.toFixed(2)}`;
    document.getElementById("detallePedido").textContent = detallePedido;

    mostrarSeccion("detalle");
  });

  document.getElementById("continuarPago").addEventListener("click", () => {
    const metodo = document.querySelector("input[name='metodoPago']:checked");
    const tipo = document.querySelector("input[name='tipoServicio']:checked");

    if (!metodo || !tipo) {
      alert("Selecciona método de pago y tipo de entrega.");
      return;
    }

    metodoPago = metodo.value;
    tipoEntrega = tipo.value;

    if (tipoEntrega === "Entrega a domicilio") {
      mostrarSeccion("domicilio");
    } else {
      mostrarSeccion(metodoPago === "Tarjeta" ? "tarjeta" : "efectivo");
    }
  });

  document.getElementById("continuarDomicilio").addEventListener("click", () => {
    mostrarSeccion(metodoPago === "Tarjeta" ? "tarjeta" : "efectivo");
  });

  document.getElementById("finalizarTarjeta").addEventListener("click", () => {
    mostrarSeccion("pdf");
  });

  document.getElementById("finalizarEfectivo").addEventListener("click", () => {
    mostrarSeccion("pdf");
  });

  document.getElementById("descargarPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(detallePedido, 10, 10);
    doc.save("pedido_pizza.pdf");
  });

  document.getElementById("salir").addEventListener("click", () => {
    mostrarSeccion("despedida");
  });

  document.getElementById("comentarioForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("correo").value;
    const mensaje = document.getElementById("mensaje").value;

    emailjs
      .send("service_45eirbe", "template_50ot8qj", {
        to_email: correo,
        message: mensaje,
      })
      .then(() => {
        alert("Comentario enviado con éxito.");
        document.getElementById("comentarioForm").reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al enviar el comentario.");
      });
  });
});
