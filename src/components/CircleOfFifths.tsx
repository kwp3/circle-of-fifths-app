'use client';

import { useState } from 'react';

const NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#/Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const MINOR_NOTES = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm/D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

interface CircleOfFifthsProps {
  selectedKey: string | null;
  onKeySelect: (key: string, isMinor: boolean) => void;
}

export default function CircleOfFifths({ selectedKey, onKeySelect }: CircleOfFifthsProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [hoveredRing, setHoveredRing] = useState<'major' | 'minor' | null>(null);

  const centerX = 200;
  const centerY = 200;
  const outerRadius = 180;
  const middleRadius = 130;
  const innerRadius = 80;

  const createArcPath = (
    startAngle: number,
    endAngle: number,
    innerR: number,
    outerR: number
  ): string => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + outerR * Math.cos(startAngleRad);
    const y1 = centerY + outerR * Math.sin(startAngleRad);
    const x2 = centerX + outerR * Math.cos(endAngleRad);
    const y2 = centerY + outerR * Math.sin(endAngleRad);
    const x3 = centerX + innerR * Math.cos(endAngleRad);
    const y3 = centerY + innerR * Math.sin(endAngleRad);
    const x4 = centerX + innerR * Math.cos(startAngleRad);
    const y4 = centerY + innerR * Math.sin(startAngleRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const getTextPosition = (index: number, radius: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const getSegmentColor = (index: number, ring: 'major' | 'minor', isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return ring === 'major' ? '#3b82f6' : '#8b5cf6';
    }
    if (isHovered) {
      return ring === 'major' ? '#93c5fd' : '#c4b5fd';
    }
    const hue = (index * 30) % 360;
    return ring === 'major'
      ? `hsl(${hue}, 70%, 85%)`
      : `hsl(${hue}, 60%, 75%)`;
  };

  const isKeySelected = (note: string, isMinor: boolean) => {
    if (!selectedKey) return false;
    const normalizedNote = note.split('/')[0];
    const normalizedSelected = selectedKey.split('/')[0];
    return normalizedNote === normalizedSelected;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">Circle of Fifths</h2>
      <svg
        viewBox="0 0 400 400"
        className="drop-shadow-lg w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] h-auto"
      >
        {/* Outer ring - Major keys */}
        {NOTES.map((note, index) => {
          const startAngle = index * 30 - 15;
          const endAngle = startAngle + 30;
          const isHovered = hoveredSegment === index && hoveredRing === 'major';
          const isSelected = isKeySelected(note, false);
          const textPos = getTextPosition(index, (outerRadius + middleRadius) / 2);

          return (
            <g key={`major-${index}`}>
              <path
                d={createArcPath(startAngle, endAngle, middleRadius, outerRadius)}
                fill={getSegmentColor(index, 'major', isHovered, isSelected)}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => {
                  setHoveredSegment(index);
                  setHoveredRing('major');
                }}
                onMouseLeave={() => {
                  setHoveredSegment(null);
                  setHoveredRing(null);
                }}
                onClick={() => onKeySelect(note, false)}
              />
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-sm font-bold pointer-events-none ${
                  isSelected ? 'fill-white' : 'fill-gray-800'
                }`}
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Inner ring - Minor keys */}
        {MINOR_NOTES.map((note, index) => {
          const startAngle = index * 30 - 15;
          const endAngle = startAngle + 30;
          const isHovered = hoveredSegment === index && hoveredRing === 'minor';
          const isSelected = isKeySelected(note, true);
          const textPos = getTextPosition(index, (middleRadius + innerRadius) / 2);

          return (
            <g key={`minor-${index}`}>
              <path
                d={createArcPath(startAngle, endAngle, innerRadius, middleRadius)}
                fill={getSegmentColor(index, 'minor', isHovered, isSelected)}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => {
                  setHoveredSegment(index);
                  setHoveredRing('minor');
                }}
                onMouseLeave={() => {
                  setHoveredSegment(null);
                  setHoveredRing(null);
                }}
                onClick={() => onKeySelect(note, true)}
              />
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xs font-semibold pointer-events-none ${
                  isSelected ? 'fill-white' : 'fill-gray-700'
                }`}
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="#1f2937"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-xs font-medium"
        >
          Click to
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-xs font-medium"
        >
          select key
        </text>
      </svg>

      <div className="mt-3 sm:mt-4 flex gap-4 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-blue-500"></div>
          <span className="text-gray-700 dark:text-gray-300">Major</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-violet-500"></div>
          <span className="text-gray-700 dark:text-gray-300">Minor</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400 max-w-sm px-2">
        <h3 className="text-slate-300 font-medium mb-2">What is the Circle of Fifths?</h3>
        <p className="mb-2">
          The Circle of Fifths is a visual tool showing how the 12 musical keys relate to each other.
          Moving clockwise, each key is a <span className="text-slate-300">perfect fifth</span> higher
          (7 semitones). Moving counter-clockwise, each key is a <span className="text-slate-300">perfect fourth</span> higher.
        </p>
        <p className="mb-2">
          <span className="text-slate-300">Adjacent keys</span> share most of the same chords, making them
          easy to transition between. The inner ring shows <span className="text-slate-300">relative minors</span> -
          each minor key shares the same notes as its adjacent major key.
        </p>
        <p className="mb-2">
          <span className="text-slate-300">Tip:</span> Keys on opposite sides of the circle sound most
          different from each other (like C and F#).
        </p>
        <p className="mt-3 pt-3 border-t border-slate-700">
          <span className="text-slate-300">Note on chord names:</span> Some chord names may look different
          than expected due to <span className="text-slate-300">enharmonic equivalents</span> - notes that
          sound the same but have different names (like D# and Eb). For example, in G#m the V chord is D#
          (a perfect fifth above G#), even though you might expect to see Eb. Both are correct - they're the
          same pitch spelled differently.
        </p>
      </div>
    </div>
  );
}
