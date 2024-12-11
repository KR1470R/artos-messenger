import { create } from 'zustand'

export interface IChatStore {
	selectedUser: { id: number; username: string } | null
	setSelectedUser: (user: { id: number; username: string }) => void
	clearSelectedUser: () => void
}

export const useChatStore = create<IChatStore>(set => ({
	selectedUser: null,
	setSelectedUser: user => set({ selectedUser: user }),
	clearSelectedUser: () => set({ selectedUser: null }),
}))
