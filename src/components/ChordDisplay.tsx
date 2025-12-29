'use client';

import { useState } from 'react';
import { getDiatonicChords } from '@/lib/musicTheory';
import { getChordDiagram } from '@/lib/chordDiagrams';
import { audioEngine } from '@/lib/audioEngine';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  selectedKey: string;
  isMinor: boolean;
}

export default function ChordDisplay({ selectedKey, isMinor }: ChordDisplayProps) {
  const chords = getDiatonicChords(selectedKey, isMinor);
  const [selectedChord, setSelectedChord] = useState<number | null>(null);

  const playChord = async (chordName: string, notes: string[]) => {
    await audioEngine.resume();

    // Try to play from fret positions for more accurate sound
    const diagram = getChordDiagram(chordName);
    if (diagram) {
      audioEngine.playChordFromFrets(diagram.frets);
    } else {
      // Fallback to note-based playback
      audioEngine.playChord(notes);
    }
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
        Chords in {selectedKey} {isMinor ? '' : 'Major'}
      </h3>

      {/* Chord grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
        {chords.map((chord, index) => (
          <button
            key={index}
            onClick={() => setSelectedChord(selectedChord === index ? null : index)}
            className={`rounded-lg p-1.5 sm:p-2 text-center transition-all ${
              selectedChord === index
                ? 'bg-blue-500/30 ring-2 ring-blue-500'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">{chord.numeral}</div>
            <div className="text-white font-bold text-xs sm:text-sm">{chord.chord}</div>
            <div className="text-[10px] sm:text-xs text-slate-300 mt-0.5 sm:mt-1 hidden sm:block">
              {chord.notes.join('-')}
            </div>
          </button>
        ))}
      </div>

      {/* Selected chord diagram */}
      {selectedChord !== null && (
        <div className="mt-3 sm:mt-4 bg-white/5 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <ChordDiagram chordName={chords[selectedChord].chord} size="lg" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {chords[selectedChord].chord}
                </h4>
                <button
                  onClick={() => playChord(chords[selectedChord].chord, chords[selectedChord].notes)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full text-xs sm:text-sm transition-colors"
                  title="Play chord"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play
                </button>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mb-2">
                {chords[selectedChord].numeral} chord in {selectedKey} {isMinor ? '' : 'Major'}
              </p>
              <div className="text-slate-300 text-sm">
                <span className="text-slate-400 text-xs sm:text-sm">Notes: </span>
                <span className="font-medium">{chords[selectedChord].notes.join(' - ')}</span>
              </div>
              <div className="mt-2 sm:mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="text-[10px] sm:text-xs text-slate-500">Finger colors:</span>
                <span className="text-[10px] sm:text-xs text-blue-400">1</span>
                <span className="text-[10px] sm:text-xs text-green-400">2</span>
                <span className="text-[10px] sm:text-xs text-amber-400">3</span>
                <span className="text-[10px] sm:text-xs text-red-400">4</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint text */}
      {selectedChord === null && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Click a chord to see the diagram
        </p>
      )}
    </div>
  );
}
