import axios from 'axios'
import { useAuthStore } from '../Store/useAuthStore'
import { socket } from './socket'

const refreshUrl = process.env.REACT_APP_AUTH_REFRESH_TOKEN_ROUTE

if (!refreshUrl) {
	throw new Error(
		'Environment variable REACT_APP_AUTH_REFRESH_TOKEN_ROUTE is not defined.',
	)
}

const RefreshToken = async (): Promise<string> => {
	const refreshToken = localStorage.getItem('refreshToken')
	if (!refreshToken) throw new Error('No refresh token found')
	const logout = useAuthStore(state => state.logout)

	try {
		const response = await axios.post<{ token: string }>(
			refreshUrl,
			{},
			{
				headers: { Authorization: `Bearer ${refreshToken}` },
			},
		)
		const newAccessToken = response.data.token
		localStorage.setItem('accessToken', newAccessToken)
		console.log('accessToken' + newAccessToken)

		socket.emit('authenticate', { token: newAccessToken })
		return newAccessToken
	} catch (error: any) {
		logout()
		const errorMessage = error.response?.data?.message || 'Failed to refresh token'
		console.error(errorMessage)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		throw error
	}
}

export { RefreshToken }
