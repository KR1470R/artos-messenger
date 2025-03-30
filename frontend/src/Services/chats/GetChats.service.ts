import { IChat, IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const createChatsUrl = process.env.REACT_APP_CHATS_ROUTE
if (!createChatsUrl) {
	throw new Error('Environment variable REACT_APP_CHATS_ROUTE is not defined.')
}

const GetChats = async (): Promise<IChat[]> => {
	try {
		const response = await ApiClient.get<{ data: IChat[] }>(createChatsUrl)
		return response.data.data
	} catch (error) {
		const err = error as IResponseError
		console.error('Failed to retrieve chats:', err || 'Unknown error')
		throw new Error(`Failed to retrieve chats: ${err.message}`)
	}
}

export { GetChats }
