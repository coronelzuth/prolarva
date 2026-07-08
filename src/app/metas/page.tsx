'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { metas } from '@/data/metas';
import { useProgress } from '@/hooks/useProgress';

export default function MetasPage() {
  const [activeMeta, setActiveMeta] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { markVisited, markCompleted, selectMeta, progress } = useProgress();

  useEffect(() => {
    markVisited('metas');
    if (progress.selectedMeta) setActiveMeta(progress.selectedMeta);
  }, [markVisited, progress.selectedMeta]);

  const handleSelectMeta = (id: string) => {
    setActiveMeta(id);
    setActiveStep(null);
    selectMeta(id);
    markCompleted('metas');
    setShowModal(true);
  };

  const currentMeta = metas.find(m => m.id === activeMeta);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>← Inicio</Link>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Módulo 3</span>
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, marginBottom: 8 }}>🎯 Elige tu Meta</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 560 }}>
          Cada meta tiene su propia ruta. Elige según tu objetivo y accede a la guía paso a paso para esa producción.
        </p>
      </div>

      {/* Meta selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
        {metas.map(meta => {
          const isActive = activeMeta === meta.id;
          return (
            <button
              key={meta.id}
              onClick={() => handleSelectMeta(meta.id)}
              style={{
                padding: '20px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                background: isActive ? `rgba(${hexToRgb(meta.color)},0.12)` : 'rgba(21,32,53,0.7)',
                border: `2px solid ${isActive ? meta.color : meta.borderColor}`,
                transition: 'all 0.18s', fontFamily: 'Montserrat, sans-serif',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{meta.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: isActive ? meta.color : '#f1f5f9', marginBottom: 4 }}>{meta.title}</div>
              <div style={{ fontSize: 12, color: isActive ? meta.color + 'cc' : '#64748b', fontWeight: 600, marginBottom: 8 }}>{meta.tagline}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{meta.description.slice(0, 80)}...</div>
              {isActive && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>✓ SELECCIONADA</div>
                  <button onClick={e => { e.stopPropagation(); setShowModal(true); }} style={{ fontSize: 11, color: meta.color, background: `rgba(${hexToRgb(meta.color)},0.1)`, border: `1px solid ${meta.borderColor}`, borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>Ver guía →</button>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 32, padding: '22px 24px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>🌾 ¿Listo para empezar tu primer ciclo?</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18, lineHeight: 1.5 }}>
          Guía práctica paso a paso: del huevo a la cosecha en 18 días.
        </div>
        <Link href="/cosecha" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Ver guía de cosecha →
        </Link>
      </div>

      <div style={{ marginTop: 16, padding: '22px 24px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>🧮 ¿Cuánto puedes ahorrar con BSF?</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18, lineHeight: 1.5 }}>
          Ingresa los datos de tu lote y calculamos exactamente cuánto te cuesta no usar BSF.
        </div>
        <Link href="/calculadora" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          Abrir calculadora →
        </Link>
      </div>

      {/* Modal detalle de meta */}
      {showModal && currentMeta && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(3px)' }} />
          <div className="meta-modal" style={{ position: 'fixed', zIndex: 101, background: '#0f1f35', border: `1px solid ${currentMeta.borderColor}`, borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${currentMeta.borderColor}`, display: 'flex', alignItems: 'center', gap: 12, background: `rgba(${hexToRgb(currentMeta.color)},0.06)`, flexShrink: 0 }}>
              <span style={{ fontSize: 28 }}>{currentMeta.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#f1f5f9' }}>{currentMeta.title}</div>
                <div style={{ fontSize: 12, color: currentMeta.color, fontWeight: 600 }}>{currentMeta.tagline}</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '6px 10px', borderRadius: 8 }}>×</button>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12 }}>{currentMeta.description}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${hexToRgb(currentMeta.color)},0.1)`, border: `1px solid ${currentMeta.borderColor}`, borderRadius: 8, padding: '5px 12px', marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: currentMeta.color }}>⏰ Cuándo aplicar:</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{currentMeta.when}</span>
              </div>
              <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 13, marginBottom: 12 }}>📋 Guía paso a paso</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentMeta.steps.map((step) => {
                  const isOpen = activeStep === step.step;
                  return (
                    <div key={step.step} style={{ borderRadius: 10, overflow: 'hidden', background: isOpen ? `rgba(${hexToRgb(currentMeta.color)},0.08)` : 'rgba(30,48,80,0.5)', border: `1px solid ${isOpen ? currentMeta.borderColor : 'rgba(34,197,94,0.12)'}` }}>
                      <button onClick={() => setActiveStep(isOpen ? null : step.step)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${currentMeta.color},${currentMeta.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0 }}>{step.step}</div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>{step.title}</span>
                        <span style={{ color: '#64748b', transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'none', fontSize: 12 }}>▾</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 52px' }}>
                          <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.65, marginBottom: step.tip || step.warning ? 10 : 0 }}>{step.description}</p>
                          {step.tip && <div style={{ padding: '7px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, fontSize: 11, color: '#38bdf8', lineHeight: 1.5 }}>💡 {step.tip}</div>}
                          {step.warning && <div style={{ padding: '7px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: 11, color: '#fca5a5', lineHeight: 1.5, marginTop: step.tip ? 6 : 0 }}>⚠️ {step.warning}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(30,48,80,0.5)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.12)' }}>
                <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: 11, marginBottom: 8 }}>🧰 MATERIALES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {currentMeta.resources.map((res, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `rgba(${hexToRgb(currentMeta.color)},0.1)`, border: `1px solid ${currentMeta.borderColor}`, color: '#94a3b8' }}>{res}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .meta-modal {
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(680px, 94vw);
          max-height: 88vh;
          animation: metaModalIn 0.2s ease;
        }
        @keyframes metaModalIn {
          from { opacity: 0; transform: translate(-50%, -47%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @media (max-width: 480px) {
          .meta-modal { width: 96vw; max-height: 92vh; border-radius: 14px; }
        }
      `}</style>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '14,165,233';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
