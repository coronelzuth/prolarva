-- ProLarva Monitor — Supabase Schema
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- 1. Progreso de módulos (por dispositivo)
CREATE TABLE IF NOT EXISTS user_progress (
  device_id       TEXT PRIMARY KEY,
  modules_visited TEXT[]  DEFAULT '{}',
  modules_completed TEXT[] DEFAULT '{}',
  quiz_answers    JSONB   DEFAULT '{}',
  quiz_completed  BOOLEAN DEFAULT FALSE,
  selected_meta   TEXT,
  stages_viewed   TEXT[]  DEFAULT '{}',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lotes de producción
CREATE TABLE IF NOT EXISTS lotes (
  id           TEXT PRIMARY KEY,
  socio_code   TEXT NOT NULL,
  nombre       TEXT NOT NULL,
  fecha        TEXT NOT NULL,
  sustrato     NUMERIC DEFAULT 0,
  tipo_sustrato TEXT DEFAULT '',
  huevos       TEXT DEFAULT '',
  temp         NUMERIC,
  notas        TEXT DEFAULT '',
  creado_en    TEXT NOT NULL,
  objetivo     TEXT DEFAULT 'cosechar'
);

-- 3. Registros de alimentación
CREATE TABLE IF NOT EXISTS feed_logs (
  id         TEXT PRIMARY KEY,
  lote_id    TEXT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  socio_code TEXT NOT NULL,
  fecha      TEXT NOT NULL,
  cantidad   NUMERIC NOT NULL,
  tipo       TEXT NOT NULL,
  rechazo    TEXT DEFAULT 'ninguno',
  notas      TEXT DEFAULT ''
);

-- 4. Cosechas
CREATE TABLE IF NOT EXISTS cosechas (
  id             TEXT PRIMARY KEY,
  lote_id        TEXT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  socio_code     TEXT NOT NULL,
  fecha          TEXT NOT NULL,
  peso           NUMERIC NOT NULL,
  sustrato_total NUMERIC DEFAULT 0,
  calidad        TEXT DEFAULT 'buena',
  notas          TEXT DEFAULT ''
);

-- 5. Socios (registro de usuarios de la comunidad)
CREATE TABLE IF NOT EXISTS socios (
  id             TEXT PRIMARY KEY,
  codigo         TEXT UNIQUE NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  nombre         TEXT NOT NULL,
  password       TEXT NOT NULL,
  estado         TEXT DEFAULT 'activo',
  creado_en      TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: permitir acceso anónimo completo (app pública)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosechas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE socios        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon full access" ON user_progress FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON lotes         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON feed_logs     FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON cosechas      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON socios        FOR ALL TO anon USING (true) WITH CHECK (true);
