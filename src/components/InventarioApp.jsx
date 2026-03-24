import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import { datosEjemplo } from '../data/datosEjemplo';
import Dashboard from './Dashboard';
import ProductosLista from './ProductosLista';
import ProductoForm from './ProductoForm';
import MovimientoForm from './MovimientoForm';
import AlertasStock from './AlertasStock';
import ExportarDatos from './ExportarDatos';
import InstallPWA from './InstallPWA';
import Toast from './Toast';

const InventarioApp = () => {
  const [productos, setProductos] = useLocalStorage('stocktrack_productos', []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  // Cargar datos de ejemplo si está vacío
  useEffect(() => {
    if (productos.length === 0) {
      setProductos(datosEjemplo);
      showToast('Datos de ejemplo cargados', 'info', 5000);
    }
  }, []);

  const handleAddProduct = (producto) => {
    setProductos([...productos, producto]);
    setShowModal(false);
    showToast('Producto creado exitosamente', 'success');
  };

  const handleUpdateProduct = (productoActualizado) => {
    setProductos(productos.map(p => p.id === productoActualizado.id ? productoActualizado : p));
    setShowModal(false);
    setSelectedProduct(null);
    showToast('Producto actualizado', 'success');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
      showToast('Producto eliminado', 'info');
    }
  };

  const handleMovimiento = (productoId, movimiento) => {
    setProductos(productos.map(p => {
      if (p.id === productoId) {
        const nuevaCantidad = movimiento.tipo === 'entrada' 
          ? p.cantidad + movimiento.cantidad
          : p.cantidad - movimiento.cantidad;
        
        return {
          ...p,
          cantidad: Math.max(0, nuevaCantidad),
          movimientos: [...(p.movimientos || []), movimiento]
        };
      }
      return p;
    }));
    setShowModal(false);
    setSelectedProduct(null);
    showToast(
      `${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada: ${movimiento.cantidad} unidades`,
      'success'
    );
  };

  const openModal = (type, producto = null) => {
    setModalType(type);
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard productos={productos} />;
      case 'productos':
        return (
          <ProductosLista 
            productos={productos} 
            onEdit={(p) => openModal('edit', p)}
            onDelete={handleDeleteProduct}
            onMovimiento={(p) => openModal('movimiento', p)}
          />
        );
      case 'alertas':
        return <AlertasStock productos={productos} />;
      case 'exportar':
        return <ExportarDatos productos={productos} />;
      default:
        return <Dashboard productos={productos} />;
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>
          <Package size={28} />
          StockTrack MIPYME
        </h1>
        <button 
          className="btn btn-primary"
          onClick={() => openModal('add')}
        >
          + Nuevo Producto
        </button>
      </header>

      <div className="main-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={18} style={{ marginRight: '0.5rem' }} />
            Resumen
          </button>
          <button 
            className={`tab ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            <Package size={18} style={{ marginRight: '0.5rem' }} />
            Productos
          </button>
          <button 
            className={`tab ${activeTab === 'alertas' ? 'active' : ''}`}
            onClick={() => setActiveTab('alertas')}
          >
            <AlertTriangle size={18} style={{ marginRight: '0.5rem' }} />
            Alertas
          </button>
          <button 
            className={`tab ${activeTab === 'exportar' ? 'active' : ''}`}
            onClick={() => setActiveTab('exportar')}
          >
            <Download size={18} style={{ marginRight: '0.5rem' }} />
            Exportar
          </button>
        </div>

        {renderContent()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'add' && 'Nuevo Producto'}
                {modalType === 'edit' && 'Editar Producto'}
                {modalType === 'movimiento' && 'Registrar Movimiento'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            {modalType === 'add' && (
              <ProductoForm 
                onSubmit={handleAddProduct} 
                onCancel={() => setShowModal(false)}
              />
            )}
            
            {modalType === 'edit' && selectedProduct && (
              <ProductoForm 
                producto={selectedProduct}
                onSubmit={handleUpdateProduct}
                onCancel={() => setShowModal(false)}
              />
            )}
            
            {modalType === 'movimiento' && selectedProduct && (
              <MovimientoForm 
                producto={selectedProduct}
                onSubmit={(mov) => handleMovimiento(selectedProduct.id, mov)}
                onCancel={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      <InstallPWA />

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          duration={toast.duration}
          onClose={hideToast} 
        />
      )}
    </div>
  );
};

export default InventarioApp;