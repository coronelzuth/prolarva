'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { quizQuestions, analyzeDiagnostic } from '@/data/quiz';
import { useProgress } from '@/hooks/useProgress';

export default function PreparacionPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { markVisited, markCompleted, saveQuizAnswers, progress } = useProgress();

  useEffect(() => {
    markVisited('preparacion');
    if (progress.quizCompleted && Object.keys(progress.quizAnswers).length > 0) {
      setAnswers(progress.quizAnswers);
      setShowResult(true);
    }
  }, [markVisited, progress.quizCompleted, progress.quizAnswers]);

  const currentQ = quizQuestions[currentIdx];
  const totalQ = quizQuestions.length;
  const progressPct = Math.round((Object.keys(answers).length / totalQ) * 100);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (currentIdx < totalQ - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 280);
    } else {
      saveQuizAnswers(newAnswers);
      markCompleted('preparacion');
      setShowResult(true);
    }
  };

  const restart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
  };

  if (showResult && Object.keys(answers).length > 0) {
    const result = analyzeDiagnostic(answers);
    const pct = Math.round((result.score / result.maxScore) * 100);
    const selectedMeta = answers['meta'];
    const metaLabels: Record<string, string> = {
      animales: '🐔 Alimentar Animales',
      harina: '🌾 Producir Harina',
      cosecha: '♻️ Ciclo Cerrado',
    };

    return (
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '40px 20px 80px' }}>
        <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>← Inicio</Link>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {pct >= 75 ? '🚀' : pct >= 50 ? '🌱' : '📋'}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Tu Diagnóstico</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '10px 24px' }}>
            <div style={{ width: 140, height: 6, background: '#1e3050', borderRadius: 3 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: pct >= 75 ? 'linear-gradient(90deg,#10b981,#16a34a)' : pct >= 50 ? 'linear-gradient(90deg,#f59e0b,#22c55e)' : 'linear-gradient(90deg,#ef4444,#f59e0b)', borderRadius: 3 }} />
            </div>
            <span style={{ fontWeight: 800, color: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444', fontSize: 16 }}>{pct}% listo</span>
          </div>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 10 }}>
            {pct >= 75 ? '¡Estás muy bien preparado para empezar!' : pct >= 50 ? 'Tienes una base sólida, solo faltan algunos detalles.' : 'Hay cosas importantes por preparar antes de empezar.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {result.ready.length > 0 && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 10, fontSize: 13 }}>✅ YA TIENES</div>
              {result.ready.map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span> {item}
                </div>
              ))}
            </div>
          )}

          {(result.needsWork.length > 0 || result.missing.length > 0) && (
            <div style={{ background: 'rgba(21,32,53,0.6)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: 18 }}>
              {result.needsWork.length > 0 && (
                <>
                  <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 10, fontSize: 13 }}>⚡ MEJORAR</div>
                  {result.needsWork.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#f59e0b', flexShrink: 0 }}>~</span> {item}
                    </div>
                  ))}
                </>
              )}
              {result.missing.length > 0 && (
                <>
                  <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 10, fontSize: 13, marginTop: result.needsWork.length > 0 ? 12 : 0 }}>❌ FALTA</div>
                  {result.missing.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#ef4444', flexShrink: 0 }}>✗</span> {item}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Recommendation card */}
        {(() => {
          type Rec = { href: string; icon: string; tag: string; title: string; reason: string };
          let rec: Rec;
          if (result.knowledgeGap) {
            rec = { href: '/conocimiento', icon: '🧠', tag: 'Módulo 1', title: 'Conocimiento General', reason: 'Antes de empezar necesitas entender el ciclo BSF completo. Te tomará solo 15 minutos.' };
          } else if (selectedMeta) {
            rec = { href: '/metas', icon: '🎯', tag: 'Módulo 3', title: 'Establecer objetivo', reason: `Ya tienes una base sólida. Confirma tu objetivo de producción y accede a tu guía personalizada.` };
          } else {
            rec = { href: '/metas', icon: '🎯', tag: 'Módulo 3', title: 'Elige tu Meta', reason: 'Con este diagnóstico ya sabes dónde estás. Elige tu ruta de producción y recibe una guía personalizada.' };
          }
          return (
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>📍 Tu próximo paso recomendado</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>{rec.icon}</div>
                <div>
                  <div style={{ display: 'inline-flex', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 10px', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{rec.tag}</span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#f1f5f9', marginBottom: 5, lineHeight: 1.3 }}>{rec.title}</div>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{rec.reason}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={rec.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                  Ir ahora →
                </Link>
                {!result.knowledgeGap && !selectedMeta && (
                  <Link href="/conocimiento" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', color: '#94a3b8', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13, border: '1px solid rgba(34,197,94,0.15)' }}>
                    🧠 Repasar Módulo 1
                  </Link>
                )}
              </div>
            </div>
          );
        })()}

        <button onClick={restart} style={{ background: 'none', border: '1px solid rgba(34,197,94,0.2)', color: '#64748b', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }}>
          Repetir diagnóstico
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px 80px' }}>
      <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>← Inicio</Link>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>Módulo 2 · Diagnóstico</span>
        </div>
        <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900, marginBottom: 8 }}>🛠️ ¿Estás listo para empezar?</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
          {totalQ} preguntas rápidas. Al final sabrás exactamente qué tienes listo y qué necesitas conseguir. No hay respuestas correctas — es solo para orientarte.
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 4, background: '#1e3050', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#f59e0b,#22c55e)', borderRadius: 2, transform: `scaleX(${progressPct / 100})`, transformOrigin: 'left', transition: 'transform 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, flexShrink: 0 }}>{currentIdx + 1} / {totalQ}</span>
      </div>

      {/* Question card */}
      <div style={{ background: 'rgba(21,32,53,0.8)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>{currentQ.categoryIcon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{currentQ.category}</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: currentQ.detail ? 8 : 20, lineHeight: 1.4 }}>
          {currentQ.question}
        </h2>
        {currentQ.detail && (
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5, borderLeft: '2px solid rgba(34,197,94,0.3)', paddingLeft: 12 }}>
            {currentQ.detail}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentQ.options.map((opt) => {
            const selected = answers[currentQ.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12,
                  background: selected ? 'rgba(34,197,94,0.15)' : 'rgba(30,48,80,0.5)',
                  border: `1px solid ${selected ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.15)'}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: selected ? '#4ade80' : '#e2e8f0' }}>{opt.label}</div>
                  {opt.tip && !selected && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{opt.tip}</div>
                  )}
                </div>
                {selected && <span style={{ marginLeft: 'auto', color: '#4ade80', fontSize: 16 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          style={{ background: 'none', border: '1px solid rgba(34,197,94,0.2)', color: currentIdx === 0 ? '#334155' : '#64748b', padding: '8px 16px', borderRadius: 8, cursor: currentIdx === 0 ? 'default' : 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }}
        >
          ← Anterior
        </button>
        <div style={{ fontSize: 12, color: '#334155' }}>
          {Object.keys(answers).length} respondidas
        </div>
        {answers[currentQ.id] && currentIdx < totalQ - 1 && (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 600 }}
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}
