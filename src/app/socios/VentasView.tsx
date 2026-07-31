'use client';
import { useState } from 'react';
import { type VentaSocio } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnSm, btnOutline, btnDanger, EmptyState, Badge, Field, Modal, inputStyle, labelStyle, fmtDate, downloadCSV } from './_shared';

// ─── VentasView ──────────────────────────────────────────────────────────────

const PRODUCTO_LABELS: Record<string, string> = { larva: 'Larva fresca', harina: 'Harina BSF', abono: 'Abono orgánico' };
const PRODUCTO_ICONS:  Record<string, string> = { larva: '🐛', harina: '🌾', abono: '🌱' };

function VentasView({ ventas, onAdd, onDelete }: {
  ventas: VentaSocio[];
  onAdd: (v: Omit<VentaSocio, 'id' | 'creadoEn'>) => void;
  onDelete: (id: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [producto,   setProducto]  = useState<'larva' | 'harina' | 'abono'>('larva');
  const [fecha,      setFecha]     = useState(new Date().toISOString().split('T')[0]);
  const [kg,         setKg]        = useState('');
  const [precioPor,  setPrecioPor] = useState('');
  const [comprador,  setComprador] = useState('');
  const [notas,      setNotas]     = useState('');
  const [saving,     setSaving]    = useState(false);
  const [error,      setError]     = useState('');
  const [deleteId,   setDeleteId]  = useState<string | null>(null);

  const mesActual = new Date().toISOString().slice(0, 7);
  const ventasMes = ventas.filter(v => v.fecha.slice(0, 7) === mesActual);
  const ingresosMes = ventasMes.reduce((a, v) => a + v.totalCop, 0);
  const kgMes       = ventasMes.reduce((a, v) => a + v.kg, 0);
  const precioPromed = ventasMes.length > 0
    ? Math.round(ventasMes.reduce((a, v) => a + v.precioCopKg, 0) / ventasMes.length)
    : 0;

  const sorted = [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  function openModal() {
    setProducto('larva'); setFecha(new Date().toISOString().split('T')[0]);
    setKg(''); setPrecioPor(''); setComprador(''); setNotas(''); setError('');
    setShowModal(true);
  }

  async function handleSave() {
    const kgN = parseFloat(kg);
    const precioN = parseInt(precioPor);
    if (!kg || isNaN(kgN) || kgN <= 0) { setError('Ingresa los kg vendidos'); return; }
    if (!precioPor || isNaN(precioN) || precioN <= 0) { setError('Ingresa el precio por kg'); return; }
    setSaving(true);
    onAdd({
      fecha, producto,
      kg: kgN,
      precioCopKg: precioN,
      totalCop: Math.round(kgN * precioN),
      comprador: comprador.trim(),
      notas: notas.trim(),
    });
    setSaving(false);
    setShowModal(false);
  }

  const fmt = (n: number) => n.toLocaleString('es-CO');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>💰 Mis Ventas</h1>
          <p style={{ color: S.muted, fontSize: 13, marginTop: 4 }}>Registra tus ventas de larva, harina y abono BSF</p>
        </div>
        <button onClick={openModal} style={{ ...btnPrimary, flexShrink: 0 }}>+ Registrar venta</button>
      </div>

      {/* Stats del mes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: S.green }}>${fmt(ingresosMes)}</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Ingresos este mes (COP)</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: S.amber }}>{kgMes.toFixed(1)} kg</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Kg vendidos este mes</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>${fmt(precioPromed)}/kg</div>
          <div style={{ fontSize: 11, color: S.muted, marginTop: 4, fontWeight: 600 }}>Precio promedio</div>
        </div>
      </div>

      {/* Lista */}
      {sorted.length === 0 ? (
        <EmptyState icon="💰" text="Aún no has registrado ventas. Toca «+ Registrar venta» para empezar." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(v => (
            <div key={v.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{PRODUCTO_ICONS[v.producto] ?? '📦'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{PRODUCTO_LABELS[v.producto]}</span>
                  <Badge color="green">{v.kg} kg</Badge>
                  {v.comprador && <Badge color="blue">{v.comprador}</Badge>}
                </div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 3 }}>
                  {fmtDate(v.fecha)} · ${fmt(v.precioCopKg)}/kg
                  {v.notas && <span style={{ marginLeft: 8, color: '#475569' }}>· {v.notas}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: S.green }}>${fmt(v.totalCop)}</div>
                <button onClick={() => setDeleteId(v.id)} style={{ ...btnDanger, ...btnSm, marginTop: 4 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal registrar venta */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Registrar venta">
        <Field label="Producto">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['larva', 'harina', 'abono'] as const).map(p => (
              <button key={p} onClick={() => setProducto(p)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', border: `1.5px solid ${producto === p ? S.green : S.border}`, background: producto === p ? 'rgba(34,197,94,0.12)' : 'transparent', color: producto === p ? S.green2 : S.muted }}>
                {PRODUCTO_ICONS[p]} {PRODUCTO_LABELS[p]}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha">
            <input type="date" style={inputStyle} value={fecha} onChange={e => setFecha(e.target.value)} />
          </Field>
          <Field label="Kg vendidos">
            <input type="number" step="0.1" min="0" style={inputStyle} value={kg} onChange={e => setKg(e.target.value)} placeholder="ej. 2.5" />
          </Field>
        </div>
        <Field label="Precio por kg (COP)">
          <input type="number" min="0" style={inputStyle} value={precioPor} onChange={e => setPrecioPor(e.target.value)} placeholder="ej. 5000" />
        </Field>
        {kg && precioPor && !isNaN(parseFloat(kg)) && !isNaN(parseInt(precioPor)) && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: `1px solid ${S.border}`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
            Total: <strong style={{ color: S.green }}>${(parseFloat(kg) * parseInt(precioPor)).toLocaleString('es-CO')} COP</strong>
          </div>
        )}
        <Field label="Comprador (opcional)">
          <input style={inputStyle} value={comprador} onChange={e => setComprador(e.target.value)} placeholder="ej. Finca Las Palmas" />
        </Field>
        <Field label="Notas (opcional)">
          <input style={inputStyle} value={notas} onChange={e => setNotas(e.target.value)} placeholder="ej. Pago en efectivo" />
        </Field>
        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10 }}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={() => setShowModal(false)} style={btnOutline}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </Modal>

      {/* Confirmación eliminar */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="¿Eliminar venta?">
        <p style={{ color: S.muted, fontSize: 13, marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteId(null)} style={btnOutline}>Cancelar</button>
          <button onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } }} style={{ ...btnPrimary, background: S.red }}>Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
