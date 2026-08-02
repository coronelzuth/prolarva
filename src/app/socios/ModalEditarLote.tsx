'use client';
import { useState, useEffect } from 'react';
import { btnPrimary, btnOutline, inputStyle, Modal, Field } from './_shared';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (nombre: string, fecha: string) => Promise<void>;
  initialNombre: string;
  initialFecha: string;
}

export default function ModalEditarLote({ open, onClose, onSave, initialNombre, initialFecha }: Props) {
  const [nombre, setNombre] = useState(initialNombre);
  const [fecha,  setFecha]  = useState(initialFecha);
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) { setNombre(initialNombre); setFecha(initialFecha); setError(''); }
  }, [open, initialNombre, initialFecha]);

  async function handleSave() {
    if (!nombre.trim() || !fecha) { setError('Ingresa nombre y fecha.'); return; }
    setSaving(true);
    await onSave(nombre.trim(), fecha);
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={() => { setError(''); onClose(); }} title="✏️ Editar Lote">
      <Field label="Nombre / código del lote">
        <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej. Lote-07 Julio" />
      </Field>
      <Field label="Fecha de siembra">
        <input type="date" style={inputStyle} value={fecha} onChange={e => setFecha(e.target.value)} />
      </Field>
      {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '8px 0 0', fontWeight: 600 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button style={btnOutline} onClick={() => { setError(''); onClose(); }} disabled={saving}>Cancelar</button>
        <button style={{ ...btnPrimary, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </div>
    </Modal>
  );
}
