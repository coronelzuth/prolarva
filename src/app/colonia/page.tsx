'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProtocoloCrisisModal from '@/components/ProtocoloCrisisModal';

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

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={onToggle} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: open ? C.greenL : C.text, lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: C.green, fontSize: '1.4rem', flexShrink: 0, display: 'inline-block', transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} style={{ paddingBottom: 20 }}>
          <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.8, margin: 0 }}>{a}</p>
        </motion.div>
      )}
    </div>
  );
}

const FAQS = [
  { q: '¿Necesito experiencia previa con insectos o con larvas?', a: 'Para nada. El programa está diseñado para empezar desde cero. Cada sesión en vivo arranca desde lo más básico y avanza paso a paso. Si puedes alimentar tus animales, puedes manejar BSF.' },
  { q: '¿Qué pasa si no puedo asistir en vivo a una sesión?', a: 'Todas las sesiones se graban y quedan disponibles para que las veas cuando puedas. Lo ideal es asistir en vivo para hacer preguntas, pero si no puedes, no pierdes el contenido.' },
  { q: '¿El programa incluye semilla BSF?', a: 'Sí. El programa incluye semilla BSF viva para que puedas arrancar tu primer lote desde el día uno. Además te enseñamos todo el sistema para que entiendas cómo manejarla, reproducirla y eventualmente generar tu propia semilla sin depender de compras externas.' },
  { q: '¿Por qué solo 20 cupos?', a: 'Para que Juliana pueda responder tus preguntas en vivo de verdad. En grupos grandes nadie puede preguntar. Con 20 personas garantizamos que cada sesión sea un espacio donde todos participan y salen con sus dudas resueltas.' },
  { q: '¿Funciona para pollos, cerdos y peces?', a: 'Sí. El sistema BSF produce larva fresca que puedes darles a los tres. En el programa vemos las raciones y ajustes según la especie que tengas. Productores de pollos de engorde, gallinas ponedoras, peces y cerdos de cría han usado el sistema con resultados documentados.' },
  { q: '¿Qué necesito para empezar el programa?', a: 'Un espacio con sombra desde 1 m², residuos orgánicos de cocina o de tus propios animales, y un celular o computador para asistir a las sesiones. No necesitas equipos especiales ni inversión adicional para seguir el programa.' },
  { q: '¿Funciona en el clima de mi región?', a: 'La BSF es nativa de los trópicos y se adapta perfectamente a los climas cálidos colombianos (26–32°C ideal). Juliana trabaja desde Cúcuta y el sistema funciona en toda la franja tropical y templada del país.' },
  { q: '¿Cuándo recupero lo que invertí?', a: 'En el primer ciclo con tus animales. Con 100 pollos de engorde, el ahorro en concentrado del primer lote de BSF ya cubre el costo del programa. Desde ahí en adelante, todo es ganancia mes a mes.' },
];

const GALLERY: { type: 'image' | 'video'; src: string; caption: string }[] = [
  { type: 'image', src: '/fotos/huevos.msn.jpg',    caption: 'Huevos BSF en sustrato' },
  { type: 'video', src: '/fotos/neonatos.mp4',       caption: 'Neonatos recién eclosionados' },
  { type: 'image', src: '/fotos/huevos.mns.2.jpg',  caption: 'Postura en cartón corrugado' },
  { type: 'video', src: '/fotos/estadios.mp4',       caption: 'Estadios larvales L4' },
  { type: 'image', src: '/fotos/huevos.mns.3.jpg',  caption: 'Vista de cerca — huevos' },
  { type: 'video', src: '/fotos/biglarvae.mp4',      caption: 'Larvas maduras listas para cosechar' },
];

const SEMANAS = [
  {
    num: 1,
    emoji: '🌱',
    title: 'Bases del Sistema',
    items: ['El ciclo completo de la BSF explicado sin tecnicismos', 'Qué espacio necesitas (desde 1 m²)', 'Materiales que ya tienes vs. los que consigues local', 'Cómo activar tu primera semilla correctamente'],
  },
  {
    num: 2,
    emoji: '🐛',
    title: 'Manejo del Lote',
    items: ['Alimentación diaria: qué darles, cuánto y cuándo', 'Control de temperatura y humedad sin equipos especiales', 'Cómo leer el estado de las larvas en cada etapa', 'Qué hacer si algo sale diferente a lo esperado'],
  },
  {
    num: 3,
    emoji: '⚖️',
    title: 'Cosecha y Uso',
    items: ['Cuándo y cómo cosechar (señales exactas)', 'Larva viva, larva seca y harina — cuál usar y cuándo', 'Raciones por especie: pollos, peces y cerdos', 'Cómo documentar tus resultados y calcular el ahorro real'],
  },
  {
    num: 4,
    emoji: '🔄',
    title: 'Ciclo Cerrado',
    items: ['Cómo generar tu propia semilla sin comprar más', 'Montaje de trampas de oviposición', 'Plan de sostenibilidad: cómo mantener el sistema activo solo', 'Preguntas finales + revisión de avances del grupo'],
  },
];

const WA_TEXT = encodeURIComponent('Hola Juliana, quiero inscribirme al Programa ProLarva VIVO');

export default function ColoniaPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showProtocolo, setShowProtocolo] = useState(false);
  const prevSlide = () => setGalleryIdx(i => (i - 1 + GALLERY.length) % GALLERY.length);
  const nextSlide = () => setGalleryIdx(i => (i + 1) % GALLERY.length);
  const handleCopy = () => {
    navigator.clipboard.writeText('https://prolarva.co/colonia');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '90px 20px 72px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 10 }}>
          <button onClick={handleCopy} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            padding: '6px 14px', borderRadius: 8,
            background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
            border: copied ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
            color: copied ? C.greenL : C.muted,
            transition: 'all 0.2s',
          }}>
            {copied ? '✓ ¡Copiado!' : '🔗 Copiar enlace'}
          </button>
        </div>

        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.09) 1px, transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div {...up(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <img src="/juliana.jpg" alt="Juliana Coronel — ProLarva" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `3px solid ${C.green}`, boxShadow: `0 0 24px ${C.green}50` }} />
            <span style={{ position: 'absolute', bottom: 0, right: -4, background: C.green, borderRadius: '50%', width: 22, height: 22, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a1628', fontWeight: 900 }}>✓</span>
          </div>
        </motion.div>

        {/* Escasez badge */}
        <motion.div {...up(0.03)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 14, fontSize: '0.78rem', color: '#fca5a5', fontWeight: 700 }}>
          🔴 Solo 20 cupos por cohorte — grupo cerrado
        </motion.div>

        <motion.div {...up(0.05)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 22, fontSize: '0.8rem', color: C.greenL, fontWeight: 700 }}>
          🎥 Programa en Vivo · 4 Semanas · Cría BSF
        </motion.div>

        <motion.h1 {...up(0.1)} style={{ fontSize: 'clamp(1.85rem, 4.5vw + 0.5rem, 3.2rem)', fontWeight: 900, margin: '0 auto 22px', maxWidth: 840, lineHeight: 1.1 }}>
          Aprende a Criar Larva BSF{' '}
          <span style={{ color: C.greenL, textShadow: `0 0 40px ${C.green}60` }}>en 4 Semanas de Clases en Vivo</span>{' '}
          y Reduce 25% el Concentrado
        </motion.h1>

        <motion.p {...up(0.15)} style={{ fontSize: '1.15rem', color: C.muted, margin: '0 auto 32px', maxWidth: 560, lineHeight: 1.65 }}>
          Un programa corto, grupal y práctico — con Juliana en vivo, máximo 20 productores por grupo, desde tu traspatio
        </motion.p>

        <motion.div {...up(0.2)} style={{ display: 'flex', justifyContent: 'center', gap: 36, marginBottom: 40, flexWrap: 'wrap' }}>
          {[
            { to: 4, suf: ' semanas', label: 'de clases en vivo' },
            { to: 20, suf: ' cupos', label: 'máximo por grupo' },
            { to: 25, suf: '%', label: 'menos concentrado' },
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
          <a href={`https://wa.me/573223212293?text=${WA_TEXT}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 38px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 8px 36px ${C.green}45`, letterSpacing: '0.02em' }}>
            💬 Quiero Mi Cupo Ahora
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
            Y la solución ya existe — solo nadie te la ha enseñado bien
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '📈', title: 'El costo sube cada mes', body: 'El concentrado aumenta sin control. Tus márgenes se destruyen sin hacer nada distinto.', d: 0 },
              { emoji: '💸', title: 'La rentabilidad desaparece', body: 'Producir gallinas, peces o cerdos de calidad cada vez te cuesta más. La plata se va sola.', d: 0.1 },
              { emoji: '🔗', title: 'Dependes del proveedor', body: 'No tienes control. Todo depende del precio y de lo que haya disponible en la tienda.', d: 0.2 },
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

      {/* ── QUÉ ES EL PROGRAMA ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            ProLarva VIVO — Tu Primera Cosecha BSF en 4 Semanas
          </motion.h2>
          <motion.p {...up(0.05)} style={{ color: C.muted, maxWidth: 580, margin: '0 auto 44px', fontSize: '0.97rem', lineHeight: 1.65 }}>
            Un programa corto y grupal donde aprendes todo el sistema BSF directamente con Juliana en sesiones en vivo — sin clases grabadas, sin teoría suelta, sin quedarte solo.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🎥', title: '4 sesiones en vivo', desc: 'Una por semana, con Juliana. Preguntas en tiempo real.' },
              { emoji: '👥', title: 'Máximo 20 personas', desc: 'Grupo pequeño para que todos participen de verdad.' },
              { emoji: '📅', title: '1 mes de duración', desc: 'Intensivo y enfocado. Sin arrastrar el proceso meses.' },
              { emoji: '📲', title: 'Soporte entre sesiones', desc: 'Grupo privado de productores activos vía WhatsApp.' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.08)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{item.emoji}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.greenL, margin: '0 0 8px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.82rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RED DE PRODUCTORES ── */}
      <section style={{ padding: '72px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <motion.div {...up()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: '0.78rem', color: C.greenL, fontWeight: 700 }}>
            🌐 Más que un programa
          </motion.div>
          <motion.h2 {...up(0.05)} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            Te Unes a Una Red de Productores BSF
          </motion.h2>
          <motion.p {...up(0.1)} style={{ color: C.muted, maxWidth: 620, margin: '0 auto 44px', fontSize: '0.97rem', lineHeight: 1.7 }}>
            Al entrar al programa Colonia no solo aprendes a criar larva — te conectas con otros productores colombianos que están haciendo exactamente lo mismo que tú. Comparten avances, resuelven problemas juntos y se abren puertas que solos no tendrían.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🤝', title: 'Contactos reales', desc: 'Conoces a otros productores de tu región o tu nicho. Una red que sigue mucho después del programa.' },
              { emoji: '💡', title: 'Aprendizaje colectivo', desc: 'Lo que le funciona a uno le sirve a todos. El grupo acelera tu curva de aprendizaje.' },
              { emoji: '📦', title: 'Oportunidades de intercambio', desc: 'Semilla, excedentes, clientes potenciales — dentro del grupo aparecen oportunidades que solos no ves.' },
              { emoji: '🌱', title: 'La primera red BSF en Colombia', desc: 'Eres parte de algo más grande: el primer grupo organizado de productores BSF del país.' },
            ].map((item, i) => (
              <motion.div key={i} {...up(i * 0.08)} style={{ background: C.card, border: `1px solid ${C.green}30`, borderRadius: 14, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{item.emoji}</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.greenL, margin: '0 0 8px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.82rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMARIO — 4 SEMANAS ── */}
      <section style={{ padding: '80px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            Lo Que Aprendes Semana a Semana
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 48px', fontSize: '0.97rem', lineHeight: 1.6 }}>
            4 sesiones en vivo, cada una con un objetivo concreto y aplicable desde el día siguiente
          </motion.p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SEMANAS.map((s, i) => (
              <motion.div key={i} {...up(i * 0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `radial-gradient(circle at 40% 40%, ${C.green}30, ${C.card2})`, border: `2px solid ${C.green}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {s.emoji}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Semana {s.num}</span>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: C.text, margin: '0 0 14px', lineHeight: 1.3 }}>
                    <span style={{ color: C.greenL }}>Sesión {s.num}:</span> {s.title}
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.87rem', color: C.muted, lineHeight: 1.5 }}>
                        <span style={{ color: C.green, flexShrink: 0, marginTop: 2 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...up(0.45)} style={{ marginTop: 24, padding: '16px 24px', background: `linear-gradient(135deg, ${C.green}18, ${C.greenD}08)`, border: `1px solid ${C.green}40`, borderRadius: 14, textAlign: 'center' }}>
            <span style={{ fontSize: '0.97rem', fontWeight: 700, color: C.greenL }}>
              🎯 Al terminar la semana 4 ya tienes tu primer lote en marcha y sabes cómo sostener el ciclo solo
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ── */}
      <section style={{ padding: '80px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', lineHeight: 1.2, color: C.greenL }}>
            Todo Lo Que Incluye Tu Inscripción
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 52px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Nada que pagar aparte — todo está adentro desde el día uno
          </motion.p>

          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: `${C.green}30` }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: C.green, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>🎥 En Vivo</span>
            <div style={{ flex: 1, height: 1, background: `${C.green}30` }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 44 }}>
            {[
              { emoji: '📡', title: '4 Sesiones en Vivo', desc: '1 por semana con Juliana, preguntas en tiempo real' },
              { emoji: '🎬', title: 'Grabaciones', desc: 'Disponibles después de cada sesión' },
              { emoji: '💬', title: 'Grupo WhatsApp', desc: 'Soporte entre sesiones, 30 días activo' },
              { emoji: '👥', title: 'Grupo de 20', desc: 'Pequeño para que todos participen de verdad' },
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

          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>📚 Material de Apoyo</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 44 }}>
            {[
              { emoji: '📋', title: 'Fichas Semanales', desc: 'Guía descargable por cada sesión' },
              { emoji: '📊', title: 'Planilla de Lotes', desc: 'Registro organizado de tu producción' },
              { emoji: '🗺️', title: 'Diagrama BSF', desc: 'El ciclo completo en una sola hoja' },
              { emoji: '🔄', title: 'Protocolo de Cosecha', desc: 'Paso a paso para no perder nada' },
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

          <motion.div {...up(0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.3)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>💻 Herramientas Digitales</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.3)' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { emoji: '📱', title: 'App Monitor ProLarva', desc: 'Tracker de lotes, guías y alertas incluidos' },
              { emoji: '🧮', title: 'Calculadora BSF', desc: 'Calcula tu ahorro real antes de empezar' },
              { emoji: '🛡️', title: 'Protocolo Anti-Crisis', desc: 'Los 7 imprevistos más comunes resueltos' },
              { emoji: '🌐', title: 'Comunidad Privada', desc: 'Productores activos con quienes comparar avances' },
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

      {/* ── STATS ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 48px', color: C.greenL }}>
            La Larva Que Lo Cambia Todo
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { to: 25, suf: '%', label: 'Menos Concentrado', desc: 'Reducción real del gasto mensual en alimento', d: 0 },
              { to: 4, suf: ' semanas', label: 'Para Tu Primera Cosecha', desc: 'Del primer día de clases a tu larva produciendo', d: 0.1 },
              { to: 40, suf: '%', label: 'Proteína Bruta', desc: 'Contenido proteico de la larva madura L5', d: 0.2 },
              { to: 20, suf: ' cupos', label: 'Máximo por Grupo', desc: 'Para que Juliana te pueda atender de verdad', d: 0.3 },
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

      {/* ── TESTIMONIOS ── */}
      <section style={{ padding: '72px 20px', background: C.bg }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.greenL }}>
            Productores que Ya Lo Lograron
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 500, margin: '0 auto 48px', fontSize: '0.97rem', lineHeight: 1.6 }}>
            Resultados reales de productores colombianos que aprendieron el sistema con Juliana
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

            <motion.div {...up(0.1)} style={{ background: C.card, border: `1px solid ${C.green}35`, borderRadius: 18, padding: '32px 28px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.green}, ${C.greenD})`, borderRadius: '18px 18px 0 0' }} />
              <div style={{ fontSize: '4rem', color: `${C.green}20`, lineHeight: 0.8, marginBottom: 14, fontFamily: 'Georgia, serif', userSelect: 'none' }}>"</div>
              <p style={{ fontSize: '0.93rem', color: '#d4e8da', lineHeight: 1.85, margin: '0 0 20px', fontStyle: 'italic', flex: 1 }}>
                Probamos un lote de pollos de engorde desde el primer día. Al día 42 tuvimos pollos con más de 3.5 kg y dos ejemplares de 4 kg. Responden muy bien a estos estímulos naturales — su piel es amarilla y vistosa, y presentan menos grasa mala en general. El sistema enseña a manejar harina de larva, larvas secas y vivas, y uno puede escoger lo que más le favorezca.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['⚖️ +3.5 kg día 42', '🏆 2 ejemplares 4 kg', '🌟 Piel amarilla', '💪 Menos grasa'].map((chip, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: `${C.green}15`, border: `1px solid ${C.green}30`, borderRadius: 20, fontSize: '0.72rem', color: C.greenL, fontWeight: 700 }}>{chip}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, ${C.greenD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🧑‍🌾</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: C.text, fontSize: '0.9rem' }}>Nicolás López</div>
                  <div style={{ fontSize: '0.73rem', color: C.muted }}>Pollos de engorde · Colombia</div>
                </div>
                <div style={{ display: 'flex', gap: 1 }}>{'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>{s}</span>)}</div>
              </div>
            </motion.div>

            <motion.div {...up(0.18)} style={{ background: C.card, border: `1px solid rgba(14,165,233,0.35)`, borderRadius: 18, padding: '32px 28px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '18px 18px 0 0' }} />
              <div style={{ fontSize: '4rem', color: 'rgba(14,165,233,0.18)', lineHeight: 0.8, marginBottom: 14, fontFamily: 'Georgia, serif', userSelect: 'none' }}>"</div>
              <p style={{ fontSize: '0.93rem', color: '#d4e8da', lineHeight: 1.85, margin: '0 0 20px', fontStyle: 'italic', flex: 1 }}>
                Juliana es muy paciente, nos guió desde cero y fue muy amable — siempre nos respondía todo. Desarrollamos este proyecto para acuaponía, siguiendo la línea de economía circular. Ya vamos por nuestra tercera cosecha y esperamos producir harina para nuestros peces y gestionar residuos orgánicos mediante la cría de larvas. Ha sido un proceso muy divertido y enriquecedor.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['🐟 Acuaponía', '♻️ Economía circular', '🌱 3ra cosecha', '🧠 Desde cero'].map((chip, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 20, fontSize: '0.72rem', color: '#7dd3fc', fontWeight: 700 }}>{chip}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🧑‍💻</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: C.text, fontSize: '0.9rem' }}>William Fuentes</div>
                  <div style={{ fontSize: '0.73rem', color: C.muted }}>Acuaponía y economía circular · Colombia</div>
                </div>
                <div style={{ display: 'flex', gap: 1 }}>{'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: '0.9rem' }}>{s}</span>)}</div>
              </div>
            </motion.div>

          </div>
          <motion.p {...up(0.25)} style={{ textAlign: 'center', fontSize: '0.82rem', color: `${C.muted}80`, marginTop: 20, fontStyle: 'italic' }}>
            ¿Ya trabajaste con Juliana? Cuéntanos tu resultado por WhatsApp →
          </motion.p>
        </div>
      </section>

      {/* ── PRECIO ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, margin: '0 0 10px', color: C.greenL }}>
            Tu Inversión
          </motion.h2>
          <motion.div {...up(0.1)} style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenD})`, padding: '44px 32px', borderRadius: 18, marginTop: 36, color: '#fff', boxShadow: `0 20px 60px ${C.green}30`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>
              🔴 Solo 20 cupos — cierre al completar
            </div>
            <div style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: 10, fontWeight: 600 }}>4 semanas · Clases en vivo · Todo incluido</div>
            <div style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, marginBottom: 6, lineHeight: 1 }}>$400.000 COP</div>
            <div style={{ fontSize: '1rem', opacity: 0.85 }}>≈ $95 USD · Pago único · Sin mensualidades</div>
          </motion.div>
          <motion.p {...up(0.15)} style={{ color: C.muted, fontSize: '0.95rem', margin: '22px 0 0', lineHeight: 1.6 }}>
            4 sesiones en vivo + grabaciones + grupo WhatsApp + app + material descargable
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
            3 bonos incluidos sin costo adicional
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '1', emoji: '🧮', title: 'Calculadora BSF ProLarva', value: '$97 USD', desc: 'Calcula exactamente cuánto estás perdiendo sin BSF y cuánto ahorras al implementarlo, por especie', d: 0 },
              { num: '2', emoji: '🛡️', title: 'Protocolo Anti-Crisis BSF', value: '$67 USD', desc: 'Guía de respuesta inmediata para los 7 imprevistos más comunes del ciclo: temperatura, humedad, oviposición, mortalidad, plagas y más.', d: 0.1, preview: true },
              { num: '3', emoji: '🌐', title: 'Red de Contactos BSF', value: '$97 USD', desc: 'Grupo privado de productores activos donde se comparten avances, se resuelven problemas juntos y aparecen oportunidades reales: semilla, excedentes, clientes, intercambios entre productores', d: 0.2 },
            ].map((bono, i) => (
              <motion.div key={i} {...up(bono.d)} style={{ background: C.card, border: `1px solid ${'preview' in bono && bono.preview ? 'rgba(245,158,11,0.3)' : C.border}`, borderRadius: 14, padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.green, color: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.88rem', flexShrink: 0 }}>{bono.num}</div>
                  <div style={{ fontSize: '1.6rem' }}>{bono.emoji}</div>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '0 0 6px', color: C.greenL, lineHeight: 1.3 }}>{bono.title}</h4>
                <p style={{ fontSize: '0.8rem', color: C.green, fontWeight: 700, margin: '0 0 10px' }}>Valor: {bono.value}</p>
                <p style={{ fontSize: '0.83rem', color: C.muted, lineHeight: 1.6, margin: '0 0 14px' }}>{bono.desc}</p>
                {'preview' in bono && bono.preview && (
                  <button
                    onClick={() => setShowProtocolo(true)}
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.35)',
                      color: '#fbbf24',
                      fontSize: '0.78rem', fontWeight: 800,
                      padding: '8px 16px', borderRadius: 8,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    👁 Ver un preview →
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div {...up(0.2)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 28 }}>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 700 }}>Si pagaras por separado</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: C.greenL }}>$261 USD</div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenD})`, borderRadius: 14, padding: '24px', textAlign: 'center', color: '#fff', boxShadow: `0 8px 32px ${C.green}30` }}>
              <div style={{ fontSize: '0.78rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, fontWeight: 700 }}>Hoy por solo</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 8 }}>$95 USD</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>📊 Ahorras 64%</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPARATIVA ── */}
      <section style={{ padding: '80px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.greenL }}>
            ¿Cuál Es Para Ti?
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 44px', fontSize: '0.97rem', lineHeight: 1.6 }}>
            Dos formas de aprender el mismo sistema — elige la que va con tu estilo
          </motion.p>
          <motion.div {...up(0.1)} style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ background: C.card, padding: '24px', borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Kit ProLarva 25/15</div>
                <div style={{ fontWeight: 900, color: C.text, fontSize: '1rem', marginBottom: 4 }}>Hazlo a tu ritmo</div>
                <div style={{ fontSize: '0.82rem', color: C.muted, marginBottom: 12 }}>$450.000 COP · ~$107 USD</div>
                <Link href="/kit" style={{ fontSize: '0.78rem', color: C.green, fontWeight: 700, textDecoration: 'none', borderBottom: `1px solid ${C.green}40`, paddingBottom: 1 }}>Ver Kit →</Link>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${C.green}15, ${C.greenD}05)`, padding: '24px', borderBottom: `1px solid ${C.green}30`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 20, background: C.green, color: '#0a1628', fontSize: '0.62rem', fontWeight: 900, padding: '4px 12px', borderRadius: '0 0 8px 8px', letterSpacing: '0.06em' }}>ESTÁS AQUÍ</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.greenL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Programa Colonia</div>
                <div style={{ fontWeight: 900, color: C.text, fontSize: '1rem', marginBottom: 4 }}>Aprende en vivo con el grupo</div>
                <div style={{ fontSize: '0.82rem', color: C.greenL, fontWeight: 700 }}>$400.000 COP · ~$95 USD</div>
              </div>
            </div>
            {/* Filas */}
            {[
              { label: 'Formato', kit: 'Autoguiado con manual paso a paso', col: '4 clases en vivo semanales con Juliana', colWin: true },
              { label: 'Interacción con Juliana', kit: 'Soporte por WhatsApp', col: 'En vivo cada semana — preguntas en tiempo real', colWin: true },
              { label: 'Red de contactos', kit: 'Sin comunidad grupal', col: '20 productores que se conocen y colaboran', colWin: true },
              { label: 'Semilla BSF viva', kit: '✅ Incluida', col: '✅ Incluida', colWin: null },
              { label: 'Grabaciones de clase', kit: '—', col: '✅ Disponibles después de cada sesión', colWin: true },
              { label: 'Material descargable', kit: '✅ Manual + guías', col: '✅ Fichas y plantillas semanales', colWin: null },
              { label: 'Precio', kit: '$450.000 COP', col: '$400.000 COP ✨', colWin: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
                <div style={{ background: i % 2 === 0 ? C.card : C.bg, padding: '16px 24px', borderRight: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '0.68rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{row.label}</div>
                  <div style={{ fontSize: '0.85rem', color: row.colWin === false ? C.greenL : C.muted }}>{row.kit}</div>
                </div>
                <div style={{ background: i % 2 === 0 ? `${C.green}08` : `${C.green}04`, padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.68rem', color: C.greenL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5, opacity: 0 }}>{row.label}</div>
                  <div style={{ fontSize: '0.85rem', color: row.colWin ? C.greenL : C.text, fontWeight: row.colWin ? 700 : 400 }}>{row.col}</div>
                </div>
              </div>
            ))}
            {/* Para quién */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.border}` }}>
              <div style={{ background: C.card, padding: '20px 24px', borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '0.68rem', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ideal si</div>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>Quieres empezar solo, a tu ritmo, con todo el material en mano desde el día uno</p>
              </div>
              <div style={{ background: `${C.green}08`, padding: '20px 24px' }}>
                <div style={{ fontSize: '0.68rem', color: C.greenL, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Ideal si</div>
                <p style={{ fontSize: '0.85rem', color: C.text, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>Aprendes mejor acompañado, quieres preguntar en vivo y además quieres salir con contactos reales — no solo con conocimiento</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 20px', background: C.bg }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 12px', color: C.greenL }}>
            Preguntas Frecuentes
          </motion.h2>
          <motion.p {...up(0.05)} style={{ textAlign: 'center', color: C.muted, maxWidth: 480, margin: '0 auto 44px', fontSize: '0.97rem', lineHeight: 1.6 }}>
            Todo lo que quieres saber antes de inscribirte
          </motion.p>
          <motion.div {...up(0.1)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '8px 28px 4px' }}>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} open={faqOpen === i} onToggle={() => setFaqOpen(faqOpen === i ? null : i)} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section style={{ padding: '68px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.h2 {...up()} style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 44px', color: C.greenL }}>
            Te Inscribes con Total Seguridad
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { icon: '🔒', title: 'Garantía Incondicional — 7 Días', desc: 'Si antes de la primera sesión decides que no es para ti, te devolvemos el 100% del dinero. Sin preguntas, sin trámites.', d: 0 },
              { icon: '🎯', title: 'Garantía de Resultado', desc: 'Si completas las 4 semanas y al terminar no tienes tu primer lote en marcha, Juliana te acompaña sin costo adicional hasta que lo logres.', d: 0.1 },
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
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <img src="/juliana.jpg" alt="Juliana Coronel — fundadora de ProLarva" style={{ width: 170, height: 170, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `4px solid ${C.green}`, boxShadow: `0 8px 40px ${C.green}35` }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: C.text, fontSize: '0.95rem' }}>Juliana Coronel</div>
                  <div style={{ fontSize: '0.78rem', color: C.muted }}>Fundadora · ProLarva</div>
                  <div style={{ fontSize: '0.75rem', color: C.muted }}>Cúcuta, Colombia 🇨🇴</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                {[
                  'Soy productora de larvas BSF en Colombia. Crío mis propios animales de traspatio y soy la fundadora de ProLarva.',
                  'No soy una empresa grande ni un laboratorio. Soy una productora como tú, que encontró una forma de producir más con menos gasto: lo probé en mi propia granja, lo documenté desde el día cero hasta el sacrificio, y decidí enseñárselo directamente a otros productores en vivo.',
                  'Sin experiencia previa. Sin tecnología compleja. Con lo que ya tienes en tu finca.',
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

      {/* ── GALERÍA ── */}
      <section style={{ padding: '56px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <motion.p {...up()} style={{ textAlign: 'center', color: C.green, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Vida real en la granja</motion.p>
          <motion.h2 {...up(0.05)} style={{ textAlign: 'center', fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)', fontWeight: 900, color: C.greenL, margin: '0 auto 28px' }}>
            El sistema BSF en acción
          </motion.h2>
          <motion.div {...up(0.1)} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0a111c' }}>
              {GALLERY[galleryIdx].type === 'image' ? (
                <img key={galleryIdx} src={GALLERY[galleryIdx].src} alt={GALLERY[galleryIdx].caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <video key={galleryIdx} src={GALLERY[galleryIdx].src} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
              <button onClick={prevSlide} aria-label="Anterior" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 38, height: 38, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>‹</button>
              <button onClick={nextSlide} aria-label="Siguiente" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 38, height: 38, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>›</button>
              <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 20, padding: '3px 9px', fontSize: '0.68rem', color: C.greenL, fontWeight: 700, backdropFilter: 'blur(4px)', letterSpacing: '0.05em' }}>
                {GALLERY[galleryIdx].type === 'video' ? '▶ VIDEO' : '🖼 FOTO'}
              </span>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: C.muted, fontWeight: 600 }}>{GALLERY[galleryIdx].caption}</p>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {GALLERY.map((_, i) => (
                  <button key={i} onClick={() => setGalleryIdx(i)} aria-label={`Ir a ${i + 1}`} style={{ width: i === galleryIdx ? 18 : 7, height: 7, borderRadius: 4, background: i === galleryIdx ? C.green : `${C.muted}50`, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.25s' }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '90px 20px', textAlign: 'center', background: `linear-gradient(135deg, ${C.bg2}, ${C.bg})`, borderTop: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, ${C.green}14, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.div {...up(0.02)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 20, padding: '6px 16px', marginBottom: 20, fontSize: '0.8rem', color: '#fca5a5', fontWeight: 700, position: 'relative' }}>
          🔴 Solo 20 cupos disponibles — cierre al completar
        </motion.div>
        <motion.h2 {...up(0.05)} style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.greenL, marginBottom: 14, position: 'relative' }}>
          ¿Listo para Aprender a Criar Tu Propia Proteína?
        </motion.h2>
        <motion.p {...up(0.1)} style={{ fontSize: '1.05rem', color: C.muted, margin: '0 auto 36px', maxWidth: 540, lineHeight: 1.65, position: 'relative' }}>
          4 semanas en vivo con Juliana y un grupo pequeño de productores colombianos — sales con conocimiento, con tu primer lote en marcha, y con una red de contactos que no consigues en ningún otro curso
        </motion.p>
        <motion.div {...up(0.15)} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <a href={`https://wa.me/573223212293?text=${WA_TEXT}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 38px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', borderRadius: 10, fontFamily: 'inherit', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', textDecoration: 'none', boxShadow: `0 8px 40px ${C.green}45`, letterSpacing: '0.02em' }}>
            💬 Apartar Mi Cupo Ahora
          </a>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 32px', border: `2px solid ${C.green}`, color: C.green, background: 'transparent', borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
            Ver Monitor BSF
          </Link>
        </motion.div>
      </section>

      {/* ── CONTACTO ── */}
      <section style={{ padding: '48px 20px', background: C.bg2, textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 10 }}>¿Dudas Antes de Inscribirte?</h3>
        <p style={{ fontSize: '0.95rem', color: C.muted, margin: '0 auto 20px', maxWidth: 440, lineHeight: 1.6 }}>
          Habla directamente con Juliana — está aquí para responderte
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
          .juliana-wrap { flex-direction: column; align-items: center; }
        }
      `}</style>

      <ProtocoloCrisisModal open={showProtocolo} onClose={() => setShowProtocolo(false)} />
    </div>
  );
}
