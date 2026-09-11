'use client';

import { useState, useEffect } from 'react';

const WA = '573223212293';

const C = {
  bg: '#0d1b2a', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', greenD: '#16a34a',
  text: '#e2e8f0', text2: '#f1f5f9', muted: '#94a3b8',
  border: 'rgba(14,165,233,0.2)', amber: '#f59e0b',
};

interface LeadCaptureProps {
  /** identifica de qué lead magnet vino, ej: 'blog_problemas', 'blog_raciones' */
  fuente: string;
  /** título del bloque, ej: "¿Tienes otro problema en tu granja?" */
  titulo: string;
  /** texto de apoyo debajo del título */
  texto: string;
  /** mensaje base que se abre en WhatsApp (sin el saludo — eso lo arma el componente) */
  waMensaje: string;
  /** texto del botón — default "Escribirle a Juliana →" */
  ctaLabel?: string;
}

/**
 * Botón de captura reutilizable para los lead magnets del blog.
 * Pide nombre + WhatsApp + "¿ya crías BSF?", guarda el lead en Supabase
 * (misma tabla `leads` que la calculadora) y abre WhatsApp con el mensaje armado.
 * `origen` se lee de `?origen=` en la URL (palabra clave del video que trajo la visita).
 */
export default function LeadCapture({ fuente, titulo, texto, waMensaje, ctaLabel }: LeadCaptureProps) {
  const [nombre, setNombre] = useState('');
  const [waNum, setWaNum] = useState('');
  const [criaBsf, setCriaBsf] = useState<'si' | 'no' | null>(null);
  const [origen, setOrigen] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      setOrigen(p.get('origen') || '');
    } catch {
      /* noop */
    }
  }, []);

  function enviar() {
    const saludo = nombre ? `Hola Juliana, soy ${nombre}. ` : 'Hola Juliana 👋 ';
    const msg = saludo + waMensaje;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
    if (nombre || waNum) {
      setEnviado(true);
      fetch('/api/leads/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          whatsapp: waNum,
          fuente,
          tipo_cta: 'blog',
          ya_cria_bsf: criaBsf ?? '',
          origen,
        }),
      }).catch(() => {});
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', border: `2px solid ${C.border}`, borderRadius: 10,
    padding: '11px 13px', fontSize: 14, fontFamily: 'inherit',
    background: C.card2, color: C.text, outline: 'none',
  };

  const pill = (active: boolean): React.CSSProperties => ({
    flex: 1, border: `2px solid ${active ? C.green : C.border}`,
    background: active ? 'rgba(34,197,94,0.14)' : C.card2,
    color: active ? C.greenL : C.muted,
    borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  });

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card}, ${C.card2})`,
      border: '1px solid rgba(34,197,94,0.2)',
      borderRadius: 16, padding: '32px 26px', marginTop: 40,
    }}>
      <h3 style={{ fontSize: 19, fontWeight: 800, color: C.text2, marginBottom: 8, textAlign: 'center' }}>
        {titulo}
      </h3>
      <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, maxWidth: 460, margin: '0 auto 20px', textAlign: 'center' }}>
        {texto}
      </p>

      <div style={{ maxWidth: 380, margin: '0 auto' }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>¿Ya crías larva BSF?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setCriaBsf('si')} style={pill(criaBsf === 'si')}>Sí</button>
            <button onClick={() => setCriaBsf('no')} style={pill(criaBsf === 'no')}>No, todavía</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <input type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={inp} />
          <input type="tel" placeholder="WhatsApp (ej: 311 234 5678)" value={waNum} onChange={e => setWaNum(e.target.value)} style={inp} />
        </div>

        <button
          onClick={enviar}
          style={{
            display: 'block', width: '100%', padding: 14,
            background: C.green, color: '#0a1628', border: 'none',
            borderRadius: 11, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {ctaLabel || 'Escribirle a Juliana →'}
        </button>

        {enviado && (
          <div style={{ marginTop: 10, padding: 11, background: 'rgba(34,197,94,0.1)', borderRadius: 10, fontSize: 13, color: C.green, fontWeight: 700, textAlign: 'center', border: '1px solid rgba(34,197,94,0.3)' }}>
            ✅ ¡Listo! Te contactamos pronto por WhatsApp.
          </div>
        )}
      </div>
    </div>
  );
}
