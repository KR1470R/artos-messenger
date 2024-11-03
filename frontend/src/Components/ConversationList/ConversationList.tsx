import { IConversation } from '@/types/Messages.interface'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ConversationListItem } from '../ConversationListItem/ConversationListItem'
import { ConversationSearch } from '../ConversationSearch/ConversationSearch'
import { Toolbar } from '../Toolbar/Toolbar'
import { ToolbarButton } from '../ToolbarButton/ToolbarButton'
import './ConversationList.css'

const ConversationList: React.FC = () => {
	const [conversations, setConversations] = useState<IConversation[]>([])

	useEffect(() => {
		getConversations()
	}, [])

	const getConversations = async () => {
		try {
			const response = await axios.get('https://randomuser.me/api/?results=20')
			const newConversations = response.data.results.map((result: any) => ({
				photo: result.picture.large,
				name: `${result.name.first} ${result.name.last}`,
				text: 'Hello world! This is a long message that needs to be truncated.',
			}))
			setConversations(newConversations)
		} catch (error) {
			console.error('Error fetching conversations', error)
		}
	}

	return (
		<div className='conversationList'>
			<Toolbar
				title='Messenger'
				leftItems={[<ToolbarButton key='cog' icon='ion-ios-cog' />]}
				rightItems={[<ToolbarButton key='add' icon='ion-ios-add-circle-outline' />]}
			/>
			<ConversationSearch />
			{conversations.map(conversation => (
				<ConversationListItem key={conversation.name} data={conversation} />
			))}
		</div>
	)
}

export { ConversationList }
