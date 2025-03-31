import { IResponseAuth, IResponseError, IUserData } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const registerUrl = import.meta.env.VITE_USERS_REGISTER_ROUTE

if (!registerUrl) {
	throw new Error('Environment variables for API routes are not defined.')
}

const RegisterUser = async (userData: IUserData): Promise<IResponseAuth> => {
	try {
		const { data } = await ApiClient.post<IResponseAuth>(registerUrl, userData, {
			headers: { 'Content-Type': 'application/json' },
		})
		return data
	} catch (error) {
		const err = error as IResponseError
		console.error('Registration failed:', err || 'Unknown error')
		throw new Error(`Registration failed: ${err}`)
	}
}

export { RegisterUser }
