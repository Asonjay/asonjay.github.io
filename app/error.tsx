'use client'

export default function Error() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel flex flex-col items-center justify-center py-20">
        <h1 className="font-heading text-8xl font-bold text-accent mb-4">404</h1>
        <p className="text-xl text-fore-subtle font-mono-label">
          Page not found. The page you&apos;re looking for does not exist.
        </p>
      </div>
    </div>
  )
}
