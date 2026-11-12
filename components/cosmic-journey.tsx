"use client";

import { useEffect, useRef, useState } from "react";
import {
  makeJourneyParticles,
  phaseAt,
  progressForIndex,
  type JourneyParams,
  type JourneyParticle,
} from "@/lib/cosmic-journey";

export type JourneyEvent = { id: string; date: string; title: string; era: string; future?: boolean };

const PARTICLE_COUNT = 340;
const LIGHT_COUNT = 26;

const eraClass = (era: string) => "timeline-tag era-" + era.toLowerCase().replace(/[^a-z]+/g, "-");

function rgba(color: [number, number, number], alpha: number): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: JourneyParams,
  particles: JourneyParticle[],
  lights: { x: number; y: number }[],
  time: number,
): void {
  const min = Math.min(width, height);
  const cx = width / 2;
  const cy = height * 0.46;
  ctx.clearRect(0, 0, width, height);

  // Background: deep space, warmed by the early fireball.
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#04060e");
  bg.addColorStop(1, "#0a0f1e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  if (params.bgWarm > 0.01) {
    const warm = ctx.createRadialGradient(cx, cy, 0, cx, cy, min * 0.7);
    warm.addColorStop(0, rgba([255, 150, 80], 0.22 * params.bgWarm));
    warm.addColorStop(1, "rgba(255,150,80,0)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, width, height);
  }

  // Central glow: the singularity, the fireball, then the Sun's ember.
  const coreR = Math.max(1.5, params.coreRadius * min);
  ctx.globalCompositeOperation = "lighter";
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
  glow.addColorStop(0, rgba(params.coreColor, 0.55));
  glow.addColorStop(0.35, rgba(params.coreColor, 0.18));
  glow.addColorStop(1, rgba(params.coreColor, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2);
  ctx.fill();
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  core.addColorStop(0, "rgba(255,255,250,0.95)");
  core.addColorStop(0.55, rgba(params.coreColor, 0.85));
  core.addColorStop(1, rgba(params.coreColor, 0));
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  // Particle field: expanding plasma becoming stars, then galaxies.
  const maxR = min * 0.52;
  for (const p of particles) {
    const spiral = params.cluster * p.radius * 2.4;
    const angle = p.angle + spiral + time * p.drift * 0.12;
    const r = params.spread * p.radius * maxR;
    const x = cx + Math.cos(angle) * r * 1.12;
    const y = cy + Math.sin(angle) * r * 0.92;
    const tw = 0.62 + 0.38 * Math.sin(time * 1.8 + p.twinklePhase);
    const star = 0.35 + 0.65 * params.twinkle;
    const alpha = Math.min(1, (0.18 + 0.62 * star) * (0.55 + 0.45 * tw));
    const warmMix = params.bgWarm * 0.7 + p.warm * 0.3;
    const red = Math.round(200 + 55 * warmMix);
    const green = Math.round(205 + 20 * warmMix - 25 * (1 - warmMix));
    const blue = Math.round(255 - 105 * warmMix);
    ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
    const size = p.size * (0.7 + 0.5 * params.twinkle);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    if (p.flare && params.twinkle > 0.5) {
      const flareAlpha = alpha * 0.5 * params.twinkle;
      const len = size * 3.2;
      ctx.strokeStyle = `rgba(${red},${green},${blue},${flareAlpha})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len);
      ctx.lineTo(x, y + len);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = "source-over";

  // The orb: Earth forms, gains its blue marble, then city lights.
  if (params.orb > 0.01) {
    const orbR = 0.17 * min * params.orb;
    const orb = ctx.createRadialGradient(cx - orbR * 0.4, cy - orbR * 0.45, orbR * 0.1, cx, cy, orbR);
    orb.addColorStop(0, "#bfe4ff");
    orb.addColorStop(0.45, "#5d9bde");
    orb.addColorStop(0.8, "#24457e");
    orb.addColorStop(1, "#101f3d");
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
    ctx.fill();
    // Night side.
    const night = ctx.createRadialGradient(cx + orbR * 0.55, cy + orbR * 0.5, orbR * 0.1, cx, cy, orbR);
    night.addColorStop(0, "rgba(3,6,14,0.78)");
    night.addColorStop(0.6, "rgba(3,6,14,0.28)");
    night.addColorStop(1, "rgba(3,6,14,0)");
    ctx.fillStyle = night;
    ctx.beginPath();
    ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
    ctx.fill();
    // Limb glow.
    ctx.strokeStyle = "rgba(150,200,255,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
    ctx.stroke();
    // City lights on the night side.
    if (params.lights > 0.01) {
      ctx.fillStyle = `rgba(255,214,140,${0.85 * params.lights})`;
      for (const light of lights) {
        const lx = cx + light.x * orbR;
        const ly = cy + light.y * orbR;
        if (light.x * light.x + light.y * light.y > 1) continue;
        ctx.beginPath();
        ctx.arc(lx, ly, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Companion moon.
    if (params.moon > 0.01) {
      const orbitR = orbR * 1.9;
      const moonAngle = time * 0.22 - 0.7;
      const mx = cx + Math.cos(moonAngle) * orbitR;
      const my = cy + Math.sin(moonAngle) * orbitR * 0.82;
      ctx.strokeStyle = `rgba(180,190,220,${0.16 * params.moon})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(cx, cy, orbitR, orbitR * 0.82, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = `rgba(205,210,225,${0.9 * params.moon})`;
      ctx.beginPath();
      ctx.arc(mx, my, Math.max(1.5, 0.022 * min), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Far-future dimming and a vignette to seat the scene.
  if (params.dim > 0.01) {
    ctx.fillStyle = `rgba(3,5,11,${params.dim * 0.55})`;
    ctx.fillRect(0, 0, width, height);
  }
  const vignette = ctx.createRadialGradient(cx, cy, min * 0.3, cx, cy, min * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(2,3,8,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export function CosmicJourney({ events }: { events: JourneyEvent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const targetRef = useRef(0);
  const displayRef = useRef(0);
  const particlesRef = useRef<JourneyParticle[] | null>(null);
  const lightsRef = useRef<{ x: number; y: number }[] | null>(null);

  if (particlesRef.current === null) {
    particlesRef.current = makeJourneyParticles(PARTICLE_COUNT);
  }
  if (lightsRef.current === null) {
    const rand = makeJourneyParticles(LIGHT_COUNT, 977351);
    lightsRef.current = rand.map((p) => ({
      x: 0.15 + Math.cos(p.angle) * p.radius * 0.8,
      y: 0.1 + Math.sin(p.angle) * p.radius * 0.8,
    }));
  }

  useEffect(() => {
    targetRef.current = progressForIndex(activeIndex, events.length);
  }, [activeIndex, events.length]);

  // Track which milestone sits in the middle of the viewport.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".timeline-event"));
    if (nodes.length === 0) return;
    const indexOf = (node: HTMLElement): number => {
      const found = events.findIndex((event) => event.id === node.id);
      return found === -1 ? nodes.indexOf(node) : found;
    };
    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActiveIndex(indexOf(entry.target as HTMLElement));
          }
        },
        { rootMargin: "-42% 0px -48% 0px", threshold: 0 },
      );
      nodes.forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    }
    const onScroll = (): void => {
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      nodes.forEach((node, i) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setActiveIndex(indexOf(nodes[best]));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [events]);

  // Animate the canvas: ease the displayed progress toward the target.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const particles = particlesRef.current ?? [];
    const lights = lightsRef.current ?? [];
    let raf = 0;
    let start: number | null = null;

    const resize = (): void => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (time: number): void => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = wrap.getBoundingClientRect();
      drawScene(ctx, rect.width, rect.height, phaseAt(displayRef.current), particles, lights, time);
    };

    if (reduced) {
      displayRef.current = targetRef.current;
      draw(0);
      const interval = window.setInterval(() => {
        if (displayRef.current !== targetRef.current) {
          displayRef.current = targetRef.current;
          draw(0);
        }
      }, 120);
      return () => {
        window.clearInterval(interval);
        resizeObserver.disconnect();
      };
    }

    const frame = (timestamp: number): void => {
      if (start === null) start = timestamp;
      const target = targetRef.current;
      displayRef.current += (target - displayRef.current) * 0.07;
      if (Math.abs(target - displayRef.current) < 0.0004) displayRef.current = target;
      draw((timestamp - start) / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, []);

  const active = events[Math.min(activeIndex, events.length - 1)] ?? events[0];
  if (!active) return null;

  return (
    <div className="journey-panel">
      <div className="journey-canvas-wrap" ref={wrapRef}>
        <canvas ref={canvasRef} className="journey-canvas" aria-hidden="true" />
        <p className="journey-stage" aria-hidden="true">
          {active.future ? "WHAT MAY COME" : "THE JOURNEY SO FAR"}
        </p>
      </div>
      <div className="journey-readout" aria-live="polite">
        <div className="journey-readout-top">
          <span className={eraClass(active.era)}>{active.era}</span>
          <span className="journey-index">
            {String(activeIndex + 1).padStart(2, "0")} / {String(events.length).padStart(2, "0")}
          </span>
        </div>
        <p className="journey-date">{active.date}</p>
        <p className="journey-title">{active.title}</p>
        <div className="journey-dots" aria-label="Jump to a milestone">
          {events.map((event, i) => (
            <a
              key={event.id}
              href={`#${event.id}`}
              className={
                "journey-dot" +
                (i === activeIndex ? " journey-dot-active" : "") +
                (event.future ? " journey-dot-future" : "")
              }
              aria-label={`${event.title} — ${event.date}`}
              aria-current={i === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
      <p className="journey-caption">
        What came before the hot, dense beginning is unknown — the journey starts at the first moment
        physics can describe.
      </p>
    </div>
  );
}
