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
    y: 430,
    width: 32,
    height: 32,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
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
    y: 130,
    width: 100,
    height: 75,
    color: '#475569',
    label: '[PRENSA DO DESTINO]',
    shape: 'rect'
  };

  private varal: Entity = {
    id: 'varal',
    x: 770,
    y: 130,
    width: 220,
    height: 45,
    color: '#ca8a04',
    label: '[VARAL DE CORDÉIS]',
    shape: 'rect'
  };

  private triggers: CordelFloorTrigger[] = [];
  private infoMessage: string = 'Pise em um cordel no chão para entrar no conto!';
  private pulseGlow: number = 0;

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 430;

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
    this.pulseGlow += dt * 4;

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

    const speed = this.player.speed || 230;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    // Limites da tela
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

    // Interação com a Prensa do Destino
    const distToPress = Math.hypot(this.player.x - this.press.x, this.player.y - this.press.y);
    if (distToPress < 75) {
      if (allCompleted) {
        this.infoMessage = '✨ 4 ITENS REUNIDOS! Aperte [E / Enter] para estampar seu cordel mestre!';
        if (input.interact) {
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
        engine.switchScene('VICTORY');
        return;
      }
    } else {
      this.door.label = '[PORTA MÁGICA - "Só heróis têm a chave"]';
      this.door.color = '#8b4513';
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // Fundo do Estúdio
    ctx.fillStyle = '#1c150e';
    ctx.fillRect(0, 0, 960, 540);

    // Linhas de tábuas de madeira rústica
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

    // Efeito da Prensa
    const allCompleted =
      engine.inventory.carimbo &&
      engine.inventory.folha &&
      engine.inventory.pena &&
      engine.inventory.tinta;

    if (allCompleted) {
      this.press.color = '#047857';
      ctx.save();
      const glow = (Math.sin(this.pulseGlow) + 1) / 2;
      ctx.strokeStyle = `rgba(74, 222, 128, ${0.4 + glow * 0.6})`;
      ctx.lineWidth = 6;
      ctx.strokeRect(
        this.press.x - this.press.width / 2 - 4,
        this.press.y - this.press.height / 2 - 4,
        this.press.width + 8,
        this.press.height + 8
      );
      ctx.restore();
    }
    renderEntity(ctx, this.press);

    // Render do Varal e seus 4 Pregadores
    renderEntity(ctx, this.varal);

    const completedItems = [
      { name: 'Chupa-Cabra', ok: engine.inventory.carimbo, icon: '🪓' },
      { name: 'Fulozinha', ok: engine.inventory.folha, icon: '📄' },
      { name: 'Rasga-Mortalha', ok: engine.inventory.pena, icon: '🪶' },
      { name: 'Botija', ok: engine.inventory.tinta, icon: '🖋️' }
    ];

    // Cordel pendurado no varal com pregadores
    for (let i = 0; i < 4; i++) {
      const item = completedItems[i];
      const px = 685 + i * 45;
      const py = 155;

      // Corda do varal
      ctx.fillStyle = item.ok ? '#22c55e' : '#64748b';
      ctx.fillRect(px - 14, py, 28, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 14, py, 28, 36);

      // Pregador de madeira
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px - 3, py - 6, 6, 10);

      // Ícone do cordel pendurado
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.ok ? item.icon : '🔒', px, py + 22);
    }

    // Render do Jogador
    renderEntity(ctx, this.player);

    // Banner Superior
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
