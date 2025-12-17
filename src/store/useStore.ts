import { create } from 'zustand'

interface AppState {
    selectedAppId: string | null
    setSelectedAppId: (id: string | null) => void

    selectedNodeId: string | null
    setSelectedNodeId: (id: string | null) => void

    isMobilePanelOpen: boolean
    setMobilePanelOpen: (open: boolean) => void

    activeInspectorTab: string
    setActiveInspectorTab: (tab: string) => void
}

export const useStore = create<AppState>((set) => ({
    selectedAppId: null,
    setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }), // Reset node selection on app change

    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    isMobilePanelOpen: false,
    setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),

    activeInspectorTab: 'config',
    setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}))
