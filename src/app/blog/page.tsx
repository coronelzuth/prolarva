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
};

const CATEGORIES = ['Todos', 'Problemas', 'Nutrición', 'Manejo'] as const;
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
    accent: C.red,
    accentBg: 'rgba(239,68,68,0.08)',
    accentBorder: 'rgba(239,68,68,0.2)',
  },
  {
    id: 'raciones',
    category: 'Nutrición' as Cat,
    emoji: '🍽️',
    title: 'Raciones recomendadas por animal y etapa',
    desc: 'Cuánta larva dar según la especie y la etapa de producción. Tablas para pollos, gallinas, cerdos y peces.',
    items: '4 especies',
    readTime: '5 min',
    href: '/blog/raciones',
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
    accent: C.purple,
    accentBg: 'rgba(168,85,247,0.08)',
    accentBorder: 'rgba(168,85,247,0.2)',
  },
];

export default function BlogHub() {
  const [active, setActive] = useState<Cat>('Todos');

  const filtered = active === 'Todos'
    ? resources
    : resources.filter(r => r.category === active);

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
          Por Juliana · ProLarva
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

          <div style={{ marginLeft: 'auto', fontSize: 13, color: C.muted2, display: 'flex', alignItems: 'center' }}>
            {filtered.length} {filtered.length === 1 ? 'guía' : 'guías'}
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
