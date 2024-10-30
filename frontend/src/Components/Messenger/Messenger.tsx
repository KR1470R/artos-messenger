import { ConversationList } from '../ConversationList/ConversationList'
import { MessageList } from '../MessageList/MessageList'
import './Messenger.css'

const Messenger = () => {
	return (
		<div className='messenger'>
			<div className='scrollable sidebar'>
				<ConversationList />
			</div>

			<div className='scrollable content'>
				<MessageList />
			</div>
		</div>
	)
}
export { Messenger }
