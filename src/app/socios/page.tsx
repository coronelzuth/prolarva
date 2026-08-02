'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EscuelaView from './EscuelaView';
import {
  useSocios,
  uid,
  type Lote,
  type FeedLog,
  type Cosecha,
  type SocioSession,
} from '@/hooks/useSocios';
import { S, cardStyle, btnPrimary, btnSm, btnOutline, btnDanger, inputStyle, labelStyle, Modal, Field, nowLocal, todayLocal, type View } from './_shared';
import Dashboard from './Dashboard';
import LotesView from './LotesView';
import LoteDetail from './LoteDetail';
import CosechaView, { GuiaView } from './CosechaView';
import VentasView from './VentasView';
import MonitorView from './MonitorView';
import EstadisticasView from './EstadisticasView';
import PerfilView from './PerfilView';
import AdminView from './AdminView';
import { LoginScreen, RegisterScreen, ResetPasswordScreen } from './AuthScreens';
import BienvenidaModal from './BienvenidaModal';
import ProtocoloCrisisModal from '@/components/ProtocoloCrisisModal';

// ─── Spotlight tour ───────────────────────────────────────────────────────────

const TOUR_STEPS = [
  { targetId: 'nav-dashboard', title: '🏠 Resumen',   desc: 'Tu panel principal. Aquí aparecen alertas automáticas de cosecha, recordatorios activos y el estado general de tu producción en tiempo real.' },
  { targetId: 'nav-escuela',   title: '🎓 Escuela',   desc: 'Clases del programa, cronograma y foro del grupo. Completa las fases para desbloquear tu Monitor de Producción.' },
  { targetId: 'nav-monitor',   title: '🔬 Monitor',   desc: 'Tu herramienta de trazabilidad BSF. Rastreo de lotes, estadísticas de conversión y cosechas. Se desbloquea al completar la Fase 3.' },
  { targetId: 'nav-perfil',    title: '👤 Mi Perfil', desc: 'Edita tu nombre, cambia tu foto, actualiza tu contraseña y accede a la Guía Rápida BSF desde un solo lugar.' },
];

function SpotlightTour({ step, onNext, onPrev, onDone }: {
  step: number; onNext: () => void; onPrev: () => void; onDone: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vpW,  setVpW]  = useState(0);
  const [vpH,  setVpH]  = useState(0);
  const current = TOUR_STEPS[step];
  const pad = 10;

  useEffect(() => {
    function measure() {
      setVpW(window.innerWidth); setVpH(window.innerHeight);
      for (const sid of [current.targetId, 'm-' + current.targetId]) {
        const el = document.getElementById(sid);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) { setRect(r); return; }
        }
      }
      setRect(null);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [step, current.targetId]);

  let tip: React.CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };
  if (rect) {
    const canRight = rect.right + 316 < vpW;
    const isBottom = rect.top > vpH * 0.6;
    if (canRight) {
      tip = { left: rect.right + 16, top: Math.max(12, Math.min(rect.top + rect.height / 2, vpH - 280)), transform: 'translateY(-50%)' };
    } else if (isBottom) {
      const l = Math.min(Math.max(rect.left + rect.width / 2 - 150, 12), vpW - 316);
      tip = { left: l, bottom: vpH - rect.top + 14 };
    } else {
      const l = Math.min(Math.max(rect.left + rect.width / 2 - 150, 12), vpW - 316);
      tip = { left: l, top: rect.bottom + 14 };
    }
  }

  return (
    <>
      <svg style={{ position: 'fixed', inset: 0, zIndex: 699, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {rect ? (
          <>
            <defs>
              <mask id="tour-spot">
                <rect width="100%" height="100%" fill="white" />
                <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad * 2} height={rect.height + pad * 2} rx="10" fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-spot)" />
            <rect x={rect.left - pad} y={rect.top - pad} width={rect.width + pad * 2} height={rect.height + pad * 2} rx="10" fill="none" stroke="#22c55e" strokeWidth="2.5" />
          </>
        ) : (
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" />
        )}
      </svg>
      <div style={{ position: 'fixed', zIndex: 700, width: 300, background: '#152035', border: '1.5px solid rgba(34,197,94,0.4)', borderRadius: 16, padding: '18px 20px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', fontFamily: 'Montserrat, sans-serif', ...tip }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: S.muted, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
          Paso {step + 1} de {TOUR_STEPS.length}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 900, color: S.text, marginBottom: 8 }}>{current.title}</h3>
        <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, marginBottom: 10 }}>{current.desc}</p>
        <div style={{ fontSize: 11, color: S.emerald, fontWeight: 600, marginBottom: 14 }}>✨ Toca el elemento resaltado para probarlo</div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === step ? S.green : S.border, transition: 'background 0.2s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {step > 0 && <button style={{ ...btnOutline, ...btnSm }} onClick={onPrev}>← Atrás</button>}
          {step < TOUR_STEPS.length - 1
            ? <button style={{ ...btnPrimary, ...btnSm, flex: 1 }} onClick={onNext}>Siguiente →</button>
            : <button style={{ ...btnPrimary, ...btnSm, flex: 1 }} onClick={onDone}>¡Comenzar! 🚀</button>}
        </div>
        <button onClick={onDone} style={{ marginTop: 10, background: 'none', border: 'none', color: S.muted, fontSize: 10, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', width: '100%', textAlign: 'center', textDecoration: 'underline' }}>
          Saltar tour
        </button>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SociosInner() {
  const db = useSocios();
  const searchParams = useSearchParams();
  const invParam   = searchParams.get('inv')?.toUpperCase() ?? undefined;
  const resetParam = searchParams.get('reset') ?? undefined;
  const [authMode, setAuthMode] = useState<'login' | 'register'>(invParam ? 'register' : 'login');
  const [view,        setView]        = useState<View>('dashboard');
  const [monitorSub,  setMonitorSub]  = useState<'lotes' | 'stats'>('lotes');
  const [detailLoteId, setDetailLoteId] = useState<string | null>(null);
  const [showBienvenida,   setShowBienvenida]   = useState(false);
  const [showProtocolo,    setShowProtocolo]    = useState(false);
  const [showOnboarding,   setShowOnboarding]   = useState(false);
  const [onboardingStep,   setOnboardingStep]   = useState(0);
  const [tourMinimized,    setTourMinimized]    = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting,        setResetting]        = useState(false);
  const [anuncio,          setAnuncio]          = useState<string | null>(null);

  const [sidebarAvatar, setSidebarAvatar] = useState<string | null>(null);

  const [modalLote,    setModalLote]    = useState(false);
  const [modalFeed,    setModalFeed]    = useState(false);
  const [modalCosecha, setModalCosecha] = useState(false);
  const [prefillLoteId, setPrefillLoteId] = useState<string | null>(null);

  const [loteError,     setLoteError]     = useState('');
  const [feedError,     setFeedError]     = useState('');
  const [cosechaError,  setCosechaError]  = useState('');
  const [editLoteError, setEditLoteError] = useState('');
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState('');

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2000); }

  const [lObjetivo, setLObjetivo] = useState<'cosechar' | 'continuar'>('cosechar');
  const [editLoteId, setEditLoteId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editFecha,  setEditFecha]  = useState('');

  const lNombre    = useRef<HTMLInputElement>(null);
  const lFecha     = useRef<HTMLInputElement>(null);
  const lSustrato  = useRef<HTMLInputElement>(null);
  const lTipoSust  = useRef<HTMLSelectElement>(null);
  const lHuevos    = useRef<HTMLInputElement>(null);
  const lTemp      = useRef<HTMLInputElement>(null);
  const lNotas     = useRef<HTMLTextAreaElement>(null);

  const fLote      = useRef<HTMLSelectElement>(null);
  const fFecha     = useRef<HTMLInputElement>(null);
  const fCantidad  = useRef<HTMLInputElement>(null);
  const fTipo      = useRef<HTMLSelectElement>(null);
  const fRechazo   = useRef<HTMLSelectElement>(null);
  const fNotas     = useRef<HTMLTextAreaElement>(null);

  const cLote      = useRef<HTMLSelectElement>(null);
  const cFecha     = useRef<HTMLInputElement>(null);
  const cPeso      = useRef<HTMLInputElement>(null);
  const cSustTotal = useRef<HTMLInputElement>(null);
  const cCalidad   = useRef<HTMLSelectElement>(null);
  const cNotas     = useRef<HTMLTextAreaElement>(null);

  async function changePassword(current: string, nueva: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/socios/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: db.session?.code, currentPassword: current, newPassword: nueva }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { ok: false, error: data.error };
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de conexión' };
    }
  }

  useEffect(() => {
    if (db.session && !localStorage.getItem('prl-onboarding-done')) {
      setShowOnboarding(true);
    }
    if (db.session) {
      if (!localStorage.getItem(`prl-bienvenida-vista-${db.session.code}`) && db.session.code !== 'DEMO') {
        setShowBienvenida(true);
      }
      fetch('/api/anuncios/obtener').then(r => r.json()).then(d => { if (d.anuncio) setAnuncio(d.anuncio); }).catch(() => {});
      const saved = localStorage.getItem(`prl-avatar-${db.session.code}`);
      setSidebarAvatar(saved);
    }
  }, [db.session]);

  useEffect(() => {
    function onAvatarChanged(e: Event) {
      setSidebarAvatar((e as CustomEvent<string>).detail);
    }
    window.addEventListener('prl-avatar-changed', onAvatarChanged);
    return () => window.removeEventListener('prl-avatar-changed', onAvatarChanged);
  }, []);

  if (!db.loaded) return null;

  if (resetParam) {
    return <ResetPasswordScreen token={resetParam} onDone={() => { window.history.replaceState({}, '', '/socios'); }} />;
  }

  if (!db.session) {
    if (authMode === 'login') {
      return <LoginScreen onLogin={db.login} onSwitchToRegister={() => setAuthMode('register')} />;
    } else {
      return <RegisterScreen onRegister={(email, nombre, password, inv) => db.register(email, nombre, password, inv)} onSwitchToLogin={() => setAuthMode('login')} invitacionPrevia={invParam} />;
    }
  }

  const detailLote = detailLoteId ? db.lotes.find(l => l.id === detailLoteId) ?? null : null;

  function navTo(v: View) { setView(v); if (showOnboarding) setTourMinimized(true); }
  function viewLote(id: string) { setDetailLoteId(id); setView('lote-detail'); }
  function openFeed(loteId: string | null) { setPrefillLoteId(loteId); setModalFeed(true); }

  async function saveLote() {
    const nombre = lNombre.current?.value.trim() ?? '';
    const fecha  = lFecha.current?.value ?? '';
    if (!nombre || !fecha) { setLoteError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await db.addLote({
      nombre, fecha,
      objetivo:     lObjetivo,
      sustrato:     parseFloat(lSustrato.current?.value ?? '0') || 0,
      tipoSustrato: lTipoSust.current?.value ?? '',
      huevos:       lHuevos.current?.value ?? '',
      temp:         lTemp.current?.value ? parseFloat(lTemp.current.value) : null,
      notas:        lNotas.current?.value ?? '',
    });
    setSaving(false);
    setLoteError('');
    setModalLote(false);
    setLObjetivo('cosechar');
    if (lNombre.current)   lNombre.current.value   = '';
    if (lSustrato.current) lSustrato.current.value = '';
    if (lHuevos.current)   lHuevos.current.value   = '';
    if (lTemp.current)     lTemp.current.value      = '';
    if (lNotas.current)    lNotas.current.value     = '';
    showToast('✅ Lote guardado');
  }

  async function saveEditLote() {
    if (!editLoteId) return;
    const nombre = editNombre.trim();
    if (!nombre || !editFecha) { setEditLoteError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await db.updateLote(editLoteId, { nombre, fecha: editFecha });
    setSaving(false);
    setEditLoteError('');
    setEditLoteId(null);
    showToast('✅ Lote actualizado');
  }

  async function saveFeed() {
    const loteId   = fLote.current?.value ?? '';
    const cantidad = parseFloat(fCantidad.current?.value ?? '0');
    if (!loteId || !cantidad) { setFeedError('Selecciona un lote e ingresa la cantidad.'); return; }
    setSaving(true);
    await db.addFeed({
      loteId, cantidad,
      fecha:    fFecha.current?.value ?? new Date().toISOString(),
      tipo:     fTipo.current?.value ?? '',
      rechazo:  (fRechazo.current?.value ?? 'ninguno') as FeedLog['rechazo'],
      notas:    fNotas.current?.value ?? '',
    });
    setSaving(false);
    setFeedError('');
    setModalFeed(false);
    if (fCantidad.current) fCantidad.current.value = '';
    if (fNotas.current)    fNotas.current.value    = '';
    showToast('✅ Alimentación registrada');
  }

  async function saveCosecha() {
    const loteId = cLote.current?.value ?? '';
    const peso   = parseFloat(cPeso.current?.value ?? '0');
    if (!loteId || !peso) { setCosechaError('Selecciona un lote e ingresa el peso.'); return; }
    setSaving(true);
    await db.addCosecha({
      loteId, peso,
      fecha:         cFecha.current?.value ?? todayLocal(),
      sustratoTotal: parseFloat(cSustTotal.current?.value ?? '0') || 0,
      calidad:       (cCalidad.current?.value ?? 'buena') as Cosecha['calidad'],
      notas:         cNotas.current?.value ?? '',
    });
    setSaving(false);
    setCosechaError('');
    setModalCosecha(false);
    if (cPeso.current)      cPeso.current.value      = '';
    if (cSustTotal.current) cSustTotal.current.value = '';
    if (cNotas.current)     cNotas.current.value     = '';
    showToast('✅ Cosecha registrada');
  }

  async function handleMarcarFase(fase: number) {
    if (!db.session) return;
    try {
      const res = await fetch('/api/socios/marcar-fase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: db.session.code, fase }),
      });
      if (res.ok) {
        db.updateFases(fase);
        showToast(`📩 Fase ${fase} enviada a revisión`);
      } else {
        const d = await res.json();
        showToast(`❌ ${d.error ?? 'Error al enviar fase'}`);
      }
    } catch {
      showToast('❌ Error de conexión');
    }
  }

  async function handleAprobFase(code: string, fase: number) {
    if (!db.session) return;
    try {
      const res = await fetch('/api/socios/aprobar-fase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode: db.session.code, code, fase }),
      });
      if (res.ok) {
        showToast(`✅ Fase ${fase} aprobada`);
      } else {
        const d = await res.json();
        showToast(`❌ ${d.error ?? 'Error al aprobar'}`);
      }
    } catch {
      showToast('❌ Error de conexión');
    }
  }

  const navItems: { key: View; icon: string; label: string }[] = [
    { key: 'dashboard', icon: '🏠', label: 'Resumen' },
    { key: 'escuela',   icon: '🎓', label: 'Escuela' },
    { key: 'monitor',   icon: '🔬', label: 'Monitor' },
    { key: 'ventas',    icon: '💰', label: 'Mis Ventas' },
    { key: 'perfil',    icon: '👤', label: 'Mi Perfil' },
  ];

  const activeView = view === 'lote-detail' ? 'monitor' : view === 'cosecha' ? 'monitor' : view;

  return (
    <div className="socios-wrap" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="socios-sidebar" style={{ width: 220, background: S.navy2, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', zIndex: 40 }}>
        <div style={{ padding: '20px 18px', borderBottom: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>
            Pro<span style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Larva</span>
          </div>
          <div style={{ fontSize: 10, color: S.emerald, fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>ZONA DE SOCIOS</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => {
            const active = activeView === item.key;
            return (
              <div id={`nav-${item.key}`} key={item.key} onClick={() => navTo(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: active ? S.green2 : S.muted, background: active ? 'rgba(34,197,94,0.1)' : 'transparent', borderRadius: active ? 8 : 0, transition: 'all 0.15s' }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '14px 18px', borderTop: `1px solid ${S.border}` }}>
          <button onClick={() => navTo('perfil')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left' }}>
            {sidebarAvatar
              ? <img src={sidebarAvatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(34,197,94,0.4)', flexShrink: 0 }} />
              : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                  {db.session.name[0]}
                </div>
            }
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{db.session.name}</div>
              <div style={{ fontSize: 10, color: S.muted }}>{db.session.code}</div>
            </div>
          </button>
          <button onClick={db.logout} style={{ ...btnOutline, width: '100%', fontSize: 12, padding: '7px' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="socios-main" style={{ flex: 1, minWidth: 0 }}>
        {db.session.code === 'DEMO' && (
          <div style={{ position: 'sticky', top: 0, zIndex: 90, background: 'rgba(180,110,0,0.97)', backdropFilter: 'blur(8px)', padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>👀</span>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: '#fff8e1', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em' }}>MODO DEMO</span>
                <span style={{ color: 'rgba(255,248,225,0.7)', fontSize: 11, marginLeft: 8, display: 'inline' }}> · Nada se guarda en el servidor</span>
              </div>
            </div>
            <button
              onClick={db.logout}
              style={{ background: 'rgba(0,0,0,0.2)', color: '#fff8e1', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Montserrat, sans-serif' }}
            >
              Salir del demo
            </button>
          </div>
        )}
        <div className="socios-content">
        {view === 'dashboard' && (
          <Dashboard
            lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas}
            activeLotes={db.activeLotes} readyLotes={db.readyLotes}
            recordatorios={db.recordatorios}
            totalKg={db.totalKg} avgConv={db.avgConv}
            userName={db.session.name}
            anuncio={anuncio}
            sinEmail={db.session.code !== 'DEMO' && !db.session.email}
            onViewLote={viewLote}
            onNav={navTo}
            onVerProtocolo={() => setShowProtocolo(true)}
          />
        )}
        {view === 'monitor' && (
          <MonitorView
            fasesAprobadas={db.session?.fases_aprobadas ?? 0}
            isAdmin={db.session?.rol === 'admin'}
            monitorSub={monitorSub}
            onSubChange={setMonitorSub}
            lotes={db.lotes} feeds={db.feeds}
            onViewLote={viewLote}
            onNewLote={() => { setModalLote(true); setTimeout(() => { if (lFecha.current) lFecha.current.value = todayLocal(); }, 10); }}
            onDeleteLote={db.deleteLote}
            cosechas={db.cosechas} totalKg={db.totalKg} avgConv={db.avgConv}
          />
        )}
        {view === 'lote-detail' && detailLote && (
          <LoteDetail
            lote={detailLote} feeds={db.feeds} lotes={db.lotes}
            cosechas={db.cosechas}
            recordatorios={db.recordatorios} fotos={db.fotos}
            onBack={() => setView('monitor')} onAddFeed={openFeed}
            onEdit={() => { setEditNombre(detailLote.nombre); setEditFecha(detailLote.fecha); setEditLoteId(detailLote.id); }}
            onAddRecordatorio={db.addRecordatorio}
            onToggleRecordatorio={db.toggleRecordatorio}
            onDeleteRecordatorio={db.deleteRecordatorio}
            onAddFoto={db.addFoto}
            onDeleteFoto={db.deleteFoto}
            onNewCosecha={() => { setModalCosecha(true); setTimeout(() => { if (cFecha.current) cFecha.current.value = todayLocal(); }, 10); }}
          />
        )}
        {view === 'ventas' && (
          <VentasView
            ventas={db.ventasSocios}
            onAdd={db.addVentaSocio}
            onDelete={db.deleteVentaSocio}
          />
        )}
        {view === 'guia'  && <GuiaView />}
        {view === 'escuela' && db.session && (
          <EscuelaView
            socioCode={db.session.code}
            socioNombre={db.session.name}
            isAdmin={db.session.rol === 'admin'}
            fasesAprobadas={db.session.fases_aprobadas ?? 0}
            faseEnRevision={db.session.fase_en_revision ?? 0}
            onMarcarFase={handleMarcarFase}
            onAprobFase={handleAprobFase}
          />
        )}
        {view === 'perfil' && db.session && (
          <PerfilView
            session={db.session}
            lotes={db.lotes}
            feeds={db.feeds}
            cosechas={db.cosechas}
            totalKg={db.totalKg}
            onUpdateName={db.updateName}
            onUpdateEmail={db.updateEmail}
            onChangePassword={changePassword}
            onLaunchTour={() => {
              localStorage.removeItem('prl-onboarding-done');
              setOnboardingStep(0);
              setTourMinimized(false);
              setShowOnboarding(true);
              navTo('dashboard');
            }}
            onReset={() => setShowResetConfirm(true)}
            onGuia={() => navTo('guia')}
            onVerBienvenida={() => {
              if (db.session) localStorage.removeItem(`prl-bienvenida-vista-${db.session.code}`);
              setShowBienvenida(true);
            }}
            onGoAdmin={db.session.rol === 'admin' ? () => navTo('admin') : undefined}
            onLogout={db.logout}
          />
        )}
        {view === 'admin' && db.session.rol === 'admin' && <AdminView adminCode={db.session.code} onBack={() => navTo('perfil')} onLogout={db.logout} />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="socios-mobile-nav">
        {navItems.map(item => {
          const active = activeView === item.key;
          const mobileLabel: Record<string, string> = {
            dashboard: 'Inicio', escuela: 'Escuela',
            monitor: 'Monitor', ventas: 'Ventas',
            perfil: 'Perfil', admin: 'Admin',
          };
          return (
            <div id={`m-nav-${item.key}`} key={item.key} onClick={() => navTo(item.key)} className={`socios-tab${active ? ' socios-tab-active' : ''}`}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{mobileLabel[item.key] ?? item.label}</span>
            </div>
          );
        })}
      </nav>

      <style>{`
        .socios-mobile-nav { display: none; }
        .socios-content { padding: 2rem; }
        @media (max-width: 768px) {
          .socios-wrap { display: block !important; }
          .socios-sidebar { display: none !important; }
          .socios-main { padding: 0 !important; }
          .socios-content { padding: 2rem 1rem 80px !important; }
          .socios-mobile-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: #0f1e30;
            border-top: 1px solid rgba(34,197,94,0.25);
            z-index: 100;
            padding: 6px 0 max(10px, env(safe-area-inset-bottom));
          }
          .socios-tab {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            padding: 4px 2px;
            cursor: pointer;
            color: #64748b;
            font-family: Montserrat, sans-serif;
          }
          .socios-tab span:first-child { font-size: 18px; line-height: 1; }
          .socios-tab span:last-child { font-size: 8px; font-weight: 700; text-align: center; line-height: 1.2; white-space: nowrap; }
          .socios-tab-active { color: #4ade80 !important; }
        }
      `}</style>

      {/* Modal: Nuevo Lote */}
      <Modal open={modalLote} onClose={() => { setModalLote(false); setLObjetivo('cosechar'); setLoteError(''); }} title="📦 Nuevo Lote BSF">
        <Field label="Objetivo del lote">
          <div style={{ display: 'flex', gap: 8 }}>
            {([['cosechar', '⚖️ Cosechar larvas'], ['continuar', '🔄 Continuar camada']] as const).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setLObjetivo(val)} style={{ flex: 1, padding: '10px 6px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, background: lObjetivo === val ? (val === 'cosechar' ? 'rgba(34,197,94,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent', border: `1.5px solid ${lObjetivo === val ? (val === 'cosechar' ? S.green : S.emerald) : S.border}`, color: lObjetivo === val ? (val === 'cosechar' ? S.green2 : S.emerald) : S.muted }}>
                {label}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre / código del lote"><input ref={lNombre} style={inputStyle} placeholder="ej. Lote-07 Julio" /></Field>
          <Field label="Fecha de siembra"><input ref={lFecha} type="date" style={inputStyle} /></Field>
          <Field label="Sustrato inicial (kg)"><input ref={lSustrato} type="number" style={inputStyle} placeholder="ej. 20" min="0" step="0.1" /></Field>
          <Field label="Tipo de sustrato">
            <select ref={lTipoSust} style={inputStyle}>
              <option value="">Selecciona...</option>
              {['Cáscaras de frutas','Restos de verduras','Pulpa de café','Gallinaza','Mezcla orgánica','Otro'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Larvas / huevos iniciales"><input ref={lHuevos} style={inputStyle} placeholder="ej. 5000 larvas L1" /></Field>
          <Field label="Temperatura ambiente (°C)"><input ref={lTemp} type="number" style={inputStyle} placeholder="ej. 30" min="0" max="50" /></Field>
        </div>
        <Field label="Notas iniciales"><textarea ref={lNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Observaciones al inicio..." /></Field>
        {loteError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{loteError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalLote(false); setLoteError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveLote} disabled={saving}>{saving ? 'Guardando...' : 'Guardar lote'}</button>
        </div>
      </Modal>

      {/* Modal: Alimentación */}
      <Modal key={prefillLoteId ?? 'none'} open={modalFeed} onClose={() => { setModalFeed(false); setFeedError(''); }} title="🌿 Registrar Alimentación">
        <Field label="Lote">
          <select ref={fLote} style={inputStyle} defaultValue={prefillLoteId ?? ''}>
            {db.lotes.length === 0
              ? <option>— Crea un lote primero —</option>
              : db.lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
            }
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha y hora"><input ref={fFecha} type="datetime-local" style={inputStyle} defaultValue={nowLocal()} /></Field>
          <Field label="Cantidad (kg)"><input ref={fCantidad} type="number" style={inputStyle} placeholder="ej. 2.5" min="0" step="0.1" /></Field>
          <Field label="Tipo de sustrato">
            <select ref={fTipo} style={inputStyle}>
              <option value="">Selecciona...</option>
              {['Cáscaras de frutas','Restos de verduras','Pulpa de café','Gallinaza','Mezcla orgánica','Otro'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Rechazo observado">
            <select ref={fRechazo} style={inputStyle}>
              <option value="ninguno">Ninguno</option>
              <option value="leve">Leve (&lt;20%)</option>
              <option value="moderado">Moderado (20–50%)</option>
              <option value="alto">Alto (&gt;50%)</option>
            </select>
          </Field>
        </div>
        <Field label="Observaciones"><textarea ref={fNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Color, olor, comportamiento..." /></Field>
        {feedError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{feedError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalFeed(false); setFeedError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveFeed} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </Modal>

      {/* Modal: Editar Lote */}
      <Modal open={editLoteId !== null} onClose={() => { setEditLoteId(null); setEditLoteError(''); }} title="✏️ Editar Lote">
        <Field label="Nombre / código del lote">
          <input style={inputStyle} value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="ej. Lote-07 Julio" />
        </Field>
        <Field label="Fecha de siembra">
          <input type="date" style={inputStyle} value={editFecha} onChange={e => setEditFecha(e.target.value)} />
        </Field>
        {editLoteError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{editLoteError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setEditLoteId(null); setEditLoteError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveEditLote} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </Modal>

      {/* Spotlight tour */}
      {showOnboarding && !tourMinimized && (
        <SpotlightTour
          step={onboardingStep}
          onNext={() => setOnboardingStep(s => s + 1)}
          onPrev={() => setOnboardingStep(s => s - 1)}
          onDone={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }}
        />
      )}
      {showOnboarding && tourMinimized && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 700, background: '#152035', border: '1.5px solid rgba(34,197,94,0.35)', borderRadius: 50, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 12, color: S.muted }}>🪲 Explorando · Paso {onboardingStep + 1}/{TOUR_STEPS.length}</span>
          <button style={{ ...btnPrimary, ...btnSm }} onClick={() => setTourMinimized(false)}>Ver guía</button>
          {onboardingStep < TOUR_STEPS.length - 1
            ? <button style={{ ...btnPrimary, ...btnSm }} onClick={() => { setOnboardingStep(s => s + 1); setTourMinimized(false); }}>Siguiente →</button>
            : <button style={{ ...btnPrimary, ...btnSm }} onClick={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }}>¡Listo! 🚀</button>
          }
          <button onClick={() => { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 14, cursor: 'pointer', padding: '0 2px' }}>✕</button>
        </div>
      )}

      {/* Toast global */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#22c55e', color: '#0d1b2a', padding: '10px 22px', borderRadius: 50, fontWeight: 700, fontSize: 13, fontFamily: 'Montserrat, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      {/* Modal: Confirmar reset de datos */}
      <Modal open={showResetConfirm} onClose={() => !resetting && setShowResetConfirm(false)} title="🗑️ Limpiar mis datos">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, color: S.text, lineHeight: 1.6, marginBottom: 8 }}>
            Esto borrará <strong>todos tus lotes, alimentaciones, cosechas, recordatorios y fotos</strong> de manera permanente.
          </p>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.5, marginBottom: 20 }}>
            Tu cuenta y contraseña se mantienen intactos. Útil para empezar desde cero sin crear un usuario nuevo.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button style={btnOutline} onClick={() => setShowResetConfirm(false)} disabled={resetting}>Cancelar</button>
            <button
              style={{ ...btnDanger, padding: '10px 22px', fontSize: 13, opacity: resetting ? 0.6 : 1, cursor: resetting ? 'not-allowed' : 'pointer' }}
              disabled={resetting}
              onClick={async () => {
                setResetting(true);
                await db.resetAllData();
                localStorage.removeItem('prl-onboarding-done');
                setResetting(false);
                setShowResetConfirm(false);
                setOnboardingStep(0);
                setShowOnboarding(true);
                setView('dashboard');
              }}
            >
              {resetting ? 'Limpiando...' : 'Sí, limpiar todo'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Bienvenida al programa (solo primer acceso) */}
      {showBienvenida && db.session && (
        <BienvenidaModal
          nombre={db.session.name}
          onClose={() => {
            localStorage.setItem(`prl-bienvenida-vista-${db.session!.code}`, '1');
            setShowBienvenida(false);
          }}
        />
      )}

      {/* Modal: Protocolo Anti-Crisis BSF */}
      <ProtocoloCrisisModal open={showProtocolo} onClose={() => setShowProtocolo(false)} />

      {/* Modal: Cosecha */}
      <Modal open={modalCosecha} onClose={() => { setModalCosecha(false); setCosechaError(''); }} title="⚖️ Registrar Cosecha">
        <Field label="Lote cosechado">
          <select ref={cLote} style={inputStyle}>
            {db.lotes.length === 0
              ? <option>— Crea un lote primero —</option>
              : db.lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
            }
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Fecha de cosecha"><input ref={cFecha} type="date" style={inputStyle} /></Field>
          <Field label="Peso cosechado (kg)"><input ref={cPeso} type="number" style={inputStyle} placeholder="ej. 4.2" min="0" step="0.1" /></Field>
          <Field label="Sustrato total usado (kg)"><input ref={cSustTotal} type="number" style={inputStyle} placeholder="ej. 22" min="0" step="0.1" /></Field>
          <Field label="Calidad larvas">
            <select ref={cCalidad} style={inputStyle}>
              <option value="excelente">Excelente</option>
              <option value="buena">Buena</option>
              <option value="regular">Regular</option>
              <option value="baja">Baja</option>
            </select>
          </Field>
        </div>
        <Field label="Observaciones"><textarea ref={cNotas} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Tamaño, % prepupas, incidencias..." /></Field>
        {cosechaError && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{cosechaError}</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button style={btnOutline} onClick={() => { setModalCosecha(false); setCosechaError(''); }} disabled={saving}>Cancelar</button>
          <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={saveCosecha} disabled={saving}>{saving ? 'Guardando...' : 'Registrar cosecha'}</button>
        </div>
      </Modal>
    </div>
  );
}

export default function SociosPage() {
  return (
    <Suspense fallback={null}>
      <SociosInner />
    </Suspense>
  );
}