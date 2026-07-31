'use client';

import { usePathname } from 'next/navigation';
import Larvi from './Larvi';
import WhatsApp from './WhatsApp';
import PWAInstallBanner from './PWAInstallBanner';

export default function FloatingWidgets() {
  const path = usePathname();
  if (path === '/socios' || path === '/contenido') return null;
  return (
    <>
      <PWAInstallBanner />
      <Larvi />
      <WhatsApp />
    </>
  );
}
