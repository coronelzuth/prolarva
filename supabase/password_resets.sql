-- Tokens de un solo uso para recuperar contraseña (expiran en 1 hora)
CREATE TABLE IF NOT EXISTS password_resets (
  token       text        PRIMARY KEY,
  socio_code  text        NOT NULL,
  email       text        NOT NULL,
  expires_at  timestamptz NOT NULL,
  used        boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_password_resets"
  ON password_resets FOR ALL
  USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE password_resets TO anon;
