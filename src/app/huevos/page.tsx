'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  bg:     '#0d1b2a',
  bg2:    '#0a1628',
  card:   '#152035',
  card2:  '#1e3050',
  sky:    '#0ea5e9',
  skyL:   '#38bdf8',
  skyD:   '#0284c7',
  green:  '#22c55e',
  greenL: '#4ade80',
  amber:  '#f59e0b',
  text:   '#e2e8f0',
  muted:  '#94a3b8',
  border: 'rgba(14,165,233,0.2)',
};

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
});

const WA_COL = encodeURIComponent('Hola Juliana, quiero comprar huevos BSF. Soy de Colombia 🇨🇴');
const WA_VEN = encodeURIComponent('Hola Juliana, soy de Venezuela 🇻🇪 y quiero conseguir huevos BSF. ¿Me puedes conectar con el distribuidor?');
const WA_MEX = encodeURIComponent('Hola Juliana, soy de México 🇲🇽 y quiero conseguir huevos BSF. ¿Me puedes conectar con el distribuidor?');
const WA_INT = encodeURIComponent('Hola Juliana, me interesa conseguir huevos BSF. Soy de [mi país] y quiero información sobre distribución.');

const FAQS = [
  { q: '¿Qué son exactamente los huevos BSF?', a: 'Son los huevos de la Mosca Soldado Negra (Hermetia illucens) listos para eclosionar. Cada gramo contiene entre 5.000 y 8.000 huevos viables. Al activarlos correctamente en sustrato orgánico, eclosionan en 3–5 días y tienes neonatos listos para crecer.' },
  { q: '¿Cómo llegan los huevos a mi casa?', a: 'Los huevos se envasan en una pequeña cantidad de sustrato que los protege durante el transporte y se envían por mensajería nacional. El tiempo de entrega es 1–3 días hábiles dentro de Colombia. El costo de envío es adicional y se coordina al momento del pedido según tu ciudad.' },
  { q: '¿Cuántas larvas obtengo de 1 gramo?', a: 'Con 1 gramo de huevos puedes obtener hasta 25.000 larvas. Con manejo adecuado puedes llegar a cosechar entre 2 y 4 kg de larva viva en el primer ciclo completo (21–28 días).' },
  { q: '¿Necesito experiencia previa para activarlos?', a: 'No. Recibes instrucciones detalladas de activación con tu pedido. Además tienes acceso gratuito al Monitor ProLarva — la app con guías paso a paso y tracker de tu ciclo. Si algo sale diferente a lo esperado, nos escribes por WhatsApp.' },
  { q: '¿Hacen envíos a Venezuela o México?', a: 'Para Venezuela y México trabajamos con distribuidores locales. Escríbenos por WhatsApp indicando tu país y te conectamos con el distribuidor más cercano para que recibas tu semilla sin complicaciones internacionales.' },
  { q: '¿Cuántos gramos necesito para empezar?', a: 'Con 1 gramo tienes más que suficiente para tu primer lote. Es la cantidad que recomendamos para empezar: aprendes el manejo, ves los resultados en tu granja y luego escalas sin problema.' },
  { q: '¿Qué hago si los huevos no eclosionan?', a: 'La viabilidad depende principalmente de la temperatura (25–32°C ideal) y la humedad del sustrato. Si seguiste el protocolo y no ves actividad en más de 7 días, nos avisas por WhatsApp — evaluamos y buscamos solución juntos.' },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={onToggle} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: open ? C.skyL : C.text, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: C.sky, fontSize: '1.4rem', flexShrink: 0, display: 'inline-block', transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} style={{ paddingBottom: 20 }}>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.8, margin: 0 }}>{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function HuevosPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://prolarva.co/huevos');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '90px 20px 72px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 10 }}>
          <button onClick={handleCopy} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '6px 14px', borderRadius: 8, background: copied ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.04)', border: copied ? '1px solid rgba(14,165,233,0.3)' : '1px solid rgba(255,255,255,0.08)', color: copied ? C.skyL : C.muted, transition: 'all 0.2s' }}>
            {copied ? '✓ ¡Copiado!' : '🔗 Copiar enlace'}
          </button>
        </div>

        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.07) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div {...up(0.05)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 22, fontSize: '0.8rem', color: C.skyL, fontWeight: 700 }}>
          🥚 Semilla BSF Original · Disponible para envío
        </motion.div>

        <motion.h1 {...up(0.1)} style={{ fontSize: 'clamp(1.85rem, 4.5vw + 0.5rem, 3.2rem)', fontWeight: 900, margin: '0 auto 22px', maxWidth: 780, lineHeight: 1.1 }}>
          Huevos BSF por Gramo —{' '}
          <span style={{ color: C.skyL, textShadow: `0 0 40px ${C.sky}60` }}>Arranca Tu Colonia Desde Cero</span>
        </motion.h1>

        <motion.p {...up(0.15)} style={{ fontSize: '1.1rem', color: C.muted, margin: '0 auto 20px', maxWidth: 560, lineHeight: 1.7 }}>
          Huevos de Mosca Soldado Negra (<em>Hermetia illucens</em>) listos para activar. Con 1 gramo puedes obtener hasta 25.000 larvas — suficiente para tu primer lote completo.
        </motion.p>

        <motion.div {...up(0.18)} style={{ display: 'inline-block', background: 'rgba(14,165,233,0.08)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 28px', marginBottom: 32 }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: C.skyL, lineHeight: 1 }}>$120.000 COP</div>
          <div style={{ fontSize: '0.82rem', color: C.muted, marginTop: 4 }}>por gramo · envío adicional según tu ciudad</div>
        </motion.div>

        <motion.div {...up(0.22)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <a
            href={`https://wa.me/573223212293?text=${WA_COL}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: `linear-gradient(135deg, ${C.sky}, ${C.skyD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', textDecoration: 'none', boxShadow: `0 8px 36px ${C.sky}40`, letterSpacing: '0.02em' }}
          >
            🇨🇴 Pedir desde Colombia
          </a>
          <a
            href={`https://wa.me/573223212293?text=${WA_INT}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'rgba(14,165,233,0.08)', color: C.skyL, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: `1px solid ${C.border}` }}
          >
            🌎 Venezuela · México · Otro país
          </a>
        </motion.div>
      </section>

      {/* ── QUÉ SON ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.skyL }}>
            La Base de Todo Ciclo BSF
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 48px', fontSize: '0.97rem', lineHeight: 1.65 }}>
            Sin huevos de calidad no hay larva. Esta es la semilla que activa tu sistema desde el día uno.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🥚', title: 'Hasta 25.000 larvas por gramo', desc: 'Un solo gramo de huevos puede generar hasta 25.000 larvas — más que suficiente para arrancar tu ciclo y escalar.' },
              { emoji: '⏱️', title: 'Eclosión en 3 – 5 días', desc: 'Bajo condiciones normales de temperatura (25–32°C) y humedad, los neonatos aparecen rápido.' },
              { emoji: '🌡️', title: 'Cepa tropical adaptada', desc: 'BSF nativa del trópico. Se adapta perfectamente a los climas cálidos de Colombia, Venezuela y México.' },
              { emoji: '📦', title: 'Envasado en sustrato protector', desc: 'Los huevos viajan acompañados de material orgánico que los mantiene viables durante el transporte.' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.08)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px 20px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{item.emoji}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.skyL, margin: '0 0 8px', lineHeight: 1.3 }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA EL PEDIDO ── */}
      <section style={{ padding: '72px 20px', background: C.bg }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 44px', color: C.skyL }}>
            ¿Cómo Funciona el Pedido?
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '1', emoji: '💬', title: 'Escríbenos por WhatsApp', desc: 'Dinos cuántos gramos necesitas y tu ciudad. Confirmamos disponibilidad al instante.' },
              { num: '2', emoji: '🚚', title: 'Coordinamos el envío', desc: 'El costo de envío es adicional y varía según tu ciudad dentro de Colombia. Para Venezuela y México, te conectamos con el distribuidor local.' },
              { num: '3', emoji: '🥚', title: 'Recibes tu semilla', desc: 'Llegan en 1–3 días hábiles. Con instrucciones de activación y acceso al Monitor ProLarva incluido sin costo.' },
            ].map((step, i) => (
              <motion.div key={i} {...up(i * 0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.sky}, ${C.skyD})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem', flexShrink: 0 }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{step.emoji}</div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, margin: '0 0 8px' }}>{step.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...up(0.3)} style={{ marginTop: 28, background: `linear-gradient(135deg, ${C.sky}18, ${C.skyD}08)`, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Precio por gramo</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: C.skyL, lineHeight: 1 }}>$120.000 COP</div>
              <div style={{ fontSize: '0.82rem', color: C.muted, marginTop: 4 }}>≈ $28 USD · Envío adicional</div>
            </div>
            <a
              href={`https://wa.me/573223212293?text=${WA_COL}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: `linear-gradient(135deg, ${C.sky}, ${C.skyD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              💬 Pedir ahora
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── ENVÍO Y DISTRIBUCIÓN ── */}
      <section style={{ padding: '72px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.skyL }}>
            Llegamos a Donde Estés
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 48px', fontSize: '0.97rem', lineHeight: 1.65 }}>
            Colombia tiene envío directo. Venezuela y México tienen distribuidores locales para que no tengas que hacer nada de importación.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

            <motion.div {...up(0)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🇨🇴</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: C.text, margin: '0 0 14px' }}>Colombia</h3>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Envío por mensajería nacional',
                  '1–3 días hábiles según tu ciudad',
                  'Costo de envío adicional (lo coordinamos contigo)',
                  'Cubrimos todo el país',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.87rem', color: C.muted, lineHeight: 1.5 }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/573223212293?text=${WA_COL}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: `linear-gradient(135deg, ${C.sky}, ${C.skyD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none' }}>
                💬 Pedir por WhatsApp
              </a>
            </motion.div>

            <motion.div {...up(0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🇻🇪</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: C.text, margin: '0 0 14px' }}>Venezuela</h3>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Distribuidor local disponible',
                  'Coordinación directa en tu zona',
                  'Precios en moneda local',
                  'Escríbenos y te conectamos hoy',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.87rem', color: C.muted, lineHeight: 1.5 }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/573223212293?text=${WA_VEN}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'rgba(14,165,233,0.1)', color: C.skyL, borderRadius: 10, fontFamily: 'inherit', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', border: `1px solid ${C.border}` }}>
                💬 Pedir por WhatsApp
              </a>
            </motion.div>

            <motion.div {...up(0.2)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🇲🇽</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: C.text, margin: '0 0 14px' }}>México</h3>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Distribuidor local disponible',
                  'Coordinación directa en tu zona',
                  'Precios en moneda local',
                  'Escríbenos y te conectamos hoy',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.87rem', color: C.muted, lineHeight: 1.5 }}>
                    <span style={{ color: C.green, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <a href={`https://wa.me/573223212293?text=${WA_MEX}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'rgba(14,165,233,0.1)', color: C.skyL, borderRadius: 10, fontFamily: 'inherit', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', border: `1px solid ${C.border}` }}>
                💬 Pedir por WhatsApp
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── LO QUE INCLUYE ── */}
      <section style={{ padding: '72px 20px', background: C.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.skyL }}>
            Más Que Solo Huevos
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 500, margin: '0 auto 44px', fontSize: '0.97rem', lineHeight: 1.65 }}>
            Con tu pedido recibes herramientas para que el ciclo arranque bien desde el primer día
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

            {/* Huevos */}
            <motion.div {...up(0)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>🥚</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>Huevos BSF</div>
                  <div style={{ fontSize: '0.75rem', color: C.sky, fontWeight: 700 }}>Lo que pediste</div>
                </div>
              </div>
              <p style={{ fontSize: '0.87rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>1 gramo de huevos viables listos para activar, envasados en sustrato protector para el transporte. Instrucciones de activación incluidas.</p>
            </motion.div>

            {/* Monitor */}
            <motion.div {...up(0.12)} style={{ background: C.card, border: `1px solid ${C.green}35`, borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.green}, #16a34a)`, borderRadius: '16px 16px 0 0' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: C.green, color: '#0a1628', fontSize: '0.62rem', fontWeight: 900, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>OBSEQUIO</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>📱</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>Monitor ProLarva</div>
                  <div style={{ fontSize: '0.75rem', color: C.greenL, fontWeight: 700 }}>App de seguimiento BSF</div>
                </div>
              </div>
              <p style={{ fontSize: '0.87rem', color: C.muted, lineHeight: 1.7, margin: '0 0 14px' }}>
                Tracker de lotes, guías de manejo paso a paso, alertas de cosecha, calculadora de ahorro y protocolo anti-crisis. Todo en tu celular — sin costo adicional.
              </p>
              <Link href="/" style={{ fontSize: '0.82rem', color: C.green, fontWeight: 700, textDecoration: 'none' }}>Ver la app →</Link>
            </motion.div>

            {/* Plantillas próximamente */}
            <motion.div {...up(0.24)} style={{ background: C.card, border: '1px dashed rgba(245,158,11,0.35)', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(245,158,11,0.15)', color: C.amber, fontSize: '0.62rem', fontWeight: 900, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.35)', letterSpacing: '0.04em' }}>PRÓXIMAMENTE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>📋</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>Plantillas de Tracker</div>
                  <div style={{ fontSize: '0.75rem', color: C.amber, fontWeight: 700 }}>Hojas de seguimiento</div>
                </div>
              </div>
              <p style={{ fontSize: '0.87rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>
                Plantillas descargables para registrar alimentación, temperatura, cosechas y conversión por lote. Se incluirán automáticamente con cada pedido cuando estén listas.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── COMPARATIVA: HUEVOS vs COLONIA ── */}
      <section style={{ padding: '72px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.skyL }}>
            ¿Solo la Semilla o el Programa Completo?
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 500, margin: '0 auto 40px', fontSize: '0.97rem', lineHeight: 1.65 }}>
            Elige según tu momento actual
          </motion.p>

          <motion.div {...up(0.1)} style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ background: `${C.sky}10`, padding: '24px', borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 20, background: C.sky, color: '#0a1628', fontSize: '0.62rem', fontWeight: 900, padding: '4px 12px', borderRadius: '0 0 8px 8px', letterSpacing: '0.06em' }}>ESTÁS AQUÍ</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.skyL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Huevos BSF · 1 gr</div>
                <div style={{ fontWeight: 900, color: C.text, fontSize: '1rem', marginBottom: 4 }}>Arranca ya — sin curso</div>
                <div style={{ fontSize: '0.82rem', color: C.skyL, fontWeight: 700 }}>$120.000 COP + envío</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', padding: '24px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.greenL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Programa Colonia</div>
                <div style={{ fontWeight: 900, color: C.text, fontSize: '1rem', marginBottom: 4 }}>Aprende en vivo con el grupo</div>
                <div style={{ fontSize: '0.82rem', color: C.muted }}>$400.000 COP · ~$95 USD</div>
              </div>
            </div>
            {[
              { label: 'Semilla BSF',         huevos: '✅ 1 gr de huevos incluido',           colonia: '✅ Incluida en el programa' },
              { label: 'Acompañamiento',       huevos: 'Instrucciones + WhatsApp de soporte',  colonia: '8 clases en vivo con Juliana' },
              { label: 'Red de productores',   huevos: '—',                                    colonia: '30 productores activos + grupo' },
              { label: 'App Monitor ProLarva', huevos: '✅ Incluida (obsequio)',                colonia: '✅ Incluida' },
              { label: 'Plantillas tracker',   huevos: 'Próximamente',                         colonia: '✅ Fichas semanales' },
              { label: 'Precio',               huevos: '$120.000 COP + envío',                 colonia: '$400.000 COP todo incluido' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
                <div style={{ background: i % 2 === 0 ? `${C.sky}06` : 'transparent', padding: '16px 24px', borderRight: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '0.68rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{row.label}</div>
                  <div style={{ fontSize: '0.85rem', color: C.text }}>{row.huevos}</div>
                </div>
                <div style={{ background: i % 2 === 0 ? 'rgba(34,197,94,0.04)' : 'transparent', padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.68rem', opacity: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{row.label}</div>
                  <div style={{ fontSize: '0.85rem', color: C.text }}>{row.colonia}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
              <div style={{ background: `${C.sky}06`, padding: '20px 24px', borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.68rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ideal si</div>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>Ya tienes algo de conocimiento o quieres explorar BSF antes de entrar al programa — solo necesitas la semilla para arrancar</p>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.05)', padding: '20px 24px' }}>
                <div style={{ fontSize: '0.68rem', color: C.greenL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ideal si</div>
                <p style={{ fontSize: '0.85rem', color: C.text, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>Quieres aprender en vivo, con acompañamiento real y salir además con contactos de productores activos</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...up(0.2)} style={{ textAlign: 'center', marginTop: 22 }}>
            <Link href="/colonia" style={{ fontSize: '0.88rem', color: C.green, fontWeight: 700, textDecoration: 'none' }}>
              Ver el Programa Colonia completo →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 20px', background: C.bg }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 44px', color: C.skyL }}>
            Preguntas Frecuentes
          </motion.h2>
          <motion.div {...up(0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '8px 28px 4px' }}>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} open={faqOpen === i} onToggle={() => setFaqOpen(faqOpen === i ? null : i)} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '90px 20px', textAlign: 'center', background: `linear-gradient(135deg, ${C.bg2}, ${C.bg})`, borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, ${C.sky}12, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.h2 {...up()} style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: '0 auto 16px', maxWidth: 680, lineHeight: 1.15, position: 'relative', color: C.skyL }}>
          Tu Primer Lote Empieza con 1 Gramo
        </motion.h2>
        <motion.p {...up(0.08)} style={{ color: C.muted, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.65, position: 'relative' }}>
          Escríbenos y en menos de 24 horas tienes tu pedido en camino
        </motion.p>
        <motion.div {...up(0.15)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, position: 'relative' }}>
          <a
            href={`https://wa.me/573223212293?text=${WA_COL}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 40px', background: `linear-gradient(135deg, ${C.sky}, ${C.skyD})`, color: '#fff', borderRadius: 12, fontFamily: 'inherit', fontWeight: 900, fontSize: '1.05rem', textDecoration: 'none', boxShadow: `0 8px 36px ${C.sky}45` }}
          >
            🇨🇴 Pedir desde Colombia
          </a>
          <a
            href={`https://wa.me/573223212293?text=${WA_INT}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'rgba(14,165,233,0.08)', color: C.skyL, borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: `1px solid ${C.border}` }}
          >
            🌎 Venezuela · México · Otro país
          </a>
          <p style={{ fontSize: '0.82rem', color: `${C.muted}80`, marginTop: 4 }}>
            💬 Respondemos en minutos · WhatsApp +57 322 321 2293
          </p>
        </motion.div>
      </section>

    </div>
  );
}
