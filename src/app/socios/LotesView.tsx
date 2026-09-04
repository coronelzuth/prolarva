'use client';
import { BSF_STAGES, daysSince, getStageLote, type Lote, type FeedLog } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnOutline, btnSm, btnDanger, EmptyState, Badge, fmtDate } from './_shared';

function LotesView({ lotes, feeds, onViewLote, onNewLote, onDeleteLote }: {
  lotes: Lote[]; feeds: FeedLog[];
  onViewLote: (id: string) => void;
  onNewLote: () => void;
  onDeleteLote: (id: string) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Mis Lotes BSF</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Seguimiento por etapa del ciclo de vida</p>
        </div>
        <button style={btnPrimary} onClick={onNewLote}>+ Nuevo lote</button>
      </div>

      {lotes.length === 0 ? (
        <div style={cardStyle}>
          <EmptyState icon="📦" text="No tienes lotes registrados. Crea el primero." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {lotes.map(l => {
            const d       = daysSince(l.fecha);
            const stage   = getStageLote(l);
            const ready   = d >= 22 && d <= 32;
            const past    = d > 32;

            return (
              <div
                key={l.id}
                onClick={() => onViewLote(l.id)}
                style={{ ...cardStyle, padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {/* Título + estado */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <strong style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{l.nombre}</strong>
                  {ready ? <Badge color="green">✅ Listo</Badge> : past ? <Badge color="gray">Finalizado</Badge> : <Badge color="blue">En curso</Badge>}
                </div>

                {/* Fecha + día */}
                <div style={{ fontSize: 12, color: S.muted, marginTop: -4 }}>
                  Sembrado {fmtDate(l.fecha)} · <span style={{ color: S.green2, fontWeight: 700 }}>Día {d}</span>
                </div>

                {/* Mini stepper de etapas */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {BSF_STAGES.map((s, i) => {
                    const done = i < stage.idx;
                    const now  = i === stage.idx;
                    return (
                      <div key={s.key} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                          height: 4, borderRadius: 2, marginBottom: 4,
                          background: done ? S.emerald : now ? S.green : 'rgba(148,163,184,0.15)',
                        }} />
                        <div style={{ fontSize: 13, opacity: now ? 1 : done ? 0.55 : 0.3, filter: now ? 'none' : 'grayscale(0.4)' }}>{s.icon}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>
                  {stage.icon} {stage.name}
                  <span style={{ color: S.muted, fontWeight: 500 }}> · etapa {stage.idx + 1} de {BSF_STAGES.length}</span>
                </div>

                {/* Pie: sustrato + acciones */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderTop: `1px solid ${S.border}`, paddingTop: 12 }}>
                  <span style={{ fontSize: 11, color: S.muted }}>{l.sustrato ? `${l.sustrato} kg de sustrato` : 'Sin sustrato'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ ...btnOutline, ...btnSm }} onClick={e => { e.stopPropagation(); onViewLote(l.id); }}>Ver</button>
                    <button style={btnDanger} onClick={e => { e.stopPropagation(); if (confirm('¿Eliminar este lote?')) onDeleteLote(l.id); }}>Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default LotesView;
