// Pure math for the Timeline's scroll-driven cosmic journey visualization.
// The journey is a single progress value from 0 (the singularity) to 1 (the
// far future). Keyframes describe how the scene should look at fixed points
// along that arc; the canvas interpolates between them as the reader scrolls.
// Keyframes are deliberately independent of the milestone count: adding
// milestones re-maps progress, but the arc itself stays the same.

export type RGB = [number, number, number];

export type JourneyParams = {
  // Radius of the central glow, as a fraction of the canvas's smaller side.
  coreRadius: number;
  coreColor: RGB;
  // How far the particle field has expanded, 0 (a point) to 1 (full field).
  spread: number;
  // Star ignition: 0 (no stars) to 1 (full starfield).
  twinkle: number;
  // Spiral clustering of the particle field, 0 (uniform) to 1 (galactic arms).
  cluster: number;
  // Earth-like orb presence, 0 (absent) to 1 (fully formed).
  orb: number;
  // Warm lights on the orb's night side (humanity), 0 to 1.
  lights: number;
  // Small companion moon orbiting the orb, 0 to 1.
  moon: number;
  // Warm tint of the background glow, 0 (deep blue-black) to 1 (fire-lit).
  bgWarm: number;
  // Overall dimming for the far future, 0 (full brightness) to 1 (dark).
  dim: number;
};

export type JourneyKeyframe = { at: number; params: JourneyParams };

const P = (
  coreRadius: number,
  coreColor: RGB,
  spread: number,
  twinkle: number,
  cluster: number,
  orb: number,
  lights: number,
  moon: number,
  bgWarm: number,
  dim: number,
): JourneyParams => ({ coreRadius, coreColor, spread, twinkle, cluster, orb, lights, moon, bgWarm, dim });

export const JOURNEY_KEYFRAMES: JourneyKeyframe[] = [
  { at: 0.0, params: P(0.02, [255, 244, 214], 0.02, 0, 0, 0, 0, 0, 1, 0) },
  { at: 0.07, params: P(0.3, [255, 220, 170], 0.3, 0, 0, 0, 0, 0, 0.8, 0) },
  { at: 0.13, params: P(0.12, [255, 180, 120], 0.55, 0.8, 0.1, 0, 0, 0, 0.4, 0) },
  { at: 0.2, params: P(0.06, [220, 200, 255], 0.75, 1, 0.8, 0, 0, 0, 0.15, 0) },
  { at: 0.27, params: P(0.08, [255, 226, 160], 0.8, 1, 0.9, 0.15, 0, 0, 0.2, 0) },
  { at: 0.33, params: P(0.05, [180, 210, 255], 0.82, 1, 0.9, 0.7, 0, 0, 0.1, 0) },
  { at: 0.4, params: P(0.05, [180, 210, 255], 0.84, 1, 0.9, 0.85, 0, 0, 0.08, 0) },
  { at: 0.47, params: P(0.05, [180, 210, 255], 0.86, 1, 0.9, 0.9, 0, 0, 0.08, 0) },
  { at: 0.53, params: P(0.05, [180, 210, 255], 0.87, 1, 0.9, 0.95, 0, 0, 0.08, 0) },
  { at: 0.6, params: P(0.05, [180, 210, 255], 0.88, 1, 0.9, 0.9, 0, 0, 0.08, 0) },
  { at: 0.67, params: P(0.05, [180, 210, 255], 0.89, 1, 0.9, 1, 0.15, 0, 0.08, 0) },
  { at: 0.73, params: P(0.05, [180, 210, 255], 0.9, 1, 0.9, 1, 0.4, 0, 0.08, 0) },
  { at: 0.8, params: P(0.05, [180, 210, 255], 0.9, 1, 0.9, 1, 0.6, 1, 0.08, 0) },
  { at: 0.87, params: P(0.05, [180, 210, 255], 0.91, 1, 0.9, 1, 0.8, 1, 0.08, 0) },
  { at: 0.93, params: P(0.18, [255, 120, 80], 0.94, 0.7, 0.7, 0.7, 0.3, 0.5, 0.5, 0.25) },
  { at: 1.0, params: P(0.05, [150, 160, 220], 1, 0.3, 0.5, 0.2, 0, 0, 0, 0.6) },
];

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const smoothstep = (t: number): number => t * t * (3 - 2 * t);

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const lerpColor = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

/** Interpolated scene parameters for a journey progress value in [0, 1]. */
export function phaseAt(progress: number): JourneyParams {
  const p = clamp01(progress);
  const frames = JOURNEY_KEYFRAMES;
  if (p <= frames[0].at) return { ...frames[0].params, coreColor: [...frames[0].params.coreColor] as RGB };
  for (const frame of frames) {
    if (p === frame.at) return { ...frame.params, coreColor: [...frame.params.coreColor] as RGB };
  }
  for (let i = 1; i < frames.length; i++) {
    if (p <= frames[i].at) {
      const prev = frames[i - 1];
      const next = frames[i];
      const raw = (p - prev.at) / (next.at - prev.at);
      const t = smoothstep(clamp01(raw));
      const a = prev.params;
      const b = next.params;
      return {
        coreRadius: lerp(a.coreRadius, b.coreRadius, t),
        coreColor: lerpColor(a.coreColor, b.coreColor, t),
        spread: lerp(a.spread, b.spread, t),
        twinkle: lerp(a.twinkle, b.twinkle, t),
        cluster: lerp(a.cluster, b.cluster, t),
        orb: lerp(a.orb, b.orb, t),
        lights: lerp(a.lights, b.lights, t),
        moon: lerp(a.moon, b.moon, t),
        bgWarm: lerp(a.bgWarm, b.bgWarm, t),
        dim: lerp(a.dim, b.dim, t),
      };
    }
  }
  const last = frames[frames.length - 1].params;
  return { ...last, coreColor: [...last.coreColor] as RGB };
}

/** Journey progress for the active milestone: first milestone is 0, last is 1. */
export function progressForIndex(index: number, total: number): number {
  if (total <= 1) return 0;
  return clamp01(index / (total - 1));
}

// Deterministic particles so the scene is stable across renders and devices.
export type JourneyParticle = {
  angle: number;
  radius: number;
  size: number;
  twinklePhase: number;
  drift: number;
  warm: number;
  flare: boolean;
};

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeJourneyParticles(count: number, seed = 20260712): JourneyParticle[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    angle: rand() * Math.PI * 2,
    radius: Math.pow(rand(), 0.6),
    size: 0.5 + rand() * 1.5,
    twinklePhase: rand() * Math.PI * 2,
    drift: 0.02 + rand() * 0.08,
    warm: rand(),
    flare: i % 7 === 0,
  }));
}
