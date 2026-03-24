// Calcular valor total del inventario
export const calcularValorInventario = (productos) => {
  return productos.reduce((total, prod) => {
    return total + (prod.cantidad * prod.precioCosto);
  }, 0);
};

// Calcular valor potencial de ventas
export const calcularValorVentas = (productos) => {
  return productos.reduce((total, prod) => {
    return total + (prod.cantidad * prod.precioVenta);
  }, 0);
};

// Calcular ganancia potencial
export const calcularGananciaPotencial = (productos) => {
  return productos.reduce((total, prod) => {
    const gananciaPorUnidad = prod.precioVenta - prod.precioCosto;
    return total + (prod.cantidad * gananciaPorUnidad);
  }, 0);
};

// Obtener productos con stock bajo
export const obtenerStockBajo = (productos, umbral = 10) => {
  return productos.filter(prod => prod.cantidad <= umbral);
};

// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CU', {
    style: 'currency',
    currency: 'CUP',
    minimumFractionDigits: 2
  }).format(amount);
};

// Generar ID único
export const generarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Fecha actual formateada
export const fechaActual = () => {
  return new Date().toISOString().split('T')[0];
};