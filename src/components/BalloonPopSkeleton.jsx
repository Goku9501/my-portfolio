import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

let sharedAudioCtx = null;

/**
 * Play a crisp balloon pop snap followed by staggered hollow wooden bone clacks.
 * Safe against autoplay restrictions and never interrupts background MP3 playback.
 */
function playBoneScatterSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    const ctx = sharedAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // 1. Dry crisp pop snap at 0ms
    const sampleCount = Math.floor(ctx.sampleRate * 0.07);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1150, now);
    filter.Q.setValueAtTime(0.9, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.32, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.065);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.22, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);

    // 2. Staggered hollow woody bone-clack pips as scattered pieces hit & bounce
    const clacks = [
      { delay: 0.065, freq: 680 },
      { delay: 0.135, freq: 920 },
      { delay: 0.21, freq: 540 },
      { delay: 0.3, freq: 810 },
    ];
    clacks.forEach(({ delay, freq }) => {
      const t0 = now + delay;
      const pip = ctx.createOscillator();
      pip.type = 'triangle';
      pip.frequency.setValueAtTime(freq, t0);
      pip.frequency.exponentialRampToValueAtTime(freq * 0.55, t0 + 0.024);

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(freq, t0);
      bp.Q.setValueAtTime(2.4, t0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.16, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.026);

      pip.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      pip.start(t0);
      pip.stop(t0 + 0.03);
    });
  } catch {
    // Ignore Web Audio errors in restricted environments
  }
}

/**
 * Determine whether an ancestor between `target` and `body` paints an opaque background,
 * meaning a z-0 background skeleton behind it is covered by a card/header/modal.
 */
function isCoveredByOpaqueCard(target, rootEl) {
  if (!target || !(target instanceof Element)) return false;
  if (rootEl && rootEl.contains(target)) return false;
  if (target.closest('button, a, input, textarea, select')) return true;

  let node = target;
  while (node && node !== document.body && node !== document.documentElement) {
    if (node === rootEl) return false;

    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      const rgbaMatch = bg.match(/^rgba?\(([^)]+)\)$/);
      if (rgbaMatch) {
        const parts = rgbaMatch[1].split(',').map((p) => p.trim());
        const alpha = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
        if (alpha > 0.02) return true;
      } else {
        const slashAlpha = bg.match(/\/\s*([\d.]+)%?\s*\)$/);
        const alpha = slashAlpha ? parseFloat(slashAlpha[1]) : 1;
        if (alpha > 0.02) return true;
      }
    }
    node = node.parentElement;
  }

  return false;
}

/**
 * 12 anatomical sketchbook bone pieces matching DancingSkeletonStickers SVG styling.
 * `offsetX`/`offsetY` place each piece accurately at start & magnetic reassembly.
 */
const BONE_SPECS = [
  { id: 'skull', offsetX: 0, offsetY: -26, width: 38, height: 32, floorGroup: true },
  { id: 'rib-lg', offsetX: 0, offsetY: -4, width: 32, height: 12, floorGroup: false },
  { id: 'rib-md', offsetX: 0, offsetY: 4, width: 26, height: 11, floorGroup: false },
  { id: 'rib-sm', offsetX: 0, offsetY: 10, width: 22, height: 10, floorGroup: true },
  { id: 'spine', offsetX: 0, offsetY: 2, width: 14, height: 26, floorGroup: false },
  { id: 'pelvis', offsetX: 0, offsetY: 16, width: 28, height: 16, floorGroup: true },
  { id: 'arm-l', offsetX: -18, offsetY: -4, width: 28, height: 12, floorGroup: false },
  { id: 'arm-r', offsetX: 18, offsetY: -4, width: 28, height: 12, floorGroup: false },
  { id: 'femur-l', offsetX: -10, offsetY: 26, width: 34, height: 14, floorGroup: true },
  { id: 'femur-r', offsetX: 10, offsetY: 26, width: 34, height: 14, floorGroup: false },
  { id: 'shoe-l', offsetX: -12, offsetY: 38, width: 22, height: 13, floorGroup: true },
  { id: 'shoe-r', offsetX: 12, offsetY: 38, width: 22, height: 13, floorGroup: false },
];

/**
 * Individual hand-drawn sketchbook bone SVG piece with cream fill & bold ink outline.
 */
function BonePieceSVG({ piece, accent = '#FACC15' }) {
  switch (piece.id) {
    case 'skull':
      return (
        <svg width="38" height="32" viewBox="0 0 38 32" fill="none">
          <rect
            x="3"
            y="4"
            width="32"
            height="25"
            rx="12"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.3"
          />
          {/* Accent cap stripe */}
          <path
            d="M4 11 C4 3, 34 3, 34 11 Z"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
          />
          {/* Dizzy X eyes */}
          <path
            d="M10 15 L15 20 M15 15 L10 20"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M23 15 L28 20 M28 15 L23 20"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Nose & wavy dizzy mouth */}
          <path d="M19 19.5 L17.6 22.2 L20.4 22.2 Z" fill="#18181b" />
          <path
            d="M13 25 Q16 23.5 19 25 Q22 26.5 25 25"
            stroke="#18181b"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'rib-lg':
      return (
        <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
          <rect
            x="2"
            y="2.5"
            width="28"
            height="7"
            rx="3.5"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.1"
          />
          <line x1="16" y1="3" x2="16" y2="9" stroke="#18181b" strokeWidth="1.6" />
        </svg>
      );

    case 'rib-md':
      return (
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
          <rect
            x="2"
            y="2.2"
            width="22"
            height="6.5"
            rx="3.2"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2"
          />
          <line x1="13" y1="2.8" x2="13" y2="8.2" stroke="#18181b" strokeWidth="1.5" />
        </svg>
      );

    case 'rib-sm':
      return (
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <rect
            x="2"
            y="2"
            width="18"
            height="6"
            rx="3"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2"
          />
        </svg>
      );

    case 'spine':
      return (
        <svg width="14" height="26" viewBox="0 0 14 26" fill="none">
          <line x1="7" y1="3" x2="7" y2="23" stroke="#18181b" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="2.5" y="2.5" width="9" height="5.5" rx="2.5" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
          <rect x="2.5" y="10" width="9" height="5.5" rx="2.5" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
          <rect x="2.5" y="17.5" width="9" height="5.5" rx="2.5" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
        </svg>
      );

    case 'pelvis':
      return (
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <ellipse
            cx="14"
            cy="8"
            rx="11.5"
            ry="5.5"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2.2"
          />
          <circle cx="9.5" cy="8" r="2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.4" />
          <circle cx="18.5" cy="8" r="2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.4" />
        </svg>
      );

    case 'arm-l':
    case 'arm-r':
      return (
        <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
          <path
            d="M6 4.2 A2.5 2.5 0 1 0 6 7.8 L20 7.5 L20 4.5 Z"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="5" cy="4.2" r="2.2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.8" />
          <circle cx="5" cy="7.8" r="2.2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.8" />
          <circle cx="22.5" cy="6" r="3.6" fill={accent} stroke="#18181b" strokeWidth="2" />
        </svg>
      );

    case 'femur-l':
    case 'femur-r':
      return (
        <svg width="34" height="14" viewBox="0 0 34 14" fill="none">
          <rect
            x="6"
            y="4.8"
            width="22"
            height="4.4"
            rx="2"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2"
          />
          <circle cx="5.5" cy="4.3" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
          <circle cx="5.5" cy="9.7" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
          <circle cx="28.5" cy="4.3" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
          <circle cx="28.5" cy="9.7" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
        </svg>
      );

    case 'shoe-l':
    case 'shoe-r':
    default:
      return (
        <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
          <path
            d="M3 8 C3 4.5, 7.5 2.5, 13 3.5 C17 4.2, 19.5 6.5, 19.5 8.8 L19.5 10.5 L2.5 10.5 Z"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="2.2"
            y="8.6"
            width="17.6"
            height="2.6"
            rx="1.2"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="1.7"
          />
        </svg>
      );
  }
}

/**
 * Tiny hand-drawn ink strain/sweat ticks around the corners when near burst limit (> 0.55).
 * No bubbles, no circles, no glow filters.
 */
function StrainTicks({ pressure, accent }) {
  const color = pressure > 0.78 ? '#EF4444' : '#18181b';

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none select-none absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] z-20 overflow-visible"
      aria-hidden="true"
    >
      {/* Top-left comic ticks */}
      <line x1="10" y1="22" x2="19" y2="27" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="19" y1="10" x2="24" y2="19" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      {/* Top-right comic ticks */}
      <line x1="110" y1="22" x2="101" y2="27" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="101" y1="10" x2="96" y2="19" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      {/* Bottom-left & bottom-right outward strain ticks */}
      <line x1="10" y1="98" x2="19" y2="93" stroke={color} strokeWidth="2.3" strokeLinecap="round" />
      <line x1="110" y1="98" x2="101" y2="93" stroke={color} strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

const INK_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function shortestAngle(deg) {
  return ((((deg % 360) + 540) % 360) - 180);
}

/**
 * Portal-rendered viewport-wide 2D bone scatter & magnetic reassembly simulation.
 * Mutates bone DOM transforms directly at 60fps with zero React re-renders per frame.
 */
function ScatteredBonesPortal({
  originX,
  originY,
  accent,
  getTargetOrigin,
  onReassembled,
}) {
  const boneRefs = useRef([]);
  const getTargetOriginRef = useRef(getTargetOrigin);
  getTargetOriginRef.current = getTargetOrigin;
  const onReassembledRef = useRef(onReassembled);
  onReassembledRef.current = onReassembled;

  useEffect(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Push scatter across the entire website even if popped near left/right margins
    const inwardBias =
      originX < vw * 0.22 ? 230 : originX > vw * 0.78 ? -230 : 0;

    const bodies = BONE_SPECS.map((spec, idx) => {
      // Spread velocities across the full viewport width while keeping explosive variety
      const baseSpread = ((idx / (BONE_SPECS.length - 1)) - 0.5) * 980;
      const vx = baseSpread * 0.65 + randomBetween(-420, 420) + inwardBias;
      const vy = randomBetween(-700, -180);
      const vRot = randomBetween(-720, 720);

      // Staggered floor depths: 5 pieces settle along bottom edge, 7 scatter across viewport height
      const rawFloor = spec.floorGroup
        ? vh - randomBetween(22, 72)
        : randomBetween(Math.max(120, vh * 0.24), Math.max(160, vh - 85));
      const floorY = Math.min(vh - 20, Math.max(110, rawFloor));

      return {
        x: originX + spec.offsetX,
        y: originY + spec.offsetY,
        rot: randomBetween(-18, 18),
        vx,
        vy,
        vRot,
        floorY,
        settled: false,
        restX: 0,
        restY: 0,
        restRot: 0,
      };
    });

    let rafId = null;
    let startTime = null;
    let lastTime = null;
    let snapshotted = false;
    let completed = false;

    const step = (now) => {
      if (startTime === null) {
        startTime = now;
        lastTime = now;
      }

      const elapsed = now - startTime;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (elapsed >= 3500) {
        if (!completed) {
          completed = true;
          onReassembledRef.current?.();
        }
        return;
      }

      const isRattle = elapsed >= 2550 && elapsed < 2850;
      const isReassemble = elapsed >= 2850;

      if ((isRattle || isReassemble) && !snapshotted) {
        snapshotted = true;
        bodies.forEach((b) => {
          b.restX = b.x;
          b.restY = b.y;
          b.restRot = shortestAngle(b.rot);
        });
      }

      let target = null;
      let ease = 0;
      if (isReassemble) {
        target = getTargetOriginRef.current?.() || { x: originX, y: originY };
        const p = Math.min(1, Math.max(0, (elapsed - 2850) / 650));
        ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      }

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const spec = BONE_SPECS[i];
        const el = boneRefs.current[i];

        let rx = b.x;
        let ry = b.y;
        let rRot = b.rot;

        if (!isRattle && !isReassemble) {
          // Phase A (0 -> 2.55s): Free 2D gravity scatter + wall/floor bounce
          if (!b.settled) {
            b.vy += 1550 * dt;
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.rot += b.vRot * dt;

            if (b.x < 24) {
              b.x = 24;
              b.vx = Math.abs(b.vx) * 0.68;
              b.vRot *= -0.8;
            } else if (b.x > vw - 24) {
              b.x = vw - 24;
              b.vx = -Math.abs(b.vx) * 0.68;
              b.vRot *= -0.8;
            }

            if (b.y < 24) {
              b.y = 24;
              b.vy = Math.abs(b.vy) * 0.45;
            }

            if (b.y >= b.floorY) {
              b.y = b.floorY;
              if (Math.abs(b.vy) < 42 && Math.abs(b.vx) < 35) {
                b.vy = 0;
                b.vx = 0;
                b.vRot = 0;
                b.settled = true;
              } else {
                b.vy = -Math.abs(b.vy) * 0.48;
                b.vx *= 0.78;
                b.vRot *= 0.76;
              }
            }
          }
          rx = b.x;
          ry = b.y;
          rRot = b.rot;
        } else if (isRattle) {
          // Phase B (2.55 -> 2.85s): Wake-up rattle before zipping back
          rx = b.restX + Math.sin(elapsed * 0.09 + i * 1.7) * 2.5;
          ry = b.restY + Math.cos(elapsed * 0.11 + i * 2.1) * 2.5;
          rRot = b.restRot + Math.sin(elapsed * 0.08 + i) * 6;
        } else {
          // Phase C (2.85 -> 3.5s): Magnetic ease-in-out reassembly back to live skeleton spot
          const destX = target.x + spec.offsetX;
          const destY = target.y + spec.offsetY;
          rx = b.restX + (destX - b.restX) * ease;
          ry = b.restY + (destY - b.restY) * ease;
          rRot = b.restRot * (1 - ease);
        }

        if (el) {
          el.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(
            1
          )}px, 0) translate(-50%, -50%) rotate(${rRot.toFixed(1)}deg)`;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [originX, originY]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden no-print"
      aria-hidden="true"
    >
      {/* Crisp hand-drawn comic ink starburst rays at pop origin */}
      <div
        className="absolute left-0 top-0 animate-comic-ink-burst"
        style={{ left: `${originX}px`, top: `${originY}px` }}
      >
        <svg width="92" height="92" viewBox="0 0 92 92" fill="none" className="overflow-visible">
          {INK_RAYS.map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 46 + Math.cos(rad) * 16;
            const y1 = 46 + Math.sin(rad) * 16;
            const x2 = 46 + Math.cos(rad) * (idx % 2 === 0 ? 40 : 30);
            const y2 = 46 + Math.sin(rad) * (idx % 2 === 0 ? 40 : 30);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={idx % 2 === 0 ? '#18181b' : accent}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* Crisp sketchy "POP!" label */}
      <div
        className="absolute animate-bone-pop-label whitespace-nowrap"
        style={{ left: `${originX}px`, top: `${originY - 10}px` }}
      >
        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-yellow-300 text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] font-pixel-display text-sm font-black">
          POP!
        </span>
      </div>

      {/* 12 scattered hand-drawn bone pieces flying across the entire website */}
      {BONE_SPECS.map((spec, idx) => (
        <div
          key={spec.id}
          ref={(el) => {
            boneRefs.current[idx] = el;
          }}
          className="absolute left-0 top-0 die-cut-skeleton"
          style={{
            transform: `translate3d(${originX + spec.offsetX}px, ${
              originY + spec.offsetY
            }px, 0) translate(-50%, -50%)`,
          }}
        >
          <BonePieceSVG piece={spec} accent={accent} />
        </div>
      ))}
    </div>,
    document.body
  );
}

function getInflatePhrase({ isInflating, pressure, justRespawned }) {
  if (justRespawned) return 'all bones back!! 🦴';
  if (isInflating && pressure > 0.72) return 'GONNA BURST!! 💀💥';
  if (isInflating && pressure > 0.38) return 'too much air!! 😰';
  if (isInflating && pressure > 0.06) return 'puffing up... 💨';
  if (!isInflating && pressure > 0.08) return 'phew~ deflating 💨';
  return null;
}

/**
 * Interactive Bone-Scatter Pop Wrapper for dancing skeletons.
 * Hovering swells the skeleton cleanly (with zero bubble overlays) until it hits the limit
 * and explodes into 12 hand-drawn bones that scatter across the website and magnetically reassemble.
 */
export default function BalloonPopWrapper({
  children,
  skeletonId = 'skeleton',
  accent = '#FACC15',
  disabled = false,
  inflateDurationMs = 1250,
  deflateDurationMs = 700,
  respawnDelayMs = 3500,
  onInflatingChange,
  onPoppedChange,
  className = '',
}) {
  const [pressure, setPressure] = useState(0);
  const [isInflating, setIsInflating] = useState(false);
  const [popped, setPopped] = useState(false);
  const [popOrigin, setPopOrigin] = useState(null);
  const [popCount, setPopCount] = useState(0);
  const [justRespawned, setJustRespawned] = useState(false);

  const hitboxRef = useRef(null);
  const pressureRef = useRef(0);
  const hoveredRef = useRef(false);
  const poppedRef = useRef(false);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const prevInflatingRef = useRef(false);
  const lastFrameRef = useRef(null);
  const inflateDurationRef = useRef(inflateDurationMs);
  inflateDurationRef.current = inflateDurationMs;
  const deflateDurationRef = useRef(deflateDurationMs);
  deflateDurationRef.current = deflateDurationMs;
  const respawnDelayRef = useRef(respawnDelayMs);
  respawnDelayRef.current = respawnDelayMs;

  const onInflatingChangeRef = useRef(onInflatingChange);
  onInflatingChangeRef.current = onInflatingChange;
  const onPoppedChangeRef = useRef(onPoppedChange);
  onPoppedChangeRef.current = onPoppedChange;

  const fallbackTimerRef = useRef(null);
  const respawnBadgeTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearTimeout(fallbackTimerRef.current);
    clearTimeout(respawnBadgeTimerRef.current);
  }, []);

  const getLiveOrigin = useCallback(() => {
    const rect = hitboxRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  const completeReassembly = useCallback(() => {
    clearTimeout(fallbackTimerRef.current);
    if (!poppedRef.current) return;

    poppedRef.current = false;
    setPopped(false);
    setPopOrigin(null);
    setJustRespawned(true);
    onPoppedChangeRef.current?.(false);

    clearTimeout(respawnBadgeTimerRef.current);
    respawnBadgeTimerRef.current = setTimeout(() => {
      setJustRespawned(false);
    }, 1800);
  }, []);

  const triggerPop = useCallback(() => {
    if (poppedRef.current) return;

    const liveOrigin = getLiveOrigin() || {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    };

    poppedRef.current = true;
    hoveredRef.current = false;
    pressureRef.current = 0;

    if (prevInflatingRef.current) {
      prevInflatingRef.current = false;
      setIsInflating(false);
      onInflatingChangeRef.current?.(false);
    }

    setPopOrigin(liveOrigin);
    setPopped(true);
    setPressure(0);
    setPopCount((c) => c + 1);
    onPoppedChangeRef.current?.(true);
    playBoneScatterSound();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('skeleton-popped', {
          detail: { id: skeletonId, x: liveOrigin.x, y: liveOrigin.y },
        })
      );
    }

    // Safety fallback if tab was backgrounded and rAF paused during reassembly
    clearTimers();
    fallbackTimerRef.current = setTimeout(() => {
      completeReassembly();
    }, respawnDelayRef.current + 400);
  }, [clearTimers, completeReassembly, getLiveOrigin, skeletonId]);

  // Clear hover immediately if disabled dynamically (e.g. skeleton hiding behind card)
  useEffect(() => {
    if (disabled) {
      hoveredRef.current = false;
    }
  }, [disabled]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Hit-detection & tap-boost via window pointer events with hysteresis & opaque-card check
  useEffect(() => {
    const isHitAt = (e) => {
      const el = hitboxRef.current;
      if (!el || poppedRef.current || disabledRef.current) return false;
      const rect = el.getBoundingClientRect();
      const pad = hoveredRef.current ? 24 : 8;
      const inBox =
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad;
      return inBox && !isCoveredByOpaqueCard(e.target, el);
    };

    const handlePointerMove = (e) => {
      hoveredRef.current = isHitAt(e);
    };

    const handlePointerDown = (e) => {
      if (!isHitAt(e)) return;
      hoveredRef.current = true;
      const boosted = Math.min(1, pressureRef.current + 0.35);
      pressureRef.current = boosted;
      if (boosted >= 1) {
        triggerPop();
      } else {
        setPressure(boosted);
      }
    };

    const handleMouseLeaveWindow = () => {
      hoveredRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.documentElement.addEventListener(
      'mouseleave',
      handleMouseLeaveWindow
    );

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeaveWindow
      );
    };
  }, [triggerPop]);

  // Smooth 60fps air inflation / deflation loop
  useEffect(() => {
    let rafId = null;
    lastFrameRef.current = null;

    const tick = (now) => {
      const dt =
        lastFrameRef.current !== null
          ? Math.min(64, now - lastFrameRef.current)
          : 16;
      lastFrameRef.current = now;

      const inflatingNow =
        hoveredRef.current && !poppedRef.current && !disabledRef.current;

      if (inflatingNow !== prevInflatingRef.current) {
        prevInflatingRef.current = inflatingNow;
        setIsInflating(inflatingNow);
        onInflatingChangeRef.current?.(inflatingNow);
      }

      if (inflatingNow) {
        const next = Math.min(
          1,
          pressureRef.current + dt / inflateDurationRef.current
        );
        pressureRef.current = next;
        if (next >= 1) {
          triggerPop();
        } else {
          setPressure(next);
        }
      } else if (!poppedRef.current && pressureRef.current > 0) {
        const next = Math.max(
          0,
          pressureRef.current - dt / deflateDurationRef.current
        );
        pressureRef.current = next;
        setPressure(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      lastFrameRef.current = null;
    };
  }, [triggerPop]);

  // Clean skeleton-only inflation swell + near-burst tension tremble
  let inflationTransform = undefined;
  if (pressure > 0.001 && !popped) {
    const t = typeof performance !== 'undefined' ? performance.now() : 0;
    const pump = isInflating ? Math.sin(t * 0.018) * 0.045 * pressure : 0;
    const scaleX = 1 + pressure * 0.92 + pump;
    const scaleY = 1 + pressure * 0.8 - pump * 0.35;

    let jx = 0;
    let jy = 0;
    let rot = 0;
    if (pressure > 0.55) {
      const panic = (pressure - 0.55) / 0.45;
      jx = Math.sin(t * 0.09) * 7 * panic;
      jy = Math.cos(t * 0.11) * 7 * panic;
      rot = Math.sin(t * 0.07) * 5 * panic;
    }

    inflationTransform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(
      1
    )}px) rotate(${rot.toFixed(1)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(
      3
    )})`;
  }

  const inflatePhrase = getInflatePhrase({
    isInflating,
    pressure,
    justRespawned,
  });

  const renderedChildren =
    typeof children === 'function'
      ? children({
          pressure,
          isInflating,
          popped,
          justRespawned,
          inflatePhrase,
        })
      : children;

  return (
    <div
      ref={hitboxRef}
      className={`relative inline-flex items-center justify-center ${
        popped || disabled ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
      } ${className}`}
    >
      {popped && popOrigin && (
        <ScatteredBonesPortal
          key={popCount}
          originX={popOrigin.x}
          originY={popOrigin.y}
          accent={accent}
          getTargetOrigin={getLiveOrigin}
          onReassembled={completeReassembly}
        />
      )}

      <div
        className={justRespawned && !popped ? 'animate-skel-respawn' : ''}
        style={{
          visibility: popped ? 'hidden' : 'visible',
          opacity: popped ? 0 : 1,
          position: 'relative',
        }}
      >
        <div
          style={{
            transform: inflationTransform,
            transformOrigin: 'center center',
            position: 'relative',
          }}
        >
          {pressure > 0.55 && <StrainTicks pressure={pressure} accent={accent} />}
          <div className="relative z-10">{renderedChildren}</div>
        </div>
      </div>
    </div>
  );
}
