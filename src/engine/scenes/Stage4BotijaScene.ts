import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

export class Stage4BotijaScene implements IScene {
  public id: SceneId = 'STAGE_4_BOTIJA';
  public name = 'Fase 4: A Botija de Mané Monteiro';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 130, // Entrada pelo Lote 1b
    width: 28,
    height: 28,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 210
  };

  private botija: Entity = {
    id: 'botija',
    x: 120,
    y: 270, // Lote 0
    width: 24,
    height: 24,
    color: '#eab308',
    label: '[BOTIJA DE OURO]',
    shape: 'rect'
  };

  private paroquia: Entity = {
    id: 'paroquia',
    x: 760,
    y: 130,
    width: 110,
    height: 70,
    color: '#64748b',
    label: '[BEATO / PARÓQUIA]',
    shape: 'rect'
  };

  private patrolFulozinha: Entity = {
    id: 'patrol',
    x: 350,
    y: 270,
    width: 30,
    height: 30,
    color: '#ef4444',
    label: '[FULÔ EM FÚRIA]',
    shape: 'circle',
    speed: 150
  };

  private patrolDirection: number = 1;
  private hasBotija: boolean = false;
  private message: string = 'Navegue no escuro até o Lote 0, pegue a Botija e entregue ao Beato na Paróquia!';

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 130;
    this.hasBotija = false;

    if (engine.inventory.tinta) {
      this.message = '✓ Botija entregue! Tinta Encantada em mãos.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // Movimento Jogador (mais lento se carregando botija)
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

    const currentSpeed = this.hasBotija ? 150 : 210;
    this.player.x += dx * currentSpeed * dt;
    this.player.y += dy * currentSpeed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // Patrulha da Fulô
    this.patrolFulozinha.y += this.patrolDirection * 140 * dt;
    if (this.patrolFulozinha.y > 440) {
      this.patrolDirection = -1;
    } else if (this.patrolFulozinha.y < 150) {
      this.patrolDirection = 1;
    }

    // Coleta da Botija no Lote 0
    if (!this.hasBotija && Math.hypot(this.player.x - this.botija.x, this.player.y - this.botija.y) < 35) {
      this.hasBotija = true;
      this.message = '🏺 Você desenterrou a Botija! Ela é pesada (-25% vel). Leve-a para a Paróquia!';
    }

    // Entrega na Paróquia
    if (this.hasBotija && Math.hypot(this.player.x - this.paroquia.x, this.player.y - this.paroquia.y) < 50) {
      if (!engine.inventory.tinta) {
        engine.unlockItem('tinta');
        this.message = '🎉 O Beato abençoou sua jornada e entregou o frasco de 🖋️ Tinta Encantada!';
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Preto Noite Escura
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, 960, 540);

    // Efeito de Luz do Candeeiro (Raio de Visão)
    ctx.save();
    const lightRadius = 140;
    const gradient = ctx.createRadialGradient(
      this.player.x,
      this.player.y,
      20,
      this.player.x,
      this.player.y,
      lightRadius
    );
    gradient.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    gradient.addColorStop(0.7, 'rgba(254, 240, 138, 0.1)');
    gradient.addColorStop(1, 'rgba(5, 7, 12, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Render dos Objetos
    renderEntity(ctx, this.paroquia);
    if (!this.hasBotija) renderEntity(ctx, this.botija);
    renderEntity(ctx, this.patrolFulozinha);
    renderEntity(ctx, this.player);

    drawText(ctx, '🏺 FASE 4: A BOTIJA DE MANÉ MONTEIRO (STEALTH NOTURNO)', 480, 20, {
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
