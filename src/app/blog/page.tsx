'use client';

import { useState } from 'react';
import Link from 'next/link';

const C = {
  bg:     '#0d1b2a',
  deep:   '#0a1628',
  card:   '#152035',
  card2:  '#1e3050',
  green:  '#22c55e',
  greenL: '#4ade80',
  text:   '#e2e8f0',
  text2:  '#f1f5f9',
  muted:  '#94a3b8',
  muted2: '#64748b',
  red:    '#ef4444',
  amber:  '#f59e0b',
  blue:   '#3b82f6',
  purple: '#a855f7',
  purpleL: '#c084fc',
};

const CATEGORIES = ['Todos', 'Problemas', 'Nutrición', 'Manejo', 'Negocio', 'Herramientas'] as const;
type Cat = typeof CATEGORIES[number];

const resources = [
  {
    id: 'problemas',
    category: 'Problemas' as Cat,
    emoji: '🔧',
    title: '8 problemas comunes en la cría BSF',
    desc: 'Las preguntas más frecuentes: larvas que no crecen, malos olores, moscas que no ponen. Con solución rápida para cada una.',
    items: '8 problemas',
    readTime: '10 min',
    href: '/blog/problemas',
    date: '2026-07-23',
    accent: C.red,
    accentBg: 'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.2)',
  },
  {
    id: 'raciones',
    category: 'Nutrición' as Cat,
    emoji: '🍽️',
    title: 'Raciones recomendadas por animal y etapa',
    desc: 'Cuánta larva dar según la especie y la etapa de producción. Tablas para pollos, gallinas, cerdos, peces y codornices.',
    items: '5 especies',
    readTime: '5 min',
    href: '/blog/raciones',
    date: '2026-07-23',
    accent: C.green,
    accentBg: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.2)',
  },
  {
    id: 'alimentacion-larvas',
    category: 'Manejo' as Cat,
    emoji: '🌿',
    title: 'Qué comen las larvas BSF y cómo alimentarlas',
    desc: 'Sustratos recomendados, porciones por etapa, qué evitar y cómo subir la proteína de la larva antes de cosechar.',
    items: '4 etapas',
    readTime: '7 min',
    href: '/blog/alimentacion-larvas',
    date: '2026-07-23',
    accent: C.purple,
    accentBg: 'rgba(168,85,247,0.08)',
    accentBorder: 'rgba(168,85,247,0.2)',
  },
  {
    id: 'cuanto-pierdes',
    category: 'Herramientas' as Cat,
    emoji: '💸',
    title: '¿Cuánto te roba el concentrado cada mes?',
    desc: 'Calcula exactamente cuánto gastas y cuánto podrías ahorrar produciendo tu propia larva BSF. Resultado en segundos.',
    items: 'Interactivo',
    readTime: '2 min',
    href: '/blog/cuanto-pierdes',
    date: '2026-08-03',
    accent: C.red,
    accentBg: 'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.2)',
  },
  {
    id: 'listo-para-bsf',
    category: 'Herramientas' as Cat,
    emoji: '✅',
    title: '¿Estás listo para empezar BSF?',
    desc: 'Test de 6 preguntas sobre tu clima, espacio, residuos y capital. Diagnóstico personalizado con recomendación inmediata.',
    items: 'Interactivo',
    readTime: '3 min',
    href: '/blog/listo-para-bsf',
    date: '2026-08-03',
    accent: C.blue,
    accentBg: 'rgba(59,130,246,0.08)',
    accentBorder: 'rgba(59,130,246,0.2)',
  },
  {
    id: 'racion-exacta',
    category: 'Herramientas' as Cat,
    emoji: '⚖️',
    title: '¿Cuánta larva le doy a mis animales?',
    desc: 'Calculadora de raciones exactas según especie, etapa productiva y peso de tus animales. Gramos por día, semana y mes.',
    items: 'Interactivo',
    readTime: '2 min',
    href: '/blog/racion-exacta',
    date: '2026-08-03',
    accent: C.green,
    accentBg: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.2)',
  },
  {
    id: 'salud-colonia',
    category: 'Herramientas' as Cat,
    emoji: '🔬',
    title: '¿Tu colonia BSF está sana o hay problema?',
    desc: 'Diagnóstico rápido de tu lote: color, movimiento, olor, humedad y temperatura. Semáforo de salud + acciones concretas.',
    items: 'Interactivo',
    readTime: '3 min',
    href: '/blog/salud-colonia',
    date: '2026-08-03',
    accent: C.amber,
    accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    id: 'cuando-recupero',
    category: 'Herramientas' as Cat,
    emoji: '📈',
    title: '¿En cuánto tiempo recuperas el Kit ProLarva?',
    desc: 'Calcula el mes exacto en que la inversión se paga sola y cuánto ahorras neto a 3, 6 y 12 meses con tu producción.',
    items: 'Interactivo',
    readTime: '2 min',
    href: '/blog/cuando-recupero',
    date: '2026-08-03',
    accent: C.purple,
    accentBg: 'rgba(168,85,247,0.08)',
    accentBorder: 'rgba(168,85,247,0.2)',
  },
  {
    id: 'salidas-economicas',
    category: 'Negocio' as Cat,
    emoji: '💰',
    title: '5 formas de ganar plata con la mosca soldado negra',
    desc: 'Huevos, frass, larva deshidratada, harina y larva viva: qué es cada salida, a quién se la vendes y cómo empezar a producirla.',
    items: '5 salidas',
    readTime: '6 min',
    href: '/blog/salidas-economicas',
    date: '2026-09-11',
    accent: C.amber,
    accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
];

const mostRecentId = resources.reduce((a, b) => (a.date > b.date ? a : b)).id;

const SORTS = ['Recientes', 'A-Z'] as const;
type Sort = typeof SORTS[number];

export default function BlogHub() {
  const [active, setActive] = useState<Cat>('Todos');
  const [sort, setSort] = useState<Sort>('Recientes');

  const filtered = (active === 'Todos'
    ? resources
    : resources.filter(r => r.category === active)
  ).slice().sort((a, b) =>
    sort === 'Recientes' ? (a.date > b.date ? -1 : 1) : a.title.localeCompare(b.title)
  );

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 60%, ${C.bg} 100%)`,
        borderBottom: '1px solid rgba(34,197,94,0.15)',
        padding: '60px 24px 48px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          color: C.greenL,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '6px 16px',
          borderRadius: 20,
          marginBottom: 22,
        }}>
          Recursos gratuitos ProLarva
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 40px)',
          fontWeight: 800,
          lineHeight: 1.2,
          color: C.text2,
          maxWidth: 600,
          margin: '0 auto 16px',
        }}>
          Todo lo que necesitas para <span style={{ color: C.green }}>criar BSF sin errores</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
          Guías prácticas, tablas y soluciones directas. Sin rodeos.
        </p>

        <div style={{ marginTop: 12, fontSize: 13, color: C.muted2 }}>
          Juliana · ProLarva
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid rgba(34,197,94,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: isActive
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? C.greenL : C.muted,
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            );
          })}

        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 13, color: C.muted2 }}>
            {filtered.length} {filtered.length === 1 ? 'guía' : 'guías'}
          </div>

          <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4 }}>
            {SORTS.map(s => {
              const isActive = sort === s;
              return (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: isActive ? 'rgba(34,197,94,0.18)' : 'transparent',
                    color: isActive ? C.greenL : C.muted2,
                    transition: 'all 0.2s',
                  }}
                >
                  {s === 'Recientes' ? '🕒 Recientes' : 'A-Z'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '24px 20px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {filtered.map(r => (
          <Link key={r.id} href={r.href} style={{ textDecoration: 'none' }}>
            <div style={{
              position: 'relative',
              background: C.card,
              border: `1px solid ${r.accentBorder}`,
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.25)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {r.id === mostRecentId && (
                <div style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 1,
                  background: C.green, color: C.deep,
                  fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 20,
                  boxShadow: '0 2px 10px rgba(34,197,94,0.4)',
                }}>
                  🆕 Más reciente
                </div>
              )}

              {/* Thumbnail */}
              <div style={{
                background: r.accentBg,
                borderBottom: `1px solid ${r.accentBorder}`,
                padding: '28px 24px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  background: `${r.accentBg}`,
                  border: `2px solid ${r.accentBorder}`,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  flexShrink: 0,
                }}>
                  {r.emoji}
                </div>
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: `${r.accentBg}`,
                    border: `1px solid ${r.accentBorder}`,
                    color: r.accent,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: 10,
                    marginBottom: 8,
                  }}>
                    {r.category}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text2, lineHeight: 1.3 }}>
                    {r.title}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, flex: 1, margin: 0 }}>
                  {r.desc}
                </p>

                <div style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: C.muted2,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '3px 10px', borderRadius: 10,
                    }}>
                      {r.items}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: C.muted2,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '3px 10px', borderRadius: 10,
                    }}>
                      ⏱ {r.readTime}
                    </span>
                  </div>

                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: r.accent,
                  }}>
                    Leer →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: C.muted2,
            fontSize: 14,
          }}>
            No hay guías en esta categoría todavía. Próximamente.
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 520px) {
          main > div:first-child { padding: 44px 16px 36px !important; }
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; padding: 20px 16px 60px !important; }
        }
      `}</style>
    </main>
  );
}
