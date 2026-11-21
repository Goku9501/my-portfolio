import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import BalloonPopWrapper from './BalloonPopSkeleton';
import {
  createInitialCrewState,
  stepCrewPhysics,
  detectVisibleSection,
  notifyBuddyPopped,
  notifyBuddyReassembled,
  notifyUserClick,
  notifyFastScroll,
  syncCrewMusicVibe,
} from './skeletonBrain';

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Shared witness hook so foreground card skeletons also react when any other skeleton pops.
 */
function useWitnessPopReaction(selfId, reactions) {
  const [witnessPhrase, setWitnessPhrase] = useState(null);
  const reactionsRef = useRef(reactions);
  reactionsRef.current = reactions;

  useEffect(() => {
    let timerId = null;
    const handlePop = (e) => {
      if (e.detail?.id === selfId) return;
      const list = reactionsRef.current;
      if (!list || !list.length) return;
      setWitnessPhrase(list[Math.floor(Math.random() * list.length)]);
      clearTimeout(timerId);
      timerId = setTimeout(() => setWitnessPhrase(null), 2600);
    };

    window.addEventListener('skeleton-popped', handlePop);
    return () => {
      window.removeEventListener('skeleton-popped', handlePop);
      clearTimeout(timerId);
    };
  }, [selfId]);

  return witnessPhrase;
}

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
  danceStyle = 'lofi',
  isPlaying = true,
}) {
  const [routine, setRoutine] = useState('swing'); // 'swing' | 'one-hand' | 'chin-up' | 'upside-down'
  const witnessPhrase = useWitnessPopReaction('hanging', [
    'yikes!! glad im hanging up here 😅',
    'WHOA someone just exploded?! 😱',
    'dont pop my hands off!! 😰🦴',
  ]);

  // Organic randomized gymnastic routine changes synced with song vibe
  useEffect(() => {
    if (!isPlaying) {
      setRoutine('swing');
      return;
    }
    if (danceStyle === 'hyper') {
      setRoutine('chin-up');
    } else if (danceStyle === 'disco' || danceStyle === 'party') {
      setRoutine('one-hand');
    } else {
      setRoutine('swing');
    }

    const movesByStyle = {
      lofi: ['swing', 'one-hand', 'upside-down', 'swing'],
      hyper: ['chin-up', 'upside-down', 'one-hand', 'chin-up'],
      disco: ['one-hand', 'upside-down', 'swing'],
      party: ['chin-up', 'upside-down', 'one-hand', 'swing'],
    };
    const moves = movesByStyle[danceStyle] || movesByStyle.lofi;
    let idx = 0;
    let timeoutId = null;

    const scheduleNext = () => {
      const delay =
        danceStyle === 'hyper' ? randomInRange(1900, 3200) : randomInRange(2800, 5200);
      timeoutId = setTimeout(() => {
        idx = (idx + 1) % moves.length;
        setRoutine(moves[idx]);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [danceStyle, isPlaying]);

  const routineText = !isPlaying
    ? 'music paused.. 🎵'
    : routine === 'upside-down'
    ? 'upside-down hang!! 🙃'
    : routine === 'one-hand'
    ? danceStyle === 'disco'
      ? 'disco 1-hand wave!! 🕺👋'
      : 'look ma, 1 hand!! 👋'
    : routine === 'chin-up'
    ? danceStyle === 'hyper'
      ? 'TURBO PULL-UPS!! 💪🔥'
      : 'huff.. pull-up!! 💪'
    : label;

  return (
    <BalloonPopWrapper skeletonId="hanging" accent={accent}>
      {({ inflatePhrase }) => (
        <div
          className={`select-none flex flex-col items-center ${
            routine === 'upside-down' ? '' : 'animate-skel-hang'
          }`}
          style={{ background: 'transparent' }}
          aria-hidden="true"
        >
      <svg
        width="82"
        height="94"
        viewBox="0 0 96 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`die-cut-skeleton overflow-visible ${
          routine === 'upside-down' ? 'animate-skel-upside-hang' : ''
        }`}
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

      {(inflatePhrase || witnessPhrase || routineText) && (
        <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-pink-300 -mt-2 whitespace-nowrap">
          {inflatePhrase || witnessPhrase || routineText}
        </span>
      )}
        </div>
      )}
    </BalloonPopWrapper>
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
  danceStyle = 'lofi',
  isPlaying = true,
  songTitle = '',
}) {
  const styleVibes = {
    lofi: [songTitle ? `♪ ${songTitle} ♫` : label, '♫ lofi flutter beats ♪', '♬ chill coding vibes ♫'],
    hyper: [songTitle ? `🔥 ${songTitle} ⚡` : '🔥 BASS DROP!! 🎧', '⚡ 145 BPM HYPER BEAT!!', '🎧 HEADBANG MODE!!'],
    disco: [songTitle ? `🕺 ${songTitle} ✨` : '🕺 retro disco fever ♫', '✨ stayin’ alive ♪', '♬ funky boombox ♫'],
    party: [songTitle ? `💀 ${songTitle} 🎉` : '💀 SKELETON PARTY!! 🎉', '🦴 rattle dem bones ♫', '🎉 full party mode!!'],
  };
  const playlist = styleVibes[danceStyle] || styleVibes.lofi;
  const [trackIdx, setTrackIdx] = useState(0);
  const [pose, setPose] = useState('bop'); // 'bop' | 'sip' | 'scratch' | 'nod'
  const witnessPhrase = useWitnessPopReaction('sitting', [
    'WHOA someone just exploded?! 😱🎧',
    'yikes!! good thing im chilling up here 😅',
    'uh oh bones flying everywhere!! 🦴👀',
  ]);

  useEffect(() => {
    setTrackIdx(0);
    setPose('bop');
    const poses = isPlaying ? ['bop', 'sip', 'scratch', 'nod'] : ['nod', 'sip'];
    let timeoutId = null;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        setTrackIdx((prev) => (prev + 1) % playlist.length);
        setPose((prev) => {
          const candidates = poses.filter((p) => p !== prev);
          return candidates[Math.floor(Math.random() * candidates.length)] || 'bop';
        });
        scheduleNext();
      }, randomInRange(2800, 5200));
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [danceStyle, songTitle, isPlaying]);

  const poseCaption = !isPlaying
    ? pose === 'sip'
      ? 'sipping boba while paused~ 🧋'
      : '⏸ press play on boombox!'
    : pose === 'sip'
    ? 'sipping boba~ 🧋'
    : pose === 'scratch'
    ? 'wicka-wicka DJ scratch!! 🎛️'
    : pose === 'nod'
    ? 'vibing so hard.. 😴🎵'
    : playlist[trackIdx % playlist.length];

  return (
    <BalloonPopWrapper skeletonId="sitting" accent={accent}>
      {({ inflatePhrase }) => (
        <div
          className="select-none flex flex-col items-center"
          style={{ background: 'transparent' }}
          aria-hidden="true"
        >
          <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-sky-300 -mb-1 whitespace-nowrap">
            {inflatePhrase || witnessPhrase || poseCaption}
          </span>
          {pose === 'nod' && !inflatePhrase && (
            <span className="font-mono text-[9px] font-black text-sky-600 dark:text-sky-300 animate-pulse -mb-1">
              Zzz
            </span>
          )}

      <svg
        width="92"
        height="84"
        viewBox="0 0 112 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`die-cut-skeleton overflow-visible ${pose === 'nod' ? 'animate-skel-nap' : ''}`}
      >
        {/* Multi-note / Heart floating music stream rising from headphones & boombox */}
        <g className="animate-skel-note-1">
          <text
            x="66"
            y="24"
            fill={danceStyle === 'lofi' ? '#EC4899' : accent}
            stroke="#18181b"
            strokeWidth="0.7"
            fontSize="13"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            {danceStyle === 'lofi' ? '♥' : danceStyle === 'hyper' ? '🔥' : '♫'}
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
            {danceStyle === 'lofi' ? '♡' : danceStyle === 'hyper' ? '⚡' : '♪'}
          </text>
        </g>
        <g className="animate-skel-note-3">
          <text
            x="14"
            y="22"
            fill={danceStyle === 'lofi' ? '#EC4899' : '#FACC15'}
            stroke="#18181b"
            strokeWidth="0.7"
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
          >
            {danceStyle === 'lofi' ? '♥' : '♬'}
          </text>
        </g>

        {/* Mini Pulsing Retro Boombox sitting beside the skeleton on the card ledge! */}
        <g
          className="animate-skel-boombox"
          style={{
            animationDuration:
              pose === 'scratch' ? '0.18s' : danceStyle === 'hyper' ? '0.28s' : '0.6s',
          }}
        >
          {/* Boombox handle */}
          <path
            d="M74 49 L74 45 L92 45 L92 49"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Boombox body changes color with the song vibe! */}
          <rect
            x="68"
            y="49"
            width="30"
            height="17"
            rx="3.5"
            fill={
              danceStyle === 'lofi'
                ? '#F472B6'
                : danceStyle === 'hyper'
                ? '#FACC15'
                : '#10B981'
            }
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

        {/* Left Arm: raises boba cup to mouth during 'sip', else leans on the ledge */}
        {pose === 'sip' ? (
          <>
            <path
              d="M32 42 L24 34 L31 28"
              stroke="#18181b"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 42 L24 34 L31 28"
              stroke="#FAF8F4"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="26"
              y="22"
              width="8"
              height="10"
              rx="2"
              fill="#FAF8F4"
              stroke="#18181b"
              strokeWidth="1.8"
            />
            <rect x="27" y="25" width="6" height="4" fill="#F59E0B" />
            <line x1="32" y1="19" x2="34" y2="23" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
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
          </>
        )}

        {/* Right Arm: scratches boombox rapidly during 'scratch', else taps near ledge */}
        {pose === 'scratch' ? (
          <g className="animate-skel-arm-r">
            <path
              d="M50 42 L64 46 L74 51"
              stroke="#18181b"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M50 42 L64 46 L74 51"
              stroke="#FAF8F4"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="74" cy="51" r="3.6" fill="#FACC15" stroke="#18181b" strokeWidth="2" />
          </g>
        ) : (
          <>
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
          </>
        )}

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
      )}
    </BalloonPopWrapper>
  );
}

/**
 * 4. TRAMPOLINE BOUNCING SKELETON KID (With Spinning Propeller Beanie!)
 */
export function JumpingSkeletonKid({
  accent = '#10B981',
  label = 'boing! boing! 🚀',
  danceStyle = 'lofi',
  isPlaying = true,
}) {
  const phrasesByStyle = {
    lofi: [label, 'chill trampoline bounce 🤸', 'floating jump~ ✨'],
    hyper: ['TURBO BOUNCE!! 🚀🔥', 'DOUBLE JUMP!! ⚡', 'MAX AIRTIME!! 🤸'],
    disco: ['360 DISCO SPIN!! 🕺✨', 'funky spin jump! 🪩', 'boogie bounce! 🕺'],
    party: ['SKELETON PARTY JUMP!! 💀🎉', 'rattle & bounce!! 🦴', 'party trampoline!! 🎉'],
  };
  const phrases = phrasesByStyle[danceStyle] || phrasesByStyle.lofi;
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState('trampoline'); // 'trampoline' | 'spin' | 'helicopter' | 'wave'
  const witnessPhrase = useWitnessPopReaction('jumping', [
    'uh oh don’t pop me next!! 😰',
    'WHOA did a buddy just burst?! 😱',
    'jumping extra careful now!! 🤸🦴',
  ]);

  useEffect(() => {
    setIdx(0);
    const modePool =
      danceStyle === 'hyper' || danceStyle === 'disco'
        ? ['spin', 'helicopter', 'trampoline', 'wave']
        : ['trampoline', 'helicopter', 'wave', 'spin'];
    setMode(modePool[0]);
    let timeoutId = null;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        setIdx((p) => (p + 1) % phrases.length);
        setMode((prev) => {
          const candidates = modePool.filter((m) => m !== prev);
          return candidates[Math.floor(Math.random() * candidates.length)] || 'trampoline';
        });
        scheduleNext();
      }, randomInRange(2800, 5200));
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [danceStyle]);

  const jumpAnimClass = !isPlaying
    ? 'animate-skel-groove'
    : mode === 'helicopter'
    ? 'animate-skel-helicopter'
    : mode === 'spin'
    ? 'animate-skel-spin'
    : mode === 'trampoline'
    ? 'animate-skel-trampoline'
    : danceStyle === 'lofi'
    ? 'animate-skel-romantic-sway'
    : 'animate-skel-party-bhangra';

  const activeCaption = !isPlaying
    ? 'waiting for beat.. 🎵'
    : mode === 'helicopter'
    ? 'propeller liftoff!! 🚁'
    : phrases[idx % phrases.length];

  return (
    <BalloonPopWrapper skeletonId="jumping" accent={accent}>
      {({ inflatePhrase }) => (
        <div
          className={`select-none flex flex-col items-center ${jumpAnimClass}`}
          style={{
            background: 'transparent',
            animationDuration:
              mode !== 'helicopter' && danceStyle === 'hyper' ? '0.68s' : undefined,
          }}
          aria-hidden="true"
        >
          <span className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-emerald-300 -mb-1 whitespace-nowrap">
            {inflatePhrase || witnessPhrase || activeCaption}
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
          <g
            className="animate-skel-propeller"
            style={mode === 'helicopter' ? { animationDuration: '0.1s' } : undefined}
          >
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
      )}
    </BalloonPopWrapper>
  );
}

/* ============================================================================
 * 5. THREE COMPLETELY DISTINCT AUTONOMOUS BACKGROUND SKELETON CHARACTERS (z-0)
 *    - Character A: Ollie the Skateboarder (Kickflip, Wheelie, Moonwalk, 360 Spin, Cruise + Mind Postures)
 *    - Character B: Sherlock Bones the Detective (Magnifying Scan, Robot, Shuffle, Dab, Bass Squat + Mind Postures)
 *    - Character C: B-Boy Ribs the Breakdancer (Headspin, One-Hand Freeze, Windmill, Wave, Heart Balloon + Mind Postures)
 * ============================================================================ */

const SKATER_MOVE_ANIMS = {
  kickflip: 'animate-skel-ollie',
  wheelie: 'animate-skel-wheelie',
  moonwalk: 'animate-skel-moonwalk',
  spin360: 'animate-skel-spin',
  chill_cruise: 'animate-skel-skate-cruise',
};

const DETECTIVE_MOVE_ANIMS = {
  bass_squat: 'animate-skel-bass-pump',
  robot: 'animate-skel-robot',
  shuffle: 'animate-skel-shuffle',
  dab: 'animate-skel-dab',
  rose_sway: 'animate-skel-romantic-sway',
};

const BBOY_MOVE_ANIMS = {
  headspin: 'animate-skel-headspin',
  freeze: 'animate-skel-groove',
  windmill: 'animate-skel-windmill',
  balloon: 'animate-skel-balloon',
  wave: 'animate-skel-wave-groove',
};

function resolveCharacterAnimClass(intent, danceMove, napping, moveAnimMap) {
  if (napping || intent === 'nap') return '';
  if (intent === 'witness_panic') return 'animate-skel-panic-shiver';
  if (intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge') {
    return 'animate-skel-sprint';
  }
  if (intent === 'chat') return 'animate-skel-chat-nod';
  if (intent === 'investigate_cursor' || intent === 'patrol_section') {
    return 'animate-skel-tiptoe';
  }
  if (intent === 'just_reassembled') return 'animate-skel-groove';
  return moveAnimMap[danceMove] || Object.values(moveAnimMap)[0] || 'animate-skel-groove';
}

function SpeedTrailLines({ color = '#18181b' }) {
  return (
    <g opacity="0.65">
      <line x1="2" y1="42" x2="18" y2="42" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="-2" y1="54" x2="15" y2="54" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="4" y1="66" x2="17" y2="66" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/**
 * Shared expression renderer so every mind state (nap, panic shock, angry grudge,
 * sprint effort, robot visor, boss shades, dreamy, curious) looks unmistakably different.
 */
function SkeletonFace({
  cxL,
  cxR,
  cy,
  mouthY,
  intent,
  napping,
  danceStyle,
  danceMove,
  shadesColor = '#FACC15',
}) {
  const isSleepy = napping || intent === 'nap';
  const isPanic = intent === 'witness_panic';
  const isAngry = intent === 'just_reassembled';
  const isSprint = intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge';
  const isRobot = danceMove === 'robot' && !isSleepy && !isPanic && !isAngry && !isSprint;
  const isShades =
    !isSleepy &&
    !isPanic &&
    !isAngry &&
    !isSprint &&
    !isRobot &&
    intent !== 'investigate_cursor' &&
    intent !== 'patrol_section' &&
    (danceStyle === 'hyper' || danceMove === 'dab' || danceMove === 'bass_squat');
  const isRomantic =
    danceStyle === 'lofi' &&
    !isSleepy &&
    !isPanic &&
    !isAngry &&
    !isSprint &&
    !isRobot &&
    !isShades &&
    intent !== 'investigate_cursor' &&
    intent !== 'patrol_section';

  const midX = (cxL + cxR) / 2;

  if (isSleepy) {
    return (
      <>
        <line x1={cxL - 4} y1={cy} x2={cxL + 4} y2={cy} stroke="#18181b" strokeWidth="2.3" strokeLinecap="round" />
        <line x1={cxR - 4} y1={cy} x2={cxR + 4} y2={cy} stroke="#18181b" strokeWidth="2.3" strokeLinecap="round" />
        <path d={`M${midX - 4} ${mouthY} Q${midX} ${mouthY + 2} ${midX + 4} ${mouthY}`} stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (isPanic) {
    return (
      <>
        <circle cx={cxL} cy={cy} r="5.1" fill="#FFFFFF" stroke="#18181b" strokeWidth="2" />
        <circle cx={cxL} cy={cy} r="2" fill="#18181b" />
        <circle cx={cxR} cy={cy} r="5.1" fill="#FFFFFF" stroke="#18181b" strokeWidth="2" />
        <circle cx={cxR} cy={cy} r="2" fill="#18181b" />
        <ellipse cx={midX} cy={mouthY + 1} rx="4" ry="4.8" fill="#18181b" />
      </>
    );
  }

  if (isAngry) {
    return (
      <>
        <line x1={cxL - 5} y1={cy - 4.5} x2={cxL + 4} y2={cy - 1.5} stroke="#18181b" strokeWidth="2.4" strokeLinecap="round" />
        <line x1={cxR + 5} y1={cy - 4.5} x2={cxR - 4} y2={cy - 1.5} stroke="#18181b" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={cxL} cy={cy + 1} r="3.4" fill="#18181b" />
        <circle cx={cxR} cy={cy + 1} r="3.4" fill="#18181b" />
        <path d={`M${midX - 6} ${mouthY + 2} Q${midX} ${mouthY - 2.5} ${midX + 6} ${mouthY + 2}`} stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (isRobot) {
    return (
      <>
        <rect x={cxL - 5} y={cy - 4} width={cxR - cxL + 10} height="7.5" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
        <circle cx={cxL} cy={cy - 0.5} r="2" fill="#38BDF8" />
        <circle cx={cxR} cy={cy - 0.5} r="2" fill="#38BDF8" />
        <rect x={midX - 5} y={mouthY - 1} width="10" height="3" rx="1" fill="#18181b" />
      </>
    );
  }

  if (isShades) {
    return (
      <>
        <rect x={cxL - 6} y={cy - 4} width="11" height="6" rx="1" fill="#18181b" stroke={shadesColor} strokeWidth="1.4" />
        <rect x={cxR - 5} y={cy - 4} width="11" height="6" rx="1" fill="#18181b" stroke={shadesColor} strokeWidth="1.4" />
        <line x1={cxL + 5} y1={cy - 1} x2={cxR - 5} y2={cy - 1} stroke="#18181b" strokeWidth="2" />
        <path d={`M${midX - 5} ${mouthY} Q${midX} ${mouthY + 3.5} ${midX + 5} ${mouthY}`} stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    );
  }

  if (isRomantic) {
    return (
      <>
        <ellipse cx={cxL - 5} cy={cy + 4} rx="3" ry="1.6" fill="#F472B6" opacity="0.75" />
        <ellipse cx={cxR + 5} cy={cy + 4} rx="3" ry="1.6" fill="#F472B6" opacity="0.75" />
        <path d={`M${cxL - 3} ${cy} Q${cxL} ${cy - 3} ${cxL + 3} ${cy}`} stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d={`M${cxR - 3} ${cy} Q${cxR} ${cy - 3} ${cxR + 3} ${cy}`} stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d={`M${midX - 5} ${mouthY} Q${midX} ${mouthY + 3.2} ${midX + 5} ${mouthY}`} stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    );
  }

  const r = isSprint ? 4.4 : 3.8;
  return (
    <>
      <circle cx={cxL} cy={cy} r={r} fill="#18181b" />
      <circle cx={cxR} cy={cy} r={r} fill="#18181b" />
      <circle cx={cxL + 1.2} cy={cy - 1.2} r="1.4" fill="#FAF8F4" />
      <circle cx={cxR + 1.2} cy={cy - 1.2} r="1.4" fill="#FAF8F4" />
      <path d={`M${midX - 5} ${mouthY} Q${midX} ${mouthY + 3.5} ${midX + 5} ${mouthY}`} stroke="#18181b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  );
}

/**
 * CHARACTER A SVG: OLLIE THE SKATEBOARDER KID
 */
function SkaterSkeletonSVG({
  trick = false,
  danceStyle = 'lofi',
  intent = 'showoff',
  danceMove = 'kickflip',
  napping = false,
}) {
  const isHyper = danceStyle === 'hyper';
  const isRomantic = danceStyle === 'lofi';
  const isPanic = intent === 'witness_panic';
  const isAngry = intent === 'just_reassembled';
  const isSprint = intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge';
  const isChat = intent === 'chat';
  const activeMove = danceMove;
  const animClass = resolveCharacterAnimClass(intent, activeMove, napping, SKATER_MOVE_ANIMS);

  const armLPath = isPanic
    ? 'M42 40 L24 28 L31 18'
    : isAngry
    ? 'M42 40 L27 50 L39 60'
    : activeMove === 'wheelie' && !isChat && !napping
    ? 'M42 40 L20 38 L8 36'
    : activeMove === 'kickflip' || activeMove === 'spin360'
    ? 'M42 40 L24 22 L16 12'
    : 'M42 40 L22 36 L14 28';

  const armRPath = isPanic
    ? 'M58 40 L76 28 L69 18'
    : isAngry
    ? 'M58 40 L73 50 L57 60'
    : isChat
    ? 'M58 40 L74 34 L84 22'
    : activeMove === 'wheelie' && !napping
    ? 'M58 40 L80 30 L94 24'
    : activeMove === 'kickflip' || activeMove === 'spin360'
    ? 'M58 40 L76 22 L84 12'
    : 'M58 40 L78 34 L88 26';

  const handL = isPanic
    ? [31, 18]
    : isAngry
    ? [39, 60]
    : activeMove === 'wheelie'
    ? [7, 36]
    : activeMove === 'kickflip' || activeMove === 'spin360'
    ? [15, 11]
    : [13, 27];

  const handR = isPanic
    ? [69, 18]
    : isAngry
    ? [57, 60]
    : isChat
    ? [84, 21]
    : activeMove === 'wheelie'
    ? [95, 23]
    : activeMove === 'kickflip' || activeMove === 'spin360'
    ? [85, 11]
    : [89, 25];

  return (
    <svg
      width="86"
      height="92"
      viewBox="0 0 105 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${animClass}`}
      style={{ background: 'transparent' }}
    >
      {isSprint && <SpeedTrailLines color="#FACC15" />}

      {isRomantic && !isPanic && !napping && !isSprint && (
        <>
          <g className="animate-skel-note-1">
            <text x="16" y="18" fill="#EC4899" fontSize="14" fontWeight="bold">
              ♥
            </text>
          </g>
          <g className="animate-skel-note-2">
            <text x="76" y="14" fill="#F43F5E" fontSize="13" fontWeight="bold">
              ♡
            </text>
          </g>
        </>
      )}
      {isHyper && !isPanic && !napping && (
        <g className="animate-skel-note-1">
          <text x="76" y="18" fontSize="14">
            🔥
          </text>
        </g>
      )}

      {/* Backwards Skater Cap & Skull */}
      <g className={napping ? '' : 'animate-skel-head'}>
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
        <path
          d="M34 17 C34 7, 68 7, 68 17 Z"
          fill={isRomantic ? '#EC4899' : isHyper ? '#FACC15' : '#10B981'}
          stroke="#18181b"
          strokeWidth="2"
        />
        <path d="M24 17 L40 17" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" />

        <SkeletonFace
          cxL={45}
          cxR={59}
          cy={23}
          mouthY={30}
          intent={intent}
          napping={napping}
          danceStyle={danceStyle}
          danceMove={activeMove}
          shadesColor="#FACC15"
        />
      </g>

      {/* Left Arm */}
      <g className={!napping && (activeMove === 'kickflip' || activeMove === 'spin360') ? 'animate-skel-arm-l' : ''}>
        <path d={armLPath} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={armLPath} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={handL[0]} cy={handL[1]} r="3.6" fill={isRomantic ? '#EC4899' : '#FACC15'} stroke="#18181b" strokeWidth="1.9" />
      </g>

      {/* Right Arm */}
      <g className={!napping && (isChat || activeMove === 'kickflip' || activeMove === 'spin360') ? 'animate-skel-arm-r' : ''}>
        <path d={armRPath} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={armRPath} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={handR[0]} cy={handR[1]} r="3.6" fill={isRomantic ? '#EC4899' : '#FACC15'} stroke="#18181b" strokeWidth="1.9" />
      </g>

      {/* Angled Skater Ribcage */}
      <line x1="50" y1="35" x2="48" y2="62" stroke="#18181b" strokeWidth="4.6" />
      <line x1="50" y1="35" x2="48" y2="62" stroke="#FAF8F4" strokeWidth="2" />
      <rect x="39" y="42" width="20" height="4.4" rx="2.2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
      <rect x="40" y="49" width="17" height="4.2" rx="2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
      <ellipse cx="48" cy="61" rx="9" ry="3.8" fill={isRomantic ? '#EC4899' : '#FACC15'} stroke="#18181b" strokeWidth="2" />

      {/* Bent Skater Legs planted on the skateboard */}
      <path d="M43 63 L33 74 L36 85" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43 63 L33 74 L36 85" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="83" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : '#EC4899'} stroke="#18181b" strokeWidth="1.9" />

      <path d="M53 63 L65 74 L63 85" stroke="#18181b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M53 63 L65 74 L63 85" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="58" y="83" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : '#EC4899'} stroke="#18181b" strokeWidth="1.9" />

      {/* Skateboard Deck (Flips on kickflip, pops front wheel up on wheelie) */}
      <g
        className={!napping && (activeMove === 'kickflip' || trick) ? 'animate-skel-kickflip' : ''}
        transform={activeMove === 'wheelie' && !napping ? 'rotate(-18 50 90)' : undefined}
      >
        <path d="M16 86 Q22 90 30 90 L70 90 Q78 90 84 86" stroke="#18181b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
        <path d="M16 86 Q22 90 30 90 L70 90 Q78 90 84 86" stroke={isRomantic ? '#EC4899' : '#FACC15'} strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="95" r="4.5" fill="#EC4899" stroke="#18181b" strokeWidth="2" />
        <circle cx="34" cy="95" r="1.4" fill="#FAF8F4" />
        <circle cx="66" cy="95" r="4.5" fill="#EC4899" stroke="#18181b" strokeWidth="2" />
        <circle cx="66" cy="95" r="1.4" fill="#FAF8F4" />
      </g>
    </svg>
  );
}

/**
 * CHARACTER B SVG: SHERLOCK BONES (Robot, Dab, Shuffle, Bass Squat, Magnifying Scan & Mind Postures!)
 */
function DetectiveSkeletonSVG({
  inspecting = false,
  danceStyle = 'lofi',
  intent = 'patrol_section',
  danceMove = 'bass_squat',
  napping = false,
}) {
  const isHyper = danceStyle === 'hyper';
  const isRomantic = danceStyle === 'lofi';
  const isPanic = intent === 'witness_panic';
  const isAngry = intent === 'just_reassembled';
  const isSprint = intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge';
  const isChat = intent === 'chat';
  const isScanning =
    (intent === 'investigate_cursor' || intent === 'patrol_section' || inspecting) &&
    !isPanic &&
    !isAngry &&
    !isSprint &&
    !napping &&
    intent !== 'dance_off' &&
    intent !== 'showoff';

  const isDab = danceMove === 'dab' && !isPanic && !isAngry && !isSprint && !napping && !isScanning;
  const isRobot = danceMove === 'robot' && !isPanic && !isAngry && !isSprint && !napping && !isScanning;
  const animClass = resolveCharacterAnimClass(intent, danceMove, napping, DETECTIVE_MOVE_ANIMS);

  const armLPath = isPanic
    ? 'M38 43 L20 30 L27 20'
    : isAngry
    ? 'M38 43 L24 52 L36 62'
    : isDab
    ? 'M38 43 L24 28 L55 21'
    : isRobot
    ? 'M38 43 L20 43 L20 26'
    : danceMove === 'bass_squat' || danceMove === 'shuffle'
    ? 'M38 43 L22 25 L16 14'
    : 'M38 43 L24 52 L28 60';

  const armRPath = isPanic
    ? 'M54 43 L72 30 L65 20'
    : isAngry
    ? 'M54 43 L68 52 L54 62'
    : isDab
    ? 'M54 43 L74 28 L92 14'
    : isRobot
    ? 'M54 43 L72 43 L72 58'
    : isChat
    ? 'M54 43 L72 34 L82 22'
    : 'M54 43 L72 25 L78 14';

  return (
    <svg
      width="82"
      height="86"
      viewBox="0 0 105 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${animClass}`}
      style={{ background: 'transparent' }}
    >
      {isSprint && <SpeedTrailLines color="#38BDF8" />}

      {isRomantic && !isPanic && !napping && !isScanning && (
        <g className="animate-skel-note-1">
          <text x="74" y="14" fill="#EC4899" fontSize="14" fontWeight="bold">
            ♥
          </text>
        </g>
      )}
      {danceMove === 'bass_squat' && !isPanic && !napping && !isScanning && (
        <g className="animate-skel-note-2">
          <text x="14" y="18" fontSize="13">
            🔊
          </text>
        </g>
      )}

      {/* Skull & Cap (tilts into dab during DAB pose!) */}
      <g
        className={napping || isDab ? '' : 'animate-skel-head'}
        transform={isDab ? 'rotate(-16 47 24)' : undefined}
      >
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
        <path
          d="M28 17 C28 6, 66 6, 66 17 Z"
          fill={isRobot ? '#38BDF8' : isHyper ? '#18181b' : isRomantic ? '#EC4899' : '#3B82F6'}
          stroke="#18181b"
          strokeWidth="2"
        />
        <path d="M22 17 L72 17" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="47" cy="7" r="2.2" fill="#FACC15" stroke="#18181b" strokeWidth="1.5" />

        <SkeletonFace
          cxL={41}
          cxR={54}
          cy={24}
          mouthY={31}
          intent={intent}
          napping={napping}
          danceStyle={danceStyle}
          danceMove={danceMove}
          shadesColor="#FACC15"
        />
      </g>

      {/* Torso */}
      <line x1="46" y1="37" x2="45" y2="65" stroke="#18181b" strokeWidth="4.6" />
      <line x1="46" y1="37" x2="45" y2="65" stroke="#FAF8F4" strokeWidth="2" />
      {(danceMove === 'bass_squat' || danceMove === 'dab') && !napping && (
        <path d="M38 39 Q46 49 54 39" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      <rect x="36" y="44" width="19" height="4.4" rx="2.2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
      <rect x="37" y="51" width="16" height="4.2" rx="2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
      <ellipse cx="45" cy="64" rx="9" ry="3.8" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#3B82F6'} stroke="#18181b" strokeWidth="2" />

      {/* Left Arm */}
      <g className={!napping && (danceMove === 'bass_squat' || danceMove === 'shuffle') && !isPanic && !isAngry ? 'animate-skel-arm-l' : ''}>
        <path d={armLPath} stroke="#18181b" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={armLPath} stroke="#FAF8F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {isPanic && <circle cx="27" cy="20" r="3.6" fill="#38BDF8" stroke="#18181b" strokeWidth="1.8" />}
        {isAngry && <circle cx="36" cy="62" r="3.6" fill="#38BDF8" stroke="#18181b" strokeWidth="1.8" />}
        {isRobot && <circle cx="20" cy="25" r="3.8" fill="#38BDF8" stroke="#18181b" strokeWidth="1.8" />}
        {(danceMove === 'bass_squat' || danceMove === 'shuffle') && !isPanic && !isAngry && (
          <circle cx="15" cy="13" r="3.8" fill="#FACC15" stroke="#18181b" strokeWidth="1.8" />
        )}
      </g>

      {/* Right Arm: Magnifying Glass while scanning, Red Rose on rose_sway, or expressive dance/mind pose */}
      {isScanning ? (
        <g className="animate-skel-magnify">
          <path d="M54 43 L68 38 L74 30" stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M54 43 L68 38 L74 30" stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="74" y1="30" x2="79" y2="23" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="84" cy="18" r="7.5" fill="rgba(56, 189, 248, 0.32)" stroke="#18181b" strokeWidth="2.2" />
          <circle cx="82" cy="16" r="2" fill="#FAF8F4" opacity="0.85" />
        </g>
      ) : danceMove === 'rose_sway' && !isPanic && !isAngry && !isChat && !napping ? (
        <g className="animate-skel-magnify">
          <path d="M54 43 L68 38 L74 30" stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M54 43 L68 38 L74 30" stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M74 32 L82 18" stroke="#10B981" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="83" cy="16" r="6" fill="#F43F5E" stroke="#18181b" strokeWidth="1.8" />
          <path d="M81 14 Q83 18 86 15" stroke="#FAF8F4" strokeWidth="1.2" fill="none" />
        </g>
      ) : (
        <g className={!napping && (isChat || danceMove === 'bass_squat' || danceMove === 'shuffle') && !isPanic && !isAngry ? 'animate-skel-arm-r' : ''}>
          <path d={armRPath} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={armRPath} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <circle
            cx={isPanic ? 65 : isAngry ? 54 : isDab ? 92 : isRobot ? 72 : isChat ? 83 : 79}
            cy={isPanic ? 20 : isAngry ? 62 : isDab ? 14 : isRobot ? 58 : isChat ? 21 : 13}
            r="3.8"
            fill={isHyper ? '#FACC15' : '#38BDF8'}
            stroke="#18181b"
            strokeWidth="1.8"
          />
        </g>
      )}

      {/* Legs */}
      <g className={napping ? '' : 'animate-skel-leg-l'}>
        <path d="M39 66 L33 80 L37 92" stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M39 66 L33 80 L37 92" stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="31" y="90" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#3B82F6'} stroke="#18181b" strokeWidth="1.9" />
      </g>
      <g className={napping ? '' : 'animate-skel-leg-r'}>
        <path d="M48 66 L56 80 L52 92" stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 66 L56 80 L52 92" stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="48" y="90" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#3B82F6'} stroke="#18181b" strokeWidth="1.9" />
      </g>
    </svg>
  );
}

/**
 * CHARACTER C SVG: B-BOY RIBS (Headspin, One-Hand Freeze, Windmill, Wave, Heart Balloon & Mind Postures!)
 */
function BboySkeletonSVG({
  move = 'balloon',
  danceStyle = 'lofi',
  intent = 'showoff',
  danceMove = 'windmill',
  napping = false,
}) {
  const activeMove = danceMove || move;
  const isPanic = intent === 'witness_panic';
  const isAngry = intent === 'just_reassembled';
  const isSprint = intent === 'chase' || intent === 'flee' || intent === 'grudge_dodge';
  const isChat = intent === 'chat';
  const isSplit =
    (activeMove === 'headspin' || activeMove === 'windmill') &&
    !isPanic &&
    !isAngry &&
    !isChat &&
    !napping;
  const isFreeze = activeMove === 'freeze' && !isPanic && !isAngry && !isChat && !napping;
  const isBalloon = activeMove === 'balloon' && !isPanic && !isAngry && !isSprint && !napping;
  const isHyper = danceStyle === 'hyper' || activeMove === 'headspin';
  const isRomantic = danceStyle === 'lofi' && !isHyper;

  const animClass = resolveCharacterAnimClass(intent, activeMove, napping, BBOY_MOVE_ANIMS);

  const armLPath = isPanic
    ? 'M43 54 L26 42 L33 32'
    : isAngry
    ? 'M43 54 L30 64 L44 74'
    : isBalloon
    ? 'M43 54 L26 42 L22 32'
    : 'M43 54 L25 64 L18 74';

  const armRPath = isPanic
    ? 'M65 54 L82 42 L75 32'
    : isAngry
    ? 'M65 54 L78 64 L64 74'
    : 'M65 54 L82 44 L89 34';

  return (
    <svg
      width="86"
      height="98"
      viewBox="0 0 110 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`die-cut-skeleton select-none overflow-visible ${animClass}`}
      style={{ background: 'transparent' }}
    >
      {isSprint && <SpeedTrailLines color="#10B981" />}

      {isBalloon && (
        <g>
          <path d="M22 32 Q18 20 24 10" stroke="#18181b" strokeWidth="1.8" fill="none" />
          <ellipse cx="24" cy="2" rx="11" ry="13" fill="#EC4899" stroke="#18181b" strokeWidth="2.2" />
          <text x="19" y="6" fill="#FAF8F4" fontSize="11" fontWeight="bold">
            ♥
          </text>
          <polygon points="24,15 21,18 27,18" fill="#EC4899" stroke="#18181b" strokeWidth="1.5" />
          <g className="animate-skel-note-1">
            <text x="78" y="20" fill="#EC4899" fontSize="14" fontWeight="bold">
              ♥
            </text>
          </g>
        </g>
      )}

      {/* B-Boy Group (Tilts dramatically on one-hand handstand freeze!) */}
      <g transform={isFreeze ? 'rotate(-36 55 65)' : undefined}>
        <g className={napping ? '' : 'animate-skel-head'}>
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
          <path
            d="M37 31 C37 21, 71 21, 71 31 Z"
            fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'}
            stroke="#18181b"
            strokeWidth="2"
          />
          <SkeletonFace
            cxL={46}
            cxR={62}
            cy={35}
            mouthY={43}
            intent={intent}
            napping={napping}
            danceStyle={danceStyle}
            danceMove={activeMove}
            shadesColor={isHyper ? '#FACC15' : '#10B981'}
          />
        </g>

        {/* Left Arm */}
        <path d={armLPath} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={armLPath} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <circle
          cx={isPanic ? 33 : isAngry ? 44 : isBalloon ? 22 : 18}
          cy={isPanic ? 32 : isAngry ? 74 : isBalloon ? 32 : 74}
          r="3.8"
          fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'}
          stroke="#18181b"
          strokeWidth="1.9"
        />

        {/* Right Arm */}
        <g className={!napping && (isChat || activeMove === 'wave') && !isPanic && !isAngry ? 'animate-skel-arm-r' : ''}>
          <path d={armRPath} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={armRPath} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <circle
            cx={isPanic ? 75 : isAngry ? 64 : 90}
            cy={isPanic ? 32 : isAngry ? 74 : 33}
            r="3.8"
            fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'}
            stroke="#18181b"
            strokeWidth="1.9"
          />
        </g>

        {/* Ribcage */}
        <line x1="54" y1="49" x2="54" y2="78" stroke="#18181b" strokeWidth="4.6" />
        <line x1="54" y1="49" x2="54" y2="78" stroke="#FAF8F4" strokeWidth="2" />
        <rect x="44" y="56" width="20" height="4.4" rx="2.2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
        <rect x="46" y="63" width="16" height="4.2" rx="2" fill="#FAF8F4" stroke="#18181b" strokeWidth="1.9" />
        <ellipse cx="54" cy="76" rx="9.5" ry="3.8" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'} stroke="#18181b" strokeWidth="2" />

        {/* Breakdance Legs (Wide V-split on headspin/windmill vs bouncy/floating otherwise) */}
        <g className={napping ? '' : 'animate-skel-leg-l'}>
          <path d={isSplit ? 'M48 78 L28 96 L22 106' : 'M48 78 L42 94 L45 106'} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={isSplit ? 'M48 78 L28 96 L22 106' : 'M48 78 L42 94 L45 106'} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={isSplit ? 15 : 38} y="104" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'} stroke="#18181b" strokeWidth="1.9" />
        </g>
        <g className={napping ? '' : 'animate-skel-leg-r'}>
          <path d={isSplit ? 'M60 78 L80 96 L86 106' : 'M60 78 L66 94 L63 106'} stroke="#18181b" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={isSplit ? 'M60 78 L80 96 L86 106' : 'M60 78 L66 94 L63 106'} stroke="#FAF8F4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <rect x={isSplit ? 82 : 59} y="104" width="11" height="5" rx="2.5" fill={isHyper ? '#FACC15' : isRomantic ? '#EC4899' : '#10B981'} stroke="#18181b" strokeWidth="1.9" />
        </g>
      </g>
    </svg>
  );
}

function extractCrewVisuals(crew) {
  return {
    skater: {
      facing: crew.skater.facing,
      trick: crew.skater.trick,
      intent: crew.skater.intent,
      danceMove: crew.skater.danceMove,
      hiding: crew.skater.hiding,
      napping: crew.skater.napping,
      phrase: crew.skater.phrase,
    },
    detective: {
      facing: crew.detective.facing,
      inspecting: crew.detective.inspecting,
      intent: crew.detective.intent,
      danceMove: crew.detective.danceMove,
      hiding: crew.detective.hiding,
      napping: crew.detective.napping,
      phrase: crew.detective.phrase,
    },
    bboy: {
      facing: crew.bboy.facing,
      move: crew.bboy.move,
      intent: crew.bboy.intent,
      danceMove: crew.bboy.danceMove,
      hiding: crew.bboy.hiding,
      napping: crew.bboy.napping,
      phrase: crew.bboy.phrase,
    },
  };
}

function crewVisualsChanged(prev, next) {
  const keys = ['skater', 'detective', 'bboy'];
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const a = prev[k];
    const b = next[k];
    if (
      a.facing !== b.facing ||
      a.intent !== b.intent ||
      a.danceMove !== b.danceMove ||
      a.hiding !== b.hiding ||
      a.napping !== b.napping ||
      a.phrase !== b.phrase ||
      a.trick !== b.trick ||
      a.inspecting !== b.inspecting ||
      a.move !== b.move
    ) {
      return true;
    }
  }
  return false;
}

/**
 * INDEPENDENT AUTONOMOUS BACKGROUND SKELETON CREW (z-0, behind content cards)
 * Driven by continuous 60fps 2D steering physics, internal moods, energy/naps,
 * buddy conversations, games of tag, portfolio section reading, and pop panic.
 */
export function BackgroundSkeletonStickers({
  danceStyle = 'lofi',
  isPlaying = true,
  songTitle = '',
}) {
  const initialW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const initialH = typeof window !== 'undefined' ? window.innerHeight : 800;

  const crewRef = useRef(null);
  if (!crewRef.current) {
    crewRef.current = createInitialCrewState(initialW, initialH, danceStyle);
  }

  const worldRef = useRef({
    vw: initialW,
    vh: initialH,
    mouseX: initialW * 0.5,
    mouseY: initialH * 0.5,
    cursorSpeed: 0,
    lastMouseMoveAt: typeof performance !== 'undefined' ? performance.now() : 0,
    section: 'hero',
    danceStyle,
    isPlaying,
    userIdleMs: 0,
  });

  const skaterPosRef = useRef(null);
  const detectivePosRef = useRef(null);
  const bboyPosRef = useRef(null);

  const initialVisuals = extractCrewVisuals(crewRef.current);
  const visualsRef = useRef(initialVisuals);
  const [visuals, setVisuals] = useState(initialVisuals);

  const applyPositionsToDom = () => {
    const crew = crewRef.current;
    const entries = [
      [skaterPosRef.current, crew.skater, 0.85],
      [detectivePosRef.current, crew.detective, 0.82],
      [bboyPosRef.current, crew.bboy, 0.85],
    ];
    for (let i = 0; i < entries.length; i++) {
      const [el, agent, hideScale] = entries[i];
      if (!el) continue;
      const scale = agent.hiding ? hideScale : 1;
      el.style.transform = `translate3d(${agent.x.toFixed(1)}px, ${agent.y.toFixed(
        1
      )}px, 0) translate(-50%, -50%) scale(${scale})`;
    }
  };

  // Set exact starting screen transforms before first browser paint
  useLayoutEffect(() => {
    applyPositionsToDom();
  }, []);

  // Sync song / play-pause changes into the autonomous brain
  useEffect(() => {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    worldRef.current.danceStyle = danceStyle;
    worldRef.current.isPlaying = isPlaying;
    syncCrewMusicVibe(crewRef.current, danceStyle, isPlaying, now);
  }, [danceStyle, isPlaying, songTitle]);

  // Listen to page interactions (mouse movement, clicks, scroll, resize, foreground pops)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastMouseSampleTime = performance.now();

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dtSec = Math.max(0.016, (now - lastMouseSampleTime) / 1000);
      lastMouseSampleTime = now;

      const world = worldRef.current;
      const dist = Math.hypot(e.clientX - world.mouseX, e.clientY - world.mouseY);
      world.cursorSpeed = Math.min(2600, dist / dtSec);
      world.mouseX = e.clientX;
      world.mouseY = e.clientY;
      world.lastMouseMoveAt = now;
    };

    const handlePointerDown = (e) => {
      const now = performance.now();
      worldRef.current.mouseX = e.clientX;
      worldRef.current.mouseY = e.clientY;
      worldRef.current.lastMouseMoveAt = now;
      notifyUserClick(crewRef.current, e.clientX, e.clientY, now);
    };

    const handleScroll = () => {
      const now = performance.now();
      const curY = window.scrollY;
      const deltaY = Math.abs(curY - lastScrollY);
      lastScrollY = curY;

      worldRef.current.section = detectVisibleSection();
      if (deltaY > 45) {
        notifyFastScroll(crewRef.current, worldRef.current.danceStyle, now);
      }
    };

    const handleResize = () => {
      worldRef.current.vw = window.innerWidth;
      worldRef.current.vh = window.innerHeight;
    };

    const handleGlobalPop = (e) => {
      const id = e.detail?.id;
      if (!id || id === 'skater' || id === 'detective' || id === 'bboy') return;
      notifyBuddyPopped(
        crewRef.current,
        id,
        e.detail?.x ?? worldRef.current.vw * 0.5,
        e.detail?.y ?? worldRef.current.vh * 0.5,
        performance.now()
      );
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('skeleton-popped', handleGlobalPop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('skeleton-popped', handleGlobalPop);
    };
  }, []);

  // Single continuous 60fps autonomous steering loop (direct DOM transforms, state only on phrase/pose changes)
  useEffect(() => {
    let rafId = null;
    let lastTime = performance.now();
    let lastSectionCheck = 0;

    const frame = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const world = worldRef.current;
      world.cursorSpeed *= Math.max(0, 1 - dt * 6);
      world.userIdleMs = now - world.lastMouseMoveAt;

      if (now - lastSectionCheck > 700) {
        lastSectionCheck = now;
        world.section = detectVisibleSection();
      }

      stepCrewPhysics(crewRef.current, world, dt, now);
      applyPositionsToDom();

      const nextVisuals = extractCrewVisuals(crewRef.current);
      if (crewVisualsChanged(visualsRef.current, nextVisuals)) {
        visualsRef.current = nextVisuals;
        setVisuals(nextVisuals);
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleAgentInflating = (id, inflating) => {
    const agent = crewRef.current[id];
    if (!agent) return;
    const now = performance.now();
    if (inflating) {
      agent.intent = 'inflating';
      agent.vx = 0;
      agent.vy = 0;
      agent.napping = false;
      agent.pendingReply = null;
    } else if (agent.intent === 'inflating') {
      agent.intent = 'roam';
      agent.intentUntil = now + 1800;
    }
  };

  const handleAgentPopped = (id, popped) => {
    const agent = crewRef.current[id];
    if (!agent) return;
    const now = performance.now();
    if (popped) {
      notifyBuddyPopped(crewRef.current, id, agent.x, agent.y, now);
    } else {
      notifyBuddyReassembled(crewRef.current, id, worldRef.current, now);
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      {/* 1. OLLIE THE SKATEBOARDER KID */}
      <div
        ref={skaterPosRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          willChange: 'transform',
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <BalloonPopWrapper
          skeletonId="skater"
          accent="#FACC15"
          disabled={visuals.skater.hiding}
          onInflatingChange={(inf) => handleAgentInflating('skater', inf)}
          onPoppedChange={(pop) => handleAgentPopped('skater', pop)}
        >
          {({ inflatePhrase }) => (
            <div className="relative flex flex-col items-center">
              <span
                className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-yellow-300 -mb-1 whitespace-nowrap select-none"
                style={{
                  opacity: visuals.skater.hiding ? 0 : 0.95,
                  textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
                }}
              >
                {inflatePhrase || visuals.skater.phrase}
              </span>
              {visuals.skater.napping && !inflatePhrase && (
                <span className="font-mono text-[10px] font-black text-amber-600 dark:text-yellow-300 animate-pulse -mb-1">
                  Zzz
                </span>
              )}
              <div
                style={{
                  transform: `scaleX(${visuals.skater.facing})`,
                  transition: 'transform 0.25s ease',
                }}
              >
                <div className={visuals.skater.napping ? 'animate-skel-nap' : ''}>
                  <SkaterSkeletonSVG
                    trick={visuals.skater.trick}
                    danceStyle={danceStyle}
                    intent={visuals.skater.intent}
                    danceMove={visuals.skater.danceMove}
                    napping={visuals.skater.napping}
                  />
                </div>
              </div>
            </div>
          )}
        </BalloonPopWrapper>
      </div>

      {/* 2. SHERLOCK BONES (NOSY SECTION INSPECTOR & CURSOR CURIOUS) */}
      <div
        ref={detectivePosRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          willChange: 'transform',
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <BalloonPopWrapper
          skeletonId="detective"
          accent="#38BDF8"
          disabled={visuals.detective.hiding}
          onInflatingChange={(inf) => handleAgentInflating('detective', inf)}
          onPoppedChange={(pop) => handleAgentPopped('detective', pop)}
        >
          {({ inflatePhrase }) => (
            <div className="relative flex flex-col items-center">
              <span
                className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-sky-300 -mb-1 whitespace-nowrap select-none"
                style={{
                  opacity: visuals.detective.hiding ? 0 : 0.95,
                  textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
                }}
              >
                {inflatePhrase || visuals.detective.phrase}
              </span>
              {visuals.detective.napping && !inflatePhrase && (
                <span className="font-mono text-[10px] font-black text-sky-600 dark:text-sky-300 animate-pulse -mb-1">
                  Zzz
                </span>
              )}
              <div
                style={{
                  transform: `scaleX(${visuals.detective.facing})`,
                  transition: 'transform 0.25s ease',
                }}
              >
                <div className={visuals.detective.napping ? 'animate-skel-nap' : ''}>
                  <DetectiveSkeletonSVG
                    inspecting={visuals.detective.inspecting}
                    danceStyle={danceStyle}
                    intent={visuals.detective.intent}
                    danceMove={visuals.detective.danceMove}
                    napping={visuals.detective.napping}
                  />
                </div>
              </div>
            </div>
          )}
        </BalloonPopWrapper>
      </div>

      {/* 3. B-BOY RIBS (SOCIAL HYPE & NAP BUDDY) */}
      <div
        ref={bboyPosRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          willChange: 'transform',
          background: 'transparent',
        }}
        className="flex flex-col items-center"
      >
        <BalloonPopWrapper
          skeletonId="bboy"
          accent="#10B981"
          disabled={visuals.bboy.hiding}
          onInflatingChange={(inf) => handleAgentInflating('bboy', inf)}
          onPoppedChange={(pop) => handleAgentPopped('bboy', pop)}
        >
          {({ inflatePhrase }) => (
            <div className="relative flex flex-col items-center">
              <span
                className="font-handwritten text-xs sm:text-sm font-bold text-zinc-800 dark:text-emerald-300 -mb-1 whitespace-nowrap select-none"
                style={{
                  opacity: visuals.bboy.hiding ? 0 : 0.95,
                  textShadow: '1.5px 1.5px 0px #FAF8F4, -1.5px -1.5px 0px #FAF8F4',
                }}
              >
                {inflatePhrase || visuals.bboy.phrase}
              </span>
              {visuals.bboy.napping && !inflatePhrase && (
                <span className="font-mono text-[10px] font-black text-emerald-600 dark:text-emerald-300 animate-pulse -mb-1">
                  Zzz
                </span>
              )}
              <div
                style={{
                  transform: `scaleX(${visuals.bboy.facing})`,
                  transition: 'transform 0.25s ease',
                }}
              >
                <div className={visuals.bboy.napping ? 'animate-skel-nap' : ''}>
                  <BboySkeletonSVG
                    move={visuals.bboy.move}
                    danceStyle={danceStyle}
                    intent={visuals.bboy.intent}
                    danceMove={visuals.bboy.danceMove}
                    napping={visuals.bboy.napping}
                  />
                </div>
              </div>
            </div>
          )}
        </BalloonPopWrapper>
      </div>
    </div>
  );
}
