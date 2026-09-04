'use client';

import { useEffect, useRef, useState } from 'react';
import { BOT_TREE, BOT_START, type BotNode, type BotOption } from '@/data/enciclopedia-bot';
import { S } from './_shared';

interface Msg { from: 'bot' | 'user'; text: string }

export default function EnciclopediaBot() {
  const [messages, setMessages] = useState<Msg[]>([{ from: 'bot', text: BOT_TREE[BOT_START].message }]);
  const [current, setCurrent] = useState<BotNode>(BOT_TREE[BOT_START]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function pick(opt: BotOption) {
    const next = BOT_TREE[opt.to];
    if (!next) return;
    setMessages(prev => [...prev, { from: 'user', text: opt.label }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: next.message }]);
      setCurrent(next);
    }, 240);
  }

  function reset() {
    setMessages([{ from: 'bot', text: BOT_TREE[BOT_START].message }]);
    setCurrent(BOT_TREE[BOT_START]);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>🤖 Larvi Pro</h2>
          <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.6, maxWidth: 460 }}>
            Tu guía del ciclo completo. Elige una opción: cubre cada etapa, las dudas frecuentes y el diagnóstico de problemas.
          </p>
        </div>
        <button
          onClick={reset}
          style={{ flexShrink: 0, background: 'transparent', border: `1px solid ${S.border}`, color: S.muted, borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
        >
          ↺ Empezar de nuevo
        </button>
      </div>

      <div
        style={{
          background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          maxWidth: 620,
        }}
      >
        {/* Mensajes */}
        <div ref={scrollRef} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 440, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '88%', padding: '10px 13px',
                  borderRadius: m.from === 'bot' ? '4px 13px 13px 13px' : '13px 4px 13px 13px',
                  background: m.from === 'bot' ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.22)',
                  border: `1px solid ${S.border}`,
                  fontSize: 13, lineHeight: 1.6, color: S.text, whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Opciones */}
        {current.options && current.options.length > 0 && (
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', gap: 6, background: S.navy }}>
            {current.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => pick(opt)}
                style={{
                  padding: '9px 12px', textAlign: 'left',
                  background: opt.to === 'start' || opt.label.startsWith('←') ? 'transparent' : 'rgba(30,48,80,0.8)',
                  border: `1px solid ${S.border}`, borderRadius: 8,
                  color: opt.to === 'start' || opt.label.startsWith('←') ? S.muted : '#cbd5e1',
                  fontSize: 12.5, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 500,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
