import { IChat } from '@/Types/Services.interface'
import { ApiClient } from '../ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const GetChats = async (): Promise<IChat[]> => {
	try {
		const response = await ApiClient.get<{ data: IChat[] }>(createChatsUrl)
		return response.data.data
	} catch (err: any) {
		console.error('Failed to retrieve chats:', err)
		throw new Error('Failed to retrieve chats.')
	}
}

export { GetChats }
