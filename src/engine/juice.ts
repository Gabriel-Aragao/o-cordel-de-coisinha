/**
 * ============================================================================
 * MOTOR DE GAME FEEL & JUICE — SCREEN SHAKE, IMPACTOS & TRANSIÇÕES CORDEL
 * O CORDEL DE COISINHA
 * 
 * Engenharia: @Alexey (Game Frontend) & @Carmack (Game Tech Lead)
 * ============================================================================
 */

import { ParticlePool } from './particles';

export class ScreenShake {
  public offsetX: number = 0;
  public offsetY: number = 0;

  private trauma: number = 0; // 0.0 a 1.0
  private time: number = 0;
  private decayRate: number = 1.6;

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number): void {
    this.time += dt * 35;
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - this.decayRate * dt);
      const shakePower = this.trauma * this.trauma; // Não-linear para impacto realista
      const maxOffset = 18;
      this.offsetX = Math.sin(this.time * 1.7) * maxOffset * shakePower;
      this.offsetY = Math.cos(this.time * 2.3) * maxOffset * shakePower;
    } else {
      this.offsetX = 0;
      this.offsetY = 0;
    }
  }
}

export class CordelTransition {
  public isActive: boolean = false;
  public progress: number = 0; // 0.0 (início) a 1.0 (fechado) a 2.0 (aberto)
  private onMidpoint?: () => void;
  private speed: number = 2.4;

  public start(onMidpoint?: () => void): void {
    this.isActive = true;
    this.progress = 0;
    this.onMidpoint = onMidpoint;
  }

  public update(dt: number): void {
    if (!this.isActive) return;

    const prevProgress = this.progress;
    this.progress += this.speed * dt;

    // Ponto médio da transição (tela 100% coberta) -> troca a cena
    if (prevProgress < 1.0 && this.progress >= 1.0) {
      if (this.onMidpoint) {
        this.onMidpoint();
      }
    }

    if (this.progress >= 2.0) {
      this.progress = 2.0;
      this.isActive = false;
    }
  }

  public render(ctx: CanvasRenderingContext2D, width: number = 960, height: number = 540): void {
    if (!this.isActive) return;

    ctx.save();
    let wipeFactor = 0;
    if (this.progress < 1.0) {
      wipeFactor = this.progress;
    } else {
      wipeFactor = 2.0 - this.progress;
    }

    // Cortina de papel kraft com borda de xilogravura recortada
    const currentW = (width / 2) * wipeFactor;

    // Lado esquerdo
    ctx.fillStyle = '#14100c';
    ctx.fillRect(0, 0, currentW, height);

    // Lado direito
    ctx.fillRect(width - currentW, 0, currentW, height);

    // Borda recortada de entalhe em madeira
    ctx.strokeStyle = '#e6cfa8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(currentW, 0);
    for (let y = 0; y <= height; y += 30) {
      ctx.lineTo(currentW - (y % 60 === 0 ? 12 : 0), y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - currentW, 0);
    for (let y = 0; y <= height; y += 30) {
      ctx.lineTo(width - currentW + (y % 60 === 0 ? 12 : 0), y);
    }
    ctx.stroke();

    ctx.restore();
  }
}

export class JuiceManager {
  public particles: ParticlePool;
  public shake: ScreenShake;
  public transition: CordelTransition;

  constructor() {
    this.particles = new ParticlePool(300);
    this.shake = new ScreenShake();
    this.transition = new CordelTransition();
  }

  public update(dt: number): void {
    this.particles.update(dt);
    this.shake.update(dt);
    this.transition.update(dt);
  }

  public renderParticles(ctx: CanvasRenderingContext2D): void {
    this.particles.render(ctx);
  }

  public renderTransition(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.transition.render(ctx, w, h);
  }
}
