import { IMessageType } from '@/Types/Messages.interface'
import { useMessageList } from './useMessageList'

const useContextMenu = (data: IMessageType) => {
	const { deleteMessage } = useMessageList()
	const handleCopyMessage = async () => {
		try {
			await navigator.clipboard.writeText(data.content)
		} catch (error: any) {
			console.error(error)
		}
	}
	const handleDeleteMessages = () => {
		deleteMessage(data)
	}
	return { handleCopyMessage, handleDeleteMessages }
}
export { useContextMenu }
