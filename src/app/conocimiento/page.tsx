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

  const handleComplete = () => { markCompleted('conocimiento'); };

  const activeStage = stages.find(s => s.id === expanded);

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
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
          Aprende el ciclo completo de la <strong style={{ color: '#4ade80' }}>Mosca Soldado Negra (BSF)</strong>. Son 8 etapas — tocá cada una para ver detalles, temperatura, cuidados y alertas.
        </p>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>{progress.stagesViewed.length} / {stages.length} etapas vistas</div>
          <div style={{ width: 100, height: 4, background: '#1e3050', borderRadius: 2 }}>
            <div style={{ width: `${(progress.stagesViewed.length / stages.length) * 100}%`, height: '100%', background: '#22c55e', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Grid 3 x 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {stages.map((stage) => {
          const isSelected = expanded === stage.id;
          const viewed = progress.stagesViewed.includes(stage.id);
          const hasPhoto = stage.photos && stage.photos.length > 0;
          return (
            <button
              key={stage.id}
              onClick={() => handleExpand(stage.id)}
              style={{
                borderRadius: 14, padding: 0, overflow: 'hidden',
                background: isSelected ? `${stage.color}18` : viewed ? 'rgba(30,48,80,0.85)' : 'rgba(21,32,53,0.7)',
                border: `2px solid ${isSelected ? stage.color : viewed ? stage.color + '50' : 'rgba(34,197,94,0.15)'}`,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif',
                transition: 'all 0.15s', position: 'relative',
                boxShadow: isSelected ? `0 0 16px ${stage.color}30` : 'none',
              }}
            >
              {/* Photo or emoji placeholder */}
              {hasPhoto ? (
                <img
                  src={stage.photos![0]}
                  alt={stage.name}
                  style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${stage.color}12`,
                }}>
                  <span style={{ fontSize: 38 }}>{stage.emoji}</span>
                </div>
              )}

              {/* Info */}
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? stage.color : '#f1f5f9', lineHeight: 1.3, marginBottom: 4 }}>
                  {stage.name.replace(' ⭐ Cosecha', '').replace(' Madura (L5)', ' L5')}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{stage.duration}</div>
              </div>

              {/* Badges */}
              {viewed && (
                <span style={{ position: 'absolute', top: 7, right: 7, width: 18, height: 18, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>✓</span>
              )}
              {stage.isHarvestStage && (
                <span style={{ position: 'absolute', top: 7, left: 7, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: `${stage.color}cc`, color: 'white' }}>COSECHA</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {activeStage && (
        <div style={{
          borderRadius: 16, overflow: 'hidden', marginBottom: 28,
          border: `1px solid ${activeStage.color}50`,
          background: `${activeStage.color}08`,
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Panel header */}
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${activeStage.color}25`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{activeStage.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#f1f5f9', marginBottom: 3 }}>{activeStage.name}</div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>⏱ {activeStage.duration}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>🌡 {activeStage.temp}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>💧 {activeStage.humidity}</span>
              </div>
            </div>
            <button onClick={() => setExpanded(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
          </div>

          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 20 }}>{activeStage.description}</p>

            {/* Fotos */}
            {activeStage.photos && activeStage.photos.length > 0 ? (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 10, letterSpacing: 1 }}>📸 FOTOS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  {activeStage.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`${activeStage.name} ${i + 1}`}
                      style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 10, border: `1px solid ${activeStage.color}30` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20, padding: '14px 16px', background: 'rgba(30,48,80,0.5)', borderRadius: 10, border: '1px dashed rgba(100,116,139,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>📷</span>
                <span style={{ fontSize: 12, color: '#475569' }}>Sin fotos aún — podés agregar fotos de esta etapa en <code style={{ fontSize: 11, background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>data/stages.ts</code></span>
              </div>
            )}

            {/* Tips y Alertas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 8, letterSpacing: 1 }}>✅ CONSEJOS</div>
                {activeStage.tips.map((tip, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${activeStage.color}40`, lineHeight: 1.5 }}>
                    {tip}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 8, letterSpacing: 1 }}>⚠️ ALERTAS</div>
                {activeStage.alerts.map((alert, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(239,68,68,0.4)', lineHeight: 1.5 }}>
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete module CTA */}
      <div style={{ marginTop: 16, padding: 24, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, textAlign: 'center' }}>
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
            <button onClick={handleComplete} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat, sans-serif', marginRight: 12 }}>
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
