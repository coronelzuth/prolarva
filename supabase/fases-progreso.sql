-- Progreso de fases del Programa Colonia
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE socios ADD COLUMN IF NOT EXISTS fases_aprobadas INTEGER DEFAULT 0;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS fase_en_revision INTEGER DEFAULT 0;
