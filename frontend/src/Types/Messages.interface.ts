export interface IMessage {
	data: {
		message: string
		timestamp: string | number | Date
	}
	isMine: boolean
	startsSequence: boolean
	endsSequence: boolean
	showTimestamp: boolean
}
export interface IMessageType {
	id: number
	author: string
	message: string
	timestamp: number
}
