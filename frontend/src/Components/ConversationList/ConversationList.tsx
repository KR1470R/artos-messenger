import { useSideUsers } from '@/Hooks/useSideUsers'
import { joinChat } from '@/Services/socket'
import { CreateChat } from '@/Services/users/CreateChat.service'
import { useAuthStore } from '@/Store/useAuthStore'
import { useChatStore } from '@/Store/useChatStore'
import { ConversationListItem } from '@/UI/ConversationListItem/ConversationListItem'
import { Tabs } from '@/UI/Tabs/Tabs'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import React from 'react'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const { activeTab, setActiveTab, getRenderContent, isLoading } = useSideUsers()
	const { setSelectedUser, setChatId } = useChatStore()
	const { user } = useAuthStore()

	const handleItemClick = async (userSelect: { id: number; username: string }) => {
		console.log('Selecting user:', userSelect.username)
		setSelectedUser(userSelect)
		try {
			const chatId = await CreateChat(userSelect.id)
			console.log('Joining chat with ID:', chatId)
			setChatId(chatId)
			if (!user) return
			joinChat(chatId, user.id)
		} catch (error: any) {
			console.error('Failed to join chat:', error.message)
		}
	}

	return (
		<div className='conversationList'>
			<Toolbar
				title='Artos Messenger'
				leftItems={[<ToolbarButton key='cog' icon='ion-ios-cog' />]}
				rightItems={[<ToolbarButton key='add' icon='ion-ios-add-circle-outline' />]}
			/>
			<ConversationSearch />
			<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
			{isLoading ? (
				<div>Loading...</div>
			) : activeTab === 'users' ? (
				<div className='content'>
					{getRenderContent().map(item => (
						<ConversationListItem
							key={item.id}
							data={item}
							onClick={() => handleItemClick({ id: item.id, username: item.username })}
						/>
					))}
				</div>
			) : (
				<div>Messages tab content</div>
			)}
		</div>
	)
}

export { ConversationList }
