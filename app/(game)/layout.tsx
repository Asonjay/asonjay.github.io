import '../../components/game/ui/kit/tokens.css'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="game-ui fixed inset-0 overflow-hidden">
      {/* First focusable element on the page: a bypass link out of the 3D scene.
          Hidden until focused (sr-only), then revealed as a kit-styled chip. */}
      <a href="/classic" className="gp-skip-link sr-only focus:not-sr-only">
        Skip the 3D — go to classic site
      </a>
      {children}
    </div>
  )
}
