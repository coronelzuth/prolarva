'use client';
import { useState, useEffect } from 'react';
import { S, cardStyle, btnPrimary, btnSm, btnOutline, btnDanger, EmptyState, Badge, Field, Modal, inputStyle, labelStyle, fmtDate, downloadCSV } from './_shared';

// ─── Admin view ───────────────────────────────────────────────────────────────

interface Invitacion {
  id: string;
  codigo: string;
  usado: boolean;
  creado_en: string;
  usado_en?: string;
  usado_por?: string;
}

interface SocioRegistrado {
  id: string;
  codigo: string;
  email: string;
  nombre: string;
  estado: string;
  rol: string;
  creado_en: string;
  last_activity?: string | null;
}

const BLOG_META: Record<string, { title: string; emoji: string; color: string }> = {
  'problemas':          { title: '8 problemas comunes BSF',       emoji: '🔧', color: '#ef4444' },
  'raciones':           { title: 'Raciones por animal y etapa',   emoji: '🍽️', color: '#22c55e' },
  'alimentacion-larvas':{ title: 'Qué comen las larvas BSF',      emoji: '🌿', color: '#a855f7' },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

type BlogStatRow = { slug: string; views: number; last_viewed_at: string };

function BlogStatsTab({ stats, loading, onRefresh }: { stats: BlogStatRow[]; loading: boolean; onRefresh: () => void }) {
  const totalVisitas = stats.reduce((acc, s) => acc + s.views, 0);
  const top = stats[0];

  return (
    <div>
      {/* Resumen */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Visitas totales',   value: totalVisitas,    color: S.green },
          { label: 'Artículos activos', value: stats.length,    color: S.text  },
          { label: 'Artículo top',      value: top ? BLOG_META[top.slug]?.emoji + ' ' + top.views : '—', color: S.amber },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 120, textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Lista de artículos */}
      {loading ? (
        <p style={{ color: S.muted, fontSize: 13 }}>Cargando estadísticas...</p>
      ) : stats.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <p style={{ fontSize: 13 }}>Aún no hay visitas registradas.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Las visitas se registran cada vez que alguien abre un artículo del blog.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.map((s, i) => {
            const meta = BLOG_META[s.slug] ?? { title: s.slug, emoji: '📄', color: S.muted };
            const pct  = totalVisitas > 0 ? Math.round((s.views / totalVisitas) * 100) : 0;
            return (
              <div key={s.slug} style={{ ...cardStyle, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  {/* Rank */}
                  <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? S.amber : S.muted, width: 20, flexShrink: 0 }}>
                    #{i + 1}
                  </div>
                  {/* Emoji */}
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{meta.emoji}</div>
                  {/* Título */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{meta.title}</div>
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                      Última visita: {s.last_viewed_at ? new Date(s.last_viewed_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </div>
                  </div>
                  {/* Contador */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: meta.color }}>{s.views}</div>
                    <div style={{ fontSize: 10, color: S.muted }}>visitas</div>
                  </div>
                </div>
                {/* Barra de progreso */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: meta.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 11, color: S.muted, marginTop: 4 }}>{pct}% del total</div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onRefresh} style={{ ...btnOutline, ...btnSm, marginTop: 16 }}>↺ Actualizar</button>

      {/* Card GA4 */}
      <div style={{ ...cardStyle, marginTop: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: GA4_ID ? 0 : 10 }}>
          <span style={{ fontSize: 22 }}>📈</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>Google Analytics 4</div>
            <div style={{ fontSize: 11, color: GA4_ID ? S.green : S.amber, marginTop: 2 }}>
              {GA4_ID ? `✅ Activo · ${GA4_ID}` : '⚠️ Measurement ID no configurado'}
            </div>
          </div>
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...btnPrimary, fontSize: 11, padding: '6px 14px', textDecoration: 'none', display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            Abrir GA4 →
          </a>
        </div>
        {!GA4_ID && (
          <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.7, marginTop: 4 }}>
            Para activar: crea una propiedad en <strong style={{ color: S.text }}>analytics.google.com</strong> → copia el Measurement ID (G-XXXXXXXX) → agrégalo como env var <strong style={{ color: S.text }}>NEXT_PUBLIC_GA_MEASUREMENT_ID</strong> en Vercel → redeploy.
          </div>
        )}
      </div>
    </div>
  );
}

interface Lead {
  id: string;
  nombre: string;
  whatsapp: string;
  fuente: string;
  especie: string;
  n_animales: number;
  perdida_cop: number;
  tipo_cta: string;
  estado: string;
  notas_crm: string;
  creado_en: string;
}

interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  producto: string;
  monto: number;
  canal: string;
  notas: string;
  creado_en: string;
}

interface GlobalStats {
  totalLotes: number;
  totalKg: number;
  totalLeads: number;
  totalVentasCOP: number;
  totalVentasCount: number;
  totalSocios: number;
  conversionPct: number;
}

function AdminView({ adminCode, onBack, onLogout }: { adminCode: string; onBack: () => void; onLogout: () => void }) {
  const [tab, setTab] = useState<'socios' | 'invitaciones' | 'blog' | 'leads' | 'ventas' | 'comunicacion'>('socios');

  // ── Invitaciones state ────────────────────────────────────────────────────
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [loadingInv, setLoadingInv]     = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [copied, setCopied]             = useState<string | null>(null);
  const [genError, setGenError]         = useState('');

  // ── Socios state ──────────────────────────────────────────────────────────
  const [socios, setSocios]         = useState<SocioRegistrado[]>([]);
  const [loadingSoc, setLoadingSoc] = useState(false);

  // ── Blog stats state ──────────────────────────────────────────────────────
  type BlogStat = { slug: string; views: number; last_viewed_at: string };
  const [blogStats, setBlogStats]   = useState<BlogStat[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);

  // ── Leads state ───────────────────────────────────────────────────────────
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // ── Ventas state ──────────────────────────────────────────────────────────
  const [ventas, setVentas]         = useState<Venta[]>([]);
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [savingVenta, setSavingVenta]     = useState(false);
  const [ventaError, setVentaError]       = useState('');
  const [ventaForm, setVentaForm]         = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    producto: 'Kit ProLarva 25/15',
    monto: 450000,
    canal: 'WhatsApp',
    notas: '',
  });
  const [showVentaForm, setShowVentaForm] = useState(false);

  // ── Global stats ──────────────────────────────────────────────────────────
  const [globalStats, setGlobalStats]   = useState<GlobalStats | null>(null);
  const [loadingGStats, setLoadingGStats] = useState(false);

  // ── Comunicación state ────────────────────────────────────────────────────
  const [pushTitulo, setPushTitulo]     = useState('');
  const [pushCuerpo, setPushCuerpo]     = useState('');
  const [sendingPush, setSendingPush]   = useState(false);
  const [pushResult, setPushResult]     = useState('');
  const [anuncioTexto, setAnuncioTexto] = useState('');
  const [savingAnuncio, setSavingAnuncio] = useState(false);
  const [anuncioOk, setAnuncioOk]       = useState('');
  const [togglingId, setTogglingId]     = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [editLeadNotas, setEditLeadNotas] = useState('');

  async function cargarInvitaciones() {
    setLoadingInv(true);
    try {
      const res  = await fetch('/api/invitaciones/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setInvitaciones(data.invitaciones);
    } finally { setLoadingInv(false); }
  }

  async function cargarSocios() {
    setLoadingSoc(true);
    try {
      const res  = await fetch('/api/socios/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setSocios(data.socios);
    } finally { setLoadingSoc(false); }
  }

  async function cargarBlog() {
    setLoadingBlog(true);
    try {
      const res  = await fetch('/api/blog/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setBlogStats(data.stats);
    } finally { setLoadingBlog(false); }
  }

  async function cargarLeads() {
    setLoadingLeads(true);
    try {
      const res  = await fetch('/api/leads/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } finally { setLoadingLeads(false); }
  }

  async function cargarVentas() {
    setLoadingVentas(true);
    try {
      const res  = await fetch('/api/ventas/listar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setVentas(data.ventas);
    } finally { setLoadingVentas(false); }
  }

  async function cargarGlobalStats() {
    setLoadingGStats(true);
    try {
      const res  = await fetch('/api/admin/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) setGlobalStats(data.stats);
    } finally { setLoadingGStats(false); }
  }

  async function guardarVenta() {
    if (!ventaForm.cliente.trim()) { setVentaError('El nombre del cliente es requerido'); return; }
    if (!ventaForm.monto) { setVentaError('El monto es requerido'); return; }
    setSavingVenta(true); setVentaError('');
    try {
      const res  = await fetch('/api/ventas/guardar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, ...ventaForm }) });
      const data = await res.json();
      if (data.success) {
        setVentaForm({ fecha: new Date().toISOString().split('T')[0], cliente: '', producto: 'Kit ProLarva 25/15', monto: 450000, canal: 'WhatsApp', notas: '' });
        setShowVentaForm(false);
        await Promise.all([cargarVentas(), cargarGlobalStats()]);
      } else {
        setVentaError(data.error ?? 'Error al guardar');
      }
    } finally { setSavingVenta(false); }
  }

  async function toggleSocioEstado(socio: SocioRegistrado) {
    setTogglingId(socio.id);
    const nuevoEstado = socio.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await fetch('/api/socios/toggle-estado', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, socioId: socio.id, estado: nuevoEstado }) });
      setSocios(prev => prev.map(s => s.id === socio.id ? { ...s, estado: nuevoEstado } : s));
    } finally { setTogglingId(null); }
  }

  async function actualizarLead(leadId: string, campo: { estado?: string; notas_crm?: string }) {
    await fetch('/api/leads/actualizar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, leadId, ...campo }) });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...campo } : l));
  }

  async function enviarPushMasivo() {
    if (!pushTitulo.trim() || !pushCuerpo.trim()) return;
    setSendingPush(true); setPushResult('');
    try {
      const res  = await fetch('/api/push/notify-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, titulo: pushTitulo, cuerpo: pushCuerpo }) });
      const data = await res.json();
      if (data.success) { setPushResult(`✅ Enviado a ${data.sent} suscripción${data.sent !== 1 ? 'es' : ''}`); setPushTitulo(''); setPushCuerpo(''); }
      else setPushResult(`❌ ${data.error}`);
    } finally { setSendingPush(false); }
  }

  async function guardarAnuncio(desactivar = false) {
    setSavingAnuncio(true); setAnuncioOk('');
    try {
      const res  = await fetch('/api/anuncios/guardar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode, texto: desactivar ? '' : anuncioTexto, activo: !desactivar }) });
      const data = await res.json();
      if (data.success) { setAnuncioOk(desactivar ? '✅ Anuncio desactivado' : '✅ Anuncio publicado'); if (desactivar) setAnuncioTexto(''); }
      else setAnuncioOk(`❌ ${data.error}`);
    } finally { setSavingAnuncio(false); }
  }

  async function generar() {
    setGenerating(true); setGenError('');
    try {
      const res  = await fetch('/api/invitaciones/crear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminCode }) });
      const data = await res.json();
      if (data.success) { await cargarInvitaciones(); copiar(data.codigo); }
      else setGenError(data.error ?? 'Error al generar');
    } finally { setGenerating(false); }
  }

  function copiar(codigo: string) {
    const link = `https://prolarva.co/socios?inv=${codigo}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(codigo);
    setTimeout(() => setCopied(null), 2000);
  }

  useEffect(() => {
    cargarSocios();
    cargarInvitaciones();
    cargarBlog();
    cargarLeads();
    cargarVentas();
    cargarGlobalStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disponibles = invitaciones.filter(i => !i.usado).length;
  const usados      = invitaciones.filter(i => i.usado).length;
  const sociosActivos = socios.filter(s => s.estado === 'activo' && s.rol !== 'admin').length;

  const copCurrency = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>🔑 Centro de Mando</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onBack} style={{ ...btnOutline, fontSize: 12, padding: '6px 14px' }}>← Volver</button>
          <button onClick={onLogout} style={{ ...btnDanger, fontSize: 12 }}>Cerrar sesión</button>
        </div>
      </div>

      {/* Stats globales — fila 1 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Socios activos',   value: sociosActivos, color: S.green },
          { label: 'Leads totales',    value: loadingGStats ? '…' : (globalStats?.totalLeads ?? leads.length), color: S.emerald },
          { label: 'Conversión',       value: loadingGStats ? '…' : (globalStats ? `${globalStats.conversionPct}%` : '—'), color: '#38bdf8' },
          { label: 'Kits vendidos',    value: loadingGStats ? '…' : (globalStats?.totalVentasCount ?? ventas.length), color: S.amber },
          { label: 'Ingresos totales', value: loadingGStats ? '…' : (globalStats ? copCurrency(globalStats.totalVentasCOP) : '—'), color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 90, textAlign: 'center', padding: '12px 8px' }}>
            <div style={{ fontSize: typeof stat.value === 'string' && stat.value.length > 8 ? 12 : 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Stats globales — fila 2 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        {[
          { label: 'Lotes BSF totales',   value: loadingGStats ? '…' : (globalStats?.totalLotes ?? '—'), color: S.text },
          { label: 'Kg cosechados total', value: loadingGStats ? '…' : (globalStats ? `${globalStats.totalKg.toFixed(1)} kg` : '—'), color: S.text },
          { label: 'Invit. disponibles',  value: disponibles, color: S.emerald },
          { label: 'Invit. usadas',       value: usados, color: S.muted },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, flex: 1, minWidth: 90, textAlign: 'center', padding: '10px 8px' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {([
          ['socios',        '👥 Socios'],
          ['leads',         '📊 Leads'],
          ['ventas',        '💰 Ventas'],
          ['comunicacion',  '📢 Comunicación'],
          ['invitaciones',  '🎟️ Invitaciones'],
          ['blog',          '📝 Blog'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif', cursor: 'pointer',
              background: tab === key ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
              color: tab === key ? '#fff' : S.muted,
              border: tab === key ? 'none' : `1.5px solid ${S.border}`,
            }}
          >{label}</button>
        ))}
      </div>

      {/* Tab: Socios */}
      {tab === 'socios' && (
        <div>
          {loadingSoc ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando socios...</p>
          ) : socios.filter(s => s.rol !== 'admin').length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <p style={{ fontSize: 13 }}>No hay socios registrados aún.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {socios.filter(s => s.rol !== 'admin').map(socio => {
                const diasSinActividad = socio.last_activity
                  ? Math.floor((Date.now() - new Date(socio.last_activity).getTime()) / 86_400_000)
                  : null;
                const activo14 = diasSinActividad !== null && diasSinActividad <= 14;
                return (
                  <div key={socio.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', flexWrap: 'wrap', opacity: socio.estado === 'inactivo' ? 0.55 : 1 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: socio.estado === 'activo' ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: socio.estado === 'activo' ? S.green : S.muted }}>
                      {socio.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: S.text, marginBottom: 2 }}>{socio.nombre}</div>
                      <div style={{ fontSize: 12, color: S.muted }}>{socio.email}</div>
                      <div style={{ fontSize: 11, color: activo14 ? S.green : S.muted, marginTop: 2 }}>
                        {diasSinActividad === null ? '🕳️ Sin actividad registrada' : activo14 ? `✅ Activo hace ${diasSinActividad}d` : `⚠️ Inactivo hace ${diasSinActividad}d`}
                      </div>
                    </div>
                    <code style={{ fontSize: 11, color: S.green2, background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>
                      {socio.codigo}
                    </code>
                    <div style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>{fmtDate(socio.creado_en)}</div>
                    <button
                      onClick={() => toggleSocioEstado(socio)}
                      disabled={togglingId === socio.id}
                      style={{ ...btnOutline, ...btnSm, flexShrink: 0, color: socio.estado === 'activo' ? S.red : S.green, borderColor: socio.estado === 'activo' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)', opacity: togglingId === socio.id ? 0.5 : 1 }}
                    >
                      {togglingId === socio.id ? '…' : socio.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={cargarSocios} style={{ ...btnOutline, ...btnSm, marginTop: 16 }}>↺ Actualizar</button>
        </div>
      )}

      {/* Tab: Blog */}
      {tab === 'blog' && <BlogStatsTab stats={blogStats} loading={loadingBlog} onRefresh={cargarBlog} />}

      {/* Tab: Leads */}
      {tab === 'leads' && (
        <div>
          {/* Header + export */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 13, color: S.muted }}>
              Leads capturados desde la Calculadora BSF cuando alguien toca el botón de WhatsApp con nombre o número.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  const hdrs = ['Fecha', 'Nombre', 'WhatsApp', 'Especie', 'Animales', 'Pérdida COP', 'CTA'];
                  const rows = leads.map(l => [fmtDate(l.creado_en), l.nombre, l.whatsapp, l.especie, String(l.n_animales), String(l.perdida_cop), l.tipo_cta]);
                  downloadCSV(rows, hdrs, `prolarva-leads-${new Date().toISOString().slice(0, 10)}.csv`);
                }}
                style={{ ...btnOutline, ...btnSm }}
              >⬇ CSV</button>
              <button onClick={cargarLeads} style={{ ...btnOutline, ...btnSm }}>↺</button>
            </div>
          </div>

          {loadingLeads ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando leads...</p>
          ) : leads.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
              <p style={{ fontSize: 13 }}>Aún no hay leads. Aparecerán cuando alguien complete la Calculadora y toque WhatsApp.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leads.map(lead => {
                const espEmoji: Record<string, string> = { pollos: '🐔', cerdos: '🐷', peces: '🐟' };
                const ESTADO_CFG: Record<string, { color: 'green'|'amber'|'red'|'blue'|'gray'; label: string }> = {
                  nuevo:      { color: 'blue',  label: '🆕 Nuevo' },
                  contactado: { color: 'amber', label: '📞 Contactado' },
                  en_proceso: { color: 'green', label: '🔄 En proceso' },
                  cerrado:    { color: 'green', label: '✅ Cerrado' },
                  perdido:    { color: 'gray',  label: '❌ Perdido' },
                };
                const cfg = ESTADO_CFG[lead.estado ?? 'nuevo'] ?? ESTADO_CFG.nuevo;
                const expanded = expandedLead === lead.id;
                return (
                  <div key={lead.id} style={{ ...cardStyle, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {espEmoji[lead.especie] ?? '🪲'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{lead.nombre || '(sin nombre)'}</div>
                        <div style={{ fontSize: 12, color: S.green2, fontWeight: 600 }}>📱 {lead.whatsapp || '—'}</div>
                        {lead.especie && (
                          <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                            {lead.n_animales} {lead.especie} · pérdida: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(lead.perdida_cop)}
                          </div>
                        )}
                        {lead.notas_crm && <div style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', marginTop: 3 }}>📝 {lead.notas_crm}</div>}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <Badge color={cfg.color}>{cfg.label}</Badge>
                        <div style={{ fontSize: 10, color: S.muted }}>{fmtDate(lead.creado_en)}</div>
                        <button onClick={() => { setExpandedLead(expanded ? null : lead.id); setEditLeadNotas(lead.notas_crm ?? ''); }} style={{ ...btnOutline, ...btnSm, fontSize: 10 }}>
                          {expanded ? '▲ Cerrar' : '✏️ Editar'}
                        </button>
                      </div>
                    </div>
                    {expanded && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
                        <div style={{ marginBottom: 8 }}>
                          <label style={labelStyle}>Estado CRM</label>
                          <select
                            value={lead.estado ?? 'nuevo'}
                            onChange={e => actualizarLead(lead.id, { estado: e.target.value })}
                            style={inputStyle}
                          >
                            {Object.entries(ESTADO_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={labelStyle}>Notas de seguimiento</label>
                          <input
                            type="text"
                            value={editLeadNotas}
                            onChange={e => setEditLeadNotas(e.target.value)}
                            placeholder="Llamado el 25 jul, está interesado, pide precio..."
                            style={inputStyle}
                          />
                        </div>
                        <button onClick={() => { actualizarLead(lead.id, { notas_crm: editLeadNotas }); setExpandedLead(null); }} style={{ ...btnPrimary, ...btnSm }}>
                          Guardar notas
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Ventas */}
      {tab === 'ventas' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>Registro de Ventas</div>
              <div style={{ fontSize: 12, color: S.muted }}>Kits ProLarva vendidos</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  const hdrs = ['Fecha', 'Cliente', 'Producto', 'Monto COP', 'Canal', 'Notas'];
                  const rows = ventas.map(v => [v.fecha, v.cliente, v.producto, String(v.monto), v.canal, v.notas]);
                  downloadCSV(rows, hdrs, `prolarva-ventas-${new Date().toISOString().slice(0, 10)}.csv`);
                }}
                style={{ ...btnOutline, ...btnSm }}
              >⬇ CSV</button>
              <button onClick={() => { setShowVentaForm(v => !v); setVentaError(''); }} style={{ ...btnPrimary, ...btnSm }}>
                {showVentaForm ? '✕ Cancelar' : '+ Registrar venta'}
              </button>
            </div>
          </div>

          {/* Formulario nueva venta */}
          {showVentaForm && (
            <div style={{ ...cardStyle, padding: 20, marginBottom: 20, border: `1.5px solid rgba(245,158,11,0.3)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.amber, marginBottom: 16 }}>Nueva venta</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Fecha</label>
                  <input type="date" value={ventaForm.fecha} onChange={e => setVentaForm(f => ({ ...f, fecha: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Canal</label>
                  <select value={ventaForm.canal} onChange={e => setVentaForm(f => ({ ...f, canal: e.target.value }))} style={inputStyle}>
                    {['WhatsApp', 'Instagram', 'TikTok', 'Directo', 'Referido'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Cliente (nombre)</label>
                <input type="text" placeholder="Ej: Juan Pérez" value={ventaForm.cliente} onChange={e => setVentaForm(f => ({ ...f, cliente: e.target.value }))} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Producto</label>
                  <select value={ventaForm.producto} onChange={e => setVentaForm(f => ({ ...f, producto: e.target.value }))} style={inputStyle}>
                    {['Kit ProLarva 25/15', 'Acompañamiento adicional', 'Consultoría'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Monto (COP)</label>
                  <input type="number" value={ventaForm.monto} onChange={e => setVentaForm(f => ({ ...f, monto: Number(e.target.value) }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Notas (opcional)</label>
                <input type="text" placeholder="Pago en efectivo, envío a Cúcuta..." value={ventaForm.notas} onChange={e => setVentaForm(f => ({ ...f, notas: e.target.value }))} style={inputStyle} />
              </div>
              {ventaError && <div style={{ fontSize: 12, color: S.red, marginBottom: 10 }}>{ventaError}</div>}
              <button
                onClick={guardarVenta}
                disabled={savingVenta}
                style={{ ...btnPrimary, width: '100%', opacity: savingVenta ? 0.6 : 1, cursor: savingVenta ? 'not-allowed' : 'pointer' }}
              >
                {savingVenta ? 'Guardando...' : '✅ Guardar venta'}
              </button>
            </div>
          )}

          {/* Stats del mes */}
          {ventas.length > 0 && (() => {
            const mesKey = new Date().toISOString().slice(0, 7);
            const ventasMes = ventas.filter(v => v.fecha.startsWith(mesKey));
            const totalMes  = ventasMes.reduce((s, v) => s + v.monto, 0);
            const totalAll  = ventas.reduce((s, v) => s + v.monto, 0);
            return (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Ventas este mes', value: ventasMes.length, color: S.green },
                  { label: 'Ingresos este mes', value: copCurrency(totalMes), color: S.amber },
                  { label: 'Ingresos totales', value: copCurrency(totalAll), color: '#a78bfa' },
                ].map(st => (
                  <div key={st.label} style={{ ...cardStyle, flex: 1, minWidth: 120, textAlign: 'center', padding: '12px 10px' }}>
                    <div style={{ fontSize: st.label.includes('Ingresos') ? 13 : 22, fontWeight: 900, color: st.color }}>{st.value}</div>
                    <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>{st.label}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Lista */}
          {loadingVentas ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando ventas...</p>
          ) : ventas.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
              <p style={{ fontSize: 13 }}>Aún no hay ventas registradas. Registra tu primera venta arriba.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ventas.map(v => (
                <div key={v.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', flexWrap: 'wrap' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: S.text }}>{v.cliente}</div>
                    <div style={{ fontSize: 12, color: S.muted }}>{v.producto} · {v.canal}</div>
                    {v.notas && <div style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', marginTop: 2 }}>{v.notas}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#a78bfa' }}>{copCurrency(v.monto)}</div>
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>{fmtDate(v.fecha)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={cargarVentas} style={{ ...btnOutline, ...btnSm, marginTop: 12 }}>↺ Actualizar</button>
        </div>
      )}

      {/* Tab: Comunicación */}
      {tab === 'comunicacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Push masivo */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 4 }}>📢 Notificación push masiva</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Llega a todos los socios que tienen las notificaciones activadas en su dispositivo.</div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Título</label>
              <input type="text" value={pushTitulo} onChange={e => setPushTitulo(e.target.value)} placeholder="Ej: Nueva actualización disponible" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Mensaje</label>
              <input type="text" value={pushCuerpo} onChange={e => setPushCuerpo(e.target.value)} placeholder="Ej: Revisa tus lotes activos, hay novedades." style={inputStyle} />
            </div>
            <button onClick={enviarPushMasivo} disabled={sendingPush || !pushTitulo || !pushCuerpo} style={{ ...btnPrimary, opacity: (sendingPush || !pushTitulo || !pushCuerpo) ? 0.5 : 1, cursor: (sendingPush || !pushTitulo || !pushCuerpo) ? 'not-allowed' : 'pointer' }}>
              {sendingPush ? 'Enviando…' : '📤 Enviar a todos'}
            </button>
            {pushResult && <div style={{ marginTop: 10, fontSize: 13, color: pushResult.startsWith('✅') ? S.green : S.red, fontWeight: 700 }}>{pushResult}</div>}
          </div>

          {/* Anuncio para socios */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 4 }}>📌 Anuncio en el dashboard</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>Aparece como banner en el resumen de todos los socios al abrir la app. Solo puede haber uno activo a la vez.</div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Texto del anuncio</label>
              <input type="text" value={anuncioTexto} onChange={e => setAnuncioTexto(e.target.value)} placeholder="Ej: ¡Nuevo video publicado! Revísalo en @prolarva.co" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => guardarAnuncio(false)} disabled={savingAnuncio || !anuncioTexto.trim()} style={{ ...btnPrimary, opacity: (savingAnuncio || !anuncioTexto.trim()) ? 0.5 : 1, cursor: (savingAnuncio || !anuncioTexto.trim()) ? 'not-allowed' : 'pointer' }}>
                {savingAnuncio ? 'Guardando…' : '📌 Publicar anuncio'}
              </button>
              <button onClick={() => guardarAnuncio(true)} disabled={savingAnuncio} style={{ ...btnOutline, ...btnSm, color: S.red, borderColor: 'rgba(239,68,68,0.3)' }}>
                Desactivar anuncio actual
              </button>
            </div>
            {anuncioOk && <div style={{ marginTop: 10, fontSize: 13, color: anuncioOk.startsWith('✅') ? S.green : S.red, fontWeight: 700 }}>{anuncioOk}</div>}
          </div>
        </div>
      )}

      {/* Tab: Invitaciones */}
      {tab === 'invitaciones' && (
        <div>
          {/* Botón generar */}
          <div style={{ marginBottom: 20 }}>
            <button
              style={{ ...btnPrimary, opacity: generating ? 0.6 : 1, cursor: generating ? 'not-allowed' : 'pointer' }}
              onClick={generar}
              disabled={generating}
            >
              {generating ? 'Generando...' : '+ Generar código de invitación'}
            </button>
            {genError && <span style={{ marginLeft: 12, fontSize: 12, color: S.red }}>{genError}</span>}
            <p style={{ fontSize: 11, color: S.muted, marginTop: 6 }}>El código se copia automáticamente al portapapeles.</p>
          </div>

          {/* Lista de códigos */}
          {loadingInv ? (
            <p style={{ color: S.muted, fontSize: 13 }}>Cargando...</p>
          ) : invitaciones.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '2rem', color: S.muted }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
              <p style={{ fontSize: 13 }}>No hay códigos aún. Generá el primero.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {invitaciones.map(inv => (
                <div key={inv.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', opacity: inv.usado ? 0.6 : 1 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: inv.usado ? S.muted : S.green, flexShrink: 0 }} />
                  <code style={{ fontSize: 15, fontWeight: 800, color: inv.usado ? S.muted : S.green2, letterSpacing: '0.06em', flex: 1 }}>
                    {inv.codigo}
                  </code>
                  <div style={{ fontSize: 11, color: S.muted, textAlign: 'right', lineHeight: 1.5 }}>
                    {inv.usado ? (
                      <>
                        <div>Usado por {inv.usado_por ?? '—'}</div>
                        <div>{inv.usado_en ? fmtDate(inv.usado_en) : ''}</div>
                      </>
                    ) : (
                      <div style={{ color: S.emerald, fontWeight: 700 }}>Disponible</div>
                    )}
                  </div>
                  {!inv.usado && (
                    <button
                      onClick={() => copiar(inv.codigo)}
                      style={{ ...btnOutline, ...btnSm, color: copied === inv.codigo ? S.green : S.muted, borderColor: copied === inv.codigo ? S.green : undefined, flexShrink: 0 }}
                    >
                      {copied === inv.codigo ? '✓ Copiado' : 'Copiar'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminView;
