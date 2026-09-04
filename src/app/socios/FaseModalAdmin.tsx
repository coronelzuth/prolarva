'use client';
import { useState, useEffect } from 'react';
import type { Clase, Plantilla, Tarea } from '@/hooks/useEscuela';
import { SEMANAS_INFO, getYouTubeId } from './_escuela_shared';

const ICONOS = [
  { id: 'desc',       emoji: '📋', label: 'Descripción' },
  { id: 'clase',      emoji: '🎥', label: 'Clase' },
  { id: 'plantillas', emoji: '📄', label: 'Plantillas' },
  { id: 'reflexion',  emoji: '💭', label: 'Reflexión' },
] as const;

type IconoId = typeof ICONOS[number]['id'];

interface Props {
  open: boolean;
  onClose: () => void;
  fase: number;
  clases: Clase[];
  plantillas: Plantilla[];
  tareas: Tarea[];
  onEditClase?: (c: Clase) => void;
  onNuevaClase?: () => void;
  onEliminarClase?: (id: string) => void;
  onEditPlantilla?: (p: Plantilla) => void;
  onNuevaPlantilla?: () => void;
  onEliminarPlantilla?: (id: string) => void;
  onEditTarea?: (t: Tarea) => void;
  onNuevaTarea?: () => void;
  onEliminarTarea?: (id: string) => void;
}

export function FaseModalAdmin({
  open, onClose, fase, clases, plantillas, tareas,
  onEditClase, onNuevaClase, onEliminarClase,
  onEditPlantilla, onNuevaPlantilla, onEliminarPlantilla,
  onEditTarea, onNuevaTarea, onEliminarTarea,
}: Props) {
  const [diaActivo, setDiaActivo] = useState<1|2>(1);
  const [icono, setIcono] = useState<IconoId>('desc');
  const [editData, setEditData] = useState<Record<number, { titulo: string; desc: string }>>({});
  const [faseItems, setFaseItems] = useState<string[]>([]);
  const [sendingRem, setSendingRem] = useState(false);
  const [remMsg, setRemMsg] = useState<string | null>(null);

  async function sendReminder() {
    setSendingRem(true);
    setRemMsg(null);
    try {
      const res = await fetch('/api/push/cronograma-reminder', { method: 'POST' });
      const json = await res.json();
      setRemMsg(res.ok ? `✅ Enviado a ${json.sent ?? 0} socios` : `❌ ${json.error ?? 'Error'}`);
    } catch {
      setRemMsg('❌ Error de red');
    }
    setSendingRem(false);
    setTimeout(() => setRemMsg(null), 4000);
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: remMsg ? 8 : 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Semana {fase} — Admin</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>{info.emoji} {info.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={sendReminder}
              disabled={sendingRem}
              title="Enviar recordatorio push a socios"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, color: '#0ea5e9', fontSize: 16, padding: '4px 10px', cursor: sendingRem ? 'default' : 'pointer', opacity: sendingRem ? 0.6 : 1, fontFamily: 'Montserrat,sans-serif' }}
            >
              📱
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}>✕</button>
          </div>
        </div>
        {remMsg && (
          <div style={{ fontSize: 11, color: remMsg.startsWith('✅') ? '#22c55e' : '#ef4444', marginBottom: 12, textAlign: 'right' }}>{remMsg}</div>
        )}

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
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Título del día</div>
                <input
                  value={editData[diaActivo]?.titulo ?? diaInfo.titulo}
                  onChange={e => setEditData(prev => ({ ...prev, [diaActivo]: { titulo: e.target.value, desc: (prev[diaActivo]?.desc ?? diaInfo.desc) } }))}
                  style={{ width: '100%', background: '#152035', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '8px 10px', color: '#f1f5f9', fontSize: 12, fontWeight: 700, fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', marginBottom: 10 }}
                />
                <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Descripción</div>
                <textarea
                  value={editData[diaActivo]?.desc ?? diaInfo.desc}
                  onChange={e => setEditData(prev => ({ ...prev, [diaActivo]: { titulo: (prev[diaActivo]?.titulo ?? diaInfo.titulo), desc: e.target.value } }))}
                  style={{ width: '100%', background: '#152035', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '8px 10px', color: '#94a3b8', fontSize: 13, fontFamily: 'Montserrat,sans-serif', lineHeight: 1.7, resize: 'vertical', minHeight: 80, boxSizing: 'border-box', marginBottom: 10 }}
                />
                <button
                  onClick={() => {
                    const curr = editData[diaActivo] ?? { titulo: diaInfo.titulo, desc: diaInfo.desc };
                    localStorage.setItem(`prl-fase-${fase}-dia-${diaActivo}`, JSON.stringify(curr));
                  }}
                  style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}
                >
                  Guardar
                </button>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Temas de esta semana</div>
              <div>
                {faseItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: '#22c55e', fontSize: 12, flexShrink: 0 }}>✓</span>
                    <input
                      value={item}
                      onChange={e => setFaseItems(prev => prev.map((it, idx) => idx === i ? e.target.value : it))}
                      style={{ flex: 1, background: '#152035', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '5px 8px', color: '#e2e8f0', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}
                    />
                    <button onClick={() => setFaseItems(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer', padding: '2px 4px' }}>🗑️</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => setFaseItems(prev => [...prev, ''])}
                    style={{ flex: 1, background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.35)', borderRadius: 7, color: '#22c55e', fontSize: 11, fontWeight: 700, padding: '7px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}
                  >+ Agregar tema</button>
                  <button
                    onClick={() => localStorage.setItem(`prl-fase-${fase}-items`, JSON.stringify(faseItems))}
                    style={{ flex: 1, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}
                  >Guardar temas</button>
                </div>
              </div>
            </div>
          )}

          {icono === 'clase' && (
            <div>
              <button onClick={onNuevaClase}
                style={{ width: '100%', padding: '9px', marginBottom: 12, background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.35)', borderRadius: 8, color: '#22c55e', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
                + Agregar clase
              </button>
              {clases.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>Sin clases cargadas. Agrega la primera.</p>
              ) : clases.map(clase => {
                const vid = clase.url_video ? getYouTubeId(clase.url_video) : null;
                return (
                  <div key={clase.id} style={{ marginBottom: 14, background: '#152035', borderRadius: 10, padding: 12, border: '1px solid rgba(34,197,94,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', flex: 1, marginRight: 8 }}>{clase.titulo}</div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button onClick={() => onEditClase?.(clase)} style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 5, color: '#0ea5e9', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>✏️</button>
                        <button onClick={() => { if (confirm('¿Eliminar esta clase?')) onEliminarClase?.(clase.id); }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, color: '#ef4444', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>🗑️</button>
                      </div>
                    </div>
                    {clase.descripcion && <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, lineHeight: 1.5 }}>{clase.descripcion}</p>}
                    {vid ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 8, overflow: 'hidden' }}>
                        <iframe src={`https://www.youtube.com/embed/${vid}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={clase.titulo} />
                      </div>
                    ) : (
                      <p style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>Sin video aún — agrega la URL de YouTube al editar.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {icono === 'plantillas' && (
            <div>
              <button onClick={onNuevaPlantilla}
                style={{ width: '100%', padding: '9px', marginBottom: 12, background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.35)', borderRadius: 8, color: '#22c55e', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
                + Agregar plantilla
              </button>
              {plantillas.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>Sin plantillas. Agrega la primera.</p>
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
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => onEditPlantilla?.(p)} style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 5, color: '#0ea5e9', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>✏️</button>
                    <button onClick={() => { if (confirm('¿Eliminar esta plantilla?')) onEliminarPlantilla?.(p.id); }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, color: '#ef4444', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {icono === 'reflexion' && (
            <div>
              <button onClick={onNuevaTarea}
                style={{ width: '100%', padding: '9px', marginBottom: 12, background: 'rgba(245,158,11,0.08)', border: '1px dashed rgba(245,158,11,0.35)', borderRadius: 8, color: '#f59e0b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif' }}>
                + Agregar reflexión
              </button>
              {tareas.length === 0 ? (
                <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>Sin reflexión cargada. Agrega la primera.</p>
              ) : tareas.map(t => (
                <div key={t.id} style={{ background: '#152035', borderRadius: 10, padding: '14px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reflexión para la próxima clase</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => onEditTarea?.(t)} style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 5, color: '#0ea5e9', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>✏️</button>
                      <button onClick={() => { if (confirm('¿Eliminar esta reflexión?')) onEliminarTarea?.(t.id); }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, color: '#ef4444', fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>🗑️</button>
                    </div>
                  </div>
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
