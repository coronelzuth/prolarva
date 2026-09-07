'use client';

import { useState, useEffect } from 'react';

const WA = '573223212293';

interface SpecieData {
  nom: string; pl: string; dias: number; kg: number; pA: number;
  mn: number; mx: number; df: number; fcr: number; h: string;
}

const E: Record<string, SpecieData> = {
  pollos: { nom: 'pollo', pl: 'pollos', dias: 42,  kg: 4.771, pA: 25000,  mn: 5,  mx: 30, df: 25, fcr: .10, h: '42 días estándar para pollos de engorde' },
  cerdos: { nom: 'cerdo', pl: 'cerdos', dias: 120, kg: 195,   pA: 400000, mn: 5,  mx: 20, df: 20, fcr: .05, h: '120 días estándar para cerdos de engorde' },
  peces:  { nom: 'pez',  pl: 'peces',  dias: 180, kg: 2.5,   pA: 8000,   mn: 10, mx: 50, df: 40, fcr: .08, h: '180 días para tilapia / cachama' },
};

// kg por bulto de concentrado — varía por zona
const BULTOS = [40, 45, 30, 25];

function cop(n: number) { return '$' + Math.round(n).toLocaleString('es-CO'); }
function kgf(n: number) { return n >= 1000 ? (n/1e3).toFixed(2)+' ton' : n < 1 ? Math.round(n*1e3)+' g' : n.toFixed(1)+' kg'; }

const C = {
  bg: '#0d1b2a', card: '#152035', card2: '#1e3050',
  green: '#22c55e', greenL: '#4ade80', greenD: '#16a34a',
  red: '#ef4444', text: '#e2e8f0', muted: '#94a3b8',
  border: 'rgba(14,165,233,0.2)', amber: '#f59e0b',
};

interface CalcResult {
  totalPerd: number; perdMort: number; perdFCR: number;
  perdAcum: number; cicElap: number; recup: number; salv: number;
}

// producción propia de BSF con el Kit — costo estimado por kg de larva fresca
const PBSF_PROPIO = 3000;

export default function CalculadoraPage() {
  const [step, setStep]       = useState(1);
  const [esp, setEsp]         = useState<string | null>(null);
  const [nAnim, setNAnim]     = useState(100);
  const [pBulto, setPBulto]   = useState(120000);
  const [bultoKg, setBultoKg] = useState(40);

  // datos finos — prellenados por especie, editables en "Ajustar datos"
  const [dias, setDias]   = useState(42);
  const [pAnim, setPAnim] = useState(25000);
  const [mort, setMort]   = useState(5);
  const [slBSF, setSlBSF] = useState(25);
  const [ajOpen, setAjOpen] = useState(false);

  const [nombre, setNombre] = useState('');
  const [waNum, setWaNum]   = useState('');
  const [confVisible, setConfVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  const pConc = bultoKg > 0 ? pBulto / bultoKg : 0;

  useEffect(() => {
    if (step !== 2 || !esp) return;
    const d = E[esp];
    const kgA = d.kg * (dias / d.dias);
    const kgT = nAnim * kgA;
    const mSin = nAnim * (mort / 100);
    const mCon = mSin * 0.80;
    const perdMort = (mSin - mCon) * pAnim;
    const perdFCR = kgT * d.fcr * pConc;
    const totalPerd = perdMort + perdFCR;
    const kgBSF = kgT * (slBSF / 100);
    const costBSF = kgBSF * PBSF_PROPIO;
    const costoExtra = (kgT * (1 - slBSF / 100) * pConc + costBSF) - (kgT * pConc);
    const recup = totalPerd - costoExtra;
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000);
    const cicElap = Math.max(1, Math.floor(dayOfYear / dias));
    const salv = Math.round((mSin - mCon) * 10) / 10;
    setResult({ totalPerd, perdMort, perdFCR, perdAcum: cicElap * totalPerd, cicElap, recup, salv });
  }, [step, esp, nAnim, pConc, dias, pAnim, mort, slBSF]);

  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEspecie(e: string) {
    const d = E[e];
    setEsp(e);
    setDias(d.dias);
    setPAnim(d.pA);
    setSlBSF(d.df);
  }

  const listo = !!esp && nAnim > 0 && pBulto > 0 && bultoKg > 0;

  function buildMsg(tipo: 'colonia' | 'pedido') {
    const d = E[esp || 'pollos'];
    const p = result ? cop(result.totalPerd) : '?';
    const animLabel = nAnim === 1 ? d.nom : d.pl;
    let m = tipo === 'colonia'
      ? `Hola ProLarva 👋 Calculé que sin BSF pierdo ~${p} por ciclo con mis ${nAnim} ${animLabel}. Quiero mi cupo en el Curso Colonia para producir mi propia larva.`
      : `Hola ProLarva 👋 Tengo ${nAnim} ${animLabel} y quiero comprar larva BSF. ¿Me pasan precios?`;
    if (nombre) m = `Hola ProLarva, soy ${nombre}. ` + m.replace('Hola ProLarva 👋 ', '');
    return m;
  }

  function openWA(tipo: 'colonia' | 'pedido') {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildMsg(tipo))}`, '_blank');
    if (nombre || waNum) {
      setConfVisible(true);
      fetch('/api/leads/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          whatsapp: waNum,
          fuente: 'calculadora',
          especie: esp ?? '',
          n_animales: nAnim,
          perdida_cop: result?.totalPerd ?? 0,
          tipo_cta: tipo,
        }),
      }).catch(() => {});
    }
  }

  function compartir() {
    const d = E[esp || 'pollos'];
    const perdida = result ? cop(result.totalPerd) : '?';
    const url = 'https://prolarva.co/calculadora';
    const texto = `👀 Ojo con esto: calculé que sin BSF estoy perdiendo ${perdida} por ciclo con mis ${nAnim} ${d.pl}.\n\nTú también puedes calcularlo aquí 👇\n${url}`;
    if (navigator.share) {
      navigator.share({ title: 'Calculadora BSF — ProLarva', text: texto, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => window.open(url, '_blank'));
    }
  }

  const espD = esp ? E[esp] : null;
  const slBg = (val: number, mn: number, mx: number) => {
    const p = ((val - mn) / (mx - mn)) * 100;
    return `linear-gradient(to right, #22c55e ${p}%, #1e3050 ${p}%)`;
  };

  const inp: React.CSSProperties = { width: '100%', border: `2px solid ${C.border}`, borderRadius: 10, padding: '11px 13px', fontSize: 16, fontFamily: 'inherit', background: C.card2, color: C.text, outline: 'none' };
  const inpPfx: React.CSSProperties = { ...inp, paddingLeft: 52 };

  return (
    <div style={{ background: C.bg, minHeight: 'calc(100vh - 60px)', fontFamily: "'Montserrat', sans-serif", color: C.text }}>

      {/* Progress: 2 pasos */}
      <div style={{ background: '#0a1628', borderBottom: `1px solid ${C.border}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, maxWidth: 320, margin: '0 auto' }}>
          {[{ n: 1, label: 'Tus datos' }, { n: 2, label: 'Resultado' }].map((dot, i) => (
            <div key={dot.n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: dot.n < step ? C.green : dot.n === step ? '#fff' : 'rgba(255,255,255,0.1)', color: dot.n <= step ? '#0a1628' : 'rgba(255,255,255,0.4)' }}>
                  {dot.n < step ? '✓' : dot.n}
                </div>
                <span style={{ fontSize: 11, fontWeight: dot.n === step ? 700 : 400, color: dot.n === step ? C.greenL : C.muted }}>{dot.label}</span>
              </div>
              {i === 0 && <div style={{ width: 28, height: 2, background: step > 1 ? C.green : 'rgba(255,255,255,0.12)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>

        {/* ── PANTALLA 1: Datos ── */}
        {step === 1 && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.greenL, marginBottom: 6 }}>🧮 ¿Para qué sirve esto?</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                En 1 minuto ves <strong style={{ color: C.text }}>cuánto dinero pierdes cada ciclo</strong> por mortalidad y por concentrado mal aprovechado al no usar larva BSF.
              </p>
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: C.greenL, marginBottom: 4 }}>¿Qué crías?</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Toca tu especie.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
              {[{ key: 'pollos', ic: '🐔', nm: 'Pollos', sub: 'Engorde' }, { key: 'cerdos', ic: '🐷', nm: 'Cerdos', sub: 'Engorde' }, { key: 'peces', ic: '🐟', nm: 'Peces', sub: 'Tilapia / otros' }].map(sp => (
                <button key={sp.key} onClick={() => handleEspecie(sp.key)} style={{ border: `2px solid ${esp === sp.key ? C.green : C.border}`, background: esp === sp.key ? 'rgba(34,197,94,0.12)' : C.card, borderRadius: 14, padding: '14px 6px', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 32, marginBottom: 5 }}>{sp.ic}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.greenL }}>{sp.nm}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sp.sub}</div>
                </button>
              ))}
            </div>

            <div style={{ background: C.card, borderRadius: 16, padding: 18, marginBottom: 14, border: `1px solid ${C.border}`, opacity: esp ? 1 : 0.5, pointerEvents: esp ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
              <Fg label={`¿Cuántos ${espD?.pl || 'animales'} tienes en el lote?`} hint="cabezas">
                <input type="number" value={nAnim} onChange={e => setNAnim(+e.target.value)} min={1} style={inp} />
              </Fg>
              <Fg label="¿Cuánto te cuesta el bulto de concentrado?" hint="el que usas ahora" noMb>
                <Pfx><input type="number" value={pBulto} onChange={e => setPBulto(+e.target.value)} min={1000} step={1000} style={inpPfx} /></Pfx>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>Bulto de</span>
                  {BULTOS.map(b => (
                    <button key={b} onClick={() => setBultoKg(b)} style={{ border: `2px solid ${bultoKg === b ? C.green : C.border}`, background: bultoKg === b ? 'rgba(34,197,94,0.12)' : C.card2, color: bultoKg === b ? C.greenL : C.muted, borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {b} kg
                    </button>
                  ))}
                </div>
                {pBulto > 0 && bultoKg > 0 && (
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>= {cop(pConc)} por kg de concentrado</div>
                )}
              </Fg>
            </div>

            <Btn onClick={() => goTo(2)} color="red" disabled={!listo}>🔍 Ver cuánto estoy perdiendo →</Btn>
            <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', marginTop: 12 }}>🔒 Gratis · Sin registro para ver el resultado</div>
          </div>
        )}

        {/* ── PANTALLA 2: Resultado ── */}
        {step === 2 && result && espD && (
          <div>
            <button onClick={() => goTo(1)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'inherit' }}>← Cambiar datos</button>

            {/* Hero pérdida */}
            <div style={{ background: 'linear-gradient(135deg,#7B1200,#C62828)', borderRadius: 16, padding: '22px 18px', textAlign: 'center', color: '#fff', marginBottom: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '.8px', textTransform: 'uppercase', opacity: .75, marginBottom: 8 }}>Sin BSF en tu granja</div>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: .85, marginBottom: 5 }}>Cada ciclo estás dejando ir</div>
              <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#FFCDD2', marginBottom: 4 }}>{cop(result.totalPerd)}</div>
              <div style={{ fontSize: 12, opacity: .65, marginBottom: 14 }}>en tu lote de {nAnim.toLocaleString('es-CO')} {espD.pl} ({dias} días)</div>
              <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, opacity: .75, marginBottom: 4 }}>En lo que va del año ya fueron</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#FFCDD2' }}>{cop(result.perdAcum)}</div>
                <div style={{ fontSize: 10, opacity: .55, marginTop: 3 }}>estimado: {result.cicElap} ciclo{result.cicElap !== 1 ? 's' : ''} desde enero {new Date().getFullYear()}</div>
              </div>
            </div>

            {/* Desglose */}
            <CardSection icon="🔴" iconBg={C.red} title="¿De dónde sale esa plata?">
              {[
                { lbl: 'Animales que mueren de más sin BSF', val: cop(result.perdMort), ic: '💀' },
                { lbl: 'Concentrado que compras de más porque tus animales no lo aprovechan bien', val: cop(result.perdFCR), ic: '🌽' },
              ].map((row, i) => (
                <div key={i} style={{ background: C.card2, borderRadius: 12, padding: 13, border: `1px solid rgba(239,68,68,0.3)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div><div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{row.lbl}</div><div style={{ fontSize: 16, fontWeight: 800, color: C.red }}>{row.val}</div></div>
                  <div style={{ fontSize: 22 }}>{row.ic}</div>
                </div>
              ))}
            </CardSection>

            {/* Contraste con BSF */}
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, padding: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>🪲</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 2 }}>
                  Produciendo tu propia larva BSF recuperarías ~{cop(Math.max(0, result.recup))} / ciclo
                </div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                  {result.salv >= 0.5
                    ? `Además, ${result.salv.toFixed(1)} ${result.salv === 1 ? espD.nom : espD.pl} más sobrevivirían por ciclo.`
                    : 'Con menos mortalidad y mejor conversión de alimento.'}
                </div>
              </div>
            </div>

            {/* Ajustar datos */}
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 14, overflow: 'hidden' }}>
              <button onClick={() => setAjOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '13px 16px', cursor: 'pointer', fontFamily: 'inherit', color: C.text, fontSize: 13, fontWeight: 700 }}>
                <span>▸ Ajustar datos {ajOpen ? '' : '(días, precio de venta, mortalidad…)'}</span>
                <span style={{ transform: ajOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▸</span>
              </button>
              {ajOpen && (
                <div style={{ padding: '0 16px 16px' }}>
                  <Fg label="Días que dura tu ciclo" hint={espD.h}>
                    <input type="number" value={dias} onChange={e => setDias(+e.target.value)} min={1} max={365} style={inp} />
                  </Fg>
                  <Fg label={`¿A cuánto vendes cada ${espD.nom}?`} hint="precio en pie">
                    <Pfx><input type="number" value={pAnim} onChange={e => setPAnim(+e.target.value)} min={1} style={inpPfx} /></Pfx>
                  </Fg>
                  <Fg label="Mortalidad actual" hint="% que se pierden por ciclo">
                    <input type="number" value={mort} onChange={e => setMort(+e.target.value)} min={0} max={80} step={0.5} style={inp} />
                  </Fg>
                  <Fg label="¿Qué % de la dieta reemplazarías con BSF?" noMb>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>Nivel recomendado por ciencia</span>
                      <span style={{ background: C.greenD, color: '#fff', fontSize: 15, fontWeight: 800, padding: '3px 12px', borderRadius: 20 }}>{slBSF}%</span>
                    </div>
                    <input type="range" min={espD.mn} max={espD.mx} value={slBSF} step={5} onChange={e => setSlBSF(+e.target.value)}
                      style={{ width: '100%', height: 6, borderRadius: 3, outline: 'none', WebkitAppearance: 'none', border: 'none', padding: 0, cursor: 'pointer', background: slBg(slBSF, espD.mn, espD.mx) }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: C.muted }}>
                      <span>{espD.mn}%</span>
                      <span>{espD.mx}% (máx. {espD.pl})</span>
                    </div>
                  </Fg>
                </div>
              )}
            </div>

            {/* CTA único */}
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '2px solid rgba(245,158,11,0.25)', borderRadius: 16, padding: 18, marginBottom: 14 }}>
              <div style={{ color: C.amber, fontSize: 15, fontWeight: 800, marginBottom: 5 }}>Deja de perder esa plata 🚀</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>
                En el <strong style={{ color: C.text }}>Curso Colonia</strong> aprendes a producir tu propia larva BSF en 5 semanas. Próxima cohorte: <strong style={{ color: C.text }}>8 de noviembre</strong>. Deja tus datos y te guardamos el cupo.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ ...inp, border: '2px solid rgba(245,158,11,0.3)' }} />
                <input type="tel" placeholder="WhatsApp (ej: 311 234 5678)" value={waNum} onChange={e => setWaNum(e.target.value)} style={{ ...inp, border: '2px solid rgba(245,158,11,0.3)' }} />
              </div>
              <button onClick={() => openWA('colonia')} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                🌱 Quiero mi cupo en el Curso Colonia
              </button>
              {confVisible && <div style={{ marginTop: 10, padding: 11, background: 'rgba(34,197,94,0.1)', borderRadius: 10, fontSize: 13, color: C.green, fontWeight: 700, textAlign: 'center', border: '1px solid rgba(34,197,94,0.3)' }}>✅ ¡Listo! Te contactamos pronto por WhatsApp.</div>}
              <button onClick={() => openWA('pedido')} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 12, textDecoration: 'underline' }}>
                o comprar larva BSF ya
              </button>
              <button onClick={compartir} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 13, background: 'transparent', border: `2px solid ${C.border}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: C.text, cursor: 'pointer', fontFamily: 'inherit', marginTop: 12 }}>
                🤝 Compartir con un vecino productor
              </button>
              {copied && <div style={{ marginTop: 8, padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 8, fontSize: 12, color: C.green, fontWeight: 600, textAlign: 'center' }}>✅ ¡Enlace copiado! Pásalo por WhatsApp.</div>}
            </div>

            <div style={{ textAlign: 'center', color: C.muted, fontSize: 11, lineHeight: 1.6 }}>
              <strong style={{ color: C.greenL }}>ProLarva</strong> · @prolarva.co · Cúcuta, Colombia<br />
              Resultados estimados. Varían según raza, manejo y condiciones de la granja.
            </div>
          </div>
        )}
      </div>

      <style>{`
        input[type=range] { -webkit-appearance: none; appearance: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #22c55e; border: 3px solid #0d1b2a; box-shadow: 0 2px 6px rgba(0,0,0,0.4); cursor: pointer; }
        input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #22c55e; border: 3px solid #0d1b2a; cursor: pointer; }
        input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}

function Fg({ label, hint, noMb, children }: { label: string; hint?: string; noMb?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: noMb ? 0 : 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: C.text }}>
        {label}{hint && <span style={{ fontWeight: 400, color: C.muted, fontSize: 11 }}> {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Pfx({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: C.muted, fontWeight: 700, pointerEvents: 'none' }}>$ COP</span>
      {children}
    </div>
  );
}

function Btn({ onClick, color, disabled, children }: { onClick: () => void; color: 'green' | 'red'; disabled?: boolean; children: React.ReactNode }) {
  const bg = color === 'green' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#dc2626,#b91c1c)';
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: 'block', width: '100%', padding: 15, background: disabled ? '#334155' : bg, color: disabled ? '#64748b' : '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 16, lineHeight: 1.3 }}>
      {children}
    </button>
  );
}

function CardSection({ icon, iconBg, title, children }: { icon: string; iconBg: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: iconBg, textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 22, height: 22, background: iconBg, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{icon}</div>
        {title}
      </div>
      {children}
    </div>
  );
}
