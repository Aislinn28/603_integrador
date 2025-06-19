import{_ as H,f as _,o as z}from"./index-C2aYM6LG.js";const M={name:"SistemaEstacionamiento",data(){return{htmlContent:`
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
      `}},mounted(){let t=[],c="";const s=document.querySelectorAll(".service-button"),p=document.getElementById("estacionamientoContainer"),g=document.getElementById("autolavadoContainer"),m=document.getElementById("listaCarrito"),h=document.getElementById("totalCarrito"),k=document.getElementById("calcularEstacionamiento"),C=document.getElementById("limpiarCarrito"),w=document.getElementById("generarTicket"),S=document.querySelectorAll('input[name="serviciosAutolavado"]');function L(){s.forEach(o=>o.classList.remove("active")),this.classList.add("active"),c=this.getAttribute("data-service"),c==="estacionamiento"?(p.classList.add("visible"),g.classList.remove("visible")):c==="autolavado"&&(g.classList.add("visible"),p.classList.remove("visible")),f()}function $(){const o=document.getElementById("horaEntrada").value,e=document.getElementById("horaSalida").value,a=document.getElementById("tiempoCompleto").value;let i=0,r="";if(a==="si")i=80,r="Estacionamiento - Tiempo libre",t=[{servicio:r,costo:i}];else if(o&&e){const[l,n]=o.split(":").map(Number),[u,I]=e.split(":").map(Number);let d=u-l,b=I-n;d<0&&(d+=24),b<0&&(d--,b+=60);const x=d+b/60;i=Math.ceil(x)*20,r=`Estacionamiento - ${x.toFixed(2)} horas`,t=[{servicio:r,costo:i}]}else{alert("Por favor, complete los campos de hora de entrada y salida o seleccione tiempo completo.");return}v()}function A(o){const e=o.value,a=parseInt(o.getAttribute("data-costo"));o.checked?t.some(i=>i.servicio===e)||t.push({servicio:e,costo:a}):t=t.filter(i=>i.servicio!==e),v()}function v(){m.innerHTML="",t.forEach(e=>{const a=document.createElement("li");a.className="cart-item",a.innerHTML=`
                <div class="cart-item-details">
                    <div class="cart-item-title">${e.servicio}</div>
                </div>
                <div class="cart-item-price">$${e.costo}</div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-servicio="${e.servicio}">×</button>
                </div>
            `,m.appendChild(a)}),document.querySelectorAll(".remove-item").forEach(e=>{e.addEventListener("click",function(){T(this.getAttribute("data-servicio"))})});const o=t.reduce((e,a)=>e+a.costo,0);h.textContent=`$${o}`}function T(o){t=t.filter(e=>e.servicio!==o),c==="autolavado"&&document.querySelectorAll('input[name="serviciosAutolavado"]').forEach(e=>{e.value===o&&(e.checked=!1)}),v()}function f(){t=[],m.innerHTML="",h.textContent="$0",document.querySelectorAll('input[name="serviciosAutolavado"]').forEach(o=>{o.checked=!1})}function B(){const o=document.getElementById("placas").value;if(!o){alert("Por favor, ingrese las placas del vehículo.");return}if(t.length===0){alert("No hay servicios en el carrito.");return}const e=new Date().toLocaleDateString(),a=new Date().toLocaleTimeString(),i=t.reduce((n,u)=>n+u.costo,0);let r=`
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
                        <p>Fecha: ${e} - Hora: ${a}</p>
                    </div>

                    <div class="details">
                        <p><strong>Placas:</strong> ${o}</p>
                        <p><strong>Servicios:</strong></p>
        `;t.forEach(n=>{r+=`
                <div class="item">
                    <span>${n.servicio}</span>
                    <span>$${n.costo}</span>
                </div>
            `}),r+=`
                    </div>

                    <div class="total">
                        <span>Total:</span>
                        <span>$${i}</span>
                    </div>

                    <div class="footer">
                        <p>¡Gracias por su preferencia!</p>
                    </div>
                </div>
            </body>
            </html>
        `;const l=window.open("","_blank");l.document.write(r),l.document.close()}s.forEach(o=>{o.addEventListener("click",L)}),k.addEventListener("click",$),C.addEventListener("click",f),w.addEventListener("click",B),S.forEach(o=>{o.addEventListener("change",function(){A(this)})})}},P=["innerHTML"];function j(y,E,t,c,s,p){return z(),_("div",{innerHTML:s.htmlContent},null,8,P)}const q=H(M,[["render",j]]);export{q as default};
