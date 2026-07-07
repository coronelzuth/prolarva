import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Larvi from '@/components/Larvi';
import WhatsApp from '@/components/WhatsApp';
import { Analytics } from '@vercel/analytics/react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'ProLarva Monitor',
  description: 'Tu ruta de aprendizaje completa para cultivar Mosca Soldado Negra (BSF). Desde cero hasta tu primera cosecha.',
  openGraph: {
    title: 'ProLarva Monitor 🪲',
    description: 'Aprendé a cultivar BSF y reducí tus costos de concentrado hasta un 50%. Ruta gratuita con Larvi.',
    url: 'https://prolarva-monitor.vercel.app',
    siteName: 'ProLarva Monitor',
    type: 'website',
    images: [{ url: 'https://prolarva-monitor.vercel.app/og-image.png', width: 1200, height: 630, alt: 'ProLarva Monitor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProLarva Monitor 🪲',
    description: 'Aprendé a cultivar BSF y reducí tus costos de concentrado.',
    images: ['https://prolarva-monitor.vercel.app/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body style={{ fontFamily: 'Montserrat, sans-serif', background: '#0d1b2a', color: '#e2e8f0', minHeight: '100vh' }}>
        <Navbar />
        <main>{children}</main>
        <Larvi />
        <WhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
