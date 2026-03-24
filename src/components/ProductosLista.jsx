import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Minus, Search, History, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../utils/inventarioUtils';

const ProductosLista = ({ productos, onEdit, onDelete, onMovimiento }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const categorias = [...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                         p.proveedor.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = !filtroCategoria || p.categoria === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  const getStockBadge = (cantidad, minimo) => {
    if (cantidad <= minimo) return <span className="badge badge-red">Bajo</span>;
    if (cantidad <= minimo * 1.5) return <span className="badge badge-yellow">Medio</span>;
    return <span className="badge badge-green">OK</span>;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Buscar producto o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        <select 
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra búsqueda o agrega un nuevo producto.</p>
        </div>
      ) : (
        <div>
          {productosFiltrados.map(producto => (
            <div 
              key={producto.id} 
              className="card"
              style={{ 
                marginBottom: '0.75rem',
                borderLeft: producto.cantidad <= producto.stockMinimo ? '4px solid #ef4444' : '4px solid transparent'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{producto.nombre}</h3>
                    {getStockBadge(producto.cantidad, producto.stockMinimo)}
                  </div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                    {producto.categoria} • {producto.proveedor}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    {producto.cantidad} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>{producto.unidad}</span>
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    {formatCurrency(producto.precioVenta)} / {producto.unidad}
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => toggleExpand(producto.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <History size={16} />
                  Historial
                  {expandedId === producto.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <div className="actions">
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => onMovimiento(producto)}
                    title="Entrada/Salida"
                  >
                    <Plus size={14} /> <Minus size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => onEdit(producto)}
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(producto.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Historial expandido */}
              {expandedId === producto.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  {producto.movimientos?.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                      Sin movimientos registrados
                    </p>
                  ) : (
                    <table style={{ fontSize: '0.875rem' }}>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Tipo</th>
                          <th>Cantidad</th>
                          <th>Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...producto.movimientos].reverse().slice(0, 5).map((mov, idx) => (
                          <tr key={idx}>
                            <td>{mov.fecha}</td>
                            <td>
                              <span className={`badge ${mov.tipo === 'entrada' ? 'badge-green' : 'badge-yellow'}`}>
                                {mov.tipo === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{mov.cantidad}</td>
                            <td style={{ color: '#64748b' }}>{mov.nota}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {producto.movimientos?.length > 5 && (
                    <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Y {producto.movimientos.length - 5} movimientos más...
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosLista;