import {
	connectSocket,
	createMessage,
	fetchMessages,
	markMessageAsRead,
	socket,
	subscribeToFetchMessages,
	subscribeToNewMessages,
	subscribeToUpdatedMessages,
	unsubscribeFromFetchMessages,
	unsubscribeFromNewMessages,
	unsubscribeFromUpdatedMessages,
} from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useCallback, useEffect, useState } from 'react'
import { useScroll } from './useScroll'

const useMessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const [unreadMessagesLen, setUnreadMessagesLen] = useState<number>(0)
	const { selectedUser, chatId } = useChatStore()
	const { user } = useAuthStore()
	const { containerRef, scrollToBottom, handleSmoothScroll, showScrollButton } =
		useScroll(messages)

	const updateUnreadMessagesLen = useCallback(() => {
		return messages.filter(message => {
			return Number(message.is_read) === 0 && message.sender_id !== user?.id
		}).length
	}, [messages, user?.id])

	useEffect(() => {
		if (!chatId) return
		const handleMessages = (fetchedMessages: IMessageType[]) => {
			setMessages(fetchedMessages)
		}
		fetchMessages(chatId, 20, 1)
		subscribeToFetchMessages(handleMessages)
		return () => {
			unsubscribeFromFetchMessages(handleMessages)
		}
	}, [chatId])

	useEffect(() => {
		if (!socket.connected) connectSocket()
		const handleNewMessage = (newMessage: IMessageType) => {
			setMessages(prevMessages => {
				if (prevMessages.some(msg => msg.id === newMessage.id)) return prevMessages
				return [...prevMessages, newMessage]
			})
		}
		subscribeToNewMessages(handleNewMessage)
		return () => {
			unsubscribeFromNewMessages(handleNewMessage)
		}
	}, [chatId, user?.id])

	const observeMessages = useCallback(() => {
		if (!chatId) return console.log(chatId)
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const isIntersecting = entry.isIntersecting
					const target = entry.target as HTMLElement
					const messageId = target.getAttribute('data-id')
					const isMine = target.classList.contains('mine')
					const message = messages.find(msg => msg.id === Number(messageId))
					if (isIntersecting && messageId && !isMine) {
						if (message && message.initiator_id !== user?.id) {
							markMessageAsRead(chatId, Number(messageId), true)
						}
					}
				})
			},
			{ threshold: 1.0 },
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

	useEffect(() => {
		setUnreadMessagesLen(updateUnreadMessagesLen())
	}, [messages, user?.id, updateUnreadMessagesLen])

	useEffect(() => {
		if (!socket.connected) connectSocket()
		const handleUpdatedMessage = (updatedMessage: IMessageType) => {
			if (updatedMessage.initiator_id === user?.id) return
			setMessages(prevMessages =>
				prevMessages.map(message => {
					if (message.id === updatedMessage.id) {
						if (updatedMessage.receiver_id === user?.id) {
							return { ...message, ...updatedMessage }
						}
						return message
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
	}, [chatId, user?.id, updateUnreadMessagesLen])

	const handleSend = (messageContent: string) => {
		if (!messageContent.trim() || !chatId || !user) return
		createMessage(chatId, messageContent)
		setUnreadMessagesLen(updateUnreadMessagesLen())
		setTimeout(() => {
			scrollToBottom()
		}, 0)
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
	}
}

export { useMessageList }
