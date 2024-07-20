class Auth {
    constructor() {
        this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
            {
                id: 1,
                nombre: 'Administrador',
                apellido: 'General',
                usuario: 'admin',
                contraseña: '12345678',
                rol: 'admin_principal',
                activo: true
            }
        ];
        this.usuarioActual = null;
    }

    login(usuario, contraseña) {
        const usuarioEncontrado = this.usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña && u.activo);
        if (usuarioEncontrado) {
            this.usuarioActual = usuarioEncontrado;
            return true;
        }
        return false;
    }

    logout() {
        this.usuarioActual = null;
    }

    obtenerUsuarioActual() {
        return this.usuarioActual;
    }

    esAdmin() {
        return this.usuarioActual && (this.usuarioActual.rol === 'admin' || this.usuarioActual.rol === 'admin_principal');
    }

    esAdminPrincipal() {
        return this.usuarioActual && this.usuarioActual.rol === 'admin_principal';
    }

    validarNombreApellido(nombre) {
        const regex = /^[a-zA-Z]+$/;
        return regex.test(nombre);
    }

    validarClave(clave) {
        const regex = /^(?=.*[A-Za-z]{4,})(?=.*[0-9!@#\$%\^\&*\)\(+=._-]{2,}).{4,10}$/;
        return regex.test(clave);
    }

    registrarUsuario(nombre, apellido, usuario, contraseña, codigoVendedor, rol) {
        if (!this.validarNombreApellido(nombre) || !this.validarNombreApellido(apellido)) {
            throw new Error('Nombre y apellido deben contener solo letras.');
        }
        if (!this.validarClave(contraseña)) {
            throw new Error('La contraseña debe tener entre 4 y 10 caracteres, con al menos 4 letras y 2 números o caracteres especiales.');
        }
        if (rol === 'vendedor' && !codigoVendedor) {
            throw new Error('El código de vendedor es obligatorio para el rol de vendedor.');
        }
        if (!['admin', 'vendedor', 'cajero'].includes(rol)) {
            throw new Error('Rol no válido');
        }
        const nuevoId = Math.max(...this.usuarios.map(u => u.id)) + 1;
        const nuevoUsuario = { id: nuevoId, nombre, apellido, usuario, contraseña, codigoVendedor, rol, activo: true };
        this.usuarios.push(nuevoUsuario);
        this.guardarUsuarios();
        return nuevoUsuario;
    }

    cambiarEstadoUsuario(id, activo) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (usuario && usuario.rol !== 'admin_principal') {
            usuario.activo = activo;
            this.guardarUsuarios();
        }
    }

    obtenerUsuarios() {
        return this.usuarios;
    }

    guardarUsuarios() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }

    eliminarUsuario(id) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (usuario && usuario.rol !== 'admin_principal') {
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.guardarUsuarios();
        }
    }
}
