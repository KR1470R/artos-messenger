import { CreateChat } from '@/Services/chats/CreateChat.service'
import { GetChat } from '@/Services/chats/GetChat.service'
import { GetChats } from '@/Services/chats/GetChats.service'
import {
  fetchMessages,
  joinChat,
  subscribeToFetchMessages,
  subscribeToNewChatNotification,
  subscribeToNewMessages,
  unsubscribeFromFetchMessages,
  unsubscribeFromNewChatNotification,
  unsubscribeFromNewMessages,
} from '@/Services/socket'
import { GetUsers } from '@/Services/users/GetUsers.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'

const useConversationList = (
  decryptFrom?: (senderId: number, content: string, partnerId: number) => Promise<string>
) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages')
  const [lastMessages, setLastMessages] = useState<Record<number, string>>({})
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({})
  const { selectedUser, setSelectedUser, setChatId, setRecipientId } = useChatStore()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  // Keep a stable ref to decryptFrom so the new_message handler below can
  // always call the latest version without needing it as an effect dependency.
  const decryptFromRef = useRef(decryptFrom)
  useEffect(() => { decryptFromRef.current = decryptFrom }, [decryptFrom])

  // Same for chatsData — the new_message handler needs to look up the chat's
  // user_id (partner) for decryption without re-subscribing on every fetch.
  const chatsDataRef = useRef<IChat[] | undefined>(undefined)

  const { data: chatsData, isLoading: isChatsLoading } = useQuery<IChat[]>({
    queryKey: ['chats'],
    queryFn: GetChats,
    enabled: activeTab === 'messages',
  })

  useEffect(() => {
    chatsDataRef.current = chatsData
  }, [chatsData])

  const { data: usersData, isLoading: isUsersLoading } = useQuery<IUserAll[]>({
    queryKey: ['users'],
    queryFn: GetUsers,
    enabled: activeTab === 'users',
  })

  const isLoading = activeTab === 'messages' ? isChatsLoading : isUsersLoading
  const getRenderContent = useMemo(() => {
    return activeTab === 'messages' ? chatsData || [] : usersData || []
  }, [activeTab, chatsData, usersData])

  // ── Subscribe to last-message previews (initial fetch per chat) ──────────────
  useEffect(() => {
    if (!chatsData) return
    const handlers: Array<() => void> = []

    const handleFetchedMessages = async (messages: IMessageType[], chatId: number, senderId: number) => {
      if (messages.length === 0) return
      const raw = messages[messages.length - 1]
      let content = raw.content

      if (decryptFromRef.current && content?.startsWith('e2ee:')) {
        content = await decryptFromRef.current(raw.sender_id, content, senderId)
      }

      if (content === '[decryption failed]') return

      setLastMessages(prev => {
        if (prev[chatId] === content) return prev
        return { ...prev, [chatId]: content }
      })
    }

    chatsData.forEach(chat => {
      joinChat(chat.id)
      fetchMessages(chat.id, 1, 1)
      const messageHandler = (messages: IMessageType[]) =>
        handleFetchedMessages(messages, chat.id, chat.user_id).catch(console.error)
      subscribeToFetchMessages(messageHandler)
      handlers.push(() => unsubscribeFromFetchMessages(messageHandler))
    })

    return () => {
      handlers.forEach(unsub => unsub())
    }
  }, [chatsData])

  // ── Real-time: new_message → update preview + unread badge ───────────────────
  // Intentionally has NO chatsData/user dependency so it is set up once on
  // mount and stays active. Using refs for chatsData and decryptFrom means we
  // always read the latest values without re-subscribing (which would cause the
  // very first message on a brand-new chat to be missed while React Query is
  // still refetching after new_chat_notification fires).
  useEffect(() => {
    const handleNewMessage = async (msg: IMessageType) => {
      // --- decrypt the snippet if needed ---
      let content = msg.content
      const chat = chatsDataRef.current?.find(c => c.id === msg.chat_id)
      // chat.user_id is the partner's userId stored in the chat row
      const partnerId = chat?.user_id ?? msg.sender_id
      if (decryptFromRef.current && content?.startsWith('e2ee:')) {
        content = await decryptFromRef.current(msg.sender_id, content, partnerId)
        if (content === '[decryption failed]') return
      }

      // --- update last-message preview ---
      setLastMessages(prev => ({ ...prev, [msg.chat_id]: content }))

      // --- increment unread badge (only for messages from others, in non-active chats) ---
      const currentUserId = useAuthStore.getState().user?.id
      const activeChatId = useChatStore.getState().chatId
      if (msg.sender_id !== currentUserId && msg.chat_id !== activeChatId) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.chat_id]: (prev[msg.chat_id] ?? 0) + 1,
        }))
      }
    }

    subscribeToNewMessages(handleNewMessage)
    return () => unsubscribeFromNewMessages(handleNewMessage)
  }, []) // empty deps — subscribe once, read latest values via refs

  // ── Auto-refresh chat list when a brand-new chat is created for us ───────────
  useEffect(() => {
    const handleNewChatNotification = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    }

    subscribeToNewChatNotification(handleNewChatNotification)
    return () => unsubscribeFromNewChatNotification(handleNewChatNotification)
  }, [queryClient])

  // ── Clear unread count when a chat is opened ─────────────────────────────────
  const clearUnread = (chatId: number) => {
    setUnreadCounts(prev => {
      if (!prev[chatId]) return prev
      const next = { ...prev }
      delete next[chatId]
      return next
    })
  }

  const handleItemClickUsers = async (userSelect: { id: number; username: string }) => {
    if (selectedUser?.id === userSelect.id) return
    setSelectedUser(userSelect)
    setRecipientId(userSelect.id)
    try {
      const chatId = await CreateChat(userSelect.id)
      setChatId(chatId)
      joinChat(chatId)
      clearUnread(chatId)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const existing = chatsData?.find(c =>
          (c as any).members?.some((m: any) => m.user_id === userSelect.id)
        )
        if (existing) {
          setChatId(existing.id)
          joinChat(existing.id)
          clearUnread(existing.id)
        } else {
          console.error('Chat exists on server but not found in local chats list')
        }
      } else {
        console.error('❌ Error creating or joining chat:', error)
      }
    }
  }

  const handleItemClickChats = async (chatId: number) => {
    if (chatId === useChatStore.getState().chatId) return
    clearUnread(chatId)
    try {
      const chat = await GetChat(chatId)

      const otherMember = chat?.members?.find(
        (m: { user_id: number }) => m.user_id !== user?.id,
      )
      setSelectedUser(otherMember)
      setRecipientId(otherMember?.user_id ?? null)

      setChatId(chatId)
      joinChat(chatId)
    } catch (error) {
      console.error('❌ Error fetching or joining chat:', error)
      setChatId(chatId)
      joinChat(chatId)
      setRecipientId(null)
    }
  }

  return {
    activeTab,
    setActiveTab,
    renderContent: getRenderContent,
    isLoading,
    handleItemClickUsers,
    handleItemClickChats,
    lastMessages,
    unreadCounts,
  }
}

export { useConversationList }