-- ============================================================
-- Mini-Curso Tripwire "Arranca tu Colonia BSF" — classroom /arranca
-- $19.900 COP, pago manual por Nequi, acceso por código (sin password)
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS tripwire_alumnos (
  id               TEXT PRIMARY KEY,
  codigo           TEXT UNIQUE NOT NULL,
  nombre           TEXT NOT NULL,
  whatsapp         TEXT,
  leccion1_vista   BOOLEAN NOT NULL DEFAULT false,
  leccion2_vista   BOOLEAN NOT NULL DEFAULT false,
  leccion3_vista   BOOLEAN NOT NULL DEFAULT false,
  -- true cuando ya canjeó el descuento de $19.900 al inscribirse al Curso Colonia
  colonia_canjeado BOOLEAN NOT NULL DEFAULT false,
  creado_en        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Todo el acceso real pasa por API routes con SUPABASE_SERVICE_ROLE_KEY
-- (igual que /api/socios/login e /api/invitaciones/*). GRANTS + policies de
-- abajo son el respaldo por si la app cae a la anon key (ver bug conocido de
-- RLS-solo-SELECT en el CLAUDE.md del hub).
ALTER TABLE tripwire_alumnos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_tripwire_alumnos"   ON tripwire_alumnos FOR SELECT USING (true);
CREATE POLICY "insert_tripwire_alumnos" ON tripwire_alumnos FOR INSERT WITH CHECK (true);
CREATE POLICY "update_tripwire_alumnos" ON tripwire_alumnos FOR UPDATE USING (true);

GRANT SELECT, INSERT, UPDATE ON TABLE tripwire_alumnos TO anon;
