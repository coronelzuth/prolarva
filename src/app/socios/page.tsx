'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSocios, type Lote, type FeedLog, type Cosecha } from '@/hooks/useSocios';
import { S, btnPrimary, btnOutline, btnDanger, Modal, type View } from './_shared';

import Dashboard        from './Dashboard';
import LotesView        from './LotesView';
import LoteDetail       from './LoteDetail';
import CosechaView, { GuiaView } from './CosechaView';
import VentasView       from './VentasView';
import MonitorView      from './MonitorView';
import EstadisticasView from './EstadisticasView';
import PerfilView       from './PerfilView';
import AdminView        from './AdminView';
import EscuelaView      from './EscuelaView';
import EnciclopediaView, { type EncSec } from './EnciclopediaView';

import { LoginScreen, RegisterScreen, ResetPasswordScreen } from './AuthScreens';
import BienvenidaModal    from './BienvenidaModal';
import ProtocoloCrisisModal from '@/components/ProtocoloCrisisModal';
import SociosSidebar      from './SociosSidebar';
import { SpotlightTour, TOUR_STEPS } from './SpotlightTour';
import ModalNuevoLote     from './ModalNuevoLote';
import ModalEditarLote    from './ModalEditarLote';
import ModalAlimentacion  from './ModalAlimentacion';
import ModalCosecha       from './ModalCosecha';

// ─── Main ────────────────────────────────────────────────────────────────────

function SociosInner() {
  const db          = useSocios();
  const searchParams = useSearchParams();
  const invParam    = searchParams.get('inv')?.toUpperCase() ?? undefined;
  const resetParam  = searchParams.get('reset') ?? undefined;
  const viewParam   = searchParams.get('v') ?? undefined;
  const secParam    = (searchParams.get('sec') ?? undefined) as EncSec | undefined;

  const [authMode,        setAuthMode]        = useState<'login' | 'register'>(invParam ? 'register' : 'login');
  const [view,            setView]            = useState<View>(viewParam === 'enciclopedia' ? 'enciclopedia' : 'dashboard');
  const [encSec,          setEncSec]          = useState<EncSec>(secParam ?? 'inicio');
  const [monitorSub,      setMonitorSub]      = useState<'lotes' | 'stats'>('lotes');
  const [detailLoteId,    setDetailLoteId]    = useState<string | null>(null);

  const [showBienvenida,   setShowBienvenida]   = useState(false);
  const [bienvenidaManual, setBienvenidaManual] = useState(false);
  const [showProtocolo,    setShowProtocolo]    = useState(false);

  const [showOnboarding,   setShowOnboarding]   = useState(false);
  const [onboardingStep,   setOnboardingStep]   = useState(0);
  const [tourMinimized,    setTourMinimized]    = useState(false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting,        setResetting]        = useState(false);

  const [anuncio,          setAnuncio]          = useState<string | null>(null);
  const [sidebarAvatar,    setSidebarAvatar]    = useState<string | null>(null);
  const [toast,            setToast]            = useState('');

  // Modal states
  const [modalLote,       setModalLote]       = useState(false);
  const [modalFeed,       setModalFeed]       = useState(false);
  const [modalCosecha,    setModalCosecha]    = useState(false);
  const [prefillLoteId,   setPrefillLoteId]   = useState<string | null>(null);
  const [cosechaPrefill,  setCosechaPrefill]  = useState<string | null>(null);
  const [editLote,        setEditLote]        = useState<{ id: string; nombre: string; fecha: string } | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 2000); }

  useEffect(() => {
    if (db.session && !localStorage.getItem('prl-onboarding-done')) setShowOnboarding(true);
    if (db.session) {
      if (!localStorage.getItem(`prl-bienvenida-vista-${db.session.code}`) && db.session.code !== 'DEMO') setShowBienvenida(true);
      fetch('/api/anuncios/obtener').then(r => r.json()).then(d => { if (d.anuncio) setAnuncio(d.anuncio); }).catch(() => {});
      setSidebarAvatar(localStorage.getItem(`prl-avatar-${db.session.code}`));
    }
  }, [db.session]);

  useEffect(() => {
    function onAvatarChanged(e: Event) { setSidebarAvatar((e as CustomEvent<string>).detail); }
    window.addEventListener('prl-avatar-changed', onAvatarChanged);
    return () => window.removeEventListener('prl-avatar-changed', onAvatarChanged);
  }, []);

  if (!db.loaded) return null;
  if (resetParam) return <ResetPasswordScreen token={resetParam} onDone={() => { window.history.replaceState({}, '', '/socios'); }} />;
  if (!db.session) {
    if (authMode === 'login') return <LoginScreen onLogin={db.login} onSwitchToRegister={() => setAuthMode('register')} />;
    return <RegisterScreen onRegister={(email, nombre, password, inv) => db.register(email, nombre, password, inv)} onSwitchToLogin={() => setAuthMode('login')} invitacionPrevia={invParam} />;
  }

  const detailLote  = detailLoteId ? db.lotes.find(l => l.id === detailLoteId) ?? null : null;
  const activeView  = (view === 'lote-detail' || view === 'cosecha') ? 'monitor' : view;

  function navTo(v: View) { setView(v); if (showOnboarding) setTourMinimized(true); }
  function viewLote(id: string) { setDetailLoteId(id); setView('lote-detail'); }
  function openFeed(loteId: string | null) { setPrefillLoteId(loteId); setModalFeed(true); }
  function doneTour() { localStorage.setItem('prl-onboarding-done', '1'); setShowOnboarding(false); setOnboardingStep(0); setTourMinimized(false); }

  async function changePassword(current: string, nueva: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/socios/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: db.session?.code, currentPassword: current, newPassword: nueva }) });
      const data = await res.json();
      return res.ok && data.success ? { ok: true } : { ok: false, error: data.error };
    } catch { return { ok: false, error: 'Error de conexión' }; }
  }

  async function handleMarcarFase(fase: number) {
    if (!db.session) return;
    const res = await fetch('/api/socios/marcar-fase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: db.session.token, fase }) });
    if (res.ok) { db.updateFases(fase); showToast(`📩 Semana ${fase} enviada a revisión`); }
    else { const d = await res.json(); showToast(`❌ ${d.error ?? 'Error al enviar la semana'}`); }
  }

  async function handleAprobFase(code: string, fase: number) {
    if (!db.session) return;
    const res = await fetch('/api/socios/aprobar-fase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode: db.session.code, code, fase }) });
    if (res.ok) showToast(`✅ Semana ${fase} aprobada`);
    else { const d = await res.json(); showToast(`❌ ${d.error ?? 'Error al aprobar'}`); }
  }

  return (
    <div className="socios-wrap" style={{ display: 'flex', minHeight: '100vh' }}>
      <SociosSidebar session={db.session} sidebarAvatar={sidebarAvatar} activeView={activeView} onNav={navTo} onLogout={db.logout} />

      <main className="socios-main" style={{ flex: 1, minWidth: 0 }}>
        {db.session.code === 'DEMO' && (
          <div style={{ position: 'sticky', top: 0, zIndex: 90, background: 'rgba(180,110,0,0.97)', backdropFilter: 'blur(8px)', padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>👀</span>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: '#fff8e1', fontWeight: 800, fontSize: 12, letterSpacing: '0.04em' }}>MODO DEMO</span>
                <span style={{ color: 'rgba(255,248,225,0.7)', fontSize: 11, marginLeft: 8 }}> · Nada se guarda en el servidor</span>
              </div>
            </div>
            <button onClick={db.logout} style={{ background: 'rgba(0,0,0,0.2)', color: '#fff8e1', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Montserrat, sans-serif' }}>
              Salir del demo
            </button>
          </div>
        )}

        <div className="socios-content">
          {view === 'dashboard' && (
            <Dashboard lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas} activeLotes={db.activeLotes} readyLotes={db.readyLotes} recordatorios={db.recordatorios} totalKg={db.totalKg} avgConv={db.avgConv} userName={db.session.name} anuncio={anuncio} sinEmail={db.session.code !== 'DEMO' && !db.session.email} onViewLote={viewLote} onNav={navTo} onNavMonitor={(sub) => { setMonitorSub(sub); navTo('monitor'); }} onCosechar={(id) => { setCosechaPrefill(id); setModalCosecha(true); }} onAlimentar={openFeed} onVerProtocolo={() => setShowProtocolo(true)} />
          )}
          {view === 'monitor' && (
            <MonitorView fasesAprobadas={db.session?.fases_aprobadas ?? 0} isAdmin={db.session?.rol === 'admin'} monitorSub={monitorSub} onSubChange={setMonitorSub} lotes={db.lotes} feeds={db.feeds} onViewLote={viewLote} onNewLote={() => setModalLote(true)} onDeleteLote={db.deleteLote} cosechas={db.cosechas} totalKg={db.totalKg} avgConv={db.avgConv} />
          )}
          {view === 'lote-detail' && detailLote && (
            <LoteDetail lote={detailLote} feeds={db.feeds} lotes={db.lotes} cosechas={db.cosechas} recordatorios={db.recordatorios} fotos={db.fotos} onBack={() => setView('monitor')} onAddFeed={openFeed} onEdit={() => setEditLote({ id: detailLote.id, nombre: detailLote.nombre, fecha: detailLote.fecha })} onAdjust={(ajustes) => db.updateLote(detailLote.id, { ajustes })} onAddRecordatorio={db.addRecordatorio} onToggleRecordatorio={db.toggleRecordatorio} onDeleteRecordatorio={db.deleteRecordatorio} onAddFoto={db.addFoto} onDeleteFoto={db.deleteFoto} onNewCosecha={() => setModalCosecha(true)} />
          )}
          {view === 'ventas'  && <VentasView ventas={db.ventasSocios} onAdd={db.addVentaSocio} onDelete={db.deleteVentaSocio} />}
          {view === 'guia'    && <GuiaView />}
          {view === 'escuela' && <EscuelaView socioCode={db.session.code} socioNombre={db.session.name} isAdmin={db.session.rol === 'admin'} fasesAprobadas={db.session.fases_aprobadas ?? 0} faseEnRevision={db.session.fase_en_revision ?? 0} onMarcarFase={handleMarcarFase} onAprobFase={handleAprobFase} />}
          {view === 'enciclopedia' && <EnciclopediaView initialSection={encSec} />}
          {view === 'perfil'  && (
            <PerfilView session={db.session} lotes={db.lotes} feeds={db.feeds} cosechas={db.cosechas} totalKg={db.totalKg} onUpdateName={db.updateName} onUpdateEmail={db.updateEmail} onChangePassword={changePassword}
              onLaunchTour={() => { localStorage.removeItem('prl-onboarding-done'); setOnboardingStep(0); setTourMinimized(false); setShowOnboarding(true); navTo('dashboard'); }}
              onReset={() => setShowResetConfirm(true)}
              onGuia={() => navTo('guia')}
              onVerBienvenida={() => { if (db.session) localStorage.removeItem(`prl-bienvenida-vista-${db.session.code}`); setBienvenidaManual(true); setShowBienvenida(true); }}
              onGoAdmin={db.session.rol === 'admin' ? () => navTo('admin') : undefined}
              onLogout={db.logout}
            />
          )}
          {view === 'admin' && db.session.rol === 'admin' && <AdminView adminCode={db.session.code} onBack={() => navTo('perfil')} onLogout={db.logout} />}
        </div>
      </main>

      {/* ── Modales CRUD ── */}
      <ModalNuevoLote
        open={modalLote}
        onClose={() => setModalLote(false)}
        onSave={async (data) => { await db.addLote(data as Lote); showToast('✅ Lote guardado'); }}
      />
      <ModalEditarLote
        open={editLote !== null}
        initialNombre={editLote?.nombre ?? ''}
        initialFecha={editLote?.fecha ?? ''}
        onClose={() => setEditLote(null)}
        onSave={async (nombre, fecha) => { if (editLote) { await db.updateLote(editLote.id, { nombre, fecha }); showToast('✅ Lote actualizado'); setEditLote(null); } }}
      />
      <ModalAlimentacion
        open={modalFeed}
        prefillLoteId={prefillLoteId}
        lotes={db.lotes}
        onClose={() => { setModalFeed(false); setPrefillLoteId(null); }}
        onSave={async (data) => { await db.addFeed(data as FeedLog); showToast('✅ Alimentación registrada'); }}
      />
      <ModalCosecha
        key={cosechaPrefill ?? 'none'}
        open={modalCosecha}
        lotes={db.lotes}
        prefillLoteId={cosechaPrefill}
        onClose={() => { setModalCosecha(false); setCosechaPrefill(null); }}
        onSave={async (data) => { await db.addCosecha(data as Cosecha); showToast('✅ Cosecha registrada'); }}
      />

      {/* ── Bienvenida y Protocolo ── */}
      {showBienvenida && db.session && (
        <BienvenidaModal nombre={db.session.name} showClose={bienvenidaManual} onClose={() => { localStorage.setItem(`prl-bienvenida-vista-${db.session!.code}`, '1'); setShowBienvenida(false); setBienvenidaManual(false); }} />
      )}
      <ProtocoloCrisisModal open={showProtocolo} onClose={() => setShowProtocolo(false)} />

      {/* ── Spotlight tour ── */}
      {showOnboarding && !tourMinimized && (
        <SpotlightTour step={onboardingStep} onNext={() => setOnboardingStep(s => s + 1)} onPrev={() => setOnboardingStep(s => s - 1)} onDone={doneTour} />
      )}
      {showOnboarding && tourMinimized && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 700, background: '#152035', border: '1.5px solid rgba(34,197,94,0.35)', borderRadius: 50, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', fontFamily: 'Montserrat, sans-serif', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 12, color: S.muted }}>🪲 Explorando · Paso {onboardingStep + 1}/{TOUR_STEPS.length}</span>
          <button style={{ ...btnPrimary, fontSize: 11, padding: '5px 10px' }} onClick={() => setTourMinimized(false)}>Ver guía</button>
          {onboardingStep < TOUR_STEPS.length - 1
            ? <button style={{ ...btnPrimary, fontSize: 11, padding: '5px 10px' }} onClick={() => { setOnboardingStep(s => s + 1); setTourMinimized(false); }}>Siguiente →</button>
            : <button style={{ ...btnPrimary, fontSize: 11, padding: '5px 10px' }} onClick={doneTour}>¡Listo! 🚀</button>
          }
          <button onClick={doneTour} style={{ background: 'none', border: 'none', color: S.muted, fontSize: 14, cursor: 'pointer', padding: '0 2px' }}>✕</button>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#22c55e', color: '#0d1b2a', padding: '10px 22px', borderRadius: 50, fontWeight: 700, fontSize: 13, fontFamily: 'Montserrat, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      {/* ── Confirmar reset ── */}
      <Modal open={showResetConfirm} onClose={() => !resetting && setShowResetConfirm(false)} title="🗑️ Limpiar mis datos">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, color: S.text, lineHeight: 1.6, marginBottom: 8 }}>Esto borrará <strong>todos tus lotes, alimentaciones, cosechas, recordatorios y fotos</strong> de manera permanente.</p>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.5, marginBottom: 20 }}>Tu cuenta y contraseña se mantienen intactos.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button style={btnOutline} onClick={() => setShowResetConfirm(false)} disabled={resetting}>Cancelar</button>
            <button style={{ ...btnDanger, padding: '10px 22px', fontSize: 13, opacity: resetting ? 0.6 : 1, cursor: resetting ? 'not-allowed' : 'pointer' }} disabled={resetting}
              onClick={async () => { setResetting(true); await db.resetAllData(); localStorage.removeItem('prl-onboarding-done'); setResetting(false); setShowResetConfirm(false); setOnboardingStep(0); setShowOnboarding(true); setView('dashboard'); }}
            >
              {resetting ? 'Limpiando...' : 'Sí, limpiar todo'}
            </button>
          </div>
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
