// capturar los elementos de la interfaz de usuario
const eventList = document.getElementById('eventList');
const eventForm = document.getElementById('eventForm');

// Recibe un array de eventos y los muestra en la tabla de la UI
function displayEvents(events) {
  eventList.innerHTML = ''; // Limpiar tabla antes de insertar nuevos eventos

  // Recorrer lista de eventos y crear filas en la tabla
  events.forEach((event) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${event.nombre}</td>
      <td>${event.fecha_hora}</td>
      <td>${event.ubicacion}</td>
      <td>${event.boletos_disponibles}</td>
      <td>$${event.precio_boleto}</td>
      <td class="actions">
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button>
        <button class="buy-btn">Comprar boleto</button>
      </td>
    `;

    tr.querySelector('.edit-btn').addEventListener('click', function () {
      showEditForm(event);
    });

    tr.querySelector('.delete-btn').addEventListener('click', function () {
      if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        /// Llamada a la API para eliminar un evento.
        fetch(`http://localhost:8000/api/eventos/${event.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => loadEvents())
        .catch(error => console.error('Error al eliminar evento:', error));
      }
    });

    tr.querySelector('.buy-btn').addEventListener('click', function () {
      if (event.boletos_disponibles <= 0) {
        alert('No hay boletos disponibles para este evento.');
        return;
      }

      fetch(`http://localhost:8000/api/eventos/${event.id}/vender`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => loadEvents())
      .catch(error => console.error('Error al comprar boleto:', error));
    });

    eventList.appendChild(tr);
  });
}

// Mostrar el formulario de edición con los datos del evento seleccionado
function showEditForm(event) {
    document.getElementById("form-title").textContent = "Editar Evento";

    // Llenar el formulario con los datos del evento seleccionado
    document.getElementById("eventId").value = event.id;
    document.getElementById("nombre").value = event.nombre;
    document.getElementById("fecha_hora").value = event.fecha_hora;
    document.getElementById("ubicacion").value = event.ubicacion;
    document.getElementById("boletos_disponibles").value = event.boletos_disponibles;
    document.getElementById("precio_boleto").value = event.precio_boleto;

    // Mostrar el botón cancelar edición
    document.getElementById("cancelEdit").classList.remove("hidden");
}

// Cancelar edición y volver al modo "Agregar Evento"
document.getElementById("cancelEdit").addEventListener("click", function () {
    document.getElementById("form-title").textContent = "Agregar Evento";
    document.getElementById("eventForm").reset();
    document.getElementById("eventId").value = "";
    this.classList.add("hidden");
});

// Capturar el formulario para agregar o actualizar eventos
eventForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir comportamiento 

    const id = document.getElementById("eventId").value;
    const nombre = document.getElementById("nombre").value.trim();
    const fecha_hora = document.getElementById("fecha_hora").value;
    const ubicacion = document.getElementById("ubicacion").value;
    const boletos_disponibles = parseInt(document.getElementById("boletos_disponibles").value);
    const precio_boleto = parseFloat(document.getElementById("precio_boleto").value);

    // Validación
    if (!nombre || !fecha_hora || boletos_disponibles <= 0) {
        alert("Debes completar todos los campos correctamente y agregar al menos un boleto.");
        return;
    }

    const eventData = { nombre, fecha_hora, ubicacion, boletos_disponibles, precio_boleto };

    const url = id ? `http://localhost:8000/api/eventos/${id}` : "http://localhost:8000/api/eventos";
    const method = id ? "PUT" : "POST";

    // Petición POST o PUT para agregar o actualizar un evento
    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar evento");
        return response.json();
    })
    .then(() => {
        console.log(id ? "Evento actualizado" : "Evento agregado");
        loadEvents(); // Recargar lista después de guardar
        eventForm.reset();
        document.getElementById("eventId").value = "";
        document.getElementById("form-title").textContent = "Agregar Evento";
        document.getElementById("cancelEdit").classList.add("hidden");
    })
    .catch(error => console.error("Error al guardar evento:", error));
});

// Función que carga los eventos desde el backend y los muestra en la tabla
function loadEvents() {
  fetch('http://localhost:8000/api/eventos')
    .then(response => response.json())
    .then(data => displayEvents(data))
    .catch(error => console.error('Error al cargar eventos:', error));
}

// Cargar los eventos al iniciar la aplicación
loadEvents();
