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
};

const problems = [
  {
    title: 'Mis larvas no crecen o crecen muy lentas',
    why: 'Hay un número clave: 24°C. Por debajo de eso, la BSF no come, no crece y no produce nada. El frío de la noche les pega directo y ahí se frena todo. Y además, ellas comen muchísimo y esto sí poca gente lo tiene en cuenta. Un gramo de semilla puede traerte hasta 25.000 larvas hambrientas. Hambrientas de verdad.',
    solution: 'Pasa el sustrato donde el frío de la noche no les llegue, adentro del galpón o una esquina abrigada. Lo ideal es que estén entre 28 y 32°C. Y revisa cuánta comida les estás echando: varía con lo que tengas, sobrados de cocina, fruta, residuos. Que coman variadito.',
    tip: 'Mantén a la mano un termómetro de ambiente. Si marcó menos de 24°C en la noche, ya sabes qué está pasando.',
  },
  {
    title: 'El sustrato huele muy mal, a podrido, no a fermentado',
    why: 'El exceso de humedad pudre el sustrato antes de que las larvas puedan procesarlo. Ya hay residuos que naturalmente son bastante líquidos, y aparte ellas lo generan en su proceso, esto produce amoniaco que les hace daño a ellas y espanta a las moscas. Es un olor a podrido fuerte, bien distinto al olor a fermentado normal.',
    solution: 'El sustrato tiene que estar húmedo pero no encharcado, como esponja bien exprimida. Si está muy líquido, agrégale material seco: aserrín, cascarilla, cartón triturado. El sustrato necesita respirar, ubícalo en lugares frescos.',
    tip: 'Si ya huele a amoniaco fuerte, el sustrato está en crisis. Saca las larvas, mezcla con seco y airea. Rápido.',
  },
  {
    title: 'Me llegó invasión de moscas comunes al sustrato',
    why: 'La humedad alta y el olor a podrido atrae a las moscas domésticas comunes mucho más rápido que a la soldado, ellas llegan primero y ponen antes.',
    solution: 'Primero: no entres en pánico. Déjalas que terminen su ciclo, el de la mosca común es más corto que el de la BSF, así que sus larvas también van a querer migrar solas. Usa eso a tu favor: adecúa el sustrato para que puedan salir, separa ese lote del resto, tapa el sustrato para que no entren más y reduce la humedad. Cuando migren, el lote queda listo. Para evitarlo la próxima vez, tapa el sustrato desde el inicio.',
    tip: 'Las larvas de mosca común migran antes que las BSF. Cuando las veas salir, es señal de que ya terminaron. Ahí separas el lote y listo.',
  },
  {
    title: 'Las moscas no ponen huevos',
    why: 'La mosca BSF necesita sol directo de verdad. Sin luz para aparearse, no hay huevos. Y necesita un lugar que huela a fermentación leve para saber dónde poner. Sin esas dos cosas, pues el ciclo se te corta ahí y no vas a tener larvas nuevas.',
    solution: 'Pon la jaula donde le dé sol directo al menos 4 a 6 horas al día. Y coloca un sustrato atrayente: cartón corrugado enrollado, cerca de algo fermentando. El olor a fermentación leve (no a podrido, que eso es distinto) es la señal que necesitan para poner.',
    tip: 'Si el día está nublado, las moscas casi no se aparean, es normal, no te angusties. Revisa en los días soleados.',
  },
  {
    title: 'Tengo pocas moscas adultas y el ciclo se me va cortando',
    why: 'La mosca adulta BSF vive solo 5 a 8 días. En ese tiempo tiene que aparearse y poner. Si la jaula no tiene las condiciones: sol, temperatura, suficientes adultos juntos, muchas se mueren sin reproducirse y la colonia se va apagando sola.',
    solution: 'Necesitas al menos 30 a 50 adultos al mismo tiempo para que haya apareamiento real. La temperatura en la jaula mínimo 27°C, con sol o con luz artificial fuerte. No coseches todo: deja siempre unas prepupas que puedan pupar adentro de la jaula. Y cuida el viento, una corriente fuerte las dispersa y corta el apareamiento.',
    tip: 'El 10 al 15% de tus prepupas déjalas pupar dentro de la jaula de adultos. Eso te mantiene el ciclo vivo.',
  },
  {
    title: 'Las larvas se escapan del sustrato',
    why: 'Entre el día 18 y el 22 más o menos, la larva entra en fase de prepupa y en ese momento escaparán de la humedad para pupar. Sin las trampas armadas, se van todas antes de que puedas usarlas.',
    solution: 'Ten en cuenta el ciclo natural y pon las trampas que necesitan. Tablas de madera, cartón corrugado, entiérralos en el sustrato en un ángulo de 45 grados, ellas eventualmente saldrán del sustrato. Y si cosechas entre los días 15 y 18, casi siempre te evitas ese problema. Pero si ya están escapando en masa, no esperes: cosecha de una.',
    tip: 'Las prepupas tienen la piel más oscura y más dura. Cuando las ves salir solas, ya están listas. No las dejes ir.',
  },
  {
    title: 'La larva se prepupa antes de engordar bien',
    why: 'Cuando hace mucho calor, más de 35°C, o cuando las larvas pasan hambre, el ciclo se acelera por estrés. Se convierten en prepupas antes de ganar el peso máximo. Cosecharás mucho menos de lo que podrías tener si hubieran terminado el ciclo bien.',
    solution: 'Lo ideal es que estén entre 28 y 32°C. Si hace mucho calor, ponles sombra: malla, cubierta parcial, lo que tengas. Y nunca dejes el sustrato vacío: si no hay qué comer, pues se prepupan de emergencia y rápido. Aliméntalas cada 24 a 48 horas según cuántas larvas tengas.',
    tip: 'Cosechar entre los días 15 y 18 casi siempre te garantiza larvas bien gordas antes de que empiece la prepupalización. Ese rango es el mejor punto.',
  },
  {
    title: 'Doy larva pero el concentrado no me está bajando',
    why: 'No es echar un puño y ya. Hay una cantidad de larva según tu animal y la etapa en que esté. Si estás dando menos de lo que necesita, el animal sigue dependiendo del concentrado igual. Y uno no lo nota hasta que mide.',
    solution: 'Mide la ración en gramos, no a ojo. Una taza, una báscula pequeña, lo que tengas. Para pollos de engorde, arranca entre el 5 y el 8% del peso vivo en larva fresca al día. Y ve bajando el concentrado poco a poco, no de golpe. El cambio lo vas a ver gradual pero real.',
    tip: 'Escríbeme el peso de tus animales y la especie, y te mando la tabla de raciones directamente.',
  },
];

export default function ProblemasPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://prolarva-monitor.vercel.app/blog/problemas');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: C.muted2, textDecoration: 'none',
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            transition: 'color 0.2s',
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
              href={`https://wa.me/?text=${encodeURIComponent('🪲 8 problemas comunes en la cría BSF — con solución rápida para cada uno: https://prolarva-monitor.vercel.app/blog/problemas')}`}
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
        borderBottom: '1px solid rgba(239,68,68,0.15)',
        padding: '44px 24px 40px',
        textAlign: 'center',
        marginTop: 16,
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: C.red,
          fontSize: 11, fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '6px 16px',
          borderRadius: 20,
          marginBottom: 22,
        }}>
          Problemas comunes · BSF
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 40px)',
          fontWeight: 800,
          lineHeight: 1.2,
          color: C.text2,
          maxWidth: 640,
          margin: '0 auto 16px',
        }}>
          Los <span style={{ color: C.red }}>8 problemas más comunes</span><br />
          en la cría de larva BSF
        </h1>

        <p style={{ color: C.muted, fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
          Lo que más me preguntan y cómo resolverlos rápido sin complicarse.
        </p>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: C.muted2 }}>
          <span>Por Juliana · ProLarva</span>
          <span style={{ width: 4, height: 4, background: C.muted2, borderRadius: '50%', display: 'inline-block' }} />
          <span>8 problemas con solución</span>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>
        {problems.map((p, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                background: C.card,
                border: `1px solid ${isOpen ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 16,
                marginBottom: 16,
                overflow: 'hidden',
                transition: 'border-color 0.25s',
              }}
            >
              <div
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '22px 20px', cursor: 'pointer', userSelect: 'none',
                }}
              >
                <div style={{
                  flexShrink: 0, width: 34, height: 34,
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800, color: C.greenL,
                  marginTop: 1,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.red, marginBottom: 5 }}>
                    Problema
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text2, lineHeight: 1.35 }}>
                    {p.title}
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: C.muted2, fontSize: 16, marginTop: 6, transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '0 20px 24px' }}>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 20 }} />

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.red, marginBottom: 10 }}>
                    Por qué pasa
                  </div>
                  <div style={{
                    background: 'rgba(239,68,68,0.06)',
                    borderLeft: '3px solid rgba(239,68,68,0.5)',
                    borderRadius: '0 8px 8px 0',
                    padding: '14px 16px', marginBottom: 18,
                    fontSize: 14, color: '#cbd5e1', lineHeight: 1.7,
                  }}>
                    {p.why}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.green, marginBottom: 10 }}>
                    Solución rápida
                  </div>
                  <div style={{
                    background: 'rgba(34,197,94,0.06)',
                    borderLeft: '3px solid rgba(34,197,94,0.45)',
                    borderRadius: '0 8px 8px 0',
                    padding: '14px 16px', marginBottom: 14,
                    fontSize: 14, color: '#cbd5e1', lineHeight: 1.7,
                  }}>
                    {p.solution}
                  </div>

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.amber, marginBottom: 10 }}>
                    Tip
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'flex-start', gap: 6,
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: C.amberL,
                    fontSize: 12, fontWeight: 600,
                    padding: '8px 14px', borderRadius: 20, lineHeight: 1.5,
                  }}>
                    ⚡ {p.tip}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${C.card}, ${C.card2})`,
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 16, padding: '36px 28px',
          textAlign: 'center', marginTop: 40,
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text2, marginBottom: 10 }}>
            ¿Tienes otro problema en tu granja?
          </h3>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 26px' }}>
            Escríbeme y te ayudo a diagnosticar qué está pasando con tu colonia. El Kit ProLarva 25/15 incluye acompañamiento para que no te quedes sola en el proceso.
          </p>
          <a
            href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20tengo%20un%20problema%20con%20mi%20colonia%20BSF"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: C.green,
              color: C.deep,
              fontWeight: 800,
              fontSize: 15,
              padding: '14px 34px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            Escribirle a Juliana →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          main > div:nth-child(2) { padding: 12px 14px 0 !important; }
          main > div:nth-child(3) { padding: 36px 16px 32px !important; }
          main > div:last-child  { padding: 32px 14px 60px !important; }
        }
      `}</style>
    </main>
  );
}
