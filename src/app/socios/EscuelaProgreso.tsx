'use client';
import type { Clase } from '@/hooks/useEscuela';
import { S } from './_escuela_shared';

interface AdminSocio {
  code: string;
  nombre: string;
  fases_aprobadas: number;
  fase_en_revision: number;
}

interface EscuelaProgresoProps {
  adminSocios: AdminSocio[];
  adminProgreso: { socio_code: string; clase_id: string }[];
  clases: Clase[];
  aprobando: string | null;
  setAprobando: (code: string | null) => void;
  onAprobFase?: (code: string, fase: number) => Promise<void>;
  setAdminSocios: React.Dispatch<React.SetStateAction<AdminSocio[]>>;
}

export function EscuelaProgreso({
  adminSocios, adminProgreso, clases,
  aprobando, setAprobando, onAprobFase, setAdminSocios,
}: EscuelaProgresoProps) {
  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>📊 Progreso de estudiantes</h2>

      {adminSocios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: S.muted }}>
          <div style={{ fontSize: '2rem', marginBottom: 10 }}>📊</div>
          <p>Cargando...</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estudiante
                </th>
                {clases.filter(c => c.activa).map(c => (
                  <th key={c.id} style={{ padding: '10px 8px', textAlign: 'center', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}`, fontSize: 10, whiteSpace: 'nowrap' }}>
                    S{c.semana}
                  </th>
                ))}
                <th style={{ padding: '10px 12px', textAlign: 'center', color: S.muted, fontWeight: 700, borderBottom: `1px solid ${S.border}` }}>
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {adminSocios.map(socio => {
                const activas = clases.filter(c => c.activa);
                const vis = activas.filter(c =>
                  adminProgreso.some(p => p.socio_code === socio.code && p.clase_id === c.id)
                ).length;
                const pct = activas.length > 0 ? Math.round((vis / activas.length) * 100) : 0;
                return (
                  <tr key={socio.code} style={{ borderBottom: `1px solid rgba(34,197,94,0.06)` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: S.text, fontSize: 13 }}>{socio.nombre}</div>
                      <div style={{ fontSize: 10, color: S.muted }}>{socio.code}</div>
                    </td>
                    {activas.map(c => {
                      const done = adminProgreso.some(p => p.socio_code === socio.code && p.clase_id === c.id);
                      return (
                        <td key={c.id} style={{ padding: '10px 8px', textAlign: 'center' }}>
                          <span style={{ fontSize: 14 }}>{done ? '✅' : '⬜'}</span>
                        </td>
                      );
                    })}
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: pct === 100 ? S.emerald : pct > 0 ? S.amber : S.muted }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Fases pendientes de aprobación */}
      {adminSocios.filter(s => s.fase_en_revision > 0).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: S.amber }}>
            ⏳ Fases pendientes de aprobación ({adminSocios.filter(s => s.fase_en_revision > 0).length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {adminSocios.filter(s => s.fase_en_revision > 0).map(socio => (
              <div key={socio.code} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 10, gap: 12,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: S.text }}>{socio.nombre}</div>
                  <div style={{ fontSize: 11, color: S.amber }}>Fase {socio.fase_en_revision} lista para revisar</div>
                </div>
                <button
                  disabled={aprobando === socio.code}
                  onClick={async () => {
                    setAprobando(socio.code);
                    await onAprobFase?.(socio.code, socio.fase_en_revision);
                    setAdminSocios(prev => prev.map(s => s.code === socio.code
                      ? { ...s, fases_aprobadas: socio.fase_en_revision, fase_en_revision: 0 }
                      : s
                    ));
                    setAprobando(null);
                  }}
                  style={{
                    background: aprobando === socio.code ? 'rgba(34,197,94,0.15)' : '#22c55e',
                    color: aprobando === socio.code ? S.muted : '#0d1b2a',
                    border: 'none', borderRadius: 8, padding: '7px 14px',
                    fontSize: 12, fontWeight: 700, cursor: aprobando === socio.code ? 'default' : 'pointer',
                    whiteSpace: 'nowrap', opacity: aprobando === socio.code ? 0.6 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {aprobando === socio.code ? 'Aprobando...' : `✅ Aprobar Fase ${socio.fase_en_revision}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
