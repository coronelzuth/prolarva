import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Landing legacy eliminada 2026-08-29 — redirige a la landing actual del Kit
      { source: "/sistema-2015", destination: "/kit", permanent: true },

      // 2026-09-03 — Conocimiento / Metas / Cosecha se unificaron en la Enciclopedia
      // (tab dentro de la Zona de Socios). Las URLs viejas apuntan a su sección.
      { source: "/conocimiento", destination: "/socios?v=enciclopedia&sec=ciclo", permanent: true },
      { source: "/metas",        destination: "/socios?v=enciclopedia&sec=rutas", permanent: true },
      { source: "/cosecha",      destination: "/socios?v=enciclopedia&sec=cria",  permanent: true },
    ];
  },
};

export default nextConfig;
