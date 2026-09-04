'use client';
import type { DiaCronograma } from '@/hooks/useEscuela';
import { S, SEMANAS_INFO, esHoy } from './_escuela_shared';

interface EscuelaCronogramaProps {
  cronograma: DiaCronograma[];
  asAdmin: boolean;
  isAdmin: boolean;
  fasesAprobadas: number;
  faseEnRevision: number;
  // clic en una semana abre el FaseModal con todo el detalle
  setFaseMod: (fase: number | null) => void;
  // admin: agregar/editar un día del cronograma
  setEditDia: (dia: Partial<DiaCronograma> | undefined) => void;
  setModalDia: (open: boolean) => void;
}

export function EscuelaCronograma({
  cronograma, asAdmin, isAdmin, fasesAprobadas, faseEnRevision,
  setFaseMod, setEditDia, setModalDia,
}: EscuelaCronogramaProps) {
  const dias = cronograma.filter(d => d.activo || asAdmin);
  const hoyEnSemana = (s: number) => dias.some(d => d.semana === s && esHoy(d.fecha));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>📅 Cronograma del programa</h2>
        <p style={{ fontSize: 12, color: S.muted, margin: '4px 0 0' }}>5 semanas · haz clic en una semana para ver clases, plantillas y reflexión</p>
      </div>

      {/* Barra de progreso de semanas */}
      {!isAdmin && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            {[1, 2, 3, 4, 5].map(f => {
              const aprobada = f <= fasesAprobadas;
              const enRevision = f === faseEnRevision;
              return (
                <div key={f} style={{ flex: 1 }}>
                  <div style={{
                    height: 6, borderRadius: 3,
                    background: aprobada ? '#22c55e' : enRevision ? '#f59e0b' : 'rgba(148,163,184,0.2)',
                    transition: 'background 0.3s',
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: S.muted }}>
              {fasesAprobadas > 0
                ? `${fasesAprobadas}/5 semanas aprobadas`
                : 'Completa cada semana para avanzar'}
              {faseEnRevision > 0 && <span style={{ color: S.amber }}> · Semana {faseEnRevision} en revisión ⏳</span>}
            </div>
            {fasesAprobadas >= 3 && (
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>🔬 Monitor desbloqueado</div>
            )}
          </div>
        </div>
      )}

      <div className="crono-grid">
        {[1, 2, 3, 4, 5].map(s => {
          const info = SEMANAS_INFO[s - 1];
          const tieneHoy = hoyEnSemana(s);
          return (
            <div key={s} className="crono-col">
              <div
                onClick={() => setFaseMod(s)}
                style={{
                  background: tieneHoy ? 'rgba(34,197,94,0.13)' : 'rgba(34,197,94,0.06)',
                  border: `1px solid ${tieneHoy ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.18)'}`,
                  borderRadius: 10,
                  padding: '11px 14px',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 20 }}>{info.emoji}</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 900, color: S.green, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.2 }}>Semana {s}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: tieneHoy ? S.green2 : S.text, lineHeight: 1.3 }}>{info.title}</div>
                    <div style={{ fontSize: 10, color: S.green, marginTop: 2 }}>Ver detalles →</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {tieneHoy && <span style={{ fontSize: 9, fontWeight: 800, color: S.green, background: 'rgba(34,197,94,0.15)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.06em' }}>HOY</span>}
                  {asAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); setEditDia({ semana: s, tipo: 'clase', activo: true }); setModalDia(true); }}
                      title="Marcar una fecha de esta semana en el calendario"
                      style={{ background: 'none', border: '1px dashed rgba(34,197,94,0.3)', borderRadius: 5, color: S.muted, fontSize: 10, padding: '2px 7px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}
                    >
                      + fecha
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
