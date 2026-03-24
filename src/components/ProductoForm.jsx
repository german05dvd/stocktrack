import React, { useState, useEffect } from 'react';
import { generarId, fechaActual } from '../utils/inventarioUtils';

const ProductoForm = ({ producto, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    cantidad: 0,
    unidad: 'und',
    precioCosto: '',
    precioVenta: '',
    proveedor: '',
    stockMinimo: 10,
    descripcion: '',
    fechaRegistro: '',
    movimientos: []
  });

  useEffect(() => {
    if (producto) {
      setFormData(producto);
    } else {
      setFormData(prev => ({
        ...prev,
        id: generarId(),
        fechaRegistro: fechaActual()
      }));
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'stockMinimo' || name.includes('precio') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoria) {
      alert('Por favor completa el nombre y categoría del producto.');
      return;
    }

    if (formData.precioVenta < formData.precioCosto) {
      alert('El precio de venta no puede ser menor que el precio de costo.');
      return;
    }

    onSubmit(formData);
  };

  const categoriasSugeridas = ['Granos', 'Aceites', 'Lácteos', 'Carnes', 'Bebidas', 'Limpieza', 'Otros'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label>Nombre del producto *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Arroz Premium"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría *</label>
          <input
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Ej: Granos"
            list="categorias"
            required
          />
          <datalist id="categorias">
            {categoriasSugeridas.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Cantidad inicial</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Unidad</label>
          <select name="unidad" value={formData.unidad} onChange={handleChange}>
            <option value="und">Unidades</option>
            <option value="kg">Kilogramos</option>
            <option value="lb">Libras</option>
            <option value="lt">Litros</option>
            <option value="caja">Cajas</option>
            <option value="saco">Sacos</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Precio de costo ($) *</label>
          <input
            type="number"
            name="precioCosto"
            value={formData.precioCosto}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Precio de venta ($) *</label>
          <input
            type="number"
            name="precioVenta"
            value={formData.precioVenta}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Proveedor *</label>
          <input
            type="text"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            placeholder="Nombre del proveedor"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock mínimo (alerta)</label>
          <input
            type="number"
            name="stockMinimo"
            value={formData.stockMinimo}
            onChange={handleChange}
            min="1"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descripción (opcional)</label>
        <input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Notas adicionales sobre el producto"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          {producto ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;