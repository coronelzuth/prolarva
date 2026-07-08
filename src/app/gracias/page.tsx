'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GraciasPage() {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = '/calculadora'; }, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🪲</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: '#f1f5f9' }}>¡Ya estás dentro!</h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, marginBottom: 28 }}>
          En segundos te redirigimos a la <strong style={{ color: '#4ade80' }}>Calculadora BSF</strong> para que veas exactamente cuánto puedes ahorrar en tu primer ciclo.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 20px', marginBottom: 28 }}>
          <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>✓ Datos recibidos — te contactamos pronto</span>
        </div>
        <div>
          <Link href="/calculadora" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', padding: '13px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
            Ir a la calculadora ahora →
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
          O <Link href="/" style={{ color: '#22c55e', textDecoration: 'none' }}>vuelve al inicio</Link>
        </p>
      </div>
    </div>
  );
}
