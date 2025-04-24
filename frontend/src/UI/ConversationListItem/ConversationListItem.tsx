import { useContextMenu } from '@/Hooks/useContextMenu'
import { IConversationItem } from '@/Types/Components.interface'
import React, { useState } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'
import { IChat, IUserAll } from '../../Types/Services.interface'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import { WarningModal } from '../WarningModal/WarningModal'
import './ConversationListItem.css'

const ConversationListItem: React.FC<IConversationItem> = ({
	data,
	onClick,
	isActive,
	lastMessage,
	activeTab,
}) => {
	const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0 })
	const { deleteChat } = useContextMenu(data)
	const isUserAll = (item: IUserAll | IChat): item is IUserAll => {
		return (item as IUserAll).username !== undefined
	}
	const shortenText = (text: string, maxLength: number = 35): string =>
		text.length > maxLength ? text.slice(0, maxLength) + '...' : text
	const shortenedMessage = shortenText(lastMessage || ' ')
	const fallbackAvatar =
		'https://github.com/KR1470R/artos-messenger/blob/main/assets/fallbackAvatar.png?raw=true'
	const [imageSrc, setImageSrc] = useState(
		isUserAll(data) ? data.avatar_url : fallbackAvatar,
	)
	const handleImageError = () => setImageSrc(fallbackAvatar)
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
	const [warningOpen, setWarningOpen] = useState(false)

	const handleContextMenu = (e: React.MouseEvent) => {
		if (activeTab !== 'messages') return
		e.preventDefault()
		const container = e.currentTarget.closest('.conversationList') as HTMLElement
		const containerRect = container?.getBoundingClientRect()
		const menuWidth = 150
		const menuHeight = 100
		let x = e.clientX - (containerRect?.left || 0)
		let y = e.clientY - (containerRect?.top || 0)
		const fitsRight = x + menuWidth < containerRect.width
		const fitsBelow = y + menuHeight < containerRect.height
		if (!fitsRight) x -= menuWidth
		if (!fitsBelow) y -= menuHeight
		setContextMenu({ visible: true, x, y })
	}
	const confirmDeleteChat = () => {
		deleteChat()
		setWarningOpen(false)
	}
	const menuItems = [
		{
			type: 'action',
			icon: <FaRegTrashCan />,
			text: 'Delete Chat',
			onClick: () => setWarningOpen(true),
			className: 'menuItemDelete',
		},
	]
	return (
		<>
			<div
				className={`conversationListItem ${isActive ? 'active' : ''}`}
				onClick={onClick}
				onContextMenu={handleContextMenu}
			>
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
			<ContextMenu
				visible={contextMenu.visible}
				x={contextMenu.x}
				y={contextMenu.y}
				onClose={closeContextMenu}
				items={menuItems}
			/>
			<WarningModal
				open={warningOpen}
				onClose={() => setWarningOpen(false)}
				onConfirm={confirmDeleteChat}
				message='Are you sure you want to delete the chat?'
				confirmText='Delete'
				cancelText='Cancel'
				title='Artos Messenger'
			/>
		</>
	)
}

export { ConversationListItem }
