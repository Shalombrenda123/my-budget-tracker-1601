import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A generic hook that listens for any media query.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    // Check if we are in a browser environment
    if (typeof window === "undefined") return

    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = window.matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}

/**
 * A specific hook that uses useMediaQuery to detect if the screen is mobile.
 */
export function useIsMobile() {
  // We use the generic hook above with the mobile breakpoint
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}