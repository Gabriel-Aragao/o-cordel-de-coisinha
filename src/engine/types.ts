import { ISoundManager } from '../audio/types';

export type SceneId =
  | 'STUDIO'
  | 'STAGE_1_CHUPACABRA'
  | 'STAGE_2_FULOZINHA'
  | 'STAGE_3_RASGAMORTALHA'
  | 'STAGE_4_BOTIJA'
  | 'VICTORY';

export type MysticItemId = 'carimbo' | 'folha' | 'pena' | 'tinta';

export interface InventoryState {
  carimbo: boolean;
  folha: boolean;
  pena: boolean;
  tinta: boolean;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface MouseState {
  x: number;
  y: number;
  isDown: boolean;
  clicked: boolean;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean; // Espaço / Aboio (curto) ou Grito (segurar)
  actionHeldTime: number; // Tempo em segundos segurando a ação
  interact: boolean; // E / Enter
  mouse: MouseState;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  shape: 'rect' | 'circle' | 'triangle';
  vx?: number;
  vy?: number;
  speed?: number;
  active?: boolean;
}

export interface IScene {
  id: SceneId;
  name: string;
  init(engine: IGameEngine): void;
  update(dt: number, input: InputState, engine: IGameEngine): void;
  render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void;
  destroy(): void;
}

export interface IGameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  currentSceneId: SceneId;
  inventory: InventoryState;
  playerName: string;
  fps: number;
  sound: ISoundManager;
  switchScene(sceneId: SceneId): void;
  unlockItem(item: MysticItemId): void;
  setPlayerName(name: string): void;
}
