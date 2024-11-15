import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IAuthStore {
	user: string | null
	login: (username: string) => void
	logout: () => void
}
const useAuthStore = create<IAuthStore>()(
	persist(
		set => ({
			user: null,
			login: username => set({ user: username }),
			logout: () => set({ user: null }),
		}),
		{ name: 'auth-storage' },
	),
)
export { useAuthStore }
