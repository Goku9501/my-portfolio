import React, { useState, useEffect } from 'react';

/**
 * Transparent Die-Cut Dancing Skeleton SVG
 * 100% transparent background — no card, no box, no sticky note.
 * Matches the website's #FAF8F4 cream bone fill, #18181b ink lines, and theme accent colors.
 */
export function DancingSkeletonSVG({
  accent = '#FACC15',
  variant = 'headphones',
  size = 82,
  altGroove = false,
  spinning = false,
}) {
  const animClass = spinning
    ? 'animate-skel-spin'
    : altGroove
    ? 'animate-skel-groove-alt'
    : 'animate-skel-groove';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${animClass}`}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* Floating Musical Notes */}
      <g className="animate-skel-note" style={{ animationDelay: '0.1s' }}>
        <text
          x="8"
          y="20"
          fill="#18181b"
          fontSize="13"
          fontWeight="bold"
          fontFamily="JetBrains Mono, monospace"
        >
          ♪
        </text>
      </g>
      <g className="animate-skel-note" style={{ animationDelay: '0.55s' }}>
        <text
          x="82"
          y="16"
          fill={accent}
          stroke="#18181b"
          strokeWidth="0.9"
          fontSize="14"
          fontWeight="bold"
          fontFamily="JetBrains Mono, monospace"
        >
          ♫
        </text>
      </g>

      {/* Subtle Ground Shadow directly under feet */}
      <ellipse cx="50" cy="98" rx="18" ry="3.2" fill="rgba(24, 24, 27, 0.14)" />

      {/* ================= LEFT ARM (WAVING) ================= */}
      <g className="animate-skel-arm-l">
        <path
          d="M39 43 L22 33 L15 20"
          stroke="#18181b"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39 43 L22 33 L15 20"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="33" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="2" />
        <circle cx="14" cy="19" r="4" fill={accent} stroke="#18181b" strokeWidth="2" />
      </g>

      {/* ================= RIGHT ARM (WAVING) ================= */}
      <g className="animate-skel-arm-r">
        <path
          d="M61 43 L78 33 L85 20"
          stroke="#18181b"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M61 43 L78 33 L85 20"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="78" cy="33" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="2" />
        <circle cx="86" cy="19" r="4" fill={accent} stroke="#18181b" strokeWidth="2" />
      </g>

      {/* ================= RIBCAGE & SPINE (SHIMMYING) ================= */}
      <g className="animate-skel-ribs">
        <line
          x1="50"
          y1="35"
          x2="50"
          y2="67"
          stroke="#18181b"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="35"
          x2="50"
          y2="67"
          stroke="#FAF8F4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        <path
          d="M37 42 Q50 45 63 42"
          stroke="#18181b"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M37 42 Q50 45 63 42"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rib 1 */}
        <rect
          x="38"
          y="46"
          width="24"
          height="5"
          rx="2.5"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2"
        />
        {/* Rib 2 */}
        <rect
          x="40"
          y="53"
          width="20"
          height="4.8"
          rx="2.4"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2"
        />
        {/* Pelvis Bone */}
        <path
          d="M39 64 C39 61, 61 61, 61 64 C63 68, 56 71, 50 68 C44 71, 37 68, 39 64 Z"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2.2"
        />
      </g>

      {/* ================= LEFT LEG (STEPPING) ================= */}
      <g className="animate-skel-leg-l">
        <path
          d="M44 68 L38 81 L42 93"
          stroke="#18181b"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 68 L38 81 L42 93"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="81" r="2.6" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.8" />
        <rect
          x="33"
          y="91"
          width="12"
          height="5.5"
          rx="2.5"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2"
        />
      </g>

      {/* ================= RIGHT LEG (STEPPING) ================= */}
      <g className="animate-skel-leg-r">
        <path
          d="M56 68 L62 81 L58 93"
          stroke="#18181b"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56 68 L62 81 L58 93"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="62" cy="81" r="2.6" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.8" />
        <rect
          x="55"
          y="91"
          width="12"
          height="5.5"
          rx="2.5"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2"
        />
      </g>

      {/* ================= SKULL HEAD (BOPPING) ================= */}
      <g className="animate-skel-head">
        <rect
          x="33"
          y="8"
          width="34"
          height="24"
          rx="12"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2.4"
        />
        <rect
          x="40"
          y="27"
          width="20"
          height="9"
          rx="3.5"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2.2"
        />

        {variant === 'headphones' && (
          <>
            <path
              d="M31 20 C31 5, 69 5, 69 20"
              stroke={accent}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <rect
              x="28"
              y="15"
              width="6"
              height="10"
              rx="3"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
            />
            <rect
              x="66"
              y="15"
              width="6"
              height="10"
              rx="3"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
            />
          </>
        )}

        {variant === 'cap' && (
          <>
            <path
              d="M34 14 C34 6, 66 6, 66 14 Z"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
            />
            <path
              d="M32 14 L73 14"
              stroke="#18181b"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}

        {variant === 'crown' && (
          <path
            d="M37 10 L40 3 L50 8 L60 3 L63 10 Z"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {variant === 'shades' ? (
          <>
            <rect
              x="36"
              y="16"
              width="12"
              height="7"
              rx="1.5"
              fill="#18181b"
              stroke={accent}
              strokeWidth="1.5"
            />
            <rect
              x="52"
              y="16"
              width="12"
              height="7"
              rx="1.5"
              fill="#18181b"
              stroke={accent}
              strokeWidth="1.5"
            />
            <line x1="48" y1="19" x2="52" y2="19" stroke="#18181b" strokeWidth="2.2" />
          </>
        ) : (
          <>
            <circle cx="43" cy="20" r="4.2" fill="#18181b" />
            <circle cx="57" cy="20" r="4.2" fill="#18181b" />
            <circle cx="44.2" cy="18.8" r="1.2" fill={accent} />
            <circle cx="58.2" cy="18.8" r="1.2" fill={accent} />
          </>
        )}

        <path d="M50 23 L48.2 26.5 L51.8 26.5 Z" fill="#18181b" />

        <line x1="43" y1="31.5" x2="57" y2="31.5" stroke="#18181b" strokeWidth="2" />
        <line x1="46" y1="29.5" x2="46" y2="33.5" stroke="#18181b" strokeWidth="1.6" />
        <line x1="50" y1="29.5" x2="50" y2="33.5" stroke="#18181b" strokeWidth="1.6" />
        <line x1="54" y1="29.5" x2="54" y2="33.5" stroke="#18181b" strokeWidth="1.6" />
      </g>
    </svg>
  );
}

const SKELETON_ARCHETYPES = [
  { id: 'skel-1', accent: '#FACC15', variant: 'headphones', size: 80, label: '60fps groove ♪', alt: false },
  { id: 'skel-2', accent: '#10B981', variant: 'shades', size: 74, label: 'no bugs! 🦴', alt: true },
  { id: 'skel-3', accent: '#EC4899', variant: 'crown', size: 78, label: 'hot reload ⚡', alt: false },
  { id: 'skel-4', accent: '#3B82F6', variant: 'cap', size: 72, label: 'clean arch ♫', alt: true },
  { id: 'skel-5', accent: '#F59E0B', variant: 'shades', size: 76, label: 'vpower 🚛', alt: false },
  { id: 'skel-6', accent: '#A855F7', variant: 'headphones', size: 70, label: 'dart vibes ✨', alt: true },
];

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Picks a random screen coordinate (in viewport % units), slightly favoring
 * the left/right edges & open areas while still roaming across the whole screen.
 */
function pickRandomPosition() {
  const roamAcrossAll = Math.random() < 0.45;
  if (roamAcrossAll) {
    return {
      x: randomInRange(6, 90),
      y: randomInRange(10, 86),
    };
  }
  const leftSide = Math.random() < 0.5;
  return {
    x: leftSide ? randomInRange(3, 24) : randomInRange(74, 93),
    y: randomInRange(10, 88),
  };
}

/**
 * Alive, Randomly Appearing & Roaming Transparent Skeletons
 * They spawn at random locations, walk/dance across the screen to new targets,
 * flip direction depending on where they walk, do occasional spin jumps, and
 * randomly vanish & respawn elsewhere on the page like living characters.
 */
export function BackgroundSkeletonStickers() {
  const [dancers, setDancers] = useState(() =>
    SKELETON_ARCHETYPES.map((arch, idx) => {
      const start = pickRandomPosition();
      return {
        ...arch,
        x: start.x,
        y: start.y,
        facing: idx % 2 === 0 ? 1 : -1,
        visible: true,
        spinning: false,
        showCallout: idx % 2 === 0,
        moveDuration: randomInRange(4.5, 7.5),
      };
    })
  );

  useEffect(() => {
    // Each skeleton updates its behavior independently every few seconds
    const timers = SKELETON_ARCHETYPES.map((arch, idx) => {
      const tick = () => {
        setDancers((prev) =>
          prev.map((d, i) => {
            if (i !== idx) return d;

            const roll = Math.random();

            // 20% chance: vanish briefly and respawn at a totally new random spot!
            if (roll < 0.2 && d.visible) {
              return {
                ...d,
                visible: false,
                spinning: false,
                showCallout: false,
              };
            }

            // If currently invisible, pop back into existence at a new random position and start roaming!
            if (!d.visible) {
              const spawnPos = pickRandomPosition();
              const nextTarget = pickRandomPosition();
              return {
                ...d,
                x: spawnPos.x,
                y: spawnPos.y,
                facing: nextTarget.x >= spawnPos.x ? 1 : -1,
                visible: true,
                spinning: true,
                showCallout: Math.random() < 0.65,
                moveDuration: 0.4,
              };
            }

            // Otherwise, pick a new destination on the website and walk/dance there!
            const nextPos = pickRandomPosition();
            const dx = nextPos.x - d.x;
            const facing = Math.abs(dx) > 1 ? (dx > 0 ? 1 : -1) : d.facing;
            const moveDuration = randomInRange(4.2, 8.0);
            const doSpin = Math.random() < 0.28;

            return {
              ...d,
              x: nextPos.x,
              y: nextPos.y,
              facing,
              visible: true,
              spinning: doSpin,
              showCallout: Math.random() < 0.55,
              moveDuration,
            };
          })
        );
      };

      // Stagger initial intervals so they don't all move in lockstep
      const intervalMs = 3400 + idx * 750;
      const timerId = setInterval(tick, intervalMs);
      // Trigger first movement shortly after mount
      const initialTimeout = setTimeout(tick, 400 + idx * 350);

      return () => {
        clearInterval(timerId);
        clearTimeout(initialTimeout);
      };
    });

    return () => {
      timers.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden no-print"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {dancers.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}vw`,
            top: `${d.y}vh`,
            opacity: d.visible ? 0.92 : 0,
            transform: `translate(-50%, -50%) scale(${d.visible ? 1 : 0.3})`,
            transition: `left ${d.moveDuration}s cubic-bezier(0.42, 0, 0.58, 1), top ${d.moveDuration}s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.55s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            background: 'transparent',
          }}
          className="flex flex-col items-center"
        >
          {/* Optional tiny floating handwritten callout (transparent background, no box) */}
          <span
            style={{
              opacity: d.showCallout && d.visible ? 1 : 0,
              transition: 'opacity 0.35s ease',
              textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
            }}
            className="font-handwritten text-sm font-bold text-zinc-900 dark:text-yellow-300 dark:[text-shadow:1.5px_1.5px_0px_#111318] -mb-1 whitespace-nowrap select-none"
          >
            {d.label}
          </span>

          {/* Flip horizontally based on walking direction */}
          <div
            style={{
              transform: `scaleX(${d.facing})`,
              transition: 'transform 0.3s ease',
              background: 'transparent',
            }}
          >
            <DancingSkeletonSVG
              accent={d.accent}
              variant={d.variant}
              size={d.size}
              altGroove={d.alt}
              spinning={d.spinning}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
