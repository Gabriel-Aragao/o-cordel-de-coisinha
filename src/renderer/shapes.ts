import { Entity } from '../engine/types';
import {
  drawCoisinha,
  drawBode,
  drawChupaCabra,
  drawCumadeFulozinha,
  drawRasgaMortalha,
  drawFazendeiro,
  drawBeato,
  drawVioleiro,
  drawMoradorBebado,
  drawCactoMandacaru,
  drawMoitaFrutaRegional,
  drawMoitaCactoEspinhos,
  drawItemCarimbo,
  drawItemFolha,
  drawItemPena,
  drawItemTinta,
  drawItemBotija,
  drawMoita,
  drawPrensa,
  drawVaral,
  drawMolduraCordel,
  drawTelaApresentacaoCordel,
  drawTelaEncerramentoCordel,
  drawMascaraEscuridaoCandeeiro,
  drawMesaMontagemXilo,
  drawPalcoVioleirosXilo,
  drawGalinha,
  drawPorco,
  drawJumento,
  drawCachorro,
  drawInteriorCasaXilo,
  drawCaixaDialogoXilo,
  drawPlacaAviso,
} from './xilogravura';

export * from './xilogravura';

export function renderEntity(ctx: CanvasRenderingContext2D, entity: Entity, time: number = 0): void {
  ctx.save();

  const id = (entity.id || '').toLowerCase();
  const label = (entity.label || '').toLowerCase();

  // 1. Mapeamento para Sprites Ricos de Xilogravura
  if (id.includes('hero') || label.includes('heroi') || label.includes('coisinha')) {
    drawCoisinha(ctx, entity.x, entity.y, entity.width || 36, entity.height || 48, {
      time,
      isMoving: false,
      isInvulnerable: (entity as any).isInvulnerable || ((entity as any).invulnerableTimer && (entity as any).invulnerableTimer > 0),
    });
  } else if (id.includes('violeiro') || label.includes('violeiro') || label.includes('repentista')) {
    drawVioleiro(ctx, entity.x, entity.y, entity.width || 44, entity.height || 50, {
      time,
      colorTint: id.includes('1') ? '#78350f' : '#1e3a8a',
    });
  } else if (id.includes('bebado') || id.includes('drunk') || label.includes('bêbado') || label.includes('morador')) {
    drawMoradorBebado(ctx, entity.x, entity.y, entity.width || 38, entity.height || 48, {
      time,
      colorTint: entity.color || '#475569',
    });
  } else if (id.includes('cacto') || label.includes('cacto') || label.includes('mandacaru')) {
    drawCactoMandacaru(ctx, entity.x, entity.y, entity.width || 48, entity.height || 72, {
      time,
    });
  } else if (id.includes('moita_fruta') || label.includes('fruta') || label.includes('umbu')) {
    drawMoitaFrutaRegional(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) / 2 || 26);
  } else if (id.includes('moita_espinho') || label.includes('espinho')) {
    drawMoitaCactoEspinhos(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) / 2 || 26);
  } else if (id.includes('bode') || label.includes('bode') || id.includes('goat')) {
    drawBode(ctx, entity.x, entity.y, entity.width || 44, entity.height || 36, {
      time,
    });
  } else if (id.includes('chupa') || label.includes('chupa-cabra')) {
    drawChupaCabra(ctx, entity.x, entity.y, entity.width || 60, entity.height || 60, {
      time,
    });
  } else if (id.includes('fulo') || label.includes('fulozinha')) {
    drawCumadeFulozinha(ctx, entity.x, entity.y, entity.width || 48, entity.height || 54, {
      time,
      colorTint: entity.color === '#ef4444' ? 'rgba(239, 68, 68, 0.4)' : undefined,
    });
  } else if (id.includes('rasga') || id.includes('owl') || label.includes('rasga-mortalha')) {
    drawRasgaMortalha(ctx, entity.x, entity.y, entity.width || 56, entity.height || 48, {
      time,
    });
  } else if (id.includes('fazendeiro') || label.includes('fazendeiro')) {
    drawFazendeiro(ctx, entity.x, entity.y, entity.width || 40, entity.height || 48);
  } else if (id.includes('beato') || label.includes('beato')) {
    drawBeato(ctx, entity.x, entity.y, entity.width || 40, entity.height || 52);
  } else if (id.includes('carimbo') || label.includes('carimbo')) {
    drawItemCarimbo(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) || 32);
  } else if (id.includes('folha') || label.includes('folha')) {
    drawItemFolha(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) || 32);
  } else if (id.includes('pena') || label.includes('pena')) {
    drawItemPena(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) || 32);
  } else if (id.includes('tinta') || label.includes('tinta')) {
    drawItemTinta(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) || 32);
  } else if (id.includes('botija') || label.includes('botija')) {
    drawItemBotija(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) || 36);
  } else if (id.includes('moita') || id.includes('bush') || label.includes('moita')) {
    drawMoita(ctx, entity.x, entity.y, Math.max(entity.width, entity.height) / 2 || 24);
  } else if (id.includes('press') || label.includes('prensa')) {
    drawPrensa(ctx, entity.x, entity.y, entity.width || 120, entity.height || 70, true);
  } else if (id.includes('varal') || label.includes('varal')) {
    drawVaral(ctx, entity.x, entity.y, entity.width || 360, entity.height || 80, {
      carimbo: true,
      folha: true,
      pena: true,
      tinta: true,
    });
  } else if (id.includes('placa') || label.includes('placa') || label.includes('topada')) {
    drawPlacaAviso(ctx, entity.x, entity.y, entity.width || 34, entity.height || 34, entity.label, { time });
  } else {
    // 2. Fallback com contorno estilizado de Xilogravura
    if (entity.shape === 'rect') {
      ctx.fillStyle = entity.color;
      ctx.fillRect(
        entity.x - entity.width / 2,
        entity.y - entity.height / 2,
        entity.width,
        entity.height
      );

      ctx.strokeStyle = '#14100c';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(
        entity.x - entity.width / 2,
        entity.y - entity.height / 2,
        entity.width,
        entity.height
      );
    } else if (entity.shape === 'circle') {
      const radius = Math.max(entity.width, entity.height) / 2;
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = entity.color;
      ctx.fill();
      ctx.strokeStyle = '#14100c';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (entity.shape === 'triangle') {
      const halfW = entity.width / 2;
      const halfH = entity.height / 2;
      ctx.beginPath();
      ctx.moveTo(entity.x, entity.y - halfH);
      ctx.lineTo(entity.x + halfW, entity.y + halfH);
      ctx.lineTo(entity.x - halfW, entity.y + halfH);
      ctx.closePath();
      ctx.fillStyle = entity.color;
      ctx.fill();
      ctx.strokeStyle = '#14100c';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  // Render da Legenda [LABEL]
  if (entity.label) {
    ctx.fillStyle = '#f4ebd9';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    // Sombra para contraste
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(entity.label, entity.x, entity.y - entity.height / 2 - 6);
  }

  ctx.restore();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    color?: string;
    font?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    shadow?: boolean;
  } = {}
): void {
  ctx.save();
  ctx.fillStyle = options.color || '#f4ebd9';
  ctx.font = options.font || '16px monospace';
  ctx.textAlign = options.align || 'left';
  ctx.textBaseline = options.baseline || 'top';

  if (options.shadow !== false) {
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

export {
  drawMolduraCordel,
  drawTelaApresentacaoCordel,
  drawTelaEncerramentoCordel,
  drawMascaraEscuridaoCandeeiro,
  drawMesaMontagemXilo,
  drawPalcoVioleirosXilo,
  drawGalinha,
  drawPorco,
  drawJumento,
  drawCachorro,
  drawInteriorCasaXilo,
  drawCaixaDialogoXilo,
};

export function drawUnifiedToast(
  ctx: CanvasRenderingContext2D,
  message: string,
  width: number = 960,
  height: number = 580,
  options: {
    isError?: boolean;
    isSuccess?: boolean;
    icon?: string;
  } = {}
): void {
  if (!message) return;

  const boxW = Math.min(840, Math.max(480, message.length * 9.5 + 80));
  const boxH = 50;
  const boxX = (width - boxW) / 2;
  const boxY = height - 62;

  const defaultIcon = options.isError ? '💀' : options.isSuccess ? '✨' : '📜';
  const icon = options.icon || defaultIcon;
  const speakerColor = options.isError ? '#ef4444' : options.isSuccess ? '#22c55e' : '#f59e0b';

  drawCaixaDialogoXilo(ctx, boxX, boxY, boxW, boxH, icon, message, {
    isToast: true,
    speakerColor,
    prompt: '',
    borderWeight: 2,
  });
}
