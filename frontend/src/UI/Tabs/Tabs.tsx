import React from 'react'
import './Tabs.css'
import { ITabsProps } from '@/Types/Components.interface'

const Tabs: React.FC<ITabsProps> = ({ activeTab, setActiveTab }) => {
	return (
		<div className='tabs'>
			<div
				className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
				onClick={() => setActiveTab('messages')}
			>
				Messages
			</div>
			<div
				className={`tab ${activeTab === 'users' ? 'active' : ''}`}
				onClick={() => setActiveTab('users')}
			>
				Users
			</div>
		</div>
	)
}
export { Tabs }
