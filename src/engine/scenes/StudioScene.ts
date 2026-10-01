import { IScene, IGameEngine, InputState, SceneId, Entity } from '../types';
import { drawText, renderEntity } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawPrensa,
  drawVaral,
  drawChaoEstudioMadeira,
  drawMolduraCordel
} from '../../renderer/xilogravura';

interface CordelFloorTrigger {
  id: SceneId;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  itemRequired: string;
  isCompleted: boolean;
}

export class StudioScene implements IScene {
  public id: SceneId = 'STUDIO';
  public name = 'Estúdio de Xilogravura';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 430,
    width: 36,
    height: 48,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private door: Entity = {
    id: 'door',
    x: 480,
    y: 85,
    width: 200,
    height: 40,
    color: '#8b4513',
    label: '[PORTA MÁGICA - TRANCA]',
    shape: 'rect'
  };

  private triggers: CordelFloorTrigger[] = [];
  private infoMessage: string = 'Pise em um cordel no chão para entrar no conto!';
  private pulseGlow: number = 0;
  private animTime: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;
  private stepTimer: number = 0;

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 430;
    this.stepTimer = 0;
    this.animTime = 0;

    this.triggers = [
      {
        id: 'STAGE_1_CHUPACABRA',
        name: 'Conto 1: O Ataque do Chupa-Cabra',
        x: 180,
        y: 310,
        width: 140,
        height: 60,
        itemRequired: 'carimbo',
        isCompleted: engine.inventory.carimbo
      },
      {
        id: 'STAGE_2_FULOZINHA',
        name: 'Conto 2: Fazenda da Cumade Fulozinha',
        x: 370,
        y: 310,
        width: 140,
        height: 60,
        itemRequired: 'folha',
        isCompleted: engine.inventory.folha
      },
      {
        id: 'STAGE_3_RASGAMORTALHA',
        name: 'Conto 3: A Pena da Rasga-Mortalha',
        x: 560,
        y: 310,
        width: 140,
        height: 60,
        itemRequired: 'pena',
        isCompleted: engine.inventory.pena
      },
      {
        id: 'STAGE_4_BOTIJA',
        name: 'Conto 4: A Botija de Mané Monteiro',
        x: 750,
        y: 310,
        width: 140,
        height: 60,
        itemRequired: 'tinta',
        isCompleted: engine.inventory.tinta
      }
    ];
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;
    this.pulseGlow += dt * 4;

    // Movimento do Jogador
    let dx = 0;
    let dy = 0;

    if (input.left) {
      dx -= 1;
      this.facing = 'left';
    }
    if (input.right) {
      dx += 1;
      this.facing = 'right';
    }
    if (input.up) {
      dy -= 1;
      this.facing = 'up';
    }
    if (input.down) {
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
    } else {
      this.stepTimer = 0.2;
    }

    const speed = this.player.speed || 230;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    // Limites da tela (960x580)
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;
    this.player.x = Math.max(halfW + 30, Math.min(960 - halfW - 30, this.player.x));
    this.player.y = Math.max(halfH + 30, Math.min(580 - halfH - 30, this.player.y));

    // Atualiza status dos triggers
    this.triggers[0].isCompleted = engine.inventory.carimbo;
    this.triggers[1].isCompleted = engine.inventory.folha;
    this.triggers[2].isCompleted = engine.inventory.pena;
    this.triggers[3].isCompleted = engine.inventory.tinta;

    const allCompleted =
      engine.inventory.carimbo &&
      engine.inventory.folha &&
      engine.inventory.pena &&
      engine.inventory.tinta;

    // Checa colisão com os cordéis no chão
    for (const t of this.triggers) {
      if (
        Math.abs(this.player.x - t.x) < (this.player.width + t.width) / 2 &&
        Math.abs(this.player.y - t.y) < (this.player.height + t.height) / 2
      ) {
        this.infoMessage = `Entrando em: ${t.name}...`;
        engine.switchScene(t.id);
        return;
      }
    }

    // Interação com a Prensa do Destino
    const distToPress = Math.hypot(this.player.x - 180, this.player.y - 130);
    if (distToPress < 75) {
      if (allCompleted) {
        this.infoMessage = '✨ 4 ITENS REUNIDOS! Aperte [E / Enter] para estampar seu cordel mestre!';
        if (input.interact) {
          engine.sound.playPrensaImpacto();
          engine.juice.shake.addTrauma(0.6);
          engine.switchScene('VICTORY');
          return;
        }
      } else {
        const remaining = 4 - [
          engine.inventory.carimbo,
          engine.inventory.folha,
          engine.inventory.pena,
          engine.inventory.tinta
        ].filter(Boolean).length;
        this.infoMessage = `🔒 A Prensa necessita dos 4 instrumentos mestre! Faltam ${remaining} elemento(s).`;
      }
    }

    // Porta Mágica
    if (allCompleted) {
      this.door.label = '[PORTA MÁGICA - DESTRAVADA!]';
      this.door.color = '#10b981';

      if (
        Math.abs(this.player.x - this.door.x) < (this.player.width + this.door.width) / 2 &&
        Math.abs(this.player.y - this.door.y) < (this.player.height + this.door.height) / 2
      ) {
        engine.sound.playPrensaImpacto();
        engine.switchScene('VICTORY');
        return;
      }
    } else {
      this.door.label = '[PORTA MÁGICA - "Só heróis têm a chave"]';
      this.door.color = '#8b4513';
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // 1. Piso Rústico de Tábuas de Madeira do Estúdio (960x580)
    drawChaoEstudioMadeira(ctx, 0, 0, 960, 580);

    // 2. Moldura de Xilogravura do Estúdio
    drawMolduraCordel(ctx, 10, 10, 940, 560, { borderWeight: 4 });

    // 3. Render dos 4 Cordéis no chão
    for (let i = 0; i < this.triggers.length; i++) {
      const t = this.triggers[i];
      ctx.save();
      ctx.fillStyle = t.isCompleted ? '#166534' : '#78350f';
      ctx.fillRect(t.x - t.width / 2, t.y - t.height / 2, t.width, t.height);
      ctx.strokeStyle = t.isCompleted ? '#4ade80' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(t.x - t.width / 2, t.y - t.height / 2, t.width, t.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[CORDEL ${i + 1}]`, t.x, t.y - 10);
      ctx.font = '10px monospace';
      ctx.fillText(t.isCompleted ? '✓ Concluído' : 'Pise para entrar', t.x, t.y + 10);
      ctx.restore();
    }

    // 4. Porta Ancestral
    renderEntity(ctx, this.door);

    // 5. Prensa do Destino (Xilogravura da Maya)
    const allCompleted =
      engine.inventory.carimbo &&
      engine.inventory.folha &&
      engine.inventory.pena &&
      engine.inventory.tinta;

    drawPrensa(ctx, 180, 130, 120, 90, allCompleted);

    // 6. Varal de Cordéis com Pregadores (Xilogravura da Maya)
    drawVaral(ctx, 770, 130, 240, 60, engine.inventory);

    // 7. Herói Coisinha (Xilogravura da Maya com Animação de Passos)
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    // 8. Cabeçalho e HUD
    drawText(ctx, '🏛️ ESTÚDIO DE XILOGRAVURA MÍSTICO', 480, 20, {
      font: 'bold 16px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.infoMessage, 480, 505, {
      font: '12px monospace',
      align: 'center',
      color: '#cbd5e1'
    });
  }

  public destroy(): void {}
}
