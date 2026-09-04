'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0d1b2a', deep: '#0a1628', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', text: '#e2e8f0', text2: '#f1f5f9',
  muted: '#94a3b8', muted2: '#64748b', red: '#ef4444',
};

const SPECIES = [
  { id: 'pollos', label: '🐔 Pollos de engorde', consumoG: 80 },
  { id: 'gallinas', label: '🐓 Gallinas ponedoras', consumoG: 120 },
  { id: 'cerdos', label: '🐷 Cerdos', consumoG: 1500 },
  { id: 'peces', label: '🐟 Peces', consumoG: 15 },
];

const inp: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 15,
  border: '1px solid rgba(255,255,255,0.12)', background: '#1e3050',
  color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
};

export default function CuantoPierdesPage() {
  const [especie, setEspecie] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [peso, setPeso] = useState('40');
  const [res, setRes] = useState<{ costoMes: number; ahorroMes: number; ahorroAnio: number } | null>(null);

  useEffect(() => {
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'cuanto-pierdes' }),
    });
  }, []);

  function calcular() {
    const sp = SPECIES.find(s => s.id === especie);
    if (!sp || !cantidad || !precio) return;
    const n = parseFloat(cantidad);
    const p = parseFloat(precio);
    const kg = parseFloat(peso);
    const costoPorG = p / (kg * 1000);
    const costoMes = costoPorG * sp.consumoG * n * 30;
    const ahorroMes = costoMes * 0.3;
    setRes({ costoMes, ahorroMes, ahorroAnio: ahorroMes * 12 });
  }

  const fmt = (n: number) => Math.round(n).toLocaleString('es-CO');
  const listo = especie && cantidad && precio;

  const waMsg = res
    ? `Hola Juliana! Calculé que gasto $${fmt(res.costoMes)} COP/mes en concentrado. Quiero saber más del Programa Colonia para empezar a ahorrar eso.`
    : 'Hola Juliana! Me interesa el Programa Colonia para bajar mis costos de concentrado.';

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 100%)`,
        borderBottom: '1px solid rgba(239,68,68,0.2)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Link href="/blog" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            ← Blog
          </Link>
          <div style={{
            display: 'inline-block', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: C.red, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 20, marginBottom: 18,
          }}>
            Calculadora gratuita
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: C.text2, lineHeight: 1.2, margin: '0 0 14px' }}>
            ¿Cuánto te está <span style={{ color: C.red }}>robando</span> el concentrado cada mes?
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Ingresa tus datos y ve el número exacto — y cuánto podrías ahorrar produciendo tu propia larva BSF.
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Especie */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿Qué animales tienes?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SPECIES.map(s => (
              <button key={s.id} onClick={() => setEspecie(s.id)} style={{
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: especie === s.id ? '2px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: especie === s.id ? 'rgba(239,68,68,0.1)' : C.card,
                color: especie === s.id ? C.text2 : C.muted,
                fontSize: 14, fontWeight: especie === s.id ? 700 : 500, transition: 'all 0.15s',
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            ¿Cuántos animales tienes?
          </label>
          <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)}
            placeholder="Ej: 50" style={inp} />
        </div>

        {/* Precio bulto */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            ¿Cuánto vale el bulto de concentrado? (COP)
          </label>
          <input type="number" value={precio} onChange={e => setPrecio(e.target.value)}
            placeholder="Ej: 78000" style={inp} />
        </div>

        {/* Peso bulto */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿Cuántos kilos trae el bulto?</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['25', '40', '50'].map(p => (
              <button key={p} onClick={() => setPeso(p)} style={{
                flex: 1, padding: '13px', borderRadius: 12, cursor: 'pointer',
                border: peso === p ? '2px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: peso === p ? 'rgba(239,68,68,0.1)' : C.card,
                color: peso === p ? C.text2 : C.muted, fontSize: 16, fontWeight: 800,
              }}>
                {p} kg
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calcular}
          disabled={!listo}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, border: 'none',
            cursor: listo ? 'pointer' : 'not-allowed',
            background: listo ? C.red : 'rgba(255,255,255,0.07)',
            color: listo ? '#fff' : C.muted2, transition: 'all 0.2s', marginBottom: 32,
          }}
        >
          Calcular mi pérdida mensual 🔍
        </button>

        {/* RESULTADO */}
        {res && (
          <div>
            <div style={{
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 20, padding: '28px 24px', marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Gastas en concentrado
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, color: C.red, lineHeight: 1 }}>
                ${fmt(res.costoMes)} <span style={{ fontSize: 18, fontWeight: 600 }}>COP/mes</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 20, padding: '28px 24px', marginBottom: 28,
            }}>
              <div style={{ fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Con BSF podrías ahorrar
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, color: C.green, lineHeight: 1, marginBottom: 8 }}>
                ${fmt(res.ahorroMes)} <span style={{ fontSize: 18, fontWeight: 600 }}>COP/mes</span>
              </div>
              <div style={{ fontSize: 15, color: C.muted }}>
                → <strong style={{ color: C.greenL }}>${fmt(res.ahorroAnio)} COP en un año</strong>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: C.muted2 }}>
                * Estimado con 30% de reemplazo de concentrado — promedio real del sistema BSF.
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '28px 24px',
            }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text2, marginBottom: 8 }}>
                ¿Listo para empezar a recuperar ese dinero?
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 22px' }}>
                El <strong style={{ color: C.greenL }}>Programa Colonia</strong> te enseña a producir tu propia larva BSF en 5 semanas, desde tu traspatio, con acompañamiento real de Juliana.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/colonia" style={{
                  flex: 1, minWidth: 150, padding: '14px 20px', borderRadius: 12, textAlign: 'center',
                  background: C.green, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none',
                }}>
                  Ver Programa Colonia
                </Link>
                <a
                  href={`https://wa.me/573223212293?text=${encodeURIComponent(waMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 1, minWidth: 150, padding: '14px 20px', borderRadius: 12, textAlign: 'center',
                    background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none',
                  }}
                >
                  💬 Hablar con Juliana
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
