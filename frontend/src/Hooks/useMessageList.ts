import {
  createMessage,
  deleteMessages,
  fetchMessages,
  markMessageAsRead,
  subscribeToDeleteMessage,
  subscribeToFetchMessages,
  subscribeToNewMessages,
  subscribeToUpdatedMessages,
  unsubscribeFromDeleteMessage,
  unsubscribeFromFetchMessages,
  unsubscribeFromNewMessages,
  unsubscribeFromUpdatedMessages,
  updateMessage,
} from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useCallback, useEffect, useState } from 'react'
import { useScroll } from './useScroll'
import { useE2EE } from './useE2EE'

const useMessageList = () => {
  const [messages, setMessages] = useState<IMessageType[]>([])
  const [unreadMessagesLen, setUnreadMessagesLen] = useState<number>(0)
  const { selectedUser, chatId, recipientId } = useChatStore()
  const { user } = useAuthStore()
  const { containerRef, scrollToBottom, handleSmoothScroll, showScrollButton } =
    useScroll(messages)
  const { encryptFor, decryptFrom } = useE2EE()

  const updateUnreadMessagesLen = useCallback(() => {
    return messages.filter(message => {
      return Number(message.is_read) === 0 && message.sender_id !== user?.id
    }).length
  }, [messages, user?.id])

  // ─── Fetch messages ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!chatId) return
    const handleMessages = async (fetchedMessages: IMessageType[]) => {
      const currentRecipientId = useChatStore.getState().recipientId
      if (!currentRecipientId) {
        setMessages(fetchedMessages)
        return
      }

      const decrypted = await Promise.all(
        fetchedMessages.map(async msg => ({
          ...msg,
          content: await decryptFrom(msg.sender_id, msg.content, currentRecipientId),
        }))
      )

      setMessages(decrypted)
    }
    fetchMessages(chatId, 20, 1)
    subscribeToFetchMessages(handleMessages)
    return () => {
      unsubscribeFromFetchMessages(handleMessages)
    }
  }, [chatId])

  // ─── New message ──────────────────────────────────────────────────────────
  // Guard: only append messages that belong to the currently open chat.
  // Without this guard, messages from other chats (e.g. Alice texting while
  // you have Bob's chat open) would briefly flash in the wrong conversation.

  useEffect(() => {
    const handleNewMessage = async (newMessage: IMessageType) => {
      // Ignore messages that don't belong to the currently open chat
      const currentChatId = useChatStore.getState().chatId
      if (newMessage.chat_id !== currentChatId) return

      const currentRecipientId = useChatStore.getState().recipientId
      const decryptedContent = currentRecipientId
        ? await decryptFrom(newMessage.sender_id, newMessage.content, currentRecipientId)
        : newMessage.content
      const decryptedMessage = { ...newMessage, content: decryptedContent }
      setMessages(prevMessages => {
        if (prevMessages.some(msg => msg.id === decryptedMessage.id)) return prevMessages
        return [...prevMessages, decryptedMessage]
      })
    }
    subscribeToNewMessages(handleNewMessage)
    return () => {
      unsubscribeFromNewMessages(handleNewMessage)
    }
  }, [chatId, user?.id])

  // ─── Read receipts ────────────────────────────────────────────────────────

  const observeMessages = useCallback(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const isIntersecting = entry.isIntersecting
          const target = entry.target as HTMLElement
          const messageId = target.getAttribute('data-id')
          const isMine = target.classList.contains('mine')
          const message = messages.find(msg => msg.id === Number(messageId))

          if (messageId && !isMine && !message.is_read) {
            if (message && message.initiator_id !== user?.id) {
              markMessageAsRead(chatId, Number(messageId), true)
            }
          }
        })
      },
      { threshold: 0 },
    )
    return observer
  }, [chatId, messages, user?.id])

  useEffect(() => {
    if (messages.length === 0) return
    const observer = observeMessages()
    if (!observer) return
    const container = containerRef.current
    if (!container) return
    const messageElements = container.querySelectorAll('.message[data-id]')
    messageElements.forEach(message => {
      observer.observe(message)
    })
    return () => {
      messageElements.forEach(message => observer.unobserve(message))
    }
  }, [messages, observeMessages, containerRef])

  // ─── Update ───────────────────────────────────────────────────────────────

  const updateMessages = useCallback(
    async (data: IMessageType) => {
      if (!chatId) return
      let payload = data.content
      if (recipientId) {
        const encrypted = await encryptFor(recipientId, data.content)
        if (encrypted) payload = encrypted
      }
      updateMessage(chatId, data.id, payload, Boolean(data.is_read))
    },
    [chatId, recipientId, encryptFor],
  )

  useEffect(() => {
    const handleUpdatedMessage = (updatedMessage: IMessageType) => {
      if (updatedMessage.chat_id !== chatId) return
      setMessages(prevMessages =>
        prevMessages.map(message => {
          if (message.id === updatedMessage.id) {
            return {
              ...message,
              content: updatedMessage.content ?? message.content,
              is_read: updatedMessage.is_read ?? message.is_read,
            }
          }
          return message
        }),
      )
      setUnreadMessagesLen(updateUnreadMessagesLen())
    }
    subscribeToUpdatedMessages(handleUpdatedMessage)
    return () => {
      unsubscribeFromUpdatedMessages(handleUpdatedMessage)
    }
  }, [chatId, updateUnreadMessagesLen])

  // ─── Delete ───────────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    (data: IMessageType) => {
      if (!chatId) return
      deleteMessages(chatId, data.id)
    },
    [chatId],
  )

  useEffect(() => {
    const handleDeleteMessage = (deletedMessage: IMessageType) => {
      setMessages(prevMessages => {
        const index = prevMessages.findIndex(message => message.id === deletedMessage.id)
        if (index === -1) return prevMessages
        return [...prevMessages.slice(0, index), ...prevMessages.slice(index + 1)]
      })
    }
    subscribeToDeleteMessage(handleDeleteMessage)
    return () => {
      unsubscribeFromDeleteMessage(handleDeleteMessage)
    }
  }, [chatId, user?.id])

  // ─── Send ─────────────────────────────────────────────────────────────────

  const handleSend = async (messageContent: string) => {
    if (!messageContent.trim() || !chatId || !user) return
    let payload = messageContent
    if (recipientId) {
      const encrypted = await encryptFor(recipientId, messageContent)
      if (encrypted) payload = encrypted
    }
    createMessage(chatId, payload)
    setTimeout(() => scrollToBottom(), 0)
  }

  return {
    selectedUser,
    messages,
    handleSend,
    user,
    containerRef,
    unreadMessagesLen,
    handleSmoothScroll,
    showScrollButton,
    deleteMessage,
    updateMessages,
  }
}

export { useMessageList }