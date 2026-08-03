'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0d1b2a', deep: '#0a1628', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', text: '#e2e8f0', text2: '#f1f5f9',
  muted: '#94a3b8', muted2: '#64748b',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: 12, fontSize: 15,
  border: '1px solid rgba(255,255,255,0.12)', background: '#1e3050',
  color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
};

type EspecieId = 'pollos' | 'gallinas' | 'cerdos' | 'peces';

const SPECIES: { id: EspecieId; label: string; emoji: string; etapas: { id: string; label: string; pct: number }[] }[] = [
  {
    id: 'pollos', label: 'Pollos de engorde', emoji: '🐔',
    etapas: [
      { id: 'cria', label: 'Cría (0–21 días)', pct: 0.04 },
      { id: 'levante', label: 'Levante (22–35 días)', pct: 0.06 },
      { id: 'finalizacion', label: 'Finalización (36–49 días)', pct: 0.08 },
    ],
  },
  {
    id: 'gallinas', label: 'Gallinas ponedoras', emoji: '🐓',
    etapas: [
      { id: 'postura', label: 'En postura (activa)', pct: 0.08 },
      { id: 'levante', label: 'Levante / reposición', pct: 0.05 },
    ],
  },
  {
    id: 'cerdos', label: 'Cerdos', emoji: '🐷',
    etapas: [
      { id: 'lechones', label: 'Lechones (destete)', pct: 0.05 },
      { id: 'levante', label: 'Levante', pct: 0.04 },
      { id: 'ceba', label: 'Ceba / engorde', pct: 0.03 },
    ],
  },
  {
    id: 'peces', label: 'Peces (tilapia / cachama)', emoji: '🐟',
    etapas: [
      { id: 'alevin', label: 'Alevín (0–60 días)', pct: 0.06 },
      { id: 'levante', label: 'Levante (61–120 días)', pct: 0.04 },
      { id: 'engorde', label: 'Engorde (+120 días)', pct: 0.025 },
    ],
  },
];

export default function RacionExactaPage() {
  const [especieId, setEspecieId] = useState<EspecieId | ''>('');
  const [etapaId, setEtapaId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [pesoG, setPesoG] = useState('');
  const [res, setRes] = useState<{ gDia: number; gSemana: number; kgMes: number } | null>(null);

  useEffect(() => {
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'racion-exacta' }),
    });
  }, []);

  const especie = SPECIES.find(s => s.id === especieId);

  function calcular() {
    if (!especie || !etapaId || !cantidad || !pesoG) return;
    const etapa = especie.etapas.find(e => e.id === etapaId);
    if (!etapa) return;
    const n = parseFloat(cantidad);
    const pAnim = parseFloat(pesoG);
    const gDia = etapa.pct * pAnim * n;
    setRes({ gDia, gSemana: gDia * 7, kgMes: (gDia * 30) / 1000 });
    setEtapaId(etapaId);
  }

  const listo = especieId && etapaId && cantidad && pesoG;
  const fmt = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });

  const waMsg = res
    ? `Hola Juliana! Mis ${cantidad} ${especie?.label.toLowerCase()} necesitan ${fmt(res.gDia)} g de larva al día. ¿Cómo arranco a producir eso en el Programa Colonia?`
    : `Hola Juliana! Tengo ${especieId ? especie?.label.toLowerCase() : 'animales'} y quiero saber cuánta larva BSF darles. ¿Me orientas?`;

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 100%)`,
        borderBottom: '1px solid rgba(34,197,94,0.2)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Link href="/blog" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            ← Blog
          </Link>
          <div style={{
            display: 'inline-block', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            color: C.greenL, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 20, marginBottom: 18,
          }}>
            Calculadora de raciones
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: C.text2, lineHeight: 1.2, margin: '0 0 14px' }}>
            ¿Cuánta larva BSF le doy a mis animales <span style={{ color: C.green }}>exactamente</span>?
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Ingresa especie, etapa productiva y peso de tus animales — resultado en gramos por día, semana y mes.
          </p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Especie */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿Qué animales tienes?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SPECIES.map(s => (
              <button key={s.id} onClick={() => { setEspecieId(s.id); setEtapaId(''); setRes(null); }} style={{
                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                border: especieId === s.id ? '2px solid rgba(34,197,94,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: especieId === s.id ? 'rgba(34,197,94,0.1)' : C.card,
                color: especieId === s.id ? C.text2 : C.muted,
                fontSize: 14, fontWeight: especieId === s.id ? 700 : 500, transition: 'all 0.15s',
              }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Etapa */}
        {especie && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>¿En qué etapa están?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {especie.etapas.map(e => (
                <button key={e.id} onClick={() => { setEtapaId(e.id); setRes(null); }} style={{
                  padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  border: etapaId === e.id ? '2px solid rgba(34,197,94,0.6)' : '1px solid rgba(255,255,255,0.1)',
                  background: etapaId === e.id ? 'rgba(34,197,94,0.1)' : C.card,
                  color: etapaId === e.id ? C.text2 : C.muted,
                  fontSize: 14, fontWeight: etapaId === e.id ? 700 : 500, transition: 'all 0.15s',
                }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cantidad */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            ¿Cuántos animales tienes?
          </label>
          <input type="number" value={cantidad} onChange={e => { setCantidad(e.target.value); setRes(null); }}
            placeholder="Ej: 30" style={inp} />
        </div>

        {/* Peso promedio */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
            Peso promedio por animal (en gramos)
          </label>
          <input type="number" value={pesoG} onChange={e => { setPesoG(e.target.value); setRes(null); }}
            placeholder={especieId === 'pollos' ? 'Ej: 1800' : especieId === 'gallinas' ? 'Ej: 1900' : especieId === 'cerdos' ? 'Ej: 50000' : 'Ej: 300'}
            style={inp} />
          <div style={{ fontSize: 12, color: C.muted2, marginTop: 6 }}>
            {especieId === 'cerdos' ? '⚠️ Ingresa el peso en gramos. Ej: un cerdo de 50 kg = 50.000 g' : 'Peso en gramos. Ej: una gallina de 1,9 kg = 1.900 g'}
          </div>
        </div>

        <button
          onClick={calcular}
          disabled={!listo}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, border: 'none',
            cursor: listo ? 'pointer' : 'not-allowed',
            background: listo ? C.green : 'rgba(255,255,255,0.07)',
            color: listo ? '#fff' : C.muted2, transition: 'all 0.2s', marginBottom: 32,
          }}
        >
          Calcular ración exacta 🌿
        </button>

        {/* RESULTADO */}
        {res && (
          <div>
            {/* Cards de resultado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Por día', value: `${fmt(res.gDia)} g`, sub: 'gramos' },
                { label: 'Por semana', value: `${fmt(res.gSemana)} g`, sub: 'gramos' },
                { label: 'Por mes', value: `${fmt(res.kgMes)} kg`, sub: 'kilogramos' },
              ].map(card => (
                <div key={card.label} style={{
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 16, padding: '16px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{card.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.green }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: C.muted2 }}>{card.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)',
              borderRadius: 14, padding: '16px', marginBottom: 24, fontSize: 14, color: C.muted, lineHeight: 1.6,
            }}>
              💡 Esta es la ración de <strong style={{ color: C.greenL }}>larva fresca</strong> como suplemento. Combínala reduciendo el concentrado poco a poco — empieza quitando el 20% y ve ajustando según la respuesta de tus animales.
            </div>

            {/* CTA */}
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '28px 24px',
            }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text2, marginBottom: 8 }}>
                ¿Quieres producir esa cantidad desde tu traspatio?
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 22px' }}>
                En el <strong style={{ color: C.greenL }}>Programa Colonia</strong> aprendes a dimensionar tu sistema BSF exactamente para tus animales — y a escalar cuando quieras más.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/colonia" style={{
                  flex: 1, minWidth: 150, padding: '13px 20px', borderRadius: 12, textAlign: 'center',
                  background: C.green, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
                }}>
                  Ver Programa Colonia
                </Link>
                <a
                  href={`https://wa.me/573223212293?text=${encodeURIComponent(waMsg)}`}
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

      <style>{`
        @media (max-width: 480px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
