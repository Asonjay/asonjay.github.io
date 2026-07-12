import GameLoader from 'components/game/GameLoader'
import { getWorldData } from 'lib/worldData'

// Server component: aggregates all content into a serializable WorldData object
// at build time and threads it into the client-only game. getWorldData (which
// does fs reads + MDX bundling) is imported ONLY here — it never enters the
// client bundle.
export default async function GamePage() {
  const worldData = await getWorldData()
  return (
    <>
      <h1 className="sr-only">Zexin (Jason) Xu</h1>
      <GameLoader data={worldData} />
    </>
  )
}
