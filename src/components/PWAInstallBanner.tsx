'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type BannerState = 'hidden' | 'android' | 'ios';

const DISMISS_KEY = 'prl-pwa-dismissed';
const DISMISS_DAYS = 7;

function isDismissed(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DISMISS_DAYS * 86400_000;
  } catch {
    return false;
  }
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(navigator as { standalone?: boolean }).standalone;
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export default function PWAInstallBanner() {
  const [state, setState] = useState<BannerState>('hidden');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosExpanded, setIosExpanded] = useState(false);

  useEffect(() => {
    if (isDismissed() || isStandalone()) return;

    if (isIOS()) {
      setState('ios');
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState('android');
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setState('hidden');
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setState('hidden');
    else dismiss();
    setDeferredPrompt(null);
  }

  if (state === 'hidden') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 90,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      width: 'calc(100% - 32px)',
      maxWidth: 360,
      background: '#152035',
      border: '1px solid rgba(34,197,94,0.4)',
      borderTop: '3px solid #22c55e',
      borderRadius: 14,
      padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      fontFamily: 'Montserrat, sans-serif',
    }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>📲</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#f1f5f9', lineHeight: 1.3 }}>
            Instala ProLarva gratis
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
            Recibe alertas de tus lotes directo en tu celular, sin abrir el navegador.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer', padding: '0 0 0 4px', lineHeight: 1, flexShrink: 0 }}
        >✕</button>
      </div>

      {/* Android — botón directo */}
      {state === 'android' && (
        <button
          onClick={install}
          style={{
            marginTop: 12,
            width: '100%',
            background: '#22c55e',
            color: '#0d1b2a',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 8,
            padding: '10px 0',
            cursor: 'pointer',
          }}
        >
          Instalar app
        </button>
      )}

      {/* iOS — instrucciones expandibles */}
      {state === 'ios' && (
        <>
          <button
            onClick={() => setIosExpanded(v => !v)}
            style={{
              marginTop: 12,
              width: '100%',
              background: '#22c55e',
              color: '#0d1b2a',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              borderRadius: 8,
              padding: '10px 0',
              cursor: 'pointer',
            }}
          >
            {iosExpanded ? 'Cerrar instrucciones' : 'Ver cómo instalar'}
          </button>

          {iosExpanded && (
            <ol style={{ margin: '12px 0 0', padding: '0 0 0 20px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
              <li>Toca el botón <strong>Compartir</strong> <span style={{ fontSize: 14 }}>⬆️</span> en Safari</li>
              <li>Desplázate y toca <strong>"Agregar a pantalla de inicio"</strong></li>
              <li>Confirma con <strong>"Agregar"</strong> — ¡listo! 🎉</li>
            </ol>
          )}
        </>
      )}
    </div>
  );
}
