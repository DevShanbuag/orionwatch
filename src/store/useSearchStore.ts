import { create } from 'zustand';

interface SearchResult {
  id: string;
  type: 'incident' | 'threat' | 'asset' | 'ioc';
  title: string;
  subtitle: string;
  data: any;
}

interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  open: () => void;
  close: () => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  results: [],
  setIsOpen: (isOpen) => set({ isOpen }),
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  open: () => set({ isOpen: true, query: '', results: [] }),
  close: () => set({ isOpen: false, query: '', results: [] }),
  clear: () => set({ query: '', results: [] }),
}));
