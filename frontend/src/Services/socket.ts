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
	console.log('Socket is successfully connected.')
})

socket.on('connect_error', error => {
	console.error('Connection error:', error)
	if (error.message === 'Access denied') {
		console.log('Reconnecting...')
		socket.connect()
	}
})

socket.on('disconnect', reason => {
	console.log('The socket is disabled:', reason)
})

socket.on('error', error => {
	console.error('Socket error:', error)
})

export const connectSocket = () => {
	const token = TokenService.getToken()
	if (!token) {
		console.error('Unable to connect: No access token available')
		return
	}
	console.log('Use of the token:', token)

	if (socket.connected) {
		console.log('The socket is already connected.')
		return
	}
	socket.io.opts.extraHeaders = { token }
	socket.connect()
}

export const joinChat = (chatId: number) => {
	if (!chatId) {
		console.error('Invalid chat ID for connection.')
		return
	}
	console.log('chatId', chatId)

	socket.emit('join_chat', { chat_id: chatId }, (response: { message: string }) => {
		if (response.message === 'Successfully connected to the chat.') {
			console.log(`Successfully connected to the chat: ${chatId}`)
		} else {
			console.error('Unable to connect to the chat:', response)
		}
	})
}

export const leaveChatSocket = (chatId: number) => {
	socket.emit('leave_chat', { chat_id: chatId }, (response: { message: string }) => {
		if (response.message === 'Successfully left a chat.') {
			console.log(`A chat has been left: ${chatId}`)
		} else {
			console.error('Unable to leave the chat:', response)
		}
	})
}

export const createMessage = (chatId: number, content: string) => {
	socket.emit('create_message', { chat_id: chatId, content }, (response: any) => {
		if (response.error) {
			console.error('The message could not be created:', response.error)
		} else {
			console.log('Message created:', response)
		}
	})
}

export const subscribeToNewMessages = (callback: (message: string) => void) => {
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
			console.log('The message has been updated:', response)
		},
	)
}

export const subscribeToUpdatedMessages = (callback: (message: string) => void) => {
	socket.on('updated_message', callback)
}

export const deleteMessage = (chatId: number, messageId: number) => {
	socket.emit('delete_message', { chat_id: chatId, id: messageId }, (response: any) => {
		console.log('Message deleted:', response)
	})
}

export const subscribeToDeletedMessages = (callback: (message: string) => void) => {
	socket.on('deleted_message', callback)
}

export const disconnectSocket = () => {
	if (socket.connected) {
		socket.disconnect()
		console.log('Socket is disabled')
	}
}
