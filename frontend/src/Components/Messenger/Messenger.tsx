import { useAuthStore } from '../../Store/useAuthStore'
import { Auth } from '../Auth/Auth'
import { ConversationList } from '../ConversationList/ConversationList'
import { MessageList } from '../MessageList/MessageList'
import './Messenger.css'

const Messenger = () => {
	const user = useAuthStore(state => state.user)

	return user ? (
		<div className='messenger'>
			<div className='scrollable sidebar'>
				<ConversationList />
			</div>
			<div className='scrollable content'>
				<MessageList currentUserId={user.id} recipientId='1' />
			</div>
		</div>
	) : (
		<Auth />
	)
}

export { Messenger }
