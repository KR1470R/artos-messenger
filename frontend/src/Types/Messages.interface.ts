export interface IMessageType {
	id: number
	initiator_id: number
	sender_id: number
	received_id?: number
	content: string
	chat_id: number
	created_at: string
}

export interface IMessageProps {
	data: IMessageType
	isMine: boolean
	showDate: boolean
}
