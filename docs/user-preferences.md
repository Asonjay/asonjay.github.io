# User Preferences & Design Decisions

Notes from iterative design sessions with Jason (Zexin Xu).

## General Approach
- Prefers iterative refinement over big changes -- try something, evaluate visually, adjust
- Values consistency across components (same hover effects, same border styles, same transitions)
- Dislikes over-engineering -- if an animation doesn't look good, remove it rather than forcing it
- Prefers subtle over flashy -- effects should enhance, not distract

## Color & Theme
- Light mode background should be **warm**, not pure white (cream/parchment tone `#f5f0e8`)
- Effects that look good in dark mode don't always work in light mode -- test both
- Glow/breathing effects: disable in light mode if they don't translate well (use static or opacity-based alternatives)
- Dot grid should be subtle in light mode (opacity 0.15 vs 0.4)

## Typography & Labels
- Section labels use underscore convention: `Latest_News`, `Selected_Publications`, `ONLINE_`, `VIBING_`
- Status text width should be fixed to prevent layout shifts (7-8ch)

## Icons
- Prefers stroke-based icons with thin lines (strokeWidth ~1.2-1.5)
- Icons should be visually balanced -- use viewBox padding to normalize sizes across different icon styles
- LinkedIn: stroke outline "in" (not filled, not boxed logo)
- Twitter/X: filled path but padded viewBox (-3) to match stroke icon sizes

## Buttons & Interactions
- Hover effects should use `var(--color-back-accent)` for background tint (not raw rgba)
- Buttons in the nav should match nav link styling (rounded-lg, border, accent hover)
- Music button: always accent-colored icon to stand out
- Theme toggle and music button: square rounded (`w-8 h-8 rounded-lg`), not circular

## Cards & Panels
- Glass panels should not show dot grid through them when hovered
- The dot grid should extend seamlessly through the header area (fake dots in header)
- Nav bar should sit above the dot grid (z-index layering)
- Social button group in profile card: grouped bar style (not individual circles), but use proper CSS transitions for theme switching

## Music Player
- Player drops down from the nav, not floating at bottom
- Right edge aligns with nav bar right edge (dynamically measured)
- Close button: shrink icon (inward arrows), not X symbol
- First visit: small "Want some music?" prompt with check/X icon buttons
- Prompt background: frosted glass matching panel-bg, strong enough blur to hide content underneath
- Playlist shuffles every page load for variety
- "VIBING_: [track name]" scrolls in header when playing (scroll left, pause, scroll right, pause)

## Animations
- Player expand: scale from origin-top-right, content fades in from above (translateY(-8px))
- Mobile menu: smooth slide-down with grid-rows trick, not abrupt show/hide
- Avoid complex page transition animations (card expand to fullscreen was tried and removed -- too jarring)
- Deadline countdown: subtle saturate/brightness breathing in dark mode, static in light mode

## Layout
- Identity card and Profile+Deadlines card should align in height (flex stretch)
- Deadline cards should stretch to fill available space
- Social links group needs horizontal margin (mx-4) to not touch panel edges at narrow widths

## Things That Were Tried and Removed
- Card-expand page transition animation (expanding card to fullscreen before navigating) -- looked bad, removed
- Multiple iterations of glow/breathing effects in light mode -- settled on static
- Scale transform for card transitions -- caused border distortion
