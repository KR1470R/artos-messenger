import { useEffect, useState } from 'react'
import {
	connectSocket,
	createMessage,
	disconnectSocket,
	joinChat,
	leaveChatSocket,
	subscribeToNewMessages,
} from '../../Services/socket'
import { CreateChat } from '../../Services/users/CreateChat.service'
import { useChatStore } from '../../Store/useChatStore'
import { IMessageType } from '../../Types/Messages.interface'
import { Compose } from '../Compose/Compose'
import { Message } from '../Message/Message'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './MessageList.css'

const MessageList = ({
	currentUserId,
	recipientId,
}: {
	currentUserId: string
	recipientId: number
}) => {
	const [messages, setMessages] = useState<IMessageType[]>([])
	const { selectedUser, setSelectedUser } = useChatStore()

	useEffect(() => {
		console.log('Connecting socket...')
		connectSocket()
		if (!recipientId || recipientId !== selectedUser?.id) return

		const setupChat = async () => {
			try {
				const chatId = await CreateChat(recipientId)
				setSelectedUser({
					id: recipientId,
					username: selectedUser?.username || '',
				})
				connectSocket()
				joinChat(chatId)
				console.log(`Successfully joined chat with ID: ${chatId}`)
			} catch (err: any) {
				console.error('Failed to set up chat:', err.message)
			}
		}

		setupChat()

		return () => {
			if (selectedUser?.id) {
				leaveChatSocket(selectedUser.id)
			}
			disconnectSocket()
		}
	}, [recipientId, selectedUser?.id])

	useEffect(() => {
		subscribeToNewMessages((newMessage: IMessageType) => {
			setMessages(prevMessages => [...prevMessages, newMessage])
		})
	}, [])

	const handleSendMessage = (message: string) => {
		if (!message.trim() || !selectedUser?.id) return
		createMessage(selectedUser.id, message)
		setMessages(prevMessages => [
			...prevMessages,
			{
				id: Date.now(),
				author: currentUserId,
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
					<Message key={index} data={msg} isMine={msg.author === currentUserId} />
				))}
			</div>

			<Compose
				rightItems={[
					<ToolbarButton
						key='send'
						icon='ion-ios-send'
						onClick={() => handleSendMessage('Your message')}
					/>,
				]}
			/>
		</div>
	)
}

export { MessageList }
