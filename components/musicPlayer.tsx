'use client'

/**
 * Homepage music player UI — display only.
 * The actual audio is handled by MiniPlayer in the layout.
 * This just shows the playlist for visual purposes.
 */

const playlist = [
  { title: 'Dose', artist: 'Teddy Swims' },
  { title: 'Lose Control', artist: 'Teddy Swims' },
  { title: 'Less Than Zero', artist: 'The Weeknd' },
  { title: "Halley's Comet", artist: 'Billie Eilish' },
  { title: 'Evangeline', artist: 'Stephen Sanchez' },
  { title: 'Jupiter to Mars', artist: 'Rocco' },
  { title: '是你', artist: '张靓颖 ft. 王赫野' },
]

export function HomeMusicPlayer() {
  return (
    <div className="space-y-0.5 max-h-[140px] overflow-y-auto custom-scrollbar">
      {playlist.map((track, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-fore-subtle hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono-label text-[0.6rem] w-3 text-center flex-shrink-0">{i + 1}</span>
            <span className="text-xs truncate">{track.title}</span>
          </div>
          <span className="font-mono-label text-[0.55rem] flex-shrink-0 ml-2">{track.artist}</span>
        </div>
      ))}
    </div>
  )
}
