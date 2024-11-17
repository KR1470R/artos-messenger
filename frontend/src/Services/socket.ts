import { io } from 'socket.io-client'
import { useAuthStore } from '../Store/useAuthStore'
import { RefreshToken } from './RefreshToken.service'

const socket = io(process.env.REACT_APP_API_URL, {
	autoConnect: false,
})

socket.on('connect', () => {
	console.log('Connected to WebSocket')
})

socket.on('token_expired', async () => {
	console.log('Token expired, attempting refresh...')
	const logout = useAuthStore(state => state.logout)

	try {
		const newAccessToken = await RefreshToken()
		socket.emit('authenticate', { token: newAccessToken })
	} catch (error) {
		console.error('Failed to refresh token:', error)
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		logout()
	}
})

export { socket }
