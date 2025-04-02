import { IResponseError } from '@/Types/Services.interface'
import { ApiClient } from '../network/ApiClient'
import { TokenService } from './AccessTokenMemory'

const refreshUrl = import.meta.env.VITE_AUTH_REFRESH_TOKEN_ROUTE

if (!refreshUrl) {
	throw new Error('Environment variable VITE_AUTH_REFRESH_TOKEN_ROUTE is not defined.')
}

export const RefreshToken = async (): Promise<string> => {
	try {
		const response = await ApiClient.post<{ token: string }>(
			refreshUrl,
			{},
			{ withCredentials: true },
		)
		const newAccessToken = response.data.token
		TokenService.setToken(newAccessToken)
		return newAccessToken
	} catch (error) {
		const err = error as IResponseError
		console.error(
			'Token refresh failed. Please log in again.',
			err.message || 'Unknown error',
		)
		TokenService.clearToken()
		throw new Error(`Token refresh failed. Please log in again.
			${err.message}`)
	}
}
