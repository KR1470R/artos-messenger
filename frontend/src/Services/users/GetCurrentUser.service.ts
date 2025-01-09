import { useAuthStore } from '@/Store/useAuthStore'
import { IUser } from '@/Types/Services.interface'
import { ApiClient } from '../ApiClient'

const getUserUrl = process.env.REACT_APP_USERS_ME_ROUTE

if (!getUserUrl) {
	throw new Error('Environment variable REACT_APP_USERS_ME_ROUTE is not defined.')
}

const GetCurrentUser = async (): Promise<void> => {
	try {
		const response = await ApiClient.get<IUser>(getUserUrl)
		const user = response.data
		console.log('User data fetched:', user)
		useAuthStore.getState().setUser(user)
	} catch (err: any) {
		console.error('Error fetching user data:', err?.response?.data || err.message)
		useAuthStore.getState().setError(err?.response?.data?.message || err.message)
		throw new Error('Failed to fetch user data. Please check API configuration.')
	}
}

export { GetCurrentUser }
