-- ════════════════════════════════════════════════════════════════════════════
-- LEADS — campo "¿ya crías BSF?" + atribución por `origen` (palabra clave del video)
-- Ejecutar en Supabase → SQL Editor (idempotente, se puede correr varias veces)
-- ════════════════════════════════════════════════════════════════════════════
--
-- Contexto: Funnel Fase 3 (wiki/lead-magnet.md § "Captura de contacto — estado").
-- `ya_cria_bsf` segmenta el lead (nuevo vs. ya productor). `origen` guarda la
-- palabra clave del Reel/TikTok que trajo la visita (?origen=xxx en la URL),
-- para saber de qué video vino cada lead. Lo llenan la Calculadora y el botón
-- de captura reutilizable del blog (`LeadCapture.tsx`).

ALTER TABLE leads ADD COLUMN IF NOT EXISTS ya_cria_bsf TEXT DEFAULT '';  -- 'si' | 'no' | ''
ALTER TABLE leads ADD COLUMN IF NOT EXISTS origen      TEXT DEFAULT ''; -- palabra clave del video de origen

-- El servidor entra con service_role
GRANT ALL ON public.leads TO service_role;

-- Forzar recarga del schema cache de PostgREST
NOTIFY pgrst, 'reload schema';

-- Verificación: lista las columnas actuales
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;
