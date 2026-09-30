/**
 * ============================================================================
 * SISTEMA DE PARTÍCULAS COM OBJECT POOLING DE ALTA PERFORMANCE (ZERO GC)
 * O CORDEL DE COISINHA — GAME FEEL & JUICE
 * 
 * Engenharia: @Alexey (Game Frontend) & @Carmack (Game Tech Lead)
 * ============================================================================
 */

export type ParticleType = 'dust' | 'leaf' | 'sparkle' | 'sweat' | 'woodchip' | 'note';

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  type: ParticleType;
  rotation: number;
  vRot: number;
}

export class ParticlePool {
  private particles: Particle[] = [];
  private poolSize: number;

  constructor(size: number = 250) {
    this.poolSize = size;
    for (let i = 0; i < this.poolSize; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 3,
        color: '#d4a373',
        alpha: 1,
        maxLife: 1,
        life: 0,
        type: 'dust',
        rotation: 0,
        vRot: 0
      });
    }
  }

  public emit(
    type: ParticleType,
    x: number,
    y: number,
    options: {
      count?: number;
      speed?: number;
      spread?: number;
      color?: string;
      size?: number;
      life?: number;
      directionAngle?: number;
    } = {}
  ): void {
    const count = options.count || 1;
    const speed = options.speed || 40;
    const spread = options.spread !== undefined ? options.spread : Math.PI * 2;
    const baseAngle = options.directionAngle !== undefined ? options.directionAngle : 0;
    const baseLife = options.life || 0.6;
    const baseSize = options.size || 3;

    let emitted = 0;
    for (let i = 0; i < this.poolSize && emitted < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.type = type;
        p.x = x + (Math.random() - 0.5) * 6;
        p.y = y + (Math.random() - 0.5) * 6;

        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const s = speed * (0.5 + Math.random() * 0.8);
        p.vx = Math.cos(angle) * s;
        p.vy = Math.sin(angle) * s;

        p.size = baseSize * (0.7 + Math.random() * 0.6);
        p.maxLife = baseLife * (0.8 + Math.random() * 0.4);
        p.life = p.maxLife;
        p.alpha = 1;
        p.rotation = Math.random() * Math.PI * 2;
        p.vRot = (Math.random() - 0.5) * 6;

        if (options.color) {
          p.color = options.color;
        } else {
          switch (type) {
            case 'dust':
              p.color = Math.random() > 0.5 ? '#c2a170' : '#a07844';
              break;
            case 'leaf':
              p.color = Math.random() > 0.5 ? '#15803d' : '#166534';
              break;
            case 'sparkle':
              p.color = Math.random() > 0.5 ? '#facc15' : '#fef08a';
              break;
            case 'sweat':
              p.color = '#38bdf8';
              break;
            case 'woodchip':
              p.color = '#5c3a21';
              break;
            case 'note':
              p.color = '#eab308';
              break;
          }
        }

        emitted++;
      }
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.vRot * dt;

      // Atrito do ar
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.alpha = Math.max(0, p.life / p.maxLife);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let i = 0; i < this.poolSize; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'dust') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sparkle') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
        // Traço em cruz de xilo
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-p.size * 0.4, -p.size * 1.4, p.size * 0.8, p.size * 2.8);
        ctx.fillRect(-p.size * 1.4, -p.size * 0.4, p.size * 2.8, p.size * 0.8);
      } else if (p.type === 'note') {
        ctx.fillStyle = p.color;
        ctx.font = 'bold 12px monospace';
        ctx.fillText('♪', 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  public clear(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.particles[i].active = false;
    }
  }
}
