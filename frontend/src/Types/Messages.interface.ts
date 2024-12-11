export interface IMessage {
	id: number
	chatId: number
	senderId: number
	content: string
	isRead: boolean
	createdAt: Date
	updatedAt: Date
	isMine: boolean
	startsSequence?: boolean
	endsSequence?: boolean
	showTimestamp?: boolean
}

export interface IMessageType {
	id: number
	chat_id: number
	sender_id: number
	content: string
	is_read: boolean
	created_at: string
	updated_at: string
	timestamp?: number
	startsSequence?: boolean
	endsSequence?: boolean
	showTimestamp?: boolean
}

export interface IServerMessage {
	id: number
	chat_id: number
	sender_id: number
	content: string
	is_read: boolean
	created_at: string
	updated_at: string
}

export interface IMessageProps {
	data: IMessageType
	isMine: boolean
}
