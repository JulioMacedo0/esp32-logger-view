// useLogStore.ts
import { create } from 'zustand'

interface Log {
  message: string
  timestamp: string
}

interface LogStore {
  logs: Log[]
  addLog: (message: string) => void
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (message): void =>
    set((state) => ({
      logs: [...state.logs, { message, timestamp: new Date().toLocaleDateString() }]
    }))
}))
