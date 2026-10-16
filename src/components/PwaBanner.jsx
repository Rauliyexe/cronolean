import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, RefreshCw, Smartphone, Check, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PwaBanner() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Setup Service Worker auto update & refresh detection
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('CronoLean PWA Service Worker registrado com sucesso:', r);
    },
    onRegisterError(error) {
      console.error('Falha ao registrar Service Worker do CronoLean:', error);
    },
  });

  useEffect(() => {
    // 1. Detect if already running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    // 2. Listen to beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // 3. Listen to appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    // 4. Online/Offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if iOS device
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos && !isStandalone) {
      // Can show helper for iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // If on iOS or prompt not available
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIos) {
        setShowIosPrompt(true);
      } else {
        alert('Para instalar o CronoLean, use o menu do seu navegador (três pontos ou ícone de instalação na barra de endereço) e selecione "Instalar CronoLean".');
      }
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  return (
    <>
      {/* Update notification bar */}
      {needRefresh && (
        <div style={{
          background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)',
          borderBottom: '1px solid #4338ca',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          color: '#e0e7ff',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={14} className="spin-slow" color="#a5b4fc" />
            <span><strong>Nova atualização do CronoLean disponível!</strong> Os dados de cronometragem permanecem salvos localmente.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => updateServiceWorker(true)}
              className="ind-btn ind-btn-primary ind-btn-sm"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            >
              Atualizar Agora
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className="ind-btn ind-btn-sm"
              style={{ padding: '0.2rem 0.5rem' }}
            >
              Depois
            </button>
          </div>
        </div>
      )}

      {/* Offline Alert Strip if network drops */}
      {!isOnline && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.4)',
          padding: '0.35rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#fef3c7',
          zIndex: 999
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <WifiOff size={14} color="#f59e0b" />
            <span><strong>Modo Chão de Fábrica (Offline Ativo)</strong> — Todas as medições, cálculos e alterações continuam funcionando e sendo salvas localmente sem interrupção.</span>
          </div>
          <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.25)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
            100% Funcional Offline
          </span>
        </div>
      )}

      {/* iOS helper modal */}
      {showIosPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="ind-card" style={{ maxWidth: '400px', width: '100%', padding: '1.5rem', border: '1px solid var(--analytical-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smartphone size={18} color="var(--analytical-blue)" />
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Instalar no iPhone / iPad</h3>
              </div>
              <button onClick={() => setShowIosPrompt(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Para utilizar o CronoLean como aplicativo nativo no chão de fábrica em dispositivos iOS:
            </p>
            <ol style={{ fontSize: '0.825rem', color: 'var(--text-primary)', paddingLeft: '1.2rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              <li>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra do Safari.</li>
              <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
              <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
            </ol>
            <button onClick={() => setShowIosPrompt(false)} className="ind-btn ind-btn-primary" style={{ width: '100%' }}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Standalone install button to be used in Topbar or Sidebar
export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user
      alert('Para instalar o CronoLean no seu dispositivo ou computador:\n\n1. No Chrome/Edge: Clique no ícone de "Instalar aplicativo" na barra de endereço ou no menu ⋮ > "Instalar CronoLean".\n2. No celular: Toque em ⋮ > "Adicionar à tela inicial" ou "Instalar app".');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
      {/* Offline/Online Badge */}
      <span
        title={isOnline ? 'Aplicativo conectado à rede' : 'Modo Offline Ativo — Totalmente funcional no chão de fábrica sem internet'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.7rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          background: isOnline ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${isOnline ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.4)'}`,
          color: isOnline ? '#4ade80' : '#fbbf24',
          fontWeight: '600'
        }}
      >
        {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
        <span className="no-mobile">{isOnline ? 'Online' : 'Offline'}</span>
      </span>

      {/* Install Button or Installed Badge */}
      {isInstalled ? (
        <span
          title="Executando no modo nativo (PWA instalado)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.7rem',
            padding: '0.25rem 0.55rem',
            borderRadius: '4px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            fontWeight: '700'
          }}
        >
          <Check size={11} />
          <span className="no-mobile">PWA Nativo</span>
        </span>
      ) : (
        <button
          onClick={handleInstall}
          type="button"
          className="ind-btn ind-btn-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(124, 58, 237, 0.15))',
            borderColor: 'var(--analytical-blue)',
            color: 'var(--text-primary)',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}
          title="Instalar CronoLean como aplicativo no computador ou celular"
        >
          <Download size={12} color="var(--analytical-blue)" />
          <span>Instalar App</span>
        </button>
      )}
    </div>
  );
}
