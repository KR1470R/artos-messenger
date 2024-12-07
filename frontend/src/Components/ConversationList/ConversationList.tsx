import React from 'react'
import { useSideUsers } from '../../Hooks/useSideUsers'
import { joinChat } from '../../Services/socket'
import { CreateChat } from '../../Services/users/CreateChat.service'
import { useChatStore } from '../../Store/useChatStore'
import { Tabs } from '../../UI/Tabs/Tabs'
import { ConversationListItem } from '../ConversationListItem/ConversationListItem'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const { activeTab, setActiveTab, getRenderContent, isLoading } = useSideUsers()
	const { setSelectedUser } = useChatStore()

	const handleItemClick = async (user: { id: number; username: string }) => {
		setSelectedUser(user)
		try {
			const chatId = await CreateChat(user.id)
			joinChat(chatId)
			console.log('приєднано до чату')
		} catch (error: any) {
			console.error('Не вдалося приєднатися до чату:', error.message)
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
							onClick={() =>
								handleItemClick({ id: Number(item.id), username: item.username })
							}
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
