import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

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
    width: 30,
    height: 30,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private fulozinha: Entity = {
    id: 'fulozinha',
    x: 750,
    y: 270,
    width: 36,
    height: 36,
    color: '#eab308',
    label: '[CUMADE FULOZINHA]',
    shape: 'circle',
    speed: 155
  };

  private pedraItem: Entity = {
    id: 'pedra',
    x: 880,
    y: 270,
    width: 26,
    height: 26,
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

  // Definição dos 6 Lotes em Telas Individuais (sem 3c)
  private lots: Record<LotId, LotData> = {
    '0': {
      id: '0',
      name: 'LOTE 0 — ENTRADA DA FAZENDA',
      color: '#131b2e',
      walls: [
        { x: 300, y: 150, w: 20, h: 220 },
        { x: 600, y: 350, w: 20, h: 180 }
      ],
      gates: [{ x: 300, y: 320, w: 20, h: 70, isOpen: true }],
      hasBush: true,
      bushX: 200,
      bushY: 200
    },
    '1a': {
      id: '1a',
      name: 'LOTE 1a — POMAR NORTE',
      color: '#0f2922',
      walls: [
        { x: 480, y: 200, w: 320, h: 20 },
        { x: 250, y: 380, w: 20, h: 140 }
      ],
      gates: [{ x: 480, y: 200, w: 80, h: 20, isOpen: false }],
      hasBush: true,
      bushX: 700,
      bushY: 380
    },
    '1b': {
      id: '1b',
      name: 'LOTE 1b — PORTEIRA DO TOCO (FUMO NA MOITA)',
      color: '#1e1b2e',
      walls: [
        { x: 350, y: 270, w: 20, h: 260 },
        { x: 650, y: 200, w: 20, h: 200 }
      ],
      gates: [{ x: 350, y: 200, w: 20, h: 80, isOpen: true }],
      hasBush: true,
      bushX: 720,
      bushY: 220,
      bushHasFumo: true
    },
    '2a': {
      id: '2a',
      name: 'LOTE 2a — PASTAGEM CENTRAL OESTE (PEDRA)',
      color: '#172554',
      walls: [
        { x: 200, y: 270, w: 20, h: 240 },
        { x: 500, y: 180, w: 260, h: 20 }
      ],
      gates: [{ x: 500, y: 180, w: 70, h: 20, isOpen: true }],
      hasBush: true,
      bushX: 300,
      bushY: 420
    },
    '2b': {
      id: '2b',
      name: 'LOTE 2b — PASTAGEM CENTRAL LESTE',
      color: '#172554',
      walls: [
        { x: 400, y: 350, w: 20, h: 200 },
        { x: 680, y: 220, w: 20, h: 220 }
      ],
      gates: [{ x: 680, y: 380, w: 20, h: 70, isOpen: false }],
      hasBush: true,
      bushX: 250,
      bushY: 180
    },
    '3a': {
      id: '3a',
      name: 'LOTE 3a — BOSQUE SUL PROFUNDO',
      color: '#2a1b12',
      walls: [
        { x: 480, y: 300, w: 340, h: 20 }
      ],
      gates: [{ x: 480, y: 300, w: 80, h: 20, isOpen: true }],
      hasBush: true,
      bushX: 650,
      bushY: 380
    },
    '3b': {
      id: '3b',
      name: 'LOTE 3b — MORADA DA CUMADE FULOZINHA',
      color: '#3b0764',
      walls: [
        { x: 300, y: 270, w: 20, h: 280 },
        { x: 600, y: 270, w: 20, h: 280 }
      ],
      gates: [
        { x: 300, y: 200, w: 20, h: 80, isOpen: true },
        { x: 600, y: 340, w: 20, h: 80, isOpen: false }
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

    if (engine.inventory.folha) {
      this.message = '✓ Fase Concluída! Página Rasgada obtida com Cumade Fulozinha.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
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

    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = timerInterval;
      this.isControlsInverted = true;
      this.whistleDuration = inFulozinhaLair ? 4.0 : 3.2;
      this.whistleWaveRadius = 15;
      this.message = '🎶 ASSOBIO NA MATA! Os portões alternaram e os controles foram invertidos!';

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

    if (left) dx -= 1;
    if (right) dx += 1;
    if (up) dy -= 1;
    if (down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    const speed = this.player.speed || 230;
    const nextX = this.player.x + dx * speed * dt;
    const nextY = this.player.y + dy * speed * dt;

    // Colisão com paredes e portões fechados do lote atual
    const lot = this.lots[this.currentLot];
    let blocked = false;

    // Paredes
    for (const w of lot.walls) {
      if (
        nextX + this.player.width / 2 > w.x - w.w / 2 &&
        nextX - this.player.width / 2 < w.x + w.w / 2 &&
        nextY + this.player.height / 2 > w.y - w.h / 2 &&
        nextY - this.player.height / 2 < w.y + w.h / 2
      ) {
        blocked = true;
        break;
      }
    }

    // Portões
    for (const g of lot.gates) {
      if (!g.isOpen) {
        if (
          nextX + this.player.width / 2 > g.x - g.w / 2 &&
          nextX - this.player.width / 2 < g.x + g.w / 2 &&
          nextY + this.player.height / 2 > g.y - g.h / 2 &&
          nextY - this.player.height / 2 < g.y + g.h / 2
        ) {
          blocked = true;
          break;
        }
      }
    }

    if (!blocked) {
      this.player.x = nextX;
      this.player.y = nextY;
    }

    // 3. Porteiras de Borda (Transições entre Telas de Lotes)
    // Topologia dos 6 Lotes:
    // [1a]          [1b]
    //   |             |
    // [2a] -------  [2b]
    //   |             |
    // [0]           [3b]
    //   |
    // [3a]

    // Borda Direita (X > 940)
    if (this.player.x > 940) {
      if (this.currentLot === '0') {
        this.currentLot = '2a';
        this.player.x = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '2b';
        this.player.x = 40;
      }
    }

    // Borda Esquerda (X < 20)
    if (this.player.x < 20) {
      if (this.currentLot === '2b') {
        this.currentLot = '2a';
        this.player.x = 920;
      } else if (this.currentLot === '2a') {
        this.currentLot = '0';
        this.player.x = 920;
      }
    }

    // Borda Superior (Y < 20)
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

    // Borda Inferior (Y > 520)
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
      }
    }

    // 5. Pista da Pedra da Botija (Lote 0 / 2a)
    if (this.currentLot === '0' || this.currentLot === '2a') {
      if (Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y) < 35) {
        this.message = '🪨 PISTA SECRETA: Uma pedra solta no chão... Sob ela jaz a Botija de Mané!';
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
        } else {
          // FALHA!
          this.stateStatus = 'FAILED';
          this.message = '💀 CHICOTADA DE CIPÓ! Você invadiu sem fumo e foi derrotado pela Fulô!';
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    const lot = this.lots[this.currentLot];

    // Fundo do Lote Atual
    ctx.fillStyle = lot.color;
    ctx.fillRect(0, 0, 960, 540);

    // Moldura do Lote
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 940, 520);

    // Paredes Labirínticas Internas
    for (const w of lot.walls) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
    }

    // Portões Internos Dinâmicos
    for (const g of lot.gates) {
      ctx.fillStyle = g.isOpen ? '#16a34a' : '#dc2626';
      ctx.fillRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);

      drawText(ctx, g.isOpen ? 'ABERTO' : 'FECHADO', g.x, g.y - 12, {
        font: 'bold 9px monospace',
        color: g.isOpen ? '#4ade80' : '#f87171',
        align: 'center'
      });
    }

    // Moita no Lote
    if (lot.hasBush && lot.bushX && lot.bushY) {
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(lot.bushX, lot.bushY, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      drawText(ctx, lot.bushHasFumo && !this.hasFumo ? '🌿 [MOITA - FUMO]' : '🌿 [MOITA]', lot.bushX, lot.bushY - 6, {
        font: 'bold 10px monospace',
        color: '#fef08a',
        align: 'center'
      });
    }

    // Pedra da Botija (Lote 0 e 2a)
    if (this.currentLot === '0' || this.currentLot === '2a') {
      renderEntity(ctx, this.pedraItem);
    }

    // Cumade Fulozinha (apenas no Lote 3b)
    if (this.currentLot === '3b') {
      renderEntity(ctx, this.fulozinha);

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

    // Jogador
    renderEntity(ctx, this.player);

    // Topologia Minimapa / HUD Superior
    drawText(ctx, `🌿 FASE 2: ${lot.name}`, 480, 18, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 510, {
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
