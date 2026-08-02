'use client';
import { S, btnOutline, type View } from './_shared';
import type { SocioSession } from '@/hooks/useSocios';

export const NAV_ITEMS: { key: View; icon: string; label: string }[] = [
  { key: 'dashboard', icon: '🏠', label: 'Resumen' },
  { key: 'escuela',   icon: '🎓', label: 'Escuela' },
  { key: 'monitor',   icon: '🔬', label: 'Monitor' },
  { key: 'ventas',    icon: '💰', label: 'Mis Ventas' },
  { key: 'perfil',    icon: '👤', label: 'Mi Perfil' },
];

const MOBILE_LABELS: Record<string, string> = {
  dashboard: 'Inicio', escuela: 'Escuela',
  monitor: 'Monitor', ventas: 'Ventas',
  perfil: 'Perfil', admin: 'Admin',
};

interface Props {
  session: SocioSession;
  sidebarAvatar: string | null;
  activeView: View;
  onNav: (v: View) => void;
  onLogout: () => void;
}

export default function SociosSidebar({ session, sidebarAvatar, activeView, onNav, onLogout }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="socios-sidebar" style={{ width: 220, background: S.navy2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', zIndex: 40 }}>
        <div style={{ padding: '20px 18px', borderBottom: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </div>
          <div style={{ fontSize: 10, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>ZONA DE SOCIOS</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV_ITEMS.map(item => {
            const active = activeView === item.key;
            return (
              <div id={`nav-${item.key}`} key={item.key} onClick={() => onNav(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: active ? S.green2 : S.muted, background: active ? 'rgba(34,197,94,0.1)' : 'transparent', borderRadius: active ? 8 : 0, transition: 'all 0.15s' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '14px 18px', borderTop: `1px solid ${S.border}` }}>
          <button onClick={() => onNav('perfil')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left' }}>
            {sidebarAvatar
              ? <img src={sidebarAvatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(34,197,94,0.4)', flexShrink: 0 }} />
              : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                  {session.name[0]}
                </div>
            }
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{session.name}</div>
              <div style={{ fontSize: 10, color: S.muted }}>{session.code}</div>
            </div>
          </button>
          <button onClick={onLogout} style={{ ...btnOutline, width: '100%', fontSize: 12, padding: '7px' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="socios-mobile-nav">
        {NAV_ITEMS.map(item => {
          const active = activeView === item.key;
          return (
            <div id={`m-nav-${item.key}`} key={item.key} onClick={() => onNav(item.key)} className={`socios-tab${active ? ' socios-tab-active' : ''}`}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{MOBILE_LABELS[item.key] ?? item.label}</span>
            </div>
          );
        })}
      </nav>

      <style>{`
        .socios-mobile-nav { display: none; }
        .socios-content { padding: 2rem; }
        @media (max-width: 768px) {
          .socios-wrap { display: block !important; }
          .socios-sidebar { display: none !important; }
          .socios-main { padding: 0 !important; }
          .socios-content { padding: 2rem 1rem 80px !important; }
          .socios-mobile-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: #0f1e30;
            border-top: 1px solid rgba(34,197,94,0.25);
            z-index: 100;
            padding: 6px 0 max(10px, env(safe-area-inset-bottom));
          }
          .socios-tab {
            flex: 1; min-width: 0;
            display: flex; flex-direction: column;
            align-items: center; gap: 2px;
            padding: 4px 2px; cursor: pointer;
            color: #64748b;
            font-family: Montserrat, sans-serif;
          }
          .socios-tab span:first-child { font-size: 18px; line-height: 1; }
          .socios-tab span:last-child { font-size: 8px; font-weight: 700; text-align: center; line-height: 1.2; white-space: nowrap; }
          .socios-tab-active { color: #4ade80 !important; }
        }
      `}</style>
    </>
  );
}
