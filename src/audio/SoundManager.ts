import {
  ISoundManager,
  BGMTrackId,
  SFXName,
  SoundManagerConfig
} from './types';
import { SFXSynth } from './SFXSynth';
import { MusicTracker } from './MusicTracker';

export class SoundManager implements ISoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private sfxSynth: SFXSynth | null = null;
  private musicTracker: MusicTracker | null = null;

  private masterVolume: number = 0.8;
  private bgmVolume: number = 0.6;
  private sfxVolume: number = 0.85;
  private muted: boolean = false;
  private initialized: boolean = false;

  private pendingTrack: BGMTrackId | null = null;

  constructor(config?: SoundManagerConfig) {
    if (config) {
      if (config.masterVolume !== undefined) this.masterVolume = config.masterVolume;
      if (config.bgmVolume !== undefined) this.bgmVolume = config.bgmVolume;
      if (config.sfxVolume !== undefined) this.sfxVolume = config.sfxVolume;
      if (config.muted !== undefined) this.muted = config.muted;
    }
  }

  public async init(): Promise<void> {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) {
        console.warn('Web Audio API não suportada neste navegador.');
        return;
      }

      this.ctx = new AudioCtxClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // BGM Gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.sfxSynth = new SFXSynth(this.ctx, this.sfxGain);
      this.musicTracker = new MusicTracker(this.ctx, this.bgmGain);

      this.initialized = true;

      if (this.pendingTrack) {
        this.playBGM(this.pendingTrack);
        this.pendingTrack = null;
      }
    } catch (err) {
      console.error('Falha ao inicializar Web Audio Context:', err);
    }
  }

  public async resume(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('Não foi possível resumir AudioContext:', err);
      }
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.muted ? 0 : this.masterVolume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.muted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 0.05);
    }
  }

  public getBGMVolume(): number {
    return this.bgmVolume;
  }

  public setBGMVolume(vol: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, this.ctx.currentTime + 0.05);
    }
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public setSFXVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.sfxGain.gain.linearRampToValueAtTime(this.sfxVolume, this.ctx.currentTime + 0.05);
    }
  }

  // --- BGM ---
  public playBGM(track: BGMTrackId, crossfadeDuration: number = 0.3): void {
    if (!this.initialized || !this.musicTracker || !this.ctx) {
      this.pendingTrack = track;
      return;
    }

    if (this.bgmGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
      this.bgmGain.gain.linearRampToValueAtTime(0.01, now + crossfadeDuration / 2);
      this.bgmGain.gain.linearRampToValueAtTime(this.bgmVolume, now + crossfadeDuration);
    }

    this.musicTracker.play(track);
  }

  public stopBGM(fadeDuration: number = 0.3): void {
    if (!this.musicTracker || !this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(0.001, now + fadeDuration);
    setTimeout(() => {
      this.musicTracker?.stop();
    }, fadeDuration * 1000);
  }

  public setBGMState(state: { tension?: number; tempoMultiplier?: number }): void {
    if (!this.musicTracker) return;
    if (state.tension !== undefined) {
      this.musicTracker.setTension(state.tension);
    }
    if (state.tempoMultiplier !== undefined) {
      this.musicTracker.setTempoMultiplier(state.tempoMultiplier);
    }
  }

  // --- SFX Router ---
  public playSFX(name: SFXName): void {
    this.resume();
    if (!this.sfxSynth) return;

    switch (name) {
      case 'aboio':
        this.sfxSynth.playAboio();
        break;
      case 'grito':
        this.sfxSynth.playGrito();
        break;
      case 'berro_bode':
        this.sfxSynth.playBerroBode(false);
        break;
      case 'chupacabra_rosnado':
        this.sfxSynth.playChupaCabraRosnado();
        break;
      case 'cumade_assobio':
        this.sfxSynth.playCumadeAssobio();
        break;
      case 'cordel_folhear':
        this.sfxSynth.playCordelFolhear();
        break;
      case 'sino_badalo':
        this.sfxSynth.playSinoBadalo();
        break;
      case 'prensa_impacto':
        this.sfxSynth.playPrensaImpacto();
        break;
      case 'chicote':
        this.sfxSynth.playChicote();
        break;
      case 'pickup':
        this.sfxSynth.playPickup();
        break;
      case 'item_descobrir':
        this.sfxSynth.playItemDescobrir();
        break;
      case 'passos':
        this.sfxSynth.playPassos();
        break;
      case 'escavacao':
        this.sfxSynth.playEscavacao();
        break;
      case 'rasga_canto':
        this.sfxSynth.playRasgaCanto();
        break;
      case 'ui_click':
        this.sfxSynth.playUIClick();
        break;
      case 'ui_hover':
        this.sfxSynth.playUIHover();
        break;
      case 'victory_jingle':
        this.sfxSynth.playVictoryJingle();
        break;
      case 'defeat_jingle':
        this.sfxSynth.playDefeatJingle();
        break;
    }
  }

  // Métodos Diretos de SFX para conveniência
  public playAboio(duration?: number): void {
    this.resume();
    this.sfxSynth?.playAboio(duration);
  }

  public playGrito(): void {
    this.resume();
    this.sfxSynth?.playGrito();
  }

  public playBerroBode(scared: boolean = false): void {
    this.resume();
    this.sfxSynth?.playBerroBode(scared);
  }

  public playChupaCabraRosnado(): void {
    this.resume();
    this.sfxSynth?.playChupaCabraRosnado();
  }

  public playCumadeAssobio(intensity: number = 1.0): void {
    this.resume();
    this.sfxSynth?.playCumadeAssobio(intensity);
  }

  public playCordelFolhear(): void {
    this.resume();
    this.sfxSynth?.playCordelFolhear();
  }

  public playSinoBadalo(): void {
    this.resume();
    this.sfxSynth?.playSinoBadalo();
  }

  public playPrensaImpacto(): void {
    this.resume();
    this.sfxSynth?.playPrensaImpacto();
  }

  public playChicote(): void {
    this.resume();
    this.sfxSynth?.playChicote();
  }

  public playPickup(): void {
    this.resume();
    this.sfxSynth?.playPickup();
  }

  public playItemDescobrir(): void {
    this.resume();
    this.sfxSynth?.playItemDescobrir();
  }

  public playPassos(): void {
    this.resume();
    this.sfxSynth?.playPassos();
  }

  public playEscavacao(): void {
    this.resume();
    this.sfxSynth?.playEscavacao();
  }

  public playRasgaCanto(): void {
    this.resume();
    this.sfxSynth?.playRasgaCanto();
  }

  public playUIClick(): void {
    this.resume();
    this.sfxSynth?.playUIClick();
  }

  public playUIHover(): void {
    this.resume();
    this.sfxSynth?.playUIHover();
  }

  public playVictoryJingle(): void {
    this.resume();
    this.sfxSynth?.playVictoryJingle();
  }

  public playDefeatJingle(): void {
    this.resume();
    this.sfxSynth?.playDefeatJingle();
  }

  public playGlitchCensura(): void {
    this.resume();
    this.sfxSynth?.playGlitchCensura();
  }

  public playHurtCacto(): void {
    this.resume();
    this.sfxSynth?.playHurtCacto();
  }

  public playFruitEat(): void {
    this.resume();
    this.sfxSynth?.playFruitEat();
  }

  public playBerroPavorBode(): void {
    this.resume();
    this.sfxSynth?.playBerroPavorBode();
  }

  public playViolaRepente(): void {
    this.resume();
    this.sfxSynth?.playViolaRepente();
  }
}
