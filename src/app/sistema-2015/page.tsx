'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const C = {
  bg:     '#0d1b2a',
  bg2:    '#0a1628',
  card:   '#152035',
  card2:  '#1e3050',
  green:  '#22c55e',
  greenL: '#4ade80',
  greenD: '#16a34a',
  text:   '#e2e8f0',
  muted:  '#94a3b8',
  border: 'rgba(14,165,233,0.15)',
};

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const, delay },
});

function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const dur = 2000;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

export default function Sistema2015Page() {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '90px 20px 72px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Dot pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.09) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
        {/* Green glow top */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Juliana avatar */}
        <motion.div {...up(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <img src="/juliana.jpg" alt="Juliana Coronel — ProLarva" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `3px solid ${C.green}`, boxShadow: `0 0 24px ${C.green}50` }} />
            <span style={{ position: 'absolute', bottom: 0, right: -4, background: C.green, borderRadius: '50%', width: 22, height: 22, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a1628', fontWeight: 900 }}>✓</span>
          </div>
        </motion.div>

        <motion.div {...up(0.05)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 22, fontSize: '0.8rem', color: C.greenL, fontWeight: 700 }}>
          🌱 Sistema ProLarva 20/15
        </motion.div>

        <motion.h1 {...up(0.1)} style={{ fontSize: 'clamp(1.85rem, 4.5vw + 0.5rem, 3.2rem)', fontWeight: 900, margin: '0 auto 22px', maxWidth: 840, lineHeight: 1.1 }}>
          Produce Tu Propia{' '}
          <span style={{ color: C.greenL, textShadow: `0 0 40px ${C.green}60` }}>Súper Proteína</span>{' '}
          y Reduce 25% el Concentrado en 20 Días
        </motion.h1>

        <motion.p {...up(0.15)} style={{ fontSize: '1.15rem', color: C.muted, margin: '0 auto 32px', maxWidth: 560, lineHeight: 1.65 }}>
          Desde tu traspatio, sin experiencia previa, sin depender de nadie más
        </motion.p>

        {/* Mini stats row */}
        <motion.div {...up(0.2)} style={{ display: 'flex', justifyContent: 'center', gap: 36, marginBottom: 40, flexWrap: 'wrap' }}>
          {[
            { to: 25, suf: '%', label: 'menos concentrado' },
            { to: 20, suf: ' días', label: 'primer resultado' },
            { to: 40, suf: '%', label: 'proteína BSF' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: C.greenL, lineHeight: 1 }}>
                <CountUp to={s.to} suffix={s.suf} />
              </div>
              <div style={{ fontSize: '0.7rem', color: C.muted, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div {...up(0.25)}>
          <a href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20quiero%20comprar%20el%20Kit%20ProLarva%2020%2F15"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 38px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 8px 36px ${C.green}45`, letterSpacing: '0.02em' }}>
            💬 Quiero Mi Kit Ahora
          </a>
        </motion.div>
      </section>

      {/* ── PROBLEMA ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', maxWidth: 700, lineHeight: 1.2, color: C.greenL }}>
            El Concentrado Te Está Quebrando
          </motion.h2>
          <motion.p {...up(0.05)} style={{ maxWidth: 540, margin: '0 auto 44px', color: C.muted, fontSize: '0.97rem', lineHeight: 1.65, textAlign: 'center' }}>
            El dolor real de los pequeños productores colombianos
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '📈', title: 'El costo sube cada mes', body: 'El concentrado aumenta sin control. Tus márgenes se destruyen sin hacer nada distinto.', d: 0 },
              { emoji: '💸', title: 'La rentabilidad desaparece', body: 'Producir gallinas, peces o cerdos de calidad cada vez te cuesta más. La plata se va sola.', d: 0.1 },
              { emoji: '🔗', title: 'Dependés del proveedor', body: 'No tenés control. Todo depende del precio y de lo que haya disponible en la tienda.', d: 0.2 },
            ].map((card, i) => (
              <motion.div key={i} {...up(card.d)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{card.emoji}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 10px', color: C.greenL }}>{card.title}</h4>
                <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.7, margin: 0 }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA — flujo visual ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            Así de Simple — 4 Pasos
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 56px', fontSize: '0.97rem', lineHeight: 1.6 }}>
            Del kit en tus manos a la primera cosecha, sin complicaciones
          </motion.p>

          <div className="flow-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap' }}>
            {[
              { num: 1, emoji: '📦', title: 'Recibís el kit', desc: 'Semilla viva BSF, materiales y manual llegan a tu puerta listos para usar' },
              { num: 2, emoji: '🐛', title: 'Activás la semilla', desc: 'Colocás la semilla con residuos orgánicos. Sin tecnología ni equipos especiales' },
              { num: 3, emoji: '⭐', title: 'Cosechás al día 20', desc: 'Las larvas maduras listas. Proteína pura producida en tu propio traspatio' },
              { num: 4, emoji: '🐔', title: 'Das a tus animales', desc: 'Pollos, peces o cerdos más sanos y fuertes. 25% menos concentrado desde el primer lote' },
            ].map((step, i, arr) => (
              <div key={i} className="flow-item" style={{ display: 'flex', alignItems: 'center', flex: '1 1 180px' }}>
                <motion.div {...up(i * 0.12)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 12px', flex: 1 }}>
                  {/* Icon circle */}
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ width: 88, height: 88, borderRadius: '50%', background: `radial-gradient(circle at 40% 40%, ${C.green}30, ${C.card2})`, border: `2px solid ${C.green}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, boxShadow: `0 4px 28px ${C.green}22` }}>
                      {step.emoji}
                    </div>
                    {/* Step badge */}
                    <div style={{ position: 'absolute', top: -6, right: -6, width: 26, height: 26, borderRadius: '50%', background: C.green, color: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{step.num}</div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, margin: '0 0 8px', lineHeight: 1.3 }}>{step.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0, lineHeight: 1.55, maxWidth: 160 }}>{step.desc}</p>
                </motion.div>

                {/* Arrow connector */}
                {i < arr.length - 1 && (
                  <motion.div {...up(i * 0.12 + 0.06)} className="flow-arrow" style={{ fontSize: 26, color: C.green, opacity: 0.45, flexShrink: 0, padding: '0 4px', marginBottom: 60 }}>
                    →
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Result banner */}
          <motion.div {...up(0.5)} style={{ marginTop: 48, padding: '18px 28px', background: `linear-gradient(135deg, ${C.green}18, ${C.greenD}08)`, border: `1px solid ${C.green}40`, borderRadius: 14, textAlign: 'center' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: C.greenL }}>
              🎯 Resultado: en 20 días producís proteína propia y ahorras hasta $50.000 COP al mes por cada 100 animales
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ANIMADOS ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 48px', color: C.greenL }}>
            La Larva Que Lo Cambia Todo
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { to: 25, suf: '%', label: 'Menos Concentrado', desc: 'Reducción real del gasto mensual en alimento', d: 0 },
              { to: 20, suf: ' días', label: 'Primer Resultado', desc: 'Del kit a tu primera cosecha exitosa', d: 0.1 },
              { to: 40, suf: '%', label: 'Proteína Bruta', desc: 'Contenido proteico de la larva madura L5', d: 0.2 },
              { to: 100, suf: '%', label: 'Natural y Propio', desc: 'Sin químicos ni intermediarios, desde tu tierra', d: 0.3 },
            ].map((stat, i) => (
              <motion.div key={i} {...up(stat.d)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '32px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.green}, ${C.greenD})`, borderRadius: '14px 14px 0 0' }} />
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${C.green}10, transparent 65%)`, pointerEvents: 'none' }} />
                <div style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', fontWeight: 900, color: C.greenL, marginBottom: 8, lineHeight: 1 }}>
                  <CountUp to={stat.to} suffix={stat.suf} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{stat.label}</h3>
                <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0, lineHeight: 1.5 }}>{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KIT ILUSTRADO ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            Qué Recibís: El Kit ProLarva 20/15
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 52px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Todo lo que necesitás para empezar el primer día — nada que comprar por separado
          </motion.p>

          {/* Físico */}
          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: `${C.green}30` }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: C.green, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>📦 Componente Físico</span>
            <div style={{ flex: 1, height: 1, background: `${C.green}30` }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 44 }}>
            {[
              { emoji: '🪲', title: 'Semilla Viva BSF', desc: '3 etapas listas para activar' },
              { emoji: '📦', title: 'Recipiente', desc: 'Contenedor de cultivo optimizado' },
              { emoji: '🎯', title: '2 Trampas', desc: 'Para oviposición del ciclo' },
              { emoji: '🕸️', title: 'Toldillo', desc: 'Protección completa del cultivo' },
              { emoji: '🌿', title: 'Planta Artificial', desc: 'Estimula la postura natural' },
              { emoji: '💧', title: 'Spray Humedad', desc: 'Control preciso del ambiente' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.06)} style={{ background: C.card, border: `1px dashed ${C.green}35`, borderRadius: 14, padding: '18px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 62, height: 62, borderRadius: 14, background: `linear-gradient(135deg, ${C.green}22, ${C.greenD}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {item.emoji}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, lineHeight: 1.4 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Pedagógico */}
          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>📚 Componente Pedagógico</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 44 }}>
            {[
              { emoji: '📖', title: 'Manual ProLarva', desc: '"Sistema 20/15" completo impreso' },
              { emoji: '📋', title: 'Ficha de Etapas', desc: 'Seguimiento por cada etapa' },
              { emoji: '📊', title: 'Planilla de Lotes', desc: 'Registro organizado de producción' },
              { emoji: '🗺️', title: 'Guía Paso a Paso', desc: 'Del día 1 al día 20 exacto' },
              { emoji: '🔄', title: 'Diagrama BSF', desc: 'El ciclo completo en una hoja' },
              { emoji: '✅', title: 'Checklist', desc: 'Verificación de preparación' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.06)} style={{ background: C.card, border: '1px dashed rgba(245,158,11,0.35)', borderRadius: 14, padding: '18px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 62, height: 62, borderRadius: 14, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {item.emoji}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, lineHeight: 1.4 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Acompañamiento */}
          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.3)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>👥 Acompañamiento 45 + 180 Días</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.3)' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { emoji: '📱', title: '3 Videollamadas', desc: '45 min/semana con Juliana en vivo' },
              { emoji: '💬', title: 'WhatsApp 24/7', desc: 'Respuestas directas 45 días' },
              { emoji: '🛡️', title: '180 Días Soporte', desc: 'Extendido desde tu primera cosecha' },
              { emoji: '💻', title: 'App Monitor', desc: 'Plataforma web + tracker incluidos' },
              { emoji: '📊', title: 'Tracker Cosecha', desc: 'Registro digital de rendimiento' },
              { emoji: '🎯', title: 'Mentorship Real', desc: 'De alguien que ya lo logró aquí' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.06)} style={{ background: C.card, border: '1px dashed rgba(14,165,233,0.35)', borderRadius: 14, padding: '18px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 62, height: 62, borderRadius: 14, background: 'rgba(14,165,233,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {item.emoji}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, lineHeight: 1.4 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIO ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, margin: '0 0 10px', color: C.greenL }}>
            Tu Inversión
          </motion.h2>
          <motion.div {...up(0.1)} style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenD})`, padding: '44px 32px', borderRadius: 18, marginTop: 36, color: '#fff', boxShadow: `0 20px 60px ${C.green}30` }}>
            <div style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: 10, fontWeight: 600 }}>Precio especial — oferta limitada</div>
            <div style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 6, lineHeight: 1 }}>$200,000 COP</div>
            <div style={{ fontSize: '1rem', opacity: 0.85 }}>≈ $48 USD · Pago único · Todo incluido</div>
          </motion.div>
          <motion.p {...up(0.15)} style={{ color: C.muted, fontSize: '0.95rem', margin: '22px 0 0', lineHeight: 1.6 }}>
            Kit físico + manual + 45 días acompañamiento intensivo + 180 días soporte
          </motion.p>
        </div>
      </section>

      {/* ── BONOS ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.greenL }}>
            Pero Eso No Es Todo…
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, margin: '0 auto 44px', maxWidth: 540, fontSize: '0.97rem', lineHeight: 1.6 }}>
            4 bonos valorados en más de $340 USD, todos incluidos en tu compra
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '1', emoji: '💻', title: 'App Monitor ProLarva + Tracker', value: '$147 USD', desc: 'Plataforma web con guía, alertas automáticas, registro de lotes y tracker de cosechas', d: 0 },
              { num: '2', emoji: '🧮', title: 'Calculadora BSF ProLarva', value: '$97 USD', desc: 'Calcula exactamente cuánto perdés sin BSF y cuánto ahorras con el sistema, por especie', d: 0.1 },
              { num: '3', emoji: '🛡️', title: 'Protocolo Anti-Crisis BSF', value: '$67 USD', desc: 'Árbol de decisión para los 7 imprevistos más comunes: temperatura, plagas, oviposición', d: 0.2 },
              { num: '4', emoji: '✅', title: 'Checklist Arranque Express', value: '$29 USD', desc: 'Las primeras 72 horas paso a paso: preparación, activación de semilla, verificación', d: 0.3 },
            ].map((bono, i) => (
              <motion.div key={i} {...up(bono.d)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.green, color: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.88rem', flexShrink: 0 }}>{bono.num}</div>
                  <div style={{ fontSize: '1.6rem' }}>{bono.emoji}</div>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 6px', color: C.greenL, lineHeight: 1.3 }}>{bono.title}</h4>
                <p style={{ fontSize: '0.8rem', color: C.green, fontWeight: 700, margin: '0 0 10px' }}>Valor: {bono.value}</p>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>{bono.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...up(0.2)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 28 }}>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 700 }}>Si pagaras por separado</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: C.greenL }}>$781 USD</div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenD})`, borderRadius: 14, padding: '24px', textAlign: 'center', color: '#fff', boxShadow: `0 8px 32px ${C.green}30` }}>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 700 }}>Hoy por solo</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 8 }}>$48 USD</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>📊 Ahorras 94%</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 44px', color: C.greenL }}>
            Comprás con Total Seguridad
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔒', title: 'Garantía Incondicional — 7 Días', desc: 'Si en los primeros 7 días decidís que no es para vos, te devolvemos el 100% del dinero. Sin preguntas, sin trámites.', d: 0 },
              { icon: '🎯', title: 'Garantía de Resultado', desc: 'Si seguís el sistema 20 días y no tenés tu primer lote produciendo, Juliana continúa el acompañamiento sin costo adicional hasta que lo logrés.', d: 0.1 },
            ].map((g, i) => (
              <motion.div key={i} {...up(g.d)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px', display: 'flex', gap: 16 }}>
                <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>{g.icon}</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 10px', color: C.greenL }}>{g.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE JULIANA ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ color: C.greenL, textAlign: 'center', margin: '0 auto 36px', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', lineHeight: 1.2, fontWeight: 900 }}>
            ¿Quién Está Detrás de ProLarva?
          </motion.h2>
          <motion.div {...up(0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '40px 32px' }}>
            <div className="juliana-wrap" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Photo col */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <img src="/juliana.jpg" alt="Juliana Coronel — fundadora de ProLarva" style={{ width: 170, height: 170, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `4px solid ${C.green}`, boxShadow: `0 8px 40px ${C.green}35` }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: C.text, fontSize: '0.95rem' }}>Juliana Coronel</div>
                  <div style={{ fontSize: '0.78rem', color: C.muted }}>Fundadora · ProLarva</div>
                  <div style={{ fontSize: '0.75rem', color: C.muted }}>Cúcuta, Colombia 🇨🇴</div>
                </div>
                {/* Placeholder para foto granja */}
                <div className="farm-photo-slot" style={{ width: 170, height: 110, borderRadius: 12, background: `${C.green}10`, border: `1px dashed ${C.green}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 24 }}>🌿</span>
                  <span style={{ fontSize: '0.65rem', color: C.muted, textAlign: 'center', padding: '0 8px' }}>foto granja / larvas</span>
                </div>
              </div>
              {/* Bio col */}
              <div style={{ flex: 1, minWidth: 240 }}>
                {[
                  'Soy productora de larvas BSF en Colombia. Crío mis propios animales de traspatio y soy la fundadora de ProLarva.',
                  'No soy una empresa grande ni un laboratorio. Soy una productora como vos, que encontró una forma de producir más con menos gasto: lo probé en mi propia granja, lo documenté desde el día cero hasta el sacrificio, y decidí empaquetarlo para que otros productores puedan replicarlo.',
                  'Sin experiencia previa. Sin tecnología compleja. Con lo que ya tenés en tu finca.',
                ].map((p, i) => (
                  <p key={i} style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#d4e8da', marginBottom: 14 }}>{p}</p>
                ))}
                <div style={{ marginTop: 18, padding: '14px 18px', background: `${C.green}12`, border: `1px solid ${C.green}30`, borderRadius: 10, fontSize: '0.83rem', color: C.muted, fontStyle: 'italic', lineHeight: 1.65 }}>
                  Para: Pequeños productores colombianos con gallinas, pollos, cerdos o peces — cuya granja es su fuente de ingresos y el concentrado les destruye el margen cada mes.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '90px 20px', textAlign: 'center', background: `linear-gradient(135deg, ${C.bg2}, ${C.bg})`, borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, ${C.green}14, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.h2 {...up()} style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.greenL, marginBottom: 14, position: 'relative' }}>
          ¿Listo para la Independencia Animal?
        </motion.h2>
        <motion.p {...up(0.1)} style={{ fontSize: '1.05rem', color: C.muted, margin: '0 auto 36px', maxWidth: 540, lineHeight: 1.65, position: 'relative' }}>
          Acompañate a los productores colombianos que ya están reduciendo 25% su concentrado y recuperando la rentabilidad
        </motion.p>
        <motion.div {...up(0.15)} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <a href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20quiero%20comprar%20el%20Kit%20ProLarva%2020%2F15"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 38px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 8px 40px ${C.green}45`, letterSpacing: '0.02em' }}>
            💬 Comprar Mi Kit Ahora
          </a>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 32px', border: `2px solid ${C.green}`, color: C.green, background: 'transparent', borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
            Ver Monitor BSF
          </Link>
        </motion.div>
      </section>

      {/* ── CONTACTO ── */}
      <section style={{ padding: '48px 20px', background: C.bg2, textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 10 }}>¿Dudas Antes de Empezar?</h3>
        <p style={{ fontSize: '0.95rem', color: C.muted, margin: '0 auto 20px', maxWidth: 440, lineHeight: 1.6 }}>
          Hablá directamente con Juliana — está aquí para responderte
        </p>
        <a href="https://wa.me/573223212293" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#25D366', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
          💬 WhatsApp — +57 322 321 2293
        </a>
        <p style={{ fontSize: '0.82rem', color: C.muted, margin: '12px 0 0', fontStyle: 'italic' }}>
          Lunes a viernes · 8am – 6pm (hora Colombia)
        </p>
      </section>

      <style>{`
        @media (max-width: 580px) {
          .flow-arrow { display: none !important; }
          .flow-item { flex: 1 1 140px; }
          .juliana-wrap { flex-direction: column; align-items: center; }
          .farm-photo-slot { display: none; }
        }
        @media (max-width: 400px) {
          .flow-wrap { gap: 8px; }
        }
      `}</style>
    </div>
  );
}
