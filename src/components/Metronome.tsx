'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type ToneType = 'click' | 'beep' | 'wood' | 'cowbell';

interface ToneConfig {
  name: string;
  frequency: number;
  type: OscillatorType;
  duration: number;
  accentFrequency: number;
}

const TONE_CONFIGS: Record<ToneType, ToneConfig> = {
  click: {
    name: 'Click',
    frequency: 1000,
    type: 'square',
    duration: 0.02,
    accentFrequency: 1500,
  },
  beep: {
    name: 'Beep',
    frequency: 880,
    type: 'sine',
    duration: 0.05,
    accentFrequency: 1320,
  },
  wood: {
    name: 'Wood Block',
    frequency: 400,
    type: 'triangle',
    duration: 0.03,
    accentFrequency: 600,
  },
  cowbell: {
    name: 'Cowbell',
    frequency: 560,
    type: 'square',
    duration: 0.08,
    accentFrequency: 800,
  },
};

interface MetronomeProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

export default function Metronome({ bpm, onBpmChange }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [selectedTone, setSelectedTone] = useState<ToneType>('click');
  const [volume, setVolume] = useState(0.5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((isAccent: boolean) => {
    const ctx = getAudioContext();
    const config = TONE_CONFIGS[selectedTone];

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.value = isAccent ? config.accentFrequency : config.frequency;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  }, [getAudioContext, selectedTone, volume]);

  const scheduleBeat = useCallback(() => {
    const ctx = getAudioContext();
    const secondsPerBeat = 60.0 / bpm;

    while (nextBeatTimeRef.current < ctx.currentTime + 0.1) {
      const isAccent = currentBeatRef.current === 0;
      playTone(isAccent);

      setCurrentBeat(currentBeatRef.current);
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
      nextBeatTimeRef.current += secondsPerBeat;
    }
  }, [bpm, beatsPerMeasure, getAudioContext, playTone]);

  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    nextBeatTimeRef.current = ctx.currentTime;
    currentBeatRef.current = 0;

    intervalRef.current = setInterval(scheduleBeat, 25);
    setIsPlaying(true);
  }, [getAudioContext, scheduleBeat]);

  const stopMetronome = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
    currentBeatRef.current = 0;
  }, []);

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
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

  // Restart metronome when BPM or beats per measure changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, beatsPerMeasure]);

  const handleBpmChange = (newBpm: number) => {
    onBpmChange(Math.min(240, Math.max(40, newBpm)));
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Metronome</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left side - Controls */}
        <div className="space-y-3 sm:space-y-4">
          {/* BPM Control */}
          <div>
            <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
              Tempo: {bpm} BPM
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => handleBpmChange(bpm - 5)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                -5
              </button>
              <input
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => handleBpmChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <button
                onClick={() => handleBpmChange(bpm + 5)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                +5
              </button>
            </div>
            {/* Common tempos */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
              {[60, 80, 100, 120, 140].map((tempo) => (
                <button
                  key={tempo}
                  onClick={() => onBpmChange(tempo)}
                  className={`px-2 py-1 rounded text-[10px] sm:text-xs transition-colors ${
                    bpm === tempo
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {tempo}
                </button>
              ))}
            </div>
          </div>

          {/* Time Signature */}
          <div>
            <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
              Beats per measure
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[2, 3, 4, 6, 8].map((beats) => (
                <button
                  key={beats}
                  onClick={() => setBeatsPerMeasure(beats)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors text-sm sm:text-base ${
                    beatsPerMeasure === beats
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {beats}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
              Sound
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(Object.keys(TONE_CONFIGS) as ToneType[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    selectedTone === tone
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {TONE_CONFIGS[tone].name}
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>

        {/* Right side - Visual feedback */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-0">
          {/* Play/Pause Button */}
          <button
            onClick={toggleMetronome}
            className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl sm:text-4xl transition-all ${
              isPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
            }`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Beat Indicator */}
          <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-6">
            {Array.from({ length: beatsPerMeasure }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-100 ${
                  isPlaying && currentBeat === index
                    ? index === 0
                      ? 'bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50'
                      : 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Current beat display */}
          <div className="mt-3 sm:mt-4 text-slate-400 text-xs sm:text-sm">
            {isPlaying ? (
              <span>Beat {currentBeat + 1} of {beatsPerMeasure}</span>
            ) : (
              <span>Ready</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
