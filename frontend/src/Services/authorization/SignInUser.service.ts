import { useAuthStore } from '@/Store/useAuthStore'
import { IResponseAuth, IResponseError, IUserData } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'
import { GetCurrentUser } from '../users/GetCurrentUser.service'
import { TokenService } from './accessTokenMemory'

const signInUrl = process.env.REACT_APP_AUTH_SIGN_IN_ROUTE

if (!signInUrl) {
	throw new Error('Environment variable REACT_APP_AUTH_SIGN_IN_ROUTE is not defined.')
}

const SignInUser = async (userData: IUserData): Promise<void> => {
	try {
		const response = await ApiClient.post<IResponseAuth>(signInUrl, userData)
		const { token } = response.data
		TokenService.setToken(token)

		await GetCurrentUser()
	} catch (error) {
		const err = error as IResponseError
		const { setError } = useAuthStore.getState()
		setError(`${err}`)
		throw new Error('Sign-in failed, please check credentials.')
	}
}

export { SignInUser }
