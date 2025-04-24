import { ConversationList } from '@/Components/Chats/ConversationList/ConversationList'
import { MessageList } from '@/Components/Chats/MessageList/MessageList'
import { useChatStore } from '@/Store/useChatStore'
import { useSettingsStore } from '@/Store/useSettingsStore'
import { ScreenStack } from '@/UI/ScreenStack/ScreenStack'
import { lazy, useCallback, useEffect, useState } from 'react'
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

const MessengerMobile = () => {
	const { chatId } = useChatStore()
	const tabMain = useSettingsStore(state => state.tabMain)
	const setActiveParam = useSettingsStore(state => state.setActiveParam)

	const [activeScreen, setActiveScreen] = useState(0)

	useEffect(() => {
		if (chatId && tabMain === 'chats') {
			setActiveScreen(1)
		}
	}, [chatId, tabMain])

	const openChat = useCallback(() => {
		setActiveScreen(1)
	}, [])

	const openSettingsContent = useCallback(
		(param: 'profile' | 'themes') => {
			setActiveParam(param)
			setActiveScreen(1)
		},
		[setActiveParam],
	)

	const onBack = () => setActiveScreen(0)

	if (tabMain === 'chats') {
		return (
			<div className='messenger'>
				<ScreenStack activeIndex={activeScreen} onBack={onBack}>
					<ConversationList onSelectChat={openChat} />
					<MessageList onBack={onBack} />
				</ScreenStack>
			</div>
		)
	}

	return (
		<div className='messenger'>
			<ScreenStack activeIndex={activeScreen} onBack={onBack}>
				<SettingsList onSelectSetting={openSettingsContent} />
				<SettingsContent onBack={onBack} />
			</ScreenStack>
		</div>
	)
}
export { MessengerMobile }
