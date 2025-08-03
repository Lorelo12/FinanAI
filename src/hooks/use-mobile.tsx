
"use client";

import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(true)

  React.useEffect(() => {
    const onChange = () => {
      setIsMobile(true)
    }
    onChange();
  }, [])

  return isMobile
}
