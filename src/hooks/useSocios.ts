'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Lote {
  id: string;
  nombre: string;
  fecha: string; // ISO date YYYY-MM-DD
  sustrato: number;
  tipoSustrato: string;
  huevos: string;
  temp: number | null;
  notas: string;
  creadoEn: string;
}

export interface FeedLog {
  id: string;
  loteId: string;
  fecha: string; // ISO datetime
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

export interface SocioSession {
  code: string;
  name: string;
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

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Demo credentials ─────────────────────────────────────────────────────────

const DEMO_USERS: { code: string; pass: string; name: string }[] = [
  { code: 'SOCIO-2025',            pass: 'larva123',     name: 'Socio Demo' },
  { code: 'coronelzulieth@gmail.com', pass: 'prolarva2025', name: 'Juliana Coronel' },
  { code: 'PROLARVA-ADMIN',        pass: 'admin2025',    name: 'Juliana Coronel' },
];

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  session: 'prl-session',
  lotes:   'prl-lotes',
  feeds:   'prl-feeds',
  cosechas:'prl-cosechas',
};

function load<T>(key: string, def: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') ?? def; } catch { return def; }
}
function save<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSocios() {
  const [session, setSession]   = useState<SocioSession | null>(null);
  const [lotes,   setLotes]     = useState<Lote[]>([]);
  const [feeds,   setFeeds]     = useState<FeedLog[]>([]);
  const [cosechas,setCosechas]  = useState<Cosecha[]>([]);
  const [loaded,  setLoaded]    = useState(false);

  useEffect(() => {
    setSession(load(KEYS.session, null));
    setLotes(load(KEYS.lotes, []));
    setFeeds(load(KEYS.feeds, []));
    setCosechas(load(KEYS.cosechas, []));
    setLoaded(true);
  }, []);

  // Auth
  const login = useCallback((code: string, pass: string): boolean => {
    const found = DEMO_USERS.find(
      u => u.code.toLowerCase() === code.toLowerCase() && u.pass === pass
    );
    if (!found) return false;
    const s = { code: found.code, name: found.name };
    setSession(s);
    save(KEYS.session, s);
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    save(KEYS.session, null);
  }, []);

  // Lotes
  const addLote = useCallback((lote: Omit<Lote, 'id' | 'creadoEn'>) => {
    const next: Lote = { ...lote, id: uid(), creadoEn: new Date().toISOString() };
    setLotes(prev => { const arr = [...prev, next]; save(KEYS.lotes, arr); return arr; });
  }, []);

  const deleteLote = useCallback((id: string) => {
    setLotes(prev => { const arr = prev.filter(l => l.id !== id); save(KEYS.lotes, arr); return arr; });
  }, []);

  // Feeds
  const addFeed = useCallback((feed: Omit<FeedLog, 'id'>) => {
    const next: FeedLog = { ...feed, id: uid() };
    setFeeds(prev => { const arr = [...prev, next]; save(KEYS.feeds, arr); return arr; });
  }, []);

  // Cosechas
  const addCosecha = useCallback((cosecha: Omit<Cosecha, 'id'>) => {
    const next: Cosecha = { ...cosecha, id: uid() };
    setCosechas(prev => { const arr = [...prev, next]; save(KEYS.cosechas, arr); return arr; });
  }, []);

  // Computed stats
  const activeLotes  = lotes.filter(l => daysSince(l.fecha) <= 32);
  const readyLotes   = lotes.filter(l => { const d = daysSince(l.fecha); return d >= 22 && d <= 32; });
  const totalKg      = cosechas.reduce((a, c) => a + c.peso, 0);
  const convs        = cosechas.filter(c => c.sustratoTotal > 0).map(c => (c.peso / c.sustratoTotal) * 100);
  const avgConv      = convs.length ? convs.reduce((a, b) => a + b, 0) / convs.length : null;

  return {
    loaded, session, login, logout,
    lotes, feeds, cosechas,
    addLote, deleteLote, addFeed, addCosecha,
    activeLotes, readyLotes, totalKg, avgConv,
  };
}
