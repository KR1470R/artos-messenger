import { IConversationItem } from '@/types/Components.interface'
import React, { useEffect } from 'react'
import './ConversationListItem.css'

const truncateText = (selector: string, maxHeight: number) => {
	const elements = document.querySelectorAll(selector)

	elements.forEach(element => {
		const htmlElement = element as HTMLElement
		let text = htmlElement.textContent || ''
		let truncatedText = text
		htmlElement.textContent = text
		htmlElement.style.overflow = 'hidden'
		htmlElement.style.whiteSpace = 'nowrap'

		while (element.scrollHeight > maxHeight && truncatedText.length > 0) {
			truncatedText = truncatedText.slice(0, -1)
			element.textContent = truncatedText + '...'
		}
	})
}

const ConversationListItem: React.FC<IConversationItem> = ({ data }) => {
	useEffect(() => {
		truncateText('.conversationSnippet', 20)
	})

	const { photo, name, text } = data
	return (
		<div className='conversationListItem'>
			<img className='conversationPhoto' src={photo} alt='conversation' />
			<div className='conversationInfo'>
				<h1 className='conversationTitle'>{name}</h1>
				<p className='conversationSnippet'>{text}</p>
			</div>
		</div>
	)
}
export { ConversationListItem }
