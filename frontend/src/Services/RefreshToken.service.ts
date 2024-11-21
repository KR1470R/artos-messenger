import axios from 'axios'
import { TokenService } from './AccessTokenMemory'
import { socket } from './socket'

const refreshUrl = process.env.REACT_APP_AUTH_REFRESH_TOKEN_ROUTE

if (!refreshUrl) {
	throw new Error(
		'Environment variable REACT_APP_AUTH_REFRESH_TOKEN_ROUTE is not defined.',
	)
}

export const RefreshToken = async (): Promise<string> => {
	try {
		const response = await axios.post<{ token: string }>(
			refreshUrl,
			{},
			{ withCredentials: true },
		)

		const newAccessToken = response.data.token
		TokenService.setToken(newAccessToken)
		socket.io.opts.extraHeaders = {
			Authorization: `Bearer ${newAccessToken}`,
		}

		return newAccessToken
	} catch (err: any) {
		console.error('Failed to refresh token:', err.response?.data || err)
		TokenService.clearToken()
		throw new Error('Failed to refresh token')
	}
}
