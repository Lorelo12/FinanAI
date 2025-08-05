
"use client";

import * as React from "react"

const MOBILE_QUERY = "(max-width: 768px)"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(true)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const onChange = () => {
      setIsMobile(mediaQuery.matches)
    }

    // Set the initial value
    onChange()

    mediaQuery.addEventListener("change", onChange)

    return () => {
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}
