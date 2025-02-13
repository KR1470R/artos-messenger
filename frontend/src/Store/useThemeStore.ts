import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IThemeStore {
	activeTheme: string
	setActiveTheme: (activeTheme: string) => void
}

export const useThemeStore = create<IThemeStore>()(
	persist(
		set => ({
			activeTheme: 'darkTheme',
			setActiveTheme: (activeTheme: string) => set({ activeTheme }),
		}),
		{
			name: 'theme-storage',
		},
	),
)
