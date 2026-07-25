-- Registro de ventas del Kit ProLarva
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS ventas (
  id        TEXT PRIMARY KEY,
  fecha     TEXT NOT NULL,
  cliente   TEXT NOT NULL,
  producto  TEXT NOT NULL DEFAULT 'Kit ProLarva 25/15',
  monto     INTEGER NOT NULL DEFAULT 350000,
  canal     TEXT DEFAULT 'WhatsApp',
  notas     TEXT DEFAULT '',
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon full access" ON ventas FOR ALL TO anon USING (true) WITH CHECK (true);
