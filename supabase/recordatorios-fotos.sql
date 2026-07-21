-- ============================================================
-- MIGRACIÓN: Recordatorios y Fotos por lote
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1. Recordatorios por lote
CREATE TABLE IF NOT EXISTS recordatorios (
  id          TEXT PRIMARY KEY,
  lote_id     TEXT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  socio_code  TEXT NOT NULL,
  dia         INTEGER NOT NULL,        -- día del ciclo en que se activa
  titulo      TEXT NOT NULL,
  completado  BOOLEAN NOT NULL DEFAULT false,
  creado_en   TEXT NOT NULL
);

ALTER TABLE recordatorios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon full access" ON recordatorios FOR ALL TO anon USING (true) WITH CHECK (true);

-- 2. Fotos por lote (base64 comprimido)
CREATE TABLE IF NOT EXISTS fotos_lotes (
  id          TEXT PRIMARY KEY,
  lote_id     TEXT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  socio_code  TEXT NOT NULL,
  data        TEXT NOT NULL,           -- base64 JPEG comprimido (~80KB)
  descripcion TEXT DEFAULT '',
  creado_en   TEXT NOT NULL
);

ALTER TABLE fotos_lotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon full access" ON fotos_lotes FOR ALL TO anon USING (true) WITH CHECK (true);
