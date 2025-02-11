import { create } from 'zustand'

export interface IChatStore {
	selectedUser: { id: number; username: string } | null
	chatId: number | null
	setSelectedUser: (user: { id: number; username: string }) => void
	setChatId: (chatId: number) => void
}

export const useChatStore = create<IChatStore>(set => ({
	selectedUser: null,
	chatId: null,
	setSelectedUser: user => set({ selectedUser: user }),
	setChatId: chatId => set({ chatId }),
}))
