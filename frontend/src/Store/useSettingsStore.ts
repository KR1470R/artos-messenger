import { create } from 'zustand'

export interface ISettingsStore {
	tabMain: string
	activeParam: string | null
	setTabMain: (tabMain: string) => void
	setActiveParam: (activeParam: string | null) => void
}
export const useSettingsStore = create<ISettingsStore>(set => ({
	tabMain: 'chats',
	activeParam: null,
	setTabMain: tabMain => set({ tabMain }),
	setActiveParam: activeParam => set({ activeParam }),
}))
