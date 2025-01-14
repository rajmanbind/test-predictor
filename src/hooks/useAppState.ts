import { useAppStateStore } from "./appStateStore"

export function useAppState() {
  const appState = useAppStateStore((state) => state.appState)
  const setAppState = useAppStateStore((state) => state.setAppState)

  return {
    appState,
    setAppState,
  }
}
