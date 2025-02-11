import { useSettingsStore } from '@/Store/useSettingsStore'
import { SettingsParamsProps } from '@/Types/Components.interface'
import React from 'react'
import './SettingsParam.css'

const SettingsParam: React.FC<SettingsParamsProps> = ({
	param,
	text,
	colorIcon,
	icon: Icon,
}) => {
	const { activeParam, setActiveParam } = useSettingsStore()

	return (
		<div
			className={`settingsParam ${activeParam === param ? 'active' : ''}`}
			onClick={() => setActiveParam(param)}
		>
			<p className='paramItem'>
				<span className='icon' style={{ backgroundColor: colorIcon }}>
					<Icon />
				</span>
				{text}
			</p>
		</div>
	)
}

export { SettingsParam }
