'use client';
import type { DiaCronograma, Clase, Plantilla, Tarea } from '@/hooks/useEscuela';
import { S, SEMANAS_INFO, TIPO_META, fmtFecha, esHoy, esPasado, getYouTubeId, btnPrimary, inputStyle } from './_escuela_shared';

// ─── Tipos de los métodos del hook que se usan ────────────────────────────────

interface EscuelaCronogramaProps {
  // Datos del cronograma
  cronograma: DiaCronograma[];
  asAdmin: boolean;
  isAdmin: boolean;
  fasesAprobadas: number;
  faseEnRevision: number;
  // Estado de expand
  expandedDia: string | null;
  setExpandedDia: (id: string | null) => void;
  // Callbacks para abrir modales de fase y día
  setFaseMod: (fase: number | null) => void;
  setEditDia: (dia: Partial<DiaCronograma> | undefined) => void;
  setModalDia: (open: boolean) => void;
  // Métodos del hook esc necesarios en el panel inline
  clasesPorSemana: (semana: number) => Clase[];
  tareasPorSemana: (semana: number) => Tarea[];
  plantillasPorSemana: (semana: number) => Plantilla[];
  estaVisto: (id: string) => boolean;
  marcarVisto: (id: string) => void;
  miEntrega: (tareaId: string) => { id: string; respuesta: string; entregado_en: string } | undefined;
  entregarTarea: (tareaId: string, respuesta: string, nombre: string) => Promise<boolean>;
  // Estado de tarea inline
  tareaText: string;
  setTareaText: (t: string) => void;
  tareaPosting: boolean;
  setTareaPosting: (v: boolean) => void;
  socioNombre: string;
}

export function EscuelaCronograma({
  cronograma, asAdmin, isAdmin, fasesAprobadas, faseEnRevision,
  expandedDia, setExpandedDia, setFaseMod, setEditDia, setModalDia,
  clasesPorSemana, tareasPorSemana, plantillasPorSemana,
  estaVisto, marcarVisto, miEntrega, entregarTarea,
  tareaText, setTareaText, tareaPosting, setTareaPosting, socioNombre,
}: EscuelaCronogramaProps) {
  const dias = cronograma.filter(d => d.activo || asAdmin);
  const diasPorSemana = (s: number) => dias.filter(d => d.semana === s).sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>📅 Cronograma del programa</h2>
          <p style={{ fontSize: 12, color: S.muted, margin: '4px 0 0' }}>5 semanas · haz clic en una semana para ver el detalle</p>
        </div>
      </div>

      {/* Barra de progreso de fases */}
      {!isAdmin && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            {[1,2,3,4,5].map(f => {
              const aprobada = f <= fasesAprobadas;
              const enRevision = f === faseEnRevision;
              return (
                <div key={f} style={{ flex: 1 }}>
                  <div style={{
                    height: 6, borderRadius: 3,
                    background: aprobada ? '#22c55e' : enRevision ? '#f59e0b' : 'rgba(148,163,184,0.2)',
                    transition: 'background 0.3s',
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: S.muted }}>
              {fasesAprobadas > 0
                ? `${fasesAprobadas}/5 semanas aprobadas`
                : 'Completa cada semana para avanzar'}
              {faseEnRevision > 0 && <span style={{ color: S.amber }}> · Semana {faseEnRevision} en revisión ⏳</span>}
            </div>
            {fasesAprobadas >= 3 && (
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>🔬 Monitor desbloqueado</div>
            )}
          </div>
        </div>
      )}

      {dias.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>🗓️</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>
            {asAdmin ? 'Sin actividades en el cronograma. Agrega la primera.' : 'El cronograma estará disponible pronto.'}
          </p>
        </div>
      ) : (
        <div className="crono-grid">
          {[1,2,3,4,5].map(s => {
            const info = SEMANAS_INFO[s - 1];
            const diasSemana = diasPorSemana(s);
            const tieneHoy = diasSemana.some(d => esHoy(d.fecha));
            return (
              <div key={s} className="crono-col">
                {/* Header fase — clic abre modal */}
                <div
                  onClick={() => setFaseMod(s)}
                  style={{
                    background: tieneHoy ? 'rgba(34,197,94,0.13)' : 'rgba(34,197,94,0.06)',
                    border: `1px solid ${tieneHoy ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.18)'}`,
                    borderRadius: 10,
                    padding: '11px 14px',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <span style={{ fontSize: 20 }}>{info.emoji}</span>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 900, color: S.green, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.2 }}>Semana {s}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: tieneHoy ? S.green2 : S.text, lineHeight: 1.3 }}>{info.title}</div>
                      <div style={{ fontSize: 10, color: S.muted }}>{diasSemana.length} actividad{diasSemana.length !== 1 ? 'es' : ''} · <span style={{ color: S.green }}>Ver detalles →</span></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {tieneHoy && <span style={{ fontSize: 9, fontWeight: 800, color: S.green, background: 'rgba(34,197,94,0.15)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.06em' }}>HOY</span>}
                    {asAdmin && (
                      <button
                        onClick={e => { e.stopPropagation(); setEditDia({ semana: s, tipo: 'clase', activo: true }); setModalDia(true); }}
                        style={{ background: 'none', border: '1px dashed rgba(34,197,94,0.3)', borderRadius: 5, color: S.muted, fontSize: 10, padding: '2px 7px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {/* Días — ocultos si colapsado */}
                <div style={{ display: 'none', flexDirection: 'column', gap: 3 }}>
                  {diasSemana.length === 0 ? (
                    <div style={{ padding: '16px 14px', fontSize: 11, color: '#475569', textAlign: 'center', fontStyle: 'italic' }}>
                      Sin actividades
                    </div>
                  ) : diasSemana.map(dia => {
                    const hoy = esHoy(dia.fecha);
                    const pasado = !hoy && esPasado(dia.fecha);
                    const meta = TIPO_META[dia.tipo];
                    const f = fmtFecha(dia.fecha);

                    const expanded = expandedDia === dia.id;
                    const tieneContenido = dia.tipo === 'clase' || dia.tipo === 'tarea' || dia.tipo === 'recurso';

                    return (
                      <div key={dia.id}>
                      <div
                        onClick={() => {
                          if (tieneContenido) setExpandedDia(expanded ? null : dia.id);
                        }}
                        style={{
                          padding: '10px 14px',
                          background: expanded ? 'rgba(34,197,94,0.15)' : hoy ? 'rgba(34,197,94,0.12)' : pasado ? 'rgba(255,255,255,0.02)' : S.navy2,
                          border: `1.5px solid ${expanded ? S.green : hoy ? S.green : pasado ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.12)'}`,
                          borderRadius: expanded ? '8px 8px 0 0' : 8,
                          cursor: tieneContenido ? 'pointer' : 'default',
                          opacity: pasado && !hoy && !expanded ? 0.55 : 1,
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
                      {/* Panel expandible inline */}
                      {expanded && (() => {
                        const clasesSem = clasesPorSemana(dia.semana).filter(c => c.activa || asAdmin);
                        const tareasSem = tareasPorSemana(dia.semana).filter(t => t.activa || asAdmin);
                        const plantSem  = plantillasPorSemana(dia.semana);
                        return (
                          <div style={{ background: S.navy, border: `1.5px solid ${S.green}`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '14px 14px 16px' }}>
                            {dia.tipo === 'clase' && (
                              <div>
                                {clasesSem.length === 0 ? (
                                  <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>{asAdmin ? 'Sin clases cargadas para esta semana.' : 'La clase estará disponible pronto.'}</p>
                                ) : clasesSem.map(clase => {
                                  const vid = clase.url_video ? getYouTubeId(clase.url_video) : null;
                                  const visto = estaVisto(clase.id);
                                  return (
                                    <div key={clase.id} style={{ marginBottom: 14 }}>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: S.text, marginBottom: 8 }}>{clase.titulo}</div>
                                      {clase.descripcion && <p style={{ fontSize: 11, color: S.muted, marginBottom: 8, lineHeight: 1.5 }}>{clase.descripcion}</p>}
                                      {vid && (
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
                                          <iframe src={`https://www.youtube.com/embed/${vid}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen title={clase.titulo} />
                                        </div>
                                      )}
                                      {clase.resumen && (
                                        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                                          <div style={{ fontSize: 10, fontWeight: 700, color: S.green, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>📝 Resumen</div>
                                          <p style={{ fontSize: 11, color: S.text, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{clase.resumen}</p>
                                        </div>
                                      )}
                                      <button
                                        onClick={() => { if (!visto) marcarVisto(clase.id); }}
                                        style={{ ...btnPrimary, fontSize: 11, padding: '6px 14px', opacity: visto ? 0.5 : 1, cursor: visto ? 'default' : 'pointer' }}
                                      >
                                        {visto ? '✅ Ya vista' : '👁️ Marcar como vista'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {dia.tipo === 'tarea' && (
                              <div>
                                {tareasSem.length === 0 ? (
                                  <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>{asAdmin ? 'Sin tarea creada para esta semana.' : 'La tarea estará disponible pronto.'}</p>
                                ) : tareasSem.map(tarea => {
                                  const entrega = miEntrega(tarea.id);
                                  return (
                                    <div key={tarea.id}>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: S.amber, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Tarea de la semana</div>
                                      <p style={{ fontSize: 13, color: S.text, lineHeight: 1.6, marginBottom: 12 }}>{tarea.pregunta}</p>
                                      <textarea
                                        value={tareaText || entrega?.respuesta || ''}
                                        onChange={e => setTareaText(e.target.value)}
                                        style={{ ...inputStyle, resize: 'vertical', minHeight: 80, marginBottom: 8 }}
                                        placeholder="Escribe tu respuesta aquí… (máx. 1000 caracteres)"
                                        maxLength={1000}
                                      />
                                      <button
                                        style={{ ...btnPrimary, fontSize: 11, padding: '7px 16px', opacity: tareaPosting ? 0.6 : 1 }}
                                        disabled={tareaPosting}
                                        onClick={async () => {
                                          if (!tareaText.trim()) return;
                                          setTareaPosting(true);
                                          await entregarTarea(tarea.id, tareaText, socioNombre);
                                          setTareaText('');
                                          setTareaPosting(false);
                                        }}
                                      >
                                        {tareaPosting ? 'Enviando…' : entrega ? '✏️ Actualizar entrega' : '📤 Entregar'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {dia.tipo === 'recurso' && (
                              <div>
                                {plantSem.length === 0 ? (
                                  <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>{asAdmin ? 'Sin plantillas para esta semana.' : 'Las plantillas estarán disponibles pronto.'}</p>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {plantSem.map(p => (
                                      <a key={p.id} href={p.url_archivo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: S.navy2, borderRadius: 8, border: `1px solid ${S.border}`, textDecoration: 'none' }}>
                                        <span style={{ fontSize: 18 }}>📄</span>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{p.titulo}</div>
                                          {p.tamano_aprox && <div style={{ fontSize: 10, color: S.muted }}>{p.tamano_aprox}</div>}
                                        </div>
                                        <span style={{ fontSize: 11, color: S.green, fontWeight: 700 }}>⬇️ Descargar</span>
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
