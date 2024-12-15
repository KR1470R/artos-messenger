import { createMessage, socket, subscribeToNewMessages } from '@/Services/socket'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useEffect, useState } from 'react'

const useMessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const { selectedUser, chatId } = useChatStore()
	const { user } = useAuthStore()

	useEffect(() => {
		const handleNewMessage = (newMessage: IMessageType) => {
			console.log('📩 New message received:', newMessage)
			setMessages(prevMessages => {
				const updatedMessages = [...prevMessages, newMessage]
				console.log('🗂 Updated messages list:', updatedMessages)
				return updatedMessages
			})
		}

		subscribeToNewMessages(handleNewMessage)
		console.log('✅ Subscribed to "new_message" event')

		return () => {
			socket.off('new_message', handleNewMessage)
			console.log('🔌 Unsubscribed from "new_message" event')
		}
	}, [selectedUser])

	const handleSendMessage = (messageContent: string) => {
		if (!messageContent.trim() || !chatId || !user || !selectedUser) {
			console.warn('⚠️ Invalid message or user. Message:', messageContent, 'User:', user)
			return
		}

		console.log('✈️ Sending message:', {
			chat_id: chatId,
			content: messageContent,
			receiver_id: selectedUser.id,
		})

		createMessage(chatId, messageContent, selectedUser.id)

		const newMessage: IMessageType = {
			id: Date.now(),
			chat_id: chatId,
			sender_id: user.id,
			receiver_id: selectedUser.id,
			content: messageContent,
			is_read: false,
			created_at: new Date().toISOString(),
			timestamp: new Date().getTime(),
			updated_at: new Date().toISOString(),
		}

		console.log('📝 Adding new message locally:', newMessage)

		setMessages(prevMessages => {
			const updatedMessages = [...prevMessages, newMessage]
			console.log('🗂 Updated messages after sending:', updatedMessages)
			return updatedMessages
		})
	}

	console.log('🖥 Rendering messages:', messages)

	return { selectedUser, messages, handleSendMessage, user }
}
export { useMessageList }
