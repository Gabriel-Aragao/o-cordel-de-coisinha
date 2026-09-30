import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface Goat extends Entity {
  isRescued: boolean;
  isLeashed: boolean;
  wanderTimer: number;
  fleeTimer: number;
}

export class Stage1ChupaCabraScene implements IScene {
  public id: SceneId = 'STAGE_1_CHUPACABRA';
  public name = 'Fase 1: O Ataque do Chupa-Cabra';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 460,
    width: 32,
    height: 32,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private curral: Entity = {
    id: 'curral',
    x: 480,
    y: 270,
    width: 160,
    height: 120,
    color: '#713f12',
    label: '[CURRAL]',
    shape: 'rect'
  };

  private fazendeiro: Entity = {
    id: 'fazendeiro',
    x: 480,
    y: 200,
    width: 28,
    height: 28,
    color: '#15803d',
    label: '[FAZENDEIRO]',
    shape: 'rect'
  };

  private chupaCabra: Entity = {
    id: 'chupa',
    x: 80,
    y: 80,
    width: 34,
    height: 34,
    color: '#dc2626',
    label: '[CHUPA-CABRA]',
    shape: 'triangle',
    speed: 130,
    active: true
  };

  private returnPortal: Entity = {
    id: 'portal',
    x: 80,
    y: 480,
    width: 100,
    height: 36,
    color: '#475569',
    label: '[PORTAL ESTÚDIO]',
    shape: 'rect'
  };

  private goats: Goat[] = [];
  private hasRope: boolean = false;
  private hasLantern: boolean = false;

  private ropeItem: Entity = {
    id: 'rope',
    x: 180,
    y: 440,
    width: 24,
    height: 24,
    color: '#d97706',
    label: '[CORDA]',
    shape: 'rect'
  };

  private lanternItem: Entity = {
    id: 'lantern',
    x: 780,
    y: 440,
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
  private victoryTriggered: boolean = false;

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 460;
    this.hasRope = false;
    this.hasLantern = false;
    this.isAboioActive = false;
    this.aboioRadius = 0;
    this.aboioTimer = 0;
    this.victoryTriggered = engine.inventory.carimbo;

    // 4 bodes distribuídos na caatinga
    this.goats = [
      {
        id: 'goat_1',
        x: 150,
        y: 160,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 1]',
        shape: 'circle',
        isRescued: this.victoryTriggered,
        isLeashed: false,
        wanderTimer: 1.0,
        fleeTimer: 0,
        speed: 85
      },
      {
        id: 'goat_2',
        x: 810,
        y: 160,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 2]',
        shape: 'circle',
        isRescued: this.victoryTriggered,
        isLeashed: false,
        wanderTimer: 1.5,
        fleeTimer: 0,
        speed: 85
      },
      {
        id: 'goat_3',
        x: 230,
        y: 350,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 3]',
        shape: 'circle',
        isRescued: this.victoryTriggered,
        isLeashed: false,
        wanderTimer: 2.0,
        fleeTimer: 0,
        speed: 85
      },
      {
        id: 'goat_4',
        x: 730,
        y: 350,
        width: 24,
        height: 24,
        color: '#f8fafc',
        label: '[BODE 4]',
        shape: 'circle',
        isRescued: this.victoryTriggered,
        isLeashed: false,
        wanderTimer: 0.5,
        fleeTimer: 0,
        speed: 85
      }
    ];

    if (this.victoryTriggered) {
      this.message = '✓ Fase Concluída! O Fazendeiro entregou o 🪓 Carimbo Mágico.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // 1. Movimento do Jogador
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

    const speed = this.player.speed || 230;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // 2. Ação de Aboiar (Grito do Vaqueiro)
    if (input.action) {
      this.isAboioActive = true;
      this.aboioRadius = Math.min(220, this.aboioRadius + 380 * dt);
      this.aboioTimer = 0.4;
    } else {
      if (this.aboioTimer > 0) {
        this.aboioTimer -= dt;
      } else {
        this.isAboioActive = false;
        this.aboioRadius = 0;
      }
    }

    // 3. Coleta de Itens (Corda e Candeeiro)
    if (!this.hasRope && Math.hypot(this.player.x - this.ropeItem.x, this.player.y - this.ropeItem.y) < 32) {
      this.hasRope = true;
      this.message = '🪢 Corda de Amarrar coletada! Agora você laça os bodes e os conduz em fila!';
    }

    if (!this.hasLantern && Math.hypot(this.player.x - this.lanternItem.x, this.player.y - this.lanternItem.y) < 32) {
      this.hasLantern = true;
      this.message = '🏮 Candeeiro coletado! O sertão fica iluminado ao seu redor!';
    }

    // 4. Inteligência e Comportamento do Chupa-Cabra
    if (this.chupaCabra.active) {
      const distToHero = Math.hypot(this.player.x - this.chupaCabra.x, this.player.y - this.chupaCabra.y);

      // Se o herói aboiar no raio de alcance, a besta se apavora e foge para longe
      if (this.isAboioActive && distToHero < this.aboioRadius + 50) {
        const fleeAngle = Math.atan2(this.chupaCabra.y - this.player.y, this.chupaCabra.x - this.player.x);
        this.chupaCabra.x += Math.cos(fleeAngle) * 300 * dt;
        this.chupaCabra.y += Math.sin(fleeAngle) * 300 * dt;
      } else {
        // Encontra o bode mais próximo que ainda não foi resgatado
        let targetGoat: Goat | null = null;
        let minDist = 9999;

        for (const g of this.goats) {
          if (!g.isRescued) {
            const dist = Math.hypot(g.x - this.chupaCabra.x, g.y - this.chupaCabra.y);
            if (dist < minDist) {
              minDist = dist;
              targetGoat = g;
            }
          }
        }

        const targetX = targetGoat ? targetGoat.x : this.player.x;
        const targetY = targetGoat ? targetGoat.y : this.player.y;
        const stalkAngle = Math.atan2(targetY - this.chupaCabra.y, targetX - this.chupaCabra.x);
        this.chupaCabra.x += Math.cos(stalkAngle) * 115 * dt;
        this.chupaCabra.y += Math.sin(stalkAngle) * 115 * dt;
      }

      this.chupaCabra.x = Math.max(20, Math.min(940, this.chupaCabra.x));
      this.chupaCabra.y = Math.max(20, Math.min(520, this.chupaCabra.y));
    }

    // 5. Comportamento e Física dos Bodes
    let leashedIndex = 1;
    for (const g of this.goats) {
      if (g.isRescued) continue;

      const distToHero = Math.hypot(this.player.x - g.x, this.player.y - g.y);

      // Checa se o bode entrou no Curral
      if (
        Math.abs(g.x - this.curral.x) < this.curral.width / 2 - 10 &&
        Math.abs(g.y - this.curral.y) < this.curral.height / 2 - 10
      ) {
        g.isRescued = true;
        g.isLeashed = false;
        continue;
      }

      // Laçar com a corda
      if (this.hasRope && distToHero < 65) {
        g.isLeashed = true;
      }

      if (g.isLeashed) {
        // Segue o jogador em fila ordenada
        const followOffset = leashedIndex * 32;
        leashedIndex++;

        const targetX = this.player.x - dx * followOffset;
        const targetY = this.player.y - dy * followOffset;
        const angle = Math.atan2(targetY - g.y, targetX - g.x);
        const dist = Math.hypot(targetX - g.x, targetY - g.y);

        if (dist > 20) {
          g.x += Math.cos(angle) * 195 * dt;
          g.y += Math.sin(angle) * 195 * dt;
        }
      } else {
        // Se sem corda e o aboio toca nele, o bode se assusta e corre
        if (this.isAboioActive && distToHero < this.aboioRadius + 30) {
          g.fleeTimer = 0.8;
          const fleeAngle = Math.atan2(g.y - this.player.y, g.x - this.player.x);
          g.vx = Math.cos(fleeAngle) * 180;
          g.vy = Math.sin(fleeAngle) * 180;
        }

        if (g.fleeTimer > 0) {
          g.fleeTimer -= dt;
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;
        } else {
          // Movimento errante natural
          g.wanderTimer -= dt;
          if (g.wanderTimer <= 0) {
            g.wanderTimer = 1.0 + Math.random() * 2.0;
            g.vx = (Math.random() - 0.5) * 65;
            g.vy = (Math.random() - 0.5) * 65;
          }
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;
        }
      }

      g.x = Math.max(35, Math.min(925, g.x));
      g.y = Math.max(35, Math.min(505, g.y));
    }

    // 6. Verificação de Vitória da Fase 1 (4 bodes no curral)
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    if (rescuedCount === 4 && !this.victoryTriggered) {
      this.victoryTriggered = true;
      engine.unlockItem('carimbo');
      this.message = '🎉 O FAZENDEIRO AGRADECE: "Você salvou minha criação!" ➔ Recebeu o 🪓 Carimbo Mágico!';
    }

    // 7. Portal de Retorno ao Estúdio
    if (
      Math.abs(this.player.x - this.returnPortal.x) < (this.player.width + this.returnPortal.width) / 2 &&
      Math.abs(this.player.y - this.returnPortal.y) < (this.player.height + this.returnPortal.height) / 2
    ) {
      engine.switchScene('STUDIO');
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Caatinga ao Entardecer
    ctx.fillStyle = '#26170d';
    ctx.fillRect(0, 0, 960, 540);

    // Luz do Candeeiro se coletado
    if (this.hasLantern) {
      ctx.save();
      const lanternGrad = ctx.createRadialGradient(
        this.player.x,
        this.player.y,
        30,
        this.player.x,
        this.player.y,
        180
      );
      lanternGrad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      lanternGrad.addColorStop(1, 'rgba(38, 23, 13, 0)');
      ctx.fillStyle = lanternGrad;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Curral Central com Porteira
    renderEntity(ctx, this.curral);

    // Cerca de Madeira do Curral
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      this.curral.x - this.curral.width / 2,
      this.curral.y - this.curral.height / 2,
      this.curral.width,
      this.curral.height
    );

    // Fazendeiro no Curral
    renderEntity(ctx, this.fazendeiro);

    // Portal de Retorno
    renderEntity(ctx, this.returnPortal);

    // Itens no chão se ainda não coletados
    if (!this.hasRope) renderEntity(ctx, this.ropeItem);
    if (!this.hasLantern) renderEntity(ctx, this.lanternItem);

    // Bodes
    for (const g of this.goats) {
      renderEntity(ctx, g);
      if (g.isRescued) {
        drawText(ctx, '✓ Salvo', g.x, g.y + 16, { font: 'bold 10px monospace', color: '#4ade80', align: 'center' });
      } else if (g.isLeashed) {
        drawText(ctx, '🪢 Preso', g.x, g.y + 16, { font: 'bold 10px monospace', color: '#facc15', align: 'center' });

        // Desenha a corda conectando ao herói
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        ctx.lineTo(g.x, g.y);
        ctx.stroke();
      }
    }

    // Chupa-Cabra
    if (this.chupaCabra.active) {
      renderEntity(ctx, this.chupaCabra);
    }

    // Efeito Visual Expansivo do Aboio (Grito de Vaqueiro)
    if (this.isAboioActive && this.aboioRadius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.aboioRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
      ctx.fill();

      drawText(ctx, '📣 ÊÊÊÊ-BOOOI!', this.player.x, this.player.y - 35, {
        font: 'bold 13px monospace',
        color: '#facc15',
        align: 'center'
      });
      ctx.restore();
    }

    // Jogador
    renderEntity(ctx, this.player);

    // HUD Superior
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    drawText(ctx, `🐐 FASE 1: O ATAQUE DO CHUPA-CABRA | Bodes Salvos: ${rescuedCount} / 4`, 480, 20, {
      font: 'bold 15px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 510, {
      font: '12px monospace',
      align: 'center',
      color: '#fde047'
    });
  }

  public destroy(): void {}
}
