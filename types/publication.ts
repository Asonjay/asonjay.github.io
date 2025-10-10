export type Publication = {
  title: string
  authors: string[]
  year: number
  venue: string
  url?: string
  pdf?: string
  abstract?: string
  doi?: string
  abbr?: string
  selected?: boolean
  thumbnail?: string
}
