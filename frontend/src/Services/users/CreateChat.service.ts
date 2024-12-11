import { ApiClient } from '../ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const CreateChat = async (targetUserId: number): Promise<number> => {
	try {
		const response = await ApiClient.post(`${createChatsUrl}/${targetUserId}`)
		const chatId = response.data.id
		return chatId
	} catch (err: any) {
		console.log('Attempting to create chat with user:', targetUserId)
		try {
			const response = await ApiClient.post(`${createChatsUrl}/${targetUserId}`)
			console.log('Chat created successfully:', response.data)
			return response.data.id
		} catch (innerError: any) {
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
			console.error('Failed to create chat:', innerError.message)
			throw new Error('Failed to create chat after retrying.')
		}
	}
}

export { CreateChat }
