import { io } from 'socket.io-client'
import { TokenService } from './AccessTokenMemory'

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

	socket.on('error', error => {
		console.error('Socket error:', error)
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
