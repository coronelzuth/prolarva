'use client';
import { BSF_STAGES, daysSince, getStageLote, cosechaEstado, type Lote } from '@/hooks/useSocios';
import { S, cardStyle, btnOutline, btnSm, btnDanger, Badge, fmtDate } from './_shared';

// ─── Stepper de las 5 etapas del ciclo — mismo lenguaje visual en todos lados ──

export function StageStepper({ idx, size = 'md' }: { idx: number; size?: 'sm' | 'md' }) {
  const icon = size === 'sm' ? 11 : 13;
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {BSF_STAGES.map((s, i) => {
        const done = i < idx;
        const now  = i === idx;
        return (
          <div key={s.key} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: 4, borderRadius: 2, marginBottom: size === 'sm' ? 2 : 4,
              background: done ? S.emerald : now ? S.green : 'rgba(148,163,184,0.15)',
            }} />
            <div style={{ fontSize: icon, opacity: now ? 1 : done ? 0.55 : 0.3, filter: now ? 'none' : 'grayscale(0.4)' }}>{s.icon}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tarjeta de lote — la usa la lista del Monitor (con footer Ver/Eliminar) ───

export default function LoteCard({ lote: l, onView, onDelete }: {
  lote: Lote;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const d      = daysSince(l.fecha);
  const stage  = getStageLote(l);
  const estado = cosechaEstado(l);

  const badge = estado === 'listo'
    ? <Badge color="green">✅ Listo</Badge>
    : estado === 'vencido'
    ? <Badge color="red">Vencido</Badge>
    : estado === 'proximo'
    ? <Badge color="amber">Pronto</Badge>
    : <Badge color="blue">En curso</Badge>;

  return (
    <div
      onClick={() => onView(l.id)}
      style={{ ...cardStyle, padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <strong style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{l.nombre}</strong>
        {badge}
      </div>

      <div style={{ fontSize: 12, color: S.muted, marginTop: -4 }}>
        Sembrado {fmtDate(l.fecha)} · <span style={{ color: S.green2, fontWeight: 700 }}>Día {d}</span>
      </div>

      <StageStepper idx={stage.idx} />

      <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>
        {stage.icon} {stage.name}
        <span style={{ color: S.muted, fontWeight: 500 }}> · etapa {stage.idx + 1} de {BSF_STAGES.length}</span>
      </div>

      {onDelete && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderTop: `1px solid ${S.border}`, paddingTop: 12 }}>
          <span style={{ fontSize: 11, color: S.muted }}>{l.sustrato ? `${l.sustrato} kg de sustrato` : 'Sin sustrato'}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ ...btnOutline, ...btnSm }} onClick={e => { e.stopPropagation(); onView(l.id); }}>Ver</button>
            <button style={btnDanger} onClick={e => { e.stopPropagation(); if (confirm('¿Eliminar este lote?')) onDelete(l.id); }}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
}
