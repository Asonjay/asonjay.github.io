# Jason's Voxel Study — 3D Game Homepage Design (Rev 2)

**Date:** 2026-07-11 (Rev 2 — incorporates Jason's round-2 feedback)
**Status:** Pending Jason's review of this document
**Prototype reference:** `new_template/react-app (13).js` (2.5D voxel house explorer, plain three.js)

## 1. Overview

Rebuild the site homepage as a 2.5D isometric voxel game. The visitor controls a pixel
version of Jason walking around a voxel study/apartment. Walking up to furniture
("stations") triggers contextual character animations and opens info panels populated with
the site's real content.

Approved decisions:

| Decision | Choice |
|---|---|
| Site structure | Game at `/`; current homepage preserved at `/classic`; all other classic pages unchanged |
| World theme | Single-room voxel study/apartment (expanded from the prototype's 16×16 room) |
| Lighting | Day/night, synced with the existing light/dark theme toggle |
| Character | Custom pixel Jason (procedural boxes; black hair, glasses, hoodie) |
| Tech | react-three-fiber ecosystem, no framework upgrade, no external 3D assets |
| Rendering style | Stay 2.5D isometric; invest the budget in **motion quality**, not camera freedom |
| In-game UI | Bespoke "tempered pixel-RPG" UI kit — do NOT reuse the classic glassmorphism |
| Menu bar | Bottom hotbar: station shortcuts (auto-walk + interact), socials, CV, music, day/night |
| Classic-site access | Trash-can easter egg station → /classic (plus a11y skip link; no persistent HUD link) |

Round-2 feedback drivers (Jason, 2026-07-11):
1. Worried "full 3D" could stutter; wants everything smooth. → §4.4: the scene is tiny
   (draw-call budget ≤ ~60 via instancing/merging); the real fix is motion design, not
   less 3D.
2. Prototype's character/interaction feel too stiff/simple. → §4.5 contextual animations +
   reactive props.
3. Design a NEW UI system for the content, don't reuse the existing look. → §5 UI kit.
4. Easter egg: the OLD site becomes accessible when the character walks to a trash can. → station #11.
5. Bottom menu bar with pressable buttons: social links + shortcuts that make the character
   auto-walk to the object, interact, and open it. → §6 Hotbar + §7.3 pathfinding.

Out of scope for v1 (YAGNI): jumping/physics engine, camera rotation/zoom, NPCs/dialogue
trees, sound effects, save systems, multiplayer, outdoor areas.

## 2. Tech Stack

New dependencies (all compatible with the existing React 18.2 / Next 13.4 / TS 4.9 setup —
**no framework upgrade**):

| Package | Version | Purpose |
|---|---|---|
| `three` | `^0.160.0` | WebGL engine |
| `@react-three/fiber` | `^8.15.0` | React renderer for three (v8 = React 18 compatible; do NOT use v9) |
| `@react-three/drei` | `^9.100.0` | Helpers (v9 = R3F v8 compatible; do NOT use v10) |
| `zustand` | `^4.5.0` | Game state store |
| `vitest` (dev) | `^1.6.0` | Unit tests for pure logic modules only |

Fonts: add `Press_Start_2P` via `next/font/google` (latin subset) — used ONLY for tiny
pixel headers/labels in the game UI kit; body text stays Barlow. No new npm package.

Contingency: if drei/fiber type definitions require TS 5, bump `typescript` to `^5.x`
(supported by Next 13.4; verify `npm run build` + `npm run lint` still pass).

Everything in the world — room, furniture, player — is procedural `BoxGeometry`.
No GLTF/textures/downloads. Instant load, no licensing, preserves the prototype's voxel
aesthetic.

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
- Keep the root `metadata` export intact; the game page keeps full SEO metadata.
- `app/error.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/fonts.tsx` stay at root; sitemap gains `/classic`.
- Header on classic pages gains a "Classic" nav entry pointing to `/classic` (its logo
  points to `/`, which is now the game — visitors must be able to stay in classic-land).

### 3.2 Game entry & code-splitting

```
(game)/page.tsx  (server)
  └─ builds WorldData via lib/worldData.ts (fs reads at build time)
  └─ renders visually-hidden h1/intro/nav links (SEO + screen readers) + <noscript>
  └─ <GameLoader worldData={…}>  (client wrapper)
        └─ next/dynamic(() => import('components/game/VoxelHome'), { ssr: false, loading: <LoadingScreen/> })
```

Three.js never enters the bundle of classic pages.

### 3.3 Data flow (`lib/worldData.ts`, `types/world.ts`)

Build-time aggregation into one serializable object (plain JSON — no functions, no Dates;
dates as ISO strings):

```ts
type WorldData = {
  introCode: string                 // mdx-bundler `code` string for introduction.mdx (same mechanism components/introduction.tsx uses)
  news: { date: string; code: string }[]  // mdx-bundler code strings — exactly what getAllNews() already returns
  publications: Publication[]       // reuse lib/publications.ts parser output
  projects: ProjectMeta[]           // frontmatter only (title, description, year, selected)
  posts: PostMeta[]                 // frontmatter + slug + readingTime
  playlist: { title: string; artist: string; url?: string }[]  // parse content/playlist.md ("Title | Artist | URL" lines) in lib/worldData.ts; note musicPlayer.tsx hardcodes its own list (leave it untouched) and audio playback lives in MiniPlayer
  nextDeadline?: { name: string; date: string }   // from content/deadlines/custom.yaml
  social: { label: string; url: string; icon: string }[]
  cvUrl: string                     // '/cv/Zexin_Xu_CV.pdf' (exists in public/cv/)
}
```

Reuse the existing readers (`lib/publications.ts`, `lib/mdx.ts` frontmatter functions,
news/deadlines loaders). Do not fork parsing logic. If a reader only exists inside a server
component, extract it into `lib/` and share it. Panels render MDX content client-side via
`getMDXComponent` (mdx-bundler/client) exactly like `components/newsList.tsx` does today.

### 3.4 Directory layout (new code)

```
components/game/
  VoxelHome.tsx            client entry: <Canvas> + overlay UI, wires store ↔ worldData
  scene/
    World.tsx              floor, walls, window, rug, static props, lighting rig mount
    furniture/             one file per station (Desk, NoticeBoard, TvConsole, Bookshelf,
                           Jukebox, PhotoWall, Mailbox, AboutWall, WallCalendar, Lamp,
                           TrashCan) + shared Voxel.tsx helper + reactive small props
    Player.tsx             pixel Jason + locomotion/emote animation controller
    CameraRig.tsx          damped orthographic follow camera
    Lighting.tsx           day/night rigs + animated transition
  systems/
    store.ts               zustand store (see 7.1)
    collision.ts           PURE: AABB registry + axis-separated resolver (unit-tested)
    interactions.ts        PURE: station registry + nearest-in-range query (unit-tested)
    pathfinding.ts         PURE: coarse-grid A* over the collision grid (unit-tested)
    useInput.ts            keyboard (WASD/arrows/E/Esc) + joystick vector, merged;
                           any manual input cancels auto-walk
    playerConfig.ts        character palette/dimensions (hair, skin, hoodie, glasses)
  ui/
    kit/                   UI KIT (see §5): PixelPanel, Nameplate, PixelButton,
                           TypewriterText, KeyHint, PixelDivider, palette tokens
    HUD.tsx                top-left title/controls hint (kit-styled)
    Hotbar.tsx             bottom menu bar (see §6)
    Joystick.tsx           mobile virtual joystick (pointer events, no library)
    InteractButton.tsx     mobile "!" button, visible when a station is in range
    PanelHost.tsx          overlay modal/bottom-sheet shell (kit-styled)
    panels/                About, News, Publications, Projects, Blog, Music, Life,
                           Contact, Deadline, ClassicConfirm (trash-can mini panel)
    LoadingScreen.tsx      kit-styled fade-in placeholder
    WelcomeToast.tsx       first-visit controls hint (localStorage flag)
lib/worldData.ts
types/world.ts
tests/game/collision.test.ts
tests/game/interactions.test.ts
tests/game/pathfinding.test.ts
```

Panels do NOT reuse `components/newsList.tsx` etc. (server components) and do NOT reuse
`glass-panel` styling. They render from `WorldData` props with the game UI kit.

## 4. World, Motion & Gameplay

### 4.1 Room

- Approx 24×20 units, single open-plan studio: sleeping corner, work desk area, media wall,
  reading corner, entry area (door + mailbox + trash can). Checkerboard floor, two visible
  walls (N and E), window on the north wall.
- Camera: fixed-angle orthographic at offset (+20, +20, +20), **damped follow** (see 4.4).
- Collision: port the prototype's axis-separated AABB test against a static `Box3[]`
  registry (slide along walls). No physics engine.
- The room layout is authored on a 1-unit grid in a single `worldLayout.ts` data file
  (furniture positions + collision extents + station anchor points) so the collision grid,
  A* grid, and furniture placement share one source of truth.

### 4.2 Stations

Walking within range (~1.6 units) highlights the station (emissive pulse) and shows a
kit-styled nameplate bubble. Interact = `E`/`Enter` (desktop), "!" button or direct tap
(mobile), or hotbar shortcut (auto-walk first, §6).

| # | Station | Furniture | Panel | Contextual character animation |
|---|---|---|---|---|
| 1 | About | framed poster/diploma wall | intro (MDX), avatar, name | looks up at the wall, waves at camera |
| 2 | Publications | desk + laptop + paper stacks | selected pubs first; link → /publications | **sits at the desk and types**; laptop screen lights up |
| 3 | News | cork notice board | dated news timeline | leans in, tilts head |
| 4 | Projects | TV + game console | project cards; link → /projects | **sits on the sofa**, TV flickers on |
| 5 | Blog | bookshelf | post list → /blog/[slug] | **tiptoes and pulls a book out** |
| 6 | Music | jukebox/speaker | playlist UI (WorldData.playlist) | jukebox glows, character sways to the beat |
| 7 | Life | photo wall | teaser + link → /life | leans in to look at photos |
| 8 | Contact | mailbox by the door | social icons + email | opens the mailbox flag |
| 9 | Deadlines | wall calendar | next deadline + link → /deadlines | scratches head |
| 10 | Lamp (easter egg) | floor lamp | none — toggles day/night | reaches up and pulls the cord |
| 11 | **Classic site (easter egg)** | **trash can by the door** | ClassicConfirm mini panel: "翻翻旧版网站？" → /classic | **lid pops open, character peeks in** |

Panel behavior: opening locks movement; `Esc`/✕/backdrop click closes; one panel at a time.
Panels are HTML overlays OUTSIDE the canvas (not drei `<Html>`).

### 4.3 Player character

Procedural voxel Jason: black hair, warm skin, dark hoodie with site-accent trim, dark
pants, sneakers, thin black glasses strip. Palette/dimensions in `playerConfig.ts`. Casts
shadow.

### 4.4 Motion & game feel (the "smooth" package — answers round-2 concern #1)

Rendering cost is NOT the risk (a few hundred boxes, one shadow light). Budgets and rules:

- **Draw calls ≤ ~60**: floor tiles as one `InstancedMesh`; static furniture merged per
  material (`BufferGeometryUtils.mergeGeometries`) at scene build; shared module-level
  geometry/material caches; zero per-frame allocations in `useFrame`.
- **Acceleration/deceleration**: velocity approaches target via exponential damping
  (`THREE.MathUtils.damp`), no on/off speed. Start/stop feels weighty, not snappy.
- **Turning**: shortest-arc angle interpolation (no instant `rotation.y =` snap).
- **Camera**: damped follow (position + lookAt target both smoothed) so collision
  micro-jitter never reaches the camera; subtle ease-in dolly (~5% zoom) while a panel is
  open, eased back on close.
- **Walk cycle**: eased limb swings with arm/leg phase offset, slight forward body lean
  proportional to speed, squash-and-stretch on start/stop, bob synced to stride.
- **Footstep dust**: tiny fading quad puffs on stride hits (pooled, no allocation).
- **Frame-rate independence**: clamp `delta` (≤ 1/30) and use damp() everywhere — identical
  feel at 30/60/120Hz.
- **Anti-aliasing ON** (`antialias: true`, prototype had it off) — crisp voxel edges read
  as "smooth"; `dpr={[1, 2]}`.
- Target: 60fps on a mid-range 2019+ phone.

### 4.5 Scene interactivity (answers round-2 concern #2)

- Contextual per-station character animations (table in 4.2) implemented as short
  procedural emote clips (limb/pose keyframes with easing — same technique as the walk
  cycle, no animation library).
- **Reactive props**: small items (desk chair, paper stacks, potted plant, trash can lid)
  wobble/spin briefly when the player bumps them (spring-damped rotation offset).
- Rug corner subtly deforms when walked over; TV/laptop/jukebox emissive states react to
  their panels being open.
- All juice respects `prefers-reduced-motion` (§8).

## 5. Game UI Kit — "tempered pixel-RPG" (answers round-2 concern #3)

Design language (Jason delegated the choice; requirement: match the voxel world, stay
professional enough for an academic personal site):

- **Structure**: chunky panels with pixel-stair corners (CSS box-shadow staircase or
  clip-path, no images), 2px accent border, station **nameplate** tab on the top edge.
- **Typography**: `Press Start 2P` ONLY for nameplates/section labels/key hints at small
  sizes; ALL body content (paper titles, news, descriptions) in Barlow at readable sizes.
- **Palette** follows day/night: night = deep navy panel base, accent-neon border glow,
  warm-white text; day = warm paper base, brown/amber border, dark text. Both driven by
  CSS variables scoped to the game root (`.game-ui`), NOT the classic theme variables.
- **Motion**: panels open with a 150ms scale+fade "pop" (springy ease-out); nameplate text
  types on with a typewriter effect (~20ms/char, skippable, disabled under
  prefers-reduced-motion); buttons have 2px press-down displacement.
- **Components** (`components/game/ui/kit/`): `PixelPanel`, `Nameplate`, `PixelButton`,
  `KeyHint` (keyboard cap look), `TypewriterText`, `PixelDivider`, `IconSlot` (hotbar cell),
  `icons.tsx` (pixel-style inline SVG station/control icons).
- **Iconography rule (Jason, round-3): avoid emoji throughout the game UI.** All icons are
  inline SVG: new pixel-style SVGs for stations/controls; social glyphs reuse the existing
  `components/icons.tsx` set. Emoji may appear only inside authored MDX content itself.
- Every overlay element (HUD, hotbar, panels, joystick, toasts, loading screen) uses the
  kit. Zero `glass-panel` classes inside the game.

## 6. Bottom Menu Bar — Hotbar (round-2 addition)

A persistent kit-styled hotbar centered at the bottom (desktop):

```
[about][desk][news][tv][shelf][music][photos][mail][cal][trash] │ [play][sun/moon] │ [gh][sc][x][in][@] [CV]
        station slots (auto-walk + interact)                          controls          social links + CV
```
(labels illustrative — every cell renders a pixel-style inline SVG icon, no emoji)

- **Station slots** (10: about wall, desk, board, TV, shelf, jukebox, photos, mailbox,
  calendar, trash):
  click/tap → character **auto-walks** (A*, §7.3) to the station anchor → plays its
  contextual animation → panel opens. Hovering shows the station name (kit tooltip);
  the currently-in-range station's slot is highlighted. Icons are inline SVG only (kit
  `icons.tsx`) — no emoji, no icon-font dependency.
- **Music control**: play/pause of the current track. Implementation: reuse the MiniPlayer
  audio mechanism — extract its playback core into a shared hook if feasible; fallback =
  the button opens the Music panel (decided during F5 with the actual MiniPlayer code in
  hand; MiniPlayer itself stays in the classic layout).
- **Day/night toggle**: same `useDarkMode()` source of truth as §7.2/§5 (lamp still works).
- **Social links**: Email, Scholar, GitHub, X, LinkedIn (same URLs as classic homepage) —
  direct external links. **CV button** → `/cv/Zexin_Xu_CV.pdf` (exists).
- **Mobile**: hotbar collapses to a single menu button (bottom-right, above the interact
  button); tapping fans out a kit-styled sheet with the station grid + controls + socials.
  Joystick (bottom-left) is never overlapped.
- Keyboard: number keys 1–9 and 0 trigger the ten station slots.

## 7. Systems Detail

### 7.1 Zustand store shape

```ts
{
  moveVector: {x: number, z: number}        // merged keyboard+joystick, normalized
  autoWalk: { targetStationId: string, path: {x:number,z:number}[] } | null
                                            // set by hotbar; cleared on arrival or any manual input
  playerPos: {x: number, z: number}         // transient (read via getState() in useFrame)
  facing: number
  activeEmote: string | null                // contextual animation currently playing
  nearbyStationId: string | null
  openPanelId: string | null                // non-null locks movement
  hasSeenWelcome: boolean                    // persisted to localStorage
}
```

Per-frame values use R3F transient patterns (refs + `getState()`), never per-frame React
re-renders.

### 7.2 Day/night

- Single source of truth: existing `useDarkMode()` hook (localStorage key `dark-mode`,
  `.dark`/`.light` on `<html>`). Game reads AND writes it — classic pages stay in sync.
- **Night:** deep-blue background, dim ambient, warm point lights (floor lamp, desk lamp),
  accent neon strip on the media wall. **Day:** sky-blue background, warm directional sun
  through the window, bright ambient.
- Transition: lerp colors/intensities/background ~1s. Toggles: hotbar button + lamp station.

### 7.3 Pure modules (unit-tested, no three/react imports)

- `collision.ts`: `createColliderRegistry()`, `register(box)`, `canMoveTo(x, z, radius)` —
  axis-separated for wall sliding.
- `interactions.ts`: `registerStation({id, x, z, radius})`, `nearestInRange(px, pz)`.
- `pathfinding.ts`: A* over a coarse grid (1-unit cells) derived from `worldLayout.ts`
  collision extents; returns waypoint list; smoothed by string-pulling (skip waypoints with
  clear line-of-sight). Player follows waypoints through the normal movement system (same
  accel/turn feel as manual control).

## 8. Responsive & Mobile

- Canvas fills viewport (`100dvh`), `dpr={[1, 2]}`, `powerPreference: 'high-performance'`.
- Ortho `viewSize` adapts: landscape ≈ 12, portrait ≈ 14–16; recompute on resize/orientation.
- Touch: bottom-left joystick (custom pointer-events, ~120px, `touch-action: none`);
  bottom-right "!" interact button (visible when `nearbyStationId != null`); direct tap on
  stations (raycast); collapsed hotbar menu (§6). Safe-area insets respected.
- Panels: desktop = centered kit modal (max-w-2xl); mobile = full-width bottom sheet
  (max-h-[80dvh], scrollable).
- Perf: shadow map 1024 on mobile / 2048 desktop, single shadow-casting light.
- `prefers-reduced-motion`: disables bob, dust, typewriter, emote flourishes, panel pop
  (instant fades instead). Movement itself stays damped (that's comfort, not decoration).

## 9. SEO, Accessibility, Fallbacks

- `(game)/page.tsx` renders visually-hidden but crawlable `<h1>`, one-paragraph intro, and
  plain links to /classic, /publications, /projects, /blog, /life, /deadlines; plus
  `<noscript>` with the same links.
- Skip link ("Skip the 3D — go to classic site") as first focusable element. (The fun path
  to /classic is the trash can; the accessible path is this link. No persistent HUD link.)
- ErrorBoundary around the canvas: WebGL/context failure → kit-styled card with a
  "Go to classic site" button. Never a blank page.
- Panels: focus-trapped, `Esc` closes, `aria-modal`, headings hierarchy; hotbar buttons
  have `aria-label`s.
- Existing metadata unchanged; sitemap includes `/classic`.

## 10. Acceptance Criteria & Testing

Hard gates per phase (run by the lead, not trusted from sub-agent reports):
1. `npm run build` succeeds (static export, all routes in `out/`).
2. `npm run lint` passes.
3. `npm test` (vitest: collision, interactions, pathfinding) passes.
4. Lead code review against this spec (interfaces, scope, style).

Final acceptance — Jason playtests `npm run dev` (desktop + phone/devtools emulation):
movement feel (accel/turn/camera damping), all 11 stations incl. contextual animations,
trash-can → /classic, hotbar auto-walk + socials + CV + music + theme, day/night sync with
classic pages, joystick + bottom sheets on mobile.

Known limit: no browser automation here, so visual QA = lead code review + Jason playtest.

## 11. Implementation Phases (opus 4.8 sub-agents; Fable 5 lead provides context & accepts)

| Phase | Scope | Depends on |
|---|---|---|
| **F1 Vertical slice + movement feel** | deps; route-group restructure (/ ↔ /classic); GameLoader/LoadingScreen; Canvas + World shell + worldLayout.ts + damped CameraRig + Player with accel/turn/walk-cycle juice + keyboard input + collision port; vitest setup + collision tests | — |
| **F2 Stations, furniture & scene interactivity** | 11 furniture stations; interactions registry + highlight + nameplate hint; contextual emote animations; reactive props; lamp/trash stubs | F1 |
| **F3 UI kit, data & panels** | ui/kit components; lib/worldData.ts + types/world.ts; PanelHost + 10 panels; open/close/input-lock | F1 (parallel with F2; frozen contract: station ids + store shape) |
| **F4 Day/night** | Lighting rigs + 1s transition; useDarkMode sync; lamp easter egg wiring | F1–F2 |
| **F5 Hotbar & pathfinding** | pathfinding.ts + tests; Hotbar (slots/auto-walk/socials/CV/theme/music control or fallback); number-key shortcuts | F1–F3 |
| **F6 Mobile & responsive** | Joystick + InteractButton + tap-to-interact; responsive viewSize; bottom-sheet panels; collapsed hotbar menu; perf caps | F1–F5 |
| **F7 Polish & fallbacks** | SEO hidden content + noscript + skip link; ErrorBoundary; WelcomeToast; focus trapping; header "Classic" nav link; sitemap; reduced-motion audit | F1–F6 |

Workflow per phase: lead writes a context package (spec sections + interface contracts +
files owned + acceptance list) → opus sub-agent implements in this worktree → lead reviews
diff, runs gates, fixes seams → next phase. F2+F3 may run in parallel (disjoint files).

Delivery: worktree branch `worktree-voxel-home`, incremental commits per phase, push and
open a draft PR at the end. Never push to master.

## 12. Risks & Contingencies

- **drei/fiber vs TS 4.9 types** → bump to TS 5 if needed (Next 13.4 supports it).
- **MiniPlayer audio extraction** for the hotbar music button may be tangled → fallback:
  button opens the Music panel (explicitly allowed by §6).
- **Emote animation scope creep** → each emote is ≤ ~1.5s, ≤ ~12 keyframes, procedural;
  if a pose fights the rig, simplify the pose rather than extend the rig.
- **Static export + dynamic ssr:false** supported on Next 13.4; GameLoader client boundary
  is the plan.
- **Low-end phones**: huge headroom (≤60 draw calls); if needed later, disable shadows via
  DPR heuristic (defer until observed).


## Iteration 2 — playtest round 1 (2026-07-12)

Feedback (Jason): (1) lag on large screens; (2) enclosed-room format undersells info-browsing; (3) pixel-RPG UI too strong (menu bar, buttons, pixel font).

Decisions (AskUserQuestion, options + previews):

- **Perf (Task R2-8):** pixel-budget dpr governor (budget 4.6M px, floor 0.75) + fps-adaptive dpr back up to device cap + shadow-tier drop under load + `?debug=1` stats overlay. `powerPreference: high-performance` was already set; root cause is uncapped fill-rate scaling with screen area (4K ≈ 4× 1080p fragment work).
- **World (Task R2-10): 书房+小庭院 hybrid** (chosen over gallery re-theme / floating island / wayfinding-only). Room keeps footprint and backdrop walls; courtyard extends on an open side through a door gap (≥2 cells): grass + path + picket fence; mailbox and trash can move outdoors; new bench / flower beds / tree / lamppost (night point light lives in the furniture component). Indoor = work/research, outdoor = life/contact. All systems (stations, A*, panels, hotbar) unchanged.
- **UI (Task R2-9):** pixel style retired → **warm rounded-modern**: 12px-radius near-solid cards, soft shadows, Barlow-only (Press Start 2P removed entirely), icons redrawn as 20×20 round-cap strokes, renames PixelPanel/PixelButton/PixelDivider → UiPanel/UiButton/UiDivider. Token architecture (`.game-ui`, `--gp-*`, day/night variants) unchanged.

Execution: sequential SDD (8 → 9 → 10), opus implementer + opus task-reviewer per task, lead gates (vitest/lint per task; consolidated build at the end). Briefs: `.superpowers/sdd/task-{8,9,10}-brief.md`.


## Iteration 3 — playtest round 2 (2026-07-13)

Verdict: big-screen lag SOLVED (governor confirmed working). New feedback: character/models feel small; map elements read low-res; scene too dark. Jason chose the tuning pack over a style pivot (voxel form stays).

**Task R3-11 (fidelity pass):** PLAYER_VISUAL_SCALE 1.3 (collision unchanged); VIEWSIZE 12→10 desktop / 15→13 touch; PIXEL_BUDGET 4.6M→7M (MIN_DPR 0.75 stays as decline floor; 4K now seeds ≈0.92); brightness pass both themes (toneMappingExposure ~1.1x, day +25-35% ambient, night +30-45% lift, GardenLamp bump, palette lightness +8-16% on darkest colors incl. day-mode navy). Adaptive perf protection unchanged. Station nameplates deliberately stay at NAMEPLATE_Y 2.7 - they anchor to furniture, which did not grow (adjudicated post-review).
