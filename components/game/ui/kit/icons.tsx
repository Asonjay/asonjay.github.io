import type { ReactNode } from 'react'

// Warm rounded-modern kit glyphs: 20x20 viewBox, thin stroke, round caps + joins.
// Sized in `em` so a parent font-size scales them; colored by currentColor.
// Decorative by default (aria-hidden) — callers that need a label put it on the
// surrounding control.
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
      viewBox="0 0 20 20"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

// Solid accent for the few glyph parts that read better filled (note heads,
// buttons, dots): fill on, stroke off so they don't pick up the 1.8 outline.
const FILL = { fill: 'currentColor', stroke: 'none' } as const

export const IconIdCard = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
    <circle cx="7" cy="9" r="1.7" />
    <path d="M11 8.2 H15" />
    <path d="M11 10.8 H15" />
  </Glyph>
)

export const IconDesk = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3.5" y="4" width="13" height="9" rx="1.5" />
    <path d="M10 13 V15.5" />
    <path d="M7.5 15.5 H12.5" />
  </Glyph>
)

export const IconNewspaper = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="4.5" width="13.5" height="11" rx="1.5" />
    <path d="M5.5 7 H14" />
    <rect x="5.5" y="9" width="3.6" height="4" rx="0.6" />
    <path d="M11 9.6 H14" />
    <path d="M11 12.4 H14" />
  </Glyph>
)

export const IconGamepad = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="6.5" width="14" height="7" rx="3.5" />
    <path d="M6 8.7 V11.3" />
    <path d="M4.7 10 H7.3" />
    <circle cx="13" cy="9.4" r="0.95" {...FILL} />
    <circle cx="14.6" cy="11.1" r="0.95" {...FILL} />
  </Glyph>
)

export const IconBook = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="5" y="3.5" width="10" height="13" rx="1.5" />
    <path d="M8 3.5 V16.5" />
    <path d="M10.5 7 H13" />
    <path d="M10.5 9.5 H13" />
  </Glyph>
)

export const IconNote = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M7.5 13 V5.5 L13.5 4.2 V11.5" />
    <circle cx="6" cy="13" r="1.8" {...FILL} />
    <circle cx="12" cy="11.5" r="1.8" {...FILL} />
  </Glyph>
)

export const IconPhoto = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="4" width="14" height="12" rx="2" />
    <circle cx="7.4" cy="8" r="1.3" />
    <path d="M3.6 14 L8 10 L11 12.6 L14 9.6 L16.4 12" />
  </Glyph>
)

export const IconEnvelope = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3" y="5" width="14" height="10" rx="1.5" />
    <path d="M3.6 6 L10 11 L16.4 6" />
  </Glyph>
)

export const IconCalendar = (p: IconProps) => (
  <Glyph {...p}>
    <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
    <path d="M7 3 V6" />
    <path d="M13 3 V6" />
    <path d="M3.5 8.2 H16.5" />
  </Glyph>
)

export const IconTrash = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4 6 H16" />
    <path d="M8 6 V4.5 H12 V6" />
    <path d="M5.6 6 L6.3 15.6 A0.9 0.9 0 0 0 7.2 16.4 H12.8 A0.9 0.9 0 0 0 13.7 15.6 L14.4 6" />
    <path d="M8.6 9 V13.5" />
    <path d="M11.4 9 V13.5" />
  </Glyph>
)

export const IconPlay = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M7 5 L7 15 L15.5 10 Z" />
  </Glyph>
)

export const IconPause = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M7.5 5 V15" />
    <path d="M12.5 5 V15" />
  </Glyph>
)

export const IconSun = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="10" cy="10" r="3.2" />
    <path d="M10 2.6 V4.2" />
    <path d="M10 15.8 V17.4" />
    <path d="M2.6 10 H4.2" />
    <path d="M15.8 10 H17.4" />
    <path d="M4.75 4.75 L5.85 5.85" />
    <path d="M14.15 14.15 L15.25 15.25" />
    <path d="M15.25 4.75 L14.15 5.85" />
    <path d="M5.85 14.15 L4.75 15.25" />
  </Glyph>
)

export const IconMoon = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M17.5 10.7 A7.5 7.5 0 1 1 9.3 2.5 A5.8 5.8 0 0 0 17.5 10.7 Z" />
  </Glyph>
)

export const IconClose = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M5 5 L15 15" />
    <path d="M15 5 L5 15" />
  </Glyph>
)

export const IconExternalLink = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M11 4 H5.5 A1.5 1.5 0 0 0 4 5.5 V14.5 A1.5 1.5 0 0 0 5.5 16 H14.5 A1.5 1.5 0 0 0 16 14.5 V9" />
    <path d="M12.5 4 H16 V7.5" />
    <path d="M9 11 L16 4" />
  </Glyph>
)

export const IconExclaim = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M10 4.5 V11.5" />
    <circle cx="10" cy="15.2" r="0.95" {...FILL} />
  </Glyph>
)

export const IconMenu = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M3.5 6 H16.5" />
    <path d="M3.5 10 H16.5" />
    <path d="M3.5 14 H16.5" />
  </Glyph>
)
