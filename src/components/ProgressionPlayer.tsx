'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { audioEngine } from '@/lib/audioEngine';
import { getChordDiagram } from '@/lib/chordDiagrams';

interface ProgressionPlayerProps {
  progression: { numeral: string; chord: string; notes: string[] }[];
  bpm: number;
  beatsPerChord: number;
}

export default function ProgressionPlayer({
  progression,
  bpm,
  beatsPerChord,
}: ProgressionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);
  const currentChordRef = useRef<number>(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playChord = useCallback((chordName: string, notes: string[]) => {
    audioEngine.resume();
    const diagram = getChordDiagram(chordName);
    if (diagram) {
      audioEngine.playChordFromFrets(diagram.frets);
    } else {
      audioEngine.playChord(notes);
    }
  }, []);

  const playClick = useCallback((isAccent: boolean) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = isAccent ? 1500 : 1000;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
  }, [getAudioContext]);

  const scheduleBeat = useCallback(() => {
    const ctx = getAudioContext();
    const secondsPerBeat = 60.0 / bpm;

    while (nextBeatTimeRef.current < ctx.currentTime + 0.1) {
      const isFirstBeatOfChord = currentBeatRef.current === 0;

      // Play metronome click
      playClick(isFirstBeatOfChord);

      // Play chord on first beat of each chord change
      if (isFirstBeatOfChord && progression.length > 0) {
        const chord = progression[currentChordRef.current];
        playChord(chord.chord, chord.notes);
      }

      setCurrentBeat(currentBeatRef.current);
      setCurrentChordIndex(currentChordRef.current);

      // Advance beat counter
      currentBeatRef.current++;

      // Check if we need to move to next chord
      if (currentBeatRef.current >= beatsPerChord) {
        currentBeatRef.current = 0;
        currentChordRef.current = (currentChordRef.current + 1) % progression.length;
      }

      nextBeatTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerChord, progression, getAudioContext, playClick, playChord]);

  const start = useCallback(async () => {
    await audioEngine.resume();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    nextBeatTimeRef.current = ctx.currentTime;
    currentBeatRef.current = 0;
    currentChordRef.current = 0;

    intervalRef.current = setInterval(scheduleBeat, 25);
    setIsPlaying(true);
  }, [getAudioContext, scheduleBeat]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
    setCurrentChordIndex(0);
    currentBeatRef.current = 0;
    currentChordRef.current = 0;
  }, []);

  const toggle = () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Restart when BPM or progression changes while playing
  useEffect(() => {
    if (isPlaying) {
      stop();
      start();
    }
  }, [bpm, beatsPerChord, progression]);

  if (progression.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h4 className="text-white font-semibold text-sm sm:text-base">Progression Player</h4>
          <p className="text-[10px] sm:text-xs text-slate-400">
            {bpm} BPM | {beatsPerChord} beats per chord
          </p>
        </div>
        <button
          onClick={toggle}
          className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all w-full sm:w-auto justify-center ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
          }`}
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play
            </>
          )}
        </button>
      </div>

      {/* Visual progression indicator */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {progression.map((chord, index) => (
          <div
            key={index}
            className={`flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ${
              isPlaying && currentChordIndex === index
                ? 'bg-green-500/40 ring-2 ring-green-400 scale-105'
                : 'bg-white/10'
            }`}
          >
            <div className="text-[10px] sm:text-xs text-slate-400">{chord.numeral}</div>
            <div className={`font-bold text-sm sm:text-base ${
              isPlaying && currentChordIndex === index ? 'text-green-300' : 'text-white'
            }`}>
              {chord.chord}
            </div>
            {isPlaying && currentChordIndex === index && (
              <div className="flex gap-0.5 sm:gap-1 mt-1">
                {Array.from({ length: beatsPerChord }).map((_, beatIndex) => (
                  <div
                    key={beatIndex}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                      currentBeat === beatIndex
                        ? 'bg-green-400 scale-125'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
