'use client';
import { useState, useRef } from 'react';
import { S, cardStyle, btnPrimary, btnOutline, inputStyle, labelStyle, Field, Modal, btnSm } from './_shared';

// ─── ResetPasswordScreen ─────────────────────────────────────────────────────

function ResetPasswordScreen({ token, onDone }: { token: string; onDone: () => void }) {
  const [pass,     setPass]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showP,    setShowP]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  async function handleReset() {
    if (!pass || pass.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (pass !== confirm)          { setError('Las contraseñas no coinciden'); return; }
    setError(''); setLoading(true);
    const res  = await fetch('/api/socios/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: pass }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Error al cambiar contraseña'); return; }
    setSuccess(true);
    setTimeout(onDone, 2500);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.07) 0%, #0d1b2a 65%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>🔐</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </h1>
          <p style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Crea tu nueva contraseña</p>
        </div>
        <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem 1.5rem' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <p style={{ fontWeight: 700, color: S.green2 }}>¡Contraseña actualizada!</p>
              <p style={{ color: S.muted, fontSize: 13, marginTop: 6 }}>Redirigiendo al login…</p>
            </div>
          ) : (
            <>
              <Field label="Nueva contraseña">
                <div style={{ position: 'relative' }}>
                  <input type={showP ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" />
                  <button type="button" onClick={() => setShowP(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16 }}>{showP ? '🙈' : '👁️'}</button>
                </div>
              </Field>
              <Field label="Confirmar contraseña">
                <input type={showP ? 'text' : 'password'} style={inputStyle} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite la contraseña" onKeyDown={e => e.key === 'Enter' && !loading && handleReset()} />
              </Field>
              {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10 }}>{error}</p>}
              <button onClick={handleReset} disabled={loading} style={{ ...btnPrimary, width: '100%', padding: '12px', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Actualizando...' : 'Guardar nueva contraseña →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DEMO_FEATURES = [
  { icon: '🪲', title: 'Mis lotes BSF', desc: 'Registra y sigue cada bandeja desde el primer día' },
  { icon: '📊', title: 'Estadísticas', desc: 'Curva de peso, cosechas y rendimiento por lote' },
  { icon: '📅', title: 'Cronograma', desc: 'Fases de progreso y alertas de cosecha' },
  { icon: '💰', title: 'Mis ventas', desc: 'Ingresos, compradores y control de pedidos' },
];

function LoginScreen({ onLogin, onSwitchToRegister }: { onLogin: (code: string, pass: string) => Promise<boolean>; onSwitchToRegister: () => void }) {
  const [code, setCode] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const attempt = async () => {
    if (!code || !pass) { setError('Completa todos los campos'); return; }
    setError('');
    setLoading(true);
    const success = await onLogin(code, pass);
    setLoading(false);
    if (!success) { setError('Código o contraseña incorrectos.'); }
  };

  async function handleForgot() {
    if (!forgotEmail) return;
    setForgotLoading(true);
    await fetch('/api/socios/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    setForgotLoading(false);
    setForgotSent(true);
  }

  const tryDemo = async () => {
    if (loading) return;
    setLoading(true);
    await onLogin('DEMO', 'demo');
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.07) 0%, #0d1b2a 65%)', overflowX: 'hidden' }}>

      {/* Hero compacto */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem 1.25rem' }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🪲</div>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>
          Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
        </h1>
        <p style={{ fontSize: 10, color: S.emerald, fontWeight: 800, letterSpacing: '0.14em', marginTop: 3 }}>ZONA DE SOCIOS</p>
      </div>

      {/* Card principal de login */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 16, padding: '1.75rem 1.5rem', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>

          <Field label="Código de socio o email">
            <input
              style={inputStyle} value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && attempt()}
              placeholder="ej. SOCIO-001" autoComplete="off" disabled={loading}
            />
          </Field>
          <Field label="Contraseña">
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: 40 }}
                type={showPass ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && attempt()}
                placeholder="••••••••" disabled={loading}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </Field>

          {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}

          <button
            style={{ ...btnPrimary, width: '100%', padding: '12px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={attempt} disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar a mi zona →'}
          </button>

          {/* Forgot password */}
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            {!showForgot ? (
              <button onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textDecoration: 'underline' }}>
                ¿Olvidaste tu contraseña?
              </button>
            ) : forgotSent ? (
              <p style={{ fontSize: 12, color: S.green2, margin: 0 }}>✅ Si el email está registrado, recibirás un enlace para recuperarla.</p>
            ) : (
              <div style={{ marginTop: 4 }}>
                <input style={{ ...inputStyle, marginBottom: 8 }} type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="tu@email.com" disabled={forgotLoading} onKeyDown={e => e.key === 'Enter' && !forgotLoading && handleForgot()} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowForgot(false)} style={{ ...btnOutline, flex: 1, fontSize: 12 }}>Cancelar</button>
                  <button onClick={handleForgot} disabled={forgotLoading || !forgotEmail} style={{ ...btnPrimary, flex: 1, fontSize: 12, opacity: forgotLoading || !forgotEmail ? 0.6 : 1 }}>
                    {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: S.border }} />
            <span style={{ fontSize: 11, color: '#475569' }}>o</span>
            <div style={{ flex: 1, height: 1, background: S.border }} />
          </div>

          {/* Demo — secundario pero claro */}
          <button
            onClick={tryDemo} disabled={loading}
            style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'transparent', color: '#f59e0b', border: '1.5px solid rgba(245,158,11,0.35)', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            👀 Explorar en modo demo
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#475569', marginTop: 6 }}>
            Sin registrarte · Los datos no se guardan en el servidor
          </p>

          <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 14, paddingTop: 14, textAlign: 'center' }}>
            <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textDecoration: 'underline' }}>
              ¿Eres nuevo? Crear cuenta como socio
            </button>
          </div>
        </div>
      </div>

      {/* Preview — qué hay adentro (referencial, al fondo) */}
      <div style={{ maxWidth: 420, margin: '1.5rem auto 0', padding: '0 1.25rem 2.5rem' }}>
        <p style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>Qué vas a encontrar adentro</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {DEMO_FEATURES.map(f => (
            <div key={f.title} style={{ background: 'rgba(15,30,48,0.6)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: 10, padding: '12px 10px' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onRegister, onSwitchToLogin, invitacionPrevia }: { onRegister: (email: string, nombre: string, password: string, codigoInvitacion: string) => Promise<{ success: boolean; error?: string }>; onSwitchToLogin: () => void; invitacionPrevia?: string }) {
  const [codigoInvitacion, setCodigoInvitacion] = useState(invitacionPrevia ?? '');
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!codigoInvitacion || !email || !nombre || !password || !confirmPass) {
      setError('Completa todos los campos');
      return;
    }
    if (password !== confirmPass) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    setLoading(true);
    const result = await onRegister(email, nombre, password, codigoInvitacion);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Error al registrarse');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at 60% 30%, rgba(34,197,94,0.06) 0%, #0d1b2a 70%)' }}>
      <div style={{ background: S.navy2, border: `1px solid ${S.border}`, borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪲</div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>
            Pro<span style={{ color: S.green, fontStyle: 'normal' }}>Larva</span>
          </h1>
          <p style={{ fontSize: 12, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>REGISTRO DE SOCIO</p>
        </div>

        {/* Invitación — campo destacado primero */}
        <div style={{ background: 'rgba(34,197,94,0.06)', border: `1.5px solid rgba(34,197,94,0.25)`, borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: S.emerald, fontWeight: 700, letterSpacing: '0.05em' }}>CÓDIGO DE INVITACIÓN</div>
            {invitacionPrevia && <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.2)', color: S.green, borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>✓ Aplicado</span>}
          </div>
          <input
            style={{ ...inputStyle, background: 'transparent', border: 'none', padding: '4px 0', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', color: invitacionPrevia ? S.green : S.green2, cursor: invitacionPrevia ? 'default' : 'text' }}
            value={codigoInvitacion}
            onChange={e => !invitacionPrevia && setCodigoInvitacion(e.target.value.toUpperCase())}
            placeholder="PRL-XXXXXX"
            autoComplete="off"
            readOnly={!!invitacionPrevia}
            disabled={loading && !invitacionPrevia}
          />
          <div style={{ fontSize: 10, color: S.muted, marginTop: 4 }}>
            {invitacionPrevia ? 'Tu invitación está lista. Completá tus datos para acceder.' : 'Solicitalo a la comunidad ProLarva para acceder.'}
          </div>
        </div>

        <Field label="Nombre completo">
          <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" disabled={loading} />
        </Field>
        <Field label="Email">
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" disabled={loading} />
        </Field>
        <Field label="Contraseña">
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
            <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </Field>
        <Field label="Confirmar contraseña">
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 40 }} type={showConfirm ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && !loading && attempt()} disabled={loading} />
            <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: 16, padding: '2px', lineHeight: 1 }}>
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </Field>

        {error && <p style={{ color: S.red, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}

        <button style={{ ...btnPrimary, width: '100%', padding: '12px', marginTop: 4, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} onClick={attempt} disabled={loading}>
          {loading ? 'Registrando...' : 'Crear mi cuenta'}
        </button>

        <div style={{ borderTop: `1px solid ${S.border}`, marginTop: 18, paddingTop: 18, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: S.muted, marginBottom: 10 }}>¿Ya tienes cuenta?</p>
          <button style={{ ...btnOutline, width: '100%' }} onClick={onSwitchToLogin}>
            Entrar a mi zona
          </button>
        </div>
      </div>
    </div>
  );
}

export { LoginScreen, RegisterScreen, ResetPasswordScreen };
