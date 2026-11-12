import { create } from 'zustand';
import { getWeekStart, toISODate } from '../utils/weeks';

interface AppState {
  // monday of the week picked on the home screen. kept in the store so
  // the selection survives moving between the pages
  weekStart: string;
  setWeekStart: (weekStart: string) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  weekStart: toISODate(getWeekStart(new Date())),
  setWeekStart: (weekStart) => set({ weekStart }),
}));
