"use client"

import * as React from "react"

export function useMediaQuery(query: string) {
  const getMatches = React.useCallback(() => {
    if (typeof window === "undefined") {
      return false
    }

    return window.matchMedia(query).matches
  }, [query])

  const [matches, setMatches] = React.useState<boolean>(getMatches)

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => {
      setMatches(mediaQueryList.matches)
    }

    handleChange()
    mediaQueryList.addEventListener("change", handleChange)

    return () => {
      mediaQueryList.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}
