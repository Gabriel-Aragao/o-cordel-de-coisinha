import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawCumadeFulozinha,
  drawMoita,
  drawChaoTerraBatida,
  drawMolduraCordel
} from '../../renderer/xilogravura';

type LotId = '0' | '1a' | '1b' | '2a' | '2b' | '3a' | '3b';

interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface InternalGate {
  x: number;
  y: number;
  w: number;
  h: number;
  isOpen: boolean;
}

interface LotData {
  id: LotId;
  name: string;
  color: string;
  walls: Wall[];
  gates: InternalGate[];
  hasBush?: boolean;
  bushX?: number;
  bushY?: number;
  bushHasFumo?: boolean;
}

export class Stage2FulozinhaScene implements IScene {
  public id: SceneId = 'STAGE_2_FULOZINHA';
  public name = 'Fase 2: A Fazenda da Cumade Fulozinha';

  private currentLot: LotId = '0';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 380,
    width: 36,
    height: 50,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private fulozinha: Entity = {
    id: 'fulozinha',
    x: 750,
    y: 270,
    width: 42,
    height: 48,
    color: '#eab308',
    label: '[CUMADE FULOZINHA]',
    shape: 'circle',
    speed: 155
  };

  // Pedra da Botija: Exclusivamente na saída do Lote 0 para o Lote 2a
  private pedraItem: Entity = {
    id: 'pedra',
    x: 880,
    y: 270,
    width: 28,
    height: 28,
    color: '#64748b',
    label: '[PEDRA DA BOTIJA]',
    shape: 'rect'
  };

  private hasFumo: boolean = false;
  private whistleTimer: number = 6.0;
  private isControlsInverted: boolean = false;
  private whistleDuration: number = 0;
  private whistleWaveRadius: number = 0;
  private message: string = 'Navegue pelos 6 lotes da fazenda. Encontre o Fumo na moita do Lote 1b e leve à Fulô no Lote 3b!';

  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private endTimer: number = 0;
  private stepTimer: number = 0;
  private animTime: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;

  // Definição dos 6 Lotes em Telas Individuais (sem 3c)
  private lots: Record<LotId, LotData> = {
    '0': {
      id: '0',
      name: 'LOTE 0 — ENTRADA DA FAZENDA',
      color: '#131b2e',
      walls: [
        { x: 300, y: 150, w: 24, h: 220 },
        { x: 600, y: 350, w: 24, h: 180 }
      ],
      gates: [{ x: 300, y: 320, w: 24, h: 80, isOpen: true }],
      hasBush: true,
      bushX: 200,
      bushY: 200
    },
    '1a': {
      id: '1a',
      name: 'LOTE 1a — POMAR NORTE',
      color: '#0f2922',
      walls: [
        { x: 480, y: 200, w: 320, h: 24 },
        { x: 250, y: 380, w: 24, h: 140 }
      ],
      gates: [{ x: 480, y: 200, w: 84, h: 24, isOpen: false }],
      hasBush: true,
      bushX: 700,
      bushY: 380
    },
    '1b': {
      id: '1b',
      name: 'LOTE 1b — PORTEIRA DO TOCO (FUMO NA MOITA)',
      color: '#1e1b2e',
      walls: [
        { x: 350, y: 270, w: 24, h: 260 },
        { x: 650, y: 200, w: 24, h: 200 }
      ],
      gates: [{ x: 350, y: 200, w: 24, h: 84, isOpen: true }],
      hasBush: true,
      bushX: 720,
      bushY: 220,
      bushHasFumo: true
    },
    '2a': {
      id: '2a',
      name: 'LOTE 2a — PASTAGEM CENTRAL OESTE',
      color: '#172554',
      walls: [
        { x: 200, y: 270, w: 24, h: 240 },
        { x: 500, y: 180, w: 260, h: 24 }
      ],
      gates: [{ x: 500, y: 180, w: 80, h: 24, isOpen: true }],
      hasBush: true,
      bushX: 300,
      bushY: 420
    },
    '2b': {
      id: '2b',
      name: 'LOTE 2b — PASTAGEM CENTRAL LESTE',
      color: '#172554',
      walls: [
        { x: 400, y: 350, w: 24, h: 200 },
        { x: 680, y: 220, w: 24, h: 220 }
      ],
      gates: [{ x: 680, y: 380, w: 24, h: 80, isOpen: false }],
      hasBush: true,
      bushX: 250,
      bushY: 180
    },
    '3a': {
      id: '3a',
      name: 'LOTE 3a — BOSQUE SUL PROFUNDO',
      color: '#2a1b12',
      walls: [
        { x: 480, y: 300, w: 340, h: 24 }
      ],
      gates: [{ x: 480, y: 300, w: 84, h: 24, isOpen: true }],
      hasBush: true,
      bushX: 650,
      bushY: 380
    },
    '3b': {
      id: '3b',
      name: 'LOTE 3b — MORADA DA CUMADE FULOZINHA',
      color: '#3b0764',
      walls: [
        { x: 300, y: 270, w: 24, h: 280 },
        { x: 600, y: 270, w: 24, h: 280 }
      ],
      gates: [
        { x: 300, y: 200, w: 24, h: 84, isOpen: true },
        { x: 600, y: 340, w: 24, h: 84, isOpen: false }
      ],
      hasBush: true,
      bushX: 480,
      bushY: 270
    }
  };

  public init(engine: IGameEngine): void {
    this.currentLot = '0';
    this.player.x = 480;
    this.player.y = 380;
    this.fulozinha.x = 750;
    this.fulozinha.y = 270;
    this.hasFumo = false;
    this.whistleTimer = 6.0;
    this.isControlsInverted = false;
    this.whistleDuration = 0;
    this.whistleWaveRadius = 0;
    this.stateStatus = 'PLAYING';
    this.endTimer = 0;
    this.stepTimer = 0;
    this.animTime = 0;

    if (engine.inventory.folha) {
      this.message = '✓ Fase Concluída! Página Rasgada obtida com Cumade Fulozinha.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;

    if (this.stateStatus !== 'PLAYING') {
      this.endTimer += dt;
      if (this.endTimer >= 2.5) {
        engine.switchScene('STUDIO');
      }
      return;
    }

    // 1. Assobios e Inversão de Controles
    const inFulozinhaLair = this.currentLot === '3b';
    const timerInterval = inFulozinhaLair ? 4.5 : 7.0;

    engine.sound.setBGMState({ tension: inFulozinhaLair ? 0.75 : 0.2 });

    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = timerInterval;
      this.isControlsInverted = true;
      this.whistleDuration = inFulozinhaLair ? 4.0 : 3.2;
      this.whistleWaveRadius = 15;
      this.message = '🎶 ASSOBIO NA MATA! Os portões alternaram e os controles foram invertidos!';
      engine.sound.playCumadeAssobio(inFulozinhaLair ? 1.2 : 1.0);
      engine.juice.shake.addTrauma(0.3);
      engine.juice.particles.emit('note', 480, 200, { count: 8, speed: 45 });

      // Alterna portões internos em todos os lotes
      for (const lotKey in this.lots) {
        for (const g of this.lots[lotKey as LotId].gates) {
          g.isOpen = !g.isOpen;
        }
      }
    }

    if (this.isControlsInverted) {
      this.whistleDuration -= dt;
      this.whistleWaveRadius += 350 * dt;
      if (this.whistleDuration <= 0) {
        this.isControlsInverted = false;
        this.whistleWaveRadius = 0;
        this.message = '🌿 O assobio cessou. Controles normais.';
      }
    }

    // 2. Movimento com suporte à inversão
    let dx = 0;
    let dy = 0;

    const left = this.isControlsInverted ? input.right : input.left;
    const right = this.isControlsInverted ? input.left : input.right;
    const up = this.isControlsInverted ? input.down : input.up;
    const down = this.isControlsInverted ? input.up : input.down;

    if (left) {
      dx -= 1;
      this.facing = 'left';
    }
    if (right) {
      dx += 1;
      this.facing = 'right';
    }
    if (up) {
      dy -= 1;
      this.facing = 'up';
    }
    if (down) {
      dy += 1;
      this.facing = 'down';
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      this.stepTimer += dt;
      if (this.stepTimer >= 0.32) {
        this.stepTimer = 0;
        engine.sound.playPassos();
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, { count: 3, speed: 25 });
      }
    }

    const speed = this.player.speed || 230;
    const lot = this.lots[this.currentLot];
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;

    // Teste de colisão no eixo X
    const targetX = this.player.x + dx * speed * dt;
    let blockedX = false;

    for (const w of lot.walls) {
      if (
        targetX + halfW > w.x - w.w / 2 &&
        targetX - halfW < w.x + w.w / 2 &&
        this.player.y + halfH > w.y - w.h / 2 &&
        this.player.y - halfH < w.y + w.h / 2
      ) {
        blockedX = true;
        break;
      }
    }

    for (const g of lot.gates) {
      if (!g.isOpen) {
        if (
          targetX + halfW > g.x - g.w / 2 &&
          targetX - halfW < g.x + g.w / 2 &&
          this.player.y + halfH > g.y - g.h / 2 &&
          this.player.y - halfH < g.y + g.h / 2
        ) {
          blockedX = true;
          break;
        }
      }
    }

    if (!blockedX) {
      this.player.x = targetX;
    }

    // Teste de colisão no eixo Y
    const targetY = this.player.y + dy * speed * dt;
    let blockedY = false;

    for (const w of lot.walls) {
      if (
        this.player.x + halfW > w.x - w.w / 2 &&
        this.player.x - halfW < w.x + w.w / 2 &&
        targetY + halfH > w.y - w.h / 2 &&
        targetY - halfH < w.y + w.h / 2
      ) {
        blockedY = true;
        break;
      }
    }

    for (const g of lot.gates) {
      if (!g.isOpen) {
        if (
          this.player.x + halfW > g.x - g.w / 2 &&
          this.player.x - halfW < g.x + g.w / 2 &&
          targetY + halfH > g.y - g.h / 2 &&
          targetY - halfH < g.y + g.h / 2
        ) {
          blockedY = true;
          break;
        }
      }
    }

    if (!blockedY) {
      this.player.y = targetY;
    }

    // 3. Porteiras de Borda (Transições entre Telas de Lotes)
    if (this.player.x > 940) {
      if (this.currentLot === '0') {
        this.currentLot = '2a';
        this.player.x = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '2b';
        this.player.x = 40;
      }
    }

    if (this.player.x < 20) {
      if (this.currentLot === '2b') {
        this.currentLot = '2a';
        this.player.x = 920;
      } else if (this.currentLot === '2a') {
        this.currentLot = '0';
        this.player.x = 920;
      }
    }

    if (this.player.y < 20) {
      if (this.currentLot === '0') {
        this.currentLot = '2a';
        this.player.y = 500;
      } else if (this.currentLot === '2a') {
        this.currentLot = '1a';
        this.player.y = 500;
      } else if (this.currentLot === '2b') {
        this.currentLot = '1b';
        this.player.y = 500;
      }
    }

    if (this.player.y > 520) {
      if (this.currentLot === '1a') {
        this.currentLot = '2a';
        this.player.y = 40;
      } else if (this.currentLot === '1b') {
        this.currentLot = '2b';
        this.player.y = 40;
      } else if (this.currentLot === '2b') {
        this.currentLot = '3b';
        this.player.y = 40;
      } else if (this.currentLot === '0') {
        this.currentLot = '3a';
        this.player.y = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '0';
        this.player.y = 40;
      }
    }

    this.player.x = Math.max(20, Math.min(940, this.player.x));
    this.player.y = Math.max(20, Math.min(520, this.player.y));

    // 4. Vasculhar Moita do Lote 1b com [E / Enter]
    if (this.currentLot === '1b' && lot.hasBush && lot.bushHasFumo && !this.hasFumo) {
      const distToBush = Math.hypot(this.player.x - (lot.bushX || 0), this.player.y - (lot.bushY || 0));
      if (distToBush < 50 && input.interact) {
        this.hasFumo = true;
        this.message = '🍂 FUMO DE ROLO ENCONTRADO NA MOITA! Leve a oferenda à Cumade no Lote 3b!';
        engine.sound.playPickup();
        engine.sound.playItemDescobrir();
        engine.juice.particles.emit('leaf', lot.bushX || 0, lot.bushY || 0, { count: 12, speed: 45 });
      }
    }

    // 5. Pista da Pedra da Botija (EXCLUSIVAMENTE no Lote 0)
    if (this.currentLot === '0') {
      if (Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y) < 40) {
        this.message = '🪨 PISTA SECRETA: Uma pedra solta na saída do Lote 0... Sob ela jaz a Botija de Mané!';
      }
    }

    // 6. Comportamento e Perseguição da Cumade Fulozinha no Lote 3b
    if (this.currentLot === '3b') {
      const angle = Math.atan2(this.player.y - this.fulozinha.y, this.player.x - this.fulozinha.x);
      this.fulozinha.x += Math.cos(angle) * (this.fulozinha.speed || 155) * dt;
      this.fulozinha.y += Math.sin(angle) * (this.fulozinha.speed || 155) * dt;

      // Checa Colisão com a Cumade
      const distToFulozinha = Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y);
      if (distToFulozinha < 36) {
        if (this.hasFumo) {
          // SUCESSO!
          this.stateStatus = 'SUCCESS';
          engine.unlockItem('folha');
          this.message = '🎉 CUMADE FULOZINHA ACEITOU O FUMO E ENTREGOU A 📄 PÁGINA RASGADA!';
          engine.sound.playVictoryJingle();
          engine.juice.particles.emit('sparkle', this.fulozinha.x, this.fulozinha.y, { count: 20, speed: 60 });
        } else {
          // FALHA!
          this.stateStatus = 'FAILED';
          this.message = '💀 CHICOTADA DE CIPÓ! Você invadiu sem fumo e foi derrotado pela Fulô!';
          engine.sound.playChicote();
          engine.sound.playDefeatJingle();
          engine.juice.shake.addTrauma(0.6);
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    const lot = this.lots[this.currentLot];

    // 1. Fundo do Terreno (Xilogravura da Maya)
    drawChaoTerraBatida(ctx, 0, 0, 960, 540);

    // 2. Moldura de Cordel
    drawMolduraCordel(ctx, 8, 8, 944, 524, { borderWeight: 3 });

    // Paredes Labirínticas Internas
    for (const w of lot.walls) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
    }

    // Portões Internos Dinâmicos com Feedback Rígido
    for (const g of lot.gates) {
      ctx.fillStyle = g.isOpen ? '#16a34a' : '#dc2626';
      ctx.fillRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);

      drawText(ctx, g.isOpen ? 'ABERTO' : 'FECHADO', g.x, g.y - 14, {
        font: 'bold 9px monospace',
        color: g.isOpen ? '#4ade80' : '#f87171',
        align: 'center'
      });
    }

    // Moita no Lote (Xilogravura da Maya)
    if (lot.hasBush && lot.bushX && lot.bushY) {
      drawMoita(ctx, lot.bushX, lot.bushY, 34, {
        hasItem: lot.bushHasFumo && !this.hasFumo,
        searched: this.hasFumo
      });

      drawText(ctx, lot.bushHasFumo && !this.hasFumo ? '🌿 [FUMO]' : '🌿', lot.bushX, lot.bushY - 12, {
        font: 'bold 10px monospace',
        color: '#fef08a',
        align: 'center'
      });
    }

    // Pedra da Botija (EXCLUSIVAMENTE no Lote 0)
    if (this.currentLot === '0') {
      renderEntity(ctx, this.pedraItem);
    }

    // Cumade Fulozinha (Xilogravura da Maya no Lote 3b)
    if (this.currentLot === '3b') {
      drawCumadeFulozinha(ctx, this.fulozinha.x, this.fulozinha.y, this.fulozinha.width, this.fulozinha.height, {
        time: this.animTime
      });

      // Raio de Perseguição
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.fulozinha.x, this.fulozinha.y, 80, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Efeito Visual de Assobio
    if (this.isControlsInverted) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.fillRect(0, 0, 960, 540);

      drawText(ctx, '⚡ ASSOBIO DA FULÔ: CONTROLES INVERTIDOS! ⚡', 480, 50, {
        font: 'bold 15px monospace',
        align: 'center',
        color: '#f87171'
      });
    }

    // Herói Coisinha (Xilogravura da Maya)
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    // Topologia Minimapa / HUD Superior
    drawText(ctx, `🌿 FASE 2: ${lot.name}`, 480, 20, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 505, {
      font: '12px monospace',
      align: 'center',
      color: this.stateStatus === 'FAILED' ? '#ef4444' : '#fde047'
    });

    // Banners de Sucesso ou Falha
    if (this.stateStatus === 'SUCCESS') {
      ctx.fillStyle = 'rgba(22, 101, 52, 0.92)';
      ctx.fillRect(240, 200, 480, 100);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 100);
      drawText(ctx, '🎉 SUCESSO! 📄 PÁGINA RASGADA CONQUISTADA!', 480, 225, {
        font: 'bold 16px monospace',
        color: '#bbf7d0',
        align: 'center'
      });
      drawText(ctx, 'Retornando vitorioso ao Estúdio de Xilogravura...', 480, 255, {
        font: '12px monospace',
        color: '#f0fdf4',
        align: 'center'
      });
    } else if (this.stateStatus === 'FAILED') {
      ctx.fillStyle = 'rgba(127, 29, 29, 0.95)';
      ctx.fillRect(240, 200, 480, 100);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 100);
      drawText(ctx, '💀 DERROTA: EXPULSO PELA CUMADE FULOZINHA!', 480, 225, {
        font: 'bold 16px monospace',
        color: '#fecaca',
        align: 'center'
      });
      drawText(ctx, 'Sem fumo você não entra na mata. Retornando ao Estúdio...', 480, 255, {
        font: '12px monospace',
        color: '#fff',
        align: 'center'
      });
    }
  }

  public destroy(): void {}
}
