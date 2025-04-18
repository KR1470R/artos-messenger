import { useSettingsStore } from '@/Store/useSettingsStore'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import { lazy, Suspense } from 'react'
import { BsArrowLeftShort } from 'react-icons/bs'

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
	if (activeParam !== 'profile' && activeParam !== 'themes') return null
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
						? [
								<p className='backBut' onClick={onBack}>
									<span className='iconBack'>
										<BsArrowLeftShort />
									</span>
									Back
								</p>,
						  ]
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
