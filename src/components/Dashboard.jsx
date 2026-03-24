import React from 'react';
import { Package, TrendingUp, AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';
import { 
  calcularValorInventario, 
  calcularValorVentas, 
  calcularGananciaPotencial,
  obtenerStockBajo,
  formatCurrency 
} from '../utils/inventarioUtils';

const Dashboard = ({ productos }) => {
  const totalProductos = productos.length;
  const valorInventario = calcularValorInventario(productos);
  const valorVentas = calcularValorVentas(productos);
  const gananciaPotencial = calcularGananciaPotencial(productos);
  const productosStockBajo = obtenerStockBajo(productos, 10);
  const totalUnidades = productos.reduce((sum, p) => sum + p.cantidad, 0);

  // Calcular productos más movidos (por cantidad de movimientos)
  const productosTop = [...productos]
    .sort((a, b) => (b.movimientos?.length || 0) - (a.movimientos?.length || 0))
    .slice(0, 5);

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Productos</h3>
            <p>{totalProductos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <h3>Unidades en Stock</h3>
            <p>{totalUnidades}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3>Valor del Inventario</h3>
            <p>{formatCurrency(valorInventario)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Ganancia Potencial</h3>
            <p>{formatCurrency(gananciaPotencial)}</p>
          </div>
        </div>
      </div>

      {productosStockBajo.length > 0 && (
        <div className="alert alert-warning">
          <AlertTriangle size={20} />
          <div>
            <strong>¡Atención!</strong> Tienes {productosStockBajo.length} producto(s) con stock bajo.
          </div>
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} />
            Productos con más movimientos
          </h3>
          {productosTop.length === 0 ? (
            <p style={{ color: '#64748b' }}>No hay movimientos registrados aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Movimientos</th>
                  <th>Stock actual</th>
                </tr>
              </thead>
              <tbody>
                {productosTop.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.movimientos?.length || 0}</td>
                    <td>{p.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            Stock bajo (≤10 unidades)
          </h3>
          {productosStockBajo.length === 0 ? (
            <p style={{ color: '#64748b' }}>✓ Todos los productos tienen stock suficiente.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {productosStockBajo.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td style={{ color: '#dc2626', fontWeight: 600 }}>{p.cantidad}</td>
                    <td>{p.stockMinimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;