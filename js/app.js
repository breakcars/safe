class App {
    constructor() {
        this.auth = new Auth();
        this.ventas = new Ventas();
        this.gestionUsuarios = new GestionUsuarios(this.auth);
        this.ui = new UI(this);
        this.iniciar();
    }

    iniciar() {
        const usuarioActual = this.auth.obtenerUsuarioActual();
        if (usuarioActual) {
            this.ui.actualizarNavegacion();
            const rol = usuarioActual.rol;
            if (rol === 'vendedor') {
                this.ui.mostrarNuevaVenta();
            } else if (rol === 'cajero') {
                this.ui.mostrarPanelCajero();
            } else if (rol === 'admin' || rol === 'admin_principal') {
                this.ui.mostrarPanelAdmin();
            }
        } else {
            this.ui.mostrarLogin();
        }
    }

    iniciarSesion() {
        const usuario = document.getElementById('usuario').value;
        const contraseña = document.getElementById('contraseña').value;
        if (this.auth.login(usuario, contraseña)) {
            this.ui.actualizarNavegacion();
            const rol = this.auth.obtenerUsuarioActual().rol;
            if (rol === 'vendedor') {
                this.ui.mostrarNuevaVenta();
            } else if (rol === 'cajero') {
                this.ui.mostrarPanelCajero();
            } else if (rol === 'admin' || rol === 'admin_principal') {
                this.ui.mostrarPanelAdmin();
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    }

    cerrarSesion() {
        this.auth.logout();
        this.ui.resetearInterfaz();
    }

    mostrarNuevaVenta() {
        this.ui.mostrarNuevaVenta();
    }

    cambiarEstadoUsuario(id, activo) {
        this.gestionUsuarios.cambiarEstadoUsuario(id, activo);
        this.ui.mostrarGestionUsuarios();
    }

    eliminarUsuario(id) {
        if (confirm('¿Está seguro que desea eliminar este usuario?')) {
            this.auth.eliminarUsuario(id);
            this.ui.mostrarGestionUsuarios();
        }
    }

    guardarConfiguracionImpresora(macImpresora) {
        localStorage.setItem('configuracionImpresora', JSON.stringify({ macImpresora }));
    }

    obtenerConfiguracionImpresora() {
        return JSON.parse(localStorage.getItem('configuracionImpresora'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
