'use client';

import { useMemo, useState } from 'react';
import { stages } from '@/data/stages';
import { metas } from '@/data/metas';
import {
  GLOSARIO, type GlosarioCat,
  LOWCOST_SISTEMAS, LOWCOST_COMPARATIVA, LOWCOST_TIPS,
  ALIMENTACION_SI, ALIMENTACION_NO, ALIMENTACION_ETAPAS, ALIMENTACION_REGLAS, PROTEINA_NIVELES,
  PROCESAMIENTO, PROCESAMIENTO_COMPARATIVA,
  CRIA_PASOS, CRIA_CICLO_CERRADO, type CriaPaso,
} from '@/data/enciclopedia';
import { S } from './_shared';

// ─── Helpers de estilo ───────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 900, marginBottom: 6 };
const sectionIntro: React.CSSProperties = { fontSize: 13, color: S.muted, lineHeight: 1.65, marginBottom: 22, maxWidth: 620 };
const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#64748b', marginBottom: 14 };

function Chips({ items, active, onPick }: { items: string[]; active: string; onPick: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
      {items.map(it => (
        <button
          key={it}
          onClick={() => onPick(it)}
          style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif',
            background: active === it ? 'rgba(34,197,94,0.15)' : 'transparent',
            color: active === it ? S.green2 : S.muted,
            border: `1px solid ${active === it ? 'rgba(34,197,94,0.4)' : S.border}`,
          }}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

// ═══ 1. EL CICLO (8 etapas) ══════════════════════════════════════════════════

export function CicloSection() {
  const [idx, setIdx] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const stage = idx !== null ? stages[idx] : null;

  return (
    <div>
      <h2 style={sectionTitle}>🔄 El ciclo de la BSF</h2>
      <p style={sectionIntro}>
        La Mosca Soldado Negra pasa por 8 formas muy distintas. Toca cada una para ver duración, temperatura, qué hacer y qué evitar.
        El ciclo va de huevo a mosca en ~40 días; si cosechas larva, terminas en el día 18.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {stages.map((st, i) => {
          const hasPhoto = st.photos && st.photos.length > 0;
          return (
            <button
              key={st.id}
              onClick={() => setIdx(i)}
              style={{
                borderRadius: 14, padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left',
                background: S.navy2, border: `2px solid ${st.color}45`, fontFamily: 'Montserrat, sans-serif', position: 'relative',
              }}
            >
              {hasPhoto ? (
                <img src={st.photos![0]} alt={st.name} style={{ width: '100%', height: 88, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${st.color}14` }}>
                  <span style={{ fontSize: 36 }}>{st.emoji}</span>
                </div>
              )}
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3, marginBottom: 3 }}>
                  {st.name.replace(' ⭐ Cosecha', '')}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{st.duration}</div>
              </div>
              {st.isHarvestStage && (
                <span style={{ position: 'absolute', top: 7, left: 7, fontSize: 8.5, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: `${st.color}dd`, color: '#0d1b2a' }}>COSECHA</span>
              )}
            </button>
          );
        })}
      </div>

      {stage && idx !== null && (
        <>
          <div onClick={() => setIdx(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 601,
            width: 'min(600px, 94vw)', maxHeight: '88vh', background: '#0f1f35', border: `1px solid ${stage.color}45`,
            borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${stage.color}25`, display: 'flex', alignItems: 'center', gap: 12, background: `${stage.color}0d` }}>
              <span style={{ fontSize: 26 }}>{stage.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#f1f5f9', marginBottom: 2 }}>{stage.name}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}>⏱ {stage.duration}</span>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}>🌡 {stage.temp}</span>
                  <span style={{ fontSize: 10.5, color: '#64748b' }}>💧 {stage.humidity}</span>
                </div>
              </div>
              <button onClick={() => setIdx(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 17, padding: '5px 9px', borderRadius: 8 }}>×</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 18px' }}>
              <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 16px' }}>{stage.description}</p>

              {stage.photos && stage.photos.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={label}>📸 Fotos</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                    {stage.photos.map((p, i) => (
                      <div key={i} onClick={() => setLightbox(p)} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${stage.color}30`, aspectRatio: '4/3', cursor: 'zoom-in' }}>
                        <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage.videos && stage.videos.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={label}>🎬 Videos</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 }}>
                    {stage.videos.map((v, i) => (
                      <VideoPlayer key={i} src={v.url} title={v.title} color={stage.color} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', marginBottom: 8, letterSpacing: 1 }}>✅ CONSEJOS</div>
                  {stage.tips.map((t, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: `2px solid ${stage.color}40`, lineHeight: 1.5 }}>{t}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 8, letterSpacing: 1 }}>⚠️ ALERTAS</div>
                  {stage.alerts.map((a, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(239,68,68,0.4)', lineHeight: 1.5 }}>{a}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 18px', borderTop: `1px solid ${stage.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a1628' }}>
              <button onClick={() => setIdx((idx - 1 + stages.length) % stages.length)} style={navBtn}>← Anterior</button>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{idx + 1} / {stages.length}</span>
              <button onClick={() => setIdx((idx + 1) % stages.length)} style={{ ...navBtn, color: stage.color, borderColor: `${stage.color}40` }}>Siguiente →</button>
            </div>
          </div>
        </>
      )}

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  padding: '8px 15px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 9, color: '#94a3b8', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
};

function VideoPlayer({ src, title, color }: { src: string; title: string; color: string }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${color}30`, background: '#0a1628', position: 'relative' }}>
      <video src={src} controls muted loop playsInline preload="metadata" style={{ width: '100%', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 10px 6px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', pointerEvents: 'none' }}>
        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{title}</span>
      </div>
    </div>
  );
}

// ═══ 2. CRÍA PASO A PASO ═════════════════════════════════════════════════════

function PasoCard({ p, open, onToggle }: { p: CriaPaso; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', background: S.navy2, border: `1px solid ${open ? p.color + '55' : S.border}` }}>
      <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${p.color}18`, border: `2px solid ${p.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{p.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: p.color, fontWeight: 700, marginBottom: 2, letterSpacing: '0.05em' }}>PASO {p.n} · {p.range}</div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{p.title}</div>
          <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.4 }}>{p.summary}</div>
        </div>
        <span style={{ color: '#64748b', fontSize: 13, flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 20px' }}>
          <div style={{ height: 1, background: `${p.color}25`, marginBottom: 16 }} />
          {p.description.map((l, i) => <p key={i} style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.75, marginBottom: 4 }}>{l}</p>)}
          {p.tips.length > 0 && (
            <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 10, padding: '12px 15px', margin: '12px 0 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', marginBottom: 8, letterSpacing: '0.06em' }}>💡 CONSEJOS</div>
              {p.tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}><span style={{ color: '#22c55e', flexShrink: 0 }}>→</span><span>{t}</span></div>
              ))}
            </div>
          )}
          {p.alerts.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 15px', marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', marginBottom: 8, letterSpacing: '0.06em' }}>⚠️ ALERTAS</div>
              {p.alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#fca5a5', lineHeight: 1.55 }}><span style={{ flexShrink: 0 }}>!</span><span>{a}</span></div>
              ))}
            </div>
          )}
          <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '12px 15px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 6, letterSpacing: '0.06em' }}>📋 QUÉ REGISTRAR</div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{p.registro}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CriaSection() {
  const [open, setOpen] = useState<number | null>(1);
  const [openCiclo, setOpenCiclo] = useState<number | null>(null);

  return (
    <div>
      <h2 style={sectionTitle}>🌾 Cría paso a paso</h2>
      <p style={sectionIntro}>
        Del huevo a la primera cosecha en 18 días. Los 5 pasos de la Meta 1 (alimentar animales) y, después, los 2 pasos para cerrar el ciclo y producir tus propias moscas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CRIA_PASOS.map(p => <PasoCard key={p.n} p={p} open={open === p.n} onToggle={() => setOpen(open === p.n ? null : p.n)} />)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '36px 0 20px' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.25)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20 }}>♻️</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>Cerrar el ciclo</div>
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.25)' }} />
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65, marginBottom: 18 }}>
        Si en vez de cosechar todo reservas un porcentaje de larvas para que pupen, tus propias moscas ponen los huevos del siguiente lote. Ya no compras semilla.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CRIA_CICLO_CERRADO.map(p => <PasoCard key={p.n} p={p} open={openCiclo === p.n} onToggle={() => setOpenCiclo(openCiclo === p.n ? null : p.n)} />)}
      </div>
    </div>
  );
}

// ═══ 3. RUTAS DE PRODUCCIÓN (metas) ═════════════════════════════════════════

export function RutasSection() {
  const [active, setActive] = useState<string>(metas[0].id);
  const [step, setStep] = useState<number | null>(null);
  const meta = metas.find(m => m.id === active)!;

  return (
    <div>
      <h2 style={sectionTitle}>🎯 Rutas de producción</h2>
      <p style={sectionIntro}>
        Cuando cosechas la larva, tienes tres destinos posibles. Cada uno tiene su propia guía paso a paso y sus materiales. Elige según tu objetivo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        {metas.map(m => {
          const on = active === m.id;
          return (
            <button
              key={m.id}
              onClick={() => { setActive(m.id); setStep(null); }}
              style={{
                padding: 18, borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif',
                background: on ? `${m.color}14` : S.navy2, border: `2px solid ${on ? m.color : S.border}`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{m.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: on ? m.color : '#f1f5f9', marginBottom: 3 }}>{m.title}</div>
              <div style={{ fontSize: 11.5, color: on ? m.color + 'cc' : '#64748b', fontWeight: 600 }}>{m.tagline}</div>
            </button>
          );
        })}
      </div>

      <div style={{ background: S.navy2, border: `1px solid ${meta.borderColor}`, borderRadius: 16, padding: '18px 20px' }}>
        <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 12 }}>{meta.description}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${meta.color}14`, border: `1px solid ${meta.borderColor}`, borderRadius: 8, padding: '5px 12px', marginBottom: 18 }}>
          <span style={{ fontSize: 11, color: meta.color }}>⏰ Cuándo:</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{meta.when}</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>📋 Guía paso a paso</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meta.steps.map(s => {
            const on = step === s.step;
            return (
              <div key={s.step} style={{ borderRadius: 10, overflow: 'hidden', background: on ? `${meta.color}0f` : 'rgba(30,48,80,0.5)', border: `1px solid ${on ? meta.borderColor : S.border}` }}>
                <button onClick={() => setStep(on ? null : s.step)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#0d1b2a', flexShrink: 0 }}>{s.step}</div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#f1f5f9', flex: 1 }}>{s.title}</span>
                  <span style={{ color: '#64748b', fontSize: 11, transform: on ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {on && (
                  <div style={{ padding: '0 14px 12px 48px' }}>
                    <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.65, marginBottom: s.tip || s.warning ? 8 : 0 }}>{s.description}</p>
                    {s.tip && <div style={{ padding: '6px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, fontSize: 11, color: '#38bdf8', lineHeight: 1.5 }}>💡 {s.tip}</div>}
                    {s.warning && <div style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: 11, color: '#fca5a5', lineHeight: 1.5, marginTop: s.tip ? 6 : 0 }}>⚠️ {s.warning}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(30,48,80,0.5)', borderRadius: 10, border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>🧰 MATERIALES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {meta.resources.map((r, i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${meta.color}12`, border: `1px solid ${meta.borderColor}`, color: '#94a3b8' }}>{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ 4. QUÉ DARLES / QUÉ NO ═════════════════════════════════════════════════

const NIVEL_COLOR: Record<string, string> = {
  Base: '#22c55e', Complemento: '#f59e0b', 'Alto proteico': '#a855f7', 'Ultra proteico': '#3b82f6',
};

export function AlimentacionSection() {
  return (
    <div>
      <h2 style={sectionTitle}>🥗 Qué darles y qué NO</h2>
      <p style={sectionIntro}>
        La larva come casi cualquier residuo orgánico, pero la calidad del sustrato define el tamaño, la proteína y el tiempo de producción.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
        {ALIMENTACION_REGLAS.map((r, i) => (
          <div key={i} style={{ flex: '1 1 180px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 18, marginBottom: 5 }}>{r.icon}</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 3 }}>{r.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.green2, lineHeight: 1.4 }}>{r.valor}</div>
          </div>
        ))}
      </div>

      <div style={label}>✅ Sustratos recomendados</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {ALIMENTACION_SI.map((s, i) => {
          const c = NIVEL_COLOR[s.nivel];
          return (
            <div key={i} style={{ background: `${c}0d`, border: `1px solid ${c}30`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 14 }}>
              <div style={{ width: 40, height: 40, flexShrink: 0, background: 'rgba(0,0,0,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{s.nombre}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 8, border: `1px solid ${c}40`, color: c, letterSpacing: '0.6px', textTransform: 'uppercase' }}>{s.nivel}</span>
                  <span style={{ fontSize: 11.5, color: c, fontWeight: 700 }}>~{s.proteina} prot.</span>
                </div>
                <p style={{ fontSize: 12.5, color: S.muted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={label}>❌ Qué NO echar al criadero</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {ALIMENTACION_NO.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '13px 15px' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{n.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 3 }}>{n.texto}</div>
              <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.55 }}>⚠️ {n.razon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={label}>📊 Porciones y manejo por etapa</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {ALIMENTACION_ETAPAS.map((e, i) => (
          <div key={i} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderLeft: `4px solid ${e.emoji === '⏰' ? '#ef4444' : '#22c55e'}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ background: 'rgba(30,48,80,0.6)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{e.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{e.dias}</div>
                <div style={{ fontSize: 11.5, color: S.muted }}>{e.fase}</div>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 12 }}>
                {[
                  ['Sustrato', e.sustrato], ['Proteína', e.proteina], ['Humedad', e.humedad], ['Frecuencia', e.frecuencia], ['Cantidad/día', e.cantidad],
                ].map(([k, v], j) => (
                  <div key={j}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: v === '—' || v === 'No aplicar' ? '#ef4444' : S.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border}`, borderRadius: 10, padding: '9px 13px', fontSize: 12, color: S.muted, lineHeight: 1.6 }}>💡 {e.nota}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 16, padding: '20px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>💪 Cómo subir la proteína de la larva</div>
        <p style={{ fontSize: 12.5, color: S.muted, lineHeight: 1.7, marginBottom: 16 }}>
          La proteína del tejido de la larva va del 38% al 48% según lo que comió en los últimos días. La puedes "programar":
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROTEINA_NIVELES.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, background: 'rgba(255,255,255,0.04)', border: `1px solid ${S.border}`, borderRadius: 12, padding: '11px 14px' }}>
              <div style={{ flexShrink: 0, fontSize: 14, fontWeight: 800, color: ['#94a3b8', '#4ade80', '#a855f7'][i], minWidth: 64 }}>{p.proteina}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: S.text, marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 11.5, color: S.muted, lineHeight: 1.55 }}>{p.sustrato}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ 5. PROCESAMIENTO ══════════════════════════════════════════════════════

export function ProcesamientoSection() {
  const [ruta, setRuta] = useState<'viva' | 'harina'>('viva');
  const r = PROCESAMIENTO.find(x => x.id === ruta)!;

  return (
    <div>
      <h2 style={sectionTitle}>🏭 Procesamiento: larva viva vs harina</h2>
      <p style={sectionIntro}>
        Después de cosechar decides el formato. La larva viva es inmediata y sin equipo; la harina dura meses y se vende. Muchos productores hacen las dos: viva para sus animales, harina con el excedente.
      </p>

      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', minWidth: 460, borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={{ ...thStyle, color: '#f59e0b' }}>🐛 Larva viva</th>
              <th style={{ ...thStyle, color: '#10b981' }}>🌾 Harina seca</th>
            </tr>
          </thead>
          <tbody>
            {PROCESAMIENTO_COMPARATIVA.map((row, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ ...tdStyle, color: '#64748b', fontWeight: 700 }}>{row.criterio}</td>
                <td style={tdStyle}>{row.viva}</td>
                <td style={tdStyle}>{row.harina}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {PROCESAMIENTO.map(x => (
          <button
            key={x.id}
            onClick={() => setRuta(x.id)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800, fontSize: 12.5,
              background: ruta === x.id ? `${x.color}18` : S.navy2,
              border: `1.5px solid ${ruta === x.id ? x.color : S.border}`,
              color: ruta === x.id ? x.color : S.muted,
            }}
          >
            {x.emoji} {x.titulo}
          </button>
        ))}
      </div>

      <div style={{ background: S.navy2, border: `1px solid ${r.color}40`, borderRadius: 16, padding: '18px 20px' }}>
        <p style={{ fontSize: 13, color: r.color, fontWeight: 700, marginBottom: 4 }}>{r.tagline}</p>
        <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Cuándo elegirla: {r.cuando}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981', marginBottom: 6, letterSpacing: '0.06em' }}>✅ A FAVOR</div>
            {r.pros.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, paddingLeft: 10, borderLeft: '2px solid rgba(16,185,129,0.4)', lineHeight: 1.5 }}>{p}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', marginBottom: 6, letterSpacing: '0.06em' }}>⚠️ EN CONTRA</div>
            {r.contras.map((c, i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, paddingLeft: 10, borderLeft: '2px solid rgba(239,68,68,0.4)', lineHeight: 1.5 }}>{c}</div>)}
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Paso a paso</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {r.pasos.map((p, i) => (
            <div key={i} style={{ background: 'rgba(30,48,80,0.5)', border: `1px solid ${S.border}`, borderRadius: 10, padding: '11px 14px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: r.color, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#f1f5f9' }}>{p.titulo}</span>
              </div>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 0 21px' }}>{p.desc}</p>
              {p.alerta && <div style={{ margin: '7px 0 0 21px', padding: '6px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: 11, color: '#fca5a5', lineHeight: 1.5 }}>⚠️ {p.alerta}</div>}
            </div>
          ))}
        </div>

        <div style={{ padding: '11px 14px', background: 'rgba(30,48,80,0.5)', borderRadius: 10, border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 7 }}>🧰 MATERIALES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.materiales.map((m, i) => <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${r.color}12`, border: `1px solid ${r.color}30`, color: '#94a3b8' }}>{m}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' };
const tdStyle: React.CSSProperties = { padding: '9px 10px', color: '#cbd5e1', lineHeight: 1.5, verticalAlign: 'top' };

// ═══ 6. LOW COST ══════════════════════════════════════════════════════════

const DIF_COLOR: Record<string, string> = { 'Muy fácil': '#22c55e', 'Fácil': '#4ade80', 'Media': '#f59e0b' };

export function LowCostSection() {
  const [open, setOpen] = useState<string | null>(LOWCOST_SISTEMAS[0].id);

  return (
    <div>
      <h2 style={sectionTitle}>💸 Low cost — sistemas de $0 a $10</h2>
      <p style={sectionIntro}>
        Diseños con materiales reciclados o de ferretería básica. No son para producción comercial: sirven para darle proteína viva directa a tus animales
        aprovechando que la prepupa migra sola. La única inversión que importa es la semilla.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
        {LOWCOST_SISTEMAS.map(s => {
          const on = open === s.id;
          const dc = DIF_COLOR[s.dificultad];
          return (
            <div key={s.id} style={{ borderRadius: 14, overflow: 'hidden', background: S.navy2, border: `1px solid ${on ? 'rgba(34,197,94,0.4)' : S.border}` }}>
              <button onClick={() => setOpen(on ? null : s.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif' }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{s.nombre}</div>
                  <div style={{ fontSize: 11.5, color: '#64748b' }}>{s.animal} · {s.inversion}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: `${dc}18`, color: dc, flexShrink: 0, textTransform: 'uppercase' }}>{s.dificultad}</span>
                <span style={{ color: '#64748b', fontSize: 13, flexShrink: 0, transform: on ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {on && (
                <div style={{ padding: '0 18px 20px' }}>
                  <div style={{ height: 1, background: S.border, marginBottom: 14 }} />
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                    <MiniStat k="Inversión" v={s.inversion} />
                    <MiniStat k="Produce" v={s.produccion} />
                  </div>
                  <p style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 14 }}>{s.principio}</p>

                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.06em' }}>🧰 MATERIALES</div>
                  <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                    <table style={{ width: '100%', minWidth: 380, borderCollapse: 'collapse', fontSize: 11.5 }}>
                      <tbody>
                        {s.materiales.map((m, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${S.border}` }}>
                            <td style={{ padding: '7px 8px', color: '#f1f5f9', fontWeight: 600 }}>{m.item}</td>
                            <td style={{ padding: '7px 8px', color: '#94a3b8' }}>{m.spec}</td>
                            <td style={{ padding: '7px 8px', color: '#4ade80', fontWeight: 700, whiteSpace: 'nowrap' }}>{m.costo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', marginBottom: 8, letterSpacing: '0.06em' }}>🔧 CONSTRUCCIÓN Y USO</div>
                  <ol style={{ margin: '0 0 14px', paddingLeft: 18 }}>
                    {s.pasos.map((p, i) => <li key={i} style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.65, marginBottom: 5 }}>{p}</li>)}
                  </ol>

                  <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '11px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', marginBottom: 7, letterSpacing: '0.06em' }}>⚠️ LIMITACIONES</div>
                    {s.limitaciones.map((l, i) => <div key={i} style={{ fontSize: 11.5, color: '#fbbf24', lineHeight: 1.55, marginBottom: 4 }}>· {l}</div>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={label}>Comparativa rápida</div>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 11.5 }}>
          <thead>
            <tr>{['Sistema', 'Animal', 'Inversión', 'Mantenim.', 'Produce', 'Dificultad'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {LOWCOST_COMPARATIVA.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ ...tdStyle, color: '#f1f5f9', fontWeight: 600 }}>{r.sistema}</td>
                <td style={tdStyle}>{r.animal}</td>
                <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 700 }}>{r.inversion}</td>
                <td style={tdStyle}>{r.mantenimiento}</td>
                <td style={tdStyle}>{r.produccion}</td>
                <td style={tdStyle}>{r.dificultad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: S.green2, marginBottom: 10 }}>💡 Trucos para gastar aún menos</div>
        {LOWCOST_TIPS.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}><span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span><span>{t}</span></div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: 2 }}>{k}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: S.green2 }}>{v}</div>
    </div>
  );
}

// ═══ 7. VOCABULARIO ═══════════════════════════════════════════════════════

const CATS: (GlosarioCat | 'Todos')[] = ['Todos', 'Biología', 'Etapas', 'Manejo', 'Sustrato', 'Cosecha', 'Indicadores', 'Negocio'];

export function VocabularioSection() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<GlosarioCat | 'Todos'>('Todos');

  const list = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const nq = norm(q.trim());
    return GLOSARIO
      .filter(t => cat === 'Todos' || t.cat === cat)
      .filter(t => !nq || norm(t.termino).includes(nq) || norm(t.def).includes(nq) || (t.sigla ? norm(t.sigla).includes(nq) : false))
      .sort((a, b) => a.termino.localeCompare(b.termino, 'es'));
  }, [q, cat]);

  return (
    <div>
      <h2 style={sectionTitle}>📖 Vocabulario BSF</h2>
      <p style={sectionIntro}>
        {GLOSARIO.length} términos que vas a oír una y otra vez en el mundo de la larva. Busca por palabra o filtra por tema.
      </p>

      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Buscar término o palabra..."
        style={{
          width: '100%', maxWidth: 420, padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          border: `1.5px solid ${S.border}`, background: S.navy2, color: S.text,
          fontFamily: 'Montserrat, sans-serif', fontSize: 13, outline: 'none',
        }}
      />
      <Chips items={CATS as string[]} active={cat} onPick={v => setCat(v as GlosarioCat | 'Todos')} />

      {list.length === 0 ? (
        <p style={{ fontSize: 13, color: S.muted }}>Sin resultados para “{q}”.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {list.map(t => (
            <div key={t.termino} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 12, padding: '13px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: S.green2 }}>{t.termino}</span>
                {t.sigla && <span style={{ fontSize: 10.5, color: '#64748b', fontStyle: 'italic' }}>{t.sigla}</span>}
                <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', border: `1px solid ${S.border}`, borderRadius: 5, padding: '1px 6px', marginLeft: 'auto', textTransform: 'uppercase' }}>{t.cat}</span>
              </div>
              <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{t.def}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ 8. GALERÍA (pendiente de fotos) ═══════════════════════════════════════

const GALERIA_CATEGORIAS = [
  { emoji: '🥚', nombre: 'Huevo', desc: 'Cómo se ven los huevos frescos entre el cartón, qué es un puño de huevo, color y textura.' },
  { emoji: '🐛', nombre: 'Larva sana vs. enferma', desc: 'Larva blanca-crema activa vs. larva negra, deforme o con manchas. La diferencia a simple vista.' },
  { emoji: '⭐', nombre: 'Punto de cosecha', desc: 'Cómo se ve una L5–L6 lista: tamaño, color, comportamiento. Comparación con una larva que aún no está.' },
  { emoji: '🟤', nombre: 'Prepupa vs. larva', desc: 'El cambio de color de blanco a marrón, la prepupa migrando, la pupa formada.' },
  { emoji: '🫘', nombre: 'Pupa y emergencia', desc: 'Pupa sana, pupa con hongo, el momento en que la mosca emerge del puparium.' },
  { emoji: '🦟', nombre: 'Mosca adulta', desc: 'Macho vs. hembra, apareamiento, postura sobre el cartón. Cómo distinguirla de la mosca doméstica.' },
  { emoji: '🥗', nombre: 'Sustrato en buen estado', desc: 'Humedad correcta (prueba del puño), sustrato bien procesado vs. encharcado o seco.' },
  { emoji: '🐜', nombre: 'Plagas y problemas', desc: 'Larva de mosca doméstica, ácaros, moho blanco y verde, hormigas. Qué buscar.' },
  { emoji: '♻️', nombre: 'Frass y cosecha', desc: 'Cómo se ve el frass terminado, el tamizado, la larva ya separada del sustrato.' },
  { emoji: '🪣', nombre: 'Montajes low cost', desc: 'Fotos reales del balde autocosechante, la caja con rampa, el montaje sobre estanque.' },
];

export function GaleriaSection() {
  return (
    <div>
      <h2 style={sectionTitle}>🖼️ Mega galería visual</h2>
      <p style={sectionIntro}>
        La referencia para reconocer todo a simple vista: cada etapa, larva sana vs. enferma, plagas, sustrato en buen y mal estado, señales de cosecha.
      </p>

      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '14px 16px', marginBottom: 22, display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>📸</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', marginBottom: 3 }}>Galería en construcción</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            Estas son las 10 categorías que va a tener. Faltan las fotos de referencia: cuando pases el paquete de imágenes, cada categoría se llena.
            Mientras tanto, los videos por etapa están en la sección <strong style={{ color: '#e2e8f0' }}>“El ciclo”</strong>.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {GALERIA_CATEGORIAS.map((c, i) => (
          <div key={i} style={{ background: S.navy2, border: `1px dashed ${S.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ height: 96, background: 'rgba(30,48,80,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, opacity: 0.5 }}>{c.emoji}</div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{c.nombre}</div>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{c.desc}</div>
              <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginTop: 8 }}>Pendiente foto</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
