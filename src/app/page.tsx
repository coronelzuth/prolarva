'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSocios } from '@/hooks/useSocios';
import ShareButton from '@/components/ShareButton';

const C = {
  card:   'rgba(21,32,53,0.7)',
  card2:  '#1e3050',
  green:  '#22c55e',
  greenL: '#4ade80',
  emerald:'#10b981',
  muted:  '#94a3b8',
  border: 'rgba(34,197,94,0.2)',
  purple: '#8b5cf6',
};

const animalBenefits = [
  {
    animal: '🐔 Gallinas y aves',
    items: [
      '35–45% de proteína en base seca',
      'Mejora postura hasta un 15% en ponedoras',
      'Reduce consumo de concentrado comercial',
      'Mejora plumaje, tamaño del huevo y yema',
    ],
  },
  {
    animal: '🐷 Cerdos',
    items: [
      'Fuente completa de aminoácidos esenciales',
      'Digestibilidad superior al 90%',
      'Reduce costos de alimentación un 20–35%',
      'Acelera ganancia de peso en lechones',
    ],
  },
  {
    animal: '🐟 Peces y acuicultura',
    items: [
      'Perfil lipídico ideal: sustituye harina de pescado',
      'Compatible con tilapia, trucha y cachama',
      'Mejora conversión alimenticia (FCR)',
      'Sin impacto negativo en sabor del producto final',
    ],
  },
];

const nutritionStats = [
  { value: '35–45%', label: 'Proteína cruda (base fresca)', color: C.green },
  { value: '~40%',   label: 'Proteína (base seca)',          color: C.emerald },
  { value: '25–35%', label: 'Grasa bruta',                   color: '#38bdf8' },
  { value: '6–7%',   label: 'Calcio',                        color: '#f59e0b' },
];

const envAdvantages = [
  'Reduce hasta un 80% el volumen de residuos orgánicos en solo 2–3 semanas.',
  'Produce frass (biol sólido) de alto valor como abono para suelos y cultivos.',
  'Ciclo cerrado: los residuos de la finca se convierten en proteína para los animales.',
  'No compite con cultivos destinados a consumo humano.',
];

const faqs = [
  { q: '¿Necesito experiencia previa?', a: 'No. El sistema BSF es uno de los más sencillos de implementar. Si puedes darle de comer a tus animales cada día, puedes criar larvas.' },
  { q: '¿Funciona en mi clima?', a: 'La BSF es nativa de los trópicos y se adapta perfecto a climas cálidos (26–32°C ideal). Funciona en toda la franja tropical y templada de Colombia y LATAM.' },
  { q: '¿Qué necesito para empezar?', a: 'Un recipiente, residuos orgánicos de la finca (frutas, verduras, estiércol) y la semilla BSF. Sin maquinaria ni inversión grande.' },
  { q: '¿Cuánto tiempo tarda la primera cosecha?', a: 'Entre 15 y 18 días desde que colocas los huevos. Es uno de los ciclos de producción de proteína más rápidos que existen.' },
  { q: '¿Cuánto puedo ahorrar en concentrado?', a: 'Productores con gallinas reportan hasta un 25–35% de reducción. En cerdos puede llegar al 20–30%. Depende del % de reemplazo que apliques.' },
];

const papers = [
  {
    tag: '🔬 Composición',
    tagColor: '#8b5cf6',
    year: '2022',
    title: 'Nutritional Composition of BSFL and Its Potential Uses as Alternative Protein Sources in Animal Diets',
    journal: 'National Library of Medicine · PMC',
    finding: 'Hasta 50% de proteína en base seca; perfil de aminoácidos comparable al de la harina de pescado.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9502457',
  },
  {
    tag: '🐔🐷 Aves y Cerdos',
    tagColor: '#f59e0b',
    year: '2025',
    title: 'Black Soldier Fly Larvae as a Novel Protein Feed Resource Promoting Circular Economy in Agriculture',
    journal: 'MDPI Animals',
    finding: 'Contenido proteico del 40–60%; sustituye parcialmente harina de soya y pescado sin afectar rendimiento productivo.',
    url: 'https://www.mdpi.com/2075-4450/16/8/830',
  },
  {
    tag: '♻️ Residuos',
    tagColor: '#10b981',
    year: '2022',
    title: 'Black Soldier Fly Larvae (BSFL) and Their Affinity for Organic Waste Processing',
    journal: 'Waste Management · ScienceDirect',
    finding: 'Reducción de residuos orgánicos hasta el 84.8%; tasa de conversión residuo → biomasa del 27.9%.',
    url: 'https://www.sciencedirect.com/science/article/pii/S0956053X22000010',
  },
  {
    tag: '🌎 LATAM · 🐔 Aves',
    tagColor: '#22c55e',
    year: '2024',
    title: 'Larva de mosca soldado negra (Hermetia illucens L.) en la nutrición animal: una innovación en la alimentación avícola',
    journal: 'Agro-Divulgación · Durán Méndez et al.',
    finding: 'Suplementación al 14–16% mejora parámetros productivos en aves y reduce costos de concentrado comercial.',
    url: 'https://www.researchgate.net/publication/380640536_Larva_de_mosca_soldado_negra_Hermetia_illucens_L_en_la_nutricion_animal_una_innovacion_en_la_alimentacion_avicola',
  },
  {
    tag: '🇨🇴 Colombia',
    tagColor: '#ef4444',
    year: '2023',
    title: 'Hermetia illucens en la alimentación de aves — revisión latinoamericana',
    journal: 'Dialnet · Mundo Fesc Colombia',
    finding: 'Revisión de uso de BSF en avicultura colombiana; fuente proteica viable, sostenible y adaptable al trópico.',
    url: 'https://dialnet.unirioja.es/descarga/articulo/10244447.pdf',
  },
  {
    tag: '🌎 LATAM · Cuy',
    tagColor: '#38bdf8',
    year: '2020',
    title: 'Harina de Hermetia illucens como reemplazo parcial de harina de soja en la alimentación de Cavia porcellus',
    journal: 'SciELO Perú · Revista Peruana de Biología',
    finding: 'Con 16% de inclusión, la BSFL (42% proteína) iguala a la soja en ganancia de peso sin efectos negativos.',
    url: 'http://www.scielo.org.pe/scielo.php?script=sci_arttext&pid=S2077-99172020000400513',
  },
  {
    tag: '🌱 Sostenibilidad',
    tagColor: '#4ade80',
    year: '2025',
    title: 'Evaluating the Nutrient and Fatty Acid Profiles of BSFL Raised on Various Organic Diets',
    journal: 'Frontiers in Insect Science',
    finding: 'BSFL criadas en subproductos orgánicos mantienen hasta 50% de proteína y perfil lipídico ideal para acuicultura.',
    url: 'https://www.frontiersin.org/journals/insect-science/articles/10.3389/finsc.2025.1692096/full',
  },
  {
    tag: '♻️ Valorización',
    tagColor: '#f97316',
    year: '2019',
    title: 'An Inclusive Approach for Organic Waste Treatment and Valorisation Using Black Soldier Fly Larvae: A Review',
    journal: 'Waste Management · ScienceDirect',
    finding: 'BSFL convierte residuos en proteína de alta calidad para peces y aves; el frass resultante actúa como biofertilizante.',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0301479719312873',
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>❓ Preguntas frecuentes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{ background: 'rgba(21,32,53,0.7)', border: `1px solid ${open === i ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.12)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.4 }}>{faq.q}</span>
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 18, flexShrink: 0, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.15s' }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: '0 18px 16px', fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const db = useSocios();
  const [animalTab, setAnimalTab] = useState(0);
  const [showPapers, setShowPapers] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="hero-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <img src="/larvi-mascota.png" alt="Larvi" className="hero-mascot" style={{ width: 80, height: 80, objectFit: 'contain', flexShrink: 0 }} />
          <h1 className="hero-title" style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 900, lineHeight: 1.15, margin: 0, textAlign: 'left' }}>
            ¿Por qué{' '}
            <span style={{ background: 'linear-gradient(135deg,#4ade80,#16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              BSF?
            </span>
          </h1>
        </div>
        <p style={{ fontSize: 16, color: C.muted, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
          La mosca soldado negra (<em>Hermetia illucens</em>) transforma residuos orgánicos en proteína de alto valor biológico. Aquí los datos más relevantes por especie y las ventajas ambientales comprobadas.
        </p>
      </div>

      {/* Alerta lotes listos (socios) */}
      {db.loaded && db.session && db.readyLotes.length > 0 && (
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {db.readyLotes.map(l => (
            <Link key={l.id} href="/socios" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🌾</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{l.nombre}</span>
                <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}> — ¡Listo para cosechar!</span>
              </div>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700, flexShrink: 0 }}>Ver en Socios →</span>
            </Link>
          ))}
        </div>
      )}

      {/* Beneficios por animal — tabs */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: C.purple, fontWeight: 600 }}>⭐ Beneficios por especie</span>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
        {/* Botones de tab */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {animalBenefits.map((b, i) => (
            <button
              key={i}
              onClick={() => setAnimalTab(i)}
              style={{
                flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                background: animalTab === i ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: animalTab === i ? C.greenL : C.muted,
                borderBottom: animalTab === i ? `2px solid ${C.green}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {b.animal}
            </button>
          ))}
        </div>
        {/* Contenido del tab activo */}
        <div style={{ padding: '20px 24px' }}>
          {animalBenefits[animalTab].items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 14, color: C.muted, lineHeight: 1.55 }}>
              <span style={{ color: C.green, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Composición nutricional */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 16 }}>🔬 Composición nutricional (larva BSFL)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12 }}>
          {nutritionStats.map(s => (
            <div key={s.label} style={{ background: C.card2, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#475569', marginTop: 14, lineHeight: 1.5 }}>
          Valores orientativos. La composición varía según sustrato, edad de cosecha y método de procesado.
        </p>
      </div>

      {/* Ventajas ambientales */}
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 14 }}>♻️ Ventajas ambientales</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {envAdvantages.map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
              <span style={{ color: C.emerald, flexShrink: 0, marginTop: 2, fontSize: 10 }}>●</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cualquier persona puede empezar */}
      <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.05))', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: '28px 28px', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', marginBottom: 12 }}>
          🚀 Cualquier productor puede empezar
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
          No necesitas experiencia ni equipos costosos. Si tienes residuos orgánicos en tu finca — sobras de cocina, frutas, estiércol — ya tienes el insumo principal. En menos de 3 semanas puedes tener tu primera cosecha de larva fresca lista para dársela a tus animales.
        </p>
        <div className="inicio-pasos" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { n: '1', titulo: 'Consigue la semilla', detalle: 'Huevos de BSF o larvas pequeñas para arrancar tu colonia' },
            { n: '2', titulo: 'Alimenta con residuos', detalle: 'Frutas, verduras, estiércol — lo que ya tienes en la finca' },
            { n: '3', titulo: 'Cosecha en 18 días', detalle: 'Larva fresca lista para pollos, cerdos o peces' },
          ].map(p => (
            <div key={p.n} style={{ background: 'rgba(21,32,53,0.8)', borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.green, marginBottom: 6 }}>{p.n}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{p.titulo}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{p.detalle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <FaqSection />

      {/* Evidencia científica */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: C.purple, fontWeight: 600 }}>📄 Respaldo científico</span>
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>Evidencia científica</h2>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
          Papers revisados por pares de PubMed, ScienceDirect y revistas latinoamericanas que respaldan el uso de BSFL en nutrición animal.
        </p>
        <button
          onClick={() => setShowPapers(v => !v)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: showPapers ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, color: C.purple, marginBottom: 16, transition: 'background 0.15s' }}
        >
          📄 Ver todos los papers ({papers.length})
          <span style={{ fontSize: 11, transform: showPapers ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </button>
        {showPapers && <div className="papers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {papers.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'rgba(21,32,53,0.85)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 14, padding: '14px 16px', transition: 'border-color 0.15s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 6 }}>
                <span style={{ background: `${p.tagColor}22`, color: p.tagColor, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, border: `1px solid ${p.tagColor}40`, flexShrink: 0 }}>
                  {p.tag}
                </span>
                <span style={{ fontSize: 10, color: '#475569', fontWeight: 700, flexShrink: 0 }}>{p.year}</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5, marginBottom: 5, flex: 1 }}>
                {p.title}
              </p>
              <p style={{ fontSize: 10, color: '#475569', marginBottom: 9, fontStyle: 'italic' }}>{p.journal}</p>
              <div style={{ borderLeft: `2px solid ${C.green}`, paddingLeft: 9, marginBottom: 9 }}>
                <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>{p.finding}</p>
              </div>
              <span style={{ fontSize: 11, color: C.purple, fontWeight: 700 }}>Leer paper →</span>
            </a>
          ))}
        </div>}
      </div>

      {/* Quién soy */}
      <div style={{ borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: 40, marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: C.greenL, textAlign: 'center', marginBottom: 24 }}>
          ¿Quién está detrás de ProLarva?
        </h2>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px' }}>
          <div className="juliana-wrap" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <img src="/juliana.jpg" alt="Juliana Coronel — fundadora de ProLarva" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `3px solid ${C.green}`, boxShadow: `0 6px 28px ${C.green}35` }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: 14 }}>Juliana Coronel</div>
                <div style={{ fontSize: 12, color: C.muted }}>Fundadora · ProLarva</div>
                <div style={{ fontSize: 12, color: C.muted }}>Cúcuta, Colombia 🇨🇴</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              {[
                'Soy productora de larvas BSF en Colombia. Crío mis propios animales de traspatio y soy la fundadora de ProLarva.',
                'No soy una empresa grande ni un laboratorio. Soy una productora como tú, que encontró una forma de producir más con menos gasto: lo probé en mi propia granja, lo documenté desde el día cero y decidí enseñárselo directamente a otros productores.',
                'Sin experiencia previa. Sin tecnología compleja. Con lo que ya tienes en tu finca.',
              ].map((p, i) => (
                <p key={i} style={{ lineHeight: 1.75, fontSize: 13, color: '#d4e8da', marginBottom: 10 }}>{p}</p>
              ))}
              <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, fontSize: 12, color: C.muted, fontStyle: 'italic', lineHeight: 1.6 }}>
                Para: pequeños productores con gallinas, pollos, cerdos o peces — que quieren bajar costos de concentrado desde el traspatio.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs principales */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
        <Link
          href="/colonia"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            color: 'white', padding: '13px 28px', borderRadius: 12,
            textDecoration: 'none', fontWeight: 700, fontSize: 15,
          }}
        >
          🌱 Unirme al Programa Colonia
        </Link>
        <a
          href="https://www.tiktok.com/@prolarva.co"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#e2e8f0', padding: '13px 28px', borderRadius: 12,
            textDecoration: 'none', fontWeight: 700, fontSize: 15,
          }}
        >
          🎵 Síguenos en TikTok
        </a>
      </div>

      {/* Compartir */}
      <div style={{ textAlign: 'center', paddingTop: 28, borderTop: '1px solid rgba(34,197,94,0.1)' }}>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>¿Te parece útil? Compártelo con otros productores</p>
        <ShareButton />
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hero-row { flex-direction: column; gap: 8px; }
          .hero-mascot { width: 64px !important; height: 64px !important; }
          .hero-title { text-align: center !important; font-size: clamp(22px,6vw,32px) !important; }
          .inicio-pasos { grid-template-columns: 1fr !important; }
          .juliana-wrap { flex-direction: column; align-items: center !important; }
          .papers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
