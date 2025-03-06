import { create } from 'zustand'

interface PresenceStore {
  isActive: boolean
  togglePresence: (value: boolean) => void
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  isActive: false,
  togglePresence: (value): void => set({ isActive: value })
}))
