export interface IMessageType {
	id: number
	initiator_id: number
	sender_id: number
	receiver_id?: number
	content: string
	chat_id: number
	created_at: string
	is_read: boolean | number
}

export interface IMessageProps {
	data: IMessageType
	isMine: boolean
	showDate: boolean
}
