import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface House extends Entity {
  index: number;
  corName: string;
  morador: string;
  bebida: string;
  fumo: string;
  animal: string;
  hasPena: boolean;
}

export class Stage3RasgaMortalhaScene implements IScene {
  public id: SceneId = 'STAGE_3_RASGAMORTALHA';
  public name = 'Fase 3: A Pena da Rasga-Mortalha';

  private player: Entity = {
    id: 'hero',
    x: 100,
    y: 420,
    width: 28,
    height: 28,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 210
  };

  private houses: House[] = [
    {
      id: 'house_1',
      index: 1,
      x: 130,
      y: 200,
      width: 110,
      height: 120,
      color: '#eab308', // Amarela
      corName: 'Amarela',
      morador: 'Sanfoneiro',
      bebida: 'Água de Pote',
      fumo: 'Cachimbo de Barro',
      animal: 'Galo de Campina',
      label: '[CASA 1 - AMARELA]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_2',
      index: 2,
      x: 290,
      y: 200,
      width: 110,
      height: 120,
      color: '#2563eb', // Azul
      corName: 'Azul',
      morador: 'Vaqueiro',
      bebida: 'Aluá de Milho',
      fumo: 'Rapé de Imburana',
      animal: 'Cavalo',
      label: '[CASA 2 - AZUL]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_3',
      index: 3,
      x: 450,
      y: 200,
      width: 110,
      height: 120,
      color: '#dc2626', // Vermelha
      corName: 'Vermelha',
      morador: 'Rezadeira',
      bebida: 'Café c/ Rapadura',
      fumo: 'Fumo de Palha',
      animal: 'Bode',
      label: '[CASA 3 - VERMELHA]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_4',
      index: 4,
      x: 610,
      y: 200,
      width: 110,
      height: 120,
      color: '#16a34a', // Verde
      corName: 'Verde',
      morador: 'Ferrador',
      bebida: 'Cachaça',
      fumo: 'Fumo de Rolo',
      animal: 'Tatu 🏆',
      label: '[CASA 4 - VERDE]',
      shape: 'rect',
      hasPena: true
    },
    {
      id: 'house_5',
      index: 5,
      x: 770,
      y: 200,
      width: 110,
      height: 120,
      color: '#f8fafc', // Branca
      corName: 'Branca',
      morador: 'Xilógrafo',
      bebida: 'Garapa',
      fumo: 'Cachimbo de Angico',
      animal: 'Jumento',
      label: '[CASA 5 - BRANCA]',
      shape: 'rect',
      hasPena: false
    }
  ];

  private selectedHouse: House | null = null;
  private message: string = 'Aproxime-se das casas e aperte [E / Enter] para investigar o enigma de dedução!';
  private clueIndex: number = 0;
  private clues: string[] = [
    '📜 Pista 1: O Sanfoneiro mora na primeira casa e é vizinho da Casa Azul.',
    '📜 Pista 2: A Rezadeira mora na casa Vermelha. Quem mora no meio bebe Café.',
    '📜 Pista 3: A Casa Verde fica à esquerda da Branca. O dono da Verde bebe Cachaça.',
    '📜 Pista 4: O dono da Amarela fuma Cachimbo de Barro. O Vaqueiro bebe Aluá.',
    '📜 Pista 5: Quem fuma Fumo de Rolo é o Ferrador e mora na casa com o Tatu!'
  ];

  public init(engine: IGameEngine): void {
    this.player.x = 100;
    this.player.y = 420;
    this.selectedHouse = null;
    this.clueIndex = 0;

    if (engine.inventory.pena) {
      this.message = '✓ Enigma resolvido! A Pena da Rasga-Mortalha foi resgatada na Casa 4.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
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

    const speed = this.player.speed || 210;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(260, Math.min(500, this.player.y));

    // Troca de pistas com Espaço
    if (input.action) {
      this.clueIndex = (this.clueIndex + 1) % this.clues.length;
    }

    // Identifica casa mais próxima
    let nearest: House | null = null;
    for (const h of this.houses) {
      if (Math.hypot(this.player.x - h.x, this.player.y - (h.y + 60)) < 70) {
        nearest = h;
        break;
      }
    }
    this.selectedHouse = nearest;

    // Interação
    if (input.interact && this.selectedHouse) {
      if (this.selectedHouse.hasPena) {
        if (!engine.inventory.pena) {
          engine.unlockItem('pena');
          this.message = '🎉 CORRETO! Na Casa 4 (Verde / Ferrador) você encontrou a 🪶 Pena Encantada!';
        }
      } else {
        this.message = `🔍 Casa ${this.selectedHouse.index} (${this.selectedHouse.corName}): Mora ${this.selectedHouse.morador}, bebe ${this.selectedHouse.bebida}. A pena não está aqui.`;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Noite de Vilarejo
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 960, 540);

    // Lua e estrelas
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(880, 70, 30, 0, Math.PI * 2);
    ctx.fill();

    // Render das 5 Casas
    for (const h of this.houses) {
      renderEntity(ctx, h);

      // Telhado
      ctx.beginPath();
      ctx.moveTo(h.x - h.width / 2 - 10, h.y - h.height / 2);
      ctx.lineTo(h.x, h.y - h.height / 2 - 35);
      ctx.lineTo(h.x + h.width / 2 + 10, h.y - h.height / 2);
      ctx.closePath();
      ctx.fillStyle = '#7c2d12';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Porta da casa
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(h.x - 14, h.y + h.height / 2 - 35, 28, 35);
    }

    // Painel de Pistas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(40, 20, 780, 50);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(40, 20, 780, 50);
    drawText(ctx, this.clues[this.clueIndex], 55, 30, { font: '13px monospace', color: '#fef08a' });
    drawText(ctx, '(Aperte [Espaço] para alternar pistas)', 55, 48, { font: '11px monospace', color: '#94a3b8' });

    // Detalhes da Casa Selecionada
    if (this.selectedHouse) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(200, 340, 560, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(200, 340, 560, 60);
      drawText(ctx, `🏠 CASA ${this.selectedHouse.index} (${this.selectedHouse.corName}) | Morador: ${this.selectedHouse.morador}`, 215, 350, { font: 'bold 12px monospace', color: '#38bdf8' });
      drawText(ctx, `Bebida: ${this.selectedHouse.bebida} | Criação: ${this.selectedHouse.animal} | [E / Enter] Investigar`, 215, 372, { font: '11px monospace', color: '#e2e8f0' });
    }

    renderEntity(ctx, this.player);

    drawText(ctx, '🦉 FASE 3: A PENA DA RASGA-MORTALHA (ENIGMA DE DEDUÇÃO)', 480, 100, {
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
