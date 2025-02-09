import { DeleteChat } from '@/Services/chats/DeleteChat.service'
import { IMessageType } from '@/Types/Messages.interface'
import { IChat, IUserAll } from '@/Types/Services.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useMessageList } from './useMessageList'

const useContextMenu = (data: IMessageType | IChat | IUserAll) => {
	const { deleteMessage, updateMessages } = useMessageList()
	const queryClient = useQueryClient()
	const [isEditing, setIsEditing] = useState(false)
	const [editedContent, setEditedContent] = useState(
		'content' in data ? data.content || '' : '',
	)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const deleteChatMutation = useMutation({
		mutationFn: async (chatId: number) => DeleteChat(chatId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chats'] }),
	})

	const handleCopyMessage = async () => {
		if ('content' in data && data.content) {
			try {
				await navigator.clipboard.writeText(data.content)
			} catch (error: unknown) {
				console.error(error)
			}
		}
	}

	const handleDeleteMessages = () => {
		if ('content' in data) deleteMessage(data)
	}

	const handleUpdateMessages = (newContent: string) => {
		if ('content' in data && data.content)
			updateMessages({ ...data, content: newContent })
	}

	const deleteChat = () => {
		if ('id' in data) {
			deleteChatMutation.mutate(data.id)
		}
	}

	const startEditing = (isMine: boolean) => {
		if (isMine && 'content' in data) {
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
		if ('content' in data) {
			const trimmedContent = editedContent.trimEnd()
			if (trimmedContent && trimmedContent !== data.content?.trimEnd())
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
		if (isEditing) resizeTextarea()
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
		deleteChat,
	}
}

export { useContextMenu }
