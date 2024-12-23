export interface IMessageType {
	id: number
	initiator_id: number
	sender_id: number
	received_id?: number
	content: string
	chat_id: number
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
