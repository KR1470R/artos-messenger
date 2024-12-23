import { useMessageList } from '@/Hooks/useMessageList'
import { Message } from '../../UI/Message/Message'
import { Toolbar } from '../../UI/Toolbar/Toolbar'
import { ToolbarButton } from '../../UI/ToolbarButton/ToolbarButton'
import { Compose } from '../Compose/Compose'
import './MessageList.css'

const MessageList = () => {
	const { selectedUser, messages, handleSendMessage, user } = useMessageList()

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
				{messages.map(msg => (
					<Message
						key={msg.id}
						data={msg}
						isMine={msg.initiator_id === user?.id || msg.sender_id === user?.id}
					/>
				))}
			</div>
			<Compose onSend={handleSendMessage} />
		</div>
	)
}

export { MessageList }
