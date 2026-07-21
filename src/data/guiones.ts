export type GuionTipo = 'V' | 'E' | 'C' | 'MSN'
export type GuionEstado =
  | 'BORRADOR'
  | 'EDITADO'
  | 'LISTO'
  | 'GRABADO'
  | 'DATOS'
  | 'FOOTAGE'
  | 'GUIONIZADO'
export type GuionAngulo = 'problema' | 'solucion' | 'resultado'

export interface Guion {
  id: string
  numero: number
  codigo: string
  titulo: string
  tipo: GuionTipo
  pilar: string
  bloque?: string
  estado: GuionEstado
  duracion: string
  nc?: number
  angulo?: GuionAngulo
  plataforma: string[]
  fecha_programada?: string
  contenido: string
  notas?: string
}

export const ESTADO_LABELS: Record<GuionEstado, string> = {
  BORRADOR: 'Borrador',
  EDITADO: 'Editado',
  LISTO: 'Listo ✓',
  GRABADO: 'Grabado 🎬',
  DATOS: '⚠️ Datos',
  FOOTAGE: '📸 Footage',
  GUIONIZADO: 'Guionizado',
}

export const ESTADO_COLORS: Record<GuionEstado, string> = {
  BORRADOR: '#64748b',
  EDITADO: '#3b82f6',
  LISTO: '#22c55e',
  GRABADO: '#a855f7',
  DATOS: '#f59e0b',
  FOOTAGE: '#f97316',
  GUIONIZADO: '#10b981',
}

export const TIPO_LABELS: Record<GuionTipo, string> = {
  V: '🔥 Viral',
  E: '📚 Educación',
  C: '💰 Conversión',
  MSN: '🦟 MSN',
}

export const TIPO_COLORS: Record<GuionTipo, string> = {
  V: '#ef4444',
  E: '#3b82f6',
  C: '#f59e0b',
  MSN: '#10b981',
}

export const GUIONES_BASE: Guion[] = [
  // ─── VIRAL (V1-V15) ───────────────────────────────────────────
  {
    id: 'V1', numero: 1, codigo: 'V1',
    titulo: 'El concentrado lleva dos años subiendo',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'EDITADO',
    duracion: '30-45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V2', numero: 2, codigo: 'V2',
    titulo: 'El mes que casi cierro la granja',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '30s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V3', numero: 3, codigo: 'V3',
    titulo: 'Las tres veces que fallé',
    tipo: 'V', pilar: 'El Productor Soberano', estado: 'BORRADOR',
    duracion: '45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V4', numero: 4, codigo: 'V4',
    titulo: '5 señales de que el concentrado te está quebrando',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V5', numero: 5, codigo: 'V5',
    titulo: 'El dato que nadie te dice (50% del costo)',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '20s', nc: 1, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V6', numero: 6, codigo: 'V6',
    titulo: 'El concentrado casero tampoco es la solución',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '30s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V7', numero: 7, codigo: 'V7',
    titulo: 'El sistema no está hecho para que ganes',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V8', numero: 8, codigo: 'V8',
    titulo: 'Lo que nadie te dice sobre depender del concentrado',
    tipo: 'V', pilar: 'La Trampa del Concentrado', estado: 'BORRADOR',
    duracion: '30s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V9', numero: 9, codigo: 'V9',
    titulo: 'Reacción de los pollos al ver larvas',
    tipo: 'V', pilar: 'Prueba Real de Campo', estado: 'FOOTAGE',
    duracion: '15s', nc: 1, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V10', numero: 10, codigo: 'V10',
    titulo: 'El insecto que convierte desperdicios en proteína',
    tipo: 'V', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '20s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V11', numero: 11, codigo: 'V11',
    titulo: 'Dos tipos de productores',
    tipo: 'V', pilar: 'El Productor Soberano', estado: 'BORRADOR',
    duracion: '30-45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V12', numero: 12, codigo: 'V12',
    titulo: 'Historia de origen ProLarva',
    tipo: 'V', pilar: 'Vida en ProLarva / BTS', estado: 'BORRADOR',
    duracion: '60-90s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V13', numero: 13, codigo: 'V13',
    titulo: 'Cosas que me siguen sorprendiendo de la larva',
    tipo: 'V', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V14', numero: 14, codigo: 'V14',
    titulo: 'Un día normal en ProLarva (vlog)',
    tipo: 'V', pilar: 'Vida en ProLarva / BTS', estado: 'FOOTAGE',
    duracion: '60s', nc: 2, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'V15', numero: 15, codigo: 'V15',
    titulo: 'BTS: problema real, solución real',
    tipo: 'V', pilar: 'Vida en ProLarva / BTS', estado: 'FOOTAGE',
    duracion: '60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── EDUCACIÓN (E1-E12) ────────────────────────────────────────
  {
    id: 'E1', numero: 16, codigo: 'E1',
    titulo: 'Tutorial BSF desde cero en 60 segundos',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E2', numero: 17, codigo: 'E2',
    titulo: '¿Cuánto espacio necesitas?',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E3', numero: 18, codigo: 'E3',
    titulo: '3 errores que hacen fracasar la larva BSF',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 3, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E4', numero: 19, codigo: 'E4',
    titulo: 'Cómo monté mi criadero en 3 días',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '90s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E5', numero: 20, codigo: 'E5',
    titulo: '15 minutos al día',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E6', numero: 21, codigo: 'E6',
    titulo: 'Qué come la larva BSF y por qué importa',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E7', numero: 22, codigo: 'E7',
    titulo: 'Temperatura y humedad exactos para Colombia',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 3, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E8', numero: 23, codigo: 'E8',
    titulo: 'Comprar larvas vs tener tu propio sistema',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '45s', nc: 3, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E9', numero: 24, codigo: 'E9',
    titulo: 'Timelapse ciclo completo BSF',
    tipo: 'E', pilar: 'El Sistema BSF', estado: 'FOOTAGE',
    duracion: '45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E10', numero: 25, codigo: 'E10',
    titulo: 'Día 0 del lote piloto',
    tipo: 'E', pilar: 'Prueba Real de Campo', estado: 'BORRADOR',
    duracion: '60-90s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E11', numero: 26, codigo: 'E11',
    titulo: '¿Cuánto ahorré realmente? Los números reales',
    tipo: 'E', pilar: 'Prueba Real de Campo', estado: 'DATOS',
    duracion: '60s', nc: 3, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'E12', numero: 27, codigo: 'E12',
    titulo: 'Antes/después: lote sin BSF vs con BSF — día 42',
    tipo: 'E', pilar: 'Prueba Real de Campo', estado: 'DATOS',
    duracion: '45s', nc: 3, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── CONVERSIÓN (C1-C6) ────────────────────────────────────────
  {
    id: 'C1', numero: 28, codigo: 'C1',
    titulo: 'Día 42 — resultados del lote BSF',
    tipo: 'C', pilar: 'Prueba Real de Campo', estado: 'DATOS',
    duracion: '60s', nc: 4, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'C2', numero: 29, codigo: 'C2',
    titulo: 'Piel amarilla, cero grasa',
    tipo: 'C', pilar: 'Prueba Real de Campo', estado: 'BORRADOR',
    duracion: '30-45s', nc: 4, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'C3', numero: 30, codigo: 'C3',
    titulo: 'La calculadora BSF',
    tipo: 'C', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '30s', nc: 3, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'C4', numero: 31, codigo: 'C4',
    titulo: 'Testimonio del primer cliente',
    tipo: 'C', pilar: 'Prueba Real de Campo', estado: 'FOOTAGE',
    duracion: '45s', nc: 4, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'C5', numero: 32, codigo: 'C5',
    titulo: '¿Qué incluye el Kit ProLarva?',
    tipo: 'C', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '60s', nc: 4, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'C6', numero: 33, codigo: 'C6',
    titulo: 'Story CTA calculadora',
    tipo: 'C', pilar: 'El Sistema BSF', estado: 'BORRADOR',
    duracion: '15-20s', nc: 4, angulo: 'resultado',
    plataforma: ['Instagram'], contenido: '',
  },

  // ─── MSN — BIOLOGÍA ASOMBROSA (MSN1-MSN10) ────────────────────
  {
    id: 'MSN1', numero: 34, codigo: 'MSN1',
    titulo: 'Del tamaño de un bebé al de una ballena',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~60s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN2', numero: 35, codigo: 'MSN2',
    titulo: '1 gramo que lo cambia todo',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN3', numero: 36, codigo: 'MSN3',
    titulo: '20 días del huevo al plato',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN4', numero: 37, codigo: 'MSN4',
    titulo: '10 kilos de basura: proteína y abono',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN5', numero: 38, codigo: 'MSN5',
    titulo: 'Seis vidas en una sola vida',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN6', numero: 39, codigo: 'MSN6',
    titulo: 'Nacen con las alas pegadas',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN7', numero: 40, codigo: 'MSN7',
    titulo: 'El romance más curioso de la naturaleza',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN8', numero: 41, codigo: 'MSN8',
    titulo: 'Pueden poner huevos sin aparearse',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN9', numero: 42, codigo: 'MSN9',
    titulo: 'El adulto que no puede comer',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN10', numero: 43, codigo: 'MSN10',
    titulo: 'La mosca disfrazada de avispa',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Biología Asombrosa', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── MSN — SUPERPODERES NUTRICIONALES (MSN11-MSN20) ────────────
  {
    id: 'MSN11', numero: 44, codigo: 'MSN11',
    titulo: '42% proteína — más que el pollo',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN12', numero: 45, codigo: 'MSN12',
    titulo: 'El calcio perfecto para tus aves',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN13', numero: 46, codigo: 'MSN13',
    titulo: 'La enzima que pone amarillo el pollo',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN14', numero: 47, codigo: 'MSN14',
    titulo: 'Gallinas que ponen más tiempo',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN15', numero: 48, codigo: 'MSN15',
    titulo: 'Gallinas felices producen más',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'resultado',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN16', numero: 49, codigo: 'MSN16',
    titulo: '50% de la dieta de tus peces sin harina de pescado',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN17', numero: 50, codigo: 'MSN17',
    titulo: 'El alimento hipoalergénico para mascotas',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN18', numero: 51, codigo: 'MSN18',
    titulo: 'El ácido láurico del aceite de coco... pero en una larva',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN19', numero: 52, codigo: 'MSN19',
    titulo: 'Elimina Salmonella y E. coli de tu compost',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN20', numero: 53, codigo: 'MSN20',
    titulo: 'Come según su dieta, produce según tu nicho',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Superpoderes Nutricionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── MSN — ECONOMÍA CIRCULAR Y AMBIENTE (MSN21-MSN27) ──────────
  {
    id: 'MSN21', numero: 54, codigo: 'MSN21',
    titulo: 'El frass: el abono que nadie está usando',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN22', numero: 55, codigo: 'MSN22',
    titulo: '900 kilos de CO₂ que no van al aire',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN23', numero: 56, codigo: 'MSN23',
    titulo: 'Genera menos emisiones que el compostaje tradicional',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN24', numero: 57, codigo: 'MSN24',
    titulo: 'Expulsa las moscas malas de tu granja',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN25', numero: 58, codigo: 'MSN25',
    titulo: 'Su grasa se convierte en biodiesel',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN26', numero: 59, codigo: 'MSN26',
    titulo: 'Existe en todos los continentes menos uno',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN27', numero: 60, codigo: 'MSN27',
    titulo: 'La lombriz californiana y la soldado negra — el dúo perfecto',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Economía Circular y Ambiente', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── MSN — NEGOCIO Y OPORTUNIDAD (MSN28-MSN35) ─────────────────
  {
    id: 'MSN28', numero: 61, codigo: 'MSN28',
    titulo: 'Cinco productos de un solo insecto',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN29', numero: 62, codigo: 'MSN29',
    titulo: 'Proteína local vs proteína importada',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN30', numero: 63, codigo: 'MSN30',
    titulo: 'Ya hay harina de larva para humanos',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN31', numero: 64, codigo: 'MSN31',
    titulo: 'El 80% de las granjas de insectos en Europa ya usan soldado negra',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN32', numero: 65, codigo: 'MSN32',
    titulo: 'La industria de insectos mueve miles de millones',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN33', numero: 66, codigo: 'MSN33',
    titulo: 'Una granja en tu patio puede reemplazar el concentrado',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN34', numero: 67, codigo: 'MSN34',
    titulo: 'La quitina: el subproducto que nadie está aprovechando',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN35', numero: 68, codigo: 'MSN35',
    titulo: 'El 59% de la inversión en insectos va a la soldado negra',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Negocio y Oportunidad', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── MSN — ÁNGULOS CULTURALES Y EMOCIONALES (MSN36-MSN40) ──────
  {
    id: 'MSN36', numero: 69, codigo: 'MSN36',
    titulo: 'Huele a chicharrón — los animales enloquecen',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Ángulos Culturales y Emocionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN37', numero: 70, codigo: 'MSN37',
    titulo: 'Como la hormiga culona, pero en industrial',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Ángulos Culturales y Emocionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN38', numero: 71, codigo: 'MSN38',
    titulo: 'Procesos \'verdes\' que también contaminan — la soldado negra no',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Ángulos Culturales y Emocionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN39', numero: 72, codigo: 'MSN39',
    titulo: 'El productor que empezó antes ya lleva ventaja',
    tipo: 'MSN', pilar: 'El Productor Soberano', bloque: 'Ángulos Culturales y Emocionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN40', numero: 73, codigo: 'MSN40',
    titulo: '¿Por qué no se enseña esto en las universidades agro?',
    tipo: 'MSN', pilar: 'El Productor Soberano', bloque: 'Ángulos Culturales y Emocionales', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'problema',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },

  // ─── MSN — DATOS CIENTÍFICOS SORPRENDENTES (MSN41-MSN50) ───────
  {
    id: 'MSN41', numero: 74, codigo: 'MSN41',
    titulo: 'Come más del 50% de su peso cada día',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN42', numero: 75, codigo: 'MSN42',
    titulo: 'Degrada antibióticos del estiércol',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN43', numero: 76, codigo: 'MSN43',
    titulo: 'Su quitosano inhibe bacterias patógenas',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN44', numero: 77, codigo: 'MSN44',
    titulo: 'Se autocosecha — sale sola del compostador',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN45', numero: 78, codigo: 'MSN45',
    titulo: 'Está presente en África y podría resolver el hambre',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN46', numero: 79, codigo: 'MSN46',
    titulo: 'Su sistema digestivo sanitiza todo',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN47', numero: 80, codigo: 'MSN47',
    titulo: 'Resiste condiciones extremas',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN48', numero: 81, codigo: 'MSN48',
    titulo: 'Todas sus etapas se venden',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN49', numero: 82, codigo: 'MSN49',
    titulo: 'Reduce el 79% del volumen de residuos en 15 días',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 1, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
  {
    id: 'MSN50', numero: 83, codigo: 'MSN50',
    titulo: 'El insecto que ya eligió el dinero inteligente',
    tipo: 'MSN', pilar: 'El Sistema BSF', bloque: 'Datos Científicos Sorprendentes', estado: 'GUIONIZADO',
    duracion: '~45s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'], contenido: '',
  },
]
