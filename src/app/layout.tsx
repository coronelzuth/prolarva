import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import FloatingWidgets from '@/components/FloatingWidgets';
import { Analytics } from '@vercel/analytics/react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ProLarva',
  description: 'Tu ruta de aprendizaje completa para cultivar Mosca Soldado Negra (BSF). Desde cero hasta tu primera cosecha.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ProLarva' },
  verification: { google: '1fkZ-jLIru_ArMWJFqhHlXeqfyH7hSZ7X6X7TVB7Glc' },
  openGraph: {
    title: 'ProLarva 🪲',
    description: 'Aprendé a cultivar BSF y reducí tus costos de concentrado hasta un 50%. Ruta gratuita con Larvi.',
    url: 'https://prolarva-monitor.vercel.app',
    siteName: 'ProLarva',
    type: 'website',
    images: [{ url: 'https://prolarva-monitor.vercel.app/og-image.png', width: 1200, height: 630, alt: 'ProLarva' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProLarva 🪲',
    description: 'Aprendé a cultivar BSF y reducí tus costos de concentrado.',
    images: ['https://prolarva-monitor.vercel.app/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ fontFamily: 'Montserrat, sans-serif', background: '#0d1b2a', color: '#e2e8f0', minHeight: '100vh' }}>
        <Navbar />
        <main>{children}</main>
        <FloatingWidgets />
        <Analytics />
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
              .catch(e => console.warn('[SW]', e));
          }
        `}</Script>
      </body>
    </html>
  );
}
