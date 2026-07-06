export interface QuizOption {
  value: string;
  label: string;
  emoji: string;
  score: number;
  tip?: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  categoryIcon: string;
  question: string;
  detail?: string;
  options: QuizOption[];
  moduleLink?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'conocimiento',
    category: 'Conocimiento',
    categoryIcon: '🧠',
    question: '¿Qué tanto conoces el ciclo de vida de la Mosca Soldado Negra?',
    options: [
      { value: 'completo', label: 'Lo conozco bien', emoji: '✅', score: 2 },
      { value: 'parcial', label: 'Algo sé, pero me falta', emoji: '🤔', score: 1, tip: 'El Módulo 1 te da el panorama completo en minutos' },
      { value: 'nada', label: 'Soy completamente nuevo', emoji: '👋', score: 0, tip: 'Perfecto para empezar — el Módulo 1 es tu primer paso' },
    ],
    moduleLink: '/conocimiento',
  },
  {
    id: 'clima',
    category: 'Clima',
    categoryIcon: '🌡️',
    question: '¿Cómo es el clima donde vas a criar las larvas?',
    detail: 'La BSF necesita entre 26°C y 32°C para crecer óptimamente.',
    options: [
      { value: 'ideal', label: 'Caliente todo el año (26–35°C)', emoji: '☀️', score: 2 },
      { value: 'variable', label: 'Varía, a veces hace frío', emoji: '🌤️', score: 1, tip: 'En temporadas frías necesitarás controlar la temperatura del espacio' },
      { value: 'frio', label: 'Clima frío (< 20°C)', emoji: '❄️', score: 0, tip: 'Necesitarás calefacción — considera un cuarto controlado con bombillo o estufa' },
    ],
  },
  {
    id: 'espacio',
    category: 'Espacio',
    categoryIcon: '🏠',
    question: '¿Tienes un espacio disponible para el cultivo?',
    options: [
      { value: 'si', label: 'Sí, tengo espacio listo', emoji: '✅', score: 2 },
      { value: 'pequeño', label: 'Tengo un espacio pequeño', emoji: '📦', score: 1, tip: 'Con 1m² puedes empezar perfectamente — la BSF no necesita mucho espacio inicial' },
      { value: 'no', label: 'Todavía no tengo', emoji: '❌', score: 0, tip: 'Necesitas al menos 1m². Un rincón cubierto o un garaje funcionan bien' },
    ],
  },
  {
    id: 'zona-oscura',
    category: 'Infraestructura',
    categoryIcon: '🌑',
    question: '¿Tienes o puedes crear una zona oscura para prepupas?',
    detail: 'Las prepupas necesitan oscuridad y ambiente seco para convertirse en pupas.',
    options: [
      { value: 'si', label: 'Sí tengo', emoji: '✅', score: 2 },
      { value: 'adaptar', label: 'Puedo adaptar algo', emoji: '🛠️', score: 1, tip: 'Una caja de cartón con aserrín seco funciona perfectamente — costo casi cero' },
      { value: 'no', label: 'No tengo', emoji: '❌', score: 0, tip: 'Es esencial para ciclo cerrado. Para empezar solo cosechando larvas, no es necesaria' },
    ],
  },
  {
    id: 'insectario',
    category: 'Infraestructura',
    categoryIcon: '🏗️',
    question: '¿Tienes insectario o contenedor para adultos (moscas)?',
    detail: 'El insectario es el espacio donde viven, se aparean y ponen huevos las moscas adultas.',
    options: [
      { value: 'si', label: 'Sí, tengo insectario', emoji: '✅', score: 2 },
      { value: 'basico', label: 'Tengo algo básico (tela mosquitera)', emoji: '🕸️', score: 1, tip: 'Marco de madera + tela mosquitera + luz directa = insectario funcional' },
      { value: 'no', label: 'No tengo', emoji: '❌', score: 0, tip: 'Solo necesario para ciclo cerrado. Puedes empezar comprando huevos o larvas externamente' },
    ],
  },
  {
    id: 'sustrato',
    category: 'Insumos',
    categoryIcon: '🌾',
    question: '¿Tienes sustrato disponible? (afrecho, aserrín, madera en astillas)',
    detail: 'El sustrato es la base seca donde las prepupas se convierten en pupas.',
    options: [
      { value: 'si', label: 'Sí, tengo disponible', emoji: '✅', score: 2 },
      { value: 'algo', label: 'Tengo algo pero poco', emoji: '😅', score: 1, tip: 'El afrecho de arroz es muy económico y fácil de conseguir en molinos o tiendas agrícolas' },
      { value: 'no', label: 'No tengo', emoji: '❌', score: 0, tip: 'Busca afrecho de arroz, aserrín seco o paja — son baratos y muy efectivos' },
    ],
  },
  {
    id: 'alimento',
    category: 'Insumos',
    categoryIcon: '🍌',
    question: '¿Tienes fuente de alimento orgánico para las larvas?',
    detail: 'Residuos de cocina, pulpa de frutas, estiércol, subproductos agroindustriales.',
    options: [
      { value: 'abundante', label: 'Sí, tengo bastante disponible', emoji: '✅', score: 2 },
      { value: 'poco', label: 'Tengo pero en cantidad limitada', emoji: '😬', score: 1, tip: 'Para escalar conecta con restaurantes, plazas de mercado o fincas — dan residuos gratis' },
      { value: 'no', label: 'No tengo fuente fija aún', emoji: '❌', score: 0, tip: 'Empieza con residuos de tu propia cocina. Para escalar necesitas fuente constante' },
    ],
  },
  {
    id: 'utensilios',
    category: 'Herramientas',
    categoryIcon: '🧰',
    question: '¿Tienes los utensilios básicos? (baldes, tamiz, guantes, bandejas)',
    options: [
      { value: 'completo', label: 'Sí, tengo todo', emoji: '✅', score: 2 },
      { value: 'parcial', label: 'Tengo algo, me faltan cosas', emoji: '🛒', score: 1, tip: 'Lo mínimo: un balde plástico + tela mosquitera como tamiz + guantes de cocina' },
      { value: 'nada', label: 'Empiezo desde cero', emoji: '❌', score: 0, tip: 'Inversión inicial muy baja: baldes plásticos + tela mosquitera + guantes. Menos de $50k COP' },
    ],
  },
  {
    id: 'meta',
    category: 'Objetivo',
    categoryIcon: '🎯',
    question: '¿Cuál es tu objetivo principal con el cultivo?',
    options: [
      { value: 'animales', label: 'Alimentar mis animales', emoji: '🐔', score: 2 },
      { value: 'harina', label: 'Producir y vender harina de larva', emoji: '🌾', score: 2 },
      { value: 'cosecha', label: 'Ciclo cerrado y continuo', emoji: '♻️', score: 2 },
    ],
  },
];

export interface DiagnosticResult {
  ready: string[];
  needsWork: string[];
  missing: string[];
  score: number;
  maxScore: number;
  selectedMeta: string | null;
  knowledgeGap: boolean;
}

export function analyzeDiagnostic(answers: Record<string, string>): DiagnosticResult {
  const ready: string[] = [];
  const needsWork: string[] = [];
  const missing: string[] = [];
  let score = 0;
  let maxScore = 0;

  const labelMap: Record<string, string> = {
    conocimiento: 'Conocimiento BSF',
    clima: 'Clima adecuado',
    espacio: 'Espacio disponible',
    'zona-oscura': 'Zona oscura para prepupas',
    insectario: 'Insectario para adultos',
    sustrato: 'Sustrato (afrecho/aserrín)',
    alimento: 'Fuente de alimento orgánico',
    utensilios: 'Utensilios básicos',
  };

  for (const q of quizQuestions) {
    if (q.id === 'meta') continue;
    const answer = answers[q.id];
    if (!answer) continue;
    const option = q.options.find(o => o.value === answer);
    if (!option) continue;
    maxScore += 2;
    score += option.score;
    const label = labelMap[q.id] || q.id;
    if (option.score === 2) ready.push(label);
    else if (option.score === 1) needsWork.push(label);
    else missing.push(label);
  }

  return {
    ready,
    needsWork,
    missing,
    score,
    maxScore,
    selectedMeta: answers['meta'] || null,
    knowledgeGap: answers['conocimiento'] === 'nada' || answers['conocimiento'] === 'parcial',
  };
}
