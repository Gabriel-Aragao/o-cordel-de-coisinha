import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawRasgaMortalha,
  drawVioleiro,
  drawMoradorBebado,
  drawMolduraCordel
} from '../../renderer/xilogravura';
import { DialogSystem } from '../dialogs';
import { NarrativeModalManager } from '../narrative';

interface HouseSlot {
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

interface DrunkVillager {
  id: string;
  name: string;
  x: number;
  y: number;
  assignedHouseIdx?: number;
  isPushed: boolean;
  color: string;
}

interface ItemResource {
  id: string;
  type: 'bebida' | 'fumo';
  name: string;
  icon: string;
  x: number;
  y: number;
  assignedHouseIdx?: number;
}

interface VillageAnimal {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  assignedHouseIdx?: number;
  isLeashed: boolean;
  speed: number;
}

export class Stage3RasgaMortalhaScene implements IScene {
  public id: SceneId = 'STAGE_3_RASGAMORTALHA';
  public name = 'Fase 3: A Pena da Rasga-Mortalha';

  private player: Entity = {
    id: 'hero',
    x: 480,
    y: 300,
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

  // As 5 Casas em Arco no Topo
  private houses: HouseSlot[] = [];

  // 4 Mesas / Áreas Interativas
  private villagers: DrunkVillager[] = [];
  private beverages: ItemResource[] = [];
  private tobaccos: ItemResource[] = [];
  private animals: VillageAnimal[] = [];

  // Item Carregado pelo Herói
  private carriedItem?: { type: 'bebida' | 'fumo'; name: string; icon: string; id: string };

  private message: string = 'Ouça os Violeiros [E], organize as 5 casas com os Bêbados, Bebidas, Fumos e Animais!';
  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';

  private dialogs: DialogSystem = new DialogSystem();
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  public init(_engine: IGameEngine): void {
    this.player.x = 480;
    this.player.y = 300;
    this.carriedItem = undefined;
    this.stateStatus = 'PLAYING';
    this.animTime = 0;
    this.stepTimer = 0;

    // 1. As 5 Casas Dispostas em Arco no Topo
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

    // 2. Mesa 1: Os 5 Bêbados / Moradores (x: 290, y: 390)
    this.villagers = [
      { id: 'v_vaqueiro', name: 'Vaqueiro', x: 250, y: 380, isPushed: false, color: '#eab308' },
      { id: 'v_rendeira', name: 'Rendeira', x: 280, y: 380, isPushed: false, color: '#38bdf8' },
      { id: 'v_cantador', name: 'Cantador', x: 310, y: 380, isPushed: false, color: '#f87171' },
      { id: 'v_ferrador', name: 'Ferrador', x: 340, y: 380, isPushed: false, color: '#4ade80' },
      { id: 'v_rezadeira', name: 'Rezadeira', x: 370, y: 380, isPushed: false, color: '#f1f5f9' }
    ];

    // 3. Mesa 2: As 5 Bebidas (x: 480, y: 470)
    this.beverages = [
      { id: 'b_agua', type: 'bebida', name: 'Água', icon: '💧', x: 440, y: 470 },
      { id: 'b_garapa', type: 'bebida', name: 'Garapa', icon: '🍯', x: 460, y: 470 },
      { id: 'b_cachaca', type: 'bebida', name: 'Cachaça', icon: '🍶', x: 480, y: 470 },
      { id: 'b_umbu', type: 'bebida', name: 'Umbu', icon: '🍈', x: 500, y: 470 },
      { id: 'b_cafe', type: 'bebida', name: 'Café', icon: '☕', x: 520, y: 470 }
    ];

    // 4. Mesa 3: Os 5 Fumos (x: 640, y: 470)
    this.tobaccos = [
      { id: 'f_paieiro', type: 'fumo', name: 'Paieiro', icon: '🍂', x: 600, y: 470 },
      { id: 'f_palha', type: 'fumo', name: 'Palha', icon: '🌾', x: 620, y: 470 },
      { id: 'f_desfiado', type: 'fumo', name: 'Desfiado', icon: '🍁', x: 640, y: 470 },
      { id: 'f_arapiraca', type: 'fumo', name: 'Arapiraca', icon: '🌿', x: 660, y: 470 },
      { id: 'f_trevo', type: 'fumo', name: 'Trevo', icon: '🍀', x: 680, y: 470 }
    ];

    // 5. Curral 4: Os 5 Animais (x: 820, y: 390)
    this.animals = [
      { id: 'a_bode', name: 'Bode', icon: '🐐', x: 770, y: 380, isLeashed: false, speed: 90 },
      { id: 'a_galo', name: 'Galo', icon: '🐓', x: 800, y: 380, isLeashed: false, speed: 90 },
      { id: 'a_tatu', name: 'Tatu', icon: '🦔', x: 830, y: 380, isLeashed: false, speed: 90 },
      { id: 'a_cavalo', name: 'Cavalo', icon: '🐎', x: 860, y: 380, isLeashed: false, speed: 90 },
      { id: 'a_canario', name: 'Canário', icon: '🐤', x: 890, y: 380, isLeashed: false, speed: 90 }
    ];

    // Apresentação da Fase (Folheto de Cordel)
    this.narrative.showIntro({
      phaseNumber: 3,
      title: 'A Pena da Rasga-Mortalha',
      subtitle: 'O enigma das 5 casas, os cantadores e a dedução sertaneja',
      verses: [
        'Na vila da meia-noite onde a coruja esvoaça,',
        'Cinco casas em fileira guardam glória e trapaça;',
        'Escute os dois violeiros no repente afinado,',
        'E traga a cada morador seu fumo, bicho e trago sagrado!'
      ],
      objective: 'Empurre os bêbados, entregue bebidas/fumos e conduza os animais às 5 casas certas!',
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

    if (this.dialogs.isActive) {
      this.dialogs.update(dt, input, engine);
      return;
    }

    if (this.stateStatus !== 'PLAYING') {
      return;
    }

    // 1. Voo da Coruja Rasga-Mortalha
    this.owl.x += this.owlDirection * (this.owl.speed || 130) * dt;
    if (this.owl.x > 880) this.owlDirection = -1;
    if (this.owl.x < 80) this.owlDirection = 1;

    // 2. Movimento do Jogador
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

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(30, Math.min(510, this.player.y));

    // 3. Mecânica do Grito Universal [Espaço]: Espanta Animais das Casas Próximas!
    if (input.action) {
      engine.sound.playGrito();
      engine.juice.shake.addTrauma(0.35);

      for (const h of this.houses) {
        if (Math.hypot(this.player.x - h.x, this.player.y - h.y) < 140) {
          if (h.animal) {
            const animalObj = this.animals.find((a) => a.name === h.animal);
            if (animalObj) {
              animalObj.assignedHouseIdx = undefined;
              animalObj.isLeashed = false;
              animalObj.x = 800 + (Math.random() - 0.5) * 60;
              animalObj.y = 380 + (Math.random() - 0.5) * 40;
              h.animal = undefined;
              this.message = `📣 GRITO! O ${animalObj.name} se assustou e fugiu da Casa ${h.index}!`;
              engine.sound.playBerroBode(true);
            }
          }
        }
      }
    }

    // 4. Interação com os 2 Violeiros [E / Enter]
    // Violeiro 1 (Estrofes 1 a 4)
    if (Math.hypot(this.player.x - 90, this.player.y - 460) < 60 && input.interact) {
      this.dialogs.startDialog(
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

    // Violeiro 2 (Estrofes 5 a 9)
    if (Math.hypot(this.player.x - 170, this.player.y - 460) < 60 && input.interact) {
      this.dialogs.startDialog(
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

    // 5. Empurrar Bêbados (Tocar fisicamente ou [E] para falar)
    for (const v of this.villagers) {
      const distHeroV = Math.hypot(this.player.x - v.x, this.player.y - v.y);
      if (distHeroV < 40) {
        if (input.interact) {
          this.message = `🍻 Bêbado: "Eu sou ${v.name}, forasteiro! Me leve pra minha casa..."`;
          engine.sound.playUIClick();
        }

        // Empurrão físico na direção do movimento do herói
        if (this.isMoving) {
          v.x += dx * 160 * dt;
          v.y += dy * 160 * dt;
          v.isPushed = true;

          // Checa se empurrou até a porta de alguma casa
          for (const h of this.houses) {
            if (Math.hypot(v.x - h.x, v.y - h.y) < 65) {
              if (h.morador !== v.name) {
                h.morador = v.name;
                v.assignedHouseIdx = h.index;
                this.message = `🏠 ${v.name} entrou na Casa ${h.index} (${h.corName})!`;
                engine.sound.playPickup();
                engine.juice.particles.emit('sparkle', h.x, h.y, { count: 8, speed: 40 });
                this.checkVictory(engine);
              }
            }
          }
        }
      }
    }

    // 6. Pegar e Entregar Bebidas e Fumos
    if (input.interact) {
      // Se já carrega um item, tenta entregar na casa próxima
      if (this.carriedItem) {
        for (const h of this.houses) {
          if (Math.hypot(this.player.x - h.x, this.player.y - h.y) < 70) {
            if (this.carriedItem.type === 'bebida') {
              h.bebida = this.carriedItem.name;
            } else {
              h.fumo = this.carriedItem.name;
            }
            this.message = `📦 ${this.carriedItem.name} entregue na Casa ${h.index} (${h.corName})!`;
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', h.x, h.y, { count: 8, speed: 40 });
            this.carriedItem = undefined;
            this.checkVictory(engine);
            return;
          }
        }
      }

      // Se não carrega, tenta pegar na mesa de bebidas
      for (const b of this.beverages) {
        if (Math.hypot(this.player.x - b.x, this.player.y - b.y) < 35 && !this.carriedItem) {
          this.carriedItem = { type: 'bebida', name: b.name, icon: b.icon, id: b.id };
          this.message = `🍶 Você pegou a Bebida: ${b.name}! Leve até a casa certa.`;
          engine.sound.playPickup();
          return;
        }
      }

      // Tenta pegar na mesa de fumos
      for (const f of this.tobaccos) {
        if (Math.hypot(this.player.x - f.x, this.player.y - f.y) < 35 && !this.carriedItem) {
          this.carriedItem = { type: 'fumo', name: f.name, icon: f.icon, id: f.id };
          this.message = `🍂 Você pegou o Fumo: ${f.name}! Leve até a casa certa.`;
          engine.sound.playPickup();
          return;
        }
      }

      // Tenta laçar animal
      for (const a of this.animals) {
        if (Math.hypot(this.player.x - a.x, this.player.y - a.y) < 45) {
          a.isLeashed = !a.isLeashed;
          this.message = a.isLeashed ? `🪢 Você laçou o ${a.name}! Conduza-o até a casa.` : `Soltou o ${a.name}.`;
          engine.sound.playBerroBode(false);
          return;
        }
      }
    }

    // 7. Condução dos Animais Laçados
    for (const a of this.animals) {
      if (a.isLeashed) {
        const targetX = this.player.x - dx * 35;
        const targetY = this.player.y - dy * 35;
        const angle = Math.atan2(targetY - a.y, targetX - a.x);
        const dist = Math.hypot(targetX - a.x, targetY - a.y);
        if (dist > 25) {
          a.x += Math.cos(angle) * 180 * dt;
          a.y += Math.sin(angle) * 180 * dt;
        }

        // Checa se conduziu até uma casa
        for (const h of this.houses) {
          if (Math.hypot(a.x - h.x, a.y - h.y) < 65) {
            h.animal = a.name;
            a.assignedHouseIdx = h.index;
            a.isLeashed = false;
            this.message = `🏠 ${a.name} guardado na Casa ${h.index} (${h.corName})!`;
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', h.x, h.y, { count: 8, speed: 40 });
            this.checkVictory(engine);
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
    // 1. Noite Noturna da Vila de Cordel
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, 960, 540);

    drawMolduraCordel(ctx, 8, 8, 944, 524, { borderWeight: 3 });

    // Lua Cheia de Xilogravura
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(890, 45, 24, 0, Math.PI * 2);
    ctx.fill();

    // Voo da Rasga-Mortalha
    drawRasgaMortalha(ctx, this.owl.x, this.owl.y, this.owl.width, this.owl.height, {
      time: this.animTime
    });

    // 2. As 5 Casas em Arco no Topo
    for (let i = 0; i < this.houses.length; i++) {
      const h = this.houses[i];

      // Telhado
      ctx.beginPath();
      ctx.moveTo(h.x - h.width / 2 - 8, h.y - h.height / 2 + 25);
      ctx.lineTo(h.x, h.y - h.height / 2);
      ctx.lineTo(h.x + h.width / 2 + 8, h.y - h.height / 2 + 25);
      ctx.closePath();
      ctx.fillStyle = '#7c2d12';
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corpo da Casa
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(h.x - h.width / 2, h.y - h.height / 2 + 25, h.width, h.height - 25);
      ctx.strokeStyle = h.colorHex;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(h.x - h.width / 2, h.y - h.height / 2 + 25, h.width, h.height - 25);

      // Título da Casa
      drawText(ctx, `Casa ${h.index} (${h.corName})`, h.x, h.y - h.height / 2 + 32, {
        font: 'bold 10px monospace',
        color: h.colorHex,
        align: 'center'
      });

      // Itens Atribuídos dentro da Casa
      const slotY = h.y - h.height / 2 + 48;
      drawText(ctx, `👤 ${h.morador || '---'}`, h.x, slotY, { font: '9px monospace', color: '#f8fafc', align: 'center' });
      drawText(ctx, `🍶 ${h.bebida || '---'} | 🍂 ${h.fumo || '---'}`, h.x, slotY + 14, { font: '9px monospace', color: '#fde047', align: 'center' });
      drawText(ctx, `🐾 ${h.animal || '---'}`, h.x, slotY + 28, { font: '9px monospace', color: '#86efac', align: 'center' });
    }

    // 3. Os 2 Violeiros no Canto Inferior Esquerdo
    drawVioleiro(ctx, 90, 460, 44, 56, { time: this.animTime });
    drawText(ctx, '🪕 Violeiro 1', 90, 495, { font: 'bold 10px monospace', color: '#facc15', align: 'center' });

    drawVioleiro(ctx, 170, 460, 44, 56, { time: this.animTime });
    drawText(ctx, '🪕 Violeiro 2', 170, 495, { font: 'bold 10px monospace', color: '#facc15', align: 'center' });

    // 4. Mesa 1: Os 5 Bêbados
    ctx.fillStyle = '#451a03';
    ctx.fillRect(230, 360, 160, 40);
    ctx.strokeStyle = '#a16207';
    ctx.strokeRect(230, 360, 160, 40);
    drawText(ctx, '🍻 MESA DOS BÊBADOS', 310, 345, { font: 'bold 9px monospace', color: '#fde047', align: 'center' });

    for (const v of this.villagers) {
      drawMoradorBebado(ctx, v.x, v.y, 28, 38, { colorTint: v.color, time: this.animTime });
    }

    // 5. Mesa 2: Bebidas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(425, 450, 110, 36);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(425, 450, 110, 36);
    drawText(ctx, '🍶 BEBIDAS', 480, 440, { font: 'bold 9px monospace', color: '#38bdf8', align: 'center' });
    for (const b of this.beverages) {
      drawText(ctx, b.icon, b.x, b.y - 6, { font: '14px monospace', align: 'center' });
    }

    // 6. Mesa 3: Fumos
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(585, 450, 110, 36);
    ctx.strokeStyle = '#4ade80';
    ctx.strokeRect(585, 450, 110, 36);
    drawText(ctx, '🍂 FUMOS', 640, 440, { font: 'bold 9px monospace', color: '#4ade80', align: 'center' });
    for (const f of this.tobaccos) {
      drawText(ctx, f.icon, f.x, f.y - 6, { font: '14px monospace', align: 'center' });
    }

    // 7. Curral 4: Animais
    ctx.fillStyle = '#451a03';
    ctx.fillRect(750, 360, 160, 40);
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(750, 360, 160, 40);
    drawText(ctx, '🐾 CURRAL DOS ANIMAIS', 830, 345, { font: 'bold 9px monospace', color: '#fde047', align: 'center' });
    for (const a of this.animals) {
      drawText(ctx, a.icon, a.x, a.y - 8, { font: '18px monospace', align: 'center' });
      if (a.isLeashed) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
      }
    }

    // Herói Coisinha
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    if (this.carriedItem) {
      drawText(ctx, `${this.carriedItem.icon} Carregando: ${this.carriedItem.name}`, this.player.x, this.player.y - 32, {
        font: 'bold 10px monospace',
        color: '#facc15',
        align: 'center'
      });
    }

    // HUD Superior
    drawText(ctx, '🦉 FASE 3: A VILA DA MEIA-NOITE & O ENIGMA DAS 5 CASAS', 480, 18, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 515, {
      font: '11px monospace',
      align: 'center',
      color: '#fde047'
    });

    // Modais e Diálogos
    this.dialogs.render(ctx, 960, 540);
    this.narrative.render(ctx, 960, 540);
  }

  public destroy(): void {}
}
