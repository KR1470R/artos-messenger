import { useConversationList } from '@/Hooks/useConversationList'
import { ConversationListItem } from '@/UI/ConversationListItem/ConversationListItem'
import { Tabs } from '@/UI/Tabs/Tabs'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import React from 'react'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const { activeTab, setActiveTab, getRenderContent, isLoading, handleItemClick } =
		useConversationList()

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
