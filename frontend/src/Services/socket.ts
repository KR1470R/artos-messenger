import { TokenService } from '@/Services/authorization/AccessTokenMemory'
import { IMessageType } from '@/Types/Messages.interface'
import { io, Socket } from 'socket.io-client'

export const socket: Socket = io(
	`${import.meta.env.VITE_WS_URL}${import.meta.env.VITE_WS_MESSAGES_ROUTE}`,
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
	if (socket.connected) return
	socket.io.opts.extraHeaders = { token }
	socket.connect()
	socket.on('connect', () => console.log('✅ Socket connected successfully.'))
	socket.on('connect_error', error => console.error('❌ Connection error:', error))
	socket.on('disconnect', reason => console.warn('⚠️ Socket disconnected:', reason))
}

export const joinChat = (chatId: number) => {
	if (!socket.connected) connectSocket()
	socket.emit('join_chat', { chat_id: chatId })
}
export const leaveChat = (chatId: number) => {
	if (!socket.connected) connectSocket()
	socket.emit('leave_chat', { chat_id: chatId })
}

export const createMessage = (chatId: number, content: string) => {
	if (!socket.connected) connectSocket()
	socket.emit('create_message', { chat_id: chatId, content })
}

export const fetchMessages = (chatId: number, pageSize: number, pageNum: number) => {
	if (!socket.connected) connectSocket()
	socket.emit('find_many_messages', {
		chat_id: chatId,
		page_size: pageSize,
		page_num: pageNum,
	})
}
export const markMessageAsRead = (
	chatId: number,
	messageId: number,
	is_read: boolean,
) => {
	if (!socket.connected) connectSocket()
	socket.emit('update_message', {
		chat_id: chatId,
		id: messageId,
		is_read,
	})
}
export const updateMessage = (
	chatId: number,
	messageId: number,
	content: string,
	is_read: boolean,
) => {
	if (!socket.connected) connectSocket()
	socket.emit('update_message', {
		chat_id: chatId,
		id: messageId,
		content,
		is_read,
	})
}
export const deleteMessages = (chatId: number, id: number) => {
	socket.emit('delete_message', {
		chat_id: chatId,
		id,
	})
}
export const subscribeToNewMessages = (callback: (message: IMessageType) => void) => {
	socket.on('new_message', callback)
}
export const unsubscribeFromNewMessages = (callback: (message: IMessageType) => void) => {
	socket.off('new_message', callback)
}
export const subscribeToFetchMessages = (
	callback: (messages: IMessageType[]) => void,
) => {
	socket.on('find_many_messages', callback)
}
export const unsubscribeFromFetchMessages = (
	callback: (messages: IMessageType[]) => void,
) => {
	socket.off('find_many_messages', callback)
}
export const subscribeToUpdatedMessages = (callback: (message: IMessageType) => void) => {
	socket.on('updated_message', callback)
}
export const unsubscribeFromUpdatedMessages = (
	callback: (message: IMessageType) => void,
) => {
	socket.off('updated_message', callback)
}
export const subscribeToDeleteMessage = (callback: (message: IMessageType) => void) => {
	socket.on('deleted_message', callback)
}
export const unsubscribeFromDeleteMessage = (
	callback: (message: IMessageType) => void,
) => {
	socket.off('deleted_message', callback)
}
export const disconnectSocket = () => {
	if (socket.connected) socket.disconnect()
}
