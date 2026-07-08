'use client';

import { usePathname } from 'next/navigation';
import Larvi from './Larvi';
import WhatsApp from './WhatsApp';

export default function FloatingWidgets() {
  const path = usePathname();
  if (path === '/socios') return null;
  return (
    <>
      <Larvi />
      <WhatsApp />
    </>
  );
}
