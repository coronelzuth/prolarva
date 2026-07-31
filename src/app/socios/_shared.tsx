'use client';
import React from 'react';
import { useState } from 'react';
import { BSF_STAGES, daysSince, getStage, type Lote, type FeedLog, type Cosecha } from '@/hooks/useSocios';

export type View = 'dashboard' | 'monitor' | 'lote-detail' | 'cosecha' | 'guia' | 'admin' | 'perfil' | 'escuela' | 'ventas';

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
export {
  comprimirImagen, fmtDate, fmtDateTime, nowLocal, todayLocal, RESIDUO_ICONS,
  S, inputStyle, labelStyle, cardStyle, btnPrimary, btnOutline, btnDanger, btnSm,
  Badge, Field, ProgressBar, EmptyState, Modal,
  Timeline, CAL_MONTHS, CAL_DAYS, CalendarMonth, MiniCalendar,
  downloadCSV, generarImagenMes, BarChart, LineChart,
  FeedEntry, CosechaEntry,
};