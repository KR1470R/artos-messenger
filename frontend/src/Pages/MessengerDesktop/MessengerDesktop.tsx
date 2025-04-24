import { ConversationList } from '@/Components/Chats/ConversationList/ConversationList'
import { MessageList } from '@/Components/Chats/MessageList/MessageList'
import { useSettingsStore } from '@/Store/useSettingsStore'
import { lazy, Suspense } from 'react'
import '../Messenger/Messenger.css'


const SettingsList = lazy(() =>
	import('@/Components/Settings/SettingsList/SettingsList').then(module => ({
		default: module.SettingsList,
	})),
)
const SettingsContent = lazy(() =>
	import('@/Components/Settings/SettingsContent/SettingsContent').then(module => ({
		default: module.SettingsContent,
	})),
)

const MessengerDesktop = () => {
	const tabMain = useSettingsStore(state => state.tabMain)

	return (
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
				<Suspense fallback={<div>Loading...</div>}>
					<div className='scrollable sidebar'>
						<SettingsList />
					</div>
					<div className='scrollable content'>
						<SettingsContent />
					</div>
				</Suspense>
			)}
		</div>
	)
}

export { MessengerDesktop }
