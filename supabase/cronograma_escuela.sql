-- Tabla: cronograma_dias
-- Días individuales del programa Colonia con actividades

CREATE TABLE IF NOT EXISTS cronograma_dias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha date NOT NULL,
  semana integer NOT NULL CHECK (semana BETWEEN 1 AND 4),
  tipo text NOT NULL CHECK (tipo IN ('clase', 'tarea', 'reporte', 'recurso', 'libre')),
  titulo text NOT NULL,
  descripcion text,
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  creado_en timestamptz DEFAULT now()
);

ALTER TABLE cronograma_dias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_anon_cronograma" ON cronograma_dias
  FOR ALL USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cronograma_dias TO anon;
