'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';

interface Message {
  from: 'larvi' | 'user';
  text: string;
}

interface Option {
  label: string;
  action: string;
}

interface ConversationNode {
  message: string;
  options?: Option[];
  link?: string;
}

const tree: Record<string, ConversationNode> = {
  start: {
    message: '¡Hola! 👋 Soy Larvi, mascota de ProLarva. ¿Cuál es tu principal pregunta?',
    options: [
      { label: '¿Qué es la larva BSF?', action: 'faq_que_es' },
      { label: '¿Es complicado criarlas?', action: 'faq_complicado' },
      { label: '¿Cuánto dinero ahorro?', action: 'faq_costo' },
      { label: '¿Cómo compro el kit?', action: 'faq_compra' },
      { label: 'Tengo un problema técnico', action: 'problema' },
      { label: 'Otro tipo de duda', action: 'faq_menu' },
    ],
  },

  // ============ FAQs - ¿Qué es BSF? ============
  faq_que_es: {
    message: 'La BSF (Black Soldier Fly / Larva de Mosca Soldado Negra) es un insecto cuya larva es **proteína pura**. Conviertes residuos orgánicos en proteína animal en 15-20 días. Tus animales la comen naturalmente, sin químicos.',
    options: [
      { label: '¿Es segura para mis animales?', action: 'faq_segura' },
      { label: '¿Atrae plagas o moscas?', action: 'faq_plagas' },
      { label: 'Quiero aprender más', action: 'faq_menu' },
    ],
  },
  faq_segura: {
    message: 'Sí, es más segura que concentrado comercial:\n✅ Proteína natural (sin aglutinantes ni antibióticos)\n✅ Menos enfermedades digestivas\n✅ Pollos más amarillos y brillosos\n✅ Cerdos con menos grasa\n✅ Peces más rápidos en crecer\n\nPrueba real: 50 pollitos con 25% larvas BSF → $150 USD/mes menos en concentrado, cero enfermedades.',
    options: [
      { label: '¿Cuánto ahorro entonces?', action: 'faq_costo' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_plagas: {
    message: 'No. La larva de BSF no atrae moscas comunes:\n• La BSF es un insecto específico (no es mosca de fruta)\n• El contenedor está cerrado (sin contacto con ambiente)\n• Si se cría bien = cero olor\n• Al final del ciclo recolectas las larvas — se acaba\n\n¿Te preocupa algo más sobre esto?',
    options: [
      { label: 'No, suena bien', action: 'faq_menu' },
      { label: '¿Cómo funciona el ciclo?', action: 'faq_ciclo' },
    ],
  },

  // ============ FAQs - ¿Es complicado? ============
  faq_complicado: {
    message: 'No. Son 5 pasos simples:\n1️⃣ Día 1: Armás el contenedor (2 min) + echás semilla\n2️⃣ Días 2-14: Alimentás con residuos de cocina\n3️⃣ Días 15-18: Cosecharlas (30 min)\n4️⃣ Día 18+: Congelás o deshidratás (opcional)\n5️⃣ Día 20+: Siguiente ciclo\n\nLo más "complicado": aprovechar residuos de cocina. Eso es todo.',
    options: [
      { label: '¿Cuánto trabajo extra tengo?', action: 'faq_trabajo' },
      { label: '¿Necesito mucho espacio?', action: 'faq_espacio' },
      { label: 'Suena bien, quiero comprar', action: 'faq_compra' },
    ],
  },
  faq_trabajo: {
    message: 'Cero trabajo extra:\n• Ya tirás residuos → ahora los echás al contenedor (2 min/día)\n• Ya alimentás animales → agregas larvas 1-2 veces/semana (5 min)\n• El resto sucede solo\n\n⏱️ Tiempo total semanal: 20 minutos. Nada.',
    options: [
      { label: '¿Y si me voy de viaje?', action: 'faq_viaje' },
      { label: 'Siguiente pregunta', action: 'faq_menu' },
    ],
  },
  faq_espacio: {
    message: 'No. El contenedor (50×40×40 cm) cabe en:\n• Una esquina del gallinero\n• Debajo del techo de la cocina\n• Un patio pequeño\n• Una huerta chica\n\nOcupa menos que una maceta. Ideal para cualquier finca.',
    options: [
      { label: '¿Cuánto cuesta el kit?', action: 'faq_precio' },
      { label: 'Otra duda', action: 'faq_menu' },
    ],
  },
  faq_viaje: {
    message: '✅ Hasta 1 semana: sin problema (les echás comida de más antes de irte)\n❌ 2+ semanas: riesgo de que se coman entre ellas\n\n💡 Para viajes largos: congela las larvas en la mitad del ciclo. Pausa el ciclo y arranca cuando regreses.',
    options: [
      { label: 'Siguiente pregunta', action: 'faq_menu' },
      { label: 'Ver guía de cosecha', action: 'cosecha_link' },
    ],
  },

  // ============ FAQs - Costo & Ahorro ============
  faq_costo: {
    message: '¿Cuánto ahorras depende de tus animales:\n🐔 Pollos (50): $120–150 USD/mes → Ahorras $30–50 USD/mes (25%)\n🐷 Cerdos (5): $200–300 USD/mes → Ahorras $50–90 USD/mes (20%)\n🐟 Peces (1000): $80–120 USD/mes → Ahorras $20–40 USD/mes (30%)\n\n⏱️ Tiempo al primer resultado: 20 días\n💰 ROI: El Kit ($48 USD) se paga en 2-3 cosechas. Después = cero costo.',
    options: [
      { label: 'Quiero calcular exacto', action: 'faq_calculadora' },
      { label: '¿Qué incluye el kit?', action: 'faq_que_incluye' },
    ],
  },
  faq_calculadora: {
    message: 'Abre la Calculadora ProLarva — pone tus números (especie, cantidad, gastos) y te dice exactamente cuánto ahorras.',
    link: '/calculadora',
    options: [
      { label: 'Ir a la calculadora →', action: 'end' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_que_incluye: {
    message: 'El Kit ProLarva 20 ($48 USD) incluye TODO:\n✅ Pupas de BSF (semilla viva)\n✅ Larvas de inicio\n✅ Manual impreso paso a paso\n✅ Malla love cage (contenedor armable)\n✅ Trampas de huevos\n✅ 45 días de acompañamiento (WhatsApp + Zoom)\n\nDespués del kit: solo gastos en residuos (restos de cocina, estiércol). Cero costo fijo.',
    options: [
      { label: '¿Tiene garantía?', action: 'faq_garantia' },
      { label: 'Quiero comprar', action: 'faq_compra' },
    ],
  },
  faq_precio: {
    message: '💰 **Kit ProLarva 20:** $200.000 COP ≈ $48 USD (todo incluido)\n🤝 **Acompañamiento 45 días:** Incluido (sin costo)\n➕ **Acompañamiento 180 días (opcional):** $35 USD\n\n📦 **Bonos incluidos:**\n• Acceso a /socios (tracker privado)\n• Calculadora personalizada\n• Videos privados\n• Comunidad de productores\n\nSin sorpresas de precio. Transferencia bancaria o tarjeta.',
    options: [
      { label: '¿Tiene garantía?', action: 'faq_garantia' },
      { label: 'Quiero comprar ahora', action: 'faq_compra' },
    ],
  },
  faq_garantia: {
    message: '✅ **100% garantía de dinero devuelto en 15 días** si:\n• Las larvas no crecen\n• No recibís el kit en 7 días hábiles\n• El contenedor llega dañado\n\nSi después de 15 días no estás satisfecho → reembolso total.\n\n📊 Realidad: +80 productores ya lo hicieron. Ninguno pidió devolución.',
    options: [
      { label: 'Estoy convencido, quiero comprar', action: 'faq_compra' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },

  // ============ FAQs - Compra ============
  faq_compra: {
    message: 'Solo 3 pasos:\n1️⃣ Completá el formulario en /sistema-2015 (nombre, WhatsApp, ubicación)\n2️⃣ Juliana te contacta en 24h para confirmar envío y pago\n3️⃣ Recibís el kit en 5-7 días hábiles listo para usar\n\n🌍 Envío: Colombia, Perú, Ecuador, Centroamérica\n💬 WhatsApp de Juliana: +57 322 321 2293',
    link: '/sistema-2015',
    options: [
      { label: 'Ir al formulario →', action: 'end' },
      { label: '¿Cómo es el acompañamiento?', action: 'faq_acompanamiento' },
    ],
  },
  faq_acompanamiento: {
    message: '**El acompañamiento es REAL y directo:**\n📞 Juliana (fundadora) te responde por WhatsApp en 24h\n🎥 Zoom semanal con otros productores para resolver dudas\n📋 Checklist paso a paso para cada etapa\n🚨 Soporte de emergencia si algo sale mal\n\n💭 Muchos productores dicen: "El acompañamiento vale más que el kit".',
    options: [
      { label: 'Listo, voy a comprar', action: 'faq_compra' },
      { label: 'Tengo dudas técnicas', action: 'faq_menu' },
    ],
  },

  // ============ FAQs - Dudas técnicas ============
  faq_ciclo: {
    message: '**El ciclo son ~18 días:**\n📅 Días 0-2: Huevo — Semilla eclosiona\n📅 Días 3-8: Larva pequeña — Crecen rápido, comen mucho\n📅 Días 9-14: Larva grande — Máximo crecimiento\n📅 Días 15-17: Prepupa — Dejan de comer, se oscurecen\n📅 Día 18+: Cosecha — Listas para tus animales\n\n¿Quierés saber más sobre alguna etapa?',
    link: '/conocimiento',
    options: [
      { label: 'Ver todas las etapas →', action: 'end' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_residuos: {
    message: 'Las larvas comen casi todo:\n✅ Restos de verdura (cáscaras, tallos)\n✅ Frutas vencidas\n✅ Restos de comida cocida (sin exceso de aceite)\n✅ Estiércol fresco (gallinas, cerdos, vaca)\n✅ Hojas secas, aserrín\n✅ Harina, granos, avena\n✅ Sangre, tripería\n\n❌ NO: Plásticos, vidrio, aceite puro, químicos\n\n💡 Consejo: mezcla seco + húmedo en balance 1:1 para evitar olor.',
    link: '/cosecha',
    options: [
      { label: 'Ver guía de alimentación →', action: 'end' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_cosecha_cuanto: {
    message: 'Del Kit ProLarva 20 obtenés:\n🔄 Ciclo 1: 2-4 kg de larvas vivas (depende de residuos)\n🔄 Ciclo 2+: 4-8 kg por ciclo (mejor calibrado)\n\n💡 Equivalencia: 1 kg larvas = 1 kg concentrado proteico\n📊 Un ciclo = larvas para 2-4 semanas (según tus animales)',
    options: [
      { label: 'Quiero calcular mi caso', action: 'faq_calculadora' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_asco: {
    message: 'Es normal al principio. Después de 2 días, es normal:\n• Son gusanos blancos, suave, tamaño de una pasta\n• Tus pollos/peces/cerdos los comen naturalmente\n• Muchos productores dicen: "Más limpio que destazar pollo"\n\n💡 Consejo: mira primero cómo tus animales las comen. El asco desaparece rápido.',
    options: [
      { label: 'Siguiente pregunta', action: 'faq_menu' },
      { label: 'Ver beneficios reales', action: 'faq_segura' },
    ],
  },
  faq_olor: {
    message: 'Si se maneja bien, **nada de olor**:\n• Residuos secos (aserrín, estiércol) → cero hedor\n• Residuos húmedos balanceados → olor neutral (como composta)\n• Si huele mal → algo está fuera de balance (lo arreglamos)\n\n💭 Algunos productores dicen: "Más limpio que el gallinero tradicional"',
    link: '/conocimiento',
    options: [
      { label: 'Ver balance correcto →', action: 'end' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_frass: {
    message: '💰 El frass (popo de larva) es **oro negro** para agricultores:\n💵 Se vende a $20-40 USD por bolsa (en LATAM)\n🌾 Es excelente biofertilizante (mejor que compost)\n🏡 Puedes usarlo en tu huerta o vender a agricultores\n\n📊 Algunos productores viven del frass vendiendo a otros.',
    options: [
      { label: 'Quiero saber todo', action: 'faq_menu' },
      { label: 'Estoy decidido, compro', action: 'faq_compra' },
    ],
  },
  faq_negocio: {
    message: '✅ Sí. Niveles de negocio:\n🎯 **Hobista** (1-2 kits): $50–100 USD/mes | Inversión: $48 USD\n🎯 **Pequeño productor** (5-10 kits): $300–600 USD/mes | Inversión: $240 USD\n🎯 **Mediano** (20+ kits): $1500+ USD/mes | Inversión: $960+ USD\n\n💡 Muchos empiezan como hobista y escalan.',
    link: '/metas',
    options: [
      { label: 'Ver las 3 metas →', action: 'end' },
      { label: 'Otra pregunta', action: 'faq_menu' },
    ],
  },
  faq_menu: {
    message: '¿Qué más querés saber?',
    options: [
      { label: '¿Qué es BSF? (básico)', action: 'faq_que_es' },
      { label: '¿Es complicado?', action: 'faq_complicado' },
      { label: '¿Cuánto ahorro?', action: 'faq_costo' },
      { label: 'Ciclo & etapas', action: 'faq_ciclo' },
      { label: '¿Residuos seguros?', action: 'faq_residuos' },
      { label: '¿Se ve asqueroso?', action: 'faq_asco' },
      { label: '¿Huele mal?', action: 'faq_olor' },
      { label: '¿Cuántas larvas cosecho?', action: 'faq_cosecha_cuanto' },
      { label: '¿Se vende el frass?', action: 'faq_frass' },
      { label: '¿Puedo vivir de esto?', action: 'faq_negocio' },
      { label: 'Comprar kit', action: 'faq_compra' },
      { label: 'Problema técnico', action: 'problema' },
    ],
  },

  // ============ Helper links ============
  cosecha_link: {
    message: 'Ve a la guía de cosecha — ahí mostramos cómo cosechar y qué hacer después.',
    link: '/cosecha',
    options: [{ label: 'Ver guía →', action: 'end' }],
  },
  empezar: {
    message: '¡Perfecto! Te recomiendo este orden: primero aprende el ciclo BSF, luego haz el diagnóstico de preparación, y después elige tu meta. ¿Tienes algo listo ya?',
    options: [
      { label: 'Soy completamente nuevo', action: 'nuevo' },
      { label: 'Ya sé del ciclo BSF', action: 'ya_sabe' },
      { label: 'Ya hice el diagnóstico', action: 'ya_diagnostico' },
    ],
  },
  nuevo: {
    message: '¡Bienvenido! Empieza por el Módulo 1: Conocimiento General. Ahí aprendes todo el ciclo de vida de la Mosca Soldado Negra. ¡Es más fácil de lo que crees! 🌟',
    link: '/conocimiento',
    options: [{ label: 'Ir al Módulo 1 →', action: 'end' }],
  },
  ya_sabe: {
    message: 'Excelente base. Ahora ve al diagnóstico de preparación — te dice exactamente qué tienes listo y qué falta antes de empezar. Solo toma 5 minutos.',
    link: '/preparacion',
    options: [{ label: 'Ir al diagnóstico →', action: 'end' }],
  },
  ya_diagnostico: {
    message: '¡Avanzado! Ve a Metas y elige tu objetivo: alimentar animales, producir harina, o ciclo cerrado. Cada una tiene su guía paso a paso.',
    link: '/metas',
    options: [{ label: 'Elegir mi meta →', action: 'end' }],
  },
  problema: {
    message: '¿Qué tipo de problema tienes?',
    options: [
      { label: 'Las larvas no crecen', action: 'prob_crecimiento' },
      { label: 'Huelen muy feo', action: 'prob_olor' },
      { label: 'Se están escapando', action: 'prob_escape' },
      { label: 'Están muriendo', action: 'prob_muerte' },
    ],
  },
  prob_crecimiento: {
    message: 'Las causas más comunes son: temperatura baja (< 26°C), poca comida, o larvas muy pequeñas aún. Verifica temperatura primero — es lo más crítico. ¿Estás en zona caliente?',
    options: [
      { label: 'Sí, hace calor', action: 'prob_comida' },
      { label: 'A veces hace frío', action: 'prob_temp' },
    ],
  },
  prob_comida: {
    message: 'Si el clima está bien, revisa la cantidad y calidad de alimento. Evita alimentos muy ácidos (limón, vinagre) o muy salados. Restos de frutas y verduras funcionan muy bien.',
    link: '/conocimiento',
    options: [{ label: 'Ver etapas de alimentación →', action: 'end' }],
  },
  prob_temp: {
    message: 'La temperatura es crítica. Con < 22°C el crecimiento se paraliza casi por completo. Considera un cuarto cerrado, bombillo de calor o manta térmica. La BSF necesita 26–32°C.',
    link: '/conocimiento',
    options: [{ label: 'Ver rangos de temperatura →', action: 'end' }],
  },
  prob_olor: {
    message: 'Olor fuerte = exceso de alimento húmedo que se pudre antes de ser consumido. Reduce la cantidad de alimento y mezcla con material seco (aserrín/afrecho). La relación ideal es 70% húmedo / 30% seco.',
    options: [{ label: 'Gracias Larvi 👍', action: 'end' }],
  },
  prob_escape: {
    message: 'Las larvas maduras (L5) buscan escapar activamente para pupar — ¡es instinto! Revisa si están blancas y gordas (~2cm). Si es así, es momento de cosecharlas o darles zona oscura para prepupas.',
    options: [
      { label: '¿Cuándo cosechar exactamente?', action: 'cosecha' },
      { label: 'Gracias, entendí 👍', action: 'end' },
    ],
  },
  prob_muerte: {
    message: '¿De qué color están las larvas muertas? Negras = temperatura o humedad extrema. Marrones = pueden ser prepupas (¡eso es normal!). Blancas muertas = posible infección o químicos en el alimento.',
    options: [{ label: 'Son marrones', action: 'prepupa_info' }, { label: 'Son negras/blancas', action: 'muerte_seria' }],
  },
  prepupa_info: {
    message: '¡No te preocupes! Las larvas marrones, más firmes y quietas son prepupas. Es una etapa normal del ciclo — están en transición a pupa. Dales zona oscura y sustrato seco.',
    link: '/conocimiento',
    options: [{ label: 'Ver etapa de prepupa →', action: 'end' }],
  },
  muerte_seria: {
    message: 'Posibles causas: alimento con pesticidas/jabón/sal en exceso, temperatura extrema (> 40°C o < 10°C), o falta de oxígeno. Revisa qué les estás dando de comer y ventilación del espacio.',
    options: [{ label: 'Gracias Larvi 👍', action: 'end' }],
  },
  cosecha: {
    message: 'Cosecha cuando las larvas están en L5: blancas-crema, gordas, ~2cm y muy activas. Si empiezan a oscurecerse y quietarse, ya están pasando a prepupa — todavía sirven pero baja el valor proteico.',
    link: '/conocimiento',
    options: [
      { label: '¿Qué hacer después de cosechar?', action: 'post_cosecha' },
      { label: 'Ver etapa L5 en detalle →', action: 'end' },
    ],
  },
  post_cosecha: {
    message: 'Después de cosechar tienes 3 opciones: dárselas vivas a animales (inmediato), procesarlas en harina (seca, dura meses), o guardar algunas para continuar el ciclo. ¿Cuál es tu objetivo?',
    link: '/metas',
    options: [{ label: 'Ver las 3 metas →', action: 'end' }],
  },
  meta_ayuda: {
    message: 'Las 3 metas son: 🐔 Alimentar animales (más fácil, sin procesamiento), 🌾 Producir harina (más rentable, requiere equipos), ♻️ Ciclo cerrado (más complejo, requiere insectario). ¿Qué buscas?',
    link: '/metas',
    options: [
      { label: 'Quiero lo más sencillo', action: 'meta_sencillo' },
      { label: 'Quiero vender', action: 'meta_venta' },
      { label: 'Quiero ser autónomo', action: 'meta_autonomo' },
    ],
  },
  meta_sencillo: {
    message: 'Para empezar simple: alimentar animales es lo ideal. Cosecharás larvas vivas y las das directamente. Sin equipos adicionales, resultados inmediatos. ¡Perfecta para empezar!',
    link: '/metas',
    options: [{ label: 'Ver guía de esa meta →', action: 'end' }],
  },
  meta_venta: {
    message: 'Para venta, la harina de larva es el producto con mejor margen. 1kg de larvas = ~250g de harina. Necesitas deshidratador (o horno) y molino/licuadora. Hay mercado en tiendas de mascotas y ganadería.',
    link: '/metas',
    options: [{ label: 'Ver guía de producción →', action: 'end' }],
  },
  meta_autonomo: {
    message: 'Ciclo cerrado es el ideal para autonomía total. Requiere insectario y más dedicación al inicio, pero después el sistema se alimenta solo. Es la meta más avanzada y gratificante.',
    link: '/metas',
    options: [{ label: 'Ver guía del ciclo cerrado →', action: 'end' }],
  },
  end: {
    message: '¡Mucho éxito en tu cultivo! 🌱 Si tienes más preguntas, aquí estaré. ¡La BSF es fascinante!',
    options: [{ label: 'Hacer otra pregunta', action: 'start' }],
  },
};

const LarviSVG = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <img
    src="/larvi-mascota.png"
    alt="Larvi"
    style={{ width: size, height: size, objectFit: 'contain', display: 'block', ...style }}
  />
);

export default function Larvi() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [current, setCurrent] = useState<ConversationNode>(tree.start);
  const [pulse, setPulse] = useState(true);
  const pathname = usePathname();
  const { progress } = useProgress();

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const startChat = () => {
    setOpen(true);
    setPulse(false);
    if (messages.length === 0) {
      const greeting = getContextGreeting(pathname, progress);
      setMessages([{ from: 'larvi', text: greeting || tree.start.message }]);
      setCurrent(tree.start);
    }
  };

  const handleOption = (option: Option) => {
    setMessages(prev => [...prev, { from: 'user', text: option.label }]);
    const next = tree[option.action];
    if (!next) return;
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'larvi', text: next.message }]);
      setCurrent(next);
    }, 300);
  };

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 20, width: 'min(320px, calc(100vw - 32px))', maxHeight: 490,
          background: '#0d1b2a', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.08)' }}>
            <LarviSVG size={36} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#4ade80' }}>Larvi</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Asistente BSF</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: msg.from === 'larvi' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  background: msg.from === 'larvi' ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.22)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  fontSize: 13, lineHeight: 1.5, color: '#e2e8f0',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Options */}
          {current.options && current.options.length > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(34,197,94,0.15)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {current.link && (
                <a href={current.link} style={{
                  fontSize: 13, color: 'white', textDecoration: 'none',
                  padding: '9px 14px',
                  background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                  borderRadius: 8, textAlign: 'center', fontWeight: 700,
                  display: 'block',
                }}>
                  Ir ahora →
                </a>
              )}
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(opt)}
                  style={{ padding: '7px 10px', background: 'rgba(30,48,80,0.8)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, color: '#cbd5e1', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating larva button */}
      <button
        onClick={startChat}
        style={{
          position: 'fixed', bottom: 20, right: 20, width: 60, height: 60,
          borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)',
          border: 'none', cursor: 'pointer', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: pulse ? '0 0 0 8px rgba(34,197,94,0.2), 0 4px 16px rgba(34,197,94,0.4)' : '0 4px 16px rgba(34,197,94,0.3)',
          transition: 'box-shadow 0.3s',
        }}
        title="Hablar con Larvi"
      >
        <LarviSVG size={54} style={{ transform: 'translate(0px, -5px)' }} />
      </button>
    </>
  );
}

function getContextGreeting(pathname: string, progress: UserProgress): string | null {
  if (pathname === '/conocimiento') return '¡Estás aprendiendo sobre BSF! 🧠 ¿Tienes alguna duda sobre las etapas del ciclo?';
  if (pathname === '/preparacion') return '¡Haciendo tu diagnóstico! 🛠️ ¿Tienes dudas sobre qué necesitas para empezar?';
  if (pathname === '/metas') return '¡Eligiendo tu meta! 🎯 ¿No sabes cuál es la mejor para ti? Cuéntame qué buscas.';
  if (progress.quizCompleted && progress.selectedMeta) return `¡Hola de nuevo! Recuerdo que tu meta es ${progress.selectedMeta}. ¿En qué te ayudo hoy?`;
  return null;
}

import type { UserProgress } from '@/hooks/useProgress';
