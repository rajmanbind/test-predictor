import { create } from "zustand"

export interface IAppState {
  isLoading: boolean
  pageLoader: boolean
  isSidebarOpen: boolean
  overFlowYHidden: boolean
}

const defaultAppState: IAppState = {
  isLoading: false,
  pageLoader: false,
  isSidebarOpen: false,
  overFlowYHidden: false,
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
