'use client';
import type { Clase, Plantilla, Tarea } from '@/hooks/useEscuela';
import { FaseModalSocio } from './FaseModalSocio';
import { FaseModalAdmin } from './FaseModalAdmin';

export function FaseModal({ open, onClose, fase, clases, plantillas, tareas,
  estaVisto, marcarVisto, asAdmin,
  onEditClase, onNuevaClase, onEliminarClase,
  onEditPlantilla, onNuevaPlantilla, onEliminarPlantilla,
  onEditTarea, onNuevaTarea, onEliminarTarea,
  fasesAprobadas = 0, faseEnRevision = 0, onMarcarFase,
}: {
  open: boolean; onClose: () => void; fase: number;
  clases: Clase[]; plantillas: Plantilla[]; tareas: Tarea[];
  estaVisto: (id: string) => boolean; marcarVisto: (id: string) => void;
  asAdmin?: boolean;
  onEditClase?: (c: Clase) => void; onNuevaClase?: () => void; onEliminarClase?: (id: string) => void;
  onEditPlantilla?: (p: Plantilla) => void; onNuevaPlantilla?: () => void; onEliminarPlantilla?: (id: string) => void;
  onEditTarea?: (t: Tarea) => void; onNuevaTarea?: () => void; onEliminarTarea?: (id: string) => void;
  fasesAprobadas?: number; faseEnRevision?: number; onMarcarFase?: (fase: number) => Promise<void>;
}) {
  if (asAdmin) {
    return (
      <FaseModalAdmin
        open={open} onClose={onClose} fase={fase}
        clases={clases} plantillas={plantillas} tareas={tareas}
        onEditClase={onEditClase} onNuevaClase={onNuevaClase} onEliminarClase={onEliminarClase}
        onEditPlantilla={onEditPlantilla} onNuevaPlantilla={onNuevaPlantilla} onEliminarPlantilla={onEliminarPlantilla}
        onEditTarea={onEditTarea} onNuevaTarea={onNuevaTarea} onEliminarTarea={onEliminarTarea}
      />
    );
  }
  return (
    <FaseModalSocio
      open={open} onClose={onClose} fase={fase}
      clases={clases} plantillas={plantillas} tareas={tareas}
      estaVisto={estaVisto} marcarVisto={marcarVisto}
      fasesAprobadas={fasesAprobadas} faseEnRevision={faseEnRevision} onMarcarFase={onMarcarFase}
    />
  );
}
