import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useEffect, useState } from 'react'
import { createMessage, socket, subscribeToNewMessages } from '../../Services/socket'
import { Message } from '../../UI/Message/Message'
import { Toolbar } from '../../UI/Toolbar/Toolbar'
import { ToolbarButton } from '../../UI/ToolbarButton/ToolbarButton'
import { Compose } from '../Compose/Compose'
import './MessageList.css'

const MessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const { selectedUser } = useChatStore()
	const { user } = useAuthStore()

	useEffect(() => {
		const handleNewMessage = (newMessage: string) => {
			const message: IMessageType = {
				id: Date.now(),
				sender_id: selectedUser?.id ?? 0,
				content: newMessage,
				timestamp: new Date().getTime(),
				is_read: false,
				chat_id: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}

			console.log('New message received:', message)
			setMessages(prevMessages => [...prevMessages, message])
		}

		subscribeToNewMessages(handleNewMessage)

		return () => {
			socket.off('new_message', handleNewMessage)
		}
	}, [selectedUser])

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedUser) {
			console.warn(
				'Incorrect message or user. Message:',
				message,
				'User:',
				selectedUser,
			)
			return
		}

		console.log('Sending a message:', message, 'to chat:', selectedUser.id)
		createMessage(selectedUser.id, message)
		setMessages(prevMessages => [
			...prevMessages,
			{
				id: Date.now(),
				sender_id: user?.id ?? 0,
				content: message,
				timestamp: new Date().getTime(),
				is_read: false,
				chat_id: 0,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			} as IMessageType,
		])
	}

	return (
		<div className='messageList'>
			<Toolbar
				title={`Чат з ${selectedUser?.username || '...'}`}
				leftItems={[]}
				rightItems={[
					<ToolbarButton key='info' icon='ion-ios-information-circle-outline' />,
				]}
			/>
			<div className='messageListContainer'>
				{messages.map(msg => (
					<Message key={msg.id} data={msg} isMine={msg.sender_id === user?.id} />
				))}
			</div>

			{selectedUser?.id ? <Compose onSend={handleSendMessage} /> : ''}
		</div>
	)
}

export { MessageList }
