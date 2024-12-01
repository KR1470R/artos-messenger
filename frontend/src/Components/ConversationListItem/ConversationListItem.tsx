import React, { useEffect } from 'react'
import shave from 'shave'
import { IConversationItem } from '../../Types/Components.interface'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem> = ({ data }) => {
	useEffect(() => {
		shave('.conversationSnippet', 20)
	}, [])

	const { username, avatar_url } = data
	return (
		<div className='conversationListItem'>
			<img className='conversationPhoto' src={avatar_url} alt='conversation' />
			<div className='conversationInfo'>
				<h1 className='conversationTitle'>{username}</h1>
				{/* <p className='conversationSnippet'>{text}</p> */}
			</div>
		</div>
	)
}
export { ConversationListItem }
