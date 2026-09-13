-- ============================================================
-- Contenido editable de las 3 lecciones del Mini-Curso Tripwire
-- (antes vivía hardcodeado en src/app/arranca/page.tsx)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS tripwire_lecciones (
  n          INTEGER PRIMARY KEY CHECK (n IN (1, 2, 3)),
  titulo     TEXT NOT NULL,
  duracion   TEXT NOT NULL,
  video_url  TEXT NOT NULL DEFAULT '',
  disponible BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO tripwire_lecciones (n, titulo, duracion, video_url, disponible) VALUES
  (1, 'El ciclo y por qué esto es dinero',                 '6–8 min', '/fotos/tripwire-leccion-1.mp4', false),
  (2, 'Arma tu sistema mínimo sin ahogarla',                '6–8 min', '/fotos/tripwire-leccion-2.mp4', false),
  (3, 'Lo que viene — y por qué no deberías hacerlo solo',  '5–6 min', '/fotos/tripwire-leccion-3.mp4', false)
ON CONFLICT (n) DO NOTHING;

ALTER TABLE tripwire_lecciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_tripwire_lecciones"   ON tripwire_lecciones FOR SELECT USING (true);
CREATE POLICY "update_tripwire_lecciones" ON tripwire_lecciones FOR UPDATE USING (true);

GRANT SELECT, UPDATE ON TABLE tripwire_lecciones TO anon;
