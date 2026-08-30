'use client';
import { useState, useEffect, useRef } from 'react';
import type { TipoDia } from '@/hooks/useEscuela';

// ─── Re-exportar tipos del hook ──────────────────────────────────────────────
export type { TipoDia };
export type EscuelaSub = 'clase' | 'plantillas' | 'tarea' | 'foro' | 'progreso' | 'directorio' | 'cronograma' | 'metas' | 'preguntas';

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
  { num: 1, emoji: '🌱', title: 'Conoce tu Mosca Soldado Negra',
    dias: [
      { titulo: 'Conoce tu Mosca Soldado Negra', desc: 'El ciclo completo en 5 etapas, cómo reconocer tu larva y distinguirla de la mosca común, y las señales de una colonia sana.' },
      { titulo: 'Preguntas y Respuestas', desc: 'Sesión en vivo para resolver las dudas de la Cajita de Preguntas y revisar tus primeras observaciones.' },
    ],
    items: ['El ciclo completo de la BSF en 5 etapas, sin tecnicismos', 'Cómo reconocer tu larva y no confundirla con la mosca común', 'Señales de una colonia sana y la luz como herramienta', 'El punto de cosecha: gorda y clara, antes de que se oscurezca'] },
  { num: 2, emoji: '🐛', title: 'Manejo y Cría',
    dias: [
      { titulo: 'Manejo y Cría', desc: 'Qué darle de comer y cuánto sin ahogar el sustrato, cómo mantener humedad y temperatura, y cómo prevenir plagas y malos olores.' },
      { titulo: 'Preguntas y Respuestas', desc: 'Resolvemos las dudas de la semana y ajustamos la alimentación según cómo va tu lote.' },
    ],
    items: ['Qué comen: residuos triturados como papilla + purina los primeros 8 días', 'Cuánto darles: la prueba del puñado y la regla del peso', 'Humedad, temperatura y oscuridad sin equipos especiales', 'Plagas y malos olores: cómo prevenirlos desde la comida'] },
  { num: 3, emoji: '⚖️', title: 'Cosecha y Uso',
    dias: [
      { titulo: 'Cosecha y Uso', desc: 'Cuándo cosechar (la señal exacta), cómo separar la larva del sustrato, los 3 formatos de entrega y cuánta larva darle a cada animal.' },
      { titulo: 'Preguntas y Respuestas', desc: 'Dudas de la cosecha y ajuste del proceso según tus resultados y tus animales.' },
    ],
    items: ['La señal de cosecha: cuando ~5% de las larvas se ven oscuras', 'Separar con tamiz o con luz, lavar, pesar y registrar', 'Los 3 formatos: larva viva, seca y harina — cuál para cada animal', 'Reemplazar del 10% al 25% del concentrado y calcular el ahorro'] },
  { num: 4, emoji: '🔄', title: 'Cerrar el Ciclo',
    dias: [
      { titulo: 'Cerrar el Ciclo', desc: 'Guardar prepupas para reproducción, montar la jaula de adultos y la trampa de puesta, y recoger tus propios huevos para no volver a comprar pie de cría.' },
      { titulo: 'Preguntas y Respuestas', desc: 'Dudas del reinicio del ciclo y revisión final del sistema que montaste.' },
    ],
    items: ['Apartar el 15–20% de la camada y ponerla a pupar en cama seca', 'La jaula de adultos: sol directo y volumen de moscas', 'La trampa de puesta: cebo frutal + tablas apiladas', 'El ciclo cerrado: 1 gramo de huevo alcanza para una bandeja'] },
  { num: 5, emoji: '💰', title: 'Monitoreo, Venta y tu Marca',
    dias: [
      { titulo: 'Monitoreo, Venta y tu Marca', desc: 'Diagnosticar tu colonia en 5 minutos, leer tus números, ponerle precio a tu excedente y publicar tu primer contenido. Más la sorpresa.' },
      { titulo: 'Preguntas y Respuestas + Cierre', desc: 'Últimas dudas, revisión de avances del grupo y el paso siguiente de la red de productores.' },
    ],
    items: ['Diagnóstico rápido de colonia y los 6 problemas típicos', 'Tus 4 números: conversión, kg/semana, mortalidad y ahorro', 'Vender tu excedente: a quién, a cuánto y cómo presentarlo', 'Documentar con el celular y entrar a la red de productores'] },
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
  ctx.fillText('Programa Colonia · 5 Semanas de Clases en Vivo BSF', 600, 232);

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

  const filename = `certificado-prolarva-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`;

  canvas.toBlob(blob => {
    if (!blob) {
      // fallback extremo: abrir el dataURL en pestaña nueva
      window.open(canvas.toDataURL('image/png'), '_blank');
      return;
    }

    // 1. Web Share con archivo — la vía que funciona en móvil / PWA (Android)
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      nav.share?.({ files: [file], title: 'Mi certificado ProLarva' }).catch(() => {});
      return;
    }

    // 2. Descarga normal (desktop) vía blob URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }, 'image/png');
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
