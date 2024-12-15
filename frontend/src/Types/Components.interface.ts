import { IUserAll } from './Services.interface'

export interface ICompose {
	rightItems?: React.ReactNode[]
}
export interface IToolBar {
	title: string
	leftItems: React.ReactNode[]
	rightItems: React.ReactNode[]
}
export interface IConversationItem {
	data: IUserAll
	onClick: () => void
}
export interface IToolbarButton {
	icon: string
	onClick?: () => void
}

export interface ITabsProps {
	activeTab: 'messages' | 'users'
	setActiveTab: React.Dispatch<React.SetStateAction<'messages' | 'users'>>
}
