import { CreateChat } from '@/Services/chats/CreateChat.service'
import { GetChat } from '@/Services/chats/GetChat.service'
import { GetChats } from '@/Services/chats/GetChats.service'
import {
  fetchMessages,
  INewChatNotification,
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

  // Stable refs so socket handlers always read the latest values without
  // needing to be torn down and re-subscribed on every render.
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
  // Empty deps: subscribe once on mount, read latest values via refs.
  // This handles messages in chats the user has already joined.
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

  // ── New-chat notification: first message in a chat we haven't joined yet ─────
  // The server sends this instead of new_message when the recipient hasn't
  // called join_chat for the chat (i.e. it's brand new to them). It carries
  // the content and sender_id so we can update the sidebar immediately, then
  // we invalidate the query to fetch the full chat metadata.
  useEffect(() => {
    const handleNewChatNotification = async (data: INewChatNotification) => {
      // Immediately invalidate so the chat row appears in the list
      queryClient.invalidateQueries({ queryKey: ['chats'] })

      // Decrypt the preview snippet if needed.
      // For a brand-new chat we don't have a chatsData entry yet, so we use
      // sender_id as the partnerId — correct for direct chats.
      let content = data.content
      if (decryptFromRef.current && content?.startsWith('e2ee:')) {
        content = await decryptFromRef.current(data.sender_id, content, data.sender_id)
        if (content === '[decryption failed]') return
      }

      // Set the preview and the unread badge right away, before the refetch
      // resolves. This is what makes the first message show up highlighted.
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