import { useAuthStore } from '../Store/useAuthStore'
import axios from 'axios'
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
		const response = await axios.post(
			refreshUrl,
			{},
			{
				headers: { Authorization: `Bearer ${refreshToken}` },
			},
		)
		const newAccessToken = response.data.token
		localStorage.setItem('accessToken', newAccessToken)

		socket.emit('authenticate', { token: newAccessToken })

		console.log('New Access Token:', newAccessToken)

		return newAccessToken
	} catch (error) {
		logout()
		console.error('Failed to refresh token:', error)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')

		throw error
	}
}
export { RefreshToken }
