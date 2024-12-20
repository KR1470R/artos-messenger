export interface IMessageType {
	id: number
	chat_id: number
	sender_id: number
	receiver_id: number
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
