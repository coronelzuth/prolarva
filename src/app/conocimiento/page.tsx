'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { stages } from '@/data/stages';
import { useProgress } from '@/hooks/useProgress';

export default function ConocimientoPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { markVisited, markCompleted, markStageViewed, progress } = useProgress();

  useEffect(() => { markVisited('conocimiento'); }, [markVisited]);

  const open = useCallback((idx: number) => {
    setActiveIdx(idx);
    markStageViewed(stages[idx].id);
    document.body.style.overflow = 'hidden';
  }, [markStageViewed]);

  const close = useCallback(() => {
    setActiveIdx(null);
    document.body.style.overflow = '';
  }, []);

  const goNext = useCallback(() => {
    if (activeIdx === null) return;
    const next = (activeIdx + 1) % stages.length;
    setActiveIdx(next);
    markStageViewed(stages[next].id);
  }, [activeIdx, markStageViewed]);

  const goPrev = useCallback(() => {
    if (activeIdx === null) return;
    const prev = (activeIdx - 1 + stages.length) % stages.length;
    setActiveIdx(prev);
    markStageViewed(stages[prev].id);
  }, [activeIdx, markStageViewed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'Escape') { if (lightbox) { setLightbox(null); return; } close(); }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIdx, close, goNext, goPrev, lightbox]);

  // Cleanup on unmount
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const handleComplete = () => { markCompleted('conocimiento'); };
  const activeStage = activeIdx !== null ? stages[activeIdx] : null;

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
          Aprende el ciclo completo de la <strong style={{ color: '#4ade80' }}>Mosca Soldado Negra (BSF)</strong>. Son 8 etapas — toca cada una para ver detalles, temperatura, cuidados y alertas.
        </p>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>{progress.stagesViewed.length} / {stages.length} etapas vistas</div>
          <div style={{ width: 100, height: 4, background: '#1e3050', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: '#22c55e', borderRadius: 2, transform: `scaleX(${progress.stagesViewed.length / stages.length})`, transformOrigin: 'left', transition: 'transform 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {stages.map((stage, idx) => {
          const viewed = progress.stagesViewed.includes(stage.id);
          const hasPhoto = stage.photos && stage.photos.length > 0;
          return (
            <button key={stage.id} onClick={() => open(idx)}
              style={{ borderRadius: 14, padding: 0, overflow: 'hidden', background: viewed ? 'rgba(30,48,80,0.85)' : 'rgba(21,32,53,0.7)', border: `2px solid ${viewed ? stage.color + '50' : 'rgba(34,197,94,0.15)'}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', transition: 'all 0.15s', position: 'relative' }}
            >
              {hasPhoto ? (
                <img src={stage.photos![0]} alt={stage.name} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${stage.color}12` }}>
                  <span style={{ fontSize: 38 }}>{stage.emoji}</span>
                </div>
              )}
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 4 }}>
                  {stage.name.replace(' ⭐ Cosecha', '').replace(' Madura (L5)', ' L5')}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{stage.duration}</div>
              </div>
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

      {/* Complete module CTA */}
      <div style={{ padding: 24, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, textAlign: 'center' }}>
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

      {/* ── MODAL ── */}
      {activeStage && activeIdx !== null && (
        <>
          {/* Backdrop */}
          <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, backdropFilter: 'blur(4px)' }} />

          {/* Panel */}
          <div className="modal-panel" style={{ position: 'fixed', zIndex: 101, background: '#0f1f35', border: `1px solid ${activeStage.color}40`, borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${activeStage.color}25`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: `${activeStage.color}0a` }}>
              <span style={{ fontSize: 28 }}>{activeStage.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeStage.name}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>⏱ {activeStage.duration}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>🌡 {activeStage.temp}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>💧 {activeStage.humidity}</span>
                </div>
              </div>
              <button onClick={close} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '6px 10px', borderRadius: 8, flexShrink: 0 }}>×</button>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '18px 20px' }}>
              <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 20, marginTop: 0 }}>{activeStage.description}</p>

              {/* Galería */}
              {(activeStage.photos?.length || activeStage.videos?.length) ? (
                <div style={{ marginBottom: 22 }}>
                  {activeStage.photos && activeStage.photos.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, letterSpacing: 1 }}>📸 FOTOS</div>
                      <div className="foto-grid">
                        {activeStage.photos.map((photo, i) => (
                          <div key={i} onClick={() => setLightbox(photo)} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${activeStage.color}30`, aspectRatio: '4/3', cursor: 'zoom-in' }}>
                            <img src={photo} alt={`${activeStage.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeStage.videos && activeStage.videos.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, letterSpacing: 1 }}>🎬 VIDEOS</div>
                      <div className="video-grid">
                        {activeStage.videos.map((video, i) => {
                          const isLocal = video.url.endsWith('.mp4') || video.url.startsWith('/');
                          return isLocal ? (
                            <VideoPlayer key={i} src={video.url} title={video.title} color={activeStage.color} />
                          ) : (
                            <a key={i} href={video.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(30,48,80,0.6)', borderRadius: 10, border: `1px solid ${activeStage.color}30`, textDecoration: 'none' }}>
                              <span style={{ fontSize: 18 }}>▶️</span>
                              <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{video.title}</span>
                              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>ver →</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 20, padding: '12px 14px', background: 'rgba(30,48,80,0.5)', borderRadius: 10, border: '1px dashed rgba(100,116,139,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📷</span>
                  <span style={{ fontSize: 12, color: '#475569' }}>Sin fotos aún para esta etapa.</span>
                </div>
              )}

              {/* Tips y Alertas */}
              <div className="tips-grid">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 8, letterSpacing: 1 }}>✅ CONSEJOS</div>
                  {activeStage.tips.map((tip, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${activeStage.color}40`, lineHeight: 1.5 }}>{tip}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 8, letterSpacing: 1 }}>⚠️ ALERTAS</div>
                  {activeStage.alerts.map((alert, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(239,68,68,0.4)', lineHeight: 1.5 }}>{alert}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer nav prev/next */}
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${activeStage.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#0a1628' }}>
              <button onClick={goPrev}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                ← {stages[(activeIdx - 1 + stages.length) % stages.length].emoji} Anterior
              </button>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{activeIdx + 1} / {stages.length}</span>
              <button onClick={goNext}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: `${activeStage.color}18`, border: `1px solid ${activeStage.color}40`, borderRadius: 10, color: activeStage.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Siguiente {stages[(activeIdx + 1) % stages.length].emoji} →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Lightbox fullscreen */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 48px rgba(0,0,0,0.8)' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: 40, height: 40, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }}>×</button>
        </div>
      )}

      <style>{`
        .modal-panel {
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(640px, 94vw);
          max-height: 88vh;
          animation: modalIn 0.2s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        .foto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
        .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
        .tips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }

        @media (max-width: 480px) {
          .modal-panel { width: 96vw; max-height: 92vh; border-radius: 14px; }
          .foto-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
          .video-grid { grid-template-columns: 1fr; }
          .tips-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function VideoPlayer({ src, title, color }: { src: string; title: string; color: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const toggle = () => {
    if (!ref.current) return;
    if (ref.current.paused) { ref.current.play(); setPlaying(true); }
    else { ref.current.pause(); setPlaying(false); }
  };
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${color}30`, background: '#0a1628', position: 'relative' }}>
      <video ref={ref} src={src} autoPlay muted loop playsInline style={{ width: '100%', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 10px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.65))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggle} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>
            {playing ? '⏸' : '▶'}
          </button>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{title}</span>
        </div>
      </div>
    </div>
  );
}
