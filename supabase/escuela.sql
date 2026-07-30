-- ═══════════════════════════════════════════════════
-- ESCUELA COLONIA — Tablas para el panel de aprendizaje
-- Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════

-- Clases del curso (4 semanas)
CREATE TABLE IF NOT EXISTS clases (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  semana      integer NOT NULL CHECK (semana BETWEEN 1 AND 4),
  orden       integer DEFAULT 1,
  titulo      text NOT NULL,
  descripcion text,
  url_video   text,
  activa      boolean DEFAULT false,
  creado_en   timestamptz DEFAULT now()
);

-- Progreso de cada socio por clase
CREATE TABLE IF NOT EXISTS progreso_clases (
  socio_code  text NOT NULL,
  clase_id    uuid NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
  completado  boolean DEFAULT true,
  visto_en    timestamptz DEFAULT now(),
  PRIMARY KEY (socio_code, clase_id)
);

-- Plantillas descargables por semana
CREATE TABLE IF NOT EXISTS plantillas (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  semana       integer NOT NULL CHECK (semana BETWEEN 1 AND 4),
  titulo       text NOT NULL,
  descripcion  text,
  url_archivo  text NOT NULL,
  tamano_aprox text,
  orden        integer DEFAULT 1,
  creado_en    timestamptz DEFAULT now()
);

-- Posts del foro
CREATE TABLE IF NOT EXISTS foro_posts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id    uuid REFERENCES foro_posts(id) ON DELETE CASCADE,
  socio_code   text NOT NULL,
  socio_nombre text NOT NULL,
  contenido    text NOT NULL CHECK (char_length(contenido) <= 500),
  creado_en    timestamptz DEFAULT now()
);

-- Migración: agregar respuestas a tabla existente
-- ALTER TABLE foro_posts ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES foro_posts(id) ON DELETE CASCADE;

-- Likes de posts del foro
CREATE TABLE IF NOT EXISTS foro_likes (
  post_id    uuid NOT NULL REFERENCES foro_posts(id) ON DELETE CASCADE,
  socio_code text NOT NULL,
  creado_en  timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, socio_code)
);

-- ── RLS ───────────────────────────────────────────────
ALTER TABLE clases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE progreso_clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantillas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE foro_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE foro_likes     ENABLE ROW LEVEL SECURITY;

-- Grants al rol anon
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE clases         TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE progreso_clases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE plantillas     TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE foro_posts     TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE foro_likes     TO anon;

-- Políticas permisivas (auth se maneja a nivel de app)
CREATE POLICY "allow_all_clases"          ON clases          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_progreso_clases" ON progreso_clases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_plantillas"      ON plantillas      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_foro_posts"      ON foro_posts      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_foro_likes"      ON foro_likes      FOR ALL USING (true) WITH CHECK (true);
