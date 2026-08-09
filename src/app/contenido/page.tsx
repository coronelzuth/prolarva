'use client'
import React, { useState, useMemo } from 'react'
import { useGuionesCms } from '@/hooks/useGuionesCms'
import {
  Guion,
  GuionEstado,
  GuionTipo,
  ESTADO_LABELS,
  ESTADO_COLORS,
  TIPO_LABELS,
  TIPO_COLORS,
} from '@/data/guiones'

// ─── Tipos y constantes ────────────────────────────────────────────
const ESTADOS: GuionEstado[] = [
  'BORRADOR', 'EDITADO', 'LISTO', 'GRABADO', 'DATOS', 'FOOTAGE', 'GUIONIZADO',
]
const TIPOS: GuionTipo[] = ['V', 'E', 'C', 'MSN']

const NC_LABELS: Record<number, string> = {
  1: 'NC1 — No sabe',
  2: 'NC2 — Sabe el problema',
  3: 'NC3 — Conoce BSF',
  4: 'NC4 — Listo para comprar',
}

const ANGULO_LABELS = {
  problema: '🔴 Problema',
  solucion: '🟢 Solución',
  resultado: '⭐ Resultado',
}

// ─── Utilidades ────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

// ─── Componentes ───────────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: GuionEstado }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
      background: ESTADO_COLORS[estado] + '22',
      color: ESTADO_COLORS[estado],
      border: `1px solid ${ESTADO_COLORS[estado]}44`,
      whiteSpace: 'nowrap',
    }}>
      {ESTADO_LABELS[estado]}
    </span>
  )
}

function TipoBadge({ tipo }: { tipo: GuionTipo }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
      background: TIPO_COLORS[tipo] + '22',
      color: TIPO_COLORS[tipo],
      border: `1px solid ${TIPO_COLORS[tipo]}44`,
      whiteSpace: 'nowrap',
    }}>
      {tipo}
    </span>
  )
}

// ─── Botón descargar .txt ─────────────────────────────────────────
function DownloadTxtButton({ contenido, codigo, titulo }: { contenido: string; codigo: string; titulo: string }) {
  function handle() {
    const text = `${titulo}\n${'='.repeat(titulo.length)}\n${codigo}\n\n${contenido}`
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${codigo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <button onClick={handle} style={{
      background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)',
      color: '#3b82f6', borderRadius: 8, padding: '5px 14px',
      fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      ⬇ .txt
    </button>
  )
}

// ─── Botón copiar ─────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#16a34a' : 'rgba(34,197,94,0.15)',
        border: `1px solid ${copied ? '#16a34a' : 'rgba(34,197,94,0.4)'}`,
        color: copied ? '#fff' : '#22c55e',
        borderRadius: 8, padding: '5px 14px',
        fontSize: 12, fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.2s', whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copiado' : '📋 Copiar guión'}
    </button>
  )
}

// ─── Panel lateral de edición ──────────────────────────────────────
function GuionPanel({
  guion,
  onClose,
  onSave,
  saving,
  embedded = false,
}: {
  guion: Guion
  onClose: () => void
  onSave: (id: string, changes: Partial<Guion>) => void
  saving: boolean
  embedded?: boolean
}) {
  const [estado, setEstado] = useState<GuionEstado>(guion.estado)
  const [fecha, setFecha] = useState(guion.fecha_programada ?? '')
  const [contenido, setContenido] = useState(guion.contenido ?? '')
  const [notas, setNotas] = useState(guion.notas ?? '')
  const [nc, setNc] = useState<number | undefined>(guion.nc)
  const [angulo, setAngulo] = useState<Guion['angulo']>(guion.angulo)
  const [plataforma, setPlataforma] = useState<string[]>(guion.plataforma)
  const [tab, setTab] = useState<'info' | 'guion'>('info')
  const [editandoTitulo, setEditandoTitulo] = useState(false)
  const [tituloEdit, setTituloEdit] = useState(guion.titulo)

  function togglePlat(p: string) {
    setPlataforma(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  function handleSave() {
    onSave(guion.id, { estado, fecha_programada: fecha || undefined, contenido, notas, nc, angulo, plataforma, titulo: tituloEdit })
  }

  const containerStyle: React.CSSProperties = embedded
    ? {
        background: '#0d1b2a', border: '1px solid rgba(14,165,233,0.2)',
        borderRadius: 16, display: 'flex', flexDirection: 'column',
      }
    : {
        position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(580px, 100vw)',
        background: '#0d1b2a', borderLeft: '1px solid rgba(14,165,233,0.2)',
        display: 'flex', flexDirection: 'column', zIndex: 100, boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
      }

  return (
    <div style={containerStyle}>
      {/* Header del panel */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <TipoBadge tipo={guion.tipo} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{guion.codigo}</div>
            {editandoTitulo ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  value={tituloEdit}
                  onChange={e => setTituloEdit(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(34,197,94,0.5)',
                    borderRadius: 6, padding: '4px 8px', color: '#f1f5f9', fontSize: 14, fontWeight: 700,
                  }}
                />
                <button onClick={() => setEditandoTitulo(false)} style={{
                  background: '#22c55e', border: 'none', color: '#0d1b2a',
                  borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>✓</button>
                <button onClick={() => { setTituloEdit(guion.titulo); setEditandoTitulo(false) }} style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8',
                  borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer',
                }}>✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, lineHeight: 1.3, flex: 1 }}>
                  {tituloEdit}
                </div>
                <button onClick={() => setEditandoTitulo(true)} style={{
                  background: 'none', border: 'none', color: '#475569',
                  cursor: 'pointer', fontSize: 13, padding: '2px 4px', flexShrink: 0,
                }} title="Editar nombre">✏️</button>
              </div>
            )}
            {guion.bloque && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>📂 {guion.bloque}</div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8',
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 18, lineHeight: 1,
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
          {(['info', 'guion'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: tab === t ? '#22c55e' : 'rgba(255,255,255,0.06)',
              color: tab === t ? '#0d1b2a' : '#94a3b8',
            }}>
              {t === 'info' ? '⚙️ Metadatos' : '📝 Guión'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {tab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Estado */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                ESTADO
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ESTADOS.map(e => (
                  <button key={e} onClick={() => setEstado(e)} style={{
                    padding: '5px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    border: estado === e
                      ? `2px solid ${ESTADO_COLORS[e]}`
                      : '2px solid transparent',
                    background: estado === e
                      ? ESTADO_COLORS[e] + '33'
                      : 'rgba(255,255,255,0.05)',
                    color: estado === e ? ESTADO_COLORS[e] : '#64748b',
                  }}>
                    {ESTADO_LABELS[e]}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha programada */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                FECHA PROGRAMADA
              </label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '8px 12px', color: '#f1f5f9', fontSize: 14,
                  colorScheme: 'dark',
                }}
              />
              {fecha && (
                <button onClick={() => setFecha('')} style={{
                  marginLeft: 8, background: 'none', border: 'none', color: '#64748b',
                  cursor: 'pointer', fontSize: 12,
                }}>Quitar fecha</button>
              )}
            </div>

            {/* Plataforma */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                PLATAFORMA
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['TikTok', 'Instagram'].map(p => (
                  <button key={p} onClick={() => togglePlat(p)} style={{
                    padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: plataforma.includes(p)
                      ? '2px solid #22c55e'
                      : '2px solid rgba(255,255,255,0.1)',
                    background: plataforma.includes(p) ? '#22c55e33' : 'rgba(255,255,255,0.04)',
                    color: plataforma.includes(p) ? '#22c55e' : '#64748b',
                  }}>
                    {p === 'TikTok' ? '🎵' : '📸'} {p}
                  </button>
                ))}
              </div>
            </div>

            {/* NC */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                NIVEL DE CONCIENCIA
              </label>
              <select
                value={nc ?? ''}
                onChange={e => setNc(e.target.value ? Number(e.target.value) : undefined)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '8px 12px', color: '#f1f5f9', fontSize: 14,
                  minWidth: 200,
                }}
              >
                <option value="">Sin definir</option>
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{NC_LABELS[n]}</option>
                ))}
              </select>
            </div>

            {/* Ángulo */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                ÁNGULO
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(Object.entries(ANGULO_LABELS) as [Guion['angulo'], string][]).map(([a, label]) => (
                  <button key={a!} onClick={() => setAngulo(a)} style={{
                    padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    border: angulo === a ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.1)',
                    background: angulo === a ? '#3b82f633' : 'rgba(255,255,255,0.04)',
                    color: angulo === a ? '#3b82f6' : '#64748b',
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilar */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                PILAR
              </label>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>{guion.pilar}</div>
            </div>

            {/* Info adicional */}
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>DURACIÓN</div>
                <div style={{ color: '#f1f5f9', fontSize: 14 }}>⏱ {guion.duracion}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>NÚMERO</div>
                <div style={{ color: '#f1f5f9', fontSize: 14 }}>#{guion.numero}</div>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                NOTAS DE PRODUCCIÓN
              </label>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Notas de grabación, referencias, pendientes..."
                rows={4}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 14,
                  resize: 'vertical', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        )}

        {tab === 'guion' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                TEXTO DEL GUIÓN{' '}
                <span style={{ fontWeight: 400 }}>— pega el contenido o escribe aquí</span>
              </div>
              {contenido && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <CopyButton text={contenido} />
                  <DownloadTxtButton contenido={contenido} codigo={guion.codigo} titulo={tituloEdit} />
                </div>
              )}
            </div>
            <textarea
              value={contenido}
              onChange={e => setContenido(e.target.value)}
              placeholder={`Pega aquí el guión completo de ${guion.codigo}...\n\nPuedes copiarlo del archivo:\n02 - Contenido\\Estrategia\\Guiones en bruto\\${String(guion.numero).padStart(2, '0')}_*.txt`}
              style={{
                width: '100%', boxSizing: 'border-box', minHeight: 'calc(100vh - 280px)',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '14px', color: '#e2e8f0', fontSize: 13,
                resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.7,
              }}
            />
            {contenido && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                {contenido.split('\n').length} líneas · {contenido.length} caracteres
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer con botón guardar */}
      <div style={{
        padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? '#16a34a' : '#22c55e', color: '#0d1b2a',
            border: 'none', borderRadius: 10, padding: '10px 24px',
            fontWeight: 700, fontSize: 14, cursor: saving ? 'default' : 'pointer',
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar cambios'}
        </button>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10,
          padding: '10px 20px', color: '#94a3b8', fontSize: 14, cursor: 'pointer',
        }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Calendario mensual ────────────────────────────────────────────
function CalendarioView({ guiones }: { guiones: Guion[] }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())

  const diasEnMes = getDaysInMonth(anio, mes)
  const primerDia = getFirstDayOfMonth(anio, mes)

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]

  // Guiones programados este mes
  const guionesMes = useMemo(() => {
    const map = new Map<number, Guion[]>()
    guiones.forEach(g => {
      if (!g.fecha_programada) return
      const d = new Date(g.fecha_programada + 'T12:00:00')
      if (d.getMonth() === mes && d.getFullYear() === anio) {
        const day = d.getDate()
        if (!map.has(day)) map.set(day, [])
        map.get(day)!.push(g)
      }
    })
    return map
  }, [guiones, mes, anio])

  const programados = guiones.filter(g => g.fecha_programada).length
  const sinFecha = guiones.length - programados

  function prevMes() {
    if (mes === 0) { setMes(11); setAnio(a => a - 1) }
    else setMes(m => m - 1)
  }
  function nextMes() {
    if (mes === 11) { setMes(0); setAnio(a => a + 1) }
    else setMes(m => m + 1)
  }

  const celdas: (number | null)[] = [
    ...Array(primerDia === 0 ? 6 : primerDia - 1).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ]

  return (
    <div>
      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: '#152035', borderRadius: 10, padding: '12px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>{programados}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>con fecha</div>
        </div>
        <div style={{ background: '#152035', borderRadius: 10, padding: '12px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{sinFecha}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>sin programar</div>
        </div>
      </div>

      {/* Navegación del mes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <button onClick={prevMes} style={{
          background: 'rgba(255,255,255,0.06)', border: 'none', color: '#f1f5f9',
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 16,
        }}>‹</button>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', minWidth: 160, textAlign: 'center' }}>
          {meses[mes]} {anio}
        </div>
        <button onClick={nextMes} style={{
          background: 'rgba(255,255,255,0.06)', border: 'none', color: '#f1f5f9',
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 16,
        }}>›</button>
        <button onClick={() => { setMes(hoy.getMonth()); setAnio(hoy.getFullYear()) }} style={{
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          color: '#22c55e', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
        }}>Hoy</button>
      </div>

      {/* Grid del calendario */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12,
      }}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: '#475569', padding: '8px 4px',
          }}>{d}</div>
        ))}

        {celdas.map((dia, i) => {
          const gs = dia ? (guionesMes.get(dia) ?? []) : []
          const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
          return (
            <div key={i} style={{
              minHeight: 80, background: dia ? 'rgba(255,255,255,0.03)' : 'transparent',
              borderRadius: 8, padding: 6,
              border: esHoy ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
            }}>
              {dia && (
                <>
                  <div style={{
                    fontSize: 12, fontWeight: esHoy ? 800 : 500,
                    color: esHoy ? '#22c55e' : '#64748b', marginBottom: 4,
                  }}>{dia}</div>
                  {gs.map(g => (
                    <div key={g.id} style={{
                      background: TIPO_COLORS[g.tipo] + '33',
                      color: TIPO_COLORS[g.tipo],
                      borderRadius: 4, padding: '2px 5px', fontSize: 10,
                      fontWeight: 600, marginBottom: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {g.codigo} {g.titulo.substring(0, 16)}…
                    </div>
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Guiones sin fecha */}
      {sinFecha > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, marginBottom: 12 }}>
            ⚠️ {sinFecha} guiones sin fecha asignada — abrelos y asigna una fecha para verlos en el calendario
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Modal nuevo guión ────────────────────────────────────────────
function NuevoGuionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (fields: { codigo: string; titulo: string; tipo: GuionTipo; duracion: string; plataforma: string[] }) => Promise<void>
}) {
  const [codigo, setCodigo] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<GuionTipo>('V')
  const [duracion, setDuracion] = useState('60s')
  const [plataforma, setPlataforma] = useState<string[]>(['TikTok', 'Instagram'])
  const [saving, setSaving] = useState(false)

  async function handleCreate() {
    if (!codigo.trim() || !titulo.trim()) return
    setSaving(true)
    await onCreate({ codigo: codigo.trim(), titulo: titulo.trim(), tipo, duracion, plataforma })
    setSaving(false)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: '#0d1b2a', border: '1px solid rgba(14,165,233,0.2)',
        borderRadius: 16, padding: 28, width: 'min(440px, 94vw)', zIndex: 100,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>+ Nuevo guión</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>CÓDIGO</label>
            <input value={codigo} onChange={e => setCodigo(e.target.value)}
              placeholder="ej: V16, RETO18, MSN51..." autoFocus
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>TÍTULO</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)}
              placeholder="Título del video..."
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#f1f5f9', fontSize: 14 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>TIPO</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {TIPOS.map(t => (
                  <button key={t} onClick={() => setTipo(t)} style={{
                    flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                    background: tipo === t ? TIPO_COLORS[t] + '33' : 'rgba(255,255,255,0.05)',
                    color: tipo === t ? TIPO_COLORS[t] : '#64748b',
                    outline: tipo === t ? `1px solid ${TIPO_COLORS[t]}66` : 'none',
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>DURACIÓN</label>
              <input value={duracion} onChange={e => setDuracion(e.target.value)}
                style={{ width: 72, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 10px', color: '#f1f5f9', fontSize: 14 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, display: 'block', marginBottom: 6 }}>PLATAFORMA</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['TikTok', 'Instagram'].map(p => (
                <button key={p} onClick={() => setPlataforma(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} style={{
                  padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  border: plataforma.includes(p) ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                  background: plataforma.includes(p) ? '#22c55e33' : 'rgba(255,255,255,0.04)',
                  color: plataforma.includes(p) ? '#22c55e' : '#64748b',
                }}>{p === 'TikTok' ? '🎵' : '📸'} {p}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={handleCreate} disabled={saving || !codigo.trim() || !titulo.trim()} style={{
            flex: 1, background: '#22c55e', border: 'none', color: '#0d1b2a',
            borderRadius: 10, padding: '11px 0', fontWeight: 800, fontSize: 14,
            cursor: saving || !codigo.trim() || !titulo.trim() ? 'default' : 'pointer',
            opacity: saving || !codigo.trim() || !titulo.trim() ? 0.5 : 1,
          }}>
            {saving ? 'Creando...' : 'Crear guión'}
          </button>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10,
            padding: '11px 20px', color: '#94a3b8', fontSize: 14, cursor: 'pointer',
          }}>Cancelar</button>
        </div>
      </div>
    </>
  )
}

// ─── Vista HOY ────────────────────────────────────────────────────
function HoyView({
  guiones,
  onSave,
  saving,
}: {
  guiones: Guion[]
  onSave: (id: string, changes: Partial<Guion>) => void
  saving: boolean
}) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * guiones.length))
  const guion = guiones[idx] ?? guiones[0]

  function sortear() {
    let next = Math.floor(Math.random() * guiones.length)
    if (next === idx && guiones.length > 1) next = (next + 1) % guiones.length
    setIdx(next)
  }

  if (!guion) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          Guión asignado para hoy — #{guion.numero} de {guiones.length}
        </div>
        <button onClick={sortear} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          color: '#f1f5f9', borderRadius: 8, padding: '8px 18px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}>
          🎲 Sortear otro
        </button>
      </div>
      <GuionPanel
        key={guion.id}
        guion={guion}
        onClose={() => {}}
        onSave={(id, changes) => {
          onSave(id, changes)
        }}
        saving={saving}
        embedded
      />
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────
export default function ContenidoPage() {
  const { guiones, loaded, saving, updateGuion, createGuion } = useGuionesCms()
  const [filtroTipo, setFiltroTipo] = useState<GuionTipo | 'ALL'>('ALL')
  const [filtroEstado, setFiltroEstado] = useState<GuionEstado | 'ALL'>('ALL')
  const [busqueda, setBusqueda] = useState('')
  const [selected, setSelected] = useState<Guion | null>(null)
  const [view, setView] = useState<'lista' | 'calendario' | 'hoy'>('lista')
  const [showNuevo, setShowNuevo] = useState(false)
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)

  // Estadísticas globales
  const stats = useMemo(() => {
    const total = guiones.length
    const porEstado: Partial<Record<GuionEstado, number>> = {}
    const porTipo: Partial<Record<GuionTipo, number>> = {}
    const listos = guiones.filter(g =>
      g.estado === 'LISTO' || g.estado === 'GRABADO'
    ).length
    guiones.forEach(g => {
      porEstado[g.estado] = (porEstado[g.estado] ?? 0) + 1
      porTipo[g.tipo] = (porTipo[g.tipo] ?? 0) + 1
    })
    return { total, porEstado, porTipo, listos }
  }, [guiones])

  // Guiones filtrados
  const guionesFiltrados = useMemo(() => {
    return guiones.filter(g => {
      if (filtroTipo !== 'ALL' && g.tipo !== filtroTipo) return false
      if (filtroEstado !== 'ALL' && g.estado !== filtroEstado) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        if (
          !g.titulo.toLowerCase().includes(q) &&
          !g.codigo.toLowerCase().includes(q) &&
          !(g.bloque?.toLowerCase().includes(q))
        ) return false
      }
      return true
    })
  }, [guiones, filtroTipo, filtroEstado, busqueda])

  function handleSave(id: string, changes: Partial<Guion>) {
    updateGuion(id, changes)
    // Actualizar el seleccionado en memoria
    setSelected(prev => prev && prev.id === id ? { ...prev, ...changes } : prev)
  }

  if (!loaded) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a1628', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#22c55e',
        fontFamily: 'Montserrat, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🦟</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Cargando guiones...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a1628',
      fontFamily: 'Montserrat, sans-serif', color: '#e2e8f0',
      paddingTop: 56,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            📋 Gestión de Contenido
          </h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <a href="https://wa.me/573223212293" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)',
              color: '#25D366', borderRadius: 8, padding: '6px 14px',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              💬 WhatsApp
            </a>
            <a href="https://www.tiktok.com/@prolarva.co" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#f1f5f9', borderRadius: 8, padding: '6px 14px',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              🎵 TikTok
            </a>
            <a href="https://www.instagram.com/prolarva.co" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(225,48,108,0.12)', border: '1px solid rgba(225,48,108,0.3)',
              color: '#e1306c', borderRadius: 8, padding: '6px 14px',
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              📸 Instagram
            </a>
          </div>
        </div>

        {/* Tabs de vista */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['lista', 'calendario', 'hoy'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              background: view === v ? '#22c55e' : 'rgba(255,255,255,0.06)',
              color: view === v ? '#0d1b2a' : '#94a3b8',
            }}>
              {v === 'lista' ? '📋 Lista' : v === 'calendario' ? '📅 Calendario' : '🎯 Hoy'}
            </button>
          ))}
        </div>

        {view === 'hoy' ? (
          <HoyView guiones={guiones} onSave={handleSave} saving={saving} />
        ) : view === 'calendario' ? (
          <CalendarioView guiones={guiones} />
        ) : (
          <>
            {/* Filtros */}
            <div style={{
              background: '#152035', borderRadius: 12, padding: '16px 20px',
              marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
            }}>
              {/* Búsqueda colapsable */}
              {busquedaAbierta ? (
                <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 180 }}>
                  <input
                    type="text"
                    placeholder="Título o código..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(34,197,94,0.4)',
                      borderRadius: 8, padding: '7px 12px', color: '#f1f5f9', fontSize: 14,
                    }}
                  />
                  <button onClick={() => { setBusquedaAbierta(false); setBusqueda('') }} style={{
                    background: 'rgba(255,255,255,0.06)', border: 'none', color: '#64748b',
                    borderRadius: 8, padding: '7px 10px', cursor: 'pointer', fontSize: 14,
                  }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setBusquedaAbierta(true)} style={{
                  background: busqueda ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                  border: busqueda ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: busqueda ? '#22c55e' : '#94a3b8',
                  borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  🔍{busqueda ? ` "${busqueda}"` : ''}
                </button>
              )}

              {/* Filtro tipo */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <FiltroBtn active={filtroTipo === 'ALL'} onClick={() => setFiltroTipo('ALL')} label="Todos" />
                {TIPOS.map(t => (
                  <FiltroBtn key={t} active={filtroTipo === t} onClick={() => setFiltroTipo(t)}
                    label={t} color={TIPO_COLORS[t]}
                  />
                ))}
              </div>
            </div>

            {/* Resultado + botón nuevo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#475569' }}>
                {guionesFiltrados.length} de {stats.total} guiones
              {(filtroTipo !== 'ALL' || busqueda) && (
                <button onClick={() => {
                  setFiltroTipo('ALL')
                  setBusqueda('')
                }} style={{
                  marginLeft: 10, background: 'none', border: 'none', color: '#22c55e',
                  cursor: 'pointer', fontSize: 12, textDecoration: 'underline',
                }}>
                  Limpiar filtros
                </button>
              )}
              </div>
              <button onClick={() => setShowNuevo(true)} style={{
                background: '#22c55e', border: 'none', color: '#0d1b2a',
                borderRadius: 8, padding: '7px 16px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                + Nuevo guión
              </button>
            </div>

            {/* Lista de guiones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
              {guionesFiltrados.map(g => (
                <GuionCard
                  key={g.id}
                  guion={g}
                  onClick={() => setSelected(g)}
                  isSelected={selected?.id === g.id}
                />
              ))}
            </div>

            {guionesFiltrados.length === 0 && (
              <div style={{
                textAlign: 'center', padding: 60, color: '#475569',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16 }}>No hay guiones que coincidan con los filtros</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal nuevo guión */}
      {showNuevo && (
        <NuevoGuionModal
          onClose={() => setShowNuevo(false)}
          onCreate={async (fields) => {
            await createGuion(fields)
            setShowNuevo(false)
          }}
        />
      )}

      {/* Panel lateral */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99,
            }}
          />
          <GuionPanel
            guion={selected}
            onClose={() => setSelected(null)}
            onSave={handleSave}
            saving={saving}
          />
        </>
      )}
    </div>
  )
}

// ─── Sub-componentes pequeños ──────────────────────────────────────
function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{
      background: '#152035', borderRadius: 10, padding: '12px 18px',
      minWidth: 90, textAlign: 'center',
      border: `1px solid ${color}22`,
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function FiltroBtn({
  active, onClick, label, color,
}: {
  active: boolean; onClick: () => void; label: string; color?: string
}) {
  const c = color ?? '#22c55e'
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
      fontWeight: 600, fontSize: 12,
      background: active ? c + '22' : 'rgba(255,255,255,0.04)',
      color: active ? c : '#64748b',
      outline: active ? `1px solid ${c}66` : 'none',
    }}>
      {label}
    </button>
  )
}

function GuionCard({
  guion, onClick, isSelected,
}: {
  guion: Guion; onClick: () => void; isSelected: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? '#1e3050' : '#152035',
        border: isSelected
          ? '1px solid rgba(34,197,94,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
        textAlign: 'left', transition: 'all 0.15s', display: 'flex',
        flexDirection: 'column', gap: 6, width: '100%',
      }}
    >
      {/* Fila única de metadatos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{guion.codigo}</span>
        <EstadoBadge estado={guion.estado} />
        {guion.nc && (
          <span style={{ fontSize: 10, color: '#475569', fontWeight: 600, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '1px 5px' }}>
            NC{guion.nc}
          </span>
        )}
        {guion.contenido && (
          <span style={{ fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.08)', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
            📝 guardado
          </span>
        )}
        {guion.fecha_programada && (
          <span style={{ fontSize: 10, color: '#3b82f6', marginLeft: 'auto' }}>
            📅 {new Date(guion.fecha_programada + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>

      {/* Título */}
      <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
        {guion.titulo}
      </div>
    </button>
  )
}
