# Voxel Study — transplant guide

A self-contained 2.5D voxel homepage: an orthographic low-poly room ("the
study") that opens through a door into a small courtyard. The player walks
around with WASD/arrows/click-to-path; walking up to a *station* (desk,
bookshelf, mailbox, ...) and pressing E opens a content panel. Content arrives
as one plain `WorldData` object built on the server, so the whole scene is a
client component that any Next.js App Router project can drop in. This is a
practical guide to lifting it into another project; every claim below was checked
against the code in this folder.

## What it is / features

- Orthographic R3F scene: study + courtyard, ~20 voxel furniture pieces, 11
  interactive stations, day/night lighting, a garden lamp, footstep dust.
- Movement: keyboard + on-screen joystick (touch) + tap/click-to-walk with A\*
  pathfinding; AABB wall-sliding collision.
- Content panels (About, News, Publications, Projects, Blog, Music, Life,
  Contact, Deadlines, Classic-site confirm) rendered as DOM overlays, not in WebGL.
- Hotbar / mobile bottom-sheet with auto-walk to any station, socials, CV link,
  theme + music controls.
- Accessibility: canvas is `aria-hidden`; a crawlable sr-only nav + `<noscript>`
  fallback carry the real content. Respects `prefers-reduced-motion` throughout.
- Performance: pixel-budget dpr governor, FPS-adaptive resolution + shadow tiers,
  draw-call batching, zero-allocation frame loops (detailed below).

## Requirements & dependency pins

The anchor is **React 18**: `@react-three/fiber` v9 and `@react-three/drei` v10
both require React 19, so this game stays on the last majors that support React
18. Do not bump these without moving the whole host to React 19.

| Package | Pin | Why |
| --- | --- | --- |
| `react` / `react-dom` | `^18.2` | The anchor. Everything below follows from it. |
| `@react-three/fiber` | `^8` (8.18.x) | v9 needs React 19; v8 is the last React-18 major. |
| `@react-three/drei` | `^9` (9.122.x) | v10 needs React 19 + fiber v9; v9 stays on React 18. |
| `three` | `^0.160` | Meshes/materials/lighting. Keep `@types/three` on the same `^0.160`. |
| `zustand` | `^4` (4.5.x) | Game store. Written against the v4 API. |
| `typescript` | `^5` | drei/fiber v9 ship types that need TS 5.x. |
| `next` | `^13.4` App Router | `dynamic(..., { ssr:false })` + `output: 'export'` compatible. |

`three` pulls `three/examples/jsm/utils/BufferGeometryUtils.js` (used by
`StaticMerge`); it ships with the `three` package, no extra dep.

## Mounting recipe

The scene is client-only (WebGL). Mount it through `GameLoader`, which does the
`ssr:false` dynamic import plus an error boundary and a WebGL-context-loss
fallback card. Feed it `WorldData` from a server component:

```tsx
// app/(game)/study/page.tsx  — server component
import GameLoader from 'components/game/GameLoader'
import { getWorldData } from 'lib/worldData' // replace with your aggregator

export default async function StudyPage() {
  const data = await getWorldData()
  return <GameLoader data={data} />
}
```

```tsx
// app/(game)/layout.tsx  — bare, full-viewport, no site chrome
import 'components/game/ui/kit/tokens.css' // all game CSS is scoped under .game-ui
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <div className="game-ui fixed inset-0 overflow-hidden">{children}</div>
}
```

- **Keep `ssr:false`.** three.js has no server runtime; `GameLoader` shows
  `LoadingScreen` while the chunk downloads and `GameErrorCard` if WebGL fails.
- **Use a bare layout.** The game fills the viewport; do not wrap it in a
  header/footer. Add a skip link as the first focusable element if the host has
  other pages.
- **Import `ui/kit/tokens.css` once.** Every game style is scoped under
  `.game-ui` and reads its own `--gp-*` tokens, so nothing leaks into the host.
- **Fonts.** The UI assumes a `--font-barlow` CSS variable and otherwise falls
  back to `ui-sans-serif, system-ui, sans-serif`. Supply Barlow via `next/font`
  or omit it and take the fallback. (There is no pixel font — Press Start 2P was
  retired; Barlow is the only assumed family.)

## What the host must supply (files outside `components/game/`)

The game reaches outside its folder for exactly these; bring them along or
provide equivalents:

- `types/world.ts` and `types/publication.ts` — the `WorldData` / `Publication`
  shapes (see below).
- `hooks/useDarkMode.ts` **and** its siblings `usePrefersDarkMode.ts`,
  `useSafeLocalStorage.ts` — the theme source (or a replacement that toggles
  `.dark`/`.light` on `<html>`).
- `components/icons.tsx` (the site's root icon set) — SVG glyphs used by
  `ui/stationSlots.tsx` (station/hotbar icons) and `ui/panels/ContactPanel.tsx`
  (social glyphs), keyed by string.
- A server `getWorldData(): Promise<WorldData>`. This repo's `lib/worldData.ts`
  is site-specific (fs + MDX). Write your own — it is the whole data contract.

## Data contract — `WorldData`

Build-time aggregation, **plain JSON only** (no functions, no `Date` — ISO
strings), threaded to the client as a prop. Fields and their sole consumers:

| Field | Consumed by | Host supplies |
| --- | --- | --- |
| `introCode: string` | `AboutPanel` | mdx-bundler output string, rendered by `panelMdx`. Swap the panel to render your own markup. |
| `introPlainText: string` | the sr-only + `<noscript>` SEO block on the page | plain-text synopsis for crawlers. |
| `news: {date,code}[]` | `NewsPanel` | dated items; `code` is bundled MDX. |
| `publications: Publication[]` | `PublicationsPanel` | list; `selected` splits featured vs rest. |
| `projects: ProjectMeta[]` | `ProjectsPanel` | `{title,description,year,selected}`. |
| `posts: PostMeta[]` | `BlogPanel` | `{title,slug,publishedAt,readingTimeText}`. |
| `playlist: PlaylistTrack[]` | `MusicPanel` | `{title,artist,url?}` or `[]`. |
| `nextDeadline?: Deadline` | `DeadlinePanel` | optional `{name,date}`. |
| `social: SocialLink[]` | `ContactPanel`, hotbars | `{label,url,icon}`; `icon` keys `components/icons.tsx`. |
| `cvUrl: string` | hotbar CV button | URL to a CV/resume. |

**Stubbing a panel you don't need:** delete its key from `PANEL_REGISTRY` (and
its `TITLES` entry) in `ui/PanelHost.tsx`. The station stays in the world but its
E-press becomes a no-op — `PanelHost` clears `openPanelId` when no component
resolves, so movement never locks behind a missing modal. Panels that take list
data already render an empty state, so passing `[]` also works.

## Theme contract — day/night

- **Single source:** `hooks/useDarkMode` toggles `.dark`/`.light` on `<html>`
  (persisted to `localStorage['dark-mode']`, default dark). This is the one
  writer of the theme class.
- **Lighting takes a prop.** `VoxelHome` reads `useDarkMode()` *outside* the
  `<Canvas>` and passes `<Lighting isDark={...} />`. React context/hooks do not
  cross the R3F Canvas boundary, so anything inside the canvas that needs the
  theme must receive it as a prop or read the DOM.
- **GardenLamp reads the class directly.** Being in-canvas furniture, it calls
  `document.documentElement.classList.contains('dark')` each frame instead of
  taking a prop — the `.dark` class is the cross-boundary signal.
- **Lamp -> theme bridge.** The in-canvas lamp station can't call the DOM hook,
  so it bumps `themeToggleRequests` in the zustand store; `VoxelHome` subscribes
  and flips the real theme, keeping site theme, lighting, lamp and the hotbar
  sun/moon icon in sync.
- A host with no dark mode can hardcode `class="dark"` on `<html>` and drop the
  hook.

## Performance systems (come along for free)

- **Pixel-budget dpr governor** (`systems/perfGovernor.ts`, a pure module): fill
  cost scales with `cssW*cssH*dpr^2`, so it caps physical pixels to
  `PIXEL_BUDGET` (7M, ~1440p) and picks the largest dpr within budget, floored at
  `MIN_DPR` 0.75. This alone stops 4K panels from melting.
- **FPS-adaptive layer:** drei's `PerformanceMonitor` (bounds 45-58 FPS) drives
  `dprFromFactor` to move resolution within `[MIN_DPR, maxDpr]` and `shadowTier`
  to drop the sun's shadow map to 1024 under load (base 2048 desktop / 1024 touch).
- **`?debug=1` overlay:** mounts an in-canvas sampler + a `DebugStats` box (FPS,
  DPR, physical px, shadow tier). Absent — zero cost — without the query param.
- **`StaticMerge`** (`scene/StaticMerge.tsx`): after mount, merges every static
  furniture mesh into one geometry per material to cut draw calls; animated parts
  opt out with `userData={{ dynamic: true }}`. Originals are hidden, not removed,
  so React keeps ownership.
- **Zero-allocation frame loops:** every `useFrame` reuses module-scope or
  `useRef` THREE objects (Lighting's pre-built color targets, Systems' pooled
  `Vector3`, FootstepDust's fixed particle pool). Delta is clamped to
  `DELTA_CLAMP` and motion uses `THREE.MathUtils.damp`, so it is frame-rate
  independent.

## Directory map

- `VoxelHome.tsx` — scene assembly: the `<Canvas>`, perf governor, theme ownership, lamp->theme bridge, `?debug=1` sampler. The dynamic-import target.
- `GameLoader.tsx` — client entry: `ssr:false` dynamic import + error boundary + WebGL-context-loss fallback.
- `scene/` — R3F scene graph inside the Canvas: `World`, `Player`, `CameraRig`, `Systems`, `Lighting`, `StaticMerge`, `TapInteract`, `FootstepDust`, `emotes`.
- `scene/furniture/` — voxel furniture + station meshes, plus the shared `Voxel` primitive/`PALETTE` and the reactive-prop / station-highlight hooks.
- `systems/` — logic & state: the pure modules (below) plus `worldLayout` (geometry source of truth), `store` (zustand), `useInput`, `walkTo`, `playerConfig` (movement constants), `reducedMotion`, `useIsTouch`.
- `ui/` — DOM overlay outside the Canvas: `HUD`, `Hotbar`, `HotbarSheet`, `Joystick`, `InteractButton`, `PanelHost`, `NameplateBubble`, `WelcomeToast`, `LoadingScreen`, `GameErrorCard`, `DebugStats`, `stationSlots`.
- `ui/kit/` — styled primitives + design tokens: `tokens.css`, `UiButton`, `UiPanel`, `IconSlot`, `KeyHint`, `Nameplate`, `TypewriterText`, `icons`.
- `ui/panels/` — the station content panels + the shared `panelMdx` helper.

## Pure, tested logic

Framework-free (no three/react/next imports) so they can be unit-tested and
reused:

- `systems/collision.ts` — AABB collider registry; `canMoveTo` circle-vs-box test for axis-separated wall sliding.
- `systems/interactions.ts` — station registry; `nearestInRange` resolves the station under the player.
- `systems/pathfinding.ts` — 4-connected A\* over a unit grid with blocked-cell snapping and string-pulled waypoints.
- `systems/perfGovernor.ts` — pixel-budget -> dpr / shadow-tier math (see above).

Tests live in `tests/game/`: `collision`, `interactions`, `pathfinding`,
`perfGovernor`, and `worldPathfinding` (integration — verifies indoor->outdoor
auto-walk routes through the courtyard door gap and that every station anchor is
standable). Run with `npm test` (vitest).

## Station ids & world geometry

Station ids are frozen: `about, publications, news, projects, blog, music, life,
contact, deadlines, classic, lamp` (`lamp` has no panel — it toggles day/night).
All world geometry — station anchors, colliders, spawn, room/yard bounds and the
door gap — lives in `systems/worldLayout.ts`, which is the single source both
`World.tsx` (meshes) and the collision/pathfinding grid read from. Move a piece
there and update its collider footprint in the same file.
