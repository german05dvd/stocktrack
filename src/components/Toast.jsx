import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />
  };

  return (
    <div className={`toast ${type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {icons[type]}
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'inherit', 
          cursor: 'pointer',
          marginLeft: 'auto',
          opacity: 0.8 
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;