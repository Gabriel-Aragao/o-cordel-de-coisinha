import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface Bush {
  id: string;
  x: number;
  y: number;
  radius: number;
  hasItem?: 'corda' | 'candeeiro';
  isSearched: boolean;
  hidingGoatId?: string;
}

interface Goat extends Entity {
  hp: number;
  maxHp: number;
  isRescued: boolean;
  isLeashed: boolean;
  hiddenInBushId?: string;
  wanderTimer: number;
  fleeTimer: number;
}

export class Stage1ChupaCabraScene implements IScene {
  public id: SceneId = 'STAGE_1_CHUPACABRA';
  public name = 'Fase 1: O Ataque do Chupa-Cabra';

  // Dimensões do mapa amplo
  private mapWidth = 1920;
  private mapHeight = 1080;

  // Câmera
  private camera = { x: 0, y: 0 };

  private player: Entity = {
    id: 'hero',
    x: 960,
    y: 650,
    width: 32,
    height: 32,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 240
  };

  private curral: Entity = {
    id: 'curral',
    x: 960,
    y: 540,
    width: 200,
    height: 150,
    color: '#713f12',
    label: '[CURRAL]',
    shape: 'rect'
  };

  private fazendeiro: Entity = {
    id: 'fazendeiro',
    x: 960,
    y: 490,
    width: 30,
    height: 30,
    color: '#15803d',
    label: '[FAZENDEIRO]',
    shape: 'rect'
  };

  private chupaCabra: Entity = {
    id: 'chupa',
    x: 200,
    y: 200,
    width: 36,
    height: 36,
    color: '#dc2626',
    label: '[CHUPA-CABRA]',
    shape: 'triangle',
    speed: 135,
    active: true
  };

  private bushes: Bush[] = [];
  private goats: Goat[] = [];
  private hasRope: boolean = false;
  private hasLantern: boolean = false;

  private isAboioActive: boolean = false;
  private isGritoActive: boolean = false;
  private soundWaveRadius: number = 0;
  private message: string = 'Vasculhe as moitas [E], use Aboio/Grito [Espaço] e resgate os 4 bodes no curral!';

  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private endTimer: number = 0;

  public init(engine: IGameEngine): void {
    this.player.x = 960;
    this.player.y = 650;
    this.hasRope = false;
    this.hasLantern = false;
    this.isAboioActive = false;
    this.isGritoActive = false;
    this.soundWaveRadius = 0;
    this.stateStatus = 'PLAYING';
    this.endTimer = 0;

    // Moitas espalhadas pelo mapa amplo
    this.bushes = [
      { id: 'b1', x: 450, y: 300, radius: 42, hasItem: 'corda', isSearched: false, hidingGoatId: 'goat_1' },
      { id: 'b2', x: 1450, y: 300, radius: 42, hasItem: 'candeeiro', isSearched: false, hidingGoatId: 'goat_2' },
      { id: 'b3', x: 400, y: 800, radius: 45, isSearched: false, hidingGoatId: 'goat_3' },
      { id: 'b4', x: 1500, y: 800, radius: 45, isSearched: false, hidingGoatId: 'goat_4' },
      { id: 'b5', x: 960, y: 220, radius: 40, isSearched: false },
      { id: 'b6', x: 960, y: 880, radius: 40, isSearched: false },
      { id: 'b7', x: 250, y: 540, radius: 38, isSearched: false },
      { id: 'b8', x: 1680, y: 540, radius: 38, isSearched: false }
    ];

    // 4 bodes com 100 HP cada
    this.goats = [
      {
        id: 'goat_1',
        x: 450,
        y: 300,
        width: 26,
        height: 26,
        color: '#f8fafc',
        label: '[BODE 1]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b1',
        wanderTimer: 1.0,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_2',
        x: 1450,
        y: 300,
        width: 26,
        height: 26,
        color: '#f8fafc',
        label: '[BODE 2]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b2',
        wanderTimer: 1.5,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_3',
        x: 400,
        y: 800,
        width: 26,
        height: 26,
        color: '#f8fafc',
        label: '[BODE 3]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b3',
        wanderTimer: 2.0,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_4',
        x: 1500,
        y: 800,
        width: 26,
        height: 26,
        color: '#f8fafc',
        label: '[BODE 4]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b4',
        wanderTimer: 0.5,
        fleeTimer: 0,
        speed: 90
      }
    ];

    if (engine.inventory.carimbo) {
      this.message = '✓ Fase já conquistada! Carimbo Mágico em mãos.';
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

    const speed = this.player.speed || 240;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(this.mapWidth - 30, this.player.x));
    this.player.y = Math.max(30, Math.min(this.mapHeight - 30, this.player.y));

    // Câmera suave centralizada no herói com clamp
    this.camera.x = Math.max(0, Math.min(this.mapWidth - 960, this.player.x - 480));
    this.camera.y = Math.max(0, Math.min(this.mapHeight - 540, this.player.y - 270));

    // 2. Ação: Aboiar (toque curto) vs Gritar (segurar > 0.35s)
    if (input.action) {
      if (input.actionHeldTime > 0.35) {
        // Grito Potente
        this.isGritoActive = true;
        this.isAboioActive = false;
        this.soundWaveRadius = Math.min(320, this.soundWaveRadius + 500 * dt);
      } else {
        // Aboio Suave
        this.isAboioActive = true;
        this.isGritoActive = false;
        this.soundWaveRadius = Math.min(140, this.soundWaveRadius + 300 * dt);
      }
    } else {
      this.isAboioActive = false;
      this.isGritoActive = false;
      this.soundWaveRadius = 0;
    }

    // 3. Vasculhar Moitas com [E / Enter]
    if (input.interact) {
      for (const bush of this.bushes) {
        if (Math.hypot(this.player.x - bush.x, this.player.y - bush.y) < bush.radius + 30) {
          if (!bush.isSearched) {
            bush.isSearched = true;
            if (bush.hasItem === 'corda' && !this.hasRope) {
              this.hasRope = true;
              this.message = '🪢 CORDA ENCONTRADA NA MOITA! Agora você pode laçar os bodes!';
            } else if (bush.hasItem === 'candeeiro' && !this.hasLantern) {
              this.hasLantern = true;
              this.message = '🏮 CANDEEIRO ENCONTRADO NA MOITA! Iluminação expandida na caatinga!';
            }
          }

          // Se tiver bode escondido, faz sair
          if (bush.hidingGoatId) {
            const goat = this.goats.find((g) => g.id === bush.hidingGoatId);
            if (goat && goat.hiddenInBushId) {
              goat.hiddenInBushId = undefined;
              goat.x = bush.x + 20;
              goat.y = bush.y + 20;
              bush.hidingGoatId = undefined;
              this.message = '🐐 Você descobriu um bode escondido na moita!';
            }
          }
        }
      }
    }

    // Aboio ou grito faz bodes saírem da moita próxima
    if (this.isAboioActive || this.isGritoActive) {
      for (const bush of this.bushes) {
        if (Math.hypot(this.player.x - bush.x, this.player.y - bush.y) < this.soundWaveRadius + bush.radius) {
          if (bush.hidingGoatId) {
            const goat = this.goats.find((g) => g.id === bush.hidingGoatId);
            if (goat && goat.hiddenInBushId) {
              goat.hiddenInBushId = undefined;
              goat.x = bush.x + (Math.random() - 0.5) * 40;
              goat.y = bush.y + (Math.random() - 0.5) * 40;
              bush.hidingGoatId = undefined;
            }
          }
        }
      }
    }

    // 4. IA do Chupa-Cabra & Ataque com Drenagem de HP
    if (this.chupaCabra.active) {
      const distHeroChupa = Math.hypot(this.player.x - this.chupaCabra.x, this.player.y - this.chupaCabra.y);

      // Grito ou Aboio espantam o Chupa-Cabra
      if ((this.isGritoActive || this.isAboioActive) && distHeroChupa < this.soundWaveRadius + 50) {
        const fleeAngle = Math.atan2(this.chupaCabra.y - this.player.y, this.chupaCabra.x - this.player.x);
        this.chupaCabra.x += Math.cos(fleeAngle) * 320 * dt;
        this.chupaCabra.y += Math.sin(fleeAngle) * 320 * dt;
      } else {
        // Encontra o bode solto mais próximo
        let targetGoat: Goat | null = null;
        let minDist = 9999;

        for (const g of this.goats) {
          if (!g.isRescued && !g.hiddenInBushId) {
            const d = Math.hypot(g.x - this.chupaCabra.x, g.y - this.chupaCabra.y);
            if (d < minDist) {
              minDist = d;
              targetGoat = g;
            }
          }
        }

        if (targetGoat) {
          const angle = Math.atan2(targetGoat.y - this.chupaCabra.y, targetGoat.x - this.chupaCabra.x);
          this.chupaCabra.x += Math.cos(angle) * 140 * dt;
          this.chupaCabra.y += Math.sin(angle) * 140 * dt;

          // Se estiver encostado no bode, drena HP!
          if (minDist < 30) {
            targetGoat.hp -= 25 * dt;
            this.message = `🩸 O CHUPA-CABRA ESTÁ ATACANDO O ${targetGoat.label}! GRITE PARA ESPANTAR!`;

            // Verificação de Morte do Bode ➔ FALHA!
            if (targetGoat.hp <= 0) {
              targetGoat.hp = 0;
              this.stateStatus = 'FAILED';
              this.message = '💀 UM BODE MORREU! Missão Falhou. Retornando ao Estúdio...';
              return;
            }
          }
        } else {
          this.chupaCabra.x += Math.sin(Date.now() / 1000) * 80 * dt;
        }
      }

      this.chupaCabra.x = Math.max(30, Math.min(this.mapWidth - 30, this.chupaCabra.x));
      this.chupaCabra.y = Math.max(30, Math.min(this.mapHeight - 30, this.chupaCabra.y));
    }

    // 5. Comportamento e Condução dos Bodes
    let leashedIdx = 1;
    for (const g of this.goats) {
      if (g.isRescued || g.hiddenInBushId) continue;

      const distToHero = Math.hypot(this.player.x - g.x, this.player.y - g.y);

      // Entrou no Curral
      if (
        Math.abs(g.x - this.curral.x) < this.curral.width / 2 - 15 &&
        Math.abs(g.y - this.curral.y) < this.curral.height / 2 - 15
      ) {
        g.isRescued = true;
        g.isLeashed = false;
        continue;
      }

      // Laçar com a corda
      if (this.hasRope && distToHero < 70) {
        g.isLeashed = true;
      }

      if (g.isLeashed) {
        const followDist = leashedIdx * 34;
        leashedIdx++;

        const targetX = this.player.x - dx * followDist;
        const targetY = this.player.y - dy * followDist;
        const angle = Math.atan2(targetY - g.y, targetX - g.x);
        const dist = Math.hypot(targetX - g.x, targetY - g.y);

        if (dist > 22) {
          g.x += Math.cos(angle) * 200 * dt;
          g.y += Math.sin(angle) * 200 * dt;
        }
      } else {
        // Sem corda: se grito potente ativo, corre procurando moita
        if (this.isGritoActive && distToHero < this.soundWaveRadius + 40) {
          g.fleeTimer = 1.2;
          const fleeAngle = Math.atan2(g.y - this.player.y, g.x - this.player.x);
          g.vx = Math.cos(fleeAngle) * 220;
          g.vy = Math.sin(fleeAngle) * 220;
        }

        if (g.fleeTimer > 0) {
          g.fleeTimer -= dt;
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;

          // Se alcançar uma moita vazia, esconde-se nela
          for (const bush of this.bushes) {
            if (!bush.hidingGoatId && Math.hypot(g.x - bush.x, g.y - bush.y) < bush.radius) {
              g.hiddenInBushId = bush.id;
              bush.hidingGoatId = g.id;
              g.fleeTimer = 0;
              break;
            }
          }
        } else {
          // Movimento errante
          g.wanderTimer -= dt;
          if (g.wanderTimer <= 0) {
            g.wanderTimer = 1.0 + Math.random() * 2.0;
            g.vx = (Math.random() - 0.5) * 70;
            g.vy = (Math.random() - 0.5) * 70;
          }
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;
        }
      }

      g.x = Math.max(40, Math.min(this.mapWidth - 40, g.x));
      g.y = Math.max(40, Math.min(this.mapHeight - 40, g.y));
    }

    // 6. Condição de Vitória (4 bodes no curral) ➔ SUCESSO!
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    if (rescuedCount === 4 && this.stateStatus === 'PLAYING') {
      this.stateStatus = 'SUCCESS';
      engine.unlockItem('carimbo');
      this.message = '🎉 TODOS OS 4 BODES SALVOS! O Fazendeiro entregou o 🪓 Carimbo Mágico!';
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    ctx.save();
    // Aplica Câmera do mundo
    ctx.translate(-this.camera.x, -this.camera.y);

    // Fundo da Caatinga Ampla
    ctx.fillStyle = '#26170d';
    ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

    // Grid do terreno
    ctx.strokeStyle = '#382214';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.mapWidth; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.mapHeight);
      ctx.stroke();
    }
    for (let y = 0; y < this.mapHeight; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.mapWidth, y);
      ctx.stroke();
    }

    // Iluminação do Candeeiro
    if (this.hasLantern) {
      ctx.save();
      const lanternGrad = ctx.createRadialGradient(
        this.player.x,
        this.player.y,
        40,
        this.player.x,
        this.player.y,
        280
      );
      lanternGrad.addColorStop(0, 'rgba(254, 240, 138, 0.3)');
      lanternGrad.addColorStop(1, 'rgba(38, 23, 13, 0)');
      ctx.fillStyle = lanternGrad;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, 280, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Curral Central
    renderEntity(ctx, this.curral);
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 4;
    ctx.strokeRect(
      this.curral.x - this.curral.width / 2,
      this.curral.y - this.curral.height / 2,
      this.curral.width,
      this.curral.height
    );

    renderEntity(ctx, this.fazendeiro);

    // Moitas no Terreno
    for (const bush of this.bushes) {
      ctx.save();
      ctx.fillStyle = bush.isSearched ? '#15803d' : '#166534';
      ctx.beginPath();
      ctx.arc(bush.x, bush.y, bush.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();

      drawText(ctx, bush.hidingGoatId ? '🌿 [MOITA - RUGIDO]' : '🌿 [MOITA]', bush.x, bush.y - 6, {
        font: 'bold 10px monospace',
        color: '#fef08a',
        align: 'center'
      });
      ctx.restore();
    }

    // Bodes (apenas os fora de moitas)
    for (const g of this.goats) {
      if (g.hiddenInBushId) continue;

      renderEntity(ctx, g);

      // Barra de HP
      const barW = 36;
      const barH = 5;
      const hpRatio = g.hp / g.maxHp;
      const hpColor = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444';

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(g.x - barW / 2, g.y - 24, barW, barH);
      ctx.fillStyle = hpColor;
      ctx.fillRect(g.x - barW / 2, g.y - 24, barW * hpRatio, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(g.x - barW / 2, g.y - 24, barW, barH);

      if (g.isRescued) {
        drawText(ctx, '✓ Salvo', g.x, g.y + 16, { font: 'bold 10px monospace', color: '#4ade80', align: 'center' });
      } else if (g.isLeashed) {
        drawText(ctx, '🪢 Preso', g.x, g.y + 16, { font: 'bold 10px monospace', color: '#facc15', align: 'center' });
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

    // Efeito Visual de Som
    if ((this.isAboioActive || this.isGritoActive) && this.soundWaveRadius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.soundWaveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = this.isGritoActive ? 'rgba(239, 68, 68, 0.9)' : 'rgba(250, 204, 21, 0.8)';
      ctx.lineWidth = this.isGritoActive ? 5 : 3;
      ctx.stroke();

      ctx.fillStyle = this.isGritoActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(250, 204, 21, 0.15)';
      ctx.fill();

      drawText(ctx, this.isGritoActive ? '📢 ÊÊÊ-BOOOI! (GRITO FORTE)' : '📣 ABOIO', this.player.x, this.player.y - 36, {
        font: 'bold 12px monospace',
        color: this.isGritoActive ? '#fca5a5' : '#fde047',
        align: 'center'
      });
      ctx.restore();
    }

    // Jogador
    renderEntity(ctx, this.player);

    ctx.restore(); // Restaura Câmera para renderizar HUD estático fixo na tela

    // HUD Superior Fixo
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    drawText(ctx, `🐐 FASE 1: O ATAQUE DO CHUPA-CABRA | Bodes Salvos: ${rescuedCount} / 4`, 480, 18, {
      font: 'bold 15px monospace',
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
      ctx.fillStyle = 'rgba(22, 101, 52, 0.92)';
      ctx.fillRect(240, 200, 480, 100);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 100);
      drawText(ctx, '🎉 SUCESSO! 🪓 CARIMBO MÁGICO CONQUISTADO!', 480, 225, {
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
      drawText(ctx, '💀 DERROTA: O CHUPA-CABRA DEVOROU O BODE!', 480, 225, {
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
