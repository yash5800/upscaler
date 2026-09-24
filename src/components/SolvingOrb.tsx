/**
 * SolvingOrb — the one-line loader: progress ring + `solving` orb.
 * ================================================================
 * A preset wrapper around <OrbProgressRing> for the most common case —
 * "the system is working on it" — with the orb animation locked to
 * `solving` (bands scramble in quarter turns, then click back) and the
 * ring in its indeterminate loop (grow → chase → wrap sweep).
 *
 * Usage
 * -----
 *   <SolvingOrb />                                  // defaults (violet/pink)
 *   <SolvingOrb size={200} />                       // bigger (orb auto-scales)
 *   <SolvingOrb variant="mint" />                   // named color preset
 *   <SolvingOrb variant="custom" from="#f59e0b" to="#ef4444" trackColor="#f59e0b" />
 *   <SolvingOrb thickness={10} gapDegrees={8} segmentCount={8} />  // ring geometry
 *   <SolvingOrb loop={false} progress={0.4} />      // determinate ring at 40%
 *   <SolvingOrb speed={0.5} paused={isBusy} />      // motion control
 */

import { ThinkingOrb, type OrbState, type OrbTheme } from 'thinking-orbs'
import { useId } from 'react'

/** Named color schemes. `custom` = no colors, falls through to explicit props. */
const VARIANTS: Record<string, Pick<OrbProgressRingProps, 'from' | 'to' | 'trackColor'>> = {
  violet: { from: '#a78bfa', to: '#f472b6', trackColor: '#ffffff' },
  orchid: { from: '#ff8ad4', to: '#8b5cf6', trackColor: '#ffffff' },
  mint:   { from: '#5ce8b5', to: '#2f9bff', trackColor: '#ffffff' },
  sunset: { from: '#ffb35c', to: '#ff5c87', trackColor: '#ffffff' },
  amber:  { from: '#ffd166', to: '#ff8a3d', trackColor: '#ffffff' },
  cyber:  { from: '#57e8ff', to: '#8b5cf6', trackColor: '#57e8ff' },
  rose:   { from: '#ff5c7a', to: '#b478ff', trackColor: '#ff5c7a' },
  custom: {},
}

export interface OrbProgressRingProps {
  /** Outer diameter in px. Orbs come in tuned presets only: ≥112px rings get the 64px orb, smaller ones the 20px orb. @default 150 */
  size?: number
  /** Which orb animation to show in the center. @default 'composing' */
  state?: OrbState
  /** Ring stroke width, in viewBox units (100 = full circle). @default 7 */
  thickness?: number
  /** How many arc segments the muted track is split into. @default 5 */
  segmentCount?: number
  /** Gap between track segments, in degrees (360 = full circle). @default 14 */
  gapDegrees?: number
  /** Muted track color. Alpha is applied separately via trackOpacity. @default '#ffffff' */
  trackColor?: string
  /** Track opacity (kept separate so the color picker can stay a plain hex). @default 0.16 */
  trackOpacity?: number
  /** Gradient start color of the sweeping arc. @default '#ff8ad4' */
  from?: string
  /** Gradient end color of the sweeping arc. @default '#8b5cf6' */
  to?: string
  /** true = endless grow/chase/shrink sweep; false = static ring at `progress`. @default true */
  loop?: boolean
  /** Manual fill 0..1 when loop={false}. @default 0.7 */
  progress?: number
  /** Multiplier on the sweep speed (2 = twice as fast). @default 1 */
  speed?: number
  /** Freeze both the arc sweep and the orb. @default false */
  paused?: boolean
  /** Pin the orb ink regardless of app theme: 'dark' = light dots (for dark backgrounds). @default 'dark' */
  orbTheme?: OrbTheme
  className?: string
}

export type SolvingOrbVariant = keyof typeof VARIANTS

export interface SolvingOrbProps {
  /** Outer diameter in px. ≥112 gets the 64px orb, below gets 20px. @default 150 */
  size?: number
  /** Color scheme shortcut. Use 'custom' + from/to/trackColor for one-off colors. @default 'violet' */
  variant?: SolvingOrbVariant
  /** Arc gradient start (overrides the variant). */
  from?: string
  /** Arc gradient end (overrides the variant). */
  to?: string
  /** Muted segmented track color (overrides the variant). */
  trackColor?: string
  /** Track opacity 0..1. @default 0.16 */
  trackOpacity?: number
  /** Ring stroke width, viewBox units (100 = full circle). @default 7 */
  thickness?: number
  /** Number of segments on the muted track. @default 5 */
  segmentCount?: number
  /** Gap between track segments, degrees. @default 14 */
  gapDegrees?: number
  /** true = endless sweep; false = static ring at `progress`. @default true */
  loop?: boolean
  /** Fill 0..1 when loop={false}. @default 0.7 */
  progress?: number
  /** Motion multiplier (2 = twice as fast). @default 1 */
  speed?: number
  /** Freeze ring sweep + orb. @default false */
  paused?: boolean
  /** Override the locked 'solving' orb state (e.g. 'connecting', 'composing'). */
  stateOverride?: OrbState
  className?: string
}

function OrbProgressRing({
  size = 150,
  state = 'composing',
  thickness = 7,
  segmentCount = 5,
  gapDegrees = 14,
  trackColor = '#ffffff',
  trackOpacity = 0.16,
  from = '#ff8ad4',
  to = '#8b5cf6',
  loop = true,
  progress = 0.7,
  speed = 1,
  paused = false,
  orbTheme = 'dark',
  className,
}: OrbProgressRingProps) {
  // Gradient/element ids must be unique per instance — but React's useId
  // contains ':' which is invalid inside url(#…), so strip it.
  const uid = useId().replace(/:/g, '')
  const gradId = `opr-grad-${uid}`

  // Track segmentation: with pathLength=100 the dash pattern simply repeats.
  // gap in degrees → dash units: 14° / 360° * 100 ≈ 3.89 units per gap.
  const gapUnits = (gapDegrees / 360) * 100
  const segUnits = 100 / segmentCount - gapUnits
  const trackDash = `${segUnits} ${gapUnits}`

  // One shared duration keeps arc + track in phase; `speed` divides it.
  const dur = `${(2.6 / Math.max(speed, 0.05)).toFixed(3)}s`
  const playState = paused ? 'paused' : 'running'

  // Manual (determinate) mode: arc length = progress, no keyframes involved.
  const staticDash = `${Math.min(Math.max(progress, 0), 1) * 100} 100`

  // Tuned orb sizes are 64 and 20 only — pick by ring size.
  const orbSize = size >= 112 ? 64 : 20

  return (
    <span
      className={`opr-root ${className ?? ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${state} — ${loop ? 'loading' : `${Math.round(progress * 100)}%`}`}
    >
      <svg className="opr-svg" viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          {/* Arc gradient — rotate/skew by editing x1/y1/x2/y2 here. */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {/* -90° so 0% of the path starts at 12 o'clock instead of 3 o'clock. */}
        <g transform="rotate(-90 50 50)">
          {/* Muted segmented track. Pulse + geometry are CSS-editable. */}
          <circle
            className="opr-track"
            cx={50}
            cy={50}
            r={50 - thickness / 2 - 1} /* 1u inset keeps round caps inside the viewBox */
            fill="none"
            stroke={trackColor}
            strokeOpacity={trackOpacity}
            strokeWidth={thickness}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={trackDash}
            style={{ ['--opr-dur' as never]: dur, animationPlayState: playState }}
          />

          {/* The gradient arc. Loop mode → CSS keyframes drive dasharray/offset;
              manual mode → static dash from `progress`. */}
          <circle
            className={loop ? 'opr-progress' : 'opr-progress-static'}
            cx={50}
            cy={50}
            r={50 - thickness / 2 - 1}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={loop ? undefined : staticDash}
            style={
              loop
                ? { ['--opr-dur' as never]: dur, animationPlayState: playState }
                : undefined
            }
          />
        </g>
      </svg>

      {/* The orb sits dead-center on top of the ring hole. */}
      <span className="opr-orb">
        <ThinkingOrb state={state} size={orbSize} theme={orbTheme} paused={paused} />
      </span>
    </span>
  )
}

export function SolvingOrb({
  size = 150,
  variant = 'violet',
  from,
  to,
  trackColor,
  trackOpacity = 0.16,
  thickness = 7,
  segmentCount = 5,
  gapDegrees = 14,
  loop = true,
  progress = 0.7,
  speed = 1,
  paused = false,
  stateOverride,
  className,
}: SolvingOrbProps) {
  // Merge order: variant colors first, then any explicit prop overrides.
  const colors = { ...VARIANTS[variant], ...(from && { from }), ...(to && { to }), ...(trackColor && { trackColor }) }

  return (
    <OrbProgressRing
      size={size}
      state={stateOverride ?? "solving"}
      trackOpacity={trackOpacity}
      thickness={thickness}
      segmentCount={segmentCount}
      gapDegrees={gapDegrees}
      loop={loop}
      progress={progress}
      speed={speed}
      paused={paused}
      className={className}
      {...colors}
    />
  )
}

export default SolvingOrb
