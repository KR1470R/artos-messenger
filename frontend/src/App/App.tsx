import { Messenger } from '@/Pages/Messenger/Messenger'
import { useThemeStore } from '@/Store/useThemeStore'
import { useEffect } from 'react'
import './App.css'

const App = () => {
	const { activeTheme } = useThemeStore()
	useEffect(() => {
		const updateTheme = () => {
			const theme =
				activeTheme === 'systemTheme'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'darkTheme'
						: 'lightTheme'
					: activeTheme
			document.body.className = theme
		}
		updateTheme()
		if (activeTheme === 'systemTheme') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			mediaQuery.addEventListener('change', updateTheme)

			return () => {
				mediaQuery.removeEventListener('change', updateTheme)
			}
		}
	}, [activeTheme])

	return (
		<div className='App'>
			<Messenger />
		</div>
	)
}

export { App }
