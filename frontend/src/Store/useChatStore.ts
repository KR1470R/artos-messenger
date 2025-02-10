import { create } from 'zustand'

export interface IChatStore {
	selectedUser: { id: number; username: string } | null
	chatId: number | null
	tabMain: string
	setTabMain: (tabMain: string) => void
	setSelectedUser: (user: { id: number; username: string }) => void
	setChatId: (chatId: number) => void
}

export const useChatStore = create<IChatStore>(set => ({
	selectedUser: null,
	chatId: null,
	tabMain: 'chats',
	setTabMain: tabMain => set({ tabMain }),
	setSelectedUser: user => set({ selectedUser: user }),
	setChatId: chatId => set({ chatId }),
}))
