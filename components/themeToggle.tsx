'use client'
import { useState, useEffect } from 'react'
import { useAnalyticsEvent } from '../hooks/useAnalytics'
import { useDarkMode } from '../hooks/useDarkMode'

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useDarkMode()
  const { trackCustomEvent } = useAnalyticsEvent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className} style={{ width: 36, height: 36 }} />
  }

  return (
    <button
      aria-label={isDark ? 'Activate Light Mode' : 'Activate Dark Mode'}
      title={isDark ? 'Activate Light Mode' : 'Activate Dark Mode'}
      onClick={() => {
        setIsDark(!isDark)
        trackCustomEvent({ eventName: 'toggle-theme' })
      }}
      className={cn(
        'icon-btn',
        className
      )}
    >
      {/* Sun */}
      <svg
        className={cn(
          'absolute w-4 h-4 transition-all duration-500',
          isDark
            ? 'opacity-0 rotate-90 scale-0'
            : 'opacity-100 rotate-0 scale-100'
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon */}
      <svg
        className={cn(
          'absolute w-4 h-4 transition-all duration-500',
          isDark
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
