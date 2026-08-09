'use client';
import type { DiaCronograma } from '@/hooks/useEscuela';
import { S, SEMANAS_INFO, TIPO_META, fmtFecha, esHoy, esPasado, getYouTubeId } from './_escuela_shared';
import type { ReturnType as UseEscuelaReturn } from '@/hooks/useEscuela';

// ─── Props ────────────────────────────────────────────────────────────────────

interface EscuelaCronogramaProps {
  dias: DiaCronograma[];
  asAdmin: boolean;
  isAdmin: boolean;
  fasesAprobadas: number;
  faseEnRevision: number;
  expandedDia: string | null;
  setExpandedDia: (id: string | null) => void;
  setFaseMod: (fase: number | null) => void;
  setEditDia: (dia: Partial<DiaCronograma> | undefined) => void;
  setModalDia: (open: boolean) => void;
  // esc methods needed inline
  clasesPorSemana: (semana: number) => ReturnType<UseEscuelaReturn['clasesPorSemana']>;
  tareasPorSemana: (semana: number) => ReturnType<UseEscuelaReturn['tareasPorSemana']>;
  plantillasPorSemana: (semana: number) => ReturnType<UseEscuelaReturn['plantillasPorSemana']>;
  estaVisto: (id: string) => boolean;
  marcarVisto: (id: string) => void;
  miEntrega: UseEscuelaReturn['miEntrega'];
  entregarTarea: UseEscuelaReturn['entregarTarea'];
  tareaText: string;
  setTareaText: (t: string) => void;
  tareaPosting: boolean;
  setTareaPosting: (v: boolean) => void;
  socioNombre: string;
}
