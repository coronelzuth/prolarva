'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';

const navLinks = [
  { href: '/',            label: 'Inicio',       icon: '🏠' },
  { href: '/huevos',       label: 'Huevos BSF',    icon: '🥚' },
  { href: '/colonia',       label: 'Colonia',       icon: '🌱' },
  { href: '/calculadora', label: 'Calculadora',   icon: '🧮' },
  { href: '/blog',        label: 'Blog',           icon: '📖' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { progress } = useProgress();

  const isSocios = pathname.startsWith('/socios');

  if (isSocios) return null;

  return (
    <nav style={{ background: 'rgba(13,27,42,0.95)', borderBottom: '1px solid rgba(14,165,233,0.2)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, gap: 0, width: '100%' }}>
        <div className="nav-links-wrap" style={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
          {navLinks.map(link => {
            const active = pathname === link.href;
            const isCompleted = link.href !== '/' && link.href !== '/calculadora' && progress.modulesCompleted.includes(link.href.replace('/', ''));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.15s',
                  background: active ? 'rgba(14,165,233,0.15)' : 'transparent',
                  color: active ? '#4ade80' : '#94a3b8',
                  border: active ? '1px solid rgba(14,165,233,0.4)' : '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{link.icon}</span>
                <span className="nav-label">{link.label}</span>
                {isCompleted && <span style={{ fontSize: 10, color: '#10b981' }}>✓</span>}
              </Link>
            );
          })}

          {/* Zona de Socios */}
          <Link
            href="/socios"
            className="nav-socios-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, marginLeft: 6,
              textDecoration: 'none', fontSize: 13, fontWeight: 700,
              background: isSocios
                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                : 'rgba(34,197,94,0.12)',
              color: isSocios ? '#fff' : '#4ade80',
              border: `1px solid ${isSocios ? 'transparent' : 'rgba(34,197,94,0.35)'}`,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>🔐</span>
            <span className="nav-socios-txt">Socios</span>
          </Link>
        </div>
      </div>
      <style>{`
        .nav-label { display: none; }
        @media (min-width: 900px) { .nav-label { display: inline; } }
        @media (max-width: 599px) {
          .nav-links-wrap { flex: 1; justify-content: space-around; }
          .nav-link-item { flex: 1; justify-content: center; padding: 6px 4px !important; }
          .nav-socios-btn { flex: 1; justify-content: center; padding: 6px 4px !important; margin-left: 0 !important; }
          .nav-socios-txt { display: none; }
          .nav-progress { display: none !important; }
          .nav-monitor-txt { display: none; }
        }
      `}</style>
    </nav>
  );
}
