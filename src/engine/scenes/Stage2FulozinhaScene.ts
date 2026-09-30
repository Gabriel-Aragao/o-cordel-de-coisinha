import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface Lot {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export class Stage2FulozinhaScene implements IScene {
  public id: SceneId = 'STAGE_2_FULOZINHA';
  public name = 'Fase 2: A Fazenda da Cumade Fulozinha';

  private player: Entity = {
    id: 'hero',
    x: 120,
    y: 270,
    width: 28,
    height: 28,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 210
  };

  private lots: Lot[] = [
    { name: 'LOTE 0 (Início)', x: 120, y: 270, width: 140, height: 110, color: '#1f2937' },
    { name: 'LOTE 2a', x: 300, y: 270, width: 140, height: 110, color: '#1e293b' },
    { name: 'LOTE 2b', x: 480, y: 270, width: 140, height: 110, color: '#1e293b' },
    { name: 'LOTE 1a', x: 300, y: 130, width: 140, height: 110, color: '#134e4a' },
    { name: 'LOTE 1b', x: 480, y: 130, width: 140, height: 110, color: '#134e4a' },
    { name: 'LOTE 3a (Fumo)', x: 300, y: 410, width: 140, height: 110, color: '#3f2e18' },
    { name: 'LOTE 3b', x: 480, y: 410, width: 140, height: 110, color: '#3f2e18' },
    { name: 'LOTE 3c (Fulô)', x: 660, y: 410, width: 140, height: 110, color: '#451a03' }
  ];

  private fumoItem: Entity = {
    id: 'fumo',
    x: 300,
    y: 410,
    width: 26,
    height: 26,
    color: '#92400e',
    label: '[FUMO DE ROLO]',
    shape: 'rect'
  };

  private pedraItem: Entity = {
    id: 'pedra',
    x: 120,
    y: 240,
    width: 24,
    height: 24,
    color: '#64748b',
    label: '[PEDRA DA BOTIJA]',
    shape: 'rect'
  };

  private fulozinha: Entity = {
    id: 'fulozinha',
    x: 660,
    y: 410,
    width: 32,
    height: 32,
    color: '#eab308', // Amarelo místico
    label: '[CUMADE FULOZINHA]',
    shape: 'circle'
  };

  private hasFumo: boolean = false;
  private whistleTimer: number = 6.0;
  private isControlsInverted: boolean = false;
  private whistleDuration: number = 0;
  private message: string = 'Encontre o Fumo de Rolo no Lote 3a e leve para Cumade Fulozinha no Lote 3c!';

  public init(engine: IGameEngine): void {
    this.player.x = 120;
    this.player.y = 270;
    this.hasFumo = false;
    this.whistleTimer = 6.0;
    this.isControlsInverted = false;
    this.whistleDuration = 0;

    if (engine.inventory.folha) {
      this.message = '✓ Fase concluída! Página Rasgada obtida com Cumade Fulozinha.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // Timer dos Assobios Místicos
    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = 8.0;
      this.isControlsInverted = true;
      this.whistleDuration = 3.5;
      this.message = '🎶 ASSOBIO NA MATA! Os ventos inverteram seus controles!';
    }

    if (this.isControlsInverted) {
      this.whistleDuration -= dt;
      if (this.whistleDuration <= 0) {
        this.isControlsInverted = false;
        this.message = 'Os ventos se acalmaram. Controles normais.';
      }
    }

    // Input considerando inversão
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

    const speed = this.player.speed || 210;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // Coleta da Pedra (Pista)
    if (Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y) < 25) {
      this.message = '🪨 Você tropeçou numa pedra solta... Parece ser o local de uma botija!';
    }

    // Coleta do Fumo de Rolo
    if (!this.hasFumo && Math.hypot(this.player.x - this.fumoItem.x, this.player.y - this.fumoItem.y) < 30) {
      this.hasFumo = true;
      this.message = '🍂 Fumo de Rolo coletado! Leve a oferenda para Cumade Fulozinha no Lote 3c!';
    }

    // Interação com Cumade Fulozinha
    if (Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y) < 40) {
      if (this.hasFumo) {
        if (!engine.inventory.folha) {
          engine.unlockItem('folha');
          this.message = '🎁 Cumade Fulozinha aceitou o fumo e entregou a 📄 Página Rasgada!';
        }
      } else {
        this.message = '⚠️ CUIDADO! Sem fumo de oferenda, Fulozinha chicoteia com cipós!';
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Floresta da Caatinga
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 960, 540);

    // Lotes do Labirinto
    for (const lot of this.lots) {
      ctx.fillStyle = lot.color;
      ctx.fillRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lot.name, lot.x, lot.y);
    }

    // Linhas de Conexão entre Lotes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(120, 270);
    ctx.lineTo(300, 270);
    ctx.lineTo(480, 270);
    ctx.moveTo(300, 270);
    ctx.lineTo(300, 130);
    ctx.moveTo(480, 270);
    ctx.lineTo(480, 130);
    ctx.moveTo(300, 270);
    ctx.lineTo(300, 410);
    ctx.lineTo(480, 410);
    ctx.lineTo(660, 410);
    ctx.stroke();

    // Itens e Entidades
    renderEntity(ctx, this.pedraItem);
    if (!this.hasFumo) renderEntity(ctx, this.fumoItem);
    renderEntity(ctx, this.fulozinha);
    renderEntity(ctx, this.player);

    // Indicador de Inversão de Controles
    if (this.isControlsInverted) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(0, 0, 960, 540);
      drawText(ctx, '⚡ CONTROLES INVERTIDOS PELO ASSOBIO! ⚡', 480, 60, {
        font: 'bold 16px monospace',
        align: 'center',
        color: '#f87171'
      });
    }

    // Header
    drawText(ctx, '🌿 FASE 2: A FAZENDA DA CUMADE FULOZINHA', 480, 20, {
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
