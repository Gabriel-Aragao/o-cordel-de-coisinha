import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawCumadeFulozinha,
  drawBeato,
  drawItemBotija,
  drawChaoTerraBatida,
  drawMolduraCordel
} from '../../renderer/xilogravura';
import { DialogSystem } from '../dialogs';
import { NarrativeModalManager } from '../narrative';

type LotId = 'igreja' | '0' | '1a' | '1b' | '2a' | '2b' | '3a' | '3b';

interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface InternalGate {
  x: number;
  y: number;
  w: number;
  h: number;
  isOpen: boolean;
}

interface LotData {
  id: LotId;
  name: string;
  walls: Wall[];
  gates: InternalGate[];
  isSanctuary?: boolean;
}

export class Stage4BotijaScene implements IScene {
  public id: SceneId = 'STAGE_4_BOTIJA';
  public name = 'Fase 4: A Botija de Mané Monteiro';

  // Início no Santuário da Igreja
  private currentLot: LotId = 'igreja';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 360,
    width: 36,
    height: 50,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private fulozinha: Entity = {
    id: 'fulo_furia',
    x: 480,
    y: 270,
    width: 42,
    height: 48,
    color: '#ef4444',
    label: '[FULÔ EM FÚRIA]',
    shape: 'circle',
    speed: 160
  };

  // A Fulô NUNCA entra na Igreja
  private fuloCurrentLot: LotId = '2b';
  private fuloLotChangeTimer: number = 4.0;
  private whistleTimer: number = 6.0;

  private pedraItem: Entity = {
    id: 'pedra',
    x: 480,
    y: 270,
    width: 32,
    height: 32,
    color: '#64748b',
    label: '[PEDRA DA BOTIJA]',
    shape: 'rect'
  };

  private beato: Entity = {
    id: 'beato',
    x: 480,
    y: 180,
    width: 36,
    height: 50,
    color: '#facc15',
    label: '[BEATO DA PARÓQUIA]',
    shape: 'rect'
  };

  private altar: Entity = {
    id: 'altar',
    x: 480,
    y: 120,
    width: 160,
    height: 40,
    color: '#713f12',
    label: '[ALTAR DE SÃO JOSÉ]',
    shape: 'rect'
  };

  private hasBotija: boolean = false;
  private hasLantern: boolean = false;
  private digProgress: number = 0;
  private isDigging: boolean = false;

  private message: string = 'Saia da Igreja pela esquerda, desenterre a Botija no Lote 0 e retorne ao Santuário!';
  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private stepTimer: number = 0;
  private digSoundTimer: number = 0;
  private bellTimer: number = 0;
  private animTime: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;

  private dialogs: DialogSystem = new DialogSystem();
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  // Ciclo de patrulha da Fulô (exclui a Igreja)
  private lotSequence: LotId[] = ['0', '2a', '1a', '2b', '1b', '3b', '3a'];

  // Definição dos 8 Lotes com Paredes Perimétricas Sólidas, Barreiras Internas e Portões Alternantes
  private lots: Record<LotId, LotData> = {
    'igreja': {
      id: 'igreja',
      name: 'LOTE DA IGREJA — SANTUÁRIO SEGURO (BEATO)',
      isSanctuary: true,
      walls: [
        { x: 480, y: 12, w: 960, h: 24 },
        { x: 480, y: 528, w: 960, h: 24 },
        { x: 948, y: 270, w: 24, h: 540 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
        { x: 480, y: 120, w: 180, h: 40 },
        { x: 260, y: 270, w: 20, h: 260 },
        { x: 700, y: 270, w: 20, h: 260 }
      ],
      gates: []
    },
    '0': {
      id: '0',
      name: 'LOTE 0 — A PEDRA ANCESTRAL DA BOTIJA',
      walls: [
        { x: 480, y: 12, w: 960, h: 24 },
        { x: 480, y: 528, w: 960, h: 24 },
        { x: 12, y: 270, w: 24, h: 540 },
        { x: 948, y: 105, w: 24, h: 210 },
        { x: 948, y: 435, w: 24, h: 210 },
        // Labirinto Interno Complexo
        { x: 250, y: 180, w: 24, h: 220 },
        { x: 480, y: 380, w: 24, h: 200 },
        { x: 700, y: 200, w: 24, h: 220 }
      ],
      gates: [
        { x: 250, y: 340, w: 24, h: 80, isOpen: true },
        { x: 700, y: 360, w: 24, h: 80, isOpen: false }
      ]
    },
    '1a': {
      id: '1a',
      name: 'LOTE 1a — TRILHA NORTE DA CAATINGA',
      walls: [
        { x: 480, y: 12, w: 960, h: 24 },
        { x: 12, y: 270, w: 24, h: 540 },
        { x: 210, y: 528, w: 420, h: 24 },
        { x: 750, y: 528, w: 420, h: 24 },
        { x: 948, y: 105, w: 24, h: 210 },
        { x: 948, y: 435, w: 24, h: 210 },
        // Labirinto Interno
        { x: 340, y: 220, w: 24, h: 240 },
        { x: 620, y: 320, w: 24, h: 240 }
      ],
      gates: [{ x: 480, y: 200, w: 100, h: 24, isOpen: false }]
    },
    '1b': {
      id: '1b',
      name: 'LOTE 1b — PORTEIRA DA IGREJA',
      walls: [
        { x: 480, y: 12, w: 960, h: 24 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
        { x: 948, y: 105, w: 24, h: 210 },
        { x: 948, y: 435, w: 24, h: 210 },
        { x: 210, y: 528, w: 420, h: 24 },
        { x: 750, y: 528, w: 420, h: 24 },
        // Labirinto Interno
        { x: 360, y: 270, w: 24, h: 260 },
        { x: 620, y: 220, w: 24, h: 220 }
      ],
      gates: [{ x: 360, y: 180, w: 24, h: 80, isOpen: true }]
    },
    '2a': {
      id: '2a',
      name: 'LOTE 2a — ENCRUZILHADA CENTRAL OESTE',
      walls: [
        { x: 210, y: 12, w: 420, h: 24 },
        { x: 750, y: 12, w: 420, h: 24 },
        { x: 210, y: 528, w: 420, h: 24 },
        { x: 750, y: 528, w: 420, h: 24 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
        { x: 948, y: 105, w: 24, h: 210 },
        { x: 948, y: 435, w: 24, h: 210 },
        // Labirinto Interno
        { x: 260, y: 270, w: 24, h: 220 },
        { x: 500, y: 220, w: 240, h: 24 },
        { x: 720, y: 350, w: 24, h: 200 }
      ],
      gates: [{ x: 500, y: 220, w: 80, h: 24, isOpen: true }]
    },
    '2b': {
      id: '2b',
      name: 'LOTE 2b — ENCRUZILHADA CENTRAL LESTE',
      walls: [
        { x: 948, y: 270, w: 24, h: 540 },
        { x: 210, y: 12, w: 420, h: 24 },
        { x: 750, y: 12, w: 420, h: 24 },
        { x: 210, y: 528, w: 420, h: 24 },
        { x: 750, y: 528, w: 420, h: 24 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
        // Labirinto Interno
        { x: 380, y: 340, w: 24, h: 220 },
        { x: 650, y: 200, w: 24, h: 240 }
      ],
      gates: [{ x: 650, y: 360, w: 24, h: 80, isOpen: false }]
    },
    '3a': {
      id: '3a',
      name: 'LOTE 3a — BOSQUE ESCURO',
      walls: [
        { x: 480, y: 528, w: 960, h: 24 },
        { x: 12, y: 270, w: 24, h: 540 },
        { x: 210, y: 12, w: 420, h: 24 },
        { x: 750, y: 12, w: 420, h: 24 },
        { x: 948, y: 105, w: 24, h: 210 },
        { x: 948, y: 435, w: 24, h: 210 },
        // Labirinto Interno
        { x: 320, y: 300, w: 24, h: 260 },
        { x: 640, y: 220, w: 24, h: 240 }
      ],
      gates: [{ x: 480, y: 300, w: 100, h: 24, isOpen: true }]
    },
    '3b': {
      id: '3b',
      name: 'LOTE 3b — CLAREIRA DOS CIPÓS',
      walls: [
        { x: 480, y: 528, w: 960, h: 24 },
        { x: 948, y: 270, w: 24, h: 540 },
        { x: 210, y: 12, w: 420, h: 24 },
        { x: 750, y: 12, w: 420, h: 24 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
        // Labirinto Interno
        { x: 280, y: 270, w: 24, h: 280 },
        { x: 620, y: 270, w: 24, h: 280 }
      ],
      gates: [
        { x: 280, y: 180, w: 24, h: 80, isOpen: true },
        { x: 620, y: 360, w: 24, h: 80, isOpen: false }
      ]
    }
  };

  public init(engine: IGameEngine): void {
    this.currentLot = 'igreja';
    this.player.x = 480;
    this.player.y = 360;
    this.fuloCurrentLot = '2b';
    this.fuloLotChangeTimer = 4.0;
    this.whistleTimer = 6.0;
    this.hasBotija = false;
    this.hasLantern = false;
    this.digProgress = 0;
    this.isDigging = false;
    this.stateStatus = 'PLAYING';
    this.stepTimer = 0;
    this.digSoundTimer = 0;
    this.bellTimer = 0;
    this.animTime = 0;

    engine.sound.playSinoBadalo();

    // Apresentação da Fase (Folheto de Cordel)
    this.narrative.showIntro({
      phaseNumber: 4,
      title: 'A Botija de Mané Monteiro',
      subtitle: 'O tesouro encantado, a fuga nas trevas e a bênção da Igreja',
      verses: [
        'No templo sagrado da paróquia o Beato faz oração,',
        'A Cumade Furiosa não entra no santuário de bênção e perdão;',
        'Vá ao Lote 0 desenterrar o ouro de Mané Monteiro com bravura,',
        'E volte com a botija nos braços para selar a escritura!'
      ],
      objective: 'Saia pela esquerda, escave a botija no Lote 0 e retorne à Igreja!',
      itemReward: {
        id: 'tinta',
        name: 'Tinta Encantada',
        icon: '🖋️'
      }
    });
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;

    if (this.narrative.isIntroActive || this.narrative.isOutroActive) {
      this.narrative.update(dt, input, engine);
      return;
    }

    if (this.dialogs.isActive) {
      this.dialogs.update(dt, input, engine);
      return;
    }

    if (this.stateStatus !== 'PLAYING') {
      return;
    }

    const inSanctuary = this.currentLot === 'igreja';
    engine.sound.setBGMState({ tension: inSanctuary ? 0.1 : 0.8 });

    if (inSanctuary) {
      this.bellTimer += dt;
      if (this.bellTimer >= 10.0) {
        this.bellTimer = 0;
        engine.sound.playSinoBadalo();
      }
    }

    // 1. Assobios e Alternância de Portões Internos
    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = 5.5;
      engine.sound.playCumadeAssobio(1.1);
      engine.juice.shake.addTrauma(0.2);

      for (const lotKey in this.lots) {
        for (const g of this.lots[lotKey as LotId].gates) {
          g.isOpen = !g.isOpen;
        }
      }
    }

    // 2. Patrulha da Fulô (exclusivamente fora da Igreja)
    this.fuloLotChangeTimer -= dt;
    if (this.fuloLotChangeTimer <= 0) {
      this.fuloLotChangeTimer = 4.5;
      const nextIdx = (this.lotSequence.indexOf(this.fuloCurrentLot) + 1) % this.lotSequence.length;
      this.fuloCurrentLot = this.lotSequence[nextIdx];
      this.fulozinha.x = 100 + Math.random() * 760;
      this.fulozinha.y = 100 + Math.random() * 340;

      if (this.fuloCurrentLot === this.currentLot && !inSanctuary) {
        engine.sound.playCumadeAssobio(1.3);
        engine.juice.shake.addTrauma(0.25);
      }
    }

    // Física e Perseguição da Fulô em Fúria: NÃO ATRAVESSA PAREDES!
    if (this.currentLot !== 'igreja' && this.fuloCurrentLot === this.currentLot) {
      const angle = Math.atan2(this.player.y - this.fulozinha.y, this.player.x - this.fulozinha.x);
      const fuloSpeed = this.fulozinha.speed || 160;
      const fuloHalfW = this.fulozinha.width / 2;
      const fuloHalfH = this.fulozinha.height / 2;
      const currentLotData = this.lots[this.currentLot];

      // Teste de Colisão da Fulô no eixo X
      const fuloTargetX = this.fulozinha.x + Math.cos(angle) * fuloSpeed * dt;
      let fuloBlockedX = false;
      for (const w of currentLotData.walls) {
        if (
          fuloTargetX + fuloHalfW > w.x - w.w / 2 &&
          fuloTargetX - fuloHalfW < w.x + w.w / 2 &&
          this.fulozinha.y + fuloHalfH > w.y - w.h / 2 &&
          this.fulozinha.y - fuloHalfH < w.y + w.h / 2
        ) {
          fuloBlockedX = true;
          break;
        }
      }
      for (const g of currentLotData.gates) {
        if (!g.isOpen) {
          if (
            fuloTargetX + fuloHalfW > g.x - g.w / 2 &&
            fuloTargetX - fuloHalfW < g.x + g.w / 2 &&
            this.fulozinha.y + fuloHalfH > g.y - g.h / 2 &&
            this.fulozinha.y - fuloHalfH < g.y + g.h / 2
          ) {
            fuloBlockedX = true;
            break;
          }
        }
      }
      if (!fuloBlockedX) {
        this.fulozinha.x = fuloTargetX;
      }

      // Teste de Colisão da Fulô no eixo Y
      const fuloTargetY = this.fulozinha.y + Math.sin(angle) * fuloSpeed * dt;
      let fuloBlockedY = false;
      for (const w of currentLotData.walls) {
        if (
          this.fulozinha.x + fuloHalfW > w.x - w.w / 2 &&
          this.fulozinha.x - fuloHalfW < w.x + w.w / 2 &&
          fuloTargetY + fuloHalfH > w.y - w.h / 2 &&
          fuloTargetY - fuloHalfH < w.y + w.h / 2
        ) {
          fuloBlockedY = true;
          break;
        }
      }
      for (const g of currentLotData.gates) {
        if (!g.isOpen) {
          if (
            this.fulozinha.x + fuloHalfW > g.x - g.w / 2 &&
            this.fulozinha.x - fuloHalfW < g.x + g.w / 2 &&
            fuloTargetY + fuloHalfH > g.y - g.h / 2 &&
            fuloTargetY - fuloHalfH < g.y + g.h / 2
          ) {
            fuloBlockedY = true;
            break;
          }
        }
      }
      if (!fuloBlockedY) {
        this.fulozinha.y = fuloTargetY;
      }

      // Colisão com o herói
      const distToHero = Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y);
      if (distToHero < 34) {
        this.stateStatus = 'FAILED';
        this.message = '💀 VOCÊ FOI CAPTURADO PELA CUMADE FULOZINHA EM FÚRIA!';
        engine.sound.playChicote();
        engine.sound.playDefeatJingle();
        engine.juice.shake.addTrauma(0.6);
        setTimeout(() => engine.switchScene('STUDIO'), 2500);
        return;
      }
    }

    // 3. Interação com o Beato da Paróquia [E no release / interactReleased]
    if (this.currentLot === 'igreja') {
      const distToBeato = Math.hypot(this.player.x - this.beato.x, this.player.y - this.beato.y);
      if (distToBeato < 80 && input.interactReleased) {
        if (!this.hasBotija) {
          this.dialogs.startDialog(
            'beato',
            'Beato Frei Damião',
            '📿',
            [
              {
                speaker: 'Beato',
                avatarIcon: '📿',
                text: 'Então, Coisinha! A Cumade Fulô guarda a fazenda, mas aqui dentro ela não tem poder.'
              },
              {
                speaker: 'Beato',
                avatarIcon: '📿',
                text: 'Vá até o Lote 0, desenterre a Botija de ouro sob a pedra ancestral e traga para consagração no altar!'
              }
            ],
            undefined,
            engine
          );
          return;
        } else {
          // Entrega da Botija -> Vitória!
          this.stateStatus = 'SUCCESS';
          engine.unlockItem('tinta');
          engine.sound.playSinoBadalo();
          engine.sound.playVictoryJingle();
          engine.juice.particles.emit('sparkle', this.beato.x, this.beato.y, { count: 35, speed: 70 });

          this.narrative.showOutro(
            {
              phaseNumber: 4,
              title: 'A Botija de Mané Monteiro',
              verses: [
                'O ouro ancestral foi depositado com fé no altar,',
                'E das mãos do bom Beato a bênção veio brilhar;',
                'Com os quatro elementos reunidos com louvor e glória:',
                'A Tinta Encantada fecha o ciclo da vitória!'
              ],
              itemReward: {
                id: 'tinta',
                name: 'Tinta Encantada',
                icon: '🖋️'
              }
            },
            () => {
              engine.switchScene('STUDIO');
            }
          );
          return;
        }
      }
    }

    // 4. Movimento do Jogador com Colisão Rígida
    let dx = 0;
    let dy = 0;

    if (input.left) {
      dx -= 1;
      this.facing = 'left';
    }
    if (input.right) {
      dx += 1;
      this.facing = 'right';
    }
    if (input.up) {
      dy -= 1;
      this.facing = 'up';
    }
    if (input.down) {
      dy += 1;
      this.facing = 'down';
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      this.stepTimer += dt;
      const stepInterval = this.hasBotija ? 0.45 : 0.32;
      if (this.stepTimer >= stepInterval) {
        this.stepTimer = 0;
        engine.sound.playPassos();
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, {
          count: this.hasBotija ? 5 : 3,
          speed: this.hasBotija ? 35 : 25
        });
      }
    }

    const currentSpeed = this.hasBotija ? 165 : 220;
    const lot = this.lots[this.currentLot];
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;

    // Colisão no eixo X
    const targetX = this.player.x + dx * currentSpeed * dt;
    let blockedX = false;
    for (const w of lot.walls) {
      if (
        targetX + halfW > w.x - w.w / 2 &&
        targetX - halfW < w.x + w.w / 2 &&
        this.player.y + halfH > w.y - w.h / 2 &&
        this.player.y - halfH < w.y + w.h / 2
      ) {
        blockedX = true;
        break;
      }
    }
    for (const g of lot.gates) {
      if (!g.isOpen) {
        if (
          targetX + halfW > g.x - g.w / 2 &&
          targetX - halfW < g.x + g.w / 2 &&
          this.player.y + halfH > g.y - g.h / 2 &&
          this.player.y - halfH < g.y + g.h / 2
        ) {
          blockedX = true;
          break;
        }
      }
    }
    if (!blockedX) {
      this.player.x = targetX;
    }

    // Colisão no eixo Y
    const targetY = this.player.y + dy * currentSpeed * dt;
    let blockedY = false;
    for (const w of lot.walls) {
      if (
        this.player.x + halfW > w.x - w.w / 2 &&
        this.player.x - halfW < w.x + w.w / 2 &&
        targetY + halfH > w.y - w.h / 2 &&
        targetY - halfH < w.y + w.h / 2
      ) {
        blockedY = true;
        break;
      }
    }
    for (const g of lot.gates) {
      if (!g.isOpen) {
        if (
          this.player.x + halfW > g.x - g.w / 2 &&
          this.player.x - halfW < g.x + g.w / 2 &&
          targetY + halfH > g.y - g.h / 2 &&
          targetY - halfH < g.y + g.h / 2
        ) {
          blockedY = true;
          break;
        }
      }
    }
    if (!blockedY) {
      this.player.y = targetY;
    }

    // 5. Transições entre Telas pelas Conexões Oficiais
    if (this.player.x > 936) {
      if (this.currentLot === '1b') {
        this.currentLot = 'igreja';
        this.player.x = 40;
        engine.sound.playSinoBadalo();
      } else if (this.currentLot === '0') {
        this.currentLot = '2a';
        this.player.x = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '2b';
        this.player.x = 40;
      } else if (this.currentLot === '1a') {
        this.currentLot = '1b';
        this.player.x = 40;
      } else if (this.currentLot === '3a') {
        this.currentLot = '3b';
        this.player.x = 40;
      }
    }

    if (this.player.x < 24) {
      if (this.currentLot === 'igreja') {
        this.currentLot = '1b';
        this.player.x = 920;
        engine.sound.playSinoBadalo();
      } else if (this.currentLot === '2b') {
        this.currentLot = '2a';
        this.player.x = 920;
      } else if (this.currentLot === '2a') {
        this.currentLot = '0';
        this.player.x = 920;
      } else if (this.currentLot === '1b') {
        this.currentLot = '1a';
        this.player.x = 920;
      } else if (this.currentLot === '3b') {
        this.currentLot = '3a';
        this.player.x = 920;
      }
    }

    if (this.player.y < 24) {
      if (this.currentLot === '2a') {
        this.currentLot = '1a';
        this.player.y = 500;
      } else if (this.currentLot === '2b') {
        this.currentLot = '1b';
        this.player.y = 500;
      } else if (this.currentLot === '3a') {
        this.currentLot = '2a';
        this.player.y = 500;
      } else if (this.currentLot === '3b') {
        this.currentLot = '2b';
        this.player.y = 500;
      }
    }

    if (this.player.y > 516) {
      if (this.currentLot === '1a') {
        this.currentLot = '2a';
        this.player.y = 40;
      } else if (this.currentLot === '1b') {
        this.currentLot = '2b';
        this.player.y = 40;
      } else if (this.currentLot === '2a') {
        this.currentLot = '3a';
        this.player.y = 40;
      } else if (this.currentLot === '2b') {
        this.currentLot = '3b';
        this.player.y = 40;
      }
    }

    this.player.x = Math.max(20, Math.min(940, this.player.x));
    this.player.y = Math.max(20, Math.min(520, this.player.y));

    // 6. Escavação da Botija no Lote 0
    if (this.currentLot === '0' && !this.hasBotija) {
      const distToPedra = Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y);
      if (distToPedra < 55) {
        if (input.interact) {
          this.isDigging = true;
          this.digProgress += dt * 0.45;
          this.message = `⛏️ Desenterrando a botija de ouro... ${Math.round(this.digProgress * 100)}%`;

          this.digSoundTimer += dt;
          if (this.digSoundTimer >= 0.28) {
            this.digSoundTimer = 0;
            engine.sound.playEscavacao();
            engine.juice.particles.emit('dust', this.pedraItem.x, this.pedraItem.y, { count: 4, speed: 30 });
          }

          if (this.digProgress >= 1) {
            this.digProgress = 1;
            this.hasBotija = true;
            this.message = '🏺 BOTIJA DESENTERRADA! É muito pesada (-25% Vel). Fuja para a Igreja!';
            engine.sound.playPickup();
            engine.sound.playItemDescobrir();
            engine.juice.shake.addTrauma(0.4);
            engine.juice.particles.emit('sparkle', this.pedraItem.x, this.pedraItem.y, { count: 20, speed: 60 });
          }
        } else {
          this.isDigging = false;
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    const lot = this.lots[this.currentLot];

    // Fundo
    if (lot.isSanctuary) {
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(0, 0, 960, 540);

      drawMolduraCordel(ctx, 8, 8, 944, 524, { borderWeight: 3 });

      // Luz divina / velas
      ctx.save();
      const candleGrad = ctx.createRadialGradient(480, 180, 20, 480, 180, 320);
      candleGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      candleGrad.addColorStop(1, 'rgba(30, 27, 24, 0)');
      ctx.fillStyle = candleGrad;
      ctx.beginPath();
      ctx.arc(480, 180, 320, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Altar
      ctx.fillStyle = '#78350f';
      ctx.fillRect(
        this.altar.x - this.altar.width / 2,
        this.altar.y - this.altar.height / 2,
        this.altar.width,
        this.altar.height
      );
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.altar.x - this.altar.width / 2,
        this.altar.y - this.altar.height / 2,
        this.altar.width,
        this.altar.height
      );
      drawText(ctx, '✝ [ALTAR SAGRADO]', this.altar.x, this.altar.y - 4, {
        font: 'bold 11px monospace',
        color: '#fef08a',
        align: 'center'
      });

      // Beato
      drawBeato(ctx, this.beato.x, this.beato.y, this.beato.width, this.beato.height);

      drawText(ctx, '🕊️ SANTUÁRIO SEGURO — A CUMADE FULÔ NÃO ENTRA AQUI!', 480, 65, {
        font: 'bold 12px monospace',
        color: '#86efac',
        align: 'center'
      });
    } else {
      // Escuridão Profunda da Noite Sertaneja
      drawChaoTerraBatida(ctx, 0, 0, 960, 540);
      drawMolduraCordel(ctx, 8, 8, 944, 524, { borderWeight: 3 });
    }

    // Paredes do Lote
    for (const w of lot.walls) {
      ctx.fillStyle = lot.isSanctuary ? '#78350f' : '#1e293b';
      ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
      ctx.strokeStyle = lot.isSanctuary ? '#b45309' : '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
    }

    // Portões Internos Dinâmicos
    for (const g of lot.gates) {
      ctx.fillStyle = g.isOpen ? '#16a34a' : '#dc2626';
      ctx.fillRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
    }

    // Pedra da Botija (Lote 0)
    if (this.currentLot === '0' && !this.hasBotija) {
      drawItemBotija(ctx, this.pedraItem.x, this.pedraItem.y, 32);

      if (this.isDigging) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80, 8);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80 * this.digProgress, 8);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(this.pedraItem.x - 40, this.pedraItem.y - 28, 80, 8);
      }
    }

    // Fulô Furiosa (fora da Igreja)
    if (!lot.isSanctuary && this.fuloCurrentLot === this.currentLot) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.fulozinha.x, this.fulozinha.y, 80, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.fill();
      ctx.restore();

      drawCumadeFulozinha(ctx, this.fulozinha.x, this.fulozinha.y, this.fulozinha.width, this.fulozinha.height, {
        time: this.animTime
      });
    }

    // Escuridão Total / Visão Restrita (fora da Igreja)
    if (!lot.isSanctuary) {
      ctx.save();
      const lightRadius = this.hasLantern ? 240 : 85;

      // Máscara de Escuridão
      const darkCanvas = document.createElement('canvas');
      darkCanvas.width = 960;
      darkCanvas.height = 540;
      const dCtx = darkCanvas.getContext('2d');
      if (dCtx) {
        dCtx.fillStyle = 'rgba(3, 4, 8, 0.94)';
        dCtx.fillRect(0, 0, 960, 540);

        // Abre o buraco de visão
        dCtx.globalCompositeOperation = 'destination-out';
        const grad = dCtx.createRadialGradient(
          this.player.x,
          this.player.y,
          lightRadius * 0.3,
          this.player.x,
          this.player.y,
          lightRadius
        );
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.7, 'rgba(0,0,0,0.85)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        dCtx.fillStyle = grad;
        dCtx.beginPath();
        dCtx.arc(this.player.x, this.player.y, lightRadius, 0, Math.PI * 2);
        dCtx.fill();

        ctx.drawImage(darkCanvas, 0, 0);
      }
      ctx.restore();
    }

    // Jogador Coisinha
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    if (this.hasBotija) {
      drawItemBotija(ctx, this.player.x + 18, this.player.y - 10, 20);
      drawText(ctx, '🏺 BOTIJA PESADA (-25% Vel)', this.player.x, this.player.y - 32, {
        font: 'bold 10px monospace',
        color: '#facc15',
        align: 'center'
      });
    }

    // HUD Superior
    drawText(ctx, `🏺 FASE 4: ${lot.name}`, 480, 20, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 505, {
      font: '12px monospace',
      align: 'center',
      color: this.stateStatus === 'FAILED' ? '#ef4444' : '#fde047'
    });

    // Modais e Diálogos
    this.dialogs.render(ctx, 960, 540);
    this.narrative.render(ctx, 960, 540);
  }

  public destroy(): void {}
}
