-- ProLarva Monitor — ajustes manuales del ciclo por lote
-- Ejecutar en Supabase → SQL Editor ANTES de desplegar la timeline vertical.
--
-- Guarda los ajustes que el socio hace a la estimación del ciclo desde el
-- detalle del lote (ej. "la larva entró a etapa madura el día 17, no el 15").
-- Formato: { "larvaM": 17, "prepupa": 25 }  (etapaKey -> día real de inicio)

ALTER TABLE lotes ADD COLUMN IF NOT EXISTS ajustes JSONB DEFAULT '{}'::jsonb;
