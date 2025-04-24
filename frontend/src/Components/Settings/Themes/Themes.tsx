import { useThemeStore } from '@/Store/useThemeStore'
import './Themes.css'

const Themes = () => {
	const { setActiveTheme } = useThemeStore()

	return (
		<div className='themeSwitcher'>
			<div className='themeItem' onClick={() => setActiveTheme('lightTheme')}>
				<img src='/lightTheme.png' alt='Day Mode' />
				<p className='nameMode'>Day</p>
			</div>
			<div className='themeItem' onClick={() => setActiveTheme('darkTheme')}>
				<img src='/darkTheme.png' alt='Night Mode' />
				<p className='nameMode'>Night</p>
			</div>
			<div className='themeItem' onClick={() => setActiveTheme('systemTheme')}>
				<img src='/systemTheme.png' alt='System Mode' />
				<p className='nameMode'>System</p>
			</div>
		</div>
	)
}

export { Themes }
