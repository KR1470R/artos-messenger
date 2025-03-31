import { useAuthStore } from '@/Store/useAuthStore'
import { IResponseError, IUser } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const getUserUrl = import.meta.env.VITE_USERS_ME_ROUTE

if (!getUserUrl) {
	throw new Error('Environment variable VITE_USERS_ME_ROUTE is not defined.')
}

const GetCurrentUser = async (): Promise<void> => {
	try {
		const response = await ApiClient.get<IUser>(getUserUrl)
		const user = response.data
		useAuthStore.getState().setUser(user)
	} catch (error) {
		const err = error as IResponseError
		console.error('Error fetching user data:', err.message)
		throw new Error(`Error fetching user data: ${err.message}`)
	}
}

export { GetCurrentUser }
