import React, { useState, useEffect, useRef, useCallback } from 'react';
import brabusMp3 from '../music/Brabus.mp3';
import thinkingOfYouMp3 from '../music/Thinking_Of_You.mp3';

// Automatically index all audio files inside `src/music/` so string paths like '../music/Song.mp3' also work in Vite!
const SRC_MUSIC_MODULES = import.meta.glob('../music/*.{mp3,MP3,wav,ogg,m4a}', {
  eager: true,
  import: 'default',
});

function resolveMusicSrc(rawSrc) {
  if (!rawSrc) return '';
  if (SRC_MUSIC_MODULES[rawSrc]) return SRC_MUSIC_MODULES[rawSrc];
  const fileName = rawSrc.split('/').pop();
  const matchedKey = Object.keys(SRC_MUSIC_MODULES).find((k) => k.endsWith(`/${fileName}`));
  return matchedKey ? SRC_MUSIC_MODULES[matchedKey] : rawSrc;
}

function formatTime(sec) {
  if (!sec || !Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * ============================================================================
 * 🎵 YOUR SONG PLAYLIST — ADD OR EDIT YOUR SONGS HERE!
 * ============================================================================
 * How to add your own MP3 files in `src/music/`:
 * 1. Put your .mp3 files inside `src/music/` (e.g. `src/music/Brabus.mp3`).
 * 2. Either import the file at the top OR set `src: '../music/YourFile.mp3'`.
 * 3. Choose a `danceStyle` for each song so all the skeletons change their dance moves:
 *    - 'hyper' -> Heavy Bass Bounce, Skateboard Kickflips, Upside-Down Headspin & Pull-Ups
 *    - 'lofi'  -> Smooth Romantic Sway, Floating Pink Hearts, Red Rose & Heart Balloon
 *    - 'disco' -> 360° Spin Jumps, B-Boy Freeze & One-Hand Wave
 *    - 'party' -> Full Synchronized Bhangra / Skeleton Bounce Party!
 */
export const SONGS_PLAYLIST = [
  {
    id: 'song-1',
    title: 'Brabus',
    artist: 'Track 01 • Heavy Bass Mode',
    src: brabusMp3, // Full track from src/music/Brabus.mp3 (3:17)
    danceStyle: 'hyper',
    danceBadge: '🔥 Bass Bounce, Kickflips & Headspin',
    accent: '#155afaff',
    bpm: 145,
  },
  {
    id: 'song-2',
    title: 'Thinking of You - AP Dhillon',
    artist: 'Track 02 • Smooth Romantic Vibe',
    src: thinkingOfYouMp3, // Full track from src/music/Thinking_Of_You.mp3 (3:00)
    danceStyle: 'lofi',
    danceBadge: '💖 Romantic Sway & Floating Hearts',
    accent: '#EC4899',
    bpm: 92,
  },
];

const DANCE_STYLES_CYCLE = ['hyper', 'lofi', 'disco', 'party'];

export default function MusicPlayerWidget({
  songs = SONGS_PLAYLIST,
  currentSongIndex,
  onSelectSong,
  isPlaying,
  onTogglePlay,
  onAddCustomSongs,
}) {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [waitingForFirstInteraction, setWaitingForFirstInteraction] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const isActuallyPlayingRef = useRef(false);
  const prevSrcRef = useRef(null);
  const lastUnlockTimeRef = useRef(0);
  const lastScrollTryRef = useRef(0);

  const currentSong = songs[currentSongIndex] || songs[0];
  const resolvedSrc = resolveMusicSrc(currentSong?.src);
  const activeDanceStyle =
    currentSong?.danceStyle ||
    DANCE_STYLES_CYCLE[currentSongIndex % DANCE_STYLES_CYCLE.length];

  // Safely start playing the current full MP3
  // IMPORTANT: Do NOT put native `autoPlay` on <audio>, because native `autoPlay` sets
  // `audio.paused = false` before checking permissions and causes JS `if (!audio.paused)` to exit early!
  const safePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlayingRef.current) return;

    // Only skip if we have confirmed real playback is actively running
    if (isActuallyPlayingRef.current && !audio.paused) {
      return;
    }

    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isActuallyPlayingRef.current = true;
          setIsAudioPlaying(true);
          setWaitingForFirstInteraction(false);
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          isActuallyPlayingRef.current = false;
          setIsAudioPlaying(false);
          setWaitingForFirstInteraction(true);
        });
    }
  }, [isMuted, volume]);

  // 1. On initial mount AND when switching songs
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isTrackChange =
      prevSrcRef.current !== null && prevSrcRef.current !== resolvedSrc;
    prevSrcRef.current = resolvedSrc;

    if (isTrackChange) {
      isActuallyPlayingRef.current = false;
      setIsAudioPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      audio.currentTime = 0;
      audio.load();
    }

    if (isPlayingRef.current) {
      safePlay();
    }
  }, [currentSongIndex, resolvedSrc, safePlay]);

  // 2. When Play / Pause is toggled, play or pause WITHOUT resetting the song position
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      safePlay();
    } else {
      isActuallyPlayingRef.current = false;
      audio.pause();
      setIsAudioPlaying(false);
    }
  }, [isPlaying, safePlay]);

  // 3. Live volume / mute updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // 4. Always-ready autoplay unlock whenever `isPlaying` is true but audio hasn't started yet
  useEffect(() => {
    if (!isPlaying || isAudioPlaying) return;

    const unlockAudio = (e) => {
      const audio = audioRef.current;
      if (!audio || !isPlayingRef.current) return;
      if (isActuallyPlayingRef.current && !audio.paused) return;

      // Throttle non-click scroll/wheel tries so they never spam
      if (e && (e.type === 'wheel' || e.type === 'scroll')) {
        const now = Date.now();
        if (now - lastScrollTryRef.current < 350) return;
        lastScrollTryRef.current = now;
      }

      audio.muted = isMuted;
      audio.volume = isMuted ? 0 : volume;

      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          isActuallyPlayingRef.current = true;
          lastUnlockTimeRef.current = Date.now();
          setIsAudioPlaying(true);
          setWaitingForFirstInteraction(false);
          onTogglePlay(true);
        }).catch(() => { });
      }
    };

    const events = [
      'pointerdown',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'keydown',
      'keyup',
      'click',
      'wheel',
      'scroll',
    ];
    events.forEach((evt) =>
      window.addEventListener(evt, unlockAudio, { capture: true, passive: true })
    );

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, unlockAudio, { capture: true })
      );
    };
  }, [isPlaying, isAudioPlaying, volume, isMuted, onTogglePlay]);

  // Advance to the next song automatically when the full song finishes!
  const handleNext = useCallback(() => {
    if (!songs.length) return;
    const nextIdx = (currentSongIndex + 1) % songs.length;
    if (nextIdx === currentSongIndex && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
      return;
    }
    onSelectSong(nextIdx);
    onTogglePlay(true);
  }, [currentSongIndex, songs.length, onSelectSong, onTogglePlay]);

  const handlePrev = () => {
    if (!songs.length) return;
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    onSelectSong(prevIdx);
    onTogglePlay(true);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleLocalFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !onAddCustomSongs) return;

    const badges = {
      hyper: '🔥 Bass Bounce, Kickflips & Headspin',
      lofi: '💖 Romantic Sway & Floating Hearts',
      disco: '🕺 360° Spin & Freeze',
      party: '💀 Full Skeleton Party',
    };
    const accents = ['#FACC15', '#EC4899', '#10B981', '#3B82F6'];

    const newTracks = files.map((file, i) => {
      const idx = songs.length + i;
      const style = DANCE_STYLES_CYCLE[idx % DANCE_STYLES_CYCLE.length];
      return {
        id: `custom-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Custom MP3 Track',
        src: URL.createObjectURL(file),
        danceStyle: style,
        danceBadge: badges[style],
        accent: accents[idx % accents.length],
      };
    });

    onAddCustomSongs(newTracks);
    e.target.value = '';
  };

  const handlePlayPauseClick = () => {
    // If the pointerdown/mousedown of this exact click just unlocked autoplay, keep it playing!
    if (Date.now() - lastUnlockTimeRef.current < 450) {
      onTogglePlay(true);
      return;
    }

    const audio = audioRef.current;

    if (!isPlaying || !isAudioPlaying || (audio && audio.paused)) {
      setWaitingForFirstInteraction(false);
      onTogglePlay(true);
      if (audio) {
        audio.muted = isMuted;
        audio.volume = isMuted ? 0 : volume;
        audio
          .play()
          .then(() => {
            isActuallyPlayingRef.current = true;
            setIsAudioPlaying(true);
            setWaitingForFirstInteraction(false);
          })
          .catch(() => { });
      }
    } else {
      onTogglePlay(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print flex flex-col items-end">
      {/* HTML5 Audio Element playing the full MP3 file & auto-advancing onEnded */}
      <audio
        ref={audioRef}
        src={resolvedSrc}
        preload="auto"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          safePlay();
        }}
        onLoadedData={safePlay}
        onCanPlay={safePlay}
        onPlaying={() => {
          isActuallyPlayingRef.current = true;
          setIsAudioPlaying(true);
          setWaitingForFirstInteraction(false);
        }}
        onPause={() => {
          isActuallyPlayingRef.current = false;
          setIsAudioPlaying(false);
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime || 0;
          setCurrentTime(t);
          if (!e.currentTarget.paused && t > 0) {
            isActuallyPlayingRef.current = true;
            setIsAudioPlaying(true);
            setWaitingForFirstInteraction(false);
          }
        }}
        onEnded={handleNext}
      />

      {/* Sketchbook Autoplay Prompt Pill if Browser Blocked Unmuted Launch */}
      {isPlaying && !isAudioPlaying && waitingForFirstInteraction && !playlistOpen && (
        <button
          type="button"
          onClick={handlePlayPauseClick}
          className="mb-2.5 px-3 py-1.5 rounded-xl bg-yellow-300 text-zinc-900 border-2 border-zinc-900 shadow-[3px_3px_0px_#18181b] font-mono text-[11px] font-extrabold flex items-center gap-1.5 animate-bounce cursor-pointer"
        >
          <span>🔊</span>
          <span>Tap anywhere to play {currentSong?.title} ♪</span>
        </button>
      )}

      {/* Hidden File Input so user can also pick MP3s directly from the browser */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleLocalFileUpload}
        className="hidden"
      />

      {/* EXPANDABLE PLAYLIST DRAWER */}
      {playlistOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-[#FAF8F4] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-200 shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#000] p-3.5 text-zinc-900 dark:text-zinc-100 transition-all">
          <div className="flex items-center justify-between border-b border-zinc-300 dark:border-zinc-700 pb-2 mb-2.5">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase text-pink-600 dark:text-pink-400">
                ● SKELETON JUKEBOX PLAYLIST
              </div>
              <div className="font-bold text-xs">
                Plays full song → auto-plays next!
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPlaylistOpen(false)}
              className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold hover:bg-zinc-300 dark:hover:bg-zinc-700"
              aria-label="Close playlist"
            >
              ✕
            </button>
          </div>

          {/* Song List */}
          <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {songs.map((song, idx) => {
              const active = idx === currentSongIndex;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => {
                    onSelectSong(idx);
                    onTogglePlay(true);
                  }}
                  className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${active
                    ? 'bg-yellow-300 text-zinc-900 border-zinc-900 shadow-[2px_2px_0px_#18181b]'
                    : 'bg-white/80 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 hover:bg-amber-100/70 dark:hover:bg-zinc-800'
                    }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold">
                        {active && isPlaying ? '▶' : `${idx + 1}.`}
                      </span>
                      <span className="font-bold text-xs truncate">{song.title}</span>
                    </div>
                    <div
                      className={`font-mono text-[10px] mt-0.5 truncate ${active ? 'text-zinc-800 font-semibold' : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                    >
                      {song.danceBadge}
                    </div>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-zinc-900 shrink-0"
                    style={{ backgroundColor: song.accent }}
                  />
                </button>
              );
            })}
          </div>

          {/* Volume + Add Local MP3 Footer */}
          <div className="mt-3 pt-2.5 border-t border-zinc-300 dark:border-zinc-700 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                className="text-xs font-mono px-1.5 py-0.5 rounded border border-zinc-400 dark:border-zinc-600"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setIsMuted(false);
                  setVolume(parseFloat(e.target.value));
                }}
                className="w-20 accent-pink-500 cursor-pointer"
                aria-label="Music volume"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 dark:bg-yellow-300 text-white dark:text-zinc-900 font-mono text-[10px] font-bold hover:opacity-90"
              title="Load MP3 files from your computer"
            >
              + Load MP3
            </button>
          </div>
        </div>
      )}

      {/* COMPACT BOTTOM-RIGHT BOOMBOX / JUKEBOX BAR WITH FULL SONG PROGRESS */}
      <div className="relative flex flex-col gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#FAF8F4] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-200 shadow-[5px_5px_0px_#18181b] dark:shadow-[5px_5px_0px_#000] text-zinc-900 dark:text-zinc-100">
        {/* Masking Tape Accent */}
        <div className="masking-tape -top-2.5 left-6 -rotate-2 pointer-events-none" />

        <div className="flex items-center gap-2.5">
          {/* Spinning Vinyl / Equalizer Disc */}
          <button
            type="button"
            onClick={handlePlayPauseClick}
            aria-label={isPlaying && isAudioPlaying ? 'Pause music' : 'Play music'}
            className={`w-10 h-10 rounded-full border-2 border-zinc-900 flex items-center justify-center shrink-0 transition-transform ${isPlaying && isAudioPlaying ? 'animate-spin' : ''
              }`}
            style={{
              backgroundColor: currentSong?.accent || '#FACC15',
              animationDuration: activeDanceStyle === 'hyper' ? '1.4s' : '3.2s',
            }}
            title={isPlaying && isAudioPlaying ? 'Pause Music' : 'Play Music'}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F4]" />
            </div>
          </button>

          {/* Track Title & Active Dance Move Mode */}
          <div className="min-w-0 max-w-[145px] sm:max-w-[175px]">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-yellow-300 text-zinc-900 border border-zinc-900">
                {isPlaying && isAudioPlaying
                  ? 'PLAYING ♪'
                  : isPlaying && waitingForFirstInteraction
                    ? 'AUTOPLAY ♪'
                    : 'PAUSED'}
              </span>
              {isPlaying && !isAudioPlaying && waitingForFirstInteraction && (
                <span className="font-mono text-[9px] text-pink-600 dark:text-pink-400 font-bold animate-pulse">
                  tap anywhere!
                </span>
              )}
            </div>
            <div className="font-bold text-xs truncate mt-0.5">{currentSong?.title}</div>
            <div className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 truncate">
              {currentSong?.danceBadge}
            </div>
          </div>

          {/* Transport Controls: Prev / Play-Pause / Next / Playlist */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-600 flex items-center justify-center text-xs font-bold hover:bg-amber-200 dark:hover:bg-zinc-700 transition-colors"
              title="Previous Song"
              aria-label="Previous song"
            >
              ⏮
            </button>

            <button
              type="button"
              onClick={handlePlayPauseClick}
              className="w-8 h-8 rounded-lg bg-yellow-300 text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] flex items-center justify-center text-xs font-extrabold hover:translate-y-0.5 transition-all"
              title={isPlaying && isAudioPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying && isAudioPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying && isAudioPlaying ? '⏸' : '▶'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-600 flex items-center justify-center text-xs font-bold hover:bg-amber-200 dark:hover:bg-zinc-700 transition-colors"
              title="Next Song"
              aria-label="Next song"
            >
              ⏭
            </button>

            <button
              type="button"
              onClick={() => setPlaylistOpen((o) => !o)}
              className={`px-2 h-7 rounded-lg border border-zinc-900 dark:border-zinc-600 font-mono text-[10px] font-bold flex items-center gap-1 transition-colors ${playlistOpen
                ? 'bg-pink-500 text-white'
                : 'bg-white dark:bg-zinc-800 hover:bg-amber-200 dark:hover:bg-zinc-700'
                }`}
              title="Open Song List"
            >
              <span>🎶</span>
              <span className="hidden sm:inline">{songs.length}</span>
            </button>
          </div>
        </div>

        {/* Full-Song Seek Bar & Time Counter (0:00 / 3:17) */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 w-7 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration > 0 ? duration : 100}
            step="0.5"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 accent-zinc-900 dark:accent-yellow-300 cursor-pointer"
            aria-label="Seek song position"
          />
          <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 w-7">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
