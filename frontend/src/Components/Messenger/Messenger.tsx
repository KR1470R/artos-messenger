import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { Auth } from '../Auth/Auth'
import { ConversationList } from '../ConversationList/ConversationList'
import { MessageList } from '../MessageList/MessageList'
import { SettingsContent } from '../SettingsContent/SettingsContent'
import { SettingsList } from '../SettingsList/SettingsList'
import './Messenger.css'

const Messenger = () => {
	const user = useAuthStore(state => state.user)
	const tabMain = useChatStore(state => state.tabMain)

	return user ? (
		<div className='messenger'>
			{tabMain === 'chats' ? (
				<>
					<div className='scrollable sidebar'>
						<ConversationList />
					</div>
					<div className='scrollable content'>
						<MessageList />
					</div>
				</>
			) : (
				<>
					<div className='scrollable sidebar'>
						<SettingsList />
					</div>
					<div className='scrollable content'>
						<SettingsContent />
					</div>
				</>
			)}
		</div>
	) : (
		<Auth />
	)
}

export { Messenger }
