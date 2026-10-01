import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawRasgaMortalha,
  drawVioleiro,
  drawMoradorBebado,
  drawMolduraCordel,
  drawInteriorCasaXilo,
  drawPalcoVioleirosXilo,
  drawMesaMontagemXilo
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
  private doorCooldown: number = 0;

  // Timer de 5 minutos (300 segundos) e Som da Coruja a cada 30 segundos
  private stageTimer: number = 300;
  private owlSoundTimer: number = 0;

  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';

  // Sistema Narrativo de Cordel
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  public init(_engine: IGameEngine): void {
    this.currentInteriorHouseIdx = null;
    this.player.x = 480;
    this.player.y = 380;
    this.carriedItem = undefined;
    this.doorCooldown = 0;
    this.stageTimer = 300;
    this.owlSoundTimer = 0;
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

    // 4 Quadros/Mesas ampliados e distribuídos em arco na base para acomodar 5 itens com folga:
    // Bodega (x: 135, y: 460), Bebidas (x: 365, y: 480), Fumos (x: 595, y: 480), Curral (x: 825, y: 460)
    this.allItems = [
      // 5 Moradores (Bodega dos Moradores: x: 135, y: 460)
      { id: 'v_vaqueiro', type: 'morador', name: 'Vaqueiro', icon: '🤠', color: '#eab308', x: 55, y: 425, originX: 55, originY: 425 },
      { id: 'v_rendeira', type: 'morador', name: 'Rendeira', icon: '👒', color: '#38bdf8', x: 95, y: 435, originX: 95, originY: 435 },
      { id: 'v_cantador', type: 'morador', name: 'Cantador', icon: '🪕', color: '#f87171', x: 135, y: 445, originX: 135, originY: 445 },
      { id: 'v_ferrador', type: 'morador', name: 'Ferrador', icon: '🔨', color: '#4ade80', x: 175, y: 435, originX: 175, originY: 435 },
      { id: 'v_rezadeira', type: 'morador', name: 'Rezadeira', icon: '📿', color: '#f1f5f9', x: 215, y: 425, originX: 215, originY: 425 },

      // 5 Bebidas (Mesa de Bebidas: x: 365, y: 485)
      { id: 'b_agua', type: 'bebida', name: 'Água', icon: '💧', color: '#38bdf8', x: 295, y: 450, originX: 295, originY: 450 },
      { id: 'b_garapa', type: 'bebida', name: 'Garapa', icon: '🍯', color: '#facc15', x: 330, y: 460, originX: 330, originY: 460 },
      { id: 'b_cachaca', type: 'bebida', name: 'Cachaça', icon: '🍶', color: '#f87171', x: 365, y: 470, originX: 365, originY: 470 },
      { id: 'b_umbu', type: 'bebida', name: 'Umbu', icon: '🍈', color: '#4ade80', x: 400, y: 460, originX: 400, originY: 460 },
      { id: 'b_cafe', type: 'bebida', name: 'Café', icon: '☕', color: '#78350f', x: 435, y: 450, originX: 435, originY: 450 },

      // 5 Fumos (Mesa de Fumos: x: 595, y: 485)
      { id: 'f_paieiro', type: 'fumo', name: 'Paieiro', icon: '🍂', color: '#d97706', x: 525, y: 450, originX: 525, originY: 450 },
      { id: 'f_palha', type: 'fumo', name: 'Palha', icon: '🌾', color: '#eab308', x: 560, y: 460, originX: 560, originY: 460 },
      { id: 'f_desfiado', type: 'fumo', name: 'Desfiado', icon: '🍁', color: '#dc2626', x: 595, y: 470, originX: 595, originY: 470 },
      { id: 'f_arapiraca', type: 'fumo', name: 'Arapiraca', icon: '🌿', color: '#16a34a', x: 630, y: 460, originX: 630, originY: 460 },
      { id: 'f_trevo', type: 'fumo', name: 'Trevo', icon: '🍀', color: '#22c55e', x: 665, y: 450, originX: 665, originY: 450 },

      // 5 Animais (Curral de Animais: x: 825, y: 460)
      { id: 'a_bode', type: 'animal', name: 'Bode', icon: '🐐', color: '#cbd5e1', x: 745, y: 425, originX: 745, originY: 425 },
      { id: 'a_galo', type: 'animal', name: 'Galo', icon: '🐓', color: '#ef4444', x: 785, y: 435, originX: 785, originY: 435 },
      { id: 'a_tatu', type: 'animal', name: 'Tatu', icon: '🦔', color: '#a16207', x: 825, y: 445, originX: 825, originY: 445 },
      { id: 'a_cavalo', type: 'animal', name: 'Cavalo', icon: '🐎', color: '#92400e', x: 865, y: 435, originX: 865, originY: 435 },
      { id: 'a_canario', type: 'animal', name: 'Canário', icon: '🐤', color: '#facc15', x: 905, y: 425, originX: 905, originY: 425 }
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

    if (this.doorCooldown > 0) {
      this.doorCooldown = Math.max(0, this.doorCooldown - dt);
    }

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

    // 0. Timer da Fase (5 minutos = 300s) & Som da Rasga-Mortalha a cada 30 segundos
    this.stageTimer -= dt;
    this.owlSoundTimer += dt;

    if (this.owlSoundTimer >= 30) {
      this.owlSoundTimer = 0;
      engine.sound.playRasgaCanto();
      engine.juice.shake.addTrauma(0.2);
    }

    if (this.stageTimer <= 0) {
      this.stageTimer = 0;
      this.stateStatus = 'FAILED';
      engine.sound.playDefeatJingle();
      this.narrative.showOutro(
        {
          phaseNumber: 3,
          title: 'O Mau Agouro da Rasga-Mortalha',
          verses: [
            'O tempo findou-se na escuridão da praça,',
            'O grito da coruja espalhou sua desgraça;',
            'Os moradores correram com medo da assombração,',
            'Retorne ao Estúdio para tentar nova dedução!'
          ],
          itemReward: {
            id: 'pena',
            name: 'Pena Perdida',
            icon: '🪶'
          }
        },
        () => {
          engine.switchScene('STUDIO');
        }
      );
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

      // Saída pela porta inferior da casa (com cooldown e spawn afastado)
      if (this.doorCooldown <= 0 && this.player.y >= 475 && (this.player.x > 420 && this.player.x < 540)) {
        const exitHouse = this.houses.find(h => h.index === this.currentInteriorHouseIdx);
        this.currentInteriorHouseIdx = null;
        this.doorCooldown = 0.6; // Cooldown de 0.6s para evitar reentrada imediata
        this.player.x = exitHouse ? exitHouse.x : 480;
        this.player.y = exitHouse ? exitHouse.y + 110 : 270; // 110px abaixo da casa, fora do raio de 45px
        engine.messages.postMessage('🚪 Você saiu para a praça da vila.');
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
          engine.messages.postMessage(`🗣️ GRITO NA CASA! Os ${resetCount} elementos se assustaram e voltaram para as mesas!`, { isSuccess: true });
          engine.sound.playItemDescobrir();
          engine.juice.particles.emit('dust', 480, 270, { count: 18, speed: 60 });
        } else {
          engine.messages.postMessage(`🗣️ Coisinha soltou um grito no interior da Casa ${house.index}!`);
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

          engine.messages.postMessage(`📦 ${it.name} foi colocado no chão da Casa ${house.index} (${house.corName})!`);
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
              engine.messages.postMessage(`✋ Você recapturou ${it.name} do interior da Casa ${house.index}!`);
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

    // Palco Central dos Violeiros em (x: 480, y: 280)
    if (input.interactReleased) {
      if (Math.hypot(this.player.x - 450, this.player.y - 280) < 65) {
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

      if (Math.hypot(this.player.x - 510, this.player.y - 280) < 65) {
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

    if (this.doorCooldown <= 0) {
      for (const h of this.houses) {
        if (Math.hypot(this.player.x - h.x, this.player.y - (h.y + 40)) < 45) {
          this.currentInteriorHouseIdx = h.index;
          this.doorCooldown = 0.6; // Cooldown ao entrar na casa
          this.player.x = 480;
          this.player.y = 400; // Posicionado a 400px, bem longe de y >= 475px
          engine.messages.postMessage(`🏠 Entrou na Casa ${h.index} (${h.corName}). Solte itens com [E] ou Grite [Espaço] para resetar!`);
          engine.sound.playUIClick();
          return;
        }
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
        engine.messages.postMessage(`↩️ ${it.name} foi solto fora de uma casa e retornou à sua mesa de origem!`);
        engine.sound.playPickup();
        engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 8, speed: 30 });
        this.carriedItem = undefined;
        return;
      }

      for (const it of this.allItems) {
        if (it.assignedHouseIdx === undefined) {
          if (Math.hypot(this.player.x - it.x, this.player.y - it.y) < 45) {
            this.carriedItem = it;
            engine.messages.postMessage(`✋ Você pegou: ${it.name} (${it.icon}). Leve até a casa certa e entre na porta!`);
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

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // =========================================================================
    // 1. RENDER DO INTERIOR DA CASA
    // =========================================================================
    if (this.currentInteriorHouseIdx !== null) {
      const house = this.houses.find(h => h.index === this.currentInteriorHouseIdx)!;

      drawInteriorCasaXilo(ctx, 960, 580, house, { time: this.animTime });

      for (const it of this.allItems) {
        if (it.assignedHouseIdx === house.index && it.interiorX !== undefined && it.interiorY !== undefined) {
          ctx.save();
          if (it.type === 'morador') {
            drawMoradorBebado(ctx, it.interiorX, it.interiorY, 36, 48, { colorTint: it.color });
          } else if (it.type === 'animal') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(it.interiorX - 20, it.interiorY - 20, 40, 40);
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(it.interiorX - 20, it.interiorY - 20, 40, 40);
            ctx.font = '24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(it.icon, it.interiorX, it.interiorY);
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

      // HUD de Tempo Restante no Interior da Casa
      const minutes = Math.floor(this.stageTimer / 60);
      const seconds = Math.floor(this.stageTimer % 60);
      const timeStr = `⏳ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      ctx.save();
      ctx.fillStyle = '#1e1b18';
      ctx.fillRect(840, 15, 100, 32);
      ctx.strokeStyle = this.stageTimer <= 60 ? '#ef4444' : '#d4af37';
      ctx.lineWidth = 2;
      ctx.strokeRect(840, 15, 100, 32);
      drawText(ctx, timeStr, 890, 24, {
        font: 'bold 13px monospace',
        align: 'center',
        color: this.stageTimer <= 60 ? '#f87171' : '#fef08a'
      });
      ctx.restore();

      // Renderizar o folheto de vitória/narrativa mesmo dentro da casa!
      this.narrative.render(ctx, 960, 580);
      return;
    }

    // =========================================================================
    // 2. RENDER DA PRAÇA DA VILA (EXTERIOR)
    // =========================================================================

    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 0, 960, 580);
    drawMolduraCordel(ctx, 8, 8, 944, 564, { borderWeight: 3 });

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

    // Palco Central dos Violeiros no Centro da Praça
    drawPalcoVioleirosXilo(ctx, 480, 270, 220, 85, { time: this.animTime });
    drawVioleiro(ctx, 440, 260, 38, 44, { time: this.animTime, facing: 'right' });
    drawText(ctx, '🪕 Violeiro 1 [E]', 440, 288, { font: 'bold 9px monospace', align: 'center', color: '#fde047' });

    drawVioleiro(ctx, 520, 260, 38, 44, { time: this.animTime, facing: 'left' });
    drawText(ctx, '🪕 Violeiro 2 [E]', 520, 288, { font: 'bold 9px monospace', align: 'center', color: '#93c5fd' });

    // 4 Mesas / Áreas Interativas Ampliadas em Arco na Base da Praça
    drawMesaMontagemXilo(ctx, 140, 440, 220, 100, 'BODEGA DOS MORADORES', '🍻', { colorAccent: '#27272a' });
    drawMesaMontagemXilo(ctx, 370, 465, 200, 100, 'BEBIDAS & CAFÉ', '🍶', { colorAccent: '#27272a' });
    drawMesaMontagemXilo(ctx, 590, 465, 200, 100, 'FUMOS REGIONAIS', '🍂', { colorAccent: '#27272a' });
    drawMesaMontagemXilo(ctx, 820, 440, 220, 100, 'CURRAL DE ANIMAIS', '🐐', { colorAccent: '#27272a' });

    for (const it of this.allItems) {
      if (it.assignedHouseIdx === undefined && (!this.carriedItem || this.carriedItem.id !== it.id)) {
        ctx.save();
        if (it.type === 'morador') {
          drawMoradorBebado(ctx, it.x, it.y + 8, 28, 38, { colorTint: it.color });
        } else if (it.type === 'animal') {
          ctx.save();
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(it.x - 18, it.y - 12, 36, 36);
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(it.x - 18, it.y - 12, 36, 36);
          ctx.font = '22px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(it.icon, it.x, it.y + 6);
          ctx.restore();
        } else {
          ctx.font = '18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(it.icon, it.x, it.y + 6);
        }
        drawText(ctx, it.name, it.x, it.y + 22, { font: 'bold 9px monospace', align: 'center', color: '#e2e8f0' });
        ctx.restore();
      }
    }

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

    // HUD de Tempo Restante na Praça
    const minutes = Math.floor(this.stageTimer / 60);
    const seconds = Math.floor(this.stageTimer % 60);
    const timeStr = `⏳ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    ctx.save();
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(840, 15, 100, 32);
    ctx.strokeStyle = this.stageTimer <= 60 ? '#ef4444' : '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(840, 15, 100, 32);
    drawText(ctx, timeStr, 890, 24, {
      font: 'bold 13px monospace',
      align: 'center',
      color: this.stageTimer <= 60 ? '#f87171' : '#fef08a'
    });
    ctx.restore();

    // Modais Narrativos (preenchendo 100% da tela 960x580)
    this.narrative.render(ctx, 960, 580);
  }

  public destroy(): void { }
}
