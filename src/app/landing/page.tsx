'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';

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

export default function LandingPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email  = (form.elements.namedItem('email') as HTMLInputElement).value;

    const db = getSupabase();
    if (db) await db.from('leads').insert({ nombre, email });

    setSubmitted(true);
    setTimeout(() => { window.location.href = '/gracias'; }, 1500);
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Montserrat', sans-serif", minHeight: '100vh' }}>

      {/* Banner */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '13px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, color: C.text }}>
        ⚠️ El concentrado sube cada mes. Cada ciclo que no produces tu propia proteína, es más dinero que pierdes. ⚠️
      </div>

      {/* Hero */}
      <section style={{ padding: '72px 20px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 3rem)', fontWeight: 900, margin: '0 auto 28px', maxWidth: 820, lineHeight: 1.1 }}>
          Reduce el <span style={{ color: C.greenL }}>25% del concentrado</span> en 20 días — desde tu traspatio, sin experiencia previa.
        </h1>
        {/* VSL placeholder */}
        <div style={{ maxWidth: 800, margin: '0 auto', aspectRatio: '16/9', background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: C.muted, fontSize: '0.95rem', padding: 24, textAlign: 'center', lineHeight: 1.6 }}>
            🎥 Video VSL — próximamente.<br />
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>Pegá la URL de YouTube cuando esté listo.</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '64px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2vw + 0.5rem, 1.8rem)', fontWeight: 800, textAlign: 'center', margin: '0 auto 10px', maxWidth: 600, lineHeight: 1.25 }}>
            Resultados reales. En Colombia. En traspatio.
          </h2>
          <p style={{ color: C.muted, textAlign: 'center', fontSize: '0.93rem', margin: '0 auto 48px', maxWidth: 480 }}>
            Documentado desde el día 0 hasta el sacrificio al día 42.
          </p>
          <div className="lstat-wrap" style={{ display: 'flex', flexWrap: 'wrap', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
            {[
              { val: '25%',   lbl: 'menos concentrado en todo el ciclo' },
              { val: '4 kg',  lbl: 'peso de pollos al día 42' },
              { val: '0',     lbl: 'muertes · cero picuaje' },
              { val: '20 días', lbl: 'al primer lote produciendo' },
            ].map((s, i) => (
              <div key={i} className="lstat-item" style={{ flex: '1 1 160px', padding: '36px 24px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: C.greenL, lineHeight: 1, marginBottom: 10 }}>{s.val}</span>
                <span style={{ display: 'block', fontSize: '0.83rem', color: C.muted, lineHeight: 1.45, maxWidth: 130, margin: '0 auto' }}>{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Juliana */}
      <section style={{ padding: '80px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{ color: C.greenL, textAlign: 'center', margin: '0 auto 32px', fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.1rem)', lineHeight: 1.2, fontWeight: 900 }}>
            ¿Quién está detrás de ProLarva?
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '32px 28px' }}>
            <img src="/juliana.jpg" alt="Juliana Coronel — fundadora de ProLarva" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `3px solid ${C.green}`, display: 'block', margin: '0 auto 28px' }} />
            {[
              'Soy Juliana, productora de larvas BSF en Colombia. Crío mis propios animales de traspatio y soy la fundadora de ProLarva.',
              'No soy una empresa grande ni un laboratorio. Soy una productora como tú, que encontró una forma de producir más con menos gasto: lo probé en mi propia granja, lo documenté desde el día cero hasta el sacrificio, y decidí empaquetarlo para que otros productores puedan replicarlo.',
              'Sin experiencia previa. Sin tecnología compleja. Con lo que ya tienes en tu finca.',
            ].map((p, i) => (
              <p key={i} style={{ lineHeight: 1.75, fontSize: '1rem', color: '#d4e8da', marginBottom: 16 }}>{p}</p>
            ))}
            <p style={{ textAlign: 'center', color: C.muted, fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.7, margin: '24px 0 0', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
              Para: Pequeños productores colombianos con gallinas, pollos, cerdos o peces. Productores cuya granja es su fuente principal de ingresos y sienten que el concentrado les destruye el margen cada mes.
            </p>
          </div>
        </div>
      </section>

      {/* Lead magnet */}
      <section style={{ padding: '72px 20px', borderTop: `2px solid ${C.green}` }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: C.card, padding: '36px 30px', borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
          <h3 style={{ color: C.greenL, fontSize: '1.6rem', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>
            Calcula tu ahorro BSF (gratis)
          </h3>
          <p style={{ color: C.muted, fontSize: '0.95rem', lineHeight: 1.65, margin: '0 0 24px' }}>
            Ingresa tu especie, número de animales y precio actual del concentrado. En 2 minutos ves exactamente cuánto estás perdiendo al mes y cuánto recuperas con el Sistema ProLarva.
          </p>
          {submitted ? (
            <div style={{ padding: 20, background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: `1px solid rgba(34,197,94,0.3)`, textAlign: 'center', color: C.green, fontWeight: 700, fontSize: '0.95rem' }}>
              ✅ ¡Listo! Redirigiendo a la calculadora...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value="Nuevo Lead ProLarva" />
              <input type="hidden" name="_captcha" value="false" />
              {['text', 'email'].map((type, i) => (
                <input key={i} type={type} name={type === 'text' ? 'name' : 'email'} placeholder={type === 'text' ? 'Tu nombre' : 'Tu correo electrónico'} required
                  style={{ width: '100%', padding: '14px 16px', margin: '7px 0', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card2, color: C.text, fontFamily: 'inherit', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
              ))}
              <button type="submit"
                style={{ width: '100%', padding: 18, background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: 14, letterSpacing: '0.03em' }}>
                Calcular mi ahorro ahora →
              </button>
              <p style={{ fontSize: '0.75rem', color: C.muted, margin: '14px 0 0', textAlign: 'center' }}>🔒 Sin spam. Te llega acceso directo a la calculadora.</p>
            </form>
          )}
        </div>
      </section>

      {/* Por qué ProLarva */}
      <section style={{ padding: '80px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3vw + 0.5rem, 2.5rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 14px', maxWidth: 760, lineHeight: 1.15 }}>
            ¿Por qué <span style={{ color: C.greenL }}>ProLarva</span> es diferente?
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 48px', color: C.muted, fontSize: '0.97rem', lineHeight: 1.65, textAlign: 'center' }}>
            No es un curso genérico. No vende larvas sueltas. Es el sistema completo para que las produzcas tú mismo, con acompañamiento de quien ya lo hizo.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { title: 'Documentado desde el día 0', body: 'Juliana es la única productora en Colombia que registró el proceso completo de implementación BSF desde la siembra hasta el sacrificio. Puedes ver cada etapa antes de comprar en @prolarva.co.' },
              { title: 'No vende larvas — vende independencia', body: 'No es una venta de insumos que crea nueva dependencia. Es un sistema para que el productor produzca su propia proteína, con lo que ya tiene en su finca, en 15 minutos al día.' },
              { title: 'Funciona en traspatio colombiano', body: 'Las referencias del nicho BSF son extranjeras o industriales. ProLarva prueba que funciona en Colombia, en traspatio, sin tecnología costosa. Con pollos criollos de piel amarilla intensa.' },
            ].map((card, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px', color: C.greenL, lineHeight: 1.3 }}>{card.title}</h4>
                <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.body}</p>
              </div>
            ))}
            {/* Wide card */}
            <div style={{ background: C.card, border: `1px solid rgba(34,197,94,0.3)`, borderRadius: 14, padding: '28px 24px', gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, alignItems: 'start' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px', color: C.greenL, lineHeight: 1.3 }}>Kit + App + Acompañamiento integrados</h4>
                <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>Ningún competidor ofrece los tres elementos juntos. Semilla viva, kit físico completo, App Monitor, Calculadora BSF y 35 días de soporte directo con Juliana.</p>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {['Semilla viva de BSF', 'Kit físico completo (malla love cage, trampas)', 'App Monitor ProLarva', 'Calculadora BSF interactiva', '35 días de soporte directo con Juliana'].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.86rem', color: C.muted, padding: '7px 0', borderBottom: `1px solid ${C.border}`, lineHeight: 1.4 }}>
                    <span style={{ color: C.green, marginRight: 6 }}>→</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Stats desktop: separador vertical entre items */
        .lstat-item { border-right: 1px solid rgba(14,165,233,0.15); }
        .lstat-item:last-child { border-right: none; }
        @media (max-width: 600px) {
          .lstat-wrap { flex-direction: column; }
          .lstat-item { border-right: none; border-bottom: 1px solid rgba(14,165,233,0.1); padding: 22px 16px !important; }
          .lstat-item:last-child { border-bottom: none; }
        }
      `}</style>

      {/* Footer CTA */}
      <section style={{ padding: '60px 20px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text, marginBottom: 20 }}>¿Quieres ver exactamente cuánto te cuesta no usar BSF?</div>
        <Link href="/calculadora" style={{ display: 'inline-block', padding: '15px 36px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', borderRadius: 12, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.02em' }}>
          Abrir calculadora gratuita →
        </Link>
        <div style={{ marginTop: 16, fontSize: '0.8rem', color: C.muted }}>
          O sigue explorando el <Link href="/" style={{ color: C.green, textDecoration: 'none' }}>Monitor ProLarva</Link>
        </div>
      </section>

    </div>
  );
}
