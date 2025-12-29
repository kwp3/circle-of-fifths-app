// Chord diagram data
// Fret positions: -1 = muted (x), 0 = open, 1-12 = fret number
// Fingers: 0 = open/muted, 1-4 = finger numbers
// Barre: optional barre indicator { fret, fromString, toString }

export interface ChordDiagram {
  name: string;
  frets: number[]; // 6 strings, low E to high E
  fingers: number[]; // finger numbers for each string
  baseFret: number; // starting fret (1 for open chords)
  barre?: { fret: number; fromString: number; toString: number };
}

// Common chord voicings
export const CHORD_DIAGRAMS: Record<string, ChordDiagram> = {
  // Major chords
  'C': { name: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
  'D': { name: 'D', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  'E': { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
  'F': { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 0, toString: 5 } },
  'G': { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
  'A': { name: 'A', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
  'B': { name: 'B', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barre: { fret: 2, fromString: 1, toString: 5 } },

  // Sharp major chords
  'C#': { name: 'C#', frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1], baseFret: 4, barre: { fret: 4, fromString: 1, toString: 5 } },
  'D#': { name: 'D#', frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1], baseFret: 6, barre: { fret: 6, fromString: 1, toString: 5 } },
  'F#': { name: 'F#', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'G#': { name: 'G#', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'A#': { name: 'A#', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },

  // Flat major chords (enharmonic equivalents)
  'Db': { name: 'Db', frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1], baseFret: 4, barre: { fret: 4, fromString: 1, toString: 5 } },
  'Eb': { name: 'Eb', frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1], baseFret: 6, barre: { fret: 6, fromString: 1, toString: 5 } },
  'Gb': { name: 'Gb', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'Ab': { name: 'Ab', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'Bb': { name: 'Bb', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },

  // Minor chords
  'Cm': { name: 'Cm', frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 3, barre: { fret: 3, fromString: 1, toString: 5 } },
  'Dm': { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
  'Em': { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
  'Fm': { name: 'Fm', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 0, toString: 5 } },
  'Gm': { name: 'Gm', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3, barre: { fret: 3, fromString: 0, toString: 5 } },
  'Am': { name: 'Am', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
  'Bm': { name: 'Bm', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2, barre: { fret: 2, fromString: 1, toString: 5 } },

  // Sharp minor chords
  'C#m': { name: 'C#m', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barre: { fret: 4, fromString: 1, toString: 5 } },
  'D#m': { name: 'D#m', frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], baseFret: 6, barre: { fret: 6, fromString: 1, toString: 5 } },
  'F#m': { name: 'F#m', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'G#m': { name: 'G#m', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'A#m': { name: 'A#m', frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },

  // Flat minor chords
  'Dbm': { name: 'Dbm', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barre: { fret: 4, fromString: 1, toString: 5 } },
  'Ebm': { name: 'Ebm', frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], baseFret: 6, barre: { fret: 6, fromString: 1, toString: 5 } },
  'Gbm': { name: 'Gbm', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'Abm': { name: 'Abm', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'Bbm': { name: 'Bbm', frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },

  // Diminished chords
  'Cdim': { name: 'Cdim', frets: [-1, 3, 4, 2, 4, 2], fingers: [0, 2, 3, 1, 4, 1], baseFret: 1 },
  'Ddim': { name: 'Ddim', frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
  'Edim': { name: 'Edim', frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0], baseFret: 1 },
  'Fdim': { name: 'Fdim', frets: [1, 2, 3, 1, 3, 1], fingers: [1, 2, 3, 1, 4, 1], baseFret: 1 },
  'Gdim': { name: 'Gdim', frets: [3, 4, 5, 3, 5, 3], fingers: [1, 2, 3, 1, 4, 1], baseFret: 3 },
  'Adim': { name: 'Adim', frets: [-1, 0, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1 },
  'Bdim': { name: 'Bdim', frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },

  // Sharp diminished
  'C#dim': { name: 'C#dim', frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], baseFret: 3 },
  'D#dim': { name: 'D#dim', frets: [-1, -1, 1, 2, 4, 2], fingers: [0, 0, 1, 2, 4, 3], baseFret: 1 },
  'F#dim': { name: 'F#dim', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 3, 1, 4, 1], baseFret: 2 },
  'G#dim': { name: 'G#dim', frets: [4, 5, 6, 4, 6, 4], fingers: [1, 2, 3, 1, 4, 1], baseFret: 4 },
  'A#dim': { name: 'A#dim', frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },

  // Flat diminished
  'Dbdim': { name: 'Dbdim', frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], baseFret: 3 },
  'Ebdim': { name: 'Ebdim', frets: [-1, -1, 1, 2, 4, 2], fingers: [0, 0, 1, 2, 4, 3], baseFret: 1 },
  'Gbdim': { name: 'Gbdim', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 3, 1, 4, 1], baseFret: 2 },
  'Abdim': { name: 'Abdim', frets: [4, 5, 6, 4, 6, 4], fingers: [1, 2, 3, 1, 4, 1], baseFret: 4 },
  'Bbdim': { name: 'Bbdim', frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0], baseFret: 1 },

  // Dominant 7th chords
  'C7': { name: 'C7', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1 },
  'D7': { name: 'D7', frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1 },
  'E7': { name: 'E7', frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1 },
  'F7': { name: 'F7', frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 0, toString: 5 } },
  'G7': { name: 'G7', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1 },
  'A7': { name: 'A7', frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseFret: 1 },
  'B7': { name: 'B7', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1 },

  // Sharp dominant 7th chords
  'C#7': { name: 'C#7', frets: [-1, 4, 3, 4, 2, -1], fingers: [0, 3, 2, 4, 1, 0], baseFret: 2 },
  'D#7': { name: 'D#7', frets: [-1, 6, 5, 6, 4, -1], fingers: [0, 3, 2, 4, 1, 0], baseFret: 4 },
  'F#7': { name: 'F#7', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'G#7': { name: 'G#7', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'A#7': { name: 'A#7', frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 3, 1, 4, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },

  // Flat dominant 7th chords
  'Db7': { name: 'Db7', frets: [-1, 4, 3, 4, 2, -1], fingers: [0, 3, 2, 4, 1, 0], baseFret: 2 },
  'Eb7': { name: 'Eb7', frets: [-1, 6, 5, 6, 4, -1], fingers: [0, 3, 2, 4, 1, 0], baseFret: 4 },
  'Gb7': { name: 'Gb7', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], baseFret: 2, barre: { fret: 2, fromString: 0, toString: 5 } },
  'Ab7': { name: 'Ab7', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], baseFret: 4, barre: { fret: 4, fromString: 0, toString: 5 } },
  'Bb7': { name: 'Bb7', frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 3, 1, 4, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 5 } },
};

// Get chord diagram, handling enharmonic equivalents
export function getChordDiagram(chordName: string): ChordDiagram | null {
  // Direct lookup
  if (CHORD_DIAGRAMS[chordName]) {
    return CHORD_DIAGRAMS[chordName];
  }

  // Handle enharmonic equivalents
  const enharmonicMap: Record<string, string> = {
    'Db': 'C#', 'C#': 'Db',
    'Eb': 'D#', 'D#': 'Eb',
    'Gb': 'F#', 'F#': 'Gb',
    'Ab': 'G#', 'G#': 'Ab',
    'Bb': 'A#', 'A#': 'Bb',
  };

  // Try to find equivalent
  for (const [from, to] of Object.entries(enharmonicMap)) {
    if (chordName.startsWith(from)) {
      const equivalent = chordName.replace(from, to);
      if (CHORD_DIAGRAMS[equivalent]) {
        return CHORD_DIAGRAMS[equivalent];
      }
    }
  }

  return null;
}
