'use client';
import { useState, useEffect, useRef } from 'react';
import { useEscuela, type Clase, type Plantilla, type Tarea, type DiaCronograma, type TipoDia } from '@/hooks/useEscuela';
import { getSupabase } from '@/lib/supabase';

// ─── Paleta ───────────────────────────────────────────────────────────────────

const S = {
  navy:    '#0d1b2a',
  navy2:   '#152035',
  navy3:   '#1e3050',
  green:   '#22c55e',
  green2:  '#4ade80',
  emerald: '#10b981',
  amber:   '#f59e0b',
  red:     '#ef4444',
  text:    '#e2e8f0',
  muted:   '#94a3b8',
  border:  'rgba(34,197,94,0.2)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)     return 'ahora';
  if (diff < 3600)   return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400)  return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

// ─── Estilos comunes ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1.5px solid rgba(34,197,94,0.25)`, background: S.navy,
  color: S.text, fontFamily: 'Montserrat, sans-serif', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: S.muted,
  marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase',
};
const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff',
  border: 'none', borderRadius: 8, padding: '9px 20px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
const btnOutline: React.CSSProperties = {
  background: 'transparent', color: S.muted,
  border: `1.5px solid rgba(34,197,94,0.25)`, borderRadius: 8, padding: '7px 14px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 10px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, cursor: 'pointer',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Modal Clase (admin) ──────────────────────────────────────────────────────

function ClaseModal({ open, onClose, semana, clase, onSave }: {
  open: boolean; onClose: () => void; semana: number;
  clase?: Partial<Clase>;
  onSave: (c: Partial<Clase> & { semana: number; titulo: string }) => Promise<void>;
}) {
  const [titulo,   setTitulo]   = useState('');
  const [desc,     setDesc]     = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [activa,   setActiva]   = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    setTitulo(clase?.titulo ?? '');
    setDesc(clase?.descripcion ?? '');
    setUrlVideo(clase?.url_video ?? '');
    setActiva(clase?.activa ?? false);
  }, [clase, open]);

  async function handleSave() {
    if (!titulo.trim()) return;
    setSaving(true);
    await onSave({
      id: clase?.id, semana, orden: clase?.orden ?? 1,
      titulo: titulo.trim(),
      descripcion: desc.trim() || undefined,
      url_video: urlVideo.trim() || undefined,
      activa,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={clase?.id ? 'Editar clase' : `Nueva clase — Semana ${semana}`}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Título de la clase</label>
        <input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="ej: Montaje del criadero BSF" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Descripción (opcional)</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Qué verán en esta clase..." />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>URL del video (YouTube)</label>
        <input style={inputStyle} value={urlVideo} onChange={e => setUrlVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
      </div>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="activa-check" checked={activa} onChange={e => setActiva(e.target.checked)} style={{ width: 16, height: 16, accentColor: S.green, cursor: 'pointer' }} />
        <label htmlFor="activa-check" style={{ fontSize: 13, color: S.text, cursor: 'pointer' }}>
          Clase activa — visible para estudiantes
        </label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ ...btnPrimary, opacity: !titulo.trim() || saving ? 0.6 : 1 }} onClick={handleSave} disabled={!titulo.trim() || saving}>
          {saving ? 'Guardando...' : 'Guardar clase'}
        </button>
        <button style={btnOutline} onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── Modal Plantilla (admin) ──────────────────────────────────────────────────

function PlantillaModal({ open, onClose, semana, plantilla, onSave }: {
  open: boolean; onClose: () => void; semana: number;
  plantilla?: Partial<Plantilla>;
  onSave: (p: Partial<Plantilla> & { semana: number; titulo: string; url_archivo: string }) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState('');
  const [desc,   setDesc]   = useState('');
  const [url,    setUrl]    = useState('');
  const [tamano, setTamano] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitulo(plantilla?.titulo ?? '');
    setDesc(plantilla?.descripcion ?? '');
    setUrl(plantilla?.url_archivo ?? '');
    setTamano(plantilla?.tamano_aprox ?? '');
  }, [plantilla, open]);

  async function handleSave() {
    if (!titulo.trim() || !url.trim()) return;
    setSaving(true);
    await onSave({
      id: plantilla?.id, semana,
      titulo: titulo.trim(),
      descripcion: desc.trim() || undefined,
      url_archivo: url.trim(),
      tamano_aprox: tamano.trim() || undefined,
      orden: plantilla?.orden ?? 1,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={plantilla?.id ? 'Editar plantilla' : `Nueva plantilla — Semana ${semana}`}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Nombre</label>
        <input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="ej: Registro de alimentación semanal" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Descripción (opcional)</label>
        <input style={inputStyle} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Para qué sirve este documento..." />
      </div>
      <div style={{ marginBottom: 6 }}>
        <label style={labelStyle}>URL del PDF</label>
        <input style={inputStyle} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://drive.google.com/..." />
      </div>
      <p style={{ fontSize: 11, color: S.muted, margin: '0 0 14px' }}>
        En Google Drive → Compartir → "Cualquiera con el enlace puede ver"
      </p>
      <div style={{ marginBottom: 22 }}>
        <label style={labelStyle}>Tamaño aprox.</label>
        <input style={{ ...inputStyle, width: 140 }} value={tamano} onChange={e => setTamano(e.target.value)} placeholder="ej: 1.2 MB" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ ...btnPrimary, opacity: !titulo.trim() || !url.trim() || saving ? 0.6 : 1 }} onClick={handleSave} disabled={!titulo.trim() || !url.trim() || saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button style={btnOutline} onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── Contenido por semana ─────────────────────────────────────────────────────

const SEMANAS_INFO = [
  { num: 1, emoji: '🌱', title: 'Bases del Sistema',
    items: ['El ciclo completo de la BSF explicado sin tecnicismos', 'Qué espacio necesitas (desde 1 m²)', 'Materiales que ya tienes vs. los que consigues local', 'Cómo activar tu primera semilla correctamente'] },
  { num: 2, emoji: '🐛', title: 'Manejo del Lote',
    items: ['Alimentación diaria: qué darles, cuánto y cuándo', 'Control de temperatura y humedad sin equipos especiales', 'Cómo leer el estado de las larvas en cada etapa', 'Qué hacer si algo sale diferente a lo esperado'] },
  { num: 3, emoji: '⚖️', title: 'Cosecha y Uso',
    items: ['Cuándo y cómo cosechar (señales exactas)', 'Larva viva, larva seca y harina — cuál usar y cuándo', 'Raciones por especie: pollos, peces y cerdos', 'Cómo documentar tus resultados y calcular el ahorro real'] },
  { num: 4, emoji: '🔄', title: 'Ciclo Cerrado',
    items: ['Cómo generar tu propia semilla sin comprar más', 'Montaje de trampas de oviposición', 'Plan de sostenibilidad: cómo mantener el sistema activo solo', 'Preguntas finales + revisión de avances del grupo'] },
];

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(target: string | null) {
  const [diff, setDiff] = useState<number | null>(null);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!target) { setDiff(null); return; }
    const tick = () => setDiff(new Date(target).getTime() - Date.now());
    tick();
    ref.current = setInterval(tick, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target]);
  return diff;
}

function fmtCountdown(ms: number) {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

// ─── Cronograma helpers ───────────────────────────────────────────────────────

const TIPO_META: Record<TipoDia, { emoji: string; label: string; color: string }> = {
  clase:   { emoji: '🎥', label: 'Clase en vivo', color: '#22c55e' },
  tarea:   { emoji: '📝', label: 'Tarea',          color: '#f59e0b' },
  reporte: { emoji: '📊', label: 'Reporte',        color: '#0ea5e9' },
  recurso: { emoji: '📄', label: 'Recurso',        color: '#a78bfa' },
  libre:   { emoji: '🗓️', label: 'Actividad libre', color: '#64748b' },
};

function fmtFecha(dateStr: string): { dia: string; mes: string; diaSem: string } {
  const d = new Date(dateStr + 'T12:00:00');
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return { diaSem: dias[d.getDay()], dia: String(d.getDate()), mes: meses[d.getMonth()] };
}

function esHoy(dateStr: string): boolean {
  const hoy = new Date();
  const d = new Date(dateStr + 'T12:00:00');
  return d.getFullYear() === hoy.getFullYear() && d.getMonth() === hoy.getMonth() && d.getDate() === hoy.getDate();
}

function esPasado(dateStr: string): boolean {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  return new Date(dateStr + 'T00:00:00') < hoy;
}

// ─── Modal Día Cronograma (admin) ─────────────────────────────────────────────

function DiaCronogramaModal({ open, onClose, dia, onSave, onDelete }: {
  open: boolean; onClose: () => void;
  dia?: Partial<DiaCronograma>;
  onSave: (d: Partial<DiaCronograma> & { fecha: string; semana: number; tipo: TipoDia; titulo: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [fecha,    setFecha]    = useState('');
  const [semana,   setSemana]   = useState(1);
  const [tipo,     setTipo]     = useState<TipoDia>('clase');
  const [titulo,   setTitulo]   = useState('');
  const [desc,     setDesc]     = useState('');
  const [activo,   setActivo]   = useState(true);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    setFecha(dia?.fecha ?? '');
    setSemana(dia?.semana ?? 1);
    setTipo(dia?.tipo ?? 'clase');
    setTitulo(dia?.titulo ?? '');
    setDesc(dia?.descripcion ?? '');
    setActivo(dia?.activo ?? true);
  }, [dia, open]);

  async function handleSave() {
    if (!fecha || !titulo.trim()) return;
    setSaving(true);
    await onSave({ id: dia?.id, fecha, semana, tipo, titulo: titulo.trim(), descripcion: desc.trim() || undefined, activo });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={dia?.id ? 'Editar actividad' : 'Nueva actividad'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Fecha</label>
            <input type="date" style={inputStyle} value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Semana</label>
            <select style={inputStyle} value={semana} onChange={e => setSemana(Number(e.target.value))}>
              {[1,2,3,4].map(s => <option key={s} value={s}>Semana {s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Tipo de actividad</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(Object.entries(TIPO_META) as [TipoDia, typeof TIPO_META[TipoDia]][]).map(([k, v]) => (
              <button key={k} onClick={() => setTipo(k)}
                style={{ padding: '6px 12px', borderRadius: 6, border: `1.5px solid ${tipo === k ? v.color : 'rgba(255,255,255,0.1)'}`,
                  background: tipo === k ? `${v.color}22` : 'transparent', color: tipo === k ? v.color : '#64748b',
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Título</label>
          <input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="ej: Clase en vivo — Semana 1" />
        </div>
        <div>
          <label style={labelStyle}>Descripción (opcional)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Detalles de la actividad" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="dia-activo" checked={activo} onChange={e => setActivo(e.target.checked)} />
          <label htmlFor="dia-activo" style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>Visible para socios</label>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          {dia?.id && onDelete && (
            <button style={btnDanger} onClick={async () => { if (confirm('¿Eliminar esta actividad?')) { await onDelete(dia.id!); onClose(); } }}>
              🗑️ Eliminar
            </button>
          )}
          <button style={btnOutline} onClick={onClose}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving || !fecha || !titulo.trim()}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal Tarea (admin) ──────────────────────────────────────────────────────

function TareaModal({ open, onClose, semana, tarea, onSave }: {
  open: boolean; onClose: () => void; semana: number;
  tarea?: Partial<Tarea>;
  onSave: (t: Partial<Tarea> & { semana: number; pregunta: string }) => Promise<void>;
}) {
  const [pregunta, setPregunta] = useState('');
  const [activa, setActiva]     = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    setPregunta(tarea?.pregunta ?? '');
    setActiva(tarea?.activa ?? false);
  }, [tarea, open]);

  async function handleSave() {
    if (!pregunta.trim()) return;
    setSaving(true);
    await onSave({ id: tarea?.id, semana, pregunta: pregunta.trim(), activa });
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={tarea?.id ? 'Editar tarea' : `Nueva tarea — Semana ${semana}`}>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Pregunta / enunciado</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 88 }} value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="ej: ¿Qué observaste en tu lote esta semana? Comparte temperatura, humedad y cualquier novedad." />
      </div>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" id="tarea-activa" checked={activa} onChange={e => setActiva(e.target.checked)} style={{ width: 16, height: 16, accentColor: S.green, cursor: 'pointer' }} />
        <label htmlFor="tarea-activa" style={{ fontSize: 13, color: S.text, cursor: 'pointer' }}>Tarea activa — visible para estudiantes</label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ ...btnPrimary, opacity: !pregunta.trim() || saving ? 0.6 : 1 }} onClick={handleSave} disabled={!pregunta.trim() || saving}>
          {saving ? 'Guardando...' : 'Guardar tarea'}
        </button>
        <button style={btnOutline} onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ─── EscuelaView ─────────────────────────────────────────────────────────────

type EscuelaSub = 'clase' | 'plantillas' | 'tarea' | 'foro' | 'progreso' | 'directorio' | 'cronograma';

const REACTIONS = ['❤️', '🔥', '💡', '🙌'] as const;

function descargarCertificado(nombre: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, 1200, 800);

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 1160, 760);
  ctx.strokeStyle = 'rgba(34,197,94,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, 1136, 736);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillText('✦  PROLARVA  ✦', 600, 78);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 46px Georgia, serif';
  ctx.fillText('Certificado de Completación', 600, 178);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px Arial, sans-serif';
  ctx.fillText('Programa Colonia · 4 Semanas de Clases en Vivo BSF', 600, 232);

  ctx.strokeStyle = 'rgba(34,197,94,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 278); ctx.lineTo(1040, 278); ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Se certifica que', 600, 340);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText(nombre, 600, 430);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px Arial, sans-serif';
  ctx.fillText('ha completado exitosamente el Programa Colonia de ProLarva', 600, 496);
  ctx.font = '15px Arial, sans-serif';
  ctx.fillText('adquiriendo conocimientos prácticos en cría de Larva Soldado Negra (BSF)', 600, 530);

  ctx.beginPath(); ctx.moveTo(160, 590); ctx.lineTo(1040, 590); ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '14px Arial, sans-serif';
  const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText(fecha, 600, 650);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillText('prolarva.co', 600, 690);

  const link = document.createElement('a');
  link.download = `certificado-prolarva-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export default function EscuelaView({
  socioCode, socioNombre, isAdmin,
}: {
  socioCode: string;
  socioNombre: string;
  isAdmin: boolean;
}) {
  const esc = useEscuela(socioCode);

  const [semana, setSemana]   = useState(1);
  const [sub,    setSub]      = useState<EscuelaSub>('clase');

  // Admin modals
  const [modalClase,      setModalClase]      = useState(false);
  const [editClase,       setEditClase]       = useState<Partial<Clase> | undefined>();
  const [modalPlantilla,  setModalPlantilla]  = useState(false);
  const [editPlantilla,   setEditPlantilla]   = useState<Partial<Plantilla> | undefined>();
  const [modalTarea,      setModalTarea]      = useState(false);
  const [editTarea,       setEditTarea]       = useState<Partial<Tarea> | undefined>();
  const [modalDia,        setModalDia]        = useState(false);
  const [editDia,         setEditDia]         = useState<Partial<DiaCronograma> | undefined>();
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderMsg,     setReminderMsg]     = useState<string | null>(null);

  // Tablón
  const [tablonText,    setTablonText]    = useState('');
  const [tablonFijado,  setTablonFijado]  = useState(false);
  const [tablonPosting, setTablonPosting] = useState(false);
  const [tablonOpen,    setTablonOpen]    = useState(true);

  // Countdown
  const countdown = useCountdown(esc.proxClase);
  const [proxInput,     setProxInput]     = useState('');
  const [editingProx,   setEditingProx]   = useState(false);

  // Tareas
  const [tareaText,    setTareaText]    = useState('');
  const [tareaPosting, setTareaPosting] = useState(false);

  // Foro
  const [foroText,    setForoText]    = useState('');
  const [posting,     setPosting]     = useState(false);
  const [foroSuccess, setForoSuccess] = useState(false);
  const [foroSearch,  setForoSearch]  = useState('');

  // Respuestas
  const [replyingTo,  setReplyingTo]  = useState<string | null>(null);
  const [replyText,   setReplyText]   = useState('');
  const [replyPosting, setReplyPosting] = useState(false);

  // Admin progreso
  const [adminSocios,   setAdminSocios]   = useState<{ code: string; nombre: string }[]>([]);
  const [adminProgreso, setAdminProgreso] = useState<{ socio_code: string; clase_id: string }[]>([]);

  // Códigos de admin (para badge ProLarva)
  const [adminCodes, setAdminCodes] = useState<Set<string>>(new Set());

  // Respuestas colapsadas — expandidas por ID de post
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Preview mode: oculta controles de admin para ver la vista de socio
  const [previewMode, setPreviewMode] = useState(false);
  const asAdmin = isAdmin && !previewMode;

  const SEMANAS = [1, 2, 3, 4];

  const clasesActuales = esc.clasesPorSemana(semana).filter(c => c.activa || asAdmin);
  const plantillasActuales = esc.plantillasPorSemana(semana);

  // Nav por semana
  const navSemanas = SEMANAS.map(s => {
    const cs = esc.clasesPorSemana(s).filter(c => c.activa || asAdmin);
    const vis = cs.filter(c => esc.estaVisto(c.id)).length;
    return { s, total: cs.length, vis, completa: cs.length > 0 && vis === cs.length };
  });

  // Cargar códigos de admin al montar
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from('socios').select('code').eq('rol', 'admin').then(({ data }) => {
      if (data) setAdminCodes(new Set(data.map((s: { code: string }) => s.code)));
    });
  }, []);

  // Cargar progreso de todos cuando admin entra a esa tab
  useEffect(() => {
    if (!isAdmin || sub !== 'progreso') return;
    const sb = getSupabase();
    if (!sb) return;
    Promise.all([
      sb.from('socios').select('code,nombre').eq('estado', 'activo'),
      sb.from('progreso_clases').select('socio_code,clase_id'),
    ]).then(([sRes, pRes]) => {
      setAdminSocios(sRes.data?.map(x => ({ code: x.code, nombre: x.nombre })) ?? []);
      setAdminProgreso(pRes.data ?? []);
    });
  }, [isAdmin, sub]);

  async function handlePublicar() {
    if (!foroText.trim()) return;
    setPosting(true);
    const ok = await esc.publicarPost(foroText, socioNombre);
    if (ok) { setForoText(''); setForoSuccess(true); setTimeout(() => setForoSuccess(false), 2000); }
    setPosting(false);
  }

  async function handleLike(postId: string, tipo: string, authorCode: string) {
    const post = esc.posts.find(p => p.id === postId);
    const wasReacted = post?.reactions.some(r => r.socio_code === socioCode && r.tipo === tipo);
    await esc.toggleLike(postId, tipo);
    if (!wasReacted && authorCode !== socioCode) {
      fetch('/api/foro/notify-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_code: authorCode, from_name: socioNombre, tipo }),
      }).catch(() => {});
    }
  }

  async function handleReply(parentId: string, authorCode: string) {
    if (!replyText.trim()) return;
    setReplyPosting(true);
    const ok = await esc.publicarPost(replyText, socioNombre, parentId);
    if (ok) {
      setReplyText('');
      setReplyingTo(null);
      setExpandedReplies(prev => new Set([...prev, parentId]));
      // Notificar al autor si no es uno mismo
      if (authorCode !== socioCode) {
        fetch('/api/foro/notify-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to_code: authorCode, from_name: socioNombre, preview: replyText }),
        }).catch(() => {});
      }
    }
    setReplyPosting(false);
  }

  // ── Nav item helper ──────────────────────────────────────────────────────
  function NavItem({
    label, active, onClick, badge,
  }: { label: string; active: boolean; onClick: () => void; badge?: string }) {
    return (
      <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', cursor: 'pointer', borderRadius: 8,
        background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
        color: active ? S.green2 : S.text,
        fontWeight: 600, fontSize: 13, transition: 'all 0.12s',
      }}>
        <span>{label}</span>
        {badge && <span style={{ fontSize: 10, color: active ? S.emerald : S.muted }}>{badge}</span>}
      </div>
    );
  }

  function SubNavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 12px 5px 20px', cursor: 'pointer', borderRadius: 6,
        background: active ? 'rgba(34,197,94,0.07)' : 'transparent',
        color: active ? S.green2 : S.muted,
        fontSize: 12, fontWeight: 600, transition: 'all 0.1s',
      }}>
        {label}
      </div>
    );
  }

  const inSemana = sub === 'clase' || sub === 'plantillas' || sub === 'tarea';

  async function handleSendReminder() {
    setSendingReminder(true);
    setReminderMsg(null);
    try {
      const res = await fetch('/api/push/cronograma-reminder', { method: 'POST' });
      const json = await res.json();
      setReminderMsg(res.ok ? `✅ Enviado a ${json.sent ?? 0} socios` : `❌ ${json.error ?? 'Error al enviar'}`);
    } catch {
      setReminderMsg('❌ Error de red');
    }
    setSendingReminder(false);
    setTimeout(() => setReminderMsg(null), 4000);
  }

  return (
    <div className="esc-outer">

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>🎓 Mi Escuela</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>
            Programa Colonia · 4 semanas
            {esc.totalClases > 0 && (
              <span style={{ marginLeft: 10, color: S.green2, fontWeight: 700 }}>
                · {esc.totalVistos}/{esc.totalClases} clases completadas
              </span>
            )}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setPreviewMode(p => !p)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              background: previewMode ? 'rgba(34,197,94,0.12)' : 'rgba(148,163,184,0.08)',
              border: `1px solid ${previewMode ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.2)'}`,
              borderRadius: 8, padding: '6px 12px',
              color: previewMode ? S.green2 : S.muted,
              fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: 11, cursor: 'pointer',
            }}
          >
            {previewMode ? '🔓 Salir del preview' : '👁️ Vista de socio'}
          </button>
        )}
      </div>

      {/* ── Certificado ──────────────────────────────────── */}
      {!asAdmin && esc.totalClases > 0 && esc.totalVistos === esc.totalClases && (
        <div style={{ marginBottom: 16, background: 'linear-gradient(135deg,rgba(34,197,94,0.12),rgba(16,185,129,0.08))', border: '1px solid rgba(34,197,94,0.5)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: S.green2, marginBottom: 2 }}>¡Completaste el Programa Colonia!</div>
            <div style={{ fontSize: 12, color: S.muted }}>Descarga tu certificado y compártelo con tu comunidad.</div>
          </div>
          <button
            onClick={() => descargarCertificado(socioNombre)}
            style={{ ...btnPrimary, fontSize: 12, padding: '8px 18px', flexShrink: 0 }}
          >
            ⬇️ Descargar certificado
          </button>
        </div>
      )}

      {/* ── Countdown ────────────────────────────────────── */}
      {(esc.proxClase || asAdmin) && (() => {
        const fmt = countdown !== null ? fmtCountdown(countdown) : null;
        const past = countdown !== null && countdown <= 0;
        return (
          <div style={{ marginBottom: 16, background: past ? 'rgba(34,197,94,0.12)' : 'rgba(14,165,233,0.08)', border: `1px solid ${past ? 'rgba(34,197,94,0.35)' : 'rgba(14,165,233,0.25)'}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }}>{past ? '🟢' : '📅'}</span>
            <div style={{ flex: 1, minWidth: 160 }}>
              {past ? (
                <div style={{ fontSize: 13, fontWeight: 800, color: S.green2 }}>¡Clase en curso! Únete ahora.</div>
              ) : fmt ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Próxima clase en vivo</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#7dd3fc', letterSpacing: '0.03em' }}>{fmt}</div>
                  {esc.proxClase && (
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                      {new Date(esc.proxClase).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} · {new Date(esc.proxClase).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 13, color: S.muted }}>Sin clase programada</div>
              )}
            </div>
            {asAdmin && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {editingProx ? (
                  <>
                    <input type="datetime-local" value={proxInput} onChange={e => setProxInput(e.target.value)}
                      style={{ ...inputStyle, width: 'auto', fontSize: 12, padding: '6px 10px' }} />
                    <button style={{ ...btnPrimary, fontSize: 11, padding: '6px 12px' }} onClick={async () => { if (proxInput) { await esc.setProximaClase(new Date(proxInput).toISOString()); setEditingProx(false); } }}>
                      Guardar
                    </button>
                    <button style={{ ...btnOutline, fontSize: 11, padding: '6px 10px' }} onClick={() => setEditingProx(false)}>✕</button>
                  </>
                ) : (
                  <>
                    <button style={{ ...btnOutline, fontSize: 11, padding: '5px 10px' }} onClick={() => { setProxInput(''); setEditingProx(true); }}>✏️ Editar</button>
                    {esc.proxClase && <button style={{ ...btnOutline, fontSize: 11, padding: '5px 10px', color: S.red, borderColor: 'rgba(239,68,68,0.3)' }} onClick={esc.borrarProximaClase}>🗑️</button>}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Tablón de anuncios ───────────────────────────── */}
      {(esc.anuncios.length > 0 || asAdmin) && (
        <div style={{ marginBottom: 20, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, overflow: 'hidden' }}>
          <button onClick={() => setTablonOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>
            <span style={{ fontSize: 16 }}>📌</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 800, color: S.amber }}>Tablón de anuncios</span>
            {esc.anuncios.length > 0 && <span style={{ fontSize: 11, color: S.amber, fontWeight: 700 }}>{esc.anuncios.length}</span>}
            <span style={{ fontSize: 12, color: S.muted }}>{tablonOpen ? '▲' : '▼'}</span>
          </button>

          {tablonOpen && (
            <div style={{ padding: '0 16px 16px' }}>
              {asAdmin && (
                <div style={{ marginBottom: 14 }}>
                  <textarea
                    value={tablonText}
                    onChange={e => setTablonText(e.target.value.slice(0, 600))}
                    placeholder="Escribe un anuncio para el grupo..."
                    style={{ ...inputStyle, resize: 'none', minHeight: 72, marginBottom: 8, fontSize: 13 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: S.muted, cursor: 'pointer' }}>
                      <input type="checkbox" checked={tablonFijado} onChange={e => setTablonFijado(e.target.checked)} style={{ accentColor: S.amber }} />
                      📌 Fijar arriba
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: S.muted }}>{tablonText.length}/600</span>
                      <button
                        style={{ ...btnPrimary, background: 'linear-gradient(135deg,#f59e0b,#d97706)', fontSize: 12, padding: '7px 16px', opacity: !tablonText.trim() || tablonPosting ? 0.5 : 1 }}
                        disabled={!tablonText.trim() || tablonPosting}
                        onClick={async () => {
                          setTablonPosting(true);
                          await esc.publicarAnuncio(tablonText, socioNombre, tablonFijado);
                          setTablonText(''); setTablonFijado(false);
                          setTablonPosting(false);
                        }}
                      >
                        {tablonPosting ? 'Publicando...' : 'Publicar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {esc.anuncios.length === 0 ? (
                <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Sin anuncios aún.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {esc.anuncios.map(a => (
                    <div key={a.id} style={{ background: a.fijado ? 'rgba(245,158,11,0.1)' : S.navy2, border: `1px solid ${a.fijado ? 'rgba(245,158,11,0.3)' : S.border}`, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {a.fijado && <span style={{ fontSize: 11, color: S.amber }}>📌</span>}
                          <span style={{ fontSize: 12, fontWeight: 700, color: S.green2 }}>ProLarva</span>
                          <span style={{ fontSize: 11, color: '#475569' }}>{timeAgo(a.creado_en)}</span>
                        </div>
                        {asAdmin && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => esc.toggleFijarAnuncio(a.id, !a.fijado)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: a.fijado ? S.amber : S.muted }}>📌</button>
                            <button onClick={() => { if (confirm('¿Eliminar este anuncio?')) esc.eliminarAnuncio(a.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#475569' }}>🗑️</button>
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: S.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{a.contenido}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Mobile tabs principales ───────────────────────── */}
      <div className="esc-mob-main-tabs">
        {SEMANAS.map(s => (
          <button key={s} className={`esc-mob-tab${semana === s && inSemana ? ' esc-mob-tab-active' : ''}`}
            onClick={() => { setSemana(s); setSub('clase'); }}>
            Sem {s}{navSemanas[s-1].completa ? ' ✓' : ''}
          </button>
        ))}
        <button className={`esc-mob-tab${sub === 'cronograma' ? ' esc-mob-tab-active' : ''}`}
          onClick={() => setSub('cronograma')}>
          📅 Cronograma
        </button>
        <button className={`esc-mob-tab${sub === 'foro' ? ' esc-mob-tab-active' : ''}`}
          onClick={() => setSub('foro')}>
          💬 Foro
        </button>
        <button className={`esc-mob-tab${sub === 'directorio' ? ' esc-mob-tab-active' : ''}`}
          onClick={() => setSub('directorio')}>
          👥
        </button>
        {asAdmin && (
          <button className={`esc-mob-tab${sub === 'progreso' ? ' esc-mob-tab-active' : ''}`}
            onClick={() => setSub('progreso')}>
            📊
          </button>
        )}
      </div>

      {/* ── Mobile sub-tabs (clase / plantillas) ─────────── */}
      {inSemana && (
        <div className="esc-mob-sub-tabs">
          <button className={`esc-mob-sub${sub === 'clase' ? ' esc-mob-sub-active' : ''}`}
            onClick={() => setSub('clase')}>🎥 Clase</button>
          <button className={`esc-mob-sub${sub === 'plantillas' ? ' esc-mob-sub-active' : ''}`}
            onClick={() => setSub('plantillas')}>📄 Plantillas</button>
          <button className={`esc-mob-sub${sub === 'tarea' ? ' esc-mob-sub-active' : ''}`}
            onClick={() => setSub('tarea')}>📝 Tarea</button>
        </div>
      )}

      {/* ── Layout principal ──────────────────────────────── */}
      <div className="esc-wrap">

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="esc-nav">
          <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px 8px' }}>
            Semanas
          </div>

          {navSemanas.map(({ s, total, vis, completa }) => (
            <div key={s}>
              <NavItem
                label={`📅 Semana ${s}`}
                active={semana === s && inSemana}
                onClick={() => { setSemana(s); setSub('clase'); }}
                badge={completa ? '✓' : total > 0 ? `${vis}/${total}` : undefined}
              />
              {semana === s && inSemana && (
                <>
                  <SubNavItem label="🎥  Clase"      active={sub === 'clase'}      onClick={() => setSub('clase')} />
                  <SubNavItem label={`📄  Plantillas (${plantillasActuales.length})`} active={sub === 'plantillas'} onClick={() => setSub('plantillas')} />
                  <SubNavItem label="📝  Tarea"      active={sub === 'tarea'}      onClick={() => setSub('tarea')} />
                </>
              )}
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${S.border}`, margin: '8px 12px 8px' }} />

          <NavItem
            label="📅 Cronograma"
            active={sub === 'cronograma'}
            onClick={() => setSub('cronograma')}
            badge={esc.cronograma.filter(d => d.activo && esHoy(d.fecha)).length > 0 ? 'HOY' : undefined}
          />

          <div style={{ borderTop: `1px solid ${S.border}`, margin: '8px 12px 8px' }} />

          <NavItem
            label="💬 Foro"
            active={sub === 'foro'}
            onClick={() => setSub('foro')}
            badge={esc.posts.length > 0 ? String(esc.posts.filter(p => !p.parent_id).length) : undefined}
          />
          <NavItem
            label="👥 Directorio"
            active={sub === 'directorio'}
            onClick={() => setSub('directorio')}
            badge={esc.sociosColonia.filter(s => s.en_colonia).length > 0
              ? String(esc.sociosColonia.filter(s => s.en_colonia).length)
              : undefined}
          />

          {asAdmin && (
            <>
              <div style={{ borderTop: `1px solid ${S.border}`, margin: '8px 12px 8px' }} />
              <div onClick={() => setSub('progreso')} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', cursor: 'pointer', borderRadius: 8,
                background: sub === 'progreso' ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: sub === 'progreso' ? S.amber : S.muted,
                fontWeight: 600, fontSize: 13,
              }}>
                📊 Progreso
              </div>
            </>
          )}
        </aside>

        {/* ── Contenido ────────────────────────────────────── */}
        <div className="esc-content">

          {/* ━━━ CLASE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'clase' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📅 Semana {semana} — Clase</h2>
                {asAdmin && (
                  <button
                    style={{ ...btnOutline, fontSize: 12, color: S.amber, borderColor: 'rgba(245,158,11,0.35)' }}
                    onClick={() => { setEditClase(undefined); setModalClase(true); }}
                  >
                    + Agregar clase
                  </button>
                )}
              </div>

              {/* Banner informativo de la semana */}
              {(() => {
                const info = SEMANAS_INFO[semana - 1];
                return (
                  <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{info.emoji}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: S.green2, marginBottom: 8 }}>
                        Semana {info.num}: {info.title}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {info.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: S.muted, lineHeight: 1.5 }}>
                            <span style={{ color: S.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {clasesActuales.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
                  <div style={{ fontSize: '3rem', marginBottom: 14 }}>🎬</div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {asAdmin
                      ? 'Sin clases en esta semana. Agrega la primera arriba.'
                      : 'La clase de esta semana estará disponible pronto.'}
                  </p>
                </div>
              ) : (
                clasesActuales.map(clase => {
                  const videoId = clase.url_video ? getYouTubeId(clase.url_video) : null;
                  const visto   = esc.estaVisto(clase.id);
                  return (
                    <div key={clase.id} style={{ marginBottom: 32 }}>
                      {asAdmin && !clase.activa && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: S.amber, fontWeight: 700, marginBottom: 10 }}>
                          🔒 No visible para estudiantes
                        </div>
                      )}

                      {/* Video */}
                      {videoId ? (
                        <div style={{ borderRadius: 14, overflow: 'hidden', background: '#000', marginBottom: 16, border: `1px solid ${S.border}` }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div style={{ borderRadius: 14, background: S.navy2, border: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/9', marginBottom: 16 }}>
                          <div style={{ textAlign: 'center', color: S.muted }}>
                            <div style={{ fontSize: '3rem', marginBottom: 10 }}>🎬</div>
                            <p style={{ fontSize: 13 }}>
                              {asAdmin ? 'Sin URL de video — edita la clase para añadirla.' : 'Video disponible pronto.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Titulo + acciones admin */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{clase.titulo}</h3>
                          {clase.descripcion && (
                            <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65 }}>{clase.descripcion}</p>
                          )}
                        </div>
                        {asAdmin && (
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button style={btnOutline} onClick={() => { setEditClase(clase); setModalClase(true); }}>✏️</button>
                            <button style={btnDanger}  onClick={() => { if (confirm('¿Eliminar esta clase?')) esc.eliminarClase(clase.id); }}>🗑️</button>
                          </div>
                        )}
                      </div>

                      {/* Marcar como vista */}
                      {!asAdmin && (
                        <div style={{ marginTop: 16 }}>
                          <button
                            onClick={() => { if (!visto) esc.marcarVisto(clase.id); }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 8,
                              ...(visto
                                ? { ...btnOutline, color: S.emerald, borderColor: 'rgba(16,185,129,0.4)' }
                                : btnPrimary),
                            }}
                          >
                            {visto ? '✅ Clase completada' : '✓ Marcar como vista'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ━━━ PLANTILLAS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'plantillas' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📄 Plantillas — Semana {semana}</h2>
                {asAdmin && (
                  <button
                    style={{ ...btnOutline, fontSize: 12, color: S.amber, borderColor: 'rgba(245,158,11,0.35)' }}
                    onClick={() => { setEditPlantilla(undefined); setModalPlantilla(true); }}
                  >
                    + Agregar plantilla
                  </button>
                )}
              </div>
              <p style={{ fontSize: 13, color: S.muted, marginBottom: 20, lineHeight: 1.6 }}>
                Documentos de esta semana para imprimir o guardar en tu archivo de trabajo.
              </p>

              {plantillasActuales.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
                  <div style={{ fontSize: '3rem', marginBottom: 14 }}>📄</div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>
                    {asAdmin ? 'Sin plantillas para esta semana. Agrega la primera.' : 'Las plantillas de esta semana llegarán pronto.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
                  {plantillasActuales.map(p => (
                    <div key={p.id} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: `1px solid rgba(34,197,94,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          📋
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{p.titulo}</div>
                          {p.descripcion && <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.5 }}>{p.descripcion}</div>}
                          <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
                            PDF{p.tamano_aprox ? ` · ${p.tamano_aprox}` : ''}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a
                          href={p.url_archivo} target="_blank" rel="noopener noreferrer"
                          style={{ flex: 1, textAlign: 'center', ...btnPrimary, fontSize: 12, padding: '7px 12px', textDecoration: 'none' }}
                        >
                          ⬇️ Descargar PDF
                        </a>
                        {asAdmin && (
                          <>
                            <button style={btnOutline} onClick={() => { setEditPlantilla(p); setModalPlantilla(true); }}>✏️</button>
                            <button style={btnDanger}  onClick={() => { if (confirm('¿Eliminar?')) esc.eliminarPlantilla(p.id); }}>🗑️</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ━━━ TAREA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'tarea' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📝 Tarea — Semana {semana}</h2>
                {asAdmin && (
                  <button style={{ ...btnOutline, fontSize: 12, color: S.amber, borderColor: 'rgba(245,158,11,0.35)' }}
                    onClick={() => { setEditTarea(undefined); setModalTarea(true); }}>
                    + Nueva tarea
                  </button>
                )}
              </div>

              {(() => {
                const tareasSemana = esc.tareasPorSemana(semana).filter(t => t.activa || asAdmin);

                if (tareasSemana.length === 0) return (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
                    <div style={{ fontSize: '3rem', marginBottom: 14 }}>📝</div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>
                      {asAdmin ? 'Sin tarea para esta semana. Crea una arriba.' : 'La tarea de esta semana estará disponible pronto.'}
                    </p>
                  </div>
                );

                return tareasSemana.map(tarea => {
                  const entrega  = esc.miEntrega(tarea.id);
                  const entregas = esc.entregasPorTarea(tarea.id);

                  return (
                    <div key={tarea.id} style={{ marginBottom: 28 }}>
                      {asAdmin && !tarea.activa && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: S.amber, fontWeight: 700, marginBottom: 10 }}>
                          🔒 No visible para estudiantes
                        </div>
                      )}

                      {/* Enunciado */}
                      <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: S.green, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Tarea de la semana</div>
                        <p style={{ fontSize: 14, color: S.text, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>{tarea.pregunta}</p>
                      </div>

                      {/* Admin: acciones + ver entregas */}
                      {asAdmin ? (
                        <div>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            <button style={btnOutline} onClick={() => { setEditTarea(tarea); setModalTarea(true); }}>✏️ Editar</button>
                            <button style={btnDanger}  onClick={() => { if (confirm('¿Eliminar esta tarea y todas sus entregas?')) esc.eliminarTarea(tarea.id); }}>🗑️</button>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: S.muted, marginBottom: 10 }}>
                            {entregas.length} entrega{entregas.length !== 1 ? 's' : ''} recibida{entregas.length !== 1 ? 's' : ''}
                          </div>
                          {entregas.length === 0 ? (
                            <p style={{ fontSize: 13, color: S.muted }}>Nadie ha entregado aún.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {entregas.map(e => (
                                <div key={e.id} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px' }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: S.green2 }}>{e.socio_nombre}</span>
                                    <span style={{ fontSize: 11, color: S.muted }}>@{e.socio_code}</span>
                                    <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{timeAgo(e.entregado_en)}</span>
                                  </div>
                                  <p style={{ fontSize: 13, color: S.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{e.respuesta}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Estudiante: formulario de entrega */
                        <div>
                          {entrega ? (
                            <div>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: S.emerald, fontWeight: 700, marginBottom: 12 }}>
                                ✅ Tarea entregada · {timeAgo(entrega.entregado_en)}
                              </div>
                              <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
                                <p style={{ fontSize: 13, color: S.text, lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{entrega.respuesta}</p>
                              </div>
                              <p style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>¿Quieres actualizar tu respuesta?</p>
                            </div>
                          ) : (
                            <p style={{ fontSize: 13, color: S.muted, marginBottom: 12 }}>Comparte tu avance de esta semana. Máx. 1000 caracteres.</p>
                          )}
                          <textarea
                            value={tareaText || entrega?.respuesta || ''}
                            onChange={e => setTareaText(e.target.value.slice(0, 1000))}
                            placeholder="Escribe tu respuesta aquí..."
                            style={{ ...inputStyle, resize: 'vertical', minHeight: 120, marginBottom: 8 }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: S.muted }}>{(tareaText || entrega?.respuesta || '').length}/1000</span>
                            <button
                              style={{ ...btnPrimary, opacity: !(tareaText || entrega?.respuesta || '').trim() || tareaPosting ? 0.5 : 1 }}
                              disabled={!(tareaText || entrega?.respuesta || '').trim() || tareaPosting}
                              onClick={async () => {
                                const texto = tareaText || entrega?.respuesta || '';
                                if (!texto.trim()) return;
                                setTareaPosting(true);
                                await esc.entregarTarea(tarea.id, texto, socioNombre);
                                setTareaText('');
                                setTareaPosting(false);
                              }}
                            >
                              {tareaPosting ? 'Enviando...' : entrega ? 'Actualizar entrega' : 'Entregar tarea'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* ━━━ FORO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'foro' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>💬 Foro del grupo</h2>
                <p style={{ fontSize: 13, color: S.muted }}>Comparte tu avance, pregunta lo que sea, conecta con el grupo.</p>
              </div>

              {/* Input publicar */}
              <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '1.25rem', marginBottom: 24 }}>
                <textarea
                  value={foroText}
                  onChange={e => setForoText(e.target.value.slice(0, 500))}
                  placeholder="¿Qué quieres compartir con el grupo?"
                  style={{ ...inputStyle, resize: 'none', minHeight: 88, marginBottom: 10, background: S.navy }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: foroText.length > 440 ? S.amber : S.muted }}>
                    {foroText.length}/500
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {foroSuccess && <span style={{ fontSize: 12, color: S.emerald, fontWeight: 700 }}>✅ Publicado</span>}
                    <button
                      style={{ ...btnPrimary, opacity: !foroText.trim() || posting ? 0.5 : 1 }}
                      disabled={!foroText.trim() || posting}
                      onClick={handlePublicar}
                    >
                      {posting ? 'Publicando...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Búsqueda */}
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: S.muted, pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  value={foroSearch}
                  onChange={e => setForoSearch(e.target.value)}
                  placeholder="Buscar en el foro..."
                  style={{ ...inputStyle, paddingLeft: 34, fontSize: 13 }}
                />
                {foroSearch && (
                  <button onClick={() => setForoSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 14 }}>✕</button>
                )}
              </div>

              {/* Feed */}
              {(() => {
                const topPosts = esc.posts.filter(p => !p.parent_id);
                const filtrados = foroSearch.trim()
                  ? topPosts.filter(p =>
                      p.contenido.toLowerCase().includes(foroSearch.toLowerCase()) ||
                      p.socio_nombre.toLowerCase().includes(foroSearch.toLowerCase())
                    )
                  : topPosts;
                const ordenados = [...filtrados].sort((a, b) => {
                  if (a.fijado && !b.fijado) return -1;
                  if (!a.fijado && b.fijado) return 1;
                  return 0;
                });
                return ordenados;
              })().length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: S.muted }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
                  <p style={{ fontSize: 13 }}>{foroSearch ? 'Sin resultados para esa búsqueda.' : 'El foro está vacío. ¡Sé el primero en publicar!'}</p>
                </div>
              ) : (
                <div>
                  {(() => {
                    const topPosts2 = esc.posts.filter(p => !p.parent_id);
                    const filtrados2 = foroSearch.trim()
                      ? topPosts2.filter(p =>
                          p.contenido.toLowerCase().includes(foroSearch.toLowerCase()) ||
                          p.socio_nombre.toLowerCase().includes(foroSearch.toLowerCase())
                        )
                      : topPosts2;
                    return [...filtrados2].sort((a, b) => {
                      if (a.fijado && !b.fijado) return -1;
                      if (!a.fijado && b.fijado) return 1;
                      return 0;
                    });
                  })().map(post => {
                    const myReaction = post.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
                    const isOwn      = post.socio_code === socioCode;
                    const isPostAdmin = adminCodes.has(post.socio_code);
                    const replies    = esc.posts
                      .filter(p => p.parent_id === post.id)
                      .sort((a, b) => new Date(a.creado_en).getTime() - new Date(b.creado_en).getTime());
                    const isReplying = replyingTo === post.id;
                    const isExpanded = expandedReplies.has(post.id);
                    const hasReplies = replies.length > 0;

                    return (
                      <div key={post.id} style={{ marginBottom: 12 }}>
                        {/* Post principal */}
                        <div style={{
                          background: S.navy2,
                          border: `1px solid ${post.fijado ? 'rgba(245,158,11,0.4)' : isPostAdmin ? 'rgba(34,197,94,0.4)' : S.border}`,
                          borderRadius: 14, padding: '1rem 1.25rem',
                        }}>
                          {post.fijado && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: S.amber, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              📌 Fijado
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: isPostAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0, marginTop: 1 }}>
                              {post.socio_nombre[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginBottom: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{post.socio_nombre}</span>
                                {isPostAdmin && (
                                  <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 7px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    ProLarva ✓
                                  </span>
                                )}
                                <span style={{ fontSize: 11, color: S.muted }}>@{post.socio_code}</span>
                                <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>{timeAgo(post.creado_en)}</span>
                              </div>
                              <p style={{ fontSize: 13, lineHeight: 1.65, color: S.text, marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {post.contenido}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                {REACTIONS.map(emoji => {
                                  const count = post.reactions.filter(r => r.tipo === emoji).length;
                                  const active = myReaction === emoji;
                                  return (
                                    <button key={emoji} onClick={() => handleLike(post.id, emoji, post.socio_code)}
                                      style={{ display: 'flex', alignItems: 'center', gap: 3, background: active ? 'rgba(34,197,94,0.1)' : 'none', border: active ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontSize: 12, color: active ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600, transition: 'all 0.1s' }}>
                                      {emoji}{count > 0 && ` ${count}`}
                                    </button>
                                  );
                                })}
                                <span style={{ width: 4 }} />
                                <button
                                  onClick={() => {
                                    const next = !isReplying;
                                    setReplyingTo(next ? post.id : null);
                                    setReplyText('');
                                    if (next) setExpandedReplies(prev => new Set([...prev, post.id]));
                                  }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isReplying ? S.green : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}
                                >
                                  💬 Responder
                                </button>
                                {hasReplies && (
                                  <button
                                    onClick={() => setExpandedReplies(prev => {
                                      const next = new Set(prev);
                                      if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
                                      return next;
                                    })}
                                    style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isExpanded ? S.green2 : S.muted, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, fontFamily: 'Montserrat,sans-serif' }}
                                  >
                                    {isExpanded ? '▲' : '▼'} {replies.length} respuesta{replies.length > 1 ? 's' : ''}
                                  </button>
                                )}
                                {asAdmin && (
                                  <button
                                    onClick={() => esc.fijarPost(post.id, !post.fijado)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: post.fijado ? S.amber : '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: 'auto' }}
                                    title={post.fijado ? 'Quitar pin' : 'Fijar post'}
                                  >
                                    📌
                                  </button>
                                )}
                                {(isOwn || asAdmin) && (
                                  <button
                                    onClick={() => { if (confirm('¿Eliminar este post y sus respuestas?')) esc.eliminarPost(post.id); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 12, padding: '3px', fontFamily: 'Montserrat,sans-serif', marginLeft: asAdmin ? 0 : 'auto' }}
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hilo de respuestas */}
                        {(isExpanded || isReplying) && (
                          <div style={{ marginLeft: 20, borderLeft: `2px solid rgba(34,197,94,0.2)`, paddingLeft: 16, marginTop: 6 }}>
                            {isExpanded && replies.map(reply => {
                              const myRReaction = reply.reactions.find(r => r.socio_code === socioCode)?.tipo ?? null;
                              const rOwn      = reply.socio_code === socioCode;
                              const rIsAdmin  = adminCodes.has(reply.socio_code);
                              return (
                                <div key={reply.id} style={{ background: S.navy, border: `1px solid ${rIsAdmin ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.1)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                                  <div style={{ display: 'flex', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: rIsAdmin ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                                      {reply.socio_nombre[0]?.toUpperCase() ?? '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3px 8px', marginBottom: 5 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>{reply.socio_nombre}</span>
                                        {rIsAdmin && (
                                          <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(34,197,94,0.15)', color: S.green, border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '1px 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                            ProLarva ✓
                                          </span>
                                        )}
                                        <span style={{ fontSize: 10, color: S.muted }}>@{reply.socio_code}</span>
                                        <span style={{ fontSize: 10, color: '#475569', marginLeft: 'auto' }}>{timeAgo(reply.creado_en)}</span>
                                      </div>
                                      <p style={{ fontSize: 12, lineHeight: 1.6, color: S.text, marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {reply.contenido}
                                      </p>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                        {REACTIONS.map(emoji => {
                                          const cnt = reply.reactions.filter(r => r.tipo === emoji).length;
                                          const act = myRReaction === emoji;
                                          return (
                                            <button key={emoji} onClick={() => handleLike(reply.id, emoji, reply.socio_code)}
                                              style={{ display: 'flex', alignItems: 'center', gap: 2, background: act ? 'rgba(34,197,94,0.1)' : 'none', border: act ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent', borderRadius: 5, padding: '2px 5px', cursor: 'pointer', fontSize: 11, color: act ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
                                              {emoji}{cnt > 0 && ` ${cnt}`}
                                            </button>
                                          );
                                        })}
                                        <span style={{ width: 2 }} />
                                        {(rOwn || asAdmin) && (
                                          <button
                                            onClick={() => { if (confirm('¿Eliminar esta respuesta?')) esc.eliminarPost(reply.id); }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 11, padding: '2px', fontFamily: 'Montserrat,sans-serif' }}
                                          >
                                            🗑️
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Input respuesta */}
                            {isReplying && (
                              <div style={{ background: S.navy, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
                                <textarea
                                  autoFocus
                                  value={replyText}
                                  onChange={e => setReplyText(e.target.value.slice(0, 500))}
                                  placeholder={`Responder a ${post.socio_nombre}...`}
                                  style={{ ...inputStyle, resize: 'none', minHeight: 64, marginBottom: 8, fontSize: 12 }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 10, color: replyText.length > 440 ? S.amber : S.muted }}>{replyText.length}/500</span>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={{ ...btnOutline, fontSize: 11, padding: '5px 12px' }} onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                                      Cancelar
                                    </button>
                                    <button
                                      style={{ ...btnPrimary, fontSize: 11, padding: '5px 14px', opacity: !replyText.trim() || replyPosting ? 0.5 : 1 }}
                                      disabled={!replyText.trim() || replyPosting}
                                      onClick={() => handleReply(post.id, post.socio_code)}
                                    >
                                      {replyPosting ? 'Enviando...' : 'Responder'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ━━━ DIRECTORIO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'directorio' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800 }}>👥 Directorio de la cohorte</h2>
                  <p style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Conoce a tus compañeros del Programa Colonia.</p>
                </div>
              </div>

              {esc.sociosColonia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
                  <div style={{ fontSize: '3rem', marginBottom: 14 }}>👥</div>
                  <p style={{ fontSize: 14 }}>No hay socios registrados aún.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                  {esc.sociosColonia
                    .filter(s => asAdmin || s.en_colonia)
                    .map(s => (
                    <div key={s.code} style={{ background: s.en_colonia ? 'rgba(34,197,94,0.05)' : S.navy2, border: `1px solid ${s.en_colonia ? 'rgba(34,197,94,0.25)' : S.border}`, borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.en_colonia ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16, flexShrink: 0 }}>
                          {s.nombre[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: S.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nombre}</div>
                          <div style={{ fontSize: 10, color: S.muted }}>@{s.code}</div>
                        </div>
                      </div>
                      {s.en_colonia && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 10px', fontSize: 10, color: S.green, fontWeight: 700 }}>
                          ✓ En el programa
                        </div>
                      )}
                      {asAdmin && (
                        <button
                          onClick={() => esc.toggleColonia(s.code, !s.en_colonia)}
                          style={{ ...btnOutline, fontSize: 11, padding: '5px 10px', color: s.en_colonia ? S.red : S.green2, borderColor: s.en_colonia ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }}
                        >
                          {s.en_colonia ? '✕ Retirar' : '+ Inscribir'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ━━━ PROGRESO ADMIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'progreso' && asAdmin && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>📊 Progreso de estudiantes</h2>

              {adminSocios.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: S.muted }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>📊</div>
                  <p>Cargando...</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Estudiante
                        </th>
                        {esc.clases.filter(c => c.activa).map(c => (
                          <th key={c.id} style={{ padding: '10px 8px', textAlign: 'center', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}`, fontSize: 10, whiteSpace: 'nowrap' }}>
                            S{c.semana}
                          </th>
                        ))}
                        <th style={{ padding: '10px 12px', textAlign: 'center', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}` }}>
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminSocios.map(socio => {
                        const activas = esc.clases.filter(c => c.activa);
                        const vis = activas.filter(c =>
                          adminProgreso.some(p => p.socio_code === socio.code && p.clase_id === c.id)
                        ).length;
                        const pct = activas.length > 0 ? Math.round((vis / activas.length) * 100) : 0;
                        return (
                          <tr key={socio.code} style={{ borderBottom: `1px solid rgba(34,197,94,0.06)` }}>
                            <td style={{ padding: '10px 12px' }}>
                              <div style={{ fontWeight: 600, color: S.text, fontSize: 13 }}>{socio.nombre}</div>
                              <div style={{ fontSize: 10, color: S.muted }}>{socio.code}</div>
                            </td>
                            {activas.map(c => {
                              const done = adminProgreso.some(p => p.socio_code === socio.code && p.clase_id === c.id);
                              return (
                                <td key={c.id} style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  <span style={{ fontSize: 14 }}>{done ? '✅' : '⬜'}</span>
                                </td>
                              );
                            })}
                            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: pct === 100 ? S.emerald : pct > 0 ? S.amber : S.muted }}>
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ━━━ CRONOGRAMA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'cronograma' && (() => {
            const dias = esc.cronograma.filter(d => d.activo || asAdmin);
            const diasPorSemana = (s: number) => dias.filter(d => d.semana === s).sort((a, b) => a.fecha.localeCompare(b.fecha));

            return (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>📅 Cronograma del programa</h2>
                    <p style={{ fontSize: 12, color: S.muted, margin: '4px 0 0' }}>Recorrido completo — 4 semanas, actividades día a día</p>
                  </div>
                  {asAdmin && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {reminderMsg && (
                        <span style={{ fontSize: 12, color: reminderMsg.startsWith('✅') ? S.green : '#ef4444' }}>{reminderMsg}</span>
                      )}
                      <button
                        style={{ ...btnOutline, fontSize: 12, color: '#0ea5e9', borderColor: 'rgba(14,165,233,0.3)', opacity: sendingReminder ? 0.6 : 1 }}
                        onClick={handleSendReminder}
                        disabled={sendingReminder}
                      >
                        {sendingReminder ? 'Enviando…' : '📲 Enviar recordatorio'}
                      </button>
                      <button
                        style={{ ...btnOutline, fontSize: 12, color: S.amber, borderColor: 'rgba(245,158,11,0.35)' }}
                        onClick={() => { setEditDia(undefined); setModalDia(true); }}
                      >
                        + Agregar actividad
                      </button>
                    </div>
                  )}
                </div>

                {dias.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
                    <div style={{ fontSize: '3rem', marginBottom: 14 }}>🗓️</div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>
                      {asAdmin ? 'Sin actividades en el cronograma. Agrega la primera.' : 'El cronograma estará disponible pronto.'}
                    </p>
                  </div>
                ) : (
                  <div className="crono-grid">
                    {[1,2,3,4].map(s => {
                      const info = SEMANAS_INFO[s - 1];
                      const diasSemana = diasPorSemana(s);
                      return (
                        <div key={s} className="crono-col">
                          {/* Header semana */}
                          <div style={{
                            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                            borderRadius: '10px 10px 0 0', padding: '12px 14px', marginBottom: 2,
                          }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{info.emoji}</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: S.green2, lineHeight: 1.3 }}>Semana {s}</div>
                            <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.3 }}>{info.title}</div>
                            {asAdmin && (
                              <button
                                onClick={() => { setEditDia({ semana: s, tipo: 'clase', activo: true }); setModalDia(true); }}
                                style={{ marginTop: 8, background: 'none', border: '1px dashed rgba(34,197,94,0.3)', borderRadius: 6, color: S.muted, fontSize: 10, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, width: '100%' }}
                              >
                                + día
                              </button>
                            )}
                          </div>

                          {/* Días */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {diasSemana.length === 0 ? (
                              <div style={{ padding: '16px 14px', fontSize: 11, color: '#475569', textAlign: 'center', fontStyle: 'italic' }}>
                                Sin actividades
                              </div>
                            ) : diasSemana.map(dia => {
                              const hoy = esHoy(dia.fecha);
                              const pasado = !hoy && esPasado(dia.fecha);
                              const meta = TIPO_META[dia.tipo];
                              const f = fmtFecha(dia.fecha);

                              const tipoNavega = dia.tipo === 'clase' ? 'clase' : dia.tipo === 'tarea' ? 'tarea' : dia.tipo === 'recurso' ? 'plantillas' : null;

                              return (
                                <div
                                  key={dia.id}
                                  onClick={() => { if (tipoNavega) { setSemana(dia.semana); setSub(tipoNavega as EscuelaSub); } }}
                                  style={{
                                    padding: '10px 14px',
                                    background: hoy ? 'rgba(34,197,94,0.12)' : pasado ? 'rgba(255,255,255,0.02)' : S.navy2,
                                    border: `1.5px solid ${hoy ? S.green : pasado ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.12)'}`,
                                    borderRadius: 8,
                                    cursor: tipoNavega ? 'pointer' : 'default',
                                    opacity: pasado && !hoy ? 0.55 : 1,
                                    transition: 'background 0.15s',
                                    position: 'relative',
                                  }}
                                >
                                  {hoy && (
                                    <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 9, fontWeight: 800, color: S.green, background: 'rgba(34,197,94,0.15)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.06em' }}>
                                      HOY
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                    <span style={{ fontSize: 14 }}>{meta.emoji}</span>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{meta.label}</span>
                                  </div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: hoy ? S.green2 : S.text, lineHeight: 1.35, marginBottom: 4 }}>
                                    {dia.titulo}
                                  </div>
                                  {dia.descripcion && (
                                    <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.4, marginBottom: 4 }}>{dia.descripcion}</div>
                                  )}
                                  <div style={{ fontSize: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span>{f.diaSem}</span>
                                    <span style={{ fontWeight: 700 }}>{f.dia} {f.mes}</span>
                                    {!dia.activo && <span style={{ color: S.amber, marginLeft: 4 }}>oculto</span>}
                                  </div>
                                  {asAdmin && (
                                    <button
                                      onClick={e => { e.stopPropagation(); setEditDia(dia); setModalDia(true); }}
                                      style={{ position: 'absolute', bottom: 6, right: 8, background: 'none', border: 'none', color: '#475569', fontSize: 11, cursor: 'pointer', padding: '2px 4px' }}
                                    >
                                      ✏️
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Leyenda */}
                <div style={{ marginTop: 20, padding: '12px 16px', background: S.navy2, borderRadius: 10, border: `1px solid ${S.border}`, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {(Object.entries(TIPO_META) as [TipoDia, typeof TIPO_META[TipoDia]][]).map(([, v]) => (
                    <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 13 }}>{v.emoji}</span>
                      <span style={{ fontSize: 11, color: S.muted }}>{v.label}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,197,94,0.12)', border: `1.5px solid ${S.green}` }} />
                    <span style={{ fontSize: 11, color: S.muted }}>Día de hoy</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      <ClaseModal
        open={modalClase}
        onClose={() => { setModalClase(false); setEditClase(undefined); }}
        semana={semana}
        clase={editClase}
        onSave={esc.guardarClase}
      />
      <PlantillaModal
        open={modalPlantilla}
        onClose={() => { setModalPlantilla(false); setEditPlantilla(undefined); }}
        semana={semana}
        plantilla={editPlantilla}
        onSave={esc.guardarPlantilla}
      />
      <TareaModal
        open={modalTarea}
        onClose={() => { setModalTarea(false); setEditTarea(undefined); }}
        semana={semana}
        tarea={editTarea}
        onSave={esc.guardarTarea}
      />
      <DiaCronogramaModal
        open={modalDia}
        onClose={() => { setModalDia(false); setEditDia(undefined); }}
        dia={editDia}
        onSave={esc.guardarDia}
        onDelete={esc.eliminarDia}
      />

      {/* ── Estilos ─────────────────────────────────────────── */}
      <style>{`
        .esc-outer { }

        /* Layout principal */
        .esc-wrap { display: flex; gap: 0; align-items: flex-start; }

        /* Sidebar (desktop) */
        .esc-nav {
          width: 176px;
          flex-shrink: 0;
          background: rgba(21,32,53,0.5);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 12px;
          padding: 12px 6px;
          margin-right: 24px;
          position: sticky;
          top: 16px;
        }

        /* Área de contenido */
        .esc-content { flex: 1; min-width: 0; }

        /* Mobile — ocultar sidebar y sub-tabs */
        .esc-mob-main-tabs { display: none; }
        .esc-mob-sub-tabs  { display: none; }

        @media (max-width: 768px) {
          /* Ocultar sidebar */
          .esc-nav { display: none; }

          /* Tabs principales: Sem 1/2/3/4 + Foro */
          .esc-mob-main-tabs {
            display: flex;
            overflow-x: auto;
            gap: 4px;
            padding-bottom: 12px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .esc-mob-main-tabs::-webkit-scrollbar { display: none; }

          .esc-mob-tab {
            flex-shrink: 0;
            padding: 6px 14px;
            border: none;
            border-radius: 6px;
            font-family: Montserrat, sans-serif;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            background: transparent;
            color: #94a3b8;
          }
          .esc-mob-tab-active {
            background: rgba(34,197,94,0.12) !important;
            color: #4ade80 !important;
          }

          /* Sub-tabs: Clase / Plantillas */
          .esc-mob-sub-tabs {
            display: flex;
            border-top: 1px solid rgba(34,197,94,0.15);
            border-bottom: 1px solid rgba(34,197,94,0.15);
            margin-bottom: 20px;
          }
          .esc-mob-sub {
            flex: 1;
            padding: 9px;
            border: none;
            border-bottom: 2px solid transparent;
            font-family: Montserrat, sans-serif;
            font-weight: 700;
            font-size: 11px;
            cursor: pointer;
            background: transparent;
            color: #94a3b8;
          }
          .esc-mob-sub-active {
            color: #4ade80 !important;
            border-bottom-color: #22c55e !important;
            background: rgba(34,197,94,0.06) !important;
          }
        }

        /* ── Cronograma grid ── */
        .crono-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          align-items: start;
        }
        .crono-col {
          min-width: 0;
        }

        @media (max-width: 900px) {
          .crono-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .crono-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
