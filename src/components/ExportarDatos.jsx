import React from 'react';
import { Download, FileSpreadsheet, FileJson, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils/inventarioUtils';

const ExportarDatos = ({ productos }) => {
  const exportarExcel = () => {
    // Preparar datos para Excel
    const datos = productos.map(p => ({
      'ID': p.id,
      'Nombre': p.nombre,
      'Categoría': p.categoria,
      'Cantidad': p.cantidad,
      'Unidad': p.unidad,
      'Precio Costo': p.precioCosto,
      'Precio Venta': p.precioVenta,
      'Proveedor': p.proveedor,
      'Stock Mínimo': p.stockMinimo,
      'Valor Inventario': p.cantidad * p.precioCosto,
      'Valor Ventas Potencial': p.cantidad * p.precioVenta,
      'Descripción': p.descripcion || '',
      'Fecha Registro': p.fechaRegistro
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    
    // Ajustar anchos de columna
    const colWidths = [
      { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 10 },
      { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
      { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 30 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `StockTrack_Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportarJSON = () => {
    const dataStr = JSON.stringify(productos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StockTrack_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importarJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const datos = JSON.parse(event.target.result);
        if (Array.isArray(datos)) {
          if (window.confirm(`¿Importar ${datos.length} productos? Esto reemplazará los datos actuales.`)) {
            localStorage.setItem('stocktrack_productos', JSON.stringify(datos));
            window.location.reload(); // Recargar para aplicar cambios
          }
        } else {
          alert('El archivo no contiene un formato válido.');
        }
      } catch (error) {
        alert('Error al leer el archivo: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const limpiarDatos = () => {
    if (window.confirm('⚠️ ¿ESTÁS SEGURO? Esto eliminará TODOS los productos permanentemente.')) {
      if (window.confirm('Doble confirmación: ¿Realmente quieres borrar todo?')) {
        localStorage.removeItem('stocktrack_productos');
        window.location.reload();
      }
    }
  };

  const totalProductos = productos.length;
  const valorTotal = productos.reduce((sum, p) => sum + (p.cantidad * p.precioCosto), 0);

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileSpreadsheet size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Productos</h3>
            <p>{totalProductos}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Download size={24} />
          </div>
          <div className="stat-info">
            <h3>Valor Inventario</h3>
            <p>{formatCurrency(valorTotal)}</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={20} />
            Exportar a Excel
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Descarga un archivo .xlsx con todos los productos, listo para abrir en Excel o LibreOffice.
          </p>
          <button className="btn btn-primary" onClick={exportarExcel} style={{ width: '100%' }}>
            <Download size={18} style={{ marginRight: '0.5rem' }} />
            Descargar Excel
          </button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileJson size={20} />
            Backup / Restaurar
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Exporta o importa todos los datos en formato JSON para respaldo.
          </p>
          
          <button className="btn btn-secondary" onClick={exportarJSON} style={{ width: '100%', marginBottom: '1rem' }}>
            <Download size={18} style={{ marginRight: '0.5rem' }} />
            Descargar JSON (Backup)
          </button>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <label className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
              <input 
                type="file" 
                accept=".json" 
                onChange={importarJSON} 
                style={{ display: 'none' }} 
              />
              Restaurar desde archivo
            </label>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', borderColor: '#fecaca' }}>
        <h3 style={{ marginBottom: '1rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trash2 size={20} />
          Zona de peligro
        </h3>
        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
          Elimina todos los datos permanentemente. Esta acción no se puede deshacer.
        </p>
        <button className="btn btn-danger" onClick={limpiarDatos}>
          Limpiar todos los datos
        </button>
      </div>
    </div>
  );
};

export default ExportarDatos;