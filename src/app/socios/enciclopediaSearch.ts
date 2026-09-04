import { stages } from '@/data/stages';
import { metas } from '@/data/metas';
import {
  GLOSARIO,
  LOWCOST_SISTEMAS, LOWCOST_TIPS,
  ALIMENTACION_SI, ALIMENTACION_NO, ALIMENTACION_ETAPAS, PROTEINA_NIVELES, ALIMENTACION_REGLAS,
  PROCESAMIENTO,
  CRIA_PASOS, CRIA_CICLO_CERRADO,
} from '@/data/enciclopedia';
import type { EncSec } from './EnciclopediaView';

// ─── Búsqueda global de la Enciclopedia ──────────────────────────────────────
// Índice plano de todo el contenido (menos el bot) para buscar de una sola vez.

export interface SearchHit {
  section: EncSec;
  sectionLabel: string;
  icon: string;
  title: string;
  snippet: string;
  anchor?: string;  // id al que hacer scroll dentro de la sección
  term?: string;    // vocabulario: precarga el buscador de esa sección
}

const stripAcentos = (s: string) => s.normalize('NFD').replace(new RegExp('[\u0300-\u036f]', 'g'), '').toLowerCase();
const norm = stripAcentos;

interface Entry extends SearchHit { haystack: string }

let INDEX: Entry[] | null = null;

function build(): Entry[] {
  const e: Entry[] = [];
  const add = (x: SearchHit & { extra?: string }) => {
    const { extra, ...hit } = x;
    e.push({ ...hit, haystack: norm([hit.title, hit.snippet, extra].filter(Boolean).join(' ')) });
  };

  stages.forEach(s => add({
    section: 'ciclo', sectionLabel: 'El ciclo', icon: '🔄',
    title: `${s.emoji} ${s.name}`, snippet: s.description,
    extra: [...(s.tips ?? []), ...(s.alerts ?? [])].join(' '),
  }));

  [...CRIA_PASOS, ...CRIA_CICLO_CERRADO].forEach(p => add({
    section: 'cria', sectionLabel: 'Cría paso a paso', icon: '🌾',
    anchor: p.n <= 5 ? 'cria-meta1' : 'cria-cerrado',
    title: `Paso ${p.n} · ${p.title}`, snippet: p.summary,
    extra: [...p.description, ...p.tips, ...p.alerts, p.registro].join(' '),
  }));

  metas.forEach(m => add({
    section: 'rutas', sectionLabel: 'Rutas de producción', icon: '🎯',
    title: `${m.emoji} ${m.title}`, snippet: m.description,
    extra: [m.tagline, m.when, ...m.steps.map(s => `${s.title} ${s.description}`), ...m.resources].join(' '),
  }));

  ALIMENTACION_SI.forEach(s => add({
    section: 'alimentacion', sectionLabel: 'Qué darles', icon: '✅', anchor: 'ali-si',
    title: `${s.emoji} ${s.nombre}`, snippet: `${s.nivel} · ~${s.proteina} proteína. ${s.desc}`,
  }));
  ALIMENTACION_NO.forEach(n => add({
    section: 'alimentacion', sectionLabel: 'Qué NO darles', icon: '❌', anchor: 'ali-no',
    title: `${n.emoji} ${n.texto}`, snippet: n.razon,
  }));
  ALIMENTACION_ETAPAS.forEach(a => add({
    section: 'alimentacion', sectionLabel: 'Porciones por etapa', icon: '📊', anchor: 'ali-etapas',
    title: `${a.emoji} ${a.dias} — ${a.fase}`, snippet: a.nota,
    extra: [a.sustrato, a.proteina, a.humedad, a.frecuencia, a.cantidad].join(' '),
  }));
  PROTEINA_NIVELES.forEach(p => add({
    section: 'alimentacion', sectionLabel: 'Subir proteína', icon: '💪', anchor: 'ali-proteina',
    title: `${p.proteina} · ${p.label}`, snippet: p.sustrato,
  }));
  ALIMENTACION_REGLAS.forEach(r => add({
    section: 'alimentacion', sectionLabel: 'Reglas base', icon: '🥗',
    title: `${r.icon} ${r.label}`, snippet: r.valor,
  }));

  PROCESAMIENTO.forEach(r => add({
    section: 'procesamiento', sectionLabel: 'Procesamiento', icon: '🏭', anchor: 'proc-detalle',
    title: `${r.emoji} ${r.titulo}`, snippet: r.tagline,
    extra: [r.cuando, ...r.pros, ...r.contras, ...r.pasos.map(p => `${p.titulo} ${p.desc}`), ...r.materiales].join(' '),
  }));

  LOWCOST_SISTEMAS.forEach(s => add({
    section: 'lowcost', sectionLabel: 'Low cost', icon: '💸', anchor: 'lc-sistemas',
    title: `${s.emoji} ${s.nombre}`, snippet: `${s.animal} · ${s.inversion}. ${s.principio}`,
    extra: [...s.pasos, ...s.limitaciones, ...s.materiales.map(m => `${m.item} ${m.spec}`)].join(' '),
  }));
  LOWCOST_TIPS.forEach((t, i) => add({
    section: 'lowcost', sectionLabel: 'Low cost · trucos', icon: '💡', anchor: 'lc-trucos',
    title: `Truco ${i + 1}`, snippet: t,
  }));

  GLOSARIO.forEach(t => add({
    section: 'vocabulario', sectionLabel: 'Vocabulario', icon: '📖',
    title: t.termino + (t.sigla ? ` (${t.sigla})` : ''), snippet: t.def, term: t.termino,
  }));

  return e;
}

export function searchEnciclopedia(query: string, limit = 30): SearchHit[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  if (!INDEX) INDEX = build();

  const words = q.split(/\s+/).filter(Boolean);
  const scored: { hit: SearchHit; score: number }[] = [];

  for (const e of INDEX) {
    const nt = norm(e.title);
    let score = 0;
    let ok = true;
    for (const w of words) {
      const ti = nt.indexOf(w);
      if (ti >= 0) score += 12 - Math.min(ti, 8);
      else if (e.haystack.includes(w)) score += 3;
      else { ok = false; break; }
    }
    if (ok && score > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { haystack, ...hit } = e;
      scored.push({ hit, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.hit);
}
