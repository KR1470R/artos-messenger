import { IUser } from '@/Types/Services.interface'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IAuthStore {
	user: IUser | null
	login: (id: string, username: string) => void
	logout: () => void
}
const useAuthStore = create<IAuthStore>()(
	persist(
		set => ({
			user: null,
			login: (id, username) => set({ user: { id, username } }),
			logout: () => set({ user: null }),
		}),
		{ name: 'auth-storage' },
	),
)
export { useAuthStore }
