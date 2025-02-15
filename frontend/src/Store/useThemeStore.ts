import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IThemeStore {
	activeTheme: string
	setActiveTheme: (theme: string) => void
}

export const useThemeStore = create<IThemeStore>()(
	persist(
		set => ({
			activeTheme: 'darkTheme',
			setActiveTheme: theme => {
				const newTheme =
					theme === 'systemTheme'
						? window.matchMedia('(prefers-color-scheme: dark)').matches
							? 'darkTheme'
							: 'lightTheme'
						: theme
				set({ activeTheme: theme })
				document.body.className = newTheme
			},
		}),
		{
			name: 'theme-storage',
		},
	),
)
