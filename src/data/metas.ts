export interface MetaStep {
  step: number;
  title: string;
  description: string;
  tip?: string;
  warning?: string;
}

export interface Meta {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
  borderColor: string;
  when: string;
  steps: MetaStep[];
  resources: string[];
}

export const metas: Meta[] = [
  {
    id: 'animales',
    title: 'Alimentar Animales',
    emoji: '🐔',
    tagline: 'Proteína viva para tus animales',
    description: 'Cosecha larvas L5 en su punto máximo de proteína (40–45%) y dáselas vivas a aves, peces, cerdos o mascotas. Resultado inmediato, cero procesamiento.',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    when: 'Las larvas llegan a L5: blancas-crema, gordas (~2cm), muy activas',
    steps: [
      {
        step: 1,
        title: 'Identifica el momento de cosecha',
        description: 'Busca larvas L5: cuerpo blanco-crema, gordas, ~2cm, que se mueven rápido. Este es el punto de máxima proteína (40–45%) y grasa (30%).',
      },
      {
        step: 2,
        title: 'Prepara el área',
        description: 'Coloca un tamiz o zaranda sobre un balde limpio. Ten listo un recipiente para guardar las larvas.',
        tip: 'Trabaja en la mañana — las larvas están más activas y fáciles de separar',
      },
      {
        step: 3,
        title: 'Cosecha con tamiz',
        description: 'Vierte el sustrato sobre el tamiz. Las larvas quedan arriba, el material orgánico cae. Recoge las larvas.',
        tip: 'Pesa la cosecha y anótalo para calcular el rendimiento de tu sistema',
      },
      {
        step: 4,
        title: 'Enjuaga (opcional)',
        description: 'Si quieres, enjuaga las larvas con agua limpia para eliminar residuos de sustrato antes de dárselas a los animales.',
        tip: 'Si las das directamente sin lavar también está bien — los animales las consumen igual',
      },
      {
        step: 5,
        title: 'Suministra a los animales',
        description: 'Ofrece las larvas vivas directamente. Las aves, peces y cerdos las consumen con entusiasmo por el movimiento.',
        warning: 'No guardes más de 48h sin refrigeración — se convierten en prepupas y pierden valor proteico',
      },
    ],
    resources: ['Tamiz o zaranda', 'Baldes plásticos', 'Báscula (opcional)', 'Recipiente para larvas cosechadas'],
  },
  {
    id: 'harina',
    title: 'Producir Harina de Larva',
    emoji: '🌾',
    tagline: 'Suplemento proteico de alto valor',
    description: 'Procesa las larvas en harina seca para venta o uso como suplemento proteico. Alta rentabilidad, larga vida útil y fácil de transportar.',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    when: 'Con larvas L5 cosechadas y limpias, listas para procesamiento',
    steps: [
      {
        step: 1,
        title: 'Cosecha y limpia',
        description: 'Igual que para alimentar animales — tamiza bien y lava las larvas L5 con agua limpia.',
      },
      {
        step: 2,
        title: 'Mata e inactiva',
        description: 'Sumerge las larvas en agua hirviendo por 3–5 minutos. Esto las mata, inactiva enzimas y elimina patógenos.',
        warning: 'No omitas este paso — es fundamental para la inocuidad del producto final',
      },
      {
        step: 3,
        title: 'Escurre el agua',
        description: 'Usa el tamiz para escurrir bien. Entre menos agua quede, menor será el tiempo de deshidratación.',
      },
      {
        step: 4,
        title: 'Deshidrata',
        description: 'Opción A: deshidratador eléctrico a 60°C por 4–6h. Opción B: horno a 60–70°C por 6–8h. Opción C: sol en bandeja plana por 2–3 días.',
        tip: 'Listas cuando están crujientes y se quiebran fácilmente al presionar',
      },
      {
        step: 5,
        title: 'Muele y tamiza',
        description: 'Usa licuadora, molino o procesador hasta obtener polvo fino. Tamiza para eliminar trozos grandes.',
        tip: 'Rendimiento aproximado: 1kg de larvas = 200–250g de harina seca',
      },
      {
        step: 6,
        title: 'Almacena y etiqueta',
        description: 'Guarda en bolsa hermética o frasco de vidrio en lugar fresco y seco. Vida útil: 6–12 meses.',
        tip: 'Etiqueta con fecha, peso y porcentaje de proteína para ventas',
      },
    ],
    resources: ['Tamiz', 'Olla grande', 'Deshidratador o horno', 'Licuadora o molino', 'Frascos herméticos', 'Báscula'],
  },
  {
    id: 'cosecha',
    title: 'Ciclo Cerrado Continuo',
    emoji: '♻️',
    tagline: 'Sistema autosostenible de producción',
    description: 'Mantén un sistema donde tus propias moscas generan continuamente nuevas tandas de larvas. Sin necesidad de comprar insumos externos una vez establecido.',
    color: '#0ea5e9',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    when: 'Cuando tienes larvas L5 que destinarás a reproductores en vez de cosechar',
    steps: [
      {
        step: 1,
        title: 'Selecciona larvas para reproducción',
        description: 'Aparta el 20–30% de las larvas L5 más grandes y sanas. Estas serán los reproductores del próximo ciclo.',
        tip: 'Las más grandes producen adultos más fuertes con mayor postura',
      },
      {
        step: 2,
        title: 'Prepara la zona oscura para prepupas',
        description: 'Coloca las larvas seleccionadas en bandeja con aserrín o afrecho seco en zona oscura. En 7–10 días serán prepupas y luego pupas.',
      },
      {
        step: 3,
        title: 'Traslada las pupas al insectario',
        description: 'Cuando las prepupas se oscurezcan y endurezcan completamente (pupas), transfiérelas al insectario.',
        warning: 'Manipula con cuidado — las pupas son frágiles en esta etapa',
      },
      {
        step: 4,
        title: 'Espera la eclosión y facilita el apareamiento',
        description: 'Los adultos emergen en 10–14 días. Necesitan luz solar directa para aparearse — mínimo 4h al día.',
        tip: 'Coloca agua en esponja o algodón húmedo para hidratar las moscas',
      },
      {
        step: 5,
        title: 'Instala tiras para postura',
        description: 'Coloca tiras de cartón corrugado cerca de materia orgánica. La hembra pondrá sus huevos en las grietas del cartón.',
        tip: '200–600 huevos por hembra. Un insectario activo produce miles de huevos por semana',
      },
      {
        step: 6,
        title: 'Transfiere huevos y reinicia el ciclo',
        description: 'Retira las tiras con huevos y colócalas sobre el sustrato fresco con alimento. En 3–5 días eclosionan. ¡El ciclo se reinicia!',
        warning: 'Controla la densidad — demasiadas larvas en poco espacio genera calor excesivo',
      },
    ],
    resources: ['Insectario (marco madera + tela mosquitera)', 'Zona oscura para prepupas', 'Tiras de cartón corrugado', 'Esponja con agua para adultos', 'Aserrín seco para pupas'],
  },
];
