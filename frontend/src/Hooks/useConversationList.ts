import { CreateChat } from '@/Services/chats/CreateChat.service'
import { GetChat } from '@/Services/chats/GetChat.service'
import { GetChats } from '@/Services/chats/GetChats.service'
import {
  fetchMessages,
  INewChatNotification,
  joinChat,
  subscribeToChatDeleted,
  subscribeToFetchMessages,
  subscribeToNewChatNotification,
  subscribeToNewMessages,
  unsubscribeFromChatDeleted,
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

  const decryptFromRef = useRef(decryptFrom)
  useEffect(() => { decryptFromRef.current = decryptFrom }, [decryptFrom])

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

  // ── Initial last-message preview per chat ────────────────────────────────────
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

      // Recompute unread count from the fetched batch so it survives page
      // refreshes. Only count messages from the other person that aren't read.
      const currentUserId = useAuthStore.getState().user?.id
      const unread = messages.filter(
        m => m.sender_id !== currentUserId && Number(m.is_read) === 0,
      ).length
      if (unread > 0) {
        setUnreadCounts(prev => ({ ...prev, [chatId]: unread }))
      }
    }

    chatsData.forEach(chat => {
      joinChat(chat.id)
      fetchMessages(chat.id, 50, 1)
      const messageHandler = (messages: IMessageType[]) =>
        handleFetchedMessages(messages, chat.id, chat.user_id).catch(console.error)
      subscribeToFetchMessages(messageHandler)
      handlers.push(() => unsubscribeFromFetchMessages(messageHandler))
    })

    return () => {
      handlers.forEach(unsub => unsub())
    }
  }, [chatsData])

  // ── Real-time new_message: preview + unread badge ────────────────────────────
  // Empty deps — subscribed once on mount, reads latest values via refs.
  useEffect(() => {
    const handleNewMessage = async (msg: IMessageType) => {
      let content = msg.content
      const chat = chatsDataRef.current?.find(c => c.id === msg.chat_id)
      const partnerId = chat?.user_id ?? msg.sender_id
      if (decryptFromRef.current && content?.startsWith('e2ee:')) {
        content = await decryptFromRef.current(msg.sender_id, content, partnerId)
        if (content === '[decryption failed]') return
      }

      setLastMessages(prev => ({ ...prev, [msg.chat_id]: content }))

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
  }, [])

  // ── First message in a brand-new chat ────────────────────────────────────────
  useEffect(() => {
    const handleNewChatNotification = async (data: INewChatNotification) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })

      let content = data.content
      if (decryptFromRef.current && content?.startsWith('e2ee:')) {
        content = await decryptFromRef.current(data.sender_id, content, data.sender_id)
        if (content === '[decryption failed]') return
      }

      setLastMessages(prev => ({ ...prev, [data.chat_id]: content }))

      const activeChatId = useChatStore.getState().chatId
      if (data.chat_id !== activeChatId) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.chat_id]: (prev[data.chat_id] ?? 0) + 1,
        }))
      }
    }

    subscribeToNewChatNotification(handleNewChatNotification)
    return () => unsubscribeFromNewChatNotification(handleNewChatNotification)
  }, [queryClient])

  // ── Real-time chat deletion for both the deleter and the opponent ────────────
  useEffect(() => {
    const handleChatDeleted = ({ chat_id }: { chat_id: number }) => {
      // Remove the chat from the React Query cache immediately — no refetch needed.
      queryClient.setQueryData<IChat[]>(['chats'], prev =>
        prev ? prev.filter(c => c.id !== chat_id) : prev,
      )

      // Clean up local state for the removed chat
      setLastMessages(prev => {
        const next = { ...prev }
        delete next[chat_id]
        return next
      })
      setUnreadCounts(prev => {
        const next = { ...prev }
        delete next[chat_id]
        return next
      })

      // If this chat was currently open, close it
      if (useChatStore.getState().chatId === chat_id) {
        useChatStore.getState().setChatId(null as any)
        useChatStore.getState().setSelectedUser(null as any)
        useChatStore.getState().setRecipientId(null)
      }
    }

    subscribeToChatDeleted(handleChatDeleted)
    return () => unsubscribeFromChatDeleted(handleChatDeleted)
  }, [queryClient])

  // ── Clear unread when a chat is opened ───────────────────────────────────────
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