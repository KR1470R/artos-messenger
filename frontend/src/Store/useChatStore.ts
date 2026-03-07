import { create } from 'zustand'

export interface IChatStore {
  selectedUser: { id: number; username: string } | null
  chatId: number | null
  // The other participant's userId in a direct chat — used for E2EE key lookup.
  // null for group chats or when no chat is open.
  recipientId: number | null
  setSelectedUser: (user: { id: number; username: string }) => void
  setChatId: (chatId: number) => void
  setRecipientId: (recipientId: number | null) => void
}

export const useChatStore = create<IChatStore>(set => ({
  selectedUser: null,
  chatId: null,
  recipientId: null,
  setSelectedUser: user => set({ selectedUser: user }),
  setChatId: chatId => set({ chatId }),
  setRecipientId: recipientId => set({ recipientId }),
}))