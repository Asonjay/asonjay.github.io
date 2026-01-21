import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { Conference, SubjectFilter } from '../types/deadline'

// HuggingFace maintains this with AI agents - more up-to-date
const HUGGINGFACE_CONFERENCES = [
  'icra',
  'iros',
  'corl',
  'rss',
  'cvpr',
  'iccv',
  'eccv',
  'neurips',
  'icml',
  'iclr',
  'aaai',
]

const HUGGINGFACE_BASE_URL =
  'https://raw.githubusercontent.com/huggingface/ai-deadlines/main/src/data/conferences'

// Tag to subject mapping for HuggingFace format
const TAG_TO_SUBJECT: Record<string, string> = {
  'robotics': 'RO',
  'robot': 'RO',
  'robots': 'RO',
  'automation': 'RO',
  'machine-learning': 'ML',
  'ml': 'ML',
  'deep-learning': 'ML',
  'artificial-intelligence': 'ML',
  'ai': 'ML',
  'computer-vision': 'CV',
  'cv': 'CV',
  'vision': 'CV',
  'natural-language-processing': 'NLP',
  'nlp': 'NLP',
}

// Conferences that should always be tagged as robotics
const ROBOTICS_CONFERENCES = ['icra', 'iros', 'rss', 'corl']

// Subjects we care about
const RELEVANT_SUBJECTS = ['ML', 'CV', 'RO', 'NLP']

interface HuggingFaceConference {
  title: string
  year: number
  id: string
  full_name?: string
  link: string
  deadline?: string
  deadlines?: Array<{
    type: string
    label: string
    date: string
    timezone: string
  }>
  timezone?: string
  date: string
  start: string
  end: string
  city?: string
  country?: string
  venue?: string
  hindex?: number
  tags?: string[]
}

function convertHuggingFaceToConference(hf: HuggingFaceConference): Conference | null {
  // Get the deadline - either from 'deadline' field or from 'deadlines' array
  let deadline = hf.deadline
  let timezone = hf.timezone || 'UTC-12'

  if (!deadline && hf.deadlines && hf.deadlines.length > 0) {
    // Find submission deadline
    const submission = hf.deadlines.find(d => d.type === 'submission') || hf.deadlines[0]
    deadline = submission.date
    timezone = submission.timezone || timezone
  }

  if (!deadline) return null

  // Convert tags to subject
  let sub: string | string[] = 'ML'

  // Check if this is a known robotics conference by title
  const titleLower = hf.title.toLowerCase()
  if (ROBOTICS_CONFERENCES.some(rc => titleLower.includes(rc))) {
    sub = 'RO'
  } else if (hf.tags && hf.tags.length > 0) {
    const subjects = hf.tags
      .map(tag => TAG_TO_SUBJECT[tag.toLowerCase()])
      .filter(Boolean)
    if (subjects.length === 1) {
      sub = subjects[0]
    } else if (subjects.length > 1) {
      sub = [...new Set(subjects)] // Remove duplicates
    }
  }

  // Build place from city and country
  const place = [hf.city, hf.country].filter(Boolean).join(', ') || 'TBD'

  return {
    title: hf.title,
    year: hf.year,
    id: hf.id,
    full_name: hf.full_name,
    link: hf.link,
    deadline,
    timezone,
    place,
    date: hf.date,
    start: hf.start,
    end: hf.end,
    hindex: hf.hindex,
    sub,
  }
}

export async function fetchExternalConferences(): Promise<Conference[]> {
  const conferences: Conference[] = []

  try {
    // Fetch all conference files in parallel
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const fetchPromises = HUGGINGFACE_CONFERENCES.map(async (confName) => {
      try {
        const url = `${HUGGINGFACE_BASE_URL}/${confName}.yml`
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) return []

        const yamlContent = await response.text()
        const parsed = yaml.load(yamlContent) as HuggingFaceConference[]

        if (!parsed || !Array.isArray(parsed)) return []

        return parsed
          .map(convertHuggingFaceToConference)
          .filter((c): c is Conference => c !== null)
      } catch {
        return []
      }
    })

    const results = await Promise.all(fetchPromises)
    clearTimeout(timeoutId)

    results.forEach(confs => conferences.push(...confs))
  } catch (error) {
    console.warn('Error fetching external conferences:', error)
  }

  return conferences
}

export async function getLocalConferences(): Promise<Conference[]> {
  try {
    const customPath = path.join(
      process.cwd(),
      'content/deadlines/custom.yaml'
    )

    if (!fs.existsSync(customPath)) {
      return []
    }

    const yamlContent = await fs.promises.readFile(customPath, 'utf8')
    const parsed = yaml.load(yamlContent)

    // Handle null/undefined (e.g., file is empty or only comments)
    if (!parsed || !Array.isArray(parsed)) {
      return []
    }

    return parsed as Conference[]
  } catch (error) {
    console.warn('Error reading local conferences:', error)
    return []
  }
}

function matchesSubject(conference: Conference, filter: SubjectFilter): boolean {
  if (filter === 'all') return true

  const sub = conference.sub
  if (Array.isArray(sub)) {
    return sub.includes(filter)
  }
  return sub === filter
}

function isRelevantConference(conference: Conference): boolean {
  const sub = conference.sub
  if (Array.isArray(sub)) {
    return sub.some(s => RELEVANT_SUBJECTS.includes(s))
  }
  return RELEVANT_SUBJECTS.includes(sub)
}

function parseDeadline(deadline: string, timezone: string): Date {
  // Handle AoE (Anywhere on Earth) timezone - UTC-12
  const date = new Date(deadline)

  if (timezone === 'UTC-12' || timezone === 'AoE') {
    // AoE is UTC-12, add 12 hours to convert to UTC
    date.setHours(date.getHours() + 12)
  }

  return date
}

function isFutureDeadline(conference: Conference): boolean {
  const deadline = parseDeadline(conference.deadline, conference.timezone)
  return deadline > new Date()
}

// Keep only the most relevant version of each conference (by title)
// Prefers: soonest upcoming deadline, or if all expired, the most recent one
function deduplicateByTitle(conferences: Conference[]): Conference[] {
  const now = new Date()
  const byTitle = new Map<string, Conference[]>()

  // Group by title
  conferences.forEach(conf => {
    const title = conf.title.toUpperCase()
    if (!byTitle.has(title)) {
      byTitle.set(title, [])
    }
    byTitle.get(title)!.push(conf)
  })

  // For each group, pick the best one
  const result: Conference[] = []
  byTitle.forEach(group => {
    // Sort by deadline
    group.sort((a, b) => {
      const dateA = parseDeadline(a.deadline, a.timezone)
      const dateB = parseDeadline(b.deadline, b.timezone)
      return dateA.getTime() - dateB.getTime()
    })

    // Find the first upcoming deadline
    const upcoming = group.find(conf => {
      const deadline = parseDeadline(conf.deadline, conf.timezone)
      return deadline > now
    })

    if (upcoming) {
      // Use the soonest upcoming one
      result.push(upcoming)
    } else {
      // All expired - use the most recent (last in sorted array)
      result.push(group[group.length - 1])
    }
  })

  return result
}

export async function getAllConferences(
  filter: SubjectFilter = 'all',
  includeExpired: boolean = false
): Promise<Conference[]> {
  const [external, local] = await Promise.all([
    fetchExternalConferences(),
    getLocalConferences(),
  ])

  // Merge conferences, with local taking precedence (by id)
  const conferenceMap = new Map<string, Conference>()

  external.forEach(conf => {
    if (isRelevantConference(conf)) {
      conferenceMap.set(conf.id, conf)
    }
  })

  // Local conferences override external ones with same id
  local.forEach(conf => {
    conferenceMap.set(conf.id, conf)
  })

  let conferences = Array.from(conferenceMap.values())

  // Filter by subject if specified
  conferences = conferences.filter(conf => matchesSubject(conf, filter))

  // Deduplicate by title - keep only the most relevant version of each conference
  conferences = deduplicateByTitle(conferences)

  // Filter to only future deadlines unless includeExpired is true
  if (!includeExpired) {
    conferences = conferences.filter(isFutureDeadline)
  }

  // Sort by deadline: upcoming first (soonest first), then expired (most recent first)
  const now = new Date()
  conferences.sort((a, b) => {
    const dateA = parseDeadline(a.deadline, a.timezone)
    const dateB = parseDeadline(b.deadline, b.timezone)
    const aExpired = dateA <= now
    const bExpired = dateB <= now

    // Upcoming conferences come before expired ones
    if (aExpired !== bExpired) {
      return aExpired ? 1 : -1
    }

    // Both upcoming: soonest first
    // Both expired: most recent first
    if (aExpired) {
      return dateB.getTime() - dateA.getTime() // Most recent expired first
    }
    return dateA.getTime() - dateB.getTime() // Soonest upcoming first
  })

  return conferences
}

export function getDaysUntilDeadline(conference: Conference): number {
  const deadline = parseDeadline(conference.deadline, conference.timezone)
  const now = new Date()
  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function getUrgency(
  daysRemaining: number
): 'critical' | 'warning' | 'normal' {
  if (daysRemaining <= 7) return 'critical'
  if (daysRemaining <= 30) return 'warning'
  return 'normal'
}

export function formatDeadline(conference: Conference): string {
  const date = parseDeadline(conference.deadline, conference.timezone)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
