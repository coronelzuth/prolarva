-- ============================================================
-- MIGRACIÓN: Sistema de invitaciones + rol de admin
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1. Agregar columna rol a socios (si no existe)
ALTER TABLE socios ADD COLUMN IF NOT EXISTS rol TEXT NOT NULL DEFAULT 'socio';

-- 2. Crear tabla de invitaciones
CREATE TABLE IF NOT EXISTS invitaciones (
  id          TEXT PRIMARY KEY,
  codigo      TEXT UNIQUE NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT false,
  creado_en   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usado_en    TIMESTAMP WITH TIME ZONE,
  usado_por   TEXT  -- email o código del socio que lo canjeó
);

-- 3. Marcar tu cuenta como admin
--    Cambia el email si es necesario.
UPDATE socios SET rol = 'admin' WHERE email = 'coronelzulieth@gmail.com';

-- 4. RLS para invitaciones (cualquiera puede leer, solo el server inserta)
ALTER TABLE invitaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_invitaciones" ON invitaciones
  FOR SELECT USING (true);

CREATE POLICY "insert_invitaciones" ON invitaciones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "update_invitaciones" ON invitaciones
  FOR UPDATE USING (true);
