export class SFXSynth {
  private ctx: AudioContext;
  private sfxGain: GainNode;

  constructor(ctx: AudioContext, sfxGain: GainNode) {
    this.ctx = ctx;
    this.sfxGain = sfxGain;
  }

  // Helper para criar buffer de ruído branco
  private createNoiseBuffer(duration: number): AudioBuffer {
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // 1. ABOIO TRADICIONAL NORDESTINO (Canto ondulado de vaqueiro: "Êeee-ôoooo-êee")
  public playAboio(duration: number = 1.4): void {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    oscHarmonic.type = 'sine';
    vibrato.type = 'sine';

    // Frequência do vibrato tradicional (5.5 Hz)
    vibrato.frequency.setValueAtTime(5.5, t);
    vibratoGain.gain.setValueAtTime(0, t);
    vibratoGain.gain.linearRampToValueAtTime(14, t + 0.3); // Aumenta vibrato conforme o ar se estende

    vibrato.connect(osc.frequency);
    vibrato.connect(oscHarmonic.frequency);

    // Contorno melódico característico do Aboio (Modo Dórico / Sertanejo: E4 -> G4 -> A4 -> G4 -> D4)
    osc.frequency.setValueAtTime(329.63, t); // E4
    osc.frequency.exponentialRampToValueAtTime(440.0, t + 0.35); // A4
    osc.frequency.linearRampToValueAtTime(392.0, t + 0.8); // G4
    osc.frequency.exponentialRampToValueAtTime(293.66, t + duration); // D4

    oscHarmonic.frequency.setValueAtTime(329.63 * 2, t);
    oscHarmonic.frequency.exponentialRampToValueAtTime(440.0 * 2, t + 0.35);
    oscHarmonic.frequency.linearRampToValueAtTime(392.0 * 2, t + 0.8);
    oscHarmonic.frequency.exponentialRampToValueAtTime(293.66 * 2, t + duration);

    // Filtro suave para corpo orgânico
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.linearRampToValueAtTime(2400, t + 0.4);
    filter.frequency.exponentialRampToValueAtTime(800, t + duration);

    // Envelope de volume (Ataque vocal suave + sustentação + decaimento)
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.15);
    gain.gain.setValueAtTime(0.32, t + duration - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.15, t);

    osc.connect(filter);
    oscHarmonic.connect(harmGain);
    harmGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    vibrato.start(t);
    osc.start(t);
    oscHarmonic.start(t);

    vibrato.stop(t + duration);
    osc.stop(t + duration);
    oscHarmonic.stop(t + duration);
  }

  // 2. GRITO DE ESPANTAR (Ação de segurar - voz áspera com modulação de queda)
  public playGrito(): void {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const noise = this.ctx.createBufferSource();
    const noiseFilter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();
    const mainGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.45);

    // Tremulação na garganta
    lfo.frequency.setValueAtTime(30, t);
    lfoGain.gain.setValueAtTime(40, t);
    lfo.connect(osc.frequency);

    // Ruído soprado
    noise.buffer = this.createNoiseBuffer(0.45);
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, t);
    noiseFilter.Q.setValueAtTime(2, t);
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mainGain);

    mainGain.gain.setValueAtTime(0.01, t);
    mainGain.gain.linearRampToValueAtTime(0.4, t + 0.04);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(mainGain);
    mainGain.connect(this.sfxGain);

    lfo.start(t);
    osc.start(t);
    noise.start(t);

    lfo.stop(t + 0.45);
    osc.stop(t + 0.45);
    noise.stop(t + 0.45);
  }

  // 3. BERRO DOS BODES (Balido trêmulo: "Bééé-é-é")
  public playBerroBode(scared: boolean = false): void {
    const t = this.ctx.currentTime;
    const duration = scared ? 0.65 : 0.45;
    const osc = this.ctx.createOscillator();
    const amLfo = this.ctx.createOscillator();
    const amGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const masterGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = scared ? 380 : 310;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.15, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, t + duration);

    // Modulação de balido rápido (15 Hz)
    amLfo.type = 'sine';
    amLfo.frequency.setValueAtTime(scared ? 18 : 13, t);
    amGain.gain.setValueAtTime(0.4, t);

    // Filtro formante nasal caprino
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(3.5, t);

    masterGain.gain.setValueAtTime(0.01, t);
    masterGain.gain.linearRampToValueAtTime(0.35, t + 0.05);
    masterGain.gain.setValueAtTime(0.3, t + duration - 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    // Conexões
    amLfo.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.sfxGain);

    amLfo.start(t);
    osc.start(t);
    amLfo.stop(t + duration);
    osc.stop(t + duration);
  }

  // 4. ROSNADO DO CHUPA-CABRA (Gutural, grave, cavernoso e ameaçador)
  public playChupaCabraRosnado(): void {
    const t = this.ctx.currentTime;
    const duration = 0.8;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const noise = this.ctx.createBufferSource();
    const noiseFilter = this.ctx.createBiquadFilter();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(75, t);
    osc1.frequency.linearRampToValueAtTime(60, t + 0.4);
    osc1.frequency.exponentialRampToValueAtTime(45, t + duration);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, t);
    osc2.frequency.exponentialRampToValueAtTime(50, t + duration);

    // Modulação agressiva (tremor de rosnado 28Hz)
    lfo.type = 'sawtooth';
    lfo.frequency.setValueAtTime(28, t);
    lfoGain.gain.setValueAtTime(35, t);
    lfo.connect(osc1.frequency);

    // Camada de respiração cavernosa
    noise.buffer = this.createNoiseBuffer(duration);
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(350, t);
    noise.connect(noiseFilter);

    // Filtro passa-baixa saturado
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.45, t + 0.08);
    gain.gain.setValueAtTime(0.4, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    noiseFilter.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    lfo.start(t);
    osc1.start(t);
    osc2.start(t);
    noise.start(t);

    lfo.stop(t + duration);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
    noise.stop(t + duration);
  }

  // 5. ASSOBIO MÍSTICO DA CUMADE FULOZINHA (Agudo, sinuoso, ecoante)
  public playCumadeAssobio(intensity: number = 1.0): void {
    const t = this.ctx.currentTime;
    const duration = 0.9;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const delay = this.ctx.createDelay();
    const delayFeedback = this.ctx.createGain();

    osc.type = 'sine';
    osc2.type = 'sine';

    // Variação e glissando místico do assobio (1400Hz -> 2600Hz -> 1800Hz -> 2900Hz)
    const startFreq = 1500 * intensity;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(2600 * intensity, t + 0.25);
    osc.frequency.linearRampToValueAtTime(1900 * intensity, t + 0.5);
    osc.frequency.exponentialRampToValueAtTime(3100 * intensity, t + 0.75);
    osc.frequency.exponentialRampToValueAtTime(1200 * intensity, t + duration);

    osc2.frequency.setValueAtTime(startFreq * 1.5, t);
    osc2.frequency.exponentialRampToValueAtTime(2600 * 1.5 * intensity, t + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(1200 * 1.5 * intensity, t + duration);

    vibrato.frequency.setValueAtTime(8, t);
    vibratoGain.gain.setValueAtTime(25, t);
    vibrato.connect(osc.frequency);

    // Eco / Delay místico
    delay.delayTime.setValueAtTime(0.18, t);
    delayFeedback.gain.setValueAtTime(0.35, t);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(gain);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.08);
    gain.gain.setValueAtTime(0.25, t + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.08, t);

    osc.connect(gain);
    osc.connect(delay);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gain);
    gain.connect(this.sfxGain);

    vibrato.start(t);
    osc.start(t);
    osc2.start(t);

    vibrato.stop(t + duration);
    osc.stop(t + duration);
    osc2.stop(t + duration);
  }

  // 6. FOLHEAR DE PÁGINAS DE CORDEL / XILOGRAVURA (Estalo e farfalhar de papel seco)
  public playCordelFolhear(): void {
    const t = this.ctx.currentTime;
    const duration = 0.22;
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    noise.buffer = this.createNoiseBuffer(duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.linearRampToValueAtTime(1200, t + duration);
    filter.Q.setValueAtTime(2.5, t);

    // Duplo estalo rápido (folheando duas páginas em sequência)
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.07);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.11);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + duration);
  }

  // 7. BADALO DE SINO DA IGREJA (Ressonância rica em harmônicos sacros)
  public playSinoBadalo(): void {
    const t = this.ctx.currentTime;
    const duration = 2.4;
    const fundamental = 523.25; // C5

    // Harmônicos clássicos de sino (fundamental, hum, terceira menor, quinta, oitava, nominal)
    const ratios = [0.5, 1.0, 1.19, 1.5, 2.0, 2.76, 4.07];
    const amplitudes = [0.35, 0.45, 0.3, 0.25, 0.2, 0.15, 0.08];

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, t);

    ratios.forEach((ratio, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * ratio, t);

      // Decaimento exponencial diferente para harmônicos agudos (morrem antes)
      const decayTime = duration / (1 + idx * 0.35);
      gain.gain.setValueAtTime(amplitudes[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + decayTime);
    });

    // Toque mecânico do badalo
    const clank = this.ctx.createBufferSource();
    const clankFilter = this.ctx.createBiquadFilter();
    const clankGain = this.ctx.createGain();
    clank.buffer = this.createNoiseBuffer(0.05);
    clankFilter.type = 'highpass';
    clankFilter.frequency.setValueAtTime(3000, t);
    clankGain.gain.setValueAtTime(0.2, t);
    clankGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    clank.connect(clankFilter);
    clankFilter.connect(clankGain);
    clankGain.connect(masterGain);

    clank.start(t);
    clank.stop(t + 0.05);

    masterGain.connect(this.sfxGain);
  }

  // 8. IMPACTO DA PRENSA DE XILOGRAVURA (Sub-bass potente + estalo de madeira sólida)
  public playPrensaImpacto(): void {
    const t = this.ctx.currentTime;
    const duration = 0.65;

    // Sub thump (queda de 130Hz para 30Hz)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, t);
    sub.frequency.exponentialRampToValueAtTime(32, t + 0.35);

    subGain.gain.setValueAtTime(0.01, t);
    subGain.gain.linearRampToValueAtTime(0.6, t + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    sub.connect(subGain);
    subGain.connect(this.sfxGain);

    // Estalo de madeira e metal
    const crack = this.ctx.createBufferSource();
    const crackFilter = this.ctx.createBiquadFilter();
    const crackGain = this.ctx.createGain();
    crack.buffer = this.createNoiseBuffer(0.18);
    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(800, t);
    crackFilter.Q.setValueAtTime(2.0, t);

    crackGain.gain.setValueAtTime(0.5, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    crack.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(this.sfxGain);

    sub.start(t);
    crack.start(t);
    sub.stop(t + duration);
    crack.stop(t + 0.18);
  }

  // 9. CHICOTADA DE CIPÓ DA CUMADE (Estalo rápido cortante)
  public playChicote(): void {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    noise.buffer = this.createNoiseBuffer(0.12);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.linearRampToValueAtTime(6000, t + 0.03);
    filter.frequency.linearRampToValueAtTime(1500, t + 0.12);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.55, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.12);
  }

  // 10. COLETA DE ITEM MÍSTICO (Arpeggio pentatônico brilhante)
  public playPickup(): void {
    const t = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (Brilho Maior)
    const noteDuration = 0.07;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + i * noteDuration;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }

  // 11. ITEM DESCOBERTO NA MOITA (Brilho místico)
  public playItemDescobrir(): void {
    const t = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // 12. PASSOS NA TERRA BATIDA
  public playPassos(): void {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    noise.buffer = this.createNoiseBuffer(0.07);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, t);
    filter.Q.setValueAtTime(1.5, t);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.07);
  }

  // 13. ESCAVAÇÃO DA BOTIJA
  public playEscavacao(): void {
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    noise.buffer = this.createNoiseBuffer(0.2);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.linearRampToValueAtTime(900, t + 0.1);
    filter.Q.setValueAtTime(2.0, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.2);
  }

  // 14. GRASNADO DA RASGA-MORTALHA (Agouro sinistro)
  public playRasgaCanto(): void {
    const t = this.ctx.currentTime;
    const duration = 0.55;
    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + duration);

    noise.buffer = this.createNoiseBuffer(duration);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    noise.start(t);
    osc.stop(t + duration);
    noise.stop(t + duration);
  }

  // 15. UI CLICK & HOVER
  public playUIClick(): void {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  public playUIHover(): void {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // 16. FANFARRA DE VITÓRIA / JINGLE DE SUCESSO
  public playVictoryJingle(): void {
    const t = this.ctx.currentTime;
    // Fanfarra alegre de forró em D Maior: D4, F#4, A4, D5, E5, F#5, G5, A5, D6
    const seq = [
      { f: 293.66, d: 0.12 },
      { f: 369.99, d: 0.12 },
      { f: 440.0, d: 0.12 },
      { f: 587.33, d: 0.22 },
      { f: 659.25, d: 0.12 },
      { f: 739.99, d: 0.12 },
      { f: 880.0, d: 0.35 }
    ];

    let offset = 0;
    seq.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + offset;

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, noteTime);

      gain.gain.setValueAtTime(0.01, noteTime);
      gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.02);
      gain.gain.setValueAtTime(0.2, noteTime + note.d * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + note.d);

      offset += note.d * 0.85;
    });
  }

  // 17. JINGLE DE DERROTA / AGOURO
  public playDefeatJingle(): void {
    const t = this.ctx.currentTime;
    const seq = [
      { f: 349.23, d: 0.2 }, // F4
      { f: 329.63, d: 0.2 }, // E4
      { f: 311.13, d: 0.25 }, // Eb4
      { f: 261.63, d: 0.6 } // C4 (dissonância fúnebre)
    ];

    let offset = 0;
    seq.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + offset;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, noteTime);

      gain.gain.setValueAtTime(0.01, noteTime);
      gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + note.d);

      offset += note.d * 0.8;
    });
  }
}
