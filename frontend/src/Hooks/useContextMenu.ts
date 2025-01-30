import { IMessageType } from '@/Types/Messages.interface'

const useContextMenu = (data: IMessageType) => {
	const handleCopyText = async () => {
		try {
			await navigator.clipboard.writeText(data.content)
		} catch (error: any) {
			console.error(error)
		}
	}
	return { handleCopyText }
}
export { useContextMenu }
