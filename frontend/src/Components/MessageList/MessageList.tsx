import { useEffect, useState } from 'react'
import { createMessage, subscribeToNewMessages } from '../../Services/socket'
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
	recipientId: string
}) => {
	const [messages, setMessages] = useState<IMessageType[]>([])

	useEffect(() => {
		subscribeToNewMessages((newMessage: IMessageType) => {
			setMessages(prevMessages => [...prevMessages, newMessage])
		})
	}, [])

	const handleSendMessage = (message: string) => {
		createMessage(parseInt(recipientId), message)
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
				title='Chat'
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
