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

	const updateMessages = useCallback(
		(data: IMessageType) => {
			if (!chatId) return
			updateMessage(chatId, data.id, data.content, Boolean(data.is_read))
		},
		[chatId],
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

	const handleSend = (messageContent: string) => {
		if (!messageContent.trim() || !chatId || !user) return
		createMessage(chatId, messageContent)
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
		deleteMessage,
		updateMessages,
	}
}

export { useMessageList }
