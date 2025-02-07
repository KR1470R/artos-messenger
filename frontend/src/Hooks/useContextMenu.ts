import { IMessageType } from '@/Types/Messages.interface'
import { useMessageList } from './useMessageList'

const useContextMenu = (data: IMessageType) => {
	const { deleteMessage, updateMessages } = useMessageList()

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

	return { handleCopyMessage, handleDeleteMessages, handleUpdateMessages }
}

export { useContextMenu }
