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
			setMessages(prevMessages => {
				if (prevMessages.some(msg => msg.id === newMessage.id)) return prevMessages
				return [...prevMessages, newMessage]
			})
		}

		subscribeToNewMessages(handleNewMessage)

		return () => {
			socket.off('new_message', handleNewMessage)
		}
	}, [selectedUser, user])

	const handleSendMessage = (messageContent: string) => {
		if (!messageContent.trim() || !chatId || !user) return
		createMessage(chatId, messageContent)
	}
	return { selectedUser, messages, handleSendMessage, user }
}
export { useMessageList }
