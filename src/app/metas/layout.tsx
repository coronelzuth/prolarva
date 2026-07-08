import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elige tu Meta de Producción BSF — ProLarva',
  description: 'Alimentar animales, producir harina o ciclo cerrado. Elige tu ruta de producción BSF y accede a la guía paso a paso personalizada.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
