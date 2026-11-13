# Design Language

The site is one soft colour field seen through fluted (reeded) glass, with quiet
frosted panels and light-weight type on top. The glass is the only loud thing;
everything else stays calm. (Redesigned November 2026, replacing the dark
cyan "tech dashboard" look: dot grid, gradient orbs, mono uppercase labels.)

## Backdrop

- `components/flutedBackdrop.tsx` paints the scene on a fixed canvas behind every page.
- The scene is drawn tiny (soft blobs: sky blue, coral, orange, rose, and a tall
  navy "figure"), then redrawn column by column. Across each rib the view sweeps
  over a slice about 7x the rib's width (`LENS`); at the rib's edge it folds
  back over about two pixels (`SEAM = 0.1`): no hard border line, but not blurry.
  Jason asked for a strong per-rib gradient without a visible border line, and
  has twice called softer versions "too blurry"; keep the glass crisp.
- The canvas is drawn at the screen's real pixel density (up to 2x) so rib edges
  stay sharp on high-density displays. Each rib's body is one stretched strip;
  only the seams are drawn pixel by pixel.
- Tried and rejected (Nov 2026): a "fractal glass" variant with a near-black navy
  field and flowing ribbons of light, after a Dribbble reference. Jason found it
  less attractive than the blue/coral spots and blurrier. Don't bring it back.
- Rib light-and-shade and the top/bottom veil are CSS (`.backdrop::after` in
  `globals.css`). The shading starts and ends on the same value for the same reason.
- Rib width is the `--rib` CSS variable (22px, 16px on phones). The canvas reads it.
- Blobs wander freely in both directions (30fps, up to ~30% of the screen). Each
  follows three sine waves of unrelated speeds per axis, with speeds and phases
  rolled fresh on every visit, so the path looks random and never visibly repeats.
  The figure's head and body share one path. With reduced motion on, one still frame.
- Palettes for both themes live at the top of the component (`DUSK`, `DAY`).
- `public/videos/background.mp4` and `components/backgroundVideo.tsx` are no longer used.

## Color System

All colours are CSS variables in `app/styles/globals.css`.

### Dusk (default, `.dark`)
- Text: white, white 88%, white 72%
- Panel border: white 24%
- Items inside panels: white 8%, white 15% on hover
- Panels: navy `rgba(12, 30, 74, 0.56)`, deep enough that coloured text reads
  even where coral shows through.
- Two accents lifted from the backdrop so panels aren't all one colour: warm
  peach `#ffc7b0` (links, own name in author lists) and sky `#a6d6ff` (month
  labels, venue marker, tags). Quiet text is a blue-tinted white, not plain grey.
- Solid buttons: white with navy text (`--color-solid` / `--color-on-solid`)

### Day (`.light`)
- Text: ink `#0b1e3f`, `#22365c`, `#47597b`
- Panels: white 60% with a white 80% border
- Accent: cobalt `#1746c4` (links, tags); secondary coral `#c9482c` (month labels)
- Solid buttons: ink with white text

### Urgency Colors (Deadlines)
Unchanged: green 30+ days, yellow 8-30, red 7 or less, gray expired.

## Typography

| Purpose | Font | Notes |
|---------|------|-------|
| Everything | Manrope (variable) | Same face as JJstudios.app |
| Hero / page titles | Manrope 300 | `.hero-title`, `.page-title`, tight tracking |
| Panel titles | Manrope 500, 1.3125rem | `.section-label`, sentence case. Jason found 1.875rem light too big and unrefined; keep titles modest |
| Name mark in nav | Barlow 600 | `font-brand` |
| Code | JetBrains Mono | |
| Chinese | LXGW WenKai | inline |

No uppercase mono labels, no underscore names (`Latest_News`), no emoji in headings.
A serif italic (Fraunces) was tried for panel titles and rejected by Jason.

## Components

- **Glass panel** (`.glass-panel`): tinted, 14px blur, 26px radius (22px on phones).
  No hover lift or glow. The ribs stay faintly visible through it.
- **Panel item** (`.panel-list-item`): 16px radius, lighter tint, brighter on hover.
- **Pill button** (`.btn-outline`): outlined pill, fills solid on hover.
- **Tag** (`.tag-badge`): small pill.
- **Round icon link** (`.expand-icon`, `.shrink-icon`): arrow up-right opens a
  section's page; inward arrows go back home.
- **Breadcrumb** (`.crumb`): "Home / Publications" above each sub-page title.
- **Project tile** (`.project-tile`): each tile is washed with one of three backdrop
  hues in turn (warm, cool, rose); the year, tags and border pick up that hue.
  Demo is a solid pill (`.btn-solid`), GitHub an outlined one.
- **Blog row** (`.post-row`): date-led rows separated by hairlines rather than
  boxes: big light day numeral with the month under it, title, description and
  reading time, arrow circle that fills on hover.
- Modules are meant to differ in structure (cards, tinted tiles, rows) so the home
  page isn't five identical lists.

## Layout

### Homepage
- **Identity panel**: the page starts right under the nav with one glass panel, no
  empty hero above it. Left: "Hi there, I'm Zexin Xu 徐泽鑫" (`.identity-title`,
  max 2.375rem, greeting, name and Chinese name all one size), the pronunciation in
  IPA (`.ipa`), the introduction (two columns from
  `xl`). No buttons: Jason had the CV and Publications pills removed. Right, behind a hairline: a large
  photo (176px), name, role, university, social links. On phones: greeting, a photo
  row with the social links under it, then the introduction.
  The name carries a slow sheen (`.name-sheen`: a band of the warm and cool accent
  travelling across it, still under reduced motion). A "Research interests" row of
  tags closes the panel, under a hairline.
  Jason rejected every version that left the greeting on bare glass with space
  around it (floating card top-right, 144px name with chips, two-block hero with a
  facts panel). He wants the greeting inside glass, merged with the profile and
  introduction, and the photo large.
- **News** (5 cols) + **Publications** (7 cols), then **Projects** (7) + **Blog** (5).
  Single column below `lg`.

### Sub-pages
One glass panel inside `max-w-screen-xl`: breadcrumb + back icon, page title,
optional description, divider, content.

### Footer
Its own glass panel (credit line + social buttons), never bare text on the backdrop.

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
