'use client';
import { useState } from 'react';
import { type Lote, type FeedLog, type Cosecha, daysSince } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnOutline, btnSm, EmptyState, BarChart, LineChart, downloadCSV, generarImagenMes, fmtDate } from './_shared';

// ─── Estadísticas ────────────────────────────────────────────────────────────

function EstadisticasView({ lotes, feeds, cosechas, totalKg, avgConv }: {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  totalKg: number; avgConv: number | null;
}) {
  const [sharing, setSharing] = useState(false);

  const ahora = new Date();
  const mesKey = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  const mesLabel = ahora.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  // Kg por mes (últimos 6)
  const meses6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora.getFullYear(), ahora.getMonth() - 5 + i, 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '').slice(0, 3),
    };
  });
  const kgPorMes = meses6.map(m => ({
    label: m.label,
    value: cosechas.filter(c => c.fecha.startsWith(m.key)).reduce((a, c) => a + c.peso, 0),
  }));

  // Conversión histórica (últimas 8 con sustrato)
  const convData = cosechas
    .filter(c => c.sustratoTotal > 0)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-8)
    .map((c, i) => ({ label: `#${i + 1}`, value: (c.peso / c.sustratoTotal) * 100 }));

  // Ranking de lotes por conversión
  const ranking = lotes.map(l => {
    const cs = cosechas.filter(c => c.loteId === l.id);
    const csS = cs.filter(c => c.sustratoTotal > 0);
    const kg = cs.reduce((a, c) => a + c.peso, 0);
    const conv = csS.length ? csS.reduce((a, c) => a + (c.peso / c.sustratoTotal) * 100, 0) / csS.length : null;
    return { ...l, kg, conv };
  }).filter(l => l.kg > 0 || l.conv !== null)
    .sort((a, b) => (b.conv ?? -1) - (a.conv ?? -1));

  // Mejor sustrato
  const sustrMap: Record<string, { t: number; n: number }> = {};
  cosechas.filter(c => c.sustratoTotal > 0).forEach(c => {
    const lote = lotes.find(l => l.id === c.loteId);
    if (!lote?.tipoSustrato) return;
    const s = lote.tipoSustrato;
    if (!sustrMap[s]) sustrMap[s] = { t: 0, n: 0 };
    sustrMap[s].t += (c.peso / c.sustratoTotal) * 100;
    sustrMap[s].n++;
  });
  const mejorSustrato = Object.entries(sustrMap)
    .map(([k, v]) => ({ sust: k, avg: v.t / v.n }))
    .sort((a, b) => b.avg - a.avg)[0] ?? null;

  // Stats del mes para compartir
  const kgMes = cosechas.filter(c => c.fecha.startsWith(mesKey)).reduce((a, c) => a + c.peso, 0);
  const cosechasMesN = cosechas.filter(c => c.fecha.startsWith(mesKey)).length;
  const lotesActivos = lotes.filter(l => daysSince(l.fecha) <= 32).length;

  const medalles = ['🥇', '🥈', '🥉'];

  if (cosechas.length === 0 && lotes.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>📊 Estadísticas</h1>
        <EmptyState icon="📊" text="Registra tu primer lote y cosecha para ver tus estadísticas aquí" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>📊 Estadísticas</h1>

      {/* Kg por mes */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>🌿 Kg cosechados por mes</div>
          <div style={{ fontSize: 11, color: S.muted }}>últimos 6 meses</div>
        </div>
        {cosechas.length === 0
          ? <EmptyState icon="⚖️" text="Aún no tienes cosechas registradas" />
          : <BarChart data={kgPorMes} />
        }
        {totalKg > 0 && (
          <div style={{ fontSize: 12, color: S.muted, marginTop: 4, textAlign: 'right' }}>
            Total acumulado: <strong style={{ color: S.green2 }}>{totalKg.toFixed(1)} kg</strong>
          </div>
        )}
      </div>

      {/* Conversión histórica */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>📈 Tasa de conversión</div>
          {avgConv !== null && (
            <div style={{ fontSize: 11, color: S.amber, fontWeight: 700 }}>Prom: {avgConv.toFixed(1)}%</div>
          )}
        </div>
        <LineChart data={convData} metaLine={20} />
        <div style={{ fontSize: 11, color: S.muted, display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#f59e0b' }}>— — </span>Meta: 20%</span>
          {avgConv !== null && (
            <span>Tu promedio: <strong style={{ color: avgConv >= 20 ? S.green : S.amber }}>{avgConv.toFixed(1)}%</strong></span>
          )}
        </div>
      </div>

      {/* Ranking de lotes */}
      {ranking.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 14 }}>🏆 Ranking de lotes</div>
          {ranking.slice(0, 5).map((l, i) => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < Math.min(ranking.length, 5) - 1 ? `1px solid ${S.border}` : 'none' }}>
              <span style={{ fontSize: 20, flexShrink: 0, width: 28 }}>{medalles[i] ?? `${i + 1}.`}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.nombre}</div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>
                  {l.tipoSustrato && <span style={{ marginRight: 8 }}>🌿 {l.tipoSustrato}</span>}
                  <span>⚖️ {l.kg.toFixed(1)} kg</span>
                </div>
              </div>
              {l.conv !== null && (
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: l.conv >= 20 ? S.green2 : l.conv >= 15 ? S.amber : S.red }}>{l.conv.toFixed(1)}%</div>
                  <div style={{ fontSize: 9, color: S.muted }}>conversión</div>
                </div>
              )}
            </div>
          ))}
          {mejorSustrato && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.green2 }}>🌿 Mejor sustrato: {mejorSustrato.sust}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                Conversión promedio: {mejorSustrato.avg.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exportar CSV */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 14 }}>📥 Exportar datos</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: lotes.length === 0 ? 0.4 : 1 }}
            disabled={lotes.length === 0}
            onClick={() => {
              const hdrs = ['Nombre', 'Fecha siembra', 'Objetivo', 'Sustrato inicial (kg)', 'Tipo sustrato', 'Larvas/huevos', 'Temperatura', 'Notas'];
              const rows = lotes.map(l => [l.nombre, l.fecha, l.objetivo ?? 'cosechar', l.sustrato.toString(), l.tipoSustrato, l.huevos, l.temp?.toString() ?? '', l.notas]);
              downloadCSV(rows, hdrs, `prolarva-lotes-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >📦 Lotes</button>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: cosechas.length === 0 ? 0.4 : 1 }}
            disabled={cosechas.length === 0}
            onClick={() => {
              const hdrs = ['Lote', 'Fecha cosecha', 'Peso (kg)', 'Sustrato total (kg)', 'Conversión (%)', 'Calidad', 'Notas'];
              const rows = cosechas.map(c => {
                const l = lotes.find(x => x.id === c.loteId);
                const conv = c.sustratoTotal > 0 ? ((c.peso / c.sustratoTotal) * 100).toFixed(1) : '';
                return [l?.nombre ?? c.loteId, c.fecha, c.peso.toString(), c.sustratoTotal.toString(), conv, c.calidad, c.notas];
              });
              downloadCSV(rows, hdrs, `prolarva-cosechas-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >⚖️ Cosechas</button>
          <button
            style={{ ...btnOutline, flex: 1, minWidth: 120, opacity: feeds.length === 0 ? 0.4 : 1 }}
            disabled={feeds.length === 0}
            onClick={() => {
              const hdrs = ['Lote', 'Fecha', 'Cantidad (kg)', 'Tipo sustrato', 'Rechazo', 'Notas'];
              const rows = feeds.map(f => {
                const l = lotes.find(x => x.id === f.loteId);
                return [l?.nombre ?? f.loteId, f.fecha.slice(0, 10), f.cantidad.toString(), f.tipo, f.rechazo, f.notas];
              });
              downloadCSV(rows, hdrs, `prolarva-alimentacion-${ahora.toISOString().slice(0, 10)}.csv`);
            }}
          >🌿 Alimentación</button>
        </div>
      </div>

      {/* Compartir resultados */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 6 }}>📤 Compartir resultados del mes</div>
        <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.6, marginBottom: 14 }}>
          Genera una imagen lista para WhatsApp o Instagram con tus estadísticas de {mesLabel}.
          {kgMes === 0 && <span style={{ color: S.amber }}> (Aún no tienes cosechas este mes.)</span>}
        </p>
        <button
          style={{ ...btnPrimary, width: '100%', opacity: sharing ? 0.6 : 1 }}
          disabled={sharing}
          onClick={async () => {
            setSharing(true);
            await generarImagenMes({ kgMes, cosechasMes: cosechasMesN, lotesActivos, avgConv, mesLabel });
            setSharing(false);
          }}
        >
          {sharing ? 'Generando imagen...' : `📤 Compartir ${mesLabel}`}
        </button>
      </div>
    </div>
  );
}
