import {
	connectSocket,
	createMessage,
	fetchMessages,
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

	return { selectedUser, messages, handleSend, user, containerRef }
}

export { useMessageList }
