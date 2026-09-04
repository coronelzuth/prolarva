'use client';
import { type Lote, type FeedLog } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, EmptyState } from './_shared';
import LoteCard from './LoteCard';

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
          {lotes.map(l => (
            <LoteCard key={l.id} lote={l} onView={onViewLote} onDelete={onDeleteLote} />
          ))}
        </div>
      )}
    </div>
  );
}
export default LotesView;
