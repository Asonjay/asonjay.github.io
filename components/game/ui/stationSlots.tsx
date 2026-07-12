import type { ComponentType } from 'react'
import {
  IconIdCard,
  IconDesk,
  IconNewspaper,
  IconGamepad,
  IconBook,
  IconNote,
  IconPhoto,
  IconEnvelope,
  IconCalendar,
  IconTrash,
} from './kit/icons'
import {
  MailAt24,
  GoogleScholar24,
  GitHub24,
  Twitter24,
  LinkedIn24,
} from '../../icons'

export type Glyph = ComponentType<{ className?: string }>

// The ten station shortcuts, left-to-right, with their number hotkeys. Order and
// hotkeys are the F5 contract; icons mirror each station's in-world furniture so
// the bar reads as a map of the room. Shared by the desktop Hotbar and the mobile
// HotbarSheet so the two stay in lockstep.
export const STATION_SLOTS: { id: string; label: string; hotkey: string; Icon: Glyph }[] = [
  { id: 'about', label: 'About', hotkey: '1', Icon: IconIdCard },
  { id: 'publications', label: 'Publications', hotkey: '2', Icon: IconDesk },
  { id: 'news', label: 'News', hotkey: '3', Icon: IconNewspaper },
  { id: 'projects', label: 'Projects', hotkey: '4', Icon: IconGamepad },
  { id: 'blog', label: 'Blog', hotkey: '5', Icon: IconBook },
  { id: 'music', label: 'Music', hotkey: '6', Icon: IconNote },
  { id: 'life', label: 'Life', hotkey: '7', Icon: IconPhoto },
  { id: 'contact', label: 'Contact', hotkey: '8', Icon: IconEnvelope },
  { id: 'deadlines', label: 'Deadlines', hotkey: '9', Icon: IconCalendar },
  { id: 'classic', label: 'Classic Site', hotkey: '0', Icon: IconTrash },
]

// WorldData social `icon` keys -> the classic SVG glyphs (reused per the global
// constraint — socials are the one place the game does not draw new kit icons).
export const SOCIAL_GLYPH: Record<string, Glyph> = {
  email: MailAt24,
  scholar: GoogleScholar24,
  github: GitHub24,
  twitter: Twitter24,
  linkedin: LinkedIn24,
}
