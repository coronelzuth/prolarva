// ─────────────────────────────────────────────────────────────────────────────
// LARVI PRO — árbol de conversación de la Enciclopedia
// Cubre: el ciclo etapa por etapa · dudas generales · diagnóstico de problemas
// Fuente: Documento Maestro — Colonia BSF (secciones 4, 5, 7, 11) + guía de cría
// ─────────────────────────────────────────────────────────────────────────────

export interface BotOption {
  label: string;
  to: string;
}

export interface BotNode {
  message: string;
  options?: BotOption[];
}

export const BOT_START = 'start';

export const BOT_TREE: Record<string, BotNode> = {
  start: {
    message: '👋 Soy Larvi Pro. Te acompaño por todo el ciclo de la larva BSF. ¿Con qué te ayudo?',
    options: [
      { label: '🔄 Entender el ciclo etapa por etapa', to: 'ciclo_menu' },
      { label: '🐛 Estoy en una etapa y tengo dudas', to: 'etapa_menu' },
      { label: '🚨 Algo va mal en mi criadero', to: 'problema_menu' },
      { label: '🥗 Qué darles y qué no', to: 'alim_menu' },
      { label: '⭐ Cuándo y cómo cosechar', to: 'cosecha_menu' },
      { label: '❓ Dudas generales', to: 'general_menu' },
    ],
  },

  // ═══ EL CICLO ═════════════════════════════════════════════════════════════
  ciclo_menu: {
    message: 'El ciclo completo dura ~40 días si lo cierras, o 18 días si cosechas. Son estas etapas:\n\n🥚 Huevo (3–4 d) → 🐛 Larva (14–18 d) → 🟤 Prepupa (5–7 d) → 🫘 Pupa (10–14 d) → 🦟 Mosca (5–8 d) → 🔄 Postura\n\n¿Cuál quieres ver?',
    options: [
      { label: '🥚 Huevo', to: 'e_huevo' },
      { label: '🐛 Larva joven (L1–L3)', to: 'e_larva_joven' },
      { label: '🐛 Larva media (L4–L5)', to: 'e_larva_media' },
      { label: '⭐ Larva madura (L6)', to: 'e_larva_madura' },
      { label: '🟤 Prepupa', to: 'e_prepupa' },
      { label: '🫘 Pupa', to: 'e_pupa' },
      { label: '🦟 Mosca adulta', to: 'e_adulto' },
      { label: '🔄 Postura de huevos', to: 'e_postura' },
      { label: '← Volver', to: 'start' },
    ],
  },
  e_huevo: {
    message: '🥚 HUEVO · 3–4 días · 27–30 °C · 70–80% humedad\n\nLa hembra deposita 400–900 huevos en grietas secas cerca de materia orgánica. Son puntos color crema, casi invisibles, del tamaño de una semilla de mostaza.\n\nTú: mantenlos sobre sustrato blando y húmedo (purina de pollo humedecida es ideal), en semioscuridad, sin moverlos. Eclosionan cuando ves larvitas de 1–2 mm moviéndose.\n\n⚠️ Sin luz directa (se secan) y sin agua encharcada (hongos).',
    options: [
      { label: 'Siguiente etapa →', to: 'e_larva_joven' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_larva_joven: {
    message: '🐛 LARVA JOVEN (L1–L3) · 5–7 días · 27–30 °C\n\nMiden 1–3 mm, muy activas y frágiles. Crecen a toda velocidad. Comen materia orgánica en descomposición finamente picada.\n\nTú: sustrato blando y húmedo, oscuridad, y NO moverlas ni agitarlas los primeros 4–5 días. Evita ácido, sal y aceite.\n\n⚠️ Muy sensibles al estrés hídrico y a la luz directa.',
    options: [
      { label: 'Siguiente etapa →', to: 'e_larva_media' },
      { label: '¿Cuánto y qué les doy?', to: 'alim_etapas' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_larva_media: {
    message: '🐛 LARVA MEDIA (L4–L5) · 5–8 días · 27–32 °C\n\nAlcanzan 1–1,5 cm. El consumo de sustrato se dispara: es la etapa de mayor eficiencia para procesar residuos.\n\nTú: sube la cantidad de alimento progresivamente, vigila la densidad (sin hacinamiento), voltea suave el sustrato cada 2–3 días.\n\n⚠️ El hacinamiento genera calor interno que puede matar la camada. Olor fuerte = exceso de alimento húmedo.',
    options: [
      { label: 'Siguiente etapa →', to: 'e_larva_madura' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_larva_madura: {
    message: '⭐ LARVA MADURA (L6) · 2–4 días · punto de cosecha\n\nBlanca-crema, cuerpo grueso y firme, ~2–2,5 cm, muy activa. 40–45% proteína, 28–35% grasa. Deja de comer y busca escapar.\n\nTú: COSECHA AHORA para máximo valor. Si no vas a cosechar, prepara zona oscura y seca para que pasen a prepupa.\n\n⚠️ Si esperas de más, se oscurecen (prepupa) y baja la proteína.',
    options: [
      { label: '¿Cómo cosecho?', to: 'cosecha_como' },
      { label: 'Siguiente etapa →', to: 'e_prepupa' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_prepupa: {
    message: '🟤 PREPUPA · 5–7 días · 22–28 °C · sustrato seco\n\nLa larva se oscurece (marrón-negra), deja de comer y migra buscando un lugar seco y oscuro para pupar. Este instinto es la base de la autocosecha.\n\nTú: dale una rampa rugosa inclinada hacia un balde seco con afrecho o aserrín. Migra sola, no la fuerces.\n\n⚠️ NO necesita alimento. La humedad alta pudre las prepupas.',
    options: [
      { label: '¿Qué es la autocosecha?', to: 'g_autocosecha' },
      { label: 'Siguiente etapa →', to: 'e_pupa' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_pupa: {
    message: '🫘 PUPA · 10–14 días · 25–26 °C · 60% humedad · oscuridad\n\nEncerrada en una cubierta oscura y endurecida (puparium), la larva se transforma en mosca. Reposo total: no come, no se mueve.\n\nTú: recipiente con aserrín/viruta seca 2–3 cm, oscuridad o luz tenue, buena ventilación. No mojar.\n\nSeñal de que va a emerger: la pupa se pone casi negra y uno de sus extremos se curva.\n\n⚠️ Humedad = hongos. Las hormigas destruyen las pupas.',
    options: [
      { label: 'Siguiente etapa →', to: 'e_adulto' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_adulto: {
    message: '🦟 MOSCA ADULTA · 5–8 días · 27–30 °C · luz solar directa\n\nLa mosca NO tiene boca funcional: no come, solo bebe agua. Su único trabajo es aparearse y poner huevos. No pica ni transmite enfermedades.\n\nTú: agua en esponja o algodón húmedo (endulzada con panela ayuda), luz solar directa o UV 6–8 h/día, tiras de cartón corrugado para la postura.\n\n⚠️ Sin luz intensa NO se aparean. Solo agua, nunca comida.',
    options: [
      { label: 'Siguiente etapa →', to: 'e_postura' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },
  e_postura: {
    message: '🔄 POSTURA DE HUEVOS · 2–3 días\n\nLa hembra pone 400–900 huevos en las grietas del cartón corrugado, atraída por el olor de un sustrato fermentado 2–3 días. En 3–5 días eclosionan y el ciclo reinicia.\n\nTú: coloca las tiras de cartón sobre el sustrato atrayente. Retíralas cada 24–48 h y llévalas al sustrato fresco.\n\n⚠️ Si dejas el cartón más de 5 días, los huevos eclosionan dentro del insectario.',
    options: [
      { label: 'Volver al inicio del ciclo →', to: 'e_huevo' },
      { label: '← Etapas', to: 'ciclo_menu' },
    ],
  },

  // ═══ "ESTOY EN UNA ETAPA" ════════════════════════════════════════════════
  etapa_menu: {
    message: '¿En qué punto está tu lote hoy?',
    options: [
      { label: 'Acabo de recibir/conseguir la semilla', to: 'p_semilla' },
      { label: 'Ya eclosionaron, son diminutas', to: 'e_larva_joven' },
      { label: 'Están creciendo, comen mucho', to: 'e_larva_media' },
      { label: 'Ya están gordas y blancas', to: 'e_larva_madura' },
      { label: 'Se están poniendo marrones', to: 'e_prepupa' },
      { label: 'Tengo pupas / quiero moscas', to: 'e_pupa' },
      { label: '← Volver', to: 'start' },
    ],
  },
  p_semilla: {
    message: 'Perfecto. Los primeros pasos:\n\n1. Separa los huevos del cartón sobre una malla fina o papel.\n2. Ponlos encima de sustrato muy triturado y húmedo (purina de pollo humedecida funciona muy bien).\n3. Cubre con tela, semioscuridad, 26–30 °C, sin moverlos.\n4. En 3–4 días verás larvitas. Déjalas comer 5 días en ese contenedor antes de trasladarlas.\n\nAnota la fecha: ese es tu Día 0. Cosecha estimada = Día 0 + 18.',
    options: [
      { label: 'Ver la guía completa de cría', to: 'cria_link' },
      { label: '← Volver', to: 'etapa_menu' },
    ],
  },
  cria_link: {
    message: '📘 En la sección "Cría paso a paso" de esta enciclopedia tienes los 7 pasos completos, del huevo a la cosecha, con consejos, alertas y qué registrar en cada uno. Búscala en el menú de la izquierda.',
    options: [{ label: '← Volver', to: 'start' }],
  },

  // ═══ PROBLEMAS ══════════════════════════════════════════════════════════
  problema_menu: {
    message: '¿Qué está pasando?',
    options: [
      { label: 'Las larvas no crecen o van lentas', to: 'x_lento' },
      { label: 'Las larvas se mueren', to: 'x_muerte' },
      { label: 'Huele muy feo', to: 'x_olor' },
      { label: 'Se están escapando', to: 'x_escape' },
      { label: 'Hay moho blanco/verde', to: 'x_moho' },
      { label: 'Salieron moscas blancas pequeñas', to: 'x_musca' },
      { label: 'No hay postura de huevos', to: 'x_postura' },
      { label: 'Las pupas no eclosionan', to: 'x_pupas' },
      { label: '← Volver', to: 'start' },
    ],
  },
  x_lento: {
    message: 'Crecimiento lento, en orden de probabilidad:\n\n1. 🌡️ Temperatura baja (< 24 °C) → es lo más crítico. Necesitan 26–32 °C. Cuarto cerrado, bombillo de calor o manta térmica.\n2. 🍖 Poca proteína en el sustrato → agrega gallinaza fresca o concentrado.\n3. 👥 Densidad muy alta → reparte las larvas en más recipientes.\n4. 🧪 pH ácido (< 5,5) → ajusta con un poco de cal.\n\n¿Cuál revisas primero?',
    options: [
      { label: 'En mi zona hace calor', to: 'x_lento_comida' },
      { label: 'A veces hace frío', to: 'x_lento_temp' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_lento_comida: {
    message: 'Si el clima ayuda, el problema casi siempre es el sustrato: poca proteína o demasiado ácido.\n\n• Sube la proteína: gallinaza fresca (máx 40%) o concentrado húmedo desde el día 8.\n• Quita los cítricos y cualquier cosa muy ácida.\n• Revisa que el sustrato esté húmedo (aprietas y salen 1–2 gotas), no seco ni encharcado.',
    options: [
      { label: 'Ver sustratos recomendados', to: 'alim_si' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_lento_temp: {
    message: 'Con menos de 22 °C el crecimiento se paraliza casi por completo. Opciones:\n\n• Cuarto cerrado que acumule calor de día.\n• Bombillo incandescente o esterilla calefactora bajo las bandejas.\n• Manta térmica en las noches frías.\n\nObjetivo: mantener el sustrato entre 26 y 32 °C.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_muerte: {
    message: '¿De qué color están las larvas muertas?',
    options: [
      { label: 'Marrones y firmes', to: 'x_muerte_marron' },
      { label: 'Negras', to: 'x_muerte_negra' },
      { label: 'Blancas muertas / masa con mal olor', to: 'x_muerte_blanca' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_muerte_marron: {
    message: '¡Buena noticia! Las larvas marrones, firmes y más quietas NO están muertas: son prepupas. Es una etapa normal del ciclo, están en transición a pupa.\n\nDales zona oscura con sustrato seco (afrecho o aserrín) y una rampa para que migren.',
    options: [
      { label: '¿Qué hago con las prepupas?', to: 'e_prepupa' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_muerte_negra: {
    message: 'Larvas negras = temperatura o humedad extrema.\n\n• Temperatura del sustrato > 35 °C (recuerda: la descomposición genera calor propio, hasta 5–8 °C sobre el ambiente). Ventila, mueve a la sombra, reduce el alimento húmedo.\n• Humedad encharcada sin drenaje → agrega afrecho seco y mejora los agujeros de drenaje.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_muerte_blanca: {
    message: 'Mortalidad masiva de larvas blancas con olor fuerte suele ser:\n\n• 🧪 pH fuera de rango (< 4,5 o > 9) → revisa el sustrato, ajusta la mezcla.\n• ☠️ Tóxicos: pesticidas, jabón, sal en exceso, químicos de limpieza en un recipiente mal enjuagado.\n• 🌡️ Golpe de temperatura (> 40 °C o < 10 °C).\n\nAísla el lote, revisa qué les diste de comer y la ventilación del espacio.',
    options: [
      { label: 'Ver qué NO darles', to: 'alim_no' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_olor: {
    message: 'Olor fuerte casi siempre = exceso de alimento húmedo que se pudre antes de que las larvas lo coman.\n\n1. Deja de agregar alimento 1–2 días: que se pongan al día.\n2. Mezcla material seco (afrecho, salvado, aserrín). Relación 70% húmedo / 30% seco.\n3. Mejora la ventilación y el drenaje de lixiviados.\n4. Si huele a amoníaco: exceso de nitrógeno (mucha gallinaza) → baja la proporción y agrega afrecho.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_escape: {
    message: 'Depende de la etapa:\n\n• Si las larvas están blancas y gordas (~2 cm): es instinto de larva madura (L6). Están listas para cosechar o para pasar a prepupa. Dales rampa y zona seca, o cosecha ya.\n• Si son larvas pequeñas escapando: el sustrato está demasiado húmedo o muy ácido. Agrega afrecho seco y revisa el pH.',
    options: [
      { label: '¿Cómo cosecho?', to: 'cosecha_como' },
      { label: '← Problemas', to: 'problema_menu' },
    ],
  },
  x_moho: {
    message: 'Manchas blancas o verdes en el sustrato = exceso de humedad + mala ventilación.\n\n1. Voltea el sustrato para airearlo.\n2. Agrega material seco (afrecho/aserrín).\n3. Mejora la ventilación del espacio.\n4. Un poco de moho no mata la camada, pero colonias extensas sí compiten por oxígeno. Retira las costras grandes.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_musca: {
    message: 'Larvas blancas pequeñas CON espinas o pelitos = mosca doméstica (Musca domestica), no BSF. Aparece cuando el sustrato está muy líquido o expuesto.\n\n1. Cubre las bandejas con malla fina.\n2. Reduce la humedad de la superficie del sustrato (más afrecho).\n3. Revisa sellos de puertas y ventanas.\n4. Una BSF sana desplaza a la mosca doméstica con el tiempo: mantén la colonia fuerte.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_postura: {
    message: 'Sin huevos, revisa en este orden:\n\n1. 💡 Luz: necesitan luz solar directa o UV, mínimo 6 h/día, > 2.000 lux. Es la causa #1.\n2. 🌡️ Temperatura de los adultos < 24 °C → calienta la zona.\n3. 👴 Adultos muy viejos (> 7 días) → renueva con un lote nuevo de pupas.\n4. 👃 Sin atrayente → pon sustrato fermentado 2–3 días junto a las tiras de cartón.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },
  x_pupas: {
    message: 'Pupas que no emergen:\n\n• Humedad excesiva en la zona de pupas → sustrato seco (aserrín/viruta), buena ventilación, nunca mojar.\n• Temperatura < 20 °C → paraliza el desarrollo. Mantén 25–26 °C.\n• Hongos (pupas blandas) → mismo problema de humedad.\n• Paciencia: tardan 10–14 días. Señal de que van a emerger: se ponen casi negras y un extremo se curva.',
    options: [{ label: '← Problemas', to: 'problema_menu' }],
  },

  // ═══ ALIMENTACIÓN ══════════════════════════════════════════════════════
  alim_menu: {
    message: 'La larva BSF come casi cualquier residuo orgánico en descomposición, pero responde muy distinto según la calidad. ¿Qué quieres ver?',
    options: [
      { label: '✅ Qué SÍ darles', to: 'alim_si' },
      { label: '❌ Qué NO darles', to: 'alim_no' },
      { label: '📊 Cuánto por etapa del ciclo', to: 'alim_etapas' },
      { label: '💪 Cómo subir la proteína de la larva', to: 'alim_proteina' },
      { label: '← Volver', to: 'start' },
    ],
  },
  alim_si: {
    message: '✅ SUSTRATOS RECOMENDADOS (de menos a más proteína):\n\n• Frutas y verduras (10–15%) — la base\n• Afrecho/salvado (13–18%) — equilibra la humedad\n• Pulpa de café (10–12%) — máx 30%\n• Afrecho de cervecería (20–25%)\n• Gallinaza fresca (25–35%) — máx 40%\n• Concentrado humedecido (20–28%)\n• Harina de pescado / vísceras (40–60%) — solo últimas 48–72 h\n\nRegla base: 10 g de sustrato por 1 g de larva al día. Humedad: aprietas y salen 1–2 gotas.',
    options: [
      { label: 'Ver la sección completa', to: 'alim_seccion_link' },
      { label: '← Alimentación', to: 'alim_menu' },
    ],
  },
  alim_no: {
    message: '❌ NUNCA les des:\n\n• Cítricos en exceso — acidifican, matan\n• Sal en exceso o conservantes — deshidratan / tóxicos\n• Ajo y cebolla en cantidad — inhiben el desarrollo\n• Pesticidas/fungicidas/herbicidas — matan toda la camada sin aviso\n• Aceite y grasa en exceso — quitan el oxígeno, pudren\n• Carne muy descompuesta (+3 días) — atrae otras moscas\n• Estiércol de animales con antibióticos recientes\n• Jabón, cloro, detergente — muerte inmediata\n• Plástico, vidrio, metal, colillas',
    options: [
      { label: 'Ver la sección completa', to: 'alim_seccion_link' },
      { label: '← Alimentación', to: 'alim_menu' },
    ],
  },
  alim_etapas: {
    message: '📊 CUÁNTO Y QUÉ, POR ETAPA:\n\n• Días 1–5: mezcla suave frutas + afrecho (80/20), triturada. 1 vez/día.\n• Días 6–12: frutas + gallinaza o concentrado (60/40). 1–2 veces/día. Esta etapa define el tamaño final.\n• Días 13–18: concentrado + gallinaza (50/50), o harina de pescado las últimas 48 h. Reduce la comida en la recta final.\n• Días 19–22: DETÉN la alimentación. La larva ya no come; agregar sustrato solo da olor.',
    options: [
      { label: 'Ver la sección completa', to: 'alim_seccion_link' },
      { label: '← Alimentación', to: 'alim_menu' },
    ],
  },
  alim_proteina: {
    message: '💪 La proteína de la larva NO es fija: la "programas" con el sustrato de los últimos días.\n\n• 38–40% (estándar): solo cocina y afrecho todo el ciclo.\n• 42–44% (optimizada): gallinaza o concentrado desde el día 8.\n• 44–48% (premium): harina de pescado o vísceras frescas los últimos 2–3 días.\n\nEsto es lo que separa a un productor básico de uno que puede cobrar más por su larva.',
    options: [
      { label: 'Ver la sección completa', to: 'alim_seccion_link' },
      { label: '← Alimentación', to: 'alim_menu' },
    ],
  },
  alim_seccion_link: {
    message: '🥗 En la sección "Qué darles / qué NO" de esta enciclopedia tienes las tablas completas: sustratos por nivel proteico, porciones por etapa y la lista de lo prohibido. Está en el menú de la izquierda.',
    options: [{ label: '← Volver', to: 'start' }],
  },

  // ═══ COSECHA ═══════════════════════════════════════════════════════════
  cosecha_menu: {
    message: '¿Qué necesitas sobre la cosecha?',
    options: [
      { label: '¿Cuándo cosechar exactamente?', to: 'cosecha_cuando' },
      { label: '¿Cómo se cosecha?', to: 'cosecha_como' },
      { label: '¿Qué hago con las larvas cosechadas?', to: 'cosecha_destino' },
      { label: 'Larva viva vs harina', to: 'cosecha_viva_harina' },
      { label: '← Volver', to: 'start' },
    ],
  },
  cosecha_cuando: {
    message: '⭐ Cosecha entre el día 15 y el 18, cuando la larva está en L5–L6:\n\n✓ Blanca-crema, cuerpo gordo y firme (~2 cm)\n✓ Muy activa, algunas intentan escapar\n✓ Ya casi no comen\n\nSi el lote está listo antes (día 13–14), cosecha sin esperar. Si ya hay muchas marrones oscureciéndose, estás llegando tarde: pasan a prepupa y baja la proteína.',
    options: [
      { label: '¿Cómo la cosecho?', to: 'cosecha_como' },
      { label: '← Cosecha', to: 'cosecha_menu' },
    ],
  },
  cosecha_como: {
    message: 'Cosecha con tamiz, temprano en la mañana (las larvas están menos activas):\n\n1. Vierte el sustrato sobre una zaranda de 5–8 mm.\n2. Agita suave: las larvas quedan arriba, el frass cae.\n3. Recoge las larvas en un recipiente limpio.\n4. Enjuágalas con agua limpia (opcional).\n5. Pesa y anota: kg de larva y kg de sustrato usado → conversión del ciclo.\n\nGuarda el frass en sacos: es biofertilizante.',
    options: [
      { label: '¿Y ahora qué hago con ellas?', to: 'cosecha_destino' },
      { label: '← Cosecha', to: 'cosecha_menu' },
    ],
  },
  cosecha_destino: {
    message: 'Tres caminos:\n\n🐛 Larva viva → directo a tus animales. Máx 48 h sin refrigerar.\n🌾 Harina seca → inactivas, secas y mueles. Dura 6–12 meses, se vende.\n🔄 Reproducción → reservas el 20–30% de las más grandes para que pupen y cierren el ciclo.',
    options: [
      { label: 'Larva viva vs harina', to: 'cosecha_viva_harina' },
      { label: '¿Cómo cierro el ciclo?', to: 'g_autocosecha' },
      { label: '← Cosecha', to: 'cosecha_menu' },
    ],
  },
  cosecha_viva_harina: {
    message: '🐛 LARVA VIVA: cero equipo, máxima digestibilidad, resultado el mismo día. Pero solo dura 48 h y no se transporta. Ideal para tus propios animales.\n\n🌾 HARINA: 40–45% proteína, dura 6–12 meses, se vende y se transporta. Requiere deshidratador + molino. Rendimiento: 1 kg de larva ≈ 200–250 g de harina.',
    options: [
      { label: 'Ver la sección Procesamiento', to: 'proc_seccion_link' },
      { label: '← Cosecha', to: 'cosecha_menu' },
    ],
  },
  proc_seccion_link: {
    message: '🏭 En la sección "Procesamiento" de esta enciclopedia tienes el paso a paso de cada ruta (inactivación, secado, molienda, empaque) y una tabla que compara las dos. Está en el menú de la izquierda.',
    options: [{ label: '← Volver', to: 'start' }],
  },

  // ═══ GENERALES ═════════════════════════════════════════════════════════
  general_menu: {
    message: '¿Qué duda tienes?',
    options: [
      { label: '¿Huele mal el criadero?', to: 'g_olor' },
      { label: '¿Atrae plagas o moscas comunes?', to: 'g_plagas' },
      { label: '¿Cuánto espacio necesito?', to: 'g_espacio' },
      { label: '¿Cuánto trabajo diario es?', to: 'g_trabajo' },
      { label: '¿Y si me voy de viaje?', to: 'g_viaje' },
      { label: '¿Es seguro para mis animales?', to: 'g_seguro' },
      { label: '¿Qué es el frass y para qué sirve?', to: 'g_frass' },
      { label: '¿Qué es la autocosecha?', to: 'g_autocosecha' },
      { label: '← Volver', to: 'start' },
    ],
  },
  g_olor: {
    message: 'Bien manejado, casi no huele:\n\n• Sustrato seco (aserrín, estiércol semicompostado) → cero hedor.\n• Sustrato húmedo equilibrado → olor neutro, como composta.\n• Si huele mal, algo está fuera de balance: casi siempre exceso de comida húmeda. Reduce el alimento y agrega afrecho seco.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_plagas: {
    message: 'No atrae moscas comunes:\n\n• La BSF es un insecto específico, no es mosca de fruta ni doméstica.\n• El contenedor va tapado con malla.\n• Bien criada = sin olor que atraiga otras especies.\n• Al contrario: una colonia BSF fuerte desplaza a la mosca doméstica del sustrato.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_espacio: {
    message: 'Muy poco. Un balde de 20 L o una caja de 40–60 L cabe en:\n\n• Una esquina del gallinero\n• Bajo el techo de la cocina o un alero\n• Un patio o huerta pequeña\n\nCon 5 baldes colgados produces lo mismo que una bandeja de crianza estándar.',
    options: [
      { label: 'Ver los sistemas low cost', to: 'lowcost_link' },
      { label: '← Dudas generales', to: 'general_menu' },
    ],
  },
  g_trabajo: {
    message: 'Muy poco trabajo extra:\n\n• Echar residuos al contenedor: 2 min cada 2–3 días (ya botabas esa basura).\n• Cosechar: 20–30 min por ciclo, o cero si usas autocosecha.\n• El resto sucede solo.\n\nTiempo total semanal de un sistema casero: 15–20 minutos.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_viaje: {
    message: '• Hasta 1 semana: sin problema. Échales comida de más antes de irte.\n• 2+ semanas: riesgo de que se coman entre ellas si escasea el alimento.\n\nPara viajes largos: cosecha lo que haya y congélalo, o deja el lote en autocosecha con un balde grande de sustrato seco.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_seguro: {
    message: 'Sí, es más segura que el concentrado comercial:\n\n✓ Proteína natural, sin aglutinantes ni antibióticos\n✓ Menos enfermedades digestivas\n✓ Aves con mejor color, cerdos con menos grasa, peces que crecen más rápido\n✓ Los animales la comen por instinto\n\nSolo cuida el sustrato: nada de químicos, carne muy descompuesta ni estiércol de animales medicados.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_frass: {
    message: 'El frass es lo que queda después de cosechar: excremento de la larva + restos de sustrato.\n\nEs un biofertilizante de alto valor, mejor que el compost común. Lo usas en tu huerta o lo vendes a agricultores (en LATAM se paga bien la bolsa). La larva te reduce la basura y encima te deja abono.',
    options: [{ label: '← Dudas generales', to: 'general_menu' }],
  },
  g_autocosecha: {
    message: 'La prepupa madura busca por instinto salir del sustrato húmedo hacia un lugar seco y oscuro para pupar. La autocosecha aprovecha eso:\n\nPones una rampa rugosa inclinada (45°) que salga del contenedor. Las prepupas suben solas y caen a un balde con afrecho o aserrín seco. Ahí pupan (10–14 días) → emergen moscas → ponen los huevos del siguiente lote. Ciclo cerrado, sin comprar más semilla.',
    options: [
      { label: 'Ver los sistemas low cost', to: 'lowcost_link' },
      { label: '← Dudas generales', to: 'general_menu' },
    ],
  },
  lowcost_link: {
    message: '💸 En la sección "Low cost" de esta enciclopedia tienes 5 sistemas de $0–10 USD con materiales reciclados: el balde autocosechante, la caja con rampa, el balde sobre estanque, la caja de corral y la caja para mascotas. Está en el menú de la izquierda.',
    options: [{ label: '← Volver', to: 'start' }],
  },
};
