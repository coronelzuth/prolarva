'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

const modules = [
  {
    id: 'conocimiento',
    href: '/conocimiento',
    icon: '🧠',
    title: 'Conocimiento General',
    subtitle: 'El ciclo completo de la BSF',
    description: 'Aprende las 8 etapas del ciclo de vida: desde el huevo hasta el adulto. Temperatura ideal, duración, cuidados y alertas por etapa.',
    color: '#22c55e',
    time: '15 min',
    tag: 'Módulo 1',
  },
  {
    id: 'preparacion',
    href: '/preparacion',
    icon: '🛠️',
    title: 'Preparaciones Previas',
    subtitle: 'Diagnóstico de lo que tienes y te falta',
    description: 'Quiz interactivo que evalúa tu clima, espacio, utensilios e insumos. Te dice exactamente qué ya tienes listo y qué necesitas conseguir.',
    color: '#f59e0b',
    time: '5 min',
    tag: 'Módulo 2',
  },
  {
    id: 'metas',
    href: '/metas',
    icon: '🎯',
    title: 'Elige tu Meta',
    subtitle: '3 rutas de producción',
    description: 'Alimentar animales, producir harina o ciclo cerrado continuo. Cada meta tiene su guía paso a paso según tu objetivo.',
    color: '#10b981',
    time: '10 min',
    tag: 'Módulo 3',
  },
];

const metaNames: Record<string, string> = {
  animales: '🐔 Alimentar Animales',
  harina: '🌾 Producir Harina',
  cosecha: '♻️ Ciclo Cerrado',
};

export default function Home() {
  const { progress, overallPercent, loaded } = useProgress();

  const getModuleStatus = (id: string) => {
    if (progress.modulesCompleted.includes(id)) return 'completed';
    if (progress.modulesVisited.includes(id)) return 'visited';
    return 'pending';
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
          <span>🪲</span>
          <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 600 }}>Mosca Soldado Negra · BSF</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
          Tu ruta de aprendizaje{' '}
          <span style={{ background: 'linear-gradient(135deg,#4ade80,#16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BSF completa
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Desde cero hasta tu primera cosecha. Aprende el ciclo, diagnostica tu preparación y elige tu ruta de producción.
        </p>
        {loaded && overallPercent > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 20px' }}>
            <div style={{ width: 120, height: 6, background: '#1e3050', borderRadius: 3 }}>
              <div style={{ width: `${overallPercent}%`, height: '100%', background: 'linear-gradient(90deg,#10b981,#16a34a)', borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{overallPercent}% completado</span>
          </div>
        )}
        {loaded && progress.selectedMeta && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>
            Meta actual: <strong style={{ color: '#4ade80' }}>{metaNames[progress.selectedMeta]}</strong>
            {' · '}
            <Link href="/metas" style={{ color: '#22c55e', textDecoration: 'none' }}>ver guía →</Link>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        {modules.map((mod, idx) => {
          const status = getModuleStatus(mod.id);
          return (
            <div
              key={mod.id}
              style={{
                background: 'rgba(21,32,53,0.7)', border: `1px solid ${status === 'completed' ? mod.color + '60' : 'rgba(34,197,94,0.15)'}`,
                borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden', cursor: 'pointer',
              }}
            >
              {status === 'completed' && (
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                  ✓ Completado
                </div>
              )}
              {status !== 'completed' && (
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${mod.color}20`, color: mod.color }}>
                  {mod.tag}
                </div>
              )}
              <div style={{ marginTop: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{mod.icon}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Paso {idx + 1} · {mod.time}</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#f1f5f9' }}>{mod.title}</h2>
                <div style={{ fontSize: 13, color: mod.color, fontWeight: 600, marginBottom: 10 }}>{mod.subtitle}</div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{mod.description}</p>
              </div>
              <div style={{ marginTop: 20, height: 1, background: 'rgba(34,197,94,0.1)', marginBottom: 16 }} />
              <Link
                href={mod.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: status === 'completed' ? 'rgba(16,185,129,0.15)' : `linear-gradient(135deg,${mod.color},${mod.color}cc)`,
                  color: status === 'completed' ? '#10b981' : 'white',
                  padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
                  fontWeight: 700, fontSize: 13,
                  border: status === 'completed' ? '1px solid rgba(16,185,129,0.3)' : 'none',
                }}
              >
                {status === 'completed' ? 'Revisar' : status === 'visited' ? 'Continuar' : 'Empezar'} →
              </Link>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { icon: '⏱️', value: '30 min', label: 'Ruta completa' },
          { icon: '📋', value: '3 metas', label: 'Para elegir' },
          { icon: '🤖', value: 'Larvi', label: 'Asistente 24/7' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '16px 12px', background: 'rgba(21,32,53,0.5)', borderRadius: 12, border: '1px solid rgba(34,197,94,0.1)' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#4ade80' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
