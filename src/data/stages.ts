export interface Stage {
  id: string;
  name: string;
  emoji: string;
  duration: string;
  temp: string;
  humidity: string;
  color: string;
  description: string;
  tips: string[];
  alerts: string[];
  isHarvestStage?: boolean;
  photos?: string[];
  videos?: { title: string; url: string }[];
}

export const stages: Stage[] = [
  {
    id: 'huevo',
    name: 'Huevo',
    emoji: '🥚',
    duration: '3–5 días',
    temp: '26–30°C',
    humidity: '70–80%',
    color: '#f59e0b',
    description: 'La hembra deposita entre 200 y 600 huevos en grietas cerca de materia orgánica. Son pequeños, color crema amarillento, casi invisibles a simple vista.',
    tips: [
      'Mantén temperatura estable entre 26–30°C',
      'Alta humedad pero sin agua estancada',
      'Coloca los huevos cerca de la fuente de alimento',
      'Usa tiras de cartón corrugado como sitio de postura',
    ],
    alerts: [
      'Temperaturas < 20°C detienen el desarrollo',
      'Exceso de humedad genera hongos',
    ],
    photos: [
      '/fotos/huevos.msn.jpg',
      '/fotos/huevos.mns.2.jpg',
      '/fotos/huevos.mns.3.jpg',
    ],
    videos: [
      { title: 'Huevos BSF — Vista 1', url: '/fotos/huevos.mp4' },
      { title: 'Huevos BSF — Vista 2', url: '/fotos/huevos2_web.mp4' },
    ],
  },
  {
    id: 'larva-joven',
    name: 'Larva Joven (L1–L3)',
    emoji: '🐛',
    duration: '5–7 días',
    temp: '27–30°C',
    humidity: '65–75%',
    color: '#84cc16',
    description: 'Larvas de 1–3mm, muy pequeñas y activas. Comen materia orgánica en descomposición. Es la etapa de mayor vulnerabilidad pero crecimiento acelerado.',
    tips: [
      'Alimenta con material orgánico finamente picado',
      'Evita alimentos muy ácidos, salados o con aceite',
      'Sustrato húmedo pero no encharcado',
      'Prefieren oscuridad — cúbrelas',
    ],
    alerts: [
      'Muy vulnerables al estrés hídrico',
      'No expongas a luz directa',
      'Evita perturbaciones frecuentes',
    ],
    videos: [
      { title: 'Neonatos BSF', url: '/fotos/neonatos.mp4' },
      { title: 'Neonatos — 1 día', url: '/fotos/neonato_1dia.mp4' },
    ],
  },
  {
    id: 'larva-media',
    name: 'Larva Media (L4)',
    emoji: '🐛',
    duration: '5–7 días',
    temp: '27–32°C',
    humidity: '60–70%',
    color: '#22c55e',
    description: 'Las larvas alcanzan 1–1.5cm. El consumo de alimento se dispara. Son la etapa de mayor eficiencia en conversión de residuos orgánicos.',
    tips: [
      'Aumenta la cantidad de alimento progresivamente',
      'Verifica densidad — evita hacinamiento',
      'Temperatura 27–32°C para máximo crecimiento',
      'Revisa pH del sustrato periódicamente',
    ],
    alerts: [
      'Hacinamiento genera calor interno — puede matar las larvas',
      'Olor fuerte = demasiado alimento húmedo acumulado',
    ],
    videos: [
      { title: 'Estadios larvales BSF', url: '/fotos/estadios.mp4' },
    ],
  },
  {
    id: 'larva-madura',
    name: 'Larva Madura (L5) ⭐ Cosecha',
    emoji: '⭐',
    duration: '3–5 días',
    temp: '25–30°C',
    humidity: '60–70%',
    color: '#0ea5e9',
    isHarvestStage: true,
    description: 'Larvas de 2–2.5cm, color blanco-crema, cuerpo grueso y muy activas. PUNTO ÓPTIMO DE COSECHA: 40–45% proteína bruta, 30% grasa. Si no se cosechan, pasarán a prepupa.',
    tips: [
      '⭐ Cosechar AHORA — máximo valor nutricional',
      'Identifica: cuerpo grueso, blanco-crema, muy activas',
      'Pesa y registra tu cosecha para calcular rendimiento',
      'Si no cosecharás, prepara zona oscura para prepupas',
    ],
    alerts: [
      'Las larvas maduras buscan escapar activamente',
      'Temperatura alta acelera transición a prepupa',
      'No guardes más de 48h sin refrigeración',
    ],
    videos: [
      { title: 'Larvas maduras BSF', url: '/fotos/biglarvae.mp4' },
      { title: 'Larvas grandes BSF', url: '/fotos/grandes.mp4' },
    ],
  },
  {
    id: 'prepupa',
    name: 'Prepupa',
    emoji: '🟤',
    duration: '7–10 días',
    temp: '22–28°C',
    humidity: '50–60%',
    color: '#a16207',
    description: 'La larva deja de comer, se oscurece (marrón) y busca un lugar seco y oscuro para pupar. No necesita alimento — esta etapa es de transición.',
    tips: [
      'Provee zona oscura con sustrato seco (aserrín)',
      'No manipules innecesariamente',
      'Temperatura puede bajar a 22–28°C',
      'Buena ventilación es clave',
    ],
    alerts: [
      'NO necesita alimento — dejar de alimentar es correcto',
      'Humedad alta pudre las prepupas',
      'No las expongas a luz directa',
    ],
    videos: [
      { title: 'Prepupas BSF', url: '/fotos/prepupas.mp4' },
      { title: 'Prepupas BSF 2', url: '/fotos/prepupas2.mp4' },
    ],
  },
  {
    id: 'pupa',
    name: 'Pupa',
    emoji: '🫘',
    duration: '10–14 días',
    temp: '22–28°C',
    humidity: '50–60%',
    color: '#7c3aed',
    description: 'Encerrada en una cubierta oscura (puparium), la larva se transforma completamente en adulto. Etapa de reposo total — no come, no se mueve.',
    tips: [
      'Zona oscura con buena ventilación',
      'No muevas ni manipules las pupas',
      'Temperatura estable = eclosión exitosa',
      'Revisa periódicamente por plagas',
    ],
    alerts: [
      'Alta humedad = hongos en pupas',
      'Temperatura < 20°C paraliza el desarrollo',
      'Las hormigas pueden destruir las pupas',
    ],
    videos: [
      { title: 'Pupas BSF', url: '/fotos/pupas.mp4' },
      { title: 'Pupas BSF 2', url: '/fotos/pupas2.mp4' },
    ],
  },
  {
    id: 'adulto',
    name: 'Adulto / Mosca',
    emoji: '🦟',
    duration: '5–9 días',
    temp: '24–32°C',
    humidity: '60–80%',
    color: '#0d9488',
    description: 'La mosca adulta NO tiene boca funcional — no come. Solo bebe agua. Su único objetivo es aparearse y poner huevos. Vive 5–9 días en total.',
    tips: [
      'Provee agua en esponja o algodón húmedo',
      'Necesita LUZ SOLAR DIRECTA para aparearse',
      'Coloca tiras de cartón corrugado para postura',
      'Temperatura > 24°C activa el comportamiento sexual',
    ],
    alerts: [
      'Sin luz directa NO se aparean',
      'Solo agua — nunca comida',
      'Las moscas son frágiles, no sacudas el insectario',
    ],
    videos: [
      { title: 'Apareamiento BSF', url: '/fotos/apareamiento.mp4' },
      { title: 'Mosca soldado negra', url: '/fotos/moscagrande3.mp4' },
      { title: 'Moscas en vuelo', url: '/fotos/moscas_fly.mp4' },
    ],
  },
  {
    id: 'postura',
    name: 'Postura de Huevos',
    emoji: '🔄',
    duration: '2–3 días',
    temp: '26–30°C',
    humidity: '65–75%',
    color: '#db2777',
    description: 'La hembra deposita 200–600 huevos en grietas de material orgánico o cartón corrugado. En 3–5 días eclosionan y el ciclo comienza de nuevo.',
    tips: [
      'Tiras de cartón corrugado cerca del alimento = postura garantizada',
      'Los huevos son visibles: puntos crema en capas entre el cartón',
      'Transfiere tiras con huevos al sustrato fresco',
    ],
    alerts: [
      'Retira tiras antes de 5 días o los huevos eclosionan en el insectario',
      'Temperatura baja reduce dramáticamente la postura',
    ],
    videos: [
      { title: 'Postura de huevos BSF', url: '/fotos/postura_huevos.mp4' },
    ],
  },
];
