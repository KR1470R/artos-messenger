import { IConversation } from './Messages.interface'

export interface ICompose {
	rightItems?: React.ReactNode[]
}
export interface IToolBar {
	title: string
	leftItems: React.ReactNode[]
	rightItems: React.ReactNode[]
}
export interface IConversationItem {
	data: IConversation
}
export interface IToolbarButton {
	icon: string
}
export interface ITabsProps {
	activeTab: 'messages' | 'users'
	setActiveTab: React.Dispatch<React.SetStateAction<'messages' | 'users'>>
}
