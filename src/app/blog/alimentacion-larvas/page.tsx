'use client';

import Link from 'next/link';

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
  blue:   '#3b82f6',
  purple: '#a855f7',
};

const sustratos = [
  {
    emoji: '🥦',
    nombre: 'Desechos de frutas y verduras',
    proteina: '10–15%',
    desc: 'Base ideal para cualquier camada. Cáscaras, restos de cocina, frutas pasadas. Aportan humedad y carbohidratos para energía.',
    nivel: 'Base',
    color: C.green,
    colorBg: 'rgba(34,197,94,0.08)',
    colorBorder: 'rgba(34,197,94,0.2)',
  },
  {
    emoji: '🌾',
    nombre: 'Afrecho / salvado de trigo o arroz',
    proteina: '13–18%',
    desc: 'Excelente para balancear humedad. Absorbe el exceso de líquido y aporta fibra y proteína vegetal. Mezclar con sustratos húmedos.',
    nivel: 'Base',
    color: C.amber,
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
  },
  {
    emoji: '☕',
    nombre: 'Pulpa de café',
    proteina: '10–12%',
    desc: 'Las larvas la consumen bien. Rica en materia orgánica. Ideal en zonas cafeteras. No usar más del 30% del sustrato total para evitar acidez.',
    nivel: 'Complemento',
    color: C.amber,
    colorBg: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
  },
  {
    emoji: '🐔',
    nombre: 'Gallinaza / estiércol de gallina',
    proteina: '25–35%',
    desc: 'La fuente proteica más accesible. Acelera el crecimiento notablemente. Usar siempre fresca o semifermentada, no seca. Máximo 40% del total.',
    nivel: 'Alto proteico',
    color: C.purple,
    colorBg: 'rgba(168,85,247,0.08)',
    colorBorder: 'rgba(168,85,247,0.2)',
  },
  {
    emoji: '🥩',
    nombre: 'Concentrado de pollo o cerdo',
    proteina: '20–28%',
    desc: 'El booster proteico más controlado. Humedece antes de aplicar. Ideal para la fase de engorde de la larva (días 10–15). Eleva la proteína del tejido de la larva.',
    nivel: 'Alto proteico',
    color: C.purple,
    colorBg: 'rgba(168,85,247,0.08)',
    colorBorder: 'rgba(168,85,247,0.2)',
  },
  {
    emoji: '🐟',
    nombre: 'Harina de pescado o vísceras frescas',
    proteina: '40–60%',
    desc: 'El sustrato más alto en proteína. Solo para las últimas 48–72h antes de cosecha. Eleva el perfil de aminoácidos de la larva cosechada. Genera olor fuerte.',
    nivel: 'Ultra proteico',
    color: C.blue,
    colorBg: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.2)',
  },
];

const evitar = [
  { emoji: '🍋', texto: 'Cítricos en exceso (limón, naranja, mandarina en grandes cantidades)', razon: 'Bajan el pH y acidifican el sustrato — las larvas ralentizan o mueren' },
  { emoji: '🧂', texto: 'Alimentos muy salados o con conservantes', razon: 'La sal deshidrata las larvas; los conservantes son tóxicos para el cultivo' },
  { emoji: '🧄', texto: 'Ajo y cebolla en grandes cantidades', razon: 'Compuestos sulfurados en altas concentraciones inhiben el desarrollo' },
  { emoji: '🫙', texto: 'Alimentos con fungicidas o pesticidas', razon: 'Tóxicos directos — pueden eliminar toda la camada sin señales previas' },
  { emoji: '🛢️', texto: 'Aceites y grasas en exceso', razon: 'Sellan la superficie del sustrato, reducen el oxígeno disponible y generan pudrición anaeróbica' },
  { emoji: '🦴', texto: 'Carne cruda en descomposición avanzada (más de 3 días)', razon: 'Atrae moscas de otras especies que compiten con la BSF y genera olores extremos' },
  { emoji: '💊', texto: 'Excretas de animales con antibióticos recientes', razon: 'Los residuos antibióticos en la gallinaza matan la microbiota que ayuda a procesar el sustrato' },
];

const porEtapa = [
  {
    dias: 'Días 1–5',
    fase: 'Larva recién eclosionada',
    emoji: '🥚',
    sustrato: 'Mezcla suave: frutas/verduras + afrecho (80/20)',
    proteina: '10–14%',
    humedad: '65–70%',
    frecuencia: '1 vez/día',
    cantidad: '3–5× el peso de larvas',
    nota: 'Triturar o licuar el sustrato — la boca es muy pequeña al inicio',
    color: C.green,
  },
  {
    dias: 'Días 6–12',
    fase: 'Crecimiento activo',
    emoji: '🐛',
    sustrato: 'Frutas/verduras + gallinaza o concentrado (60/40)',
    proteina: '18–24%',
    humedad: '60–65%',
    frecuencia: '1–2 veces/día',
    cantidad: '8–12× el peso de larvas',
    nota: 'Esta etapa define el tamaño final. No escatimar cantidad ni proteína',
    color: C.amber,
  },
  {
    dias: 'Días 13–18',
    fase: 'Engorde y pre-cosecha',
    emoji: '💪',
    sustrato: 'Concentrado + gallinaza (50/50) o harina de pescado las últimas 48h',
    proteina: '25–35%',
    humedad: '55–60%',
    frecuencia: '1 vez/día (reducir las últimas 48h)',
    cantidad: '10–15× el peso de larvas',
    nota: 'Alto proteico elevan el % de proteína de la larva cosechada (del 40 al 46%+)',
    color: C.purple,
  },
  {
    dias: 'Días 19–22',
    fase: 'Prepupa / cosecha inminente',
    emoji: '⏰',
    sustrato: 'Detener alimentación',
    proteina: '—',
    humedad: '—',
    frecuencia: 'No aplicar',
    cantidad: '—',
    nota: 'La larva deja de comer. Agregar sustrato solo genera desechos y olores. Cosechar ya.',
    color: C.red,
  },
];

export default function AlimentacionLarvasPage() {
  return (
    <main style={{ background: C.bg, minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 20px 0' }}>
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
          Manejo · BSF
        </div>

        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 38px)',
          fontWeight: 800,
          lineHeight: 1.2,
          color: C.text2,
          maxWidth: 640,
          margin: '0 auto 16px',
        }}>
          Qué comen las larvas BSF y<br />
          <span style={{ color: C.green }}>cómo alimentarlas bien</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
          Sustratos recomendados, porciones por etapa, qué evitar y cómo variar la proteína para obtener una larva más nutritiva al cosechar.
        </p>

        <div style={{ marginTop: 16, fontSize: 13, color: C.muted2 }}>
          Por Juliana · ProLarva
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* INTRO */}
        <div style={{
          background: C.card,
          border: '1px solid rgba(34,197,94,0.15)',
          borderRadius: 16,
          padding: '24px 24px',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text2, marginBottom: 12 }}>
            🧠 La regla base
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: '0 0 16px' }}>
            Las larvas BSF comen materia orgánica en descomposición. No son selectivas, pero sí responden muy distinto según la calidad del sustrato. Un buen sustrato se traduce en larvas más grandes, más nutritivas y en menor tiempo de producción.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'Relación base', valor: '10:1 — 10g sustrato por 1g de larva/día', icon: '⚖️' },
              { label: 'Humedad ideal', valor: '60–70% (aplasta y no gotea)', icon: '💧' },
              { label: 'Temperatura', valor: '26–32°C para máximo crecimiento', icon: '🌡️' },
            ].map((item, i) => (
              <div key={i} style={{
                flex: '1 1 200px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 12,
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: C.muted2, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.greenL }}>{item.valor}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUSTRATOS RECOMENDADOS */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 16 }}>
            Sustratos recomendados
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sustratos.map((s, i) => (
              <div key={i} style={{
                background: s.colorBg,
                border: `1px solid ${s.colorBorder}`,
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {s.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: C.text2 }}>{s.nombre}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 8,
                      background: `${s.colorBg}`,
                      border: `1px solid ${s.colorBorder}`,
                      color: s.color,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                    }}>
                      {s.nivel}
                    </span>
                    <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>
                      ~{s.proteina} prot.
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PORCIONES POR ETAPA */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 16 }}>
            Porciones y manejo por etapa del ciclo
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {porEtapa.map((e, i) => (
              <div key={i} style={{
                background: C.card,
                border: `1px solid rgba(255,255,255,0.07)`,
                borderLeft: `4px solid ${e.color}`,
                borderRadius: 14,
                overflow: 'hidden',
              }}>
                <div style={{
                  background: C.card2,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 22 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.text2 }}>{e.dias}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{e.fase}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'Sustrato', valor: e.sustrato },
                      { label: 'Proteína objetivo', valor: e.proteina },
                      { label: 'Humedad', valor: e.humedad },
                      { label: 'Frecuencia', valor: e.frecuencia },
                      { label: 'Cantidad/día', valor: e.cantidad },
                    ].map((item, j) => (
                      <div key={j}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: C.muted2, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: item.valor === '—' || item.valor === 'No aplicar' ? C.red : C.text }}>{item.valor}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: C.muted,
                    lineHeight: 1.6,
                  }}>
                    💡 {e.nota}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUÉ EVITAR */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 16 }}>
            Qué evitar echar al criadero
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {evitar.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 14,
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 12,
                padding: '14px 16px',
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{item.texto}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>⚠️ {item.razon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VARIAR PROTEÍNA */}
        <div style={{
          background: `linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.08))`,
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: 16,
          padding: '24px 22px',
          marginBottom: 36,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text2, marginBottom: 6 }}>
            🔬 Cómo variar la proteína de la larva cosechada
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 18 }}>
            La proteína del tejido de la larva BSF varía entre el 38% y el 48% dependiendo directamente de lo que comió en los últimos días. Puedes "programar" una larva más nutritiva ajustando el sustrato en la última semana:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { proteina: '38–40%', label: 'Larva estándar', sustrato: 'Solo desechos de cocina y afrecho todo el ciclo', color: C.muted },
              { proteina: '42–44%', label: 'Larva optimizada', sustrato: 'Gallinaza o concentrado a partir del día 8', color: C.greenL },
              { proteina: '44–48%', label: 'Larva premium', sustrato: 'Harina de pescado o vísceras frescas los últimos 2–3 días antes de cosechar', color: C.purple },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '12px 16px',
              }}>
                <div style={{
                  flexShrink: 0,
                  fontSize: 15, fontWeight: 800,
                  color: item.color,
                  minWidth: 70,
                  paddingTop: 1,
                }}>
                  {item.proteina}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.sustrato}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16,
            background: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: '#d8b4fe',
            lineHeight: 1.65,
          }}>
            ⚡ El perfil proteico de la larva se puede controlar — esto es lo que diferencia a un productor básico de uno que puede cobrar más por su larva.
          </div>
        </div>

        {/* TIPS EXTRAS */}
        <div style={{
          background: C.card,
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '20px 22px',
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.muted2, marginBottom: 14 }}>
            Tips extra de alimentación
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Homogeniza el sustrato antes de echarlo — las larvas llegan mejor a la mezcla y se evitan zonas sin comer.',
              'Si el sustrato huele muy fuerte (amoníaco), agrega afrecho seco: absorbe el exceso de nitrógeno.',
              'La superficie del criadero no debe verse seca ni encharcada. Si gotea, agrega afrecho; si está seca, humedece con agua sin cloro.',
              'No apliques sustrato encima de las larvas directamente — échalo a un lado y deja que se desplacen hacia él.',
              'En días calurosos (+30°C), reduce la cantidad de sustrato para evitar sobrecalentamiento del criadero.',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                {tip}
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
            ¿Tienes dudas sobre el sustrato de tu criadero?
          </h3>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 26px' }}>
            Cuéntale a Juliana qué materiales tienes disponibles en tu zona y te dice cómo combinarlos para sacarle el máximo a tu camada.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/573223212293?text=Hola%20Juliana%2C%20tengo%20una%20duda%20sobre%20c%C3%B3mo%20alimentar%20mis%20larvas%20BSF"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: C.green,
                color: C.deep,
                fontWeight: 800,
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Preguntarle a Juliana →
            </a>
            <Link href="/blog/raciones" style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: C.text,
              fontWeight: 700,
              fontSize: 15,
              padding: '14px 28px',
              borderRadius: 10,
              textDecoration: 'none',
            }}>
              Ver raciones por animal
            </Link>
          </div>
        </div>
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
