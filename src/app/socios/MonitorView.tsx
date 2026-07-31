'use client';
import { useState, useEffect } from 'react';
import { type Lote, type FeedLog, type Cosecha } from '@/hooks/useSocios';
import { S } from './_shared';
import LotesView from './LotesView';
import EstadisticasView from './EstadisticasView';

// ─── Monitor ─────────────────────────────────────────────────────────────────

const BENEFICIOS_MONITOR = [
  { icon: '📈', titulo: 'Rastreo de lotes en tiempo real', desc: 'Ve el estado exacto de cada bandeja día a día' },
  { icon: '📊', titulo: 'Estadísticas de conversión', desc: 'Mide tu tasa kg sustrato → kg larva cosechada' },
  { icon: '⚖️', titulo: 'Registro de cosechas', desc: 'Historial completo de pesaje y calidad por cosecha' },
  { icon: '📅', titulo: 'Calendario de actividades', desc: 'Alertas automáticas para alimentación y cosecha' },
  { icon: '💡', titulo: 'Análisis de rendimiento', desc: 'Descubre qué sustratos dan más kg en menos tiempo' },
];

function MonitorLocked({ fasesAprobadas }: { fasesAprobadas: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BENEFICIOS_MONITOR.length), 3500);
    return () => clearInterval(t);
  }, []);
  const b = BENEFICIOS_MONITOR[idx];
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🔬</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Monitor de Producción</h2>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 28, lineHeight: 1.6 }}>
        Tu herramienta de trazabilidad BSF. Se desbloquea al completar la Fase 3 del programa Colonia.
      </p>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {[1,2,3,4,5].map(f => (
            <div key={f} style={{ flex: 1 }}>
              <div style={{
                height: 8, borderRadius: 4,
                background: f <= fasesAprobadas ? '#22c55e' : 'rgba(148,163,184,0.12)',
                transition: 'background 0.3s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: S.muted }}>
          {fasesAprobadas}/5 fases completadas · se desbloquea en Fase 3
        </div>
      </div>
      <div style={{
        padding: '18px 20px', background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.15)', borderRadius: 14, marginBottom: 12,
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>{b.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{b.titulo}</div>
        <div style={{ fontSize: 12, color: S.muted }}>{b.desc}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        {BENEFICIOS_MONITOR.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: 6, height: 6, borderRadius: 3, cursor: 'pointer',
            background: i === idx ? '#22c55e' : 'rgba(148,163,184,0.3)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: S.muted }}>
        Completa las fases en Escuela para desbloquear esta sección
      </p>
    </div>
  );
}

function MonitorView({ fasesAprobadas, isAdmin, monitorSub, onSubChange, lotes, feeds, onViewLote, onNewLote, onDeleteLote, cosechas, totalKg, avgConv }: {
  fasesAprobadas: number; isAdmin: boolean;
  monitorSub: 'lotes' | 'stats'; onSubChange: (s: 'lotes' | 'stats') => void;
  lotes: Lote[]; feeds: FeedLog[];
  onViewLote: (id: string) => void; onNewLote: () => void; onDeleteLote: (id: string) => void;
  cosechas: Cosecha[]; totalKg: number; avgConv: number | null;
}) {
  const unlocked = fasesAprobadas >= 3 || isAdmin;
  if (!unlocked) return <MonitorLocked fasesAprobadas={fasesAprobadas} />;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>🔬 Monitor de Producción</h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['lotes', 'stats'] as const).map(s => (
            <button key={s} onClick={() => onSubChange(s)} style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: monitorSub === s ? '#22c55e' : 'rgba(148,163,184,0.1)',
              color: monitorSub === s ? '#0d1b2a' : S.muted,
            }}>
              {s === 'lotes' ? '📦 Lotes' : '📊 Estadísticas'}
            </button>
          ))}
        </div>
      </div>
      {monitorSub === 'lotes' && (
        <LotesView lotes={lotes} feeds={feeds} onViewLote={onViewLote} onNewLote={onNewLote} onDeleteLote={onDeleteLote} />
      )}
      {monitorSub === 'stats' && (
        <EstadisticasView lotes={lotes} feeds={feeds} cosechas={cosechas} totalKg={totalKg} avgConv={avgConv} />
      )}
    </div>
  );
}
