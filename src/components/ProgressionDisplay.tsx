'use client';

import { PROGRESSION_PATTERNS, getProgression, ProgressionPattern } from '@/lib/musicTheory';
import ChordDiagram from './ChordDiagram';

interface ProgressionDisplayProps {
  selectedKey: string;
  isMinor: boolean;
  selectedPattern: ProgressionPattern;
  onPatternChange: (pattern: ProgressionPattern) => void;
}

export default function ProgressionDisplay({
  selectedKey,
  isMinor,
  selectedPattern,
  onPatternChange
}: ProgressionDisplayProps) {
  const progression = getProgression(selectedKey, isMinor, selectedPattern);

  // Get unique chords in order of appearance
  const uniqueChords = progression.reduce((acc, chord) => {
    if (!acc.find(c => c.chord === chord.chord)) {
      acc.push(chord);
    }
    return acc;
  }, [] as typeof progression);

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Chord Progression</h3>

      {/* Pattern Selector */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="pattern-select" className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
          Select a progression pattern:
        </label>
        <select
          id="pattern-select"
          value={selectedPattern.name}
          onChange={(e) => {
            const pattern = PROGRESSION_PATTERNS.find(p => p.name === e.target.value);
            if (pattern) onPatternChange(pattern);
          }}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PROGRESSION_PATTERNS.map((pattern) => (
            <option key={pattern.name} value={pattern.name} className="bg-slate-800">
              {pattern.name}
            </option>
          ))}
        </select>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">{selectedPattern.description}</p>
      </div>

      {/* Progression Display */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {progression.map((chord, index) => (
          <div key={index} className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/20 rounded-lg px-2 sm:px-4 py-2 sm:py-3 text-center min-w-[50px] sm:min-w-[70px]">
              <div className="text-[10px] sm:text-xs text-slate-400">{chord.numeral}</div>
              <div className="text-white font-bold text-sm sm:text-lg">{chord.chord}</div>
              <div className="text-[10px] sm:text-xs text-slate-300 hidden sm:block">{chord.notes.join('-')}</div>
            </div>
            {index < progression.length - 1 && (
              <span className="text-slate-500 mx-0.5 sm:mx-1 text-xs sm:text-base">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick pattern buttons */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {PROGRESSION_PATTERNS.slice(0, 4).map((pattern) => (
          <button
            key={pattern.name}
            onClick={() => onPatternChange(pattern)}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
              selectedPattern.name === pattern.name
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      {/* Chord Diagrams for Progression */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
        <h4 className="text-xs sm:text-sm font-medium text-slate-400 mb-2 sm:mb-3">Chord Diagrams</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {uniqueChords.map((chord, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-3 sm:p-4 flex flex-col items-center"
            >
              <div className="text-white font-bold text-sm sm:text-base mb-1">{chord.chord}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mb-2">{chord.numeral}</div>
              <ChordDiagram chordName={chord.chord} size="md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
