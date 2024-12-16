import { ApiClient } from '../ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const CreateChat = async (targetUserId: number) => {
	try {
		const response = await ApiClient.post(`${createChatsUrl}/${targetUserId}`)
		const chatId = response.data.id
		return chatId
	} catch (err: any) {
		if (err.response?.status === 409) {
			console.warn('Chat already exists. Fetching existing chat...')
			try {
				const existingChatResponse = await ApiClient.get(
					`${createChatsUrl}/${targetUserId}`,
				)
				console.log('Retrieved existing chat ID:', existingChatResponse.data.chat_id)
				return existingChatResponse.data.chat_id
			} catch (fetchError: any) {
				console.error('Failed to retrieve existing chat:', fetchError.message)
				throw new Error('Failed to retrieve existing chat.')
			}
		}
	}
}
export { CreateChat }
