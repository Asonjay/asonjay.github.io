# Design Language

## Color System

### Dark Mode (Default)
- **Background**: Near black `#030305` (primary), `#0a0a0f` (secondary), `#151520` (subtle)
- **Foreground**: White `#fff` (primary), `#ccc` (secondary), `#8b8b9e` (subtle)
- **Accent**: Cyan `#00d2ff` (primary), Blue `#0078ff` (secondary)
- **Accent bg**: `rgba(0, 210, 255, 0.1)`
- **Borders**: `rgba(255, 255, 255, 0.08)`
- **Panel bg**: `rgba(15, 15, 20, 0.4)` (unhovered), `rgba(10, 10, 18, 0.95)` (hovered)

### Light Mode
- **Background**: Warm cream `#f5f0e8` (primary) -- intentionally warm, not pure white
- **Foreground**: Near black `#0f0f0f` (primary), `#374151` (secondary), `#6b7280` (subtle)
- **Accent**: Blue `#0078ff` (primary), Cyan `#00b4d8` (secondary)
- **Panel bg**: `rgba(255, 255, 255, 0.3)` (unhovered), `rgba(255, 255, 255, 0.95)` (hovered)

### Urgency Colors (Deadlines)
- Green (`green-500`): 30+ days remaining
- Yellow (`yellow-500`): 8-30 days
- Red (`red-500`): 7 days or less
- Gray (`gray-400`): Expired

## Typography

| Purpose | Font | Weight | Size |
|---------|------|--------|------|
| Headings | Space Grotesk | 700 | 3xl-5xl |
| Body | Inter | 400 | sm-base |
| Labels/Tags | Space Mono | 400/700 | 0.55rem-0.75rem, uppercase |
| Code | Fira Code | 400 | -- |
| Chinese | LXGW WenKai | -- | inline |

Section labels use red `#ff0044` left bar (12px x 2px `::before`), uppercase Space Mono with `0.1em` letter-spacing.

## Components

### Glass Panels
Core design element. Frosted glass with backdrop-blur, semi-transparent background, 16px border-radius, 1.5rem padding. On hover: background becomes nearly opaque, slight `translateY(-2px)`, glow enhancement via radial gradient overlay.

### Buttons
- **Nav links**: `px-3 py-1.5 rounded-lg` with transparent border, hover shows border + accent bg
- **Music/Theme toggle**: `w-8 h-8 rounded-lg` with visible border, same hover effect
- **Social group** (profile card): Grouped bar with shared border, individual item hover bg
- **Social buttons** (footer): Individual circles, `w-9 h-9`, scale(1.1) on hover
- **Expand icons**: 24px circles with expand arrows (outward), on card headers
- **Shrink icons**: 36px circles with shrink arrows (inward), on sub-page headers

### Icons
- Most icons: stroke-based, `strokeWidth="1.5"`
- LinkedIn: stroke-based "in" outline, `strokeWidth="1.5"`, viewBox `-2 -2 28 28` (slightly padded)
- Twitter/X: filled path, viewBox `-3 -3 30 30` (padded to match other icon sizes)
- Music icon always uses accent color in the nav

## Layout

### Homepage (Bento Grid)
12-column grid on `lg`, single column on mobile:
- **Top**: Bio (9 cols) + Profile/Deadlines (3 cols, stacked)
- **Middle**: News (5 cols) + Publications (7 cols)
- **Bottom**: Projects (7 cols) + Blog (5 cols)

### Sub-Pages
Single centered glass-panel inside `max-w-screen-xl`. Section label + shrink-icon header, large h1, optional description, divider, content.

### Header
Sticky `top-0`, blur backdrop with gradient mask fade. Fake dot grid layer for seamless background pattern. Nav bar is a glass-panel with `rounded-xl`. Content wrapper at `z-10` above the dots.

## Animations

### Ambient
- **3 gradient orbs**: Drift + morph on 40-50s cycles
- **Dot grid**: Fixed radial dots at 20px spacing (opacity 0.4 dark, 0.15 light)
- **Header dots**: Fake dot grid in header area matching background grid

### Interactive
- **Glass panel hover**: `translateY(-2px)` + glow + border color shift, 0.4s cubic-bezier
- **Button hover**: Various (scale, bg change, border color)
- **Player expand/collapse**: Scale from `origin-top-right`, 0.35s
- **Player content**: Staggered fade-in from above (`translateY(-8px)`), 50ms apart
- **Mobile menu**: CSS grid `grid-rows-[0fr]`/`grid-rows-[1fr]` with opacity, 300ms

### Status
- **Blink**: 2s opacity pulse for status dots
- **Breathing (dark only)**: `saturate(1.25) brightness(1.1)` on deadline countdown numbers
- **Bar bounce**: Staggered height animation on music equalizer bars
- **Marquee scroll**: Status text scrolls left, pauses, scrolls right, pauses (12s cycle)
- **Music note**: Gentle rocking rotation on first-visit prompt icon

## Music Player

- SoundCloud widget via hidden iframe, persists in root layout
- 5-track curated playlist, shuffled on each page load
- Triggered from nav bar button (music note icon, always accent-colored)
- Dropdown panel anchored below nav, right-aligned with nav edge (measured dynamically)
- First visit: "Want some music?" prompt after 1s (sessionStorage tracks per session)
- Header shows: blinking red dot + scrolling "VIBING_: [track name]" when playing
- Collapse button uses shrink icon (inward arrows), not X

## Navigation

- All internal links use Next.js `<Link>` for client-side navigation
- Expand icons on homepage cards link to full sub-pages
- Shrink icons on sub-pages link back to home
- Mobile nav: hamburger menu with smooth slide-down animation

## Deployment

- Static export (`output: 'export'`) deployed to GitHub Pages
- Weekly GitHub Action rebuilds to refresh deadline data
- Deadline data cached locally in dev (24h) to avoid repeated fetches
