import { useAuthStore } from '@/Store/useAuthStore'
import { SettingsParam } from '@/UI/SettingsParam/SettingsParam'
import { TabsMain } from '@/UI/TabsMain/TabsMain'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import moment from 'moment'
import 'moment/locale/uk'
import { IoIosColorPalette } from 'react-icons/io'
import { IoPerson } from 'react-icons/io5'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import './SettingsList.css'

const SettingsList = () => {
	const { user, logout } = useAuthStore()
	const createdDate = moment(user?.created_at).format('D.MM.YYYY HH:mm:ss')
	const handleLogout = () => {
		logout()
		document.cookie.split(';').forEach(cookie => {
			const [name] = cookie.split('=')
			document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${
				window.location.hostname
			}`
		})
	}

	return (
		<div className='settingsList'>
			<Toolbar title='Settings' leftItems={[]} rightItems={[]} />
			<div className='settingsUser'>
				<p className='avatar'>
					<img src={user?.avatar_url} alt='avatar_url' />
				</p>
				<div className='contentUser'>
					<p className='username'>{user?.username}</p>
					<p className='dataCreate'>Created: {createdDate}</p>
					<p className='dataId'>ID: {user?.id}</p>
				</div>
			</div>
			<SettingsParam
				param={'profile'}
				text={'My Profile'}
				colorIcon='#ca213d'
				icon={IoPerson}
			/>
			<SettingsParam
				param={'themes'}
				text={'Color Theme'}
				colorIcon='#1e94f9'
				icon={IoIosColorPalette}
			/>
			<div className='logoutContainer'>
				<SettingsParam
					param={'logout'}
					text={'Log Out'}
					colorIcon='#ca213d'
					icon={RiLogoutBoxRLine}
					onClick={handleLogout}
				/>
			</div>
			<TabsMain />
		</div>
	)
}

export { SettingsList }
