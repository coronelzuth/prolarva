'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EscuelaView from './EscuelaView';
import {
  useSocios,
  BSF_STAGES,
  daysSince,
  getStage,
  uid,
  type Lote,
  type FeedLog,
  type Cosecha,
  type Recordatorio,
  type Foto,
  type VentaSocio,
  type SocioSession,
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

// ─── CSV export ───────────────────────────────────────────────────────────────

function downloadCSV(rows: string[][], headers: string[], filename: string) {
  const content = [headers, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Share image ──────────────────────────────────────────────────────────────

async function generarImagenMes(stats: {
  kgMes: number; cosechasMes: number; lotesActivos: number;
  avgConv: number | null; mesLabel: string;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Fondo
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, 1080, 1080);

  // Franja verde top
  const grad = ctx.createLinearGradient(0, 0, 1080, 0);
  grad.addColorStop(0, '#22c55e'); grad.addColorStop(1, '#16a34a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 14);

  // Logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 68px Arial, sans-serif';
  ctx.fillText('ProLarva', 80, 140);
  ctx.fillStyle = '#22c55e';
  ctx.font = '32px Arial, sans-serif';
  ctx.fillText('Zona de Socios BSF', 80, 186);

  // Mes
  ctx.fillStyle = '#64748b';
  ctx.font = '28px Arial, sans-serif';
  ctx.fillText(`Resultados de ${stats.mesLabel}`, 80, 268);

  // Divider
  ctx.fillStyle = 'rgba(34,197,94,0.25)';
  ctx.fillRect(80, 290, 920, 2);

  // Stats
  const drawStat = (y: number, valor: string, label: string, color: string) => {
    ctx.fillStyle = color;
    ctx.font = 'bold 100px Arial, sans-serif';
    ctx.fillText(valor, 80, y + 88);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '30px Arial, sans-serif';
    ctx.fillText(label, 80, y + 128);
  };

  drawStat(310, `${stats.kgMes.toFixed(1)} kg`, 'cosechados este mes', '#4ade80');
  drawStat(490, `${stats.cosechasMes}`, 'cosechas registradas', '#22c55e');
  drawStat(650, `${stats.lotesActivos}`, 'lotes activos', '#10b981');
  if (stats.avgConv !== null) {
    drawStat(810, `${stats.avgConv.toFixed(1)}%`, 'conversión promedio', '#f59e0b');
  }

  // Footer
  ctx.fillStyle = 'rgba(34,197,94,0.08)';
  ctx.fillRect(0, 960, 1080, 120);
  ctx.fillStyle = '#475569';
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText('prolarva-monitor.vercel.app', 80, 1012);
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('#ProLarva #BSF #AgriculturaCircular', 80, 1050);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 1066, 1080, 14);

  await new Promise<void>(resolve => {
    canvas.toBlob(async (blob) => {
      if (!blob) { resolve(); return; }
      const mesSlug = stats.mesLabel.replace(/\s+/g, '-').toLowerCase();
      const file = new File([blob], `prolarva-${mesSlug}.png`, { type: 'image/png' });
      try {
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Mis resultados BSF — ${stats.mesLabel}`,
            text: `Este mes cosecheé ${stats.kgMes.toFixed(1)} kg de larvas BSF 🪲 #ProLarva`,
            files: [file],
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `prolarva-${mesSlug}.png`; a.click();
          URL.revokeObjectURL(url);
        }
      } catch { /* user cancelled share */ }
      resolve();
    }, 'image/png');
  });
}

// ─── SVG Charts ───────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 0.01);
  const barW = 300 / data.length;
  const pad = 4;
  return (
    <svg viewBox="0 0 300 100" style={{ width: '100%', height: 160 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * 65, d.value === 0 ? 0 : 2);
        const x = i * barW + pad / 2;
        const y = 75 - h;
        return (
          <g key={i}>
            <rect x={x} y={d.value === 0 ? 74 : y} width={barW - pad} height={d.value === 0 ? 1 : h} rx="3" fill="url(#bGrad)" opacity={d.value === 0 ? 0.12 : 1} />
            <text x={x + (barW - pad) / 2} y={86} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="sans-serif">{d.label}</text>
            {d.value > 0 && (
              <text x={x + (barW - pad) / 2} y={y - 4} textAnchor="middle" fontSize="7" fill="#4ade80" fontFamily="sans-serif" fontWeight="bold">
                {d.value.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}
      {/* Y-axis label */}
      <text x="298" y="10" textAnchor="end" fontSize="7" fill="#334155" fontFamily="sans-serif">kg</text>
    </svg>
  );
}

function LineChart({ data, metaLine }: { data: { label: string; value: number }[]; metaLine?: number }) {
  if (data.length === 0) return <EmptyState icon="📉" text="Registra cosechas con sustrato total para ver la evolución" />;
  const W = 300, H = 90, padX = 20, padY = 12;
  const plotW = W - padX * 2;
  const plotH = H - padY * 2;
  const max = Math.max(...data.map(d => d.value), metaLine ?? 0, 5);
  const pts = data.map((d, i) => ({
    x: padX + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW),
    y: padY + plotH - (d.value / max) * plotH,
  }));
  const polyline = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const metaY = metaLine ? padY + plotH - (metaLine / max) * plotH : null;
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} style={{ width: '100%', height: 140 }} preserveAspectRatio="xMidYMid meet">
      {metaY !== null && (
        <>
          <line x1={padX} y1={metaY} x2={W - padX} y2={metaY} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.7" />
          <text x={W - padX + 2} y={metaY + 4} fontSize="7" fill="#f59e0b" fontFamily="sans-serif">20%</text>
        </>
      )}
      {pts.length > 1 && <polyline points={polyline} fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0d1b2a" stroke="#4ade80" strokeWidth="2" />
          <text x={p.x} y={H + 12} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="sans-serif">{data[i].label}</text>
          <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="7.5" fill="#4ade80" fontFamily="sans-serif" fontWeight="bold">{data[i].value.toFixed(0)}%</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'lotes' | 'lote-detail' | 'cosecha' | 'guia' | 'admin' | 'perfil' | 'estadisticas' | 'escuela' | 'ventas';

function Dashboard({ lotes, feeds, cosechas, activeLotes, readyLotes, recordatorios, totalKg, avgConv, userName, anuncio, sinEmail, onViewLote, onNav }: {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  activeLotes: Lote[]; readyLotes: Lote[]; recordatorios: Recordatorio[];
  totalKg: number; avgConv: number | null; userName: string;
  anuncio?: string | null;
  sinEmail?: boolean;
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

  const [anuncioDismissed, setAnuncioDismissed] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>¡Hola, {userName.split(' ')[0]}! 🪲</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Resumen de tu producción BSF de hoy</p>
      </div>

      {/* Banner sin email */}
      {sinEmail && (
        <div onClick={() => onNav('perfil')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.4)', marginBottom: 16, cursor: 'pointer' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>📧</span>
          <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
            <strong style={{ color: S.amber }}>Agrega tu email</strong> para poder recuperar tu contraseña si la olvidas. Toca aquí para ir a tu Perfil.
          </div>
          <span style={{ color: S.amber, fontSize: 16, flexShrink: 0 }}>→</span>
        </div>
      )}

      {/* Banner de anuncio admin */}
      {anuncio && !anuncioDismissed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(56,189,248,0.08)', border: '1.5px solid rgba(56,189,248,0.3)', marginBottom: 16 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>📌</span>
          <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{anuncio}</div>
          <button onClick={() => setAnuncioDismissed(true)} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 16, flexShrink: 0, padding: 4 }}>✕</button>
        </div>
      )}

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
            <button onClick={e => { e.stopPropagation(); onViewLote(l.id); }} style={{ ...btnDanger, flexShrink: 0, fontSize: 11 }}>Registrar igual</button>
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
            <button onClick={e => { e.stopPropagation(); onViewLote(l.id); }} style={{ ...btnPrimary, ...btnSm, flexShrink: 0, fontSize: 11 }}>Registrar cosecha</button>
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

      {/* Recordatorios — todos los pendientes */}
      {(() => {
        const acciones = recordatorios
          .filter(r => !r.completado)
          .map(r => {
            const lote = lotes.find(l => l.id === r.loteId);
            if (!lote) return null;
            const diff = r.dia - daysSince(lote.fecha);
            return { r, lote, diff };
          })
          .filter(Boolean)
          .sort((a, b) => a!.diff - b!.diff) as { r: Recordatorio; lote: Lote; diff: number }[];

        if (acciones.length === 0) return null;

        const urgentes  = acciones.filter(a => a.diff <= 0);
        const proximas  = acciones.filter(a => a.diff > 0);

        return (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>📌 Recordatorios</div>

            {urgentes.length > 0 && (
              <div style={{ marginBottom: proximas.length > 0 ? 12 : 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Pendientes</div>
                {urgentes.map(({ r, lote, diff }) => (
                  <div key={r.id} onClick={() => onViewLote(lote.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: diff === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${diff === 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`, marginBottom: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>📌</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titulo}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{lote.nombre}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: diff === 0 ? S.green : S.red }}>
                      {diff === 0 ? '¡Hoy!' : `Hace ${Math.abs(diff)}d`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {proximas.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Próximas</div>
                {proximas.map(({ r, lote, diff }) => (
                  <div key={r.id} onClick={() => onViewLote(lote.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: S.navy2, border: `1px solid ${S.border}`, marginBottom: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>📌</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titulo}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{lote.nombre}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: diff <= 3 ? S.amber : S.muted }}>
                      En {diff}d
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Actividad reciente</h3>
            <button style={{ ...btnOutline, ...btnSm }} onClick={() => onNav('lotes')}>Ver mis lotes</button>
          </div>
          {feeds.length === 0 && cosechas.length === 0 ? (
            <EmptyState icon="🌿" text="Sin actividad registrada todavía" />
          ) : (() => {
            const items = [
              ...feeds.map(f => ({ type: 'feed' as const, fecha: f.fecha, data: f })),
              ...cosechas.map(c => ({ type: 'cosecha' as const, fecha: c.fecha, data: c })),
            ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3);
            return items.map(item =>
              item.type === 'feed'
                ? <FeedEntry key={`f-${item.data.id}`} feed={item.data as FeedLog} lotes={lotes} />
                : <CosechaEntry key={`c-${item.data.id}`} cosecha={item.data as Cosecha} lotes={lotes} />
            );
          })()}
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

function CosechaEntry({ cosecha: c, lotes }: { cosecha: Cosecha; lotes: Lote[] }) {
  const lote = lotes.find(l => l.id === c.loteId);
  const calidadBadge = (q: Cosecha['calidad']) => {
    if (q === 'excelente' || q === 'buena') return <Badge color="green">{q}</Badge>;
    if (q === 'regular') return <Badge color="amber">{q}</Badge>;
    return <Badge color="red">{q}</Badge>;
  };
  const calidadTextColor = (q: Cosecha['calidad']) =>
    q === 'excelente' || q === 'buena' ? S.green : q === 'regular' ? S.amber : S.red;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: S.navy2, borderRadius: 10, marginBottom: 8, border: '1px solid rgba(245,158,11,0.18)' }}>
      <div style={{ fontSize: 22 }}>⚖️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 13 }}>Cosecha</strong>
          {calidadBadge(c.calidad)}
        </div>
        <span style={{ fontSize: 11, color: S.muted }}>{lote?.nombre ?? '—'}{c.notas ? ` · ${c.notas}` : ''}</span>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: calidadTextColor(c.calidad) }}>{c.peso} kg</div>
        <div style={{ fontSize: 10, color: S.muted }}>{fmtDate(c.fecha)}</div>
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

const DEMO_FEATURES = [
  { icon: '📦', title: 'Mis Lotes BSF', desc: 'Registra cada camada y ve el día del ciclo en tiempo real' },
  { icon: '📅', title: 'Calendario', desc: 'Hitos automáticos: eclosión, cosecha y prepupa por lote' },
  { icon: '📊', title: 'Estadísticas', desc: 'Kg cosechados, conversión y ranking de sustratos' },
  { icon: '⏰', title: 'Recordatorios', desc: 'Alertas diarias para no perder ningún hito del ciclo' },
];

// ─── VentasView ──────────────────────────────────────────────────────────────

const PRODUCTO_LABELS: Record<string, string> = { larva: 'Larva fresca', harina: 'Harina BSF', abono: 'Abono orgánico' };
const PRODUCTO_ICONS:  Record<string, string> = { larva: '🐛', harina: '🌾', abono: '🌱' };

function VentasView({ ventas, onAdd, onDelete }: {
  ventas: VentaSocio[];
  onAdd: (v: Omit<VentaSocio, 'id' | 'creadoEn'>) => void;
  onDelete: (id: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [producto,   setProducto]  = useState<'larva' | 'harina' | 'abono'>('larva');
  const [fecha,      setFecha]     = useState(new Date().toISOString().split('T')[0]);
  const [kg,         setKg]        = useState('');
  const [precioPor,  setPrecioPor] = useState('');
  const [comprador,  setComprador] = useState('');
  const [notas,      setNotas]     = useState('');
  const [saving,     setSaving]    = useState(false);
  const [error,      setError]     = useState('');
  const [deleteId,   setDeleteId]  = useState<string | null>(null);

  const mesActual = new Date().toISOString().slice(0, 7);
  const ventasMes = ventas.filter(v => v.fecha.slice(0, 7) === mesActual);
  const ingresosMes = ventasMes.reduce((a, v) => a + v.totalCop, 0);
  const kgMes       = ventasMes.reduce((a, v) => a + v.kg, 0);
  const precioPromed = ventasMes.length > 0
    ? Math.round(ventasMes.reduce((a, v) => a + v.precioCopKg, 0) / ventasMes.length)
    : 0;

  const sorted = [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  function openModal() {
    setProducto('larva'); setFecha(new Date().toISOString().split('T')[0]);
    setKg(''); setPrecioPor(''); setComprador(''); setNotas(''); setError('');
    setShowModal(true);
  }

  async function handleSave() {
    const kgN = parseFloat(kg);
    const precioN = parseInt(precioPor);
    if (!kg || isNaN(kgN) || kgN <= 0) { setError('Ingresa los kg vendidos'); return; }
    if (!precioPor || isNaN(precioN) || precioN <= 0) { setError('Ingresa el precio por kg'); return; }
    setSaving(true);
    onAdd({
      fecha, producto,
      kg: kgN,
      precioCopKg: precioN,
      totalCop: Math.round(kgN * precioN),
      comprador: comprador.trim(),
      notas: notas.trim(),
    });
    setSaving(false);
    setShowModal(false);
  }

  const fmt = (n: number) => n.toLocaleString('es-CO');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>💰 Mis Ventas</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Registra tus ventas de larva, harina y abono BSF</p>
        </div>
        <button onClick={openModal} style={{ ...btnPrimary, flexShrink: 0 }}>+ Registrar venta</button>
      </div>

      {/* Stats del mes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: S.green }}>${fmt(ingresosMes)}</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Ingresos este mes (COP)</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: S.amber }}>{kgMes.toFixed(1)} kg</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Kg vendidos este mes</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>${fmt(precioPromed)}/kg</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Precio promedio</div>
        </div>
      </div>

      {/* Lista */}
      {sorted.length === 0 ? (
        <EmptyState icon="💰" text="Aún no has registrado ventas. Toca «+ Registrar venta» para empezar." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(v => (
            <div key={v.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{PRODUCTO_ICONS[v.producto] ?? '📦'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{PRODUCTO_LABELS[v.producto]}</span>
                  <Badge color="green">{v.kg} kg</Badge>
                  {v.comprador && <Badge color="blue">{v.comprador}</Badge>}
                </div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 3 }}>
                  {fmtDate(v.fecha)} · ${fmt(v.precioCopKg)}/kg
                  {v.notas && <span style={{ marginLeft: 8, color: '#475569' }}>· {v.notas}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: S.green }}>${fmt(v.totalCop)}</div>
                <button onClick={() => setDeleteId(v.id)} style={{ ...btnDanger, ...btnSm, marginTop: 4 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal registrar venta */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar venta">
        <Field label="Producto">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['larva', 'harina', 'abono'] as const).map(p => (
              <button key={p} onClick={() => setProducto(p)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', border: `1.5px solid ${producto === p ? S.green : S.border}`, background: producto === p ? 'rgba(34,197,94,0.12)' : 'transparent', color: producto === p ? S.green2 : S.muted }}>
                {PRODUCTO_ICONS[p]} {PRODUCTO_LABELS[p]}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha">
            <input type="date" style={inputStyle} value={fecha} onChange={e => setFecha(e.target.value)} />
          </Field>
          <Field label="Kg vendidos">
            <input type="number" step="0.1" min="0" style={inputStyle} value={kg} onChange={e => setKg(e.target.value)} placeholder="ej. 2.5" />
          </Field>
        </div>
        <Field label="Precio por kg (COP)">
          <input type="number" min="0" style={inputStyle} value={precioPor} onChange={e => setPrecioPor(e.target.value)} placeholder="ej. 5000" />
        </Field>
        {kg && precioPor && !isNaN(parseFloat(kg)) && !isNaN(parseInt(precioPor)) && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: `1px solid ${S.border}`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
            Total: <strong style={{ color: S.green }}>${(parseFloat(kg) * parseInt(precioPor)).toLocaleString('es-CO')} COP</strong>
          </div>
        )}
        <Field label="Comprador (opcional)">
          <input style={inputStyle} value={comprador} onChange={e => setComprador(e.target.value)} placeholder="ej. Finca Las Palmas" />
        </Field>
        <Field label="Notas (opcional)">
          <input style={inputStyle} value={notas} onChange={e => setNotas(e.target.value)} placeholder="ej. Pago en efectivo" />
        </Field>
        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={() => setShowModal(false)} style={btnOutline}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </Modal>

      {/* Confirmación eliminar */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="¿Eliminar venta?">
        <p style={{ color: S.muted, fontSize: 13, marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={btnOutline}>Cancelar</button>
          <button onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } }} style={{ ...btnPrimary, background: S.red }}>Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ResetPasswordScreen ─────────────────────────────────────────────────────

function ResetPasswordScreen({ token, onDone }: { token: string; onDone: () => void }) {
  const [pass,     setPass]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showP,    setShowP]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  async function handleReset() {
    if (!pass || pass.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (pass !== confirm)          { setError('Las contraseñas no coinciden'); return; }
    setError(''); setLoading(true);
    const res  = await fetch('/api/socios/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: pass }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Error al cambiar contraseña'); return; }
    setSuccess(true);
    setTimeout(onDone, 2500);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.07) 0%, #0d1b2a 65%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>🔐</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </h1>
          <p style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Crea tu nueva contraseña</p>
        </div>
        <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem 1.5rem' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <p style={{ fontWeight: 700, color: S.green2 }}>¡Contraseña actualizada!</p>
              <p style={{ color: S.muted, fontSize: 13, marginTop: 6 }}>Redirigiendo al login…</p>
            </div>
          ) : (
            <>
              <Field label="Nueva contraseña">
                <div style={{ position: 'relative' }}>
                  <input type={showP ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" />
                  <button type="button" onClick={() => setShowP(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16 }}>{showP ? '🙈' : '👁️'}</button>
                </div>
              </Field>
              <Field label="Confirmar contraseña">
                <input type={showP ? 'text' : 'password'} style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite la contraseña" onKeyDown={e => e.key === 'Enter' && !loading && handleReset()} />
              </Field>
              {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10 }}>{error}</p>}
              <button onClick={handleReset} disabled={loading} style={{ ...btnPrimary, width: '100%', padding: '12px', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Actualizando...' : 'Guardar nueva contraseña →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onSwitchToRegister }: { onLogin: (code: string, pass: string) => Promise<boolean>; onSwitchToRegister: () => void }) {
  const [code, setCode] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const attempt = async () => {
    if (!code || !pass) { setError('Completa todos los campos'); return; }
    setError('');
    setLoading(true);
    const success = await onLogin(code, pass);
    setLoading(false);
    if (!success) { setError('Código o contraseña incorrectos.'); }
  };

  async function handleForgot() {
    if (!forgotEmail) return;
    setForgotLoading(true);
    await fetch('/api/socios/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    setForgotLoading(false);
    setForgotSent(true);
  }

  const tryDemo = async () => {
    if (loading) return;
    setLoading(true);
    await onLogin('DEMO', 'demo');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.07) 0%, #0d1b2a 65%)', overflowX: 'hidden' }}>

      {/* Hero compacto */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1.25rem' }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🪲</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
          Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
        </h1>
        <p style={{ fontSize: 10, color: S.emerald, fontWeight: 800, letterSpacing: '0.14em', marginTop: 3 }}>ZONA DE SOCIOS</p>
      </div>

      {/* Card principal de login */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem 1.5rem', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>

          <Field label="Código de socio o email">
            <input
              style={inputStyle} value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && attempt()}
              placeholder="ej. SOCIO-001" autoComplete="off" disabled={loading}
            />
          </Field>
          <Field label="Contraseña">
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: 40 }}
                type={showPass ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && attempt()}
                placeholder="••••••••" disabled={loading}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </Field>

          {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}

          <button
            style={{ ...btnPrimary, width: '100%', padding: '12px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={attempt} disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar a mi zona →'}
          </button>

          {/* Forgot password */}
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            {!showForgot ? (
              <button onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textDecoration: 'underline' }}>
                ¿Olvidaste tu contraseña?
              </button>
            ) : forgotSent ? (
              <p style={{ fontSize: 12, color: S.green2, margin: 0 }}>✅ Si el email está registrado, recibirás un enlace para recuperarla.</p>
            ) : (
              <div style={{ marginTop: 4 }}>
                <input style={{ ...inputStyle, marginBottom: 8 }} type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="tu@email.com" disabled={forgotLoading} onKeyDown={e => e.key === 'Enter' && !forgotLoading && handleForgot()} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowForgot(false)} style={{ ...btnOutline, flex: 1, fontSize: 12 }}>Cancelar</button>
                  <button onClick={handleForgot} disabled={forgotLoading || !forgotEmail} style={{ ...btnPrimary, flex: 1, fontSize: 12, opacity: forgotLoading || !forgotEmail ? 0.6 : 1 }}>
                    {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: S.border }} />
            <span style={{ fontSize: 11, color: '#475569' }}>o</span>
            <div style={{ flex: 1, height: 1, background: S.border }} />
          </div>

          {/* Demo — secundario pero claro */}
          <button
            onClick={tryDemo} disabled={loading}
            style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'transparent', color: '#f59e0b', border: '1.5px solid rgba(245,158,11,0.35)', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            👀 Explorar en modo demo
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#475569', marginTop: 6 }}>
            Sin registrarte · Los datos no se guardan en el servidor
          </p>

          <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 14, paddingTop: 14, textAlign: 'center' }}>
            <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textDecoration: 'underline' }}>
              ¿Eres nuevo? Crear cuenta como socio
            </button>
          </div>
        </div>
      </div>

      {/* Preview — qué hay adentro (referencial, al fondo) */}
      <div style={{ maxWidth: 420, margin: '1.5rem auto 0', padding: '0 1.25rem 2.5rem' }}>
        <p style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>Qué vas a encontrar adentro</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {DEMO_FEATURES.map(f => (
            <div key={f.title} style={{ background: 'rgba(15,30,48,0.6)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: 10, padding: '12px 10px' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
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
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </Field>
        <Field label="Confirmar contraseña">
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showConfirm ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && !loading && attempt()} disabled={loading} />
            <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
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
  last_activity?: string | null;
}

const BLOG_META: Record<string, { title: string; emoji: string; color: string }> = {
  'problemas':          { title: '8 problemas comunes BSF',       emoji: '🔧', color: '#ef4444' },
  'raciones':           { title: 'Raciones por animal y etapa',   emoji: '🍽️', color: '#22c55e' },
  'alimentacion-larvas':{ title: 'Qué comen las larvas BSF',      emoji: '🌿', color: '#a855f7' },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

type BlogStatRow = { slug: string; views: number; last_viewed_at: string };

function BlogStatsTab({ stats, loading, onRefresh }: { stats: BlogStatRow[]; loading: boolean; onRefresh: () => void }) {
  const totalVisitas = stats.reduce((acc, s) => acc + s.views, 0);
  const top = stats[0];

  return (
    <div>
      {/* Resumen */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Visitas totales',   value: totalVisitas,    color: S.green },
          { label: 'Artículos activos', value: stats.length,    color: S.text  },
          { label: 'Artículo top',      value: top ? BLOG_META[top.slug]?.emoji + ' ' + top.views : '—', color: S.amber },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 120, textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Lista de artículos */}
      {loading ? (
        <p style={{ color: S.muted, fontSize: 13 }}>Cargando estadísticas...</p>
      ) : stats.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 13 }}>Aún no hay visitas registradas.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Las visitas se registran cada vez que alguien abre un artículo del blog.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.map((s, i) => {
            const meta = BLOG_META[s.slug] ?? { title: s.slug, emoji: '📄', color: S.muted };
            const pct  = totalVisitas > 0 ? Math.round((s.views / totalVisitas) * 100) : 0;
            return (
              <div key={s.slug} style={{ ...cardStyle, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  {/* Rank */}
                  <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? S.amber : S.muted, width: 20, flexShrink: 0 }}>
                    #{i + 1}
                  </div>
                  {/* Emoji */}
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{meta.emoji}</div>
                  {/* Título */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{meta.title}</div>
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                      Última visita: {s.last_viewed_at ? new Date(s.last_viewed_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </div>
                  </div>
                  {/* Contador */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: meta.color }}>{s.views}</div>
                    <div style={{ fontSize: 10, color: S.muted }}>visitas</div>
                  </div>
                </div>
                {/* Barra de progreso */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 4 }}>{pct}% del total</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onRefresh} style={{ ...btnOutline, ...btnSm, marginTop: 16 }}>↺ Actualizar</button>

      {/* Card GA4 */}
      <div style={{ ...cardStyle, marginTop: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: GA4_ID ? 0 : 10 }}>
          <span style={{ fontSize: 22 }}>📈</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>Google Analytics 4</div>
            <div style={{ fontSize: 11, color: GA4_ID ? S.green : S.amber, marginTop: 2 }}>
              {GA4_ID ? `✅ Activo · ${GA4_ID}` : '⚠️ Measurement ID no configurado'}
            </div>
          </div>
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...btnPrimary, fontSize: 11, padding: '6px 14px', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            Abrir GA4 →
          </a>
        </div>
        {!GA4_ID && (
          <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.7, marginTop: 4 }}>
            Para activar: crea una propiedad en <strong style={{ color: S.text }}>analytics.google.com</strong> → copia el Measurement ID (G-XXXXXXXX) → agrégalo como env var <strong style={{ color: S.text }}>NEXT_PUBLIC_GA_MEASUREMENT_ID</strong> en Vercel → redeploy.
          </div>
        )}
      </div>
    </div>
  );
}

interface Lead {
  id: string;
  nombre: string;
  whatsapp: string;
  fuente: string;
  especie: string;
  n_animales: number;
  perdida_cop: number;
  tipo_cta: string;
  estado: string;
  notas_crm: string;
  creado_en: string;
}

interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  producto: string;
  monto: number;
  canal: string;
  notas: string;
  creado_en: string;
}

interface GlobalStats {
  totalLotes: number;
  totalKg: number;
  totalLeads: number;
  totalVentasCOP: number;
  totalVentasCount: number;
  totalSocios: number;
  conversionPct: number;
}

function AdminView({ adminCode, onBack, onLogout }: { adminCode: string; onBack: () => void; onLogout: () => void }) {
  const [tab, setTab] = useState<'socios' | 'invitaciones' | 'blog' | 'leads' | 'ventas' | 'comunicacion'>('socios');

  // ── Invitaciones state ────────────────────────────────────────────────────
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [loadingInv, setLoadingInv]     = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [copied, setCopied]             = useState<string | null>(null);
  const [genError, setGenError]         = useState('');

  // ── Socios state ──────────────────────────────────────────────────────────
  const [socios, setSocios]         = useState<SocioRegistrado[]>([]);
  const [loadingSoc, setLoadingSoc] = useState(false);

  // ── Blog stats state ──────────────────────────────────────────────────────
  type BlogStat = { slug: string; views: number; last_viewed_at: string };
  const [blogStats, setBlogStats]   = useState<BlogStat[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);

  // ── Leads state ───────────────────────────────────────────────────────────
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // ── Ventas state ──────────────────────────────────────────────────────────
  const [ventas, setVentas]         = useState<Venta[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [savingVenta, setSavingVenta]     = useState(false);
  const [ventaError, setVentaError]       = useState('');
  const [ventaForm, setVentaForm]         = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    producto: 'Kit ProLarva 25/15',
    monto: 450000,
    canal: 'WhatsApp',
    notas: '',
  });
  const [showVentaForm, setShowVentaForm] = useState(false);

  // ── Global stats ──────────────────────────────────────────────────────────
  const [globalStats, setGlobalStats]   = useState<GlobalStats | null>(null);
  const [loadingGStats, setLoadingGStats] = useState(false);

  // ── Comunicación state ────────────────────────────────────────────────────
  const [pushTitulo, setPushTitulo]     = useState('');
  const [pushCuerpo, setPushCuerpo]     = useState('');
  const [sendingPush, setSendingPush]   = useState(false);
  const [pushResult, setPushResult]     = useState('');
  const [anuncioTexto, setAnuncioTexto] = useState('');
  const [savingAnuncio, setSavingAnuncio] = useState(false);
  const [anuncioOk, setAnuncioOk]       = useState('');
  const [togglingId, setTogglingId]     = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [editLeadNotas, setEditLeadNotas] = useState('');

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

  async function cargarBlog() {
    setLoadingBlog(true);
    try {
      const res  = await fetch('/api/blog/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setBlogStats(data.stats);
    } finally { setLoadingBlog(false); }
  }

  async function cargarLeads() {
    setLoadingLeads(true);
    try {
      const res  = await fetch('/api/leads/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } finally { setLoadingLeads(false); }
  }

  async function cargarVentas() {
    setLoadingVentas(true);
    try {
      const res  = await fetch('/api/ventas/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setVentas(data.ventas);
    } finally { setLoadingVentas(false); }
  }

  async function cargarGlobalStats() {
    setLoadingGStats(true);
    try {
      const res  = await fetch('/api/admin/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setGlobalStats(data.stats);
    } finally { setLoadingGStats(false); }
  }

  async function guardarVenta() {
    if (!ventaForm.cliente.trim()) { setVentaError('El nombre del cliente es requerido'); return; }
    if (!ventaForm.monto) { setVentaError('El monto es requerido'); return; }
    setSavingVenta(true); setVentaError('');
    try {
      const res  = await fetch('/api/ventas/guardar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, ...ventaForm }) });
      const data = await res.json();
      if (data.success) {
        setVentaForm({ fecha: new Date().toISOString().split('T')[0], cliente: '', producto: 'Kit ProLarva 25/15', monto: 450000, canal: 'WhatsApp', notas: '' });
        setShowVentaForm(false);
        await Promise.all([cargarVentas(), cargarGlobalStats()]);
      } else {
        setVentaError(data.error ?? 'Error al guardar');
      }
    } finally { setSavingVenta(false); }
  }

  async function toggleSocioEstado(socio: SocioRegistrado) {
    setTogglingId(socio.id);
    const nuevoEstado = socio.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await fetch('/api/socios/toggle-estado', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, socioId: socio.id, estado: nuevoEstado }) });
      setSocios(prev => prev.map(s => s.id === socio.id ? { ...s, estado: nuevoEstado } : s));
    } finally { setTogglingId(null); }
  }

  async function actualizarLead(leadId: string, campo: { estado?: string; notas_crm?: string }) {
    await fetch('/api/leads/actualizar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, leadId, ...campo }) });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...campo } : l));
  }

  async function enviarPushMasivo() {
    if (!pushTitulo.trim() || !pushCuerpo.trim()) return;
    setSendingPush(true); setPushResult('');
    try {
      const res  = await fetch('/api/push/notify-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, titulo: pushTitulo, cuerpo: pushCuerpo }) });
      const data = await res.json();
      if (data.success) { setPushResult(`✅ Enviado a ${data.sent} suscripción${data.sent !== 1 ? 'es' : ''}`); setPushTitulo(''); setPushCuerpo(''); }
      else setPushResult(`❌ ${data.error}`);
    } finally { setSendingPush(false); }
  }

  async function guardarAnuncio(desactivar = false) {
    setSavingAnuncio(true); setAnuncioOk('');
    try {
      const res  = await fetch('/api/anuncios/guardar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, texto: desactivar ? '' : anuncioTexto, activo: !desactivar }) });
      const data = await res.json();
      if (data.success) { setAnuncioOk(desactivar ? '✅ Anuncio desactivado' : '✅ Anuncio publicado'); if (desactivar) setAnuncioTexto(''); }
      else setAnuncioOk(`❌ ${data.error}`);
    } finally { setSavingAnuncio(false); }
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
    const link = `https://prolarva.co/socios?inv=${codigo}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(codigo);
    setTimeout(() => setCopied(null), 2000);
  }

  useEffect(() => {
    cargarSocios();
    cargarInvitaciones();
    cargarBlog();
    cargarLeads();
    cargarVentas();
    cargarGlobalStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disponibles = invitaciones.filter(i => !i.usado).length;
  const usados      = invitaciones.filter(i => i.usado).length;
  const sociosActivos = socios.filter(s => s.estado === 'activo' && s.rol !== 'admin').length;

  const copCurrency = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>🔑 Centro de Mando</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onBack} style={{ ...btnOutline, fontSize: 12, padding: '6px 14px' }}>← Volver</button>
          <button onClick={onLogout} style={{ ...btnDanger, fontSize: 12 }}>Cerrar sesión</button>
        </div>
      </div>

      {/* Stats globales — fila 1 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Socios activos',   value: sociosActivos, color: S.green },
          { label: 'Leads totales',    value: loadingGStats ? '…' : (globalStats?.totalLeads ?? leads.length), color: S.emerald },
          { label: 'Conversión',       value: loadingGStats ? '…' : (globalStats ? `${globalStats.conversionPct}%` : '—'), color: '#38bdf8' },
          { label: 'Kits vendidos',    value: loadingGStats ? '…' : (globalStats?.totalVentasCount ?? ventas.length), color: S.amber },
          { label: 'Ingresos totales', value: loadingGStats ? '…' : (globalStats ? copCurrency(globalStats.totalVentasCOP) : '—'), color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 90, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: typeof stat.value === 'string' && stat.value.length > 8 ? 12 : 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Stats globales — fila 2 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { label: 'Lotes BSF totales',   value: loadingGStats ? '…' : (globalStats?.totalLotes ?? '—'), color: S.text },
          { label: 'Kg cosechados total', value: loadingGStats ? '…' : (globalStats ? `${globalStats.totalKg.toFixed(1)} kg` : '—'), color: S.text },
          { label: 'Invit. disponibles',  value: disponibles, color: S.emerald },
          { label: 'Invit. usadas',       value: usados, color: S.muted },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 90, textAlign: 'center', padding: '10px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {([
          ['socios',        '👥 Socios'],
          ['leads',         '📊 Leads'],
          ['ventas',        '💰 Ventas'],
          ['comunicacion',  '📢 Comunicación'],
          ['invitaciones',  '🎟️ Invitaciones'],
          ['blog',          '📝 Blog'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
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
              {socios.filter(s => s.rol !== 'admin').map(socio => {
                const diasSinActividad = socio.last_activity
                  ? Math.floor((Date.now() - new Date(socio.last_activity).getTime()) / 86_400_000)
                  : null;
                const activo14 = diasSinActividad !== null && diasSinActividad <= 14;
                return (
                  <div key={socio.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', flexWrap: 'wrap', opacity: socio.estado === 'inactivo' ? 0.55 : 1 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: socio.estado === 'activo' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: socio.estado === 'activo' ? S.green : S.muted }}>
                      {socio.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 2 }}>{socio.nombre}</div>
                      <div style={{ fontSize: 12, color: S.muted }}>{socio.email}</div>
                      <div style={{ fontSize: 11, color: activo14 ? S.green : S.muted, marginTop: 2 }}>
                        {diasSinActividad === null ? '🕳️ Sin actividad registrada' : activo14 ? `✅ Activo hace ${diasSinActividad}d` : `⚠️ Inactivo hace ${diasSinActividad}d`}
                      </div>
                    </div>
                    <code style={{ fontSize: 11, color: S.green2, background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>
                      {socio.codigo}
                    </code>
                    <div style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>{fmtDate(socio.creado_en)}</div>
                    <button
                      onClick={() => toggleSocioEstado(socio)}
                      disabled={togglingId === socio.id}
                      style={{ ...btnOutline, ...btnSm, flexShrink: 0, color: socio.estado === 'activo' ? S.red : S.green, borderColor: socio.estado === 'activo' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)', opacity: togglingId === socio.id ? 0.5 : 1 }}
                    >
                      {togglingId === socio.id ? '…' : socio.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={cargarSocios} style={{ ...btnOutline, ...btnSm, marginTop: 16 }}>↺ Actualizar</button>
        </div>
      )}

      {/* Tab: Blog */}
      {tab === 'blog' && <BlogStatsTab stats={blogStats} loading={loadingBlog} onRefresh={cargarBlog} />}

      {/* Tab: Leads */}
      {tab === 'leads' && (
        <div>
          {/* Header + export */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 13, color: S.muted }}>
              Leads capturados desde la Calculadora BSF cuando alguien toca el botón de WhatsApp con nombre o número.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  const hdrs = ['Fecha', 'Nombre', 'WhatsApp', 'Especie', 'Animales', 'Pérdida COP', 'CTA'];
                  const rows = leads.map(l => [fmtDate(l.creado_en), l.nombre, l.whatsapp, l.especie, String(l.n_animales), String(l.perdida_cop), l.tipo_cta]);
                  downloadCSV(rows, hdrs, `prolarva-leads-${new Date().toISOString().slice(0, 10)}.csv`);
                }}
                style={{ ...btnOutline, ...btnSm }}
              >⬇ CSV</button>
              <button onClick={cargarLeads} style={{ ...btnOutline, ...btnSm }}>↺</button>
            </div>
          </div>

          {loadingLeads ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando leads...</p>
          ) : leads.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 13 }}>Aún no hay leads. Aparecerán cuando alguien complete la Calculadora y toque WhatsApp.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leads.map(lead => {
                const espEmoji: Record<string, string> = { pollos: '🐔', cerdos: '🐷', peces: '🐟' };
                const ESTADO_CFG: Record<string, { color: 'green'|'amber'|'red'|'blue'|'gray'; label: string }> = {
                  nuevo:      { color: 'blue',  label: '🆕 Nuevo' },
                  contactado: { color: 'amber', label: '📞 Contactado' },
                  en_proceso: { color: 'green', label: '🔄 En proceso' },
                  cerrado:    { color: 'green', label: '✅ Cerrado' },
                  perdido:    { color: 'gray',  label: '❌ Perdido' },
                };
                const cfg = ESTADO_CFG[lead.estado ?? 'nuevo'] ?? ESTADO_CFG.nuevo;
                const expanded = expandedLead === lead.id;
                return (
                  <div key={lead.id} style={{ ...cardStyle, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {espEmoji[lead.especie] ?? '🪲'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{lead.nombre || '(sin nombre)'}</div>
                        <div style={{ fontSize: 12, color: S.green2, fontWeight: 600 }}>📱 {lead.whatsapp || '—'}</div>
                        {lead.especie && (
                          <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                            {lead.n_animales} {lead.especie} · pérdida: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(lead.perdida_cop)}
                          </div>
                        )}
                        {lead.notas_crm && <div style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', marginTop: 3 }}>📝 {lead.notas_crm}</div>}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <Badge color={cfg.color}>{cfg.label}</Badge>
                        <div style={{ fontSize: 10, color: S.muted }}>{fmtDate(lead.creado_en)}</div>
                        <button onClick={() => { setExpandedLead(expanded ? null : lead.id); setEditLeadNotas(lead.notas_crm ?? ''); }} style={{ ...btnOutline, ...btnSm, fontSize: 10 }}>
                          {expanded ? '▲ Cerrar' : '✏️ Editar'}
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
                        <div style={{ marginBottom: 8 }}>
                          <label style={labelStyle}>Estado CRM</label>
                          <select
                            value={lead.estado ?? 'nuevo'}
                            onChange={e => actualizarLead(lead.id, { estado: e.target.value })}
                            style={inputStyle}
                          >
                            {Object.entries(ESTADO_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={labelStyle}>Notas de seguimiento</label>
                          <input
                            type="text"
                            value={editLeadNotas}
                            onChange={e => setEditLeadNotas(e.target.value)}
                            placeholder="Llamado el 25 jul, está interesado, pide precio..."
                            style={inputStyle}
                          />
                        </div>
                        <button onClick={() => { actualizarLead(lead.id, { notas_crm: editLeadNotas }); setExpandedLead(null); }} style={{ ...btnPrimary, ...btnSm }}>
                          Guardar notas
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Ventas */}
      {tab === 'ventas' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>Registro de Ventas</div>
              <div style={{ fontSize: 12, color: S.muted }}>Kits ProLarva vendidos</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  const hdrs = ['Fecha', 'Cliente', 'Producto', 'Monto COP', 'Canal', 'Notas'];
                  const rows = ventas.map(v => [v.fecha, v.cliente, v.producto, String(v.monto), v.canal, v.notas]);
                  downloadCSV(rows, hdrs, `prolarva-ventas-${new Date().toISOString().slice(0, 10)}.csv`);
                }}
                style={{ ...btnOutline, ...btnSm }}
              >⬇ CSV</button>
              <button onClick={() => { setShowVentaForm(v => !v); setVentaError(''); }} style={{ ...btnPrimary, ...btnSm }}>
                {showVentaForm ? '✕ Cancelar' : '+ Registrar venta'}
              </button>
            </div>
          </div>

          {/* Formulario nueva venta */}
          {showVentaForm && (
            <div style={{ ...cardStyle, padding: 20, marginBottom: 20, border: `1.5px solid rgba(245,158,11,0.3)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.amber, marginBottom: 16 }}>Nueva venta</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Fecha</label>
                  <input type="date" value={ventaForm.fecha} onChange={e => setVentaForm(f => ({ ...f, fecha: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Canal</label>
                  <select value={ventaForm.canal} onChange={e => setVentaForm(f => ({ ...f, canal: e.target.value }))} style={inputStyle}>
                    {['WhatsApp', 'Instagram', 'TikTok', 'Directo', 'Referido'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Cliente (nombre)</label>
                <input type="text" placeholder="Ej: Juan Pérez" value={ventaForm.cliente} onChange={e => setVentaForm(f => ({ ...f, cliente: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Producto</label>
                  <select value={ventaForm.producto} onChange={e => setVentaForm(f => ({ ...f, producto: e.target.value }))} style={inputStyle}>
                    {['Kit ProLarva 25/15', 'Acompañamiento adicional', 'Consultoría'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Monto (COP)</label>
                  <input type="number" value={ventaForm.monto} onChange={e => setVentaForm(f => ({ ...f, monto: Number(e.target.value) }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Notas (opcional)</label>
                <input type="text" placeholder="Pago en efectivo, envío a Cúcuta..." value={ventaForm.notas} onChange={e => setVentaForm(f => ({ ...f, notas: e.target.value }))} style={inputStyle} />
              </div>
              {ventaError && <div style={{ fontSize: 12, color: S.red, marginBottom: 10 }}>{ventaError}</div>}
              <button
                onClick={guardarVenta}
                disabled={savingVenta}
                style={{ ...btnPrimary, width: '100%', opacity: savingVenta ? 0.6 : 1, cursor: savingVenta ? 'not-allowed' : 'pointer' }}
              >
                {savingVenta ? 'Guardando...' : '✅ Guardar venta'}
              </button>
            </div>
          )}

          {/* Stats del mes */}
          {ventas.length > 0 && (() => {
            const mesKey = new Date().toISOString().slice(0, 7);
            const ventasMes = ventas.filter(v => v.fecha.startsWith(mesKey));
            const totalMes  = ventasMes.reduce((s, v) => s + v.monto, 0);
            const totalAll  = ventas.reduce((s, v) => s + v.monto, 0);
            return (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Ventas este mes', value: ventasMes.length, color: S.green },
                  { label: 'Ingresos este mes', value: copCurrency(totalMes), color: S.amber },
                  { label: 'Ingresos totales', value: copCurrency(totalAll), color: '#a78bfa' },
                ].map(st => (
                  <div key={st.label} style={{ ...cardStyle, flex: 1, minWidth: 120, textAlign: 'center', padding: '12px 10px' }}>
                    <div style={{ fontSize: st.label.includes('Ingresos') ? 13 : 22, fontWeight: 900, color: st.color }}>{st.value}</div>
                    <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Lista */}
          {loadingVentas ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando ventas...</p>
          ) : ventas.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
              <p style={{ fontSize: 13 }}>Aún no hay ventas registradas. Registra tu primera venta arriba.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ventas.map(v => (
                <div key={v.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', flexWrap: 'wrap' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{v.cliente}</div>
                    <div style={{ fontSize: 12, color: S.muted }}>{v.producto} · {v.canal}</div>
                    {v.notas && <div style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', marginTop: 2 }}>{v.notas}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#a78bfa' }}>{copCurrency(v.monto)}</div>
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{fmtDate(v.fecha)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={cargarVentas} style={{ ...btnOutline, ...btnSm, marginTop: 12 }}>↺ Actualizar</button>
        </div>
      )}

      {/* Tab: Comunicación */}
      {tab === 'comunicacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Push masivo */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 4 }}>📢 Notificación push masiva</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Llega a todos los socios que tienen las notificaciones activadas en su dispositivo.</div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Título</label>
              <input type="text" value={pushTitulo} onChange={e => setPushTitulo(e.target.value)} placeholder="Ej: Nueva actualización disponible" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Mensaje</label>
              <input type="text" value={pushCuerpo} onChange={e => setPushCuerpo(e.target.value)} placeholder="Ej: Revisa tus lotes activos, hay novedades." style={inputStyle} />
            </div>
            <button onClick={enviarPushMasivo} disabled={sendingPush || !pushTitulo || !pushCuerpo} style={{ ...btnPrimary, opacity: (sendingPush || !pushTitulo || !pushCuerpo) ? 0.5 : 1, cursor: (sendingPush || !pushTitulo || !pushCuerpo) ? 'not-allowed' : 'pointer' }}>
              {sendingPush ? 'Enviando…' : '📤 Enviar a todos'}
            </button>
            {pushResult && <div style={{ marginTop: 10, fontSize: 13, color: pushResult.startsWith('✅') ? S.green : S.red, fontWeight: 700 }}>{pushResult}</div>}
          </div>

          {/* Anuncio para socios */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 4 }}>📌 Anuncio en el dashboard</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Aparece como banner en el resumen de todos los socios al abrir la app. Solo puede haber uno activo a la vez.</div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Texto del anuncio</label>
              <input type="text" value={anuncioTexto} onChange={e => setAnuncioTexto(e.target.value)} placeholder="Ej: ¡Nuevo video publicado! Revísalo en @prolarva.co" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => guardarAnuncio(false)} disabled={savingAnuncio || !anuncioTexto.trim()} style={{ ...btnPrimary, opacity: (savingAnuncio || !anuncioTexto.trim()) ? 0.5 : 1, cursor: (savingAnuncio || !anuncioTexto.trim()) ? 'not-allowed' : 'pointer' }}>
                {savingAnuncio ? 'Guardando…' : '📌 Publicar anuncio'}
              </button>
              <button onClick={() => guardarAnuncio(true)} disabled={savingAnuncio} style={{ ...btnOutline, ...btnSm, color: S.red, borderColor: 'rgba(239,68,68,0.3)' }}>
                Desactivar anuncio actual
              </button>
            </div>
            {anuncioOk && <div style={{ marginTop: 10, fontSize: 13, color: anuncioOk.startsWith('✅') ? S.green : S.red, fontWeight: 700 }}>{anuncioOk}</div>}
          </div>
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

// ─── Estadísticas ────────────────────────────────────────────────────────────

function EstadisticasView({ lotes, feeds, cosechas, totalKg, avgConv }: {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  totalKg: number; avgConv: number | null;
}) {
  const [sharing, setSharing] = useState(false);

  const ahora = new Date();
  const mesKey = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  const mesLabel = ahora.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  // Kg por mes (últimos 6)
  const meses6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').slice(0, 3),
    };
  });
  const kgPorMes = meses6.map(m => ({
    label: m.label,
    value: cosechas.filter(c => c.fecha.startsWith(m.key)).reduce((a, c) => a + c.peso, 0),
  }));

  // Conversión histórica (últimas 8 con sustrato)
  const convData = cosechas
    .filter(c => c.sustratoTotal > 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-8)
    .map((c, i) => ({ label: `#${i + 1}`, value: (c.peso / c.sustratoTotal) * 100 }));

  // Ranking de lotes por conversión
  const ranking = lotes.map(l => {
    const cs = cosechas.filter(c => c.loteId === l.id);
    const csS = cs.filter(c => c.sustratoTotal > 0);
    const kg = cs.reduce((a, c) => a + c.peso, 0);
    const conv = csS.length ? csS.reduce((a, c) => a + (c.peso / c.sustratoTotal) * 100, 0) / csS.length : null;
    return { ...l, kg, conv };
  }).filter(l => l.kg > 0 || l.conv !== null)
    .sort((a, b) => (b.conv ?? -1) - (a.conv ?? -1));

  // Mejor sustrato
  const sustrMap: Record<string, { t: number; n: number }> = {};
  cosechas.filter(c => c.sustratoTotal > 0).forEach(c => {
    const lote = lotes.find(l => l.id === c.loteId);
    if (!lote?.tipoSustrato) return;
    const s = lote.tipoSustrato;
    if (!sustrMap[s]) sustrMap[s] = { t: 0, n: 0 };
    sustrMap[s].t += (c.peso / c.sustratoTotal) * 100;
    sustrMap[s].n++;
  });
  const mejorSustrato = Object.entries(sustrMap)
    .map(([k, v]) => ({ sust: k, avg: v.t / v.n }))
    .sort((a, b) => b.avg - a.avg)[0] ?? null;

  // Stats del mes para compartir
  const kgMes = cosechas.filter(c => c.fecha.startsWith(mesKey)).reduce((a, c) => a + c.peso, 0);
  const cosechasMesN = cosechas.filter(c => c.fecha.startsWith(mesKey)).length;
  const lotesActivos = lotes.filter(l => daysSince(l.fecha) <= 32).length;

  const medalles = ['🥇', '🥈', '🥉'];

  if (cosechas.length === 0 && lotes.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>📊 Estadísticas</h1>
        <EmptyState icon="📊" text="Registra tu primer lote y cosecha para ver tus estadísticas aquí" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>📊 Estadísticas</h1>

      {/* Kg por mes */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>🌿 Kg cosechados por mes</div>
          <div style={{ fontSize: 11, color: S.muted }}>últimos 6 meses</div>
        </div>
        {cosechas.length === 0
          ? <EmptyState icon="⚖️" text="Aún no tienes cosechas registradas" />
          : <BarChart data={kgPorMes} />
        }
        {totalKg > 0 && (
          <div style={{ fontSize: 12, color: S.muted, marginTop: 4, textAlign: 'right' }}>
            Total acumulado: <strong style={{ color: S.green2 }}>{totalKg.toFixed(1)} kg</strong>
          </div>
        )}
      </div>

      {/* Conversión histórica */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>📈 Tasa de conversión</div>
          {avgConv !== null && (
            <div style={{ fontSize: 11, color: S.amber, fontWeight: 700 }}>Prom: {avgConv.toFixed(1)}%</div>
          )}
        </div>
        <LineChart data={convData} metaLine={20} />
        <div style={{ fontSize: 11, color: S.muted, display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#f59e0b' }}>— — </span>Meta: 20%</span>
          {avgConv !== null && (
            <span>Tu promedio: <strong style={{ color: avgConv >= 20 ? S.green : S.amber }}>{avgConv.toFixed(1)}%</strong></span>
          )}
        </div>
      </div>

      {/* Ranking de lotes */}
      {ranking.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 14 }}>🏆 Ranking de lotes</div>
          {ranking.slice(0, 5).map((l, i) => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < Math.min(ranking.length, 5) - 1 ? `1px solid ${S.border}` : 'none' }}>
              <span style={{ fontSize: 20, flexShrink: 0, width: 28 }}>{medalles[i] ?? `${i + 1}.`}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.nombre}</div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>
                  {l.tipoSustrato && <span style={{ marginRight: 8 }}>🌿 {l.tipoSustrato}</span>}
                  <span>⚖️ {l.kg.toFixed(1)} kg</span>
                </div>
              </div>
              {l.conv !== null && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: l.conv >= 20 ? S.green2 : l.conv >= 15 ? S.amber : S.red }}>{l.conv.toFixed(1)}%</div>
                  <div style={{ fontSize: 9, color: S.muted }}>conversión</div>
                </div>
              )}
            </div>
          ))}
          {mejorSustrato && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.green2 }}>🌿 Mejor sustrato: {mejorSustrato.sust}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                Conversión promedio: {mejorSustrato.avg.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exportar CSV */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 14 }}>📥 Exportar datos</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: lotes.length === 0 ? 0.4 : 1 }}
            disabled={lotes.length === 0}
            onClick={() => {
              const hdrs = ['Nombre', 'Fecha siembra', 'Objetivo', 'Sustrato inicial (kg)', 'Tipo sustrato', 'Larvas/huevos', 'Temperatura', 'Notas'];
              const rows = lotes.map(l => [l.nombre, l.fecha, l.objetivo ?? 'cosechar', l.sustrato.toString(), l.tipoSustrato, l.huevos, l.temp?.toString() ?? '', l.notas]);
              downloadCSV(rows, hdrs, `prolarva-lotes-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >📦 Lotes</button>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: cosechas.length === 0 ? 0.4 : 1 }}
            disabled={cosechas.length === 0}
            onClick={() => {
              const hdrs = ['Lote', 'Fecha cosecha', 'Peso (kg)', 'Sustrato total (kg)', 'Conversión (%)', 'Calidad', 'Notas'];
              const rows = cosechas.map(c => {
                const l = lotes.find(x => x.id === c.loteId);
                const conv = c.sustratoTotal > 0 ? ((c.peso / c.sustratoTotal) * 100).toFixed(1) : '';
                return [l?.nombre ?? c.loteId, c.fecha, c.peso.toString(), c.sustratoTotal.toString(), conv, c.calidad, c.notas];
              });
              downloadCSV(rows, hdrs, `prolarva-cosechas-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >⚖️ Cosechas</button>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: feeds.length === 0 ? 0.4 : 1 }}
            disabled={feeds.length === 0}
            onClick={() => {
              const hdrs = ['Lote', 'Fecha', 'Cantidad (kg)', 'Tipo sustrato', 'Rechazo', 'Notas'];
              const rows = feeds.map(f => {
                const l = lotes.find(x => x.id === f.loteId);
                return [l?.nombre ?? f.loteId, f.fecha.slice(0, 10), f.cantidad.toString(), f.tipo, f.rechazo, f.notas];
              });
              downloadCSV(rows, hdrs, `prolarva-alimentacion-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >🌿 Alimentación</button>
        </div>
      </div>

      {/* Compartir resultados */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 6 }}>📤 Compartir resultados del mes</div>
        <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.6, marginBottom: 14 }}>
          Genera una imagen lista para WhatsApp o Instagram con tus estadísticas de {mesLabel}.
          {kgMes === 0 && <span style={{ color: S.amber }}> (Aún no tienes cosechas este mes.)</span>}
        </p>
        <button
          style={{ ...btnPrimary, width: '100%', opacity: sharing ? 0.6 : 1 }}
          disabled={sharing}
          onClick={async () => {
            setSharing(true);
            await generarImagenMes({ kgMes, cosechasMes: cosechasMesN, lotesActivos, avgConv, mesLabel });
            setSharing(false);
          }}
        >
          {sharing ? 'Generando imagen...' : `📤 Compartir ${mesLabel}`}
        </button>
      </div>
    </div>
  );
}

// ─── Perfil ───────────────────────────────────────────────────────────────────

function PerfilView({
  session, lotes, feeds, cosechas, totalKg,
  onUpdateName, onUpdateEmail, onChangePassword, onLaunchTour, onReset, onGuia, onGoAdmin,
}: {
  session: SocioSession;
  lotes: Lote[];
  feeds: FeedLog[];
  cosechas: Cosecha[];
  totalKg: number;
  onUpdateName: (nombre: string) => Promise<boolean>;
  onUpdateEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  onChangePassword: (current: string, nueva: string) => Promise<{ ok: boolean; error?: string }>;
  onLaunchTour: () => void;
  onReset: () => void;
  onGuia: () => void;
  onGoAdmin?: () => void;
}) {
  const isDemo = session.code === 'DEMO';

  const [avatar,       setAvatar]       = useState<string | null>(null);
  const [nombre,       setNombre]       = useState(session.name);
  const [nombreSaving, setNombreSaving] = useState(false);
  const [nombreOk,     setNombreOk]     = useState(false);

  const [emailVal,     setEmailVal]     = useState(session.email ?? '');
  const [emailSaving,  setEmailSaving]  = useState(false);
  const [emailMsg,     setEmailMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSaveEmail() {
    setEmailSaving(true); setEmailMsg(null);
    const res = await onUpdateEmail(emailVal.trim());
    setEmailSaving(false);
    setEmailMsg(res.ok ? { ok: true, text: '✅ Email guardado' } : { ok: false, text: res.error ?? 'Error' });
    if (res.ok) setTimeout(() => setEmailMsg(null), 3000);
  }

  const [showCurPass,     setShowCurPass]     = useState(false);
  const [showNewPass,     setShowNewPass]     = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [currentPass,  setCurrentPass]  = useState('');
  const [newPass,      setNewPass]      = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [passLoading,  setPassLoading]  = useState(false);
  const [passMsg,      setPassMsg]      = useState<{ ok: boolean; text: string } | null>(null);
  const [passOpen,     setPassOpen]     = useState(false);

  const [notifStatus, setNotifStatus] = useState<'unsupported' | 'default' | 'granted' | 'denied'>('default');
  const [notifLoading, setNotifLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const initials = session.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem(`prl-avatar-${session.code}`);
    if (saved) setAvatar(saved);
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setNotifStatus('unsupported');
    } else {
      const perm = Notification.permission as 'default' | 'granted' | 'denied';
      setNotifStatus(perm);
      // Si el permiso ya está concedido, verificar que haya suscripción push activa
      if (perm === 'granted') {
        navigator.serviceWorker.ready
          .then(reg => reg.pushManager.getSubscription())
          .then(sub => {
            if (sub) {
              // Suscripción existe → re-sincronizar con el servidor
              fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ socioCode: session.code, subscription: sub.toJSON() }),
              }).catch(() => {});
            } else {
              // Permiso concedido pero sin suscripción → resetear para que pueda activar de nuevo
              setNotifStatus('default');
            }
          })
          .catch(() => {});
      }
    }
  }, [session.code]);

  async function toggleNotifications() {
    if (notifStatus === 'unsupported') return;
    if (notifStatus === 'granted') {
      setNotifLoading(true);
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ socioCode: session.code }),
        });
      } finally {
        setNotifStatus('default');
        setNotifLoading(false);
      }
      return;
    }
    setNotifLoading(true);
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { setNotifStatus(perm as 'denied'); setNotifLoading(false); return; }
    try {
      const reg = await navigator.serviceWorker.ready;
      // Limpiar suscripción anterior (keys viejas causan "push service error")
      try {
        const existing = await reg.pushManager.getSubscription();
        if (existing) await existing.unsubscribe();
      } catch { /* ignorar error de unsubscribe */ }
      // Convertir base64url → Uint8Array sin depender del env var (clave pública, no es secreta)
      const VAPID_PUBLIC = 'BAgFCZDb8Ns26uwWupdTa7FMmmmuB9X8vxcEdjQWjJx5hORuzNS9ceoGU0xTbXB9Vm0_mS4g7pK8n8bcZTS5iDo';
      let keyArray: Uint8Array;
      try {
        const padding = '='.repeat((4 - (VAPID_PUBLIC.length % 4)) % 4);
        const base64 = (VAPID_PUBLIC + padding).replace(/-/g, '+').replace(/_/g, '/');
        const binary = atob(base64);
        keyArray = Uint8Array.from(binary, c => c.charCodeAt(0));
      } catch (keyErr) {
        setTestMsg('❌ Error interno de key: ' + (keyErr instanceof Error ? keyErr.message : String(keyErr)));
        setNotifLoading(false);
        return;
      }
      let sub: PushSubscription;
      try {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyArray.buffer.slice(keyArray.byteOffset, keyArray.byteOffset + keyArray.byteLength) as ArrayBuffer });
      } catch (subErr) {
        const msg = subErr instanceof Error ? subErr.message : String(subErr);
        setTestMsg('❌ Error suscripción push: ' + msg + ' · SW: ' + (reg.active?.state ?? 'sin SW'));
        setNotifLoading(false);
        return;
      }
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socioCode: session.code, subscription: sub.toJSON() }),
      });
      if (res.ok) {
        setNotifStatus('granted');
      } else {
        setTestMsg('❌ Error al guardar la suscripción. Intenta de nuevo.');
      }
    } catch (err) {
      setTestMsg('❌ No se pudo activar: ' + (err instanceof Error ? err.message : 'error desconocido'));
      setNotifStatus('default');
    }
    setNotifLoading(false);
  }

  async function sendTestNotif() {
    setTestLoading(true);
    setTestMsg(null);
    try {
      const res = await fetch('/api/push/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socio_code: session.code }),
      });
      const data = await res.json();
      if (res.ok && data.sent > 0) {
        setTestMsg('✅ ¡Enviada! Revisa la notificación en tu celular.');
      } else {
        setTestMsg('❌ ' + (data.error ?? 'No se pudo enviar.'));
      }
    } catch {
      setTestMsg('❌ Error de red.');
    }
    setTestLoading(false);
    setTimeout(() => setTestMsg(null), 5000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await comprimirImagen(file);
    setAvatar(compressed);
    localStorage.setItem(`prl-avatar-${session.code}`, compressed);
    window.dispatchEvent(new CustomEvent('prl-avatar-changed', { detail: compressed }));
  }

  async function handleSaveName() {
    if (!nombre.trim() || nombre.trim() === session.name) return;
    setNombreSaving(true);
    const ok = await onUpdateName(nombre.trim());
    setNombreSaving(false);
    if (ok) { setNombreOk(true); setTimeout(() => setNombreOk(false), 2500); }
  }

  async function handleChangePass() {
    setPassMsg(null);
    if (!currentPass || !newPass || !confirmPass) { setPassMsg({ ok: false, text: 'Completa todos los campos.' }); return; }
    if (newPass !== confirmPass) { setPassMsg({ ok: false, text: 'Las contraseñas nuevas no coinciden.' }); return; }
    if (newPass.length < 6) { setPassMsg({ ok: false, text: 'Mínimo 6 caracteres.' }); return; }
    setPassLoading(true);
    const result = await onChangePassword(currentPass, newPass);
    setPassLoading(false);
    if (result.ok) {
      setPassMsg({ ok: true, text: '✅ Contraseña actualizada correctamente.' });
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } else {
      setPassMsg({ ok: false, text: result.error ?? 'Error al cambiar la contraseña.' });
    }
  }

  const eyeBtn = (show: boolean, toggle: () => void): React.CSSProperties => ({
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: S.muted,
    fontSize: 16, padding: '2px', lineHeight: 1,
  });

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>👤 Mi Perfil</h1>

      {/* Avatar + info */}
      <div style={{ ...cardStyle, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid rgba(34,197,94,0.4)' }} />
            : <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 26 }}>{initials}</div>
          }
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Cambiar foto"
            style={{ position: 'absolute', bottom: 0, right: 0, background: S.navy, border: `1.5px solid ${S.border}`, borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}
          >✏️</button>
          <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: S.text }}>{session.name}</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Código: {session.code}</div>
          <div style={{ fontSize: 11, color: S.emerald, fontWeight: 700, marginTop: 6 }}>
            {session.rol === 'admin' ? '🔑 Administrador' : '🪲 Socio ProLarva'}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mis estadísticas</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Lotes totales',    value: lotes.length,      icon: '📦', color: S.green2 },
            { label: 'Cosechas',         value: cosechas.length,   icon: '⚖️', color: S.emerald },
            { label: 'Kg cosechados',    value: totalKg > 0 ? `${totalKg.toFixed(1)} kg` : '0 kg', icon: '🌿', color: S.amber },
            { label: 'Alimentaciones',   value: feeds.length,      icon: '🍃', color: '#38bdf8' },
          ].map(s => (
            <div key={s.label} style={{ background: S.navy, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: S.muted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editar nombre */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Editar nombre</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={nombre}
            onChange={e => { setNombre(e.target.value); setNombreOk(false); }}
            placeholder="Tu nombre completo"
          />
          <button
            style={{ ...btnPrimary, flexShrink: 0, opacity: !nombre.trim() || nombre.trim() === session.name || nombreSaving ? 0.5 : 1 }}
            disabled={!nombre.trim() || nombre.trim() === session.name || nombreSaving}
            onClick={handleSaveName}
          >
            {nombreSaving ? '...' : nombreOk ? '✅' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Email — para recuperar contraseña */}
      {!isDemo && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>📧 Email (recuperar contraseña)</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              style={{ ...inputStyle, flex: 1 }}
              value={emailVal}
              onChange={e => { setEmailVal(e.target.value); setEmailMsg(null); }}
              placeholder="tu@email.com"
            />
            <button
              style={{ ...btnPrimary, flexShrink: 0, opacity: !emailVal.trim() || emailVal.trim() === (session.email ?? '') || emailSaving ? 0.5 : 1 }}
              disabled={!emailVal.trim() || emailVal.trim() === (session.email ?? '') || emailSaving}
              onClick={handleSaveEmail}
            >
              {emailSaving ? '...' : 'Guardar'}
            </button>
          </div>
          {emailMsg && <p style={{ fontSize: 12, marginTop: 8, color: emailMsg.ok ? S.green2 : S.red }}>{emailMsg.text}</p>}
        </div>
      )}

      {/* Cambiar contraseña — colapsable (oculto en modo demo) */}
      {!isDemo && <div style={{ ...cardStyle, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => { setPassOpen(v => !v); setPassMsg(null); }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: S.muted }}>🔐 Cambiar contraseña</span>
          <span style={{ fontSize: 12, color: S.muted, transition: 'transform 0.2s', display: 'inline-block', transform: passOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {passOpen && (
          <div style={{ marginTop: 16 }}>
            <Field label="Contraseña actual">
              <div style={{ position: 'relative' }}>
                <input type={showCurPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={currentPass} onChange={e => { setCurrentPass(e.target.value); setPassMsg(null); }} placeholder="Tu contraseña actual" />
                <button type="button" onClick={() => setShowCurPass(v => !v)} style={eyeBtn(showCurPass, () => {})}>{showCurPass ? '🙈' : '👁️'}</button>
              </div>
            </Field>
            <Field label="Nueva contraseña">
              <div style={{ position: 'relative' }}>
                <input type={showNewPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={newPass} onChange={e => { setNewPass(e.target.value); setPassMsg(null); }} placeholder="Mínimo 6 caracteres" />
                <button type="button" onClick={() => setShowNewPass(v => !v)} style={eyeBtn(showNewPass, () => {})}>{showNewPass ? '🙈' : '👁️'}</button>
              </div>
            </Field>
            <Field label="Confirmar nueva contraseña">
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setPassMsg(null); }} placeholder="Repite la nueva contraseña" />
                <button type="button" onClick={() => setShowConfirmPass(v => !v)} style={eyeBtn(showConfirmPass, () => {})}>{showConfirmPass ? '🙈' : '👁️'}</button>
              </div>
            </Field>
            {passMsg && (
              <div style={{ fontSize: 12, color: passMsg.ok ? S.green : S.red, marginBottom: 12, fontWeight: 600 }}>{passMsg.text}</div>
            )}
            <button style={{ ...btnPrimary, width: '100%', opacity: passLoading ? 0.6 : 1 }} disabled={passLoading} onClick={handleChangePass}>
              {passLoading ? 'Cambiando...' : 'Actualizar contraseña'}
            </button>
          </div>
        )}
      </div>}

      {/* Notificaciones */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Notificaciones push</div>
        {notifStatus === 'unsupported' ? (
          <div style={{ fontSize: 12, color: S.muted }}>Tu navegador no soporta notificaciones push.</div>
        ) : notifStatus === 'denied' ? (
          <div style={{ fontSize: 12, color: S.amber, lineHeight: 1.6 }}>
            🚫 Bloqueaste las notificaciones. Para activarlas ve a la configuración de tu navegador y permite notificaciones para este sitio.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>
                {notifStatus === 'granted' ? '🔔 Activadas' : '🔕 Desactivadas'}
              </div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                {notifStatus === 'granted'
                  ? 'Recibirás alertas cuando tus lotes se acerquen a cosecha'
                  : 'Actívalas para recibir alertas de cosecha en tu celular'}
              </div>
            </div>
            <button
              style={{
                ...btnPrimary,
                background: notifStatus === 'granted' ? 'rgba(148,163,184,0.15)' : undefined,
                color: notifStatus === 'granted' ? S.muted : '#fff',
                border: notifStatus === 'granted' ? `1px solid ${S.border}` : 'none',
                opacity: notifLoading ? 0.6 : 1,
                flexShrink: 0,
                padding: '8px 16px',
              }}
              disabled={notifLoading}
              onClick={toggleNotifications}
            >
              {notifLoading ? '...' : notifStatus === 'granted' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        )}
        {testMsg && (
          <div style={{ fontSize: 12, marginTop: 10, color: testMsg.startsWith('✅') ? S.emerald : S.amber, fontWeight: 600 }}>
            {testMsg}
          </div>
        )}
        {notifStatus === 'granted' && (
          <div style={{ marginTop: 10 }}>
            <button
              style={{ ...btnOutline, fontSize: 12, padding: '6px 14px', opacity: testLoading ? 0.6 : 1 }}
              disabled={testLoading}
              onClick={sendTestNotif}
            >
              {testLoading ? 'Enviando...' : '🔔 Enviar notificación de prueba'}
            </button>
          </div>
        )}
      </div>

      {/* Herramientas */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Herramientas</div>
        <button
          style={{ ...btnOutline, width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onGuia}
        >
          <span>📋</span><span>Guía Rápida BSF</span>
        </button>
        <button
          style={{ ...btnOutline, width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onLaunchTour}
        >
          <span>🗺️</span><span>Ver guía de la app</span>
        </button>
        <button
          style={{ ...btnDanger, width: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onReset}
        >
          <span>🗑️</span><span>Limpiar mis datos</span>
        </button>
      </div>

      {/* Panel Admin — solo para admins */}
      {session.rol === 'admin' && onGoAdmin && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Administración</div>
          <button
            style={{ background: 'rgba(245,158,11,0.1)', color: S.amber, border: '1.5px solid rgba(245,158,11,0.35)', borderRadius: 8, padding: '10px 16px', width: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            onClick={onGoAdmin}
          >
            <span>🔑</span><span>Panel de Administración</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Spotlight tour ───────────────────────────────────────────────────────────

const TOUR_STEPS = [
  { targetId: 'nav-dashboard',    title: '🏠 Resumen',      desc: 'Tu panel principal. Aquí aparecen alertas automáticas de cosecha, recordatorios activos y el estado general de tu producción en tiempo real.' },
  { targetId: 'nav-lotes',        title: '📦 Mis Lotes',    desc: 'Cada vez que siembras, creas un lote. Dentro del lote puedes registrar alimentaciones y cosechas directamente.' },
  { targetId: 'nav-estadisticas', title: '📊 Estadísticas',  desc: 'Gráficas de producción, ranking de tus mejores lotes, qué sustrato te funciona mejor, y exporta tus datos a Excel.' },
  { targetId: 'nav-perfil',       title: '👤 Mi Perfil',     desc: 'Edita tu nombre, cambia tu foto, actualiza tu contraseña y accede a la Guía Rápida BSF desde un solo lugar.' },
];

function SpotlightTour({ step, onNext, onPrev, onDone }: {
  step: number; onNext: () => void; onPrev: () => void; onDone: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vpW,  setVpW]  = useState(0);
  const [vpH,  setVpH]  = useState(0);
  const current = TOUR_STEPS[step];
  const pad = 10;

  useEffect(() => {
    function measure() {
      setVpW(window.innerWidth); setVpH(window.innerHeight);
      for (const sid of [current.targetId, 'm-' + current.targetId]) {
        const el = document.getElementById(sid);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) { setRect(r); return; }
        }
      }
      setRect(null);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [step, current.targetId]);

  let tip: React.CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };
  if (rect) {
    const canRight = rect.right + 316 < vpW;
    const isBottom = rect.top > vpH * 0.6;
    if (canRight) {
      tip = { left: rect.right + 16, top: Math.max(12, Math.min(rect.top + rect.height / 2, vpH - 280)), transform: 'translateY(-50%)' };
    } else if (isBottom) {
      const l = Math.min(Math.max(rect.left + rect.width / 2 - 150, 12), vpW - 316);
      tip = { left: l, bottom: vpH - rect.top + 14 };
    } else {
      const l = Math.min(Math.max(rect.left + rect.width / 2 - 150, 12), vpW - 316);
      tip = { left: l, top: rect.bottom + 14 };
    }
  }

  return (
    <>
      <svg style={{ position: 'fixed', inset: 0, zIndex: 699, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {rect ? (
          <>
            <defs>
              <mask id="tour-spot">
                <rect width="100%" height="100%" fill="white" />
                <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad * 2} height={rect.height + pad * 2} rx="10" fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-spot)" />
            <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad * 2} height={rect.height + pad * 2} rx="10" fill="none" stroke="#22c55e" strokeWidth="2.5" />
          </>
        ) : (
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" />
        )}
      </svg>
      <div style={{ position: 'fixed', zIndex: 700, width: 300, background: '#152035', border: '1.5px solid rgba(34,197,94,0.4)', borderRadius: 16, padding: '18px 20px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', fontFamily: 'Montserrat, sans-serif', ...tip }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
          Paso {step + 1} de {TOUR_STEPS.length}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: S.text, marginBottom: 8 }}>{current.title}</h3>
        <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, marginBottom: 10 }}>{current.desc}</p>
        <div style={{ fontSize: 11, color: S.emerald, fontWeight: 600, marginBottom: 14 }}>✨ Toca el elemento resaltado para probarlo</div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === step ? S.green : S.border, transition: 'background 0.2s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && <button style={{ ...btnOutline, ...btnSm }} onClick={onPrev}>← Atrás</button>}
          {step < TOUR_STEPS.length - 1
            ? <button style={{ ...btnPrimary, ...btnSm, flex: 1 }} onClick={onNext}>Siguiente →</button>
            : <button style={{ ...btnPrimary, ...btnSm, flex: 1 }} onClick={onDone}>¡Comenzar! 🚀</button>}
        </div>
        <button onClick={onDone} style={{ marginTop: 10, background: 'none', border: 'none', color: S.muted, fontSize: 10, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', width: '100%', textAlign: 'center', textDecoration: 'underline' }}>
          Saltar tour
        </button>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SociosInner() {
  const db = useSocios();
  const searchParams = useSearchParams();
  const invParam   = searchParams.get('inv')?.toUpperCase() ?? undefined;
  const resetParam = searchParams.get('reset') ?? undefined;
  const [authMode, setAuthMode] = useState<'login' | 'register'>(invParam ? 'register' : 'login');
  const [view,        setView]        = useState<View>('dashboard');
  const [detailLoteId, setDetailLoteId] = useState<string | null>(null);
  const [showOnboarding,   setShowOnboarding]   = useState(false);
  const [onboardingStep,   setOnboardingStep]   = useState(0);
  const [tourMinimized,    setTourMinimized]    = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting,        setResetting]        = useState(false);
  const [anuncio,          setAnuncio]          = useState<string | null>(null);

  const [sidebarAvatar, setSidebarAvatar] = useState<string | null>(null);

  const [modalLote,    setModalLote]    = useState(false);
  const [modalFeed,    setModalFeed]    = useState(false);
  const [modalCosecha, setModalCosecha] = useState(false);
  const [prefillLoteId, setPrefillLoteId] = useState<string | null>(null);

  const [loteError,     setLoteError]     = useState('');
  const [feedError,     setFeedError]     = useState('');
  const [cosechaError,  setCosechaError]  = useState('');
  const [editLoteError, setEditLoteError] = useState('');
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState('');

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2000); }

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

  async function changePassword(current: string, nueva: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/socios/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: db.session?.code, currentPassword: current, newPassword: nueva }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { ok: false, error: data.error };
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de conexión' };
    }
  }

  useEffect(() => {
    if (db.session && !localStorage.getItem('prl-onboarding-done')) {
      setShowOnboarding(true);
    }
    if (db.session) {
      fetch('/api/anuncios/obtener').then(r => r.json()).then(d => { if (d.anuncio) setAnuncio(d.anuncio); }).catch(() => {});
      const saved = localStorage.getItem(`prl-avatar-${db.session.code}`);
      setSidebarAvatar(saved);
    }
  }, [db.session]);

  useEffect(() => {
    function onAvatarChanged(e: Event) {
      setSidebarAvatar((e as CustomEvent<string>).detail);
    }
    window.addEventListener('prl-avatar-changed', onAvatarChanged);
    return () => window.removeEventListener('prl-avatar-changed', onAvatarChanged);
  }, []);

  if (!db.loaded) return null;

  if (resetParam) {
    return <ResetPasswordScreen token={resetParam} onDone={() => { window.history.replaceState({}, '', '/socios'); }} />;
  }

  if (!db.session) {
    if (authMode === 'login') {
      return <LoginScreen onLogin={db.login} onSwitchToRegister={() => setAuthMode('register')} />;
    } else {
      return <RegisterScreen onRegister={(email, nombre, password, inv) => db.register(email, nombre, password, inv)} onSwitchToLogin={() => setAuthMode('login')} invitacionPrevia={invParam} />;
    }
  }

  const detailLote = detailLoteId ? db.lotes.find(l => l.id === detailLoteId) ?? null : null;

  function navTo(v: View) { setView(v); if (showOnboarding) setTourMinimized(true); }
  function viewLote(id: string) { setDetailLoteId(id); setView('lote-detail'); }
  function openFeed(loteId: string | null) { setPrefillLoteId(loteId); setModalFeed(true); }

  async function saveLote() {
    const nombre = lNombre.current?.value.trim() ?? '';
    const fecha  = lFecha.current?.value ?? '';
    if (!nombre || !fecha) { setLoteError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await db.addLote({
      nombre, fecha,
      objetivo:     lObjetivo,
      sustrato:     parseFloat(lSustrato.current?.value ?? '0') || 0,
      tipoSustrato: lTipoSust.current?.value ?? '',
      huevos:       lHuevos.current?.value ?? '',
      temp:         lTemp.current?.value ? parseFloat(lTemp.current.value) : null,
      notas:        lNotas.current?.value ?? '',
    });
    setSaving(false);
    setLoteError('');
    setModalLote(false);
    setLObjetivo('cosechar');
    if (lNombre.current)   lNombre.current.value   = '';
    if (lSustrato.current) lSustrato.current.value = '';
    if (lHuevos.current)   lHuevos.current.value   = '';
    if (lTemp.current)     lTemp.current.value      = '';
    if (lNotas.current)    lNotas.current.value     = '';
    showToast('✅ Lote guardado');
  }

  async function saveEditLote() {
    if (!editLoteId) return;
    const nombre = editNombre.trim();
    if (!nombre || !editFecha) { setEditLoteError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await db.updateLote(editLoteId, { nombre, fecha: editFecha });
    setSaving(false);
    setEditLoteError('');
    setEditLoteId(null);
    showToast('✅ Lote actualizado');
  }

  async function saveFeed() {
    const loteId   = fLote.current?.value ?? '';
    const cantidad = parseFloat(fCantidad.current?.value ?? '0');
    if (!loteId || !cantidad) { setFeedError('Selecciona un lote e ingresa la cantidad.'); return; }
    setSaving(true);
    await db.addFeed({
      loteId, cantidad,
      fecha:    fFecha.current?.value ?? new Date().toISOString(),
      tipo:     fTipo.current?.value ?? '',
      rechazo:  (fRechazo.current?.value ?? 'ninguno') as FeedLog['rechazo'],
      notas:    fNotas.current?.value ?? '',
    });
    setSaving(false);
    setFeedError('');
    setModalFeed(false);
    if (fCantidad.current) fCantidad.current.value = '';
    if (fNotas.current)    fNotas.current.value    = '';
    showToast('✅ Alimentación registrada');
  }

  async function saveCosecha() {
    const loteId = cLote.current?.value ?? '';
    const peso   = parseFloat(cPeso.current?.value ?? '0');
    if (!loteId || !peso) { setCosechaError('Selecciona un lote e ingresa el peso.'); return; }
    setSaving(true);
    await db.addCosecha({
      loteId, peso,
      fecha:         cFecha.current?.value ?? todayLocal(),
      sustratoTotal: parseFloat(cSustTotal.current?.value ?? '0') || 0,
      calidad:       (cCalidad.current?.value ?? 'buena') as Cosecha['calidad'],
      notas:         cNotas.current?.value ?? '',
    });
    setSaving(false);
    setCosechaError('');
    setModalCosecha(false);
    if (cPeso.current)      cPeso.current.value      = '';
    if (cSustTotal.current) cSustTotal.current.value = '';
    if (cNotas.current)     cNotas.current.value     = '';
    showToast('✅ Cosecha registrada');
  }

  const navItems: { key: View; icon: string; label: string }[] = [
    { key: 'dashboard',    icon: '🏠', label: 'Resumen' },
    { key: 'lotes',        icon: '📦', label: 'Mis Lotes' },
    { key: 'ventas',       icon: '💰', label: 'Mis Ventas' },
    { key: 'escuela',      icon: '🎓', label: 'Escuela' },
    { key: 'estadisticas', icon: '📊', label: 'Estadísticas' },
    { key: 'perfil',       icon: '👤', label: 'Mi Perfil' },
  ];

  const activeView = view === 'lote-detail' ? 'lotes' : view === 'cosecha' ? 'lotes' : view;

  return (
    <div className="socios-wrap" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="socios-sidebar" style={{ width: 220, background: S.navy2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', zIndex: 40 }}>
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
              <div id={`nav-${item.key}`} key={item.key} onClick={() => navTo(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: active ? S.green2 : S.muted, background: active ? 'rgba(34,197,94,0.1)' : 'transparent', borderRadius: active ? 8 : 0, transition: 'all 0.15s' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '14px 18px', borderTop: `1px solid ${S.border}` }}>
          <button onClick={() => navTo('perfil')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left' }}>
            {sidebarAvatar
              ? <img src={sidebarAvatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(34,197,94,0.4)', flexShrink: 0 }} />
              : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                  {db.session.name[0]}
                </div>
            }
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{db.session.name}</div>
              <div style={{ fontSize: 10, color: S.muted }}>{db.session.code}</div>
            </div>
          </button>
          <button onClick={db.logout} style={{ ...btnOutline, width: '100%', fontSize: 12, padding: '7px' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="socios-main" style={{ flex: 1, minWidth: 0 }}>
        {db.session.code === 'DEMO' && (
          <div style={{ position: 'sticky', top: 0, zIndex: 90, background: 'rgba(180,110,0,0.97)', backdropFilter: 'blur(8px)', padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>👀</span>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: '#fff8e1', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em' }}>MODO DEMO</span>
                <span style={{ color: 'rgba(255,248,225,0.7)', fontSize: 11, marginLeft: 8, display: 'inline' }}> · Nada se guarda en el servidor</span>
              </div>
            </div>
            <button
              onClick={db.logout}
              style={{ background: 'rgba(0,0,0,0.2)', color: '#fff8e1', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Montserrat, sans-serif' }}
            >
              Salir del demo
            </button>
          </div>
        )}
        <div className="socios-content">
        {view === 'dashboard' && (
          <Dashboard
            lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas}
            activeLotes={db.activeLotes} readyLotes={db.readyLotes}
            recordatorios={db.recordatorios}
            totalKg={db.totalKg} avgConv={db.avgConv}
            userName={db.session.name}
            anuncio={anuncio}
            sinEmail={db.session.code !== 'DEMO' && !db.session.email}
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
            cosechas={db.cosechas}
            recordatorios={db.recordatorios} fotos={db.fotos}
            onBack={() => setView('lotes')} onAddFeed={openFeed}
            onEdit={() => { setEditNombre(detailLote.nombre); setEditFecha(detailLote.fecha); setEditLoteId(detailLote.id); }}
            onAddRecordatorio={db.addRecordatorio}
            onToggleRecordatorio={db.toggleRecordatorio}
            onDeleteRecordatorio={db.deleteRecordatorio}
            onAddFoto={db.addFoto}
            onDeleteFoto={db.deleteFoto}
            onNewCosecha={() => { setModalCosecha(true); setTimeout(() => { if (cFecha.current) cFecha.current.value = todayLocal(); }, 10); }}
          />
        )}
        {view === 'ventas' && (
          <VentasView
            ventas={db.ventasSocios}
            onAdd={db.addVentaSocio}
            onDelete={db.deleteVentaSocio}
          />
        )}
        {view === 'guia'  && <GuiaView />}
        {view === 'escuela' && db.session && (
          <EscuelaView
            socioCode={db.session.code}
            socioNombre={db.session.name}
            isAdmin={db.session.rol === 'admin'}
          />
        )}
        {view === 'estadisticas' && (
          <EstadisticasView
            lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas}
            totalKg={db.totalKg} avgConv={db.avgConv}
          />
        )}
        {view === 'perfil' && db.session && (
          <PerfilView
            session={db.session}
            lotes={db.lotes}
            feeds={db.feeds}
            cosechas={db.cosechas}
            totalKg={db.totalKg}
            onUpdateName={db.updateName}
            onUpdateEmail={db.updateEmail}
            onChangePassword={changePassword}
            onLaunchTour={() => {
              localStorage.removeItem('prl-onboarding-done');
              setOnboardingStep(0);
              setTourMinimized(false);
              setShowOnboarding(true);
              navTo('dashboard');
            }}
            onReset={() => setShowResetConfirm(true)}
            onGuia={() => navTo('guia')}
            onGoAdmin={db.session.rol === 'admin' ? () => navTo('admin') : undefined}
          />
        )}
        {view === 'admin' && db.session.rol === 'admin' && <AdminView adminCode={db.session.code} onBack={() => navTo('perfil')} onLogout={db.logout} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="socios-mobile-nav">
        {navItems.map(item => {
          const active = activeView === item.key;
          const mobileLabel: Record<string, string> = {
            dashboard: 'Inicio', lotes: 'Lotes',
            ventas: 'Ventas', escuela: 'Escuela',
            estadisticas: 'Stats', perfil: 'Perfil', admin: 'Admin',
          };
          return (
            <div id={`m-nav-${item.key}`} key={item.key} onClick={() => navTo(item.key)} className={`socios-tab${active ? ' socios-tab-active' : ''}`}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{mobileLabel[item.key] ?? item.label}</span>
            </div>
          );
        })}
      </nav>

      <style>{`
        .socios-mobile-nav { display: none; }
        .socios-content { padding: 2rem; }
        @media (max-width: 768px) {
          .socios-wrap { display: block !important; }
          .socios-sidebar { display: none !important; }
          .socios-main { padding: 0 !important; }
          .socios-content { padding: 1rem 1rem 80px !important; }
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
            min-width: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            padding: 4px 2px;
            cursor: pointer;
            color: #64748b;
            font-family: Montserrat, sans-serif;
          }
          .socios-tab span:first-child { font-size: 18px; line-height: 1; }
          .socios-tab span:last-child { font-size: 8px; font-weight: 700; text-align: center; line-height: 1.2; white-space: nowrap; }
          .socios-tab-active { color: #4ade80 !important; }
        }
      `}</style>

      {/* Modal: Nuevo Lote */}
      <Modal open={modalLote} onClose={() => { setModalLote(false); setLObjetivo('cosechar'); setLoteError(''); }} title="📦 Nuevo Lote BSF">
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
        {loteError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{loteError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalLote(false); setLoteError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveLote} disabled={saving}>{saving ? 'Guardando...' : 'Guardar lote'}</button>
        </div>
      </Modal>

      {/* Modal: Alimentación */}
      <Modal key={prefillLoteId ?? 'none'} open={modalFeed} onClose={() => { setModalFeed(false); setFeedError(''); }} title="🌿 Registrar Alimentación">
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
        {feedError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{feedError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalFeed(false); setFeedError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveFeed} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </Modal>

      {/* Modal: Editar Lote */}
      <Modal open={editLoteId !== null} onClose={() => { setEditLoteId(null); setEditLoteError(''); }} title="✏️ Editar Lote">
        <Field label="Nombre / código del lote">
          <input style={inputStyle} value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="ej. Lote-07 Julio" />
        </Field>
        <Field label="Fecha de siembra">
          <input type="date" style={inputStyle} value={editFecha} onChange={e => setEditFecha(e.target.value)} />
        </Field>
        {editLoteError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{editLoteError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setEditLoteId(null); setEditLoteError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveEditLote} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </Modal>

      {/* Spotlight tour */}
      {showOnboarding && !tourMinimized && (
        <SpotlightTour
          step={onboardingStep}
          onNext={() => setOnboardingStep(s => s + 1)}
          onPrev={() => setOnboardingStep(s => s - 1)}
          onDone={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }}
        />
      )}
      {showOnboarding && tourMinimized && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 700, background: '#152035', border: '1.5px solid rgba(34,197,94,0.35)', borderRadius: 50, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 12, color: S.muted }}>🪲 Explorando · Paso {onboardingStep + 1}/{TOUR_STEPS.length}</span>
          <button style={{ ...btnPrimary, ...btnSm }} onClick={() => setTourMinimized(false)}>Ver guía</button>
          {onboardingStep < TOUR_STEPS.length - 1
            ? <button style={{ ...btnPrimary, ...btnSm }} onClick={() => { setOnboardingStep(s => s + 1); setTourMinimized(false); }}>Siguiente →</button>
            : <button style={{ ...btnPrimary, ...btnSm }} onClick={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }}>¡Listo! 🚀</button>
          }
          <button onClick={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 14, cursor: 'pointer', padding: '0 2px' }}>✕</button>
        </div>
      )}

      {/* Toast global */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#22c55e', color: '#0d1b2a', padding: '10px 22px', borderRadius: 50, fontWeight: 700, fontSize: 13, fontFamily: 'Montserrat, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      {/* Modal: Confirmar reset de datos */}
      <Modal open={showResetConfirm} onClose={() => !resetting && setShowResetConfirm(false)} title="🗑️ Limpiar mis datos">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, color: S.text, lineHeight: 1.6, marginBottom: 8 }}>
            Esto borrará <strong>todos tus lotes, alimentaciones, cosechas, recordatorios y fotos</strong> de manera permanente.
          </p>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.5, marginBottom: 20 }}>
            Tu cuenta y contraseña se mantienen intactos. Útil para empezar desde cero sin crear un usuario nuevo.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button style={btnOutline} onClick={() => setShowResetConfirm(false)} disabled={resetting}>Cancelar</button>
            <button
              style={{ ...btnDanger, padding: '10px 22px', fontSize: 13, opacity: resetting ? 0.6 : 1, cursor: resetting ? 'not-allowed' : 'pointer' }}
              disabled={resetting}
              onClick={async () => {
                setResetting(true);
                await db.resetAllData();
                localStorage.removeItem('prl-onboarding-done');
                setResetting(false);
                setShowResetConfirm(false);
                setOnboardingStep(0);
                setShowOnboarding(true);
                setView('dashboard');
              }}
            >
              {resetting ? 'Limpiando...' : 'Sí, limpiar todo'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Cosecha */}
      <Modal open={modalCosecha} onClose={() => { setModalCosecha(false); setCosechaError(''); }} title="⚖️ Registrar Cosecha">
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
        {cosechaError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{cosechaError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalCosecha(false); setCosechaError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveCosecha} disabled={saving}>{saving ? 'Guardando...' : 'Registrar cosecha'}</button>
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

