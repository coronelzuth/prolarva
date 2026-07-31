'use client';
import { type Cosecha, type Lote } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnSm, EmptyState, Badge, fmtDate } from './_shared';

function CosechaView({ cosechas, lotes, totalKg, avgConv, onNewCosecha }: {
  cosechas: Cosecha[]; lotes: Lote[];
  totalKg: number; avgConv: number | null;
  onNewCosecha: () => void;
}) {
  const qualityColor: Record<string, string> = { excelente: S.emerald, buena: '#38bdf8', regular: S.amber, baja: S.red };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Registro de Cosechas</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Métricas de rendimiento y conversión</p>
        </div>
        <button style={btnPrimary} onClick={onNewCosecha}>+ Registrar cosecha</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          [totalKg.toFixed(1) + ' kg', 'Total kg cosechados', S.emerald],
          ['#' + cosechas.length,       'Cosechas registradas', S.green],
          [avgConv ? avgConv.toFixed(1) + '%' : '—', 'Conversión promedio', '#38bdf8'],
        ].map(([v, l, c]) => (
          <div key={l} style={{ ...cardStyle }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c as string }}>{v}</div>
            <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        {cosechas.length === 0 ? (
          <EmptyState icon="⚖️" text="Aún no hay cosechas registradas." />
        ) : (
          [...cosechas].reverse().map(c => {
            const lote = lotes.find(l => l.id === c.loteId);
            const conv = c.sustratoTotal > 0 ? ((c.peso / c.sustratoTotal) * 100).toFixed(1) : null;
            return (
              <div key={c.id} style={{ background: S.navy2, border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>{lote?.nombre ?? 'Lote eliminado'}</strong>
                  <span style={{ fontSize: 12, color: S.muted }}>{fmtDate(c.fecha)}</span>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: S.emerald }}>{c.peso} kg</div><div style={{ fontSize: 10, color: S.muted }}>Cosechado</div></div>
                  {c.sustratoTotal > 0 && <div><div style={{ fontSize: 18, fontWeight: 800, color: S.muted }}>{c.sustratoTotal} kg</div><div style={{ fontSize: 10, color: S.muted }}>Sustrato</div></div>}
                  {conv && <div><div style={{ fontSize: 16, fontWeight: 800 }}><span style={{ background: 'rgba(16,185,129,0.15)', color: S.emerald, borderRadius: 20, padding: '2px 10px', fontSize: 13 }}>♻️ {conv}%</span></div><div style={{ fontSize: 10, color: S.muted, marginTop: 4 }}>Conversión</div></div>}
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: qualityColor[c.calidad] ?? S.text, textTransform: 'capitalize' }}>{c.calidad}</div><div style={{ fontSize: 10, color: S.muted }}>Calidad</div></div>
                </div>
                {c.notas && <p style={{ fontSize: 12, color: S.muted, marginTop: 8 }}>{c.notas}</p>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function GuiaView() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Guía Rápida BSF</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Parámetros clave para tu producción</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🌡️ Condiciones óptimas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['🌡️ Temperatura ideal','27°C – 35°C'],['💧 Humedad sustrato','60% – 70%'],['📊 pH sustrato','6.0 – 7.5'],['🔦 Luz en cría','Oscuridad total']].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: S.navy2, borderRadius: 10, fontSize: 13 }}>
                <span>{l}</span><strong style={{ color: S.green2 }}>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📅 Ciclo de vida</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['🥚 Huevo','Días 1 – 4','4 días',S.amber],['🐛 Larva joven (L1-L3)','Días 5 – 14','10 días',S.green],['🦟 Larva madura (L4-L5)','Días 15 – 22','8 días',S.emerald],['⭐ Prepupa → COSECHA','Días 22 – 28','¡Lista!',S.green2]].map(([icon,range,dur,c]) => (
              <div key={icon as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: S.navy2, borderRadius: 10, fontSize: 13 }}>
                <div><strong>{icon}</strong><span style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>{range}</span></div>
                <strong style={{ color: c as string }}>{dur}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🌿 Sustratos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Cáscaras de frutas','green','Excelente'],['Restos de verduras','green','Excelente'],['Pulpa de café / frutas','green','Excelente'],['Gallinaza / estiércol','blue','Bueno'],['Alimentos procesados','amber','Moderado'],['Cítricos en exceso / picante','red','Evitar']].map(([s,c,l]) => (
              <div key={s as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: S.navy2, borderRadius: 8, fontSize: 13 }}>
                <span>{s}</span><Badge color={c as 'green'|'amber'|'red'|'blue'|'gray'}>{l}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📐 Conversión esperada</h3>
          <div style={{ padding: '14px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, marginBottom: 12, fontSize: 13 }}>
            ℹ️ Por cada <strong>10 kg</strong> de sustrato orgánico, deberías obtener entre <strong>1.5 – 3 kg</strong> de larva fresca.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: 14, background: S.navy2, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: S.muted, marginBottom: 4 }}>Tasa de conversión</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: S.emerald }}>15–30%</div>
              <div style={{ fontSize: 10, color: S.muted }}>kg larva / kg sustrato</div>
            </div>
            <div style={{ padding: 14, background: S.navy2, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: S.muted, marginBottom: 4 }}>Proteína larva fresca</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: S.green2 }}>~40%</div>
              <div style={{ fontSize: 10, color: S.muted }}>base seca</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
