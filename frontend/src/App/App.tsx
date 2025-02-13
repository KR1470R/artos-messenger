import { Messenger } from '@/Pages/Messenger/Messenger'
import { useThemeStore } from '@/Store/useThemeStore'
import { useEffect } from 'react'
import './App.css'

const App = () => {
	const { activeTheme } = useThemeStore()

	useEffect(() => {
		if (document.body.className !== activeTheme) document.body.className = activeTheme
	}, [activeTheme])
	return (
		<div className='App'>
			<Messenger />
		</div>
	)
}

export { App }
