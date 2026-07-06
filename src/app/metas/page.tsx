'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { metas } from '@/data/metas';
import { useProgress } from '@/hooks/useProgress';

export default function MetasPage() {
  const [activeMeta, setActiveMeta] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
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
                <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: meta.color }}>✓ META SELECCIONADA</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Meta detail */}
      {currentMeta && (
        <div style={{ background: 'rgba(21,32,53,0.7)', border: `1px solid ${currentMeta.borderColor}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '24px 28px', borderBottom: `1px solid ${currentMeta.borderColor}`, background: `rgba(${hexToRgb(currentMeta.color)},0.06)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 36 }}>{currentMeta.emoji}</span>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', marginBottom: 2 }}>{currentMeta.title}</h2>
                <div style={{ fontSize: 13, color: currentMeta.color, fontWeight: 600 }}>{currentMeta.tagline}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>{currentMeta.description}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${hexToRgb(currentMeta.color)},0.12)`, border: `1px solid ${currentMeta.borderColor}`, borderRadius: 8, padding: '6px 14px' }}>
              <span style={{ fontSize: 12, color: currentMeta.color }}>⏰ Cuándo aplicar:</span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{currentMeta.when}</span>
            </div>
          </div>

          <div style={{ padding: '24px 28px' }}>
            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14, marginBottom: 16 }}>📋 Guía paso a paso</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentMeta.steps.map((step) => {
                const isOpen = activeStep === step.step;
                return (
                  <div
                    key={step.step}
                    style={{
                      borderRadius: 10, overflow: 'hidden',
                      background: isOpen ? `rgba(${hexToRgb(currentMeta.color)},0.08)` : 'rgba(30,48,80,0.5)',
                      border: `1px solid ${isOpen ? currentMeta.borderColor : 'rgba(14,165,233,0.12)'}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <button
                      onClick={() => setActiveStep(isOpen ? null : step.step)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${currentMeta.color},${currentMeta.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                        {step.step}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>{step.title}</span>
                      <span style={{ color: '#64748b', transition: 'transform 0.15s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 18px 16px 60px' }}>
                        <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, marginBottom: step.tip || step.warning ? 12 : 0 }}>{step.description}</p>
                        {step.tip && (
                          <div style={{ padding: '8px 12px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, fontSize: 12, color: '#38bdf8', lineHeight: 1.5 }}>
                            💡 {step.tip}
                          </div>
                        )}
                        {step.warning && (
                          <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, color: '#fca5a5', lineHeight: 1.5, marginTop: step.tip ? 8 : 0 }}>
                            ⚠️ {step.warning}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Resources */}
            <div style={{ marginTop: 24, padding: '16px 18px', background: 'rgba(30,48,80,0.5)', borderRadius: 12, border: '1px solid rgba(14,165,233,0.12)' }}>
              <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>🧰 MATERIALES NECESARIOS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentMeta.resources.map((res, i) => (
                  <span key={i} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: `rgba(${hexToRgb(currentMeta.color)},0.1)`, border: `1px solid ${currentMeta.borderColor}`, color: '#94a3b8' }}>
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeMeta && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#334155', fontSize: 14 }}>
          Selecciona una meta arriba para ver la guía paso a paso
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '14,165,233';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
