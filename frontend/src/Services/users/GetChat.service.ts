import { ApiClient } from '../ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const GetChat = async (id: number) => {
	try {
		const response = await ApiClient.get(`${createChatsUrl}/${id}`)
		return response.data
	} catch (err: any) {
		throw new Error('Failed to retrieve existing chat.')
	}
}
export { GetChat }
