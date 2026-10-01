/**
 * ============================================================================
 * TELAS DE APRESENTAÇÃO E ENCERRAMENTO DE FASES (FOLHETO DE CORDEL)
 * O CORDEL DE COISINHA — ONDA 3
 * 
 * Engenharia: @Alexey (Game Frontend)
 * ============================================================================
 */

import { IGameEngine, InputState, MysticItemId } from './types';
import {
  drawMolduraCordel,
  drawItemCarimbo,
  drawItemFolha,
  drawItemPena,
  drawItemTinta,
  XILO_COLORS
} from '../renderer/xilogravura';

export interface PhaseIntroConfig {
  phaseNumber: number;
  title: string;
  subtitle: string;
  verses: string[];
  objective: string;
  itemReward: {
    id: MysticItemId;
    name: string;
    icon: string;
  };
}

export interface PhaseOutroConfig {
  phaseNumber: number;
  title: string;
  verses: string[];
  itemReward: {
    id: MysticItemId;
    name: string;
    icon: string;
  };
}

export class NarrativeModalManager {
  public isIntroActive: boolean = false;
  public isOutroActive: boolean = false;

  private introConfig?: PhaseIntroConfig;
  private outroConfig?: PhaseOutroConfig;
  private onIntroDone?: () => void;
  private onOutroDone?: () => void;
  private animTimer: number = 0;

  public showIntro(config: PhaseIntroConfig, onDone?: () => void): void {
    this.introConfig = config;
    this.onIntroDone = onDone;
    this.isIntroActive = true;
    this.isOutroActive = false;
    this.animTimer = 0;
  }

  public showOutro(config: PhaseOutroConfig, onDone?: () => void): void {
    this.outroConfig = config;
    this.onOutroDone = onDone;
    this.isOutroActive = true;
    this.isIntroActive = false;
    this.animTimer = 0;
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTimer += dt;

    if (this.isIntroActive) {
      if (input.interactReleased || (input.mouse.clicked && input.interactReleased) || input.action) {
        this.isIntroActive = false;
        engine.sound.playUIClick();
        if (this.onIntroDone) {
          this.onIntroDone();
        }
      }
    } else if (this.isOutroActive) {
      if (input.interactReleased || (input.mouse.clicked && input.interactReleased) || input.action) {
        this.isOutroActive = false;
        engine.sound.playUIClick();
        if (this.onOutroDone) {
          this.onOutroDone();
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, width: number = 960, height: number = 580): void {
    if (this.isIntroActive && this.introConfig) {
      this.renderIntro(ctx, this.introConfig, width, height);
    } else if (this.isOutroActive && this.outroConfig) {
      this.renderOutro(ctx, this.outroConfig, width, height);
    }
  }

  private renderIntro(
    ctx: CanvasRenderingContext2D,
    cfg: PhaseIntroConfig,
    width: number,
    height: number
  ): void {
    ctx.save();

    // Backdrop escuro
    ctx.fillStyle = 'rgba(10, 8, 6, 0.88)';
    ctx.fillRect(0, 0, width, height);

    // Folheto Central com preenchimento vertical integral
    const modalW = Math.min(800, width - 48);
    const modalH = Math.min(520, height - 32);
    const modalX = (width - modalW) / 2;
    const modalY = (height - modalH) / 2;

    ctx.fillStyle = XILO_COLORS.kraftPaper;
    ctx.fillRect(modalX, modalY, modalW, modalH);

    drawMolduraCordel(ctx, modalX, modalY, modalW, modalH, { borderWeight: 4 });

    // Cabeçalho de Cordel
    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`FOLHETO DE CORDEL — CONTO ${cfg.phaseNumber}`, width / 2, modalY + 38);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText(`"${cfg.title.toUpperCase()}"`, width / 2, modalY + 72);

    ctx.font = 'italic 13px "Courier New", monospace';
    ctx.fillStyle = '#78350f';
    ctx.fillText(cfg.subtitle, width / 2, modalY + 96);

    // Linha divisória
    ctx.strokeStyle = '#8c6d46';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(modalX + 50, modalY + 112);
    ctx.lineTo(modalX + modalW - 50, modalY + 112);
    ctx.stroke();

    // Versos de Cordel
    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = '14px "Courier New", monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < cfg.verses.length; i++) {
      ctx.fillText(cfg.verses[i], width / 2, modalY + 144 + i * 24);
    }

    // Caixa de Objetivo
    const objY = modalY + 285;
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(modalX + 40, objY, modalW - 80, 85);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(modalX + 40, objY, modalW - 80, 85);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('🎯 MISSÃO DO CORDEL:', width / 2, objY + 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(cfg.objective, width / 2, objY + 48);

    ctx.fillStyle = '#86efac';
    ctx.fillText(`Recompensa: ${cfg.itemReward.icon} ${cfg.itemReward.name}`, width / 2, objY + 68);

    // Botão de Iniciar
    const pulse = Math.sin(this.animTimer * 5) * 3;
    ctx.fillStyle = '#15803d';
    ctx.fillRect(width / 2 - 160, modalY + modalH - 58, 320, 40);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 2 - 160, modalY + modalH - 58, 320, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('ENTRAR NO CONTO [E / Clique] ▶', width / 2, modalY + modalH - 33 + pulse * 0.3);

    ctx.restore();
  }

  private renderOutro(
    ctx: CanvasRenderingContext2D,
    cfg: PhaseOutroConfig,
    width: number,
    height: number
  ): void {
    ctx.save();

    // Backdrop escuro
    ctx.fillStyle = 'rgba(10, 8, 6, 0.88)';
    ctx.fillRect(0, 0, width, height);

    // Folheto Central de Celebração com preenchimento vertical integral
    const modalW = Math.min(780, width - 48);
    const modalH = Math.min(520, height - 32);
    const modalX = (width - modalW) / 2;
    const modalY = (height - modalH) / 2;

    ctx.fillStyle = XILO_COLORS.kraftPaper;
    ctx.fillRect(modalX, modalY, modalW, modalH);

    drawMolduraCordel(ctx, modalX, modalY, modalW, modalH, { borderWeight: 4 });

    // Cabeçalho de Vitória
    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✨ VITÓRIA & CONSAGRAÇÃO MÍSTICA ✨', width / 2, modalY + 38);

    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = 'bold 21px "Courier New", monospace';
    ctx.fillText(`"${cfg.title.toUpperCase()}"`, width / 2, modalY + 70);

    // Render do Item Místico em Grande Escala
    const itemCenterY = modalY + 148;
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(width / 2 - 48, itemCenterY - 48, 96, 96);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.strokeRect(width / 2 - 48, itemCenterY - 48, 96, 96);

    if (cfg.itemReward.id === 'carimbo') {
      drawItemCarimbo(ctx, width / 2, itemCenterY, 48);
    } else if (cfg.itemReward.id === 'folha') {
      drawItemFolha(ctx, width / 2, itemCenterY, 48);
    } else if (cfg.itemReward.id === 'pena') {
      drawItemPena(ctx, width / 2, itemCenterY, 48);
    } else if (cfg.itemReward.id === 'tinta') {
      drawItemTinta(ctx, width / 2, itemCenterY, 48);
    }

    ctx.fillStyle = '#854d0e';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`${cfg.itemReward.icon} ${cfg.itemReward.name} CONQUISTADO!`, width / 2, modalY + 218);

    // Versos de Desfecho
    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = '14px "Courier New", monospace';
    for (let i = 0; i < cfg.verses.length; i++) {
      ctx.fillText(cfg.verses[i], width / 2, modalY + 250 + i * 24);
    }

    // Botão de Retorno
    ctx.fillStyle = '#15803d';
    ctx.fillRect(width / 2 - 170, modalY + modalH - 58, 340, 40);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(width / 2 - 170, modalY + modalH - 58, 340, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('RETORNAR AO ESTÚDIO [E / Clique] 🏠', width / 2, modalY + modalH - 33);

    ctx.restore();
  }
}
