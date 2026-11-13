# Design Language

The site is one soft colour field seen through fluted (reeded) glass, with quiet
frosted panels and light-weight type on top. The glass is the only loud thing;
everything else stays calm. (Redesigned November 2026, replacing the dark
cyan "tech dashboard" look: dot grid, gradient orbs, mono uppercase labels.)

## Backdrop

- `components/flutedBackdrop.tsx` paints the scene on a fixed canvas behind every page.
- The scene is drawn tiny (soft blobs: sky blue, coral, orange, rose, and a tall
  navy "figure"), then each glass rib redraws a wider slice squeezed into its own
  width. That squeeze is the fluted-glass refraction.
- Rib highlights and the top/bottom veil are CSS (`.backdrop::after` in `globals.css`).
- Rib width is the `--rib` CSS variable (30px, 20px on phones). The canvas reads it.
- Blobs drift slowly (24fps, 30-50s cycles). With reduced motion on, one still frame.
- Palettes for both themes live at the top of the component (`DUSK`, `DAY`).
- `public/videos/background.mp4` and `components/backgroundVideo.tsx` are no longer used.

## Color System

All colours are CSS variables in `app/styles/globals.css`.

### Dusk (default, `.dark`)
- Text: white, white 88%, white 72%
- Panels: navy `rgba(14, 36, 86, 0.4)` with a white 24% border
- Items inside panels: white 8%, white 15% on hover
- Accent: white. Panels sit over both blue and coral, so links are marked by an
  underline rather than a hue.
- Solid buttons: white with navy text (`--color-solid` / `--color-on-solid`)

### Day (`.light`)
- Text: ink `#0b1e3f`, `#22365c`, `#47597b`
- Panels: white 60% with a white 80% border
- Accent: cobalt `#1746c4` (links are also underlined)
- Solid buttons: ink with white text

### Urgency Colors (Deadlines)
Unchanged: green 30+ days, yellow 8-30, red 7 or less, gray expired.

## Typography

| Purpose | Font | Notes |
|---------|------|-------|
| Everything | Manrope (variable) | Same face as JJstudios.app |
| Hero / page titles | Manrope 300 | `.hero-title`, `.page-title`, tight tracking |
| Section titles | Manrope 500 | `.section-label`, sentence case |
| Name mark in nav | Barlow 600 | `font-brand` |
| Code | JetBrains Mono | |
| Chinese | LXGW WenKai | inline |

No uppercase mono labels, no underscore names (`Latest_News`), no emoji in headings.

## Components

- **Glass panel** (`.glass-panel`): tinted, 14px blur, 26px radius (22px on phones).
  No hover lift or glow. The ribs stay faintly visible through it.
- **Panel item** (`.panel-list-item`): 16px radius, lighter tint, brighter on hover.
- **Pill button** (`.btn-outline`): outlined pill, fills solid on hover.
- **Tag** (`.tag-badge`): small pill.
- **Round icon link** (`.expand-icon`, `.shrink-icon`): arrow up-right opens a
  section's page; inward arrows go back home.
- **Breadcrumb** (`.crumb`): "Home / Publications" above each sub-page title.

## Layout

### Homepage
- **Hero**: fills most of the first screen. Name bottom-left in large light type,
  profile card (photo, role, social links) top-right. On phones: name, then card.
- **About** panel (two columns on desktop).
- **News** (5 cols) + **Publications** (7 cols), then **Projects** (7) + **Blog** (5).
  Single column below `lg`.

### Sub-pages
One glass panel inside `max-w-screen-xl`: breadcrumb + back icon, page title,
optional description, divider, content.

### Header
Three floating frosted pills (`.nav-pill`): name mark, page links, controls
(now-playing text, music, theme, and the menu button below `lg`). A blurred haze
(`.nav-haze`) softens content as it scrolls behind them. Below `lg` the links
move into a dropdown that slides open (grid-rows transition).

## Motion

- Ambient: only the backdrop drift.
- Player expand/collapse, staggered player content, mobile menu slide, equalizer
  bars, now-playing marquee, deadline countdown breathing (dusk only): unchanged.
- No entrance animations, no hover lift on cards.

## Music Player

Behaviour unchanged (SoundCloud widget, shuffled playlist, drops down from the
nav's right edge, first-visit prompt). The prompt is now a pill; the player uses
the opaque overlay tint (`--color-overlay-bg`) so page text doesn't show through.
While playing, the nav shows "Vibing: [track]".

## Navigation

- Internal links use Next.js `<Link>`.
- Mobile nav: menu button with a slide-down panel.

## Deployment

- Static export (`output: 'export'`) deployed to GitHub Pages
- Weekly GitHub Action rebuilds to refresh deadline data
- Deadline data cached locally in dev (24h) to avoid repeated fetches
