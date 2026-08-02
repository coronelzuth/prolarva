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
    desc: 'Calcula exactamente cuánto estás perdiendo al mes y cuánto recuperarás con el sistema. La decisión deja de ser emocional y se vuelve matemática.',
    valor: '$97 USD',
    accion: null,
  },
  {
    emoji: '🛡️',
    titulo: 'Protocolo Anti-Crisis BSF',
    desc: 'Guía de respuesta inmediata para los 7 problemas más frecuentes del ciclo: temperatura, humedad, oviposición, mortalidad, rechazo, plagas y lentitud.',
    valor: '$67 USD',
    accion: 'Ver protocolo →',
  },
  {
    emoji: '🌐',
    titulo: 'Red de Productores BSF',
    desc: 'Primera comunidad organizada de criadores BSF en Colombia. Experiencias reales, avances compartidos, respaldo de pares.',
    valor: '$97 USD',
    accion: null,
  },
];

interface Props {
  nombre: string;
  onClose: () => void;
}

export default function BienvenidaModal({ nombre, onClose }: Props) {
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
        padding: '24px 16px',
        animation: 'bwFadeIn 0.3s ease',
      }}>
        <div style={{
          background: S.bg,
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 24,
          width: '100%', maxWidth: 520,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}>

          {/* ── FASE: BIENVENIDA ── */}
          {fase === 'bienvenida' && (
            <div style={{ padding: '44px 36px 40px', textAlign: 'center', animation: 'bwFadeIn 0.25s ease' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🎉</div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: S.greenL,
                fontSize: 10, fontWeight: 800,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                padding: '5px 14px', borderRadius: 20,
                marginBottom: 20,
              }}>
                Programa Colonia · Acceso confirmado
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: S.text2, lineHeight: 1.25, marginBottom: 14 }}>
                ¡Bienvenida,<br />{nombre}!
              </h2>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px' }}>
                Ya tienes acceso completo al programa. Antes de empezar, hay algo que quiero mostrarte — vinieron con tu inscripción y los tienes desde hoy.
              </p>
              <button
                onClick={() => setFase('bonos')}
                style={{
                  background: `linear-gradient(135deg, ${S.green}, #16a34a)`,
                  color: '#0a1628', fontWeight: 900, fontSize: 15,
                  padding: '14px 36px', borderRadius: 12,
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
                  transition: 'transform 0.15s',
                }}
              >
                Ver mis bonos →
              </button>
            </div>
          )}

          {/* ── FASE: BONOS ── */}
          {fase === 'bonos' && (
            <div style={{ animation: 'bwFadeIn 0.25s ease' }}>
              {/* Header */}
              <div style={{
                padding: '28px 28px 20px',
                background: 'rgba(245,158,11,0.06)',
                borderBottom: '1px solid rgba(245,158,11,0.15)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: S.amberL, marginBottom: 8 }}>
                  🎁 Tus 3 bonos incluidos
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: S.text2, marginBottom: 4 }}>
                  Valor total: <span style={{ color: S.amberL }}>$261 USD</span>
                </div>
                <div style={{ fontSize: 12, color: S.muted }}>
                  Incluidos en tu inscripción al Programa Colonia
                </div>
              </div>

              {/* Lista de bonos */}
              <div style={{ padding: '20px 24px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                        borderRadius: 14,
                        padding: '16px 18px',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.35s ease, transform 0.35s ease',
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                      }}
                    >
                      <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{bono.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: S.text2, lineHeight: 1.3 }}>{bono.titulo}</div>
                          <div style={{
                            fontSize: 10, fontWeight: 700,
                            color: S.amberL,
                            background: 'rgba(245,158,11,0.1)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            padding: '2px 8px', borderRadius: 20,
                            flexShrink: 0, whiteSpace: 'nowrap',
                          }}>
                            {bono.valor}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.55, marginBottom: bono.accion ? 10 : 0 }}>
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
                              padding: '7px 16px', borderRadius: 8,
                              cursor: 'pointer',
                              fontFamily: 'Montserrat, sans-serif',
                              transition: 'background 0.15s',
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

              {/* CTA Empezar */}
              <div style={{ padding: '20px 24px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: S.muted2, marginBottom: 14 }}>
                  Puedes acceder al Protocolo Anti-Crisis desde tu perfil en cualquier momento.
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: `linear-gradient(135deg, ${S.green}, #16a34a)`,
                    color: '#0a1628', fontWeight: 900, fontSize: 14,
                    padding: '13px 40px', borderRadius: 12,
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.25)',
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
