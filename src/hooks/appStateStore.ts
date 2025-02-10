import { create } from "zustand"

export interface IAppState {
  isLoading: boolean
  isSidebarOpen: boolean
}

const defaultAppState: IAppState = {
  isLoading: false,
  isSidebarOpen: false,
}

export const useAppStateStore = create<{
  appState: IAppState
  setAppState: (value: Partial<IAppState>) => void
}>((set) => ({
  appState: defaultAppState,

  setAppState: (value: Partial<IAppState>) =>
    set((state) => ({
      appState: { ...state.appState, ...value },
    })),
}))
