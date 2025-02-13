import { useThemeStore } from '@/Store/useThemeStore'
import './Themes.css'

const Themes = () => { 
	const { setActiveTheme } = useThemeStore()
	const changeTheme = (theme: string) => setActiveTheme(theme)

	return (
		<div className='theme-switcher'>
			<button onClick={() => changeTheme('darkTheme')}>Dark</button>
			<button onClick={() => changeTheme('lightTheme')}>Light</button>
			<button onClick={() => changeTheme('compTheme')}>Comp Theme</button>
		</div>
	)
}

export { Themes }
