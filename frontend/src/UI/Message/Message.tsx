import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import React, { useState } from 'react'
import { FaEdit, FaRegCopy } from 'react-icons/fa'
import { FaRegTrashCan } from 'react-icons/fa6'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import './Message.css'

const Message: React.FC<IMessageProps> = ({ data, isMine, showDate }) => {
	const [contextMenu, setContextMenu] = useState<{
		visible: boolean
		x: number
		y: number
	}>({
		visible: false,
		x: 0,
		y: 0,
	})

	const today = moment().startOf('day')
	const messageDate = moment(data.created_at)
	const isToday = messageDate.isSame(today, 'day')
	const isDifferentYear = !messageDate.isSame(today, 'year')
	const displayDate = isToday
		? 'Today'
		: isDifferentYear
		? messageDate.format('D MMMM, YYYY')
		: messageDate.format('D MMMM')

	const messageTime = messageDate.format('HH:mm')

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault()
		const container = e.currentTarget.closest('.messageList') as HTMLElement
		const containerRect = container?.getBoundingClientRect()
		let x = e.clientX - (containerRect?.left || 0)
		let y = e.clientY - (containerRect?.top || 0)

		const menuWidth = 150
		const menuHeight = 50
		const cursorOffset = 3
		if (e.clientX + menuWidth > window.innerWidth) x -= menuWidth + cursorOffset
		else x += cursorOffset
		if (e.clientY + menuHeight > window.innerHeight) y -= menuHeight + cursorOffset
		else y += cursorOffset

		x = Math.max(0, x)
		y = Math.max(0, y)
		setContextMenu({
			visible: true,
			x,
			y,
		})
	}

	const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0 })

	const menuItems = [
		{
			type: 'action',
			icon: <FaEdit />,
			text: 'Edit',
			onClick: () => console.log(data),
		},
		{
			type: 'action',
			icon: <FaRegCopy />,
			text: 'Copy Text',
			onClick: () => console.log(data),
		},
		{
			type: 'divider',
		},
		{
			type: 'action',
			icon: <FaRegTrashCan />,
			text: 'Delete',
			onClick: () => console.log(data),
			className: 'menuItemDelete',
		},
	]

	return (
		<>
			<div
				className={['message', isMine ? 'mine' : ''].join(' ')}
				data-id={data.id}
				onContextMenu={handleContextMenu}
			>
				{showDate && (
					<div className='timestamp'>
						<div>{displayDate}</div>
					</div>
				)}
				<div className='bubbleContainer'>
					<div className='bubble' title={`${messageDate.format('HH:mm D MMMM, YYYY')}`}>
						<span className='bubbleMessageContent'>{data.content}</span>
						<span className='messageTime'>
							{messageTime}
							{isMine && (
								<span className='messageStatus'>
									{data.is_read ? <IoCheckmarkDone /> : <IoCheckmark />}
								</span>
							)}
						</span>
					</div>
				</div>
			</div>

			<ContextMenu
				visible={contextMenu.visible}
				x={contextMenu.x}
				y={contextMenu.y}
				onClose={closeContextMenu}
				items={menuItems}
			/>
		</>
	)
}

export { Message }
