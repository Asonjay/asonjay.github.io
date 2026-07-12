import type { ReactNode } from 'react'

// Pixel-style kit glyphs: 16x16 viewBox, crispEdges, drawn on a ~2px module
// grid. Sized in `em` so a parent font-size scales them; colored by
// currentColor. Decorative by default (aria-hidden) — callers that need a label
// put it on the surrounding control.
type IconProps = { className?: string; title?: string }

function Glyph({
  children,
  className,
  title,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 } as const

export const IconIdCard = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="1" y="3" width="14" height="10" {...S} />
    <rect x="3" y="6" width="4" height="4" />
    <rect x="9" y="6" width="4" height="2" />
    <rect x="9" y="9" width="4" height="2" />
  </Glyph>
)

export const IconDesk = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="2" width="10" height="12" {...S} />
    <rect x="5" y="5" width="6" height="2" />
    <rect x="5" y="8" width="6" height="2" />
    <rect x="5" y="11" width="4" height="1" />
  </Glyph>
)

export const IconNewspaper = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="1" y="2" width="14" height="12" {...S} />
    <rect x="3" y="4" width="10" height="2" />
    <rect x="3" y="7" width="4" height="5" />
    <rect x="9" y="7" width="4" height="2" />
    <rect x="9" y="10" width="4" height="2" />
  </Glyph>
)

export const IconGamepad = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="1" y="5" width="14" height="7" {...S} />
    <rect x="4" y="6" width="2" height="5" />
    <rect x="2" y="8" width="6" height="2" />
    <rect x="10" y="6" width="2" height="2" />
    <rect x="12" y="9" width="2" height="2" />
  </Glyph>
)

export const IconBook = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="2" y="3" width="5" height="10" />
    <rect x="7" y="3" width="2" height="10" />
    <rect x="9" y="3" width="5" height="10" />
  </Glyph>
)

export const IconNote = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="9" y="2" width="2" height="9" />
    <rect x="11" y="2" width="2" height="4" />
    <rect x="5" y="9" width="4" height="3" />
  </Glyph>
)

export const IconPhoto = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="1" y="3" width="14" height="10" {...S} />
    <rect x="4" y="5" width="2" height="2" />
    <rect x="3" y="9" width="4" height="2" />
    <rect x="8" y="7" width="5" height="4" />
  </Glyph>
)

export const IconEnvelope = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="1" y="4" width="14" height="8" {...S} />
    <path d="M2 5 L8 10 L14 5" {...S} />
  </Glyph>
)

export const IconCalendar = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="5" y="1" width="2" height="3" />
    <rect x="9" y="1" width="2" height="3" />
    <rect x="2" y="3" width="12" height="11" {...S} />
    <rect x="2" y="3" width="12" height="3" />
    <rect x="5" y="8" width="2" height="2" />
    <rect x="9" y="8" width="2" height="2" />
    <rect x="5" y="11" width="2" height="1" />
  </Glyph>
)

export const IconTrash = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="6" y="1" width="4" height="2" />
    <rect x="2" y="3" width="12" height="2" />
    <rect x="3" y="5" width="10" height="9" {...S} />
    <rect x="5" y="7" width="2" height="5" />
    <rect x="9" y="7" width="2" height="5" />
  </Glyph>
)

export const IconPlay = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4 3 L4 13 L13 8 Z" />
  </Glyph>
)

export const IconPause = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="4" y="3" width="3" height="10" />
    <rect x="9" y="3" width="3" height="10" />
  </Glyph>
)

export const IconSun = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="6" y="6" width="4" height="4" />
    <rect x="7" y="1" width="2" height="2" />
    <rect x="7" y="13" width="2" height="2" />
    <rect x="1" y="7" width="2" height="2" />
    <rect x="13" y="7" width="2" height="2" />
    <rect x="3" y="3" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
  </Glyph>
)

export const IconMoon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12.5 3 A6 6 0 1 0 12.5 13 A7 7 0 1 1 12.5 3 Z" />
  </Glyph>
)

export const IconClose = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M3 3 L13 13 M13 3 L3 13" {...S} />
  </Glyph>
)

export const IconExternalLink = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="2" y="5" width="9" height="9" {...S} />
    <path d="M8 8 L14 2" {...S} />
    <rect x="10" y="1" width="5" height="2" />
    <rect x="13" y="1" width="2" height="5" />
  </Glyph>
)
