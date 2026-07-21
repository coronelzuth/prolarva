'use client'
import { useState, useEffect, useCallback } from 'react'
import { getSupabase as createClient } from '@/lib/supabase'
import { GUIONES_BASE, Guion, GuionEstado } from '@/data/guiones'

interface CmsState {
  guiones: Guion[]
  loaded: boolean
  saving: boolean
  error: string | null
}

export function useGuionesCms() {
  const [state, setState] = useState<CmsState>({
    guiones: GUIONES_BASE,
    loaded: false,
    saving: false,
    error: null,
  })

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
        const rows = GUIONES_BASE.map(g => ({
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
          contenido: g.contenido,
          notas: g.notas ?? null,
        }))
        await sb.from('guiones_cms').upsert(rows, { onConflict: 'id' })
        setState(s => ({ ...s, loaded: true }))
        return
      }

      // Merge: datos de Supabase sobreescriben los base
      const dbMap = new Map(data.map((r: Record<string, unknown>) => [r.id as string, r]))
      const merged = GUIONES_BASE.map(g => {
        const db = dbMap.get(g.id)
        if (!db) return g
        return {
          ...g,
          estado: (db.estado as GuionEstado) ?? g.estado,
          fecha_programada: (db.fecha_programada as string) ?? g.fecha_programada,
          contenido: (db.contenido as string) ?? g.contenido,
          notas: (db.notas as string) ?? g.notas,
          plataforma: (db.plataforma as string[]) ?? g.plataforma,
          nc: (db.nc as number) ?? g.nc,
          angulo: (db.angulo as Guion['angulo']) ?? g.angulo,
        }
      })
      setState({ guiones: merged, loaded: true, saving: false, error: null })
    }
    load()
  }, [])

  const updateGuion = useCallback(async (id: string, changes: Partial<Guion>) => {
    setState(s => ({
      ...s,
      saving: true,
      guiones: s.guiones.map(g => (g.id === id ? { ...g, ...changes } : g)),
    }))

    const sb = createClient()
    if (sb) {
      await sb.from('guiones_cms').upsert(
        { id, ...changes, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
    }

    setState(s => ({ ...s, saving: false }))
  }, [])

  return { ...state, updateGuion }
}
