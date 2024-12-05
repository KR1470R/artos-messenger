export interface IMessage {
	data: {
		message: string
		timestamp: number
	}
	isMine: boolean
	startsSequence?: boolean
	endsSequence?: boolean
	showTimestamp?: boolean
}

export interface IMessageType {
	id: number
	author: string
	message: string
	timestamp: number
	startsSequence?: boolean
	endsSequence?: boolean
	showTimestamp?: boolean
}
