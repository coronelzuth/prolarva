-- Tabla para el CMS de guiones ProLarva
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS guiones_cms (
  id              TEXT PRIMARY KEY,           -- 'V1', 'E3', 'MSN5', etc.
  numero          INTEGER NOT NULL,
  codigo          TEXT NOT NULL,
  titulo          TEXT NOT NULL,
  tipo            TEXT NOT NULL,              -- 'V', 'E', 'C', 'MSN'
  pilar           TEXT,
  bloque          TEXT,                       -- Solo para serie MSN
  estado          TEXT NOT NULL DEFAULT 'BORRADOR',
  duracion        TEXT,
  nc              INTEGER,                    -- Nivel de conciencia 1-4
  angulo          TEXT,                       -- 'problema', 'solucion', 'resultado'
  plataforma      TEXT[] DEFAULT ARRAY['TikTok', 'Instagram'],
  fecha_programada DATE,
  contenido       TEXT DEFAULT '',            -- Texto completo del guión
  notas           TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Política de acceso (ajustar según preferencia)
ALTER TABLE guiones_cms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso público lectura guiones"
  ON guiones_cms FOR SELECT USING (true);

CREATE POLICY "Acceso público escritura guiones"
  ON guiones_cms FOR ALL USING (true);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_guiones_tipo   ON guiones_cms (tipo);
CREATE INDEX IF NOT EXISTS idx_guiones_estado ON guiones_cms (estado);
CREATE INDEX IF NOT EXISTS idx_guiones_fecha  ON guiones_cms (fecha_programada);
