import { useConversationList } from '@/Hooks/useConversationList'
import { useChatStore } from '@/Store/useChatStore'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { ConversationListItem } from '@/UI/ConversationListItem/ConversationListItem'
import { TabsChat } from '@/UI/TabsChat/TabsChat'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import React from 'react'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const {
		activeTab,
		setActiveTab,
		getRenderContent,
		isLoading,
		handleItemClickUsers,
		handleItemClickChats,
	} = useConversationList()

	const { chatId, selectedUser } = useChatStore()
	const renderContent = getRenderContent()

	return (
		<div className='conversationList'>
			<Toolbar
				title='Artos Messenger'
				leftItems={[<ToolbarButton key='cog' icon='ion-ios-cog' />]}
				rightItems={[<ToolbarButton key='add' icon='ion-ios-add-circle-outline' />]}
			/>
			<ConversationSearch />
			<TabsChat activeTab={activeTab} setActiveTab={setActiveTab} />

			{isLoading ? (
				<div className='loading'>Loading...</div>
			) : (
				<div className='content'>
					{activeTab === 'messages'
						? (renderContent as IChat[]).map(item => (
								<ConversationListItem
									key={item.id}
									data={item}
									isActive={chatId === item.id}
									onClick={() => handleItemClickChats(item.id)}
								/>
						  ))
						: (renderContent as IUserAll[]).map(item => (
								<ConversationListItem
									key={item.id}
									data={item}
									isActive={selectedUser?.id === item.id}
									onClick={() =>
										handleItemClickUsers({ id: item.id, username: item.username })
									}
								/>
						  ))}
				</div>
			)}
		</div>
	)
}

export { ConversationList }
