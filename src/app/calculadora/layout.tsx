import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora de Ahorro BSF — ¿Cuánto pierdes sin larva? | ProLarva',
  description: 'Calcula cuánto pierdes por ciclo en mortalidad y concentrado sin usar BSF. Ingresa tu especie y número de animales — resultado en 2 minutos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
