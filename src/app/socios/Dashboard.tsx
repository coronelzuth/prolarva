'use client';
import { useState } from 'react';
import { daysSince, getStage, type Lote, type FeedLog, type Cosecha, type Recordatorio } from '@/hooks/useSocios';
import { S, cardStyle, btnOutline, btnSm, btnPrimary, btnDanger, EmptyState, ProgressBar, FeedEntry, CosechaEntry, type View } from './_shared';

function Dashboard({ lotes, feeds, cosechas, activeLotes, readyLotes, recordatorios, totalKg, avgConv, userName, anuncio, sinEmail, onViewLote, onNav, onVerProtocolo }: {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  activeLotes: Lote[]; readyLotes: Lote[]; recordatorios: Recordatorio[];
  totalKg: number; avgConv: number | null; userName: string;
  anuncio?: string | null;
  sinEmail?: boolean;
  onViewLote: (id: string) => void; onNav: (v: View) => void;
  onVerProtocolo?: () => void;
}) {
  const statCard = (num: string, label: string, accent: string) => (
    <div style={{ ...cardStyle }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent }}>{num}</div>
      <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  );

  // Clasificar lotes por urgencia de cosecha
  const lotesVencidos  = lotes.filter(l => daysSince(l.fecha) > 28);
  const lotesUrgentes  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 28; });
  const lotesPróximos  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 18 && d < 22; });

  const [anuncioDismissed, setAnuncioDismissed] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>¡Hola, {userName.split(' ')[0]}! 🪲</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Resumen de tu producción BSF de hoy</p>
      </div>

      {/* Banner sin email */}
      {sinEmail && (
        <div onClick={() => onNav('perfil')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.4)', marginBottom: 16, cursor: 'pointer' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>📧</span>
          <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
            <strong style={{ color: S.amber }}>Agrega tu email</strong> para poder recuperar tu contraseña si la olvidas. Toca aquí para ir a tu Perfil.
          </div>
          <span style={{ color: S.amber, fontSize: 16, flexShrink: 0 }}>→</span>
        </div>
      )}

      {/* Banner de anuncio admin */}
      {anuncio && !anuncioDismissed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(56,189,248,0.08)', border: '1.5px solid rgba(56,189,248,0.3)', marginBottom: 16 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>📌</span>
          <div style={{ flex: 1, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{anuncio}</div>
          <button onClick={() => setAnuncioDismissed(true)} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 16, flexShrink: 0, padding: 4 }}>✕</button>
        </div>
      )}

      {/* Sin lotes todavía — el socio está en la etapa de clases */}
      {lotes.length === 0 && (
        <div
          onClick={() => onNav('escuela')}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.04) 100%)', border: '1.5px solid rgba(34,197,94,0.35)', marginBottom: 20, cursor: 'pointer' }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🎓</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: S.green2, marginBottom: 3 }}>Tu programa arranca en la Escuela</div>
            <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.5 }}>
              Mira el cronograma de las 5 semanas y la próxima clase en vivo. Cuando empieces a criar tus larvas, aquí verás las alertas de cada lote.
            </div>
          </div>
          <div style={{ fontSize: 18, color: S.green, flexShrink: 0 }}>→</div>
        </div>
      )}

      {/* Notificaciones — vencidos primero */}
      {lotesVencidos.map(l => {
        const d = daysSince(l.fecha);
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.red }}>{l.nombre} — ¡Ventana de cosecha vencida!</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} — ya pasaron los 28 días óptimos. Las larvas se están encapando.</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onViewLote(l.id); }} style={{ ...btnDanger, flexShrink: 0, fontSize: 11 }}>Registrar igual</button>
          </div>
        );
      })}

      {lotesUrgentes.map(l => {
        const d = daysSince(l.fecha);
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.09)', border: '1.5px solid rgba(16,185,129,0.4)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>⚖️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.green2 }}>{l.nombre} — ¡Lista para cosechar!</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} de 28 — estás en la ventana óptima. No esperes más.</div>
            </div>
            <button onClick={e => { e.stopPropagation(); onViewLote(l.id); }} style={{ ...btnPrimary, ...btnSm, flexShrink: 0, fontSize: 11 }}>Registrar cosecha</button>
          </div>
        );
      })}

      {lotesPróximos.map(l => {
        const d = daysSince(l.fecha);
        const diasRestantes = 22 - d;
        return (
          <div key={l.id} onClick={() => onViewLote(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>⏳</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: S.amber }}>{l.nombre} — Cosecha en {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Día {d} — prepárate. Alista tu colador, báscula y canastas.</div>
            </div>
          </div>
        );
      })}

      {/* Recordatorios — todos los pendientes */}
      {(() => {
        const acciones = recordatorios
          .filter(r => !r.completado)
          .map(r => {
            const lote = lotes.find(l => l.id === r.loteId);
            if (!lote) return null;
            const diff = r.dia - daysSince(lote.fecha);
            return { r, lote, diff };
          })
          .filter(Boolean)
          .sort((a, b) => a!.diff - b!.diff) as { r: Recordatorio; lote: Lote; diff: number }[];

        if (acciones.length === 0) return null;

        const urgentes  = acciones.filter(a => a.diff <= 0);
        const proximas  = acciones.filter(a => a.diff > 0);

        return (
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>📌 Recordatorios</div>

            {urgentes.length > 0 && (
              <div style={{ marginBottom: proximas.length > 0 ? 12 : 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Pendientes</div>
                {urgentes.map(({ r, lote, diff }) => (
                  <div key={r.id} onClick={() => onViewLote(lote.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: diff === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${diff === 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`, marginBottom: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>📌</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titulo}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{lote.nombre}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: diff === 0 ? S.green : S.red }}>
                      {diff === 0 ? '¡Hoy!' : `Hace ${Math.abs(diff)}d`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {proximas.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Próximas</div>
                {proximas.map(({ r, lote, diff }) => (
                  <div key={r.id} onClick={() => onViewLote(lote.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: S.navy2, border: `1px solid ${S.border}`, marginBottom: 6, cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>📌</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.titulo}</div>
                      <div style={{ fontSize: 11, color: S.muted }}>{lote.nombre}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: diff <= 3 ? S.amber : S.muted }}>
                      En {diff}d
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {statCard(String(activeLotes.length), 'Lotes activos', S.green)}
        {statCard(String(readyLotes.length),  'Listos para cosechar', S.emerald)}
        {statCard(totalKg.toFixed(1) + ' kg', 'Total cosechado', S.amber)}
        {statCard(avgConv ? avgConv.toFixed(1) + '%' : '—', 'Conversión promedio', '#38bdf8')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Lotes en curso</h3>
            <button style={{ ...btnOutline, ...btnSm }} onClick={() => onNav('monitor')}>Ver todos</button>
          </div>
          {activeLotes.length === 0 ? (
            <EmptyState icon="📦" text="No hay lotes activos todavía" />
          ) : (
            activeLotes.map(l => {
              const d = daysSince(l.fecha);
              const stage = getStage(d);
              const pct = Math.min(Math.round((d / 28) * 100), 100);
              return (
                <div key={l.id} onClick={() => onViewLote(l.id)} style={{ marginBottom: 10, padding: '10px 12px', background: S.navy2, borderRadius: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 13 }}>{l.nombre}</strong>
                    <span style={{ fontSize: 11, color: S.muted }}>Día {d} · {stage.icon} {stage.name}</span>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
              );
            })
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700 }}>Actividad reciente</h3>
            <button style={{ ...btnOutline, ...btnSm }} onClick={() => onNav('monitor')}>Ver mis lotes</button>
          </div>
          {feeds.length === 0 && cosechas.length === 0 ? (
            <EmptyState icon="🌿" text="Sin actividad registrada todavía" />
          ) : (() => {
            const items = [
              ...feeds.map(f => ({ type: 'feed' as const, fecha: f.fecha, data: f })),
              ...cosechas.map(c => ({ type: 'cosecha' as const, fecha: c.fecha, data: c })),
            ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3);
            return items.map(item =>
              item.type === 'feed'
                ? <FeedEntry key={`f-${item.data.id}`} feed={item.data as FeedLog} lotes={lotes} />
                : <CosechaEntry key={`c-${item.data.id}`} cosecha={item.data as Cosecha} lotes={lotes} />
            );
          })()}
        </div>
      </div>

      {/* ── Protocolo Anti-Crisis — tarjeta permanente ── */}
      {onVerProtocolo && (
        <div
          onClick={onVerProtocolo}
          style={{
            marginTop: 20,
            padding: '18px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 100%)',
            border: '1.5px solid rgba(245,158,11,0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
          }}>🛡️</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fde68a' }}>Protocolo Anti-Crisis BSF</span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#fbbf24',
                padding: '2px 7px', borderRadius: 20,
                flexShrink: 0,
              }}>BONO · $67 USD</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
              Diagnóstico inmediato para los 7 problemas críticos: temperatura, humedad, oviposición, mortalidad y más.
            </div>
          </div>
          <div style={{ fontSize: 18, color: '#f59e0b', flexShrink: 0 }}>→</div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
