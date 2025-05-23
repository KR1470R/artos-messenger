import { useSettingsStore } from '@/Store/useSettingsStore'
import React from 'react'
import { PiChatsCircleLight, PiGearFineThin } from 'react-icons/pi'
import './TabsMain.css'

const TabsMain: React.FC = () => {
	const { tabMain, setTabMain } = useSettingsStore()
	return (
		<div className='tabsMain'>
			<div
				className={`tabMain ${tabMain === 'chats' ? 'active' : ''}`}
				onClick={() => setTabMain('chats')}
			>
				<PiChatsCircleLight />
			</div>
			<div
				className={`tabMain ${tabMain === 'settings' ? 'active' : ''}`}
				onClick={() => setTabMain('settings')}
			>
				<PiGearFineThin />
			</div>
		</div>
	)
}

export { TabsMain }
