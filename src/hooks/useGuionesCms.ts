'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabase as createClient } from '@/lib/supabase'
import { GUIONES_BASE, Guion, GuionEstado } from '@/data/guiones'

interface CmsState {
  guiones: Guion[]
  loaded: boolean
  saving: boolean
  error: string | null
}

// Convierte un Guion completo a fila de Supabase (todas las columnas NOT NULL presentes)
function guionToRow(g: Guion): Record<string, unknown> {
  return {
    id: g.id,
    numero: g.numero,
    codigo: g.codigo,
    titulo: g.titulo,
    tipo: g.tipo,
    pilar: g.pilar,
    bloque: g.bloque ?? null,
    estado: g.estado,
    duracion: g.duracion,
    nc: g.nc ?? null,
    angulo: g.angulo ?? null,
    plataforma: g.plataforma,
    fecha_programada: g.fecha_programada ?? null,
    contenido: g.contenido ?? '',
    notas: g.notas ?? null,
    updated_at: new Date().toISOString(),
  }
}

// Fila de Supabase -> Guion (para guiones creados que no están en GUIONES_BASE)
function rowToGuion(r: Record<string, unknown>): Guion {
  return {
    id: r.id as string,
    numero: (r.numero as number) ?? 0,
    codigo: (r.codigo as string) ?? '',
    titulo: (r.titulo as string) ?? '',
    tipo: (r.tipo as Guion['tipo']) ?? 'V',
    pilar: (r.pilar as string) ?? '',
    bloque: (r.bloque as string) ?? undefined,
    estado: (r.estado as GuionEstado) ?? 'BORRADOR',
    duracion: (r.duracion as string) ?? '',
    nc: (r.nc as number) ?? undefined,
    angulo: (r.angulo as Guion['angulo']) ?? undefined,
    plataforma: (r.plataforma as string[]) ?? ['TikTok', 'Instagram'],
    fecha_programada: (r.fecha_programada as string) ?? undefined,
    contenido: (r.contenido as string) ?? '',
    notas: (r.notas as string) ?? undefined,
  }
}

export function useGuionesCms() {
  const [state, setState] = useState<CmsState>({
    guiones: GUIONES_BASE,
    loaded: false,
    saving: false,
    error: null,
  })

  // Referencia siempre-fresca a los guiones en memoria (para armar la fila completa al guardar)
  const guionesRef = useRef<Guion[]>(GUIONES_BASE)
  guionesRef.current = state.guiones

  // Carga los datos de Supabase y hace merge con los base
  useEffect(() => {
    async function load() {
      const sb = createClient()
      if (!sb) {
        setState(s => ({ ...s, loaded: true }))
        return
      }

      const { data, error } = await sb
        .from('guiones_cms')
        .select('*')
        .order('numero')

      if (error) {
        setState(s => ({ ...s, loaded: true, error: error.message }))
        return
      }

      if (!data || data.length === 0) {
        // Primera vez: insertar todos los guiones base en Supabase
        const rows = GUIONES_BASE.map(guionToRow)
        const { error: seedErr } = await sb
          .from('guiones_cms')
          .upsert(rows, { onConflict: 'id' })
        setState(s => ({
          ...s,
          loaded: true,
          error: seedErr ? seedErr.message : null,
        }))
        return
      }

      // Merge: los datos de Supabase mandan. Incluye TODAS las filas de la DB,
      // no solo las que están en GUIONES_BASE (si no, los guiones nuevos se
      // perdían al recargar).
      const dbMap = new Map(
        data.map((r: Record<string, unknown>) => [r.id as string, r])
      )
      const baseIds = new Set(GUIONES_BASE.map(g => g.id))

      const merged: Guion[] = GUIONES_BASE.map(g => {
        const db = dbMap.get(g.id)
        if (!db) return g
        return {
          ...g,
          titulo: (db.titulo as string) ?? g.titulo,
          estado: (db.estado as GuionEstado) ?? g.estado,
          fecha_programada: (db.fecha_programada as string) ?? g.fecha_programada,
          contenido: (db.contenido as string) ?? g.contenido,
          notas: (db.notas as string) ?? g.notas,
          plataforma: (db.plataforma as string[]) ?? g.plataforma,
          nc: (db.nc as number) ?? g.nc,
          angulo: (db.angulo as Guion['angulo']) ?? g.angulo,
        }
      })

      // Guiones creados desde la app (ids que no están en GUIONES_BASE)
      const creados = data
        .filter((r: Record<string, unknown>) => !baseIds.has(r.id as string))
        .map(rowToGuion)

      setState({
        guiones: [...merged, ...creados].sort((a, b) => a.numero - b.numero),
        loaded: true,
        saving: false,
        error: null,
      })
    }
    load()
  }, [])

  const updateGuion = useCallback(async (id: string, changes: Partial<Guion>) => {
    setState(s => ({
      ...s,
      saving: true,
      error: null,
      guiones: s.guiones.map(g => (g.id === id ? { ...g, ...changes } : g)),
    }))

    const sb = createClient()
    if (!sb) {
      setState(s => ({ ...s, saving: false }))
      return
    }

    // Fila COMPLETA = guion ya actualizado en memoria. Así el guardado nunca
    // falla por columnas NOT NULL ausentes (numero/codigo/titulo/tipo).
    const actualizado = guionesRef.current.find(g => g.id === id)
    const row = actualizado
      ? guionToRow(actualizado)
      : { id, ...changes, updated_at: new Date().toISOString() }

    const { error } = await sb
      .from('guiones_cms')
      .upsert(row, { onConflict: 'id' })

    setState(s => ({
      ...s,
      saving: false,
      error: error ? `No se pudo guardar: ${error.message}` : null,
    }))
  }, [])

  const createGuion = useCallback(async (fields: {
    codigo: string
    titulo: string
    tipo: Guion['tipo']
    duracion: string
    plataforma: string[]
    pilar?: string
    bloque?: string
  }) => {
    const id = crypto.randomUUID()
    const numero =
      Math.max(...guionesRef.current.map(g => g.numero), 0) + 1
    const nuevo: Guion = {
      id, numero,
      codigo: fields.codigo,
      titulo: fields.titulo,
      tipo: fields.tipo,
      duracion: fields.duracion,
      plataforma: fields.plataforma,
      pilar: fields.pilar ?? '',
      bloque: fields.bloque,
      estado: 'BORRADOR',
      contenido: '',
      notas: '',
    }

    setState(s => ({
      ...s,
      saving: true,
      error: null,
      guiones: [...s.guiones, nuevo],
    }))

    const sb = createClient()
    if (sb) {
      const { error } = await sb
        .from('guiones_cms')
        .upsert(guionToRow(nuevo), { onConflict: 'id' })
      setState(s => ({
        ...s,
        saving: false,
        error: error ? `No se pudo crear el guión: ${error.message}` : null,
      }))
    } else {
      setState(s => ({ ...s, saving: false }))
    }

    return id
  }, [])

  return { ...state, updateGuion, createGuion }
}
