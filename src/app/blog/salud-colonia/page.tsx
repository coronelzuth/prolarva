'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const C = {
  bg: '#0d1b2a', deep: '#0a1628', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', text: '#e2e8f0', text2: '#f1f5f9',
  muted: '#94a3b8', muted2: '#64748b', red: '#ef4444', amber: '#f59e0b', amberL: '#fbbf24',
};

type SintomaId = string;

interface Sintoma {
  id: SintomaId;
  categoria: string;
  pregunta: string;
  opciones: { label: string; nivel: 'ok' | 'alerta' | 'crisis'; accion?: string }[];
}

const SINTOMAS: Sintoma[] = [
  {
    id: 'color', categoria: 'Apariencia', pregunta: '¿Cómo se ven las larvas?',
    opciones: [
      { label: 'Blancas, brillantes y gordas', nivel: 'ok' },
      { label: 'Amarillas o algo apagadas', nivel: 'alerta', accion: 'Revisa temperatura y cantidad de comida. Pueden estar con hambre o frío.' },
      { label: 'Negras, oscuras o con muchas muertas', nivel: 'crisis', accion: 'Lote en problema grave. Revisa temperatura (mínimo 24°C), humedad y si hay tóxicos en el sustrato.' },
    ],
  },
  {
    id: 'movimiento', categoria: 'Comportamiento', pregunta: '¿Cómo se mueven?',
    opciones: [
      { label: 'Activas, moviéndose y comiendo bien', nivel: 'ok' },
      { label: 'Lentas, poco activas', nivel: 'alerta', accion: 'Puede ser frío o hambre. Verifica temperatura y que tengan suficiente sustrato.' },
      { label: 'Quietas, inmóviles o muy pocas vivas', nivel: 'crisis', accion: 'Emergencia. Revisa temperatura inmediatamente y descarta contaminación con detergentes, cítricos o aceites.' },
    ],
  },
  {
    id: 'olor', categoria: 'Sustrato', pregunta: '¿Cómo huele el sustrato?',
    opciones: [
      { label: 'Olor a tierra húmeda o fermentado suave', nivel: 'ok' },
      { label: 'Ácido fuerte o un poco incómodo', nivel: 'alerta', accion: 'Agrega material seco (aserrín, cascarilla) para equilibrar el pH y drenar exceso de líquidos.' },
      { label: 'A podrido o amoniaco intenso', nivel: 'crisis', accion: 'El sustrato está en crisis. Saca las larvas, mezcla con material seco y airea urgente.' },
    ],
  },
  {
    id: 'humedad', categoria: 'Sustrato', pregunta: '¿Cómo está la humedad del sustrato?',
    opciones: [
      { label: 'Húmedo, como esponja bien exprimida', nivel: 'ok' },
      { label: 'Seco por zonas o muy apelmazado', nivel: 'alerta', accion: 'Humedece con agua en spray. El sustrato seco frena el crecimiento.' },
      { label: 'Encharcado, con líquido visible', nivel: 'crisis', accion: 'Agrega material seco urgente (aserrín, cartón triturado). El exceso de agua pudre el sustrato.' },
    ],
  },
  {
    id: 'temperatura', categoria: 'Ambiente', pregunta: '¿Cuál es la temperatura donde están?',
    opciones: [
      { label: 'Entre 28°C y 32°C casi siempre', nivel: 'ok' },
      { label: 'Entre 22°C y 27°C (noches frías)', nivel: 'alerta', accion: 'Las noches frías frenan el crecimiento. Cubre el sustrato por las noches o muévelo a lugar más cálido.' },
      { label: 'Menos de 22°C o más de 35°C', nivel: 'crisis', accion: 'Temperatura fuera de rango. Por debajo de 20°C las larvas entran en letargo. Por encima de 36°C se estresa el lote.' },
    ],
  },
  {
    id: 'dias', categoria: 'Ciclo', pregunta: '¿En qué día del ciclo está el lote?',
    opciones: [
      { label: 'Día 5 al 18 (crecimiento activo)', nivel: 'ok' },
      { label: 'Día 1 al 4 (muy reciente)', nivel: 'alerta', accion: 'Lote muy nuevo. Es normal que no veas mucho movimiento aún. Dale tiempo.' },
      { label: 'Día 19 en adelante (prepupas saliendo)', nivel: 'alerta', accion: 'Las larvas ya quieren migrar. Si no cosechaste aún, hazlo pronto o pon trampas de madera para que puedan pupar.' },
    ],
  },
];

type NivelTotal = 'saludable' | 'alerta' | 'crisis';

function calcularNivel(respuestas: Record<SintomaId, string>): NivelTotal {
  const niveles = Object.entries(respuestas).map(([id, label]) => {
    const s = SINTOMAS.find(s => s.id === id);
    return s?.opciones.find(o => o.label === label)?.nivel ?? 'ok';
  });
  if (niveles.some(n => n === 'crisis')) return 'crisis';
  if (niveles.some(n => n === 'alerta')) return 'alerta';
  return 'saludable';
}

const NIVELES_CONFIG = {
  saludable: {
    emoji: '🟢', label: 'Tu colonia está saludable', color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.08)', colorBorder: 'rgba(34,197,94,0.25)',
    desc: 'Todo apunta a que tu lote está dentro del rango normal. Sigue con el manejo actual y cosecha entre los días 15-18 para obtener las larvas en su mejor punto.',
    waMsg: 'Hola Juliana! Hice el diagnóstico de mi colonia BSF y salió saludable. Tengo ganas de escalar mi producción. ¿El Programa Colonia me puede ayudar con eso?',
  },
  alerta: {
    emoji: '🟡', label: 'Tu colonia tiene señales de alerta', color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.08)', colorBorder: 'rgba(245,158,11,0.25)',
    desc: 'Hay uno o más puntos que necesitan atención antes de que se vuelvan un problema mayor. Revisa las acciones recomendadas abajo — casi siempre son ajustes sencillos.',
    waMsg: 'Hola Juliana! Hice el diagnóstico de mi colonia BSF y me salieron algunas alertas. ¿Me puedes orientar sobre qué hacer?',
  },
  crisis: {
    emoji: '🔴', label: 'Tu colonia necesita intervención urgente', color: '#ef4444',
    colorBg: 'rgba(239,68,68,0.08)', colorBorder: 'rgba(239,68,68,0.25)',
    desc: 'Uno o más indicadores están en zona crítica. Actúa hoy — entre más rápido, más larvas puedes salvar. Revisa las acciones detalladas abajo.',
    waMsg: 'Hola Juliana! Mi colonia BSF está en crisis según el diagnóstico que hice. Necesito orientación urgente sobre qué hacer.',
  },
};

export default function SaludColoniaPage() {
  const [respuestas, setRespuestas] = useState<Record<SintomaId, string>>({});
  const [mostrarRes, setMostrarRes] = useState(false);

  useEffect(() => {
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'salud-colonia' }),
    });
  }, []);

  const respondidas = Object.keys(respuestas).length;
  const completo = respondidas === SINTOMAS.length;

  function seleccionar(id: SintomaId, label: string) {
    setRespuestas(prev => ({ ...prev, [id]: label }));
    setMostrarRes(false);
  }

  const nivel = calcularNivel(respuestas);
  const cfg = NIVELES_CONFIG[nivel];

  const acciones = completo ? SINTOMAS.flatMap(s => {
    const sel = respuestas[s.id];
    const op = s.opciones.find(o => o.label === sel);
    return op?.accion ? [{ cat: s.categoria, preg: s.pregunta, accion: op.accion, nivel: op.nivel }] : [];
  }) : [];

  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, ${C.card} 100%)`,
        borderBottom: '1px solid rgba(245,158,11,0.2)',
        padding: '48px 24px 40px',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Link href="/blog" style={{ color: C.muted, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            ← Blog
          </Link>
          <div style={{
            display: 'inline-block', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            color: C.amberL, fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '4px 14px', borderRadius: 20, marginBottom: 18,
          }}>
            Diagnóstico de colonia
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 34px)', fontWeight: 800, color: C.text2, lineHeight: 1.2, margin: '0 0 14px' }}>
            ¿Tu colonia BSF <span style={{ color: C.amberL }}>está bien</span> o hay algo que resolver?
          </h1>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Responde 6 preguntas sobre lo que ves hoy en tu lote — resultado instantáneo con diagnóstico y acciones concretas.
          </p>
        </div>
      </div>

      {/* PREGUNTAS */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '36px 20px 80px' }}>

        {SINTOMAS.map((s, si) => {
          const sel = respuestas[s.id];
          return (
            <div key={s.id} style={{
              marginBottom: 20,
              background: C.card, borderRadius: 16,
              border: sel ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700, color: C.amberL,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  padding: '2px 9px', borderRadius: 8, marginBottom: 8, letterSpacing: 0.5,
                }}>
                  {s.categoria}
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text2, lineHeight: 1.4 }}>{s.pregunta}</div>
              </div>
              <div style={{ padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {s.opciones.map((op, oi) => {
                  const isSelected = sel === op.label;
                  const nivelColor = op.nivel === 'ok' ? '#22c55e' : op.nivel === 'alerta' ? '#f59e0b' : '#ef4444';
                  return (
                    <button
                      key={oi}
                      onClick={() => seleccionar(s.id, op.label)}
                      style={{
                        width: '100%', padding: '11px 16px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        border: isSelected ? `1.5px solid ${nivelColor}55` : '1px solid rgba(255,255,255,0.07)',
                        background: isSelected ? `${nivelColor}14` : 'rgba(255,255,255,0.02)',
                        color: isSelected ? C.text2 : C.muted, fontSize: 14,
                        fontWeight: isSelected ? 700 : 400, transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                    >
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: isSelected ? nivelColor : 'rgba(255,255,255,0.15)',
                      }} />
                      {op.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Progreso */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted2, marginBottom: 8 }}>
            <span>{respondidas} de {SINTOMAS.length} preguntas</span>
            {completo && <span style={{ color: C.green }}>✓ Completo</span>}
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
            <div style={{
              height: '100%', borderRadius: 4, background: C.amber,
              width: `${(respondidas / SINTOMAS.length) * 100}%`, transition: 'width 0.3s',
            }} />
          </div>
        </div>

        <button
          onClick={() => setMostrarRes(true)}
          disabled={!completo}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 800, border: 'none',
            cursor: completo ? 'pointer' : 'not-allowed',
            background: completo ? C.amber : 'rgba(255,255,255,0.07)',
            color: completo ? '#000' : C.muted2, transition: 'all 0.2s', marginBottom: 32,
          }}
        >
          Ver diagnóstico de mi colonia 🔍
        </button>

        {/* RESULTADO */}
        {mostrarRes && completo && (
          <div>
            <div style={{
              background: cfg.colorBg, border: `1px solid ${cfg.colorBorder}`,
              borderRadius: 20, padding: '28px 24px', marginBottom: 20,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cfg.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: cfg.color, marginBottom: 10 }}>{cfg.label}</div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{cfg.desc}</p>
            </div>

            {/* Acciones */}
            {acciones.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>Acciones recomendadas:</div>
                {acciones.map((a, ai) => {
                  const color = a.nivel === 'crisis' ? C.red : C.amber;
                  return (
                    <div key={ai} style={{
                      background: `${color}0d`, border: `1px solid ${color}30`,
                      borderRadius: 12, padding: '14px 16px', marginBottom: 10,
                    }}>
                      <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        {a.cat} {a.nivel === 'crisis' ? '⚠️ Urgente' : ''}
                      </div>
                      <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{a.accion}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            <div style={{
              background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '24px',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.text2, marginBottom: 8 }}>
                Acompañamiento real cuando lo necesitas
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 20px' }}>
                En el <strong style={{ color: C.greenL }}>Programa Colonia</strong> tienes a Juliana respondiendo tus dudas durante las 5 semanas — y el grupo de WhatsApp sigue activo hasta 60 días después de la última clase, además del foro con otros productores.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/colonia" style={{
                  flex: 1, minWidth: 150, padding: '13px 20px', borderRadius: 12, textAlign: 'center',
                  background: C.green, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none',
                }}>
                  Ver Programa Colonia
                </Link>
                <a
                  href={`https://wa.me/573223212293?text=${encodeURIComponent(cfg.waMsg)}`}
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
    </main>
  );
}
