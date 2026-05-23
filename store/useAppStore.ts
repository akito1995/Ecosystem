import { create } from "zustand";
import { CompanyData } from "../types";

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentCompany: CompanyData | null;
  setCurrentCompany: (company: CompanyData | null) => void;
  graphNodes: any[];
  setGraphNodes: (nodes: any[]) => void;
  graphEdges: any[];
  setGraphEdges: (edges: any[]) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  currentCompany: null,
  setCurrentCompany: (company) => set({ currentCompany: company }),
  graphNodes: [],
  setGraphNodes: (nodes) => set({ graphNodes: nodes }),
  graphEdges: [],
  setGraphEdges: (edges) => set({ graphEdges: edges }),
  recentSearches: [],
  addRecentSearch: (query) => set((state) => {
    const updated = [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 5);
    // Optionally persist to localStorage here or inside components
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
    return { recentSearches: updated };
  }),
}));
