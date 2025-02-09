import { useContextMenu } from '@/Hooks/useContextMenu'
import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import React, { useState } from 'react'

const useMessage = ({ data }: IMessageProps) => {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
	const {
		startEditing,
		handleInputChange,
		finishEditing,
		handleKeyDown,
		isEditing,
		editedContent,
		textareaRef,
	} = useContextMenu(data)

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

	const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0 })

	return {
		handleContextMenu,
		displayDate,
		isEditing,
		messageDate,
		textareaRef,
		editedContent,
		handleInputChange,
		finishEditing,
		handleKeyDown,
		messageTime,
		contextMenu,
		closeContextMenu,
		startEditing,
	}
}

export { useMessage }
