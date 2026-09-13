'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { S, cardStyle, btnPrimary, btnOutline, inputStyle, labelStyle } from '@/app/socios/_shared';

const WA = '573223212293';
const STORAGE_KEY = 'prl-tripwire-session';

interface TwSession {
  codigo: string;
  nombre: string;
  l1: boolean;
  l2: boolean;
  l3: boolean;
  coloniaCanjeado: boolean;
}

interface Leccion { n: 1 | 2 | 3; titulo: string; duracion: string; videoUrl: string; disponible: boolean }

const LECCIONES_FALLBACK: Leccion[] = [
  { n: 1, titulo: 'El ciclo y por qué esto es dinero',                    duracion: '6–8 min', videoUrl: '', disponible: false },
  { n: 2, titulo: 'Arma tu sistema mínimo sin ahogarla',                  duracion: '6–8 min', videoUrl: '', disponible: false },
  { n: 3, titulo: 'Lo que viene — y por qué no deberías hacerlo solo',    duracion: '5–6 min', videoUrl: '', disponible: false },
];

function campoDe(n: 1 | 2 | 3): 'l1' | 'l2' | 'l3' {
  return n === 1 ? 'l1' : n === 2 ? 'l2' : 'l3';
}

function ArrancaInner() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('c')?.toUpperCase() ?? '';

  const [loaded, setLoaded]           = useState(false);
  const [session, setSession]         = useState<TwSession | null>(null);
  const [codigoInput, setCodigoInput] = useState(codeParam);
  const [loggingIn, setLoggingIn]     = useState(false);
  const [loginError, setLoginError]   = useState('');
  const [lecciones, setLecciones]     = useState<Leccion[]>(LECCIONES_FALLBACK);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch { /* localStorage no disponible */ }
    setLoaded(true);

    fetch('/api/tripwire/lecciones')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.lecciones) && data.lecciones.length > 0) {
          setLecciones(data.lecciones.map((l: { n: 1 | 2 | 3; titulo: string; duracion: string; video_url: string; disponible: boolean }) => ({
            n: l.n, titulo: l.titulo, duracion: l.duracion, videoUrl: l.video_url, disponible: l.disponible,
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (loaded && !session && codeParam) doLogin(codeParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  async function doLogin(codigo: string) {
    if (!codigo.trim()) { setLoginError('Ingresa tu código de acceso'); return; }
    setLoggingIn(true); setLoginError('');
    try {
      const res  = await fetch('/api/tripwire/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo }) });
      const data = await res.json();
      if (data.success) {
        const s: TwSession = { codigo: data.codigo, nombre: data.nombre, l1: data.l1, l2: data.l2, l3: data.l3, coloniaCanjeado: data.coloniaCanjeado };
        setSession(s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      } else {
        setLoginError(data.error ?? 'Código inválido');
      }
    } finally {
      setLoggingIn(false);
    }
  }

  function marcarVista(n: 1 | 2 | 3) {
    if (!session) return;
    const campo = campoDe(n);
    if (session[campo]) return;
    const next = { ...session, [campo]: true };
    setSession(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    fetch('/api/tripwire/marcar-vista', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo: session.codigo, leccion: n }) }).catch(() => {});
  }

  function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
    setCodigoInput('');
  }

  if (!loaded) return null;

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: S.navy }}>
        <div style={{ ...cardStyle, maxWidth: 420, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px' }}>Arranca tu Colonia BSF</h1>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 24 }}>
            Mini-Curso · 3 lecciones cortas para montar tu colonia BSF sin perderla en el intento.
          </p>
          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <label style={labelStyle}>Tu código de acceso</label>
            <input
              style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}
              value={codigoInput}
              onChange={e => setCodigoInput(e.target.value.toUpperCase())}
              placeholder="ARR-XXXXXX"
              onKeyDown={e => { if (e.key === 'Enter') doLogin(codigoInput); }}
            />
          </div>
          {loginError && <p style={{ color: S.red, fontSize: 12, marginBottom: 12 }}>{loginError}</p>}
          <button style={{ ...btnPrimary, width: '100%', opacity: loggingIn ? 0.6 : 1, cursor: loggingIn ? 'not-allowed' : 'pointer' }} onClick={() => doLogin(codigoInput)} disabled={loggingIn}>
            {loggingIn ? 'Entrando...' : 'Entrar a mi clase'}
          </button>
          <p style={{ fontSize: 12, color: S.muted, marginTop: 18 }}>
            ¿Pagaste pero no tienes tu código?{' '}
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola Juliana! Pagué el Mini-Curso Arranca tu Colonia BSF y necesito mi código de acceso.')}`}
              target="_blank" rel="noopener noreferrer" style={{ color: S.green2, fontWeight: 700 }}
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    );
  }

  const vistas = [session.l1, session.l2, session.l3].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: S.navy, padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>🎓 Arranca tu Colonia BSF</h1>
            <p style={{ fontSize: 12, color: S.muted, margin: '2px 0 0' }}>Hola {session.nombre.split(' ')[0]} 👋 — {vistas}/3 lecciones vistas</p>
          </div>
          <button onClick={cerrarSesion} style={{ ...btnOutline, fontSize: 11, padding: '6px 10px', flexShrink: 0 }}>Salir</button>
        </div>

        <div style={{ height: 6, background: S.navy3, borderRadius: 3, overflow: 'hidden', margin: '14px 0 26px' }}>
          <div style={{ width: `${(vistas / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', transition: 'width .4s' }} />
        </div>

        {lecciones.map(l => {
          const vista = session[campoDe(l.n)];
          return (
            <div key={l.n} style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: S.green2, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Lección {l.n} de 3 · {l.duracion}
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, margin: '4px 0 0' }}>{l.titulo}</h2>
                </div>
                {vista && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: S.green2, background: 'rgba(34,197,94,0.12)', padding: '3px 10px', borderRadius: 20, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    ✓ Vista
                  </span>
                )}
              </div>

              {l.disponible ? (
                <video controls preload="none" style={{ width: '100%', borderRadius: 10, background: '#000', display: 'block' }} onEnded={() => marcarVista(l.n)}>
                  <source src={l.videoUrl} />
                </video>
              ) : (
                <div style={{ background: S.navy2, borderRadius: 10, padding: '32px 16px', textAlign: 'center', color: S.muted, fontSize: 13 }}>
                  🎬 Video en producción — vuelve pronto
                </div>
              )}

              {l.disponible && !vista && (
                <button onClick={() => marcarVista(l.n)} style={{ ...btnOutline, marginTop: 12, fontSize: 12 }}>Marcar como vista</button>
              )}
            </div>
          );
        })}

        <div style={{ ...cardStyle, border: `1.5px solid ${S.amber}`, background: 'rgba(245,158,11,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 8px', color: S.amber }}>🌱 Ya diste el primer paso</h3>
          <p style={{ fontSize: 13, color: S.text, lineHeight: 1.6, marginBottom: 10 }}>
            Faltan 2 momentos de alto riesgo donde se pierde el lote: la cosecha y el reinicio del ciclo. El <strong>Curso Colonia</strong> los resuelve en vivo — 5 semanas, 10 clases, pie de cría incluido y acompañamiento por WhatsApp hasta 60 días después de la última clase.
          </p>
          <p style={{ fontSize: 13, color: S.text, marginBottom: 16 }}>
            Precio: <strong>$400.000 COP</strong>. Como ya pagaste este mini-curso, tus <strong style={{ color: S.green2 }}>$19.900 se descuentan completos</strong> de tu cupo.
          </p>
          {session.coloniaCanjeado ? (
            <p style={{ fontSize: 12, color: S.green2, fontWeight: 700, margin: 0 }}>✓ Ya canjeaste tu descuento en Colonia.</p>
          ) : (
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola Juliana! Terminé el Mini-Curso Arranca tu Colonia BSF (código ${session.codigo}) y quiero mi cupo en el Curso Colonia con el descuento de los $19.900.`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              Quiero mi cupo con descuento →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArrancaPage() {
  return (
    <Suspense fallback={null}>
      <ArrancaInner />
    </Suspense>
  );
}
