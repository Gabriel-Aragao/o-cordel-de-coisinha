import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface Goat extends Entity {
  isRescued: boolean;
  isLeashed: boolean;
  wanderTimer: number;
}

export class Stage1ChupaCabraScene implements IScene {
  public id: SceneId = 'STAGE_1_CHUPACABRA';
  public name = 'Fase 1: O Ataque do Chupa-Cabra';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 450,
    width: 30,
    height: 30,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private curral: Entity = {
    id: 'curral',
    x: 480,
    y: 270,
    width: 140,
    height: 100,
    color: '#713f12',
    label: '[CURRAL]',
    shape: 'rect'
  };

  private chupaCabra: Entity = {
    id: 'chupa',
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    color: '#dc2626', // Vermelho
    label: '[CHUPA-CABRA]',
    shape: 'triangle',
    speed: 120,
    active: true
  };

  private goats: Goat[] = [];
  private hasRope: boolean = false;
  private hasLantern: boolean = false;
  private ropeItem: Entity = {
    id: 'rope',
    x: 200,
    y: 450,
    width: 24,
    height: 24,
    color: '#d97706',
    label: '[CORDA]',
    shape: 'rect'
  };
  private lanternItem: Entity = {
    id: 'lantern',
    x: 760,
    y: 450,
    width: 24,
    height: 24,
    color: '#facc15',
    label: '[CANDEEIRO]',
    shape: 'circle'
  };

  private isAboioActive: boolean = false;
  private aboioRadius: number = 0;
  private aboioTimer: number = 0;
  private message: string = 'Use o Aboio (Espaço) para espantar o Chupa-Cabra! Resgate os 4 bodes no curral!';

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 450;
    this.hasRope = false;
    this.hasLantern = false;
    this.isAboioActive = false;
    this.aboioRadius = 0;
    this.aboioTimer = 0;

    // 4 Bodes espalhados pela caatinga
    this.goats = [
      {
        id: 'goat_1',
        x: 160,
        y: 180,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 1]',
        shape: 'circle',
        isRescued: false,
        isLeashed: false,
        wanderTimer: 0,
        speed: 80
      },
      {
        id: 'goat_2',
        x: 800,
        y: 180,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 2]',
        shape: 'circle',
        isRescued: false,
        isLeashed: false,
        wanderTimer: 0,
        speed: 80
      },
      {
        id: 'goat_3',
        x: 240,
        y: 360,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 3]',
        shape: 'circle',
        isRescued: false,
        isLeashed: false,
        wanderTimer: 0,
        speed: 80
      },
      {
        id: 'goat_4',
        x: 720,
        y: 360,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 4]',
        shape: 'circle',
        isRescued: false,
        isLeashed: false,
        wanderTimer: 0,
        speed: 80
      }
    ];

    if (engine.inventory.carimbo) {
      this.message = '✓ Fase já concluída! Carimbo Mágico resgatado.';
      for (const g of this.goats) {
        g.isRescued = true;
      }
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // Movimento do Jogador
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

    const speed = this.player.speed || 220;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // Ação de Aboiar (Espaço)
    if (input.action) {
      this.isAboioActive = true;
      this.aboioRadius = Math.min(180, this.aboioRadius + 300 * dt);
      this.aboioTimer = 0.3;
    } else {
      if (this.aboioTimer > 0) {
        this.aboioTimer -= dt;
      } else {
        this.isAboioActive = false;
        this.aboioRadius = 0;
      }
    }

    // Coleta da Corda
    if (!this.hasRope) {
      if (Math.hypot(this.player.x - this.ropeItem.x, this.player.y - this.ropeItem.y) < 30) {
        this.hasRope = true;
        this.message = '🪢 Você pegou a Corda! Agora os bodes te seguem sem fugir.';
      }
    }

    // Coleta do Candeeiro
    if (!this.hasLantern) {
      if (Math.hypot(this.player.x - this.lanternItem.x, this.player.y - this.lanternItem.y) < 30) {
        this.hasLantern = true;
        this.message = '🏮 Você pegou o Candeeiro! Visão expandida na caatinga.';
      }
    }

    // Comportamento do Chupa-Cabra
    if (this.chupaCabra.active) {
      // Se aboio ativo próximo, foge
      const distHeroChupa = Math.hypot(this.player.x - this.chupaCabra.x, this.player.y - this.chupaCabra.y);
      if (this.isAboioActive && distHeroChupa < this.aboioRadius + 40) {
        // Foge na direção oposta ao herói
        const angle = Math.atan2(this.chupaCabra.y - this.player.y, this.chupaCabra.x - this.player.x);
        this.chupaCabra.x += Math.cos(angle) * 260 * dt;
        this.chupaCabra.y += Math.sin(angle) * 260 * dt;
      } else {
        // Persegue o bode solto mais próximo
        let targetX = this.player.x;
        let targetY = this.player.y;
        let minDist = 9999;

        for (const g of this.goats) {
          if (!g.isRescued) {
            const d = Math.hypot(g.x - this.chupaCabra.x, g.y - this.chupaCabra.y);
            if (d < minDist) {
              minDist = d;
              targetX = g.x;
              targetY = g.y;
            }
          }
        }

        const angle = Math.atan2(targetY - this.chupaCabra.y, targetX - this.chupaCabra.x);
        this.chupaCabra.x += Math.cos(angle) * 110 * dt;
        this.chupaCabra.y += Math.sin(angle) * 110 * dt;
      }

      this.chupaCabra.x = Math.max(30, Math.min(930, this.chupaCabra.x));
      this.chupaCabra.y = Math.max(30, Math.min(510, this.chupaCabra.y));
    }

    // Comportamento dos Bodes
    let followIndex = 1;
    for (const g of this.goats) {
      if (g.isRescued) continue;

      const distToHero = Math.hypot(this.player.x - g.x, this.player.y - g.y);

      // Checa se entra no curral
      if (
        Math.abs(g.x - this.curral.x) < this.curral.width / 2 &&
        Math.abs(g.y - this.curral.y) < this.curral.height / 2
      ) {
        g.isRescued = true;
        g.isLeashed = false;
        continue;
      }

      // Condução com corda
      if (this.hasRope && distToHero < 80) {
        g.isLeashed = true;
      }

      if (g.isLeashed) {
        // Segue o jogador em fila
        const targetX = this.player.x - (dx * 35 * followIndex);
        const targetY = this.player.y - (dy * 35 * followIndex);
        followIndex++;

        const angle = Math.atan2(targetY - g.y, targetX - g.x);
        const dist = Math.hypot(targetX - g.x, targetY - g.y);
        if (dist > 25) {
          g.x += Math.cos(angle) * 190 * dt;
          g.y += Math.sin(angle) * 190 * dt;
        }
      } else {
        // Sem corda: se aboio ativo por perto, foge do herói
        if (this.isAboioActive && distToHero < this.aboioRadius + 30) {
          const angle = Math.atan2(g.y - this.player.y, g.x - this.player.x);
          g.x += Math.cos(angle) * 160 * dt;
          g.y += Math.sin(angle) * 160 * dt;
        } else {
          // Movimento errante
          g.wanderTimer -= dt;
          if (g.wanderTimer <= 0) {
            g.wanderTimer = 1 + Math.random() * 2;
            g.vx = (Math.random() - 0.5) * 60;
            g.vy = (Math.random() - 0.5) * 60;
          }
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;
        }
      }

      g.x = Math.max(40, Math.min(920, g.x));
      g.y = Math.max(40, Math.min(500, g.y));
    }

    // Checa Condição de Vitória da Fase 1 (4 bodes no curral)
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    if (rescuedCount === 4 && !engine.inventory.carimbo) {
      engine.unlockItem('carimbo');
      this.message = '🎉 Parabéns! Todos os 4 bodes salvos! Você ganhou o 🪓 Carimbo Mágico!';
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Cenário Caatinga (terra avermelhada/crepúsculo)
    ctx.fillStyle = '#2b1b12';
    ctx.fillRect(0, 0, 960, 540);

    // Curral
    renderEntity(ctx, this.curral);

    // Itens no chão se ainda não coletados
    if (!this.hasRope) renderEntity(ctx, this.ropeItem);
    if (!this.hasLantern) renderEntity(ctx, this.lanternItem);

    // Bodes
    for (const g of this.goats) {
      renderEntity(ctx, g);
      if (g.isRescued) {
        drawText(ctx, '✓ Salvo', g.x, g.y + 16, { font: '10px monospace', color: '#4ade80', align: 'center' });
      }
    }

    // Chupa-Cabra
    if (this.chupaCabra.active) {
      renderEntity(ctx, this.chupaCabra);
    }

    // Efeito Visual de Aboio (Ondas Sonoras)
    if (this.isAboioActive && this.aboioRadius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.aboioRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
      ctx.fill();
      ctx.restore();
    }

    // Jogador
    renderEntity(ctx, this.player);

    // HUD Topo
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    drawText(ctx, `🐐 FASE 1: O ATAQUE DO CHUPA-CABRA | Bodes no Curral: ${rescuedCount} / 4`, 480, 18, {
      font: 'bold 15px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 510, {
      font: '12px monospace',
      align: 'center',
      color: '#fde047'
    });

    // Botão Voltar Estúdio no canto
    ctx.fillStyle = '#374151';
    ctx.fillRect(20, 20, 110, 32);
    ctx.strokeStyle = '#9ca3af';
    ctx.strokeRect(20, 20, 110, 32);
    drawText(ctx, '🏠 [VOLTAR]', 75, 28, { font: 'bold 12px monospace', align: 'center', color: '#fff' });
  }

  public destroy(): void {}
}
