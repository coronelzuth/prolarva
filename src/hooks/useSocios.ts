'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Lote {
  id: string;
  nombre: string;
  fecha: string;
  sustrato: number;
  tipoSustrato: string;
  huevos: string;
  temp: number | null;
  notas: string;
  creadoEn: string;
  objetivo?: 'cosechar' | 'continuar';
  /** Ajustes manuales del socio al ciclo estimado — { etapaKey: díaRealDeInicio }.
   *  Estilo app de periodo: marca cuándo entró de verdad a una etapa y las
   *  siguientes se recalculan. Ver `loteStarts()`. */
  ajustes?: Record<string, number>;
}

export interface FeedLog {
  id: string;
  loteId: string;
  fecha: string;
  cantidad: number;
  tipo: string;
  rechazo: 'ninguno' | 'leve' | 'moderado' | 'alto';
  notas: string;
}

export interface Cosecha {
  id: string;
  loteId: string;
  fecha: string;
  peso: number;
  sustratoTotal: number;
  calidad: 'excelente' | 'buena' | 'regular' | 'baja';
  notas: string;
}

export interface Recordatorio {
  id: string;
  loteId: string;
  dia: number;
  titulo: string;
  completado: boolean;
  creadoEn: string;
}

export interface Foto {
  id: string;
  loteId: string;
  data: string;        // base64 JPEG comprimido
  descripcion: string;
  creadoEn: string;
}

export interface VentaSocio {
  id: string;
  fecha: string;
  producto: 'larva' | 'harina' | 'abono';
  kg: number;
  precioCopKg: number;
  totalCop: number;
  comprador: string;
  notas: string;
  creadoEn: string;
}

export interface SocioSession {
  code: string;
  name: string;
  email: string;
  rol: 'admin' | 'socio';
  fases_aprobadas: number;
  fase_en_revision: number;
  token: string;
}

// ─── BSF Cycle ───────────────────────────────────────────────────────────────

export const BSF_STAGES = [
  { key: 'huevo',    name: 'Huevo',        icon: '🥚', days: [0, 4]   },
  { key: 'larvaJ',  name: 'Larva joven',  icon: '🐛', days: [5, 14]  },
  { key: 'larvaM',  name: 'Larva madura', icon: '🦟', days: [15, 21] },
  { key: 'prepupa', name: 'Prepupa',       icon: '⭐', days: [22, 28] },
  { key: 'cosecha', name: 'Cosecha',       icon: '⚖️', days: [29, 99] },
] as const;

export function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

export function getStage(days: number) {
  for (let i = 0; i < BSF_STAGES.length; i++) {
    const s = BSF_STAGES[i];
    if (days >= s.days[0] && days <= s.days[1]) return { ...s, idx: i };
  }
  return { ...BSF_STAGES[BSF_STAGES.length - 1], idx: BSF_STAGES.length - 1 };
}

/** Día base en que arranca cada etapa (derivado de BSF_STAGES): [0, 5, 15, 22, 29]. */
export const STAGE_BASE_STARTS: number[] = BSF_STAGES.map(s => s.days[0]);

/**
 * Días efectivos de inicio de cada etapa para un lote, aplicando los ajustes
 * manuales del socio. Si marca que una etapa empezó en el día X, el desfase
 * (X − día base) se arrastra a todas las etapas siguientes que no tengan su
 * propio ajuste — igual que una app de periodo recalcula el ciclo cuando
 * registras que te llegó antes o después.
 */
export function loteStarts(ajustes?: Record<string, number>): number[] {
  const a = ajustes ?? {};
  const starts: number[] = [];
  let shift = 0;
  BSF_STAGES.forEach((s, i) => {
    const base = STAGE_BASE_STARTS[i];
    let start: number;
    const aj = a[s.key];
    if (typeof aj === 'number' && isFinite(aj)) {
      start = Math.round(aj);
      shift = start - base;
    } else {
      start = base + shift;
    }
    if (i > 0) start = Math.max(start, starts[i - 1] + 1);
    starts.push(start);
  });
  return starts;
}

/** Etapa actual de un lote considerando sus ajustes manuales. */
export function getStageLote(lote: { fecha: string; ajustes?: Record<string, number> }) {
  const starts = loteStarts(lote.ajustes);
  const day = Math.max(0, daysSince(lote.fecha));
  let idx = 0;
  for (let i = starts.length - 1; i >= 0; i--) {
    if (day >= starts[i]) { idx = i; break; }
  }
  return { ...BSF_STAGES[idx], idx, starts, day };
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface AuthError {
  message: string;
  code?: string;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  session:        'prl-session',
  lotes:          'prl-lotes',
  feeds:          'prl-feeds',
  cosechas:       'prl-cosechas',
  recordatorios:  'prl-recordatorios',
  fotos:          'prl-fotos',
  ventasSocios:   'prl-ventas-socios',
};

function load<T>(key: string, def: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? def; } catch { return def; }
}
function localSave<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const DEMO_CODE = 'DEMO';

function demoData(): { lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[]; recordatorios: Recordatorio[]; fotos: Foto[] } {
  const d   = (days: number) => new Date(Date.now() - days * 86_400_000);
  const ds  = (days: number) => d(days).toISOString().split('T')[0];
  const di  = (days: number) => d(days).toISOString();
  const lotes: Lote[] = [
    { id: 'demo-l1', nombre: 'Lote A — Cáscaras de frutas', fecha: ds(4),  sustrato: 2, tipoSustrato: 'Cáscaras de frutas', huevos: '3 g', temp: 27,   notas: 'Primer lote, buena eclosión',       creadoEn: di(4),  objetivo: 'cosechar' },
    { id: 'demo-l2', nombre: 'Lote B — Gallinaza',          fecha: ds(15), sustrato: 3, tipoSustrato: 'Gallinaza',          huevos: '5 g', temp: 28,   notas: '',                                  creadoEn: di(15), objetivo: 'cosechar' },
    { id: 'demo-l3', nombre: 'Lote C — Residuos cocina',    fecha: ds(23), sustrato: 4, tipoSustrato: 'Restos de verduras', huevos: '4 g', temp: null, notas: '¡Casi listo para cosechar!',        creadoEn: di(23), objetivo: 'cosechar' },
  ];
  const feeds: FeedLog[] = [
    { id: 'demo-f1', loteId: 'demo-l2', fecha: ds(12), cantidad: 0.5, tipo: 'Gallinaza',          rechazo: 'ninguno', notas: '' },
    { id: 'demo-f2', loteId: 'demo-l2', fecha: ds(9),  cantidad: 0.8, tipo: 'Gallinaza',          rechazo: 'leve',    notas: 'Temperatura alta esa semana' },
    { id: 'demo-f3', loteId: 'demo-l3', fecha: ds(20), cantidad: 1.2, tipo: 'Restos de verduras', rechazo: 'ninguno', notas: '' },
    { id: 'demo-f4', loteId: 'demo-l3', fecha: ds(17), cantidad: 1.0, tipo: 'Restos de verduras', rechazo: 'ninguno', notas: 'Buena conversión' },
    { id: 'demo-f5', loteId: 'demo-l3', fecha: ds(13), cantidad: 1.1, tipo: 'Mezcla orgánica',    rechazo: 'ninguno', notas: '' },
  ];
  const cosechas: Cosecha[] = [
    { id: 'demo-c1', loteId: 'demo-l3', fecha: ds(2), peso: 0.9, sustratoTotal: 4.5, calidad: 'buena', notas: 'Primera cosecha parcial' },
  ];
  return { lotes, feeds, cosechas, recordatorios: [], fotos: [] };
}

function cargarDemo(
  setLotes: (v: Lote[]) => void, setFeeds: (v: FeedLog[]) => void, setCosechas: (v: Cosecha[]) => void,
  setRecordatorios: (v: Recordatorio[]) => void, setFotos: (v: Foto[]) => void,
) {
  if (load<Lote[]>(KEYS.lotes, []).length > 0) return;
  const demo = demoData();
  setLotes(demo.lotes); setFeeds(demo.feeds); setCosechas(demo.cosechas);
  setRecordatorios([]); setFotos([]);
  localSave(KEYS.lotes, demo.lotes); localSave(KEYS.feeds, demo.feeds); localSave(KEYS.cosechas, demo.cosechas);
  localSave(KEYS.recordatorios, []); localSave(KEYS.fotos, []);
}

// ─── API de datos del socio (/api/socios/data) ────────────────────────────────

/** Escritura fire-and-forget. El socio_code lo resuelve el servidor desde el token. */
async function postData(action: string, payload: unknown = {}): Promise<unknown> {
  const sess = load<SocioSession | null>(KEYS.session, null);
  if (!sess?.token || sess.code === DEMO_CODE) return null;
  try {
    const res = await fetch('/api/socios/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: sess.token, action, payload }),
    });
    if (!res.ok) { console.error('[ProLarva] data', action, res.status); return null; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await res.json() as any).data ?? true;
  } catch (e) {
    console.error('[ProLarva] data', action, e);
    return null;
  }
}

interface SocioData {
  lotes: Lote[]; feeds: FeedLog[]; cosechas: Cosecha[];
  recordatorios: Recordatorio[]; fotos: Foto[]; ventasSocios: VentaSocio[];
}

async function fetchSocioData(local: SocioData): Promise<SocioData | null> {
  const sess = load<SocioSession | null>(KEYS.session, null);
  if (!sess?.token || sess.code === DEMO_CODE) return null;
  try {
    const res = await fetch('/api/socios/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: sess.token, action: 'sync', payload: { local } }),
    });
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await res.json() as any).data as SocioData;
  } catch {
    return null;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSocios() {
  const [session,        setSession]        = useState<SocioSession | null>(null);
  const [lotes,          setLotes]          = useState<Lote[]>([]);
  const [feeds,          setFeeds]          = useState<FeedLog[]>([]);
  const [cosechas,       setCosechas]       = useState<Cosecha[]>([]);
  const [recordatorios,  setRecordatorios]  = useState<Recordatorio[]>([]);
  const [fotos,          setFotos]          = useState<Foto[]>([]);
  const [ventasSocios,   setVentasSocios]   = useState<VentaSocio[]>([]);
  const [loaded,         setLoaded]         = useState(false);

  function aplicarData(result: SocioData) {
    setLotes(result.lotes);                 localSave(KEYS.lotes, result.lotes);
    setFeeds(result.feeds);                 localSave(KEYS.feeds, result.feeds);
    setCosechas(result.cosechas);           localSave(KEYS.cosechas, result.cosechas);
    setRecordatorios(result.recordatorios); localSave(KEYS.recordatorios, result.recordatorios);
    setFotos(result.fotos);                 localSave(KEYS.fotos, result.fotos);
    setVentasSocios(result.ventasSocios);   localSave(KEYS.ventasSocios, result.ventasSocios);
  }

  useEffect(() => {
    async function init() {
      const sess = load<SocioSession | null>(KEYS.session, null);
      setSession(sess);

      const local: SocioData = {
        lotes:         load<Lote[]>(KEYS.lotes, []),
        feeds:         load<FeedLog[]>(KEYS.feeds, []),
        cosechas:      load<Cosecha[]>(KEYS.cosechas, []),
        recordatorios: load<Recordatorio[]>(KEYS.recordatorios, []),
        fotos:         load<Foto[]>(KEYS.fotos, []),
        ventasSocios:  load<VentaSocio[]>(KEYS.ventasSocios, []),
      };
      setLotes(local.lotes);
      setFeeds(local.feeds);
      setCosechas(local.cosechas);
      setRecordatorios(local.recordatorios);
      setFotos(local.fotos);
      setVentasSocios(local.ventasSocios);

      if (sess && sess.code !== DEMO_CODE) {
        // Refrescar la cuenta (fases aprobadas, rol, email) — antes había que cerrar
        // sesión para ver una fase aprobada por el admin o el Monitor desbloqueado.
        const db = getSupabase();
        if (db) {
          try {
            const { data: fresh } = await db
              .from('socios')
              .select('codigo,nombre,email,rol,fases_aprobadas,fase_en_revision,estado')
              .eq('codigo', sess.code)
              .single();
            if (fresh) {
              if (fresh.estado && fresh.estado !== 'activo') {
                setSession(null);
                Object.values(KEYS).forEach(k => localSave(k, k === KEYS.session ? null : []));
                setLoaded(true);
                return;
              }
              const refreshed: SocioSession = {
                code: fresh.codigo,
                name: fresh.nombre ?? sess.name,
                email: fresh.email ?? sess.email ?? '',
                rol: (fresh.rol ?? sess.rol) as 'admin' | 'socio',
                fases_aprobadas: fresh.fases_aprobadas ?? 0,
                fase_en_revision: fresh.fase_en_revision ?? 0,
                token: sess.token,
              };
              setSession(refreshed);
              localSave(KEYS.session, refreshed);
            }
          } catch { /* sin conexión — se usa la sesión de localStorage */ }
        }

        const result = await fetchSocioData(local);
        if (result) aplicarData(result);
        else if (!sess.token) {
          // sesión vieja sin token (antes del refactor) — forzar re-login
          setSession(null);
          Object.values(KEYS).forEach(k => localSave(k, k === KEYS.session ? null : []));
          setLoaded(true);
          return;
        }
      }

      setLoaded(true);
    }
    init();
  }, []);

  // ─── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (code: string, pass: string): Promise<boolean> => {
    try {
      if (code.toUpperCase() === DEMO_CODE) {
        const s: SocioSession = { code: DEMO_CODE, name: 'Visitante', email: '', rol: 'socio', fases_aprobadas: 0, fase_en_revision: 0, token: '' };
        setSession(s);
        localSave(KEYS.session, s);
        cargarDemo(setLotes, setFeeds, setCosechas, setRecordatorios, setFotos);
        return true;
      }

      const res = await fetch('/api/socios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password: pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) return false;

      const s: SocioSession = {
        code: data.codigo, name: data.nombre, email: data.email ?? '',
        rol: data.rol ?? 'socio', fases_aprobadas: data.fases_aprobadas ?? 0,
        fase_en_revision: data.fase_en_revision ?? 0, token: data.token,
      };
      setSession(s);
      localSave(KEYS.session, s);

      const local: SocioData = {
        lotes:         load<Lote[]>(KEYS.lotes, []),
        feeds:         load<FeedLog[]>(KEYS.feeds, []),
        cosechas:      load<Cosecha[]>(KEYS.cosechas, []),
        recordatorios: load<Recordatorio[]>(KEYS.recordatorios, []),
        fotos:         load<Foto[]>(KEYS.fotos, []),
        ventasSocios:  load<VentaSocio[]>(KEYS.ventasSocios, []),
      };
      const result = await fetchSocioData(local);
      if (result) aplicarData(result);

      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(
    async (email: string, nombre: string, password: string, codigoInvitacion: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch('/api/socios/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, nombre, password, codigoInvitacion }),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, error: data.error ?? 'Error al registrar' };
        const loginSuccess = await login(email, password);
        return { success: loginSuccess, error: loginSuccess ? undefined : 'No se pudo iniciar sesión' };
      } catch {
        return { success: false, error: 'Error de conexión' };
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    void postData('logout');
    setSession(null);
    setLotes([]); setFeeds([]); setCosechas([]); setRecordatorios([]); setFotos([]); setVentasSocios([]);
    Object.values(KEYS).forEach(k => localSave(k, k === KEYS.session ? null : []));
  }, []);

  // ─── Lotes ─────────────────────────────────────────────────────────────────

  const addLote = useCallback(async (lote: Omit<Lote, 'id' | 'creadoEn'>) => {
    const next: Lote = { ...lote, id: uid(), creadoEn: new Date().toISOString() };
    setLotes(prev => { const arr = [...prev, next]; localSave(KEYS.lotes, arr); return arr; });
    await postData('lote.add', next);
  }, []);

  const deleteLote = useCallback(async (id: string) => {
    setLotes(prev => { const arr = prev.filter(l => l.id !== id); localSave(KEYS.lotes, arr); return arr; });
    setFeeds(prev => { const arr = prev.filter(f => f.loteId !== id); localSave(KEYS.feeds, arr); return arr; });
    setCosechas(prev => { const arr = prev.filter(c => c.loteId !== id); localSave(KEYS.cosechas, arr); return arr; });
    setRecordatorios(prev => { const arr = prev.filter(r => r.loteId !== id); localSave(KEYS.recordatorios, arr); return arr; });
    setFotos(prev => { const arr = prev.filter(f => f.loteId !== id); localSave(KEYS.fotos, arr); return arr; });
    await postData('lote.delete', { id });
  }, []);

  const updateLote = useCallback(async (id: string, updates: Partial<Pick<Lote, 'nombre' | 'fecha' | 'ajustes'>>) => {
    setLotes(prev => { const arr = prev.map(l => l.id === id ? { ...l, ...updates } : l); localSave(KEYS.lotes, arr); return arr; });
    await postData('lote.update', { id, updates });
  }, []);

  // ─── Feeds ─────────────────────────────────────────────────────────────────

  const addFeed = useCallback(async (feed: Omit<FeedLog, 'id'>) => {
    const next: FeedLog = { ...feed, id: uid() };
    setFeeds(prev => { const arr = [...prev, next]; localSave(KEYS.feeds, arr); return arr; });
    await postData('feed.add', next);
  }, []);

  // ─── Cosechas ──────────────────────────────────────────────────────────────

  const addCosecha = useCallback(async (cosecha: Omit<Cosecha, 'id'>) => {
    const next: Cosecha = { ...cosecha, id: uid() };
    setCosechas(prev => { const arr = [...prev, next]; localSave(KEYS.cosechas, arr); return arr; });
    await postData('cosecha.add', next);
  }, []);

  // ─── Recordatorios ─────────────────────────────────────────────────────────

  const addRecordatorio = useCallback(async (rec: Omit<Recordatorio, 'id' | 'completado' | 'creadoEn'>) => {
    const next: Recordatorio = { ...rec, id: uid(), completado: false, creadoEn: new Date().toISOString() };
    setRecordatorios(prev => { const arr = [...prev, next]; localSave(KEYS.recordatorios, arr); return arr; });
    await postData('recordatorio.add', next);
  }, []);

  const toggleRecordatorio = useCallback(async (id: string) => {
    let completado = false;
    setRecordatorios(prev => {
      const arr = prev.map(r => r.id === id ? { ...r, completado: !r.completado } : r);
      completado = arr.find(r => r.id === id)?.completado ?? false;
      localSave(KEYS.recordatorios, arr);
      return arr;
    });
    await postData('recordatorio.toggle', { id, completado });
  }, []);

  const deleteRecordatorio = useCallback(async (id: string) => {
    setRecordatorios(prev => { const arr = prev.filter(r => r.id !== id); localSave(KEYS.recordatorios, arr); return arr; });
    await postData('recordatorio.delete', { id });
  }, []);

  // ─── Fotos ─────────────────────────────────────────────────────────────────

  const addFoto = useCallback(async (foto: Omit<Foto, 'id' | 'creadoEn'>) => {
    const next: Foto = { ...foto, id: uid(), creadoEn: new Date().toISOString() };
    setFotos(prev => { const arr = [...prev, next]; localSave(KEYS.fotos, arr); return arr; });
    await postData('foto.add', next);
  }, []);

  const deleteFoto = useCallback(async (id: string) => {
    setFotos(prev => { const arr = prev.filter(f => f.id !== id); localSave(KEYS.fotos, arr); return arr; });
    await postData('foto.delete', { id });
  }, []);

  // ─── Ventas socios ─────────────────────────────────────────────────────────

  const addVentaSocio = useCallback(async (venta: Omit<VentaSocio, 'id' | 'creadoEn'>) => {
    const next: VentaSocio = { ...venta, id: uid(), creadoEn: new Date().toISOString() };
    setVentasSocios(prev => { const arr = [...prev, next]; localSave(KEYS.ventasSocios, arr); return arr; });
    await postData('venta.add', next);
  }, []);

  const deleteVentaSocio = useCallback(async (id: string) => {
    setVentasSocios(prev => { const arr = prev.filter(v => v.id !== id); localSave(KEYS.ventasSocios, arr); return arr; });
    await postData('venta.delete', { id });
  }, []);

  const updateName = useCallback(async (nombre: string): Promise<boolean> => {
    const sess = load<SocioSession | null>(KEYS.session, null);
    if (!sess?.token) return false;
    const trimmed = nombre.trim();
    try {
      const res = await fetch('/api/socios/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sess.token, nombre: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return false;
      setSession(prev => {
        if (!prev) return prev;
        const updated = { ...prev, name: trimmed };
        localSave(KEYS.session, updated);
        return updated;
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateEmail = useCallback(async (email: string): Promise<{ ok: boolean; error?: string }> => {
    const sess = load<SocioSession | null>(KEYS.session, null);
    if (!sess?.token) return { ok: false, error: 'Sin sesión' };
    try {
      const res = await fetch('/api/socios/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sess.token, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { ok: false, error: data.error ?? 'Error al guardar' };
      setSession(prev => {
        if (!prev) return prev;
        const updated = { ...prev, email };
        localSave(KEYS.session, updated);
        return updated;
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de conexión' };
    }
  }, []);

  const updateFases = useCallback((faseEnRevision: number, fasesAprobadas?: number) => {
    setSession(prev => {
      if (!prev) return prev;
      const updated = { ...prev, fase_en_revision: faseEnRevision, fases_aprobadas: fasesAprobadas ?? prev.fases_aprobadas };
      localSave(KEYS.session, updated);
      return updated;
    });
  }, []);

  const resetAllData = useCallback(async () => {
    setLotes([]); setFeeds([]); setCosechas([]); setRecordatorios([]); setFotos([]);
    localSave(KEYS.lotes, []); localSave(KEYS.feeds, []); localSave(KEYS.cosechas, []);
    localSave(KEYS.recordatorios, []); localSave(KEYS.fotos, []);
    await postData('reset');
  }, []);

  // ─── Computed ──────────────────────────────────────────────────────────────

  const activeLotes = lotes.filter(l => daysSince(l.fecha) <= 32);
  const readyLotes  = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 28; });
  const totalKg     = cosechas.reduce((a, c) => a + c.peso, 0);
  const convs       = cosechas.filter(c => c.sustratoTotal > 0).map(c => (c.peso / c.sustratoTotal) * 100);
  const avgConv     = convs.length ? convs.reduce((a, b) => a + b, 0) / convs.length : null;

  return {
    loaded, session, login, logout, register,
    lotes, feeds, cosechas, recordatorios, fotos, ventasSocios,
    addLote, deleteLote, updateLote,
    addFeed,
    addCosecha,
    addRecordatorio, toggleRecordatorio, deleteRecordatorio,
    addFoto, deleteFoto,
    addVentaSocio, deleteVentaSocio,
    updateName, updateEmail, updateFases, resetAllData,
    activeLotes, readyLotes, totalKg, avgConv,
  };
}
