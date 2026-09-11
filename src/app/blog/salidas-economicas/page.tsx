'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeadCapture from '@/components/LeadCapture';

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
  blue:   '#0ea5e9',
  purple: '#a855f7',
  cyan:   '#06b6d4',
};

type Salida = 'huevos' | 'frass' | 'seca' | 'harina' | 'viva';

const salidas: { id: Salida; emoji: string; label: string; color: string }[] = [
  { id: 'huevos', emoji: '🥚', label: 'Huevos',              color: C.blue },
  { id: 'frass',  emoji: '🌱', label: 'Frass',               color: C.green },
  { id: 'seca',   emoji: '🐟', label: 'Larva deshidratada',  color: C.purple },
  { id: 'harina', emoji: '🌾', label: 'Harina de larva',     color: C.amber },
  { id: 'viva',   emoji: '🐔', label: 'Larva viva',          color: C.cyan },
];

const data: Record<Salida, {
  queEs: string;
  paraQuien: string[];
  comoEmpezar: string[];
  tip: string;
}> = {
  huevos: {
    queEs: 'El racimo blanco-amarillo que pone la mosca adulta hembra, entre 500 y 900 huevos por postura. No se le da a ningún animal — su valor está en que de ahí nace la próxima generación de larvas.',
    paraQuien: [
      'Productores que quieren empezar su propia cría de BSF y no tienen colonia madre',
      'Criadores de la zona que perdieron su lote de reproductoras',
      'Emprendedores que arrancan su propio negocio de bioinsumos BSF',
    ],
    comoEmpezar: [
      'Arma trampas de oviposición con cartón corrugado sobre el sustrato de atracción',
      'Revisa cada 24–48h y separa el racimo con una espátula, sin aplastarlo',
      'Empácalo en frascos con un poco de sustrato húmedo para el transporte',
      'Véndelo por racimo o por gramo — un racimo sano pesa entre 20 y 25 mg',
    ],
    tip: 'Es la salida de menor volumen pero más rentable por gramo: casi nadie más la ofrece en tu zona.',
  },
  frass: {
    queEs: 'La mezcla de residuos digeridos y exoesqueletos que dejan las larvas al alimentarse del sustrato. Es abono orgánico completo — NPK más quitina — que regenera la estructura del suelo.',
    paraQuien: [
      'Agricultores y horticultores de la zona',
      'Viveros y cultivos de flores o frutales',
      'Otros productores BSF que no quieren procesarlo ellos mismos',
    ],
    comoEmpezar: [
      'Cosecha el sustrato ya oscuro y seco, después de que las larvas migran o se cosechan',
      'Tamiza para separar restos de cáscara o sustrato sin digerir',
      'Sécalo al sol 1–2 días si quedó húmedo, para que no se compacte ni salga hongo',
      'Empácalo en bultos de 5, 10 o 25 kg y véndelo por kg — muéstralo en acción, antes/después en una planta',
    ],
    tip: 'Se vende solo con un video de 15 días de una planta con frass vs. sin frass. Es el producto más fácil de mostrar en redes.',
  },
  seca: {
    queEs: 'Larva cosechada en su punto máximo de grasa y proteína (día 15–18) y luego secada al sol o en horno hasta quitarle casi toda el agua. Reemplaza directamente a la harina de pescado en la dieta.',
    paraQuien: [
      'Piscicultores (tilapia, cachama) que hoy compran harina de pescado importada',
      'Avicultores que buscan una fuente de proteína más estable y barata',
      'Distribuidores que revenden insumos para animales',
    ],
    comoEmpezar: [
      'Cosecha la larva en el pico de peso, antes de que empiece a pasar a prepupa',
      'Sécala en bandejas finas al sol directo o en un deshidratador/horno a baja temperatura',
      'Confirma que quede crocante al tacto — ahí ya no hay humedad que la dañe',
      'Empácala al vacío o en bolsa hermética; se conserva meses sin refrigeración',
    ],
    tip: 'Tiene la mayor vida útil de las 5: produces en un mes bueno y vendes durante varios meses sin que se dañe.',
  },
  harina: {
    queEs: 'La larva deshidratada, molida hasta volverse polvo fino. Es la materia prima para armar tu propio concentrado casero, mezclada con maíz, soya o afrecho según lo que tengas a mano.',
    paraQuien: [
      'Productores que quieren dejar de comprar concentrado comercial',
      'Quien cría pollitos muy pequeños, que necesitan la proteína ya fácil de digerir',
      'Otros pequeños productores de la zona que arman su propia fórmula',
    ],
    comoEmpezar: [
      'Parte siempre de larva ya bien seca — si le queda humedad, la harina se apelmaza y se daña',
      'Muele en un molino de granos o triturador; tamiza para que quede fina y uniforme',
      'Empácala en bolsa sellada, protegida de la humedad y la luz',
      'Véndela por kg, o ya armada como fórmula de concentrado casero con receta incluida',
    ],
    tip: 'El mayor margen está en vender la receta junto con la harina — no el ingrediente suelto, sino la solución completa.',
  },
  viva: {
    queEs: 'La larva tal como sale del cultivo, sin ningún proceso. Es la forma más económica de dar proteína — el animal la caza o la come fresca, con toda su grasa y humedad intactas.',
    paraQuien: [
      'Avicultores: pollos de engorde y gallinas ponedoras',
      'Piscicultores: tilapia y cachama, sobre todo en estanque',
      'Porcicultores desde la etapa de precebo en adelante',
      'Cualquier productor de traspatio con animales mixtos',
    ],
    comoEmpezar: [
      'Cosecha en el día 15–18 del ciclo, el punto de mayor peso y proteína',
      'Entrégala el mismo día o al siguiente — es la de menor vida útil, no aguanta almacenaje',
      'Si vendes a otros productores, cobra por kg y entrega en la mañana temprano',
      'Empieza vendiéndosela a tu vecino productor antes de pensar en distancias largas',
    ],
    tip: 'Es la puerta de entrada más fácil para empezar a vender: no necesita ningún procesamiento, solo cosechar y entregar.',
  },
};

export default function SalidasEconomicasPage() {
  const [selected, setSelected] = useState<Salida>('huevos');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/blog/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'salidas-economicas' }) });
  }, []);

  const d = data[selected];
  const s = salidas.find(x => x.id === selected)!;

  const handleCopy = () => {
    navigator.clipboard.writeText('https://prolarva.co/blog/salidas-economicas');
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
              href={`https://wa.me/?text=${encodeURIComponent('💰 5 formas de ganar plata con la mosca soldado negra — huevos, frass, larva deshidratada, harina y larva viva: https://prolarva.co/blog/salidas-economicas')}`}
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
          Negocio · BSF
        </div>

        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 38px)',
          fontWeight: 800,
          lineHeight: 1.2,
          color: C.text2,
          maxWidth: 640,
          margin: '0 auto 16px',
        }}>
          5 formas de ganar plata <br />
          <span style={{ color: C.green }}>con la mosca soldado negra</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
          No es un solo negocio. Cada etapa de tu cría BSF tiene su propio comprador — aquí sabes cuál es cada uno.
        </p>

        <div style={{ marginTop: 16, fontSize: 13, color: C.muted2 }}>
          Por Juliana · ProLarva
        </div>
      </div>

      {/* SELECTOR */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
          Selecciona la salida económica
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {salidas.map(a => {
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
                  border: isActive ? `1px solid ${a.color}80` : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? `${a.color}22` : 'rgba(255,255,255,0.04)',
                  color: isActive ? a.color : C.muted,
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

        {/* Qué es */}
        <div style={{
          background: C.card,
          border: `1px solid ${s.color}40`,
          borderRadius: 16,
          padding: '24px 24px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 32 }}>{s.emoji}</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text2 }}>{s.label}</div>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{d.queEs}</p>
        </div>

        {/* A quién se lo vendes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
            ¿A quién se lo vendes?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.paraQuien.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: `${s.color}12`,
                border: `1px solid ${s.color}30`,
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1, color: s.color }}>✓</span>
                <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo empezar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
            Cómo empezar a producirla y venderla
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.comoEmpezar.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: C.card,
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                  width: 20, height: 20, borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${s.color}25`, color: s.color,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div style={{
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 14,
          padding: '18px 20px',
          marginBottom: 40,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>⚡</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.amber, marginBottom: 6 }}>
              Tip de negocio
            </div>
            <p style={{ fontSize: 14, color: C.amberL, lineHeight: 1.65, margin: 0 }}>{d.tip}</p>
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
            Aplica para las 5 salidas
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'No hay que elegir una sola: muchos productores empiezan con larva viva y frass (las más simples) y con el tiempo suman huevos, deshidratada y harina.',
              'Entre más procesada esté (harina > deshidratada > viva), más vida útil tiene y más lejos la puedes vender.',
              'Empieza vendiéndole a tu vecino productor — es la validación más rápida antes de pensar en distancias largas.',
              'El Kit ProLarva 25/15 te enseña a producir con la calidad suficiente para vender, no solo para autoconsumo.',
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
            ¿Quieres aprender a producir las 5?
          </h3>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 26px' }}>
            El Kit ProLarva 25/15 te da la colonia madre y el paso a paso para que produzcas con calidad de venta desde el primer lote.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/kit" style={{
              display: 'inline-block',
              background: C.green,
              color: C.deep,
              fontWeight: 800,
              fontSize: 15,
              padding: '14px 28px',
              borderRadius: 10,
              textDecoration: 'none',
            }}>
              Ver el Kit ProLarva →
            </Link>
          </div>
        </div>

        <LeadCapture
          fuente="blog_salidas_economicas"
          titulo="¿Quieres saber cuál te conviene empezar primero?"
          texto="Cuéntale a Juliana qué animales tienes y qué mercado te queda cerca, y te dice por cuál salida arrancar."
          waMensaje="quiero saber por cuál salida económica de la BSF empezar"
        />
      </div>

      <style>{`
        @media (max-width: 520px) {
          main > div:nth-child(2) { padding: 12px 14px 0 !important; }
          main > div:nth-child(3) { padding: 32px 16px 30px !important; }
          main > div:last-child > div { padding: 20px 16px 60px !important; }
        }
      `}</style>
    </main>
  );
}
