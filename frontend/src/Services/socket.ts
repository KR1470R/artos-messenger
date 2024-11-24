import { io } from 'socket.io-client'
import { TokenService } from './AccessTokenMemory'

export const socket = io(
	`${process.env.REACT_APP_WS_URL}${process.env.REACT_APP_WS_MESSAGES_ROUTE}`,
	{
		extraHeaders: {
			token: `${TokenService.getToken()}`,
		},
	},
)

socket.on('connect', () => {})

socket.on('connect_error', error => {
	console.error('Connection error:', error)
})

socket.on('error', error => {
	console.error('Socket error:', error)
})

export const connectSocket = () => {
	const token = TokenService.getToken()
	if (!token) {
		console.error('Cannot connect socket: No access token')
		return
	}

	socket.io.opts.extraHeaders = {
		token,
	}
	socket.connect()
}
