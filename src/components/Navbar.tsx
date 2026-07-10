'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';

const navLinks = [
  { href: '/',            label: 'Inicio',       icon: '🏠' },
  { href: '/landing',     label: 'ProLarva',     icon: '🚀' },
  { href: '/sistema-2015', label: 'Oferta',      icon: '💰' },
  { href: '/conocimiento',label: 'Conocimiento',  icon: '🧠' },
  { href: '/preparacion', label: 'Preparación',   icon: '🛠️' },
  { href: '/metas',       label: 'Mi Meta',       icon: '🎯' },
  { href: '/cosecha',     label: 'Cosecha',       icon: '🌾' },
  { href: '/calculadora', label: 'Calculadora',   icon: '🧮' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { progress, overallPercent } = useProgress();

  const isSocios = pathname.startsWith('/socios');

  return (
    <nav style={{ background: 'rgba(13,27,42,0.95)', borderBottom: '1px solid rgba(14,165,233,0.2)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 8 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 22 }}>🪲</span>
          <span style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ProLarva
          </span>
          <span className="nav-monitor-txt" style={{ color: '#64748b', fontSize: 13, fontWeight: 500, marginLeft: 2 }}>Monitor</span>
        </Link>

        <div className="nav-links-wrap" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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

        {overallPercent > 0 && (
          <div className="nav-progress" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 80, height: 4, background: '#1e3050', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: 2, transform: `scaleX(${overallPercent / 100})`, transformOrigin: 'left', transition: 'transform 0.4s' }} />
            </div>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{overallPercent}%</span>
          </div>
        )}
      </div>
      <style>{`
        .nav-label { display: none; }
        @media (min-width: 900px) { .nav-label { display: inline; } }
        @media (max-width: 599px) {
          .nav-links-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; flex: 1; }
          .nav-links-wrap::-webkit-scrollbar { display: none; }
          .nav-link-item { padding: 6px 8px !important; flex-shrink: 0; }
          .nav-socios-btn { padding: 6px 10px !important; margin-left: 2px !important; }
          .nav-socios-txt { display: none; }
          .nav-progress { display: none !important; }
          .nav-monitor-txt { display: none; }
        }
      `}</style>
    </nav>
  );
}
