<template>
  <div v-html="htmlContent"></div>
</template>

<script>
export default {
  name: 'SistemaEstacionamiento',
  data() {
    return {
      htmlContent: `
        <style>
            :root {
                --primary-color: #3498db;
                --secondary-color: #2c3e50;
                --accent-color: #e74c3c;
                --text-color: #333;
                --light-bg: #f8f9fa;
                --border-color: #ddd;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            body {
                background-color: #f5f5f5;
                color: var(--text-color);
                line-height: 1.6;
            }

            .container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }

            header {
                background-color: var(--secondary-color);
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                margin-bottom: 30px;
            }

            h1 {
                font-size: 1.8rem;
                margin-bottom: 10px;
            }

            .main-content {
                display: flex;
                gap: 30px;
                flex-wrap: wrap;
            }

            .form-container {
                flex: 1;
                min-width: 300px;
                background-color: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .service-selection {
                margin-bottom: 25px;
            }

            .service-button {
                padding: 12px 20px;
                margin-right: 10px;
                margin-bottom: 10px;
                background-color: var(--light-bg);
                border: 2px solid var(--border-color);
                border-radius: 6px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .service-button.active {
                background-color: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            .service-button:hover {
                background-color: #e9ecef;
            }

            .form-group {
                margin-bottom: 20px;
            }

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #555;
            }

            input, select {
                width: 100%;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 1rem;
                background-color: var(--light-bg);
            }

            input:focus, select:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }

            .services-container {
                display: none;
                margin-top: 25px;
            }

            .service-section {
                padding: 20px;
                background-color: var(--light-bg);
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .service-section h3 {
                margin-bottom: 15px;
                color: var(--secondary-color);
            }

            .service-option {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }

            .service-option input[type="checkbox"] {
                width: auto;
                margin-right: 10px;
            }

            .cart-container {
                flex: 1;
                min-width: 300px;
                background-color: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                position: sticky;
                top: 20px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .cart-title {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid var(--light-bg);
            }

            .cart-title i {
                margin-right: 10px;
                color: var(--primary-color);
            }

            .cart-items {
                list-style-type: none;
            }

            .cart-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid var(--light-bg);
            }

            .cart-item-details {
                flex-grow: 1;
            }

            .cart-item-title {
                font-weight: 500;
            }

            .cart-item-price {
                color: var(--primary-color);
                font-weight: 600;
            }

            .cart-item-actions {
                display: flex;
                align-items: center;
            }

            .remove-item {
                background: none;
                border: none;
                color: var(--accent-color);
                cursor: pointer;
                font-size: 1.2rem;
                margin-left: 10px;
            }

            .cart-summary {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid var(--light-bg);
            }

            .cart-total {
                display: flex;
                justify-content: space-between;
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 20px;
            }

            .cart-actions {
                display: flex;
                justify-content: space-between;
            }

            .btn {
                padding: 12px 24px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .btn:hover {
                background-color: #2980b9;
            }

            .btn-secondary {
                background-color: #95a5a6;
            }

            .btn-secondary:hover {
                background-color: #7f8c8d;
            }

            .visible {
                display: block;
            }

            .hidden {
                display: none;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .main-content {
                    flex-direction: column;
                }

                .cart-container {
                    position: static;
                    margin-top: 30px;
                }
            }
        </style>

        <div class="container">
            <header>
                <h1>Sistema de Estacionamiento</h1>
                <p>Administre el estacionamiento y servicios de autolavado</p>
            </header>

            <div class="main-content">
                <!-- Formulario de Registro -->
                <div class="form-container">
                    <div class="service-selection">
                        <h2>Seleccione el servicio</h2>
                        <div class="service-buttons">
                            <button class="service-button" data-service="estacionamiento">Estacionamiento</button>
                            <button class="service-button" data-service="autolavado">Autolavado</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="placas">Número de placas:</label>
                        <input type="text" id="placas" name="placas" placeholder="Ejemplo: ABC-1234" required>
                    </div>

                    <!-- Campos para Estacionamiento -->
                    <div id="estacionamientoContainer" class="services-container">
                        <div class="form-group">
                            <label for="horaEntrada">Hora de entrada:</label>
                            <input type="time" id="horaEntrada" name="horaEntrada">
                        </div>

                        <div class="form-group">
                            <label for="horaSalida">Hora de salida:</label>
                            <input type="time" id="horaSalida" name="horaSalida">
                        </div>

                        <div class="form-group">
                            <label for="tiempoCompleto">¿Tiempo completo?</label>
                            <select id="tiempoCompleto" name="tiempoCompleto">
                                <option value="">Seleccione una opción</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <button type="button" class="btn" id="calcularEstacionamiento">Calcular Costo</button>
                        </div>
                    </div>

                    <!-- Campos para Autolavado -->
                    <div id="autolavadoContainer" class="services-container">
                        <!-- Servicios Básicos -->
                        <div class="service-section">
                            <h3>Servicios Básicos</h3>

                            <div class="service-option">
                                <input type="checkbox" id="lavadoExterior" name="serviciosAutolavado" value="Lavado exterior" data-costo="100">
                                <label for="lavadoExterior">Lavado exterior ($100)</label>
                            </div>

                            <div class="service-option">
                                <input type="checkbox" id="lavadoInterior" name="serviciosAutolavado" value="Lavado interior" data-costo="150">
                                <label for="lavadoInterior">Lavado interior ($150)</label>
                            </div>

                            <div class="service-option">
                                <input type="checkbox" id="lavadoCompleto" name="serviciosAutolavado" value="Lavado completo" data-costo="200">
                                <label for="lavadoCompleto">Lavado completo (interior y exterior) ($200)</label>
                            </div>
                        </div>

                        <!-- Servicios Especiales -->
                        <div class="service-section">
                            <h3>Servicios Especiales</h3>

                            <div class="service-option">
                                <input type="checkbox" id="encerado" name="serviciosAutolavado" value="Encerado" data-costo="150">
                                <label for="encerado">Encerado ($150)</label>
                            </div>

                            <div class="service-option">
                                <input type="checkbox" id="pulido" name="serviciosAutolavado" value="Pulido" data-costo="180">
                                <label for="pulido">Pulido ($180)</label>
                            </div>

                            <div class="service-option">
                                <input type="checkbox" id="aspirado" name="serviciosAutolavado" value="Aspirado profundo" data-costo="100">
                                <label for="aspirado">Aspirado profundo ($100)</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carrito -->
                <div class="cart-container">
                    <div class="cart-title">
                        <h2>Resumen de Servicios</h2>
                    </div>

                    <ul id="listaCarrito" class="cart-items"></ul>

                    <div class="cart-summary">
                        <div class="cart-total">
                            <span>Total:</span>
                            <span id="totalCarrito">$0</span>
                        </div>

                        <div class="cart-actions">
                            <button class="btn btn-secondary" id="limpiarCarrito">Limpiar</button>
                            <button class="btn" id="generarTicket">Generar Ticket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `
    }
  },
  mounted() {
    // Tu JavaScript original exactamente como estaba
    const costoPorHora = 20;
    const costoTiempoCompleto = 80;
    let carrito = [];
    let servicioActual = '';

    const serviceButtons = document.querySelectorAll('.service-button');
    const estacionamientoContainer = document.getElementById('estacionamientoContainer');
    const autolavadoContainer = document.getElementById('autolavadoContainer');
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarritoElement = document.getElementById('totalCarrito');
    const calcularEstacionamientoBtn = document.getElementById('calcularEstacionamiento');
    const limpiarCarritoBtn = document.getElementById('limpiarCarrito');
    const generarTicketBtn = document.getElementById('generarTicket');
    const serviciosCheckboxes = document.querySelectorAll('input[name="serviciosAutolavado"]');

    // Funciones
    function seleccionarServicio() {
        serviceButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        servicioActual = this.getAttribute('data-service');

        if (servicioActual === 'estacionamiento') {
            estacionamientoContainer.classList.add('visible');
            autolavadoContainer.classList.remove('visible');
        } else if (servicioActual === 'autolavado') {
            autolavadoContainer.classList.add('visible');
            estacionamientoContainer.classList.remove('visible');
        }

        limpiarCarrito();
    }

    function calcularCostoEstacionamiento() {
        const horaEntrada = document.getElementById('horaEntrada').value;
        const horaSalida = document.getElementById('horaSalida').value;
        const tiempoCompleto = document.getElementById('tiempoCompleto').value;

        let total = 0;
        let descripcion = '';

        if (tiempoCompleto === 'si') {
            total = costoTiempoCompleto;
            descripcion = 'Estacionamiento - Tiempo libre';
            carrito = [{ servicio: descripcion, costo: total }];
        } else if (horaEntrada && horaSalida) {
            const [horaInicio, minutoInicio] = horaEntrada.split(':').map(Number);
            const [horaFin, minutoFin] = horaSalida.split(':').map(Number);

            let diferenciaHoras = horaFin - horaInicio;
            let diferenciaMinutos = minutoFin - minutoInicio;

            if (diferenciaHoras < 0) {
                diferenciaHoras += 24;
            }

            if (diferenciaMinutos < 0) {
                diferenciaHoras--;
                diferenciaMinutos += 60;
            }

            const totalHoras = diferenciaHoras + (diferenciaMinutos / 60);
            total = Math.ceil(totalHoras) * costoPorHora;
            descripcion = `Estacionamiento - ${totalHoras.toFixed(2)} horas`;
            carrito = [{ servicio: descripcion, costo: total }];
        } else {
            alert('Por favor, complete los campos de hora de entrada y salida o seleccione tiempo completo.');
            return;
        }

        actualizarInterfazCarrito();
    }

    function actualizarCarritoAutolavado(checkbox) {
        const servicio = checkbox.value;
        const costo = parseInt(checkbox.getAttribute('data-costo'));

        if (checkbox.checked) {
            if (!carrito.some(item => item.servicio === servicio)) {
                carrito.push({ servicio, costo });
            }
        } else {
            carrito = carrito.filter(item => item.servicio !== servicio);
        }

        actualizarInterfazCarrito();
    }

    function actualizarInterfazCarrito() {
        listaCarrito.innerHTML = '';

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.servicio}</div>
                </div>
                <div class="cart-item-price">$${item.costo}</div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-servicio="${item.servicio}">×</button>
                </div>
            `;
            listaCarrito.appendChild(li);
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                eliminarDelCarrito(this.getAttribute('data-servicio'));
            });
        });

        const total = carrito.reduce((sum, item) => sum + item.costo, 0);
        totalCarritoElement.textContent = `$${total}`;
    }

    function eliminarDelCarrito(servicio) {
        carrito = carrito.filter(item => item.servicio !== servicio);

        if (servicioActual === 'autolavado') {
            document.querySelectorAll('input[name="serviciosAutolavado"]').forEach(checkbox => {
                if (checkbox.value === servicio) {
                    checkbox.checked = false;
                }
            });
        }

        actualizarInterfazCarrito();
    }

    function limpiarCarrito() {
        carrito = [];
        listaCarrito.innerHTML = '';
        totalCarritoElement.textContent = '$0';

        document.querySelectorAll('input[name="serviciosAutolavado"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    function generarTicket() {
        const placas = document.getElementById('placas').value;

        if (!placas) {
            alert('Por favor, ingrese las placas del vehículo.');
            return;
        }

        if (carrito.length === 0) {
            alert('No hay servicios en el carrito.');
            return;
        }

        const fecha = new Date().toLocaleDateString();
        const hora = new Date().toLocaleTimeString();
        const total = carrito.reduce((sum, item) => sum + item.costo, 0);

        let ticketHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Ticket de Servicio</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        margin: 0;
                        padding: 20px;
                        width: 300px;
                    }
                    .ticket {
                        border: 1px solid #ccc;
                        padding: 15px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 1px dashed #000;
                        padding-bottom: 10px;
                    }
                    .details {
                        margin-bottom: 20px;
                    }
                    .item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .total {
                        border-top: 1px dashed #000;
                        margin-top: 10px;
                        padding-top: 10px;
                        font-weight: bold;
                        display: flex;
                        justify-content: space-between;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h2>Sistema de Estacionamiento</h2>
                        <p>Ticket de servicio</p>
                        <p>Fecha: ${fecha} - Hora: ${hora}</p>
                    </div>

                    <div class="details">
                        <p><strong>Placas:</strong> ${placas}</p>
                        <p><strong>Servicios:</strong></p>
        `;

        carrito.forEach(item => {
            ticketHTML += `
                <div class="item">
                    <span>${item.servicio}</span>
                    <span>$${item.costo}</span>
                </div>
            `;
        });

        ticketHTML += `
                    </div>

                    <div class="total">
                        <span>Total:</span>
                        <span>$${total}</span>
                    </div>

                    <div class="footer">
                        <p>¡Gracias por su preferencia!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const ventana = window.open('', '_blank');
        ventana.document.write(ticketHTML);
        ventana.document.close();
    }

    // Event Listeners
    serviceButtons.forEach(button => {
        button.addEventListener('click', seleccionarServicio);
    });

    calcularEstacionamientoBtn.addEventListener('click', calcularCostoEstacionamiento);
    limpiarCarritoBtn.addEventListener('click', limpiarCarrito);
    generarTicketBtn.addEventListener('click', generarTicket);

    serviciosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            actualizarCarritoAutolavado(this);
        });
    });
  }
}
</script>
