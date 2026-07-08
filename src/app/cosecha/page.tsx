'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg:    '#0d1b2a',
  card:  '#152035',
  card2: '#1e3050',
  green: '#22c55e',
  greenL:'#4ade80',
  text:  '#e2e8f0',
  muted: '#94a3b8',
  border:'rgba(14,165,233,0.2)',
};

const steps = [
  {
    n: 1,
    emoji: '🥚',
    title: 'Conseguir la semilla',
    range: 'Día 0',
    color: '#f97316',
    summary: 'El punto de partida: tener huevos BSF listos para incubar.',
    description: [
      'Tenés dos caminos para empezar:',
      '🛒 Con ProLarva — la forma más segura. Recibís semilla lista para arrancar sin adivinar.',
      '🌿 De forma natural — creá un sustrato atrayente y colocá tiras de cartón corrugado para que las hembras depositen los huevos entre las capas.',
      'Los huevos son puntos crema casi invisibles, del tamaño de una semilla de mostaza. Los encontrás entre las capas del cartón.',
    ],
    tips: [
      'Para atraer hembras naturalmente: banano maduro + gallinaza + un poco de aceite vegetal funciona muy bien.',
      'Las hembras solo ponen en presencia de luz solar directa — asegurate de que el insectario tenga acceso al sol.',
      'Revisá el cartón cada 2 días. Cuando veas los puntitos crema, ya podés separar los huevos.',
    ],
    alerts: [],
    registro: 'Anotá la fecha exacta en que recolectás los huevos. Ese es tu Día 0 de ciclo.',
  },
  {
    n: 2,
    emoji: '🪺',
    title: 'Preparar la cuna de incubación',
    range: 'Día 0–4',
    color: '#eab308',
    summary: 'Los huevos eclosionan a los 4 días si están en el ambiente correcto.',
    description: [
      'Una vez que tenés los huevos, hay que darles el ambiente ideal para que eclosionen bien:',
      '1. Separá los huevos del cartón y colocalos sobre una malla fina o una hoja de papel.',
      '2. Poné esa malla/papel encima de una capa de sustrato muy triturado y suave — casi pastoso.',
      '3. Una excelente opción: purina de pollo humedecida. Las larvitas pueden comerla directamente al nacer sin que tengas que hacer nada más.',
    ],
    tips: [
      'El sustrato tiene que estar húmedo pero no encharcado — si lo apretás, no debe escurrir agua.',
      'Temperatura ideal para incubación: 26–30°C. En Cúcuta el calor ambiente ya lo da.',
      'Cubrí el recipiente con una tela o papel — oscuridad parcial, sin luz directa sobre los huevos.',
    ],
    alerts: [
      'No expongas los huevos a luz solar directa — se secan y mueren.',
      'No muevas ni sacudas el recipiente durante estos 4 días.',
    ],
    registro: 'Calculá tu fecha estimada de cosecha: Día 0 + 18 días. Ponela visible donde vas a trabajar.',
  },
  {
    n: 3,
    emoji: '🐛',
    title: 'Eclosión y primeros días comiendo',
    range: 'Día 4–9',
    color: '#84cc16',
    summary: 'Eclosionan a los 4 días y empiezan a comer de inmediato. Hay que dejarlas 5 días en el contenedor inicial.',
    description: [
      'Al día 4 las larvas salen. Son diminutas (menos de 1 mm) pero muy activas y hambrientas.',
      'Como ya nacieron encima del sustrato, empiezan a comer solas de inmediato — no necesitás hacer nada.',
      'Dejá que coman durante 5 días en ese mismo contenedor inicial. No las muevas todavía.',
      'En estos 5 días van a triplicar o cuadruplicar su tamaño.',
    ],
    tips: [
      'No agregues alimento nuevo durante estos primeros 5 días — el sustrato de eclosión es suficiente para arrancar.',
      'Mantenelos en oscuridad o semioscuridad — tapá el recipiente.',
      'Si el sustrato se ve muy seco, rociá un poco de agua con atomizador.',
    ],
    alerts: [
      'No sacudas ni agites el contenedor — las larvitas son muy frágiles en esta etapa.',
      'Evitá alimentos ácidos, muy salados o con aceite al inicio.',
    ],
    registro: 'Anotá la fecha de eclosión (día real) y cualquier observación: cuántas larvas ves, aspecto del sustrato.',
  },
  {
    n: 4,
    emoji: '🏠',
    title: 'Traslado y desarrollo',
    range: 'Día 9–15',
    color: '#22c55e',
    summary: 'Las larvas ya crecieron. Pasan al contenedor grande, donde comen cada 2 días hasta la cosecha.',
    description: [
      'Al día 9 las larvas miden ya varios milímetros y necesitan más espacio y más comida.',
      'Trasladarlas — junto con el sustrato inicial — al contenedor de producción definitivo (más grande).',
      'Acá es donde se desarrollan completamente. La calidad de la cosecha depende de cómo manejés esta etapa.',
      'Agregá alimento fresco aproximadamente cada 2 días — frutas, verduras, gallinaza, sobras orgánicas.',
    ],
    tips: [
      'No sobrealimentes: si aún hay sustrato sin consumir, esperá para agregar más.',
      'Sin luz: cubrí el contenedor o ponelo en zona oscura. Las larvas le huyen a la luz.',
      'Podés combinar distintos tipos de residuos para mejorar el perfil nutricional.',
    ],
    alerts: [
      '⚠️ Olor fuerte = demasiada humedad en el sustrato. Reducí el alimento húmedo, ventilá un poco. Esto es lo más importante de monitorear.',
      'No uses alimentos podridos, con hongos, ni cítricos en exceso.',
      'Sin sal y sin aceite — los dañan.',
    ],
    registro: 'Anotá cada alimentación: qué diste, cuántos kg y la fecha. Con esto calculas la tasa de conversión al final.',
  },
  {
    n: 5,
    emoji: '⭐',
    title: 'Cosecha',
    range: 'Día 15–18',
    color: '#10b981',
    summary: '¡Primera meta cumplida! Las larvas están en su punto máximo de proteína. A alimentar los animales.',
    description: [
      'Entre los días 15 y 18, las larvas llegan a su máximo valor nutricional justo antes de entrar a prepupa.',
      'Señales de que están listas:',
      '✓ Color blanco-crema, cuerpo gordo y firme',
      '✓ Muy activas — algunas intentan "escapar" del contenedor',
      '✓ Ya casi no consumen más alimento',
      'Recogelas, pesalas y dáselas directamente a tus animales. Las consumen de forma instintiva.',
    ],
    tips: [
      'La mejor hora para cosechar es temprano en la mañana — las larvas están menos activas.',
      'Si el lote ya está listo al día 13 o 14, cosecharlas sin esperar.',
      'Podés refrigerar el exceso hasta 2 semanas en bolsa cerrada.',
    ],
    alerts: [
      'No esperes más del día 18 sin cosechar — empiezan a pasar a prepupa y pierden valor nutricional.',
      'Si ya hay muchas larvas oscureciéndose (marrón), estás llegando tarde.',
    ],
    registro: 'Anotá: peso cosechado (kg), sustrato total usado (kg). Conversión = kg larva ÷ kg sustrato × 100. Un buen ciclo da 15–30%.',
  },
];

const cicloSteps = [
  {
    n: 6,
    emoji: '🟤',
    title: 'Las prepupas — el ciclo sigue',
    range: 'Día 18+',
    color: '#a16207',
    summary: 'Si no cosechás, las larvas se oscurecen solas y entran en prepupa. Eso es normal y perfecto.',
    description: [
      'Si decidís continuar el ciclo en vez de cosechar todo, el proceso sigue solo:',
      'Seguí agregando comida cada 2 días como hasta ahora. Las larvas siguen comiendo.',
      'Con el tiempo empezás a notar que algunas larvas se oscurecen — pasan de blanco-crema a marrón oscuro. Esas son las prepupas.',
      'Siguen activas y se mueven, pero ya no comen. Por instinto, empiezan a alejarse de la humedad y buscan un lugar seco.',
      'No tenés que hacer nada todavía — este cambio es natural y progresivo.',
    ],
    tips: [
      'No todas se oscurecen al mismo tiempo — es normal que haya una mezcla de larvas blancas y prepupas marrones.',
      'En este punto podés seguir cosechando las blancas para alimento y dejar que las marrones sigan su ciclo.',
      'Mantené el contenedor en oscuridad — las prepupas se estresan con la luz.',
    ],
    alerts: [
      'No agregues demasiada humedad cuando ya hay muchas prepupas — buscan escapar de la humedad y se dispersan.',
      'Si ves prepupas intentando salirse del contenedor, es la señal para preparar las trampas del siguiente paso.',
    ],
    registro: 'Anotá cuando empieza el cambio de color. Eso te da la referencia para saber cuándo armar las trampas.',
  },
  {
    n: 7,
    emoji: '🪵',
    title: 'Trampas para prepupas',
    range: 'Día 22–28',
    color: '#7c3aed',
    summary: 'Tablas de madera que guían las prepupas hacia un contenedor seco con afrecho o aserrín. Ellas se mueven solas.',
    description: [
      'Cuando la mayoría del lote ya está en prepupa, es hora de facilitarles la salida.',
      'Las prepupas se alejan de la humedad por instinto — usás ese instinto a tu favor.',
      'Armá unas rampas o tablitas de madera que salgan del sustrato y "caigan" hacia afuera del contenedor. Las prepupas van a subirlas solas y caer al otro lado.',
      'Del otro lado ponés un contenedor nuevo con una cama de afrecho (salvado de trigo) o aserrín. Ahí es donde van a pupar.',
      'En ese segundo contenedor, en un lugar oscuro, fresco y ventilado, las prepupas se transforman en pupas durante 10–14 días.',
    ],
    tips: [
      'Las tablitas deben quedar inclinadas — las prepupas suben hacia arriba, hacia lo seco.',
      'El afrecho o aserrín debe estar seco — la clave es que sea un ambiente opuesto al sustrato húmedo.',
      'El contenedor de pupas no necesita comida — en esta etapa no comen.',
    ],
    alerts: [
      'El contenedor de pupas debe tener buena ventilación pero sin humedad.',
      'Las hormigas son el peor enemigo en esta etapa — asegurate de que no puedan entrar.',
      'No manipules las pupas — son frágiles y el movimiento las daña.',
    ],
    registro: 'Anotá cuántas prepupas lograste recolectar. En 10–14 días eclosionan como adultos, se aparean, ponen huevos, y el ciclo comienza de nuevo.',
  },
];

export default function CosechaPage() {
  const [open, setOpen] = useState<number>(1);
  const [openCiclo, setOpenCiclo] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 20px 80px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>← Inicio</Link>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>Guía Práctica · Meta 1</span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>
          🌾 Cría y Cosecha BSF
        </h1>
        <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: '#f97316', fontWeight: 700, marginBottom: 10 }}>Del huevo a la primera cosecha en 18 días</p>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, maxWidth: 600 }}>
          Guía paso a paso para tu primer ciclo completo. Desde que conseguís la semilla hasta que alimentás tus propios animales con proteína producida en casa.
        </p>
      </div>

      {/* Timeline visual */}
      <div style={{ background: 'rgba(21,32,53,0.7)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '20px', marginBottom: 36, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 360, gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <button
                onClick={() => setOpen(s.n)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, flexShrink: 0 }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: open === s.n ? s.color : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${open === s.n ? s.color : 'rgba(255,255,255,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.2s',
                  boxShadow: open === s.n ? `0 0 12px ${s.color}55` : 'none',
                }}>
                  {s.emoji}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: open === s.n ? s.color : '#64748b', whiteSpace: 'nowrap' }}>
                  {s.range}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.08)', margin: '0 2px', marginBottom: 20 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map(s => {
          const isOpen = open === s.n;
          return (
            <div
              key={s.n}
              style={{
                borderRadius: 14, overflow: 'hidden',
                background: 'rgba(21,32,53,0.7)',
                border: `1px solid ${isOpen ? s.color + '55' : 'rgba(34,197,94,0.1)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Header */}
              <button
                onClick={() => setOpen(isOpen ? open : s.n)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Montserrat, sans-serif',
                  borderLeft: `4px solid ${s.color}`,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: `${s.color}18`, border: `2px solid ${s.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {s.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: s.color, fontWeight: 700, marginBottom: 2, letterSpacing: '0.05em' }}>
                    PASO {s.n} · {s.range}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{s.summary}</div>
                </div>
                <span style={{
                  color: '#64748b', fontSize: 14, flexShrink: 0,
                  transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none',
                }}>▾</span>
              </button>

              {/* Body */}
              {isOpen && (
                <div style={{ padding: '0 20px 22px', borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ height: 1, background: `${s.color}25`, marginBottom: 18 }} />

                  {/* Description */}
                  <div style={{ marginBottom: 16 }}>
                    {s.description.map((line, i) => (
                      <p key={i} style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.75, marginBottom: 5 }}>{line}</p>
                    ))}
                  </div>

                  {/* Tips */}
                  {s.tips.length > 0 && (
                    <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', marginBottom: 8, letterSpacing: '0.06em' }}>💡 CONSEJOS</div>
                      {s.tips.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
                          <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>→</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Alerts */}
                  {s.alerts.length > 0 && (
                    <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', marginBottom: 8, letterSpacing: '0.06em' }}>⚠️ ALERTAS</div>
                      {s.alerts.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#fca5a5', lineHeight: 1.55 }}>
                          <span style={{ flexShrink: 0 }}>!</span>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Registro */}
                  <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 6, letterSpacing: '0.06em' }}>📋 QUÉ REGISTRAR</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{s.registro}</p>
                  </div>

                  {/* Nav botones */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {s.n > 1 ? (
                      <button
                        onClick={() => setOpen(s.n - 1)}
                        style={{ background: 'none', border: `1px solid rgba(255,255,255,0.1)`, color: '#64748b', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        ← {steps[s.n - 2].emoji} Anterior
                      </button>
                    ) : <div />}

                    {s.n < steps.length ? (
                      <button
                        onClick={() => setOpen(s.n + 1)}
                        style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)`, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        Siguiente → {steps[s.n].emoji}
                      </button>
                    ) : (
                      <Link
                        href="/socios"
                        style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        🔐 Registrar mi cosecha
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ciclo cerrado */}
      <div style={{ marginTop: 48 }}>
        {/* Separador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.25)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>♻️</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#a78bfa', whiteSpace: 'nowrap' }}>¿Querés continuar el ciclo?</div>
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(124,58,237,0.25)' }} />
        </div>

        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 22 }}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
            Si en vez de cosechar todo decidís <strong style={{ color: '#a78bfa' }}>cerrar el ciclo</strong> y producir tus propias adultas ponedoras, estos son los dos pasos que siguen después de la cosecha. Acá está la <strong style={{ color: '#a78bfa' }}>Meta 3 — Ciclo cerrado continuo</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cicloSteps.map(s => {
            const isOpen = openCiclo === s.n;
            return (
              <div
                key={s.n}
                style={{
                  borderRadius: 14, overflow: 'hidden',
                  background: 'rgba(21,32,53,0.7)',
                  border: `1px solid ${isOpen ? s.color + '55' : 'rgba(124,58,237,0.15)'}`,
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setOpenCiclo(isOpen ? null : s.n)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif',
                    borderLeft: `4px solid ${s.color}`,
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `${s.color}18`, border: `2px solid ${s.color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {s.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: s.color, fontWeight: 700, marginBottom: 2, letterSpacing: '0.05em' }}>
                      PASO {s.n} · {s.range}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{s.summary}</div>
                  </div>
                  <span style={{
                    color: '#64748b', fontSize: 14, flexShrink: 0,
                    transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}>▾</span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 20px 22px', borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ height: 1, background: `${s.color}25`, marginBottom: 18 }} />

                    <div style={{ marginBottom: 16 }}>
                      {s.description.map((line, i) => (
                        <p key={i} style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.75, marginBottom: 5 }}>{line}</p>
                      ))}
                    </div>

                    {s.tips.length > 0 && (
                      <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', marginBottom: 8, letterSpacing: '0.06em' }}>💡 CONSEJOS</div>
                        {s.tips.map((t, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
                            <span style={{ color: '#22c55e', flexShrink: 0, marginTop: 1 }}>→</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.alerts.length > 0 && (
                      <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', marginBottom: 8, letterSpacing: '0.06em' }}>⚠️ ALERTAS</div>
                        {s.alerts.map((a, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#fca5a5', lineHeight: 1.55 }}>
                            <span style={{ flexShrink: 0 }}>!</span>
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', marginBottom: 6, letterSpacing: '0.06em' }}>📋 QUÉ REGISTRAR</div>
                      <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{s.registro}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {s.n > cicloSteps[0].n ? (
                        <button
                          onClick={() => setOpenCiclo(s.n - 1)}
                          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                        >
                          ← {cicloSteps[0].emoji} Anterior
                        </button>
                      ) : <div />}
                      {s.n < cicloSteps[cicloSteps.length - 1].n ? (
                        <button
                          onClick={() => setOpenCiclo(s.n + 1)}
                          style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)`, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          Siguiente → {cicloSteps[1].emoji}
                        </button>
                      ) : (
                        <Link
                          href="/socios"
                          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          🔐 Registrar mis pupas
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA final */}
      <div style={{ marginTop: 36, background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🪲</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>¿Listo para tu primer ciclo?</div>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.65, maxWidth: 440, margin: '0 auto 20px' }}>
          Conseguí tu semilla BSF con ProLarva y empezá a producir tu propia proteína esta semana. El primer ciclo siempre es el que más enseña.
        </p>
        <a
          href="https://wa.me/573223212293?text=Hola%20ProLarva%20%F0%9F%91%8B%20quiero%20empezar%20mi%20primer%20ciclo%20BSF"
          target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', borderRadius: 12, padding: '13px 28px', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}
        >
          Pedir mi semilla BSF →
        </a>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .cosecha-timeline { padding: 14px 12px; }
        }
      `}</style>
    </div>
  );
}
