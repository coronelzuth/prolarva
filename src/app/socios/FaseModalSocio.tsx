'use client';
import { useState, useEffect } from 'react';
import type { Clase, Plantilla, Tarea } from '@/hooks/useEscuela';
import { SEMANAS_INFO, getYouTubeId } from './_escuela_shared';

const ICONOS = [
  { id: 'desc',       emoji: '📋', label: 'Descripción' },
  { id: 'clase',      emoji: '🎥', label: 'Clase' },
  { id: 'plantillas', emoji: '📄', label: 'Plantillas' },
  { id: 'preguntas',  emoji: '❓', label: 'Preguntas' },
] as const;

type IconoId = typeof ICONOS[number]['id'];

interface Props {
  open: boolean;
  onClose: () => void;
  fase: number;
  clases: Clase[];
  plantillas: Plantilla[];
  tareas: Tarea[];
  estaVisto: (id: string) => boolean;
  marcarVisto: (id: string) => void;
  fasesAprobadas?: number;
  faseEnRevision?: number;
  onMarcarFase?: (fase: number) => Promise<void>;
}

export function FaseModalSocio({
  open, onClose, fase, clases, plantillas, tareas,
  estaVisto, marcarVisto,
  fasesAprobadas = 0, faseEnRevision = 0, onMarcarFase,
}: Props) {
  const [diaActivo, setDiaActivo] = useState<1|2>(1);
  const [icono, setIcono] = useState<IconoId>('desc');
  const [editData, setEditData] = useState<Record<number, { titulo: string; desc: string }>>({});
  const [faseItems, setFaseItems] = useState<string[]>([]);
  const [marcando, setMarcando] = useState(false);

  useEffect(() => {
    if (open) {
      setDiaActivo(1);
      setIcono('desc');
      const loaded: Record<number, { titulo: string; desc: string }> = {};
      [1, 2].forEach(d => {
        const saved = localStorage.getItem(`prl-fase-${fase}-dia-${d}`);
        if (saved) { try { loaded[d] = JSON.parse(saved); } catch {} }
      });
      setEditData(loaded);
      const defaultItems = SEMANAS_INFO[fase - 1]?.items ?? [];
      const savedItems = localStorage.getItem(`prl-fase-${fase}-items`);
      if (savedItems) {
        try { setFaseItems(JSON.parse(savedItems)); } catch { setFaseItems(defaultItems); }
      } else {
        setFaseItems(defaultItems);
      }
    }
  }, [open, fase]);

  if (!open) return null;
  const info = SEMANAS_INFO[fase - 1];
  if (!info) return null;
  const diaInfo = info.dias[diaActivo - 1];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#0d1b2a', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Fase {fase}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>{info.emoji} {info.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>✕</button>
        </div>

        {/* Tabs Día 1 / Día 2 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {([1,2] as const).map(d => (
            <button key={d} onClick={() => { setDiaActivo(d); setIcono('desc'); }}
              style={{ flex: 1, padding: '9px', borderRadius: 8, border: `2px solid ${diaActivo === d ? '#22c55e' : 'rgba(34,197,94,0.2)'}`, background: diaActivo === d ? 'rgba(34,197,94,0.12)' : 'transparent', color: diaActivo === d ? '#4ade80' : '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
              Día {d}
            </button>
          ))}
        </div>

        {/* Título del día */}
        <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
          {editData[diaActivo]?.titulo ?? diaInfo.titulo}
        </div>

        {/* 4 íconos de navegación */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {ICONOS.map(ic => (
            <button key={ic.id} onClick={() => setIcono(ic.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 10, border: `2px solid ${icono === ic.id ? '#22c55e' : 'rgba(34,197,94,0.15)'}`, background: icono === ic.id ? 'rgba(34,197,94,0.12)' : '#152035', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Montserrat,sans-serif' }}>
              <span style={{ fontSize: 20 }}>{ic.emoji}</span>
              <span style={{ fontSize: 8, fontWeight: 800, color: icono === ic.id ? '#22c55e' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ic.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ minHeight: 120 }}>

          {icono === 'desc' && (
            <div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>{editData[diaActivo]?.desc ?? diaInfo.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Temas de esta fase</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {faseItems.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#e2e8f0', lineHeight: 1.5 }}>
                    <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                {fase <= fasesAprobadas ? (
                  <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>✅ Fase aprobada</div>
                ) : fase === faseEnRevision ? (
                  <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>⏳ En revisión — tu tutor la está evaluando</div>
                ) : fase === fasesAprobadas + 1 && onMarcarFase ? (
                  <button
                    onClick={async () => { setMarcando(true); await onMarcarFase(fase); setMarcando(false); onClose(); }}
                    disabled={marcando}
                    style={{ width: '100%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 700, cursor: marcando ? 'default' : 'pointer', opacity: marcando ? 0.6 : 1, fontFamily: 'Montserrat,sans-serif' }}
                  >
                    {marcando ? 'Enviando...' : '📩 Marcar fase como lista para revisar'}
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {icono === 'clase' && (
            <div>
              {clases.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>La clase grabada estará disponible pronto.</p>
              ) : clases.map(clase => {
                const vid = clase.url_video ? getYouTubeId(clase.url_video) : null;
                const visto = estaVisto(clase.id);
                return (
                  <div key={clase.id} style={{ marginBottom: 14, background: '#152035', borderRadius: 10, padding: 12, border: '1px solid rgba(34,197,94,0.12)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{clase.titulo}</div>
                    {clase.descripcion && <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, lineHeight: 1.5 }}>{clase.descripcion}</p>}
                    {vid ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
                        <iframe src={`https://www.youtube.com/embed/${vid}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={clase.titulo} />
                      </div>
                    ) : (
                      <p style={{ fontSize: 11, color: '#64748b', marginBottom: 10, fontStyle: 'italic' }}>Sin video aún.</p>
                    )}
                    <button onClick={() => { if (!visto) marcarVisto(clase.id); }}
                      style={{ background: visto ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg,#22c55e,#16a34a)', color: visto ? '#10b981' : '#fff', border: visto ? '1px solid rgba(16,185,129,0.3)' : 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: visto ? 'default' : 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
                      {visto ? '✅ Ya vista' : '👁️ Marcar como vista'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {icono === 'plantillas' && (
            <div>
              {plantillas.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>Las plantillas de esta fase estarán disponibles pronto.</p>
              ) : plantillas.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: '#152035', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
                  <a href={p.url_archivo} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 1 }}>
                    <span style={{ fontSize: 22 }}>📄</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{p.titulo}</div>
                      {p.tamano_aprox && <div style={{ fontSize: 10, color: '#64748b' }}>{p.tamano_aprox}</div>}
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22c55e', fontWeight: 700 }}>Descargar →</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {icono === 'preguntas' && (
            <div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                ¿Tienes dudas sobre el tema de esta fase? Prepara tus preguntas para la siguiente clase en vivo con Juliana.
              </p>
              {tareas.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>Las preguntas estarán disponibles pronto.</p>
              ) : tareas.map(t => (
                <div key={t.id} style={{ background: '#152035', borderRadius: 10, padding: '14px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Reflexión para la próxima clase</div>
                  <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>{t.pregunta}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
