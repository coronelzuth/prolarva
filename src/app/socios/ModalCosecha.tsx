'use client';
import { useRef, useState, useEffect } from 'react';
import { btnPrimary, btnOutline, inputStyle, Modal, Field, todayLocal } from './_shared';
import type { Lote, Cosecha } from '@/hooks/useSocios';

type CosechaInput = Omit<Cosecha, 'id'>;

interface Props {
  open: boolean;
  lotes: Lote[];
  onClose: () => void;
  onSave: (data: CosechaInput) => Promise<void>;
}

export default function ModalCosecha({ open, lotes, onClose, onSave }: Props) {
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);

  const cLote     = useRef<HTMLSelectElement>(null);
  const cFecha    = useRef<HTMLInputElement>(null);
  const cPeso     = useRef<HTMLInputElement>(null);
  const cSustTotal = useRef<HTMLInputElement>(null);
  const cCalidad  = useRef<HTMLSelectElement>(null);
  const cNotas    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && cFecha.current) cFecha.current.value = todayLocal();
  }, [open]);

  async function handleSave() {
    const loteId = cLote.current?.value ?? '';
    const peso   = parseFloat(cPeso.current?.value ?? '0');
    if (!loteId || !peso) { setError('Selecciona un lote e ingresa el peso.'); return; }
    setSaving(true);
    await onSave({
      loteId, peso,
      fecha:         cFecha.current?.value ?? todayLocal(),
      sustratoTotal: parseFloat(cSustTotal.current?.value ?? '0') || 0,
      calidad:       (cCalidad.current?.value ?? 'buena') as Cosecha['calidad'],
      notas:         cNotas.current?.value ?? '',
    });
    setSaving(false);
    setError('');
    if (cPeso.current)      cPeso.current.value      = '';
    if (cSustTotal.current) cSustTotal.current.value = '';
    if (cNotas.current)     cNotas.current.value     = '';
    onClose();
  }

  return (
    <Modal open={open} onClose={() => { setError(''); onClose(); }} title="⚖️ Registrar Cosecha">
      <Field label="Lote cosechado">
        <select ref={cLote} style={inputStyle}>
          {lotes.length === 0
            ? <option>— Crea un lote primero —</option>
            : lotes.map(l => <option key={l.id} value={l.id}>{l.nombre}</option>)
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
      {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button style={btnOutline} onClick={() => { setError(''); onClose(); }} disabled={saving}>Cancelar</button>
        <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Registrar cosecha'}</button>
      </div>
    </Modal>
  );
}
