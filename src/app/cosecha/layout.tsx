import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía de Cría y Cosecha BSF — Del Huevo a la Larva | ProLarva',
  description: 'Guía práctica paso a paso: consigue la semilla, prepara la cuna, maneja la eclosión y cosecha tus larvas BSF en 18 días.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
