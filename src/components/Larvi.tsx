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
    message: '¡Hola! Soy Larvi 🪲 Tu asistente de cultivo BSF. ¿En qué te ayudo?',
    options: [
      { label: '¿Por dónde empiezo?', action: 'empezar' },
      { label: 'Tengo un problema con mis larvas', action: 'problema' },
      { label: '¿Cuándo cosechar?', action: 'cosecha' },
      { label: 'No sé qué meta elegir', action: 'meta_ayuda' },
    ],
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
    options: [{ label: 'Gracias Larvi 👍', action: 'end' }],
  },
  prob_temp: {
    message: 'La temperatura es crítica. Con < 22°C el crecimiento se paraliza casi por completo. Considera un cuarto cerrado, bombillo de calor o manta térmica. La BSF necesita 26–32°C.',
    options: [{ label: 'Entendido, gracias 👍', action: 'end' }],
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
    options: [{ label: 'Excelente, gracias 👍', action: 'end' }],
  },
  muerte_seria: {
    message: 'Posibles causas: alimento con pesticidas/jabón/sal en exceso, temperatura extrema (> 40°C o < 10°C), o falta de oxígeno. Revisa qué les estás dando de comer y ventilación del espacio.',
    options: [{ label: 'Gracias Larvi 👍', action: 'end' }],
  },
  cosecha: {
    message: 'Cosecha cuando las larvas están en L5: blancas-crema, gordas, ~2cm y muy activas. Si empiezan a oscurecerse y quietarse, ya están pasando a prepupa — todavía sirven pero baja el valor proteico.',
    options: [
      { label: '¿Qué hacer después de cosechar?', action: 'post_cosecha' },
      { label: 'Gracias, perfecto 👍', action: 'end' },
    ],
  },
  post_cosecha: {
    message: 'Después de cosechar tienes 3 opciones: dárselas vivas a animales (inmediato), procesarlas en harina (seca, dura meses), o guardar algunas para continuar el ciclo. ¿Cuál es tu objetivo?',
    link: '/metas',
    options: [{ label: 'Ver las 3 metas →', action: 'end' }],
  },
  meta_ayuda: {
    message: 'Las 3 metas son: 🐔 Alimentar animales (más fácil, sin procesamiento), 🌾 Producir harina (más rentable, requiere equipos), ♻️ Ciclo cerrado (más complejo, requiere insectario). ¿Qué buscas?',
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
          position: 'fixed', bottom: 90, right: 20, width: 320, maxHeight: 440,
          background: '#0d1b2a', border: '1px solid rgba(14,165,233,0.3)',
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.08)' }}>
            <span style={{ fontSize: 20 }}>🪲</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#38bdf8' }}>Larvi</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Asistente BSF</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: msg.from === 'larvi' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  background: msg.from === 'larvi' ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.25)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  fontSize: 13, lineHeight: 1.5, color: '#e2e8f0',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {current.options && current.options.length > 0 && (
            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(14,165,233,0.15)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {current.link && (
                <a href={current.link} style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', padding: '6px 10px', background: 'rgba(14,165,233,0.15)', borderRadius: 6, textAlign: 'center', fontWeight: 600 }}>
                  Ir ahora →
                </a>
              )}
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(opt)}
                  style={{ padding: '7px 10px', background: 'rgba(30,48,80,0.8)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 8, color: '#cbd5e1', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={startChat}
        style={{
          position: 'fixed', bottom: 20, right: 20, width: 56, height: 56,
          borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
          border: 'none', cursor: 'pointer', fontSize: 24, zIndex: 1000,
          boxShadow: pulse ? '0 0 0 8px rgba(14,165,233,0.2), 0 4px 16px rgba(14,165,233,0.4)' : '0 4px 16px rgba(14,165,233,0.3)',
          transition: 'box-shadow 0.3s',
        }}
        title="Hablar con Larvi"
      >
        🪲
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

// Type import fix
import type { UserProgress } from '@/hooks/useProgress';
