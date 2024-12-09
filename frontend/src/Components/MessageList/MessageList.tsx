import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { IMessageType } from '@/Types/Messages.interface'
import { useEffect, useState } from 'react'
import {
	connectSocket,
	createMessage,
	disconnectSocket,
	joinChat,
	leaveChatSocket,
	subscribeToNewMessages,
} from '../../Services/socket'
import { Compose } from '../Compose/Compose'
import { Message } from '../Message/Message'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './MessageList.css'

const MessageList = () => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const { selectedUser } = useChatStore()
	const { user } = useAuthStore()

	useEffect(() => {
		connectSocket()

		if (!selectedUser) return

		const setupChat = async () => {
			try {
				joinChat(selectedUser.id)
			} catch (err: any) {
				console.error('Failed to set up chat:', err.message)
			}
		}

		setupChat()
		subscribeToNewMessages((newMessage: IMessageType) => {
			setMessages(prevMessages => [...prevMessages, newMessage])
		})

		return () => {
			leaveChatSocket(selectedUser.id)
			disconnectSocket()
		}
	}, [selectedUser])

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedUser) return
		createMessage(selectedUser.id, message)
		setMessages(prevMessages => [
			...prevMessages,
			{
				id: Date.now().toString(),
				author: user?.id,
				message,
				timestamp: new Date().getTime(),
			},
		])
	}

	return (
		<div className='messageList'>
			<Toolbar
				title={`Chat with ${selectedUser?.username || '...'}`}
				leftItems={[]}
				rightItems={[
					<ToolbarButton key='info' icon='ion-ios-information-circle-outline' />,
				]}
			/>

			<div className='messageListContainer'>
				{messages.map((msg, index) => (
					<Message key={index} data={msg} isMine={msg.author === user?.id} />
				))}
			</div>
			{selectedUser?.id ? <Compose onSend={handleSendMessage} /> : ''}
		</div>
	)
}

export { MessageList }
