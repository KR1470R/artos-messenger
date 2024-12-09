import { ApiClient } from '../ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const CreateChat = async (targetUserId: string): Promise<string> => {
	try {
		const response = await ApiClient.post(`${createChatsUrl}/${targetUserId}`)
		const chatId = response.data.id
		return chatId
	} catch (err: any) {
		if (err.response?.status === 409) {
			try {
				const existingChatResponse = await ApiClient.get(
					`${createChatsUrl}/${targetUserId}`,
				)
				const existingChatId = existingChatResponse.data.chat_id
				console.log('existingChatId', existingChatId)

				if (existingChatId) {
					return existingChatId
				} else {
					throw new Error('No valid existing chat ID found.')
				}
			} catch (fetchError: any) {
				console.error('Failed to retrieve existing chat:', fetchError.message)
				throw new Error('Failed to retrieve existing chat.')
			}
		} else {
			console.error('An unexpected error occurred:', err.message)
			throw new Error('Failed to create or retrieve chat.')
		}
	}
}

export { CreateChat }
