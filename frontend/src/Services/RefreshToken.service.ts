import axios from 'axios'
import { useAuthStore } from '../Store/useAuthStore'
import { setAccessToken } from './AccessTokenMemory'
import { socket } from './socket'

const refreshUrl = process.env.REACT_APP_AUTH_REFRESH_TOKEN_ROUTE

if (!refreshUrl) {
	throw new Error(
		'Environment variable REACT_APP_AUTH_REFRESH_TOKEN_ROUTE is not defined.',
	)
}

const RefreshToken = async (): Promise<string> => {
	const logout = useAuthStore.getState().logout

	try {
		const response = await axios.post<{ token: string }>(
			refreshUrl,
			{},
			{ withCredentials: true },
		)

		const newAccessToken = response.data.token

		setAccessToken(newAccessToken)

		socket.emit('authenticate', newAccessToken)

		return newAccessToken
	} catch (err: any) {
		console.error('Failed to refresh token. Logging out...', err.response?.data || err)
		logout()
		throw new Error('Failed to refresh token')
	}
}

export { RefreshToken }
