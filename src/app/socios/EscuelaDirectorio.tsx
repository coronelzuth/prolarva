'use client';
import type { SocioColonia } from '@/hooks/useEscuela';
import { S, btnOutline } from './_escuela_shared';

interface EscuelaDirectorioProps {
  sociosColonia: SocioColonia[];
  asAdmin: boolean;
  toggleColonia: (code: string, enColonia: boolean) => void;
}

export function EscuelaDirectorio({ sociosColonia, asAdmin, toggleColonia }: EscuelaDirectorioProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>👥 Directorio de la cohorte</h2>
          <p style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Conoce a tus compañeros del Programa Colonia.</p>
        </div>
      </div>

      {sociosColonia.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: S.muted }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>👥</div>
          <p style={{ fontSize: 14 }}>No hay socios registrados aún.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {sociosColonia
            .filter(s => asAdmin || (s.en_colonia && s.mostrar_directorio !== false))
            .map(s => (
            <div key={s.code} style={{ background: s.en_colonia ? 'rgba(34,197,94,0.05)' : S.navy2, border: `1px solid ${s.en_colonia ? 'rgba(34,197,94,0.25)' : S.border}`, borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.en_colonia ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#334155,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16, flexShrink: 0 }}>
                  {s.nombre[0]?.toUpperCase() ?? '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nombre}</div>
                  {(s.tipo_produccion || s.ubicacion) && (
                    <div style={{ fontSize: 10, color: S.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[s.tipo_produccion, s.ubicacion].filter(Boolean).join(' · ')}
                    </div>
                  )}
                  {!(s.tipo_produccion || s.ubicacion) && (
                    <div style={{ fontSize: 10, color: S.muted }}>@{s.code}</div>
                  )}
                </div>
              </div>
              {/* Links sociales */}
              {(s.whatsapp_pub || s.instagram || s.tiktok) && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {s.whatsapp_pub && (
                    <a href={`https://wa.me/${s.whatsapp_pub.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 16, lineHeight: 1, textDecoration: 'none' }} title="WhatsApp">💬</a>
                  )}
                  {s.instagram && (
                    <a href={`https://instagram.com/${s.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 16, lineHeight: 1, textDecoration: 'none' }} title="Instagram">📷</a>
                  )}
                  {s.tiktok && (
                    <a href={`https://tiktok.com/@${s.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 16, lineHeight: 1, textDecoration: 'none' }} title="TikTok">🎵</a>
                  )}
                </div>
              )}
              {s.en_colonia && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 10px', fontSize: 10, color: S.green, fontWeight: 700 }}>
                  ✓ En el programa
                </div>
              )}
              {asAdmin && (
                <button
                  onClick={() => toggleColonia(s.code, !s.en_colonia)}
                  style={{ ...btnOutline, fontSize: 11, padding: '5px 10px', color: s.en_colonia ? S.red : S.green2, borderColor: s.en_colonia ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }}
                >
                  {s.en_colonia ? '✕ Retirar' : '+ Inscribir'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
