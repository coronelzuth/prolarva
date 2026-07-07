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
  perdAcum: number; cicElap: number; kgBSF: number;
  costBSF: number; neto: number; salv: number;
}

export default function CalculadoraPage() {
  const [step, setStep]     = useState(1);
  const [esp, setEsp]       = useState<string | null>(null);
  const [modo, setModo]     = useState<'compra' | 'kit'>('compra');
  const [nAnim, setNAnim]   = useState(100);
  const [dias, setDias]     = useState(42);
  const [pConc, setPConc]   = useState(2500);
  const [pAnim, setPAnim]   = useState(25000);
  const [mort, setMort]     = useState(5);
  const [slBSF, setSlBSF]   = useState(25);
  const [pBSF, setPBSF]     = useState(8000);
  const [nombre, setNombre] = useState('');
  const [waNum, setWaNum]   = useState('');
  const [confVisible, setConfVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    if (step !== 4 || !esp) return;
    const d = E[esp];
    const kgA = d.kg * (dias / d.dias);
    const kgT = nAnim * kgA;
    const mSin = nAnim * (mort / 100);
    const mCon = mSin * 0.80;
    const perdMort = (mSin - mCon) * pAnim;
    const perdFCR = kgT * d.fcr * pConc;
    const totalPerd = perdMort + perdFCR;
    const kgBSF = kgT * (slBSF / 100);
    const costBSF = kgBSF * pBSF;
    const costoExtra = (kgT * (1 - slBSF / 100) * pConc + costBSF) - (kgT * pConc);
    const neto = totalPerd - costoExtra;
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000);
    const cicElap = Math.max(1, Math.floor(dayOfYear / dias));
    const salv = Math.round((mSin - mCon) * 10) / 10;
    setResult({ totalPerd, perdMort, perdFCR, perdAcum: cicElap * totalPerd, cicElap, kgBSF, costBSF, neto, salv });
  }, [step, esp, nAnim, dias, pConc, pAnim, mort, slBSF, pBSF]);

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
    setTimeout(() => goTo(2), 360);
  }

  function handleModo(m: 'compra' | 'kit') {
    setModo(m);
    setPBSF(m === 'compra' ? 8000 : 3000);
  }

  function buildMsg(tipo: 'pedido' | 'kit') {
    const d = E[esp || 'pollos'];
    const p = result ? cop(result.totalPerd) : '?';
    const ac = result ? cop(result.perdAcum) : '?';
    let m = tipo === 'pedido'
      ? `Hola ProLarva 👋 Calculé que sin BSF estoy perdiendo ${p} por ciclo (${ac} este año) con mis ${nAnim} ${d.pl}. Quiero hacer mi primer pedido.`
      : `Hola ProLarva 👋 Tengo ${nAnim} ${d.pl} y quiero producir mi propio BSF con el Kit para dejar de depender del concentrado. ¿Me cuentan?`;
    if (nombre) m = `Hola ProLarva, soy ${nombre}. ` + m.replace('Hola ProLarva 👋 ', '');
    return m;
  }

  function openWA(tipo: 'pedido' | 'kit') {
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildMsg(tipo))}`, '_blank');
    if (nombre || waNum) setConfVisible(true);
  }

  function compartir() {
    const d = E[esp || 'pollos'];
    const perdida = result ? cop(result.totalPerd) : '?';
    const url = 'https://prolarva-monitor.vercel.app/calculadora';
    const texto = `👀 Ojo con esto: calculé que sin BSF estoy perdiendo ${perdida} por ciclo con mis ${nAnim} ${d.pl}.\n\nUsted también puede calcularlo aquí 👇\n${url}`;
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

      {/* Progress bar */}
      <div style={{ background: '#0a1628', borderBottom: `1px solid ${C.border}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: 420, margin: '0 auto' }}>
          {[{ n: 1, label: 'Especie' }, { n: 2, label: 'Su lote' }, { n: 3, label: 'BSF' }, { n: 4, label: 'Resultado' }].map((dot, i) => (
            <div key={dot.n} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3px', fontSize: 11, fontWeight: 800, background: dot.n < step ? C.green : dot.n === step ? '#fff' : 'rgba(255,255,255,0.1)', color: dot.n <= step ? '#0a1628' : 'rgba(255,255,255,0.4)', boxShadow: dot.n === step ? '0 0 0 3px rgba(34,197,94,0.3)' : 'none' }}>
                  {dot.n < step ? '✓' : dot.n}
                </div>
                <div style={{ fontSize: 9, color: dot.n === step ? C.greenL : dot.n < step ? C.green : 'rgba(255,255,255,0.35)', fontWeight: dot.n === step ? 700 : 400, whiteSpace: 'nowrap' }}>
                  {dot.label}
                </div>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: dot.n < step ? C.green : 'rgba(255,255,255,0.12)', margin: '0 6px', marginBottom: 14, transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 48px' }}>

        {/* ── STEP 1: Especie ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.greenL, marginBottom: 4 }}>¿Qué cría?</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Toque su especie y arrancamos.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
              {[{ key: 'pollos', ic: '🐔', nm: 'Pollos', sub: 'Engorde' }, { key: 'cerdos', ic: '🐷', nm: 'Cerdos', sub: 'Engorde' }, { key: 'peces', ic: '🐟', nm: 'Peces', sub: 'Tilapia / otros' }].map(sp => (
                <button key={sp.key} onClick={() => handleEspecie(sp.key)} style={{ border: `2px solid ${esp === sp.key ? C.green : C.border}`, background: esp === sp.key ? 'rgba(34,197,94,0.1)' : C.card, borderRadius: 14, padding: '16px 6px', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>{sp.ic}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.greenL }}>{sp.nm}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sp.sub}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.muted, textAlign: 'center' }}>🔒 Gratis · Sin registro · Sin datos guardados</div>
          </div>
        )}

        {/* ── STEP 2: Lote ── */}
        {step === 2 && (
          <div>
            <button onClick={() => goTo(1)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'inherit' }}>← Atrás</button>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.greenL, marginBottom: 4 }}>Su lote</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 18 }}>Cuéntenos cómo maneja sus {espD?.pl || 'animales'}.</div>
            <div style={{ background: C.card, borderRadius: 16, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
              <Fg label="¿Cuántos animales tiene en el lote?" hint="cabezas">
                <input type="number" value={nAnim} onChange={e => setNAnim(+e.target.value)} min={1} style={inp} />
              </Fg>
              <Fg label="¿Cuántos días dura su ciclo?" hint={espD?.h}>
                <input type="number" value={dias} onChange={e => setDias(+e.target.value)} min={1} max={365} style={inp} />
              </Fg>
              <Fg label="¿A cuánto le sale el kg de concentrado?">
                <Pfx><input type="number" value={pConc} onChange={e => setPConc(+e.target.value)} min={100} style={inpPfx} /></Pfx>
              </Fg>
              <Fg label={`¿A cuánto vende cada ${espD?.nom || 'animal'}?`} hint="precio en pie">
                <Pfx><input type="number" value={pAnim} onChange={e => setPAnim(+e.target.value)} min={1} style={inpPfx} /></Pfx>
              </Fg>
              <Fg label="Mortalidad actual" hint="% que se pierden por ciclo" noMb>
                <input type="number" value={mort} onChange={e => setMort(+e.target.value)} min={0} max={80} step={0.5} style={inp} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>💡 Un 5% es normal. Más de eso y aquí se nota aún más la diferencia.</div>
              </Fg>
            </div>
            <Btn onClick={() => goTo(3)} color="green">Siguiente →</Btn>
          </div>
        )}

        {/* ── STEP 3: BSF ── */}
        {step === 3 && (
          <div>
            <button onClick={() => goTo(2)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'inherit' }}>← Atrás</button>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.greenL, marginBottom: 4 }}>Con BSF ProLarva</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 18 }}>Ajuste el escenario que quiere ver.</div>
            <div style={{ background: C.card, borderRadius: 16, padding: 18, marginBottom: 12, border: `1px solid ${C.border}` }}>
              <Fg label="¿Cómo usaría el BSF?">
                <div style={{ display: 'flex', background: '#0a1628', borderRadius: 10, padding: 3, gap: 3, marginBottom: 8 }}>
                  {([['compra', '🛒 Comprar a ProLarva'], ['kit', '🏗️ Producir con el Kit']] as const).map(([m, lbl]) => (
                    <button key={m} onClick={() => handleModo(m)} style={{ flex: 1, padding: 8, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: modo === m ? C.card2 : 'transparent', color: modo === m ? C.greenL : C.muted, boxShadow: modo === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}>
                      {lbl}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                  {modo === 'compra' ? '📦 Precio ProLarva: $8,000/kg. Pregunte por descuentos por volumen.' : '🏗️ Producción propia con el Kit estimada en ~$3,000/kg. Puede bajar más.'}
                </div>
              </Fg>
              <Fg label="¿Qué % de la dieta reemplaza con BSF?">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Nivel recomendado por ciencia</span>
                  <span style={{ background: C.greenD, color: '#fff', fontSize: 15, fontWeight: 800, padding: '3px 12px', borderRadius: 20 }}>{slBSF}%</span>
                </div>
                <input type="range" min={espD?.mn || 5} max={espD?.mx || 30} value={slBSF} step={5} onChange={e => setSlBSF(+e.target.value)}
                  style={{ width: '100%', height: 6, borderRadius: 3, outline: 'none', WebkitAppearance: 'none', border: 'none', padding: 0, cursor: 'pointer', background: slBg(slBSF, espD?.mn || 5, espD?.mx || 30) }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, color: C.muted }}>
                  <span>{espD?.mn || 5}%</span>
                  <span>{espD?.mx || 30}% (máx. {espD?.pl || ''})</span>
                </div>
              </Fg>
              <Fg label="Precio del BSF" hint="por kg de larva fresca" noMb>
                <Pfx><input type="number" value={pBSF} onChange={e => setPBSF(+e.target.value)} min={500} style={inpPfx} /></Pfx>
              </Fg>
            </div>
            <Btn onClick={() => goTo(4)} color="red">🔍 Ver cuánto me cuesta no usar BSF</Btn>
          </div>
        )}

        {/* ── STEP 4: Resultados ── */}
        {step === 4 && result && (
          <div>
            <button onClick={() => goTo(3)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '0 0 14px', fontFamily: 'inherit' }}>← Cambiar datos</button>

            {/* Hero pérdida */}
            <div style={{ background: 'linear-gradient(135deg,#7B1200,#C62828)', borderRadius: 16, padding: '22px 18px', textAlign: 'center', color: '#fff', marginBottom: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: '.8px', textTransform: 'uppercase', opacity: .75, marginBottom: 8 }}>Sin BSF en su granja</div>
              <div style={{ fontSize: 14, fontWeight: 600, opacity: .85, marginBottom: 5 }}>Cada ciclo está dejando ir</div>
              <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#FFCDD2', marginBottom: 4 }}>{cop(result.totalPerd)}</div>
              <div style={{ fontSize: 12, opacity: .65, marginBottom: 14 }}>en su lote de {nAnim.toLocaleString('es-CO')} {espD?.pl} ({dias} días)</div>
              <div style={{ background: 'rgba(0,0,0,0.22)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, opacity: .75, marginBottom: 4 }}>En lo que va del año ya fueron</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#FFCDD2' }}>{cop(result.perdAcum)}</div>
                <div style={{ fontSize: 10, opacity: .55, marginTop: 3 }}>estimado: {result.cicElap} ciclo{result.cicElap !== 1 ? 's' : ''} desde enero {new Date().getFullYear()}</div>
              </div>
            </div>

            {/* Desglose pérdidas */}
            <CardSection icon="🔴" iconBg={C.red} title="¿De dónde vienen esas pérdidas?">
              {[
                { lbl: 'Animales que mueren de más sin BSF', val: cop(result.perdMort), ic: '💀' },
                { lbl: 'Alimento que compra de más porque sus animales no lo aprovechan bien', val: cop(result.perdFCR), ic: '🌽' },
              ].map((row, i) => (
                <div key={i} style={{ background: C.card2, borderRadius: 12, padding: 13, borderLeft: `4px solid ${C.red}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div><div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{row.lbl}</div><div style={{ fontSize: 16, fontWeight: 800, color: C.red }}>{row.val}</div></div>
                  <div style={{ fontSize: 22 }}>{row.ic}</div>
                </div>
              ))}
              <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 14, border: '2px solid rgba(239,68,68,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 2 }}>TOTAL PÉRDIDA POR CICLO</div><div style={{ fontSize: 20, fontWeight: 900, color: C.red }}>{cop(result.totalPerd)}</div></div>
                <div style={{ fontSize: 22 }}>📉</div>
              </div>
            </CardSection>

            {/* Con BSF */}
            <CardSection icon="✅" iconBg={C.green} title="Con BSF ProLarva, en cambio...">
              {[
                { lbl: 'BSF necesario por ciclo', val: kgf(result.kgBSF), ic: '🪲', amber: false },
                { lbl: 'Promedio diario', val: kgf(result.kgBSF / dias) + '/día', ic: '📅', amber: false },
                { lbl: 'Costo total del BSF', val: cop(result.costBSF), ic: '💰', amber: true },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: row.amber ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.08)', borderRadius: 10, padding: '11px 13px', marginBottom: 8 }}>
                  <div><div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{row.lbl}</div><div style={{ fontSize: 15, fontWeight: 800, color: row.amber ? C.amber : C.green }}>{row.val}</div></div>
                  <span style={{ fontSize: 22 }}>{row.ic}</span>
                </div>
              ))}
              <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
              <div style={{ background: result.neto >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${result.neto >= 0 ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: 12, padding: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: result.neto >= 0 ? C.green : C.amber }}>{result.neto >= 0 ? 'Ahorro neto total usando BSF' : (modo === 'kit' ? 'Inversión en BSF por ciclo (se recupera)' : 'Inversión en BSF por ciclo')}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: result.neto >= 0 ? C.green : C.amber }}>{cop(Math.abs(result.neto))} / ciclo</div>
                </div>
                <div style={{ fontSize: 26 }}>{result.neto >= 0 ? '🎉' : '🏗️'}</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>🌟</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                    {result.salv < 0.5 ? 'Mortalidad garantizadamente menor con BSF' : `${result.salv.toFixed(1)} ${result.salv === 1 ? espD?.nom : espD?.pl} adicional${result.salv !== 1 ? 'es sobrevivirían' : ' sobreviviría'} por ciclo`}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>gracias a la inmunidad reforzada con BSF</div>
                </div>
              </div>
            </CardSection>

            {/* Beneficios */}
            <CardSection icon="🌱" iconBg={C.green} title="Más allá del bolsillo">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { ic: '🌟', tx: 'Piel más amarilla = mejor precio de venta' },
                  { ic: '💉', tx: 'Menos gastos en veterinario por ciclo' },
                  { ic: '⚡', tx: 'FCR 2.0→1.8: animales comen 10% menos' },
                  { ic: '🏗️', tx: 'Con el Kit: libre del concentrado para siempre' },
                  { ic: '🦴', tx: 'Huesos fuertes, animales menos estresados' },
                  { ic: '♻️', tx: 'Proteína de sus propios residuos orgánicos' },
                ].map((b, i) => (
                  <div key={i} style={{ background: C.card2, borderRadius: 11, padding: 11, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{b.ic}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{b.tx}</div>
                  </div>
                ))}
              </div>
            </CardSection>

            {/* Kit investment */}
            <div style={{ background: 'linear-gradient(135deg,#0a2d0a,#164016)', borderRadius: 16, padding: 18, marginBottom: 12, border: '1px solid rgba(34,197,94,0.25)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.greenL, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>🏗️ El Kit: una inversión que se paga sola</div>
              {[
                { dot: '1', inv: true,  label: 'Inversión inicial',                     sub: 'Kit ProLarva + primera colonia + instalación' },
                { dot: '2', inv: false, label: 'Primera cosecha',                        sub: 'Ya produce su propio BSF a costo mínimo. La colonia se multiplica sola.' },
                { dot: '∞', inv: false, label: 'Proteína ilimitada, prácticamente gratis', sub: 'Sin pedidos, sin facturas, sin depender de nadie. Su propia fábrica de proteína.' },
              ].map((row, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: row.dot === '∞' ? 16 : 12, fontWeight: 800, flexShrink: 0, border: '2px solid rgba(255,255,255,0.25)', background: row.inv ? 'rgba(255,255,255,0.15)' : C.green, color: row.inv ? '#fff' : '#0a1628' }}>
                      {row.dot}
                    </div>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{row.label}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{row.sub}</div></div>
                  </div>
                  {i < 2 && <div style={{ width: 2, background: 'rgba(255,255,255,0.2)', height: 16, margin: '3px 0 3px 13px' }} />}
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, fontStyle: 'italic', borderLeft: `3px solid ${C.green}` }}>
                "Mientras usted sigue comprando concentrado, su vecino ya produce su propia proteína. Gratis."
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '2px solid rgba(245,158,11,0.25)', borderRadius: 16, padding: 18, marginBottom: 14 }}>
              <div style={{ color: C.amber, fontSize: 15, fontWeight: 800, marginBottom: 5 }}>¿Listo para dejar de perder? 🚀</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>Deje su nombre y WhatsApp y le contactamos para coordinar su pedido o contarle del Kit.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Su nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ ...inp, border: '2px solid rgba(245,158,11,0.3)' }} />
                <input type="tel" placeholder="WhatsApp (ej: 311 234 5678)" value={waNum} onChange={e => setWaNum(e.target.value)} style={{ ...inp, border: '2px solid rgba(245,158,11,0.3)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => openWA('pedido')} style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  🪲 Quiero mi primer pedido de BSF
                </button>
                <button onClick={() => openWA('kit')} style={{ width: '100%', padding: 13, background: `linear-gradient(135deg,${C.amber},#d97706)`, color: '#fff', border: 'none', borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  🏗️ Quiero producir mi propio BSF con el Kit
                </button>
              </div>
              {confVisible && <div style={{ marginTop: 10, padding: 11, background: 'rgba(34,197,94,0.1)', borderRadius: 10, fontSize: 13, color: C.green, fontWeight: 700, textAlign: 'center', border: '1px solid rgba(34,197,94,0.3)' }}>✅ ¡Listo! Le contactamos pronto por WhatsApp.</div>}
              <button onClick={compartir} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 13, background: 'transparent', border: `2px solid ${C.border}`, borderRadius: 11, fontSize: 13, fontWeight: 700, color: C.text, cursor: 'pointer', fontFamily: 'inherit', marginTop: 10 }}>
                🤝 Compartir con un vecino productor
              </button>
              {copied && <div style={{ marginTop: 8, padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 8, fontSize: 12, color: C.green, fontWeight: 600, textAlign: 'center' }}>✅ ¡Enlace copiado! Páselo por WhatsApp.</div>}
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

function Btn({ onClick, color, children }: { onClick: () => void; color: 'green' | 'red'; children: React.ReactNode }) {
  const bg = color === 'green' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#dc2626,#b91c1c)';
  return (
    <button onClick={onClick} style={{ display: 'block', width: '100%', padding: 15, background: bg, color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 16, lineHeight: 1.3 }}>
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
