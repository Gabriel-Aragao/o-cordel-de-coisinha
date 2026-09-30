import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface Lot {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Gate {
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  label: string;
}

export class Stage2FulozinhaScene implements IScene {
  public id: SceneId = 'STAGE_2_FULOZINHA';
  public name = 'Fase 2: A Fazenda da Cumade Fulozinha';

  private player: Entity = {
    id: 'hero',
    x: 120,
    y: 260,
    width: 30,
    height: 30,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private lots: Lot[] = [
    { id: 'lote_0', name: 'LOTE 0 (Entrada)', x: 120, y: 270, width: 140, height: 110, color: '#1f2937' },
    { id: 'lote_2a', name: 'LOTE 2a', x: 300, y: 270, width: 140, height: 110, color: '#1e293b' },
    { id: 'lote_2b', name: 'LOTE 2b', x: 480, y: 270, width: 140, height: 110, color: '#1e293b' },
    { id: 'lote_1a', name: 'LOTE 1a', x: 300, y: 130, width: 140, height: 110, color: '#134e4a' },
    { id: 'lote_1b', name: 'LOTE 1b (Porteira)', x: 480, y: 130, width: 140, height: 110, color: '#134e4a' },
    { id: 'lote_3a', name: 'LOTE 3a (Fumo)', x: 300, y: 410, width: 140, height: 110, color: '#3f2e18' },
    { id: 'lote_3b', name: 'LOTE 3b', x: 480, y: 410, width: 140, height: 110, color: '#3f2e18' },
    { id: 'lote_3c', name: 'LOTE 3c (Fulô)', x: 660, y: 410, width: 140, height: 110, color: '#451a03' }
  ];

  private gates: Gate[] = [
    { x: 300, y: 200, width: 40, height: 16, isOpen: true, label: '[PASSAGEM 1a]' },
    { x: 480, y: 340, width: 40, height: 16, isOpen: false, label: '[PASSAGEM 3b]' },
    { x: 570, y: 410, width: 16, height: 40, isOpen: true, label: '[PORTEIRA 3c]' }
  ];

  private returnPortal: Entity = {
    id: 'portal',
    x: 40,
    y: 270,
    width: 32,
    height: 60,
    color: '#475569',
    label: '[ESTÚDIO]',
    shape: 'rect'
  };

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
    y: 300,
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
    width: 34,
    height: 34,
    color: '#eab308',
    label: '[CUMADE FULOZINHA]',
    shape: 'circle'
  };

  private hasFumo: boolean = false;
  private whistleTimer: number = 7.0;
  private isControlsInverted: boolean = false;
  private whistleDuration: number = 0;
  private message: string = 'Navegue pelos 7 lotes da fazenda, recolha o Fumo no Lote 3a e entregue à Cumade no Lote 3c!';
  private victoryTriggered: boolean = false;
  private whistleWaveRadius: number = 0;

  public init(engine: IGameEngine): void {
    this.player.x = 120;
    this.player.y = 270;
    this.hasFumo = false;
    this.whistleTimer = 7.0;
    this.isControlsInverted = false;
    this.whistleDuration = 0;
    this.whistleWaveRadius = 0;
    this.victoryTriggered = engine.inventory.folha;

    if (this.victoryTriggered) {
      this.message = '✓ Fase Concluída! Cumade Fulozinha entregou a 📄 Página Rasgada.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // 1. Ciclo de Assobios da Cumade Fulozinha
    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = 8.5;
      this.isControlsInverted = true;
      this.whistleDuration = 4.0;
      this.whistleWaveRadius = 10;
      this.message = '🎶 ASSOBIO NA MATA! Os cipós mudaram as passagens e os controles foram invertidos!';

      // Alterna o estado das passagens/portões
      for (const gate of this.gates) {
        gate.isOpen = !gate.isOpen;
      }
    }

    if (this.isControlsInverted) {
      this.whistleDuration -= dt;
      this.whistleWaveRadius += 300 * dt;
      if (this.whistleDuration <= 0) {
        this.isControlsInverted = false;
        this.whistleWaveRadius = 0;
        this.message = '🌿 O assobio cessou. A calma retorna e os controles voltaram ao normal.';
      }
    }

    // 2. Input com suporte a inversão de eixos
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

    const speed = this.player.speed || 220;
    const nextX = this.player.x + dx * speed * dt;
    const nextY = this.player.y + dy * speed * dt;

    // Colisão com portões fechados
    let blocked = false;
    for (const gate of this.gates) {
      if (!gate.isOpen) {
        if (
          Math.abs(nextX - gate.x) < (this.player.width + gate.width) / 2 &&
          Math.abs(nextY - gate.y) < (this.player.height + gate.height) / 2
        ) {
          blocked = true;
          break;
        }
      }
    }

    if (!blocked) {
      this.player.x = nextX;
      this.player.y = nextY;
    }

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // 3. Pista da Pedra da Botija (Lote 0)
    if (Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y) < 28) {
      this.message = '🪨 PISTA SECRETA: Você tropeçou numa pedra solta! Aqui jaz o tesouro de Mané Monteiro...';
    }

    // 4. Coleta do Fumo de Rolo (Lote 3a)
    if (!this.hasFumo && Math.hypot(this.player.x - this.fumoItem.x, this.player.y - this.fumoItem.y) < 32) {
      this.hasFumo = true;
      this.message = '🍂 Fumo de Rolo recolhido! Leve a oferenda sagrada para Cumade Fulozinha no Lote 3c!';
    }

    // 5. Interação com Cumade Fulozinha (Lote 3c)
    if (Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y) < 42) {
      if (this.hasFumo) {
        if (!this.victoryTriggered) {
          this.victoryTriggered = true;
          engine.unlockItem('folha');
          this.message = '🎉 Cumade Fulozinha fumou satisfeita e entregou a 📄 Página Rasgada do Cordel!';
        }
      } else {
        // Ataque de cipós que repele o jogador
        this.player.x = 480;
        this.player.y = 270;
        this.message = '⚠️ CHICOTE DE CIPÓ! Sem fumo de oferenda, Fulozinha te expulsou para o Lote 2b!';
      }
    }

    // 6. Retorno ao Estúdio pelo Portal
    if (
      Math.abs(this.player.x - this.returnPortal.x) < (this.player.width + this.returnPortal.width) / 2 &&
      Math.abs(this.player.y - this.returnPortal.y) < (this.player.height + this.returnPortal.height) / 2
    ) {
      engine.switchScene('STUDIO');
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Caatinga Profunda
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, 960, 540);

    // Linhas de Navegação e Caminhos entre Lotes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 8;
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

    // Render dos 7 Lotes do Labirinto
    for (const lot of this.lots) {
      ctx.fillStyle = lot.color;
      ctx.fillRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(lot.name, lot.x, lot.y - lot.height / 2 + 5);
    }

    // Render dos Portões Dinâmicos
    for (const gate of this.gates) {
      ctx.fillStyle = gate.isOpen ? '#16a34a' : '#dc2626';
      ctx.fillRect(gate.x - gate.width / 2, gate.y - gate.height / 2, gate.width, gate.height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(gate.x - gate.width / 2, gate.y - gate.height / 2, gate.width, gate.height);

      drawText(ctx, gate.isOpen ? 'ABERTO' : 'FECHADO', gate.x, gate.y - 12, {
        font: 'bold 9px monospace',
        color: gate.isOpen ? '#4ade80' : '#f87171',
        align: 'center'
      });
    }

    // Portal de Retorno
    renderEntity(ctx, this.returnPortal);

    // Itens e Entidades
    renderEntity(ctx, this.pedraItem);
    if (!this.hasFumo) renderEntity(ctx, this.fumoItem);
    renderEntity(ctx, this.fulozinha);
    renderEntity(ctx, this.player);

    // Efeito Visual de Onda do Assobio
    if (this.isControlsInverted) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.fillRect(0, 0, 960, 540);

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.fulozinha.x, this.fulozinha.y, this.whistleWaveRadius % 700, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      drawText(ctx, '⚡ ASSOBIO DA FULÔ: CONTROLES INVERTIDOS! ⚡', 480, 50, {
        font: 'bold 15px monospace',
        align: 'center',
        color: '#f87171'
      });
    }

    // Header
    drawText(ctx, '🌿 FASE 2: A FAZENDA DA CUMADE FULOZINHA', 480, 18, {
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
