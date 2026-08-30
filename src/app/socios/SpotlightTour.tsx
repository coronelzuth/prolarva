'use client';
import { useState, useEffect } from 'react';
import { S, btnOutline, btnPrimary, btnSm } from './_shared';

export const TOUR_STEPS = [
  { targetId: 'nav-escuela',   title: '🎓 Empieza aquí', desc: 'Tu Escuela: las clases en vivo, el cronograma de las 5 semanas, el foro del grupo y la Cajita de Preguntas. Cada semana la marcas como lista para avanzar.' },
  { targetId: 'nav-dashboard', title: '🏠 Resumen',      desc: 'La cuenta regresiva a la próxima clase, los anuncios del grupo y —cuando empieces a criar— las alertas de cosecha de tus lotes.' },
  { targetId: 'nav-monitor',   title: '🔬 Monitor',      desc: 'Tu registro de lotes y las estadísticas de conversión. Se abre solo cuando apruebes la Semana 3 — no te preocupes por él todavía.' },
  { targetId: 'nav-perfil',    title: '👤 Mi Perfil',    desc: 'Tu nombre, tu foto, la contraseña y tu ficha para la Red de Productores.' },
];

export function SpotlightTour({ step, onNext, onPrev, onDone }: {
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
