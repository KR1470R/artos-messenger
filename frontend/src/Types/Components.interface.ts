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
	activeTab: string
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
export interface SettingsParamsProps {
	param: string
	text: string
	colorIcon: string
	icon: React.ElementType
	onClick?: () => void
}
export interface IWarningModal {
	open: boolean
	onClose: () => void
	onConfirm: () => void
	message: string
	confirmText: string
	cancelText: string
	title?: string
}
export interface INotificationProps {
	message: string
	type: 'success' | 'error'
	open: boolean
	onClose: () => void
}

export interface IScreenStackProps {
	children: React.ReactNode[]
	activeIndex: number
	onBack?: () => void
}
