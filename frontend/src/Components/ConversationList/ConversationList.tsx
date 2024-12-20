import { useConversationList } from '@/Hooks/useConversationList'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { ConversationListItem } from '@/UI/ConversationListItem/ConversationListItem'
import { Tabs } from '@/UI/Tabs/Tabs'
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

	const renderContent = getRenderContent()

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
				<div className='loading'>Loading...</div>
			) : (
				<div className='content'>
					{activeTab === 'messages'
						? (renderContent as IChat[]).map(item => (
								<ConversationListItem
									key={item.id}
									data={item}
									onClick={() => handleItemClickChats(item.id)}
								/>
						  ))
						: (renderContent as IUserAll[]).map(item => (
								<ConversationListItem
									key={item.id}
									data={item}
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
