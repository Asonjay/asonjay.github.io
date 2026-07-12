# Voxel Game Homepage ("Jason's Voxel Study") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage with a 2.5D isometric voxel game where a pixel Jason walks around a studio room; stations open content panels; the old site survives at `/classic` (reachable via a trash-can easter egg).

**Architecture:** Next.js 13 App Router route-groups split `/` (game, client-only R3F canvas + HTML overlay UI) from `/classic` and all existing pages (unchanged chrome). Content is aggregated at build time into a serializable `WorldData` prop. Game logic lives in pure, unit-tested modules (collision, interactions, pathfinding); rendering is react-three-fiber; UI is a bespoke "tempered pixel-RPG" kit.

**Tech Stack:** three ^0.160, @react-three/fiber ^8.15 (NOT v9), @react-three/drei ^9.100 (NOT v10), zustand ^4.5, vitest ^1.6 (dev), Press Start 2P via next/font/google. React 18.2 / Next 13.4 / static export — unchanged.

**Spec:** `docs/superpowers/specs/2026-07-11-voxel-home-design.md` (Rev 2+). Read it before starting any task.

## Global Constraints

- `output: 'export'` static export — no API routes, no SSR-only features, images unoptimized.
- Do NOT upgrade next/react/react-dom. R3F stays on v8 major, drei on v9 major.
- TS 4.9 today; if drei/fiber types fail, bumping `typescript` to `^5.x` is pre-approved (verify build+lint).
- **No emoji anywhere in game UI** — inline SVG only (kit `icons.tsx`; socials reuse `components/icons.tsx`).
- **No `glass-panel`/classic-theme classes inside the game.** Game UI kit only, CSS vars scoped under `.game-ui`.
- Body/content text = Barlow (existing `--font-barlow`); `Press Start 2P` only for small labels/nameplates/key hints.
- Classic pages: URLs must not change; visual changes limited to (a) moving files into `(classic)/`, (b) one "Classic" nav link in header.
- All new game code under `components/game/`, `lib/worldData.ts`, `types/world.ts`, `tests/game/`.
- Pure modules (`collision.ts`, `interactions.ts`, `pathfinding.ts`) must not import three/react/next.
- Respect `prefers-reduced-motion` for decorative motion (bob, dust, typewriter, emotes, panel pop).
- Frame-rate independence: clamp `delta` to ≤ 1/30 and use exponential damping (`THREE.MathUtils.damp`) — never per-frame constants.
- Zero per-frame allocations inside `useFrame` loops (reuse vectors; pool particles).
- Movement constants live ONLY in `components/game/systems/playerConfig.ts` (single source of truth, table in Task 1).
- Station ids (frozen): `about, publications, news, projects, blog, music, life, contact, deadlines, classic, lamp`.
- ESLint: if `react/no-unknown-property` fires on R3F props (`position`, `args`, `intensity`…), add an `.eslintrc.json` override scoped to `components/game/**` ignoring those props — do not disable the rule globally.
- Windows dev box; quote paths containing `(` `)` in shell commands.
- Commit at the end of every task with the given message + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`. Never push to master.
- Gates for every task: `npm run build` ✅, `npm run lint` ✅, `npm test` ✅ (once vitest exists in Task 1).

---

### Task 1 (F1): Vertical slice — routes, collision, player, camera, movement feel

**Files:**
- Modify: `package.json` (deps + `"test": "vitest run"` script)
- Create: `vitest.config.ts`
- Create: `tests/game/collision.test.ts`
- Create: `components/game/systems/collision.ts`
- Create: `components/game/systems/playerConfig.ts`
- Create: `components/game/systems/worldLayout.ts`
- Create: `components/game/systems/store.ts`
- Create: `components/game/systems/useInput.ts`
- Create: `app/(classic)/layout.tsx`, move `app/page.tsx` → `app/(classic)/classic/page.tsx`
- Move: `app/blog`, `app/projects`, `app/publications`, `app/deadlines`, `app/life` → same names under `app/(classic)/`
- Modify: `app/layout.tsx` (slim to html/body/fonts/globals/Analytics; keep metadata + `className="dark"`)
- Modify: `app/fonts.tsx` (add `Press_Start_2P` export `pixelFont` with `variable: '--font-pixel'`)
- Create: `app/(game)/layout.tsx`, `app/(game)/page.tsx`
- Create: `components/game/GameLoader.tsx` (client; next/dynamic ssr:false), `components/game/ui/LoadingScreen.tsx`
- Create: `components/game/VoxelHome.tsx`, `components/game/scene/World.tsx`, `components/game/scene/Player.tsx`, `components/game/scene/CameraRig.tsx`

**Interfaces (produced — frozen for all later tasks):**

```ts
// systems/collision.ts  (pure, 2D)
export type AABB = { minX: number; minZ: number; maxX: number; maxZ: number }
export type ColliderRegistry = {
  add(box: AABB): void
  canMoveTo(x: number, z: number, radius: number): boolean  // player square vs boxes
  boxes(): readonly AABB[]
}
export function createColliderRegistry(): ColliderRegistry

// systems/worldLayout.ts — single source of truth for geometry-affecting data
export const ROOM = { minX: -12, maxX: 12, minZ: -10, maxZ: 10, wallHeight: 4 }
export type StationDef = { id: string; anchor: { x: number; z: number }; radius: number; hotbarKey?: string }
export const STATIONS: StationDef[]           // 11 entries, ids per Global Constraints
export const COLLIDERS: AABB[]                // static furniture + walls extents
export const SPAWN = { x: 0, z: 4 }

// systems/store.ts (zustand)
export type GameState = {
  moveVector: { x: number; z: number }
  autoWalk: { targetStationId: string; path: { x: number; z: number }[] } | null
  facing: number
  activeEmote: string | null
  nearbyStationId: string | null
  openPanelId: string | null
  hasSeenWelcome: boolean
  setMoveVector(v: { x: number; z: number }): void
  setAutoWalk(a: GameState['autoWalk']): void
  setNearbyStation(id: string | null): void
  openPanel(id: string | null): void
  setActiveEmote(id: string | null): void
  markWelcomeSeen(): void
}
export const useGameStore: UseBoundStore<StoreApi<GameState>>
// playerPos is transient: export const playerPosRef = { current: { x: SPAWN.x, z: SPAWN.z } }
```

**Movement constants (authoritative — put verbatim in `playerConfig.ts`):**

| Constant | Value | Meaning |
|---|---|---|
| `MOVE_SPEED` | `6` | u/s top speed |
| `ACCEL_LAMBDA` | `12` | damp λ toward target velocity |
| `DECEL_LAMBDA` | `8` | damp λ toward zero |
| `TURN_LAMBDA` | `14` | shortest-arc facing damp |
| `CAM_POS_LAMBDA` | `4` | camera position damp |
| `CAM_TARGET_LAMBDA` | `5` | camera lookAt damp |
| `PANEL_DOLLY` | `0.95` / λ `3` | zoom factor while a panel is open |
| `STRIDE_FREQ` | `15` | rad/s walk-cycle at full speed (scale by speed ratio) |
| `BOB_AMPLITUDE` | `0.05` | vertical bob |
| `LEAN_MAX` | `0.08` rad | forward body lean at full speed |
| `DELTA_CLAMP` | `1/30` | max dt |
| `PLAYER_RADIUS` | `0.35` | collision half-size |
| `VIEWSIZE_LANDSCAPE` | `12` | ortho half-height |
| `VIEWSIZE_PORTRAIT` | `15` | ortho half-height when aspect < 1 |

Character palette in the same file: hair `#1a1a1e`, skin `#f0c8a0`, hoodie `#23233a` with accent trim `var site accent ≈ #7c9aff` (hex literal, read from globals.css accent), pants `#2c2c34`, shoes `#e8e8ea`, glasses `#111114` (thin box strip across face, 0.52×0.08×0.05 at eye height).

- [ ] **Step 1: Install deps** — `npm install three@^0.160.0 @react-three/fiber@^8.15.19 @react-three/drei@^9.114.0 zustand@^4.5.5 && npm install -D vitest@^1.6.0 @types/three@^0.160.0`. If peer conflicts: stay within v8/v9 majors and retry; record final versions in the task report.
- [ ] **Step 2: vitest setup** — `vitest.config.ts` including only `tests/game/**/*.test.ts`; add `"test": "vitest run"`. Run `npm test` → expect "no test files found" exit 0 config (use `passWithNoTests: true` temporarily NOT — instead write the collision test first; it's Step 3).
- [ ] **Step 3: Write failing collision tests** (`tests/game/collision.test.ts`) — verbatim:

```ts
import { describe, it, expect } from 'vitest'
import { createColliderRegistry } from '../../components/game/systems/collision'

describe('collision', () => {
  it('allows movement in empty space', () => {
    const r = createColliderRegistry()
    expect(r.canMoveTo(0, 0, 0.35)).toBe(true)
  })
  it('blocks movement into a box', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -1, maxX: 3, maxZ: 1 })
    expect(r.canMoveTo(1.2, 0, 0.35)).toBe(false)
  })
  it('respects player radius at edges', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -1, maxX: 3, maxZ: 1 })
    expect(r.canMoveTo(0.64, 0, 0.35)).toBe(true)   // 0.64+0.35 < 1
    expect(r.canMoveTo(0.7, 0, 0.35)).toBe(false)   // 0.7+0.35 > 1
  })
  it('supports axis-separated sliding', () => {
    const r = createColliderRegistry()
    r.add({ minX: 1, minZ: -5, maxX: 2, maxZ: 5 })  // wall to the east
    expect(r.canMoveTo(0.6, 0, 0.35)).toBe(true)    // near the wall
    expect(r.canMoveTo(0.9, 0, 0.35)).toBe(false)   // X move blocked
    expect(r.canMoveTo(0.6, 1.5, 0.35)).toBe(true)  // Z slide allowed
  })
  it('handles multiple boxes', () => {
    const r = createColliderRegistry()
    r.add({ minX: -2, minZ: -2, maxX: -1, maxZ: -1 })
    r.add({ minX: 1, minZ: 1, maxX: 2, maxZ: 2 })
    expect(r.canMoveTo(0, 0, 0.35)).toBe(true)
    expect(r.canMoveTo(-1.2, -1.2, 0.35)).toBe(false)
    expect(r.canMoveTo(1.2, 1.2, 0.35)).toBe(false)
  })
})
```

- [ ] **Step 4: Run** `npm test` → expect FAIL (module not found).
- [ ] **Step 5: Implement `collision.ts`** — verbatim:

```ts
export type AABB = { minX: number; minZ: number; maxX: number; maxZ: number }
export type ColliderRegistry = {
  add(box: AABB): void
  canMoveTo(x: number, z: number, radius: number): boolean
  boxes(): readonly AABB[]
}
export function createColliderRegistry(): ColliderRegistry {
  const list: AABB[] = []
  return {
    add(box) { list.push(box) },
    canMoveTo(x, z, radius) {
      for (const b of list) {
        if (x + radius > b.minX && x - radius < b.maxX && z + radius > b.minZ && z - radius < b.maxZ) return false
      }
      return true
    },
    boxes() { return list },
  }
}
```

- [ ] **Step 6: Run** `npm test` → expect PASS (5 tests).
- [ ] **Step 7: Route restructure.** `git mv` the five page dirs + `page.tsx` per Files list (quote paths with parens). Create `(classic)/layout.tsx` containing exactly the chrome removed from root (BackgroundVideo + overlay div + MouseTracker + ambient orbs + tech-grid + Header/main/Footer + MiniPlayer, same class names); slim root layout (keep fonts/metadata/globals/Analytics/`className="dark"`; body keeps font variables incl. new `--font-pixel`). Create `(game)/layout.tsx` = `<div className="game-ui fixed inset-0 overflow-hidden">{children}</div>`. Fix imports in moved files to bare specifiers (`components/...`, `app/fonts` style) until build passes.
- [ ] **Step 8: Game page + loader.** `(game)/page.tsx` (server): imports GameLoader, passes `worldData={null}` placeholder typed `unknown` for now (Task 3 replaces), renders `<GameLoader/>` plus an sr-only `<h1>Zexin (Jason) Xu</h1>` stub (Task 7 completes SEO block). `GameLoader.tsx`: `'use client'`, `next/dynamic(() => import('./VoxelHome'), { ssr: false, loading: () => <LoadingScreen/> })`. `LoadingScreen`: full-screen dark `#0b0e1a`, centered pulsing "LOADING…" in `--font-pixel`.
- [ ] **Step 9: Scene shell.** `VoxelHome.tsx`: `<Canvas orthographic dpr={[1,2]} gl={{ antialias: true, powerPreference: 'high-performance' }} shadows>` + `<World/>` + `<Player/>` + `<CameraRig/>`, temp lighting (ambient 0.6 + one shadow-casting directional 0.8, shadow map 2048). `World.tsx`: checkerboard floor as ONE `InstancedMesh` (two-tone via `setColorAt`), N/E full walls + S/W knee walls from `ROOM`. The collider registry lives in `worldLayout.ts` (pure): `export const worldColliders = (() => { const r = createColliderRegistry(); for (const b of COLLIDERS) r.add(b); return r })()` — World renders FROM the same data; components never own collision state. `worldLayout.ts`: ROOM/SPAWN/STATIONS (anchors: about `(4,-8)`, publications `(-2,-6.5)`, news `(10,-5)`, projects `(9.5,0)`, blog `(10,5)`, music `(-6.7,6)`, life `(-9,-4.5)`, contact `(3.4,8.6)`, deadlines `(7.5,-8)`, classic `(0.9,8.6)`, lamp `(7.2,-3)`; radius 1.6 each) + wall/furniture COLLIDERS placeholder (walls now; furniture boxes added in Task 2; stations may shift ±1u in Task 2 for visual balance but keep ≥3u separation, updating this file only).
- [ ] **Step 10: Player + input + camera with the FEEL package.** `useInput.ts`: WASD/arrows → normalized `moveVector` in store (E/Esc handled in later tasks; ignore keys when `openPanelId !== null`). `Player.tsx`: voxel Jason per palette; per-frame in `useFrame`: clamp dt; velocity damped toward `moveVector * MOVE_SPEED` (ACCEL vs DECEL λ); axis-separated `worldColliders.canMoveTo` X-then-Z; facing = shortest-arc damp toward `atan2`; limb swings eased sin with phase offset; lean; bob; squash-stretch scale `1±0.04` on |accel|; writes `playerPosRef`. `CameraRig.tsx`: ortho zoom from viewport aspect (`VIEWSIZE_*`), position/lookAt damped (CAM_*_LAMBDA) toward player + (20,20,20).
- [ ] **Step 11: Gates.** `npm test` ✅ · `npm run lint` ✅ (apply the eslint override if R3F props flagged) · `npm run build` ✅ then verify `out/` contains `/index.html` (game), `/classic/index.html`, `/blog`, `/publications`, `/projects`, `/deadlines`, `/life` — same route list as baseline plus `/classic`.
- [ ] **Step 12: Commit** — `feat(game): F1 vertical slice — routes split, collision, player movement feel, damped camera`

---

### Task 2 (F2): Furniture, stations, interactions, emotes, reactive props

**Files:**
- Create: `tests/game/interactions.test.ts`, `components/game/systems/interactions.ts`
- Create: `components/game/scene/furniture/Voxel.tsx` (shared box helper w/ material cache) and one file per station: `Desk.tsx`, `NoticeBoard.tsx`, `TvConsole.tsx` (+sofa), `Bookshelf.tsx`, `Jukebox.tsx`, `PhotoWall.tsx` (+bed), `Mailbox.tsx`, `AboutWall.tsx`, `WallCalendar.tsx`, `Lamp.tsx`, `TrashCan.tsx`, plus `SmallProps.tsx` (chair, paper stacks, potted plant, rug)
- Create: `components/game/scene/emotes.ts` (procedural pose clips) — consumed by `Player.tsx`
- Modify: `World.tsx` (mount furniture; furniture registers colliders + stations), `worldLayout.ts` (final furniture COLLIDERS), `Player.tsx` (emote playback), `store.ts` (no shape change)
- Create: `components/game/ui/NameplateBubble.tsx` (screen-space hint above station, kit-lite styling until Task 3 kit lands — plain styled div, refactored in Task 3)

**Interfaces:**
- Consumes: `worldColliders`, `STATIONS`, store, `playerPosRef`.
- Produces:

```ts
// systems/interactions.ts (pure)
export type Station = { id: string; x: number; z: number; radius: number }
export function createStationRegistry(): {
  add(s: Station): void
  nearestInRange(px: number, pz: number): string | null   // nearest wins; null if none in radius
  get(id: string): Station | undefined
  all(): readonly Station[]
}
// scene/emotes.ts
export type EmoteId = 'wave'|'type'|'sit'|'lean'|'pullBook'|'sway'|'mailbox'|'scratch'|'pullCord'|'peek'
export const EMOTES: Record<EmoteId, { duration: number; pose(t: number, rig: PlayerRig): void }>
export type PlayerRig = { body: Object3D; head: Object3D; armL: Object3D; armR: Object3D; legL: Object3D; legR: Object3D; root: Object3D }
export const STATION_EMOTE: Record<string, EmoteId>  // about→wave, publications→type, projects→sit, blog→pullBook, music→sway, news/life→lean, contact→mailbox, deadlines→scratch, lamp→pullCord, classic→peek
```

- [ ] **Step 1: Failing tests** (`tests/game/interactions.test.ts`) — verbatim:

```ts
import { describe, it, expect } from 'vitest'
import { createStationRegistry } from '../../components/game/systems/interactions'

describe('interactions', () => {
  const make = () => {
    const r = createStationRegistry()
    r.add({ id: 'desk', x: 0, z: 0, radius: 1.6 })
    r.add({ id: 'shelf', x: 3, z: 0, radius: 1.6 })
    return r
  }
  it('returns null when nothing in range', () => {
    expect(make().nearestInRange(10, 10)).toBe(null)
  })
  it('returns the station in range', () => {
    expect(make().nearestInRange(0.5, 0.5)).toBe('desk')
  })
  it('returns the nearest when multiple stations are in range', () => {
    const r = make()
    expect(r.nearestInRange(1.4, 0)).toBe('desk')   // desk 1.4, shelf 1.6 — both in range, desk nearer
    expect(r.nearestInRange(1.55, 0)).toBe('shelf') // desk 1.55, shelf 1.45 — shelf nearer
  })
  it('boundary is inclusive', () => {
    expect(make().nearestInRange(-1.6, 0)).toBe('desk')  // exactly at radius; shelf far out of range
  })
  // (2026-07-11 controller fix: original test #3/#4 had wrong arithmetic that contradicted
  // nearest-wins semantics; corrected during Task 2 execution — see progress ledger.)
})
```

- [ ] **Step 2: Run → FAIL. Implement `interactions.ts` (registry + squared-distance scan). Run → PASS.**
- [ ] **Step 3: Furniture.** Build each station's furniture from `Voxel` boxes (module-level shared geometry + `MeshLambertMaterial` cache keyed by color). Palette: extend the prototype's material colors (wood `#3d2314`/`#d2b48c`, fabric `#4169e1`/`#b22222`/`#f8f8ff`, metal `#708090`, leaf `#228b22`). Each furniture file exports its component AND its collider extents get added to `worldLayout.COLLIDERS` (keep ~0.05 inset like the prototype). Requirements per station (visual detail is the implementer's craft; these are the minimums): Desk=desk+chair+laptop(emissive screen)+two paper stacks; TvConsole=wall TV(emissive)+console box+sofa facing it; Bookshelf=5 shelves, ≥12 colored book spines; Jukebox=rounded top box+emissive grill; PhotoWall=bed+4 wall frames; Mailbox=post+box+flag(rotatable); AboutWall=2 framed posters+diploma; WallCalendar=calendar quad w/ grid lines; Lamp=pole+shade(point light mount); TrashCan=cylinderish body(6-8 boxes)+separate lid mesh (hinged for peek emote); SmallProps=rug quad(0.02 raise), potted plant, loose papers.
- [ ] **Step 4: Interaction loop.** In `VoxelHome` (or a `Systems` component): per-frame `nearestInRange(playerPosRef)` → `setNearbyStation` (only on change). `NameplateBubble` renders station display name + key hint ("E") above the station, projected to screen via `camera.project` into an absolutely-positioned div (updates via rAF ref, not React state per frame). Nearby station's furniture gets emissive pulse (damped sine, respects reduced-motion).
- [ ] **Step 5: Emotes.** `emotes.ts` clips are pure functions posing the rig over normalized t∈[0,1], each ≤1.5s, eased (`easeInOutQuad`), auto-return to neutral. `Player.tsx`: when `activeEmote` set → freeze locomotion, play clip, clear emote on finish. Pressing E near a station: `setActiveEmote(STATION_EMOTE[id])` then `openPanel(id)` **when the clip reaches 60%** (feels causal; panel host arrives Task 3 — until then openPanel just sets state; guard unknown panels). Sit-type emotes (`type`, `sit`) hold the pose while the panel stays open; on close, return to neutral. Lamp/classic stations: E triggers emote + placeholder action (`console.warn('panel pending')` acceptable this task only for classic; lamp toggles nothing until Task 4 — animate cord pull only). TrashCan lid pops open during `peek`.
- [ ] **Step 6: Reactive props + footstep dust.** Chair/plant/paper-stacks/trash-lid: on player AABB overlap with a slightly larger trigger box → spring-damped rotation/offset impulse (pooled spring state, no allocs). Rug corner: scale-y dip when stepped on. Footstep dust: pool of 8 small quads (0.15u, soft-white 0.5→0 opacity, rise 0.2u over 400ms), one emitted at each stride hit (walk-cycle zero-crossing) while moving. All gated by reduced-motion.
- [ ] **Step 6b: Static merge pass.** Furniture roots mark `userData.static = true`; meshes that animate or change emissive (TV/laptop/jukebox screens, trash lid, mailbox flag, chair/plant/paper reactive props, lamp shade) mark `userData.dynamic = true`. After mount, a `StaticMerge` component traverses the scene once, groups `static` (non-dynamic) meshes by material, bakes world transforms, `BufferGeometryUtils.mergeGeometries` per group, replaces originals. Target ≤ ~60 draw calls total (log `renderer.info.render.calls` once in dev to verify; note the number in the task report).
- [ ] **Step 7: Gates + commit** — `npm test` (9 tests) · lint · build. Commit: `feat(game): F2 stations, furniture, contextual emotes, reactive props`

---

### Task 3 (F3): UI kit, WorldData, panels

**Files:**
- Create: `types/world.ts`, `lib/worldData.ts`
- Create: `components/game/ui/kit/{tokens.css,PixelPanel.tsx,Nameplate.tsx,PixelButton.tsx,KeyHint.tsx,TypewriterText.tsx,PixelDivider.tsx,IconSlot.tsx,icons.tsx}`
- Create: `components/game/ui/PanelHost.tsx` + `components/game/ui/panels/{AboutPanel,NewsPanel,PublicationsPanel,ProjectsPanel,BlogPanel,MusicPanel,LifePanel,ContactPanel,DeadlinePanel,ClassicConfirm}.tsx`
- Modify: `app/(game)/page.tsx` (build real WorldData), `GameLoader.tsx`/`VoxelHome.tsx` (thread prop), `NameplateBubble.tsx` (restyle with kit)

**Interfaces:**
- Consumes: store (`openPanelId`, `openPanel`), station ids.
- Produces: `WorldData` exactly as spec §3.3 (copy the type verbatim from the spec, including `cvUrl: string` = `'/cv/Zexin_Xu_CV.pdf'`); `lib/worldData.ts` exports `export async function getWorldData(): Promise<WorldData>`; kit props: `PixelPanel {title, onClose, children}`, `PixelButton {href?|onClick?, children, variant?: 'solid'|'ghost'}`, `TypewriterText {text, speed?}`, `IconSlot {icon: ReactNode, label, onClick|href, active?, hotkey?}`; `PANEL_REGISTRY: Record<string, ComponentType<{data: WorldData}>>` in PanelHost.

- [ ] **Step 1: `worldData.ts`.** Reuse existing readers: `getAllNews()` (mdx code strings), `getAllPublications()`, projects/posts frontmatter readers from `lib/mdx.ts`, introduction via the same bundling path `components/introduction.tsx` uses (extract to lib if needed). Playlist parser (verbatim):

```ts
function parsePlaylist(md: string) {
  return md.split('\n')
    .map(l => l.match(/^-\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(\S+)\s*$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map(m => ({ title: m[1], artist: m[2], url: m[3] }))
}
```

Deadlines: read `content/deadlines/custom.yaml` with `js-yaml` (already a dep); `nextDeadline` = the soonest entry with date ≥ `NEXT_PUBLIC_BUILD_DATE` (build-time constant — do NOT call `new Date()` in client components; compute in `getWorldData()` on the server at build). Social list = the 5 links hardcoded on the classic homepage. Everything must be JSON-serializable (verify with a `JSON.parse(JSON.stringify(...))` roundtrip in dev).
- [ ] **Step 2: Kit.** `tokens.css` (imported by game layout): `.game-ui{}` scope defining `--gp-bg`, `--gp-border`, `--gp-text`, `--gp-accent`, `--gp-glow` with `.dark`/`.light` variants (night: bg `#0e1226f2`, border/accent `#7c9aff`, text `#f2f4ff`; day: bg `#f7efdcf7`, border `#8a5a2b`, accent `#c47a2c`, text `#2b2117`). Pixel-stair corners: 8px staircase via layered `box-shadow` or `clip-path` (pick one, consistent). `PixelPanel`: nameplate tab top-left (`--font-pixel`, 10-11px), body Barlow 14-15px, 150ms pop-in (scale .96→1 + fade, `cubic-bezier(.34,1.56,.64,1)`), reduced-motion→fade only. `icons.tsx`: 16×16-viewBox pixel-style SVGs (crisp `shape-rendering: crispEdges`, 2px module grid): id-card, desk/paper, newspaper, gamepad, book, note, photo, envelope, calendar, trash, play, pause, sun, moon. **No emoji.**
- [ ] **Step 3: PanelHost + panels.** PanelHost: renders over canvas when `openPanelId` non-null AND in `PANEL_REGISTRY`; backdrop (`rgba(0,0,0,.45)`) click / Esc / ✕ close (`openPanel(null)`); desktop centered `max-w-2xl`; focus moves into panel on open, returns to body on close. Panels (content rules): About=intro via `getMDXComponent(introCode)` + name header; News=year-grouped list rendering each item's `code`; Publications=selected-first (`selected` flag), venue+year+PDF/DOI/code `PixelButton`s, footer link `/publications`; Projects=title/year/description cards, footer `/projects`; Blog=title+date+readingTime rows linking `/blog/[slug]`; Music=playlist rows (index, title, artist; url → external link icon); Life=short teaser text + button `/life`; Contact=social buttons (reuse `components/icons.tsx` glyphs inside `PixelButton`) + mailto; Deadline=`nextDeadline` name + date + days-remaining (computed from `NEXT_PUBLIC_BUILD_DATE`, NOT `new Date()` — avoids hydration/staleness lies; label it "as of last build") + button `/deadlines`; ClassicConfirm=one-liner "Dig up the old website?" + buttons [Visit /classic] [Close].
- [ ] **Step 4: Wire.** `(game)/page.tsx` awaits `getWorldData()` → GameLoader → VoxelHome → PanelHost. E-interaction from Task 2 now opens real panels (remove Task-2 guards). Movement locked while open (already: useInput checks `openPanelId`).
- [ ] **Step 5: Gates + commit** — build must show `/` still static-exported with data baked in (grep `out/index.html` for a known publication title as smoke check via the SEO block? content is in JS payload — instead verify `out/_next` chunk contains a known title string). Commit: `feat(game): F3 pixel-RPG UI kit, WorldData pipeline, content panels`

---

### Task 4 (F4): Day/night lighting

**Files:**
- Create: `components/game/scene/Lighting.tsx`
- Modify: `VoxelHome.tsx` (replace temp lights), `Lamp.tsx` (wire toggle), `World.tsx` (neon strip mesh above TV), kit `tokens.css` already theme-aware (no change expected)

**Interfaces:** Consumes `useDarkMode()` (existing hook — localStorage `dark-mode`, `.dark`/`.light` on `<html>`). Produces none new.

**Light inventory (authoritative):**

| Light | Day | Night |
|---|---|---|
| Background color | `#87ceeb` | `#0b0e1a` |
| Hemisphere/ambient | `#ffffff` ×0.65 | `#334` tint ×0.25 |
| Directional "sun" (casts shadow, through window direction) | `#fff4e0` ×0.9 | ×0.0 |
| Floor-lamp PointLight | ×0 | `#ffb066` ×1.2, distance 7 |
| Desk-lamp PointLight | ×0 | `#ffd9a0` ×0.8, distance 5 |
| Neon strip (emissive mesh + faint PointLight) | emissive 0.1 | accent `#7c9aff` emissive 1.0, light ×0.5 |

- [ ] **Step 1:** `Lighting.tsx` holds refs to all lights; `useFrame` damps every intensity/color toward the current mode's targets (λ=3 ≈ 1s settle). Background via `scene.background` color lerp. Shadow only on the sun (2048 desktop / 1024 when `navigator.maxTouchPoints > 0`).
- [ ] **Step 2:** Lamp station: E → `pullCord` emote; at 50% clip → `setIsDark(!isDark)` through `useDarkMode`. Verify `/classic` opened in another tab follows (same localStorage + class).
- [ ] **Step 3: Gates + commit** — `feat(game): F4 day/night lighting synced with site theme`

---

### Task 5 (F5): Pathfinding + Hotbar

**Files:**
- Create: `tests/game/pathfinding.test.ts`, `components/game/systems/pathfinding.ts`
- Create: `components/game/ui/Hotbar.tsx`
- Modify: `VoxelHome.tsx` (mount), `Player.tsx` (follow autoWalk waypoints), `useInput.ts` (manual input cancels autoWalk; number keys 1–9,0 map to the ten hotbar stations in spec order), `store.ts` (no shape change)

**Interfaces:**
- Produces (pure):

```ts
// systems/pathfinding.ts
export type GridSpec = { minX: number; minZ: number; maxX: number; maxZ: number; blocked(cx: number, cz: number): boolean }
export function findPath(grid: GridSpec, from: {x:number,z:number}, to: {x:number,z:number}): {x:number,z:number}[] | null
// 4-connected A* on 1-unit cells (cell center = integer+0.5), Manhattan heuristic,
// returns world-coord waypoints INCLUDING adjusted goal, string-pulled with lineClear();
// returns null if start/goal cell blocked after nearest-open-cell snap (search ring ≤2 cells).
```

- Grid adapter in `worldLayout.ts`: `export function makeGrid(): GridSpec` — cell blocked iff its center point fails `worldColliders.canMoveTo(cx, cz, PLAYER_RADIUS)`.

- [ ] **Step 1: Failing tests** — verbatim:

```ts
import { describe, it, expect } from 'vitest'
import { findPath } from '../../components/game/systems/pathfinding'

const openGrid = { minX: 0, minZ: 0, maxX: 10, maxZ: 10, blocked: () => false }
const walled = { ...openGrid, blocked: (x: number, z: number) => x === 5 && z < 8 }

describe('pathfinding', () => {
  it('straight line in open space collapses to few waypoints', () => {
    const p = findPath(openGrid, { x: 1.5, z: 1.5 }, { x: 8.5, z: 1.5 })!
    expect(p[p.length - 1].x).toBeCloseTo(8.5)
    expect(p.length).toBeLessThanOrEqual(2)
  })
  it('routes around a wall', () => {
    const p = findPath(walled, { x: 2.5, z: 2.5 }, { x: 8.5, z: 2.5 })!
    expect(p).not.toBeNull()
    expect(p.some(w => w.z > 7.5)).toBe(true)          // detours over the gap
    expect(p.every(w => !(Math.floor(w.x) === 5 && w.z < 8))).toBe(true)
  })
  it('returns null when goal is enclosed', () => {
    const boxed = { ...openGrid, blocked: (x: number, z: number) =>
      (Math.abs(x - 5) === 2 && Math.abs(z - 5) <= 2) || (Math.abs(z - 5) === 2 && Math.abs(x - 5) <= 2) }
    expect(findPath(boxed, { x: 1.5, z: 1.5 }, { x: 5.5, z: 5.5 })).toBe(null)
  })
  it('snaps a blocked goal cell to the nearest open neighbor', () => {
    const p = findPath(walled, { x: 2.5, z: 2.5 }, { x: 5.5, z: 2.5 })!  // goal on the wall
    expect(p).not.toBeNull()
    const last = p[p.length - 1]
    expect(walled.blocked(Math.floor(last.x), Math.floor(last.z))).toBe(false)
  })
})
```

- [ ] **Step 2: Run → FAIL. Implement A* + snap + string-pull** (binary-heap not required — grid ≤ 24×20, plain array open-set fine; `lineClear` samples every 0.25u). Run → PASS.
- [ ] **Step 3: Auto-walk.** Hotbar slot / number key → `findPath(makeGrid(), playerPosRef.current, station.anchor)`; null → flash the slot (shake 200ms) and do nothing; else `setAutoWalk({targetStationId, path})`. Player consumes waypoints through the SAME damped-velocity movement (steer to next waypoint, pop at <0.3u); on final arrival → emote → panel (reuse Task 2 flow). ANY manual move input or Esc cancels autoWalk.
- [ ] **Step 4: Hotbar UI.** Kit-styled bottom-center bar (desktop ≥md only; mobile version is Task 6): 10 `IconSlot`s in spec order with hotkey badges (1–9,0) + divider + music button + sun/moon toggle (same `useDarkMode`) + divider + 5 social `IconSlot`s (glyphs from `components/icons.tsx`) + CV `PixelButton` → `worldData.cvUrl` (new tab). Nearby station's slot gets the active highlight. Music button: attempt to reuse MiniPlayer's audio core ONLY if it's cleanly extractable (≤ ~30-line change to `miniPlayer.tsx` exporting a hook); otherwise the button opens the Music panel — decide by reading `components/miniPlayer.tsx` first and note the choice in the task report.
- [ ] **Step 5: Gates + commit** — 13 tests total. `feat(game): F5 hotbar with A* auto-walk, socials, CV, theme + music controls`

---

### Task 6 (F6): Mobile & responsive

**Files:**
- Create: `components/game/ui/Joystick.tsx`, `components/game/ui/InteractButton.tsx`, `components/game/ui/HotbarSheet.tsx` (collapsed mobile menu)
- Modify: `Hotbar.tsx` (breakpoint switch), `PanelHost.tsx` (bottom-sheet variant), `CameraRig.tsx` (portrait viewSize — likely already from Task 1 constants; verify), `VoxelHome.tsx` (tap-to-interact raycast, DPR/shadow caps), `NameplateBubble.tsx` (hide key hint on touch, show "tap")

**Interfaces:** consumes store only.

- [ ] **Step 1: Joystick.** Pointer-events pad (fixed bottom-left, 120px base + 48px thumb, `touch-action:none`, safe-area padded): drag vector → normalized `setMoveVector` (dead-zone 0.15, magnitude scales speed); pointerup → zero + cancel; multi-touch safe (track pointerId). Render only when `('ontouchstart' in window) || navigator.maxTouchPoints > 0` (state set once on mount — no SSR concern, canvas is ssr:false).
- [ ] **Step 2: InteractButton** (fixed bottom-right, 64px, kit-styled "!"): visible when `nearbyStationId && !openPanelId`; tap = same flow as E.
- [ ] **Step 3: Tap-to-interact.** Canvas `onPointerUp` (taps, not drags — displacement <8px): raycast into station furniture groups (each furniture root carries `userData.stationId`); if hit within 2.2u of player → interact; if farther → auto-walk to it (reuse Task 5 flow). This makes the whole scene tappable on mobile AND clickable on desktop.
- [ ] **Step 4: Mobile chrome.** `HotbarSheet`: bottom-center menu button (between joystick and interact button, 44px) fanning out a kit sheet: 10-station grid (2×5) + controls row (music, theme) + socials row + CV. Panels on <md: full-width bottom sheet, `max-h-[80dvh]`, `overflow-y-auto`, drag-free (✕ to close), safe-area bottom padding.
- [ ] **Step 5: Perf caps.** On touch devices: shadow map 1024 (from Task 4), `dpr={[1, 1.75]}`. Confirm no per-frame allocations (spot-check useFrame bodies).
- [ ] **Step 6: Gates + commit** — also verify desktop unaffected (joystick absent). `feat(game): F6 mobile joystick, tap interact, bottom sheets, perf caps`

---

### Task 7 (F7): Polish, fallbacks, SEO, a11y

**Files:**
- Modify: `app/(game)/page.tsx` (full SEO block), `components/game/GameLoader.tsx` (ErrorBoundary)
- Create: `components/game/ui/{WelcomeToast.tsx,GameErrorCard.tsx}`
- Modify: `PanelHost.tsx` (focus trap + aria), `components/header.tsx` (add "Classic" nav item), `app/sitemap.ts` (add `/classic`), `app/(game)/layout.tsx` (skip link)
- Audit: all decorative motion behind `prefers-reduced-motion` (grep for animation code; fix stragglers)

- [ ] **Step 1: SEO block.** In `(game)/page.tsx`, before GameLoader: visually-hidden (`position:absolute; width/height:1px; clip-path`) but crawlable section — `<h1>Zexin (Jason) Xu</h1>`, the intro paragraph text (plain-text version derived at build from introduction.mdx), and a `<nav>` of links: /classic, /publications, /projects, /blog, /life, /deadlines. Plus `<noscript>` visible card with the same links.
- [ ] **Step 2: Skip link.** First focusable in game layout: "Skip the 3D — go to classic site" → `/classic`, visible on focus (kit-styled).
- [ ] **Step 3: ErrorBoundary.** Class component in GameLoader wrapping the dynamic component; catch → `GameErrorCard` (kit panel: "The 3D room couldn't load." + PixelButton → /classic). Also handle WebGL-context-lost via `gl.domElement.addEventListener('webglcontextlost')` → same card.
- [ ] **Step 4: WelcomeToast + HUD.** First visit (`hasSeenWelcome` false → localStorage): kit toast above the hotbar: desktop "WASD / arrows to walk · E to interact"; touch "Drag the joystick to walk · tap ! to interact"; auto-dismiss 6s or on first interaction; sets flag. Also create `components/game/ui/HUD.tsx`: persistent top-left mini plate — "JASON'S VOXEL STUDY" in `--font-pixel` (11px) + one-line hint that fades to 40% opacity after 8s. No emoji.
- [ ] **Step 5: Focus & aria.** PanelHost: `role="dialog"` `aria-modal` `aria-labelledby` (nameplate id); trap Tab within panel (small manual trap: keydown handler cycling focusables); restore focus on close. Hotbar/joystick/interact `aria-label`s. Canvas container `aria-hidden` (SEO block + panels are the accessible surface).
- [ ] **Step 6: Header + sitemap.** Add "Classic" link in `components/header.tsx` nav (and mobileNav if it lists routes) pointing `/classic`; `app/sitemap.ts` gains `/classic` entry.
- [ ] **Step 7: Reduced-motion audit + final gates.** Toggle `prefers-reduced-motion` in devtools-equivalent reasoning (code review): bob/dust/typewriter/pop/emote-flourish all gated. Full gates + route-list diff vs baseline (`/` game, `/classic` added, everything else identical). Commit: `feat(game): F7 SEO/noscript, error fallback, welcome toast, a11y, classic nav`

---

## Post-plan verification (lead)

1. Full playtest checklist from spec §10 against `npm run dev`.
2. `npm run build` route/size report vs baseline (classic pages' First-Load JS must be within ±2KB of 78KB baseline — proves three.js didn't leak into shared chunks).
3. Push branch, open **draft PR** to master with summary + playtest checklist. Never push master.
