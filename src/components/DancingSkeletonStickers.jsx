import React, { useState, useEffect, useRef } from 'react';

/**
 * 1. PEEK-A-BOO SKELETON KID (Hides behind a card & peeks out from top/left/right)
 * Upgraded with intelligent curiosity states, mouse-proximity shyness, and cute props
 * (sprout leaf, detective magnifying glass, or love-letter envelope).
 */
export function PeekabooSkeletonKid({
  direction = 'top', // 'top' | 'left' | 'right' | 'upside-down'
  accent = '#FACC15',
  hat = 'sprout', // 'sprout' | 'bow' | 'cap' | 'crown'
  label = 'peekaboo! 🫣',
  delay = '0s',
}) {
  const containerRef = useRef(null);
  const [mood, setMood] = useState('curious'); // 'curious' | 'prop' | 'shy'
  const [spookedByMouse, setSpookedByMouse] = useState(false);

  const moodPhrases = {
    sprout: {
      curious: label || 'peekaboo! 🫣',
      prop: 'growing clean code 🌱',
      shy: 'ep! u saw me! 🙈',
    },
    cap: {
      curious: label || 'psst! nice app 👀',
      prop: '60fps flutter UI! 🔍',
      shy: 'hiding behind phone! 🫣',
    },
    bow: {
      curious: label || 'send a msg! 💌',
      prop: 'special delivery! ✉️',
      shy: 'shhh im hiding.. 🤭',
    },
    crown: {
      curious: label || 'peekaboo! 👑',
      prop: 'royal inspection ✨',
      shy: 'ducking down! 🫣',
    },
  };

  useEffect(() => {
    const cycle = ['curious', 'prop', 'curious', 'shy'];
    let step = 0;
    const id = setInterval(() => {
      step = (step + 1) % cycle.length;
      setMood(cycle[step]);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      setSpookedByMouse(dist < 115);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const animClass =
    direction === 'left'
      ? 'animate-skel-peek-left'
      : direction === 'right'
      ? 'animate-skel-peek-right'
      : direction === 'upside-down'
      ? 'animate-skel-upside-down'
      : 'animate-skel-peek-up';

  const activePhrases = moodPhrases[hat] || moodPhrases.sprout;
  const displayLabel = spookedByMouse ? activePhrases.shy : activePhrases[mood];

  // If the user's cursor gets right near the peeker, it ducks behind the card immediately!
  const spookTransform = spookedByMouse
    ? direction === 'left'
      ? 'translateX(44px) scale(0.9)'
      : direction === 'right'
      ? 'translateX(-44px) scale(0.9)'
      : 'translateY(38px) scale(0.9)'
    : 'translate(0px, 0px) scale(1)';

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none flex flex-col items-center ${animClass}`}
      style={{ animationDelay: delay, background: 'transparent' }}
      aria-hidden="true"
    >
      <div
        className="flex flex-col items-center transition-transform duration-300"
        style={{ transform: spookTransform }}
      >
        {displayLabel && direction !== 'upside-down' && (
          <span
            className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-yellow-300 -mb-1 whitespace-nowrap"
            style={{ textShadow: '1px 1px 0 #FAF8F4, -1px -1px 0 #FAF8F4' }}
          >
            {displayLabel}
          </span>
        )}

        <svg
          width="74"
          height="62"
          viewBox="0 0 86 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="die-cut-skeleton overflow-visible"
        >
          {/* Hat / Accessory */}
          {hat === 'sprout' && (
            <g>
              <path
                d="M40 12 Q40 2 48 3"
                stroke="#18181b"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <ellipse
                cx="49"
                cy="3"
                rx="5.5"
                ry="3.2"
                transform="rotate(-15 49 3)"
                fill="#10B981"
                stroke="#18181b"
                strokeWidth="1.8"
              />
              <ellipse
                cx="35"
                cy="5"
                rx="4.8"
                ry="2.8"
                transform="rotate(20 35 5)"
                fill="#10B981"
                stroke="#18181b"
                strokeWidth="1.8"
              />
            </g>
          )}

          {hat === 'bow' && (
            <g transform="translate(49, 8) rotate(12)">
              <path
                d="M0 4 L-8 -2 L-8 10 Z"
                fill={accent}
                stroke="#18181b"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M0 4 L8 -2 L8 10 Z"
                fill={accent}
                stroke="#18181b"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="0" cy="4" r="2.8" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.8" />
            </g>
          )}

          {hat === 'crown' && (
            <path
              d="M27 14 L30 5 L40 11 L50 5 L53 14 Z"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}

          {hat === 'cap' && (
            <g>
              <path
                d="M23 18 C23 8, 57 8, 57 18 Z"
                fill={accent}
                stroke="#18181b"
                strokeWidth="2"
              />
              <path d="M19 18 L63 18" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          )}

          {/* Big Childlike Round Skull Head */}
          <rect
            x="20"
            y="12"
            width="40"
            height="32"
            rx="16"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.4"
          />

          {/* Rosy Cartoon Cheeks */}
          <ellipse cx="26" cy="34" rx="3.4" ry="1.9" fill="#F472B6" opacity="0.7" />
          <ellipse cx="54" cy="34" rx="3.4" ry="1.9" fill="#F472B6" opacity="0.7" />

          {/* Big Curious Darting Eyes */}
          <g className="animate-skel-eyes">
            <circle cx="32" cy="27" r="5.3" fill="#18181b" />
            <circle cx="48" cy="27" r="5.3" fill="#18181b" />
            <circle cx="33.6" cy="25.2" r="1.9" fill="#FAF8F4" />
            <circle cx="49.6" cy="25.2" r="1.9" fill="#FAF8F4" />
          </g>

          {/* Cute Little Nose & Shy Smile */}
          <path d="M40 31 L38.5 34.5 L41.5 34.5 Z" fill="#18181b" />
          <path
            d="M36 38 Q40 40.5 44 38"
            stroke="#18181b"
            strokeWidth="1.9"
            strokeLinecap="round"
          />

          {/* Little Bony Fingers Gripping the Card Border */}
          <g>
            {/* Left gripping paw */}
            <rect
              x="12"
              y="41"
              width="11"
              height="8"
              rx="4"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
            />
            <line x1="15.5" y1="42" x2="15.5" y2="48" stroke="#18181b" strokeWidth="1.5" />
            <line x1="19" y1="42" x2="19" y2="48" stroke="#18181b" strokeWidth="1.5" />

            {/* Right gripping paw */}
            <rect
              x="57"
              y="41"
              width="11"
              height="8"
              rx="4"
              fill={accent}
              stroke="#18181b"
              strokeWidth="2"
            />
            <line x1="61" y1="42" x2="61" y2="48" stroke="#18181b" strokeWidth="1.5" />
            <line x1="64.5" y1="42" x2="64.5" y2="48" stroke="#18181b" strokeWidth="1.5" />
          </g>

          {/* Character-Specific Mini Prop when in 'prop' mood! */}
          {hat === 'cap' && (
            <g className="animate-skel-magnify">
              <circle
                cx="70"
                cy="24"
                r="7.5"
                fill="rgba(56, 189, 248, 0.28)"
                stroke="#18181b"
                strokeWidth="2.2"
              />
              <circle cx="68" cy="22" r="2" fill="#FAF8F4" opacity="0.8" />
              <line
                x1="65"
                y1="30"
                x2="60"
                y2="39"
                stroke="#18181b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}

          {hat === 'bow' && (
            <g transform="translate(64, 24) rotate(14)">
              <rect
                x="0"
                y="0"
                width="16"
                height="11"
                rx="2"
                fill="#FAF8F4"
                stroke="#18181b"
                strokeWidth="1.8"
              />
              <path d="M1 1 L8 6 L15 1" stroke="#18181b" strokeWidth="1.5" fill="none" />
              <circle cx="8" cy="5.5" r="2.2" fill="#EC4899" />
            </g>
          )}

          {hat === 'sprout' && (
            <g transform="translate(65, 22)">
              <path d="M4 16 L4 6" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="4" cy="5" r="4" fill="#FACC15" stroke="#18181b" strokeWidth="1.6" />
              <circle cx="4" cy="5" r="1.5" fill="#18181b" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

/**
 * 2. MONKEY-BAR HANGING SKELETON KID (Upgraded with 3-Move Gymnastic Routine!)
 * Switches intelligently between:
 *  - 'swing': Two-handed playground pendulum swing
 *  - 'one-hand': Hangs by ONE hand and waves at the user with the other hand!
 *  - 'chin-up': Pulls itself up to peek its chin over the bottom edge of the card!
 */
export function HangingSkeletonKid({
  accent = '#EC4899',
  label = 'wheee! 🤸',
}) {
  const [routine, setRoutine] = useState('swing'); // 'swing' | 'one-hand' | 'chin-up'

  useEffect(() => {
    const moves = ['swing', 'one-hand', 'swing', 'chin-up'];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % moves.length;
      setRoutine(moves[idx]);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const routineText =
    routine === 'one-hand'
      ? 'look ma, 1 hand!! 👋'
      : routine === 'chin-up'
      ? 'huff.. pull-up!! 💪'
      : label;

  return (
    <div
      className="pointer-events-none select-none flex flex-col items-center animate-skel-hang"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <svg
        width="82"
        height="94"
        viewBox="0 0 96 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="die-cut-skeleton overflow-visible"
      >
        {/* Left Hand always clamped onto the card bottom border */}
        <circle cx="35" cy="7" r="4.8" fill={accent} stroke="#18181b" strokeWidth="2.2" />

        {/* Right Hand: clamped on bar in 'swing'/'chin-up', or waving in 'one-hand'! */}
        {routine !== 'one-hand' && (
          <circle cx="59" cy="7" r="4.8" fill={accent} stroke="#18181b" strokeWidth="2.2" />
        )}

        {/* Body group that pulls up during 'chin-up' mode */}
        <g className={routine === 'chin-up' ? 'animate-skel-chinup' : ''}>
          {/* Left Arm holding bar */}
          <path
            d={routine === 'chin-up' ? 'M35 10 L26 24 L39 40' : 'M35 10 L40 42'}
            stroke="#18181b"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={routine === 'chin-up' ? 'M35 10 L26 24 L39 40' : 'M35 10 L40 42'}
            stroke="#FAF8F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Arm: either holding bar OR waving out to the side! */}
          {routine === 'one-hand' ? (
            <g className="animate-skel-arm-r">
              <path
                d="M55 42 L74 30 L82 18"
                stroke="#18181b"
                strokeWidth="4.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M55 42 L74 30 L82 18"
                stroke="#FAF8F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="83" cy="17" r="4.2" fill={accent} stroke="#18181b" strokeWidth="2" />
            </g>
          ) : (
            <>
              <path
                d={routine === 'chin-up' ? 'M59 10 L68 24 L55 40' : 'M59 10 L54 42'}
                stroke="#18181b"
                strokeWidth="4.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={routine === 'chin-up' ? 'M59 10 L68 24 L55 40' : 'M59 10 L54 42'}
                stroke="#FAF8F4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Cute Child Skull with Sporty Headband */}
          <g className="animate-skel-head">
            <rect
              x="31"
              y="16"
              width="32"
              height="25"
              rx="12"
              fill="#FAF8F4"
              stroke="#18181b"
              strokeWidth="2.3"
            />
            {/* Sporty sweatband */}
            <rect
              x="31"
              y="20"
              width="32"
              height="4.5"
              rx="2"
              fill={accent}
              stroke="#18181b"
              strokeWidth="1.6"
            />
            {/* Excited Laughing Eyes (^ ^) */}
            <path
              d="M37 29 Q40 24 43 29"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M51 29 Q54 24 57 29"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Big Happy Grin */}
            <path d="M40 34 Q47 40 54 34 Z" fill="#18181b" />
          </g>

          {/* Little Ribcage & Pelvis */}
          <line x1="47" y1="41" x2="47" y2="66" stroke="#18181b" strokeWidth="4.5" />
          <line x1="47" y1="41" x2="47" y2="66" stroke="#FAF8F4" strokeWidth="2" />
          <rect
            x="37"
            y="46"
            width="20"
            height="4.5"
            rx="2.2"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="1.9"
          />
          <rect
            x="39"
            y="53"
            width="16"
            height="4.2"
            rx="2"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="1.9"
          />
          <ellipse
            cx="47"
            cy="64"
            rx="9"
            ry="4"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
          />

          {/* Kicking Dangling Legs */}
          <g className="animate-skel-leg-l">
            <path
              d="M42 66 L36 80 L40 92"
              stroke="#18181b"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M42 66 L36 80 L40 92"
              stroke="#FAF8F4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="32"
              y="90"
              width="11"
              height="5"
              rx="2.5"
              fill={accent}
              stroke="#18181b"
              strokeWidth="1.9"
            />
          </g>
          <g className="animate-skel-leg-r">
            <path
              d="M52 66 L58 80 L54 92"
              stroke="#18181b"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M52 66 L58 80 L54 92"
              stroke="#FAF8F4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="51"
              y="90"
              width="11"
              height="5"
              rx="2.5"
              fill={accent}
              stroke="#18181b"
              strokeWidth="1.9"
            />
          </g>
        </g>
      </svg>

      {routineText && (
        <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-pink-300 -mt-2 whitespace-nowrap">
          {routineText}
        </span>
      )}
    </div>
  );
}

/**
 * 3. SITTING & LEG-SWINGING MUSIC LISTENER KID (Upgraded Lofi DJ!)
 * Sits on the card ledge with a pulsing mini boombox right next to it, 3 rising musical notes,
 * a warm drink cup in one hand, studio headphones, and live playlist cycling!
 */
export function SittingSkeletonKid({
  accent = '#3B82F6',
  label = '♪ chill vibes ♫',
}) {
  const playlist = [
    label || '♪ chill vibes ♫',
    '♫ lofi flutter beats ♪',
    '♬ 0 bugs in prod ♫',
    '♪ bass drop!! 🎧',
  ];
  const [trackIdx, setTrackIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTrackIdx((prev) => (prev + 1) % playlist.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none select-none flex flex-col items-center"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-sky-300 -mb-1 whitespace-nowrap">
        {playlist[trackIdx]}
      </span>

      <svg
        width="92"
        height="84"
        viewBox="0 0 112 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="die-cut-skeleton overflow-visible"
      >
        {/* Multi-note floating music stream rising from headphones & boombox */}
        <g className="animate-skel-note-1">
          <text
            x="66"
            y="24"
            fill={accent}
            stroke="#18181b"
            strokeWidth="0.7"
            fontSize="13"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            ♫
          </text>
        </g>
        <g className="animate-skel-note-2">
          <text
            x="84"
            y="34"
            fill="#EC4899"
            stroke="#18181b"
            strokeWidth="0.7"
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            ♪
          </text>
        </g>
        <g className="animate-skel-note-3">
          <text
            x="14"
            y="22"
            fill="#FACC15"
            stroke="#18181b"
            strokeWidth="0.7"
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            ♬
          </text>
        </g>

        {/* Mini Pulsing Retro Boombox sitting beside the skeleton on the card ledge! */}
        <g className="animate-skel-boombox">
          {/* Boombox handle */}
          <path
            d="M74 49 L74 45 L92 45 L92 49"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Boombox body */}
          <rect
            x="68"
            y="49"
            width="30"
            height="17"
            rx="3.5"
            fill="#FACC15"
            stroke="#18181b"
            strokeWidth="2.1"
          />
          {/* Left & Right pulsing speakers */}
          <circle cx="75.5" cy="58" r="4.5" fill="#18181b" />
          <circle cx="75.5" cy="58" r="1.8" fill={accent} />
          <circle cx="90.5" cy="58" r="4.5" fill="#18181b" />
          <circle cx="90.5" cy="58" r="1.8" fill={accent} />
          {/* Cassette deck middle */}
          <rect
            x="80.5"
            y="54"
            width="5"
            height="6"
            rx="1"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="1.4"
          />
        </g>

        {/* Bopping Head with Studio Headphones */}
        <g className="animate-skel-head">
          <rect
            x="24"
            y="10"
            width="34"
            height="26"
            rx="13"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.3"
          />
          {/* Headphone band */}
          <path
            d="M22 22 C22 5, 60 5, 60 22"
            stroke={accent}
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Ear cups */}
          <rect
            x="18.5"
            y="16.5"
            width="6.5"
            height="11"
            rx="3.2"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
          />
          <rect
            x="57"
            y="16.5"
            width="6.5"
            height="11"
            rx="3.2"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
          />
          {/* Rosy cheeks */}
          <ellipse cx="29" cy="28" rx="2.8" ry="1.5" fill="#F472B6" opacity="0.65" />
          <ellipse cx="53" cy="28" rx="2.8" ry="1.5" fill="#F472B6" opacity="0.65" />
          {/* Chill Closed Happy Eyes */}
          <path
            d="M31 24 Q34 27 37 24"
            stroke="#18181b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M45 24 Q48 27 51 24"
            stroke="#18181b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cute Whistle / Smile */}
          <path
            d="M36 31 Q41 34 46 31"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Torso sitting upright on the ledge (ledge is at y=66) */}
        <line x1="41" y1="36" x2="41" y2="64" stroke="#18181b" strokeWidth="4.5" />
        <line x1="41" y1="36" x2="41" y2="64" stroke="#FAF8F4" strokeWidth="2" />
        {/* Cozy Scarf / Collar */}
        <rect
          x="33"
          y="36"
          width="16"
          height="4.5"
          rx="2.2"
          fill="#EC4899"
          stroke="#18181b"
          strokeWidth="1.8"
        />
        <rect
          x="31"
          y="43"
          width="20"
          height="4.5"
          rx="2.2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="1.9"
        />
        <rect
          x="33"
          y="50"
          width="16"
          height="4.2"
          rx="2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="1.9"
        />

        {/* Left Arm holding a little coffee/boba cup while leaning on the ledge */}
        <path
          d="M32 42 L20 53 L23 63"
          stroke="#18181b"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 42 L20 53 L23 63"
          stroke="#FAF8F4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mini Coffee/Boba Cup on left side of ledge */}
        <rect
          x="13"
          y="56"
          width="8"
          height="10"
          rx="2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="1.8"
        />
        <rect x="14" y="59" width="6" height="4" fill="#F59E0B" />
        <line x1="17" y1="52" x2="19" y2="56" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />

        {/* Right Arm tapping near the boombox */}
        <path
          d="M50 42 L60 55 L58 65"
          stroke="#18181b"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 42 L60 55 L58 65"
          stroke="#FAF8F4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="58" cy="65" r="3.5" fill={accent} stroke="#18181b" strokeWidth="2" />

        {/* Pelvis sitting on ledge */}
        <ellipse
          cx="41"
          cy="64"
          rx="10"
          ry="4.2"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2"
        />

        {/* Dangling Legs swinging over the front of the card! */}
        <g className="animate-skel-sit-leg-l">
          <path d="M35 66 L32 86" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M35 66 L32 86" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" />
          <rect
            x="25"
            y="84"
            width="11"
            height="5.2"
            rx="2.5"
            fill={accent}
            stroke="#18181b"
            strokeWidth="1.9"
          />
        </g>
        <g className="animate-skel-sit-leg-r">
          <path d="M47 66 L50 86" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M47 66 L50 86" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" />
          <rect
            x="46"
            y="84"
            width="11"
            height="5.2"
            rx="2.5"
            fill={accent}
            stroke="#18181b"
            strokeWidth="1.9"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * 4. TRAMPOLINE BOUNCING SKELETON KID (With Spinning Propeller Beanie!)
 */
export function JumpingSkeletonKid({
  accent = '#10B981',
  label = 'boing! boing! 🚀',
}) {
  const phrases = [label, 'trampoline card!! 🤸', '60fps bounce! ⚡'];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % phrases.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="pointer-events-none select-none flex flex-col items-center animate-skel-trampoline"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-emerald-300 -mb-1 whitespace-nowrap">
        {phrases[idx]}
      </span>
      <svg
        width="72"
        height="78"
        viewBox="0 0 100 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="die-cut-skeleton overflow-visible"
      >
        <g className="animate-skel-arm-l">
          <path
            d="M39 43 L20 26 L14 14"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39 43 L20 26 L14 14"
            stroke="#FAF8F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="13" r="4" fill={accent} stroke="#18181b" strokeWidth="2" />
        </g>
        <g className="animate-skel-arm-r">
          <path
            d="M61 43 L80 26 L86 14"
            stroke="#18181b"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M61 43 L80 26 L86 14"
            stroke="#FAF8F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="87" cy="13" r="4" fill={accent} stroke="#18181b" strokeWidth="2" />
        </g>

        <line x1="50" y1="35" x2="50" y2="66" stroke="#18181b" strokeWidth="4.8" />
        <line x1="50" y1="35" x2="50" y2="66" stroke="#FAF8F4" strokeWidth="2.1" />
        <rect
          x="39"
          y="45"
          width="22"
          height="4.8"
          rx="2.4"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2"
        />
        <rect
          x="41"
          y="52"
          width="18"
          height="4.5"
          rx="2.2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2"
        />
        <ellipse cx="50" cy="64" rx="10" ry="4" fill={accent} stroke="#18181b" strokeWidth="2" />

        <path
          d="M43 66 L31 78 L36 90"
          stroke="#18181b"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M43 66 L31 78 L36 90"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="28"
          y="88"
          width="11"
          height="5"
          rx="2.5"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2"
        />

        <path
          d="M57 66 L69 78 L64 90"
          stroke="#18181b"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57 66 L69 78 L64 90"
          stroke="#FAF8F4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="60"
          y="88"
          width="11"
          height="5"
          rx="2.5"
          fill={accent}
          stroke="#18181b"
          strokeWidth="2"
        />

        <g className="animate-skel-head">
          <rect
            x="32"
            y="10"
            width="36"
            height="26"
            rx="13"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.4"
          />
          <path
            d="M34 15 C34 6, 66 6, 66 15 Z"
            fill={accent}
            stroke="#18181b"
            strokeWidth="2"
          />
          <line x1="50" y1="8" x2="50" y2="3" stroke="#18181b" strokeWidth="2.4" />
          <g className="animate-skel-propeller">
            <ellipse
              cx="50"
              cy="3"
              rx="12"
              ry="2.5"
              fill="#FACC15"
              stroke="#18181b"
              strokeWidth="1.6"
            />
          </g>
          <circle cx="43" cy="22" r="4.2" fill="#18181b" />
          <circle cx="57" cy="22" r="4.2" fill="#18181b" />
          <circle cx="44.2" cy="20.8" r="1.5" fill="#FAF8F4" />
          <circle cx="58.2" cy="20.8" r="1.5" fill="#FAF8F4" />
          <path
            d="M44 29 Q50 35 56 29"
            stroke="#18181b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================================
 * 5. THREE COMPLETELY DISTINCT AUTONOMOUS BACKGROUND SKELETON CHARACTERS (z-0)
 *    - Character A: Ollie the Skateboarder (Rides a skateboard, pops kickflips, reacts to scroll)
 *    - Character B: Sherlock Bones the Detective (Tiptoes with magnifying glass, inspects & hides)
 *    - Character C: B-Boy Ribs the Breakdancer & Balloon Kid (Headspins, freezes, & floats with a balloon)
 * ============================================================================ */

/**
 * CHARACTER A SVG: OLLIE THE SKATEBOARDER KID
 */
function SkaterSkeletonSVG({ trick = false }) {
  return (
    <svg
      width="82"
      height="86"
      viewBox="0 0 105 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${
        trick ? 'animate-skel-ollie' : 'animate-skel-skate-cruise'
      }`}
      style={{ background: 'transparent' }}
    >
      {/* Backwards Skater Cap & Skull */}
      <g className="animate-skel-head">
        <rect
          x="34"
          y="10"
          width="34"
          height="25"
          rx="12"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2.3"
        />
        {/* Backwards Yellow Cap */}
        <path
          d="M34 17 C34 7, 68 7, 68 17 Z"
          fill="#FACC15"
          stroke="#18181b"
          strokeWidth="2"
        />
        {/* Cap bill pointing backwards */}
        <path d="M24 17 L40 17" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" />
        {/* Cool Skater Eyes */}
        <circle cx="46" cy="23" r="3.8" fill="#18181b" />
        <circle cx="59" cy="23" r="3.8" fill="#18181b" />
        <circle cx="47.2" cy="21.8" r="1.3" fill="#FAF8F4" />
        <circle cx="60.2" cy="21.8" r="1.3" fill="#FAF8F4" />
        <path
          d="M47 30 Q53 33 58 29"
          stroke="#18181b"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Balancing Skater Arms */}
      <path
        d="M42 40 L22 36 L14 28"
        stroke="#18181b"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 40 L22 36 L14 28"
        stroke="#FAF8F4"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="27" r="3.6" fill="#FACC15" stroke="#18181b" strokeWidth="1.9" />

      <path
        d="M58 40 L78 34 L88 26"
        stroke="#18181b"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 40 L78 34 L88 26"
        stroke="#FAF8F4"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="89" cy="25" r="3.6" fill="#FACC15" stroke="#18181b" strokeWidth="1.9" />

      {/* Angled Skater Ribcage */}
      <line x1="50" y1="35" x2="48" y2="62" stroke="#18181b" strokeWidth="4.6" />
      <line x1="50" y1="35" x2="48" y2="62" stroke="#FAF8F4" strokeWidth="2" />
      <rect
        x="39"
        y="42"
        width="20"
        height="4.4"
        rx="2.2"
        fill="#FAF8F4"
        stroke="#18181b"
        strokeWidth="1.9"
      />
      <rect
        x="40"
        y="49"
        width="17"
        height="4.2"
        rx="2"
        fill="#FAF8F4"
        stroke="#18181b"
        strokeWidth="1.9"
      />
      <ellipse cx="48" cy="61" rx="9" ry="3.8" fill="#FACC15" stroke="#18181b" strokeWidth="2" />

      {/* Bent Skater Legs planted on the skateboard */}
      <path
        d="M43 63 L33 74 L36 85"
        stroke="#18181b"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 63 L33 74 L36 85"
        stroke="#FAF8F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="30"
        y="83"
        width="11"
        height="5"
        rx="2.5"
        fill="#EC4899"
        stroke="#18181b"
        strokeWidth="1.9"
      />

      <path
        d="M53 63 L65 74 L63 85"
        stroke="#18181b"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53 63 L65 74 L63 85"
        stroke="#FAF8F4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="58"
        y="83"
        width="11"
        height="5"
        rx="2.5"
        fill="#EC4899"
        stroke="#18181b"
        strokeWidth="1.9"
      />

      {/* Skateboard Deck + Trucks + Wheels (flips during kickflip!) */}
      <g className={trick ? 'animate-skel-kickflip' : ''}>
        <path
          d="M16 86 Q22 90 30 90 L70 90 Q78 90 84 86"
          stroke="#18181b"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 86 Q22 90 30 90 L70 90 Q78 90 84 86"
          stroke="#FACC15"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Skateboard Wheels */}
        <circle cx="34" cy="95" r="4.5" fill="#EC4899" stroke="#18181b" strokeWidth="2" />
        <circle cx="34" cy="95" r="1.4" fill="#FAF8F4" />
        <circle cx="66" cy="95" r="4.5" fill="#EC4899" stroke="#18181b" strokeWidth="2" />
        <circle cx="66" cy="95" r="1.4" fill="#FAF8F4" />
      </g>
    </svg>
  );
}

/**
 * CHARACTER B SVG: SHERLOCK BONES THE CURIOUS DETECTIVE KID
 */
function DetectiveSkeletonSVG({ inspecting = false }) {
  return (
    <svg
      width="78"
      height="82"
      viewBox="0 0 105 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${
        inspecting ? '' : 'animate-skel-tiptoe'
      }`}
      style={{ background: 'transparent' }}
    >
      {/* Sneaky Detective Skull with Stalker Cap */}
      <g className="animate-skel-head">
        <rect
          x="30"
          y="12"
          width="34"
          height="25"
          rx="12"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="2.3"
        />
        {/* Detective Deerstalker / Explorer Cap */}
        <path
          d="M28 17 C28 6, 66 6, 66 17 Z"
          fill="#3B82F6"
          stroke="#18181b"
          strokeWidth="2"
        />
        <path d="M22 17 L72 17" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="47" cy="7" r="2.2" fill="#FACC15" stroke="#18181b" strokeWidth="1.5" />

        {/* Curious Eyes (One bigger when looking through magnifying glass!) */}
        <circle cx="42" cy="24" r="3.8" fill="#18181b" />
        <circle cx="55" cy="24" r={inspecting ? '5.4' : '4.2'} fill="#18181b" />
        <circle cx="43" cy="22.8" r="1.4" fill="#FAF8F4" />
        <circle cx="56.5" cy="22.5" r="1.8" fill="#FAF8F4" />
        {/* Curious 'o' mouth */}
        <circle cx="49" cy="31" r="2.3" fill="#18181b" />
      </g>

      {/* Sneaking / Inspecting Torso */}
      <line x1="46" y1="37" x2="43" y2="65" stroke="#18181b" strokeWidth="4.6" />
      <line x1="46" y1="37" x2="43" y2="65" stroke="#FAF8F4" strokeWidth="2" />
      <rect
        x="35"
        y="44"
        width="19"
        height="4.4"
        rx="2.2"
        fill="#FAF8F4"
        stroke="#18181b"
        strokeWidth="1.9"
      />
      <rect
        x="36"
        y="51"
        width="16"
        height="4.2"
        rx="2"
        fill="#FAF8F4"
        stroke="#18181b"
        strokeWidth="1.9"
      />
      <ellipse cx="43" cy="64" rx="9" ry="3.8" fill="#3B82F6" stroke="#18181b" strokeWidth="2" />

      {/* Left Arm tucked behind back while sneaking */}
      <path
        d="M38 43 L24 52 L28 60"
        stroke="#18181b"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 43 L24 52 L28 60"
        stroke="#FAF8F4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Arm holding Giant Magnifying Glass! */}
      <g className="animate-skel-magnify">
        <path
          d="M54 43 L68 38 L74 30"
          stroke="#18181b"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M54 43 L68 38 L74 30"
          stroke="#FAF8F4"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Magnifying glass handle & lens */}
        <line
          x1="72"
          y1="32"
          x2="79"
          y2="23"
          stroke="#18181b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="84"
          cy="17"
          r="10"
          fill="rgba(56, 189, 248, 0.32)"
          stroke="#18181b"
          strokeWidth="2.6"
        />
        <circle
          cx="84"
          cy="17"
          r="7.5"
          stroke="#FACC15"
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M80 13 Q83 11 86 13" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Tiptoe Walking Legs */}
      <g className={inspecting ? '' : 'animate-skel-leg-l'}>
        <path
          d="M39 66 L33 80 L37 92"
          stroke="#18181b"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39 66 L33 80 L37 92"
          stroke="#FAF8F4"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="31"
          y="90"
          width="11"
          height="5"
          rx="2.5"
          fill="#3B82F6"
          stroke="#18181b"
          strokeWidth="1.9"
        />
      </g>
      <g className={inspecting ? '' : 'animate-skel-leg-r'}>
        <path
          d="M48 66 L56 80 L52 92"
          stroke="#18181b"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 66 L56 80 L52 92"
          stroke="#FAF8F4"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="48"
          y="90"
          width="11"
          height="5"
          rx="2.5"
          fill="#3B82F6"
          stroke="#18181b"
          strokeWidth="1.9"
        />
      </g>
    </svg>
  );
}

/**
 * CHARACTER C SVG: B-BOY RIBS (Switches between Upside-Down Headspin, Balloon Floating, & B-Boy Freeze!)
 */
function BboySkeletonSVG({ move = 'balloon' }) {
  // Move: 'headspin' | 'balloon' | 'freeze'
  const isHeadspin = move === 'headspin';
  const isBalloon = move === 'balloon';

  return (
    <svg
      width="84"
      height="96"
      viewBox="0 0 110 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${
        isHeadspin
          ? 'animate-skel-headspin'
          : isBalloon
          ? 'animate-skel-balloon'
          : 'animate-skel-groove'
      }`}
      style={{ background: 'transparent' }}
    >
      {/* Floating Red/Pink Party Balloon when in 'balloon' mode! */}
      {isBalloon && (
        <g>
          {/* Balloon string held by left hand */}
          <path
            d="M22 32 Q18 20 24 10"
            stroke="#18181b"
            strokeWidth="1.8"
             fill="none"
          />
          <ellipse
            cx="24"
            cy="2"
            rx="11"
            ry="13"
            fill="#EC4899"
            stroke="#18181b"
            strokeWidth="2.2"
          />
          <ellipse cx="20" cy="-2" rx="3" ry="4.5" fill="#FAF8F4" opacity="0.65" />
          <polygon points="24,15 21,18 27,18" fill="#EC4899" stroke="#18181b" strokeWidth="1.5" />
        </g>
      )}

      {/* B-Boy Group (Tilted when doing a 'freeze' pose!) */}
      <g transform={move === 'freeze' ? 'rotate(-28 55 65)' : undefined}>
        {/* Skull with Neon Shutter Shades */}
        <g className="animate-skel-head">
          <rect
            x="37"
            y="24"
            width="34"
            height="25"
            rx="12"
            fill="#FAF8F4"
            stroke="#18181b"
            strokeWidth="2.3"
          />
          {/* B-boy Beanie Cap */}
          <path
            d="M37 31 C37 21, 71 21, 71 31 Z"
            fill="#10B981"
            stroke="#18181b"
            strokeWidth="2"
          />
          {/* Neon Shutter Shades */}
          <rect
            x="40"
            y="32"
            width="12"
            height="6.5"
            rx="1.5"
            fill="#18181b"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <rect
            x="56"
            y="32"
            width="12"
            height="6.5"
            rx="1.5"
            fill="#18181b"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <line x1="52" y1="35" x2="56" y2="35" stroke="#18181b" strokeWidth="2" />
          <path
            d="M48 43 Q54 46 60 43"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Arms */}
        <path
          d={isBalloon ? 'M43 54 L26 42 L22 32' : 'M43 54 L25 64 L18 74'}
          stroke="#18181b"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={isBalloon ? 'M43 54 L26 42 L22 32' : 'M43 54 L25 64 L18 74'}
          stroke="#FAF8F4"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={isBalloon ? '22' : '18'}
          cy={isBalloon ? '32' : '74'}
          r="3.8"
          fill="#10B981"
          stroke="#18181b"
          strokeWidth="1.9"
        />

        <g className="animate-skel-arm-r">
          <path
            d="M65 54 L82 44 L89 34"
            stroke="#18181b"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 54 L82 44 L89 34"
            stroke="#FAF8F4"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="33" r="3.8" fill="#10B981" stroke="#18181b" strokeWidth="1.9" />
        </g>

        {/* Ribcage */}
        <line x1="54" y1="49" x2="54" y2="78" stroke="#18181b" strokeWidth="4.6" />
        <line x1="54" y1="49" x2="54" y2="78" stroke="#FAF8F4" strokeWidth="2" />
        <rect
          x="44"
          y="56"
          width="20"
          height="4.4"
          rx="2.2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="1.9"
        />
        <rect
          x="46"
          y="63"
          width="16"
          height="4.2"
          rx="2"
          fill="#FAF8F4"
          stroke="#18181b"
          strokeWidth="1.9"
        />
        <ellipse
          cx="54"
          cy="76"
          rx="9.5"
          ry="3.8"
          fill="#10B981"
          stroke="#18181b"
          strokeWidth="2"
        />

        {/* Wide V-Split Breakdance / Floating Legs */}
        <g className="animate-skel-leg-l">
          <path
            d={isHeadspin ? 'M48 78 L28 96 L22 106' : 'M48 78 L42 94 L45 106'}
            stroke="#18181b"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={isHeadspin ? 'M48 78 L28 96 L22 106' : 'M48 78 L42 94 L45 106'}
            stroke="#FAF8F4"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x={isHeadspin ? '15' : '38'}
            y="104"
            width="11"
            height="5"
            rx="2.5"
            fill="#10B981"
            stroke="#18181b"
            strokeWidth="1.9"
          />
        </g>
        <g className="animate-skel-leg-r">
          <path
            d={isHeadspin ? 'M60 78 L80 96 L86 106' : 'M60 78 L66 94 L63 106'}
            stroke="#18181b"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={isHeadspin ? 'M60 78 L80 96 L86 106' : 'M60 78 L66 94 L63 106'}
            stroke="#FAF8F4"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x={isHeadspin ? '82' : '59'}
            y="104"
            width="11"
            height="5"
            rx="2.5"
            fill="#10B981"
            stroke="#18181b"
            strokeWidth="1.9"
          />
        </g>
      </g>
    </svg>
  );
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * INTELLIGENT BACKGROUND SKELETON CREW (z-0, behind content cards)
 * Each of the 3 skeletons has its own distinct role, SVG body, prop, and AI state machine:
 *  1. Ollie (Skateboarder): Cruises horizontally/diagonally, pops kickflips, & reacts to page scrolling!
 *  2. Sherlock Bones (Detective): Tiptoes toward where the user is looking, inspects with a magnifying
 *     glass, and scurries behind a content card if the mouse gets too close!
 *  3. B-Boy Ribs (Breakdancer & Balloon Kid): Switches between floating upward with a balloon,
 *     spinning upside-down in a headspin, and hitting b-boy freezes!
 */
export function BackgroundSkeletonStickers() {
  const mouseRef = useRef({ x: 50, y: 50 });

  // 1. Ollie the Skateboarder State
  const [skater, setSkater] = useState({
    x: 10,
    y: 26,
    facing: 1,
    trick: false,
    hiding: false,
    phrase: 'cruisin’ the DOM 🛹',
    duration: 3.4,
  });

  // 2. Sherlock Bones the Detective State
  const [detective, setDetective] = useState({
    x: 86,
    y: 52,
    facing: -1,
    inspecting: true,
    hiding: false,
    phrase: 'inspecting clean code 🔍',
    duration: 4.2,
  });

  // 3. B-Boy Ribs the Breakdancer & Balloon Kid State
  const [bboy, setBboy] = useState({
    x: 14,
    y: 78,
    facing: 1,
    move: 'balloon', // 'balloon' | 'headspin' | 'freeze'
    hiding: false,
    phrase: 'floating up~ 🎈',
    duration: 4.8,
  });

  // Track mouse position & scroll events so the skeletons react intelligently!
  useEffect(() => {
    let scrollTimeout = null;

    const handleMouseMove = (e) => {
      const vw = (e.clientX / window.innerWidth) * 100;
      const vh = (e.clientY / window.innerHeight) * 100;
      mouseRef.current = { x: vw, y: vh };

      // If the cursor gets super close to Sherlock Bones, he gets startled and hides behind a card!
      setDetective((prev) => {
        const dist = Math.hypot(vw - prev.x, vh - prev.y);
        if (dist < 13 && !prev.hiding) {
          return {
            ...prev,
            x: 50, // ducks behind center card column!
            y: Math.min(85, Math.max(15, prev.y)),
            hiding: true,
            inspecting: false,
            phrase: '!! spotted! hiding! 🫣',
            duration: 1.4,
          };
        }
        return prev;
      });
    };

    const handleScroll = () => {
      // Skater kid loves when the user scrolls and pops an ollie trick!
      setSkater((prev) => ({
        ...prev,
        trick: true,
        phrase: 'woah fast scroll!! 🛹💨',
      }));
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setSkater((prev) => ({ ...prev, trick: false }));
      }, 1200);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Autonomous AI loop for #1: Ollie the Skateboarder
  useEffect(() => {
    const skatePhrases = [
      'kickflip!! 🛹✨',
      'cruisin’ the DOM 🛹',
      'grinding card ledges ⚡',
      'skrrrrt! 🛹💨',
    ];
    const id = setInterval(() => {
      setSkater((prev) => {
        // Skate from left margin to right margin (passing behind cards!) or pop a trick on the side
        const goRight = prev.x < 50;
        const passBehindCard = Math.random() < 0.3;
        const nextX = passBehindCard
          ? randomInRange(38, 62)
          : goRight
          ? randomInRange(78, 93)
          : randomInRange(6, 20);
        const nextY = randomInRange(14, 86);
        const doTrick = !passBehindCard && Math.random() < 0.55;

        return {
          x: nextX,
          y: nextY,
          facing: nextX >= prev.x ? 1 : -1,
          trick: doTrick,
          hiding: passBehindCard,
          phrase: doTrick
            ? 'kickflip!! 🛹✨'
            : skatePhrases[Math.floor(Math.random() * skatePhrases.length)],
          duration: randomInRange(2.6, 4.0),
        };
      });
    }, 3800);
    return () => clearInterval(id);
  }, []);

  // Autonomous AI loop for #2: Sherlock Bones the Detective
  useEffect(() => {
    const inspectPhrases = [
      'inspecting clean code 🔍',
      '0 bugs detected! 🧐',
      'checking FastAPI routes ✨',
      'hmm.. nice BLoC state 🔍',
    ];
    const id = setInterval(() => {
      setDetective((prev) => {
        // Tiptoes near the vertical region where the user's mouse is, staying on the left or right margin
        const userY = mouseRef.current.y;
        const targetY = Math.min(86, Math.max(14, userY + randomInRange(-16, 16)));
        const leftMargin = mouseRef.current.x < 50;
        const targetX = leftMargin ? randomInRange(7, 21) : randomInRange(79, 93);
        const willInspect = Math.random() < 0.65;

        return {
          x: targetX,
          y: targetY,
          facing: targetX < 50 ? 1 : -1,
          inspecting: willInspect,
          hiding: false,
          phrase: willInspect
            ? inspectPhrases[Math.floor(Math.random() * inspectPhrases.length)]
            : 'tiptoeing around.. 🕵️‍♂️',
          duration: randomInRange(3.6, 5.2),
        };
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  // Autonomous AI loop for #3: B-Boy Ribs (Balloon Floater & Breakdancer)
  useEffect(() => {
    const moves = [
      { move: 'balloon', phrase: 'floating up~ 🎈' },
      { move: 'headspin', phrase: 'headspin!! 🌪️' },
      { move: 'freeze', phrase: 'b-boy FREEZE! ⚡' },
    ];
    let step = 0;
    const id = setInterval(() => {
      step = (step + 1) % moves.length;
      const chosen = moves[step];
      setBboy((prev) => {
        // When holding a balloon, floats upward toward top of viewport; when breakdancing, drops lower!
        const nextY =
          chosen.move === 'balloon' ? randomInRange(14, 34) : randomInRange(58, 88);
        const nextX =
          Math.random() < 0.5 ? randomInRange(7, 22) : randomInRange(78, 92);
        return {
          x: nextX,
          y: nextY,
          facing: nextX >= prev.x ? 1 : -1,
          move: chosen.move,
          hiding: false,
          phrase: chosen.phrase,
          duration: chosen.move === 'balloon' ? 5.2 : 3.4,
        };
      });
    }, 4800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* 1. OLLIE THE SKATEBOARDER KID */}
      <div
        style={{
          position: 'absolute',
          left: `${skater.x}vw`,
          top: `${skater.y}vh`,
          transform: `translate(-50%, -50%) scale(${skater.hiding ? 0.85 : 1})`,
          transition: `left ${skater.duration}s cubic-bezier(0.34, 1.2, 0.64, 1), top ${skater.duration}s cubic-bezier(0.34, 1.2, 0.64, 1)`,
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <span
          className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-yellow-300 -mb-1 whitespace-nowrap select-none"
          style={{
            opacity: skater.hiding ? 0 : 0.95,
            textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
          }}
        >
          {skater.phrase}
        </span>
        <div
          style={{
            transform: `scaleX(${skater.facing})`,
            transition: 'transform 0.25s ease',
          }}
        >
          <SkaterSkeletonSVG trick={skater.trick} />
        </div>
      </div>

      {/* 2. SHERLOCK BONES THE DETECTIVE KID */}
      <div
        style={{
          position: 'absolute',
          left: `${detective.x}vw`,
          top: `${detective.y}vh`,
          transform: `translate(-50%, -50%) scale(${detective.hiding ? 0.82 : 1})`,
          transition: `left ${detective.duration}s ease-in-out, top ${detective.duration}s ease-in-out`,
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <span
          className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-sky-300 -mb-1 whitespace-nowrap select-none"
          style={{
            opacity: detective.hiding ? 0 : 0.95,
            textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
          }}
        >
          {detective.phrase}
        </span>
        <div
          style={{
            transform: `scaleX(${detective.facing})`,
            transition: 'transform 0.25s ease',
          }}
        >
          <DetectiveSkeletonSVG inspecting={detective.inspecting} />
        </div>
      </div>

      {/* 3. B-BOY RIBS THE BREAKDANCER & BALLOON FLOATER */}
      <div
        style={{
          position: 'absolute',
          left: `${bboy.x}vw`,
          top: `${bboy.y}vh`,
          transform: 'translate(-50%, -50%)',
          transition: `left ${bboy.duration}s ease-in-out, top ${bboy.duration}s ease-in-out`,
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <span
          className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-emerald-300 -mb-1 whitespace-nowrap select-none"
          style={{
            textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
          }}
        >
          {bboy.phrase}
        </span>
        <div
          style={{
            transform: `scaleX(${bboy.facing})`,
            transition: 'transform 0.25s ease',
          }}
        >
          <BboySkeletonSVG move={bboy.move} />
        </div>
      </div>
    </div>
  );
}
