import { create } from 'zustand'

interface E2EEStore {
  open: boolean
  mode: 'set' | 'restore'
  canSkip: boolean
  skipText: string
  error: string
  _resolve: ((value: string | null) => void) | null

  openModal: (mode: 'set' | 'restore', canSkip?: boolean, skipText?: string) => Promise<string | null>
  submitPassphrase: (passphrase: string) => void
  skipPassphrase: () => void
  setError: (error: string) => void
}

export const useE2EEStore = create<E2EEStore>((set, get) => ({
  open: false,
  mode: 'set',
  canSkip: false,
  skipText: 'Skip for now',
  error: '',
  _resolve: null,

  openModal: (mode, canSkip = false, skipText = 'Skip for now') => {
    return new Promise(resolve => {
      set({ open: true, mode, canSkip, skipText, error: '', _resolve: resolve })
    })
  },

  submitPassphrase: (passphrase) => {
    const { _resolve } = get()
    set({ open: false, _resolve: null, error: '' })
    _resolve?.(passphrase)
  },

  skipPassphrase: () => {
    const { _resolve } = get()
    set({ open: false, _resolve: null, error: '' })
    _resolve?.(null)
  },

  setError: (error) => set({ error }),
}))