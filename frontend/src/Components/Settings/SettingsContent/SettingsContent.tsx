import { useSettingsStore } from '@/Store/useSettingsStore'
import { MyProfile } from '../MyProfile/MyProfile'
import { Themes } from '../Themes/Themes'

const SettingsContent = () => {
	const activeParam = useSettingsStore(state => state.activeParam)

	return activeParam === 'profile' ? <MyProfile /> : <Themes />
}

export { SettingsContent }
