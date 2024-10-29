export interface ICompose {
	rightItems?: React.ReactNode[]
}
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
export interface IToolBar {
	title: string
	leftItems: React.ReactNode[]
	rightItems: React.ReactNode[]
}
export interface IConversation {
	photo: string
	name: string
	text: string
}
export interface IConversationItem {
	data: IConversation
}
export interface IToolbarButton {
	icon: string
}
export interface IMessageType {
	id: number
	author: string
	message: string
	timestamp: number
}