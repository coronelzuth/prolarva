-- Migraciones del panel admin — ejecutar en Supabase → SQL Editor

-- 1. CRM en leads: estado + notas de seguimiento
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'nuevo';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notas_crm TEXT DEFAULT '';

-- 2. Tabla de anuncios para socios
CREATE TABLE IF NOT EXISTS anuncios (
  id        TEXT PRIMARY KEY,
  texto     TEXT NOT NULL,
  activo    BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
CREATE POLICY anuncios_anon_access ON anuncios FOR ALL TO anon USING (true) WITH CHECK (true);
