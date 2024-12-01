import React, { useEffect, useState } from 'react'
import shave from 'shave'
import { IConversationItem } from '../../Types/Components.interface'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem> = ({ data }) => {
	useEffect(() => {
		shave('.conversationSnippet', 20)
	}, [])
	const { username, avatar_url } = data
	const fallbackAvatar =
		'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'
	const [imageSrc, setImageSrc] = useState(avatar_url)
	const handleImageError = () => {
		setImageSrc(fallbackAvatar)
	}
	return (
		<div className='conversationListItem'>
			<img
				className='conversationPhoto'
				src={imageSrc}
				alt='conversation'
				onError={handleImageError}
			/>
			<div className='conversationInfo'>
				<h1 className='conversationTitle'>{username}</h1>
				{/* <p className='conversationSnippet'>{text}</p> */}
			</div>
		</div>
	)
}
export { ConversationListItem }
