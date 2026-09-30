import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

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
    y: 420,
    width: 32,
    height: 32,
    color: '#3b82f6', // Azul
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private door: Entity = {
    id: 'door',
    x: 480,
    y: 90,
    width: 200,
    height: 40,
    color: '#8b4513',
    label: '[PORTA MÁGICA - TRANCA]',
    shape: 'rect'
  };

  private press: Entity = {
    id: 'press',
    x: 180,
    y: 120,
    width: 90,
    height: 70,
    color: '#475569',
    label: '[PRENSA]',
    shape: 'rect'
  };

  private varal: Entity = {
    id: 'varal',
    x: 760,
    y: 120,
    width: 180,
    height: 40,
    color: '#ca8a04',
    label: '[VARAL DE CORDÉIS]',
    shape: 'rect'
  };

  private triggers: CordelFloorTrigger[] = [];
  private infoMessage: string = 'Pise em um cordel no chão para entrar no conto!';

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 420;

    this.triggers = [
      {
        id: 'STAGE_1_CHUPACABRA',
        name: 'Conto 1: O Ataque do Chupa-Cabra',
        x: 200,
        y: 300,
        width: 140,
        height: 60,
        itemRequired: 'carimbo',
        isCompleted: engine.inventory.carimbo
      },
      {
        id: 'STAGE_2_FULOZINHA',
        name: 'Conto 2: Fazenda da Cumade Fulozinha',
        x: 380,
        y: 300,
        width: 140,
        height: 60,
        itemRequired: 'folha',
        isCompleted: engine.inventory.folha
      },
      {
        id: 'STAGE_3_RASGAMORTALHA',
        name: 'Conto 3: A Pena da Rasga-Mortalha',
        x: 560,
        y: 300,
        width: 140,
        height: 60,
        itemRequired: 'pena',
        isCompleted: engine.inventory.pena
      },
      {
        id: 'STAGE_4_BOTIJA',
        name: 'Conto 4: A Botija de Mané Monteiro',
        x: 740,
        y: 300,
        width: 140,
        height: 60,
        itemRequired: 'tinta',
        isCompleted: engine.inventory.tinta
      }
    ];
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

    const speed = this.player.speed || 200;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    // Limites da tela (Canvas 960x540)
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;
    this.player.x = Math.max(halfW + 20, Math.min(960 - halfW - 20, this.player.x));
    this.player.y = Math.max(halfH + 20, Math.min(540 - halfH - 20, this.player.y));

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

    // Checa colisão com a Prensa / Porta quando tudo estiver completo
    if (allCompleted) {
      this.door.label = '[PORTA MÁGICA - DESTRAVADA!]';
      this.door.color = '#10b981';

      if (
        Math.abs(this.player.x - this.door.x) < (this.player.width + this.door.width) / 2 &&
        Math.abs(this.player.y - this.door.y) < (this.player.height + this.door.height) / 2
      ) {
        engine.switchScene('VICTORY');
        return;
      }
    } else {
      this.door.label = '[PORTA MÁGICA - "Só heróis têm a chave"]';
      this.door.color = '#8b4513';
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // Fundo do Estúdio (madeira/terra)
    ctx.fillStyle = '#1c150e';
    ctx.fillRect(0, 0, 960, 540);

    // Grid rústica de tábuas de madeira
    ctx.strokeStyle = '#2d2216';
    ctx.lineWidth = 1;
    for (let x = 40; x < 960; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 540);
      ctx.stroke();
    }

    // Render dos 4 Cordéis no chão
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

    // Render das Estruturas
    renderEntity(ctx, this.door);
    renderEntity(ctx, this.press);
    renderEntity(ctx, this.varal);

    // Contagem de cordéis no varal
    const completedCount = [
      engine.inventory.carimbo,
      engine.inventory.folha,
      engine.inventory.pena,
      engine.inventory.tinta
    ].filter(Boolean).length;

    drawText(ctx, `Cordéis no Varal: ${completedCount} / 4`, 760, 150, {
      font: '11px monospace',
      align: 'center',
      color: '#fde047'
    });

    // Render do Herói
    renderEntity(ctx, this.player);

    // Banner Superior
    drawText(ctx, '🏛️ ESTÚDIO DE XILOGRAVURA MÍSTICO', 480, 20, {
      font: 'bold 16px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.infoMessage, 480, 500, {
      font: '13px monospace',
      align: 'center',
      color: '#cbd5e1'
    });
  }

  public destroy(): void {}
}
