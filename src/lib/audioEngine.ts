// Guitar chord audio synthesis using Web Audio API

// Note frequencies (A4 = 440Hz standard tuning)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
};

// Get frequency for a note, with octave adjustment
function getNoteFrequency(note: string, octave: number = 4): number {
  const baseFreq = NOTE_FREQUENCIES[note];
  if (!baseFreq) return 440;

  // Adjust for octave (4 is the base octave)
  const octaveMultiplier = Math.pow(2, octave - 4);
  return baseFreq * octaveMultiplier;
}

// Guitar string base frequencies (standard tuning, low to high)
const GUITAR_STRINGS = [
  { note: 'E', octave: 2 },  // Low E
  { note: 'A', octave: 2 },  // A
  { note: 'D', octave: 3 },  // D
  { note: 'G', octave: 3 },  // G
  { note: 'B', octave: 3 },  // B
  { note: 'E', octave: 4 },  // High E
];

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);
    }
    return this.audioContext;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  // Play a single note with guitar-like characteristics
  private playNote(frequency: number, startTime: number, duration: number = 1.5): void {
    const ctx = this.getContext();
    if (!this.masterGain) return;

    // Create oscillators for a richer guitar sound
    const fundamental = ctx.createOscillator();
    const harmonic2 = ctx.createOscillator();
    const harmonic3 = ctx.createOscillator();

    // Gain nodes for each harmonic
    const fundGain = ctx.createGain();
    const harm2Gain = ctx.createGain();
    const harm3Gain = ctx.createGain();

    // Set frequencies
    fundamental.frequency.value = frequency;
    harmonic2.frequency.value = frequency * 2;
    harmonic3.frequency.value = frequency * 3;

    // Use triangle wave for warmer guitar-like tone
    fundamental.type = 'triangle';
    harmonic2.type = 'triangle';
    harmonic3.type = 'sine';

    // Set harmonic levels
    fundGain.gain.value = 0.6;
    harm2Gain.gain.value = 0.25;
    harm3Gain.gain.value = 0.15;

    // Connect oscillators through gains
    fundamental.connect(fundGain);
    harmonic2.connect(harm2Gain);
    harmonic3.connect(harm3Gain);

    // Create envelope for guitar-like attack and decay
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, startTime);
    envelope.gain.linearRampToValueAtTime(0.8, startTime + 0.02); // Quick attack
    envelope.gain.exponentialRampToValueAtTime(0.3, startTime + 0.1); // Initial decay
    envelope.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Sustain decay

    // Connect to envelope
    fundGain.connect(envelope);
    harm2Gain.connect(envelope);
    harm3Gain.connect(envelope);

    // Connect envelope to master
    envelope.connect(this.masterGain);

    // Start and stop
    fundamental.start(startTime);
    harmonic2.start(startTime);
    harmonic3.start(startTime);

    fundamental.stop(startTime + duration);
    harmonic2.stop(startTime + duration);
    harmonic3.stop(startTime + duration);
  }

  // Play a chord given an array of note names
  playChord(notes: string[], strumDelay: number = 0.03): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Assign octaves to create a natural guitar voicing
    // Lower notes get lower octaves
    const notesWithOctaves = notes.map((note, index) => {
      // Distribute across octaves 3-4 for natural guitar range
      const octave = index < notes.length / 2 ? 3 : 4;
      return { note, octave };
    });

    // Play each note with slight strum delay
    notesWithOctaves.forEach((noteData, index) => {
      const frequency = getNoteFrequency(noteData.note, noteData.octave);
      const startTime = now + (index * strumDelay);
      this.playNote(frequency, startTime);
    });
  }

  // Play chord from fret positions (more accurate guitar voicing)
  playChordFromFrets(frets: number[]): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const strumDelay = 0.025;

    frets.forEach((fret, stringIndex) => {
      if (fret === -1) return; // Muted string

      const stringInfo = GUITAR_STRINGS[stringIndex];
      const baseFreq = getNoteFrequency(stringInfo.note, stringInfo.octave);
      const frequency = baseFreq * Math.pow(2, fret / 12); // Fret raises pitch

      const startTime = now + (stringIndex * strumDelay);
      this.playNote(frequency, startTime, 2);
    });
  }

  // Play a single note (for scale practice, etc.)
  playSingleNote(note: string, octave: number = 4): void {
    const ctx = this.getContext();
    const frequency = getNoteFrequency(note, octave);
    this.playNote(frequency, ctx.currentTime, 1);
  }

  // Resume audio context (needed after user interaction)
  async resume(): Promise<void> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
