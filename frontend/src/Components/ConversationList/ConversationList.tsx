import { useConversationList } from '@/Hooks/useConversationUsers'
import { IChat, IUserAll } from '@/Types/Services.interface'
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
	
	// Логування контенту
	console.log('Render Content:', getRenderContent())

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
			) : (
				<div className='content'>
					{/* Якщо активна вкладка 'messages', виводимо чати */}
					{activeTab === 'messages' ? (
						(getRenderContent() as IChat[]).map(item => (
							<ConversationListItem
								key={item.id}
								data={item}
								onClick={() => console.log('Chat selected:', item.id)}
							/>
						))
					) : (
						(getRenderContent() as IUserAll[]).map(item => (
							<ConversationListItem
								key={item.id}
								data={item}
								onClick={() =>
									handleItemClick({ id: item.id, username: item.username })
								}
							/>
						))
					)}
				</div>
			)}
		</div>
	)
}

export { ConversationList }
