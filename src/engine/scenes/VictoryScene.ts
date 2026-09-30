import { IScene, IGameEngine, InputState, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';

export class VictoryScene implements IScene {
  public id: SceneId = 'VICTORY';
  public name = 'Clímax & Vitória';

  private isPrinted: boolean = false;
  private printProgress: number = 0;

  public init(engine: IGameEngine): void {
    if (!engine.playerName) {
      engine.setPlayerName('Coisinha');
    }
    this.isPrinted = false;
    this.printProgress = 0;
  }

  public update(dt: number, _input: InputState, _engine: IGameEngine): void {
    if (!this.isPrinted) {
      this.printProgress += dt * 0.8;
      if (this.printProgress >= 1) {
        this.printProgress = 1;
        this.isPrinted = true;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // Fundo Papel de Cordel / Xilogravura
    ctx.fillStyle = '#fef3c7'; // Tom papel envelhecido
    ctx.fillRect(0, 0, 960, 540);

    // Moldura de Cordel
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 30, 880, 480);

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 40, 860, 460);

    // Xilogravura Capa de Cordel
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 26px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOLHETO DE CORDEL', 480, 80);

    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.fillText('----------------------------------------------------', 480, 105);

    const displayName = engine.playerName || 'Coisinha';
    ctx.font = 'bold 28px "Courier New", Courier, monospace';
    ctx.fillText(`"O CORDEL DE ${displayName.toUpperCase()}:`, 480, 150);
    ctx.fillText('O HERÓI DO SERTÃO"', 480, 190);

    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.fillText('----------------------------------------------------', 480, 220);

    // Gravura Central
    ctx.fillStyle = '#18181b';
    ctx.fillRect(360, 240, 240, 160);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(370, 250, 220, 140);

    // Desenho de Xilogravura Estilizado no Centro
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(480, 310, 35, 0, Math.PI * 2);
    ctx.fill();

    // Chapéu de Couro Sertanejo
    ctx.beginPath();
    ctx.ellipse(480, 280, 45, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Estrelas e cactos ao redor
    ctx.font = '22px monospace';
    ctx.fillText('🌵  ⭐  🌵', 480, 375);

    // Status da Prensa / Saída da Porta
    if (this.isPrinted) {
      drawText(ctx, '✨ A PORTA ANCESTRAL SE ABRIU EM FEIXES DE LUZ DOURADA! ✨', 480, 430, {
        font: 'bold 15px "Courier New", monospace',
        color: '#15803d',
        align: 'center',
        shadow: false
      });
      drawText(ctx, 'Parabéns! Você concluiu todos os contos do sertão encantado!', 480, 460, {
        font: '13px "Courier New", monospace',
        color: '#18181b',
        align: 'center',
        shadow: false
      });
    } else {
      drawText(ctx, `Prensando matriz de xilogravura... ${Math.round(this.printProgress * 100)}%`, 480, 440, {
        font: 'bold 15px "Courier New", monospace',
        color: '#b45309',
        align: 'center',
        shadow: false
      });
    }
  }

  public destroy(): void {}
}
