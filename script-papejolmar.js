// Agregar productos al carrito
document.querySelectorAll('#agregar-carrito-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const productos = document.querySelectorAll('input[type="checkbox"]:checked');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    productos.forEach((producto) => {
      const nombre = producto.nextElementSibling.textContent;
      const precio = producto.nextElementSibling.nextElementSibling.textContent;
      carrito.push(${nombre} ${precio});
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = 'carrito.html';
  });
});

// Mostrar productos en el carrito (en carrito.html)
if (document.getElementById('productos-carrito')) {
  const carrito = JSON.parse(localStorage.getItem('carrito'));
  const ul = document.getElementById('productos-carrito');
  if (carrito && carrito.length > 0) {
    carrito.forEach((producto) => {
      const li = document.createElement('li');
      li.textContent = producto;
      ul.appendChild(li);
    });
    const liBtn = document.createElement('li');
    const btnPagar = document.createElement('button');
    btnPagar.textContent = 'Pagar';
    btnPagar.onclick = function() {
      window.location.href = 'pago.html';
    };
    liBtn.appendChild(btnPagar);
    ul.appendChild(liBtn);
  } else {
    const li = document.createElement('li');
    li.textContent = 'Carrito vacío';
    ul.appendChild(li);
  }
}

// Procesar pago
if (document.getElementById('pagar-btn')) {
  document.getElementById('pagar-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const direccion = document.getElementById('direccion').value;
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    
    if (!carrito || carrito.length === 0) {
      document.getElementById('resultado').innerHTML = 'Carrito vacío';
      return;
    }
    
    if (nombre === '' || tarjeta === '' || direccion === '') {
      document.getElementById('resultado').innerHTML = 'Por favor, complete todos los campos';
      return;
    }
    
    // Procesar el pago (puedes agregar tu lógica de pago aquí)
    console.log('Pago procesado');
    console.log('Nombre:', nombre);
    console.log('Tarjeta:', tarjeta);
    console.log('Dirección:', direccion);
    console.log('Carrito:', carrito);
    
    // Mostrar resultado
    document.getElementById('resultado').innerHTML = 'Pago procesado con éxito';
    
    // Limpiar carrito
    localStorage.removeItem('carrito');
  });
}