-- ═══════════════════════════════════════════════════
-- ESCUELA — Baja prioridad: Pin posts en el foro
-- Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════

ALTER TABLE foro_posts ADD COLUMN IF NOT EXISTS fijado boolean DEFAULT false;
