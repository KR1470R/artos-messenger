import { io } from 'socket.io-client'
import { TokenService } from './AccessTokenMemory'
import { RefreshToken } from './RefreshToken.service'

export const socket = io(process.env.REACT_APP_API_URL || '', {
	autoConnect: false,
	extraHeaders: {
		Authorization: `Bearer ${TokenService.getToken()}`,
	},
})

const setupSocketListeners = () => {
	socket.on('connect', () => {
		console.log('connect success')
	})

	socket.on('connect_error', error => {
		console.error('Connection error:', error)
	})

	socket.on('token_expired', async () => {
		try {
			const newAccessToken = await RefreshToken()

			socket.io.opts.extraHeaders = {
				Authorization: `Bearer ${newAccessToken}`,
			}

			socket.disconnect()
			socket.connect()
		} catch (error) {
			console.error('Failed to refresh token:', error)
			TokenService.clearToken()
			socket.disconnect()
		}
	})
}

setupSocketListeners()

export const connectSocket = () => {
	const token = TokenService.getToken()
	if (!token) {
		console.error('Cannot connect socket: No access token')
		return
	}

	socket.io.opts.extraHeaders = {
		Authorization: `Bearer ${token}`,
	}
	socket.connect()
}
