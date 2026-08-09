'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEscuela, type Clase, type Plantilla, type Tarea, type DiaCronograma } from '@/hooks/useEscuela';
import { getSupabase } from '@/lib/supabase';

// Shared
import {
  S, EscuelaSub,
  inputStyle, btnPrimary, btnOutline, btnDanger,
  useCountdown, fmtCountdown, descargarCertificado,
  timeAgo, esHoy, SEMANAS_INFO,
} from './_escuela_shared';

// Modales
import { ClaseModal, PlantillaModal, TareaModal, DiaCronogramaModal } from './EscuelaModals';
import { FaseModal } from './EscuelaFaseModal';

// Secciones
import { EscuelaCronograma } from './EscuelaCronograma';
import { EscuelaForo } from './EscuelaForo';
import { EscuelaDirectorio } from './EscuelaDirectorio';
import { EscuelaProgreso } from './EscuelaProgreso';

// ─── EscuelaView ───────────────────────────────────────────────────────────────

const REACTIONS = ['❤️', '🔥', '💡', '🙌'] as const;

export default function EscuelaView({
  socioCode, socioNombre, isAdmin,
  fasesAprobadas = 0, faseEnRevision = 0,
  onMarcarFase, onAprobFase,
}: {
  socioCode: string;
  socioNombre: string;
  isAdmin: boolean;
  fasesAprobadas?: number;
  faseEnRevision?: number;
  onMarcarFase?: (fase: number) => Promise<void>;
  onAprobFase?: (code: string, fase: number) => Promise<void>;
}) {
  const esc = useEscuela(socioCode);

  const [semana,      setSemana]      = useState(1);
  const [sub,         setSub]         = useState<EscuelaSub>('cronograma');
  const [expandedDia, setExpandedDia] = useState<string | null>(null);
  const [faseMod,     setFaseMod]     = useState<number | null>(null);

  // Admin modals
  const [modalClase,      setModalClase]      = useState(false);
  const [editClase,       setEditClase]       = useState<Partial<Clase> | undefined>();
  const [modalPlantilla,  setModalPlantilla]  = useState(false);
  const [editPlantilla,   setEditPlantilla]   = useState<Partial<Plantilla> | undefined>();
  const [modalTarea,      setModalTarea]      = useState(false);
  const [editTarea,       setEditTarea]       = useState<Partial<Tarea> | undefined>();
  const [modalDia,        setModalDia]        = useState(false);
  const [editDia,         setEditDia]         = useState<Partial<DiaCronograma> | undefined>();

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
  const [adminSocios,   setAdminSocios]   = useState<{ code: string; nombre: string; fases_aprobadas: number; fase_en_revision: number }[]>([]);
  const [adminProgreso, setAdminProgreso] = useState<{ socio_code: string; clase_id: string }[]>([]);
  const [aprobando,     setAprobando]     = useState<string | null>(null);

  // Códigos de admin (para badge ProLarva)
  const [adminCodes, setAdminCodes] = useState<Set<string>>(new Set());

  // Respuestas colapsadas — expandidas por ID de post
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Preview mode: oculta controles de admin para ver la vista de socio
  const [previewMode, setPreviewMode] = useState(false);
  const asAdmin = isAdmin && !previewMode;

  const SEMANAS = [1, 2, 3, 4, 5];

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
      sb.from('socios').select('code,nombre,fases_aprobadas,fase_en_revision').eq('estado', 'activo'),
      sb.from('progreso_clases').select('socio_code,clase_id'),
    ]).then(([sRes, pRes]) => {
      setAdminSocios(sRes.data?.map(x => ({ code: x.code, nombre: x.nombre, fases_aprobadas: x.fases_aprobadas ?? 0, fase_en_revision: x.fase_en_revision ?? 0 })) ?? []);
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

  return (
    <div className="esc-outer">

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>🎓 Mi Escuela</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>
            Programa Colonia · 5 fases
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
        <button className={`esc-mob-tab${sub === 'metas' ? ' esc-mob-tab-active' : ''}`}
          onClick={() => setSub('metas')}
          style={{ color: sub === 'metas' ? '#f59e0b' : undefined }}>
          🎯
        </button>
        {asAdmin && (
          <button className={`esc-mob-tab${sub === 'progreso' ? ' esc-mob-tab-active' : ''}`}
            onClick={() => setSub('progreso')}>
            📊
          </button>
        )}
      </div>

      {/* ── Layout principal ──────────────────────────────── */}
      <div className="esc-wrap">

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="esc-nav">
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

          <div style={{ borderTop: `1px solid ${S.border}`, margin: '8px 12px 8px' }} />
          <div onClick={() => setSub('metas')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', cursor: 'pointer', borderRadius: 8,
            background: sub === 'metas' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: sub === 'metas' ? S.amber : S.muted,
            fontWeight: 700, fontSize: 13, transition: 'all 0.12s',
          }}>
            🎯 Mi Meta
          </div>

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
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📅 Fase {semana} — Clase</h2>
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
                  const videoId = clase.url_video ? clase.url_video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)?.[1] ?? null : null;
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
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📄 Plantillas — Fase {semana}</h2>
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
                <h2 style={{ fontSize: 17, fontWeight: 800 }}>📝 Tarea — Fase {semana}</h2>
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
            <EscuelaForo
              posts={esc.posts}
              socioCode={socioCode}
              socioNombre={socioNombre}
              asAdmin={asAdmin}
              adminCodes={adminCodes}
              foroText={foroText}
              setForoText={setForoText}
              posting={posting}
              setPosting={setPosting}
              foroSuccess={foroSuccess}
              setForoSuccess={setForoSuccess}
              foroSearch={foroSearch}
              setForoSearch={setForoSearch}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              replyPosting={replyPosting}
              setReplyPosting={setReplyPosting}
              expandedReplies={expandedReplies}
              setExpandedReplies={setExpandedReplies}
              publicarPost={esc.publicarPost}
              toggleLike={esc.toggleLike}
              eliminarPost={esc.eliminarPost}
              fijarPost={esc.fijarPost}
              handleLike={handleLike}
              handleReply={handleReply}
              handlePublicar={handlePublicar}
            />
          )}

          {/* ━━━ DIRECTORIO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'directorio' && (
            <EscuelaDirectorio
              sociosColonia={esc.sociosColonia}
              asAdmin={asAdmin}
              toggleColonia={esc.toggleColonia}
            />
          )}

          {/* ━━━ PROGRESO ADMIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'progreso' && asAdmin && (
            <EscuelaProgreso
              adminSocios={adminSocios}
              adminProgreso={adminProgreso}
              clases={esc.clases}
              aprobando={aprobando}
              setAprobando={setAprobando}
              onAprobFase={onAprobFase}
              setAdminSocios={setAdminSocios}
            />
          )}

          {/* ━━━ MI META ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'metas' && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 8 }}>🎯 Mi Meta</h2>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
                Define y rastrea tu meta de ahorro mensual produciendo larva BSF. Cada vez que actualizas tu lote en el Monitor, tu avance se calcula automáticamente.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                  { emoji: '🎯', title: 'Define tu meta', desc: 'Elige cuánto quieres ahorrar en concentrado por mes. Puede ser en pesos COP, kg de larva, o porcentaje de reducción.' },
                  { emoji: '📊', title: 'Rastrea tu avance', desc: 'Cada cosecha registrada en el Monitor suma automáticamente a tu progreso del mes.' },
                  { emoji: '🏆', title: 'Celebra tus logros', desc: 'Comparte tus resultados en el Foro con el grupo cuando alcances tu meta del ciclo.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 14, padding: '20px 18px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{item.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: S.text, marginBottom: 6 }}>{item.title}</div>
                    <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/metas"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#0d1b2a', borderRadius: 10,
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(245,158,11,0.35)',
                }}
              >
                🎯 Ir a Mi Meta
              </Link>
              <p style={{ fontSize: 11, color: S.muted, marginTop: 10 }}>
                Se abre en la vista completa de metas — puedes volver aquí con el botón atrás del navegador.
              </p>
            </div>
          )}

          {/* ━━━ CRONOGRAMA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {sub === 'cronograma' && (
            <EscuelaCronograma
              cronograma={esc.cronograma}
              asAdmin={asAdmin}
              isAdmin={isAdmin}
              fasesAprobadas={fasesAprobadas}
              faseEnRevision={faseEnRevision}
              expandedDia={expandedDia}
              setExpandedDia={setExpandedDia}
              setFaseMod={setFaseMod}
              setEditDia={setEditDia}
              setModalDia={setModalDia}
              clasesPorSemana={esc.clasesPorSemana}
              tareasPorSemana={esc.tareasPorSemana}
              plantillasPorSemana={esc.plantillasPorSemana}
              estaVisto={esc.estaVisto}
              marcarVisto={esc.marcarVisto}
              miEntrega={esc.miEntrega}
              entregarTarea={esc.entregarTarea}
              tareaText={tareaText}
              setTareaText={setTareaText}
              tareaPosting={tareaPosting}
              setTareaPosting={setTareaPosting}
              socioNombre={socioNombre}
            />
          )}
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

      {faseMod !== null && (
        <FaseModal
          open={faseMod !== null}
          onClose={() => setFaseMod(null)}
          fase={faseMod}
          clases={esc.clasesPorSemana(faseMod).filter(c => c.activa || asAdmin)}
          plantillas={esc.plantillasPorSemana(faseMod)}
          tareas={esc.tareasPorSemana(faseMod).filter(t => t.activa || asAdmin)}
          estaVisto={esc.estaVisto}
          marcarVisto={esc.marcarVisto}
          asAdmin={asAdmin}
          onNuevaClase={() => { setSemana(faseMod); setEditClase(undefined); setModalClase(true); }}
          onEditClase={c => { setSemana(faseMod); setEditClase(c); setModalClase(true); }}
          onEliminarClase={id => esc.eliminarClase(id).then(() => esc.reload())}
          onNuevaPlantilla={() => { setSemana(faseMod); setEditPlantilla(undefined); setModalPlantilla(true); }}
          onEditPlantilla={p => { setSemana(faseMod); setEditPlantilla(p); setModalPlantilla(true); }}
          onEliminarPlantilla={id => esc.eliminarPlantilla(id).then(() => esc.reload())}
          onNuevaTarea={() => { setSemana(faseMod); setEditTarea(undefined); setModalTarea(true); }}
          onEditTarea={t => { setSemana(faseMod); setEditTarea(t); setModalTarea(true); }}
          onEliminarTarea={id => esc.eliminarTarea(id).then(() => esc.reload())}
          fasesAprobadas={fasesAprobadas}
          faseEnRevision={faseEnRevision}
          onMarcarFase={onMarcarFase}
        />
      )}

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
