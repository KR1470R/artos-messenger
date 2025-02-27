import { IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const deleteChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!deleteChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}
const DeleteChat = async (chatId: number) => {
	try {
		await ApiClient.delete(`${deleteChatsUrl}/${chatId}`)
	} catch (error) {
		console.log(error)
		const err = error as IResponseError
		console.error('Error in delete chat:', err.message || 'Unknown error')
		throw new Error(`Error in delete chat: ${err.message}`)
	}
}

export { DeleteChat }
