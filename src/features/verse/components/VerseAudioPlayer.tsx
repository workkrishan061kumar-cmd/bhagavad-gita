'use client';

import { useEffect, useRef, useState } from 'react';
import { Mandala } from '@/shared/components/brand/Mandala';
import { cn } from '@/shared/lib/cn';

type Props = {
  audioUrl: string;
  reciter?: string;
  seed?: number;
  className?: string;
};

const PLAYBACK_RATES = [1, 1.25, 1.5, 0.75] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VerseAudioPlayer({ audioUrl, reciter, seed, className }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [rate, setRate] = useState<number>(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };
    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setHasError(true);
      setIsReady(false);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setHasError(true);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const next = Math.max(0, Math.min(duration, ratio * duration));
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const cycleSpeed = () => {
    const idx = PLAYBACK_RATES.indexOf(rate as (typeof PLAYBACK_RATES)[number]);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length] ?? 1;
    const audio = audioRef.current;
    if (audio) audio.playbackRate = next;
    setRate(next);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (hasError) {
    return (
      <div
        className={cn(
          'p-4 rounded-xl bg-bg-surface/40 border border-gold-500/10 text-text-muted/70 text-sm text-center',
          className,
        )}
      >
        Audio currently unavailable
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-2xl bg-bg-surface/70 border border-gold-500/20 backdrop-blur-sm',
        className,
      )}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata">
        <track kind="captions" />
      </audio>

      <div className="flex items-center gap-4">
        {/* Spinning mandala (decoration) */}
        {seed !== undefined && (
          <div
            className={cn(
              'shrink-0 transition-opacity',
              isPlaying ? 'animate-spin-slow opacity-100' : 'opacity-60',
            )}
            aria-hidden="true"
          >
            <Mandala seed={seed} size={36} className="text-gold-500" />
          </div>
        )}

        {/* Play/pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
          aria-pressed={isPlaying}
          disabled={!isReady}
          className="w-11 h-11 shrink-0 rounded-full bg-gold-500 text-bg-base flex items-center justify-center text-base hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {!isReady ? (
            <span className="text-xs">…</span>
          ) : isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="3.5" height="12" rx="0.5" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="0.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 1.5v11l9-5.5z" />
            </svg>
          )}
        </button>

        {/* Progress + info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5 gap-2">
            <span className="font-mono shrink-0">{formatTime(currentTime)}</span>
            {reciter && <span className="truncate text-center flex-1">{reciter}</span>}
            <span className="font-mono shrink-0">{formatTime(duration)}</span>
          </div>
          <button
            type="button"
            onClick={handleSeek}
            aria-label="Seek"
            className="block w-full h-1.5 rounded-full bg-bg-elevated cursor-pointer relative overflow-hidden hover:bg-bg-elevated/80 transition-colors"
          >
            <span
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 to-saffron-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </button>
        </div>

        {/* Speed */}
        <button
          type="button"
          onClick={cycleSpeed}
          aria-label={`Playback speed: ${rate}x`}
          className="shrink-0 px-2.5 py-1 rounded-full text-xs text-gold-500 hover:bg-gold-500/10 transition-colors font-mono min-w-[40px]"
        >
          {rate}×
        </button>
      </div>
    </div>
  );
}
