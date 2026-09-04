'use client';
import { useState, type CSSProperties } from 'react';
import { BSF_STAGES, daysSince, loteStarts, type Lote } from '@/hooks/useSocios';
import { S, CalendarMonth } from './_shared';

// ─── Timeline vertical del ciclo BSF ──────────────────────────────────────────
//
// El ciclo se dibuja de arriba hacia abajo. Se resalta la etapa en la que va el
// lote hoy y, como en las apps que rastrean el periodo, el socio puede corregir
// la estimación (−1 / +1 día, "empezó hoy") — las etapas siguientes se
// recalculan solas.

const MES_CORTO  = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const LBL_COSECHAR: Record<string, { name: string; icon: string }> = {
  huevo:   { name: 'Huevo',        icon: '🥚' },
  larvaJ:  { name: 'Larva joven',  icon: '🐛' },
  larvaM:  { name: 'Larva madura', icon: '🦟' },
  prepupa: { name: 'Cosecha',      icon: '⚖️' },
  cosecha: { name: 'Sobremadura',  icon: '⏳' },
};
const LBL_CONTINUAR: Record<string, { name: string; icon: string }> = {
  huevo:   { name: 'Huevo',        icon: '🥚' },
  larvaJ:  { name: 'Larva joven',  icon: '🐛' },
  larvaM:  { name: 'Larva madura', icon: '🦟' },
  prepupa: { name: 'Prepupa',      icon: '⭐' },
  cosecha: { name: 'Mosca adulta', icon: '🦋' },
};

/** Se parsea igual que el resto de la app (`fmtDate` usa `new Date(str)`) para
 *  que las fechas del timeline coincidan con "Sembrado el ..." del encabezado. */
function parseFecha(s: string): Date {
  return new Date(s);
}
function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtCorta(d: Date): string {
  return `${d.getDate()} ${MES_CORTO[d.getMonth()]}`;
}
function isoDia(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CicloVertical({ lote, onAdjust }: {
  lote: Lote;
  onAdjust: (ajustes: Record<string, number>) => void;
}) {
  const [expandCal, setExpandCal] = useState(false);
  const [openAdj,   setOpenAdj]   = useState<string | null>(null);

  const objetivo   = lote.objetivo ?? 'cosechar';
  const LBL        = objetivo === 'continuar' ? LBL_CONTINUAR : LBL_COSECHAR;
  const ajustes    = lote.ajustes ?? {};
  const hasAjustes = Object.keys(ajustes).length > 0;

  const start      = parseFecha(lote.fecha);
  const day        = Math.max(0, daysSince(lote.fecha));
  const starts     = loteStarts(ajustes);        // día efectivo de inicio de cada etapa
  const baseStarts = loteStarts({});             // sin ajustes — para mostrar el desfase

  let curIdx = 0;
  for (let i = starts.length - 1; i >= 0; i--) { if (day >= starts[i]) { curIdx = i; break; } }

  const endOf = (i: number) => (i < starts.length - 1 ? starts[i + 1] - 1 : null);
  const cosechaDia   = starts[3];                // entra a "Cosecha"/"Prepupa"
  const cosechaFecha = addDays(start, cosechaDia);
  const cosechaFin   = endOf(3);

  function setAj(key: string, d: number) {
    const idx = BSF_STAGES.findIndex(s => s.key === key);
    const minDay = idx > 0 ? starts[idx - 1] + 1 : 0;
    onAdjust({ ...ajustes, [key]: Math.max(minDay, Math.round(d)) });
  }
  function clearAj(key: string) {
    const c = { ...ajustes };
    delete c[key];
    onAdjust(c);
  }

  // ── Calendario mensual (opcional) ──────────────────────────────────────────
  const msMap: Record<string, string[]> = {};
  BSF_STAGES.forEach((s, i) => {
    const k = isoDia(addDays(start, starts[i]));
    if (!msMap[k]) msMap[k] = [];
    msMap[k].push(LBL[s.key].icon);
  });
  const calEnd  = addDays(start, (cosechaFin ?? starts[4]) + 10);
  const todayStr = isoDia(new Date());
  const meses: { year: number; month: number }[] = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const finMes = new Date(calEnd.getFullYear(), calEnd.getMonth(), 1);
  while (cur <= finMes) {
    meses.push({ year: cur.getFullYear(), month: cur.getMonth() });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }

  // ── Resumen (como el aviso viejo de "listo para cosechar") ─────────────────
  let resumen: { txt: string; color: string };
  if (curIdx >= 4) {
    resumen = { txt: '⚠️ Pasó la ventana óptima. Revisa si hay prepupas escapándose.', color: S.red };
  } else if (curIdx === 3) {
    resumen = objetivo === 'continuar'
      ? { txt: '⭐ Etapa prepupa — traslada las prepupas a las trampas.', color: S.emerald }
      : { txt: `✅ En ventana de cosecha${cosechaFin != null ? ` — hasta el ${fmtCorta(addDays(start, cosechaFin))}` : ''}.`, color: S.emerald };
  } else {
    const faltan = Math.max(0, cosechaDia - day);
    resumen = {
      txt: `Faltan ~${faltan} día${faltan !== 1 ? 's' : ''} para ${objetivo === 'continuar' ? 'la prepupa' : 'la cosecha'} (${fmtCorta(cosechaFecha)}).`,
      color: S.muted,
    };
  }

  return (
    <div style={{ marginTop: 4 }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 12, color: S.muted }}>
          Día <strong style={{ color: S.green2, fontSize: 14 }}>{day}</strong> del ciclo · {LBL[BSF_STAGES[curIdx].key].icon} {LBL[BSF_STAGES[curIdx].key].name}
        </div>
        {hasAjustes && (
          <button onClick={() => onAdjust({})} style={linkBtn}>↺ Estimación estándar</button>
        )}
      </div>

      {/* Etapas */}
      <div>
        {BSF_STAGES.map((s, i) => {
          const meta      = LBL[s.key];
          const state     = i < curIdx ? 'done' : i === curIdx ? 'current' : 'future';
          const startDay  = starts[i];
          const endDay    = endOf(i);
          const startDate = addDays(start, startDay);
          const endDate   = endDay != null ? addDays(start, endDay) : null;
          const adjusted  = typeof ajustes[s.key] === 'number';
          const delta     = startDay - baseStarts[i];

          const rangoTxt = endDate
            ? `${fmtCorta(startDate)} – ${fmtCorta(endDate)}`
            : `desde ${fmtCorta(startDate)}`;

          let estadoTxt = '';
          if (state === 'done') estadoTxt = '✓ Completada';
          else if (state === 'current') {
            const dur   = endDay != null ? endDay - startDay + 1 : null;
            const enDia = day - startDay + 1;
            estadoTxt = dur ? `● Ahora · día ${enDia} de ${dur}` : `● Ahora · día ${enDia}`;
          } else {
            const faltan = Math.max(1, startDay - day);
            estadoTxt = `en ~${faltan} día${faltan !== 1 ? 's' : ''}`;
          }

          const dur      = endDay != null ? endDay - startDay + 1 : 8;
          const fraccion = state === 'current' ? Math.min(1, Math.max(0.04, (day - startDay + 0.5) / dur)) : state === 'done' ? 1 : 0;

          const puedeAjustar = state !== 'done' || adjusted;
          const abierto      = openAdj === s.key;
          const minDay       = i > 0 ? starts[i - 1] + 1 : 0;

          return (
            <div key={s.key} style={{ display: 'flex', gap: 12, position: 'relative' }}>
              {/* Riel */}
              <div style={{ position: 'relative', width: 34, flexShrink: 0 }}>
                {i > 0 && (
                  <div style={{ position: 'absolute', left: 16, top: 0, width: 2, height: 17, background: i <= curIdx ? S.emerald : S.navy3 }} />
                )}
                {i < BSF_STAGES.length - 1 && (
                  <div style={{ position: 'absolute', left: 16, top: 17, bottom: 0, width: 2, background: S.navy3, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${fraccion * 100}%`, background: S.emerald, transition: 'height 0.4s' }} />
                  </div>
                )}
                <div style={{
                  position: 'relative', zIndex: 1, width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: state === 'done' ? 13 : 15,
                  background: state === 'done' ? 'rgba(16,185,129,0.16)' : state === 'current' ? 'rgba(34,197,94,0.22)' : S.navy3,
                  border: `2px solid ${state === 'done' ? S.emerald : state === 'current' ? S.green : S.border}`,
                  boxShadow: state === 'current' ? '0 0 0 4px rgba(34,197,94,0.12)' : 'none',
                  opacity: state === 'future' ? 0.75 : 1,
                }}>
                  {state === 'done' ? '✓' : meta.icon}
                </div>
              </div>

              {/* Contenido */}
              <div style={{
                flex: 1, minWidth: 0, paddingBottom: 12,
                ...(state === 'current' ? { background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '8px 12px 12px', marginTop: -4 } : {}),
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: state === 'future' ? S.muted : S.text }}>{meta.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: S.muted, background: S.navy3, borderRadius: 5, padding: '1px 5px', letterSpacing: '0.03em' }}>
                    día {startDay}{endDay != null ? `–${endDay}` : '+'}
                  </span>
                  {adjusted && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: S.amber, background: 'rgba(245,158,11,0.13)', borderRadius: 5, padding: '1px 5px' }}>
                      ajustado {delta > 0 ? `+${delta}d` : `${delta}d`}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{rangoTxt}</div>
                <div style={{ fontSize: 11, marginTop: 3, fontWeight: 700, color: state === 'done' ? S.emerald : state === 'current' ? S.green2 : S.muted }}>
                  {estadoTxt}
                </div>

                {puedeAjustar && (
                  <button
                    onClick={() => setOpenAdj(abierto ? null : s.key)}
                    style={{ ...linkBtn, marginTop: 6 }}
                  >
                    {abierto ? '▲ cerrar' : '✎ ajustar fecha'}
                  </button>
                )}

                {abierto && (
                  <div style={{ marginTop: 8, background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px' }}>
                    <div style={{ fontSize: 11, color: S.muted, marginBottom: 8 }}>
                      ¿Qué día entró el lote a <strong style={{ color: S.text }}>{meta.name.toLowerCase()}</strong>?
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setAj(s.key, startDay - 1)}
                        disabled={startDay <= minDay}
                        style={{ ...stepBtn, opacity: startDay <= minDay ? 0.35 : 1, cursor: startDay <= minDay ? 'not-allowed' : 'pointer' }}
                      >−1 día</button>
                      <div style={{ textAlign: 'center', minWidth: 92 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: S.text }}>{fmtCorta(startDate)}</div>
                        <div style={{ fontSize: 9, color: S.muted }}>día {startDay}</div>
                      </div>
                      <button onClick={() => setAj(s.key, startDay + 1)} style={stepBtn}>+1 día</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                      {(i === curIdx || i === curIdx + 1) && (
                        <button onClick={() => setAj(s.key, day)} style={{ ...stepBtn, background: 'rgba(34,197,94,0.15)', borderColor: S.green, color: S.green2 }}>
                          Empezó hoy (día {day})
                        </button>
                      )}
                      {adjusted && (
                        <button onClick={() => clearAj(s.key)} style={linkBtn}>↺ quitar ajuste</button>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: delta === 0 ? S.muted : S.amber, marginTop: 8 }}>
                      {delta === 0
                        ? 'Según lo estimado. Las etapas siguientes se recalculan al ajustar.'
                        : `${delta > 0 ? `${delta} día(s) más lento` : `${Math.abs(delta)} día(s) más rápido`} que lo estimado — las etapas siguientes ya se movieron.`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div style={{ fontSize: 12, color: resumen.color, fontWeight: 600, marginTop: 6, marginBottom: 12, lineHeight: 1.5 }}>
        {resumen.txt}
      </div>

      {/* Calendario */}
      <button
        onClick={() => setExpandCal(c => !c)}
        style={{ background: expandCal ? 'rgba(34,197,94,0.12)' : 'transparent', border: `1px solid ${expandCal ? S.green : S.border}`, color: expandCal ? S.green2 : S.muted, borderRadius: 8, padding: '7px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        {expandCal ? '✕ Cerrar calendario' : '📅 Ver en el calendario'}
      </button>

      {expandCal && (
        <div style={{ marginTop: 12, background: S.navy2, borderRadius: 12, padding: '14px 12px', border: `1px solid ${S.border}` }}>
          {meses.map(({ year, month }) => (
            <CalendarMonth
              key={`${year}-${month}`}
              year={year} month={month}
              msMap={msMap}
              startDate={start} endDate={calEnd}
              todayStr={todayStr}
            />
          ))}
          <div style={{ borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {BSF_STAGES.map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: S.muted }}>
                <span>{LBL[s.key].icon}</span><span>{LBL[s.key].name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const linkBtn: CSSProperties = {
  background: 'none', border: 'none', color: '#38bdf8', fontSize: 11, fontWeight: 700,
  cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif',
};
const stepBtn: CSSProperties = {
  background: S.navy3, border: `1.5px solid ${S.border}`, color: S.text,
  borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
};
