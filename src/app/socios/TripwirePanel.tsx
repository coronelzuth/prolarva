'use client';
import { useState, useEffect } from 'react';
import { S, cardStyle, btnPrimary, btnOutline, btnSm, inputStyle, Field, Modal, Badge, fmtDate } from './_shared';

interface TripwireLeccion {
  n: 1 | 2 | 3;
  titulo: string;
  duracion: string;
  video_url: string;
  disponible: boolean;
}

interface TripwireAlumno {
  id: string;
  codigo: string;
  nombre: string;
  whatsapp?: string;
  leccion1_vista: boolean;
  leccion2_vista: boolean;
  leccion3_vista: boolean;
  colonia_canjeado: boolean;
  creado_en: string;
}

export function TripwirePanel({ adminCode }: { adminCode: string }) {
  const [twAlumnos, setTwAlumnos]       = useState<TripwireAlumno[]>([]);
  const [loadingTw, setLoadingTw]       = useState(false);
  const [showTwModal, setShowTwModal]   = useState(false);
  const [twNombre, setTwNombre]         = useState('');
  const [twWhatsapp, setTwWhatsapp]     = useState('');
  const [generatingTw, setGeneratingTw] = useState(false);
  const [twError, setTwError]           = useState('');
  const [copiedTw, setCopiedTw]         = useState<string | null>(null);
  const [twLecciones, setTwLecciones]   = useState<TripwireLeccion[]>([]);
  const [loadingTwLec, setLoadingTwLec] = useState(false);
  const [savingTwLecN, setSavingTwLecN] = useState<number | null>(null);
  const [twLecOk, setTwLecOk]           = useState<number | null>(null);
  const [twLecError, setTwLecError]     = useState('');

  async function cargarTripwireAlumnos() {
    setLoadingTw(true);
    try {
      const res  = await fetch('/api/tripwire/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setTwAlumnos(data.alumnos);
    } finally { setLoadingTw(false); }
  }

  async function generarTripwire() {
    if (!twNombre.trim()) { setTwError('El nombre es requerido'); return; }
    setGeneratingTw(true); setTwError('');
    try {
      const res  = await fetch('/api/tripwire/crear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, nombre: twNombre, whatsapp: twWhatsapp }) });
      const data = await res.json();
      if (data.success) {
        await cargarTripwireAlumnos();
        copiarTw(data.codigo);
        setShowTwModal(false);
        setTwNombre(''); setTwWhatsapp('');
      } else {
        setTwError(data.error ?? 'Error al generar');
      }
    } finally { setGeneratingTw(false); }
  }

  function copiarTw(codigo: string) {
    const link = `https://prolarva.co/arranca?c=${codigo}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopiedTw(codigo);
    setTimeout(() => setCopiedTw(null), 2000);
  }

  async function cargarTwLecciones() {
    setLoadingTwLec(true);
    try {
      const res  = await fetch('/api/tripwire/lecciones');
      const data = await res.json();
      if (Array.isArray(data.lecciones)) setTwLecciones(data.lecciones);
    } finally { setLoadingTwLec(false); }
  }

  function editarTwLeccion(n: number, campo: keyof TripwireLeccion, valor: string | boolean) {
    setTwLecciones(prev => prev.map(l => l.n === n ? { ...l, [campo]: valor } : l));
  }

  async function guardarTwLeccion(leccion: TripwireLeccion) {
    setSavingTwLecN(leccion.n); setTwLecError('');
    try {
      const res  = await fetch('/api/tripwire/lecciones', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, ...leccion }) });
      const data = await res.json();
      if (data.success) { setTwLecOk(leccion.n); setTimeout(() => setTwLecOk(null), 2000); }
      else setTwLecError(data.error ?? 'Error al guardar');
    } finally { setSavingTwLecN(null); }
  }

  useEffect(() => {
    cargarTripwireAlumnos();
    cargarTwLecciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 10px' }}>📹 Contenido de las 3 lecciones</h3>
      {loadingTwLec ? (
        <p style={{ color: S.muted, fontSize: 13 }}>Cargando...</p>
      ) : twLecciones.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '1.5rem', color: S.muted, marginBottom: 24 }}>
          <p style={{ fontSize: 13, margin: 0 }}>Falta correr <code>supabase/tripwire-lecciones.sql</code> en Supabase para activar este editor.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {twLecciones.map(l => (
            <div key={l.n} style={cardStyle}>
              <div style={{ fontSize: 11, color: S.green2, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Lección {l.n} de 3
              </div>
              <Field label="Título">
                <input style={inputStyle} value={l.titulo} onChange={e => editarTwLeccion(l.n, 'titulo', e.target.value)} />
              </Field>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <Field label="Duración">
                    <input style={inputStyle} value={l.duracion} onChange={e => editarTwLeccion(l.n, 'duracion', e.target.value)} placeholder="6–8 min" />
                  </Field>
                </div>
                <div style={{ flex: 2 }}>
                  <Field label="URL del video">
                    <input style={inputStyle} value={l.video_url} onChange={e => editarTwLeccion(l.n, 'video_url', e.target.value)} placeholder="/fotos/tripwire-leccion-1.mp4" />
                  </Field>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: S.text, marginBottom: 12, cursor: 'pointer' }}>
                <input type="checkbox" checked={l.disponible} onChange={e => editarTwLeccion(l.n, 'disponible', e.target.checked)} />
                Video listo — mostrarlo a los alumnos
              </label>
              <button
                style={{ ...btnPrimary, ...btnSm, opacity: savingTwLecN === l.n ? 0.6 : 1 }}
                onClick={() => guardarTwLeccion(l)}
                disabled={savingTwLecN === l.n}
              >
                {savingTwLecN === l.n ? 'Guardando...' : twLecOk === l.n ? '✓ Guardado' : 'Guardar'}
              </button>
            </div>
          ))}
          {twLecError && <p style={{ color: S.red, fontSize: 12 }}>{twLecError}</p>}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <button style={btnPrimary} onClick={() => setShowTwModal(true)}>+ Generar acceso</button>
        <p style={{ fontSize: 11, color: S.muted, marginTop: 6 }}>
          Genera el código después de confirmar el pago de $19.900 por Nequi. El link se copia solo al portapapeles.
        </p>
      </div>

      {loadingTw ? (
        <p style={{ color: S.muted, fontSize: 13 }}>Cargando...</p>
      ) : twAlumnos.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <p style={{ fontSize: 13 }}>Nadie ha comprado el mini-curso todavía.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {twAlumnos.map(a => {
            const vistas = [a.leccion1_vista, a.leccion2_vista, a.leccion3_vista].filter(Boolean).length;
            return (
              <div key={a.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>{a.nombre}</div>
                  <div style={{ fontSize: 11, color: S.muted }}>{a.whatsapp || '—'} · {fmtDate(a.creado_en)}</div>
                </div>
                <code style={{ fontSize: 13, fontWeight: 800, color: S.green2, letterSpacing: '0.05em' }}>{a.codigo}</code>
                <div style={{ fontSize: 11, color: S.muted, textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontWeight: 700, color: vistas === 3 ? S.green : S.text }}>{vistas}/3</div>
                  <div>lecciones</div>
                </div>
                {a.colonia_canjeado && <Badge color="amber">Canjeó Colonia</Badge>}
                <button
                  onClick={() => copiarTw(a.codigo)}
                  style={{ ...btnOutline, ...btnSm, color: copiedTw === a.codigo ? S.green : S.muted, borderColor: copiedTw === a.codigo ? S.green : undefined, flexShrink: 0 }}
                >
                  {copiedTw === a.codigo ? '✓ Copiado' : 'Copiar link'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showTwModal} onClose={() => setShowTwModal(false)} title="🎓 Generar acceso al Mini-Curso">
        <Field label="Nombre">
          <input style={inputStyle} value={twNombre} onChange={e => setTwNombre(e.target.value)} placeholder="Nombre del comprador" />
        </Field>
        <Field label="WhatsApp (opcional)">
          <input style={inputStyle} value={twWhatsapp} onChange={e => setTwWhatsapp(e.target.value)} placeholder="573001234567" />
        </Field>
        {twError && <p style={{ color: S.red, fontSize: 12, marginBottom: 10 }}>{twError}</p>}
        <button style={{ ...btnPrimary, width: '100%', opacity: generatingTw ? 0.6 : 1 }} onClick={generarTripwire} disabled={generatingTw}>
          {generatingTw ? 'Generando...' : 'Generar código'}
        </button>
      </Modal>
    </div>
  );
}
