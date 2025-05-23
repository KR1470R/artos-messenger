import { useConversationList } from '@/Hooks/useConversationList'
import { useChatStore } from '@/Store/useChatStore'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { ConversationListItem } from '@/UI/ConversationListItem/ConversationListItem'
import { TabsChat } from '@/UI/TabsChat/TabsChat'
import { TabsMain } from '@/UI/TabsMain/TabsMain'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import React from 'react'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import './ConversationList.css'

const ConversationList: React.FC<{ onSelectChat?: () => void }> = React.memo(
	({ onSelectChat }) => {
		const {
			activeTab,
			setActiveTab,
			renderContent,
			isLoading,
			handleItemClickUsers,
			handleItemClickChats,
			lastMessages,
		} = useConversationList()
		const { chatId, selectedUser } = useChatStore()
		return (
			<div className='conversationList'>
				<Toolbar
					title='Artos Messenger'
					leftItems={[]}
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
										activeTab={activeTab}
										lastMessage={lastMessages[item.id]}
										onClick={() => {
											handleItemClickChats(item.id)
											onSelectChat?.()
										}}
									/>
							  ))
							: (renderContent as IUserAll[]).map(item => (
									<ConversationListItem
										key={item.id}
										data={item}
										activeTab={activeTab}
										isActive={selectedUser?.id === item.id}
										onClick={() => {
											handleItemClickUsers({ id: item.id, username: item.username })
											onSelectChat?.()
										}}
									/>
							  ))}
					</div>
				)}
				<TabsMain />
			</div>
		)
	},
)

export { ConversationList }
