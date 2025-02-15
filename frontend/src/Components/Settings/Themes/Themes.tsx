import { useThemeStore } from '@/Store/useThemeStore'
import { Toolbar } from '@/UI/Toolbar/Toolbar'
import './Themes.css'

const Themes = () => {
	const { setActiveTheme } = useThemeStore()

	return (
		<>
			<Toolbar title='Themes' leftItems={[]} rightItems={[]} />
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
		</>
	)
}

export { Themes }
