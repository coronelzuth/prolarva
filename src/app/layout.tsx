import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Larvi from '@/components/Larvi';
import WhatsApp from '@/components/WhatsApp';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'ProLarva Monitor',
  description: 'Tu ruta de aprendizaje para cultivar Mosca Soldado Negra (BSF)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body style={{ fontFamily: 'Montserrat, sans-serif', background: '#0d1b2a', color: '#e2e8f0', minHeight: '100vh' }}>
        <Navbar />
        <main>{children}</main>
        <Larvi />
        <WhatsApp />
      </body>
    </html>
  );
}
