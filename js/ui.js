class UI {
    constructor(app) {
        this.app = app;
        this.contenidoPrincipal = document.getElementById('contenido-principal');
        this.nav = document.getElementById('main-nav');
        this.userInfo = document.getElementById('user-info');
    }

    mostrarLogin() {
        this.contenidoPrincipal.innerHTML = `
            <div class="login-container">
                <h2>Iniciar Sesión</h2>
                <form id="login-form">
                    <input type="text" id="usuario" placeholder="Usuario" required>
                    <input type="password" id="contraseña" placeholder="Contraseña" required>
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        `;
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.app.iniciarSesion();
        });
    }

    actualizarNavegacion() {
        const usuario = this.app.auth.obtenerUsuarioActual();
        this.userInfo.textContent = `Bienvenido, ${usuario.nombre} ${usuario.apellido} (${usuario.rol})`;
        this.nav.innerHTML = `
            ${usuario.rol === 'vendedor' ? '<button id="nueva-venta">Nueva Venta</button>' : ''}
            ${usuario.rol === 'cajero' || usuario.rol === 'admin' || usuario.rol === 'admin_principal' ? '<button id="ver-ventas">Ver Ventas</button>' : ''}
            ${usuario.rol === 'admin' || usuario.rol === 'admin_principal' ? '<button id="gestionar-usuarios">Gestionar Usuarios</button>' : ''}
            ${usuario.rol === 'cajero' ? '<button id="escanear-venta">Escanear Venta</button>' : ''}
            <button id="cerrar-sesion">Cerrar Sesión</button>
        `;
        this.agregarEventosNavegacion();
    }
    

    agregarEventosNavegacion() {
        if (document.getElementById('nueva-venta')) {
            document.getElementById('nueva-venta').addEventListener('click', () => this.app.mostrarNuevaVenta());
        }
        if (document.getElementById('ver-ventas')) {
            document.getElementById('ver-ventas').addEventListener('click', () => this.mostrarVentas());
        }
        if (document.getElementById('gestionar-usuarios')) {
            document.getElementById('gestionar-usuarios').addEventListener('click', () => this.mostrarGestionUsuarios());
        }
        if (document.getElementById('escanear-venta')) {
            document.getElementById('escanear-venta').addEventListener('click', () => this.mostrarEscanearVenta());
        }
        document.getElementById('cerrar-sesion').addEventListener('click', () => {
            this.app.cerrarSesion();
            this.resetearInterfaz();
        });
    }

    mostrarEscanearVenta() {
        this.contenidoPrincipal.innerHTML = `
            <h2>Escanear Venta</h2>
            <div class="escanear-venta-container">
                <input type="text" id="codigo-boleta" placeholder="Código de Boleta" required>
                <button id="buscar-boleta">Buscar Boleta</button>
                <div id="resultado-boleta"></div>
            </div>
        `;
    
        document.getElementById('buscar-boleta').addEventListener('click', () => {
            const codigoBoleta = document.getElementById('codigo-boleta').value;
            const venta = this.app.ventas.buscarVenta(codigoBoleta);
    
            if (venta) {
                this.mostrarResultadoBoleta(venta);
            } else {
                document.getElementById('resultado-boleta').innerHTML = '<p>No se encontró la boleta.</p>';
            }
        });
    }

    mostrarResultadoBoleta(venta) {
        document.getElementById('resultado-boleta').innerHTML = `
            <div class="boleta">
                <h3>Código: ${venta.codigo}</h3>
                <h4>Fecha: ${new Date(venta.fecha).toLocaleString()}</h4>
                <hr>
                <h4>Items:</h4>
                ${venta.items.map(item => `<div>$${item.toFixed(2)}</div>`).join('')}
                <hr>
                <h4>Total: $${venta.total.toFixed(2)}</h4>
                <h4>Propina Sugerida: $${venta.propina.toFixed(2)}</h4>
                <h4>Subtotal: $${venta.subtotal.toFixed(2)}</h4>
                <button id="confirmar-venta">Confirmar Venta</button>
                <button id="cancelar-venta" class="btn-rojo">Cancelar Venta</button>
                <button id="proceder-pago">Proceder al Pago</button>
            </div>
        `;
    
        document.getElementById('confirmar-venta').addEventListener('click', () => {
            this.confirmarVenta(venta);
        });
    
        document.getElementById('cancelar-venta').addEventListener('click', () => {
            this.cancelarVenta(venta);
        });
    
        document.getElementById('proceder-pago').addEventListener('click', () => {
            this.mostrarOpcionesPago(venta);
        });
    }

    mostrarOpcionesPago(venta) {
        this.contenidoPrincipal.innerHTML = `
            <h2>Opciones de Pago</h2>
            <div class="opciones-pago">
                <label>
                    <input type="radio" name="metodo-pago" value="efectivo" checked> Efectivo
                </label>
                <label>
                    <input type="radio" name="metodo-pago" value="electronico"> Pago Electrónico
                </label>
                <div id="opciones-propina">
                    <h4>Propina</h4>
                    <button id="propina-sugerida">Propina Sugerida (10%)</button>
                    <button id="propina-diferente">Propina Diferente (Porcentaje)</button>
                    <button id="propina-especifica">Propina Específica (Monto)</button>
                </div>
            </div>
            <button id="confirmar-pago">Confirmar Pago</button>
        `;
    
        document.getElementById('propina-sugerida').addEventListener('click', () => {
            this.confirmarPago(venta, venta.propina);
        });
    
        document.getElementById('propina-diferente').addEventListener('click', () => {
            const porcentaje = prompt('Ingrese el porcentaje de propina:');
            if (porcentaje) {
                const propina = venta.total * (parseFloat(porcentaje) / 100);
                this.confirmarPago(venta, propina);
            }
        });
    
        document.getElementById('propina-especifica').addEventListener('click', () => {
            const monto = prompt('Ingrese el monto de propina:');
            if (monto) {
                this.confirmarPago(venta, parseFloat(monto));
            }
        });
    
        document.getElementById('confirmar-pago').addEventListener('click', () => {
            const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
            if (metodoPago === 'efectivo') {
                this.confirmarPago(venta, venta.propina);
            } else {
                alert('Seleccione una opción de propina primero.');
            }
        });
    }
    

    mostrarNuevaVenta() {
        this.contenidoPrincipal.innerHTML = `
            <div id="calculadora">
                <input type="text" id="monto" readonly>
                <div id="teclado">
                    <button id="borrar">C</button>
                    <button class="operacion"><i class="fas fa-times"></i></button> <!-- Botón de multiplicación -->
                    <button id="borrar-ultimo"><i class="fas fa-backspace"></i></button>
                    <button class="tecla">1</button>
                    <button class="tecla">2</button>
                    <button class="tecla">3</button>
                    <button class="tecla">4</button>
                    <button class="tecla">5</button>
                    <button class="tecla">6</button>
                    <button class="tecla">7</button>
                    <button class="tecla">8</button>
                    <button class="tecla">9</button>
                    <button id="agregar">+</button>
                    <button class="tecla">0</button>
                    <button id="finalizar-venta"><i class="fas fa-print"></i></button>
                </div>
                <div id="vista-previa"></div>
            </div>
        `;
    
        this.agregarEventosCalculadora();
    }
    
    confirmarPago(venta, propina) {
        venta.propina = propina;
        venta.subtotal = venta.total + propina;
        this.app.ventas.actualizarVenta(venta);
        alert('Pago confirmado');
        this.resetearInterfaz();
    }
    
    agregarEventosCalculadora() {
        const teclas = document.querySelectorAll('.tecla');
        const monto = document.getElementById('monto');
        const borrar = document.getElementById('borrar');
        const borrarUltimo = document.getElementById('borrar-ultimo');
        const agregar = document.getElementById('agregar');
        const finalizarVenta = document.getElementById('finalizar-venta');
        const vistaPrevia = document.getElementById('vista-previa');
        const operacionMultiplicar = document.querySelector('.operacion');
    
        teclas.forEach(tecla => {
            tecla.addEventListener('click', () => {
                monto.value += tecla.textContent;
            });
        });
    
        borrar.addEventListener('click', () => {
            monto.value = '';
        });
    
        borrarUltimo.addEventListener('click', () => {
            monto.value = monto.value.slice(0, -1);
        });
    
        operacionMultiplicar.addEventListener('click', () => {
            monto.value += ' * ';
        });
    
        agregar.addEventListener('click', () => {
            if (monto.value) {
                try {
                    const resultado = eval(monto.value);
                    this.app.ventas.agregarItem(parseFloat(resultado));
                    this.mostrarVistaPrevia();
                    monto.value = '';
                } catch (e) {
                    monto.value = 'Error';
                }
            }
        });
    
        finalizarVenta.addEventListener('click', () => {
            const venta = this.app.ventas.finalizarVenta(this.app.auth.obtenerUsuarioActual().nombre);
            this.mostrarBoleta(venta);
        });
    }
    
    mostrarVistaPrevia() {
        const vistaPrevia = document.getElementById('vista-previa');
        const items = this.app.ventas.ventaActual.items;
        let html = '';

        items.forEach((item, index) => {
            html += `
                <div class="item-venta">
                     <span>$${item.toLocaleString('es-CL')}</span> 
                    <button class="eliminar-monto" onclick="app.ui.eliminarItemVenta(${index})">Eliminar</button>
                </div>
            `;
        });

        vistaPrevia.innerHTML = html;
    }

    eliminarItemVenta(index) {
        this.app.ventas.eliminarItem(index);
        this.mostrarVistaPrevia();
    }

    mostrarBoleta(venta) {
        this.contenidoPrincipal.innerHTML = `
            <div class="boleta">
                <h4>Antigua Fuente</h4>
                <h4>Fecha: ${new Date(venta.fecha).toLocaleString()}</h4>
                <hr>
                <h4>Items:</h4>
                ${venta.items.map(item => `
                    <div class="boleta-item">
                        <span></span>
                        <span>$${item.toLocaleString('es-CL')}</span>
                    </div>
                `).join('')}
                <hr>
                <div class="boleta-totales">
                    <span>Total:</span>
                    <span>$${venta.total.toLocaleString('es-CL')}</span><!--Monto peso Chileno-->
                </div>
            <hr>
                <div class="boleta-totales">
                    <span>Propina Sugerida:10%</span>
                    <span>$${venta.propina.toLocaleString('es-CL')}</span><!--Monto peso chileno-->
                </div>
                <div class="boleta-totales">
                    <span>Subtotal:</span>
                    <span>$${venta.subtotal.toLocaleString('es-CL')}</span> <!--Monto peso Chileno-->
                </div>
            <hr>

            <h3>Código: ${venta.codigo}</h3>
            <div class="codigo-barra-container">
                 <svg id="barcode"></svg>
                </div>
            </div>
        </div>
        <div class="boleta-buttons">
            <button id="imprimir-boleta">Imprimir</button>
            <button id="volver-atras" class="btn-rojo">Atrás</button>
        </div>
        `;
        // Generar el código de barras
    JsBarcode("#barcode", venta.codigo, {
        format: "CODE128",
        displayValue: true,
        textAlign: "center",
        fontSize: 12,
        height: 40,
        width: 2,
        margin: 10,
    });
    
        document.getElementById('imprimir-boleta').addEventListener('click', () => {
            window.print();
        });
    
        document.getElementById('volver-atras').addEventListener('click', () => {
            this.mostrarNuevaVenta();
        });
    }

    resetearInterfaz() {
        this.userInfo.textContent = '';
        this.nav.innerHTML = '';
        this.contenidoPrincipal.innerHTML = '';
        this.mostrarLogin();
    }

    mostrarGestionUsuarios() {
        const usuarios = this.app.gestionUsuarios.obtenerUsuarios();
        const esAdminPrincipal = this.app.auth.esAdminPrincipal();
        let html = `
            <h2>Gestión de Usuarios</h2>
            <form id="form-nuevo-usuario">
                <input type="text" id="nombre" placeholder="Nombre" required>
                <input type="text" id="apellido" placeholder="Apellido" required>
                <input type="text" id="usuario" placeholder="Usuario" required>
                <input type="password" id="contraseña" placeholder="Contraseña" required>
                <input type="text" id="codigoVendedor" placeholder="Código Vendedor">
                <select id="rol" required>
                    <option value="" disabled selected>Seleccione un rol</option>
                    <option value="admin">Admin</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="cajero">Cajero</option>
                </select>
                <button type="submit">Registrar Usuario</button>
                <div id="mensaje-error" style="color: red;"></div>
            </form>
            <h3>Usuarios Existentes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Usuario</th>
                        <th>Código Vendedor</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        usuarios.forEach(usuario => {
            html += `
                <tr>
                    <td data-label="Nombre">${usuario.nombre}</td>
                    <td data-label="Apellido">${usuario.apellido}</td>
                    <td data-label="Usuario">${usuario.usuario}</td>
                    <td data-label="Código Vendedor">${usuario.codigoVendedor || '-'}</td>
                    <td data-label="Rol">${usuario.rol}</td>
                    <td data-label="Estado">${usuario.activo ? 'Activo' : 'Inactivo'}</td>
                    <td data-label="Acciones">
                        ${esAdminPrincipal ? `<button class="btn-verde" onclick="app.ui.mostrarClave('${usuario.contraseña}')">Ver Clave</button>` : ''}
                        ${esAdminPrincipal ? `<button class="btn-verde" onclick="app.ui.editarUsuario(${usuario.id})">Editar</button>` : ''}
                        <button class="btn-verde" onclick="app.cambiarEstadoUsuario(${usuario.id}, ${!usuario.activo})">
                            ${usuario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        ${esAdminPrincipal && usuario.rol !== 'admin_principal' ? `<button class="btn-rojo" onclick="app.eliminarUsuario(${usuario.id})">Eliminar</button>` : ''}
                    </td>
                </tr>
            `;
        });
    
        html += '</tbody></table>';
        this.contenidoPrincipal.innerHTML = html;
    
        document.getElementById('form-nuevo-usuario').addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const usuario = document.getElementById('usuario').value;
            const contraseña = document.getElementById('contraseña').value;
            const codigoVendedor = document.getElementById('codigoVendedor').value;
            const rol = document.getElementById('rol').value;
    
            try {
                this.app.gestionUsuarios.registrarUsuario(nombre, apellido, usuario, contraseña, codigoVendedor, rol);
                this.mostrarGestionUsuarios();  // Actualizar la lista después de agregar
            } catch (error) {
                document.getElementById('mensaje-error').textContent = error.message;
            }
        });
    }
    

    mostrarClave(clave) {
        alert(`La clave es: ${clave}`);
    }

    editarUsuario(id) {
        const usuario = this.app.gestionUsuarios.obtenerUsuarios().find(u => u.id === id);
        if (usuario) {
            const nombre = prompt('Nuevo nombre:', usuario.nombre);
            const apellido = prompt('Nuevo apellido:', usuario.apellido);
            const usuarioStr = prompt('Nuevo usuario:', usuario.usuario);
            const contraseña = prompt('Nueva contraseña:', usuario.contraseña);
            const codigoVendedor = prompt('Nuevo código de vendedor (si aplica):', usuario.codigoVendedor);
            const rol = prompt('Nuevo rol (admin, vendedor, cajero):', usuario.rol);

            if (confirm('¿Está seguro que desea editar este usuario?')) {
                try {
                    usuario.nombre = nombre;
                    usuario.apellido = apellido;
                    usuario.usuario = usuarioStr;
                    usuario.contraseña = contraseña;
                    usuario.codigoVendedor = codigoVendedor;
                    usuario.rol = rol;
                    this.app.gestionUsuarios.guardarUsuarios();
                    this.mostrarGestionUsuarios();
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    }

    mostrarPanelCajero() {
        this.contenidoPrincipal.innerHTML = `
            <h2>Panel de Cajero</h2>
        `;
        document.getElementById('ver-ventas').addEventListener('click', () => this.mostrarVentas());
        // Añadir otros event listeners según sea necesario
    }

    mostrarPanelAdmin() {
        this.contenidoPrincipal.innerHTML = `
            <h2>Administrador</h2>
            <!-- No necesitamos botones aquí, están en la navegación -->
        `;
    }

    mostrarVentas() {
        let html = `
            <h2>Ventas Realizadas</h2>
            <div>
                <label for="fecha-desde">Desde:</label>
                <input type="date" id="fecha-desde">
                <label for="fecha-hasta">Hasta:</label>
                <input type="date" id="fecha-hasta">
                <button id="filtrar-ventas">Filtrar</button>
            </div>
            <table id="tabla-ventas">
                <tr>
                    <th>Código</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Vendedor</th>
                </tr>
            </table>
        `;

        this.contenidoPrincipal.innerHTML = html;

        document.getElementById('filtrar-ventas').addEventListener('click', () => {
            const desde = new Date(document.getElementById('fecha-desde').value);
            const hasta = new Date(document.getElementById('fecha-hasta').value);
            this.mostrarVentasFiltradas(desde, hasta);
        });

        // Mostrar todas las ventas inicialmente
        this.mostrarVentasFiltradas();
    }

    mostrarVentasFiltradas(desde = null, hasta = null) {
        const ventas = this.app.ventas.obtenerVentas();
        let ventasFiltradas = ventas;

        if (desde && hasta) {
            ventasFiltradas = ventas.filter(venta => {
                const fechaVenta = new Date(venta.fecha);
                return fechaVenta >= desde && fechaVenta <= hasta;
            });
        }

        const tablaVentas = document.getElementById('tabla-ventas');
        let html = `
            <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Vendedor</th>
            </tr>
        `;

        ventasFiltradas.forEach(venta => {
            html += `
                <tr>
                    <td>${venta.codigo}</td>
                    <td>${new Date(venta.fecha).toLocaleString()}</td>
                    <td>$${venta.total.toFixed(2)}</td>
                    <td>${venta.vendedor}</td>
                </tr>
            `;
        });

        tablaVentas.innerHTML = html;
    }

    mostrarEscanearVenta() {
        this.contenidoPrincipal.innerHTML = `
            <h2>Escanear Venta</h2>
            <div class="escanear-venta-container">
                <input type="text" id="codigo-boleta" placeholder="Código de Boleta" required>
                <button id="buscar-boleta">Buscar Boleta</button>
                <div id="resultado-boleta"></div>
            </div>
        `;
    
        document.getElementById('buscar-boleta').addEventListener('click', () => {
            const codigoBoleta = document.getElementById('codigo-boleta').value;
            const venta = this.app.ventas.buscarVenta(codigoBoleta);
    
            if (venta) {
                this.mostrarResultadoBoleta(venta);
            } else {
                document.getElementById('resultado-boleta').innerHTML = '<p>No se encontró la boleta.</p>';
            }
        });
    }
    
    mostrarResultadoBoleta(venta) {
        document.getElementById('resultado-boleta').innerHTML = `
            <div class="boleta">
                <h3>Código: ${venta.codigo}</h3>
                <h4>Fecha: ${new Date(venta.fecha).toLocaleString()}</h4>
                <hr>
                <h4>Items:</h4>
                ${venta.items.map(item => `<div>$${item.toFixed(2)}</div>`).join('')}
                <hr>
                <h4>Total: $${venta.total.toFixed(2)}</h4>
                <h4>Propina Sugerida: $${venta.propina.toFixed(2)}</h4>
                <h4>Subtotal: $${venta.subtotal.toFixed(2)}</h4>
                <button id="confirmar-venta">Confirmar Venta</button>
                <button id="cancelar-venta" class="btn-rojo">Cancelar Venta</button>
                <button id="proceder-pago">Proceder al Pago</button>
            </div>
        `;
    
        document.getElementById('confirmar-venta').addEventListener('click', () => {
            this.confirmarVenta(venta);
        });
    
        document.getElementById('cancelar-venta').addEventListener('click', () => {
            this.cancelarVenta(venta);
        });
    
        document.getElementById('proceder-pago').addEventListener('click', () => {
            this.mostrarOpcionesPago(venta);
        });
    }
    
    mostrarOpcionesPago(venta) {
        this.contenidoPrincipal.innerHTML = `
            <h2>Opciones de Pago</h2>
            <div class="opciones-pago">
                <label>
                    <input type="radio" name="metodo-pago" value="efectivo" checked> Efectivo
                </label>
                <label>
                    <input type="radio" name="metodo-pago" value="electronico"> Pago Electrónico
                </label>
                <div id="opciones-propina">
                    <h4>Propina</h4>
                    <button id="propina-sugerida">Propina Sugerida (10%)</button>
                    <button id="propina-diferente">Propina Diferente (Porcentaje)</button>
                    <button id="propina-especifica">Propina Específica (Monto)</button>
                </div>
            </div>
            <button id="confirmar-pago">Confirmar Pago</button>
        `;
    
        document.getElementById('propina-sugerida').addEventListener('click', () => {
            this.confirmarPago(venta, venta.propina);
        });
    
        document.getElementById('propina-diferente').addEventListener('click', () => {
            const porcentaje = prompt('Ingrese el porcentaje de propina:');
            if (porcentaje) {
                const propina = venta.total * (parseFloat(porcentaje) / 100);
                this.confirmarPago(venta, propina);
            }
        });
    
        document.getElementById('propina-especifica').addEventListener('click', () => {
            const monto = prompt('Ingrese el monto de propina:');
            if (monto) {
                this.confirmarPago(venta, parseFloat(monto));
            }
        });
    
        document.getElementById('confirmar-pago').addEventListener('click', () => {
            const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
            if (metodoPago === 'efectivo') {
                this.confirmarPago(venta, venta.propina);
            } else {
                alert('Seleccione una opción de propina primero.');
            }
        });
    }
    
    confirmarPago(venta, propina) {
        venta.propina = propina;
        venta.subtotal = venta.total + propina;
        this.app.ventas.actualizarVenta(venta);
        alert('Pago confirmado');
        this.resetearInterfaz();
    }
    
}

