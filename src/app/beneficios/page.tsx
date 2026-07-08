'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

const C = {
  card:   'rgba(21,32,53,0.7)',
  card2:  '#1e3050',
  green:  '#22c55e',
  greenL: '#4ade80',
  emerald:'#10b981',
  muted:  '#94a3b8',
  border: 'rgba(34,197,94,0.2)',
  purple: '#8b5cf6',
};

export default function BeneficiosPage() {
  const { markVisited, markCompleted } = useProgress();

  useEffect(() => {
    markVisited('beneficios');
    markCompleted('beneficios');
  }, [markVisited, markCompleted]);

  const animalBenefits = [
    {
      animal: '🐔 Gallinas y aves',
      items: [
        '35–45% de proteína en base seca',
        'Mejora postura hasta un 15% en ponedoras',
        'Reduce consumo de concentrado comercial',
        'Mejora plumaje, tamaño del huevo y yema',
      ],
    },
    {
      animal: '🐷 Cerdos',
      items: [
        'Fuente completa de aminoácidos esenciales',
        'Digestibilidad superior al 90%',
        'Reduce costos de alimentación un 20–35%',
        'Acelera ganancia de peso en lechones',
      ],
    },
    {
      animal: '🐟 Peces y acuicultura',
      items: [
        'Perfil lipídico ideal: sustituye harina de pescado',
        'Compatible con tilapia, trucha y cachama',
        'Mejora conversión alimenticia (FCR)',
        'Sin impacto negativo en sabor del producto final',
      ],
    },
  ];

  const nutritionStats = [
    { value: '35–45%', label: 'Proteína cruda (base fresca)', color: C.green },
    { value: '~40%',   label: 'Proteína (base seca)',          color: C.emerald },
    { value: '25–35%', label: 'Grasa bruta',                   color: '#38bdf8' },
    { value: '6–7%',   label: 'Calcio',                        color: '#f59e0b' },
  ];

  const envAdvantages = [
    'Reduce hasta un 80% el volumen de residuos orgánicos en solo 2–3 semanas.',
    'Produce frass (biol sólido) de alto valor como abono para suelos y cultivos.',
    'Ciclo cerrado: los residuos de la finca se convierten en proteína para los animales.',
    'No compite con cultivos destinados a consumo humano.',
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
        ← Inicio
      </Link>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: C.purple, fontWeight: 600 }}>Intro · ¿Por qué BSF?</span>
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, marginBottom: 8 }}>
          ⭐ Beneficios de la BSF
        </h1>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 580 }}>
          La mosca soldado negra (<em>Hermetia illucens</em>) transforma residuos orgánicos en proteína de alto valor biológico. Aquí los datos más relevantes por especie y las ventajas ambientales comprobadas.
        </p>
      </div>

      {/* Benefits per animal */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 32 }}>
        {animalBenefits.map(b => (
          <div key={b.animal} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>{b.animal}</div>
            {b.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                <span style={{ color: C.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Nutritional composition */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>🔬 Composición nutricional (larva BSFL)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
          {nutritionStats.map(s => (
            <div key={s.label} style={{ background: C.card2, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#475569', marginTop: 14, lineHeight: 1.5 }}>
          Valores orientativos. La composición varía según sustrato, edad de cosecha y método de procesado.
        </p>
      </div>

      {/* Environmental advantages */}
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>♻️ Ventajas ambientales</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {envAdvantages.map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
              <span style={{ color: C.emerald, flexShrink: 0, marginTop: 2, fontSize: 10 }}>●</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon: papers */}
      <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14, padding: 24, marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18 }}>📄</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>Evidencia científica</span>
          <span style={{ background: 'rgba(139,92,246,0.15)', color: C.purple, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>Próximamente</span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Estamos recopilando artículos revisados por pares sobre composición de BSFL, tasas de conversión en campo y efectos sobre producción animal en contextos latinoamericanos. Esta sección se expandirá con papers, fichas técnicas y evidencia de productores de la región.
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/preparacion" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          🛠️ Siguiente: Diagnóstico →
        </Link>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', color: C.green, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, border: `1px solid ${C.border}` }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
