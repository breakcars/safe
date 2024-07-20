class Ventas {
    constructor() {
        this.ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        this.ventaActual = { items: [], total: 0 };
        this.contadorVentas = this.ventas.length;
    }

    agregarItem(monto) {
        this.ventaActual.items.push(monto);
        this.ventaActual.total += monto;
    }

    eliminarItem(index) {
        const montoEliminado = this.ventaActual.items[index];
        this.ventaActual.items.splice(index, 1);
        this.ventaActual.total -= montoEliminado;
    }

    finalizarVenta(vendedor) {
        this.contadorVentas++;
        const codigoBoleta = `B-${this.contadorVentas.toString().padStart(6, '0')}`;
        const propinaSugerida = this.ventaActual.total * 0.1;
        const subtotal = this.ventaActual.total + propinaSugerida;

        const venta = {
            codigo: codigoBoleta,
            items: this.ventaActual.items,
            total: this.ventaActual.total,
            propina: propinaSugerida,
            subtotal: subtotal,
            fecha: new Date(),
            vendedor: vendedor
        };

        this.ventas.push(venta);
        this.guardarVentas();
        this.ventaActual = { items: [], total: 0 };
        return venta;
    }

    buscarVenta(codigo) {
        return this.ventas.find(venta => venta.codigo === codigo);
    }

    actualizarVenta(ventaActualizada) {
        const index = this.ventas.findIndex(venta => venta.codigo === ventaActualizada.codigo);
        if (index !== -1) {
            this.ventas[index] = ventaActualizada;
            this.guardarVentas();
        }
    }

    obtenerVentas() {
        return this.ventas;
    }

    guardarVentas() {
        localStorage.setItem('ventas', JSON.stringify(this.ventas));
    }
    buscarVenta(codigo) {
        return this.ventas.find(venta => venta.codigo === codigo);
    }
    
    actualizarVenta(ventaActualizada) {
        const index = this.ventas.findIndex(venta => venta.codigo === ventaActualizada.codigo);
        if (index !== -1) {
            this.ventas[index] = ventaActualizada;
            this.guardarVentas();
        }
    }
    
}
