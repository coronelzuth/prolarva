-- Campos de perfil público en la tabla socios
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE socios ADD COLUMN IF NOT EXISTS ubicacion TEXT;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS tipo_produccion TEXT;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS whatsapp_pub TEXT;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE socios ADD COLUMN IF NOT EXISTS mostrar_directorio BOOLEAN DEFAULT true;
