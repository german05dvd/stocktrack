import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    // Detectar cuando se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar');
    } else {
      console.log('Usuario rechazó instalar');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const dismiss = () => {
    setShowInstall(false);
    // No mostrar por 7 días
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  // Verificar si fue descartado recientemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        setShowInstall(false);
      }
    }
  }, []);

  if (isInstalled || !showInstall) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      background: '#0f172a',
      color: 'white',
      padding: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: '#3b82f6',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Smartphone size={24} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '1rem', marginBottom: '0.25rem' }}>
          Instalar StockTrack
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.4 }}>
          Accede rápido desde tu pantalla de inicio. Funciona sin internet.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Download size={16} />
          Instalar
        </button>
        <button
          onClick={dismiss}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default InstallPWA;