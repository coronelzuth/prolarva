import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProLarva — Reduce el concentrado 25% en 20 días con BSF',
  description: 'Sistema completo para producir tu propia proteína con larva BSF desde tu traspatio. Semilla viva + kit + app + acompañamiento. Resultados documentados desde el día 0.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
