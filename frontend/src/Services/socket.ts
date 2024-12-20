import { IMessageType } from '@/Types/Messages.interface'
import { IResponse } from '@/Types/Services.interface'
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

	console.log('🔌 Connecting to socket server...')
	socket.io.opts.extraHeaders = { token }
	socket.connect()
	socket.on('connect', () => console.log('✅ Socket connected successfully.'))
	socket.on('connect_error', error => console.error('❌ Connection error:', error))
	socket.on('disconnect', reason => console.warn('⚠️ Socket disconnected:', reason))
}

export const joinChat = (chat_id: number) => {
	if (!socket.connected) {
		connectSocket()
	}
	socket.emit('join_chat', { chat_id }, (response: any) => {
		console.log('📡 Callback triggered. Server response:', response)
	})
}
export const createMessage = (chatId: number, content: string) => {
	socket.emit('create_message', { chat_id: chatId, content }, (response: any) => {
		if (response.error) {
			console.error('Message creation failed:', response.error)
		}
	})
}

export const updateMessage = (
	chat_id: number,
	message_id: number,
	content?: string,
	is_read?: boolean,
) => {
	socket.emit(
		'update_message',
		{ chat_id, id: message_id, content, is_read },
		(response: IResponse) => console.log('Message updated:', response),
	)
}

export const deleteMessage = (chat_id: number, message_id: number) => {
	socket.emit('delete_message', { chat_id, id: message_id }, (response: IResponse) => {
		if (response.error) console.error('Failed to delete message:', response.error)
		else console.log('Message deleted:', response)
	})
}

export const subscribeToNewMessages = (callback: (message: IMessageType) => void) => {
	socket.on('new_message', callback)
}

export const subscribeToUpdatedMessages = (callback: (message: IMessageType) => void) => {
	socket.on('updated_message', callback)
}

export const subscribeToDeletedMessages = (callback: (messageId: number) => void) => {
	socket.on('deleted_message', callback)
}

export const disconnectSocket = () => {
	if (socket.connected) {
		socket.disconnect()
		console.log('Socket disconnected.')
	}
}
