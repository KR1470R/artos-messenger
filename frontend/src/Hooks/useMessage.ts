import { useContextMenu } from '@/Hooks/useContextMenu'
import { IMessageProps } from '@/Types/Messages.interface'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
const useMessage = ({ data, isMine, showDate }: IMessageProps) => {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 })
	const [isEditing, setIsEditing] = useState(false)
	const [editedContent, setEditedContent] = useState(data.content)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { handleUpdateMessages } = useContextMenu(data)

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
		const menuHeight = 100
		if (e.clientX + menuWidth > window.innerWidth) x -= menuWidth + 5
		if (e.clientY + menuHeight > window.innerHeight) y -= menuHeight + 5

		setContextMenu({ visible: true, x, y })
	}
	const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0 })

	const startEditing = () => {
		if (isMine) {
			setIsEditing(true)
			setTimeout(() => {
				if (textareaRef.current) {
					const length = textareaRef.current.value.length
					textareaRef.current.setSelectionRange(length, length)
					textareaRef.current.focus()
				}
			}, 0)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedContent(e.target.value)
		resizeTextarea()
	}

	const finishEditing = () => {
		const trimmedContent = editedContent.trimEnd()
		if (trimmedContent && trimmedContent !== data.content.trimEnd()) {
			handleUpdateMessages(trimmedContent)
		}
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			finishEditing()
		}
	}

	const resizeTextarea = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = '20px'
			textareaRef.current.style.width = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
			textareaRef.current.style.maxWidth = '100%'
		}
	}

	useEffect(() => {
		if (isEditing) {
			resizeTextarea()
		}
	}, [isEditing])

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
