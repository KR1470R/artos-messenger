import { IResponse, IUserData } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'

const registerUrl = process.env.REACT_APP_USERS_REGISTER_ROUTE

if (!registerUrl) {
	throw new Error('Environment variables for API routes are not defined.')
}

const RegisterUser = async (userData: IUserData): Promise<IResponse> => {
	try {
		const { data } = await ApiClient.post<IResponse>(registerUrl, userData, {
			headers: { 'Content-Type': 'application/json' },
		})
		return data
	} catch (err: any) {
		console.error('Registration failed:', err.response?.data || err)
		throw new Error('Registration failed')
	}
}

export { RegisterUser }
