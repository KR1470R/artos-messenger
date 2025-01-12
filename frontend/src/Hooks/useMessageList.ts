import {
	connectSocket,
	createMessage,
	fetchMessages,
	markMessageAsRead,
	socket,
	subscribeToFetchMessages,
	subscribeToNewMessages,
	unsubscribeFromFetchMessages,
	unsubscribeFromNewMessages,
} from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useEffect, useRef, useState } from 'react'

const useMessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const { selectedUser, chatId } = useChatStore()
	const { user } = useAuthStore()
	const containerRef = useRef<HTMLDivElement | null>(null)

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
	}, [chatId])

	const handleSendMessage = (messageContent: string) => {
		if (!messageContent.trim() || !chatId || !user) return
		createMessage(chatId, messageContent)
	}

	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight
		}
	}
	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSend = (messageContent: string) => {
		handleSendMessage(messageContent)
		setTimeout(() => {
			scrollToBottom()
		}, 0)
	}

	const observeMessages = () => {
		if (!chatId) return console.log(chatId)
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					const isIntersecting = entry.isIntersecting
					const target = entry.target
					const messageId = target.getAttribute('data-id')
					const isMine = target.classList.contains('mine')
					if (isIntersecting && messageId && !isMine)
						if (messageId) markMessageAsRead(chatId, Number(messageId), true)
				})
			},
			{ threshold: 1.0 },
		)
		return observer
	}

	useEffect(() => {
		if (messages.length === 0) return
		const observer = observeMessages()
		if (!observer) return
		const container = containerRef.current
		if (!container) return
		const messageElements = container.querySelectorAll('.message[data-id]')
		messageElements.forEach(message => {
			const dataId = message.getAttribute('data-id')
			console.log(`Спостереження за повідомленням з data-id: ${dataId}`, message)
			observer.observe(message)
		})

		return () => {
			messageElements.forEach(message => observer.unobserve(message))
		}
	}, [messages])
	return { selectedUser, messages, handleSend, user, containerRef }
}

export { useMessageList }
