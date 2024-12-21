import { IMessageType } from '@/Types/Messages.interface'
import { io, Socket } from 'socket.io-client'
import { TokenService } from './authorization/AccessTokenMemory'

export const socket: Socket = io(
	`${process.env.REACT_APP_WS_URL}${process.env.REACT_APP_WS_MESSAGES_ROUTE}`,
	{
		autoConnect: false,
		extraHeaders: {
			token: `${TokenService.getToken()}`,
		},
	},
)
export const connectSocket = () => {
	const token = TokenService.getToken()
	if (!token) {
		console.error('❌ No token available. Cannot connect to the socket.')
		return
	}
	if (socket.connected) {
		console.log('ℹ️ Socket is already connected.')
		return
	}
	socket.io.opts.extraHeaders = { token }
	socket.connect()
	socket.on('connect', () => console.log('✅ Socket connected successfully.'))
	socket.on('connect_error', error => console.error('❌ Connection error:', error))
	socket.on('disconnect', reason => console.warn('⚠️ Socket disconnected:', reason))
}

export const joinChat = (chatId: number) => {
	if (!socket.connected) connectSocket()
	socket.emit('join_chat', { chat_id: chatId })
	socket.once('join_chat', response => console.log(response))
}

export const createMessage = (chatId: number, content: string) => {
	if (!socket.connected) {
		console.warn('Socket is not connected. Attempting to reconnect...')
		connectSocket()
	}
	socket.once('create_message', (response: { event: string; data: number }) => {
		console.log('Message created with ID:', response)
	})
	socket.emit('create_message', { chat_id: chatId, content })
}

export const subscribeToNewMessages = (callback: (message: IMessageType) => void) => {
	socket.on('new_message', callback)
}

export const disconnectSocket = () => {
	if (socket.connected) {
		socket.disconnect()
		console.log('Socket disconnected.')
	}
}
