// Single source of truth for all movement/camera tuning. No other module may
// redefine these — later tasks import from here.

export const MOVE_SPEED = 6 // u/s top speed
export const ACCEL_LAMBDA = 12 // damp λ toward target velocity
export const DECEL_LAMBDA = 8 // damp λ toward zero
export const TURN_LAMBDA = 14 // shortest-arc facing damp
export const CAM_POS_LAMBDA = 4 // camera position damp
export const CAM_TARGET_LAMBDA = 5 // camera lookAt damp
export const PANEL_DOLLY = 0.95 // zoom factor while a panel is open (consumed by panel system, Task 3)
export const PANEL_DOLLY_LAMBDA = 3 // damp λ for the panel dolly
export const STRIDE_FREQ = 15 // rad/s walk-cycle at full speed (scaled by speed ratio)
export const BOB_AMPLITUDE = 0.05 // vertical bob
export const LEAN_MAX = 0.08 // rad forward body lean at full speed
export const DELTA_CLAMP = 1 / 30 // max dt (frame-rate independence)
export const PLAYER_RADIUS = 0.35 // collision half-size
export const WAYPOINT_POP = 0.3 // auto-walk: pop a path waypoint once within this range
export const VIEWSIZE_LANDSCAPE = 12 // ortho half-height
export const VIEWSIZE_PORTRAIT = 15 // ortho half-height when aspect < 1

// Voxel Jason palette.
export const PLAYER_COLORS = {
  hair: '#1a1a1e',
  skin: '#f0c8a0',
  hoodie: '#23233a',
  accent: '#7c9aff', // site accent (globals.css --color-accent family)
  pants: '#2c2c34',
  shoes: '#e8e8ea',
  glasses: '#111114',
}
