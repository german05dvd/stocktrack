export const datosEjemplo = [
  {
    id: '1',
    nombre: 'Arroz Premium',
    categoria: 'Granos',
    cantidad: 45,
    precioCosto: 120,
    precioVenta: 150,
    proveedor: 'Importadora Caribe',
    stockMinimo: 20,
    fechaRegistro: '2024-01-15',
    movimientos: [
      { tipo: 'entrada', cantidad: 50, fecha: '2024-01-15', nota: 'Compra inicial' },
      { tipo: 'salida', cantidad: 5, fecha: '2024-01-16', nota: 'Venta' }
    ]
  },
  {
    id: '2',
    nombre: 'Frijoles Negros',
    categoria: 'Granos',
    cantidad: 8,
    precioCosto: 85,
    precioVenta: 110,
    proveedor: 'Granos del Oriente',
    stockMinimo: 15,
    fechaRegistro: '2024-01-10',
    movimientos: [
      { tipo: 'entrada', cantidad: 30, fecha: '2024-01-10', nota: 'Compra inicial' },
      { tipo: 'salida', cantidad: 22, fecha: '2024-01-14', nota: 'Ventas varias' }
    ]
  },
  {
    id: '3',
    nombre: 'Aceite de Girasol',
    categoria: 'Aceites',
    cantidad: 120,
    precioCosto: 450,
    precioVenta: 550,
    proveedor: 'CIF S.A.',
    stockMinimo: 30,
    fechaRegistro: '2024-01-20',
    movimientos: [
      { tipo: 'entrada', cantidad: 120, fecha: '2024-01-20', nota: 'Compra inicial' }
    ]
  }
];