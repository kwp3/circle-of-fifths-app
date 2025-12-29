// All 12 chromatic notes
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Enharmonic equivalents mapping
const ENHARMONIC_MAP: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'F#/Gb': 'F#',
  'Ebm/D#m': 'D#m',
};

// Scale intervals (semitones from root)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

// Chord qualities for each scale degree
const MAJOR_CHORD_QUALITIES = ['', 'm', 'm', '', '', 'm', 'dim'];
const MINOR_CHORD_QUALITIES = ['m', 'dim', '', 'm', 'm', '', ''];

// Roman numerals for display
export const MAJOR_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const MINOR_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

// Normalize key to use sharps
function normalizeKey(key: string): string {
  const baseKey = key.split('/')[0];
  const isMinor = baseKey.endsWith('m');
  const root = isMinor ? baseKey.slice(0, -1) : baseKey;
  const normalized = ENHARMONIC_MAP[root] || root;
  return isMinor ? normalized + 'm' : normalized;
}

// Get the root note from a key
function getRootNote(key: string): string {
  const normalized = normalizeKey(key);
  const isMinor = normalized.endsWith('m');
  return isMinor ? normalized.slice(0, -1) : normalized;
}

// Get scale notes for a given key
export function getScaleNotes(key: string, isMinor: boolean): string[] {
  const root = getRootNote(key);
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  if (rootIndex === -1) return [];
  const intervals = isMinor ? MINOR_SCALE_INTERVALS : MAJOR_SCALE_INTERVALS;
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_NOTES[noteIndex];
  });
}

// Get the notes that make up a chord
export function getChordNotes(root: string, quality: string): string[] {
  const normalizedRoot = ENHARMONIC_MAP[root] || root;
  const rootIndex = CHROMATIC_NOTES.indexOf(normalizedRoot);
  if (rootIndex === -1) return [];

  let intervals: number[];

  switch (quality) {
    case 'm':
      intervals = [0, 3, 7];
      break;
    case 'dim':
      intervals = [0, 3, 6];
      break;
    case '7':
      intervals = [0, 4, 7, 10];
      break;
    case 'maj7':
      intervals = [0, 4, 7, 11];
      break;
    case 'm7':
      intervals = [0, 3, 7, 10];
      break;
    default:
      intervals = [0, 4, 7];
  }

  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_NOTES[noteIndex];
  });
}

// Get all diatonic chords for a key
export function getDiatonicChords(key: string, isMinor: boolean): {
  numeral: string;
  chord: string;
  notes: string[];
  quality: string;
}[] {
  const scaleNotes = getScaleNotes(key, isMinor);
  const qualities = isMinor ? MINOR_CHORD_QUALITIES : MAJOR_CHORD_QUALITIES;
  const numerals = isMinor ? MINOR_NUMERALS : MAJOR_NUMERALS;

  return scaleNotes.map((note, index) => {
    const quality = qualities[index];
    const chordName = note + quality;
    const notes = getChordNotes(note, quality);
    return { numeral: numerals[index], chord: chordName, notes, quality };
  });
}

// Chord definition for progressions (supports borrowed chords)
interface ChordDef {
  numeral: string;        // Display numeral (e.g., "bVII", "V7/vi")
  semitones: number;      // Semitones from root
  quality: '' | 'm' | 'dim' | '7' | 'maj7' | 'm7';
}

// Chord progression patterns with full chord definitions
export interface ProgressionPattern {
  name: string;
  description: string;
  chords: ChordDef[];
}

export const PROGRESSION_PATTERNS: ProgressionPattern[] = [
  {
    name: 'Pop Anthem',
    description: 'I – V – vi – IV',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'vi', semitones: 9, quality: 'm' },
      { numeral: 'IV', semitones: 5, quality: '' },
    ],
  },
  {
    name: 'Classic Rock',
    description: 'I – IV – V – I',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
  {
    name: 'Metal',
    description: 'i – bII – bIII – bVII',
    chords: [
      { numeral: 'i', semitones: 0, quality: 'm' },
      { numeral: 'bII', semitones: 1, quality: '' },
      { numeral: 'bIII', semitones: 3, quality: '' },
      { numeral: 'bVII', semitones: 10, quality: '' },
    ],
  },
  {
    name: 'Rock Ballad',
    description: 'I – iii – IV – V',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'iii', semitones: 4, quality: 'm' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
    ],
  },
  {
    name: 'Pop Punk',
    description: 'vi – IV – I – V',
    chords: [
      { numeral: 'vi', semitones: 9, quality: 'm' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
    ],
  },
  {
    name: 'Cinematic',
    description: 'I – III – IV – iv',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'III', semitones: 4, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'iv', semitones: 5, quality: 'm' },
    ],
  },
  {
    name: 'Pop Hybrid',
    description: 'I – V – vi – I7 – IV – iv – I',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'vi', semitones: 9, quality: 'm' },
      { numeral: 'I7', semitones: 0, quality: '7' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'iv', semitones: 5, quality: 'm' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
  {
    name: 'Pop Crossover',
    description: 'I – V7/vi – IV – iv – I',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V7/vi', semitones: 4, quality: '7' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'iv', semitones: 5, quality: 'm' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
  {
    name: 'Aeolian Modal',
    description: 'i – VI – III – VII',
    chords: [
      { numeral: 'i', semitones: 0, quality: 'm' },
      { numeral: 'VI', semitones: 8, quality: '' },
      { numeral: 'III', semitones: 3, quality: '' },
      { numeral: 'VII', semitones: 10, quality: '' },
    ],
  },
  {
    name: 'Ballad',
    description: 'I – bVII – IV – I',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'bVII', semitones: 10, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
  {
    name: 'Modal Rock',
    description: 'I – II – IV – bVII – I',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'II', semitones: 2, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'bVII', semitones: 10, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
  {
    name: 'Mixolydian Rock',
    description: 'I – V – I – V – bVII – IV – bVII – IV',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'bVII', semitones: 10, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
      { numeral: 'bVII', semitones: 10, quality: '' },
      { numeral: 'IV', semitones: 5, quality: '' },
    ],
  },
  {
    name: 'Flamenco',
    description: 'i – VII – VI – V',
    chords: [
      { numeral: 'i', semitones: 0, quality: 'm' },
      { numeral: 'VII', semitones: 10, quality: '' },
      { numeral: 'VI', semitones: 8, quality: '' },
      { numeral: 'V', semitones: 7, quality: '' },
    ],
  },
  {
    name: 'Country Classic',
    description: 'I – vi – ii – V',
    chords: [
      { numeral: 'I', semitones: 0, quality: '' },
      { numeral: 'vi', semitones: 9, quality: 'm' },
      { numeral: 'ii', semitones: 2, quality: 'm' },
      { numeral: 'V', semitones: 7, quality: '' },
    ],
  },
  {
    name: 'Nashville Turnaround',
    description: 'ii – V – I',
    chords: [
      { numeral: 'ii', semitones: 2, quality: 'm' },
      { numeral: 'V', semitones: 7, quality: '' },
      { numeral: 'I', semitones: 0, quality: '' },
    ],
  },
];

// Get chord progression for a specific pattern and key
export function getProgression(
  key: string,
  isMinor: boolean,
  pattern: ProgressionPattern
): { numeral: string; chord: string; notes: string[] }[] {
  const root = getRootNote(key);
  const rootIndex = CHROMATIC_NOTES.indexOf(root);

  if (rootIndex === -1) return [];

  return pattern.chords.map(chordDef => {
    const noteIndex = (rootIndex + chordDef.semitones) % 12;
    const chordRoot = CHROMATIC_NOTES[noteIndex];

    // If user selected a minor key and this chord is the tonic (semitones: 0),
    // adjust the quality to match the key's tonality
    let quality = chordDef.quality;
    let numeral = chordDef.numeral;

    if (isMinor && chordDef.semitones === 0) {
      // Convert major I to minor i
      if (chordDef.quality === '') {
        quality = 'm';
        numeral = numeral.toLowerCase(); // I -> i
      }
      // Convert I7 to i7 (minor 7th)
      else if (chordDef.quality === '7') {
        quality = 'm7';
        numeral = numeral.toLowerCase();
      }
    }

    const chordName = chordRoot + quality;
    const notes = getChordNotes(chordRoot, quality);

    return {
      numeral,
      chord: chordName,
      notes,
    };
  });
}
