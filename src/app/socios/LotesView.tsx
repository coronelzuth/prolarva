'use client';
import { daysSince, getStage, type Lote, type FeedLog } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnOutline, btnSm, btnDanger, EmptyState, Badge, fmtDate } from './_shared';

function LotesView({ lotes, feeds, onViewLote, onNewLote, onDeleteLote }: {
  lotes: Lote[]; feeds: FeedLog[];
  onViewLote: (id: string) => void;
  onNewLote: () => void;
  onDeleteLote: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Mis Lotes BSF</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Seguimiento por etapa del ciclo de vida</p>
        </div>
        <button style={btnPrimary} onClick={onNewLote}>+ Nuevo lote</button>
      </div>
      <div style={cardStyle}>
        {lotes.length === 0 ? (
          <EmptyState icon="📦" text="No tienes lotes registrados. Crea el primero." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Lote','Inicio','Etapa actual','Días','Sustrato','Estado','Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: S.muted, borderBottom: `1px solid ${S.border}`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lotes.map(l => {
                  const d = daysSince(l.fecha);
                  const stage = getStage(d);
                  const ready = d >= 22 && d <= 32;
                  const past  = d > 32;
                  return (
                    <tr key={l.id} style={{ borderBottom: `1px solid rgba(34,197,94,0.07)` }}>
                      <td style={{ padding: '12px 12px', fontWeight: 700 }}>{l.nombre}</td>
                      <td style={{ padding: '12px 12px', color: S.muted }}>{fmtDate(l.fecha)}</td>
                      <td style={{ padding: '12px 12px' }}>{stage.icon} {stage.name}</td>
                      <td style={{ padding: '12px 12px', fontWeight: 700, color: S.green2 }}>Día {d}</td>
                      <td style={{ padding: '12px 12px', color: S.muted }}>{l.sustrato ? `${l.sustrato} kg` : '—'}</td>
                      <td style={{ padding: '12px 12px' }}>
                        {ready ? <Badge color="green">✅ Listo</Badge> : past ? <Badge color="gray">Finalizado</Badge> : <Badge color="blue">En curso</Badge>}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ ...btnOutline, ...btnSm }} onClick={() => onViewLote(l.id)}>Ver</button>
                          <button style={btnDanger} onClick={() => { if (confirm('¿Eliminar este lote?')) onDeleteLote(l.id); }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}