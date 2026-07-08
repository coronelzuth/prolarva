import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conocimiento General BSF — Ciclo de Vida y Etapas | ProLarva',
  description: 'Aprende el ciclo completo de la Mosca Soldado Negra: huevo, larva, prepupa y mosca. Guía visual por etapas para pequeños productores.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
