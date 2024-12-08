import { IResponse, IUserData } from '@/Types/Services.interface'
import { jwtDecode } from 'jwt-decode'
import { ApiClient } from '../ApiClient'
import { TokenService } from './AccessTokenMemory'

const signInUrl = process.env.REACT_APP_AUTH_SIGN_IN_ROUTE

if (!signInUrl) {
	throw new Error('Environment variable REACT_APP_AUTH_SIGN_IN_ROUTE is not defined.')
}

const SignInUser = async (
	userData: IUserData,
): Promise<{ id: string; username: string }> => {
	try {
		const response = await ApiClient.post<IResponse>(signInUrl, userData)
		const { token } = response.data
		TokenService.setToken(token)
		const decodedToken: { id: string; username: string } = jwtDecode(token)
		const { id, username } = decodedToken

		return { id, username }
	} catch (err: any) {
		console.error('Sign-in failed:', err.response?.data || err)
		throw new Error('Sign-in failed, please check credentials.')
	}
}

export { SignInUser }