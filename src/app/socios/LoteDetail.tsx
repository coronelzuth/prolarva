'use client';
import { useState, useRef } from 'react';
import { daysSince, type Lote, type FeedLog, type Cosecha, type Recordatorio, type Foto } from '@/hooks/useSocios';
import { S, cardStyle, btnOutline, btnSm, btnPrimary, EmptyState, ProgressBar, Timeline, MiniCalendar, FeedEntry, fmtDate, fmtDateTime, comprimirImagen, inputStyle, labelStyle } from './_shared';

// ─── Recordatorios section ────────────────────────────────────────────────────

function RecordatoriosSection({ lote, recordatorios, onAdd, onToggle, onDelete }: {
  lote: Lote;
  recordatorios: Recordatorio[];
  onAdd: (rec: Omit<Recordatorio, 'id' | 'completado' | 'creadoEn'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [titulo, setTitulo] = useState('');
  const [dia, setDia]       = useState<number | ''>('');
  const [adding, setAdding] = useState(false);
  const diaActual           = daysSince(lote.fecha);
  const sorted              = [...recordatorios].sort((a, b) => a.dia - b.dia);

  function handleAdd() {
    const d = typeof dia === 'number' ? dia : parseInt(String(dia));
    if (!titulo.trim() || isNaN(d) || d < 1) return;
    onAdd({ loteId: lote.id, dia: d, titulo: titulo.trim() });
    setTitulo(''); setDia(''); setAdding(false);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700 }}>📌 Recordatorios</h3>
        <button style={{ ...btnOutline, ...btnSm }} onClick={() => setAdding(a => !a)}>
          {adding ? 'Cancelar' : '+ Añadir'}
        </button>
      </div>

      {adding && (
        <div style={{ background: S.navy2, borderRadius: 10, padding: '14px', marginBottom: 14, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 160 }}>
            <label style={labelStyle}>Acción / recordatorio</label>
            <input
              style={inputStyle} placeholder="ej: Verificar temperatura" value={titulo}
              onChange={e => setTitulo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div style={{ width: 90 }}>
            <label style={labelStyle}>Día del ciclo</label>
            <input
              style={inputStyle} type="number" placeholder="ej: 7" min={1} max={60}
              value={dia} onChange={e => setDia(e.target.value === '' ? '' : parseInt(e.target.value))}
            />
          </div>
          <button style={btnPrimary} onClick={handleAdd}>Guardar</button>
        </div>
      )}

      {sorted.length === 0 && !adding && (
        <EmptyState icon="📌" text="Sin recordatorios. Añade acciones específicas para este lote." />
      )}

      {sorted.map(r => {
        const diff = r.dia - diaActual;
        const esHoy  = diff === 0;
        const esPast = diff < 0;
        return (
          <div key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, marginBottom: 8,
            background: r.completado ? 'rgba(148,163,184,0.05)' : esHoy ? 'rgba(34,197,94,0.08)' : esPast ? 'rgba(239,68,68,0.05)' : S.navy2,
            border: `1px solid ${r.completado ? 'transparent' : esHoy ? 'rgba(34,197,94,0.3)' : esPast ? 'rgba(239,68,68,0.2)' : S.border}`,
            opacity: r.completado ? 0.5 : 1,
          }}>
            <input
              type="checkbox" checked={r.completado} onChange={() => onToggle(r.id)}
              style={{ width: 16, height: 16, accentColor: S.green, flexShrink: 0, cursor: 'pointer' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, textDecoration: r.completado ? 'line-through' : 'none', color: r.completado ? S.muted : S.text }}>
                {r.titulo}
              </div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>
                Día {r.dia}
                {esHoy && <span style={{ color: S.green, fontWeight: 700, marginLeft: 6 }}>· ¡Hoy!</span>}
                {!esHoy && !esPast && diff <= 3 && <span style={{ color: S.amber, fontWeight: 700, marginLeft: 6 }}>· En {diff} día{diff !== 1 ? 's' : ''}</span>}
                {esPast && !r.completado && <span style={{ color: S.red, marginLeft: 6 }}>· Vencido hace {Math.abs(diff)} día{Math.abs(diff) !== 1 ? 's' : ''}</span>}
              </div>
            </div>
            <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 14, cursor: 'pointer', flexShrink: 0, padding: '2px 4px' }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Fotos galería ────────────────────────────────────────────────────────────

function FotosGaleria({ lote, fotos, onAdd, onDelete }: {
  lote: Lote;
  fotos: Foto[];
  onAdd: (foto: Omit<Foto, 'id' | 'creadoEn'>) => void;
  onDelete: (id: string) => void;
}) {
  const [uploading,   setUploading]   = useState(false);
  const [expanded,    setExpanded]    = useState<Foto | null>(null);
  const [fotoError,   setFotoError]   = useState('');
  const inputRef                      = useRef<HTMLInputElement>(null);
  const loteFotos                     = fotos.filter(f => f.loteId === lote.id);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFotoError('');
    try {
      const data = await comprimirImagen(file);
      onAdd({ loteId: lote.id, data, descripcion: '' });
    } catch {
      setFotoError('No se pudo procesar la imagen. Intenta con otra.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700 }}>📸 Galería del lote</h3>
        <button
          style={{ ...btnOutline, ...btnSm, opacity: uploading ? 0.6 : 1 }}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Procesando...' : '+ Foto'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {fotoError && <p style={{ color: '#ef4444', fontSize: 12, margin: '0 0 10px', fontWeight: 600 }}>{fotoError}</p>}

      {loteFotos.length === 0 ? (
        <EmptyState icon="📷" text="Sin fotos. Documenta el progreso de tus larvas." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {loteFotos.map(f => (
            <div key={f.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', background: S.navy2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.data} alt="foto lote"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onClick={() => setExpanded(f)}
              />
              <button
                onClick={() => onDelete(f.id)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.4)', padding: '3px 6px' }}>
                <div style={{ fontSize: 9, color: '#cbd5e1' }}>{fmtDate(f.creadoEn)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal foto expandida */}
      {expanded && (
        <div onClick={() => setExpanded(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 600, maxHeight: '90vh', width: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={expanded.data} alt="foto" style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }} />
            <button onClick={() => setExpanded(null)} style={{ position: 'absolute', top: -14, right: -14, background: S.navy2, border: `1px solid ${S.border}`, color: S.text, borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: S.muted }}>{fmtDate(expanded.creadoEn)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lote detail ──────────────────────────────────────────────────────────────

function LoteDetail({ lote, feeds, lotes, cosechas, recordatorios, fotos, onBack, onAddFeed, onEdit, onAddRecordatorio, onToggleRecordatorio, onDeleteRecordatorio, onAddFoto, onDeleteFoto, onNewCosecha }: {
  lote: Lote; feeds: FeedLog[]; lotes: Lote[]; cosechas: Cosecha[];
  recordatorios: Recordatorio[]; fotos: Foto[];
  onBack: () => void; onAddFeed: (loteId: string) => void; onEdit: () => void;
  onAddRecordatorio: (r: Omit<Recordatorio, 'id' | 'completado' | 'creadoEn'>) => void;
  onToggleRecordatorio: (id: string) => void;
  onDeleteRecordatorio: (id: string) => void;
  onAddFoto: (f: Omit<Foto, 'id' | 'creadoEn'>) => void;
  onDeleteFoto: (id: string) => void;
  onNewCosecha: () => void;
}) {
  const d = daysSince(lote.fecha);
  const pct = Math.min(Math.round((d / 28) * 100), 100);
  const loteFeds = feeds.filter(f => f.loteId === lote.id);
  const loteRecs = recordatorios.filter(r => r.loteId === lote.id);
  const loteCosechas = cosechas.filter(c => c.loteId === lote.id);
  const kgTotal = loteCosechas.reduce((a, c) => a + c.peso, 0);
  let daysMsg = '';
  if (d >= 22 && d <= 28) daysMsg = '✅ ¡Tu lote está listo para cosechar!';
  else if (d > 28) daysMsg = '⚠️ Pasó la ventana óptima. Revisa si hay prepupas.';
  else daysMsg = `Faltan aproximadamente ${22 - d} días para la cosecha (Día 22)`;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <button style={{ ...btnOutline, ...btnSm }} onClick={onBack}>← Volver</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>{lote.nombre}</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 2 }}>Sembrado el {fmtDate(lote.fecha)} · Día {d}</p>
        </div>
        <button style={{ ...btnOutline, ...btnSm }} onClick={onEdit}>✏️ Editar</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Ciclo de vida</h3>
          <Timeline days={d} />
          <ProgressBar pct={pct} />
          <p style={{ fontSize: 12, color: S.muted, marginTop: 8 }}>{daysMsg}</p>
          <MiniCalendar lote={lote} />
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Datos del lote</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Fecha siembra', fmtDate(lote.fecha)],
              ['Sustrato inicial', lote.sustrato ? `${lote.sustrato} kg` : '—'],
              ['Tipo sustrato', lote.tipoSustrato || '—'],
              ['Larvas iniciales', lote.huevos || '—'],
              ['Temperatura', lote.temp ? `${lote.temp}°C` : '—'],
              ['Notas', lote.notas || '—'],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 10, color: S.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 20 }}>
        <RecordatoriosSection
          lote={lote} recordatorios={loteRecs}
          onAdd={onAddRecordatorio} onToggle={onToggleRecordatorio} onDelete={onDeleteRecordatorio}
        />
        <FotosGaleria
          lote={lote} fotos={fotos}
          onAdd={onAddFoto} onDelete={onDeleteFoto}
        />
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700 }}>Historial de alimentación</h3>
          <button style={{ ...btnOutline, ...btnSm }} onClick={() => onAddFeed(lote.id)}>+ Registrar</button>
        </div>
        {loteFeds.length === 0 ? (
          <EmptyState icon="🌿" text="Sin alimentaciones registradas para este lote" />
        ) : (
          [...loteFeds].reverse().map(f => <FeedEntry key={f.id} feed={f} lotes={lotes} />)
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>⚖️ Cosechas de este lote</h3>
            {loteCosechas.length > 0 && (
              <div style={{ fontSize: 12, color: S.emerald, marginTop: 4 }}>
                {kgTotal.toFixed(1)} kg cosechados en {loteCosechas.length} cosecha{loteCosechas.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button style={{ ...btnPrimary, ...btnSm }} onClick={onNewCosecha}>+ Registrar cosecha</button>
        </div>
        {loteCosechas.length === 0 ? (
          <EmptyState icon="⚖️" text="Sin cosechas registradas para este lote" />
        ) : (
          [...loteCosechas].reverse().map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${S.border}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: S.emerald }}>{c.peso} kg</div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{fmtDate(c.fecha)}{c.sustratoTotal ? ` · Conv. ${((c.peso / c.sustratoTotal) * 100).toFixed(1)}%` : ''}</div>
                {c.notas && <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{c.notas}</div>}
              </div>
              {c.calidad && (
                <div style={{ fontSize: 20 }}>
                  {c.calidad === 'excelente' ? '⭐' : c.calidad === 'buena' ? '👍' : c.calidad === 'regular' ? '😐' : '👎'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}