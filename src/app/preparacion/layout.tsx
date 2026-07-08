import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¿Estás listo para empezar? Diagnóstico BSF — ProLarva',
  description: 'Quiz de diagnóstico para saber si tienes todo listo para tu primer ciclo BSF. Espacio, temperatura, sustrato y más — en 5 preguntas.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
