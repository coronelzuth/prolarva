'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';

const navLinks = [
  { href: '/',            label: 'Inicio',       icon: '🏠' },
  { href: '/conocimiento',label: 'Conocimiento',  icon: '🧠' },
  { href: '/preparacion', label: 'Preparación',   icon: '🛠️' },
  { href: '/metas',       label: 'Mi Meta',       icon: '🎯' },
  { href: '/calculadora', label: 'Calculadora',   icon: '🧮' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { progress, overallPercent } = useProgress();

  const isSocios = pathname.startsWith('/socios');

  return (
    <nav style={{ background: 'rgba(13,27,42,0.95)', borderBottom: '1px solid rgba(14,165,233,0.2)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🪲</span>
          <span style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ProLarva
          </span>
          <span style={{ color: '#64748b', fontSize: 13, fontWeight: 500, marginLeft: 2 }}>Monitor</span>
        </Link>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navLinks.map(link => {
            const active = pathname === link.href;
            const isCompleted = link.href !== '/' && link.href !== '/calculadora' && progress.modulesCompleted.includes(link.href.replace('/', ''));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.15s',
                  background: active ? 'rgba(14,165,233,0.15)' : 'transparent',
                  color: active ? '#4ade80' : '#94a3b8',
                  border: active ? '1px solid rgba(14,165,233,0.4)' : '1px solid transparent',
                }}
              >
                <span>{link.icon}</span>
                <span style={{ display: 'none' }} className="sm-show">{link.label}</span>
                {isCompleted && <span style={{ fontSize: 10, color: '#10b981' }}>✓</span>}
              </Link>
            );
          })}

          {/* Zona de Socios */}
          <Link
            href="/socios"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 8, marginLeft: 8,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              background: isSocios
                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                : 'rgba(34,197,94,0.12)',
              color: isSocios ? '#fff' : '#4ade80',
              border: `1px solid ${isSocios ? 'transparent' : 'rgba(34,197,94,0.35)'}`,
              transition: 'all 0.15s',
            }}
          >
            <span>🔐</span>
            <span>Socios</span>
          </Link>
        </div>

        {overallPercent > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 80, height: 4, background: '#1e3050', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${overallPercent}%`, height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{overallPercent}%</span>
          </div>
        )}
      </div>
    </nav>
  );
}
