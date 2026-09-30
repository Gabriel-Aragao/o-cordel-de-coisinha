export type BGMTrackId =
  | 'STUDIO'
  | 'STAGE1_CHUPACABRA'
  | 'STAGE2_FULOZINHA'
  | 'STAGE3_RASGAMORTALHA'
  | 'STAGE4_BOTIJA'
  | 'VICTORY';

export type SFXName =
  | 'aboio'
  | 'grito'
  | 'berro_bode'
  | 'berro_pavor_bode'
  | 'chupacabra_rosnado'
  | 'cumade_assobio'
  | 'cordel_folhear'
  | 'sino_badalo'
  | 'prensa_impacto'
  | 'chicote'
  | 'pickup'
  | 'item_descobrir'
  | 'passos'
  | 'escavacao'
  | 'rasga_canto'
  | 'ui_click'
  | 'ui_hover'
  | 'victory_jingle'
  | 'defeat_jingle'
  | 'glitch_censura'
  | 'hurt_cacto'
  | 'fruit_eat'
  | 'viola_repente';

export interface SoundManagerConfig {
  masterVolume?: number;
  bgmVolume?: number;
  sfxVolume?: number;
  muted?: boolean;
}

export interface ISoundManager {
  init(): Promise<void>;
  resume(): Promise<void>;
  isMuted(): boolean;
  setMuted(muted: boolean): void;
  toggleMute(): boolean;
  getMasterVolume(): number;
  setMasterVolume(vol: number): void;
  getBGMVolume(): number;
  setBGMVolume(vol: number): void;
  getSFXVolume(): number;
  setSFXVolume(vol: number): void;

  playBGM(track: BGMTrackId, crossfadeDuration?: number): void;
  stopBGM(fadeDuration?: number): void;
  setBGMState(state: { tension?: number; tempoMultiplier?: number }): void;

  playSFX(name: SFXName, options?: { volume?: number; pitchShift?: number }): void;
  playAboio(duration?: number): void;
  playGrito(): void;
  playBerroBode(scared?: boolean): void;
  playChupaCabraRosnado(): void;
  playCumadeAssobio(intensity?: number): void;
  playCordelFolhear(): void;
  playSinoBadalo(): void;
  playPrensaImpacto(): void;
  playChicote(): void;
  playPickup(): void;
  playItemDescobrir(): void;
  playPassos(): void;
  playEscavacao(): void;
  playRasgaCanto(): void;
  playUIClick(): void;
  playUIHover(): void;
  playVictoryJingle(): void;
  playDefeatJingle(): void;
  playGlitchCensura(): void;
  playHurtCacto(): void;
  playFruitEat(): void;
  playBerroPavorBode(): void;
  playViolaRepente(): void;
}
