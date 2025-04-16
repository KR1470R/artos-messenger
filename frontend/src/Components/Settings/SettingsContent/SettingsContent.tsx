import { useSettingsStore } from '@/Store/useSettingsStore'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { ToolbarButton } from '@/UI/ToolbarButton/ToolbarButton'
import { lazy, Suspense } from 'react'

const MyProfile = lazy(() =>
	import('../MyProfile/MyProfile').then(module => ({ default: module.MyProfile })),
)
const Themes = lazy(() =>
	import('../Themes/Themes').then(module => ({
		default: module.Themes,
	})),
)
const SettingsContent: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
	const activeParam = useSettingsStore(state => state.activeParam)
	const title =
		activeParam === 'profile'
			? 'My Profile'
			: activeParam === 'themes'
			? 'Color Theme'
			: ''
	return (
		<div className='settingsContent'>
			<Toolbar
				title={title}
				leftItems={
					onBack
						? [<ToolbarButton key='back' icon='ion-ios-arrow-back' onClick={onBack} />]
						: []
				}
				rightItems={[]}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				{activeParam === 'profile' && <MyProfile />}
				{activeParam === 'themes' && <Themes />}
			</Suspense>
		</div>
	)
}

export { SettingsContent }
