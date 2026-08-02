'use client';

import { useState, useEffect } from 'react';
import ProtocoloCrisisModal from '@/components/ProtocoloCrisisModal';

const S = {
  bg:     '#0a1628',
  card:   '#152035',
  card2:  '#1e3050',
  green:  '#22c55e',
  greenL: '#4ade80',
  text:   '#e2e8f0',
  text2:  '#f1f5f9',
  muted:  '#94a3b8',
  muted2: '#64748b',
  amber:  '#f59e0b',
  amberL: '#fbbf24',
};

const BONOS = [
  {
    emoji: '🧮',
    titulo: 'Calculadora BSF ProLarva',
    desc: 'Calcula exactamente cuánto estás perdiendo y cuánto vas a recuperar. La decisión se vuelve matemática.',
    valor: '$97 USD',
    accion: null,
  },
  {
    emoji: '🛡️',
    titulo: 'Protocolo Anti-Crisis BSF',
    desc: 'Respuesta inmediata a los 7 problemas más frecuentes: temperatura, humedad, oviposición, mortalidad, plagas y más.',
    valor: '$67 USD',
    accion: 'Ver protocolo →',
  },
  {
    emoji: '🌐',
    titulo: 'Red de Productores BSF',
    desc: 'Primera comunidad organizada de criadores BSF en Colombia. Experiencias reales y respaldo de pares.',
    valor: '$97 USD',
    accion: null,
  },
];

interface Props {
  nombre: string;
  onClose: () => void;
  showClose?: boolean;
}

export default function BienvenidaModal({ nombre, onClose, showClose }: Props) {
  const [fase, setFase] = useState<'bienvenida' | 'bonos'>('bienvenida');
  const [bonosVisibles, setBonosVisibles] = useState(0);
  const [showProtocolo, setShowProtocolo] = useState(false);

  useEffect(() => {
    if (fase === 'bonos') {
      const timers = BONOS.map((_, i) =>
        setTimeout(() => setBonosVisibles(v => Math.max(v, i + 1)), i * 350 + 100)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [fase]);

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 12px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          background: S.bg,
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 20,
          width: '100%', maxWidth: 480,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          animation: 'bwFadeIn 0.3s ease',
          margin: 'auto',
          position: 'relative',
        }}>
          {showClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 14, right: 14, zIndex: 10,
                background: 'rgba(255,255,255,0.07)', border: 'none',
                color: S.muted, fontSize: 16, cursor: 'pointer',
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          )}

          {/* ── FASE: BIENVENIDA ── */}
          {fase === 'bienvenida' && (
            <div style={{ padding: '36px 24px 32px', textAlign: 'center', animation: 'bwFadeIn 0.25s ease' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: S.greenL,
                fontSize: 9, fontWeight: 800,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                padding: '5px 14px', borderRadius: 20,
                marginBottom: 16,
              }}>
                Programa Colonia · Acceso confirmado
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: S.text2, lineHeight: 1.25, marginBottom: 12 }}>
                ¡Bienvenida,<br />{nombre}!
              </h2>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, maxWidth: 340, margin: '0 auto 28px' }}>
                Ya tienes acceso completo. Antes de empezar, hay algo que quiero mostrarte — vinieron con tu inscripción y los tienes desde hoy.
              </p>
              <button
                onClick={() => setFase('bonos')}
                style={{
                  background: `linear-gradient(135deg, ${S.green}, #16a34a)`,
                  color: '#0a1628', fontWeight: 900, fontSize: 15,
                  padding: '14px 36px', borderRadius: 12, minHeight: 50,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
                  width: '100%', maxWidth: 280,
                }}
              >
                Ver mis bonos →
              </button>
            </div>
          )}

          {/* ── FASE: BONOS ── */}
          {fase === 'bonos' && (
            <div style={{ animation: 'bwFadeIn 0.25s ease' }}>
              <div style={{
                padding: '20px 20px 16px',
                background: 'rgba(245,158,11,0.06)',
                borderBottom: '1px solid rgba(245,158,11,0.15)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: S.amberL, marginBottom: 6 }}>
                  🎁 Tus 3 bonos incluidos
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: S.text2, marginBottom: 2 }}>
                  Valor total: <span style={{ color: S.amberL }}>$261 USD</span>
                </div>
                <div style={{ fontSize: 11, color: S.muted }}>
                  Incluidos en tu inscripción
                </div>
              </div>

              <div style={{ padding: '14px 16px 6px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {BONOS.map((bono, i) => {
                  const visible = bonosVisibles > i;
                  return (
                    <div
                      key={i}
                      style={{
                        background: bono.accion ? 'rgba(245,158,11,0.06)' : S.card,
                        border: bono.accion
                          ? '1px solid rgba(245,158,11,0.25)'
                          : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12,
                        padding: '14px 14px',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'opacity 0.35s ease, transform 0.35s ease',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                      }}
                    >
                      <div style={{ fontSize: 24, flexShrink: 0, marginTop: 1 }}>{bono.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: S.text2, lineHeight: 1.25 }}>{bono.titulo}</div>
                          <div style={{
                            fontSize: 9, fontWeight: 700,
                            color: S.amberL,
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            padding: '2px 7px', borderRadius: 20,
                            flexShrink: 0, whiteSpace: 'nowrap',
                          }}>
                            {bono.valor}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.5, marginBottom: bono.accion ? 10 : 0 }}>
                          {bono.desc}
                        </div>
                        {bono.accion && (
                          <button
                            onClick={() => setShowProtocolo(true)}
                            style={{
                              background: 'rgba(245,158,11,0.15)',
                              border: '1px solid rgba(245,158,11,0.35)',
                              color: S.amberL,
                              fontSize: 12, fontWeight: 800,
                              padding: '8px 16px', borderRadius: 8, minHeight: 36,
                              cursor: 'pointer',
                              fontFamily: 'Montserrat, sans-serif',
                            }}
                          >
                            {bono.accion}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '16px 16px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: S.muted2, marginBottom: 12 }}>
                  Puedes volver al Protocolo desde tu perfil en cualquier momento.
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: `linear-gradient(135deg, ${S.green}, #16a34a)`,
                    color: '#0a1628', fontWeight: 900, fontSize: 15,
                    padding: '14px 40px', borderRadius: 12, minHeight: 50,
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
                    width: '100%',
                  }}
                >
                  Empezar 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bwFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <ProtocoloCrisisModal open={showProtocolo} onClose={() => setShowProtocolo(false)} />
    </>
  );
}
