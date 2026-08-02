'use client';

import { useState } from 'react';

const C = {
  bg:     '#0d1b2a',
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

type Urgencia = 'CRÍTICO' | 'URGENTE' | 'ATENCIÓN';

const URGENCIA_COLOR: Record<Urgencia, string> = {
  'CRÍTICO':  '#ef4444',
  'URGENTE':  '#f97316',
  'ATENCIÓN': '#f59e0b',
};
const URGENCIA_BG: Record<Urgencia, string> = {
  'CRÍTICO':  'rgba(239,68,68,0.10)',
  'URGENTE':  'rgba(249,115,22,0.10)',
  'ATENCIÓN': 'rgba(245,158,11,0.10)',
};

const PROTOCOLOS = [
  {
    emoji: '🌡️',
    urgencia: 'CRÍTICO' as Urgencia,
    titulo: 'Temperatura fuera de rango',
    subtitulo: 'Larvas en letargo o prepupación prematura',
    diagnostico: ['¿La temperatura baja de 24°C en la noche?', '¿Supera los 35°C durante el día?'],
    causa: 'Por debajo de 24°C la BSF entra en letargo: deja de comer y de crecer. Por encima de 35°C se prepupan por estrés calórico antes de alcanzar el peso máximo — cosecharás mucho menos de lo que deberías.',
    pasos: [
      'Mide la temperatura antes de las 8am y entre 2–4pm para conocer el rango real del día.',
      'Si marca menos de 24°C: reubica el sistema en un lugar abrigado — dentro del galpón, lejos de paredes húmedas y corrientes de aire.',
      'Si supera 35°C: agrega sombra con malla o costal. Nunca exposición solar directa al sustrato en horas pico.',
      'El rango ideal es 28–32°C. Si no puedes lograrlo, mantén al menos 24°C como mínimo absoluto.',
      'Revisa al día siguiente: si la larva retoma movimiento en 24–48h, el problema era temperatura.',
    ],
    accion: 'Reubica el sistema donde la temperatura nocturna no baje de 24°C. Es el ajuste que más rápido detiene esta crisis.',
  },
  {
    emoji: '💧',
    urgencia: 'URGENTE' as Urgencia,
    titulo: 'Humedad incorrecta',
    subtitulo: 'Sustrato muy húmedo o muy seco',
    diagnostico: ['¿El sustrato huele a amoniaco fuerte (no fermentado)?', '¿Está polvoriento y las larvas no comen?'],
    causa: 'El exceso de humedad pudre el sustrato antes de que las larvas lo procesen, generando amoniaco que las daña y espanta a las moscas. La falta de humedad endurece el sustrato y las larvas no pueden penetrarlo.',
    pasos: [
      'Prueba de esponja: toma un puñado y apriétalo. Debe conservar la forma sin escurrir agua. Ese es el punto ideal.',
      'Si está muy húmedo: mezcla con material seco — aserrín, cascarilla de arroz, cartón triturado. Si el olor a amoniaco es fuerte, saca las larvas mientras ajustas.',
      'Si está muy seco: agrega agua en pequeñas cantidades mezclando bien. Nunca de un solo golpe.',
      'Espera 12–24h y repite la prueba de esponja antes de alimentar de nuevo.',
      'Evita residuos muy líquidos sin mezclarlos con material seco — siempre compensar frutas aguadas con seco.',
    ],
    accion: 'Si ya huele a amoniaco: saca las larvas, mezcla con material seco y airea en los próximos 30 minutos. El amoniaco las va matando.',
  },
  {
    emoji: '🥚',
    urgencia: 'URGENTE' as Urgencia,
    titulo: 'Bajo índice de oviposición',
    subtitulo: 'Las moscas no están poniendo huevos',
    diagnostico: ['¿La jaula de adultos recibe menos de 4h de sol directo?', '¿No hay cartón corrugado o atrayente cerca del punto de postura?'],
    causa: 'La mosca BSF necesita sol directo para aparearse — sin luz solar real, el cortejo no ocurre. Además necesita detectar olor a fermentación leve para saber dónde poner: sin ese estímulo las hembras no depositan los huevos aunque estén fertilizadas.',
    pasos: [
      'Verifica las horas de sol directo que recibe la jaula. El mínimo para apareamiento activo es 4–6 horas diarias de sol real.',
      'Coloca cartón corrugado enrollado como punto de postura, cerca de un atrayente con olor a fermentación leve (no podrido — eso las espanta).',
      'Asegúrate de tener mínimo 30–50 moscas adultas simultáneas. Con menos, las probabilidades de encuentro caen drásticamente.',
      'Protege la jaula del viento: una corriente fuerte dispersa a los adultos y corta el apareamiento incluso con buen sol.',
      'Si el día está nublado, las moscas casi no se aparean — es normal. Evalúa en un día soleado.',
    ],
    accion: 'Mueve la jaula a donde reciba sol directo 8am–12pm y coloca cartón corrugado como punto de postura hoy mismo.',
  },
  {
    emoji: '☠️',
    urgencia: 'CRÍTICO' as Urgencia,
    titulo: 'Mortalidad de larvas',
    subtitulo: 'Larvas muertas o muriendo en el sustrato',
    diagnostico: ['¿El sustrato huele fuerte a amoniaco o gases?', '¿Las larvas están en la superficie en lugar de dentro?'],
    causa: 'Las causas más frecuentes son: acumulación de amoniaco por sustrato saturado, temperatura extrema (< 18°C o > 38°C), patógenos en sustrato en descomposición avanzada, o asfixia por sustrato compactado sin oxígeno. Las larvas salen a la superficie como señal de alerta antes de morir.',
    pasos: [
      'Larvas en superficie = estrés activo. Actúa en los próximos 60 minutos — en 6–12h puede perderse el lote.',
      'Huele el sustrato. Si el amoniaco es fuerte: mezcla con material seco, voltea para airear y saca las larvas a un contenedor limpio con sustrato nuevo.',
      'Mide temperatura. Si está fuera de rango (< 24°C o > 35°C), reubica el lote de emergencia.',
      'Revisa si hay insectos extraños que compitan o ataquen a las larvas.',
      'Evalúa el porcentaje de sobrevivencia: si supera el 50%, el lote puede rescatarse; si no, inicia uno nuevo.',
      'Después del rescate, no alimentes por 24h: deja que el sustrato se estabilice.',
    ],
    accion: 'Si las larvas están en la superficie: voltea el sustrato, ventila y trasládalas a un contenedor limpio en los próximos 30 minutos.',
  },
  {
    emoji: '🚫',
    urgencia: 'ATENCIÓN' as Urgencia,
    titulo: 'Rechazo del sustrato',
    subtitulo: 'Las larvas no comen o evitan el sustrato',
    diagnostico: ['¿Agregaste cítricos, alimentos muy salados o aceites?', '¿El sustrato está en condiciones extremas de humedad?'],
    causa: 'La BSF rechaza activamente: cítricos (limón, naranja), alimentos muy salados, carnes con mucha grasa sin mezclar, y residuos con pH muy ácido o alcalino. También rechaza el sustrato en condiciones extremas de humedad.',
    pasos: [
      'Revisa los ingredientes del último ciclo. Retira físicamente lo que sea cítrico, muy salado o con aceites en cantidad.',
      'Haz la prueba de humedad. Ajusta si está en extremo seco o húmedo.',
      'Si acabas de cambiar el tipo de sustrato, las larvas pueden tardar 12–24h en adaptarse. Observa antes de cambiar nada.',
      'Mezcla el sustrato nuevo con un poco del anterior — el olor conocido las atrae de vuelta.',
      'Si el rechazo persiste más de 48h con sustrato correcto, revisa temperatura: puede ser la causa real.',
    ],
    accion: 'Retira los ingredientes problemáticos y mezcla con sustrato anterior. Larvas hambrientas no rechazan un sustrato bien formulado.',
  },
  {
    emoji: '🪰',
    urgencia: 'ATENCIÓN' as Urgencia,
    titulo: 'Plagas e invasión externa',
    subtitulo: 'Moscas comunes u otros insectos en el sustrato',
    diagnostico: ['¿El sustrato está destapado y con olor fuerte?', '¿Ves larvas más pequeñas y blancas mezcladas con las BSF?'],
    causa: 'La mosca doméstica llega atraída por humedad alta y olor a podrido, y pone antes que la BSF. También pueden aparecer escarabajos o ácaros cuando el sustrato tiene exceso de humedad o poca ventilación.',
    pasos: [
      'No entres en pánico con moscas comunes: su ciclo es más corto. Sus larvas migrarán antes que las tuyas — úsalo a tu favor.',
      'Tapa el sustrato para evitar que entren más moscas externas. Una malla fina o tela de costal funciona.',
      'Reduce la humedad del sustrato: favorece a la BSF y desfavorece a la mosca doméstica.',
      'Cuando las larvas de mosca común salgan solas (son más pequeñas y rápidas), recógelas y separa el lote.',
      'Si hay ácaros (puntitos blancos en superficie): el sustrato está demasiado húmedo. Voltéalo y airéalo inmediatamente.',
      'Para prevenir: tapa el sustrato desde el inicio del ciclo, especialmente las primeras 48h.',
    ],
    accion: 'Tapa el sustrato ahora mismo con malla o tela. Eso corta la entrada de nuevas moscas mientras ajustas la humedad.',
  },
  {
    emoji: '🐛',
    urgencia: 'URGENTE' as Urgencia,
    titulo: 'Lentitud en desarrollo',
    subtitulo: 'El ciclo está tardando más de lo esperado',
    diagnostico: ['¿La temperatura del área está entre 24°C y 32°C?', '¿El sustrato se reduce visiblemente cada 24–48h?'],
    causa: 'El ciclo normal de la BSF es 14–18 días en condiciones óptimas. Si se extiende más de 22–25 días, las causas más comunes son: temperatura subóptima (24–27°C en vez de 28–32°C), subnutrición por poca comida o sustrato monótono, o alta densidad de larvas sin suficiente sustrato.',
    pasos: [
      'Verifica temperatura: entre 28–32°C el desarrollo es máximo. Entre 24–27°C el ciclo se alarga 5–8 días más — no es crisis, pero debes saberlo.',
      'Revisa el consumo de sustrato: debe reducirse visiblemente cada 24–48h. Si no baja, hay subnutrición.',
      'Aumenta la variedad del sustrato: mezcla frutas con proteínas (residuos de cocina, estiércol de ave, harina de leguminosas). La monotonía nutricional alarga el ciclo.',
      'Si hay muchas larvas en poco espacio: divide en dos contenedores y alimenta más seguido.',
      'No coseches antes del día 14. El mejor punto es entre el día 15 y 18 — ahí están al máximo de peso y proteína.',
    ],
    accion: 'Alimenta hoy con sustrato variado que incluya fuente de proteína. En 48–72h deberías ver aceleración visible.',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProtocoloCrisisModal({ open, onClose }: Props) {
  const [sel, setSel] = useState<number | null>(null);

  if (!open) return null;

  const p = sel !== null ? PROTOCOLOS[sel] : null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) { setSel(null); onClose(); } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px 40px',
        overflowY: 'auto',
      }}
    >
      <div style={{
        background: C.bg,
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 20,
        width: '100%', maxWidth: 820,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        animation: 'pcmFadeIn 0.22s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(245,158,11,0.06)',
          borderBottom: '1px solid rgba(245,158,11,0.15)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: C.amberL,
              fontSize: 10, fontWeight: 800,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '4px 12px', borderRadius: 20,
              marginBottom: 8,
            }}>
              🔒 Bono exclusivo · Programa Colonia
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text2 }}>
              Protocolo Anti-Crisis BSF
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Selecciona el problema que estás viendo en tu colonia
            </div>
          </div>
          <button
            onClick={() => { setSel(null); onClose(); }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: C.muted2, width: 36, height: 36,
              borderRadius: '50%', cursor: 'pointer',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Leyenda urgencia */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(['CRÍTICO', 'URGENTE', 'ATENCIÓN'] as Urgencia[]).map(u => (
            <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: URGENCIA_COLOR[u], display: 'inline-block' }} />
              <span style={{ color: URGENCIA_COLOR[u] }}>{u}</span>
            </div>
          ))}
        </div>

        {/* Grid de problemas */}
        <div style={{ padding: '16px 24px 8px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 10,
          }}>
            {PROTOCOLOS.map((pro, i) => {
              const activo = sel === i;
              return (
                <button
                  key={i}
                  onClick={() => setSel(activo ? null : i)}
                  style={{
                    background: activo ? C.card2 : C.card,
                    border: `1px solid ${activo ? URGENCIA_COLOR[pro.urgencia] : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12,
                    padding: '14px 14px 12px',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.18s',
                    outline: 'none',
                    boxShadow: activo ? `0 0 0 2px ${URGENCIA_COLOR[pro.urgencia]}22` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{pro.emoji}</span>
                    <span style={{
                      fontSize: 8, fontWeight: 800,
                      letterSpacing: '0.8px', textTransform: 'uppercase',
                      color: URGENCIA_COLOR[pro.urgencia],
                      background: URGENCIA_BG[pro.urgencia],
                      border: `1px solid ${URGENCIA_COLOR[pro.urgencia]}44`,
                      padding: '2px 7px', borderRadius: 20,
                    }}>
                      {pro.urgencia}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text2, lineHeight: 1.3, marginBottom: 4 }}>
                    {pro.titulo}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted2, lineHeight: 1.35 }}>
                    {pro.subtitulo}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de detalle */}
        {p && (
          <div style={{
            margin: '8px 24px 24px',
            background: C.card,
            border: `1px solid ${URGENCIA_COLOR[p.urgencia]}33`,
            borderRadius: 16, overflow: 'hidden',
            animation: 'pcmFadeIn 0.18s ease',
          }}>
            {/* Header del panel */}
            <div style={{
              background: URGENCIA_BG[p.urgencia],
              borderBottom: `1px solid ${URGENCIA_COLOR[p.urgencia]}22`,
              padding: '18px 22px',
              display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: URGENCIA_COLOR[p.urgencia], marginBottom: 4 }}>
                  Nivel {p.urgencia}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text2, lineHeight: 1.25 }}>{p.titulo}</div>
              </div>
            </div>

            <div style={{ padding: '22px 22px 26px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Diagnóstico */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.amberL, marginBottom: 10 }}>
                  ⚡ Verifica esto primero
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {p.diagnostico.map((d, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.15)',
                      borderRadius: 9, padding: '9px 13px',
                    }}>
                      <span style={{ fontSize: 11, color: C.amberL, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>?</span>
                      <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Causa */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.red, marginBottom: 8 }}>
                  🔍 Por qué pasa
                </div>
                <div style={{
                  background: 'rgba(239,68,68,0.06)',
                  borderLeft: '3px solid rgba(239,68,68,0.5)',
                  borderRadius: '0 9px 9px 0',
                  padding: '13px 16px',
                  fontSize: 13, color: '#cbd5e1', lineHeight: 1.75,
                }}>
                  {p.causa}
                </div>
              </div>

              {/* Pasos */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.green, marginBottom: 10 }}>
                  ✅ Solución paso a paso
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.pasos.map((paso, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      background: 'rgba(34,197,94,0.05)',
                      borderRadius: 9, padding: '10px 14px',
                    }}>
                      <span style={{
                        flexShrink: 0, width: 22, height: 22,
                        background: 'rgba(34,197,94,0.15)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800, color: C.greenL,
                      }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65 }}>{paso}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acción inmediata */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(34,197,94,0.10), rgba(16,185,129,0.06))',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.greenL, marginBottom: 6 }}>
                  🚀 Acción inmediata
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text2, lineHeight: 1.6 }}>{p.accion}</div>
              </div>

              {/* CTA WhatsApp */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 14, flexWrap: 'wrap',
                background: C.card2, border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 3 }}>
                    ¿El problema sigue después de aplicar el protocolo?
                  </div>
                  <div style={{ fontSize: 11, color: C.muted2 }}>
                    Escríbeme con el número de tu lote y el día del ciclo.
                  </div>
                </div>
                <a
                  href={`https://wa.me/573223212293?text=${encodeURIComponent(`Hola Juliana, apliqué el protocolo de "${p.titulo}" y necesito ayuda con mi colonia BSF`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: '#22c55e', color: '#0a1628',
                    fontWeight: 800, fontSize: 12,
                    padding: '9px 18px', borderRadius: 9,
                    textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="#0a1628"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Escribirle a Juliana
                </a>
              </div>
            </div>
          </div>
        )}

        {!p && (
          <div style={{ textAlign: 'center', padding: '16px 24px 28px', fontSize: 12, color: C.muted2 }}>
            ↑ Toca el problema que estás viendo en tu colonia
          </div>
        )}
      </div>

      <style>{`
        @keyframes pcmFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
