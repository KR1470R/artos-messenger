import { ApiClient } from '../network/ApiClient'

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
		console.error('Error in CreateChat:', err.response ? err.response.data : err.message)
		throw new Error('Failed to retrieve existing chat.')
	}
}

export { CreateChat }
