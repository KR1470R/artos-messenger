import { IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const createChatsUrl = import.meta.env.VITE_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable VITE_CHATS_ROUTE is not defined.')
}

const CreateChat = async (targetUserId: number) => {
	try {
		const response = await ApiClient.post(`${createChatsUrl}/${targetUserId}`)
		const chatId = response.data.id
		return chatId
	} catch (error) {
		const err = error as IResponseError
		console.error('Error in CreateChat:', err.message || 'Unknown error')
		throw new Error(`Error in CreateChat: ${err.message}`)
	}
}

export { CreateChat }
