'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface UserProgress {
  modulesVisited: string[];
  modulesCompleted: string[];
  quizAnswers: Record<string, string>;
  quizCompleted: boolean;
  selectedMeta: string | null;
  stagesViewed: string[];
}

const STORAGE_KEY = 'prolarva_progress';
const DEVICE_KEY  = 'prl-device-id';

const defaultProgress: UserProgress = {
  modulesVisited: [],
  modulesCompleted: [],
  quizAnswers: {},
  quizCompleted: false,
  selectedMeta: null,
  stagesViewed: [],
};

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function toRow(deviceId: string, p: UserProgress) {
  return {
    device_id:         deviceId,
    modules_visited:   p.modulesVisited,
    modules_completed: p.modulesCompleted,
    quiz_answers:      p.quizAnswers,
    quiz_completed:    p.quizCompleted,
    selected_meta:     p.selectedMeta,
    stages_viewed:     p.stagesViewed,
    updated_at:        new Date().toISOString(),
  };
}

function fromRow(row: Record<string, unknown>): UserProgress {
  return {
    modulesVisited:   (row.modules_visited   as string[])              ?? [],
    modulesCompleted: (row.modules_completed as string[])              ?? [],
    quizAnswers:      (row.quiz_answers      as Record<string, string>) ?? {},
    quizCompleted:    (row.quiz_completed    as boolean)               ?? false,
    selectedMeta:     (row.selected_meta     as string)                ?? null,
    stagesViewed:     (row.stages_viewed     as string[])              ?? [],
  };
}

async function syncUp(deviceId: string, p: UserProgress) {
  const db = getSupabase();
  if (!db) return;
  await db.from('user_progress').upsert(toRow(deviceId, p));
}

function localSave(p: UserProgress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    async function init() {
      // Load from localStorage immediately (instant, offline)
      let local = defaultProgress;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) { local = JSON.parse(stored); setProgress(local); }
      } catch {}

      // Merge with Supabase (may have data from another device)
      const db = getSupabase();
      if (db) {
        const deviceId = getDeviceId();
        const { data } = await db
          .from('user_progress')
          .select('*')
          .eq('device_id', deviceId)
          .single();
        if (data) {
          const remote = fromRow(data as Record<string, unknown>);
          setProgress(remote);
          localSave(remote);
        }
      }

      setLoaded(true);
    }
    init();
  }, []);

  const _sync = useCallback((next: UserProgress) => {
    const deviceId = localStorage.getItem(DEVICE_KEY) || '';
    if (deviceId) syncUp(deviceId, next);
  }, []);

  const save = useCallback((next: UserProgress) => {
    setProgress(next);
    localSave(next);
    _sync(next);
  }, [_sync]);

  const markVisited = useCallback((module: string) => {
    setProgress(prev => {
      if (prev.modulesVisited.includes(module)) return prev;
      const next = { ...prev, modulesVisited: [...prev.modulesVisited, module] };
      localSave(next); _sync(next);
      return next;
    });
  }, [_sync]);

  const markCompleted = useCallback((module: string) => {
    setProgress(prev => {
      if (prev.modulesCompleted.includes(module)) return prev;
      const next = { ...prev, modulesCompleted: [...prev.modulesCompleted, module] };
      localSave(next); _sync(next);
      return next;
    });
  }, [_sync]);

  const saveQuizAnswers = useCallback((answers: Record<string, string>) => {
    setProgress(prev => {
      const next = { ...prev, quizAnswers: answers, quizCompleted: true, selectedMeta: answers['meta'] || prev.selectedMeta };
      localSave(next); _sync(next);
      return next;
    });
  }, [_sync]);

  const selectMeta = useCallback((metaId: string) => {
    setProgress(prev => {
      const next = { ...prev, selectedMeta: metaId };
      localSave(next); _sync(next);
      return next;
    });
  }, [_sync]);

  const markStageViewed = useCallback((stageId: string) => {
    setProgress(prev => {
      if (prev.stagesViewed.includes(stageId)) return prev;
      const next = { ...prev, stagesViewed: [...prev.stagesViewed, stageId] };
      localSave(next); _sync(next);
      return next;
    });
  }, [_sync]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setProgress(defaultProgress);
    const db = getSupabase();
    const deviceId = localStorage.getItem(DEVICE_KEY) || '';
    if (db && deviceId) db.from('user_progress').delete().eq('device_id', deviceId);
  }, []);

  const totalModules   = 3;
  const completedCount = progress.modulesCompleted.length;
  const overallPercent = Math.round((completedCount / totalModules) * 100);

  return {
    progress, loaded,
    save, markVisited, markCompleted, saveQuizAnswers, selectMeta, markStageViewed, reset,
    overallPercent, completedCount, totalModules,
  };
}
