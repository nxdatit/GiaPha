import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TreeOrientation, Language, FilterState } from '../types';

interface UIState {
  orientation: TreeOrientation;
  language: Language;
  selectedPersonId: string | null;
  searchQuery: string;
  filters: FilterState;
  collapsedNodeIds: string[];

  setOrientation: (orientation: TreeOrientation) => void;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setSelectedPerson: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterState) => void;
  toggleCollapse: (nodeId: string) => void;
  collapseAll: (nodeIds: string[]) => void;
  expandAll: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      orientation: 'vertical',
      language: 'vi',
      selectedPersonId: null,
      searchQuery: '',
      filters: {},
      collapsedNodeIds: [],

      setOrientation: (orientation) => set({ orientation }),

      setLanguage: (language) => set({ language }),

      toggleLanguage: () =>
        set((state) => ({
          language: state.language === 'vi' ? 'en' : 'vi',
        })),

      setSelectedPerson: (id) => set({ selectedPersonId: id }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setFilters: (filters) => set({ filters }),

      toggleCollapse: (nodeId) =>
        set((state) => ({
          collapsedNodeIds: state.collapsedNodeIds.includes(nodeId)
            ? state.collapsedNodeIds.filter((id) => id !== nodeId)
            : [...state.collapsedNodeIds, nodeId],
        })),

      collapseAll: (nodeIds) => set({ collapsedNodeIds: nodeIds }),

      expandAll: () => set({ collapsedNodeIds: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        orientation: state.orientation,
        language: state.language,
        collapsedNodeIds: state.collapsedNodeIds,
      }),
    }
  )
);
