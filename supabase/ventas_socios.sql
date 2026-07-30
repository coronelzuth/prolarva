-- Ventas de larva/harina/abono registradas por cada socio
CREATE TABLE IF NOT EXISTS ventas_socios (
  id             text          PRIMARY KEY,
  socio_code     text          NOT NULL,
  fecha          date          NOT NULL,
  producto       text          NOT NULL,     -- 'larva' | 'harina' | 'abono'
  kg             numeric(10,2) NOT NULL,
  precio_cop_kg  integer       NOT NULL,
  total_cop      integer       NOT NULL,
  comprador      text          DEFAULT '',
  notas          text          DEFAULT '',
  creado_en      timestamptz   DEFAULT now()
);

ALTER TABLE ventas_socios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_ventas_socios"
  ON ventas_socios FOR ALL
  USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ventas_socios TO anon;
