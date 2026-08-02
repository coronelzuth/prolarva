'use client';
import { useRef, useState } from 'react';
import { btnPrimary, btnOutline, inputStyle, Modal, Field, nowLocal } from './_shared';
import type { Lote, FeedLog } from '@/hooks/useSocios';

type FeedInput = Omit<FeedLog, 'id'>;

interface Props {
  open: boolean;
  prefillLoteId: string | null;
  lotes: Lote[];
  onClose: () => void;
  onSave: (data: FeedInput) => Promise<void>;
}

export default function ModalAlimentacion({ open, prefillLoteId, lotes, onClose, onSave }: Props) {
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);

  const fLote    = useRef<HTMLSelectElement>(null);
  const fFecha   = useRef<HTMLInputElement>(null);
  const fCantidad = useRef<HTMLInputElement>(null);
  const fTipo    = useRef<HTMLSelectElement>(null);
  const fRechazo = useRef<HTMLSelectElement>(null);
  const fNotas   = useRef<HTMLTextAreaElement>(null);

  async function handleSave() {
    const loteId   = fLote.current?.value ?? '';
    const cantidad = parseFloat(fCantidad.current?.value ?? '0');
    if (!loteId || !cantidad) { setError('Selecciona un lote e ingresa la cantidad.'); return; }
    setSaving(true);
    await onSave({
      loteId, cantidad,
      fecha:   fFecha.current?.value ?? new Date().toISOString(),
      tipo:    fTipo.current?.value ?? '',
      rechazo: (fRechazo.current?.value ?? 'ninguno') as FeedLog['rechazo'],
      notas:   fNotas.current?.value ?? '',
    });
    setSaving(false);
    setError('');
    if (fCantidad.current) fCantidad.current.value = '';
    if (fNotas.current)    fNotas.current.value    = '';
    onClose();
  }

  return (
    <Modal key={prefillLoteId ?? 'none'} open={open} onClose={() => { setError(''); onClose(); }} title="🌿 Registrar Alimentación">
      <Field label="Lote">
        <select ref={fLote} style={inputStyle} defaultValue={prefillLoteId ?? ''}>
          {lotes.length === 0
            ? <option>— Crea un lote primero —</option>
            : lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
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
      {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button style={btnOutline} onClick={() => { setError(''); onClose(); }} disabled={saving}>Cancelar</button>
        <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </Modal>
  );
}
