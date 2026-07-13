'use client'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import type { TargetAndTransition, Variants } from 'framer-motion'
import type { ReactNode } from 'react'

// Home animation layer (framer-motion). LazyMotion + `domAnimation` + `m.*`
// components keep the shipped chunk lean: domAnimation bundles exactly the
// features this layer uses — animation, exit, inView (scroll reveals), tap,
// focus, hover — and omits drag/pan/layout (those live only in domMax). `strict`
// throws if a bare `motion.*` sneaks in, guaranteeing the tree-shaken bundle.
//
// framer is imported ONLY under components/home/** (global-constraints): the
// game, classic pages, and /study never pull it in.

export function HomeMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

// Softly-bouncy spring for y/scale; opacity rides a short tween so it never
// overshoots. `delay` (the custom value) drives the entrance cascade / reveal
// order. Motion vocabulary shared by the mount cascade and the scroll reveals.
export const tileVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      delay,
      opacity: { duration: 0.3, delay },
    },
  }),
}

// Reduced motion: opacity-only fade, no y/scale, no stagger delay.
export const tileVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// One bento tile wrapper. Owns ONLY the entrance/reveal transform (opacity + y +
// scale) — the inner tile keeps its Task-13 CSS hover lift, so the two transforms
// never land on the same element. `.home-anim` (see home-tokens.css) makes the
// wrapper a flex column whose single child fills it, preserving the grid's
// equal-height rows. `reveal` tiles fire once when scrolled into view; the rest
// cascade on mount. Grid placement stays via the shared home-area-<area> class.
export function MotionTile({
  area,
  delay = 0,
  reveal = false,
  children,
}: {
  area: string
  delay?: number
  reveal?: boolean
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  const variants = reduce ? tileVariantsReduced : tileVariants
  const trigger = reveal
    ? ({ whileInView: 'visible', viewport: { once: true, margin: '-10% 0px' } } as const)
    : ({ animate: 'visible' } as const)

  return (
    <m.div
      className={`home-anim home-tile home-area-${area}`}
      custom={reduce ? 0 : delay}
      variants={variants}
      initial="hidden"
      {...trigger}
    >
      {children}
    </m.div>
  )
}

// whileHover/whileTap props for interactive controls. framer OWNS the transform
// on these elements (paired with the .home-motion CSS opt-out that cancels the
// duplicate CSS hover translate), so hover + tap never collide with a CSS
// transform. Hover is mouse-only in framer, so it never sticks on touch; tap
// fires for every pointer. Both are disabled under reduced motion (whileTap
// off, per the brief). Shadow stays in CSS (.home-lift / .home-card).
type InteractionProps = { whileHover?: TargetAndTransition; whileTap?: TargetAndTransition }
export function useInteraction(variant: 'control' | 'card' = 'control'): InteractionProps {
  const reduce = useReducedMotion()
  if (reduce) return {}
  return {
    whileHover: { y: variant === 'card' ? -2 : -1 },
    whileTap: { scale: variant === 'card' ? 0.985 : 0.97 },
  }
}
