import { IScene, IGameEngine, InputState, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawMolduraCordel,
  drawCoisinha,
  drawItemCarimbo,
  drawItemFolha,
  drawItemPena,
  drawItemTinta,
  XILO_COLORS
} from '../../renderer/xilogravura';

export class VictoryScene implements IScene {
  public id: SceneId = 'VICTORY';
  public name = 'Clímax & Vitória';

  private isPrinted: boolean = false;
  private printProgress: number = 0;
  private animTimer: number = 0;
  private sparkleTimer: number = 0;

  public init(engine: IGameEngine): void {
    if (!engine.playerName) {
      engine.setPlayerName('Coisinha');
    }
    this.isPrinted = false;
    this.printProgress = 0;
    this.animTimer = 0;
    this.sparkleTimer = 0;
  }

  public update(dt: number, _input: InputState, engine: IGameEngine): void {
    this.animTimer += dt;
    if (!this.isPrinted) {
      this.printProgress += dt * 0.9;
      if (this.printProgress >= 1) {
        this.printProgress = 1;
        this.isPrinted = true;
        engine.sound.playPrensaImpacto();
        engine.sound.playVictoryJingle();
        engine.juice.shake.addTrauma(0.6);
        engine.juice.particles.emit('sparkle', 480, 240, { count: 35, speed: 80 });
      }
    } else {
      this.sparkleTimer += dt;
      if (this.sparkleTimer >= 0.4) {
        this.sparkleTimer = 0;
        engine.juice.particles.emit('sparkle', 200 + Math.random() * 560, 100 + Math.random() * 340, {
          count: 2,
          speed: 25
        });
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // 1. Fundo Papel Kraft / Folheto de Cordel Envelhecido
    ctx.fillStyle = XILO_COLORS.kraftPaper;
    ctx.fillRect(0, 0, 960, 540);

    // Textura sutil de papel artesanal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let py = 10; py < 530; py += 30) {
      ctx.fillRect(20, py, 920, 1);
    }

    // 2. Moldura Ornamental Clássica de Xilogravura
    drawMolduraCordel(ctx, 24, 16, 912, 508, { borderWeight: 5 });

    // 3. Cabeçalho do Folheto de Cordel
    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOLHETO DE CORDEL DO VELHO SERTÃO', 480, 52);

    ctx.font = '14px "Courier New", Courier, monospace';
    ctx.fillText('═══════════════════════════════════════════════════════════════════', 480, 70);

    // 4. Título Personalizado com Nickname do Herói
    const displayName = (engine.playerName || 'Coisinha').toUpperCase();
    ctx.font = 'bold 24px "Courier New", Courier, monospace';
    ctx.fillText(`"O CORDEL DE ${displayName}:`, 480, 102);
    ctx.fillText('O HERÓI DO SERTÃO"', 480, 130);

    ctx.font = '14px "Courier New", Courier, monospace';
    ctx.fillText('═══════════════════════════════════════════════════════════════════', 480, 148);

    // 5. Gravura Central de Xilogravura com Moldura de Entalhe
    const gx = 360;
    const gy = 160;
    const gw = 240;
    const gh = 180;

    // Fundo da xilo
    ctx.fillStyle = XILO_COLORS.black;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.fillStyle = XILO_COLORS.kraftLight;
    ctx.fillRect(gx + 6, gy + 6, gw - 12, gh - 12);
    ctx.strokeStyle = XILO_COLORS.black;
    ctx.lineWidth = 2;
    ctx.strokeRect(gx + 6, gy + 6, gw - 12, gh - 12);

    // Herói Coisinha Ilustrado no Centro da Capa
    drawCoisinha(ctx, 480, 245, 50, 64, {
      time: this.animTimer,
      isMoving: false
    });

    // Elementos Sertanejos Laterais (Cacto & Sol de Xilo)
    ctx.fillStyle = XILO_COLORS.black;
    ctx.font = 'bold 18px monospace';
    ctx.fillText('🌵', 400, 275);
    ctx.fillText('🌵', 560, 275);
    ctx.fillText('⭐', 480, 185);

    // 6. Os 4 Selos Místicos Conquistados (Arte em Xilo)
    const items = [
      { name: 'Carimbo Mágico', desc: 'Chupa-Cabra', draw: drawItemCarimbo, color: XILO_COLORS.goldAccent },
      { name: 'Página Rasgada', desc: 'Cumade Fulô', draw: drawItemFolha, color: XILO_COLORS.greenAccent },
      { name: 'Pena Encantada', desc: 'Rasga-Mortalha', draw: drawItemPena, color: XILO_COLORS.purpleAccent },
      { name: 'Tinta Encantada', desc: 'Mané Monteiro', draw: drawItemTinta, color: XILO_COLORS.cyanAccent }
    ];

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const ix = 140 + i * 225;
      const iy = 385;

      // Card de Selo
      ctx.fillStyle = XILO_COLORS.black;
      ctx.fillRect(ix - 55, iy - 24, 110, 52);
      ctx.fillStyle = XILO_COLORS.kraftLight;
      ctx.fillRect(ix - 52, iy - 21, 104, 46);
      ctx.strokeStyle = it.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ix - 52, iy - 21, 104, 46);

      // Desenho do Ícone Xilogravado
      it.draw(ctx, ix - 30, iy + 2, 22);

      // Nome do Item
      ctx.fillStyle = XILO_COLORS.black;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(it.name.split(' ')[0], ix - 12, iy - 2);
      ctx.font = '9px monospace';
      ctx.fillStyle = '#525252';
      ctx.fillText(it.desc, ix - 12, iy + 12);
      ctx.textAlign = 'center';
    }

    // 7. Feedback de Prensagem / Conclusão
    if (this.isPrinted) {
      const pulse = Math.sin(this.animTimer * 5) * 2;
      drawText(ctx, '✨ A GRANDE PORTA SE ABRIU! VOCÊ CONQUISTOU A CHAVE DO SERTÃO! ✨', 480, 460 + pulse, {
        font: 'bold 13px "Courier New", monospace',
        color: '#15803d',
        align: 'center'
      });
      drawText(ctx, 'O seu cordel agora é eterno nas feiras e cantorias da Paraíba!', 480, 482, {
        font: '12px "Courier New", monospace',
        color: XILO_COLORS.black,
        align: 'center'
      });
    } else {
      drawText(ctx, `Prensando matriz de xilogravura com os 4 elementos... ${Math.round(this.printProgress * 100)}%`, 480, 470, {
        font: 'bold 13px "Courier New", monospace',
        color: '#b45309',
        align: 'center'
      });
    }
  }

  public destroy(): void {}
}
