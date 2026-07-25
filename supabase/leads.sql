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
  creado_en   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon full access" ON leads FOR ALL TO anon USING (true) WITH CHECK (true);
