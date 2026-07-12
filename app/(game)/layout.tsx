import '../../components/game/ui/kit/tokens.css'

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="game-ui fixed inset-0 overflow-hidden">{children}</div>
}
