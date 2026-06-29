import { create } from 'zustand';
import type { Threat } from '../types/threat';

interface SelectedThreatState {
  selectedThreat: Threat | null;
  setSelectedThreat: (threat: Threat | null) => void;
  clearSelectedThreat: () => void;
}

export const useSelectedThreatStore = create<SelectedThreatState>((set) => ({
  selectedThreat: null,
  setSelectedThreat: (threat) => set({ selectedThreat: threat }),
  clearSelectedThreat: () => set({ selectedThreat: null }),
}));
