import { BGMTrackId } from './types';

interface NoteEvent {
  note: number; // MIDI note number (0 = rest)
  duration: number; // In 16th note steps (e.g. 1 = 1/16, 2 = 1/8)
  velocity?: number; // 0.0 - 1.0
}

interface Pattern {
  lead: NoteEvent[];
  harmony: NoteEvent[];
  bass: NoteEvent[];
  percussion: number[]; // 0 = none, 1 = triangle open, 2 = triangle closed, 3 = zabumba low, 4 = zabumba rim/bacalhau
}

// Conversão de MIDI para Frequência em Hz
function midiToFreq(midi: number): number {
  if (midi <= 0) return 0;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Nomes de notas para facilitar a composição:
// Oitava 3
const C3 = 48, D3 = 50, Eb3 = 51, E3 = 52, F3 = 53, G3 = 55, A3 = 57, B3 = 59;
// Oitava 4
const C4 = 60, D4 = 62, Eb4 = 63, E4 = 64, F4 = 65, Fs4 = 66, G4 = 67, Ab4 = 68, Gs4 = 68, A4 = 69, Bb4 = 70, B4 = 71;
// Oitava 5
const C5 = 72, Cs5 = 73, D5 = 74, Eb5 = 75, E5 = 76, F5 = 77, Fs5 = 78, G5 = 79, Ab5 = 80, A5 = 81, Bb5 = 82, B5 = 83;
// Oitava 6
const C6 = 84, D6 = 86;

export class MusicTracker {
  private ctx: AudioContext;
  private bgmGain: GainNode;

  private currentTrack: BGMTrackId | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 115;
  private step: number = 0;
  private nextStepTime: number = 0;
  private timerId: number | null = null;
  private tempoMultiplier: number = 1.0;
  private tension: number = 0.0;

  private patterns: Map<BGMTrackId, { bpm: number; patterns: Pattern[] }> = new Map();

  constructor(ctx: AudioContext, bgmGain: GainNode) {
    this.ctx = ctx;
    this.bgmGain = bgmGain;
    this.initPatterns();
  }

  // Composição dos padrões musicais em Baião / Forró / Toada
  private initPatterns(): void {
    // 1. STUDIO: "O Baião da Xilogravura" (Dó/Ré menor nostálgico, 108 BPM)
    const studioPatterns: Pattern[] = [
      {
        lead: [
          { note: D5, duration: 2 }, { note: F5, duration: 2 },
          { note: A5, duration: 4 },
          { note: G5, duration: 2 }, { note: F5, duration: 2 },
          { note: E5, duration: 2 }, { note: D5, duration: 2 },
          // Bar 2
          { note: C5, duration: 2 }, { note: E5, duration: 2 },
          { note: G5, duration: 4 },
          { note: F5, duration: 2 }, { note: E5, duration: 2 },
          { note: D5, duration: 4 }
        ],
        harmony: [
          { note: F4, duration: 2 }, { note: A4, duration: 2 },
          { note: F4, duration: 2 }, { note: A4, duration: 2 },
          { note: G4, duration: 2 }, { note: Bb4, duration: 2 },
          { note: E4, duration: 2 }, { note: G4, duration: 2 },
          // Bar 2
          { note: E4, duration: 2 }, { note: G4, duration: 2 },
          { note: E4, duration: 2 }, { note: G4, duration: 2 },
          { note: F4, duration: 2 }, { note: A4, duration: 2 },
          { note: D4, duration: 4 }
        ],
        bass: [
          { note: D3, duration: 3 }, { note: D3, duration: 1 }, { note: A3, duration: 2 }, { note: D3, duration: 2 },
          { note: C3, duration: 3 }, { note: C3, duration: 1 }, { note: G3, duration: 2 }, { note: C3, duration: 2 },
          // Bar 2
          { note: A3, duration: 3 }, { note: A3, duration: 1 }, { note: E3, duration: 2 }, { note: A3, duration: 2 },
          { note: D3, duration: 4 }, { note: D3, duration: 4 }
        ],
        percussion: [
          3, 2, 4, 1,  3, 2, 4, 1,  3, 2, 4, 1,  3, 2, 4, 1,
          3, 2, 4, 1,  3, 2, 4, 1,  3, 2, 4, 1,  3, 2, 4, 1
        ]
      }
    ];
    this.patterns.set('STUDIO', { bpm: 108, patterns: studioPatterns });

    // 2. STAGE 1: "O Galope do Chupa-Cabra" (Mi menor enérgico, 132 BPM, Baião Galopado)
    const stage1Patterns: Pattern[] = [
      {
        lead: [
          { note: E5, duration: 1 }, { note: G5, duration: 1 }, { note: B5, duration: 2 },
          { note: A5, duration: 2 }, { note: G5, duration: 2 },
          { note: Fs5, duration: 1 }, { note: G5, duration: 1 }, { note: A5, duration: 2 },
          { note: G5, duration: 2 }, { note: E5, duration: 2 },
          // Bar 2
          { note: E5, duration: 1 }, { note: G5, duration: 1 }, { note: B5, duration: 2 },
          { note: D6, duration: 2 }, { note: B5, duration: 2 },
          { note: A5, duration: 2 }, { note: B5, duration: 2 },
          { note: E5, duration: 4 }
        ],
        harmony: [
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: A4, duration: 2 }, { note: C5, duration: 2 },
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          // Bar 2
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: A4, duration: 2 }, { note: C5, duration: 2 },
          { note: Fs4, duration: 2 }, { note: A4, duration: 2 },
          { note: E4, duration: 4 }
        ],
        bass: [
          { note: E3, duration: 3 }, { note: E3, duration: 1 }, { note: B3, duration: 2 }, { note: E3, duration: 2 },
          { note: A3, duration: 3 }, { note: A3, duration: 1 }, { note: E3, duration: 2 }, { note: A3, duration: 2 },
          // Bar 2
          { note: E3, duration: 3 }, { note: E3, duration: 1 }, { note: B3, duration: 2 }, { note: E3, duration: 2 },
          { note: B3, duration: 2 }, { note: B3, duration: 2 }, { note: E3, duration: 4 }
        ],
        percussion: [
          3, 4, 2, 1,  3, 4, 2, 1,  3, 4, 2, 1,  3, 4, 2, 1,
          3, 4, 2, 1,  3, 4, 2, 1,  3, 4, 2, 1,  3, 4, 2, 1
        ]
      }
    ];
    this.patterns.set('STAGE1_CHUPACABRA', { bpm: 132, patterns: stage1Patterns });

    // 3. STAGE 2: "O Mistério de Fulô" (Lá menor com arpeggios ondulantes, 118 BPM)
    const stage2Patterns: Pattern[] = [
      {
        lead: [
          { note: A5, duration: 3 }, { note: C6, duration: 1 }, { note: B5, duration: 2 }, { note: A5, duration: 2 },
          { note: G5, duration: 2 }, { note: E5, duration: 2 }, { note: G5, duration: 4 },
          // Bar 2
          { note: F5, duration: 2 }, { note: A5, duration: 2 }, { note: G5, duration: 2 }, { note: F5, duration: 2 },
          { note: E5, duration: 4 }, { note: A5, duration: 4 }
        ],
        harmony: [
          { note: C5, duration: 2 }, { note: E5, duration: 2 },
          { note: C5, duration: 2 }, { note: E5, duration: 2 },
          { note: B4, duration: 2 }, { note: D5, duration: 2 },
          { note: B4, duration: 2 }, { note: D5, duration: 2 },
          // Bar 2
          { note: A4, duration: 2 }, { note: C5, duration: 2 },
          { note: A4, duration: 2 }, { note: C5, duration: 2 },
          { note: Gs4, duration: 4 }, { note: A4, duration: 4 }
        ],
        bass: [
          { note: A3, duration: 3 }, { note: A3, duration: 1 }, { note: E3, duration: 2 }, { note: A3, duration: 2 },
          { note: G3, duration: 3 }, { note: G3, duration: 1 }, { note: D3, duration: 2 }, { note: G3, duration: 2 },
          // Bar 2
          { note: F3, duration: 3 }, { note: F3, duration: 1 }, { note: C3, duration: 2 }, { note: F3, duration: 2 },
          { note: E3, duration: 4 }, { note: A3, duration: 4 }
        ],
        percussion: [
          3, 2, 4, 1,  0, 2, 4, 1,  3, 2, 4, 1,  0, 2, 4, 1,
          3, 2, 4, 1,  0, 2, 4, 1,  3, 2, 4, 1,  3, 2, 4, 1
        ]
      }
    ];
    this.patterns.set('STAGE2_FULOZINHA', { bpm: 118, patterns: stage2Patterns });

    // 4. STAGE 3: "A Toada da Rasga-Mortalha" (Sol Dórico, 98 BPM, dedilhado sertanejo)
    const stage3Patterns: Pattern[] = [
      {
        lead: [
          { note: G5, duration: 2 }, { note: Bb5, duration: 2 }, { note: D6, duration: 4 },
          { note: C6, duration: 2 }, { note: Bb5, duration: 2 }, { note: A5, duration: 4 },
          // Bar 2
          { note: F5, duration: 2 }, { note: A5, duration: 2 }, { note: C6, duration: 4 },
          { note: Bb5, duration: 2 }, { note: A5, duration: 2 }, { note: G5, duration: 4 }
        ],
        harmony: [
          { note: D4, duration: 1 }, { note: G4, duration: 1 }, { note: Bb4, duration: 2 },
          { note: D4, duration: 1 }, { note: G4, duration: 1 }, { note: Bb4, duration: 2 },
          { note: F4, duration: 1 }, { note: A4, duration: 1 }, { note: C5, duration: 2 },
          { note: F4, duration: 1 }, { note: A4, duration: 1 }, { note: C5, duration: 2 },
          // Bar 2
          { note: D4, duration: 1 }, { note: F4, duration: 1 }, { note: A4, duration: 2 },
          { note: D4, duration: 1 }, { note: F4, duration: 1 }, { note: A4, duration: 2 },
          { note: D4, duration: 1 }, { note: G4, duration: 1 }, { note: Bb4, duration: 4 }
        ],
        bass: [
          { note: G3, duration: 4 }, { note: D3, duration: 4 },
          { note: F3, duration: 4 }, { note: C3, duration: 4 },
          // Bar 2
          { note: D3, duration: 4 }, { note: A3, duration: 4 },
          { note: G3, duration: 8 }
        ],
        percussion: [
          3, 1, 2, 1,  4, 1, 2, 1,  3, 1, 2, 1,  4, 1, 2, 1,
          3, 1, 2, 1,  4, 1, 2, 1,  3, 1, 2, 1,  3, 4, 1, 2
        ]
      }
    ];
    this.patterns.set('STAGE3_RASGAMORTALHA', { bpm: 98, patterns: stage3Patterns });

    // 5. STAGE 4: "A Botija e a Paróquia" (Dó Menor tenso / sacro, 124 BPM)
    const stage4Patterns: Pattern[] = [
      {
        lead: [
          { note: C5, duration: 2 }, { note: Eb5, duration: 2 }, { note: G5, duration: 3 }, { note: Ab5, duration: 1 },
          { note: G5, duration: 2 }, { note: F5, duration: 2 }, { note: Eb5, duration: 4 },
          // Bar 2
          { note: D5, duration: 2 }, { note: F5, duration: 2 }, { note: Ab5, duration: 4 },
          { note: G5, duration: 2 }, { note: D5, duration: 2 }, { note: C5, duration: 4 }
        ],
        harmony: [
          { note: Eb4, duration: 2 }, { note: G4, duration: 2 },
          { note: Eb4, duration: 2 }, { note: G4, duration: 2 },
          { note: F4, duration: 2 }, { note: Ab4, duration: 2 },
          { note: Eb4, duration: 2 }, { note: G4, duration: 2 },
          // Bar 2
          { note: D4, duration: 2 }, { note: F4, duration: 2 },
          { note: D4, duration: 2 }, { note: F4, duration: 2 },
          { note: B3, duration: 2 }, { note: D4, duration: 2 },
          { note: C4, duration: 4 }
        ],
        bass: [
          { note: C3, duration: 3 }, { note: C3, duration: 1 }, { note: G3, duration: 2 }, { note: C3, duration: 2 },
          { note: F3, duration: 3 }, { note: F3, duration: 1 }, { note: C3, duration: 2 }, { note: Eb3, duration: 2 },
          // Bar 2
          { note: G3, duration: 3 }, { note: G3, duration: 1 }, { note: D3, duration: 2 }, { note: G3, duration: 2 },
          { note: C3, duration: 4 }, { note: C3, duration: 4 }
        ],
        percussion: [
          3, 0, 4, 1,  3, 2, 4, 1,  3, 0, 4, 1,  3, 2, 4, 1,
          3, 0, 4, 1,  3, 2, 4, 1,  3, 0, 4, 1,  3, 4, 2, 1
        ]
      }
    ];
    this.patterns.set('STAGE4_BOTIJA', { bpm: 124, patterns: stage4Patterns });

    // 6. VICTORY: "O Grande Forró da Prensa Dourada" (Ré Maior / Mixolídio Festivo, 140 BPM)
    const victoryPatterns: Pattern[] = [
      {
        lead: [
          { note: D5, duration: 2 }, { note: Fs5, duration: 2 }, { note: A5, duration: 2 }, { note: D6, duration: 2 },
          { note: Cs5, duration: 2 }, { note: B5, duration: 2 }, { note: A5, duration: 4 },
          // Bar 2
          { note: G5, duration: 2 }, { note: B5, duration: 2 }, { note: A5, duration: 2 }, { note: G5, duration: 2 },
          { note: Fs5, duration: 2 }, { note: E5, duration: 2 }, { note: D5, duration: 4 }
        ],
        harmony: [
          { note: Fs4, duration: 2 }, { note: A4, duration: 2 },
          { note: Fs4, duration: 2 }, { note: A4, duration: 2 },
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: Fs4, duration: 2 }, { note: A4, duration: 2 },
          // Bar 2
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: G4, duration: 2 }, { note: B4, duration: 2 },
          { note: E4, duration: 2 }, { note: A4, duration: 2 },
          { note: D4, duration: 4 }
        ],
        bass: [
          { note: D3, duration: 3 }, { note: D3, duration: 1 }, { note: A3, duration: 2 }, { note: D3, duration: 2 },
          { note: A3, duration: 3 }, { note: A3, duration: 1 }, { note: E3, duration: 2 }, { note: A3, duration: 2 },
          // Bar 2
          { note: G3, duration: 3 }, { note: G3, duration: 1 }, { note: D3, duration: 2 }, { note: G3, duration: 2 },
          { note: A3, duration: 2 }, { note: A3, duration: 2 }, { note: D3, duration: 4 }
        ],
        percussion: [
          3, 4, 1, 2,  3, 4, 1, 2,  3, 4, 1, 2,  3, 4, 1, 2,
          3, 4, 1, 2,  3, 4, 1, 2,  3, 4, 1, 2,  3, 4, 1, 2
        ]
      }
    ];
    this.patterns.set('VICTORY', { bpm: 140, patterns: victoryPatterns });
  }

  public play(trackId: BGMTrackId): void {
    if (this.currentTrack === trackId && this.isPlaying) return;

    this.currentTrack = trackId;
    const trackData = this.patterns.get(trackId);
    if (!trackData) {
      console.warn(`Track não encontrada: ${trackId}`);
      return;
    }

    this.bpm = trackData.bpm;
    this.step = 0;
    this.isPlaying = true;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    this.scheduler();
    this.timerId = window.setInterval(() => this.scheduler(), 25);
  }

  public stop(): void {
    this.isPlaying = false;
    this.currentTrack = null;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public setTension(tension: number): void {
    this.tension = Math.max(0, Math.min(1, tension));
  }

  public setTempoMultiplier(mult: number): void {
    this.tempoMultiplier = Math.max(0.5, Math.min(2.0, mult));
  }

  // Agendador de notas baseado no relógio Web Audio de alta precisão
  private scheduler(): void {
    if (!this.isPlaying || !this.currentTrack) return;

    const trackData = this.patterns.get(this.currentTrack);
    if (!trackData) return;

    const pattern = trackData.patterns[0];
    const totalSteps = 32; // 2 compassos de 16 semi-colcheias
    const effectiveBpm = this.bpm * (1 + this.tension * 0.2) * this.tempoMultiplier;
    const secondsPer16th = 60 / (effectiveBpm * 4);

    while (this.nextStepTime < this.ctx.currentTime + 0.15) {
      this.scheduleStep(this.nextStepTime, this.step, pattern, secondsPer16th);
      this.step = (this.step + 1) % totalSteps;
      this.nextStepTime += secondsPer16th;
    }
  }

  private scheduleStep(time: number, stepIndex: number, pattern: Pattern, stepSec: number): void {
    // 1. LEAD VOICE (Sanfona 8-bit / Lead Chiptune)
    const leadNote = this.findNoteAtStep(pattern.lead, stepIndex);
    if (leadNote && leadNote.note > 0) {
      this.playSynthNote(time, leadNote.note, leadNote.duration * stepSec, 'pulse', 0.22);
    }

    // 2. HARMONY VOICE (Acordes / Arpeggios de Sanfona)
    const harmNote = this.findNoteAtStep(pattern.harmony, stepIndex);
    if (harmNote && harmNote.note > 0) {
      this.playSynthNote(time, harmNote.note, harmNote.duration * stepSec, 'sawtooth', 0.13);
    }

    // 3. BASS VOICE (Zabumba grave)
    const bassNote = this.findNoteAtStep(pattern.bass, stepIndex);
    if (bassNote && bassNote.note > 0) {
      this.playBassNote(time, bassNote.note, bassNote.duration * stepSec);
    }

    // 4. PERCUSSION (Zabumba + Triângulo)
    const percType = pattern.percussion[stepIndex % pattern.percussion.length];
    if (percType > 0) {
      this.playPercussion(time, percType);
    }
  }

  private findNoteAtStep(events: NoteEvent[], targetStep: number): NoteEvent | null {
    let current = 0;
    for (const ev of events) {
      if (current === targetStep) {
        return ev;
      }
      current += ev.duration;
      if (current > targetStep) {
        break;
      }
    }
    return null;
  }

  private playSynthNote(time: number, midi: number, duration: number, type: 'pulse' | 'sawtooth', gainValue: number): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type === 'pulse' ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(midiToFreq(midi), time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'pulse' ? 2400 : 1600, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + duration);

    // Envelope Chiptune ágil
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainValue, time + 0.015);
    gain.gain.setValueAtTime(gainValue * 0.8, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playBassNote(time: number, midi: number, duration: number): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(midiToFreq(midi), time);

    // Punch de zabumba no início
    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.35, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playPercussion(time: number, type: number): void {
    if (type === 1 || type === 2) {
      // Triângulo (1 = aberto, 2 = fechado)
      const noise = this.ctx.createBufferSource();
      const dur = type === 1 ? 0.12 : 0.04;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(type === 1 ? 0.18 : 0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(time);
      noise.stop(time + dur);
    } else if (type === 3) {
      // Zabumba Golpe Grave (Tum)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(time);
      osc.stop(time + 0.12);
    } else if (type === 4) {
      // Zabumba Bacalhau / Aro (Tack seco)
      const noise = this.ctx.createBufferSource();
      const dur = 0.05;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, time);
      filter.Q.setValueAtTime(3.0, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(time);
      noise.stop(time + dur);
    }
  }
}
