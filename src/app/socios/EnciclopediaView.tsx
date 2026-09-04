'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { S } from './_shared';
import EnciclopediaBot from './EnciclopediaBot';
import {
  CicloSection, CriaSection, RutasSection,
  AlimentacionSection, ProcesamientoSection, LowCostSection,
  VocabularioSection, GaleriaSection,
} from './EnciclopediaSections';
import { searchEnciclopedia, type SearchHit } from './enciclopediaSearch';

export type EncSec =
  | 'inicio' | 'bot' | 'ciclo' | 'cria' | 'rutas'
  | 'alimentacion' | 'procesamiento' | 'lowcost' | 'vocabulario' | 'galeria';

const SECCIONES: { key: EncSec; icon: string; label: string; desc: string }[] = [
  { key: 'bot',           icon: '🤖', label: 'Larvi Pro',          desc: 'Pregúntale por el ciclo, dudas y diagnóstico de problemas.' },
  { key: 'ciclo',         icon: '🔄', label: 'El ciclo',            desc: 'Las 8 etapas de la BSF, con fotos, videos y cuidados.' },
  { key: 'cria',          icon: '🌾', label: 'Cría paso a paso',    desc: 'Del huevo a la cosecha en 18 días, y cómo cerrar el ciclo.' },
  { key: 'rutas',         icon: '🎯', label: 'Rutas de producción', desc: 'Alimentar animales, producir harina o ciclo cerrado.' },
  { key: 'alimentacion',  icon: '🥗', label: 'Qué darles / qué NO', desc: 'Sustratos por nivel proteico, porciones y lo prohibido.' },
  { key: 'procesamiento', icon: '🏭', label: 'Procesamiento',       desc: 'Larva viva vs. harina seca: paso a paso y comparación.' },
  { key: 'lowcost',       icon: '💸', label: 'Low cost',            desc: 'Sistemas de $0 a $10 con materiales reciclados.' },
  { key: 'vocabulario',   icon: '📖', label: 'Vocabulario',         desc: 'Todos los términos del mundo de la larva, buscables.' },
  { key: 'galeria',       icon: '🖼️', label: 'Mega galería',        desc: 'Referencia visual para reconocer todo a simple vista.' },
];

const VALID_SECS: EncSec[] = ['inicio', ...SECCIONES.map(s => s.key)];
const safeSec = (s?: string): EncSec => (s && VALID_SECS.includes(s as EncSec) ? (s as EncSec) : 'inicio');

export default function EnciclopediaView({ initialSection = 'inicio' }: { initialSection?: EncSec }) {
  const [sec, setSec]           = useState<EncSec>(safeSec(initialSection));
  const [q, setQ]               = useState('');
  const [vocabQuery, setVocabQuery] = useState('');
  const skipTop = useRef(false);

  useEffect(() => { setSec(safeSec(initialSection)); }, [initialSection]);

  // Mantener la URL en sync para poder compartir / recargar una sección
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    u.searchParams.set('v', 'enciclopedia');
    if (sec === 'inicio') u.searchParams.delete('sec');
    else u.searchParams.set('sec', sec);
    window.history.replaceState(window.history.state, '', u.toString());
  }, [sec]);

  // Al cambiar de sección subir el scroll — salvo que vayamos a un ancla concreta
  useEffect(() => {
    if (skipTop.current) { skipTop.current = false; return; }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [sec]);

  const buscando = q.trim().length >= 2;
  const results: SearchHit[] = useMemo(() => (buscando ? searchEnciclopedia(q) : []), [q, buscando]);

  function goToHit(h: SearchHit) {
    setQ('');
    if (h.term) setVocabQuery(h.term);
    if (h.anchor) skipTop.current = true;
    setSec(h.section);
    if (h.anchor) {
      setTimeout(() => document.getElementById(h.anchor!)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 70);
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  function irSeccion(k: EncSec) {
    setQ('');
    setSec(k);
  }

  return (
    <div className="enc-outer">
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>📚 Enciclopedia BSF</h1>
        <p style={{ color: S.muted, fontSize: 13, marginTop: 4, maxWidth: 560, lineHeight: 1.6 }}>
          Todo lo que necesitas saber sobre la larva soldado negra en un solo lugar: el ciclo, la cría, la comida, el procesamiento y los montajes baratos.
        </p>
      </div>

      {/* Buscador global */}
      <div style={{ position: 'relative', marginBottom: 18, maxWidth: 520 }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar en toda la enciclopedia…"
          style={{
            width: '100%', padding: '11px 38px 11px 14px', borderRadius: 10,
            border: `1.5px solid ${buscando ? 'rgba(34,197,94,0.5)' : S.border}`,
            background: S.navy2, color: S.text,
            fontFamily: 'Montserrat, sans-serif', fontSize: 13, outline: 'none',
          }}
        />
        {q && (
          <button
            onClick={() => setQ('')}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: 14, padding: 4 }}
          >✕</button>
        )}
      </div>

      {/* Resultados de búsqueda — reemplazan el contenido normal */}
      {buscando ? (
        <div>
          <div style={{ fontSize: 12, color: S.muted, marginBottom: 14 }}>
            {results.length === 0
              ? <>Sin resultados para <strong style={{ color: S.text }}>“{q.trim()}”</strong>.</>
              : <>{results.length} resultado{results.length !== 1 ? 's' : ''} para <strong style={{ color: S.text }}>“{q.trim()}”</strong></>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((h, i) => (
              <button
                key={i}
                onClick={() => goToHit(h)}
                style={{
                  textAlign: 'left', background: S.navy2, border: `1px solid ${S.border}`,
                  borderRadius: 12, padding: '12px 14px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{h.title}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: S.green2, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 5, padding: '1px 6px' }}>
                    {h.icon} {h.sectionLabel}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {h.snippet}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Nav móvil — selector nativo (sin scroll horizontal) */}
          <div className="enc-mob-nav">
            {sec !== 'inicio' && (
              <button className="enc-idx-btn" onClick={() => irSeccion('inicio')}>‹ Índice</button>
            )}
            <select
              className="enc-sel"
              value={sec}
              onChange={e => irSeccion(e.target.value as EncSec)}
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
                    onClick={() => irSeccion(s.key)}
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
                    Si ya tienes larvas y algo no cuadra, abre <strong style={{ color: S.text }}>Larvi Pro</strong>. Y si buscas algo puntual, usa el buscador de arriba.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                    {SECCIONES.map(s => (
                      <button
                        key={s.key}
                        onClick={() => irSeccion(s.key)}
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
              {sec === 'vocabulario' && <VocabularioSection key={vocabQuery || 'v'} initialQuery={vocabQuery} />}
              {sec === 'galeria' && <GaleriaSection />}
            </div>
          </div>
        </>
      )}

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
