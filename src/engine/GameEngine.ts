import {
  IGameEngine,
  IScene,
  SceneId,
  MysticItemId,
  InventoryState,
  InputState
} from './types';
import { InputManager } from './input';
import { SoundManager } from '../audio/SoundManager';
import { ISoundManager, BGMTrackId } from '../audio/types';
import { JuiceManager } from './juice';
import { MessageAndDialogManager } from './MessageAndDialogManager';
import { StudioScene } from './scenes/StudioScene';
import { Stage1ChupaCabraScene } from './scenes/Stage1ChupaCabraScene';
import { Stage2FulozinhaScene } from './scenes/Stage2FulozinhaScene';
import { Stage3RasgaMortalhaScene } from './scenes/Stage3RasgaMortalhaScene';
import { Stage4BotijaScene } from './scenes/Stage4BotijaScene';
import { VictoryScene } from './scenes/VictoryScene';

export class GameEngine implements IGameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public currentSceneId: SceneId = 'STUDIO';
  public inventory: InventoryState = {
    carimbo: false,
    folha: false,
    pena: false,
    tinta: false
  };
  public playerName: string = 'Coisinha';
  public fps: number = 60;
  public sound: ISoundManager;
  public juice: JuiceManager;
  public messages!: MessageAndDialogManager;

  private scenes: Map<SceneId, IScene> = new Map();
  private currentScene: IScene | null = null;
  private inputManager: InputManager;
  private lastTime: number = 0;
  private frameCount: number = 0;
  private fpsTimer: number = 0;
  private isRunning: boolean = false;

  // Listeners para sincronizar com a UI do DOM
  public onStateChange?: (engine: GameEngine) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Não foi possível obter o contexto 2D do Canvas.');
    }
    this.ctx = context;
    this.inputManager = new InputManager(this.canvas);
    this.sound = new SoundManager();
    this.juice = new JuiceManager();
    this.messages = new MessageAndDialogManager();

    this.registerScenes();
  }

  private registerScenes(): void {
    this.scenes.set('STUDIO', new StudioScene());
    this.scenes.set('STAGE_1_CHUPACABRA', new Stage1ChupaCabraScene());
    this.scenes.set('STAGE_2_FULOZINHA', new Stage2FulozinhaScene());
    this.scenes.set('STAGE_3_RASGAMORTALHA', new Stage3RasgaMortalhaScene());
    this.scenes.set('STAGE_4_BOTIJA', new Stage4BotijaScene());
    this.scenes.set('VICTORY', new VictoryScene());
  }

  public start(): void {
    this.switchSceneDirect('STUDIO');
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.loop(time));
  }

  private sceneToBgmTrack(sceneId: SceneId): BGMTrackId {
    switch (sceneId) {
      case 'STUDIO':
        return 'STUDIO';
      case 'STAGE_1_CHUPACABRA':
        return 'STAGE1_CHUPACABRA';
      case 'STAGE_2_FULOZINHA':
        return 'STAGE2_FULOZINHA';
      case 'STAGE_3_RASGAMORTALHA':
        return 'STAGE3_RASGAMORTALHA';
      case 'STAGE_4_BOTIJA':
        return 'STAGE4_BOTIJA';
      case 'VICTORY':
        return 'VICTORY';
    }
  }

  private switchSceneDirect(sceneId: SceneId): void {
    if (this.currentScene) {
      this.currentScene.destroy();
    }

    const nextScene = this.scenes.get(sceneId);
    if (!nextScene) {
      console.error(`Cena não encontrada: ${sceneId}`);
      return;
    }

    this.currentSceneId = sceneId;
    this.currentScene = nextScene;
    this.currentScene.init(this);

    // Transição da trilha BGM
    const bgmTrack = this.sceneToBgmTrack(sceneId);
    this.sound.playBGM(bgmTrack);

    if (this.onStateChange) {
      this.onStateChange(this);
    }
  }

  public switchScene(sceneId: SceneId): void {
    // Efeito de transição folheada de cordel com som
    this.sound.playCordelFolhear();
    this.juice.transition.start(() => {
      this.switchSceneDirect(sceneId);
    });
  }

  public unlockItem(item: MysticItemId): void {
    this.inventory[item] = true;
    this.sound.playItemDescobrir();
    this.juice.shake.addTrauma(0.4);
    if (this.onStateChange) {
      this.onStateChange(this);
    }
  }

  public setPlayerName(name: string): void {
    this.playerName = name.trim() || 'Coisinha';
    if (this.onStateChange) {
      this.onStateChange(this);
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    // Delta time em segundos com clamp para evitar saltos
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Medição de FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.frameCount = 0;
      this.fpsTimer = 0;
      if (this.onStateChange) {
        this.onStateChange(this);
      }
    }

    // Input update e snapshot
    this.inputManager.update(dt);
    const input: InputState = this.inputManager.getState();

    // Juice update (partículas, screenshake e transição)
    this.juice.update(dt);

    // Message and Dialog update
    this.messages.update(dt, input, this);

    // Update da cena ativa
    if (this.currentScene) {
      this.currentScene.update(dt, input, this);
    }

    // Render da cena ativa com screen shake
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    if (this.juice.shake.offsetX !== 0 || this.juice.shake.offsetY !== 0) {
      this.ctx.translate(this.juice.shake.offsetX, this.juice.shake.offsetY);
    }

    if (this.currentScene) {
      this.currentScene.render(this.ctx, this);
    }

    // Partículas globais
    this.juice.renderParticles(this.ctx);

    this.ctx.restore();

    // RENDERIZAÇÃO ESTREITA DO PAINEL DE DIÁLOGOS E MENSAGENS ABAIXO DO GAMEPLAY (Y: 460 a 600)
    // Mantém o Viewport do Jogo (0 a 460px) 100% Desobstruído e Sem Sobreposição sobre Itens/Salas
    this.messages.renderBottomPanel(this.ctx, this.canvas.width, this.canvas.height);

    // Transição visual de Cordel por cima
    this.juice.renderTransition(this.ctx, this.canvas.width, this.canvas.height);

    requestAnimationFrame((time) => this.loop(time));
  }

  public stop(): void {
    this.isRunning = false;
    this.inputManager.destroy();
  }
}
