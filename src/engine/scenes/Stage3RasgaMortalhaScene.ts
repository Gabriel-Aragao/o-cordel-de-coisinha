import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawRasgaMortalha,
  drawVioleiro,
  drawMoradorBebado,
  drawMolduraCordel,
  drawInteriorCasaXilo,
  drawBode
} from '../../renderer/xilogravura';
import { NarrativeModalManager } from '../narrative';

export interface HouseData {
  index: number;
  corName: string;
  colorHex: string;
  x: number;
  y: number;
  width: number;
  height: number;
  morador?: string;
  bebida?: string;
  fumo?: string;
  animal?: string;
}

export interface VillageEntityItem {
  id: string;
  type: 'morador' | 'bebida' | 'fumo' | 'animal';
  name: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  assignedHouseIdx?: number;
  interiorX?: number;
  interiorY?: number;
}

export class Stage3RasgaMortalhaScene implements IScene {
  public id: SceneId = 'STAGE_3_RASGAMORTALHA';
  public name = 'Fase 3: A Pena da Rasga-Mortalha';

  private currentInteriorHouseIdx: number | null = null;

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 310,
    width: 36,
    height: 50,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 230
  };

  private owl: Entity = {
    id: 'owl',
    x: 480,
    y: 40,
    width: 48,
    height: 36,
    color: '#a855f7',
    label: '[RASGA-MORTALHA]',
    shape: 'triangle',
    speed: 130
  };

  private owlDirection: number = 1;
  private animTime: number = 0;
  private stepTimer: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;

  private houses: HouseData[] = [];
  private allItems: VillageEntityItem[] = [];
  private carriedItem?: VillageEntityItem;

  private message: string = 'Ouça os Violeiros [E], pegue os itens com [E] e entre nas casas para organizá-las!';
  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';

  // Sistema Narrativo de Cordel
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  public init(_engine: IGameEngine): void {
    this.currentInteriorHouseIdx = null;
    this.player.x = 480;
    this.player.y = 310;
    this.carriedItem = undefined;
    this.stateStatus = 'PLAYING';
    this.animTime = 0;
    this.stepTimer = 0;

    const arcPositions = [
      { x: 130, y: 155 },
      { x: 305, y: 125 },
      { x: 480, y: 110 },
      { x: 655, y: 125 },
      { x: 830, y: 155 }
    ];

    this.houses = [
      { index: 1, corName: 'Amarela', colorHex: '#eab308', x: arcPositions[0].x, y: arcPositions[0].y, width: 140, height: 110 },
      { index: 2, corName: 'Azul', colorHex: '#2563eb', x: arcPositions[1].x, y: arcPositions[1].y, width: 140, height: 110 },
      { index: 3, corName: 'Vermelha', colorHex: '#dc2626', x: arcPositions[2].x, y: arcPositions[2].y, width: 140, height: 110 },
      { index: 4, corName: 'Verde', colorHex: '#16a34a', x: arcPositions[3].x, y: arcPositions[3].y, width: 140, height: 110 },
      { index: 5, corName: 'Branca', colorHex: '#f8fafc', x: arcPositions[4].x, y: arcPositions[4].y, width: 140, height: 110 }
    ];

    this.allItems = [
      // 5 Moradores (Mesa 1 em x: 280, y: 380)
      { id: 'v_vaqueiro', type: 'morador', name: 'Vaqueiro', icon: '🤠', color: '#eab308', x: 220, y: 380, originX: 220, originY: 380 },
      { id: 'v_rendeira', type: 'morador', name: 'Rendeira', icon: '👒', color: '#38bdf8', x: 250, y: 380, originX: 250, originY: 380 },
      { id: 'v_cantador', type: 'morador', name: 'Cantador', icon: '🪕', color: '#f87171', x: 280, y: 380, originX: 280, originY: 380 },
      { id: 'v_ferrador', type: 'morador', name: 'Ferrador', icon: '🔨', color: '#4ade80', x: 310, y: 380, originX: 310, originY: 380 },
      { id: 'v_rezadeira', type: 'morador', name: 'Rezadeira', icon: '📿', color: '#f1f5f9', x: 340, y: 380, originX: 340, originY: 380 },

      // 5 Bebidas (Mesa 2 em x: 460, y: 465)
      { id: 'b_agua', type: 'bebida', name: 'Água', icon: '💧', color: '#38bdf8', x: 410, y: 465, originX: 410, originY: 465 },
      { id: 'b_garapa', type: 'bebida', name: 'Garapa', icon: '🍯', color: '#facc15', x: 435, y: 465, originX: 435, originY: 465 },
      { id: 'b_cachaca', type: 'bebida', name: 'Cachaça', icon: '🍶', color: '#f87171', x: 460, y: 465, originX: 460, originY: 465 },
      { id: 'b_umbu', type: 'bebida', name: 'Umbu', icon: '🍈', color: '#4ade80', x: 485, y: 465, originX: 485, originY: 465 },
      { id: 'b_cafe', type: 'bebida', name: 'Café', icon: '☕', color: '#78350f', x: 510, y: 465, originX: 510, originY: 465 },

      // 5 Fumos (Mesa 3 em x: 650, y: 465)
      { id: 'f_paieiro', type: 'fumo', name: 'Paieiro', icon: '🍂', color: '#d97706', x: 600, y: 465, originX: 600, originY: 465 },
      { id: 'f_palha', type: 'fumo', name: 'Palha', icon: '🌾', color: '#eab308', x: 625, y: 465, originX: 625, originY: 465 },
      { id: 'f_desfiado', type: 'fumo', name: 'Desfiado', icon: '🍁', color: '#dc2626', x: 650, y: 465, originX: 650, originY: 465 },
      { id: 'f_arapiraca', type: 'fumo', name: 'Arapiraca', icon: '🌿', color: '#16a34a', x: 675, y: 465, originX: 675, originY: 465 },
      { id: 'f_trevo', type: 'fumo', name: 'Trevo', icon: '🍀', color: '#22c55e', x: 700, y: 465, originX: 700, originY: 465 },

      // 5 Animais (Curral 4 em x: 830, y: 380)
      { id: 'a_bode', type: 'animal', name: 'Bode', icon: '🐐', color: '#cbd5e1', x: 760, y: 380, originX: 760, originY: 380 },
      { id: 'a_galo', type: 'animal', name: 'Galo', icon: '🐓', color: '#ef4444', x: 790, y: 380, originX: 790, originY: 380 },
      { id: 'a_tatu', type: 'animal', name: 'Tatu', icon: '🦔', color: '#a16207', x: 820, y: 380, originX: 820, originY: 380 },
      { id: 'a_cavalo', type: 'animal', name: 'Cavalo', icon: '🐎', color: '#92400e', x: 850, y: 380, originX: 850, originY: 380 },
      { id: 'a_canario', type: 'animal', name: 'Canário', icon: '🐤', color: '#facc15', x: 880, y: 380, originX: 880, originY: 380 }
    ];

    this.narrative.showIntro({
      phaseNumber: 3,
      title: 'A Pena da Rasga-Mortalha',
      subtitle: 'O enigma das 5 casas, os cantadores e a dedução sertaneja',
      verses: [
        'Na vila da meia-noite onde a coruja esvoaça,',
        'Cinco casas em fileira guardam glória e trapaça;',
        'Escute os dois violeiros no repente afinado,',
        'Entre nas casas e traga a cada morador seu fumo, bicho e trago sagrado!'
      ],
      objective: 'Pegue itens com [E], entre nas casas e solte-os no interior para resolver o enigma!',
      itemReward: {
        id: 'pena',
        name: 'Pena Encantada',
        icon: '🪶'
      }
    });
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;

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

    // 1. Voo da Coruja Rasga-Mortalha (apenas na praça exterior)
    if (this.currentInteriorHouseIdx === null) {
      this.owl.x += this.owlDirection * (this.owl.speed || 130) * dt;
      if (this.owl.x > 880) this.owlDirection = -1;
      if (this.owl.x < 80) this.owlDirection = 1;
    }

    // 2. Movimentação do Jogador
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
      if (this.stepTimer >= 0.32) {
        this.stepTimer = 0;
        engine.sound.playPassos();
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 18, { count: 3, speed: 25 });
      }
    }

    const speed = this.player.speed || 230;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    // Limites de tela
    if (this.currentInteriorHouseIdx !== null) {
      this.player.x = Math.max(90, Math.min(870, this.player.x));
      this.player.y = Math.max(90, Math.min(490, this.player.y));

      // Saída pela porta inferior da casa
      if (this.player.y >= 470 && (this.player.x > 420 && this.player.x < 540)) {
        const exitHouse = this.houses.find(h => h.index === this.currentInteriorHouseIdx);
        this.currentInteriorHouseIdx = null;
        this.player.x = exitHouse ? exitHouse.x : 480;
        this.player.y = exitHouse ? exitHouse.y + 70 : 250;
        this.message = '🚪 Você saiu para a praça da vila.';
        engine.sound.playUIClick();
        return;
      }
    } else {
      this.player.x = Math.max(30, Math.min(930, this.player.x));
      this.player.y = Math.max(30, Math.min(510, this.player.y));
    }

    // =========================================================================
    // 3. FLUXO NO INTERIOR DA CASA
    // =========================================================================
    if (this.currentInteriorHouseIdx !== null) {
      const house = this.houses.find(h => h.index === this.currentInteriorHouseIdx)!;

      // 3.1. Grito de Reset [Espaço] dentro da casa: devolve todos os itens da casa às mesas de origem!
      if (input.action) {
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.4);

        let resetCount = 0;
        for (const it of this.allItems) {
          if (it.assignedHouseIdx === house.index) {
            it.assignedHouseIdx = undefined;
            it.x = it.originX;
            it.y = it.originY;
            it.interiorX = undefined;
            it.interiorY = undefined;
            resetCount++;
          }
        }

        house.morador = undefined;
        house.bebida = undefined;
        house.fumo = undefined;
        house.animal = undefined;

        if (resetCount > 0) {
          this.message = `🗣️ GRITO NA CASA! Os ${resetCount} elementos se assustaram e voltaram para as mesas!`;
          engine.sound.playItemDescobrir();
          engine.juice.particles.emit('dust', 480, 270, { count: 18, speed: 60 });
        } else {
          this.message = `🗣️ Coisinha soltou um grito no interior da Casa ${house.index}!`;
        }
        return;
      }

      // 3.2. Interações com [E / interactReleased] dentro da casa
      if (input.interactReleased) {
        if (this.carriedItem) {
          const it = this.carriedItem;
          it.assignedHouseIdx = house.index;
          it.interiorX = 300 + Math.random() * 360;
          it.interiorY = 220 + Math.random() * 160;

          if (it.type === 'morador') house.morador = it.name;
          else if (it.type === 'bebida') house.bebida = it.name;
          else if (it.type === 'fumo') house.fumo = it.name;
          else if (it.type === 'animal') house.animal = it.name;

          this.message = `📦 ${it.name} foi colocado no chão da Casa ${house.index} (${house.corName})!`;
          engine.sound.playPickup();
          engine.juice.particles.emit('sparkle', this.player.x, this.player.y, { count: 10, speed: 45 });
          this.carriedItem = undefined;
          this.checkVictory(engine);
          return;
        }

        for (const it of this.allItems) {
          if (it.assignedHouseIdx === house.index && it.interiorX !== undefined && it.interiorY !== undefined) {
            if (Math.hypot(this.player.x - it.interiorX, this.player.y - it.interiorY) < 60) {
              it.assignedHouseIdx = undefined;
              if (it.type === 'morador') house.morador = undefined;
              else if (it.type === 'bebida') house.bebida = undefined;
              else if (it.type === 'fumo') house.fumo = undefined;
              else if (it.type === 'animal') house.animal = undefined;

              this.carriedItem = it;
              this.message = `✋ Você recapturou ${it.name} do interior da Casa ${house.index}!`;
              engine.sound.playPickup();
              engine.juice.particles.emit('sparkle', this.player.x, this.player.y, { count: 8, speed: 35 });
              return;
            }
          }
        }
      }

      return;
    }

    // =========================================================================
    // 4. FLUXO NA PRAÇA DA VILA (EXTERIOR)
    // =========================================================================

    if (input.action) {
      engine.sound.playGrito();
      engine.juice.shake.addTrauma(0.35);
    }

    if (input.interactReleased) {
      if (Math.hypot(this.player.x - 90, this.player.y - 460) < 70) {
        engine.messages.startDialog(
          'violeiro_1',
          'Mestre Cícero Violeiro',
          '🪕',
          [
            {
              speaker: 'Violeiro 1',
              avatarIcon: '🪕',
              text: '🎵 "O Vaqueiro na Casa Amarela habita, e bebe Água de pote bem gelada que palpita; ao seu lado a Casa Azul a cantiga ressuscita!"'
            },
            {
              speaker: 'Violeiro 1',
              avatarIcon: '🪕',
              text: '🎵 "A Rendeira caprichosa mora na bela Casa Azul, cria o Galo que canta no sertão e bebe doce Garapa na cuia!"'
            },
            {
              speaker: 'Violeiro 1',
              avatarIcon: '🪕',
              text: '🎵 "O Cantador de repente mora na Casa Vermelha, toma Cachaça acendendo sua centelha e pita Fumo Desfiado na brasa!"'
            }
          ],
          undefined,
          engine
        );
        return;
      }

      if (Math.hypot(this.player.x - 170, this.player.y - 460) < 70) {
        engine.messages.startDialog(
          'violeiro_2',
          'Severino Cantador',
          '🪕',
          [
            {
              speaker: 'Violeiro 2',
              avatarIcon: '🪕',
              text: '🎵 "A Casa Verde fica ao lado da Branca; seu dono bebe Umbu: é o Ferrador afamado!"'
            },
            {
              speaker: 'Violeiro 2',
              avatarIcon: '🪕',
              text: '🎵 "O Ferrador cria o Cavalo veloz e pita Fumo Arapiraca trazido do seu norte!"'
            },
            {
              speaker: 'Violeiro 2',
              avatarIcon: '🪕',
              text: '🎵 "A Rezadeira na Casa Branca toma Café e pita Trevo! Na 1ª Amarela o Bode pasta com Paieiro, na Branca o Canário canta, e na Vermelha o Tatu cava o chão!"'
            }
          ],
          undefined,
          engine
        );
        return;
      }
    }

    for (const h of this.houses) {
      if (Math.hypot(this.player.x - h.x, this.player.y - (h.y + 40)) < 45) {
        this.currentInteriorHouseIdx = h.index;
        this.player.x = 480;
        this.player.y = 440;
        this.message = `🏠 Entrou na Casa ${h.index} (${h.corName}). Solte itens com [E] ou Grite [Espaço] para resetar!`;
        engine.sound.playUIClick();
        return;
      }
    }

    if (input.interactReleased) {
      if (this.carriedItem) {
        const it = this.carriedItem;
        it.assignedHouseIdx = undefined;
        it.x = it.originX;
        it.y = it.originY;
        it.interiorX = undefined;
        it.interiorY = undefined;
        this.message = `↩️ ${it.name} foi solto fora de uma casa e retornou à sua mesa de origem!`;
        engine.sound.playPickup();
        engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 8, speed: 30 });
        this.carriedItem = undefined;
        return;
      }

      for (const it of this.allItems) {
        if (it.assignedHouseIdx === undefined) {
          if (Math.hypot(this.player.x - it.x, this.player.y - it.y) < 45) {
            this.carriedItem = it;
            this.message = `✋ Você pegou: ${it.name} (${it.icon}). Leve até a casa certa e entre na porta!`;
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', this.player.x, this.player.y, { count: 8, speed: 35 });
            return;
          }
        }
      }
    }
  }

  private checkVictory(engine: IGameEngine): void {
    const h1 = this.houses[0];
    const h2 = this.houses[1];
    const h3 = this.houses[2];
    const h4 = this.houses[3];
    const h5 = this.houses[4];

    const isH1Valid = h1.morador === 'Vaqueiro' && h1.bebida === 'Água' && h1.fumo === 'Paieiro' && h1.animal === 'Bode';
    const isH2Valid = h2.morador === 'Rendeira' && h2.bebida === 'Garapa' && h2.fumo === 'Palha' && h2.animal === 'Galo';
    const isH3Valid = h3.morador === 'Cantador' && h3.bebida === 'Cachaça' && h3.fumo === 'Desfiado' && h3.animal === 'Tatu';
    const isH4Valid = h4.morador === 'Ferrador' && h4.bebida === 'Umbu' && h4.fumo === 'Arapiraca' && h4.animal === 'Cavalo';
    const isH5Valid = h5.morador === 'Rezadeira' && h5.bebida === 'Café' && h5.fumo === 'Trevo' && h5.animal === 'Canário';

    if (isH1Valid && isH2Valid && isH3Valid && isH4Valid && isH5Valid && this.stateStatus === 'PLAYING') {
      this.stateStatus = 'SUCCESS';
      engine.unlockItem('pena');
      engine.sound.playVictoryJingle();

      this.narrative.showOutro(
        {
          phaseNumber: 3,
          title: 'A Pena da Rasga-Mortalha',
          verses: [
            'A dedução foi perfeita na vila da cantoria,',
            'Cada casa no seu canto com firme sabedoria;',
            'A Rasga-Mortalha desce das nuvens do sertão:',
            'E entrega a Pena Encantada com louvor e consagração!'
          ],
          itemReward: {
            id: 'pena',
            name: 'Pena Encantada',
            icon: '🪶'
          }
        },
        () => {
          engine.switchScene('STUDIO');
        }
      );
    }
  }

  public render(ctx: CanvasRenderingContext2D, engine: IGameEngine): void {
    // =========================================================================
    // 1. RENDER DO INTERIOR DA CASA
    // =========================================================================
    if (this.currentInteriorHouseIdx !== null) {
      const house = this.houses.find(h => h.index === this.currentInteriorHouseIdx)!;

      drawInteriorCasaXilo(ctx, 960, 460, house, { time: this.animTime });

      for (const it of this.allItems) {
        if (it.assignedHouseIdx === house.index && it.interiorX !== undefined && it.interiorY !== undefined) {
          ctx.save();
          if (it.type === 'morador') {
            drawMoradorBebado(ctx, it.interiorX, it.interiorY, 36, 48, { colorTint: it.color });
          } else if (it.type === 'animal') {
            drawBode(ctx, it.interiorX, it.interiorY, 40, 34);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(it.interiorX - 18, it.interiorY - 18, 36, 36);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(it.interiorX - 18, it.interiorY - 18, 36, 36);
            ctx.font = '20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(it.icon, it.interiorX, it.interiorY);
          }
          drawText(ctx, `[E] ${it.name}`, it.interiorX, it.interiorY + 24, { font: 'bold 10px monospace', align: 'center', color: '#facc15' });
          ctx.restore();
        }
      }

      ctx.fillStyle = '#854d0e';
      ctx.fillRect(430, 425, 100, 30);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(430, 425, 100, 30);
      drawText(ctx, 'SAÍDA ⬇', 480, 433, { font: 'bold 11px monospace', align: 'center', color: '#fef08a' });

      drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
        facing: this.facing,
        isMoving: this.isMoving,
        time: this.animTime
      });

      if (this.carriedItem) {
        ctx.save();
        ctx.font = '22px monospace';
        ctx.fillText(this.carriedItem.icon, this.player.x + 22, this.player.y - 20);
        drawText(ctx, `[${this.carriedItem.name}]`, this.player.x + 22, this.player.y - 34, { font: 'bold 9px monospace', color: '#fef08a', align: 'center' });
        ctx.restore();
      }

      // Notificar gerenciador global de mensagens na base
      engine.messages.postMessage(this.message);
      return;
    }

    // =========================================================================
    // 2. RENDER DA PRAÇA DA VILA (EXTERIOR)
    // =========================================================================

    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 0, 960, 460);
    drawMolduraCordel(ctx, 8, 8, 944, 444, { borderWeight: 3 });

    for (const h of this.houses) {
      ctx.fillStyle = '#292524';
      ctx.fillRect(h.x - h.width / 2, h.y - h.height / 2, h.width, h.height);
      ctx.strokeStyle = h.colorHex;
      ctx.lineWidth = 3;
      ctx.strokeRect(h.x - h.width / 2, h.y - h.height / 2, h.width, h.height);

      drawText(ctx, `Casa ${h.index}`, h.x, h.y - 48, { font: 'bold 12px monospace', align: 'center', color: h.colorHex });
      drawText(ctx, h.corName, h.x, h.y - 34, { font: 'bold 10px monospace', align: 'center', color: '#d6d3d1' });

      ctx.fillStyle = '#44403c';
      ctx.fillRect(h.x - 18, h.y + 12, 36, 42);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(h.x - 18, h.y + 12, 36, 42);
      drawText(ctx, 'ENTRAR', h.x, h.y + 26, { font: 'bold 8px monospace', align: 'center', color: '#facc15' });

      const itemsInHouse = this.allItems.filter(it => it.assignedHouseIdx === h.index);
      if (itemsInHouse.length > 0) {
        const icons = itemsInHouse.map(it => it.icon).join(' ');
        drawText(ctx, icons, h.x, h.y - 12, { font: '13px monospace', align: 'center' });
      }
    }

    // 4 Mesas / Áreas Interativas Ampliadas na Praça
    ctx.fillStyle = '#27272a';
    ctx.fillRect(190, 350, 180, 60);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(190, 350, 180, 60);
    drawText(ctx, '🍻 BODEGA DOS MORADORES [E]', 280, 356, { font: 'bold 10px monospace', align: 'center', color: '#facc15' });

    ctx.fillStyle = '#27272a';
    ctx.fillRect(390, 435, 140, 60);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(390, 435, 140, 60);
    drawText(ctx, '🍶 BEBIDAS [E]', 460, 441, { font: 'bold 10px monospace', align: 'center', color: '#38bdf8' });

    ctx.fillStyle = '#27272a';
    ctx.fillRect(580, 435, 140, 60);
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.strokeRect(580, 435, 140, 60);
    drawText(ctx, '🍂 FUMOS [E]', 650, 441, { font: 'bold 10px monospace', align: 'center', color: '#4ade80' });

    ctx.fillStyle = '#27272a';
    ctx.fillRect(730, 350, 180, 60);
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    ctx.strokeRect(730, 350, 180, 60);
    drawText(ctx, '🐐 CURRAL DE ANIMAIS [E]', 820, 356, { font: 'bold 10px monospace', align: 'center', color: '#fb923c' });

    for (const it of this.allItems) {
      if (it.assignedHouseIdx === undefined && (!this.carriedItem || this.carriedItem.id !== it.id)) {
        ctx.save();
        if (it.type === 'morador') {
          drawMoradorBebado(ctx, it.x, it.y + 8, 28, 38, { colorTint: it.color });
        } else if (it.type === 'animal') {
          drawBode(ctx, it.x, it.y + 8, 30, 26);
        } else {
          ctx.font = '18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(it.icon, it.x, it.y + 6);
        }
        drawText(ctx, it.name, it.x, it.y + 22, { font: 'bold 9px monospace', align: 'center', color: '#e2e8f0' });
        ctx.restore();
      }
    }

    drawVioleiro(ctx, 90, 460, 42, 48, { time: this.animTime });
    drawText(ctx, '🪕 Violeiro 1 [E]', 90, 490, { font: 'bold 10px monospace', align: 'center', color: '#fde047' });

    drawVioleiro(ctx, 170, 460, 42, 48, { time: this.animTime });
    drawText(ctx, '🪕 Violeiro 2 [E]', 170, 490, { font: 'bold 10px monospace', align: 'center', color: '#93c5fd' });

    drawRasgaMortalha(ctx, this.owl.x, this.owl.y, 48, 36, { time: this.animTime });

    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    if (this.carriedItem) {
      ctx.save();
      ctx.font = '22px monospace';
      ctx.fillText(this.carriedItem.icon, this.player.x + 22, this.player.y - 20);
      drawText(ctx, `[${this.carriedItem.name}]`, this.player.x + 22, this.player.y - 34, { font: 'bold 9px monospace', color: '#fef08a', align: 'center' });
      ctx.restore();
    }

    drawText(ctx, '🦉 FASE 3: A PRAÇA DAS 5 CASAS', 480, 16, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    // Notificar gerenciador global de mensagens na base
    engine.messages.postMessage(this.message);

    // Modais Narrativos
    this.narrative.render(ctx, 960, 460);
  }

  public destroy(): void {}
}
