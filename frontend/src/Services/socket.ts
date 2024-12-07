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

socket.on('connect', () => {
	console.log('Socket connected successfully.')
})

socket.on('connect_error', error => {
	console.error('Connection error:', error)
})

socket.on('error', error => {
	console.error('Socket error:', error)
})

export const connectSocket = () => {
	if (socket.connected) {
		console.log('Socket already connected.')
		return
	}
	const token = TokenService.getToken()
	if (!token) {
		console.error('Cannot connect socket: No access token')
		return
	}
	socket.io.opts.extraHeaders = { token }
	socket.connect()
}

export const joinChat = (chatId: number) => {
	if (!chatId || isNaN(chatId)) {
		console.error('Invalid chat ID provided for joining.')
		return
	}

	socket.emit('join_chat', { chat_id: chatId }, (response: { message: string }) => {
		if (response.message === 'Joined chat successfully.') {
			console.log(`Successfully joined chat: ${chatId}`)
		} else {
			console.error('Failed to join chat:', response)
		}
	})
}

export const leaveChatSocket = (chatId: number) => {
	socket.emit('leave_chat', { chat_id: chatId }, (response: { message: string }) => {
		if (response.message === 'Left chat successfully.') {
			console.log(`Left chat: ${chatId}`)
		} else {
			console.error('Failed to leave chat:', response)
		}
	})
}

export const createMessage = (chatId: number, content: string) => {
	socket.emit('create_message', { chat_id: chatId, content }, (response: any) => {
		console.log('Message created:', response)
	})
}

export const subscribeToNewMessages = (callback: (message: any) => void) => {
	socket.on('new_message', callback)
}

export const updateMessage = (
	chatId: number,
	messageId: number,
	content?: string,
	isRead?: boolean,
) => {
	socket.emit(
		'update_message',
		{ chat_id: chatId, id: messageId, content, is_read: isRead },
		(response: any) => {
			console.log('Message updated:', response)
		},
	)
}

export const subscribeToUpdatedMessages = (callback: (message: any) => void) => {
	socket.on('updated_message', callback)
}

export const deleteMessage = (chatId: number, messageId: number) => {
	socket.emit('delete_message', { chat_id: chatId, id: messageId }, (response: any) => {
		console.log('Message deleted:', response)
	})
}

export const subscribeToDeletedMessages = (callback: (message: any) => void) => {
	socket.on('deleted_message', callback)
}

export const disconnectSocket = () => {
	socket.disconnect()
}
