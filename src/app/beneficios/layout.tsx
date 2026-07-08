import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Por qué BSF? Beneficios de la Larva Soldado Negra — ProLarva',
  description: 'Composición nutricional de BSFL, beneficios para gallinas, cerdos y peces, y ventajas ambientales comprobadas. Datos reales para pequeños productores.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
