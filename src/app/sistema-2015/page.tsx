'use client';

import Link from 'next/link';
import { useState } from 'react';

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

export default function Sistema2015Page() {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Montserrat', sans-serif", minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', background: `linear-gradient(135deg, ${C.bg2} 0%, ${C.bg} 100%)` }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 3rem)', fontWeight: 900, margin: '0 auto 28px', maxWidth: 820, lineHeight: 1.1 }}>
          Produce Tu Propia <span style={{ color: C.greenL }}>Súper Proteína</span> y Reduce 25% el Concentrado en 20 Días
        </h1>
        <p style={{ fontSize: '1.2rem', color: C.muted, margin: '0 auto 2rem', maxWidth: 600 }}>
          Desde tu traspatio, sin experiencia previa, sin depender de nadie más
        </p>
        <a href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20quiero%20comprar%20el%20Kit%20ProLarva%2020%2F15" style={{ display: 'inline-block', padding: '16px 32px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.03em', marginRight: 12, marginBottom: 12 }}>
          Quiero Mi Kit Ahora
        </a>
      </section>

      {/* Problema */}
      <section style={{ padding: '64px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 14px', maxWidth: 760, lineHeight: 1.15, color: C.greenL }}>
            El Concentrado Te Está Quebrando
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 48px', color: C.muted, fontSize: '0.97rem', lineHeight: 1.65, textAlign: 'center' }}>
            Conocemos el dolor de los pequeños productores colombianos
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { emoji: '📈', title: 'El costo sube cada mes', body: 'El concentrado aumenta sin control. Tus márgenes se comen sin que hagas nada distinto.' },
              { emoji: '💸', title: 'La rentabilidad desaparece', body: 'Producir gallinas, peces o cerdos de calidad cada vez te cuesta más dinero.' },
              { emoji: '🔗', title: 'Dependes del proveedor', body: 'No tienes control sobre tu producción. Todo depende de lo que se venda en la tienda.' },
            ].map((card, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px', transition: 'all 0.3s' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{card.emoji}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px', color: C.greenL }}>{card.title}</h4>
                <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solución */}
      <section style={{ padding: '64px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 14px', maxWidth: 760, lineHeight: 1.15, color: C.greenL }}>
            La Larva Que Lo Cambia Todo
          </h2>
          <p style={{ maxWidth: 600, margin: '0 auto 48px', color: C.muted, fontSize: '0.97rem', lineHeight: 1.65, textAlign: 'center' }}>
            Hermetia illucens (Black Soldier Fly) es la solución que estaba esperando tu granja
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '25%', label: 'Menos Concentrado', desc: 'Reduce hasta 25% el gasto mensual en alimento' },
              { num: '20 días', label: 'Primer Resultado', desc: 'En apenas 20 días tienes tu primer lote BSF' },
              { num: '∞', label: 'Autosuficiencia', desc: 'Produces tu propia proteína indefinidamente' },
            ].map((stat, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: C.greenL, marginBottom: 8 }}>{stat.num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{stat.label}</h3>
                <p style={{ fontSize: '0.85rem', color: C.muted, margin: 0, lineHeight: 1.5 }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kit */}
      <section style={{ padding: '64px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 14px', maxWidth: 760, lineHeight: 1.15, color: C.greenL }}>
            Qué Recibes: El Kit ProLarva 20/15
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 40 }}>
            {[
              { title: '🎁 Componente Físico', subtitle: 'El Kit de Implementación', items: ['Semilla viva BSF en 3 etapas', 'Recipiente de cultivo', '2 trampas para oviposición', 'Toldillo de protección', 'Planta artificial', 'Spray para humedad'] },
              { title: '📚 Componente Pedagógico', subtitle: 'El Sistema en Papel', items: ['Manual impreso "Sistema ProLarva 20/15"', 'Ficha de seguimiento por etapas', 'Planilla de registro de lotes', 'Guía paso a paso', 'Diagrama de ciclo BSF', 'Checklist de preparación'] },
              { title: '👥 Acompañamiento Intensivo', subtitle: '45 Días de Soporte Total', items: ['3 videollamadas por semana (45 min c/u)', 'Contacto directo vía WhatsApp', 'Soporte por 180 días desde la primera cosecha', 'Mentorship paso a paso de Juliana', 'App web Monitor + tracker de cosecha', 'Respuestas en tiempo real'] },
            ].map((kit, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px', color: C.greenL }}>{kit.title}</h3>
                <p style={{ fontSize: '0.9rem', color: C.muted, margin: '0 0 16px', fontWeight: 600 }}>{kit.subtitle}</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {kit.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '0.85rem', color: C.muted, padding: '6px 0', paddingLeft: '20px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: C.green }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acompañamiento Detallado */}
      <section style={{ padding: '64px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 10px', lineHeight: 1.15, color: C.greenL }}>
            Tu Acompañamiento Paso a Paso
          </h2>
          <p style={{ textAlign: 'center', color: C.muted, fontSize: '1rem', margin: '0 auto 48px', maxWidth: 600 }}>
            No estás solo. Juliana te acompaña todos los días durante 45 días, y luego 180 días más de soporte
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { emoji: '📱', title: '3 Videollamadas/Semana', desc: '45 minutos directos con Juliana en vivo para resolver dudas, revisar tu lote y ajustar el plan' },
              { emoji: '💬', title: 'WhatsApp 24/7', desc: 'Contacto directo durante los primeros 45 días. Dudas, fotos, problemas — respuestas rápidas' },
              { emoji: '🛡️', title: '180 Días de Soporte', desc: 'Después de tu primera cosecha, 180 días de número de soporte. Juliana sigue disponible' },
              { emoji: '🔍', title: 'App Monitor Web', desc: 'Plataforma completa con guías, alertas automáticas y registro digital de lotes' },
              { emoji: '📊', title: 'Tracker de Cosecha', desc: 'Registro digital automático de cada cosecha. Datos, evolución, rentabilidad' },
              { emoji: '👁️', title: 'Mentorship Real', desc: 'De alguien que ya lo logró en Colombia, bajo tus condiciones. No es un curso grabado' },
            ].map((item, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{item.emoji}</div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: C.greenL, margin: '0 0 10px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precio */}
      <section style={{ padding: '64px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, margin: '0 auto 10px', color: C.greenL }}>
            Tu Inversión
          </h2>
          <div style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenD} 100%)`, padding: '40px 30px', borderRadius: 16, marginTop: 40, color: '#fff' }}>
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: 12, fontWeight: 600 }}>Precio especial (oferta limitada)</div>
            <div style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 8 }}>$350,000 COP</div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>≈ $83 USD | Pago único, acceso de por vida</div>
          </div>
          <p style={{ color: C.muted, fontSize: '1rem', margin: '32px auto 0', maxWidth: 500 }}>
            Incluye kit físico completo + manual + 45 días de acompañamiento intensivo + 180 días de soporte
          </p>
        </div>
      </section>

      {/* Bonos */}
      <section style={{ padding: '64px 20px', background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 10px', color: C.greenL }}>
            Pero Eso No Es Todo…
          </h2>
          <p style={{ textAlign: 'center', color: C.muted, fontSize: '1rem', margin: '0 auto 48px', maxWidth: 600 }}>
            4 bonos adicionales valorados en más de $340 USD, todos incluidos en tu compra
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { num: '1', title: 'App Monitor ProLarva + Tracker Digital', value: '$147 USD', desc: 'Plataforma web con guía paso a paso, controles de temperatura/humedad, alertas automáticas, registro digital de lotes y tracker de cosechas' },
              { num: '2', title: 'Calculadora BSF ProLarva', value: '$97 USD', desc: 'Calcula exactamente cuánto dinero pierdes sin BSF y cuánto ahorras con el sistema. Resultados personalizados por especie' },
              { num: '3', title: 'Protocolo Anti-Crisis BSF', value: '$67 USD', desc: 'Árbol de decisión para los 7 imprevistos más comunes: temperatura, humedad, oviposición, mortalidad, plagas. Soluciones paso a paso' },
              { num: '4', title: 'Checklist Arranque Express', value: '$29 USD', desc: 'Lista paso a paso de las primeras 72 horas: preparación de espacio, activación de semilla, verificación de condiciones' },
            ].map((bono, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px', position: 'relative' }}>
                <div style={{ display: 'inline-block', background: C.green, color: '#0d1b2a', width: 40, height: 40, borderRadius: '50%', textAlign: 'center', lineHeight: '40px', fontWeight: 900, marginBottom: 12 }}>
                  {bono.num}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 8px', color: C.greenL }}>{bono.title}</h4>
                <p style={{ fontSize: '0.8rem', color: C.green, fontWeight: 700, margin: '0 0 12px' }}>Valor: {bono.value}</p>
                <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>{bono.desc}</p>
              </div>
            ))}
          </div>

          {/* Tabla de valor */}
          <div style={{ marginTop: 48, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, borderBottom: `1px solid ${C.border}` }}>
              {[
                { label: 'Elemento', isHeader: true },
                { label: 'Valor USD', isHeader: true },
              ].map((h, i) => (
                <div key={i} style={{ padding: '16px', background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenD} 100%)`, color: '#fff', fontWeight: 900, fontSize: '0.9rem' }}>
                  {h.label}
                </div>
              ))}
            </div>
            {[
              { item: 'Kit físico completo', val: '$67' },
              { item: 'Manual + Fichas + Planilla', val: '$77' },
              { item: 'Acompañamiento intensivo (45d + 180d)', val: '$297' },
              { item: 'Subtotal Núcleo', val: '$441', bold: true },
              { item: 'Bono 1 - App Monitor', val: '$147' },
              { item: 'Bono 2 - Calculadora', val: '$97' },
              { item: 'Bono 3 - Anti-Crisis', val: '$67' },
              { item: 'Bono 4 - Checklist', val: '$29' },
              { item: 'Subtotal Bonos', val: '$340', bold: true },
              { item: 'VALOR TOTAL PERCIBIDO', val: '$781 USD', highlight: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, borderBottom: i < 9 ? `1px solid ${C.border}` : 'none', background: row.highlight ? `linear-gradient(135deg, ${C.green}33 0%, ${C.greenD}33 100%)` : 'transparent' }}>
                <div style={{ padding: '14px 16px', fontSize: '0.85rem', color: C.text, fontWeight: row.bold || row.highlight ? 700 : 400 }}>{row.item}</div>
                <div style={{ padding: '14px 16px', fontSize: '0.85rem', color: C.text, fontWeight: row.bold || row.highlight ? 700 : 400, textAlign: 'right' }}>{row.val}</div>
              </div>
            ))}
          </div>

          {/* Comparación precio */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
            <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>Si pagaras cada cosa por separado</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: C.greenL }}>$781 USD</div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenD} 100%)`, borderRadius: 12, padding: '24px', textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>Hoy por solo</div>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 12 }}>$83 USD</div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>📊 Ahorras 89%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section style={{ padding: '64px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, textAlign: 'center', margin: '0 auto 14px', maxWidth: 760, lineHeight: 1.15, color: C.greenL }}>
            Nuestras Garantías
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 40 }}>
            {[
              { title: '✓ Garantía Incondicional (7 Días)', desc: 'Si en los primeros 7 días decides que esto no es para ti, te devolvemos el 100% de tu dinero. Sin preguntas, sin trámites.' },
              { title: '✓ Garantía de Resultado (Anti-Reembolso)', desc: 'Si sigues el sistema 20 días y no tienes tu primer lote produciendo, Juliana continúa el acompañamiento sin costo adicional hasta que lo logres.' },
            ].map((garantia, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 12px', color: C.greenL }}>{garantia.title}</h4>
                <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>{garantia.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '80px 20px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw + 0.5rem, 2.2rem)', fontWeight: 900, color: C.greenL, marginBottom: 16 }}>
          ¿Listo para Independencia Animal?
        </h2>
        <p style={{ fontSize: '1.1rem', color: C.muted, margin: '0 auto 32px', maxWidth: 600 }}>
          Únete a los productores colombianos que ya están reduciendo 25% su concentrado y recuperando la rentabilidad
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20quiero%20comprar%20el%20Kit%20ProLarva%2020%2F15" style={{ display: 'inline-block', padding: '16px 32px', background: `linear-gradient(135deg,${C.green},${C.greenD})`, color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', letterSpacing: '0.03em' }}>
            Comprar Mi Kit Ahora
          </a>
          <Link href="/" style={{ display: 'inline-block', padding: '16px 32px', border: `2px solid ${C.green}`, color: C.green, background: 'transparent', borderRadius: 8, fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', textDecoration: 'none', letterSpacing: '0.03em' }}>
            Volver al Monitor
          </Link>
        </div>
      </section>

      {/* Contacto */}
      <section style={{ padding: '60px 20px', background: C.bg2, textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: C.text, marginBottom: 12 }}>¿Dudas Antes de Empezar?</h3>
        <p style={{ fontSize: '1rem', color: C.muted, margin: '0 auto 24px', maxWidth: 500 }}>
          Habla directamente con Juliana — estoy aquí para responderte cualquier pregunta
        </p>
        <a href="https://wa.me/573223212293" style={{ display: 'inline-block', padding: '14px 28px', background: '#25D366', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>
          💬 WhatsApp — +57 322 321 2293
        </a>
        <p style={{ fontSize: '0.85rem', color: C.muted, margin: '16px 0 0', fontStyle: 'italic' }}>
          Disponible de lunes a viernes, 8am–6pm (hora Colombia)
        </p>
      </section>

    </div>
  );
}
