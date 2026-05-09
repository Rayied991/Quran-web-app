/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Loader2, Pause, Play, SkipForward, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../lib/settings-context';
import { SurahDetail } from '../types';

interface AyatViewProps {
  surah: SurahDetail;
}

interface AudioState {
  playing: boolean;
  currentVerse: number | null;
  loadingVerse: number | null;
}

export default function AyatView({ surah }: AyatViewProps) {
  const [audioUrlsReady, setAudioUrlsReady] = useState(false);
  const { settings } = useSettings();
  const [audioState, setAudioState] = useState<AudioState>({ playing: false, currentVerse: null, loadingVerse: null });
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});
  const [isSurahPlaying, setIsSurahPlaying] = useState(false);
  const [progress, setProgress] = useState<{ [key: number]: number }>({});
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs to expose latest state values inside stable callbacks
  const audioStateRef = useRef(audioState);
  const isSurahPlayingRef = useRef(isSurahPlaying);
  useEffect(() => { audioStateRef.current = audioState; }, [audioState]);
  useEffect(() => { isSurahPlayingRef.current = isSurahPlaying; }, [isSurahPlaying]);

  useEffect(() => {
  const fetchAudioUrls = async () => {
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.id}/ar.alafasy`  // ← ar.alafasy, not en.alafasy
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data?.ayahs) {
          const urls: { [key: number]: string } = {};
          data.data.ayahs.forEach((ayah: any) => {
            urls[ayah.numberInSurah] = ayah.audio;
          });
          setAudioUrls(urls);
          setAudioUrlsReady(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch audio URLs:', error);
    }
  };
  fetchAudioUrls();
}, [surah.id]);

  const startProgressTracking = (verseNum: number) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (audio && audio.duration) {
        setProgress((prev) => ({
          ...prev,
          [verseNum]: (audio.currentTime / audio.duration) * 100,
        }));
      }
    }, 200);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => () => stopProgressTracking(), []);

  const playVerse = useCallback(async (verseNum: number): Promise<void> => {
     if (verseNum < 1 || verseNum > surah.verses.length) return;

const audioUrl = audioUrls[verseNum];
if (!audioUrl) {
  console.warn(`Audio URL not ready for verse ${verseNum}`);
  return;
}

    setAudioState({ playing: false, currentVerse: verseNum, loadingVerse: verseNum });
    setProgress((prev) => ({ ...prev, [verseNum]: 0 }));

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioState({ playing: true, currentVerse: verseNum, loadingVerse: null });
            startProgressTracking(verseNum);
          })
          .catch((err) => {
            console.error('Playback failed:', err);
            setAudioState({ playing: false, currentVerse: null, loadingVerse: null });
            setIsSurahPlaying(false);
          });
      }
    }
 }, [audioUrls, surah.verses.length]);

  // Stable handlers that read current values via refs — no stale closure, no missing deps
  const handleAudioEnded = useCallback(() => {
    const currentVerse = audioStateRef.current.currentVerse;
    stopProgressTracking();
    if (currentVerse !== null) {
      setProgress((prev) => ({ ...prev, [currentVerse]: 100 }));
    }
    if (isSurahPlayingRef.current && currentVerse !== null) {
      const nextVerse = currentVerse + 1;
      if (nextVerse <= surah.verses.length) {
        playVerse(nextVerse);
      } else {
        setAudioState({ playing: false, currentVerse: null, loadingVerse: null });
        setIsSurahPlaying(false);
      }
    } else {
      setAudioState({ playing: false, currentVerse: null, loadingVerse: null });
    }
  }, [playVerse, surah.verses.length]);

  const handleAudioError = useCallback(() => {
    stopProgressTracking();
    setAudioState({ playing: false, currentVerse: null, loadingVerse: null });
    setIsSurahPlaying(false);
  }, []);

  // Now the dep array is complete: [handleAudioEnded, handleAudioError]
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);
      return () => {
        audio.removeEventListener('ended', handleAudioEnded);
        audio.removeEventListener('error', handleAudioError);
      };
    }
  }, [handleAudioEnded, handleAudioError]);

  useEffect(() => {
  if (audioState.currentVerse) {
    document.getElementById(`verse-${audioState.currentVerse}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, [audioState.currentVerse]);

  const playAyah = async (verseNum: number) => {
    if (verseNum < 1) return;
    if (audioState.currentVerse === verseNum && audioState.playing) {
      audioRef.current?.pause();
      stopProgressTracking();
      setAudioState({ playing: false, currentVerse: verseNum, loadingVerse: null });
      setIsSurahPlaying(false);
      return;
    }
    setIsSurahPlaying(false);
    await playVerse(verseNum);
  };

  const toggleSurahPlayback = async () => {
    if (isSurahPlaying) {
      audioRef.current?.pause();
      stopProgressTracking();
      setIsSurahPlaying(false);
      setAudioState({ playing: false, currentVerse: null, loadingVerse: null });
    } else {
      setIsSurahPlaying(true);
      const startVerse = audioState.currentVerse ?? 1;
      await playVerse(startVerse);
    }
  };

  const skipToNext = () => {
    if (audioState.currentVerse !== null) {
      const next = audioState.currentVerse + 1;
      if (next <= surah.verses.length) playVerse(next);
    }
  };

  const handleSeek = (verseNum: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (audioState.currentVerse !== verseNum || !audioRef.current?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
    setProgress((prev) => ({ ...prev, [verseNum]: pct * 100 }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <audio ref={audioRef}  />

      {/* Surah Header */}
      <div className="text-center p-8 bg-linear-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/30">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {surah.transliteration}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{surah.translation}</p>
        <div className="flex gap-2 justify-center flex-wrap mb-5">
          <span className={`inline-block text-sm px-3 py-1 rounded-full ${
            surah.type === 'meccan'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
          }`}>
            {surah.type === 'meccan' ? 'Makkah (Meccan)' : 'Madinah (Medinan)'}
          </span>
          <span className="inline-block text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {surah.verses.length} Verses
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleSurahPlayback}
            disabled={!audioUrlsReady}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm ${
              !audioUrlsReady
      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
      : isSurahPlaying
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {!audioUrlsReady ? <Loader2 className="w-4 h-4 animate-spin" /> : isSurahPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {!audioUrlsReady ? 'Loading audio…' : isSurahPlaying ? 'Stop Surah' : 'Play Full Surah'}
          </button>

          {isSurahPlaying && (
            <button
              onClick={skipToNext}
              disabled={audioState.currentVerse === surah.verses.length}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-all"
            >
              <SkipForward className="w-4 h-4" />
              Next
            </button>
          )}
        </div>

        {isSurahPlaying && audioState.currentVerse !== null && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Playing verse {audioState.currentVerse} of {surah.verses.length}
          </p>
        )}
      </div>

      {/* Verses */}
      <div className="space-y-4">
        {surah.verses.map((ayah) => {
          const isCurrentVerse = audioState.currentVerse === ayah.verse;
          const isPlaying = isCurrentVerse && audioState.playing;
          const isLoading = audioState.loadingVerse === ayah.verse;
          const verseProgress = progress[ayah.verse] ?? 0;

          return (
            <div
              key={ayah.verse}
              id={`verse-${ayah.verse}`}
              className={`p-6 bg-white dark:bg-gray-800 rounded-xl border transition-colors ${
                isCurrentVerse
                  ? 'border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-100 dark:shadow-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
               <div className="relative w-10 h-10 shrink-0">
  <img
    src="/images/ayah-marker.svg"
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full"
  />
  <span className="absolute inset-0 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
    {ayah.verse}
  </span>
</div>
                <button
                  onClick={() => playAyah(ayah.verse)}
                  disabled={isLoading}
                  aria-label={isPlaying ? `Pause verse ${ayah.verse}` : `Play verse ${ayah.verse}`}
                  className={`p-2 rounded-lg transition-all ${
                    isPlaying
                      ? 'bg-emerald-600 text-white'
                      : isLoading
                      ? 'bg-emerald-300 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600'
                  }`}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>

              {isCurrentVerse && (
                <div
  role="progressbar"
  aria-valuenow={Math.round(verseProgress)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Verse ${ayah.verse} playback progress`}
  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 cursor-pointer overflow-hidden"
  onClick={(e) => handleSeek(ayah.verse, e)}
>
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                    style={{ width: `${verseProgress}%` }}
                  />
                </div>
              )}

              <div
                className="text-right mb-4 leading-loose p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                style={{
                  fontSize: `${settings.arabicFontSize}px`,
                  fontFamily: `'${settings.arabicFont}', serif`,
                  lineHeight: '2',
                }}
              >
                {ayah.text}
              </div>

              {ayah.transliteration && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-400 dark:text-gray-600">Transliteration:</span> {ayah.transliteration}
                </p>
              )}

              <div className="border-l-4 border-emerald-500 pl-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Translation
                </p>
                <p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  style={{ fontSize: `${settings.translationFontSize}px` }}
                >
                  {ayah.translation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}