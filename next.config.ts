import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Landing legacy eliminada 2026-08-29 — redirige a la landing actual del Kit
      { source: "/sistema-2015", destination: "/kit", permanent: true },
    ];
  },
};

export default nextConfig;
