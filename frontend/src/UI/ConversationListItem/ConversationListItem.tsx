import { IConversationItem } from '@/Types/Components.interface'
import React, { useEffect, useState } from 'react'
import shave from 'shave'
import { IChat, IUserAll } from '../../Types/Services.interface'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem & { isActive: boolean }> = ({
	data,
	onClick,
	isActive,
}) => {
	useEffect(() => {
		shave('.conversationSnippet', 20)
	}, [])

	const isUserAll = (item: IUserAll | IChat): item is IUserAll => {
		return (item as IUserAll).username !== undefined
	}

	const fallbackAvatar = '/assets/fallbackAvatar.webp'

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
			</div>
		</div>
	)
}

export { ConversationListItem }
