-- ═══════════════════════════════════════════════════
-- ESCUELA — Alta prioridad: Tablón + Countdown + Tareas
-- Ejecutar en Supabase → SQL Editor
-- ═══════════════════════════════════════════════════

-- Configuración general (countdown de próxima clase)
CREATE TABLE IF NOT EXISTS config_escuela (
  clave          text PRIMARY KEY,
  valor          text NOT NULL,
  actualizado_en timestamptz DEFAULT now()
);

-- Tablón de anuncios (solo admin publica)
CREATE TABLE IF NOT EXISTS anuncios_escuela (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  socio_code   text NOT NULL,
  socio_nombre text NOT NULL,
  contenido    text NOT NULL CHECK (char_length(contenido) <= 600),
  fijado       boolean DEFAULT false,
  creado_en    timestamptz DEFAULT now()
);

-- Tareas semanales (admin define la pregunta)
CREATE TABLE IF NOT EXISTS tareas (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  semana    integer NOT NULL CHECK (semana BETWEEN 1 AND 4),
  pregunta  text NOT NULL,
  activa    boolean DEFAULT false,
  creado_en timestamptz DEFAULT now()
);

-- Entregas de tareas por socio
CREATE TABLE IF NOT EXISTS entregas_tareas (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tarea_id     uuid NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  socio_code   text NOT NULL,
  socio_nombre text NOT NULL,
  respuesta    text NOT NULL CHECK (char_length(respuesta) <= 1000),
  entregado_en timestamptz DEFAULT now(),
  UNIQUE(tarea_id, socio_code)
);

-- RLS
ALTER TABLE config_escuela   ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncios_escuela ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas_tareas  ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE config_escuela   TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE anuncios_escuela TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE tareas           TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE entregas_tareas  TO anon;

-- Políticas
CREATE POLICY "allow_all_config_escuela"   ON config_escuela   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_anuncios_escuela" ON anuncios_escuela FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tareas"           ON tareas           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_entregas_tareas"  ON entregas_tareas  FOR ALL USING (true) WITH CHECK (true);
