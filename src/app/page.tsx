'use client';

import { useState } from 'react';
import CircleOfFifths from '@/components/CircleOfFifths';
import ChordDisplay from '@/components/ChordDisplay';
import ProgressionDisplay from '@/components/ProgressionDisplay';
import ProgressionPlayer from '@/components/ProgressionPlayer';
import StrummingPattern from '@/components/StrummingPattern';
import Metronome from '@/components/Metronome';
import { PROGRESSION_PATTERNS, getProgression, ProgressionPattern } from '@/lib/musicTheory';

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [selectedPattern, setSelectedPattern] = useState<ProgressionPattern>(PROGRESSION_PATTERNS[0]);
  const [beatsPerChord, setBeatsPerChord] = useState(4);

  const handleKeySelect = (key: string, minor: boolean) => {
    setSelectedKey(key);
    setIsMinor(minor);
  };

  const progression = selectedKey
    ? getProgression(selectedKey, isMinor, selectedPattern)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Circle of Fifths Guitar Practice
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Select a key to see chord progressions and practice patterns
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Circle of Fifths */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            <CircleOfFifths
              selectedKey={selectedKey}
              onKeySelect={handleKeySelect}
            />
          </div>

          {/* Info Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            {selectedKey ? (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
                  Key of {selectedKey} {isMinor ? '' : 'Major'}
                </h2>
                <ChordDisplay selectedKey={selectedKey} isMinor={isMinor} />

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                  <ProgressionDisplay
                    selectedKey={selectedKey}
                    isMinor={isMinor}
                    selectedPattern={selectedPattern}
                    onPatternChange={setSelectedPattern}
                  />
                </div>

                {/* Progression Player */}
                <div className="mt-4 sm:mt-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-4">
                    <label className="text-xs sm:text-sm text-slate-400">Beats per chord:</label>
                    <div className="flex gap-2">
                      {[2, 4, 8].map((beats) => (
                        <button
                          key={beats}
                          onClick={() => setBeatsPerChord(beats)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            beatsPerChord === beats
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {beats}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ProgressionPlayer
                    progression={progression}
                    bpm={bpm}
                    beatsPerChord={beatsPerChord}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <p className="text-lg">Click on the circle to select a key</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row - Strumming and Metronome */}
        <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            <StrummingPattern />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
            <Metronome bpm={bpm} onBpmChange={setBpm} />
          </div>
        </div>
      </main>
    </div>
  );
}
