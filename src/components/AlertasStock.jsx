import React, { useState } from 'react';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { obtenerStockBajo, formatCurrency } from '../utils/inventarioUtils';

const AlertasStock = ({ productos }) => {
  const [umbral, setUmbral] = useState(10);
  
  const productosStockBajo = obtenerStockBajo(productos, umbral);
  const productosAgotados = productos.filter(p => p.cantidad === 0);
  const productosCriticos = productos.filter(p => p.cantidad > 0 && p.cantidad <= umbral / 2);

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            Configuración de alertas
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ margin: 0 }}>Umbral de stock bajo:</label>
            <input
              type="number"
              value={umbral}
              onChange={(e) => setUmbral(parseInt(e.target.value) || 0)}
              style={{ width: '80px' }}
              min="1"
            />
            <span>unidades</span>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon red">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Productos agotados</h3>
            <p style={{ color: '#dc2626' }}>{productosAgotados.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <h3>Stock crítico (≤{Math.floor(umbral/2)})</h3>
            <p style={{ color: '#d97706' }}>{productosCriticos.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>Stock bajo (≤{umbral})</h3>
            <p>{productosStockBajo.length}</p>
          </div>
        </div>
      </div>

      {productosStockBajo.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3>¡Todo en orden!</h3>
          <p style={{ color: '#64748b' }}>
            No hay productos con stock bajo. Todos tienen más de {umbral} unidades.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Faltante estimado</th>
                <th>Proveedor</th>
                <th>Último movimiento</th>
              </tr>
            </thead>
            <tbody>
              {productosStockBajo.map(p => {
                const faltante = Math.max(0, p.stockMinimo - p.cantidad);
                const ultimoMov = p.movimientos?.length > 0 
                  ? p.movimientos[p.movimientos.length - 1] 
                  : null;
                
                return (
                  <tr key={p.id} style={p.cantidad === 0 ? { background: '#fef2f2' } : {}}>
                    <td>
                      <strong>{p.nombre}</strong>
                      {p.cantidad === 0 && (
                        <span className="badge badge-red" style={{ marginLeft: '0.5rem' }}>AGOTADO</span>
                      )}
                    </td>
                    <td>{p.categoria}</td>
                    <td style={{ 
                      fontWeight: 600, 
                      color: p.cantidad === 0 ? '#dc2626' : p.cantidad <= umbral/2 ? '#d97706' : '#2563eb'
                    }}>
                      {p.cantidad} {p.unidad}
                    </td>
                    <td>{p.stockMinimo} {p.unidad}</td>
                    <td style={{ color: '#dc2626', fontWeight: 500 }}>
                      {faltante > 0 ? `${faltante} ${p.unidad}` : '—'}
                    </td>
                    <td>{p.proveedor}</td>
                    <td style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {ultimoMov ? (
                        <>
                          {ultimoMov.tipo === 'entrada' ? '↑' : '↓'} {ultimoMov.cantidad} {p.unidad}
                          <br />
                          {ultimoMov.fecha}
                        </>
                      ) : (
                        'Sin movimientos'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlertasStock;