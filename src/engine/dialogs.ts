/**
 * ============================================================================
 * SISTEMA GLOBAL DE DIÁLOGOS NARRATIVOS DE CORDEL & PIADA CANÔNICA DE CENSURA
 * O CORDEL DE COISINHA — ONDA 3
 * 
 * Regra Canônica @domaragao:
 * 1ª Interação:
 *   NPC: "Opa, forasteiro! Qual é o seu nome?"
 *   Coisinha: "Meu nome é @#$!*&%#!" (com som de glitch/censura)
 *   NPC: "Entendi foi nada!"
 * Subsequentes:
 *   NPC chama de "Coisinha" e dá dicas da fase.
 * ============================================================================
 */

import { IGameEngine, InputState } from './types';
import { drawMolduraCordel, XILO_COLORS } from '../renderer/xilogravura';

export interface DialogLine {
  speaker: string;
  avatarIcon: string;
  text: string;
  isGlitchName?: boolean;
}

export class DialogSystem {
  public isActive: boolean = false;
  private currentLines: DialogLine[] = [];
  private currentLineIdx: number = 0;
  public currentNPCId: string = '';
  private onComplete?: () => void;

  // Guarda quais NPCs já passaram pela introdução de censura
  private introducedNPCs: Set<string> = new Set();

  public startDialog(
    npcId: string,
    npcName: string,
    npcIcon: string,
    subsequentLines: DialogLine[],
    onComplete?: () => void,
    engine?: IGameEngine
  ): void {
    this.currentNPCId = npcId;
    this.onComplete = onComplete;
    this.currentLineIdx = 0;
    this.isActive = true;

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
      // Interações Subsequentes: Vai direto para as falas chamando de Coisinha
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

  public update(_dt: number, input: InputState, engine: IGameEngine): void {
    if (!this.isActive) return;

    if (input.interact || input.mouse.clicked) {
      this.advance(engine);
    }
  }

  public advance(engine: IGameEngine): void {
    if (!this.isActive) return;

    this.currentLineIdx++;
    if (this.currentLineIdx >= this.currentLines.length) {
      this.isActive = false;
      engine.sound.playUIClick();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      engine.sound.playUIClick();
      this.checkSoundTrigger(engine);
    }
  }

  public render(ctx: CanvasRenderingContext2D, width: number = 960, height: number = 540): void {
    if (!this.isActive || this.currentLines.length === 0) return;

    const line = this.currentLines[this.currentLineIdx];
    if (!line) return;

    ctx.save();

    // Caixa de diálogo inferior
    const boxX = 60;
    const boxY = height - 150;
    const boxW = width - 120;
    const boxH = 125;

    // Fundo Papel Kraft / Xilo
    ctx.fillStyle = XILO_COLORS.kraftPaper;
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Moldura entalhada
    drawMolduraCordel(ctx, boxX, boxY, boxW, boxH, { borderWeight: 3 });

    // Avatar / Ícone à esquerda
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(boxX + 16, boxY + 20, 64, 84);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX + 16, boxY + 20, 64, 84);

    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(line.avatarIcon, boxX + 48, boxY + 62);

    // Nome do Falante
    ctx.fillStyle = line.speaker === 'Herói' ? '#9a3412' : '#14100c';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`[ ${line.speaker.toUpperCase()} ]`, boxX + 96, boxY + 22);

    // Linha decorativa
    ctx.strokeStyle = '#8c6d46';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boxX + 96, boxY + 42);
    ctx.lineTo(boxX + boxW - 30, boxY + 42);
    ctx.stroke();

    // Texto da fala
    ctx.fillStyle = line.isGlitchName ? '#dc2626' : '#14100c';
    ctx.font = line.isGlitchName ? 'bold 16px "Courier New", monospace' : '14px "Courier New", monospace';

    // Quebra de linha básica
    const words = line.text.split(' ');
    let currentLine = '';
    let lineY = boxY + 52;
    const maxLineW = boxW - 130;

    for (const w of words) {
      const testLine = currentLine ? `${currentLine} ${w}` : w;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW) {
        ctx.fillText(currentLine, boxX + 96, lineY);
        currentLine = w;
        lineY += 20;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      ctx.fillText(currentLine, boxX + 96, lineY);
    }

    // Indicador de continuação
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('Aperte [E / Enter / Clique] ▶', boxX + boxW - 20, boxY + boxH - 14);

    ctx.restore();
  }
}
