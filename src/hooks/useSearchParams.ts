import { useRouter } from "next/router"
import { useCallback } from "react"

export function useSearchParams() {
  const router = useRouter()

  const getSearchParams = useCallback((key: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(key) || ""
  }, [])

  const setSearchParams = useCallback(
    (key: string, value: string) => {
      const searchParams = new URLSearchParams(window.location.search)

      if (value) {
        searchParams.set(key, value)
      } else {
        searchParams.delete(key)
      }

      router.push({
        pathname: router.pathname,
        query: Object.fromEntries(searchParams.entries()),
      })
    },
    [router],
  )

  return { getSearchParams, setSearchParams }
}
