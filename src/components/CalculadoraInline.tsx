'use client';

import { useState } from 'react';

const especies = [
  { id: 'pollos', emoji: '🐔', label: 'Pollos', reemplazo: 0.25, nota: '25% reemplazo' },
  { id: 'peces',  emoji: '🐟', label: 'Peces',  reemplazo: 0.50, nota: '50% reemplazo' },
  { id: 'cerdos', emoji: '🐷', label: 'Cerdos', reemplazo: 0.20, nota: '20% reemplazo' },
];

const fmt = (n: number) => n.toLocaleString('es-CO');

export default function CalculadoraInline() {
  const [especie, setEspecie] = useState<string | null>(null);
  const [gasto, setGasto] = useState('');

  const esp = especies.find(e => e.id === especie);
  const gastoNum = parseInt(gasto) || 0;
  const ahorroMensual = esp ? Math.round(gastoNum * esp.reemplazo) : 0;
  const ahorroAnual = ahorroMensual * 12;
  const mostrar = especie && gastoNum > 0;

  return (
    <div style={{ marginTop: 32, padding: '22px 24px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16 }}>
      <div style={{ fontWeight: 800, color: '#f1f5f9', fontSize: 15, marginBottom: 4 }}>🧮 ¿Cuánto podés ahorrar con BSF?</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 18, lineHeight: 1.5 }}>
        Calculá cuánto dejás de gastar en concentrado reemplazándolo parcialmente con larva.
      </div>

      {/* Selector especie */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {especies.map(e => {
          const sel = especie === e.id;
          return (
            <button key={e.id} onClick={() => setEspecie(e.id)} style={{
              flex: 1, padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
              border: `2px solid ${sel ? '#10b981' : 'rgba(16,185,129,0.2)'}`,
              background: sel ? 'rgba(16,185,129,0.15)' : 'rgba(21,32,53,0.6)',
              fontFamily: 'Montserrat, sans-serif', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{e.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#10b981' : '#94a3b8' }}>{e.label}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{e.nota}</div>
            </button>
          );
        })}
      </div>

      {/* Input gasto */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 7 }}>
          Gasto mensual en concentrado (COP)
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b', fontWeight: 700 }}>$</span>
          <input
            type="number"
            placeholder="Ej: 500000"
            value={gasto}
            onChange={e => setGasto(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 28px', borderRadius: 10,
              background: 'rgba(30,48,80,0.8)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#f1f5f9', fontSize: 15, fontFamily: 'Montserrat, sans-serif', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Resultado */}
      {mostrar && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
          <div style={{ padding: '16px', background: 'rgba(16,185,129,0.12)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, letterSpacing: 1 }}>AHORRO MENSUAL</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>$ {fmt(ahorroMensual)}</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>COP / mes</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(34,197,94,0.12)', borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, letterSpacing: 1 }}>AHORRO ANUAL</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e' }}>$ {fmt(ahorroAnual)}</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>COP / año</div>
          </div>
        </div>
      )}

      {especie && !gastoNum && (
        <div style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: '12px 0' }}>
          Ingresá tu gasto mensual para ver el ahorro estimado ↑
        </div>
      )}

      {!especie && (
        <div style={{ fontSize: 13, color: '#475569', textAlign: 'center', padding: '12px 0' }}>
          Seleccioná el tipo de animal para comenzar ↑
        </div>
      )}
    </div>
  );
}
