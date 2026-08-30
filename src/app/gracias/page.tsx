'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GraciasPage() {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = '/colonia'; }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🪲</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: '#f1f5f9' }}>¡Mensaje enviado!</h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, marginBottom: 20 }}>
          Juliana te escribirá por WhatsApp en las próximas horas. Mientras tanto, mira el <strong style={{ color: '#4ade80' }}>Programa Colonia</strong>: 5 semanas en vivo para tener tu primera colonia BSF funcionando.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 20px', marginBottom: 28 }}>
          <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>✓ Redirigiendo en unos segundos…</span>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/colonia" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', padding: '13px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>
            Ver el Programa Colonia →
          </Link>
          <Link href="/calculadora" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#4ade80', border: '1.5px solid rgba(34,197,94,0.35)', padding: '13px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Calculadora BSF
          </Link>
        </div>
        <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
          O <Link href="/" style={{ color: '#22c55e', textDecoration: 'none' }}>vuelve al inicio</Link>
        </p>
      </div>
    </div>
  );
}
