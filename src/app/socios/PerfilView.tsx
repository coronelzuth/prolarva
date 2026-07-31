'use client';
import { useState, useRef, useEffect } from 'react';
import { type SocioSession, type Lote, type FeedLog, type Cosecha } from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnSm, btnOutline, btnDanger, Badge, Field, Modal, inputStyle, labelStyle, fmtDate, comprimirImagen } from './_shared';

// ─── Perfil ───────────────────────────────────────────────────────────────────

interface PerfilPub {
  nombre: string;
  ubicacion: string;
  tipo_produccion: string;
  whatsapp_pub: string;
  instagram: string;
  tiktok: string;
  mostrar_directorio: boolean;
}

const TIPOS_PROD = [
  { key: 'Gallinas', emoji: '🐔' },
  { key: 'Cerdos',   emoji: '🐷' },
  { key: 'Peces',    emoji: '🐟' },
  { key: 'Mixto',    emoji: '🌾' },
  { key: 'Otro',     emoji: '⚙️' },
];

function PerfilView({
  session, lotes: _lotes, feeds: _feeds, cosechas: _cosechas, totalKg: _totalKg,
  onUpdateName, onUpdateEmail, onChangePassword, onLaunchTour, onReset, onGuia, onGoAdmin, onLogout,
}: {
  session: SocioSession;
  lotes: Lote[];
  feeds: FeedLog[];
  cosechas: Cosecha[];
  totalKg: number;
  onUpdateName: (nombre: string) => Promise<boolean>;
  onUpdateEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  onChangePassword: (current: string, nueva: string) => Promise<{ ok: boolean; error?: string }>;
  onLaunchTour: () => void;
  onReset: () => void;
  onGuia: () => void;
  onGoAdmin?: () => void;
  onLogout: () => void;
}) {
  const isDemo = session.code === 'DEMO';

  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = session.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [perfil, setPerfil] = useState<PerfilPub>({
    nombre: session.name, ubicacion: '', tipo_produccion: '',
    whatsapp_pub: '', instagram: '', tiktok: '', mostrar_directorio: true,
  });
  const [editOpen,     setEditOpen]     = useState(false);
  const [perfilSaving, setPerfilSaving] = useState(false);
  const [perfilMsg,    setPerfilMsg]    = useState<{ ok: boolean; text: string } | null>(null);

  const [accountOpen, setAccountOpen] = useState(false);
  const [emailVal,    setEmailVal]    = useState(session.email ?? '');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg,    setEmailMsg]    = useState<{ ok: boolean; text: string } | null>(null);

  const [showCurPass,     setShowCurPass]     = useState(false);
  const [showNewPass,     setShowNewPass]     = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg,     setPassMsg]     = useState<{ ok: boolean; text: string } | null>(null);
  const [passOpen,    setPassOpen]    = useState(false);

  const [notifStatus,  setNotifStatus]  = useState<'unsupported' | 'default' | 'granted' | 'denied'>('default');
  const [notifLoading, setNotifLoading] = useState(false);
  const [testLoading,  setTestLoading]  = useState(false);
  const [testMsg,      setTestMsg]      = useState<string | null>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem(`prl-avatar-${session.code}`);
    if (savedAvatar) setAvatar(savedAvatar);

    const savedPerfil = localStorage.getItem(`prl-perfil-pub-${session.code}`);
    if (savedPerfil) {
      try {
        const p = JSON.parse(savedPerfil) as Partial<PerfilPub>;
        setPerfil(prev => ({ ...prev, nombre: session.name, ...p }));
      } catch { /* ignorar */ }
    }

    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setNotifStatus('unsupported');
    } else {
      const perm = Notification.permission as 'default' | 'granted' | 'denied';
      setNotifStatus(perm);
      if (perm === 'granted') {
        navigator.serviceWorker.ready
          .then(reg => reg.pushManager.getSubscription())
          .then(sub => {
            if (sub) {
              fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ socioCode: session.code, subscription: sub.toJSON() }),
              }).catch(() => {});
            } else {
              setNotifStatus('default');
            }
          })
          .catch(() => {});
      }
    }
  }, [session.code, session.name]);

  async function handleSavePerfil() {
    setPerfilSaving(true); setPerfilMsg(null);
    try {
      if (perfil.nombre.trim() !== session.name) await onUpdateName(perfil.nombre.trim());
      const res = await fetch('/api/socios/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: session.code, ...perfil }),
      });
      if (res.ok) {
        localStorage.setItem(`prl-perfil-pub-${session.code}`, JSON.stringify(perfil));
        setPerfilMsg({ ok: true, text: '✅ Perfil actualizado' });
        setEditOpen(false);
        setTimeout(() => setPerfilMsg(null), 3000);
      } else {
        setPerfilMsg({ ok: false, text: '❌ Error al guardar' });
      }
    } catch {
      setPerfilMsg({ ok: false, text: '❌ Error de red' });
    }
    setPerfilSaving(false);
  }

  async function handleSaveEmail() {
    setEmailSaving(true); setEmailMsg(null);
    const res = await onUpdateEmail(emailVal.trim());
    setEmailSaving(false);
    setEmailMsg(res.ok ? { ok: true, text: '✅ Email guardado' } : { ok: false, text: res.error ?? 'Error' });
    if (res.ok) setTimeout(() => setEmailMsg(null), 3000);
  }

  async function handleChangePass() {
    setPassMsg(null);
    if (!currentPass || !newPass || !confirmPass) { setPassMsg({ ok: false, text: 'Completa todos los campos.' }); return; }
    if (newPass !== confirmPass) { setPassMsg({ ok: false, text: 'Las contraseñas nuevas no coinciden.' }); return; }
    if (newPass.length < 6) { setPassMsg({ ok: false, text: 'Mínimo 6 caracteres.' }); return; }
    setPassLoading(true);
    const result = await onChangePassword(currentPass, newPass);
    setPassLoading(false);
    if (result.ok) {
      setPassMsg({ ok: true, text: '✅ Contraseña actualizada correctamente.' });
      setCurrentPass(''); setNewPass(''); setConfirmPass('');
    } else {
      setPassMsg({ ok: false, text: result.error ?? 'Error al cambiar la contraseña.' });
    }
  }

  const eyeBtn = (_show: boolean, _toggle: () => void): React.CSSProperties => ({
    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: S.muted,
    fontSize: 16, padding: '2px', lineHeight: 1,
  });

  async function toggleNotifications() {
    if (notifStatus === 'unsupported') return;
    if (notifStatus === 'granted') {
      setNotifLoading(true);
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ socioCode: session.code }),
        });
      } finally {
        setNotifStatus('default');
        setNotifLoading(false);
      }
      return;
    }
    setNotifLoading(true);
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { setNotifStatus(perm as 'denied'); setNotifLoading(false); return; }
    try {
      const reg = await navigator.serviceWorker.ready;
      try {
        const existing = await reg.pushManager.getSubscription();
        if (existing) await existing.unsubscribe();
      } catch { /* ignorar */ }
      const VAPID_PUBLIC = 'BAgFCZDb8Ns26uwWupdTa7FMmmmuB9X8vxcEdjQWjJx5hORuzNS9ceoGU0xTbXB9Vm0_mS4g7pK8n8bcZTS5iDo';
      let keyArray: Uint8Array;
      try {
        const padding = '='.repeat((4 - (VAPID_PUBLIC.length % 4)) % 4);
        const base64 = (VAPID_PUBLIC + padding).replace(/-/g, '+').replace(/_/g, '/');
        const binary = atob(base64);
        keyArray = Uint8Array.from(binary, c => c.charCodeAt(0));
      } catch (keyErr) {
        setTestMsg('❌ Error interno de key: ' + (keyErr instanceof Error ? keyErr.message : String(keyErr)));
        setNotifLoading(false);
        return;
      }
      let sub: PushSubscription;
      try {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyArray.buffer.slice(keyArray.byteOffset, keyArray.byteOffset + keyArray.byteLength) as ArrayBuffer });
      } catch (subErr) {
        const msg = subErr instanceof Error ? subErr.message : String(subErr);
        setTestMsg('❌ Error suscripción push: ' + msg + ' · SW: ' + (reg.active?.state ?? 'sin SW'));
        setNotifLoading(false);
        return;
      }
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socioCode: session.code, subscription: sub.toJSON() }),
      });
      if (res.ok) {
        setNotifStatus('granted');
      } else {
        setTestMsg('❌ Error al guardar la suscripción. Intenta de nuevo.');
      }
    } catch (err) {
      setTestMsg('❌ No se pudo activar: ' + (err instanceof Error ? err.message : 'error desconocido'));
      setNotifStatus('default');
    }
    setNotifLoading(false);
  }

  async function sendTestNotif() {
    setTestLoading(true);
    setTestMsg(null);
    try {
      const res = await fetch('/api/push/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socio_code: session.code }),
      });
      const data = await res.json();
      if (res.ok && data.sent > 0) {
        setTestMsg('✅ ¡Enviada! Revisa la notificación en tu celular.');
      } else {
        setTestMsg('❌ ' + (data.error ?? 'No se pudo enviar.'));
      }
    } catch {
      setTestMsg('❌ Error de red.');
    }
    setTestLoading(false);
    setTimeout(() => setTestMsg(null), 5000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await comprimirImagen(file);
    setAvatar(compressed);
    localStorage.setItem(`prl-avatar-${session.code}`, compressed);
    window.dispatchEvent(new CustomEvent('prl-avatar-changed', { detail: compressed }));
  }

  return (
    <div style={{ maxWidth: 520 }}>
      {/* Cabecera estilo Instagram */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Avatar — toca para cambiar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid rgba(34,197,94,0.4)' }} />
                : <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 26 }}>{initials}</div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: S.text, marginBottom: 2 }}>{perfil.nombre || session.name}</div>
            {(perfil.tipo_produccion || perfil.ubicacion) && (
              <div style={{ fontSize: 12, color: S.muted, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {[perfil.tipo_produccion, perfil.ubicacion].filter(Boolean).join(' · ')}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {perfil.whatsapp_pub && (
                <a href={`https://wa.me/${perfil.whatsapp_pub.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 18, lineHeight: 1, textDecoration: 'none' }} title="WhatsApp">💬</a>
              )}
              {perfil.instagram && (
                <a href={`https://instagram.com/${perfil.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 18, lineHeight: 1, textDecoration: 'none' }} title="Instagram">📷</a>
              )}
              {perfil.tiktok && (
                <a href={`https://tiktok.com/@${perfil.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 18, lineHeight: 1, textDecoration: 'none' }} title="TikTok">🎵</a>
              )}
            </div>
          </div>
          {/* Botón editar */}
          <button
            onClick={() => setEditOpen(v => !v)}
            style={{ background: 'none', border: `1px solid ${S.border}`, borderRadius: 8, color: S.muted, fontSize: 12, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', flexShrink: 0 }}
          >
            ✏️ Editar
          </button>
        </div>
        {perfilMsg && (
          <div style={{ fontSize: 12, color: perfilMsg.ok ? S.green2 : S.red, marginTop: 10, fontWeight: 600 }}>{perfilMsg.text}</div>
        )}
        {/* Panel editable */}
        {editOpen && (
          <div style={{ marginTop: 16, borderTop: `1px solid ${S.border}`, paddingTop: 16 }}>
            <Field label="Nombre">
              <input style={inputStyle} value={perfil.nombre}
                onChange={e => setPerfil(p => ({ ...p, nombre: e.target.value }))} placeholder="Tu nombre completo" />
            </Field>
            <Field label="Tipo de producción">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TIPOS_PROD.map(t => (
                  <button key={t.key}
                    onClick={() => setPerfil(p => ({ ...p, tipo_produccion: p.tipo_produccion === t.key ? '' : t.key }))}
                    style={{
                      background: perfil.tipo_produccion === t.key ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.08)',
                      border: `1.5px solid ${perfil.tipo_produccion === t.key ? 'rgba(34,197,94,0.5)' : S.border}`,
                      borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      color: perfil.tipo_produccion === t.key ? S.green2 : S.muted, fontFamily: 'Montserrat,sans-serif',
                    }}
                  >{t.emoji} {t.key}</button>
                ))}
              </div>
            </Field>
            <Field label="Ubicación">
              <input style={inputStyle} value={perfil.ubicacion}
                onChange={e => setPerfil(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Ej: Cúcuta, Norte de Santander" />
            </Field>
            <Field label="WhatsApp (número con código de país)">
              <input style={inputStyle} value={perfil.whatsapp_pub}
                onChange={e => setPerfil(p => ({ ...p, whatsapp_pub: e.target.value }))} placeholder="Ej: 573223212293" />
            </Field>
            <Field label="Instagram">
              <input style={inputStyle} value={perfil.instagram}
                onChange={e => setPerfil(p => ({ ...p, instagram: e.target.value }))} placeholder="@tu_usuario" />
            </Field>
            <Field label="TikTok">
              <input style={inputStyle} value={perfil.tiktok}
                onChange={e => setPerfil(p => ({ ...p, tiktok: e.target.value }))} placeholder="@tu_usuario" />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>Aparecer en el directorio de socios</div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Tus compañeros podrán ver tu perfil</div>
              </div>
              <button
                onClick={() => setPerfil(p => ({ ...p, mostrar_directorio: !p.mostrar_directorio }))}
                style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: perfil.mostrar_directorio ? '#22c55e' : S.border, position: 'relative', flexShrink: 0 }}
              >
                <span style={{ position: 'absolute', top: 2, left: perfil.mostrar_directorio ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
              </button>
            </div>
            <button style={{ ...btnPrimary, width: '100%', opacity: perfilSaving ? 0.6 : 1 }}
              disabled={perfilSaving} onClick={handleSavePerfil}>
              {perfilSaving ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        )}
      </div>

      {/* Cuenta y seguridad */}
      {!isDemo && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <button type="button"
            onClick={() => { setAccountOpen(v => !v); setEmailMsg(null); setPassMsg(null); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: S.muted }}>🔐 Cuenta y seguridad</span>
            <span style={{ fontSize: 12, color: S.muted, display: 'inline-block', transform: accountOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          </button>
          {accountOpen && (
            <div style={{ marginTop: 16 }}>
              <Field label="📧 Email (recuperar contraseña)">
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="email" style={{ ...inputStyle, flex: 1 }} value={emailVal}
                    onChange={e => { setEmailVal(e.target.value); setEmailMsg(null); }} placeholder="tu@email.com" />
                  <button
                    style={{ ...btnPrimary, flexShrink: 0, opacity: !emailVal.trim() || emailVal.trim() === (session.email ?? '') || emailSaving ? 0.5 : 1 }}
                    disabled={!emailVal.trim() || emailVal.trim() === (session.email ?? '') || emailSaving}
                    onClick={handleSaveEmail}
                  >{emailSaving ? '...' : 'Guardar'}</button>
                </div>
                {emailMsg && <p style={{ fontSize: 12, marginTop: 8, color: emailMsg.ok ? S.green2 : S.red }}>{emailMsg.text}</p>}
              </Field>
              <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 14 }}>
                <button type="button"
                  onClick={() => { setPassOpen(v => !v); setPassMsg(null); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: passOpen ? 16 : 0 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: S.muted }}>Cambiar contraseña</span>
                  <span style={{ fontSize: 12, color: S.muted, display: 'inline-block', transform: passOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                </button>
                {passOpen && (
                  <div>
                    <Field label="Contraseña actual">
                      <div style={{ position: 'relative' }}>
                        <input type={showCurPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={currentPass} onChange={e => { setCurrentPass(e.target.value); setPassMsg(null); }} placeholder="Tu contraseña actual" />
                        <button type="button" onClick={() => setShowCurPass(v => !v)} style={eyeBtn(showCurPass, () => {})}>{showCurPass ? '🙈' : '👁️'}</button>
                      </div>
                    </Field>
                    <Field label="Nueva contraseña">
                      <div style={{ position: 'relative' }}>
                        <input type={showNewPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={newPass} onChange={e => { setNewPass(e.target.value); setPassMsg(null); }} placeholder="Mínimo 6 caracteres" />
                        <button type="button" onClick={() => setShowNewPass(v => !v)} style={eyeBtn(showNewPass, () => {})}>{showNewPass ? '🙈' : '👁️'}</button>
                      </div>
                    </Field>
                    <Field label="Confirmar nueva contraseña">
                      <div style={{ position: 'relative' }}>
                        <input type={showConfirmPass ? 'text' : 'password'} style={{ ...inputStyle, paddingRight: 40 }} value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setPassMsg(null); }} placeholder="Repite la nueva contraseña" />
                        <button type="button" onClick={() => setShowConfirmPass(v => !v)} style={eyeBtn(showConfirmPass, () => {})}>{showConfirmPass ? '🙈' : '👁️'}</button>
                      </div>
                    </Field>
                    {passMsg && (
                      <div style={{ fontSize: 12, color: passMsg.ok ? S.green : S.red, marginBottom: 12, fontWeight: 600 }}>{passMsg.text}</div>
                    )}
                    <button style={{ ...btnPrimary, width: '100%', opacity: passLoading ? 0.6 : 1 }} disabled={passLoading} onClick={handleChangePass}>
                      {passLoading ? 'Cambiando...' : 'Actualizar contraseña'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notificaciones */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Notificaciones push</div>
        {notifStatus === 'unsupported' ? (
          <div style={{ fontSize: 12, color: S.muted }}>Tu navegador no soporta notificaciones push.</div>
        ) : notifStatus === 'denied' ? (
          <div style={{ fontSize: 12, color: S.amber, lineHeight: 1.6 }}>
            🚫 Bloqueaste las notificaciones. Para activarlas ve a la configuración de tu navegador y permite notificaciones para este sitio.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>
                {notifStatus === 'granted' ? '🔔 Activadas' : '🔕 Desactivadas'}
              </div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                {notifStatus === 'granted'
                  ? 'Recibirás alertas cuando tus lotes se acerquen a cosecha'
                  : 'Actívalas para recibir alertas de cosecha en tu celular'}
              </div>
            </div>
            <button
              style={{
                ...btnPrimary,
                background: notifStatus === 'granted' ? 'rgba(148,163,184,0.15)' : undefined,
                color: notifStatus === 'granted' ? S.muted : '#fff',
                border: notifStatus === 'granted' ? `1px solid ${S.border}` : 'none',
                opacity: notifLoading ? 0.6 : 1,
                flexShrink: 0, padding: '8px 16px',
              }}
              disabled={notifLoading}
              onClick={toggleNotifications}
            >
              {notifLoading ? '...' : notifStatus === 'granted' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        )}
        {testMsg && (
          <div style={{ fontSize: 12, marginTop: 10, color: testMsg.startsWith('✅') ? S.emerald : S.amber, fontWeight: 600 }}>
            {testMsg}
          </div>
        )}
        {notifStatus === 'granted' && (
          <div style={{ marginTop: 10 }}>
            <button
              style={{ ...btnOutline, fontSize: 12, padding: '6px 14px', opacity: testLoading ? 0.6 : 1 }}
              disabled={testLoading}
              onClick={sendTestNotif}
            >
              {testLoading ? 'Enviando...' : '🔔 Enviar notificación de prueba'}
            </button>
          </div>
        )}
      </div>

      {/* Herramientas */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Herramientas</div>
        <button
          style={{ ...btnOutline, width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onGuia}
        >
          <span>📋</span><span>Guía Rápida BSF</span>
        </button>
        <button
          style={{ ...btnOutline, width: '100%', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onLaunchTour}
        >
          <span>🗺️</span><span>Ver guía de la app</span>
        </button>
        <button
          style={{ ...btnDanger, width: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
          onClick={onReset}
        >
          <span>🗑️</span><span>Limpiar mis datos</span>
        </button>
      </div>

      {/* Panel Admin */}
      {session.rol === 'admin' && onGoAdmin && (
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Administración</div>
          <button
            style={{ background: 'rgba(245,158,11,0.1)', color: S.amber, border: '1.5px solid rgba(245,158,11,0.35)', borderRadius: 8, padding: '10px 16px', width: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            onClick={onGoAdmin}
          >
            <span>🔑</span><span>Panel de Administración</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PerfilView;
