-- Leads capturados desde la Calculadora BSF
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL DEFAULT '',
  whatsapp    TEXT NOT NULL DEFAULT '',
  fuente      TEXT NOT NULL DEFAULT 'calculadora',
  especie     TEXT DEFAULT '',
  n_animales  INTEGER DEFAULT 0,
  perdida_cop INTEGER DEFAULT 0,
  tipo_cta    TEXT DEFAULT '',
  creado_en   TIMESTAMPTZ DEFAULT NOW(),
  -- datos del lote que el productor ajusta en la calculadora (ver leads-datos-lote.sql)
  precio_bulto      INTEGER DEFAULT 0,
  bulto_kg          INTEGER DEFAULT 0,
  dias_ciclo        INTEGER DEFAULT 0,
  precio_venta      INTEGER DEFAULT 0,
  mortalidad        NUMERIC DEFAULT 0,
  pct_bsf           INTEGER DEFAULT 0,
  perdida_anual_cop BIGINT  DEFAULT 0,
  datos_ajustados   BOOLEAN DEFAULT false
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon full access" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
