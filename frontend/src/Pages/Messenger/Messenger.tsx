import { ConversationList } from '@/Components/Chats/ConversationList/ConversationList'
import { MessageList } from '@/Components/Chats/MessageList/MessageList'
import { SettingsContent } from '@/Components/Settings/SettingsContent/SettingsContent'
import { SettingsList } from '@/Components/Settings/SettingsList/SettingsList'
import { useAuthStore } from '@/Store/useAuthStore'
import { useSettingsStore } from '@/Store/useSettingsStore'
import { Auth } from '../Auth/Auth'
import './Messenger.css'

const Messenger = () => {
	const user = useAuthStore(state => state.user)
	const tabMain = useSettingsStore(state => state.tabMain)

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
