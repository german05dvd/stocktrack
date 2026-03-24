import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { fechaActual } from '../utils/inventarioUtils';

const MovimientoForm = ({ producto, onSubmit, onCancel }) => {
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor que cero.');
      return;
    }

    if (tipo === 'salida' && cantidad > producto.cantidad) {
      alert(`No puedes retirar ${cantidad} unidades. Solo hay ${producto.cantidad} disponibles.`);
      return;
    }

    const movimiento = {
      id: Date.now().toString(),
      tipo,
      cantidad: parseInt(cantidad),
      fecha: fechaActual(),
      nota: nota || (tipo === 'entrada' ? 'Entrada de stock' : 'Salida de stock')
    };

    onSubmit(movimiento);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>{producto.nombre}</h4>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Stock actual: <strong>{producto.cantidad} {producto.unidad}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de movimiento</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className={`btn ${tipo === 'entrada' ? 'btn-success' : 'btn-secondary'}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setTipo('entrada')}
            >
              <ArrowUpCircle size={18} style={{ marginRight: '0.5rem' }} />
              Entrada
            </button>
            <button
              type="button"
              className={`btn ${tipo === 'salida' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setTipo('salida')}
            >
              <ArrowDownCircle size={18} style={{ marginRight: '0.5rem' }} />
              Salida
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            min="1"
            max={tipo === 'salida' ? producto.cantidad : undefined}
            required
          />
          {tipo === 'salida' && (
            <small style={{ color: '#64748b' }}>
              Máximo disponible: {producto.cantidad} {producto.unidad}
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Nota / Motivo</label>
          <input
            type="text"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder={tipo === 'entrada' ? 'Ej: Compra a proveedor' : 'Ej: Venta cliente #123'}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className={`btn ${tipo === 'entrada' ? 'btn-success' : 'btn-danger'}`} style={{ flex: 1 }}>
            Registrar {tipo === 'entrada' ? 'entrada' : 'salida'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovimientoForm;