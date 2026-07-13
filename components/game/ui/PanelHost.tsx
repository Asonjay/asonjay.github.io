'use client'
import { useEffect } from 'react'
import type { ComponentType } from 'react'
import { useGameStore } from '../systems/store'
import type { WorldData } from '../../../types/world'
import { UiPanel } from './kit/UiPanel'
import { AboutPanel } from './panels/AboutPanel'
import { NewsPanel } from './panels/NewsPanel'
import { PublicationsPanel } from './panels/PublicationsPanel'
import { ProjectsPanel } from './panels/ProjectsPanel'
import { BlogPanel } from './panels/BlogPanel'
import { MusicPanel } from './panels/MusicPanel'
import { LifePanel } from './panels/LifePanel'
import { ContactPanel } from './panels/ContactPanel'
import { DeadlinePanel } from './panels/DeadlinePanel'
import { ClassicConfirm } from './panels/ClassicConfirm'

// Station id -> panel component. Keys are the frozen station ids; `lamp` has no
// panel (its E-press toggles day/night in a later task), so it is absent.
export const PANEL_REGISTRY: Record<string, ComponentType<{ data: WorldData }>> = {
  about: AboutPanel,
  news: NewsPanel,
  publications: PublicationsPanel,
  projects: ProjectsPanel,
  blog: BlogPanel,
  music: MusicPanel,
  life: LifePanel,
  contact: ContactPanel,
  deadlines: DeadlinePanel,
  classic: ClassicConfirm,
}

const TITLES: Record<string, string> = {
  about: 'About',
  news: 'News',
  publications: 'Publications',
  projects: 'Projects',
  blog: 'Blog',
  music: 'Music',
  life: 'Life',
  contact: 'Contact',
  deadlines: 'Deadlines',
  classic: 'Classic',
}

export function PanelHost({ data }: { data: WorldData }) {
  const openId = useGameStore(s => s.openPanelId)
  const openPanel = useGameStore(s => s.openPanel)
  const Panel = openId ? PANEL_REGISTRY[openId] : undefined

  // Safety net: if openPanelId is set to something without a panel (should never
  // happen — lamp never opens a panel), clear it so movement doesn't stay locked
  // behind an invisible modal.
  useEffect(() => {
    if (openId && !Panel) openPanel(null)
  }, [openId, Panel, openPanel])

  // PanelHost owns Escape while a panel is open (Player's handler stands down).
  useEffect(() => {
    if (!Panel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') openPanel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [Panel, openPanel])

  if (!openId || !Panel) return null
  const title = TITLES[openId] ?? openId

  return (
    <div className="gp-backdrop gp-panel-backdrop" onClick={() => openPanel(null)}>
      <div className="gp-panel-shell" onClick={e => e.stopPropagation()}>
        <UiPanel title={title} onClose={() => openPanel(null)}>
          <Panel data={data} />
        </UiPanel>
      </div>
    </div>
  )
}
