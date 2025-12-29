'use client';

import { useState } from 'react';

interface Pattern {
  name: string;
  pattern: ('D' | 'U' | 'x' | '-')[]; // D=down, U=up, x=muted, -=rest
  timeSignature: string;
  description: string;
}

const STRUMMING_PATTERNS: Pattern[] = [
  // Beginner patterns
  {
    name: 'Basic Down',
    pattern: ['D', '-', 'D', '-', 'D', '-', 'D', '-'],
    timeSignature: '4/4',
    description: 'Simple quarter note downstrokes - perfect for beginners',
  },
  {
    name: 'Down-Up',
    pattern: ['D', '-', 'D', 'U', 'D', '-', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Classic alternating pattern with eighth notes',
  },
  {
    name: 'Folk/Country',
    pattern: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    timeSignature: '4/4',
    description: 'The "Old Faithful" - works with almost any song',
  },
  // Rock patterns
  {
    name: 'Pop Rock',
    pattern: ['D', 'D', '-', 'U', '-', 'U', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Syncopated feel common in pop and rock songs',
  },
  {
    name: 'Punk Rock',
    pattern: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    timeSignature: '4/4',
    description: 'All downstrokes, fast and aggressive',
  },
  {
    name: 'Hard Rock',
    pattern: ['D', '-', 'D', '-', 'D', 'U', 'x', 'U'],
    timeSignature: '4/4',
    description: 'Driving rock pattern with palm mute accent',
  },
  {
    name: 'Power Chord Chug',
    pattern: ['D', 'x', 'D', 'x', 'D', 'x', 'D', 'x'],
    timeSignature: '4/4',
    description: 'Alternating strums and mutes for metal/hard rock riffs',
  },
  {
    name: 'Classic Rock Shuffle',
    pattern: ['D', '-', 'U', 'D', '-', 'U', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Triplet-feel shuffle like AC/DC or ZZ Top',
  },
  {
    name: 'Indie Rock',
    pattern: ['D', 'U', '-', 'U', 'D', 'U', '-', 'U'],
    timeSignature: '4/4',
    description: 'Jangly arpeggiated feel for alternative rock',
  },
  {
    name: 'Palm Mute Groove',
    pattern: ['x', 'x', 'D', '-', 'x', 'x', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Heavy palm muted intro with open chord accents',
  },
  {
    name: 'Funk Rock',
    pattern: ['D', 'x', 'U', 'x', 'D', 'x', 'U', 'x'],
    timeSignature: '4/4',
    description: 'Tight, percussive pattern with muted scratches',
  },
  {
    name: 'Grunge',
    pattern: ['D', '-', '-', 'D', 'D', '-', 'U', '-'],
    timeSignature: '4/4',
    description: 'Loose, heavy feel like Nirvana or Pearl Jam',
  },
  {
    name: 'Metal Gallop',
    pattern: ['D', 'D', 'U', '-', 'D', 'D', 'U', '-'],
    timeSignature: '4/4',
    description: 'Galloping rhythm common in metal (Iron Maiden style)',
  },
  {
    name: 'Syncopated Rock',
    pattern: ['D', '-', 'U', '-', '-', 'U', 'D', '-'],
    timeSignature: '4/4',
    description: 'Off-beat accents for a driving, angular feel',
  },
  // Other genres
  {
    name: 'Reggae',
    pattern: ['-', '-', 'D', 'U', '-', '-', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Off-beat emphasis for that island feel',
  },
  {
    name: 'Ballad',
    pattern: ['D', '-', '-', 'U', '-', 'U', '-', 'U'],
    timeSignature: '4/4',
    description: 'Gentle pattern for slow emotional songs',
  },
  {
    name: 'Waltz',
    pattern: ['D', '-', '-', 'D', 'U', '-'],
    timeSignature: '3/4',
    description: 'Three-beat pattern for waltz time',
  },
  {
    name: '16th Note Rock',
    pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U', 'D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
    timeSignature: '4/4',
    description: 'Fast 16th note pattern for high-energy sections',
  },
  {
    name: 'Bo Diddley Beat',
    pattern: ['D', '-', '-', 'D', 'D', '-', 'D', '-'],
    timeSignature: '4/4',
    description: 'Classic rock\'n\'roll "shave and a haircut" rhythm',
  },
];

export default function StrummingPattern() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(STRUMMING_PATTERNS[2]);
  const [highlightedBeat, setHighlightedBeat] = useState<number | null>(null);

  const getStrokeDisplay = (stroke: 'D' | 'U' | 'x' | '-') => {
    switch (stroke) {
      case 'D':
        return { symbol: '↓', label: 'Down', color: 'text-blue-400' };
      case 'U':
        return { symbol: '↑', label: 'Up', color: 'text-green-400' };
      case 'x':
        return { symbol: '✕', label: 'Mute', color: 'text-orange-400' };
      case '-':
        return { symbol: '·', label: 'Rest', color: 'text-slate-500' };
    }
  };

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Strumming Pattern</h3>

      {/* Pattern Selector */}
      <div className="mb-3 sm:mb-4">
        <label htmlFor="strum-select" className="block text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
          Select a strumming pattern:
        </label>
        <select
          id="strum-select"
          value={selectedPattern.name}
          onChange={(e) => {
            const pattern = STRUMMING_PATTERNS.find(p => p.name === e.target.value);
            if (pattern) setSelectedPattern(pattern);
          }}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STRUMMING_PATTERNS.map((pattern) => (
            <option key={pattern.name} value={pattern.name} className="bg-slate-800">
              {pattern.name} ({pattern.timeSignature})
            </option>
          ))}
        </select>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2">{selectedPattern.description}</p>
      </div>

      {/* Pattern Visualization */}
      <div className="bg-white/5 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 mb-2">
          <span className="text-xs sm:text-sm text-slate-400">Time: {selectedPattern.timeSignature}</span>
          <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <span className="text-blue-400">↓ Down</span>
            <span className="text-green-400">↑ Up</span>
            <span className="text-orange-400">✕ Mute</span>
            <span className="text-slate-500">· Rest</span>
          </div>
        </div>

        {/* Beat Grid */}
        <div className="flex justify-center flex-wrap gap-0.5 sm:gap-1">
          {selectedPattern.pattern.map((stroke, index) => {
            const display = getStrokeDisplay(stroke);
            const isHighlighted = highlightedBeat === index;
            const beatNumber = index + 1;
            const isDownbeat = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col items-center p-1 sm:p-2 rounded-lg transition-all cursor-pointer ${
                  isHighlighted ? 'bg-white/20 scale-110' : 'hover:bg-white/10'
                }`}
                onMouseEnter={() => setHighlightedBeat(index)}
                onMouseLeave={() => setHighlightedBeat(null)}
              >
                <span className={`text-lg sm:text-2xl font-bold ${display.color}`}>
                  {display.symbol}
                </span>
                <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${isDownbeat ? 'text-slate-300' : 'text-slate-500'}`}>
                  {isDownbeat ? Math.floor(beatNumber / 2) + 1 : '&'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Written Pattern */}
        <div className="mt-3 sm:mt-4 text-center">
          <span className="text-slate-400 text-xs sm:text-sm font-mono tracking-wider">
            {selectedPattern.pattern.map(s => {
              if (s === 'D') return 'D';
              if (s === 'U') return 'U';
              if (s === 'x') return 'x';
              return '-';
            }).join(' ')}
          </span>
        </div>
      </div>

      {/* Quick pattern buttons */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {STRUMMING_PATTERNS.slice(0, 4).map((pattern) => (
          <button
            key={pattern.name}
            onClick={() => setSelectedPattern(pattern)}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
              selectedPattern.name === pattern.name
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>
    </div>
  );
}
