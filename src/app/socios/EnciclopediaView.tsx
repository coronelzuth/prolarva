'use client';

import { useEffect, useState } from 'react';
import { S } from './_shared';
import EnciclopediaBot from './EnciclopediaBot';
import {
  CicloSection, CriaSection, RutasSection,
  AlimentacionSection, ProcesamientoSection, LowCostSection,
  VocabularioSection, GaleriaSection,
} from './EnciclopediaSections';

export type EncSec =
  | 'inicio' | 'bot' | 'ciclo' | 'cria' | 'rutas'
  | 'alimentacion' | 'procesamiento' | 'lowcost' | 'vocabulario' | 'galeria';

const SECCIONES: { key: EncSec; icon: string; label: string; corto: string; desc: string }[] = [
  { key: 'bot',           icon: '🤖', label: 'Larvi Pro',        corto: 'Bot',     desc: 'Pregúntale por el ciclo, dudas y diagnóstico de problemas.' },
  { key: 'ciclo',         icon: '🔄', label: 'El ciclo',          corto: 'Ciclo',   desc: 'Las 8 etapas de la BSF, con fotos, videos y cuidados.' },
  { key: 'cria',          icon: '🌾', label: 'Cría paso a paso',  corto: 'Cría',    desc: 'Del huevo a la cosecha en 18 días, y cómo cerrar el ciclo.' },
  { key: 'rutas',         icon: '🎯', label: 'Rutas de producción', corto: 'Rutas', desc: 'Alimentar animales, producir harina o ciclo cerrado.' },
  { key: 'alimentacion',  icon: '🥗', label: 'Qué darles / qué NO', corto: 'Comida', desc: 'Sustratos por nivel proteico, porciones y lo prohibido.' },
  { key: 'procesamiento', icon: '🏭', label: 'Procesamiento',     corto: 'Proceso', desc: 'Larva viva vs. harina seca: paso a paso y comparación.' },
  { key: 'lowcost',       icon: '💸', label: 'Low cost',           corto: 'Low cost', desc: 'Sistemas de $0 a $10 con materiales reciclados.' },
  { key: 'vocabulario',   icon: '📖', label: 'Vocabulario',        corto: 'Vocab',   desc: 'Todos los términos del mundo de la larva, buscables.' },
  { key: 'galeria',       icon: '🖼️', label: 'Mega galería',       corto: 'Galería', desc: 'Referencia visual para reconocer todo a simple vista.' },
];

const VALID_SECS: EncSec[] = ['inicio', ...SECCIONES.map(s => s.key)];
const safeSec = (s?: string): EncSec => (s && VALID_SECS.includes(s as EncSec) ? (s as EncSec) : 'inicio');

export default function EnciclopediaView({ initialSection = 'inicio' }: { initialSection?: EncSec }) {
  const [sec, setSec] = useState<EncSec>(safeSec(initialSection));

  useEffect(() => { setSec(safeSec(initialSection)); }, [initialSection]);

  // Al cambiar de sección, subir el scroll del contenido
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [sec]);

  return (
    <div className="enc-outer">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>📚 Enciclopedia BSF</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4, maxWidth: 560, lineHeight: 1.6 }}>
          Todo lo que necesitas saber sobre la larva soldado negra en un solo lugar: el ciclo, la cría, la comida, el procesamiento y los montajes baratos.
        </p>
      </div>

      {/* Nav móvil — selector nativo (sin scroll horizontal) */}
      <div className="enc-mob-nav">
        {sec !== 'inicio' && (
          <button className="enc-idx-btn" onClick={() => setSec('inicio')}>‹ Índice</button>
        )}
        <select
          className="enc-sel"
          value={sec}
          onChange={e => setSec(e.target.value as EncSec)}
        >
          <option value="inicio">📚 Índice</option>
          {SECCIONES.map(s => (
            <option key={s.key} value={s.key}>{s.icon}  {s.label}</option>
          ))}
        </select>
      </div>

      <div className="enc-wrap">
        {/* Sidebar desktop */}
        <aside className="enc-nav">
          {SECCIONES.map(s => {
            const on = sec === s.key;
            return (
              <div
                key={s.key}
                onClick={() => setSec(s.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 12px', cursor: 'pointer', borderRadius: 8,
                  background: on ? 'rgba(34,197,94,0.1)' : 'transparent',
                  color: on ? S.green2 : S.text,
                  fontWeight: 600, fontSize: 12.5, transition: 'all 0.12s',
                }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            );
          })}
        </aside>

        {/* Contenido */}
        <div className="enc-content">
          {sec === 'inicio' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Empieza por donde necesites</h2>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, marginBottom: 22, maxWidth: 600 }}>
                9 secciones. Si estás arrancando, ve a <strong style={{ color: S.text }}>El ciclo</strong> y <strong style={{ color: S.text }}>Cría paso a paso</strong>.
                Si ya tienes larvas y algo no cuadra, abre <strong style={{ color: S.text }}>Larvi Pro</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                {SECCIONES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSec(s.key)}
                    style={{
                      textAlign: 'left', background: S.navy2, border: `1px solid ${S.border}`,
                      borderRadius: 14, padding: '16px 16px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {sec === 'bot' && <EnciclopediaBot />}
          {sec === 'ciclo' && <CicloSection />}
          {sec === 'cria' && <CriaSection />}
          {sec === 'rutas' && <RutasSection />}
          {sec === 'alimentacion' && <AlimentacionSection />}
          {sec === 'procesamiento' && <ProcesamientoSection />}
          {sec === 'lowcost' && <LowCostSection />}
          {sec === 'vocabulario' && <VocabularioSection />}
          {sec === 'galeria' && <GaleriaSection />}
        </div>
      </div>

      <style>{`
        .enc-wrap { display: flex; gap: 0; align-items: flex-start; }
        .enc-nav {
          width: 190px; flex-shrink: 0;
          background: rgba(21,32,53,0.5);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 12px; padding: 10px 6px;
          margin-right: 24px; position: sticky; top: 16px;
        }
        .enc-content { flex: 1; min-width: 0; }
        .enc-mob-nav { display: none; }

        @media (max-width: 860px) {
          .enc-nav { display: none; }
          .enc-mob-nav { display: flex; gap: 8px; margin-bottom: 16px; }
          .enc-sel {
            flex: 1; min-width: 0; padding: 10px 12px; border-radius: 8px;
            background: rgba(21,32,53,0.85); color: #e2e8f0;
            border: 1px solid rgba(34,197,94,0.25);
            font-family: Montserrat, sans-serif; font-weight: 700; font-size: 13px;
            -webkit-appearance: none; appearance: none;
          }
          .enc-idx-btn {
            flex-shrink: 0; padding: 10px 14px; border-radius: 8px;
            background: transparent; border: 1px solid rgba(34,197,94,0.25);
            color: #94a3b8; font-family: Montserrat, sans-serif; font-weight: 700;
            font-size: 12px; cursor: pointer; white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
