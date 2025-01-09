import { useMessageList } from '@/Hooks/useMessageList'
import moment from 'moment'
import { Message } from '../../UI/Message/Message'
import { Toolbar } from '../../UI/Toolbar/Toolbar'
import { ToolbarButton } from '../../UI/ToolbarButton/ToolbarButton'
import { Compose } from '../Compose/Compose'
import './MessageList.css'

const MessageList = () => {
	const { selectedUser, messages, handleSend, user, containerRef } = useMessageList()
	let previousDate: string | null = null

	return (
		<div className='messageList'>
			<Toolbar
				title={`Chat with ${selectedUser?.username || '...'}`}
				leftItems={[]}
				rightItems={[
					<ToolbarButton key='info' icon='ion-ios-information-circle-outline' />,
				]}
			/>
			<div className='messageListContainer' ref={containerRef}>
				{messages.map(msg => {
					const currentDate = moment(msg.created_at).format('YYYY-MM-DD')
					const showDate = currentDate !== previousDate
					previousDate = currentDate
					return (
						<Message
							key={msg.id}
							data={msg}
							isMine={msg.initiator_id === user?.id || msg.sender_id === user?.id}
							showDate={showDate}
						/>
					)
				})}
			</div>
			<Compose onSend={handleSend} />
		</div>
	)
}

export { MessageList }
