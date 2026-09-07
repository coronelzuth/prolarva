-- ════════════════════════════════════════════════════════════════════════════
-- LEADS — asegura TODAS las columnas + recarga el cache de PostgREST
-- Ejecutar en Supabase → SQL Editor (idempotente, se puede correr varias veces)
-- ════════════════════════════════════════════════════════════════════════════
--
-- Contexto: al guardar un lead desde la Calculadora, PostgREST devolvía
-- "Could not find the 'especie' column of 'leads' in the schema cache".
-- Suele ser cache desactualizado tras un ALTER TABLE. Este script vuelve a
-- declarar cada columna (no rompe si ya existe) y fuerza el reload del cache.

-- Columnas base (por si la tabla es más vieja que leads.sql actual)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS nombre      TEXT    NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS whatsapp    TEXT    NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fuente      TEXT    NOT NULL DEFAULT 'calculadora';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS especie     TEXT    DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS n_animales  INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS perdida_cop INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tipo_cta    TEXT    DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS creado_en   TIMESTAMPTZ DEFAULT NOW();

-- CRM (admin-migrations.sql)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS estado    TEXT DEFAULT 'nuevo';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notas_crm TEXT DEFAULT '';

-- Datos del lote que el productor ajusta en la Calculadora BSF
ALTER TABLE leads ADD COLUMN IF NOT EXISTS precio_bulto      INTEGER  DEFAULT 0;   -- COP por bulto de concentrado
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bulto_kg          INTEGER  DEFAULT 0;   -- kg por bulto
ALTER TABLE leads ADD COLUMN IF NOT EXISTS dias_ciclo        INTEGER  DEFAULT 0;   -- días del ciclo productivo
ALTER TABLE leads ADD COLUMN IF NOT EXISTS precio_venta      INTEGER  DEFAULT 0;   -- COP por animal en pie
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mortalidad        NUMERIC  DEFAULT 0;   -- % de mortalidad por ciclo
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pct_bsf           INTEGER  DEFAULT 0;   -- % de la dieta a reemplazar con BSF
ALTER TABLE leads ADD COLUMN IF NOT EXISTS perdida_anual_cop BIGINT   DEFAULT 0;   -- pérdida acumulada del año (COP)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS datos_ajustados   BOOLEAN  DEFAULT false; -- tocó el panel "Ajustar datos"

-- El servidor entra con service_role
GRANT ALL ON public.leads TO service_role;

-- Forzar recarga del schema cache de PostgREST
NOTIFY pgrst, 'reload schema';

-- Verificación: lista las columnas actuales
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;
