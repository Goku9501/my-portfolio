import React, { useMemo } from 'react';

/**
 * Song-reactive multi-color mixtures & doodle symbol sets for BOTH Dark Mode and Light Mode!
 * - In Dark Mode: Soft glowing neon/pastel light streams over the dark grid (#111318).
 * - In Light Mode: Minimalist, subtle sketchbook highlighter & ink doodle streams over warm paper (#FAF8F4).
 */
const SONG_THEMES = {
  // Track 1: Brabus ('hyper')
  hyper: {
    dark: {
      colors: ['#FACC15', '#38BDF8', '#FB923C', '#34D399'],
      glowColors: [
        'rgba(250, 204, 21, 0.55)',
        'rgba(56, 189, 248, 0.55)',
        'rgba(251, 146, 60, 0.55)',
        'rgba(52, 211, 153, 0.55)',
      ],
      ambientOrbs: [
        'rgba(250, 204, 21, 0.07)',
        'rgba(56, 189, 248, 0.07)',
        'rgba(251, 146, 60, 0.06)',
      ],
    },
    light: {
      // Rich sketchbook ink & marker tones that show cleanly on #FAF8F4 cream paper
      colors: ['#D97706', '#2563EB', '#EA580C', '#059669'],
      glowColors: [
        'rgba(245, 158, 11, 0.25)',
        'rgba(37, 99, 235, 0.22)',
        'rgba(234, 88, 12, 0.22)',
        'rgba(16, 185, 129, 0.22)',
      ],
      ambientOrbs: [
        'rgba(250, 204, 21, 0.10)',
        'rgba(59, 130, 246, 0.07)',
        'rgba(249, 115, 22, 0.07)',
      ],
    },
    glyphs: ['✦', '⚡', '◈', '♪', '✧', '+', '☆', '♫'],
    doodleShapes: ['star', 'bolt', 'diamond', 'sparkle'],
    speedMultiplier: 0.72,
  },

  // Track 2: Thinking of You - AP Dhillon ('lofi')
  lofi: {
    dark: {
      colors: ['#F472B6', '#A78BFA', '#60A5FA', '#FBBF24'],
      glowColors: [
        'rgba(244, 114, 182, 0.55)',
        'rgba(167, 139, 250, 0.55)',
        'rgba(96, 165, 250, 0.55)',
        'rgba(251, 191, 36, 0.5)',
      ],
      ambientOrbs: [
        'rgba(244, 114, 182, 0.08)',
        'rgba(167, 139, 250, 0.07)',
        'rgba(96, 165, 250, 0.06)',
      ],
    },
    light: {
      colors: ['#DB2777', '#7C3AED', '#2563EB', '#D97706'],
      glowColors: [
        'rgba(236, 72, 153, 0.24)',
        'rgba(124, 58, 237, 0.20)',
        'rgba(37, 99, 235, 0.20)',
        'rgba(217, 119, 6, 0.20)',
      ],
      ambientOrbs: [
        'rgba(244, 114, 182, 0.10)',
        'rgba(167, 139, 250, 0.08)',
        'rgba(96, 165, 250, 0.07)',
      ],
    },
    glyphs: ['♡', '✧', '♪', '☾', '✦', '♫', '○', '☆'],
    doodleShapes: ['heart', 'sparkle', 'moon', 'star'],
    speedMultiplier: 1.35,
  },

  // Track 3: Disco ('disco')
  disco: {
    dark: {
      colors: ['#34D399', '#EC4899', '#38BDF8', '#FACC15'],
      glowColors: [
        'rgba(52, 211, 153, 0.55)',
        'rgba(236, 72, 153, 0.55)',
        'rgba(56, 189, 248, 0.55)',
        'rgba(250, 204, 21, 0.55)',
      ],
      ambientOrbs: [
        'rgba(52, 211, 153, 0.07)',
        'rgba(236, 72, 153, 0.07)',
        'rgba(56, 189, 248, 0.07)',
      ],
    },
    light: {
      colors: ['#059669', '#DB2777', '#2563EB', '#D97706'],
      glowColors: [
        'rgba(16, 185, 129, 0.22)',
        'rgba(236, 72, 153, 0.22)',
        'rgba(37, 99, 235, 0.22)',
        'rgba(245, 158, 11, 0.22)',
      ],
      ambientOrbs: [
        'rgba(16, 185, 129, 0.09)',
        'rgba(236, 72, 153, 0.08)',
        'rgba(59, 130, 246, 0.08)',
      ],
    },
    glyphs: ['✦', '◈', '♫', '✧', '☆', '♪', '◇', '•'],
    doodleShapes: ['diamond', 'star', 'sparkle', 'ring'],
    speedMultiplier: 0.9,
  },

  // Track 4: Party ('party')
  party: {
    dark: {
      colors: ['#EC4899', '#FACC15', '#06B6D4', '#A855F7'],
      glowColors: [
        'rgba(236, 72, 153, 0.55)',
        'rgba(250, 204, 21, 0.55)',
        'rgba(6, 182, 212, 0.55)',
        'rgba(168, 85, 247, 0.55)',
      ],
      ambientOrbs: [
        'rgba(236, 72, 153, 0.08)',
        'rgba(250, 204, 21, 0.07)',
        'rgba(168, 85, 247, 0.07)',
      ],
    },
    light: {
      colors: ['#DB2777', '#D97706', '#0891B2', '#7C3AED'],
      glowColors: [
        'rgba(236, 72, 153, 0.24)',
        'rgba(245, 158, 11, 0.24)',
        'rgba(8, 145, 178, 0.22)',
        'rgba(124, 58, 237, 0.22)',
      ],
      ambientOrbs: [
        'rgba(236, 72, 153, 0.09)',
        'rgba(250, 204, 21, 0.09)',
        'rgba(168, 85, 247, 0.08)',
      ],
    },
    glyphs: ['✦', '♪', '☆', '⚡', '♫', '✧', '♡', '◈'],
    doodleShapes: ['star', 'bolt', 'heart', 'sparkle'],
    speedMultiplier: 0.78,
  },
};

/**
 * Tiny hand-drawn SVG doodle icon at the leading head of each matrix stream
 */
function DoodleLightHead({ shape, color, glow, isDark }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        filter: isDark
          ? `drop-shadow(0 0 5px ${glow})`
          : `drop-shadow(1px 1px 0px rgba(24,24,27,0.18))`,
      }}
    >
      {shape === 'heart' && (
        <path
          d="M10 16.5 C10 16.5 3.5 12 3.5 7.2 C3.5 4.8 5.4 3.2 7.5 3.2 C8.8 3.2 9.6 3.9 10 4.8 C10.4 3.9 11.2 3.2 12.5 3.2 C14.6 3.2 16.5 4.8 16.5 7.2 C16.5 12 10 16.5 10 16.5 Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {shape === 'bolt' && (
        <path
          d="M11.5 2.5 L5.5 10.5 H10.5 L8.5 17.5 L14.5 9.5 H9.5 L11.5 2.5 Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {shape === 'diamond' && (
        <path
          d="M10 2.5 L16.5 10 L10 17.5 L3.5 10 Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      )}
      {shape === 'moon' && (
        <path
          d="M13.5 4.2 A5.8 5.8 0 1 0 15.8 13.5 A4.6 4.6 0 1 1 13.5 4.2 Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {(shape === 'star' || shape === 'sparkle' || shape === 'ring') && (
        <path
          d="M10 2 L11.8 8.2 L18 10 L11.8 11.8 L10 18 L8.2 11.8 L2 10 L8.2 8.2 Z"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/**
 * THEME-ADAPTIVE DOODLE MATRIX (z-0, behind all content cards)
 * - Dark Mode: 15 glowing neon/pastel doodle light streams.
 * - Light Mode: 12 ultra-clean, subtle sketchbook marker/ink doodle streams that complement
 *   the warm #FAF8F4 notebook paper without adding visual clutter.
 * Both modes change their multi-color mixture, doodle symbols, and speed with each song!
 */
export default function DarkModeDoodleMatrix({
  isDark = false,
  danceStyle = 'hyper',
  isPlaying = true,
}) {
  const columns = useMemo(() => {
    return Array.from({ length: 15 }, (_, idx) => {
      const leftPct = 4 + idx * 6.4 + ((idx % 3) * 0.7 - 0.7);
      const baseDuration = 9.0 + (idx % 5) * 2.0;
      const delay = -((idx * 2.5) % 12);
      const colorOffset = idx % 4;
      const trailLength = 4 + (idx % 2);
      return {
        id: `doodle-col-${idx}`,
        leftPct,
        baseDuration,
        delay,
        colorOffset,
        trailLength,
      };
    });
  }, []);

  const songConfig = SONG_THEMES[danceStyle] || SONG_THEMES.hyper;
  const palette = isDark ? songConfig.dark : songConfig.light;
  const playSpeedFactor = isPlaying ? songConfig.speedMultiplier : 2.4;

  // In Light Mode, keep it even more minimal by showing fewer columns (11 instead of 15)
  const visibleColumns = isDark
    ? columns
    : columns.filter((_, idx) => idx % 4 !== 2);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle Multi-Color Ambient Wash behind the notebook grid */}
      <div
        className="absolute -top-24 left-[12%] w-96 h-96 rounded-full blur-3xl transition-colors duration-1000"
        style={{ background: palette.ambientOrbs[0] }}
      />
      <div
        className="absolute top-[38%] right-[10%] w-[26rem] h-[26rem] rounded-full blur-3xl transition-colors duration-1000"
        style={{ background: palette.ambientOrbs[1] }}
      />
      <div
        className="absolute -bottom-24 left-[35%] w-96 h-96 rounded-full blur-3xl transition-colors duration-1000"
        style={{ background: palette.ambientOrbs[2] }}
      />

      {/* 2. Doodle Matrix Streams (Glowing Neon in Dark Mode / Sketchbook Marker Ink in Light Mode) */}
      {visibleColumns.map((col, colIdx) => {
        const primaryColor = palette.colors[col.colorOffset % palette.colors.length];
        const secondaryColor =
          palette.colors[(col.colorOffset + 1) % palette.colors.length];
        const glowColor =
          palette.glowColors[col.colorOffset % palette.glowColors.length];
        const headShape =
          songConfig.doodleShapes[col.colorOffset % songConfig.doodleShapes.length];
        const durationSec = (col.baseDuration * playSpeedFactor).toFixed(2);

        return (
          <div
            key={col.id}
            className="absolute top-0 flex flex-col items-center gap-2.5 animate-doodle-matrix-fall"
            style={{
              left: `${col.leftPct}%`,
              animationDuration: `${durationSec}s`,
              animationDelay: `${col.delay}s`,
            }}
          >
            {/* Slender gradient tail (Neon beam in Dark Mode / Highlighter stroke in Light Mode) */}
            <div
              className="w-[1.5px] h-12 rounded-full transition-colors duration-700"
              style={{
                background: `linear-gradient(to bottom, transparent, ${secondaryColor}40, ${primaryColor}${
                  isDark ? 'CC' : '88'
                })`,
                boxShadow: isDark ? `0 0 8px ${glowColor}` : 'none',
              }}
            />

            {/* Trailing Doodle Glyphs */}
            {Array.from({ length: col.trailLength }, (_, nodeIdx) => {
              const glyph =
                songConfig.glyphs[(colIdx + nodeIdx) % songConfig.glyphs.length];
              const nodeColor = nodeIdx % 2 === 0 ? primaryColor : secondaryColor;
              const maxAlpha = isDark ? 0.58 : 0.42;
              const nodeOpacity = (
                0.14 +
                ((nodeIdx + 1) / col.trailLength) * maxAlpha
              ).toFixed(2);

              return (
                <span
                  key={nodeIdx}
                  className="font-mono text-[11px] font-bold leading-none transition-colors duration-700"
                  style={{
                    color: nodeColor,
                    opacity: nodeOpacity,
                    textShadow: isDark ? `0 0 6px ${glowColor}` : 'none',
                  }}
                >
                  {glyph}
                </span>
              );
            })}

            {/* Leading Hand-Drawn Doodle Head */}
            <div className="mt-0.5" style={{ opacity: isDark ? 0.9 : 0.65 }}>
              <DoodleLightHead
                shape={headShape}
                color={primaryColor}
                glow={glowColor}
                isDark={isDark}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
