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

  // ─── RETO ROAD TO 1K ─────────────────────────────────────────
  {
    id: 'RETO13C', numero: 84, codigo: 'RETO13C',
    titulo: 'Trucos para mejorar tu producción de larva BSF (carrusel)',
    tipo: 'E', pilar: 'Educación con Gancho', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '7 slides', nc: 2, angulo: 'solucion',
    plataforma: ['Instagram'],
    contenido: `SLIDE 1 — PORTADA
"Trucos para mejorar tu producción de larva BSF" @prolarva.co

SLIDE 2 — TEMPERATURA
❌ ANTES: Módulo en un rincón frío y húmedo. Las larvas están pequeñas y casi no se mueven.
✅ DESPUÉS: Módulo en lugar cálido, entre 24 y 30°C. Las larvas crecen el doble de rápido.
Por qué funciona: el calor es el motor de la larva. Sin él, come poco y crece poco.

SLIDE 3 — MATERIA ORGÁNICA
❌ ANTES: Echaba los residuos enteros. La larva tardaba días en procesarlos.
✅ DESPUÉS: Los pico antes de echarlos. La larva los consume en horas.
Por qué funciona: más superficie expuesta = más come = más crece.

SLIDE 4 — RACIÓN A LOS ANIMALES
❌ ANTES: Le daba larva a ojo. El concentrado casi no bajaba.
✅ DESPUÉS: Mido la ración según el peso del animal. El concentrado bajó 25% en el primer ciclo.
Por qué funciona: sin la dosis correcta, el animal sigue dependiendo del concentrado.

SLIDE 5 — COSECHA
❌ ANTES: Cosechaba cuando "se veía que había bastante". Mezcla de larvas pequeñas y grandes.
✅ DESPUÉS: Cosecho entre el día 14 y 18 del ciclo. Larvas en el punto exacto de proteína.
Por qué funciona: la larva tiene un pico de proteína en esos días. Después prepupa y pierde valor.

SLIDE 6 — HUMEDAD
❌ ANTES: Echaba residuos muy líquidos. Olores fuertes y bichos no deseados.
✅ DESPUÉS: Escurro bien los residuos. El módulo huele neutro y las larvas están activas.
Por qué funciona: el exceso de líquido fermenta el sustrato y puede asfixiar las larvas.

SLIDE 7 — CTA
Guárdalo para tu próximo ciclo. ¿Cuál truco aplicarías?`,
    notas: 'DÍA 13 del Reto — versión CARRUSEL 7 slides. Archivo fuente: DIA-13-educacion-trucos-produccion-bsf.md',
  },
  {
    id: 'RETO13', numero: 85, codigo: 'RETO13',
    titulo: 'Trucos que cambiaron mi producción BSF',
    tipo: 'E', pilar: 'Educación con Gancho', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '40-52s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'],
    contenido: `GANCHO (0-3s): "Moví el módulo dos metros... y mi larva creció el doble."

CONTEXTO (3-8s): "Y no fue lo único que estaba haciendo mal — hay tres cosas que en verdad cambiaron todo. Y son más fáciles de lo que uno cree."

TRUCO 1 — Temperatura (8-20s): "Uno: el módulo estaba en un rincón frío y húmedo. Lo moví a donde la temperatura pegue entre 24 y 30 grados — y la larva se duplicó. Creeme. El calor es el motor — sin él, la larva te come poco y te crece poco."

TRUCO 2 — Ración medida (20-35s): "Dos: estaba echando la larva a ojo. No es echar un puño y ya. Empecé a medir la ración según el peso del animal — y el concentrado bajó 25% en el primer ciclo. Sin eso pues el animal sigue dependiendo del concentrado. Con la dosis exacta, no."

TRUCO 3 — Cosecha exacta (35-47s): "Tres: cosechaba cuando 'se veía que había bastante'. Naa, mentiras — hay un momento exacto. Entre el día 14 y el 18 es el pico de proteína. Después la larva prepupa y pierde valor. Empecé a llevar la fecha de siembra. Eso."

CTA (47-52s): "Si tú ya tienes BSF, pero aún así la larva no te está rindiendo — guarda esto. Y comenta cuál de los tres vas a cambiar primero."`,
    notas: 'DÍA 13 del Reto Road to 1K. Gancho evaluado 92/100. Formato reel 40-52s. Archivo fuente: DIA-13-educacion-reel-trucos-bsf.md',
  },
  {
    id: 'RETO14', numero: 86, codigo: 'RETO14',
    titulo: 'Malo / Bueno / Excelente para bajar el concentrado',
    tipo: 'E', pilar: 'Disrupción / Anti-consejo', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '52-58s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'],
    contenido: `GANCHO (0-4s): "Cambiar de concentrado es malo para bajar tus costos. Hacer concentrado casero es bueno. Producir tu propia proteína en el traspatio — eso sí es excelente."

MALO (4-18s): "Cambiar de marca: lo único que haces es mover el problema. Hoy sube uno, mañana sube el otro. Tu granja sigue dependiendo de lo que decida el mercado. No resuelves nada — solo postergás la angustia."

BUENO (18-33s): "El concentrado casero es mejor — compras maíz y soya directamente y bajas el costo. Pero si sube el maíz, tú también subes. Sigues atado a algo externo. Es un paso. Pero no es la salida."

EXCELENTE (33-48s): "Producir tu propia larva BSF en el traspatio: usas los residuos orgánicos de tu misma granja para criar la proteína que necesitan tus animales. El concentrado puede subir lo que quiera. A ti ya te importa menos. Eso es independencia real."

CTA (48-55s): "Comenta LARVA si quieres el paso a paso por DM."`,
    notas: 'DÍA 14 del Reto. Palabra clave CTA: LARVA. Archivo fuente: DIA-14-disrupcion-malo-bueno-excelente-concentrado.md',
  },
  {
    id: 'RETO15', numero: 87, codigo: 'RETO15',
    titulo: 'Lento vs. Rápido para bajar el concentrado',
    tipo: 'E', pilar: 'Disrupción / Anti-consejo', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '55-60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'],
    contenido: `GANCHO (0-4s): "Bajar el costo del concentrado en 2 años vs. en 20 días. Los dos son posibles — y la mayoría elige el largo sin darse cuenta."

LENTO (4-22s): "La forma lenta: cambias de marca, ajustas a ojo, buscas en YouTube soluciones para granjas industriales de otro país. Pasan meses. El costo sigue igual. No es falta de ganas — es que estás atacando el síntoma, no la causa."

RÁPIDO (22-42s): "La forma rápida: montas una colonia de larva BSF con un sistema probado para traspatio colombiano. En 20 días tienes tu primera cosecha. La proteína la produces tú, con residuos de tu misma granja. En el primer ciclo ya ves la diferencia — 25% menos concentrado. Documentado."

REENCUADRE (42-50s): "La diferencia no es cuánto tiempo llevas en esto. Es si tienes un sistema o no."

CTA (50-58s): "Sígueme para hacerlo de la forma rápida, no la lenta."`,
    notas: 'DÍA 15 del Reto. Archivo fuente: DIA-15-disrupcion-lento-vs-rapido-concentrado.md',
  },
  {
    id: 'RETO16', numero: 88, codigo: 'RETO16',
    titulo: 'Calculadora BSF + Monitor App: cómo usarlas juntas',
    tipo: 'E', pilar: 'Utilidad Práctica', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '55-60s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'],
    contenido: `GANCHO (0-4s): "Cómo usar la Calculadora BSF y la Monitor App juntas para saber exactamente cuánto estás ahorrando en concentrado."

HERRAMIENTA 1 (4-20s): "Primero: la Calculadora BSF — gratis, tarda 2 minutos. Metes cuántos animales tienes y te dice cuánto puedes bajar en concentrado produciendo larva BSF. Ese es tu número meta. El que tienes que llegar a superar."

HERRAMIENTA 2 (20-36s): "Después: la Monitor App — también gratis. Registras semana a semana cuánta larva produjiste, cuánto concentrado usaste y cómo van pesando los animales. Te muestra la curva real de tu granja — no una promesa, tu propio avance."

COMBINACIÓN (36-50s): "Juntas funcionan así: la Calculadora te dice adónde puedes llegar. La Monitor te dice si vas llegando. Si los números no coinciden, ya sabes qué ajustar — temperatura, ración, frecuencia de cosecha. Sin adivinar. Sin esperar a fin de mes para darte cuenta."

CTA (50-57s): "Combínalas tú: comenta SISTEMA y te guío por DM."`,
    notas: 'DÍA 16 del Reto. Palabra clave CTA: SISTEMA. Herramientas: prolarva-calculadora.vercel.app + prolarva-monitor.vercel.app. Archivo fuente: DIA-16-educacion-calculadora-monitor-app-bsf.md',
  },
  {
    id: 'RETO17C', numero: 89, codigo: 'RETO17C',
    titulo: 'Todo sobre la larva BSF antes de usarla (carrusel)',
    tipo: 'E', pilar: 'Utilidad Práctica', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '7 slides', nc: 2, angulo: 'solucion',
    plataforma: ['Instagram'],
    contenido: `SLIDE 1 — PORTADA
"Todo lo que debes saber sobre la larva BSF antes de usarla en tu granja" @prolarva.co

SLIDE 2 — ¿CUÁNDO TIENE SENTIDO USARLA?
La larva BSF aporta más valor cuando tienes gallinas, cerdos o peces de traspatio, el concentrado es tu mayor gasto, quieres bajar costos sin bajar calidad nutricional, y tienes residuos orgánicos disponibles.

SLIDE 3 — LARVA VIVA
Para qué: alimentar directamente a tus animales.
Beneficios: hasta 40% de proteína, activa el instinto de caza, mejora peso y color.
Cuándo: cosechar entre el día 14 y 18 y dar de inmediato.
Precaución: no refrigerar — pierde movimiento y los animales la rechazan.

SLIDE 4 — LARVA SECA
Para qué: almacenar cuando no tienes cosecha fresca.
Beneficios: más fácil de manejar, menos olor, se guarda varios días.
Precaución: pierde proteína vs la viva — úsala como complemento.

SLIDE 5 — HARINA DE LARVA
Para qué: mezclar con el concentrado en proporciones definidas.
Beneficios: fácil de dosificar, se integra al alimento que ya usas.
Precaución: requiere secar y moler bien. Para traspatio pequeño, la larva viva es más práctica.

SLIDE 6 — MITOS Y ERRORES COMUNES
❌ "A mis animales no les gusta" → casi siempre es porque la dieron muerta o fría.
❌ "Es asqueroso manejarla" → cuando ves el resultado, ese pensamiento desaparece solo.
❌ "Es muy difícil de producir" → con el sistema correcto son 10 minutos al día.

SLIDE 7 — RECOMENDACIÓN + CTA
Si tienes traspatio con gallinas, cerdos o peces: la larva viva es tu mejor punto de entrada. Guárdalo. Y si te sirvió, mándaselo a alguien que lo necesita.`,
    notas: 'DÍA 17 del Reto — versión CARRUSEL 7 slides. Archivo fuente: DIA-17-educacion-todo-sobre-larva-bsf.md',
  },
  {
    id: 'RETO17', numero: 90, codigo: 'RETO17',
    titulo: 'Los errores que todos cometen al dar larva BSF',
    tipo: 'E', pilar: 'Disrupción / Revelación', bloque: 'Reto Road to 1K', estado: 'GUIONIZADO',
    duracion: '42-52s', nc: 2, angulo: 'solucion',
    plataforma: ['TikTok', 'Instagram'],
    contenido: `GANCHO (0-3s): "Le di larva BSF a mis gallinas y 'no les gustó'. El problema no era la larva."

CONTEXTO (3-7s): "Hay tres errores que casi todos cometen al empezar con BSF — y ninguno tiene que ver con la larva en sí."

ERROR 1 — La larva muerta (7-18s): "Uno: le dieron la larva muerta o fría. La larva viva se mueve — eso activa el instinto de caza del animal. Si la diste quieta o refrigerada, el animal no la reconoce como comida. Viva y fresca: historia diferente."

ERROR 2 — Cosechar sin fecha (18-32s): "Dos: esperaban a cosechar cuando 'se veía que había bastante'. La larva tiene su pico de proteína entre el día 14 y el 18. Después ya prepupa y pierde valor. Sin llevar la fecha, dizque toda esa proteína se les fue."

ERROR 3 — Sin sistema (32-44s): "Tres: empezaron sin sistema. No es cuestión de ganas — es que sin un protocolo claro, uno no sabe qué está fallando. Con el sistema correcto son 10 minutos al día. El problema nunca fue la larva."

CTA (44-52s): "Si tú ya tienes BSF, pero aún así la larva no te está rindiendo — guarda esto. Y comenta cuál de los tres cometiste al principio."`,
    notas: 'DÍA 17 del Reto — versión REEL. Gancho F1+Dolor. Adaptado del carrusel DIA-17. Archivo fuente: DIA-17-educacion-reel-mitos-larva-bsf.md',
  },
]
