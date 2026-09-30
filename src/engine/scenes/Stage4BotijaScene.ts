import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

type LotId = 'igreja' | '0' | '1a' | '1b' | '2a' | '2b' | '3a' | '3b';

interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LotData {
  id: LotId;
  name: string;
  walls: Wall[];
  isSanctuary?: boolean;
}

export class Stage4BotijaScene implements IScene {
  public id: SceneId = 'STAGE_4_BOTIJA';
  public name = 'Fase 4: A Botija de Mané Monteiro';

  // O jogador inicia no Lote da Igreja (Santuário Seguro)
  private currentLot: LotId = 'igreja';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 360,
    width: 28,
    height: 28,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private fulozinha: Entity = {
    id: 'fulo_furia',
    x: 480,
    y: 270,
    width: 34,
    height: 34,
    color: '#ef4444',
    label: '[FULÔ EM FÚRIA]',
    shape: 'circle',
    speed: 160
  };

  // A Fulô NUNCA entra na Igreja
  private fuloCurrentLot: LotId = '2b';
  private fuloLotChangeTimer: number = 4.0;

  private pedraItem: Entity = {
    id: 'pedra',
    x: 480,
    y: 270,
    width: 32,
    height: 32,
    color: '#64748b',
    label: '[PEDRA DA BOTIJA]',
    shape: 'rect'
  };

  private beato: Entity = {
    id: 'beato',
    x: 480,
    y: 180,
    width: 36,
    height: 36,
    color: '#facc15',
    label: '[BEATO DA PARÓQUIA]',
    shape: 'rect'
  };

  private altar: Entity = {
    id: 'altar',
    x: 480,
    y: 120,
    width: 160,
    height: 40,
    color: '#713f12',
    label: '[ALTAR DE SÃO JOSÉ]',
    shape: 'rect'
  };

  private hasBotija: boolean = false;
  private digProgress: number = 0;
  private isDigging: boolean = false;

  private message: string = 'Saia da Igreja pela esquerda, desenterre a Botija no Lote 0 e retorne ao Santuário!';
  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private endTimer: number = 0;

  // Ciclo de patrulha da Fulô (exclui a Igreja)
  private lotSequence: LotId[] = ['0', '2a', '1a', '2b', '1b', '3b', '3a'];

  private lots: Record<LotId, LotData> = {
    'igreja': {
      id: 'igreja',
      name: 'LOTE DA IGREJA — SANTUÁRIO SEGURO (BEATO)',
      isSanctuary: true,
      walls: [
        { x: 480, y: 120, w: 180, h: 40 },
        { x: 260, y: 270, w: 20, h: 260 },
        { x: 700, y: 270, w: 20, h: 260 }
      ]
    },
    '0': {
      id: '0',
      name: 'LOTE 0 — A PEDRA ANCESTRAL DA BOTIJA',
      walls: [
        { x: 280, y: 150, w: 20, h: 220 },
        { x: 680, y: 350, w: 20, h: 200 }
      ]
    },
    '1a': {
      id: '1a',
      name: 'LOTE 1a — TRILHA NORTE DA CAATINGA',
      walls: [
        { x: 480, y: 220, w: 340, h: 20 }
      ]
    },
    '1b': {
      id: '1b',
      name: 'LOTE 1b — PORTEIRA DA IGREJA',
      walls: [
        { x: 380, y: 270, w: 20, h: 280 }
      ]
    },
    '2a': {
      id: '2a',
      name: 'LOTE 2a — ENCRUZILHADA CENTRAL OESTE',
      walls: [
        { x: 220, y: 270, w: 20, h: 240 },
        { x: 520, y: 180, w: 260, h: 20 }
      ]
    },
    '2b': {
      id: '2b',
      name: 'LOTE 2b — ENCRUZILHADA CENTRAL LESTE',
      walls: [
        { x: 420, y: 350, w: 20, h: 200 },
        { x: 700, y: 220, w: 20, h: 220 }
      ]
    },
    '3a': {
      id: '3a',
      name: 'LOTE 3a — BOSQUE ESCURO',
      walls: [
        { x: 480, y: 300, w: 340, h: 20 }
      ]
    },
    '3b': {
      id: '3b',
      name: 'LOTE 3b — CLAREIRA DOS CIPÓS',
      walls: [
        { x: 300, y: 270, w: 20, h: 280 },
        { x: 620, y: 270, w: 20, h: 280 }
      ]
    }
  };

  public init(engine: IGameEngine): void {
    this.currentLot = 'igreja';
    this.player.x = 480;
    this.player.y = 360;
    this.fuloCurrentLot = '2b';
    this.fuloLotChangeTimer = 4.0;
    this.hasBotija = false;
    this.digProgress = 0;
    this.isDigging = false;
    this.stateStatus = 'PLAYING';
    this.endTimer = 0;

    if (engine.inventory.tinta) {
      this.message = '✓ Fase Concluída! O Beato entregou a 🖋️ Tinta Encantada.';
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

    // 1. Patrulha Global da Cumade Fulozinha (Exclusivamente fora da Igreja)
    this.fuloLotChangeTimer -= dt;
    if (this.fuloLotChangeTimer <= 0) {
      this.fuloLotChangeTimer = 4.5;
      const nextIdx = (this.lotSequence.indexOf(this.fuloCurrentLot) + 1) % this.lotSequence.length;
      this.fuloCurrentLot = this.lotSequence[nextIdx];
      this.fulozinha.x = 100 + Math.random() * 760;
      this.fulozinha.y = 100 + Math.random() * 340;
    }

    // Se a Fulô estiver no mesmo lote que o herói (e o herói NÃO estiver na Igreja), persegue!
    if (this.currentLot !== 'igreja' && this.fuloCurrentLot === this.currentLot) {
      const angle = Math.atan2(this.player.y - this.fulozinha.y, this.player.x - this.fulozinha.x);
      this.fulozinha.x += Math.cos(angle) * (this.fulozinha.speed || 160) * dt;
      this.fulozinha.y += Math.sin(angle) * (this.fulozinha.speed || 160) * dt;

      // Colisão com a Fulô Furiosa ➔ FALHA!
      const distToHero = Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y);
      if (distToHero < 34) {
        this.stateStatus = 'FAILED';
        this.message = '💀 VOCÊ FOI CAPTURADO PELA CUMADE FULOZINHA EM FÚRIA!';
        return;
      }
    }

    // 2. Movimento do Jogador com Penalidade de Peso (-25% com a botija)
    let dx = 0;
    let dy = 0;

    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    const currentSpeed = this.hasBotija ? 165 : 220;
    const lot = this.lots[this.currentLot];
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;

    // Colisão no eixo X
    const targetX = this.player.x + dx * currentSpeed * dt;
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
    if (!blockedX) {
      this.player.x = targetX;
    }

    // Colisão no eixo Y
    const targetY = this.player.y + dy * currentSpeed * dt;
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
    if (!blockedY) {
      this.player.y = targetY;
    }

    // 3. Porteiras de Borda (Transições entre Telas)
    // Borda Direita (X > 940)
    if (this.player.x > 940) {
      if (this.currentLot === '1b') {
        // Entra no Lote da Igreja
        this.currentLot = 'igreja';
        this.player.x = 40;
      } else if (this.currentLot === '0') {
        this.currentLot = '2a';
        this.player.x = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '2b';
        this.player.x = 40;
      }
    }

    // Borda Esquerda (X < 20)
    if (this.player.x < 20) {
      if (this.currentLot === 'igreja') {
        // Sai da Igreja para o Lote 1b
        this.currentLot = '1b';
        this.player.x = 920;
      } else if (this.currentLot === '2b') {
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

    // 4. Mecânica de Escavação da Botija no Lote 0
    if (this.currentLot === '0' && !this.hasBotija) {
      const distToPedra = Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y);
      if (distToPedra < 55) {
        if (input.interact) {
          this.isDigging = true;
          this.digProgress += dt * 0.45;
          this.message = `⛏️ Desenterrando a botija de ouro... ${Math.round(this.digProgress * 100)}%`;

          if (this.digProgress >= 1) {
            this.digProgress = 1;
            this.hasBotija = true;
            this.message = '🏺 BOTIJA DESENTERRADA! É muito pesada (-25% Vel). Fuja para a Igreja!';
          }
        } else {
          this.isDigging = false;
        }
      }
    }

    // 5. Entrega da Botija ao Beato no Santuário da Igreja
    if (this.currentLot === 'igreja' && this.hasBotija) {
      const distToBeato = Math.hypot(this.player.x - this.beato.x, this.player.y - this.beato.y);
      if (distToBeato < 80) {
        this.stateStatus = 'SUCCESS';
        engine.unlockItem('tinta');
        this.message = '🎉 BÊNÇÃO CONCEDIDA: O Beato recebeu a botija no altar e entregou a 🖋️ Tinta Encantada!';
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    const lot = this.lots[this.currentLot];

    // Fundo
    if (lot.isSanctuary) {
      // Fundo acolhedor e seguro da Igreja
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(0, 0, 960, 540);

      // Luz divina / velas
      ctx.save();
      const candleGrad = ctx.createRadialGradient(480, 180, 20, 480, 180, 320);
      candleGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      candleGrad.addColorStop(1, 'rgba(30, 27, 24, 0)');
      ctx.fillStyle = candleGrad;
      ctx.beginPath();
      ctx.arc(480, 180, 320, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Altar e Beato
      renderEntity(ctx, this.altar);
      renderEntity(ctx, this.beato);

      drawText(ctx, '🕊️ SANTUÁRIO SEGURO — A CUMADE FULÔ NÃO ENTRA AQUI!', 480, 65, {
        font: 'bold 12px monospace',
        color: '#86efac',
        align: 'center'
      });
    } else {
      // Noite Escura dos Lotes da Caatinga
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, 960, 540);
    }

    // Paredes do Lote
    for (const w of lot.walls) {
      ctx.fillStyle = lot.isSanctuary ? '#78350f' : '#1e293b';
      ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
      ctx.strokeStyle = lot.isSanctuary ? '#b45309' : '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
    }

    // Pedra da Botija (Lote 0)
    if (this.currentLot === '0' && !this.hasBotija) {
      renderEntity(ctx, this.pedraItem);

      if (this.isDigging) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80, 8);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80 * this.digProgress, 8);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80, 8);
      }
    }

    // Fulô Furiosa (se estiver no lote atual e o lote NÃO for a Igreja)
    if (!lot.isSanctuary && this.fuloCurrentLot === this.currentLot) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.fulozinha.x, this.fulozinha.y, 80, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.fill();
      ctx.restore();

      renderEntity(ctx, this.fulozinha);
    }

    // Efeito de Iluminação Dinâmica do Candeeiro (fora da Igreja)
    if (!lot.isSanctuary) {
      ctx.save();
      const lightRadius = 145;
      const gradient = ctx.createRadialGradient(
        this.player.x,
        this.player.y,
        30,
        this.player.x,
        this.player.y,
        lightRadius
      );
      gradient.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      gradient.addColorStop(0.7, 'rgba(254, 240, 138, 0.1)');
      gradient.addColorStop(1, 'rgba(2, 4, 8, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, lightRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Jogador
    renderEntity(ctx, this.player);
    if (this.hasBotija) {
      drawText(ctx, '🏺 CARREGANDO BOTIJA (-25% Vel)', this.player.x, this.player.y - 32, {
        font: 'bold 10px monospace',
        color: '#facc15',
        align: 'center'
      });
    }

    // HUD Superior
    drawText(ctx, `🏺 FASE 4: ${lot.name}`, 480, 18, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 510, {
      font: '12px monospace',
      align: 'center',
      color: this.stateStatus === 'FAILED' ? '#ef4444' : '#fde047'
    });

    // Banner de Sucesso ou Falha
    if (this.stateStatus === 'SUCCESS') {
      ctx.fillStyle = 'rgba(22, 101, 52, 0.94)';
      ctx.fillRect(240, 200, 480, 100);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 100);
      drawText(ctx, '🎉 SUCESSO! 🖋️ TINTA ENCANTADA CONQUISTADA!', 480, 225, {
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
      drawText(ctx, '💀 DERROTA: CAPTURADO NAS TREVAS!', 480, 225, {
        font: 'bold 16px monospace',
        color: '#fecaca',
        align: 'center'
      });
      drawText(ctx, 'Retornando ao Estúdio para nova tentativa...', 480, 255, {
        font: '12px monospace',
        color: '#fff',
        align: 'center'
      });
    }
  }

  public destroy(): void {}
}
