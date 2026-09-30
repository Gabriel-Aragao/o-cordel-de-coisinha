import { IScene, IGameEngine, InputState, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';

export class VictoryScene implements IScene {
  public id: SceneId = 'VICTORY';
  public name = 'Clímax & Vitória';

  private isPrinted: boolean = false;
  private printProgress: number = 0;
  private animTimer: number = 0;

  public init(engine: IGameEngine): void {
    if (!engine.playerName) {
      engine.setPlayerName('Coisinha');
    }
    this.isPrinted = false;
    this.printProgress = 0;
    this.animTimer = 0;
  }

  public update(dt: number, _input: InputState, _engine: IGameEngine): void {
    this.animTimer += dt;
    if (!this.isPrinted) {
      this.printProgress += dt * 0.9;
      if (this.printProgress >= 1) {
        this.printProgress = 1;
        this.isPrinted = true;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // Fundo Papel de Cordel Envelhecido
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, 960, 540);

    // Moldura Dupla de Xilogravura
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 20, 900, 500);

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 30, 880, 480);

    // Ornamentos nos 4 Cantos
    const corners = [
      { x: 50, y: 40 },
      { x: 910, y: 40 },
      { x: 50, y: 500 },
      { x: 910, y: 500 }
    ];
    ctx.fillStyle = '#18181b';
    for (const c of corners) {
      ctx.fillRect(c.x - 6, c.y - 6, 12, 12);
    }

    // Cabeçalho do Folheto
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 22px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOLHETO DE CORDEL DO VELHO SERTÃO', 480, 65);

    ctx.font = '16px "Courier New", Courier, monospace';
    ctx.fillText('═════════════════════════════════════════════════════════════', 480, 85);

    // Título Personalizado com Nickname
    const displayName = (engine.playerName || 'Coisinha').toUpperCase();
    ctx.font = 'bold 26px "Courier New", Courier, monospace';
    ctx.fillText(`"O CORDEL DE ${displayName}:`, 480, 125);
    ctx.fillText('O HERÓI DO SERTÃO"', 480, 160);

    ctx.font = '16px "Courier New", Courier, monospace';
    ctx.fillText('═════════════════════════════════════════════════════════════', 480, 185);

    // Gravura Central de Xilogravura
    ctx.fillStyle = '#18181b';
    ctx.fillRect(360, 200, 240, 170);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(370, 210, 220, 150);

    // Desenho do Chapéu de Couro Sertanejo & Cacto
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(480, 280, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(480, 255, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 18px monospace';
    ctx.fillText('🌵   ⭐   🌵', 480, 340);

    // 4 Selos Místicos Conquistados
    const items = [
      { name: 'Carimbo Mágico', icon: '🪓', desc: 'Chupa-Cabra' },
      { name: 'Página Rasgada', icon: '📄', desc: 'Cumade Fulô' },
      { name: 'Pena Encantada', icon: '🪶', desc: 'Rasga-Mortalha' },
      { name: 'Tinta Encantada', icon: '🖋️', desc: 'Mané Monteiro' }
    ];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const ix = 120 + i * 240;
      const iy = 405;

      ctx.fillStyle = '#18181b';
      ctx.fillRect(ix - 50, iy - 20, 100, 45);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(ix - 48, iy - 18, 96, 41);

      ctx.fillStyle = '#18181b';
      ctx.font = '14px monospace';
      ctx.fillText(`${it.icon} ${it.name.split(' ')[0]}`, ix, iy);
      ctx.font = '9px monospace';
      ctx.fillText(it.desc, ix, iy + 14);
    }

    // Feedback de Prensagem / Conclusão
    if (this.isPrinted) {
      const pulse = Math.sin(this.animTimer * 5) * 2;
      drawText(ctx, '✨ A GRANDE PORTA SE ABRIU! VOCÊ CONQUISTOU A CHAVE DO SERTÃO! ✨', 480, 475 + pulse, {
        font: 'bold 14px "Courier New", monospace',
        color: '#15803d',
        align: 'center',
        shadow: false
      });
      drawText(ctx, 'O seu cordel agora é eterno nas feiras da Paraíba!', 480, 498, {
        font: '12px "Courier New", monospace',
        color: '#18181b',
        align: 'center',
        shadow: false
      });
    } else {
      drawText(ctx, `Prensando matriz de xilogravura com os 4 elementos... ${Math.round(this.printProgress * 100)}%`, 480, 480, {
        font: 'bold 13px "Courier New", monospace',
        color: '#b45309',
        align: 'center',
        shadow: false
      });
    }
  }

  public destroy(): void {}
}
