-- ═══════════════════════════════════════════════════
-- ESCUELA — Media prioridad: Reactions + Cohorte
-- Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════

-- 1. Reactions en el foro (agrega tipo a foro_likes)
ALTER TABLE foro_likes ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'heart';

-- 2. Campo para marcar qué socios están en el programa Colonia
ALTER TABLE socios ADD COLUMN IF NOT EXISTS en_colonia boolean DEFAULT false;
