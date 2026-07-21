'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useSocios,
  BSF_STAGES,
  daysSince,
  getStage,
  type Lote,
  type FeedLog,
  type Cosecha,
  type Recordatorio,
  type Foto,
} from '@/hooks/useSocios';

// ─── Compresión de imagen cliente ────────────────────────────────────────────

async function comprimirImagen(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(str: string) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtDateTime(str: string) {
  if (!str) return '—';
  const d = new Date(str);
  return (
    d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  );
}
function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
function todayLocal() {
  return new Date().toISOString().split('T')[0];
}

const RESIDUO_ICONS: Record<string, string> = {
  'Cáscaras de frutas': '🍊', 'Restos de verduras': '🥬', 'Pulpa de café': '☕',
  Gallinaza: '🐔', 'Mezcla orgánica': '♻️', Otro: '🌱',
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  card:    'rgba(21,32,53,0.7)',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1.5px solid ${S.border}`, background: S.navy2,
  color: S.text, fontFamily: 'Montserrat, sans-serif', fontSize: 13, outline: 'none',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: S.muted,
  marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase',
};
const cardStyle: React.CSSProperties = {
  background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: '1.25rem',
};
const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
  border: 'none', borderRadius: 8, padding: '9px 20px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
const btnOutline: React.CSSProperties = {
  background: 'transparent', color: S.muted,
  border: `1.5px solid ${S.border}`, borderRadius: 8, padding: '9px 20px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  background: 'rgba(239,68,68,0.12)', color: S.red,
  border: '1.5px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 14px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer',
};
const btnSm: React.CSSProperties = { padding: '6px 14px', fontSize: 12 };

// ─── Small components ─────────────────────────────────────────────────────────

function Badge({ color, children }: { color: 'green'|'amber'|'red'|'blue'|'gray'; children: React.ReactNode }) {
  const map = {
    green:  { bg: 'rgba(16,185,129,0.15)', text: '#10b981' },
    amber:  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
    red:    { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444' },
    blue:   { bg: 'rgba(14,165,233,0.15)', text: '#38bdf8' },
    gray:   { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8' },
  };
  const c = map[color];
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ProgressBar({ pct, color = S.green }: { pct: number; color?: string }) {
  return (
    <div style={{ height: 6, background: S.navy3, borderRadius: 3, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: '100%', height: '100%', background: `linear-gradient(90deg, ${color}, #16a34a)`, borderRadius: 3, transform: `scaleX(${Math.min(pct, 100) / 100})`, transformOrigin: 'left', transition: 'transform 0.4s' }} />
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: S.muted }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{icon}</div>
      <p style={{ fontSize: 13 }}>{text}</p>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#152035', border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Timeline BSF ─────────────────────────────────────────────────────────────

function Timeline({ days }: { days: number }) {
  const stage = getStage(days);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: S.navy2, borderRadius: 10, padding: '10px 12px', overflowX: 'auto' }}>
      {BSF_STAGES.map((s, i) => {
        const done    = i < stage.idx;
        const current = i === stage.idx;
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '4px 8px', borderRadius: 8, background: current ? 'rgba(34,197,94,0.12)' : 'transparent', minWidth: 60 }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2, color: done ? S.emerald : current ? S.green2 : S.muted }}>{s.name}</div>
              <div style={{ fontSize: 9, color: S.muted, opacity: 0.7 }}>D{s.days[0]}–{s.days[1]}</div>
            </div>
            {i < BSF_STAGES.length - 1 && <span style={{ color: S.muted, opacity: 0.4, fontSize: 12, padding: '0 2px' }}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Calendar Month Grid ─────────────────────────────────────────────────────

const CAL_MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const CAL_DAYS   = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];

function CalendarMonth({ year, month, msMap, startDate, endDate, todayStr }: {
  year: number; month: number;
  msMap: Record<string, string[]>;
  startDate: Date; endDate: Date; todayStr: string;
}) {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1; // Mon-first

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayObj = new Date(todayStr + 'T00:00:00');

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: S.text, marginBottom: 8, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {CAL_MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {CAL_DAYS.map(d => (
          <div key={d} style={{ fontSize: 9, fontWeight: 700, color: '#475569', textAlign: 'center', paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday   = dateStr === todayStr;
          const dateObj   = new Date(year, month, day);
          const isInRange = dateObj >= startDate && dateObj <= endDate;
          const isPast    = dateObj < todayObj;
          const icons     = msMap[dateStr];

          return (
            <div key={dateStr} style={{
              textAlign: 'center',
              padding: icons ? '2px 1px 3px' : '4px 1px',
              borderRadius: 6,
              background: isToday ? 'rgba(34,197,94,0.22)' : icons ? 'rgba(34,197,94,0.1)' : isInRange ? 'rgba(30,48,80,0.6)' : 'transparent',
              border: isToday ? `1.5px solid ${S.green}` : icons ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
            }}>
              <div style={{ fontSize: 10, fontWeight: isToday ? 800 : 500, color: isToday ? S.green2 : icons ? S.text : isInRange ? (isPast ? '#64748b' : '#94a3b8') : '#1e3050', lineHeight: 1.3 }}>
                {day}
              </div>
              {icons && <div style={{ fontSize: 11, lineHeight: 1 }}>{icons.join('')}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini calendar ───────────────────────────────────────────────────────────

function MiniCalendar({ lote }: { lote: Lote }) {
  const [showCal, setShowCal] = useState(false);
  const today    = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const start    = new Date(lote.fecha);
  const objetivo = lote.objetivo ?? 'cosechar';

  function ms(label: string, icon: string, day: number) {
    const date = new Date(start);
    date.setDate(date.getDate() + day);
    const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);
    return { label, icon, date, isPast: diffDays > 0, isToday: diffDays === 0, daysAway: -diffDays };
  }

  const milestones = [
    ms('Siembra', '🌱', 0),
    ms('Eclosión', '🥚', 4),
    ms('Larva', '🐛', 14),
    objetivo === 'cosechar' ? ms('Cosecha', '⚖️', 22) : ms('Prepupa', '⭐', 22),
    objetivo === 'cosechar' ? ms('Fin', '✅', 28) : ms('Mosca', '🦋', 40),
  ];

  const endDate = milestones[milestones.length - 1].date;

  const msMap: Record<string, string[]> = {};
  for (const m of milestones) {
    const key = m.date.toISOString().split('T')[0];
    if (!msMap[key]) msMap[key] = [];
    msMap[key].push(m.icon);
  }

  const months: { year: number; month: number }[] = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  while (cur <= endMonth) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }

  const fmtShort = (d: Date) => d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>📅 Hitos del ciclo</div>
        <button
          onClick={() => setShowCal(c => !c)}
          style={{ background: showCal ? 'rgba(34,197,94,0.12)' : 'transparent', border: `1px solid ${showCal ? S.green : S.border}`, color: showCal ? S.green2 : S.muted, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
        >
          {showCal ? '✕ Cerrar' : '📅 Ver calendario'}
        </button>
      </div>

      {/* Milestone strip */}
      <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 4 }}>
        {milestones.map((m, i) => (
          <div key={m.label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ textAlign: 'center', minWidth: 64 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', margin: '0 auto 4px',
                background: m.isPast ? 'rgba(16,185,129,0.15)' : m.isToday ? 'rgba(34,197,94,0.2)' : 'rgba(30,48,80,0.8)',
                border: `2px solid ${m.isPast ? S.emerald : m.isToday ? S.green : S.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m.isPast ? 12 : 15,
              }}>
                {m.isPast ? '✓' : m.icon}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: m.isPast ? S.emerald : m.isToday ? S.green2 : S.muted, lineHeight: 1.2 }}>{m.label}</div>
              <div style={{ fontSize: 9, color: '#475569', marginTop: 1 }}>{fmtShort(m.date)}</div>
              <div style={{ fontSize: 9, color: m.isToday ? S.green : m.isPast ? '#475569' : S.muted, marginTop: 1 }}>
                {m.isToday ? 'HOY' : m.isPast ? `hace ${Math.abs(m.daysAway)}d` : `en ${m.daysAway}d`}
              </div>
            </div>
            {i < milestones.length - 1 && (
              <div style={{ width: 18, height: 1, background: S.border, flexShrink: 0, marginBottom: 22 }} />
            )}
          </div>
        ))}
      </div>

      {/* Expandable calendar grid */}
      {showCal && (
        <div style={{ marginTop: 14, background: S.navy2, borderRadius: 12, padding: '14px 12px', border: `1px solid ${S.border}` }}>
          {months.map(({ year, month }) => (
            <CalendarMonth
              key={`${year}-${month}`}
              year={year} month={month}
              msMap={msMap}
              startDate={start} endDate={endDate}
              todayStr={todayStr}
            />
          ))}
          <div style={{ borderTop: `1px solid rgba(34,197,94,0.1)`, paddingTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {milestones.map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: S.muted }}>
                <span>{m.icon}</span><span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'lotes' | 'lote-detail' | 'alimentacion' | 'cosecha' | 'guia' | 'admin';

function Dashboard({ lotes, feeds, cosechas, activeLotes, readyLotes, recordatorios, totalKg, avgConv, userName, onViewLote, onNav }: {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  activeLotes: Lote[]; readyLotes: Lote[]; recordatorios: Recordatorio[];
  totalKg: number; avgConv: number | null; userName: string;
  onViewLote: (id: string) => void; onNav: (v: View) => void;
}) {
  const statCard = (num: string, label: string, accent: string) => (
    <div style={{ ...cardStyle }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{num}</div>
      <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );

  // Clasificar lotes por urgencia de cosecha
  const lotesVencidos  = lotes.filter(l => daysSince(l.fecha) > 28);
  const lotesUrgentes  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 28; });
  const lotesPróximos  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 18 && d < 22; });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>¡Hola, {userName.split(' ')[0]}! 🪲</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Resumen de tu producción BSF de hoy</p>
      </div>

      {/* Notificaciones — vencidos primero */}
      {lotesVencidos.map(l => {
        const d = daysSince(l.fecha);
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.red }}>{l.nombre} — ¡Ventana de cosecha vencida!</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} — ya pasaron los 28 días óptimos. Las larvas se están encapando.</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onNav('cosecha'); }} style={{ ...btnDanger, flexShrink: 0, fontSize: 11 }}>Registrar igual</button>
          </div>
        );
      })}

      {lotesUrgentes.map(l => {
        const d = daysSince(l.fecha);
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.09)', border: '1.5px solid rgba(16,185,129,0.4)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>⚖️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.green2 }}>{l.nombre} — ¡Lista para cosechar!</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} de 28 — estás en la ventana óptima. No esperes más.</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onNav('cosecha'); }} style={{ ...btnPrimary, ...btnSm, flexShrink: 0, fontSize: 11 }}>Registrar cosecha</button>
          </div>
        );
      })}

      {lotesPróximos.map(l => {
        const d = daysSince(l.fecha);
        const diasRestantes = 22 - d;
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>⏳</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.amber }}>{l.nombre} — Cosecha en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} — prepárate. Alista tu colador, báscula y canastas.</div>
            </div>
          </div>
        );
      })}

      {/* Acciones a realizar pronto */}
      {(() => {
        const acciones = recordatorios
          .filter(r => !r.completado)
          .map(r => {
            const lote = lotes.find(l => l.id === r.loteId);
            if (!lote) return null;
            const diff = r.dia - daysSince(lote.fecha);
            if (diff > 3 || diff < -2) return null;
            return { r, lote, diff };
          })
          .filter(Boolean)
          .sort((a, b) => a!.diff - b!.diff) as { r: Recordatorio; lote: Lote; diff: number }[];

        if (acciones.length === 0) return null;
        return (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              📌 Acciones a realizar pronto
            </div>
            {acciones.map(({ r, lote, diff }) => (
              <div key={r.id} onClick={() => onViewLote(lote.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: diff === 0 ? 'rgba(34,197,94,0.08)' : diff < 0 ? 'rgba(239,68,68,0.06)' : S.navy2, border: `1px solid ${diff === 0 ? 'rgba(34,197,94,0.3)' : diff < 0 ? 'rgba(239,68,68,0.2)' : S.border}`, marginBottom: 6, cursor: 'pointer' }}>
                <span style={{ fontSize: 16 }}>📌</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titulo}</div>
                  <div style={{ fontSize: 11, color: S.muted }}>{lote.nombre}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: diff === 0 ? S.green : diff < 0 ? S.red : S.amber }}>
                  {diff === 0 ? '¡Hoy!' : diff < 0 ? `Hace ${Math.abs(diff)}d` : `En ${diff}d`}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {statCard(String(activeLotes.length), 'Lotes activos', S.green)}
        {statCard(String(readyLotes.length),  'Listos para cosechar', S.emerald)}
        {statCard(totalKg.toFixed(1) + ' kg', 'Total cosechado', S.amber)}
        {statCard(avgConv ? avgConv.toFixed(1) + '%' : '—', 'Conversión promedio', '#38bdf8')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Lotes en curso</h3>
            <button style={{ ...btnOutline, ...btnSm }} onClick={() => onNav('lotes')}>Ver todos</button>
          </div>
          {activeLotes.length === 0 ? (
            <EmptyState icon="📦" text="No hay lotes activos todavía" />
          ) : (
            activeLotes.map(l => {
              const d = daysSince(l.fecha);
              const stage = getStage(d);
              const pct = Math.min(Math.round((d / 28) * 100), 100);
              return (
                <div key={l.id} onClick={() => onViewLote(l.id)} style={{ marginBottom: 10, padding: '10px 12px', background: S.navy2, borderRadius: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 13 }}>{l.nombre}</strong>
                    <span style={{ fontSize: 11, color: S.muted }}>Día {d} · {stage.icon} {stage.name}</span>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
              );
            })
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Últimas alimentaciones</h3>
            <button style={{ ...btnOutline, ...btnSm }} onClick={() => onNav('alimentacion')}>Ver todo</button>
          </div>
          {feeds.length === 0 ? (
            <EmptyState icon="🌿" text="Sin registros de alimentación" />
          ) : (
            [...feeds].reverse().slice(0, 3).map(f => (
              <FeedEntry key={f.id} feed={f} lotes={lotes} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FeedEntry({ feed: f, lotes }: { feed: FeedLog; lotes: Lote[] }) {
  const lote = lotes.find(l => l.id === f.loteId);
  const rejBadge = { ninguno: null, leve: <Badge color="blue">Rechazo leve</Badge>, moderado: <Badge color="amber">Rechazo moderado</Badge>, alto: <Badge color="red">Rechazo alto</Badge> };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: S.navy2, borderRadius: 10, marginBottom: 8, border: '1px solid rgba(16,185,129,0.18)' }}>
      <div style={{ fontSize: 22 }}>{RESIDUO_ICONS[f.tipo] ?? '🌿'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 13 }}>{f.tipo || 'Sustrato orgánico'}</strong>
          {rejBadge[f.rechazo]}
        </div>
        <span style={{ fontSize: 11, color: S.muted }}>{lote?.nombre ?? '—'}{f.notas ? ` · ${f.notas}` : ''}</span>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.emerald }}>{f.cantidad} kg</div>
        <div style={{ fontSize: 10, color: S.muted }}>{fmtDateTime(f.fecha)}</div>
      </div>
    </div>
  );
}

function LotesView({ lotes, feeds, onViewLote, onNewLote, onDeleteLote }: {
  lotes: Lote[]; feeds: FeedLog[];
  onViewLote: (id: string) => void;
  onNewLote: () => void;
  onDeleteLote: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Mis Lotes BSF</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Seguimiento por etapa del ciclo de vida</p>
        </div>
        <button style={btnPrimary} onClick={onNewLote}>+ Nuevo lote</button>
      </div>
      <div style={cardStyle}>
        {lotes.length === 0 ? (
          <EmptyState icon="📦" text="No tienes lotes registrados. Crea el primero." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Lote','Inicio','Etapa actual','Días','Sustrato','Estado','Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: S.muted, borderBottom: `1px solid ${S.border}`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lotes.map(l => {
                  const d = daysSince(l.fecha);
                  const stage = getStage(d);
                  const ready = d >= 22 && d <= 32;
                  const past  = d > 32;
                  return (
                    <tr key={l.id} style={{ borderBottom: `1px solid rgba(34,197,94,0.07)` }}>
                      <td style={{ padding: '12px 12px', fontWeight: 700 }}>{l.nombre}</td>
                      <td style={{ padding: '12px 12px', color: S.muted }}>{fmtDate(l.fecha)}</td>
                      <td style={{ padding: '12px 12px' }}>{stage.icon} {stage.name}</td>
                      <td style={{ padding: '12px 12px', fontWeight: 700, color: S.green2 }}>Día {d}</td>
                      <td style={{ padding: '12px 12px', color: S.muted }}>{l.sustrato ? `${l.sustrato} kg` : '—'}</td>
                      <td style={{ padding: '12px 12px' }}>
                        {ready ? <Badge color="green">✅ Listo</Badge> : past ? <Badge color="gray">Finalizado</Badge> : <Badge color="blue">En curso</Badge>}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ ...btnOutline, ...btnSm }} onClick={() => onViewLote(l.id)}>Ver</button>
                          <button style={btnDanger} onClick={() => { if (confirm('¿Eliminar este lote?')) onDeleteLote(l.id); }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded]   = useState<Foto | null>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const loteFotos                 = fotos.filter(f => f.loteId === lote.id);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await comprimirImagen(file);
      onAdd({ loteId: lote.id, data, descripcion: '' });
    } catch {
      alert('No se pudo procesar la imagen. Intenta con otra.');
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

function LoteDetail({ lote, feeds, lotes, recordatorios, fotos, onBack, onAddFeed, onEdit, onAddRecordatorio, onToggleRecordatorio, onDeleteRecordatorio, onAddFoto, onDeleteFoto }: {
  lote: Lote; feeds: FeedLog[]; lotes: Lote[];
  recordatorios: Recordatorio[]; fotos: Foto[];
  onBack: () => void; onAddFeed: (loteId: string) => void; onEdit: () => void;
  onAddRecordatorio: (r: Omit<Recordatorio, 'id' | 'completado' | 'creadoEn'>) => void;
  onToggleRecordatorio: (id: string) => void;
  onDeleteRecordatorio: (id: string) => void;
  onAddFoto: (f: Omit<Foto, 'id' | 'creadoEn'>) => void;
  onDeleteFoto: (id: string) => void;
}) {
  const d = daysSince(lote.fecha);
  const pct = Math.min(Math.round((d / 28) * 100), 100);
  const loteFeds = feeds.filter(f => f.loteId === lote.id);
  const loteRecs = recordatorios.filter(r => r.loteId === lote.id);
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
    </div>
  );
}

function AlimentacionView({ feeds, lotes, onNewFeed }: { feeds: FeedLog[]; lotes: Lote[]; onNewFeed: () => void }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Registro de Alimentación</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Qué, cuánto y cuándo comen las larvas</p>
        </div>
        <button style={btnPrimary} onClick={onNewFeed}>+ Registrar alimentación</button>
      </div>
      <div style={cardStyle}>
        {feeds.length === 0 ? (
          <EmptyState icon="🌿" text="Sin registros de alimentación todavía." />
        ) : (
          [...feeds].reverse().map(f => <FeedEntry key={f.id} feed={f} lotes={lotes} />)
        )}
      </div>
    </div>
  );
}

function CosechaView({ cosechas, lotes, totalKg, avgConv, onNewCosecha }: {
  cosechas: Cosecha[]; lotes: Lote[];
  totalKg: number; avgConv: number | null;
  onNewCosecha: () => void;
}) {
  const qualityColor: Record<string, string> = { excelente: S.emerald, buena: '#38bdf8', regular: S.amber, baja: S.red };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Registro de Cosechas</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Métricas de rendimiento y conversión</p>
        </div>
        <button style={btnPrimary} onClick={onNewCosecha}>+ Registrar cosecha</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          [totalKg.toFixed(1) + ' kg', 'Total kg cosechados', S.emerald],
          ['#' + cosechas.length,       'Cosechas registradas', S.green],
          [avgConv ? avgConv.toFixed(1) + '%' : '—', 'Conversión promedio', '#38bdf8'],
        ].map(([v, l, c]) => (
          <div key={l} style={{ ...cardStyle }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c as string }}>{v}</div>
            <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        {cosechas.length === 0 ? (
          <EmptyState icon="⚖️" text="Aún no hay cosechas registradas." />
        ) : (
          [...cosechas].reverse().map(c => {
            const lote = lotes.find(l => l.id === c.loteId);
            const conv = c.sustratoTotal > 0 ? ((c.peso / c.sustratoTotal) * 100).toFixed(1) : null;
            return (
              <div key={c.id} style={{ background: S.navy2, border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>{lote?.nombre ?? 'Lote eliminado'}</strong>
                  <span style={{ fontSize: 12, color: S.muted }}>{fmtDate(c.fecha)}</span>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: S.emerald }}>{c.peso} kg</div><div style={{ fontSize: 10, color: S.muted }}>Cosechado</div></div>
                  {c.sustratoTotal > 0 && <div><div style={{ fontSize: 18, fontWeight: 800, color: S.muted }}>{c.sustratoTotal} kg</div><div style={{ fontSize: 10, color: S.muted }}>Sustrato</div></div>}
                  {conv && <div><div style={{ fontSize: 16, fontWeight: 800 }}><span style={{ background: 'rgba(16,185,129,0.15)', color: S.emerald, borderRadius: 20, padding: '2px 10px', fontSize: 13 }}>♻️ {conv}%</span></div><div style={{ fontSize: 10, color: S.muted, marginTop: 4 }}>Conversión</div></div>}
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: qualityColor[c.calidad] ?? S.text, textTransform: 'capitalize' }}>{c.calidad}</div><div style={{ fontSize: 10, color: S.muted }}>Calidad</div></div>
                </div>
                {c.notas && <p style={{ fontSize: 12, color: S.muted, marginTop: 8 }}>{c.notas}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function GuiaView() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Guía Rápida BSF</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Parámetros clave para tu producción</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🌡️ Condiciones óptimas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['🌡️ Temperatura ideal','27°C – 35°C'],['💧 Humedad sustrato','60% – 70%'],['📊 pH sustrato','6.0 – 7.5'],['🔦 Luz en cría','Oscuridad total']].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: S.navy2, borderRadius: 10, fontSize: 13 }}>
                <span>{l}</span><strong style={{ color: S.green2 }}>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📅 Ciclo de vida</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['🥚 Huevo','Días 1 – 4','4 días',S.amber],['🐛 Larva joven (L1-L3)','Días 5 – 14','10 días',S.green],['🦟 Larva madura (L4-L5)','Días 15 – 22','8 días',S.emerald],['⭐ Prepupa → COSECHA','Días 22 – 28','¡Lista!',S.green2]].map(([icon,range,dur,c]) => (
              <div key={icon as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: S.navy2, borderRadius: 10, fontSize: 13 }}>
                <div><strong>{icon}</strong><span style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>{range}</span></div>
                <strong style={{ color: c as string }}>{dur}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🌿 Sustratos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Cáscaras de frutas','green','Excelente'],['Restos de verduras','green','Excelente'],['Pulpa de café / frutas','green','Excelente'],['Gallinaza / estiércol','blue','Bueno'],['Alimentos procesados','amber','Moderado'],['Cítricos en exceso / picante','red','Evitar']].map(([s,c,l]) => (
              <div key={s as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: S.navy2, borderRadius: 8, fontSize: 13 }}>
                <span>{s}</span><Badge color={c as 'green'|'amber'|'red'|'blue'|'gray'}>{l}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📐 Conversión esperada</h3>
          <div style={{ padding: '14px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
            ℹ️ Por cada <strong>10 kg</strong> de sustrato orgánico, deberías obtener entre <strong>1.5 – 3 kg</strong> de larva fresca.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: 14, background: S.navy2, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: S.muted, marginBottom: 4 }}>Tasa de conversión</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: S.emerald }}>15–30%</div>
              <div style={{ fontSize: 10, color: S.muted }}>kg larva / kg sustrato</div>
            </div>
            <div style={{ padding: 14, background: S.navy2, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: S.muted, marginBottom: 4 }}>Proteína larva fresca</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: S.green2 }}>~40%</div>
              <div style={{ fontSize: 10, color: S.muted }}>base seca</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auth screens ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onSwitchToRegister }: { onLogin: (code: string, pass: string) => Promise<boolean>; onSwitchToRegister: () => void }) {
  const [code, setCode] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!code || !pass) { setError('Completa todos los campos'); return; }
    setError('');
    setLoading(true);
    const success = await onLogin(code, pass);
    setLoading(false);
    if (!success) { setError('Código o contraseña incorrectos.'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at 60% 30%, rgba(34,197,94,0.06) 0%, #0d1b2a 70%)' }}>
      <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪲</div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </h1>
          <p style={{ fontSize: 12, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>ZONA DE SOCIOS</p>
        </div>

        <Field label="Código de socio o email">
          <input style={inputStyle} value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && attempt()} placeholder="ej. SOCIO-001" autoComplete="off" disabled={loading} />
        </Field>
        <Field label="Contraseña">
          <input style={inputStyle} type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && attempt()} placeholder="••••••••" disabled={loading} />
        </Field>

        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}

        <button style={{ ...btnPrimary, width: '100%', padding: '12px', marginTop: 4, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} onClick={attempt} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar a mi zona →'}
        </button>

        <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 18, paddingTop: 18, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: S.muted, marginBottom: 10 }}>¿Eres nuevo en la comunidad?</p>
          <button style={{ ...btnOutline, width: '100%' }} onClick={onSwitchToRegister}>
            Crear cuenta como socio
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onRegister, onSwitchToLogin, invitacionPrevia }: { onRegister: (email: string, nombre: string, password: string, codigoInvitacion: string) => Promise<{ success: boolean; error?: string }>; onSwitchToLogin: () => void; invitacionPrevia?: string }) {
  const [codigoInvitacion, setCodigoInvitacion] = useState(invitacionPrevia ?? '');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!codigoInvitacion || !email || !nombre || !password || !confirmPass) {
      setError('Completa todos los campos');
      return;
    }
    if (password !== confirmPass) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    setLoading(true);
    const result = await onRegister(email, nombre, password, codigoInvitacion);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Error al registrarse');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at 60% 30%, rgba(34,197,94,0.06) 0%, #0d1b2a 70%)' }}>
      <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪲</div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>
            Pro<span style={{ color: S.green, fontStyle: 'normal' }}>Larva</span>
          </h1>
          <p style={{ fontSize: 12, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>REGISTRO DE SOCIO</p>
        </div>

        {/* Invitación — campo destacado primero */}
        <div style={{ background: 'rgba(34,197,94,0.06)', border: `1.5px solid rgba(34,197,94,0.25)`, borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: S.emerald, fontWeight: 700, letterSpacing: '0.05em' }}>CÓDIGO DE INVITACIÓN</div>
            {invitacionPrevia && <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.2)', color: S.green, borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>✓ Aplicado</span>}
          </div>
          <input
            style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '4px 0', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', color: invitacionPrevia ? S.green : S.green2, cursor: invitacionPrevia ? 'default' : 'text' }}
            value={codigoInvitacion}
            onChange={e => !invitacionPrevia && setCodigoInvitacion(e.target.value.toUpperCase())}
            placeholder="PRL-XXXXXX"
            autoComplete="off"
            readOnly={!!invitacionPrevia}
            disabled={loading && !invitacionPrevia}
          />
          <div style={{ fontSize: 10, color: S.muted, marginTop: 4 }}>
            {invitacionPrevia ? 'Tu invitación está lista. Completá tus datos para acceder.' : 'Solicitalo a la comunidad ProLarva para acceder.'}
          </div>
        </div>

        <Field label="Nombre completo">
          <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" disabled={loading} />
        </Field>
        <Field label="Email">
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" disabled={loading} />
        </Field>
        <Field label="Contraseña">
          <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
        </Field>
        <Field label="Confirmar contraseña">
          <input style={inputStyle} type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && !loading && attempt()} disabled={loading} />
        </Field>

        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}

        <button style={{ ...btnPrimary, width: '100%', padding: '12px', marginTop: 4, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} onClick={attempt} disabled={loading}>
          {loading ? 'Registrando...' : 'Crear mi cuenta'}
        </button>

        <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 18, paddingTop: 18, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: S.muted, marginBottom: 10 }}>¿Ya tienes cuenta?</p>
          <button style={{ ...btnOutline, width: '100%' }} onClick={onSwitchToLogin}>
            Entrar a mi zona
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin view ───────────────────────────────────────────────────────────────

interface Invitacion {
  id: string;
  codigo: string;
  usado: boolean;
  creado_en: string;
  usado_en?: string;
  usado_por?: string;
}

interface SocioRegistrado {
  id: string;
  codigo: string;
  email: string;
  nombre: string;
  estado: string;
  rol: string;
  creado_en: string;
}

function AdminView({ adminCode }: { adminCode: string }) {
  const [tab, setTab] = useState<'invitaciones' | 'socios'>('socios');

  // ── Invitaciones state ────────────────────────────────────────────────────
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [loadingInv, setLoadingInv]     = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [copied, setCopied]             = useState<string | null>(null);
  const [genError, setGenError]         = useState('');

  // ── Socios state ──────────────────────────────────────────────────────────
  const [socios, setSocios]         = useState<SocioRegistrado[]>([]);
  const [loadingSoc, setLoadingSoc] = useState(false);

  async function cargarInvitaciones() {
    setLoadingInv(true);
    try {
      const res  = await fetch('/api/invitaciones/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setInvitaciones(data.invitaciones);
    } finally { setLoadingInv(false); }
  }

  async function cargarSocios() {
    setLoadingSoc(true);
    try {
      const res  = await fetch('/api/socios/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setSocios(data.socios);
    } finally { setLoadingSoc(false); }
  }

  async function generar() {
    setGenerating(true); setGenError('');
    try {
      const res  = await fetch('/api/invitaciones/crear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) { await cargarInvitaciones(); copiar(data.codigo); }
      else setGenError(data.error ?? 'Error al generar');
    } finally { setGenerating(false); }
  }

  function copiar(codigo: string) {
    const link = `https://prolarva-monitor.vercel.app/socios?inv=${codigo}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(codigo);
    setTimeout(() => setCopied(null), 2000);
  }

  useEffect(() => {
    cargarSocios();
    cargarInvitaciones();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disponibles = invitaciones.filter(i => !i.usado).length;
  const usados      = invitaciones.filter(i => i.usado).length;
  const sociosActivos = socios.filter(s => s.estado === 'activo' && s.rol !== 'admin').length;

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Panel de Admin</h2>
      </div>

      {/* Stats globales */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Socios activos',   value: sociosActivos,        color: S.green },
          { label: 'Invitaciones',     value: invitaciones.length,  color: S.text  },
          { label: 'Disponibles',      value: disponibles,          color: S.emerald },
          { label: 'Usadas',           value: usados,               color: S.muted },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 110, textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([['socios', '👥 Socios'], ['invitaciones', '🎟️ Invitaciones']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif', cursor: 'pointer',
              background: tab === key ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
              color: tab === key ? '#fff' : S.muted,
              border: tab === key ? 'none' : `1.5px solid ${S.border}`,
            }}
          >{label}</button>
        ))}
      </div>

      {/* Tab: Socios */}
      {tab === 'socios' && (
        <div>
          {loadingSoc ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando socios...</p>
          ) : socios.filter(s => s.rol !== 'admin').length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <p style={{ fontSize: 13 }}>No hay socios registrados aún.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {socios.filter(s => s.rol !== 'admin').map(socio => (
                <div key={socio.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', flexWrap: 'wrap' }}>
                  {/* Avatar inicial */}
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: socio.estado === 'activo' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 900, color: socio.estado === 'activo' ? S.green : S.muted,
                  }}>
                    {socio.nombre.charAt(0).toUpperCase()}
                  </div>

                  {/* Info principal */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 2 }}>{socio.nombre}</div>
                    <div style={{ fontSize: 12, color: S.muted }}>{socio.email}</div>
                  </div>

                  {/* Código */}
                  <code style={{ fontSize: 11, color: S.green2, background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>
                    {socio.codigo}
                  </code>

                  {/* Fecha */}
                  <div style={{ fontSize: 11, color: S.muted, textAlign: 'right', flexShrink: 0 }}>
                    {fmtDate(socio.creado_en)}
                  </div>

                  {/* Estado */}
                  <Badge color={socio.estado === 'activo' ? 'green' : 'gray'}>
                    {socio.estado}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          <button onClick={cargarSocios} style={{ ...btnOutline, ...btnSm, marginTop: 16 }}>↺ Actualizar</button>
        </div>
      )}

      {/* Tab: Invitaciones */}
      {tab === 'invitaciones' && (
        <div>
          {/* Botón generar */}
          <div style={{ marginBottom: 20 }}>
            <button
              style={{ ...btnPrimary, opacity: generating ? 0.6 : 1, cursor: generating ? 'not-allowed' : 'pointer' }}
              onClick={generar}
              disabled={generating}
            >
              {generating ? 'Generando...' : '+ Generar código de invitación'}
            </button>
            {genError && <span style={{ marginLeft: 12, fontSize: 12, color: S.red }}>{genError}</span>}
            <p style={{ fontSize: 11, color: S.muted, marginTop: 6 }}>El código se copia automáticamente al portapapeles.</p>
          </div>

          {/* Lista de códigos */}
          {loadingInv ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando...</p>
          ) : invitaciones.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
              <p style={{ fontSize: 13 }}>No hay códigos aún. Generá el primero.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {invitaciones.map(inv => (
                <div key={inv.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', opacity: inv.usado ? 0.6 : 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: inv.usado ? S.muted : S.green, flexShrink: 0 }} />
                  <code style={{ fontSize: 15, fontWeight: 800, color: inv.usado ? S.muted : S.green2, letterSpacing: '0.06em', flex: 1 }}>
                    {inv.codigo}
                  </code>
                  <div style={{ fontSize: 11, color: S.muted, textAlign: 'right', lineHeight: 1.5 }}>
                    {inv.usado ? (
                      <>
                        <div>Usado por {inv.usado_por ?? '—'}</div>
                        <div>{inv.usado_en ? fmtDate(inv.usado_en) : ''}</div>
                      </>
                    ) : (
                      <div style={{ color: S.emerald, fontWeight: 700 }}>Disponible</div>
                    )}
                  </div>
                  {!inv.usado && (
                    <button
                      onClick={() => copiar(inv.codigo)}
                      style={{ ...btnOutline, ...btnSm, color: copied === inv.codigo ? S.green : S.muted, borderColor: copied === inv.codigo ? S.green : undefined, flexShrink: 0 }}
                    >
                      {copied === inv.codigo ? '✓ Copiado' : 'Copiar'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SociosInner() {
  const db = useSocios();
  const searchParams = useSearchParams();
  const invParam = searchParams.get('inv')?.toUpperCase() ?? undefined;
  const [authMode, setAuthMode] = useState<'login' | 'register'>(invParam ? 'register' : 'login');
  const [view,        setView]        = useState<View>('dashboard');
  const [detailLoteId, setDetailLoteId] = useState<string | null>(null);

  const [modalLote,    setModalLote]    = useState(false);
  const [modalFeed,    setModalFeed]    = useState(false);
  const [modalCosecha, setModalCosecha] = useState(false);
  const [prefillLoteId, setPrefillLoteId] = useState<string | null>(null);

  const [lObjetivo, setLObjetivo] = useState<'cosechar' | 'continuar'>('cosechar');
  const [editLoteId, setEditLoteId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editFecha,  setEditFecha]  = useState('');

  const lNombre    = useRef<HTMLInputElement>(null);
  const lFecha     = useRef<HTMLInputElement>(null);
  const lSustrato  = useRef<HTMLInputElement>(null);
  const lTipoSust  = useRef<HTMLSelectElement>(null);
  const lHuevos    = useRef<HTMLInputElement>(null);
  const lTemp      = useRef<HTMLInputElement>(null);
  const lNotas     = useRef<HTMLTextAreaElement>(null);

  const fLote      = useRef<HTMLSelectElement>(null);
  const fFecha     = useRef<HTMLInputElement>(null);
  const fCantidad  = useRef<HTMLInputElement>(null);
  const fTipo      = useRef<HTMLSelectElement>(null);
  const fRechazo   = useRef<HTMLSelectElement>(null);
  const fNotas     = useRef<HTMLTextAreaElement>(null);

  const cLote      = useRef<HTMLSelectElement>(null);
  const cFecha     = useRef<HTMLInputElement>(null);
  const cPeso      = useRef<HTMLInputElement>(null);
  const cSustTotal = useRef<HTMLInputElement>(null);
  const cCalidad   = useRef<HTMLSelectElement>(null);
  const cNotas     = useRef<HTMLTextAreaElement>(null);

  if (!db.loaded) return null;
  if (!db.session) {
    if (authMode === 'login') {
      return <LoginScreen onLogin={db.login} onSwitchToRegister={() => setAuthMode('register')} />;
    } else {
      return <RegisterScreen onRegister={(email, nombre, password, inv) => db.register(email, nombre, password, inv)} onSwitchToLogin={() => setAuthMode('login')} invitacionPrevia={invParam} />;
    }
  }

  const detailLote = detailLoteId ? db.lotes.find(l => l.id === detailLoteId) ?? null : null;

  function navTo(v: View) { setView(v); }
  function viewLote(id: string) { setDetailLoteId(id); setView('lote-detail'); }
  function openFeed(loteId: string | null) { setPrefillLoteId(loteId); setModalFeed(true); }

  function saveLote() {
    const nombre = lNombre.current?.value.trim() ?? '';
    const fecha  = lFecha.current?.value ?? '';
    if (!nombre || !fecha) { alert('Ingresa nombre y fecha.'); return; }
    db.addLote({
      nombre, fecha,
      objetivo:     lObjetivo,
      sustrato:     parseFloat(lSustrato.current?.value ?? '0') || 0,
      tipoSustrato: lTipoSust.current?.value ?? '',
      huevos:       lHuevos.current?.value ?? '',
      temp:         lTemp.current?.value ? parseFloat(lTemp.current.value) : null,
      notas:        lNotas.current?.value ?? '',
    });
    setModalLote(false);
    setLObjetivo('cosechar');
    if (lNombre.current)   lNombre.current.value   = '';
    if (lSustrato.current) lSustrato.current.value = '';
    if (lHuevos.current)   lHuevos.current.value   = '';
    if (lTemp.current)     lTemp.current.value      = '';
    if (lNotas.current)    lNotas.current.value     = '';
  }

  function saveEditLote() {
    if (!editLoteId) return;
    const nombre = editNombre.trim();
    if (!nombre || !editFecha) { alert('Ingresa nombre y fecha.'); return; }
    db.updateLote(editLoteId, { nombre, fecha: editFecha });
    setEditLoteId(null);
  }

  function saveFeed() {
    const loteId   = fLote.current?.value ?? '';
    const cantidad = parseFloat(fCantidad.current?.value ?? '0');
    if (!loteId || !cantidad) { alert('Selecciona un lote e ingresa la cantidad.'); return; }
    db.addFeed({
      loteId, cantidad,
      fecha:    fFecha.current?.value ?? new Date().toISOString(),
      tipo:     fTipo.current?.value ?? '',
      rechazo:  (fRechazo.current?.value ?? 'ninguno') as FeedLog['rechazo'],
      notas:    fNotas.current?.value ?? '',
    });
    setModalFeed(false);
    if (fCantidad.current) fCantidad.current.value = '';
    if (fNotas.current)    fNotas.current.value    = '';
  }

  function saveCosecha() {
    const loteId = cLote.current?.value ?? '';
    const peso   = parseFloat(cPeso.current?.value ?? '0');
    if (!loteId || !peso) { alert('Selecciona un lote e ingresa el peso.'); return; }
    db.addCosecha({
      loteId, peso,
      fecha:         cFecha.current?.value ?? todayLocal(),
      sustratoTotal: parseFloat(cSustTotal.current?.value ?? '0') || 0,
      calidad:       (cCalidad.current?.value ?? 'buena') as Cosecha['calidad'],
      notas:         cNotas.current?.value ?? '',
    });
    setModalCosecha(false);
    if (cPeso.current)      cPeso.current.value      = '';
    if (cSustTotal.current) cSustTotal.current.value = '';
    if (cNotas.current)     cNotas.current.value     = '';
  }

  const navItems: { key: View; icon: string; label: string }[] = [
    { key: 'dashboard',    icon: '🏠', label: 'Resumen' },
    { key: 'lotes',        icon: '📦', label: 'Mis Lotes' },
    { key: 'alimentacion', icon: '🌿', label: 'Alimentación' },
    { key: 'cosecha',      icon: '⚖️', label: 'Cosechas' },
    { key: 'guia',         icon: '📋', label: 'Guía Rápida' },
    ...(db.session.rol === 'admin' ? [{ key: 'admin' as View, icon: '🔑', label: 'Admin' }] : []),
  ];

  const activeView = view === 'lote-detail' ? 'lotes' : view;

  return (
    <div className="socios-wrap" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="socios-sidebar" style={{ width: 220, background: S.navy2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 60, height: 'calc(100vh - 60px)', zIndex: 40 }}>
        <div style={{ padding: '20px 18px', borderBottom: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </div>
          <div style={{ fontSize: 10, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>ZONA DE SOCIOS</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => {
            const active = activeView === item.key;
            return (
              <div key={item.key} onClick={() => navTo(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: active ? S.green2 : S.muted, background: active ? 'rgba(34,197,94,0.1)' : 'transparent', borderRadius: active ? 8 : 0, transition: 'all 0.15s' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '14px 18px', borderTop: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, flexShrink: 0 }}>
              {db.session.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{db.session.name}</div>
              <div style={{ fontSize: 10, color: S.muted }}>{db.session.code}</div>
            </div>
          </div>
          <button onClick={db.logout} style={{ ...btnOutline, width: '100%', fontSize: 12, padding: '7px' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="socios-main" style={{ flex: 1, padding: '2rem', minWidth: 0 }}>
        {/* Mobile only: user + logout bar */}
        <div className="socios-mobile-header">
          <span style={{ fontSize: 13, fontWeight: 700, color: S.text }}>👤 {db.session.name}</span>
          <button onClick={db.logout} style={{ ...btnOutline, fontSize: 11, padding: '4px 12px' }}>Salir</button>
        </div>
        {view === 'dashboard' && (
          <Dashboard
            lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas}
            activeLotes={db.activeLotes} readyLotes={db.readyLotes}
            recordatorios={db.recordatorios}
            totalKg={db.totalKg} avgConv={db.avgConv}
            userName={db.session.name}
            onViewLote={viewLote}
            onNav={navTo}
          />
        )}
        {view === 'lotes' && (
          <LotesView
            lotes={db.lotes} feeds={db.feeds}
            onViewLote={viewLote}
            onNewLote={() => { setModalLote(true); setTimeout(() => { if (lFecha.current) lFecha.current.value = todayLocal(); }, 10); }}
            onDeleteLote={db.deleteLote}
          />
        )}
        {view === 'lote-detail' && detailLote && (
          <LoteDetail
            lote={detailLote} feeds={db.feeds} lotes={db.lotes}
            recordatorios={db.recordatorios} fotos={db.fotos}
            onBack={() => setView('lotes')} onAddFeed={openFeed}
            onEdit={() => { setEditNombre(detailLote.nombre); setEditFecha(detailLote.fecha); setEditLoteId(detailLote.id); }}
            onAddRecordatorio={db.addRecordatorio}
            onToggleRecordatorio={db.toggleRecordatorio}
            onDeleteRecordatorio={db.deleteRecordatorio}
            onAddFoto={db.addFoto}
            onDeleteFoto={db.deleteFoto}
          />
        )}
        {view === 'alimentacion' && (
          <AlimentacionView feeds={db.feeds} lotes={db.lotes} onNewFeed={() => openFeed(null)} />
        )}
        {view === 'cosecha' && (
          <CosechaView cosechas={db.cosechas} lotes={db.lotes} totalKg={db.totalKg} avgConv={db.avgConv} onNewCosecha={() => { setModalCosecha(true); setTimeout(() => { if (cFecha.current) cFecha.current.value = todayLocal(); }, 10); }} />
        )}
        {view === 'guia'  && <GuiaView />}
        {view === 'admin' && db.session.rol === 'admin' && <AdminView adminCode={db.session.code} />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="socios-mobile-nav">
        {navItems.map(item => {
          const active = activeView === item.key;
          return (
            <div key={item.key} onClick={() => navTo(item.key)} className={`socios-tab${active ? ' socios-tab-active' : ''}`}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <style>{`
        .socios-mobile-header { display: none; }
        .socios-mobile-nav { display: none; }
        @media (max-width: 768px) {
          .socios-wrap { display: block !important; }
          .socios-sidebar { display: none !important; }
          .socios-main { padding: 1rem 1rem 80px !important; }
          .socios-mobile-header {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding: 10px 14px;
            background: rgba(21,32,53,0.7);
            border-radius: 10px;
            border: 1px solid rgba(34,197,94,0.2);
          }
          .socios-mobile-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: #0f1e30;
            border-top: 1px solid rgba(34,197,94,0.25);
            z-index: 100;
            padding: 6px 0 max(10px, env(safe-area-inset-bottom));
          }
          .socios-tab {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            padding: 4px 2px;
            cursor: pointer;
            color: #64748b;
            font-family: Montserrat, sans-serif;
          }
          .socios-tab span:last-child { font-size: 9px; font-weight: 700; text-align: center; line-height: 1.2; }
          .socios-tab-active { color: #4ade80 !important; }
        }
      `}</style>

      {/* Modal: Nuevo Lote */}
      <Modal open={modalLote} onClose={() => { setModalLote(false); setLObjetivo('cosechar'); }} title="📦 Nuevo Lote BSF">
        <Field label="Objetivo del lote">
          <div style={{ display: 'flex', gap: 8 }}>
            {([['cosechar', '⚖️ Cosechar larvas'], ['continuar', '🔄 Continuar camada']] as const).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setLObjetivo(val)} style={{ flex: 1, padding: '10px 6px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, background: lObjetivo === val ? (val === 'cosechar' ? 'rgba(34,197,94,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent', border: `1.5px solid ${lObjetivo === val ? (val === 'cosechar' ? S.green : S.emerald) : S.border}`, color: lObjetivo === val ? (val === 'cosechar' ? S.green2 : S.emerald) : S.muted }}>
                {label}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre / código del lote"><input ref={lNombre} style={inputStyle} placeholder="ej. Lote-07 Julio" /></Field>
          <Field label="Fecha de siembra"><input ref={lFecha} type="date" style={inputStyle} /></Field>
          <Field label="Sustrato inicial (kg)"><input ref={lSustrato} type="number" style={inputStyle} placeholder="ej. 20" min="0" step="0.1" /></Field>
          <Field label="Tipo de sustrato">
            <select ref={lTipoSust} style={inputStyle}>
              <option value="">Selecciona...</option>
              {['Cáscaras de frutas','Restos de verduras','Pulpa de café','Gallinaza','Mezcla orgánica','Otro'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Larvas / huevos iniciales"><input ref={lHuevos} style={inputStyle} placeholder="ej. 5000 larvas L1" /></Field>
          <Field label="Temperatura ambiente (°C)"><input ref={lTemp} type="number" style={inputStyle} placeholder="ej. 30" min="0" max="50" /></Field>
        </div>
        <Field label="Notas iniciales"><textarea ref={lNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Observaciones al inicio..." /></Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setModalLote(false)}>Cancelar</button>
          <button style={btnPrimary} onClick={saveLote}>Guardar lote</button>
        </div>
      </Modal>

      {/* Modal: Alimentación */}
      <Modal open={modalFeed} onClose={() => setModalFeed(false)} title="🌿 Registrar Alimentación">
        <Field label="Lote">
          <select ref={fLote} style={inputStyle} defaultValue={prefillLoteId ?? ''}>
            {db.lotes.length === 0
              ? <option>— Crea un lote primero —</option>
              : db.lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
            }
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha y hora"><input ref={fFecha} type="datetime-local" style={inputStyle} defaultValue={nowLocal()} /></Field>
          <Field label="Cantidad (kg)"><input ref={fCantidad} type="number" style={inputStyle} placeholder="ej. 2.5" min="0" step="0.1" /></Field>
          <Field label="Tipo de sustrato">
            <select ref={fTipo} style={inputStyle}>
              <option value="">Selecciona...</option>
              {['Cáscaras de frutas','Restos de verduras','Pulpa de café','Gallinaza','Mezcla orgánica','Otro'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Rechazo observado">
            <select ref={fRechazo} style={inputStyle}>
              <option value="ninguno">Ninguno</option>
              <option value="leve">Leve (&lt;20%)</option>
              <option value="moderado">Moderado (20–50%)</option>
              <option value="alto">Alto (&gt;50%)</option>
            </select>
          </Field>
        </div>
        <Field label="Observaciones"><textarea ref={fNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Color, olor, comportamiento..." /></Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setModalFeed(false)}>Cancelar</button>
          <button style={btnPrimary} onClick={saveFeed}>Guardar</button>
        </div>
      </Modal>

      {/* Modal: Editar Lote */}
      <Modal open={editLoteId !== null} onClose={() => setEditLoteId(null)} title="✏️ Editar Lote">
        <Field label="Nombre / código del lote">
          <input style={inputStyle} value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="ej. Lote-07 Julio" />
        </Field>
        <Field label="Fecha de siembra">
          <input type="date" style={inputStyle} value={editFecha} onChange={e => setEditFecha(e.target.value)} />
        </Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setEditLoteId(null)}>Cancelar</button>
          <button style={btnPrimary} onClick={saveEditLote}>Guardar cambios</button>
        </div>
      </Modal>

      {/* Modal: Cosecha */}
      <Modal open={modalCosecha} onClose={() => setModalCosecha(false)} title="⚖️ Registrar Cosecha">
        <Field label="Lote cosechado">
          <select ref={cLote} style={inputStyle}>
            {db.lotes.length === 0
              ? <option>— Crea un lote primero —</option>
              : db.lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
            }
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha de cosecha"><input ref={cFecha} type="date" style={inputStyle} /></Field>
          <Field label="Peso cosechado (kg)"><input ref={cPeso} type="number" style={inputStyle} placeholder="ej. 4.2" min="0" step="0.1" /></Field>
          <Field label="Sustrato total usado (kg)"><input ref={cSustTotal} type="number" style={inputStyle} placeholder="ej. 22" min="0" step="0.1" /></Field>
          <Field label="Calidad larvas">
            <select ref={cCalidad} style={inputStyle}>
              <option value="excelente">Excelente</option>
              <option value="buena">Buena</option>
              <option value="regular">Regular</option>
              <option value="baja">Baja</option>
            </select>
          </Field>
        </div>
        <Field label="Observaciones"><textarea ref={cNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Tamaño, % prepupas, incidencias..." /></Field>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setModalCosecha(false)}>Cancelar</button>
          <button style={btnPrimary} onClick={saveCosecha}>Registrar cosecha</button>
        </div>
      </Modal>
    </div>
  );
}

export default function SociosPage() {
  return (
    <Suspense fallback={null}>
      <SociosInner />
    </Suspense>
  );
}
