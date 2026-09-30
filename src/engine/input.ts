import { InputState, MouseState } from './types';

export class InputManager {
  private keys: Record<string, boolean> = {};
  private actionHeldTime: number = 0;
  private mouseState: MouseState = {
    x: 0,
    y: 0,
    isDown: false,
    clicked: false
  };
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Suporte a Touch
    canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
    canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;
    this.keys[e.key] = true;

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
    this.keys[e.key] = false;
  }

  private updateMousePos(clientX: number, clientY: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.mouseState.x = (clientX - rect.left) * scaleX;
    this.mouseState.y = (clientY - rect.top) * scaleY;
  }

  private onMouseDown(e: MouseEvent): void {
    this.updateMousePos(e.clientX, e.clientY);
    this.mouseState.isDown = true;
    this.mouseState.clicked = true;
  }

  private onMouseUp(e: MouseEvent): void {
    this.updateMousePos(e.clientX, e.clientY);
    this.mouseState.isDown = false;
  }

  private onMouseMove(e: MouseEvent): void {
    this.updateMousePos(e.clientX, e.clientY);
  }

  private onTouchStart(e: TouchEvent): void {
    if (e.touches.length > 0) {
      this.updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      this.mouseState.isDown = true;
      this.mouseState.clicked = true;
    }
  }

  private onTouchEnd(_e: TouchEvent): void {
    this.mouseState.isDown = false;
  }

  private onTouchMove(e: TouchEvent): void {
    if (e.touches.length > 0) {
      this.updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  public update(dt: number): void {
    const isAction = !!(this.keys['Space'] || this.keys['KeyJ']);
    if (isAction) {
      this.actionHeldTime += dt;
    } else {
      this.actionHeldTime = 0;
    }
  }

  public getState(): InputState {
    const up = !!(this.keys['KeyW'] || this.keys['ArrowUp']);
    const down = !!(this.keys['KeyS'] || this.keys['ArrowDown']);
    const left = !!(this.keys['KeyA'] || this.keys['ArrowLeft']);
    const right = !!(this.keys['KeyD'] || this.keys['ArrowRight']);
    const action = !!(this.keys['Space'] || this.keys['KeyJ']);
    const interact = !!(this.keys['KeyE'] || this.keys['Enter'] || this.keys['KeyK']);

    const state: InputState = {
      up,
      down,
      left,
      right,
      action,
      actionHeldTime: this.actionHeldTime,
      interact,
      mouse: { ...this.mouseState }
    };

    // Reseta flag de click pontual após leitura
    this.mouseState.clicked = false;

    return state;
  }

  public destroy(): void {
    window.removeEventListener('keydown', (e) => this.onKeyDown(e));
    window.removeEventListener('keyup', (e) => this.onKeyUp(e));
  }
}
