import React, { useEffect, useState } from 'react'
import shave from 'shave'
import { IConversationItem } from '../../Types/Components.interface'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem> = ({ data, onClick }) => {
	useEffect(() => {
		shave('.conversationSnippet', 20)
	}, [])

	const { username, avatar_url } = data
	const fallbackAvatar = '/assets/fallbackAvatar.webp'

	const [imageSrc, setImageSrc] = useState(avatar_url)

	const handleImageError = () => {
		setImageSrc(fallbackAvatar)
	}

	const handleClick = () => {
		console.log(`User clicked: ${username} (ID: ${data.id})`)
		onClick()
	}

	return (
		<div className='conversationListItem' onClick={handleClick}>
			<img
				className='conversationPhoto'
				src={imageSrc}
				alt='conversation'
				onError={handleImageError}
			/>
			<div className='conversationInfo'>
				<h1 className='conversationTitle'>{username}</h1>
			</div>
		</div>
	)
}

export { ConversationListItem }
