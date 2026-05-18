import { CreateChat } from '@/Services/chats/CreateChat.service'
import { GetChat } from '@/Services/chats/GetChat.service'
import { GetChats } from '@/Services/chats/GetChats.service'
import {
  fetchMessages,
  joinChat,
  subscribeToFetchMessages,
  unsubscribeFromFetchMessages,
} from '@/Services/socket'
import { GetUsers } from '@/Services/users/GetUsers.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { IChat, IResponseError, IUserAll } from '@/Types/Services.interface'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const useConversationList = (
  decryptFrom?: (senderId: number, content: string, partnerId: number) => Promise<string>
) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages')
  const [lastMessages, setLastMessages] = useState<Record<number, string>>({})
  const { selectedUser, setSelectedUser, setChatId, setRecipientId } = useChatStore()
  const { user } = useAuthStore()

  const { data: chatsData, isLoading: isChatsLoading } = useQuery<IChat[]>({
    queryKey: ['chats'],
    queryFn: GetChats,
    enabled: activeTab === 'messages',
  })

  const { data: usersData, isLoading: isUsersLoading } = useQuery<IUserAll[]>({
    queryKey: ['users'],
    queryFn: GetUsers,
    enabled: activeTab === 'users',
  })

  const isLoading = activeTab === 'messages' ? isChatsLoading : isUsersLoading
  const getRenderContent = useMemo(() => {
    return activeTab === 'messages' ? chatsData || [] : usersData || []
  }, [activeTab, chatsData, usersData])

  useEffect(() => {
    if (!chatsData) return
    const handlers: Array<() => void> = []
    const handleMessages = async (messages: IMessageType[], chatId: number, senderId: number) => {
      if (messages.length > 0) {
        const raw = messages[messages.length - 1]
        let content = raw.content

        if (decryptFrom && content?.startsWith('e2ee:')) {
          content = await decryptFrom(raw.sender_id, content, senderId)
        }

        if (content === '[decryption failed]') return;

        setLastMessages(prev => {
          if (prev[chatId] === content) return prev
          return { ...prev, [chatId]: content }
        })
      }
    }
    chatsData.forEach(chat => {
      joinChat(chat.id)
      fetchMessages(chat.id, 1, 1)
      const messageHandler = (messages: IMessageType[]) =>
        handleMessages(messages, chat.id, chat.user_id).catch(console.error)
      subscribeToFetchMessages(messageHandler)
      handlers.push(() => unsubscribeFromFetchMessages(messageHandler))
    })
    return () => {
      handlers.forEach(unsub => unsub())
    }
  }, [chatsData])

  const handleItemClickUsers = async (userSelect: { id: number; username: string }) => {
    if (selectedUser?.id === userSelect.id) return
    setSelectedUser(userSelect)
    setRecipientId(userSelect.id)
    try {
      const chatId = await CreateChat(userSelect.id)
      setChatId(chatId)
      joinChat(chatId)
    } catch (error) {
      // 409 = chat already exists — find it in the loaded chats list and open it
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const existing = chatsData?.find(c =>
          // chatsData items don't have members here, so fall back to fetching by user
          (c as any).members?.some((m: any) => m.user_id === userSelect.id)
        )
        if (existing) {
          setChatId(existing.id)
          joinChat(existing.id)
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
    try {
      const chat = await GetChat(chatId)

      // Set recipientId BEFORE setChatId so it's in the store when
      // useMessageList's fetch effect fires and messages arrive
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
  }
}

export { useConversationList }