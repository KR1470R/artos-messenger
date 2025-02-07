import { IConversationItem } from '@/Types/Components.interface'
import React, { useState } from 'react'
import { IChat, IUserAll } from '../../Types/Services.interface'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem> = ({
	data,
	onClick,
	isActive,
	lastMessage,
}) => {
	const isUserAll = (item: IUserAll | IChat): item is IUserAll => {
		return (item as IUserAll).username !== undefined
	}
	const shortenText = (text: string, maxLength: number = 35): string => {
		if (text.length > maxLength) return text.slice(0, maxLength) + '...'
		return text
	}
	const shortenedMessage = shortenText(lastMessage || ' ')

	const fallbackAvatar =
		'https://github.com/KR1470R/artos-messenger/blob/main/assets/fallbackAvatar.png?raw=true'

	const [imageSrc, setImageSrc] = useState(
		isUserAll(data) ? data.avatar_url : fallbackAvatar,
	)

	const handleImageError = () => {
		setImageSrc(fallbackAvatar)
	}

	return (
		<div className={`conversationListItem ${isActive ? 'active' : ''}`} onClick={onClick}>
			<img
				className='conversationPhoto'
				src={imageSrc}
				alt='conversation'
				onError={handleImageError}
			/>
			<div className='conversationInfo'>
				<h1 className='conversationTitle'>
					{isUserAll(data) ? data.username : `Chat #${data.id}`}
				</h1>
				<p className='conversationSnippet'>{shortenedMessage}</p>
			</div>
		</div>
	)
}

export { ConversationListItem }
