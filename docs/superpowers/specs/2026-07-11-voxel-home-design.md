# Jason's Voxel Study — 3D Game Homepage Design

**Date:** 2026-07-11
**Status:** Approved by Jason (structure, theme, lighting, character, tech stack, workflow)
**Prototype reference:** `new_template/react-app (13).js` (2.5D voxel house explorer, plain three.js)

## 1. Overview

Rebuild the site homepage as a 2.5D isometric voxel game. The visitor controls a pixel
version of Jason walking around a voxel study/apartment. Walking up to furniture
("stations") opens glassmorphism info panels populated with the site's real content
(publications, news, projects, blog, music, life, contact, about, deadlines).

Approved decisions:

| Decision | Choice |
|---|---|
| Site structure | Game at `/`; current homepage preserved at `/classic`; all other classic pages unchanged |
| World theme | Single-room voxel study/apartment (expanded from the prototype's 16×16 room) |
| Lighting | Day/night, synced with the existing light/dark theme toggle |
| Character | Custom pixel Jason (procedural boxes; black hair, glasses, hoodie) |
| Tech | react-three-fiber ecosystem, no framework upgrade, no external 3D assets |

Out of scope for v1 (YAGNI): jumping/physics engine, camera rotation/zoom, NPCs/dialogue,
sound effects, save systems, multiplayer, outdoor areas.

## 2. Tech Stack

New dependencies (all compatible with the existing React 18.2 / Next 13.4 / TS 4.9 setup —
**no framework upgrade**):

| Package | Version | Purpose |
|---|---|---|
| `three` | `^0.160.0` | WebGL engine |
| `@react-three/fiber` | `^8.15.0` | React renderer for three (v8 = React 18 compatible; do NOT use v9) |
| `@react-three/drei` | `^9.100.0` | Helpers (v9 = R3F v8 compatible; do NOT use v10) |
| `zustand` | `^4.5.0` | Game state store (player pos, active station, open panel, input) |
| `vitest` (dev) | `^1.6.0` | Unit tests for pure logic modules only |

Contingency: if drei/fiber type definitions require TS 5, bump `typescript` to `^5.x`
(supported by Next 13.4; verify `npm run build` + `npm run lint` still pass).

Everything in the world — room, furniture, player — is procedural `BoxGeometry`.
No GLTF/textures/downloads. This preserves the prototype's voxel aesthetic, loads
instantly, and avoids licensing and asset-pipeline work.

## 3. Architecture

### 3.1 Routes (route groups)

The root layout currently hard-wires Header/Footer/BackgroundVideo/orbs/MiniPlayer around
every page. Split with route groups so the game gets a bare full-viewport layout:

```
app/
  layout.tsx                 → slimmed: html/body, fonts, globals.css, Analytics ONLY
  (classic)/
    layout.tsx               → BackgroundVideo, orbs, MouseTracker, Header, Footer, MiniPlayer
    classic/page.tsx         → current app/page.tsx moved here verbatim (route: /classic)
    blog/…  projects/…  publications/…  deadlines/…  life/…   → moved, routes unchanged
  (game)/
    layout.tsx               → minimal full-viewport wrapper (no chrome)
    page.tsx                 → route: /  — server component; builds WorldData; renders GameLoader
```

Constraints:
- `output: 'export'` static export only — no API routes, no SSR-only features.
- Moving pages into `(classic)/` must not change their URLs (route groups don't affect paths).
- Keep the root `metadata` export intact (site title/OG/robots) — the game page keeps full SEO metadata.
- `app/error.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/fonts.tsx` stay at root; sitemap gains `/classic`.
- Header nav and mobileNav gain nothing in v1; classic pages keep linking among themselves. The
  Header logo (points to `/`) now leads to the game — add a "Classic" link in the header nav
  pointing to `/classic` so visitors on classic pages don't get trapped into the game.

### 3.2 Game entry & code-splitting

```
(game)/page.tsx  (server)
  └─ builds WorldData via lib/worldData.ts (fs reads at build time)
  └─ renders <section> with visually-hidden h1/intro/nav links (SEO + screen readers) + <noscript>
  └─ <GameLoader worldData={…}>  (client wrapper)
        └─ next/dynamic(() => import('components/game/VoxelHome'), { ssr: false, loading: <LoadingScreen/> })
```

Three.js never enters the bundle of classic pages.

### 3.3 Data flow (`lib/worldData.ts`, `types/world.ts`)

Build-time aggregation into one serializable object (plain JSON — no functions, no Dates;
dates as ISO strings):

```ts
type WorldData = {
  introHtml: string                 // introduction.mdx rendered to HTML (or plain-text summary)
  news: { date: string; html: string }[]
  publications: Publication[]       // reuse lib/publications.ts parser output
  projects: ProjectMeta[]           // frontmatter only (title, description, year, selected)
  posts: PostMeta[]                 // frontmatter + slug + readingTime
  playlist: Track[]                 // mirror the shape musicPlayer.tsx already parses from content/playlist.md — extract that parser into lib/ and share it
  nextDeadline?: { name: string; date: string }   // from content/deadlines/custom.yaml
  social: { label: string; url: string; icon: string }[]
}
```

Reuse the existing readers (`lib/publications.ts`, `lib/mdx.ts` frontmatter functions,
news/deadlines loaders). Do not fork parsing logic. If a reader only exists as a server
component's internal logic, extract it into `lib/` and have both consumers share it.

MDX-rendered content (intro, news bodies) is passed as pre-rendered HTML strings and
injected with `dangerouslySetInnerHTML` inside panels (content is trusted, authored by Jason).

### 3.4 Directory layout (new code)

```
components/game/
  VoxelHome.tsx            client entry: <Canvas> + overlay UI, wires store ↔ worldData
  scene/
    World.tsx              floor, walls, window, rug, static props, lighting rig mount
    furniture/             one file per station (Desk.tsx, NoticeBoard.tsx, TvConsole.tsx,
                           Bookshelf.tsx, Jukebox.tsx, PhotoWall.tsx, Mailbox.tsx,
                           AboutWall.tsx, WallCalendar.tsx, Lamp.tsx) + shared Voxel.tsx helper
    Player.tsx             pixel Jason + walk cycle (port of prototype animation)
    CameraRig.tsx          orthographic follow camera (port of prototype)
    Lighting.tsx           day/night rigs + animated transition
  systems/
    store.ts               zustand store (single source of truth, see 6.1)
    collision.ts           PURE module: AABB registry + axis-separated resolver (unit-tested)
    interactions.ts        PURE module: station registry + nearest-in-range query (unit-tested)
    useInput.ts            keyboard (WASD/arrows/E/Esc) + joystick vector, merged
    playerConfig.ts        character palette/dimensions (hair, skin, hoodie, glasses)
  ui/
    HUD.tsx                controls hint, title, Classic-site link, theme toggle
    Joystick.tsx           mobile virtual joystick (pointer events, no library)
    InteractButton.tsx     mobile "!" button, visible when a station is in range
    PanelHost.tsx          overlay modal/bottom-sheet shell (glass-panel styling)
    panels/                AboutPanel, NewsPanel, PublicationsPanel, ProjectsPanel,
                           BlogPanel, MusicPanel, LifePanel, ContactPanel, DeadlinePanel
    LoadingScreen.tsx      fade-in placeholder while the chunk loads
    WelcomeToast.tsx       first-visit controls hint (localStorage flag)
lib/worldData.ts
types/world.ts
tests/game/collision.test.ts
tests/game/interactions.test.ts
```

Panels do NOT reuse `components/newsList.tsx` etc. — those are server components that read
the filesystem. Panels render from `WorldData` props but copy the classic pages' visual
language (`glass-panel`, existing CSS variables, fonts).

## 4. World & Gameplay Design

### 4.1 Room

- Approx 24×20 units, single open-plan studio: sleeping corner, work desk area, media wall,
  reading corner, entry area. Checkerboard floor, two visible walls (N and E, matching the
  prototype camera angle), window on the north wall (sky visible through it).
- Camera: fixed-angle orthographic at offset (+20, +20, +20) following the player — port of
  the prototype's `CameraRig`. `viewSize` responsive (see 7).
- Collision: port the prototype's axis-separated AABB test (`checkCollision(newX, newZ)`
  against a static `Box3[]` registry, slide along walls). No physics engine.
- Movement: fixed speed ~6 units/s, 8-directional, walk-cycle animation (arm/leg swing +
  bob) exactly like the prototype; idle = limbs reset.

### 4.2 Stations

Walking within range (~1.6 units) of a station highlights it (emissive pulse) and shows a
floating hint ("E" bubble on desktop / enables the "!" button on mobile). Interacting opens
the corresponding panel. Tapping/clicking a station mesh directly also opens it (raycast).

| # | Station | Furniture | Panel content |
|---|---|---|---|
| 1 | About | framed poster/diploma wall | intro (rendered MDX), avatar, name; auto-hint on first visit |
| 2 | Publications | desk + laptop + paper stacks | selected pubs first, venue/year/links; "View all → /publications" |
| 3 | News | cork notice board | dated news timeline |
| 4 | Projects | TV + game console | project cards; "View all → /projects" |
| 5 | Blog | bookshelf | post list with dates/reading time → links to /blog/[slug] |
| 6 | Music | jukebox/speaker | embed existing `MusicPlayer` component (verify it's client-safe; else compact playlist UI) |
| 7 | Life | photo wall | teaser + link to /life |
| 8 | Contact | mailbox by the door | social icons + email (reuse icon components) |
| 9 | Deadlines | wall calendar | next upcoming deadline + link to /deadlines |
| 10 | Lamp (easter egg) | floor lamp | no panel — toggles day/night |

Panel behavior: opening locks movement input; `Esc`, ✕ button, or backdrop click closes;
only one panel open at a time. Panels are HTML overlays OUTSIDE the canvas (not drei `<Html>`).

### 4.3 Player character

Procedural voxel Jason, dimensions from the prototype, palette in `playerConfig.ts`:
black hair, warm skin tone, dark hoodie using the site accent color as trim, dark pants,
sneakers, thin black glasses strip across the face. Casts shadow.

## 5. Day/Night System

- Single source of truth: existing `useDarkMode()` hook (localStorage key `dark-mode`,
  toggles `.dark`/`.light` on `<html>`). Game reads AND writes through this hook — classic
  pages and game stay in sync. Default is dark (night).
- **Night:** deep-blue sky/background, dim ambient, warm point lights (lamp, desk lamp),
  subtle accent-colored neon strip on the media wall.
- **Day:** sky-blue background, warm directional "sun" through the window, bright ambient.
- Transition: lerp light colors/intensities/background over ~1s (no hard swap).
- Toggles: HUD button (same iconography as `themeToggle.tsx`) and interacting with the Lamp.

## 6. Systems Detail

### 6.1 Zustand store shape

```ts
{
  // input
  moveVector: {x: number, z: number}        // merged keyboard+joystick, normalized
  // world state
  playerPos: {x: number, z: number}         // written by Player each frame (transient, via refs where possible)
  facing: number
  nearbyStationId: string | null            // updated by interactions system
  openPanelId: string | null                // null = playing; non-null locks movement
  hasSeenWelcome: boolean                    // persisted to localStorage
}
```

Per-frame values (playerPos) use R3F's transient subscription pattern (`useStore.getState()`
in `useFrame`, refs for meshes) — do NOT trigger React re-renders per frame.

### 6.2 Pure modules (unit-tested)

- `collision.ts`: `createColliderRegistry()`, `register(box)`, `canMoveTo(x, z, radius)` —
  axis-separated so callers get wall-sliding by testing X and Z moves independently.
- `interactions.ts`: `registerStation({id, x, z, radius})`, `nearestInRange(px, pz)` →
  station id or null.

Vitest config kept minimal (`vitest.config.ts`, `npm test` script); tests must not import
three/react.

## 7. Responsive & Mobile

- Canvas fills the viewport (`100dvh`), `dpr={[1, 2]}`, `powerPreference: 'high-performance'`.
- Orthographic `viewSize` adapts: landscape ≈ 12 (prototype), portrait scales up (≈ 14–16)
  so the room stays readable on phones; recompute on resize/orientation change.
- Touch controls: left-bottom virtual joystick (custom pointer-event component, ~120px,
  thumb-reachable, `touch-action: none`); right-bottom "!" interact button appears only
  when `nearbyStationId != null`. Direct tap on a station also interacts.
- Panels: desktop = centered modal (max-w-2xl, glass); mobile (< md) = full-width bottom
  sheet, max-h-[80dvh], scrollable, ✕ button. Respect safe-area insets for HUD/joystick.
- Perf on mobile: shadow map 1024 (2048 on desktop), single shadow-casting light,
  `prefers-reduced-motion` disables bob/pulse animations.
- Shared geometry/material instances across voxels (module-level caches) to keep draw
  overhead and GC low; the scene is static except the player.

## 8. SEO, Accessibility, Fallbacks

- `(game)/page.tsx` renders (visually hidden, `sr-only`-style but crawlable): `<h1>Zexin
  (Jason) Xu</h1>`, one-paragraph intro, and plain links to /classic, /publications,
  /projects, /blog, /life, /deadlines. Plus `<noscript>` with the same links.
- Skip link ("Skip 3D — go to classic site") as the first focusable element.
- HUD always shows a small "Classic Site" link.
- React ErrorBoundary around the canvas: on WebGL/context failure show a friendly glass
  card with a "Go to classic site" button. Never a blank page.
- Existing metadata (OG/twitter/robots) unchanged; sitemap includes `/classic`.

## 9. Acceptance Criteria & Testing

Hard gates for every phase (run by the lead, not trusted from sub-agent reports):
1. `npm run build` succeeds (static export, all routes emitted to `out/`).
2. `npm run lint` passes.
3. `npm test` (vitest) passes once F1 lands.
4. Code review by the lead against this spec (interfaces, no scope creep, style match).

Final acceptance: Jason playtests `npm run dev` on desktop + a phone (or devtools device
emulation) — movement, all 9 panels + lamp, day/night sync with classic pages, joystick.

Known verification limit: no browser automation in this environment, so visual/interactive
QA is code-review + Jason's playtest.

## 10. Implementation Phases (opus 4.8 sub-agents; Fable 5 lead provides context & accepts)

| Phase | Scope | Depends on |
|---|---|---|
| **F1 Vertical slice** | deps install; route-group restructure (/ ↔ /classic); GameLoader + LoadingScreen; Canvas + World shell (floor/walls) + CameraRig + Player + keyboard input + collision port; vitest setup + collision tests | — |
| **F2 Stations & interactions** | all furniture components; interactions registry + proximity highlight + hint bubble; store wiring; lamp (toggle stub) | F1 |
| **F3 Data & panels** | lib/worldData.ts + types/world.ts; PanelHost + 9 panels; panel open/close/input-lock | F1 (parallel with F2; integration point: station ids) |
| **F4 Day/night** | Lighting.tsx rigs + transition; useDarkMode sync; HUD toggle; lamp easter egg | F1–F2 |
| **F5 Mobile & responsive** | Joystick + InteractButton + tap-to-interact; responsive viewSize; bottom-sheet panels; perf caps | F1–F3 |
| **F6 Polish & fallbacks** | SEO hidden content + noscript + skip link; ErrorBoundary; WelcomeToast; HUD final; header "Classic" link; sitemap | F1–F5 |

Workflow per phase: lead writes a context package (spec section + interface contracts +
files owned + acceptance list) → opus sub-agent implements in this worktree → lead reviews
diff, runs gates, fixes integration seams → next phase. F2+F3 may run in parallel (disjoint
files; shared contract = station id list + store shape, frozen in F1).

Delivery: worktree branch `worktree-voxel-home`, incremental commits per phase, push and
open a draft PR at the end. Never push to master.

## 11. Risks & Contingencies

- **drei/fiber vs TS 4.9 types** → bump to TS 5 if needed (Next 13.4 supports it).
- **MusicPlayer embed** inside game UI may drag in classic-layout assumptions → fallback:
  compact playlist UI in MusicPanel reading `WorldData.playlist`.
- **`experimental.mdxRs`/mdx-bundler interplay** unchanged — worldData reuses existing
  readers, so content pipeline risk is near-zero.
- **Static export + dynamic ssr:false** is a supported combo on Next 13.4; if the export
  complains, wrap the dynamic import in a client boundary component (GameLoader) — already
  the plan.
- **Performance on low-end phones**: scene is a few hundred boxes, one shadow light —
  headroom is large; if needed, disable shadows below `devicePixelRatio` heuristics (defer
  until observed).
