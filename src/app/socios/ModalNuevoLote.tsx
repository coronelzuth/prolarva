'use client';
import { useRef, useState, useEffect } from 'react';
import { S, btnPrimary, btnOutline, inputStyle, Modal, Field, todayLocal } from './_shared';
import type { Lote } from '@/hooks/useSocios';

type LoteInput = Omit<Lote, 'id'>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: LoteInput) => Promise<void>;
}

export default function ModalNuevoLote({ open, onClose, onSave }: Props) {
  const [objetivo, setObjetivo] = useState<'cosechar' | 'continuar'>('cosechar');
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const lNombre   = useRef<HTMLInputElement>(null);
  const lFecha    = useRef<HTMLInputElement>(null);
  const lSustrato = useRef<HTMLInputElement>(null);
  const lTipoSust = useRef<HTMLSelectElement>(null);
  const lHuevos   = useRef<HTMLInputElement>(null);
  const lTemp     = useRef<HTMLInputElement>(null);
  const lNotas    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && lFecha.current) lFecha.current.value = todayLocal();
  }, [open]);

  function reset() {
    setObjetivo('cosechar'); setError('');
    if (lNombre.current)   lNombre.current.value   = '';
    if (lSustrato.current) lSustrato.current.value = '';
    if (lHuevos.current)   lHuevos.current.value   = '';
    if (lTemp.current)     lTemp.current.value      = '';
    if (lNotas.current)    lNotas.current.value     = '';
  }

  async function handleSave() {
    const nombre = lNombre.current?.value.trim() ?? '';
    const fecha  = lFecha.current?.value ?? '';
    if (!nombre || !fecha) { setError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await onSave({
      nombre, fecha, objetivo,
      sustrato:     parseFloat(lSustrato.current?.value ?? '0') || 0,
      tipoSustrato: lTipoSust.current?.value ?? '',
      huevos:       lHuevos.current?.value ?? '',
      temp:         lTemp.current?.value ? parseFloat(lTemp.current.value) : null,
      notas:        lNotas.current?.value ?? '',
    });
    setSaving(false);
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="📦 Nuevo Lote BSF">
      <Field label="Objetivo del lote">
        <div style={{ display: 'flex', gap: 8 }}>
          {([['cosechar', '⚖️ Cosechar larvas'], ['continuar', '🔄 Continuar camada']] as const).map(([val, label]) => (
            <button key={val} type="button" onClick={() => setObjetivo(val)} style={{ flex: 1, padding: '10px 6px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, background: objetivo === val ? (val === 'cosechar' ? 'rgba(34,197,94,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent', border: `1.5px solid ${objetivo === val ? (val === 'cosechar' ? S.green : S.emerald) : S.border}`, color: objetivo === val ? (val === 'cosechar' ? S.green2 : S.emerald) : S.muted }}>
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
      {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button style={btnOutline} onClick={() => { reset(); onClose(); }} disabled={saving}>Cancelar</button>
        <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar lote'}</button>
      </div>
    </Modal>
  );
}
