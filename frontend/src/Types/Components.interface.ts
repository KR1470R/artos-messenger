import { IChat, IUserAll } from './Services.interface'

export interface ICompose {
	rightItems?: React.ReactNode[]
}
export interface IToolBar {
	title: string
	leftItems: React.ReactNode[]
	rightItems: React.ReactNode[]
}
export interface IConversationItem {
	data: IChat | IUserAll
	onClick: () => void
	isActive: boolean
	lastMessage?: string
}

export interface IToolbarButton {
	icon: string
	onClick?: () => void
}

export interface ITabsProps {
	activeTab: 'messages' | 'users'
	setActiveTab: React.Dispatch<React.SetStateAction<'messages' | 'users'>>
}
export interface IContextMenuProps {
	visible: boolean
	x: number
	y: number
	onClose: () => void
	items: {
		icon?: React.ReactNode
		text?: string
		onClick?: () => void
		type: string
		className?: string
	}[]
}
