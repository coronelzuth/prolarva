'use client';
import { useState, useEffect } from 'react';
import type { Clase, Plantilla, Tarea, DiaCronograma, TipoDia } from '@/hooks/useEscuela';
import { Modal, inputStyle, labelStyle, btnPrimary, btnOutline, btnDanger, S, TIPO_META } from './_escuela_shared';

// ─── Modal Clase (admin) ──────────────────────────────────────────────────────

export function ClaseModal({ open, onClose, semana, clase, onSave }: {
  open: boolean; onClose: () => void; semana: number;
  clase?: Partial<Clase>;
  onSave: (c: Partial<Clase> & { semana: number; titulo: string }) => Promise<void>;
}) {
  const [titulo,   setTitulo]   = useState('');
  const [desc,     setDesc]     = useState('');
  const [resumen,  setResumen]  = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [activa,   setActiva]   = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    setTitulo(clase?.titulo ?? '');
    setDesc(clase?.descripcion ?? '');
    setResumen(clase?.resumen ?? '');
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
      resumen: resumen.trim() || undefined,
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
        <label style={labelStyle}>Resumen de la clase (se publica después de la sesión)</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} value={resumen} onChange={e => setResumen(e.target.value)} placeholder="Puntos clave de lo que se cubrió en vivo. El alumno lo lee para repasar sin volver a ver el video." />
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

export function PlantillaModal({ open, onClose, semana, plantilla, onSave }: {
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

// ─── Modal Tarea (admin) ──────────────────────────────────────────────────────

export function TareaModal({ open, onClose, semana, tarea, onSave }: {
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

// ─── Modal Día Cronograma (admin) ─────────────────────────────────────────────

export function DiaCronogramaModal({ open, onClose, dia, onSave, onDelete }: {
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
              {[1,2,3,4,5].map(s => <option key={s} value={s}>Semana {s}</option>)}
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
