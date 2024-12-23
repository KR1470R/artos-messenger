import { ApiClient } from '../ApiClient'
import { TokenService } from './AccessTokenMemory'

const refreshUrl = process.env.REACT_APP_AUTH_REFRESH_TOKEN_ROUTE

if (!refreshUrl) {
	throw new Error(
		'Environment variable REACT_APP_AUTH_REFRESH_TOKEN_ROUTE is not defined.',
	)
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
	} catch (err: any) {
		TokenService.clearToken()
		throw new Error('Failed to refresh token')
	}
}
