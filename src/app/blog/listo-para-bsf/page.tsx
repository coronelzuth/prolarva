'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0d1b2a', deep: '#0a1628', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', text: '#e2e8f0', text2: '#f1f5f9',
  muted: '#94a3b8', muted2: '#64748b', red: '#ef4444', amber: '#f59e0b',
  blue: '#3b82f6', blueL: '#60a5fa',
};

const PREGUNTAS = [
  {
    q: '¿En qué clima vives la mayor parte del año?',
    ops: [
      { label: 'Caliente todo el año (más de 24°C)', pts: 2 },
      { label: 'Templado, con épocas cálidas', pts: 1 },
      { label: 'Frío la mayor parte del tiempo', pts: 0 },
    ],
  },
  {
    q: '¿Cuánto espacio tienes disponible para el sistema BSF?',
    ops: [
      { label: 'Más de 4 m² (ej: un cuarto del galpón)', pts: 2 },
      { label: 'Entre 1 y 4 m² (ej: un rincón techado)', pts: 1 },
      { label: 'Menos de 1 m² o ninguno todavía', pts: 0 },
    ],
  },
  {
    q: '¿Tienes acceso regular a residuos orgánicos para alimentar las larvas?',
    ops: [
      { label: 'Sí: sobrados de cocina + estiércol del galpón', pts: 2 },
      { label: 'Solo residuos de cocina, pocos', pts: 1 },
      { label: 'No tengo acceso regular', pts: 0 },
    ],
  },
  {
    q: '¿Cuánto tiempo semanal puedes dedicar al sistema?',
    ops: [
      { label: '3 horas o más a la semana', pts: 2 },
      { label: 'Entre 1 y 2 horas a la semana', pts: 1 },
      { label: 'Menos de 1 hora, tengo poco tiempo', pts: 0 },
    ],
  },
  {
    q: '¿Ya tienes animales a los que darles la larva?',
    ops: [
      { label: 'Sí, más de 20 animales activos', pts: 2 },
      { label: 'Sí, menos de 20 o estoy por conseguirlos', pts: 1 },
      { label: 'Todavía no tengo animales', pts: 0 },
    ],
  },
  {
    q: '¿Cuánto puedes invertir para arrancar?',
    ops: [
      { label: 'Más de $200.000 COP (~$48 USD)', pts: 2 },
      { label: 'Entre $100.000 y $200.000 COP', pts: 1 },
      { label: 'Menos de $100.000 COP por ahora', pts: 0 },
    ],
  },
];

type Nivel = 'listo' | 'casi' | 'prepara';

function getNivel(score: number): Nivel {
  if (score >= 9) return 'listo';
  if (score >= 5) return 'casi';
  return 'prepara';
}

const NIVELES = {
  listo: {
    label: '¡Estás listo para empezar!',
    emoji: '🟢',
    color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.08)',
    colorBorder: 'rgba(34,197,94,0.25)',
    desc: 'Tienes las condiciones básicas para arrancar una colonia BSF desde ya. El siguiente paso es conseguir tu semilla y montar el sistema. El Programa Colonia te lleva de cero a producción en 5 semanas.',
    waMsg: 'Hola Juliana! Hice el test y me salió que estoy listo para empezar BSF. Quiero saber más del Programa Colonia.',
  },
  casi: {
    label: 'Casi listo — te falta poco',
    emoji: '🟡',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.25)',
    desc: 'Tienes lo esencial pero hay uno o dos puntos por afinar antes de arrancar. Con una buena guía puedes resolver eso en semanas. En Colonia empezamos por diagnosticar exactamente qué ajustar en tu caso.',
    waMsg: 'Hola Juliana! Hice el test de preparación BSF y me salió "casi listo". Tengo algunas dudas sobre si mis condiciones son suficientes para arrancar.',
  },
  prepara: {
    label: 'Aún no es el momento — prepárate primero',
    emoji: '🔴',
    color: '#ef4444',
    colorBg: 'rgba(239,68,68,0.08)',
    colorBorder: 'rgba(239,68,68,0.25)',
    desc: 'Todavía hay condiciones clave que resolver (clima, espacio, residuos o inversión inicial). Pero eso no significa que no puedas llegar ahí. En Colonia empezamos por ayudarte a diseñar un plan realista para tu situación.',
    waMsg: 'Hola Juliana! Hice el test de preparación BSF y aún me falta mejorar algunas condiciones. ¿Me puedes orientar sobre por dónde arrancar?',
  },
};

export default function ListoParaBsfPage() {
  const [respuestas, setRespuestas] = useState<number[]>(Array(PREGUNTAS.length).fill(-1));
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'listo-para-bsf' }),
    });
  }, []);

  function seleccionar(pregIdx: number, pts: number) {
    setRespuestas(prev => {
      const next = [...prev];
      next[pregIdx] = pts;
      return next;
    });
    setMostrarResultado(false);
  }

  const score = respuestas.reduce((s, r) => s + (r >= 0 ? r : 0), 0);
  const respondidas = respuestas.filter(r => r >= 0).length;
  const completo = respondidas === PREGUNTAS.length;
  const nivel = getNivel(score);
  const n = NIVELES[nivel];

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 100%)`,
        borderBottom: '1px solid rgba(59,130,246,0.2)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Link href="/blog" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            ← Blog
          </Link>
          <div style={{
            display: 'inline-block', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
            color: C.blueL, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 20, marginBottom: 18,
          }}>
            Test de diagnóstico
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: C.text2, lineHeight: 1.2, margin: '0 0 14px' }}>
            ¿Estás <span style={{ color: C.blueL }}>listo</span> para empezar a criar larva BSF?
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            6 preguntas rápidas sobre tu situación real. Resultado inmediato con recomendación personalizada.
          </p>
        </div>
      </div>

      {/* PREGUNTAS */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '36px 20px 80px' }}>

        {PREGUNTAS.map((p, pi) => {
          const sel = respuestas[pi];
          return (
            <div key={pi} style={{
              marginBottom: 28,
              background: C.card, borderRadius: 16,
              border: sel >= 0 ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700, color: C.blueL,
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                  padding: '2px 10px', borderRadius: 10, marginBottom: 10,
                }}>
                  {pi + 1} de {PREGUNTAS.length}
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text2, lineHeight: 1.4 }}>{p.q}</div>
              </div>
              <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.ops.map((op, oi) => {
                  const active = sel === op.pts && respuestas[pi] !== -1;
                  // En caso de que haya opciones con mismos pts, usamos índice
                  const isSelected = sel === op.pts && respuestas[pi] !== -1;
                  return (
                    <button
                      key={oi}
                      onClick={() => seleccionar(pi, op.pts)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: isSelected ? '1.5px solid rgba(59,130,246,0.6)' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? C.text2 : C.muted, fontSize: 14,
                        fontWeight: isSelected ? 700 : 400, transition: 'all 0.15s',
                      }}
                    >
                      {isSelected ? '✓ ' : ''}{op.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Barra de progreso */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted2, marginBottom: 8 }}>
            <span>{respondidas} de {PREGUNTAS.length} respondidas</span>
            {completo && <span style={{ color: C.green }}>✓ Completo</span>}
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
            <div style={{
              height: '100%', borderRadius: 4, background: C.blue,
              width: `${(respondidas / PREGUNTAS.length) * 100}%`, transition: 'width 0.3s',
            }} />
          </div>
        </div>

        <button
          onClick={() => setMostrarResultado(true)}
          disabled={!completo}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, border: 'none',
            cursor: completo ? 'pointer' : 'not-allowed',
            background: completo ? C.blue : 'rgba(255,255,255,0.07)',
            color: completo ? '#fff' : C.muted2, transition: 'all 0.2s', marginBottom: 32,
          }}
        >
          Ver mi diagnóstico →
        </button>

        {/* RESULTADO */}
        {mostrarResultado && completo && (
          <div style={{
            background: n.colorBg, border: `1px solid ${n.colorBorder}`,
            borderRadius: 20, padding: '28px 24px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{n.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: n.color, marginBottom: 12 }}>{n.label}</div>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65, margin: '0 0 24px' }}>{n.desc}</p>

            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 16, padding: '20px',
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text2, marginBottom: 16 }}>
                El Programa Colonia empieza donde estás tú
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/colonia" style={{
                  flex: 1, minWidth: 150, padding: '13px 20px', borderRadius: 12, textAlign: 'center',
                  background: C.green, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
                }}>
                  Ver Programa Colonia
                </Link>
                <a
                  href={`https://wa.me/573223212293?text=${encodeURIComponent(n.waMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, minWidth: 150, padding: '13px 20px', borderRadius: 12, textAlign: 'center',
                    background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
                  }}
                >
                  💬 Hablar con Juliana
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
