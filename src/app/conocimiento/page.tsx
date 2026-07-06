'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { stages } from '@/data/stages';
import { useProgress } from '@/hooks/useProgress';

export default function ConocimientoPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { markVisited, markCompleted, markStageViewed, progress } = useProgress();

  useEffect(() => { markVisited('conocimiento'); }, [markVisited]);

  const handleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    markStageViewed(id);
  };

  const allViewed = stages.every(s => progress.stagesViewed.includes(s.id));

  const handleComplete = () => {
    markCompleted('conocimiento');
  };

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          ← Inicio
        </Link>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 16, marginLeft: 12 }}>
          <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Módulo 1</span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 10 }}>
          🧠 Conocimiento General
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, maxWidth: 600 }}>
          Aprende el ciclo completo de la <strong style={{ color: '#4ade80' }}>Mosca Soldado Negra (BSF)</strong>. Son 8 etapas — toca cada una para ver detalles, temperatura, cuidados y alertas.
        </p>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {progress.stagesViewed.length} / {stages.length} etapas vistas
          </div>
          <div style={{ width: 100, height: 4, background: '#1e3050', borderRadius: 2 }}>
            <div style={{ width: `${(progress.stagesViewed.length / stages.length) * 100}%`, height: '100%', background: '#22c55e', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Ciclo visual */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 32 }}>
        {stages.map((stage, i) => (
          <button
            key={stage.id}
            onClick={() => handleExpand(stage.id)}
            style={{
              flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 14px', borderRadius: 10,
              background: expanded === stage.id ? `${stage.color}20` : progress.stagesViewed.includes(stage.id) ? 'rgba(30,48,80,0.8)' : 'rgba(21,32,53,0.6)',
              border: `1px solid ${expanded === stage.id ? stage.color + '80' : progress.stagesViewed.includes(stage.id) ? stage.color + '40' : 'rgba(34,197,94,0.15)'}`,
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <span style={{ fontSize: 22 }}>{stage.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: expanded === stage.id ? stage.color : '#94a3b8', whiteSpace: 'nowrap', maxWidth: 80, textAlign: 'center', lineHeight: 1.2 }}>
              {stage.name.replace(' ⭐ Cosecha', '').replace(' Madura (L5)', ' L5')}
            </span>
            {i < stages.length - 1 && (
              <span style={{ position: 'absolute', right: -12, top: '50%', color: '#334155', fontSize: 12 }}>→</span>
            )}
          </button>
        ))}
      </div>

      {/* Stage detail cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {stages.map((stage) => {
          const isOpen = expanded === stage.id;
          const viewed = progress.stagesViewed.includes(stage.id);
          return (
            <div
              key={stage.id}
              style={{
                borderRadius: 12, overflow: 'hidden',
                border: `1px solid ${isOpen ? stage.color + '60' : viewed ? stage.color + '30' : 'rgba(34,197,94,0.15)'}`,
                background: isOpen ? `${stage.color}08` : 'rgba(21,32,53,0.6)',
                transition: 'all 0.2s',
              }}
            >
              <button
                onClick={() => handleExpand(stage.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{stage.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>{stage.name}</span>
                    {stage.isHarvestStage && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>COSECHA</span>
                    )}
                    {viewed && !isOpen && <span style={{ fontSize: 11, color: '#10b981' }}>✓</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {stage.duration}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>🌡 {stage.temp}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>💧 {stage.humidity}</span>
                  </div>
                </div>
                <span style={{ color: '#64748b', fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 20px 20px' }}>
                  <div style={{ height: 1, background: `${stage.color}30`, marginBottom: 16 }} />
                  <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 20 }}>{stage.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>✅ CONSEJOS</div>
                      {stage.tips.map((tip, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${stage.color}40`, lineHeight: 1.5 }}>
                          {tip}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>⚠️ ALERTAS</div>
                      {stage.alerts.map((alert, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(239,68,68,0.4)', lineHeight: 1.5 }}>
                          {alert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete module CTA */}
      <div style={{ marginTop: 40, padding: 24, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, textAlign: 'center' }}>
        {progress.modulesCompleted.includes('conocimiento') ? (
          <div>
            <div style={{ fontSize: 20, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 12 }}>¡Módulo completado!</div>
            <Link href="/preparacion" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Ir al diagnóstico de preparación 🛠️ →
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 16, marginBottom: 6 }}>¿Ya revisaste todas las etapas?</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Marca el módulo como completado para llevar tu progreso</div>
            <button
              onClick={handleComplete}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat, sans-serif', marginRight: 12 }}
            >
              ✓ Completar Módulo 1
            </button>
            <Link href="/preparacion" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
              o ir al diagnóstico →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
