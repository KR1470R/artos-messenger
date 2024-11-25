import { IResponse, IUserData } from '@/Types/Services.interface'
import { ApiClient } from '../ApiClient'
import { TokenService } from './AccessTokenMemory'

const signInUrl = process.env.REACT_APP_AUTH_SIGN_IN_ROUTE

if (!signInUrl) {
	throw new Error('Environment variable REACT_APP_AUTH_SIGN_IN_ROUTE is not defined.')
}

const SignInUser = async (userData: IUserData): Promise<IResponse> => {
	try {
		const response = await ApiClient.post(signInUrl, userData)
		const { token } = response.data
		TokenService.setToken(token)

		return response.data
	} catch (err: any) {
		console.error('Sign-in failed:', err.response?.data || err)
		throw new Error('Sign-in failed, please check credentials')
	}
}

export { SignInUser }
