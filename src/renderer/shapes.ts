import { Entity } from '../engine/types';

export function renderEntity(ctx: CanvasRenderingContext2D, entity: Entity): void {
  ctx.save();

  if (entity.shape === 'rect') {
    ctx.fillStyle = entity.color;
    ctx.fillRect(
      entity.x - entity.width / 2,
      entity.y - entity.height / 2,
      entity.width,
      entity.height
    );

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
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
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
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
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Render da Legenda [LABEL]
  if (entity.label) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    // Sombra para contraste
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(entity.label, entity.x, entity.y - entity.height / 2 - 4);
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
