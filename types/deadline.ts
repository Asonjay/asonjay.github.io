export type Conference = {
  title: string
  year: number
  id: string
  full_name?: string
  link: string
  deadline: string
  abstract_deadline?: string
  timezone: string
  place: string
  date: string
  start: string
  end: string
  hindex?: number
  sub: string | string[]
  note?: string
}

export type SubjectFilter = 'all' | 'ML' | 'CV' | 'RO'
