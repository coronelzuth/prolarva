'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0d1b2a', deep: '#0a1628', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', text: '#e2e8f0', text2: '#f1f5f9',
  muted: '#94a3b8', muted2: '#64748b', amber: '#f59e0b', amberL: '#fbbf24',
  purple: '#a855f7', purpleL: '#c084fc',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 15,
  border: '1px solid rgba(255,255,255,0.12)', background: '#1e3050',
  color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
};

const SPECIES = [
  { id: 'pollos', label: '🐔 Pollos de engorde', consumoG: 80 },
  { id: 'gallinas', label: '🐓 Gallinas ponedoras', consumoG: 120 },
  { id: 'cerdos', label: '🐷 Cerdos', consumoG: 1500 },
  { id: 'peces', label: '🐟 Peces', consumoG: 15 },
];

const KIT_PRECIO = 200000;
const REEMPLAZO_PCT = 0.30;

export default function CuandoRecuperoPage() {
  const [especie, setEspecie] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [peso, setPeso] = useState('40');
  const [res, setRes] = useState<{
    ahorroMes: number;
    mesesRecup: number;
    neto3: number;
    neto6: number;
    neto12: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'cuando-recupero' }),
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
    const ahorroMes = costoMes * REEMPLAZO_PCT;
    const mesesRecup = Math.ceil(KIT_PRECIO / ahorroMes);
    setRes({
      ahorroMes,
      mesesRecup,
      neto3: ahorroMes * 3 - KIT_PRECIO,
      neto6: ahorroMes * 6 - KIT_PRECIO,
      neto12: ahorroMes * 12 - KIT_PRECIO,
    });
  }

  const listo = especie && cantidad && precio;
  const fmt = (n: number) => Math.round(n).toLocaleString('es-CO');

  const waMsg = res
    ? `Hola Juliana! Calculé que recupero la inversión del Kit en ${res.mesesRecup} ${res.mesesRecup === 1 ? 'mes' : 'meses'} y en un año ganaré $${fmt(res.neto12)} COP netos. Quiero inscribirme al Programa Colonia.`
    : 'Hola Juliana! Quiero saber en cuánto tiempo recupero la inversión del Kit ProLarva. ¿Puedes orientarme?';

  const HITOS = [1, 2, 3, 4, 5, 6, 9, 12];

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 100%)`,
        borderBottom: '1px solid rgba(168,85,247,0.2)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Link href="/blog" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            ← Blog
          </Link>
          <div style={{
            display: 'inline-block', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
            color: C.purpleL, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 20, marginBottom: 18,
          }}>
            Calculadora de retorno
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: C.text2, lineHeight: 1.2, margin: '0 0 14px' }}>
            ¿En cuánto tiempo <span style={{ color: C.purpleL }}>recuperas</span> lo que inviertes en el Kit ProLarva?
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Ingresa tus datos reales — la calculadora te dice el mes exacto en que el sistema empieza a pagarte a ti.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Kit info */}
        <div style={{
          background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 14, padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ fontSize: 28 }}>📦</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text2 }}>Kit ProLarva 25/15</div>
            <div style={{ fontSize: 13, color: C.muted }}>Inversión inicial: <strong style={{ color: C.purpleL }}>${fmt(KIT_PRECIO)} COP</strong> (~$48 USD)</div>
          </div>
        </div>

        {/* Especie */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿Qué animales tienes?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SPECIES.map(s => (
              <button key={s.id} onClick={() => { setEspecie(s.id); setRes(null); }} style={{
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: especie === s.id ? '2px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: especie === s.id ? 'rgba(168,85,247,0.1)' : C.card,
                color: especie === s.id ? C.text2 : C.muted,
                fontSize: 14, fontWeight: especie === s.id ? 700 : 500, transition: 'all 0.15s',
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            ¿Cuántos animales tienes?
          </label>
          <input type="number" value={cantidad} onChange={e => { setCantidad(e.target.value); setRes(null); }}
            placeholder="Ej: 40" style={inp} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            ¿Cuánto vale el bulto de concentrado? (COP)
          </label>
          <input type="number" value={precio} onChange={e => { setPrecio(e.target.value); setRes(null); }}
            placeholder="Ej: 78000" style={inp} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿Cuántos kilos trae el bulto?</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['25', '40', '50'].map(p => (
              <button key={p} onClick={() => { setPeso(p); setRes(null); }} style={{
                flex: 1, padding: '13px', borderRadius: 12, cursor: 'pointer',
                border: peso === p ? '2px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: peso === p ? 'rgba(168,85,247,0.1)' : C.card,
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
            background: listo ? C.purple : 'rgba(255,255,255,0.07)',
            color: listo ? '#fff' : C.muted2, transition: 'all 0.2s', marginBottom: 32,
          }}
        >
          Calcular mi retorno de inversión 📈
        </button>

        {/* RESULTADO */}
        {res && (
          <div>
            {/* Hero resultado */}
            <div style={{
              background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: 20, padding: '28px 24px', marginBottom: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Recuperas tu inversión en
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, color: C.purpleL, lineHeight: 1 }}>
                {res.mesesRecup}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.purpleL, marginBottom: 10 }}>
                {res.mesesRecup === 1 ? 'mes' : 'meses'}
              </div>
              <div style={{ fontSize: 14, color: C.muted }}>
                ahorrando <strong style={{ color: C.text2 }}>${fmt(res.ahorroMes)} COP/mes</strong> con BSF
              </div>
            </div>

            {/* Proyección */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'A 3 meses', value: res.neto3 },
                { label: 'A 6 meses', value: res.neto6 },
                { label: 'A 12 meses', value: res.neto12 },
              ].map(item => {
                const esPositivo = item.value >= 0;
                return (
                  <div key={item.label} style={{
                    background: esPositivo ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                    border: `1px solid ${esPositivo ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    borderRadius: 16, padding: '16px 12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: esPositivo ? C.green : '#ef4444', lineHeight: 1.2 }}>
                      {esPositivo ? '+' : ''}{fmt(item.value)}
                    </div>
                    <div style={{ fontSize: 10, color: C.muted2 }}>COP netos</div>
                  </div>
                );
              })}
            </div>

            {/* Timeline visual */}
            <div style={{
              background: C.card, border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '20px', marginBottom: 24,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>
                📅 Tu línea de tiempo
              </div>
              <div style={{ position: 'relative' }}>
                {/* Línea base */}
                <div style={{
                  position: 'absolute', top: 14, left: 0, right: 0, height: 2,
                  background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {HITOS.map(mes => {
                    const acumulado = res.ahorroMes * mes - KIT_PRECIO;
                    const esRecup = mes >= res.mesesRecup;
                    const esPunto = mes === res.mesesRecup;
                    return (
                      <div key={mes} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: esPunto ? 20 : 12, height: esPunto ? 20 : 12,
                          borderRadius: '50%', zIndex: 1,
                          background: esPunto ? C.purpleL : esRecup ? C.green : 'rgba(255,255,255,0.2)',
                          border: esPunto ? `3px solid ${C.purple}` : 'none',
                          transition: 'all 0.2s',
                        }} />
                        <div style={{ fontSize: 10, color: esPunto ? C.purpleL : C.muted2, fontWeight: esPunto ? 800 : 400 }}>
                          M{mes}
                        </div>
                        {esPunto && (
                          <div style={{
                            fontSize: 9, fontWeight: 700, color: C.purpleL, textAlign: 'center',
                            background: 'rgba(168,85,247,0.15)', padding: '2px 6px', borderRadius: 6,
                          }}>
                            ✓ Kit pagado
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: C.muted2 }}>
                * Estimado con 30% de reemplazo de concentrado. Resultados reales varían según manejo.
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '28px 24px',
            }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text2, marginBottom: 8 }}>
                Empieza a contar ese ahorro desde este mes
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 22px' }}>
                El <strong style={{ color: C.greenL }}>Programa Colonia</strong> incluye el Kit ProLarva 25/15 + 4 semanas de acompañamiento grupal con Juliana para que tu sistema quede funcionando bien desde el arranque.
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
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
