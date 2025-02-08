import { IMessageType } from '@/Types/Messages.interface'
import { useEffect, useRef, useState } from 'react'
import { useMessageList } from './useMessageList'

const useContextMenu = (data: IMessageType, isMine: boolean) => {
	const { deleteMessage, updateMessages } = useMessageList()
	const [isEditing, setIsEditing] = useState(false)
	const [editedContent, setEditedContent] = useState(data.content)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleCopyMessage = async () => {
		try {
			await navigator.clipboard.writeText(data.content)
		} catch (error: unknown) {
			console.error(error)
		}
	}

	const handleDeleteMessages = () => {
		deleteMessage(data)
	}

	const handleUpdateMessages = (newContent: string) => {
		updateMessages({ ...data, content: newContent })
	}

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
		handleCopyMessage,
		handleDeleteMessages,
		handleUpdateMessages,
		startEditing,
		handleInputChange,
		finishEditing,
		handleKeyDown,
		isEditing,
		editedContent,
		textareaRef,
	}
}

export { useContextMenu }
