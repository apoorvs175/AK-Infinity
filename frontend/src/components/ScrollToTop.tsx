import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Disable browser's scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Scroll to top on page load and navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use instant for initial load/refresh to avoid animation jank
    })
  }, [pathname])

  return null
}
