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

interface PatrolPoint {
  x: number;
  y: number;
}

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
    speed: 220
  };

  private lots: Lot[] = [
    { id: 'lote_0', name: 'LOTE 0 (A Pedra)', x: 120, y: 270, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_2a', name: 'LOTE 2a', x: 300, y: 270, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_2b', name: 'LOTE 2b', x: 480, y: 270, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_1a', name: 'LOTE 1a', x: 300, y: 130, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_1b', name: 'LOTE 1b (Entrada)', x: 480, y: 130, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_3a', name: 'LOTE 3a', x: 300, y: 410, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_3b', name: 'LOTE 3b', x: 480, y: 410, width: 140, height: 110, color: '#0f172a' },
    { id: 'lote_3c', name: 'LOTE 3c', x: 660, y: 410, width: 140, height: 110, color: '#0f172a' }
  ];

  private botija: Entity = {
    id: 'botija',
    x: 120,
    y: 270,
    width: 26,
    height: 26,
    color: '#eab308',
    label: '[BOTIJA DE OURO]',
    shape: 'rect'
  };

  private paroquia: Entity = {
    id: 'paroquia',
    x: 780,
    y: 130,
    width: 130,
    height: 80,
    color: '#475569',
    label: '[BEATO / PARÓQUIA]',
    shape: 'rect'
  };

  private returnPortal: Entity = {
    id: 'portal',
    x: 880,
    y: 490,
    width: 80,
    height: 32,
    color: '#334155',
    label: '[ESTÚDIO]',
    shape: 'rect'
  };

  private fulozinhaFuriosa: Entity = {
    id: 'fulo_furia',
    x: 300,
    y: 270,
    width: 32,
    height: 32,
    color: '#ef4444',
    label: '[FULÔ EM FÚRIA]',
    shape: 'circle',
    speed: 160
  };

  private patrolWaypoints: PatrolPoint[] = [
    { x: 300, y: 270 },
    { x: 480, y: 270 },
    { x: 480, y: 410 },
    { x: 300, y: 410 },
    { x: 120, y: 270 },
    { x: 300, y: 130 },
    { x: 480, y: 130 }
  ];
  private currentWaypointIndex: number = 0;

  private hasBotija: boolean = false;
  private message: string = 'Infiltre-se no escuro até a pedra no Lote 0, desenterre a Botija e leve ao Beato na Paróquia!';
  private victoryTriggered: boolean = false;
  private detectionRadius: number = 90;

  public init(engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 130;
    this.hasBotija = false;
    this.currentWaypointIndex = 0;
    this.victoryTriggered = engine.inventory.tinta;

    if (this.victoryTriggered) {
      this.message = '✓ Fase Concluída! O Beato entregou o frasco de 🖋️ Tinta Encantada.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // 1. Movimento do Jogador (Penalidade de -25% com a botija)
    let dx = 0;
    let dy = 0;

    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy -= 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    const currentSpeed = this.hasBotija ? 165 : 220;
    this.player.x += dx * currentSpeed * dt;
    this.player.y += dy * currentSpeed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // 2. Patrulha Furtiva da Cumade Fulozinha em Fúria
    const targetWp = this.patrolWaypoints[this.currentWaypointIndex];
    const distToWp = Math.hypot(targetWp.x - this.fulozinhaFuriosa.x, targetWp.y - this.fulozinhaFuriosa.y);

    if (distToWp < 15) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
    } else {
      const angle = Math.atan2(targetWp.y - this.fulozinhaFuriosa.y, targetWp.x - this.fulozinhaFuriosa.x);
      const speed = this.fulozinhaFuriosa.speed || 160;
      this.fulozinhaFuriosa.x += Math.cos(angle) * speed * dt;
      this.fulozinhaFuriosa.y += Math.sin(angle) * speed * dt;
    }

    // 3. Detecção Stealth pela Fulô em Fúria
    const distToHero = Math.hypot(this.player.x - this.fulozinhaFuriosa.x, this.player.y - this.fulozinhaFuriosa.y);
    if (distToHero < this.detectionRadius) {
      // Detectado! Chicoteia e reseta para a entrada do Lote 1b
      this.player.x = 480;
      this.player.y = 130;
      this.hasBotija = false;
      this.message = '⚠️ VOCÊ FOI VISTO! A Fulô chicoteou nas trevas e te empurrou de volta à entrada!';
    }

    // 4. Desenterrar a Botija no Lote 0
    if (!this.hasBotija && !this.victoryTriggered) {
      if (Math.hypot(this.player.x - this.botija.x, this.player.y - this.botija.y) < 36) {
        this.hasBotija = true;
        this.message = '🏺 BOTIJA DESENTERRADA! É pesada (-25% vel). Esgueire-se até o Beato na Paróquia!';
      }
    }

    // 5. Entrega da Botija ao Beato na Paróquia
    if (this.hasBotija) {
      if (Math.hypot(this.player.x - this.paroquia.x, this.player.y - this.paroquia.y) < 65) {
        if (!this.victoryTriggered) {
          this.victoryTriggered = true;
          this.hasBotija = false;
          engine.unlockItem('tinta');
          this.message = '🎉 BÊNÇÃO CONCEDIDA: O Beato recebeu a botija e te entregou a 🖋️ Tinta Encantada!';
        }
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
    // Fundo Escuridão Profunda da Noite Sertaneja
    ctx.fillStyle = '#020408';
    ctx.fillRect(0, 0, 960, 540);

    // Linhas de Caminhos Sutis
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(120, 270);
    ctx.lineTo(300, 270);
    ctx.lineTo(480, 270);
    ctx.moveTo(300, 270);
    ctx.lineTo(300, 130);
    ctx.moveTo(480, 270);
    ctx.lineTo(480, 130);
    ctx.moveTo(480, 130);
    ctx.lineTo(780, 130);
    ctx.moveTo(300, 270);
    ctx.lineTo(300, 410);
    ctx.lineTo(480, 410);
    ctx.lineTo(660, 410);
    ctx.stroke();

    // Render dos 7 Lotes
    for (const lot of this.lots) {
      ctx.fillStyle = lot.color;
      ctx.fillRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(lot.x - lot.width / 2, lot.y - lot.height / 2, lot.width, lot.height);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(lot.name, lot.x, lot.y - lot.height / 2 + 5);
    }

    // Paróquia do Beato
    renderEntity(ctx, this.paroquia);
    drawText(ctx, '⛪ IGREJA', this.paroquia.x, this.paroquia.y + 14, {
      font: 'bold 11px monospace',
      color: '#facc15',
      align: 'center'
    });

    // Botija no chão se ainda não desenterrada
    if (!this.hasBotija && !this.victoryTriggered) {
      renderEntity(ctx, this.botija);
    }

    // Raio de Alerta Vermelho ao redor da Fulô Furiosa
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.fulozinhaFuriosa.x, this.fulozinhaFuriosa.y, this.detectionRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fill();
    ctx.restore();

    renderEntity(ctx, this.fulozinhaFuriosa);

    // Efeito Iluminação Dinâmica do Candeeiro (FOV)
    ctx.save();
    const lightRadius = 135;
    const gradient = ctx.createRadialGradient(
      this.player.x,
      this.player.y,
      25,
      this.player.x,
      this.player.y,
      lightRadius
    );
    gradient.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    gradient.addColorStop(0.7, 'rgba(254, 240, 138, 0.08)');
    gradient.addColorStop(1, 'rgba(2, 4, 8, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Portal de Retorno
    renderEntity(ctx, this.returnPortal);

    // Jogador e feedback de transporte da Botija
    renderEntity(ctx, this.player);
    if (this.hasBotija) {
      drawText(ctx, '🏺 CARREGANDO BOTIJA (-25% Vel)', this.player.x, this.player.y - 32, {
        font: 'bold 10px monospace',
        color: '#facc15',
        align: 'center'
      });
    }

    // Header
    drawText(ctx, '🏺 FASE 4: A BOTIJA DE MANÉ MONTEIRO (STEALTH NOTURNO)', 480, 18, {
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
