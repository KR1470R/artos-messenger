import { ConversationList } from '@/Components/Chats/ConversationList/ConversationList'
import { MessageList } from '@/Components/Chats/MessageList/MessageList'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { useSettingsStore } from '@/Store/useSettingsStore'
import { ScreenStack } from '@/UI/ScreenStack/ScreenStack'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import './Messenger.css'

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
const Auth = lazy(() =>
	import('../Auth/Auth').then(module => ({
		default: module.Auth,
	})),
)
const Messenger = React.memo(() => {
	const user = useAuthStore(state => state.user)
	const tabMain = useSettingsStore(state => state.tabMain)
	const { chatId } = useChatStore()
	const [activeMobileScreen, setActiveMobileScreen] = useState(0)
	const [renderMessageList, setRenderMessageList] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [forceUpdate, setForceUpdate] = useState(0)

	useEffect(() => {
		if (chatId) {
			setRenderMessageList(true)
			setActiveMobileScreen(1)
		} else {
			setRenderMessageList(false)
			setActiveMobileScreen(0)
		}
	}, [chatId])

	useEffect(() => {
		const update = () => setIsMobile(window.innerWidth < 768)
		update()
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])

	const handleOpenChat = () => {
		setRenderMessageList(true)
		setActiveMobileScreen(1)
		setForceUpdate(prev => prev + 1)
	}

	if (!user) {
		return (
			<Suspense fallback={<div>Loading...</div>}>
				<Auth />
			</Suspense>
		)
	}

	if (isMobile) {
		if (tabMain === 'chats') {
			return (
				<div className='messenger'>
					<ScreenStack
						activeIndex={activeMobileScreen}
						onBack={() => {
							setActiveMobileScreen(0)
							setRenderMessageList(false)
						}}
					>
						<ConversationList
							onSelectChat={handleOpenChat}
							key={`conversation-list-${forceUpdate}`}
						/>
						{renderMessageList && (
							<MessageList
								onBack={() => {
									setActiveMobileScreen(0)
									setRenderMessageList(false)
								}}
								key={`message-list-${chatId}`} 
							/>
						)}
					</ScreenStack>
				</div>
			)
		} else {
			return (
				<Suspense fallback={<div>Loading...</div>}>
					<div className='messenger'>
						<ScreenStack activeIndex={activeMobileScreen}>
							<SettingsList onSelectChat={() => setActiveMobileScreen(1)} />
							<SettingsContent onBack={() => setActiveMobileScreen(0)} />
						</ScreenStack>
					</div>
				</Suspense>
			)
		}
	}

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
})

export { Messenger }
