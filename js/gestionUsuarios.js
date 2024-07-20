class GestionUsuarios {
    constructor(auth) {
        this.auth = auth;
    }

    registrarUsuario(nombre, apellido, usuario, contraseña, codigoVendedor, rol) {
        return this.auth.registrarUsuario(nombre, apellido, usuario, contraseña, codigoVendedor, rol);
    }

    obtenerUsuarios() {
        return this.auth.obtenerUsuarios();
    }

    cambiarEstadoUsuario(id, activo) {
        this.auth.cambiarEstadoUsuario(id, activo);
    }

    guardarUsuarios() {
        this.auth.guardarUsuarios();
    }
}
