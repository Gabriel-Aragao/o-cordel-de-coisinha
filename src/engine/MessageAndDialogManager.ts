import { IGameEngine, InputState } from './types';

export interface DialogLine {
  speaker: string;
  avatarIcon: string;
  text: string;
  isGlitchName?: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
  icon?: string;
  isError?: boolean;
  isSuccess?: boolean;
  timer: number;
  duration: number;
}

export class MessageAndDialogManager {
  // Estado de Diálogo Ativo
  public isDialogActive: boolean = false;
  private currentLines: DialogLine[] = [];
  private currentLineIdx: number = 0;
  public currentNPCId: string = '';
  private onDialogComplete?: () => void;
  private introducedNPCs: Set<string> = new Set();
  public dialogCooldown: number = 0;

  // Fila Atômica Sequencial de Toasts/Mensagens (Anti-Stacking)
  private toastQueue: ToastItem[] = [];
  private activeToast: ToastItem | null = null;
  private lastMessageText: string = '';

  /**
   * Enfileira uma mensagem/toast com garantia anti-stacking e expiração limpa
   */
  public postMessage(
    message: string,
    options: {
      icon?: string;
      isError?: boolean;
      isSuccess?: boolean;
      duration?: number;
    } = {}
  ): void {
    if (!message || message === this.lastMessageText) return;
    this.lastMessageText = message;

    const toast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      icon: options.icon || (options.isError ? '💀' : options.isSuccess ? '✨' : '📜'),
      isError: options.isError,
      isSuccess: options.isSuccess,
      timer: 0,
      duration: options.duration || 3.5
    };

    if (!this.activeToast) {
      this.activeToast = toast;
    } else {
      // Substitui suavemente ou enfileira sem empilhar visualmente
      this.toastQueue.push(toast);
      if (this.toastQueue.length > 3) {
        this.toastQueue.shift();
      }
    }
  }

  public clearToast(): void {
    this.activeToast = null;
    this.toastQueue = [];
    this.lastMessageText = '';
  }

  public startDialog(
    npcId: string,
    npcName: string,
    npcIcon: string,
    subsequentLines: DialogLine[],
    onComplete?: () => void,
    engine?: IGameEngine
  ): void {
    if (this.dialogCooldown > 0) return;
    this.currentNPCId = npcId;
    this.onDialogComplete = onComplete;
    this.currentLineIdx = 0;
    this.isDialogActive = true;

    if (!this.introducedNPCs.has(npcId)) {
      // 1ª Interação: Diálogo Canônico de Censura
      this.currentLines = [
        {
          speaker: npcName,
          avatarIcon: npcIcon,
          text: 'Opa, forasteiro! Qual é o seu nome?'
        },
        {
          speaker: 'Herói',
          avatarIcon: '🤠',
          text: 'Meu nome é @#$!*&%#!',
          isGlitchName: true
        },
        {
          speaker: npcName,
          avatarIcon: npcIcon,
          text: 'Entendi foi nada!'
        },
        ...subsequentLines
      ];
      this.introducedNPCs.add(npcId);
    } else {
      this.currentLines = subsequentLines;
    }

    if (engine) {
      engine.sound.playUIClick();
      this.checkSoundTrigger(engine);
    }
  }

  private checkSoundTrigger(engine: IGameEngine): void {
    const line = this.currentLines[this.currentLineIdx];
    if (line && line.isGlitchName) {
      engine.sound.playGlitchCensura();
      engine.juice.shake.addTrauma(0.25);
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // 0. Atualizar Cooldown de Diálogo
    if (this.dialogCooldown > 0) {
      this.dialogCooldown = Math.max(0, this.dialogCooldown - dt);
    }

    // 1. Atualizar Toasts (Tempo e Fila Atômica)
    if (this.activeToast) {
      this.activeToast.timer += dt;
      if (this.activeToast.timer >= this.activeToast.duration) {
        this.activeToast = this.toastQueue.shift() || null;
        if (!this.activeToast) {
          this.lastMessageText = '';
        }
      }
    }

    // 2. Atualizar Diálogo e Consumir Input para Evitar Reabertura em Loop
    if (this.isDialogActive) {
      if (input.interactReleased || input.interactJustPressed) {
        // Consumir input no mesmo frame
        input.interactReleased = false;
        input.interactJustPressed = false;
        this.advanceDialog(engine);
      }
    }
  }

  public advanceDialog(engine: IGameEngine): void {
    if (!this.isDialogActive) return;

    this.currentLineIdx++;
    if (this.currentLineIdx >= this.currentLines.length) {
      this.isDialogActive = false;
      this.dialogCooldown = 0.25; // 0.25s de cooldown para evitar reabertura imediata
      engine.sound.playUIClick();
      if (this.onDialogComplete) {
        this.onDialogComplete();
      }
    } else {
      engine.sound.playUIClick();
      this.checkSoundTrigger(engine);
    }
  }

  /**
   * Retorna os dados do diálogo ativo para sincronização com o DOM (#game-message-panel)
   */
  public getActiveDialogData(): { speaker: string; text: string; isGlitchName?: boolean; prompt?: string } | null {
    if (!this.isDialogActive || this.currentLines.length === 0) return null;
    const line = this.currentLines[this.currentLineIdx];
    if (!line) return null;
    return {
      speaker: `${line.avatarIcon} ${line.speaker}`,
      text: line.text,
      isGlitchName: line.isGlitchName,
      prompt: 'Aperte [E / Enter] para Avançar ▶'
    };
  }

  /**
   * Retorna os dados do toast/alerta ativo para sincronização com o DOM (#game-message-panel)
   */
  public getActiveToastData(): { speaker: string; text: string; icon?: string; isError?: boolean; isSuccess?: boolean; prompt?: string } | null {
    if (!this.activeToast) return null;
    const toast = this.activeToast;
    const speakerName = toast.isError ? 'ALERTA DO SERTÃO' : toast.isSuccess ? 'VITÓRIA' : 'ORIENTAÇÃO DO CORDEL';
    return {
      speaker: `${toast.icon || '📜'} ${speakerName}`,
      text: toast.message,
      icon: toast.icon,
      isError: toast.isError,
      isSuccess: toast.isSuccess,
      prompt: this.toastQueue.length > 0 ? `+${this.toastQueue.length} na fila` : ''
    };
  }

  /**
   * ZERO RENDERIZAÇÃO NO CANVAS:
   * Mantém 100% dos pixels do canvas de jogo dedicados ao mapa e itens,
   * sem desenhar absolutamente nada sobre o canvas!
   */
  public renderBottomPanel(_ctx: CanvasRenderingContext2D, _width: number = 960, _height: number = 540): void {
    // Zero renderização sobre o canvas! Todos os diálogos e mensagens são sincronizados no DOM (#game-message-panel).
  }
}
