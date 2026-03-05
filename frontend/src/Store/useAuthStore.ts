import { IUser } from '@/Types/Services.interface'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface IAuthStore {
  user: IUser | null
  hasE2EEKey: boolean
  setUser: (user: IUser | null) => void
  setHasE2EEKey: (val: boolean) => void
  login: (id: number, username: string) => void
  logout: () => void
}

const useAuthStore = create<IAuthStore>()(
  persist(
    set => ({
      user: null,
      hasE2EEKey: false,
      setUser: user => set({ user }),
      setHasE2EEKey: hasE2EEKey => set({ hasE2EEKey }),
      login: (id, username) => set({ user: { id, username } }),
      logout: () => set({ user: null, hasE2EEKey: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)

export { useAuthStore }
