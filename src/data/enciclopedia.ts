// ─────────────────────────────────────────────────────────────────────────────
// ENCICLOPEDIA BSF — datos de las secciones (excepto el bot, ver enciclopedia-bot.ts)
// Fuente: Documento Maestro — Colonia BSF (Hermetia illucens), ProLarva v1.0
// ─────────────────────────────────────────────────────────────────────────────

// ═══ 1. VOCABULARIO ══════════════════════════════════════════════════════════

export type GlosarioCat =
  | 'Biología'
  | 'Etapas'
  | 'Manejo'
  | 'Sustrato'
  | 'Cosecha'
  | 'Indicadores'
  | 'Negocio';

export interface Termino {
  termino: string;
  sigla?: string;
  def: string;
  cat: GlosarioCat;
}

export const GLOSARIO: Termino[] = [
  // ── Biología ──
  { termino: 'BSF', sigla: 'Black Soldier Fly', cat: 'Biología', def: 'Mosca Soldado Negra. El insecto completo: Hermetia illucens. En español se abrevia MSN. La etapa que produce es la larva.' },
  { termino: 'Hermetia illucens', cat: 'Biología', def: 'Nombre científico de la Mosca Soldado Negra. No pica, no transmite enfermedades y el adulto ni siquiera come.' },
  { termino: 'MSN', sigla: 'Mosca Soldado Negra', cat: 'Biología', def: 'La misma BSF, en español. Es como llamamos al insecto en el contenido de ProLarva.' },
  { termino: 'Holometábolo', cat: 'Biología', def: 'Insecto con metamorfosis completa: pasa por 4 formas radicalmente distintas (huevo → larva → pupa → adulto). La BSF es holometábola.' },
  { termino: 'Metamorfosis', cat: 'Biología', def: 'La transformación de larva a mosca. Ocurre encerrada dentro de la pupa y dura 10–14 días.' },
  { termino: 'Detritívoro', cat: 'Biología', def: 'Organismo que se alimenta de materia orgánica en descomposición. La larva BSF es detritívora generalista: come casi cualquier residuo orgánico.' },
  { termino: 'Instar', cat: 'Biología', def: 'Cada etapa de la larva entre dos mudas del exoesqueleto. La larva BSF pasa por 6 instares (L1 a L6).' },
  { termino: 'Estadio larval (L1–L6)', cat: 'Biología', def: 'Los 6 instares de la larva. L1 es la recién nacida (1–2 mm); L6 es la larva madura lista para cosechar o pupar (~2 cm).' },
  { termino: 'Quitina', cat: 'Biología', def: 'Polisacárido del exoesqueleto de la larva (5–8% del peso seco). En dosis bajas actúa como prebiótico; en dosis altas baja la digestibilidad. Aumenta cuando la larva madura.' },
  { termino: 'Ácido láurico (C12:0)', cat: 'Biología', def: 'Ácido graso de cadena media, 40–50% de la grasa de la larva. Tiene efecto antimicrobiano natural, útil en dietas de aves y cerdos jóvenes.' },
  { termino: 'Péptidos antimicrobianos', sigla: 'AMP', cat: 'Biología', def: 'Defensinas, cecropinas y attacinas que la larva produce para sobrevivir en ambientes sucios. Actúan como inmunomoduladores naturales en el animal que las come.' },
  { termino: 'Composición modulable', cat: 'Biología', def: 'La proteína y la grasa de la larva NO son fijas: cambian según lo que comió. Puedes "programar" una larva más nutritiva ajustando el sustrato de los últimos días.' },

  // ── Etapas ──
  { termino: 'Huevo', cat: 'Etapas', def: 'Puntos color crema, casi invisibles, del tamaño de una semilla de mostaza. Una hembra pone 400–900. Eclosionan en 3–4 días a 27 °C.' },
  { termino: 'Larva joven (L1–L3)', cat: 'Etapas', def: 'Recién eclosionada, menos de 1 mm, muy frágil. Etapa de crecimiento exponencial. No moverla ni agitarla los primeros 4–5 días.' },
  { termino: 'Larva media (L4–L5)', cat: 'Etapas', def: 'Mide 1–1,5 cm. Aquí se dispara el consumo de sustrato: es la etapa de máxima eficiencia para procesar residuos.' },
  { termino: 'Larva madura (L6)', cat: 'Etapas', def: 'Blanca-crema, gorda y firme, ~2 cm, muy activa. Deja de comer y busca escapar. Es el punto óptimo de cosecha (40–45% proteína).' },
  { termino: 'Prepupa', cat: 'Etapas', def: 'La larva madura que se oscureció (marrón-negra), dejó de comer y migra buscando un lugar seco y oscuro para pupar. Este comportamiento es la base de la autocosecha.' },
  { termino: 'Pupa', cat: 'Etapas', def: 'Etapa de reposo total dentro de una cubierta oscura y endurecida (puparium). No come ni se mueve. Dura 10–14 días.' },
  { termino: 'Puparium', cat: 'Etapas', def: 'La "cáscara" endurecida que forma la prepupa. Dentro ocurre la metamorfosis a mosca.' },
  { termino: 'Adulto / mosca', cat: 'Etapas', def: 'La mosca no tiene boca funcional: no come, solo bebe agua. Vive 5–8 días y su único trabajo es aparearse y poner huevos. Necesita luz solar directa para copular.' },
  { termino: 'Oviposición / postura', cat: 'Etapas', def: 'La puesta de huevos. La hembra los deja en grietas secas (cartón corrugado, tablillas ranuradas) cerca de un olor de fermentación.' },
  { termino: 'Eclosión', cat: 'Etapas', def: 'Cuando la larva sale del huevo (o el adulto sale de la pupa). Indicador: se ven larvitas L1 diminutas moviéndose.' },
  { termino: 'Migración (autocosecha)', cat: 'Etapas', def: 'El instinto de la prepupa de salir sola del sustrato húmedo hacia lo seco. Con una rampa la canalizas a un balde: cosecha sin manos.' },

  // ── Manejo ──
  { termino: 'HR', sigla: 'Humedad Relativa', cat: 'Manejo', def: 'El porcentaje de humedad del aire. Larvas: 65–75%. Adultos: 50–70%. Se mide con higrómetro.' },
  { termino: 'Fotoperiodo', cat: 'Manejo', def: 'El ciclo de horas de luz y oscuridad. La BSF SOLO copula con luz intensa (>2.000 lux, 6–8 h/día). Sin luz, no hay huevos.' },
  { termino: 'Insectario / jaula de cópula', cat: 'Manejo', def: 'Espacio cerrado con malla fina donde viven y se aparean los adultos. Mínimo 1 × 1 × 1,5 m por cada 500–1.000 moscas.' },
  { termino: 'Biorreactor', cat: 'Manejo', def: 'El recipiente grande (tina, caja 200 L) donde se cría la larva en engorde. Fondo perforado para drenar lixiviados.' },
  { termino: 'Cuna de incubación', cat: 'Manejo', def: 'Recipiente donde pones los huevos sobre una capa de sustrato blando y húmedo para que la larvita coma apenas nace. La purina de pollo humedecida funciona muy bien.' },
  { termino: 'Pie de cría / semilla', cat: 'Manejo', def: 'El material biológico inicial (huevos o larvas L1–L5) con el que arrancas tu colonia. En el Kit ProLarva viene incluido.' },
  { termino: 'Densidad de siembra', cat: 'Manejo', def: 'Cuántas larvas por kg de sustrato. Jóvenes: 5.000–10.000/kg. Engorde: 2.000–5.000/kg. Demasiadas = calor interno que las mata.' },
  { termino: 'Lixiviados', cat: 'Manejo', def: 'El líquido que escurre del sustrato. Debe drenar por el fondo; si se acumula, pudre el criadero.' },
  { termino: 'Rampa de migración', cat: 'Manejo', def: 'Superficie rugosa e inclinada (45°) de cartón o madera por la que la prepupa sube sola y cae a un balde colector.' },
  { termino: 'Volteo', cat: 'Manejo', def: 'Remover suavemente el sustrato cada 2–3 días para airearlo y evitar que se compacte o se caliente de más.' },
  { termino: 'Pre-fermentación', cat: 'Manejo', def: 'Dejar el sustrato 24–48 h antes de dárselo a las larvas. Baja los patógenos de superficie y genera el olor que atrae a las hembras.' },

  // ── Sustrato ──
  { termino: 'Sustrato', cat: 'Sustrato', def: 'El alimento y a la vez el medio donde vive la larva: la mezcla de residuos orgánicos que le echas.' },
  { termino: 'Gallinaza', cat: 'Sustrato', def: 'Estiércol de gallina. La fuente proteica más accesible (25–35%). Usar fresca o semifermentada, nunca seca, y máx. 40% del total.' },
  { termino: 'Afrecho / salvado', cat: 'Sustrato', def: 'Subproducto de moler trigo o arroz. Absorbe el exceso de humedad y aporta fibra. Es el "seco" que equilibra los residuos húmedos.' },
  { termino: 'Melaza / panela', cat: 'Sustrato', def: 'Azúcar para activar la fermentación del sustrato o endulzar el agua de los adultos (los ayuda a vivir más).' },
  { termino: 'Pulpa de café', cat: 'Sustrato', def: 'Residuo del despulpado del café. Las larvas la consumen bien, pero no más del 30% del sustrato: acidifica.' },
  { termino: 'pH del sustrato', cat: 'Sustrato', def: 'Qué tan ácido está. Ideal 6,5–7,5. Por debajo de 5 las larvas se frenan o mueren. Se sube con un poco de cal; se baja con vinagre.' },
  { termino: 'Humedad del sustrato', cat: 'Sustrato', def: '65–70%. Prueba: aprietas un puñado y salen 1–2 gotas. Si gotea, agrega afrecho; si está seco, rocía agua sin cloro.' },
  { termino: 'Mezcla de emergencia', cat: 'Sustrato', def: 'Sustrato barato y siempre disponible: 50% residuos de cocina triturados + 30% salvado + 20% melaza diluida al 5%.' },

  // ── Cosecha y procesamiento ──
  { termino: 'Cosecha', cat: 'Cosecha', def: 'Recolectar la larva en su punto óptimo (L5–L6), entre el día 15 y el 18. Después pierde valor proteico al pasar a prepupa.' },
  { termino: 'Tamiz / zaranda', cat: 'Cosecha', def: 'Malla de 5–8 mm para separar las larvas del sustrato: las larvas quedan arriba, el frass cae.' },
  { termino: 'Inactivación', cat: 'Cosecha', def: 'Matar la larva antes de secarla: agua a 70–80 °C por 3–5 min, o congelación a −18 °C por 24 h. Elimina patógenos sin dañar la proteína.' },
  { termino: 'Deshidratación / secado', cat: 'Cosecha', def: 'Bajar la humedad de la larva a menos del 10%: deshidratador a 60–70 °C (8–12 h), horno, o sol en bandeja (2–4 días).' },
  { termino: 'Harina de larva', cat: 'Cosecha', def: 'Larva seca y molida. 40–45% proteína, dura 6–12 meses, fácil de transportar y vender. Rendimiento: 1 kg de larva fresca ≈ 200–250 g de harina.' },
  { termino: 'Harina desgrasada', cat: 'Cosecha', def: 'Harina a la que se le extrajo el aceite por prensado en frío. Concentra la proteína y separa un aceite vendible aparte.' },
  { termino: 'Larva viva / fresca', cat: 'Cosecha', def: 'Cosechada y dada directo al animal. Máxima digestibilidad y cero procesamiento, pero solo aguanta 48 h sin refrigeración.' },
  { termino: 'Frass', cat: 'Cosecha', def: 'El residuo que queda tras la cosecha: excremento de la larva + restos de sustrato. Es un biofertilizante de alto valor, mejor que el compost.' },

  // ── Indicadores ──
  { termino: 'FCR', sigla: 'Factor de Conversión Alimenticia', cat: 'Indicadores', def: 'Kg de sustrato para producir 1 kg de larva fresca. Meta: ≤ 2,5. Entre más bajo, más eficiente tu sistema.' },
  { termino: 'BSR', sigla: 'Tasa de Reducción de Residuos', cat: 'Indicadores', def: 'Cuánto reduce la larva el sustrato en peso: entre 50% y 80%. Lo que "desaparece" se convirtió en larva, gas y frass.' },
  { termino: 'Tasa de eclosión', cat: 'Indicadores', def: 'Porcentaje de huevos que llegan a larva. Meta ≥ 80%. Si es baja: humedad o temperatura de incubación fuera de rango.' },
  { termino: 'Conversión del ciclo', cat: 'Indicadores', def: 'Kg de larva cosechada ÷ kg de sustrato total × 100. Un buen ciclo casero da entre 15% y 30%.' },
  { termino: 'Rendimiento de harina', cat: 'Indicadores', def: 'Kg de harina seca ÷ kg de larva fresca. Normal: 18–25%. El resto era agua.' },

  // ── Negocio ──
  { termino: 'Ciclo cerrado', cat: 'Negocio', def: 'Sistema donde reservas un % de prepupas para que pupen y se vuelvan moscas: tus propias moscas ponen los huevos del siguiente lote. Ya no compras semilla.' },
  { termino: 'Traspatio', cat: 'Negocio', def: 'Producción de patio, a pequeña escala, para autoconsumo o venta local. Es el nicho de ProLarva.' },
  { termino: 'Economía circular', cat: 'Negocio', def: 'Convertir un residuo (basura orgánica) en dos productos con valor: proteína animal (larva) y abono (frass).' },
];

// ═══ 2. LOW COST ═════════════════════════════════════════════════════════════
// Apéndice C del Documento Maestro — sistemas mínimos por animal

export interface LowCostSistema {
  id: string;
  nombre: string;
  animal: string;
  emoji: string;
  inversion: string;
  produccion: string;
  dificultad: 'Muy fácil' | 'Fácil' | 'Media';
  principio: string;
  materiales: { item: string; spec: string; costo: string }[];
  pasos: string[];
  limitaciones: string[];
}

export const LOWCOST_SISTEMAS: LowCostSistema[] = [
  {
    id: 'balde-gallinas',
    nombre: 'El balde autocosechante',
    animal: 'Gallinas de patio',
    emoji: '🪣',
    inversion: '$1–7 USD (~$4.000–28.000 COP)',
    produccion: '200–500 g de prepupas/semana',
    dificultad: 'Muy fácil',
    principio: 'La prepupa madura busca por instinto salir del sustrato húmedo hacia un lugar seco. El balde canaliza esa migración por unos tubos: las prepupas suben, caen al suelo y las gallinas las comen al instante. Cero intervención.',
    materiales: [
      { item: 'Balde plástico con tapa', spec: '18–20 L reciclado (aceite, pintura, alimentos)', costo: '$0–3' },
      { item: 'Tubos de PVC', spec: '3–4 tubos de ¾" o 1", de 25–30 cm', costo: '$1–3' },
      { item: 'Taladro o clavo caliente', spec: 'para perforar', costo: '—' },
      { item: 'Alambre o cadena', spec: 'para colgar el balde', costo: '$0–1' },
    ],
    pasos: [
      'Tapa: hazle agujeros de 5–8 mm o cámbiala por malla mosquitera con cinta. Ventila sin dejar escapar moscas.',
      'Tubos de migración: perfora 3–4 agujeros del diámetro exacto del tubo en la parte alta del balde (a 5–8 cm del borde). Mete los tubos inclinados hacia abajo y hacia afuera (~30°).',
      'Drenaje: 6–8 agujeros de 8–10 mm en el fondo para que escapen los lixiviados.',
      'Cuélgalo a 50–70 cm del suelo en la zona de las gallinas, a una altura donde alcancen las prepupas que caen.',
      'Llénalo hasta ⅔ con residuos de cocina, estiércol fresco y frutas pasadas. Agrega larvas L3 de una fuente inicial.',
      'Echa residuos frescos cada 2–3 días por la tapa. Desde el día 14–18 las prepupas empiezan a migrar solas.',
      'Vacía y limpia el balde cada 3–4 semanas. El frass sobrante va al compost o al jardín.',
    ],
    limitaciones: [
      'Producción baja (~200–500 g/semana con balde de 20 L).',
      'No sirve para reproducción: las prepupas que caen no se recuperan para pupar.',
      'En clima frío la migración se detiene si la temperatura baja de 20 °C.',
    ],
  },
  {
    id: 'caja-rampa',
    nombre: 'Caja con rampa en el suelo',
    animal: 'Gallinas de patio',
    emoji: '📦',
    inversion: '$0–5 USD',
    produccion: '300–700 g de prepupas/semana',
    dificultad: 'Muy fácil',
    principio: 'Misma lógica que el balde, pero sin colgar nada. Una rampa de 45° sale por un agujero lateral de la caja y las prepupas suben y caen a la zona de las gallinas. Ellas aprenden rápido el punto de caída y esperan ahí.',
    materiales: [
      { item: 'Caja plástica o de madera con tapa', spec: '40–60 L', costo: '$0–4' },
      { item: 'Rampa', spec: 'cartón corrugado o madera rugosa', costo: '$0–1' },
    ],
    pasos: [
      'Haz un agujero lateral en la caja del ancho de la rampa, cerca del borde superior del sustrato.',
      'Coloca la rampa saliendo por ese agujero, inclinada hacia el suelo.',
      'Llena la caja con sustrato + larvas igual que el balde.',
      'Alimenta cada 2–3 días. Las prepupas suben la rampa y caen afuera.',
      'Más fácil de limpiar que el balde colgado; ideal si tienes muchas gallinas (caja de 60 L).',
    ],
    limitaciones: [
      'La rampa debe quedar bien inclinada o las prepupas no suben.',
      'Tampoco sirve para cerrar el ciclo.',
    ],
  },
  {
    id: 'balde-estanque',
    nombre: 'Balde sobre el estanque',
    animal: 'Peces (tilapia, mojarra, carpa)',
    emoji: '🐟',
    inversion: '$1–7 USD',
    produccion: '200–500 g de prepupas/semana',
    dificultad: 'Fácil',
    principio: 'La misma estructura del balde de gallinas, pero colgado sobre el espejo de agua. Las prepupas caen al estanque y los peces las comen vivas: máxima digestibilidad, cero desperdicio.',
    materiales: [
      { item: 'Balde con tubos de PVC', spec: 'igual que el balde de gallinas', costo: '$1–7' },
      { item: 'Estructura para colgar', spec: 'sobre el agua, 20–30 cm de altura', costo: '$0–2' },
    ],
    pasos: [
      'Arma el balde igual que para gallinas, pero orienta los tubos de migración sobre el agua.',
      'Cuélgalo a 20–30 cm sobre la superficie: la caída es suave y no daña la prepupa.',
      'Protégelo de la lluvia directa: el exceso de agua diluye el sustrato y baja la temperatura.',
      'En estanques grandes usa 2–3 baldes distribuidos para que la comida caiga parejo.',
    ],
    limitaciones: [
      'Solo para peces en crecimiento activo que estén cerca de la superficie.',
      'La lluvia puede arruinar el sustrato si no lo cubres.',
    ],
  },
  {
    id: 'caja-cerdos',
    nombre: 'Caja abierta en el corral',
    animal: 'Cerdos de traspatio',
    emoji: '🐷',
    inversion: '$0–10 USD',
    produccion: '500 g – 2 kg de prepupas/semana',
    dificultad: 'Fácil',
    principio: 'Los cerdos toleran el acceso directo al biorreactor y hociquean sin necesidad de rampa. La larva se desarrolla en el mismo estiércol y desperdicios del corral: doble función, reduce residuos y da alimento.',
    materiales: [
      { item: 'Caja plástica o de madera sin tapa', spec: '60–100 L', costo: '$0–10' },
    ],
    pasos: [
      'Pon la caja en una zona sombreada del corral.',
      'Usa como sustrato el estiércol fresco y los desperdicios de comida del mismo corral.',
      'Agrega larvas L3 iniciales; la larva se cría en el estiércol fresco.',
      'Los cerdos comen las larvas directamente de la caja.',
    ],
    limitaciones: [
      'No usarlo en cerdos de producción con certificación sanitaria: el estiércol como sustrato puede tener restricciones legales según el país.',
      'Requiere vigilar que la caja no se encharque.',
    ],
  },
  {
    id: 'caja-mascotas',
    nombre: 'Caja hermética pequeña',
    animal: 'Mascotas (perros, gatos, reptiles, aves)',
    emoji: '🐕',
    inversion: '$0–5 USD',
    produccion: '50–100 g de larvas/semana',
    dificultad: 'Fácil',
    principio: 'Escala mínima con control total del sustrato. Sin rampa: cosecha manual cada 3–4 días con un tamiz pequeño. La larva viva es un premio de alto valor para perros, gatos y reptiles.',
    materiales: [
      { item: 'Caja plástica hermética', spec: '10–15 L (tipo tupper grande o caja de herramientas)', costo: '$0–5' },
      { item: 'Malla fina', spec: 'para los agujeros de ventilación de la tapa', costo: '$0–1' },
      { item: 'Tamiz pequeño', spec: 'para cosecha manual', costo: '$0–2' },
    ],
    pasos: [
      'Haz agujeros de ventilación en la tapa y cúbrelos con malla fina para evitar escapes.',
      'Sustrato: solo residuos de cocina vegetales + salvado. Nada de carne cruda por temas sanitarios.',
      'Cada 3–4 días tamiza y recoge las larvas a mano.',
      'Para enriquecer en omega-3 (bueno para perros y reptiles): agrega chía o linaza molida al sustrato.',
    ],
    limitaciones: [
      'Producción muy baja: una caja de 15 L da ~50–100 g/semana, suficiente para 1–2 mascotas medianas.',
      'Hay que cosechar a mano; no se autocosecha.',
    ],
  },
];

export const LOWCOST_COMPARATIVA: { sistema: string; animal: string; inversion: string; mantenimiento: string; produccion: string; dificultad: string }[] = [
  { sistema: 'Balde colgado con tubos', animal: 'Gallinas', inversion: '$1–7', mantenimiento: 'Muy bajo', produccion: '200–500 g/sem', dificultad: 'Muy fácil' },
  { sistema: 'Caja con rampa en suelo', animal: 'Gallinas', inversion: '$0–5', mantenimiento: 'Bajo', produccion: '300–700 g/sem', dificultad: 'Muy fácil' },
  { sistema: 'Balde sobre estanque', animal: 'Tilapia / mojarra', inversion: '$1–7', mantenimiento: 'Muy bajo', produccion: '200–500 g/sem', dificultad: 'Fácil' },
  { sistema: 'Caja abierta en corral', animal: 'Cerdos', inversion: '$0–10', mantenimiento: 'Muy bajo', produccion: '500 g–2 kg/sem', dificultad: 'Fácil' },
  { sistema: 'Caja hermética pequeña', animal: 'Mascotas', inversion: '$0–5', mantenimiento: 'Bajo (cosecha manual)', produccion: '50–100 g/sem', dificultad: 'Fácil' },
];

export const LOWCOST_TIPS: string[] = [
  'Todos estos sistemas se multiplican: 5 baldes colgados = una bandeja de crianza estándar. La lógica es la misma, solo cambia el contenedor.',
  'Consigue los baldes gratis en talleres de mecánica, panaderías (baldes de manteca) o ferreterías (baldes de pintura vacíos). Lávalos bien.',
  'El sustrato más barato y siempre disponible: 50% residuos de cocina triturados + 30% salvado + 20% melaza diluida al 5%.',
  'No necesitas termómetro los primeros meses: si en tu zona las plantas crecen todo el año, la temperatura le sirve a la larva.',
  'La semilla (pie de cría) es la única inversión que de verdad importa. Con el Kit ProLarva llega lista; sin él, toca atraer moscas con banano maduro + gallinaza al sol y tener paciencia.',
];

// ═══ 3. QUÉ DARLES / QUÉ NO ══════════════════════════════════════════════════

export interface SustratoSi {
  emoji: string;
  nombre: string;
  proteina: string;
  nivel: 'Base' | 'Complemento' | 'Alto proteico' | 'Ultra proteico';
  desc: string;
}

export const ALIMENTACION_SI: SustratoSi[] = [
  { emoji: '🥦', nombre: 'Desechos de frutas y verduras', proteina: '10–15%', nivel: 'Base', desc: 'La base de cualquier camada. Cáscaras, restos de cocina, frutas pasadas. Aportan humedad y energía.' },
  { emoji: '🌾', nombre: 'Afrecho / salvado de trigo o arroz', proteina: '13–18%', nivel: 'Base', desc: 'Equilibra la humedad: absorbe el exceso de líquido y aporta fibra. Mézclalo siempre con los sustratos húmedos.' },
  { emoji: '☕', nombre: 'Pulpa de café', proteina: '10–12%', nivel: 'Complemento', desc: 'Las larvas la consumen bien. Ideal en zonas cafeteras. No más del 30% del total: acidifica.' },
  { emoji: '🍺', nombre: 'Afrecho de cervecería (bagazo)', proteina: '20–25%', nivel: 'Alto proteico', desc: 'Residuo húmedo de las cervecerías. Excelente para larvas jóvenes. Se consigue gratis o muy barato.' },
  { emoji: '🐔', nombre: 'Gallinaza / estiércol de gallina', proteina: '25–35%', nivel: 'Alto proteico', desc: 'La fuente proteica más accesible. Acelera el crecimiento. Siempre fresca o semifermentada, nunca seca. Máx. 40% del total.' },
  { emoji: '🥩', nombre: 'Concentrado de pollo o cerdo', proteina: '20–28%', nivel: 'Alto proteico', desc: 'El refuerzo proteico más controlado. Humedécelo antes. Ideal para la fase de engorde (días 10–15).' },
  { emoji: '🐟', nombre: 'Harina de pescado o vísceras frescas', proteina: '40–60%', nivel: 'Ultra proteico', desc: 'El sustrato más alto en proteína. Solo para las últimas 48–72 h antes de cosechar. Genera olor fuerte.' },
  { emoji: '🍞', nombre: 'Residuos de panadería', proteina: '10–13%', nivel: 'Complemento', desc: 'Pan viejo, migas, masa sobrante. Buena energía. Humedécelo y no lo dejes enmohecer antes de usarlo.' },
];

export interface SustratoNo {
  emoji: string;
  texto: string;
  razon: string;
}

export const ALIMENTACION_NO: SustratoNo[] = [
  { emoji: '🍋', texto: 'Cítricos en exceso (limón, naranja, mandarina en cantidad)', razon: 'Bajan el pH y acidifican el sustrato. Las larvas se frenan o mueren.' },
  { emoji: '🧂', texto: 'Alimentos muy salados o con conservantes', razon: 'La sal deshidrata las larvas; los conservantes son tóxicos para el cultivo. Sal máx. 1%.' },
  { emoji: '🧄', texto: 'Ajo y cebolla en grandes cantidades', razon: 'Los compuestos sulfurados en alta concentración inhiben el desarrollo.' },
  { emoji: '🫙', texto: 'Alimentos con fungicidas, pesticidas o herbicidas', razon: 'Tóxicos directos: pueden matar toda la camada sin ninguna señal previa.' },
  { emoji: '🛢️', texto: 'Aceites y grasas en exceso', razon: 'Sellan la superficie del sustrato, quitan el oxígeno y generan pudrición.' },
  { emoji: '🦴', texto: 'Carne cruda muy descompuesta (más de 3 días)', razon: 'Atrae moscas de otras especies que compiten con la BSF y da olores extremos.' },
  { emoji: '💊', texto: 'Estiércol de animales medicados con antibióticos recientes', razon: 'Los residuos antibióticos matan la microbiota que ayuda a procesar el sustrato.' },
  { emoji: '🧴', texto: 'Detergentes, jabón, cloro o químicos de limpieza', razon: 'Mortalidad inmediata. Enjuaga bien cualquier recipiente reciclado antes de usarlo.' },
  { emoji: '🪵', texto: 'Plásticos, vidrio, metal, colillas', razon: 'No los procesan y contaminan el frass y la larva cosechada.' },
];

export interface AlimentacionEtapa {
  dias: string;
  fase: string;
  emoji: string;
  sustrato: string;
  proteina: string;
  humedad: string;
  frecuencia: string;
  cantidad: string;
  nota: string;
}

export const ALIMENTACION_ETAPAS: AlimentacionEtapa[] = [
  { dias: 'Días 1–5', fase: 'Larva recién eclosionada', emoji: '🥚', sustrato: 'Mezcla suave: frutas/verduras + afrecho (80/20)', proteina: '10–14%', humedad: '65–70%', frecuencia: '1 vez/día', cantidad: '3–5× el peso de larvas', nota: 'Tritura o licúa el sustrato: la boca es muy pequeña al inicio.' },
  { dias: 'Días 6–12', fase: 'Crecimiento activo', emoji: '🐛', sustrato: 'Frutas/verduras + gallinaza o concentrado (60/40)', proteina: '18–24%', humedad: '60–65%', frecuencia: '1–2 veces/día', cantidad: '8–12× el peso de larvas', nota: 'Esta etapa define el tamaño final. No escatimes cantidad ni proteína.' },
  { dias: 'Días 13–18', fase: 'Engorde y pre-cosecha', emoji: '💪', sustrato: 'Concentrado + gallinaza (50/50), o harina de pescado las últimas 48 h', proteina: '25–35%', humedad: '55–60%', frecuencia: '1 vez/día (reducir las últimas 48 h)', cantidad: '10–15× el peso de larvas', nota: 'El alto proteico sube el % de proteína de la larva cosechada (del 40 al 46%+).' },
  { dias: 'Días 19–22', fase: 'Prepupa / cosecha inminente', emoji: '⏰', sustrato: 'Detener la alimentación', proteina: '—', humedad: '—', frecuencia: 'No aplicar', cantidad: '—', nota: 'La larva deja de comer. Agregar sustrato solo genera desechos y olor. Cosecha ya.' },
];

export const PROTEINA_NIVELES: { proteina: string; label: string; sustrato: string }[] = [
  { proteina: '38–40%', label: 'Larva estándar', sustrato: 'Solo residuos de cocina y afrecho todo el ciclo.' },
  { proteina: '42–44%', label: 'Larva optimizada', sustrato: 'Gallinaza o concentrado a partir del día 8.' },
  { proteina: '44–48%', label: 'Larva premium', sustrato: 'Harina de pescado o vísceras frescas los últimos 2–3 días antes de cosechar.' },
];

export const ALIMENTACION_REGLAS: { icon: string; label: string; valor: string }[] = [
  { icon: '⚖️', label: 'Relación base', valor: '10:1 — 10 g de sustrato por 1 g de larva al día' },
  { icon: '💧', label: 'Humedad ideal', valor: '60–70% — aprietas y no gotea' },
  { icon: '🌡️', label: 'Temperatura', valor: '26–32 °C para máximo crecimiento' },
  { icon: '🍽️', label: 'Cómo servir', valor: 'A un lado de las larvas, no encima. Homogéneo, no en trozos grandes.' },
];

// ═══ 4. PROCESAMIENTO ════════════════════════════════════════════════════════

export interface ProcesoRuta {
  id: 'viva' | 'harina';
  titulo: string;
  emoji: string;
  color: string;
  tagline: string;
  cuando: string;
  pros: string[];
  contras: string[];
  pasos: { titulo: string; desc: string; alerta?: string }[];
  materiales: string[];
}

export const PROCESAMIENTO: ProcesoRuta[] = [
  {
    id: 'viva',
    titulo: 'Larva viva (fresca)',
    emoji: '🐛',
    color: '#f59e0b',
    tagline: 'Cosechas y das directo al animal. Cero equipo, resultado inmediato.',
    cuando: 'Tienes los animales al lado del criadero y consumes la larva en 1–2 días.',
    pros: [
      'Cero procesamiento y cero inversión en equipos.',
      'Máxima digestibilidad: el animal aprovecha todo.',
      'Las aves, peces y cerdos la comen con entusiasmo por el movimiento.',
      'Resultado el mismo día de la cosecha.',
    ],
    contras: [
      'Solo aguanta 48 h sin refrigeración: después pasa a prepupa y pierde proteína.',
      'No se puede transportar lejos ni almacenar.',
      'Difícil de vender fuera de tu zona.',
      'La producción tiene que ir sincronizada con el consumo de tus animales.',
    ],
    pasos: [
      { titulo: 'Identifica el punto de cosecha', desc: 'Larvas L5–L6: blancas-crema, gordas y firmes (~2 cm), muy activas, casi sin comer. Entre el día 15 y el 18.' },
      { titulo: 'Separa con tamiz', desc: 'Vierte el sustrato sobre una zaranda de 5–8 mm. Las larvas quedan arriba, el frass cae. Guarda el frass para abono.' },
      { titulo: 'Enjuaga (opcional)', desc: 'Con agua limpia para quitar restos de sustrato. Si las das directamente sin lavar, los animales las consumen igual.' },
      { titulo: 'Pesa y registra', desc: 'Anota kg cosechados y kg de sustrato usado para calcular tu conversión del ciclo.' },
      { titulo: 'Suministra a los animales', desc: 'Ofrécelas vivas directamente. Lo que sobre, refrigéralo a 4–8 °C máximo 48 h en bolsa cerrada.', alerta: 'No guardes más de 48 h sin frío: se vuelven prepupas y pierden valor proteico.' },
    ],
    materiales: ['Tamiz o zaranda (5–8 mm)', 'Baldes plásticos', 'Báscula (opcional)', 'Recipiente para la larva cosechada'],
  },
  {
    id: 'harina',
    titulo: 'Harina de larva seca',
    emoji: '🌾',
    color: '#10b981',
    tagline: 'Procesas la larva en polvo. Dura meses, se transporta y se vende.',
    cuando: 'Quieres almacenar, vender o suplementar de forma controlada durante todo el año.',
    pros: [
      '40–45% de proteína concentrada, lista para mezclar en cualquier ración.',
      'Vida útil de 6 a 12 meses en bolsa hermética.',
      'Fácil de transportar y de vender (tiendas de mascotas, ganadería, acuicultura).',
      'Permite acumular la producción de varios ciclos.',
    ],
    contras: [
      'Requiere deshidratador o horno y un molino/licuadora.',
      'Rendimiento: 1 kg de larva fresca ≈ 200–250 g de harina (el resto era agua).',
      'Consume energía (electricidad o gas) o varios días de sol.',
      'Un mal secado = harina que se echa a perder.',
    ],
    pasos: [
      { titulo: 'Cosecha y limpia', desc: 'Igual que para larva viva: tamiza y lava las larvas L5–L6 con agua limpia. Escúrrelas bien.' },
      { titulo: 'Inactiva (mata la larva)', desc: 'Sumérgelas en agua a 70–80 °C por 3–5 minutos. Esto las mata, frena las enzimas y elimina patógenos.', alerta: 'No te saltes este paso: es lo que hace el producto seguro. Alternativa: congelar a −18 °C por 24 h.' },
      { titulo: 'Escurre el agua', desc: 'Usa el tamiz. Entre menos agua quede, menos tiempo de secado necesitas.' },
      { titulo: 'Deshidrata', desc: 'Deshidratador a 60–70 °C por 8–12 h · u horno a 60–70 °C por 6–8 h · o sol en bandeja de malla 2–4 días, volteando cada 6 h y tapando con malla anti-insectos.', alerta: 'Listas cuando se quiebran solas y no sueltan humedad. Objetivo: menos del 10% de humedad.' },
      { titulo: 'Muele y tamiza', desc: 'Licuadora, molino o procesador hasta polvo fino. Pasa por un tamiz de 1–2 mm para quitar los trozos grandes.' },
      { titulo: 'Empaca y etiqueta', desc: 'Bolsa hermética o frasco de vidrio, en lugar fresco, seco y oscuro. Etiqueta: lote, fecha, peso y % de proteína si lo tienes.' },
    ],
    materiales: ['Tamiz', 'Olla grande', 'Deshidratador u horno (o secador solar)', 'Licuadora o molino', 'Frascos o bolsas herméticas', 'Báscula'],
  },
];

export const PROCESAMIENTO_COMPARATIVA: { criterio: string; viva: string; harina: string }[] = [
  { criterio: 'Inversión en equipo', viva: 'Cero (solo un tamiz)', harina: 'Deshidratador/horno + molino' },
  { criterio: 'Vida útil', viva: '48 h sin refrigeración', harina: '6–12 meses' },
  { criterio: 'Proteína', viva: '~18–20% (base fresca)', harina: '40–45% (base seca)' },
  { criterio: 'Rendimiento', viva: '100% de lo cosechado', harina: '20–25% del peso fresco' },
  { criterio: 'Transporte', viva: 'Local, inmediato', harina: 'A cualquier distancia' },
  { criterio: 'Venta', viva: 'Difícil fuera de la zona', harina: 'Tiendas, ganadería, acuicultura' },
  { criterio: 'Mejor para', viva: 'Tus propios animales, día a día', harina: 'Vender, almacenar, suplemento controlado' },
];

// ═══ 5. CRÍA PASO A PASO (del huevo a la cosecha) ════════════════════════════
// Portado de /cosecha

export interface CriaPaso {
  n: number;
  emoji: string;
  title: string;
  range: string;
  color: string;
  summary: string;
  description: string[];
  tips: string[];
  alerts: string[];
  registro: string;
}

export const CRIA_PASOS: CriaPaso[] = [
  {
    n: 1, emoji: '🥚', title: 'Conseguir la semilla', range: 'Día 0', color: '#f97316',
    summary: 'El punto de partida: tener huevos BSF listos para incubar.',
    description: [
      'Tienes dos caminos para empezar:',
      '🛒 Con ProLarva — la forma más segura. Recibes semilla lista para empezar sin adivinar.',
      '🌿 De forma natural — crea un sustrato atrayente y coloca tiras de cartón corrugado para que las hembras depositen los huevos entre las capas.',
      'Los huevos son puntos crema casi invisibles, del tamaño de una semilla de mostaza. Los encuentras entre las capas del cartón.',
    ],
    tips: [
      'Para atraer hembras naturalmente: banano maduro + gallinaza + un poco de aceite vegetal funciona muy bien.',
      'Las hembras solo ponen con luz solar directa: asegúrate de que el insectario tenga acceso al sol.',
      'Revisa el cartón cada 2 días. Cuando veas los puntitos crema, ya puedes separar los huevos.',
    ],
    alerts: [],
    registro: 'Anota la fecha exacta en que recolectas los huevos. Ese es tu Día 0 de ciclo.',
  },
  {
    n: 2, emoji: '🪺', title: 'Preparar la cuna de incubación', range: 'Día 0–4', color: '#eab308',
    summary: 'Los huevos eclosionan a los 4 días si están en el ambiente correcto.',
    description: [
      'Una vez que tienes los huevos, hay que darles el ambiente ideal para que eclosionen bien:',
      '1. Separa los huevos del cartón y colócalos sobre una malla fina o una hoja de papel.',
      '2. Pon esa malla/papel encima de una capa de sustrato muy triturado y suave, casi pastoso.',
      '3. Una excelente opción: purina de pollo humedecida. Las larvitas pueden comerla directamente al nacer.',
    ],
    tips: [
      'El sustrato húmedo pero no encharcado: si lo aprietas, no debe escurrir agua.',
      'Temperatura ideal de incubación: 26–30 °C. En clima cálido el ambiente ya lo da.',
      'Cubre el recipiente con una tela o papel: oscuridad parcial, sin luz directa sobre los huevos.',
    ],
    alerts: [
      'No expongas los huevos a luz solar directa: se secan y mueren.',
      'No muevas ni sacudas el recipiente durante estos 4 días.',
    ],
    registro: 'Calcula tu fecha estimada de cosecha: Día 0 + 18 días. Ponla visible donde vas a trabajar.',
  },
  {
    n: 3, emoji: '🐛', title: 'Eclosión y primeros días comiendo', range: 'Día 4–9', color: '#84cc16',
    summary: 'Eclosionan a los 4 días y empiezan a comer de inmediato. Déjalas 5 días en el contenedor inicial.',
    description: [
      'Al día 4 las larvas salen. Son diminutas (menos de 1 mm) pero muy activas y hambrientas.',
      'Como nacieron encima del sustrato, empiezan a comer solas de inmediato: no necesitas hacer nada.',
      'Deja que coman durante 5 días en ese mismo contenedor inicial. No las muevas todavía.',
      'En estos 5 días van a triplicar o cuadruplicar su tamaño.',
    ],
    tips: [
      'No agregues alimento nuevo durante estos primeros 5 días: el sustrato de eclosión alcanza para arrancar.',
      'Mantenlas en oscuridad o semioscuridad: tapa el recipiente.',
      'Si el sustrato se ve muy seco, rocía un poco de agua con atomizador.',
    ],
    alerts: [
      'No sacudas ni agites el contenedor: las larvitas son muy frágiles en esta etapa.',
      'Evita alimentos ácidos, muy salados o con aceite al inicio.',
    ],
    registro: 'Anota la fecha de eclosión real y observaciones: cuántas larvas ves, aspecto del sustrato.',
  },
  {
    n: 4, emoji: '🏠', title: 'Traslado y desarrollo', range: 'Día 9–15', color: '#22c55e',
    summary: 'Las larvas ya crecieron. Pasan al contenedor grande, donde comen cada 2 días hasta la cosecha.',
    description: [
      'Al día 9 las larvas miden varios milímetros y necesitan más espacio y más comida.',
      'Trasládalas — junto con el sustrato inicial — al contenedor de producción definitivo (más grande).',
      'Aquí se desarrollan completamente. La calidad de la cosecha depende de cómo manejes esta etapa.',
      'Agrega alimento fresco aproximadamente cada 2 días: frutas, verduras, gallinaza, sobras orgánicas.',
    ],
    tips: [
      'No sobrealimentes: si aún hay sustrato sin consumir, espera para agregar más.',
      'Sin luz: cubre el contenedor o ponlo en zona oscura. Las larvas le huyen a la luz.',
      'Puedes combinar distintos tipos de residuos para mejorar el perfil nutricional de la larva.',
    ],
    alerts: [
      '⚠️ Olor fuerte = demasiada humedad. Reduce el alimento húmedo y ventila. Esto es lo más importante de monitorear.',
      'No uses alimentos podridos, con hongos, ni cítricos en exceso.',
      'Sin sal y sin aceite: dañan la camada.',
    ],
    registro: 'Anota cada alimentación: qué diste, cuántos kg y la fecha. Con esto calculas la conversión al final.',
  },
  {
    n: 5, emoji: '⭐', title: 'Cosecha', range: 'Día 15–18', color: '#10b981',
    summary: '¡Primera meta cumplida! Las larvas están en su punto máximo de proteína. A alimentar los animales.',
    description: [
      'Entre los días 15 y 18 las larvas llegan a su máximo valor nutricional, justo antes de entrar a prepupa.',
      'Señales de que están listas:',
      '✓ Color blanco-crema, cuerpo gordo y firme',
      '✓ Muy activas: algunas intentan escapar del contenedor',
      '✓ Ya casi no consumen alimento',
      'Recógelas, pésalas y dáselas directamente a tus animales. Las consumen de forma instintiva.',
    ],
    tips: [
      'La mejor hora para cosechar es temprano en la mañana: las larvas están menos activas.',
      'Si el lote ya está listo al día 13 o 14, cosecha sin esperar.',
      'Puedes refrigerar el exceso hasta 2 semanas en bolsa cerrada.',
    ],
    alerts: [
      'No esperes más del día 18 sin cosechar: empiezan a pasar a prepupa y pierden valor nutricional.',
      'Si ya hay muchas larvas oscureciéndose (marrón), estás llegando tarde.',
    ],
    registro: 'Anota: peso cosechado (kg) y sustrato total usado (kg). Conversión = kg larva ÷ kg sustrato × 100. Un buen ciclo da 15–30%.',
  },
];

export const CRIA_CICLO_CERRADO: CriaPaso[] = [
  {
    n: 6, emoji: '🟤', title: 'Las prepupas — el ciclo sigue', range: 'Día 18+', color: '#a16207',
    summary: 'Si no cosechas, las larvas se oscurecen solas y entran en prepupa. Eso es normal y perfecto.',
    description: [
      'Si decides continuar el ciclo en vez de cosechar todo, el proceso sigue solo:',
      'Sigue agregando comida cada 2 días como hasta ahora. Las larvas siguen comiendo.',
      'Con el tiempo notas que algunas larvas se oscurecen: de blanco-crema a marrón oscuro. Esas son las prepupas.',
      'Siguen activas y se mueven, pero ya no comen. Por instinto se alejan de la humedad y buscan un lugar seco.',
      'No tienes que hacer nada todavía: este cambio es natural y progresivo.',
    ],
    tips: [
      'No todas se oscurecen al mismo tiempo: es normal ver una mezcla de larvas blancas y prepupas marrones.',
      'Puedes seguir cosechando las blancas para alimento y dejar que las marrones sigan su ciclo.',
      'Mantén el contenedor en oscuridad: las prepupas se estresan con la luz.',
    ],
    alerts: [
      'No agregues demasiada humedad cuando ya hay muchas prepupas: buscan escapar y se dispersan.',
      'Si ves prepupas intentando salirse del contenedor, es la señal para armar las trampas del siguiente paso.',
    ],
    registro: 'Anota cuándo empieza el cambio de color. Eso te dice cuándo armar las trampas.',
  },
  {
    n: 7, emoji: '🪵', title: 'Trampas para prepupas', range: 'Día 22–28', color: '#7c3aed',
    summary: 'Tablas de madera que guían las prepupas hacia un contenedor seco con afrecho o aserrín. Ellas se mueven solas.',
    description: [
      'Cuando la mayoría del lote ya está en prepupa, es hora de facilitarles la salida.',
      'Las prepupas se alejan de la humedad por instinto: usas ese instinto a tu favor.',
      'Arma rampas o tablitas de madera que salgan del sustrato y "caigan" hacia afuera del contenedor. Las prepupas las suben solas y caen al otro lado.',
      'Del otro lado pon un contenedor nuevo con una cama de afrecho (salvado de trigo) o aserrín. Ahí van a pupar.',
      'En ese segundo contenedor, en un lugar oscuro, fresco y ventilado, las prepupas se transforman en pupas durante 10–14 días.',
    ],
    tips: [
      'Las tablitas deben quedar inclinadas: las prepupas suben hacia arriba, hacia lo seco.',
      'El afrecho o aserrín debe estar seco: la clave es que sea lo opuesto al sustrato húmedo.',
      'El contenedor de pupas no necesita comida: en esta etapa no comen.',
    ],
    alerts: [
      'El contenedor de pupas necesita buena ventilación pero sin humedad.',
      'Las hormigas son el peor enemigo en esta etapa: asegúrate de que no puedan entrar.',
      'No manipules las pupas: son frágiles y el movimiento las daña.',
    ],
    registro: 'Anota cuántas prepupas recolectaste. En 10–14 días eclosionan como adultos, se aparean, ponen huevos y el ciclo reinicia.',
  },
];
