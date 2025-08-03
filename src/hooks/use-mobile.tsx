import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // We are forcing mobile view, so we can just return true.
    const onChange = () => {
      setIsMobile(true)
    }
    onChange();
  }, [])

  return !!isMobile
}
