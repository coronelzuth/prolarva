'use client';
import { useState, useEffect, useRef } from 'react';
import type { TipoDia } from '@/hooks/useEscuela';

// ─── Re-exportar tipos del hook ──────────────────────────────────────────────
export type { TipoDia };
export type EscuelaSub = 'clase' | 'plantillas' | 'tarea' | 'foro' | 'progreso' | 'directorio' | 'cronograma' | 'metas';

// ─── Paleta ──────────────────────────────────────────────────────────────────
export const S = {
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
};

// ─── Estilos comunes ──────────────────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 8,
  border: `1.5px solid rgba(34,197,94,0.25)`, background: S.navy,
  color: S.text, fontFamily: 'Montserrat, sans-serif', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};
export const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: S.muted,
  marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase',
};
export const btnPrimary: React.CSSProperties = {
  background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff',
  border: 'none', borderRadius: 8, padding: '9px 20px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
};
export const btnOutline: React.CSSProperties = {
  background: 'transparent', color: S.muted,
  border: `1.5px solid rgba(34,197,94,0.25)`, borderRadius: 8, padding: '7px 14px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer',
};
export const btnDanger: React.CSSProperties = {
  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
  border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 10px',
  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, cursor: 'pointer',
};

// ─── Contenido por semana ────────────────────────────────────────────────────
export const SEMANAS_INFO = [
  { num: 1, emoji: '🌱', title: 'Mentalidad y Uso de la App',
    dias: [
      { titulo: 'Mentalidad y Uso de la App', desc: 'Cómo aprovechar la app, tu espacio en la comunidad y la mentalidad para arrancar tu primera colonia BSF sin errores.' },
      { titulo: 'Bases del Sistema', desc: 'El ciclo completo de la BSF explicado sin tecnicismos. Qué espacio necesitas, materiales que ya tienes y cómo activar tu primera semilla.' },
    ],
    items: ['El ciclo completo de la BSF explicado sin tecnicismos', 'Qué espacio necesitas (desde 1 m²)', 'Materiales que ya tienes vs. los que consigues local', 'Cómo activar tu primera semilla correctamente'] },
  { num: 2, emoji: '🐛', title: 'Manejo del Lote',
    dias: [
      { titulo: 'Manejo del Lote', desc: 'Alimentación diaria: qué darles, cuánto y cuándo. Control de temperatura y humedad sin equipos especiales.' },
      { titulo: 'Preguntas y Respuestas + Avances', desc: 'Sesión en vivo para resolver dudas del grupo, compartir avances y ajustar lo que sea necesario.' },
    ],
    items: ['Alimentación diaria: qué darles, cuánto y cuándo', 'Control de temperatura y humedad sin equipos especiales', 'Cómo leer el estado de las larvas en cada etapa', 'Qué hacer si algo sale diferente a lo esperado'] },
  { num: 3, emoji: '⚖️', title: 'Cosecha y Uso',
    dias: [
      { titulo: 'Cosecha y Uso', desc: 'Cuándo y cómo cosechar (señales exactas). Larva viva, seca y harina — cuál usar y cuándo.' },
      { titulo: 'Preguntas y Respuestas', desc: 'Sesión en vivo para resolver dudas de la cosecha y ajustar el proceso según tus resultados.' },
    ],
    items: ['Cuándo y cómo cosechar (señales exactas)', 'Larva viva, larva seca y harina — cuál usar y cuándo', 'Raciones por especie: pollos, peces y cerdos', 'Cómo documentar tus resultados y calcular el ahorro real'] },
  { num: 4, emoji: '🔄', title: 'Ciclo Cerrado',
    dias: [
      { titulo: 'Ciclo Cerrado', desc: 'Cómo generar tu propia semilla. Montaje de trampas de oviposición y plan de sostenibilidad.' },
      { titulo: 'Manejo de Huevos y Neonatos', desc: 'Cómo identificar, cuidar y trasladar huevos y larvas neonatas para mantener el ciclo activo.' },
    ],
    items: ['Cómo generar tu propia semilla sin comprar más', 'Montaje de trampas de oviposición', 'Plan de sostenibilidad: cómo mantener el sistema activo solo', 'Preguntas finales + revisión de avances del grupo'] },
  { num: 5, emoji: '💰', title: 'Comercialización y Subproductos',
    dias: [
      { titulo: 'Comercialización', desc: 'Cómo vender tu larva y a quién: canales locales y digitales. Compost y abono de BSFL: cómo procesarlo, presentarlo y ponerle precio.' },
      { titulo: 'Manejo de Redes Sociales', desc: 'Cómo usar redes para posicionarte como productor BSF y atraer compradores locales.' },
    ],
    items: ['Cómo vender tu larva y a quién: canales locales y digitales', 'Manejo de redes sociales para productores BSF', 'Compost y abono de BSFL: cómo procesarlo y usarlo', 'De subproducto a ingreso extra: precio y presentación del abono'] },
];

// ─── TIPO_META ────────────────────────────────────────────────────────────────
export const TIPO_META: Record<TipoDia, { emoji: string; label: string; color: string }> = {
  clase:   { emoji: '🎥', label: 'Clase en vivo', color: '#22c55e' },
  tarea:   { emoji: '📝', label: 'Tarea',          color: '#f59e0b' },
  reporte: { emoji: '📊', label: 'Reporte',        color: '#0ea5e9' },
  recurso: { emoji: '📄', label: 'Recurso',        color: '#a78bfa' },
  libre:   { emoji: '🗓️', label: 'Actividad libre', color: '#64748b' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)     return 'ahora';
  if (diff < 3600)   return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400)  return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

export function fmtFecha(dateStr: string): { dia: string; mes: string; diaSem: string } {
  const d = new Date(dateStr + 'T12:00:00');
  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return { diaSem: dias[d.getDay()], dia: String(d.getDate()), mes: meses[d.getMonth()] };
}

export function esHoy(dateStr: string): boolean {
  const hoy = new Date();
  const d = new Date(dateStr + 'T12:00:00');
  return d.getFullYear() === hoy.getFullYear() && d.getMonth() === hoy.getMonth() && d.getDate() === hoy.getDate();
}

export function esPasado(dateStr: string): boolean {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  return new Date(dateStr + 'T00:00:00') < hoy;
}

// ─── Countdown ────────────────────────────────────────────────────────────────
export function useCountdown(target: string | null) {
  const [diff, setDiff] = useState<number | null>(null);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!target) { setDiff(null); return; }
    const tick = () => setDiff(new Date(target).getTime() - Date.now());
    tick();
    ref.current = setInterval(tick, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target]);
  return diff;
}

export function fmtCountdown(ms: number) {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

// ─── descargarCertificado ─────────────────────────────────────────────────────
export function descargarCertificado(nombre: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, 1200, 800);

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 1160, 760);
  ctx.strokeStyle = 'rgba(34,197,94,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, 1136, 736);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.fillText('✦  PROLARVA  ✦', 600, 78);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 46px Georgia, serif';
  ctx.fillText('Certificado de Completación', 600, 178);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px Arial, sans-serif';
  ctx.fillText('Programa Colonia · 4 Semanas de Clases en Vivo BSF', 600, 232);

  ctx.strokeStyle = 'rgba(34,197,94,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 278); ctx.lineTo(1040, 278); ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('Se certifica que', 600, 340);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText(nombre, 600, 430);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '19px Arial, sans-serif';
  ctx.fillText('ha completado exitosamente el Programa Colonia de ProLarva', 600, 496);
  ctx.font = '15px Arial, sans-serif';
  ctx.fillText('adquiriendo conocimientos prácticos en cría de Larva Soldado Negra (BSF)', 600, 530);

  ctx.beginPath(); ctx.moveTo(160, 590); ctx.lineTo(1040, 590); ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '14px Arial, sans-serif';
  const fecha = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText(fecha, 600, 650);

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillText('prolarva.co', 600, 690);

  const link = document.createElement('a');
  link.download = `certificado-prolarva-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ─── Modal base ───────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
