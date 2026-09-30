import { InputState } from './types';

export class InputManager {
  private keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;
    this.keys[e.key] = true;

    // Evita scroll da tela ao usar setas ou espaço no jogo
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
    this.keys[e.key] = false;
  }

  public getState(): InputState {
    const up = !!(this.keys['KeyW'] || this.keys['ArrowUp']);
    const down = !!(this.keys['KeyS'] || this.keys['ArrowDown']);
    const left = !!(this.keys['KeyA'] || this.keys['ArrowLeft']);
    const right = !!(this.keys['KeyD'] || this.keys['ArrowRight']);
    const action = !!(this.keys['Space'] || this.keys['KeyJ']);
    const interact = !!(this.keys['KeyE'] || this.keys['Enter'] || this.keys['KeyK']);

    return { up, down, left, right, action, interact };
  }

  public destroy(): void {
    window.removeEventListener('keydown', (e) => this.onKeyDown(e));
    window.removeEventListener('keyup', (e) => this.onKeyUp(e));
  }
}
