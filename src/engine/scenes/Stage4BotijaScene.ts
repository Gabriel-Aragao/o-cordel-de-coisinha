import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawCumadeFulozinha,
  drawBeato,
  drawItemBotija,
  drawMoita,
  drawMoitaFrutaRegional,
  drawMoitaCactoEspinhos,
  drawChaoTerraBatida,
  drawMolduraCordel
} from '../../renderer/xilogravura';
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
  bushes: BushEntity[];
}

interface BushEntity {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'normal' | 'cacto' | 'fruta' | 'candeeiro';
  isSearched: boolean;
}

export class Stage4BotijaScene implements IScene {
  public id: SceneId = 'STAGE_4_BOTIJA';
  public name = 'Fase 4: A Botija de Mané Monteiro';

  private currentLot: LotId = 'igreja';

  // Sistema de 3 Vidas
  private heroHp: number = 3;
  private maxHeroHp: number = 3;
  private hurtCooldown: number = 0;
  private invulnerableTimer: number = 0;
  private tripCooldown: number = 0;

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
    x: 880,
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

  // Sistema Narrativo de Cordel
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  // Ciclo de patrulha da Fulô (exclui a Igreja)
  private lotSequence: LotId[] = ['0', '2a', '1a', '2b', '1b', '3b', '3a'];

  // Definição dos 8 Lotes com Paredes Perimétricas Sólidas, Barreiras Espaçosas e Portões Alternantes
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
      gates: [],
      bushes: []
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
        // Corredor Espaçoso da Pedra na Saída para Lote 2a (largura ampla sem engasgos nas quinas)
        { x: 820, y: 198, w: 230, h: 24 },
        { x: 820, y: 342, w: 230, h: 24 },
        // Labirinto Interno com Corredores e Vãos Amplos
        { x: 260, y: 270, w: 24, h: 260 },
        { x: 425, y: 388, w: 24, h: 250 },
        { x: 580, y: 285, w: 24, h: 240 },
        { x: 432, y: 152, w: 320, h: 24 }
      ],
      gates: [
        { x: 260, y: 460, w: 24, h: 110, isOpen: true },
        { x: 718, y: 270, w: 24, h: 110, isOpen: true },
        { x: 580, y: 80, w: 24, h: 110, isOpen: false }
      ],
      bushes: [
        { id: 'b_0_1', x: 130, y: 100, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_0_2', x: 350, y: 320, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_0_3', x: 650, y: 100, radius: 36, type: 'normal', isSearched: false },
        { id: 'b_0_4', x: 740, y: 440, radius: 36, type: 'cacto', isSearched: false }
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
        // Labirinto Interno Espaçoso
        { x: 300, y: 340, w: 24, h: 350 },
        { x: 552, y: 390, w: 24, h: 250 },
        { x: 740, y: 269, w: 24, h: 262 },
        { x: 508, y: 150, w: 440, h: 24 }
      ],
      gates: [
        { x: 300, y: 80, w: 24, h: 110, isOpen: true },
        { x: 552, y: 80, w: 24, h: 110, isOpen: false },
        { x: 740, y: 458, w: 24, h: 110, isOpen: true }
      ],
      bushes: [
        { id: 'b_1a_1', x: 130, y: 410, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_1a_2', x: 420, y: 100, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_1a_3', x: 870, y: 80, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_1a_4', x: 560, y: 220, radius: 36, type: 'cacto', isSearched: false }
      ]
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
        // Labirinto Interno Espaçoso
        { x: 270, y: 275, w: 24, h: 250 },
        { x: 408, y: 332, w: 24, h: 365 },
        { x: 780, y: 398, w: 24, h: 235 },
        { x: 608, y: 162, w: 370, h: 24 }
      ],
      gates: [
        { x: 270, y: 458, w: 24, h: 110, isOpen: true },
        { x: 780, y: 227, w: 24, h: 100, isOpen: true },
        { x: 340, y: 388, w: 110, h: 24, isOpen: false }
      ],
      bushes: [
        { id: 'b_1b_fumo', x: 850, y: 470, radius: 36, type: 'candeeiro', isSearched: false },
        { id: 'b_1b_1', x: 80, y: 470, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_1b_2', x: 340, y: 470, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_1b_3', x: 600, y: 100, radius: 36, type: 'normal', isSearched: false }
      ]
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
        // Labirinto Interno Espaçoso
        { x: 160, y: 270, w: 24, h: 180 },
        { x: 480, y: 388, w: 465, h: 24 },
        { x: 820, y: 270, w: 24, h: 180 },
        { x: 410, y: 112, w: 24, h: 170 },
        { x: 550, y: 112, w: 24, h: 170 }
      ],
      gates: [
        { x: 480, y: 185, w: 110, h: 24, isOpen: true },
        { x: 700, y: 458, w: 24, h: 110, isOpen: false },
        { x: 260, y: 458, w: 24, h: 110, isOpen: true }
      ],
      bushes: [
        { id: 'b_2a_1', x: 160, y: 420, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_2a_2', x: 350, y: 120, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_2a_3', x: 820, y: 140, radius: 36, type: 'normal', isSearched: false },
        { id: 'b_2a_4', x: 620, y: 470, radius: 36, type: 'fruta', isSearched: false }
      ]
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
        // Labirinto Interno Espaçoso
        { x: 408, y: 270, w: 24, h: 260 },
        { x: 550, y: 270, w: 24, h: 260 },
        { x: 760, y: 270, w: 24, h: 260 },
        { x: 230, y: 270, w: 24, h: 260 },
      ],
      gates: [
        { x: 550, y: 82, w: 24, h: 110, isOpen: false },
        { x: 408, y: 458, w: 24, h: 110, isOpen: true }
      ],
      bushes: [
        { id: 'b_2b_1', x: 170, y: 120, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_2b_2', x: 280, y: 450, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_2b_3', x: 710, y: 120, radius: 36, type: 'normal', isSearched: false },
        { id: 'b_2b_4', x: 810, y: 450, radius: 36, type: 'fruta', isSearched: false }
      ]
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
        // Labirinto Interno Espaçoso
        { x: 365, y: 150, w: 400, h: 24 },
        { x: 152, y: 270, w: 24, h: 270 },
        { x: 550, y: 80, w: 24, h: 110 },
        { x: 495, y: 390, w: 660, h: 24 },
        { x: 810, y: 280, w: 24, h: 190 },
      ],
      gates: [
        { x: 880, y: 198, w: 110, h: 24, isOpen: true }
      ],
      bushes: [
        { id: 'b_3a_1', x: 820, y: 150, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_3a_2', x: 890, y: 150, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_3a_3', x: 890, y: 80, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_3a_4', x: 820, y: 80, radius: 36, type: 'normal', isSearched: false }
      ]
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
        // Labirinto Interno Espaçoso
        { x: 270, y: 270, w: 24, h: 270 },
        { x: 410, y: 270, w: 24, h: 270 },
        { x: 550, y: 270, w: 24, h: 270 },
        { x: 690, y: 270, w: 24, h: 270 }
      ],
      gates: [
        { x: 480, y: 270, w: 110, h: 24, isOpen: true }
      ],
      bushes: [
        { id: 'b_3b_1', x: 80, y: 80, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_3b_2', x: 480, y: 180, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_3b_3', x: 880, y: 480, radius: 36, type: 'normal', isSearched: false },
        { id: 'b_3b_4', x: 480, y: 380, radius: 36, type: 'fruta', isSearched: false }
      ]
    }
  };

  public init(engine: IGameEngine): void {
    this.currentLot = 'igreja';
    this.player.x = 480;
    this.player.y = 360;
    this.heroHp = 3;
    this.hurtCooldown = 0;
    this.invulnerableTimer = 0;
    this.tripCooldown = 0;
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
    if (this.hurtCooldown > 0) this.hurtCooldown -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.tripCooldown > 0) this.tripCooldown -= dt;

    if (this.narrative.isIntroActive || this.narrative.isOutroActive) {
      this.narrative.update(dt, input, engine);
      return;
    }

    if (engine.messages.isDialogActive) {
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

      // Colisão com o herói: Ataque de cadarço da Cumade Fulozinha (-1 HP + knockback + invulnerabilidade de 5.0s)
      const distToHero = Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y);
      if (distToHero < 34 && this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
        this.hurtCooldown = 1.5;
        this.invulnerableTimer = 5.0; // 2. Invulnerabilidade de 5 segundos
        this.heroHp = Math.max(0, this.heroHp - 1);
        this.message = '🌿 A Cumade Fulozinha amarrou seus cadarços! (-1 HP)';
        engine.sound.playChicote();
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.5);
        engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 12, speed: 50 });

        // Knockback empurra o herói para longe da Fulô
        const knockAngle = Math.atan2(this.player.y - this.fulozinha.y, this.player.x - this.fulozinha.x);
        this.player.x += Math.cos(knockAngle) * 55;
        this.player.y += Math.sin(knockAngle) * 55;

        if (this.heroHp <= 0) {
          this.stateStatus = 'FAILED';
          this.message = '💀 VOCÊ NÃO RESISTIU AOS ATAQUES DA CUMADE FULOZINHA!';
          engine.sound.playDefeatJingle();
          setTimeout(() => engine.switchScene('STUDIO'), 1800);
          return;
        }
      }
    }

    // 3. Interação com o Beato da Paróquia [E no release / interactReleased]
    if (this.currentLot === 'igreja') {
      const distToBeato = Math.hypot(this.player.x - this.beato.x, this.player.y - this.beato.y);
      if (distToBeato < 80 && input.interactReleased) {
        if (!this.hasBotija) {
          engine.messages.startDialog(
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

    // 6. Escavação e Tropeço na Pedra da Botija no Lote 0
    if (this.currentLot === '0' && !this.hasBotija) {
      const distToPedra = Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y);

      // Efeito de Tropeço Cômico com Dano de 1 Vida (-1 HP) ao cruzar a pedra no corredor (5s de i-frames)
      if (distToPedra < 26 && this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
        this.hurtCooldown = 2.0;
        this.invulnerableTimer = 5.0; // 2. Invulnerabilidade de 5 segundos
        this.heroHp = Math.max(0, this.heroHp - 1);
        const tripPhrases = [
          '🗣️ "Coisinha, tropeçou!"',
          '🗣️ "Coisinha vai arrancar um dedo!"',
          '🗣️ "Coisinha tá adivinhando butija!"'
        ];
        this.message = tripPhrases[Math.floor(Math.random() * tripPhrases.length)];
        engine.sound.playUIClick();
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.4);
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, { count: 8, speed: 40 });
        this.player.x += (this.player.x > this.pedraItem.x ? 1 : -1) * 20;

        if (this.heroHp <= 0) {
          this.stateStatus = 'FAILED';
          this.message = '💀 VOCÊ NÃO RESISTIU AOS ESPINHOS E TROPEÇOS DA CAATINGA!';
          engine.sound.playDefeatJingle();
          setTimeout(() => engine.switchScene('STUDIO'), 1800);
          return;
        }
      }

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
            // 3. Diálogo bloqueante ao desenterrar a botija
            engine.messages.startDialog(
              'item_botija',
              'Botija de Mané Monteiro',
              '🏺',
              [
                {
                  speaker: 'Coisinha',
                  avatarIcon: '🏺',
                  text: '🏺 "Desenterrei a famosa Botija de Ouro de Mané Monteiro! O pote é pesado, preciso correr para a Igreja antes que a Cumade me pegue!"'
                }
              ],
              undefined,
              engine
            );
          }
        } else {
          this.isDigging = false;
        }
      }
    }

    // 7. Interação com Moitas, Cactos (-1 HP) e Frutas (+1 HP)
    for (const bush of lot.bushes) {
      const distToBush = Math.hypot(this.player.x - bush.x, this.player.y - bush.y);

      if (bush.type === 'cacto' && distToBush < bush.radius + 12 && this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
        bush.isSearched = true; // 1. Auto-revelação da moita
        this.hurtCooldown = 1.2;
        this.invulnerableTimer = 5.0; // 2. Invulnerabilidade de 5 segundos
        this.heroHp = Math.max(0, this.heroHp - 1);
        engine.sound.playHurtCacto();
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.45);
        engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 12, speed: 70 });
        this.message = '🌵 AI! ESPINHO DE CACTO! Você perdeu 1 HP e soltou um grito!';

        if (this.heroHp <= 0) {
          this.stateStatus = 'FAILED';
          this.message = '💀 VOCÊ NÃO RESISTIU AOS ESPINHOS DA CAATINGA!';
          engine.sound.playDefeatJingle();
          setTimeout(() => engine.switchScene('STUDIO'), 2500);
          return;
        }
      }

      if (distToBush < bush.radius + 30 && input.interactReleased) {
        if (!bush.isSearched) {
          bush.isSearched = true;

          if (bush.type === 'candeeiro' && !this.hasLantern) {
            this.hasLantern = true;
            this.message = '🏮 CANDEEIRO ENCONTRADO! Iluminação expandida na caatinga!';
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', bush.x, bush.y, { count: 10, speed: 50 });
            // 3. Diálogo bloqueante ao obter candeeiro
            engine.messages.startDialog(
              'item_candeeiro',
              'Candeeiro Místico',
              '🏮',
              [
                {
                  speaker: 'Coisinha',
                  avatarIcon: '🏮',
                  text: '🏮 "Achei o candeeiro! Agora o círculo de luz clareia a escuridão da fazenda para encontrar a pedra!"'
                }
              ],
              undefined,
              engine
            );
          } else if (bush.type === 'fruta') {
            if (this.heroHp < this.maxHeroHp) {
              this.heroHp = Math.min(this.maxHeroHp, this.heroHp + 1);
              this.message = '🍎 FRUTA REGIONAL! Você recuperou +1 HP!';
            } else {
              this.message = '🍎 Fruta deliciosa da caatinga!';
            }
            engine.sound.playFruitEat();
            engine.juice.particles.emit('sparkle', bush.x, bush.y, { count: 10, speed: 40 });
          } else if (bush.type === 'cacto') {
            if (this.invulnerableTimer <= 0) {
              this.invulnerableTimer = 5.0; // 2. Invulnerabilidade de 5s
              this.heroHp = Math.max(0, this.heroHp - 1);
              engine.sound.playHurtCacto();
              engine.sound.playGrito();
              engine.juice.shake.addTrauma(0.45);
              if (this.heroHp <= 0) {
                this.stateStatus = 'FAILED';
                this.message = '💀 VOCÊ NÃO RESISTIU AOS ESPINHOS DA CAATINGA!';
                engine.sound.playDefeatJingle();
                setTimeout(() => engine.switchScene('STUDIO'), 2500);
                return;
              }
            }
          } else {
            engine.juice.particles.emit('leaf', bush.x, bush.y, { count: 8, speed: 35 });
          }
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

    // Moitas do Lote (Homogêneas até serem vasculhadas)
    for (const bush of lot.bushes) {
      if (bush.isSearched) {
        if (bush.type === 'cacto') {
          drawMoitaCactoEspinhos(ctx, bush.x, bush.y, bush.radius);
        } else if (bush.type === 'fruta') {
          drawMoitaFrutaRegional(ctx, bush.x, bush.y, bush.radius, { searched: true });
        } else {
          drawMoita(ctx, bush.x, bush.y, bush.radius, { hasItem: false, searched: true });
        }
      } else {
        drawMoita(ctx, bush.x, bush.y, bush.radius, { hasItem: false, searched: false });
      }
    }

    // Pedra da Botija (Lote 0 - Sem Legenda Textual)
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

    // Iluminação do Candeeiro (Aura dourada expandida presente no Stage 1)
    if (this.hasLantern) {
      ctx.save();
      const lanternGrad = ctx.createRadialGradient(
        this.player.x,
        this.player.y,
        40,
        this.player.x,
        this.player.y,
        320
      );
      lanternGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      lanternGrad.addColorStop(1, 'rgba(38, 23, 13, 0)');
      ctx.fillStyle = lanternGrad;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, 320, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Escuridão Total / Visão Restrita (fora da Igreja)
    if (!lot.isSanctuary) {
      ctx.save();
      const lightRadius = this.hasLantern ? 320 : 85;

      // Máscara de Escuridão
      const darkCanvas = document.createElement('canvas');
      darkCanvas.width = 960;
      darkCanvas.height = 580;
      const dCtx = darkCanvas.getContext('2d');
      if (dCtx) {
        dCtx.fillStyle = 'rgba(3, 4, 8, 0.94)';
        dCtx.fillRect(0, 0, 960, 580);

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

    // Jogador Coisinha (com efeito de piscar durante 5s de invulnerabilidade)
    ctx.save();
    if (this.invulnerableTimer > 0) {
      ctx.globalAlpha = Math.sin(this.animTime * 24) > 0 ? 0.35 : 0.9;
    }
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime,
      invulnerableTimer: this.invulnerableTimer
    });
    ctx.restore();

    if (this.hasBotija) {
      drawItemBotija(ctx, this.player.x + 18, this.player.y - 10, 20);
      drawText(ctx, '🏺 BOTIJA PESADA (-25% Vel)', this.player.x, this.player.y - 32, {
        font: 'bold 10px monospace',
        color: '#facc15',
        align: 'center'
      });
    } else if (this.hasLantern) {
      drawText(ctx, '🏮 CANDEEIRO', this.player.x, this.player.y - 32, {
        font: 'bold 9px monospace',
        color: '#fef08a',
        align: 'center'
      });
    }

    // HUD Superior
    drawText(ctx, `🏺 FASE 4: ${lot.name}`, 480, 20, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    // Indicador de 3 Vidas no HUD Superior Esquerdo
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(30, 10, 105, 30);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 10, 105, 30);

    for (let h = 0; h < this.maxHeroHp; h++) {
      ctx.font = '16px monospace';
      ctx.fillText(h < this.heroHp ? '❤️' : '🖤', 42 + h * 30, 31);
    }
    ctx.restore();

    // Modais Narrativos (preenchendo 100% da tela 960x580)
    this.narrative.render(ctx, 960, 580);
  }

  public getStatusMessage(): string {
    return this.message;
  }

  public destroy(): void { }
}
