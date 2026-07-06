'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProgress {
  modulesVisited: string[];
  modulesCompleted: string[];
  quizAnswers: Record<string, string>;
  quizCompleted: boolean;
  selectedMeta: string | null;
  stagesViewed: string[];
}

const STORAGE_KEY = 'prolarva_progress';

const defaultProgress: UserProgress = {
  modulesVisited: [],
  modulesCompleted: [],
  quizAnswers: {},
  quizCompleted: false,
  selectedMeta: null,
  stagesViewed: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  const save = useCallback((next: UserProgress) => {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const markVisited = useCallback((module: string) => {
    setProgress(prev => {
      if (prev.modulesVisited.includes(module)) return prev;
      const next = { ...prev, modulesVisited: [...prev.modulesVisited, module] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const markCompleted = useCallback((module: string) => {
    setProgress(prev => {
      if (prev.modulesCompleted.includes(module)) return prev;
      const next = { ...prev, modulesCompleted: [...prev.modulesCompleted, module] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const saveQuizAnswers = useCallback((answers: Record<string, string>) => {
    setProgress(prev => {
      const next = { ...prev, quizAnswers: answers, quizCompleted: true, selectedMeta: answers['meta'] || prev.selectedMeta };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const selectMeta = useCallback((metaId: string) => {
    setProgress(prev => {
      const next = { ...prev, selectedMeta: metaId };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const markStageViewed = useCallback((stageId: string) => {
    setProgress(prev => {
      if (prev.stagesViewed.includes(stageId)) return prev;
      const next = { ...prev, stagesViewed: [...prev.stagesViewed, stageId] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setProgress(defaultProgress);
  }, []);

  const totalModules = 3;
  const completedCount = progress.modulesCompleted.length;
  const overallPercent = Math.round((completedCount / totalModules) * 100);

  return {
    progress,
    loaded,
    save,
    markVisited,
    markCompleted,
    saveQuizAnswers,
    selectMeta,
    markStageViewed,
    reset,
    overallPercent,
    completedCount,
    totalModules,
  };
}
