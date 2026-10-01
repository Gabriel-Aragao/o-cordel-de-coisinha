import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawCumadeFulozinha,
  drawMoita,
  drawMoitaFrutaRegional,
  drawMoitaCactoEspinhos,
  drawChaoTerraBatida,
  drawMolduraCordel
} from '../../renderer/xilogravura';
import { NarrativeModalManager } from '../narrative';

type LotId = '0' | '1a' | '1b' | '2a' | '2b' | '3a' | '3b';

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

interface BushEntity {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'normal' | 'cacto' | 'fruta' | 'fumo';
  isSearched: boolean;
}

interface LotData {
  id: LotId;
  name: string;
  color: string;
  walls: Wall[];
  gates: InternalGate[];
  bushes: BushEntity[];
}

export class Stage2FulozinhaScene implements IScene {
  public id: SceneId = 'STAGE_2_FULOZINHA';
  public name = 'Fase 2: A Fazenda da Cumade Fulozinha';

  private currentLot: LotId = '0';

  // Sistema de 3 Vidas
  private heroHp: number = 3;
  private maxHeroHp: number = 3;
  private hurtCooldown: number = 0;
  private invulnerableTimer: number = 0;
  private fuloFleeTimer: number = 0;

  private player: Entity = {
    id: 'hero',
    x: 120,
    y: 270,
    width: 36,
    height: 50,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private fulozinha: Entity = {
    id: 'fulozinha',
    x: 750,
    y: 270,
    width: 42,
    height: 48,
    color: '#eab308',
    label: '[CUMADE FULOZINHA]',
    shape: 'circle',
    speed: 155
  };

  // Pedra da Botija: Exclusivamente na saída do Lote 0 para o Lote 2a
  private pedraItem: Entity = {
    id: 'pedra',
    x: 840,
    y: 270,
    width: 28,
    height: 28,
    color: '#64748b',
    label: '',
    shape: 'rect'
  };

  // Placa de Aviso: Ao lado da pedra item no Lote 0
  private placaItem: Entity = {
    id: 'placa',
    x: 800,
    y: 250,
    width: 32,
    height: 32,
    color: '#854d0e',
    label: 'Risco de topada!',
    shape: 'rect'
  };

  public get placa(): Entity {
    return this.placaItem;
  }

  private hasFumo: boolean = false;
  private whistleTimer: number = 6.0;
  private isControlsInverted: boolean = false;
  private whistleDuration: number = 0;
  private whistleWaveRadius: number = 0;
  private message: string = 'Navegue pelos 6 lotes da fazenda. Encontre o Fumo na moita do Lote 1b e leve à Fulô no Lote 3b!';

  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private stepTimer: number = 0;
  private animTime: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;

  private narrative: NarrativeModalManager = new NarrativeModalManager();

  // Definição dos 6 Lotes com Paredes Perimétricas Sólidas, Barreiras Espaçosas, Portões Dinâmicos e Moitas
  private lots: Record<LotId, LotData> = {
    '0': {
      id: '0',
      name: 'LOTE 0 — ENTRADA DA FAZENDA',
      color: '#131b2e',
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
      name: 'LOTE 1a — POMAR NORTE',
      color: '#0f2922',
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
      name: 'LOTE 1b — PORTEIRA DO TOCO (FUMO NA MOITA)',
      color: '#1e1b2e',
      walls: [
        { x: 480, y: 12, w: 960, h: 24 },
        { x: 948, y: 270, w: 24, h: 540 },
        { x: 12, y: 105, w: 24, h: 210 },
        { x: 12, y: 435, w: 24, h: 210 },
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
        { id: 'b_1b_fumo', x: 850, y: 470, radius: 36, type: 'fruta', isSearched: false },
        { id: 'b_1b_1', x: 80, y: 470, radius: 36, type: 'cacto', isSearched: false },
        { id: 'b_1b_2', x: 340, y: 470, radius: 36, type: 'fumo', isSearched: false },
        { id: 'b_1b_3', x: 600, y: 100, radius: 36, type: 'normal', isSearched: false }
      ]
    },
    '2a': {
      id: '2a',
      name: 'LOTE 2a — PASTAGEM CENTRAL OESTE',
      color: '#172554',
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
      name: 'LOTE 2b — PASTAGEM CENTRAL LESTE',
      color: '#172554',
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
      name: 'LOTE 3a — BOSQUE SUL PROFUNDO',
      color: '#2a1b12',
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
      name: 'LOTE 3b — MORADA DA CUMADE FULOZINHA',
      color: '#3b0764',
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

  public init(_engine: IGameEngine): void {
    this.currentLot = '0';
    this.player.x = 120;
    this.player.y = 270;
    this.heroHp = 3;
    this.hurtCooldown = 0;
    this.invulnerableTimer = 0;
    this.fuloFleeTimer = 0;
    this.fulozinha.x = 750;
    this.fulozinha.y = 270;
    this.hasFumo = false;
    this.whistleTimer = 6.0;
    this.isControlsInverted = false;
    this.whistleDuration = 0;
    this.whistleWaveRadius = 0;
    this.stateStatus = 'PLAYING';
    this.stepTimer = 0;
    this.animTime = 0;

    // Reset do estado de todas as moitas em todos os lotes
    for (const lotKey in this.lots) {
      for (const b of this.lots[lotKey as LotId].bushes) {
        b.isSearched = false;
      }
    }

    // Apresentação da Fase (Folheto de Cordel)
    this.narrative.showIntro({
      phaseNumber: 2,
      title: 'A Fazenda da Cumade Fulozinha',
      subtitle: 'Tranças de cipó, assobios e a oferenda de fumo',
      verses: [
        'Na mata fechada da fazenda a Fulô vigia o sertão,',
        'Seus assobios enganam quem não presta atenção;',
        'Ache o fumo de rolo na moita do Lote 1b com primor,',
        'E leve a oferenda à Fulô para acalmar seu furor!'
      ],
      objective: 'Encontre o Fumo de Rolo no Lote 1b e entregue à Cumade Fulozinha no Lote 3b!',
      itemReward: {
        id: 'folha',
        name: 'Página Rasgada',
        icon: '📄'
      }
    });
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;
    if (this.hurtCooldown > 0) this.hurtCooldown -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.fuloFleeTimer > 0) this.fuloFleeTimer -= dt;

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

    // 1. Assobios e Inversão de Controles
    const inFulozinhaLair = this.currentLot === '3b';
    const timerInterval = inFulozinhaLair ? 4.5 : 7.0;

    engine.sound.setBGMState({ tension: inFulozinhaLair ? 0.75 : 0.2 });

    this.whistleTimer -= dt;
    if (this.whistleTimer <= 0) {
      this.whistleTimer = timerInterval;
      this.isControlsInverted = true;
      this.whistleDuration = inFulozinhaLair ? 4.0 : 3.2;
      this.whistleWaveRadius = 15;
      this.message = '🎶 ASSOBIO NA MATA! Os portões alternaram e os controles foram invertidos!';
      engine.sound.playCumadeAssobio(inFulozinhaLair ? 1.2 : 1.0);
      engine.juice.shake.addTrauma(0.3);
      engine.juice.particles.emit('note', 480, 200, { count: 8, speed: 45 });

      for (const lotKey in this.lots) {
        for (const g of this.lots[lotKey as LotId].gates) {
          g.isOpen = !g.isOpen;
        }
      }
    }

    if (this.isControlsInverted) {
      this.whistleDuration -= dt;
      this.whistleWaveRadius += 350 * dt;
      if (this.whistleDuration <= 0) {
        this.isControlsInverted = false;
        this.whistleWaveRadius = 0;
        this.message = '🌿 O assobio cessou. Controles normais.';
      }
    }

    // 2. Movimento do Herói
    let dx = 0;
    let dy = 0;

    const left = this.isControlsInverted ? input.right : input.left;
    const right = this.isControlsInverted ? input.left : input.right;
    const up = this.isControlsInverted ? input.down : input.up;
    const down = this.isControlsInverted ? input.up : input.down;

    if (left) {
      dx -= 1;
      this.facing = 'left';
    }
    if (right) {
      dx += 1;
      this.facing = 'right';
    }
    if (up) {
      dy -= 1;
      this.facing = 'up';
    }
    if (down) {
      dy += 1;
      this.facing = 'down';
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      this.stepTimer += dt;
      if (this.stepTimer >= 0.32) {
        this.stepTimer = 0;
        engine.sound.playPassos();
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, { count: 3, speed: 25 });
      }
    }

    const speed = this.player.speed || 230;
    const lot = this.lots[this.currentLot];
    const halfW = this.player.width / 2;
    const halfH = this.player.height / 2;

    // Teste de colisão no eixo X
    const targetX = this.player.x + dx * speed * dt;
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

    // Teste de colisão no eixo Y
    const targetY = this.player.y + dy * speed * dt;
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

    // 3. Transições entre Telas de Lotes pelas Conexões Oficiais
    if (this.player.x > 936) {
      if (this.currentLot === '0') {
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
      if (this.currentLot === '2b') {
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

    // 4. Moitas, Cactos (-1 HP) e Frutas (+1 HP) do Lote
    for (const bush of lot.bushes) {
      const distToBush = Math.hypot(this.player.x - bush.x, this.player.y - bush.y);

      // Colisão de proximidade com cactos causa dano involuntário (auto-revelação e 5s de i-frames)
      if (bush.type === 'cacto' && distToBush < bush.radius + 12 && this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
        bush.isSearched = true; // 1. Auto-revelação da moita
        this.hurtCooldown = 1.2;
        this.invulnerableTimer = 3.0; // 2. Invulnerabilidade de 5 segundos
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

      // Interação [E / Enter no release] com a moita
      if (distToBush < bush.radius + 30 && input.interactReleased) {
        if (!bush.isSearched) {
          bush.isSearched = true;

          if (bush.type === 'fumo' && !this.hasFumo) {
            this.hasFumo = true;
            this.message = '🍂 FUMO DE ROLO ENCONTRADO NA MOITA! Leve a oferenda à Cumade no Lote 3b!';
            engine.sound.playPickup();
            engine.sound.playItemDescobrir();
            engine.juice.particles.emit('leaf', bush.x, bush.y, { count: 12, speed: 45 });
            // 3. Diálogo bloqueante ao obter o Fumo de Rolo
            engine.messages.startDialog(
              'item_fumo',
              'Fumo de Rolo Aromático',
              '🍂',
              [
                {
                  speaker: 'Coisinha',
                  avatarIcon: '🍂',
                  text: '🍂 "Achei o fumo de rolo perfumado! Agora posso levar até o toco sagrado no Lote 3b e apaziguar a Cumade Fulozinha!"'
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
              this.invulnerableTimer = 3.0; // 2. Invulnerabilidade de 5s
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

    // 5. Pista e Tropeço da Pedra da Botija e Placa de Aviso (EXCLUSIVAMENTE no Lote 0)
    if (this.currentLot === '0') {
      const distToPedra = Math.hypot(this.player.x - this.pedraItem.x, this.player.y - this.pedraItem.y);
      const distToPlaca = Math.hypot(this.player.x - this.placaItem.x, this.player.y - this.placaItem.y);

      // Tropeço com Dano de 1 Vida (-1 HP) (com 5s de i-frames)
      if (distToPedra < 26 && this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
        this.hurtCooldown = 2.0;
        this.invulnerableTimer = 3.0; // 2. Invulnerabilidade de 5 segundos
        this.heroHp = Math.max(0, this.heroHp - 1);
        engine.sound.playUIClick();
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.4);
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, { count: 8, speed: 40 });

        const tripPhrases = [
          '🗣️ "Coisinha, tropeçou! (-1 Vida)"',
          '🗣️ "Coisinha vai arrancar um dedo! (-1 Vida)"',
          '🗣️ "Coisinha tá adivinhando butija! (-1 Vida)"'
        ];
        this.message = tripPhrases[Math.floor(Math.random() * tripPhrases.length)];

        if (this.heroHp <= 0) {
          this.stateStatus = 'FAILED';
          this.message = '💀 VOCÊ NÃO RESISTIU AOS ESPINHOS E TROPEÇOS DA CAATINGA!';
          engine.sound.playDefeatJingle();
          setTimeout(() => engine.switchScene('STUDIO'), 1800);
          return;
        }
      } else if (distToPedra >= 26 && distToPedra < 45 && this.hurtCooldown <= 0) {
        this.message = '🪨 PISTA SECRETA: Uma pedra solta na saída do Lote 0... Sob ela jaz a Botija de Mané!';
      } else if (distToPlaca < 45 && this.hurtCooldown <= 0) {
        this.message = '🪧 PLACA: "cuidado risco de topada"';
      }

      if (distToPlaca < 48 && input.interactReleased) {
        this.message = '🪧 PLACA: "cuidado risco de topada"';
        engine.sound.playUIClick();
      }
    }

    // 6. Comportamento da Cumade Fulozinha no Lote 3b
    if (this.currentLot === '3b') {
      const isFleeing = this.fuloFleeTimer > 0;
      // Se estiver em fuga (3s após ataque), move-se na direção OPOSTA ao herói; senão, persegue
      const angle = isFleeing
        ? Math.atan2(this.fulozinha.y - this.player.y, this.fulozinha.x - this.player.x)
        : Math.atan2(this.player.y - this.fulozinha.y, this.player.x - this.fulozinha.x);

      const fuloSpeed = this.fulozinha.speed || 155;
      const targetFuloX = this.fulozinha.x + Math.cos(angle) * fuloSpeed * dt;
      const targetFuloY = this.fulozinha.y + Math.sin(angle) * fuloSpeed * dt;

      // Restrições de limites de tela/lote para a Fulô
      this.fulozinha.x = Math.max(50, Math.min(910, targetFuloX));
      this.fulozinha.y = Math.max(50, Math.min(490, targetFuloY));

      const distToFulozinha = Math.hypot(this.player.x - this.fulozinha.x, this.player.y - this.fulozinha.y);
      if (distToFulozinha < 36 && !isFleeing) {
        if (this.hasFumo) {
          // SUCESSO!
          this.stateStatus = 'SUCCESS';
          engine.unlockItem('folha');
          engine.sound.playVictoryJingle();
          engine.juice.particles.emit('sparkle', this.fulozinha.x, this.fulozinha.y, { count: 20, speed: 60 });

          this.narrative.showOutro(
            {
              phaseNumber: 2,
              title: 'A Fazenda da Cumade Fulozinha',
              verses: [
                'A fumaça perfumada acalmou a guardiã da mata,',
                'Que das suas tranças soltas uma folha de ouro desata;',
                'Com carinho e respeito pelo sagrado sertão,',
                'A Página Rasgada brilha em sua mão!'
              ],
              itemReward: {
                id: 'folha',
                name: 'Página Rasgada',
                icon: '📄'
              }
            },
            () => {
              engine.switchScene('STUDIO');
            }
          );
        } else if (this.hurtCooldown <= 0 && this.invulnerableTimer <= 0) {
          // Ataque de cadarço da Fulô: -1 HP + 5.0s invulnerabilidade + FUGA DA FULÔ POR 3.0s
          this.hurtCooldown = 1.5;
          this.invulnerableTimer = 5.0; // 2. Invulnerabilidade de 5 segundos
          this.fuloFleeTimer = 3.0; // 2. Fuga da Fulô por 3.0 segundos
          this.heroHp = Math.max(0, this.heroHp - 1);
          this.message = '🌿 A Cumade Fulozinha amarrou seus cadarços! (-1 HP)';
          engine.sound.playChicote();
          engine.sound.playGrito();
          engine.juice.shake.addTrauma(0.5);
          engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 10, speed: 50 });

          if (this.heroHp <= 0) {
            this.stateStatus = 'FAILED';
            this.message = '💀 VOCÊ NÃO RESISTIU AOS ATAQUES DA CUMADE FULOZINHA!';
            engine.sound.playDefeatJingle();
            setTimeout(() => engine.switchScene('STUDIO'), 1800);
            return;
          }
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    const lot = this.lots[this.currentLot];

    // 1. Fundo do Terreno
    drawChaoTerraBatida(ctx, 0, 0, 960, 540);

    // 2. Moldura de Cordel
    drawMolduraCordel(ctx, 8, 8, 944, 524, { borderWeight: 3 });

    // Paredes Labirínticas e Perimétricas
    for (const w of lot.walls) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
      ctx.strokeStyle = '#64748b';
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
        } else if (bush.type === 'fumo') {
          drawMoita(ctx, bush.x, bush.y, bush.radius, { hasItem: !this.hasFumo, searched: true });
          if (!this.hasFumo) {
            drawText(ctx, '🍂 FUMO', bush.x, bush.y - 14, { font: 'bold 9px monospace', color: '#facc15', align: 'center' });
          }
        } else {
          drawMoita(ctx, bush.x, bush.y, bush.radius, { hasItem: false, searched: true });
        }
      } else {
        drawMoita(ctx, bush.x, bush.y, bush.radius, { hasItem: false, searched: false });
      }
    }

    // Pedra da Botija e Placa de Aviso (EXCLUSIVAMENTE no Lote 0)
    if (this.currentLot === '0') {
      renderEntity(ctx, this.placaItem, this.animTime);
      renderEntity(ctx, this.pedraItem, this.animTime);
    }

    // Cumade Fulozinha (Lote 3b)
    if (this.currentLot === '3b') {
      drawCumadeFulozinha(ctx, this.fulozinha.x, this.fulozinha.y, this.fulozinha.width, this.fulozinha.height, {
        time: this.animTime
      });

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.fulozinha.x, this.fulozinha.y, 80, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Efeito Visual de Assobio
    if (this.isControlsInverted) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.fillRect(0, 0, 960, 540);

      drawText(ctx, '⚡ ASSOBIO DA FULÔ: CONTROLES INVERTIDOS! ⚡', 480, 50, {
        font: 'bold 15px monospace',
        align: 'center',
        color: '#f87171'
      });
    }

    // Herói Coisinha (com efeito de piscar durante invulnerabilidade)
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

    // HUD Superior
    drawText(ctx, `🌿 FASE 2: ${lot.name}`, 480, 20, {
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

    // Modais Narrativos de Apresentação e Conclusão (preenchendo 100% da tela 960x580)
    this.narrative.render(ctx, 960, 580);
  }

  public getStatusMessage(): string {
    return this.message;
  }

  public destroy(): void {
    for (const lotKey in this.lots) {
      for (const b of this.lots[lotKey as LotId].bushes) {
        b.isSearched = false;
      }
    }
  }
}
