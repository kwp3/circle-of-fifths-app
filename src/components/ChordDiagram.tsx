'use client';

import { ChordDiagram as ChordDiagramType, getChordDiagram } from '@/lib/chordDiagrams';

interface ChordDiagramProps {
  chordName: string;
  size?: 'sm' | 'md' | 'lg';
}

const FINGER_COLORS = [
  '', // 0 - not used
  '#3b82f6', // 1 - blue
  '#22c55e', // 2 - green
  '#f59e0b', // 3 - amber
  '#ef4444', // 4 - red
];

export default function ChordDiagram({ chordName, size = 'md' }: ChordDiagramProps) {
  const diagram = getChordDiagram(chordName);

  if (!diagram) {
    return (
      <div className="flex items-center justify-center text-slate-500 text-xs">
        No diagram
      </div>
    );
  }

  // Size configurations
  const sizes = {
    sm: { width: 60, height: 80, fretHeight: 12, stringSpacing: 8, dotRadius: 3, fontSize: 6 },
    md: { width: 80, height: 100, fretHeight: 15, stringSpacing: 12, dotRadius: 4, fontSize: 8 },
    lg: { width: 120, height: 150, fretHeight: 22, stringSpacing: 18, dotRadius: 6, fontSize: 10 },
  };

  const config = sizes[size];
  const numFrets = 5;
  const numStrings = 6;
  const topPadding = 15;
  const leftPadding = 15;

  // Calculate positions
  const fretboardWidth = (numStrings - 1) * config.stringSpacing;
  const fretboardHeight = numFrets * config.fretHeight;

  // Find the display frets (normalize to start from baseFret)
  const minFret = Math.min(...diagram.frets.filter(f => f > 0));
  const displayBaseFret = diagram.baseFret > 1 ? diagram.baseFret : 1;
  const isOpenChord = displayBaseFret === 1;

  return (
    <svg
      width={config.width}
      height={config.height}
      viewBox={`0 0 ${config.width} ${config.height}`}
      className="mx-auto"
    >
      {/* Nut (thick line at top for open chords) */}
      {isOpenChord && (
        <rect
          x={leftPadding - 1}
          y={topPadding - 3}
          width={fretboardWidth + 2}
          height={4}
          fill="#e5e7eb"
          rx={1}
        />
      )}

      {/* Fret position indicator for barre chords */}
      {!isOpenChord && (
        <text
          x={leftPadding - 10}
          y={topPadding + config.fretHeight / 2 + 3}
          className="fill-slate-400"
          fontSize={config.fontSize}
          textAnchor="middle"
        >
          {displayBaseFret}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={leftPadding}
          y1={topPadding + i * config.fretHeight}
          x2={leftPadding + fretboardWidth}
          y2={topPadding + i * config.fretHeight}
          stroke="#6b7280"
          strokeWidth={i === 0 ? 2 : 1}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: numStrings }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={leftPadding + i * config.stringSpacing}
          y1={topPadding}
          x2={leftPadding + i * config.stringSpacing}
          y2={topPadding + fretboardHeight}
          stroke="#9ca3af"
          strokeWidth={1 + (5 - i) * 0.15}
        />
      ))}

      {/* Barre indicator */}
      {diagram.barre && (
        <rect
          x={leftPadding + diagram.barre.fromString * config.stringSpacing - config.dotRadius}
          y={topPadding + (diagram.barre.fret - displayBaseFret + 0.5) * config.fretHeight - config.dotRadius}
          width={(diagram.barre.toString - diagram.barre.fromString) * config.stringSpacing + config.dotRadius * 2}
          height={config.dotRadius * 2}
          fill="#6b7280"
          rx={config.dotRadius}
        />
      )}

      {/* Finger positions */}
      {diagram.frets.map((fret, stringIndex) => {
        const x = leftPadding + stringIndex * config.stringSpacing;

        if (fret === -1) {
          // Muted string (X)
          return (
            <text
              key={`mute-${stringIndex}`}
              x={x}
              y={topPadding - 6}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize={config.fontSize}
              fontWeight="bold"
            >
              x
            </text>
          );
        }

        if (fret === 0) {
          // Open string (O)
          return (
            <circle
              key={`open-${stringIndex}`}
              cx={x}
              cy={topPadding - 6}
              r={config.dotRadius - 1}
              fill="none"
              stroke="#9ca3af"
              strokeWidth={1.5}
            />
          );
        }

        // Fretted note
        const displayFret = fret - displayBaseFret + 1;
        const y = topPadding + (displayFret - 0.5) * config.fretHeight;
        const finger = diagram.fingers[stringIndex];

        // Skip if this is part of a barre (handled above)
        if (diagram.barre && fret === diagram.barre.fret && stringIndex >= diagram.barre.fromString && stringIndex <= diagram.barre.toString) {
          // Show finger number on barre
          if (stringIndex === diagram.barre.fromString) {
            return (
              <text
                key={`barre-finger-${stringIndex}`}
                x={x}
                y={y + 3}
                textAnchor="middle"
                className="fill-white"
                fontSize={config.fontSize - 1}
                fontWeight="bold"
              >
                {finger}
              </text>
            );
          }
          return null;
        }

        return (
          <g key={`note-${stringIndex}`}>
            <circle
              cx={x}
              cy={y}
              r={config.dotRadius}
              fill={FINGER_COLORS[finger] || '#6b7280'}
            />
            {finger > 0 && (
              <text
                x={x}
                y={y + 3}
                textAnchor="middle"
                className="fill-white"
                fontSize={config.fontSize - 1}
                fontWeight="bold"
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}

      {/* String labels (low to high: E A D G B e) */}
      {['E', 'A', 'D', 'G', 'B', 'e'].map((label, i) => (
        <text
          key={`label-${i}`}
          x={leftPadding + i * config.stringSpacing}
          y={topPadding + fretboardHeight + 10}
          textAnchor="middle"
          className="fill-slate-500"
          fontSize={config.fontSize - 1}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
