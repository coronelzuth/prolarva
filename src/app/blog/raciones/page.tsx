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
  amberL: '#fbbf24',
  blue:   '#3b82f6',
};

type Animal = 'pollos' | 'gallinas' | 'cerdos' | 'peces';

const animals: { id: Animal; emoji: string; label: string }[] = [
  { id: 'pollos',   emoji: '🐔', label: 'Pollos de engorde' },
  { id: 'gallinas', emoji: '🥚', label: 'Gallinas ponedoras' },
  { id: 'cerdos',   emoji: '🐷', label: 'Cerdos' },
  { id: 'peces',    emoji: '🐟', label: 'Peces (tilapia/cachama)' },
];

const data: Record<Animal, {
  intro: string;
  rows: { etapa: string; detalle: string; racion: string; equiv: string; nota?: string }[];
  tips: string[];
  reemplazo: string;
}> = {
  pollos: {
    intro: 'El pollo de engorde responde muy bien a la larva BSF porque es alta en proteína y grasa. El truco está en dar la cantidad correcta por etapa y bajar el concentrado de forma gradual.',
    rows: [
      { etapa: 'Inicio', detalle: '1–7 días de vida', racion: '3–5% del peso vivo', equiv: '1–3 g por pollito/día', nota: 'Larva fresca picada o triturada' },
      { etapa: 'Crecimiento', detalle: '8–28 días', racion: '5–8% del peso vivo', equiv: '10–20 g por pollo/día', nota: 'Larva entera de 10–15 días' },
      { etapa: 'Engorde', detalle: '29–45 días', racion: '8–12% del peso vivo', equiv: '30–55 g por pollo/día', nota: 'Larva de 15–18 días (máximo engorde)' },
    ],
    tips: [
      'Nunca bajes el concentrado de golpe: empieza reemplazando solo el 10-15% la primera semana.',
      'El mejor momento de cosecha para esta especie es entre los días 15 y 18 de la larva.',
      'Si los pollos rechazan la larva al inicio, mézclalas con el concentrado ya húmedo.',
    ],
    reemplazo: 'Con la ración correcta puedes reemplazar entre el 20 y el 30% del concentrado en pollos de engorde adultos.',
  },
  gallinas: {
    intro: 'Para gallinas ponedoras, la larva BSF mejora la producción de huevo y la calidad de la yema. La grasa de la larva se nota en el color más amarillo de la yema y en la dureza del cascarón.',
    rows: [
      { etapa: 'Cría', detalle: '0–6 semanas', racion: '2–3% del peso vivo', equiv: '3–5 g por pollona/día', nota: 'Larva picada fina, inicio gradual' },
      { etapa: 'Levante', detalle: '7–18 semanas', racion: '3–5% del peso vivo', equiv: '8–15 g por pollona/día', nota: 'Larva entera de 10–15 días' },
      { etapa: 'Postura activa', detalle: '18 semanas en adelante', racion: '5–8% del peso vivo', equiv: '15–25 g por gallina/día', nota: 'Mantener constante para no afectar postura' },
    ],
    tips: [
      'La yema más amarilla-naranja es señal de que la ración está funcionando, aparece entre la semana 2 y 3.',
      'No cambies la ración bruscamente en plena postura: puede bajar la producción temporalmente.',
      'Las gallinas reproductoras pueden recibir hasta un 10% del peso vivo sin afectar la fertilidad.',
    ],
    reemplazo: 'En gallinas ponedoras puedes reemplazar entre el 15 y el 25% del concentrado con larva fresca bien suministrada.',
  },
  cerdos: {
    intro: 'El cerdo aprovecha la larva BSF desde la etapa de precebo. En lechones muy pequeños no se recomienda porque la larva puede ser difícil de digerir. A partir de los 10 kg ya puede incluirse.',
    rows: [
      { etapa: 'Lechón', detalle: 'Menos de 10 kg', racion: 'No recomendado', equiv: '—', nota: 'Espera a que pasen los 10 kg de peso' },
      { etapa: 'Precebo', detalle: '10–30 kg', racion: '3–5% del peso vivo', equiv: '300–1.500 g por cerdo/día', nota: 'Larva entera o triturada, mezclada con el concentrado' },
      { etapa: 'Cebo', detalle: '30–90 kg', racion: '5–8% del peso vivo', equiv: '1,5–7 kg por cerdo/día', nota: 'Larva fresca de 15–18 días' },
      { etapa: 'Marranas', detalle: 'Gestación y lactancia', racion: '3–5% del peso vivo', equiv: '3–5 kg por marrana/día', nota: 'Mantener constante, especialmente en lactancia' },
    ],
    tips: [
      'El cerdo suele aceptar la larva sin problema desde el primer día de introducción.',
      'En cebo intensivo, la larva puede representar hasta el 40% de la proteína total de la dieta.',
      'Mezcla la larva con el alimento húmedo para que la distribución sea pareja en el comedero.',
    ],
    reemplazo: 'En cerdos de engorde en etapa cebo puedes reemplazar hasta el 30–40% del concentrado proteico.',
  },
  peces: {
    intro: 'La tilapia y la cachama son las especies que mejor responden a la larva BSF en Colombia. Para alevines muy pequeños la larva completa es muy grande, pero en juveniles y adultos el consumo es excelente.',
    rows: [
      { etapa: 'Alevín', detalle: 'Menos de 5 cm', racion: 'No recomendado (larva entera)', equiv: '—', nota: 'Usa harina de larva seca molida si es necesario' },
      { etapa: 'Juvenil', detalle: '5–15 cm', racion: '3–5% del peso vivo', equiv: '1–5 g por pez/día', nota: 'Larva entera de 10–15 días, suministrar en la mañana' },
      { etapa: 'Adulto / engorde', detalle: 'Más de 15 cm', racion: '5–10% del peso vivo', equiv: '5–20 g por pez/día', nota: 'Larva de 15–18 días, máximo valor nutritivo' },
    ],
    tips: [
      'Suministra en la mañana cuando la temperatura del agua es más fresca y los peces están activos.',
      'Las larvas vivas que caen al agua estimulan más el consumo que las muertas o secas.',
      'Si tienes estanque, suelta las larvas directamente al agua: el movimiento activa el instinto de caza.',
    ],
    reemplazo: 'En tilapia adulta puedes reemplazar entre el 20 y el 35% del alimento balanceado con larva fresca.',
  },
};

export default function RacionesPage() {
  const [selected, setSelected] = useState<Animal>('pollos');
  const [copied, setCopied] = useState(false);
  const d = data[selected];
  const animal = animals.find(a => a.id === selected)!;

  const handleCopy = () => {
    navigator.clipboard.writeText('https://prolarva-monitor.vercel.app/blog/raciones');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: C.muted2, textDecoration: 'none',
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
          }}>
            ← Volver al centro de recursos
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              padding: '6px 12px', borderRadius: 8,
              background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
              border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: copied ? C.greenL : C.muted2,
              transition: 'all 0.2s',
            }}>
              {copied ? '✓ ¡Copiado!' : '🔗 Copiar enlace'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('🍽️ Raciones recomendadas de larva BSF por animal y etapa — tablas para pollos, gallinas, cerdos y peces: https://prolarva-monitor.vercel.app/blog/raciones')}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 600,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.2)',
                color: '#25D366', textDecoration: 'none',
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 60%, ${C.bg} 100%)`,
        borderBottom: '1px solid rgba(34,197,94,0.15)',
        padding: '44px 24px 40px',
        textAlign: 'center',
        marginTop: 16,
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
          Nutrición · BSF
        </div>

        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 38px)',
          fontWeight: 800,
          lineHeight: 1.2,
          color: C.text2,
          maxWidth: 640,
          margin: '0 auto 16px',
        }}>
          Raciones recomendadas de larva BSF <br />
          <span style={{ color: C.green }}>por animal y etapa</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
          Cuánta larva dar, cuándo y para qué especie. Con la tabla correcta dejas de echar a ojo y empiezas a ver resultados.
        </p>

        <div style={{ marginTop: 16, fontSize: 13, color: C.muted2 }}>
          Por Juliana · ProLarva
        </div>
      </div>

      {/* SELECTOR DE ANIMAL */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
          Selecciona el animal
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {animals.map(a => {
            const isActive = selected === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid rgba(34,197,94,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
                  background: isActive
                    ? 'rgba(34,197,94,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  color: isActive ? C.greenL : C.muted,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Intro */}
        <div style={{
          background: C.card,
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 16,
          padding: '24px 24px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 32 }}>{animal.emoji}</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text2 }}>{animal.label}</div>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{d.intro}</p>
        </div>

        {/* TABLA */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
            Tabla de raciones
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              background: C.card,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              overflow: 'hidden',
              fontSize: 13,
            }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {['Etapa', 'Detalle', 'Ración diaria', 'Equivalente', 'Nota'].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: C.muted2,
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((row, i) => {
                  const isNoRec = row.racion === 'No recomendado';
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.card : 'rgba(30,48,80,0.4)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: C.text2, whiteSpace: 'nowrap', borderBottom: i < d.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        {row.etapa}
                      </td>
                      <td style={{ padding: '14px 16px', color: C.muted, borderBottom: i < d.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        {row.detalle}
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', borderBottom: i < d.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 8,
                          fontSize: 12, fontWeight: 700,
                          background: isNoRec ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                          border: `1px solid ${isNoRec ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                          color: isNoRec ? C.red : C.greenL,
                        }}>
                          {row.racion}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: C.muted, whiteSpace: 'nowrap', borderBottom: i < d.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        {row.equiv}
                      </td>
                      <td style={{ padding: '14px 16px', color: C.muted2, fontSize: 12, borderBottom: i < d.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        {row.nota || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* REEMPLAZO DE CONCENTRADO */}
        <div style={{
          background: 'rgba(34,197,94,0.07)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 14,
          padding: '18px 20px',
          marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.green, marginBottom: 6 }}>
              Reemplazo de concentrado
            </div>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{d.reemplazo}</p>
          </div>
        </div>

        {/* TIPS */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
            Tips para esta especie
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.tips.map((tip, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: 'rgba(245,158,11,0.07)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚡</span>
                <span style={{ fontSize: 13, color: C.amberL, lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NOTA GENERAL */}
        <div style={{
          background: C.card,
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '20px 22px',
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 12 }}>
            Aplica para todas las especies
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Usa siempre larva fresca (días 15–18) para el mayor valor nutritivo.',
              'Baja el concentrado de forma gradual: 10% la primera semana, 20% la segunda, así sucesivamente.',
              'Mide en gramos, no a ojo. Una báscula pequeña hace toda la diferencia.',
              'Si el animal rechaza la larva al inicio, introdúcela mezclada con el alimento ya húmedo.',
            ].map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${C.card}, ${C.card2})`,
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 16, padding: '36px 28px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text2, marginBottom: 10 }}>
            ¿Quieres la calculadora de ahorro?
          </h3>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 26px' }}>
            Ingresa el peso de tus animales y te digo exactamente cuánto concentrado ahorras al mes con la ración correcta de larva BSF.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/calculadora" style={{
              display: 'inline-block',
              background: C.green,
              color: C.deep,
              fontWeight: 800,
              fontSize: 15,
              padding: '14px 28px',
              borderRadius: 10,
              textDecoration: 'none',
            }}>
              Ir a la calculadora →
            </Link>
            <a
              href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20quiero%20saber%20cu%C3%A1nto%20larva%20dar%20a%20mis%20animales"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: C.text,
                fontWeight: 700,
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Preguntarle a Juliana
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 520px) {
          main > div:nth-child(2) { padding: 12px 14px 0 !important; }
          main > div:nth-child(3) { padding: 32px 16px 30px !important; }
          main > div:last-child > div { padding: 20px 16px 60px !important; }
          table { min-width: 560px; }
        }
      `}</style>
    </main>
  );
}
