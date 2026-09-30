import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText, drawUnifiedToast } from '../../renderer/shapes';
import {
  drawCoisinha,
  drawBode,
  drawChupaCabra,
  drawFazendeiro,
  drawMoita,
  drawMoitaFrutaRegional,
  drawMoitaCactoEspinhos,
  drawChaoTerraBatida
} from '../../renderer/xilogravura';
import { DialogSystem } from '../dialogs';
import { NarrativeModalManager } from '../narrative';

export type BushType = 'normal' | 'corda' | 'candeeiro' | 'bode' | 'cacto' | 'fruta';

interface Bush {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: BushType;
  isSearched: boolean;
  hidingGoatId?: string;
}

interface Goat extends Entity {
  hp: number;
  maxHp: number;
  isRescued: boolean;
  isLeashed: boolean;
  hiddenInBushId?: string;
  targetBushId?: string;
  wanderTimer: number;
  fleeTimer: number;
}

export class Stage1ChupaCabraScene implements IScene {
  public id: SceneId = 'STAGE_1_CHUPACABRA';
  public name = 'Fase 1: O Ataque do Chupa-Cabra';

  // Mapa Expandido
  private mapWidth = 2400;
  private mapHeight = 1350;

  // Câmera Suave
  private camera = { x: 0, y: 0 };

  // Vida do Herói (3 Pontos)
  private heroHp: number = 3;
  private maxHeroHp: number = 3;
  private hurtCooldown: number = 0;

  private player: Entity = {
    id: 'hero',
    x: 1200,
    y: 780,
    width: 36,
    height: 50,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 240
  };

  private curral: Entity = {
    id: 'curral',
    x: 1200,
    y: 675,
    width: 240,
    height: 180,
    color: '#713f12',
    label: '[CURRAL]',
    shape: 'rect'
  };

  private fazendeiro: Entity = {
    id: 'fazendeiro',
    x: 1200,
    y: 620,
    width: 36,
    height: 50,
    color: '#15803d',
    label: '[FAZENDEIRO]',
    shape: 'rect'
  };

  private chupaCabra: Entity = {
    id: 'chupa',
    x: 350,
    y: 350,
    width: 44,
    height: 44,
    color: '#dc2626',
    label: '[CHUPA-CABRA]',
    shape: 'triangle',
    speed: 135,
    active: true
  };

  private chupaFleeTimer: number = 0;

  private bushes: Bush[] = [];
  private goats: Goat[] = [];
  private hasRope: boolean = false;
  private hasLantern: boolean = false;

  private isAboioActive: boolean = false;
  private isGritoActive: boolean = false;
  private soundWaveRadius: number = 0;
  private message: string = 'Fale com o Fazendeiro [E], vasculhe as moitas e salve os 4 bodes!';

  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';

  private stepTimer: number = 0;
  private rosnadoTimer: number = 0;
  private actionSoundTriggered: boolean = false;
  private lastActionWasGrito: boolean = false;
  private animTime: number = 0;
  private facing: 'left' | 'right' | 'up' | 'down' = 'down';
  private isMoving: boolean = false;

  // Sistemas Globais de Diálogo e Narrativa
  private dialogs: DialogSystem = new DialogSystem();
  private narrative: NarrativeModalManager = new NarrativeModalManager();

  public init(_engine: IGameEngine): void {
    this.player.x = 1200;
    this.player.y = 780;
    this.heroHp = 3;
    this.hurtCooldown = 0;
    this.hasRope = false;
    this.hasLantern = false;
    this.isAboioActive = false;
    this.isGritoActive = false;
    this.soundWaveRadius = 0;
    this.chupaFleeTimer = 0;
    this.stateStatus = 'PLAYING';
    this.stepTimer = 0;
    this.rosnadoTimer = 0;
    this.actionSoundTriggered = false;
    this.lastActionWasGrito = false;
    this.animTime = 0;

    // 16 Moitas espalhadas pelo mapa amplo
    this.bushes = [
      { id: 'b1', x: 600, y: 400, radius: 46, type: 'corda', isSearched: false, hidingGoatId: 'goat_1' },
      { id: 'b2', x: 1800, y: 400, radius: 46, type: 'candeeiro', isSearched: false, hidingGoatId: 'goat_2' },
      { id: 'b3', x: 500, y: 1000, radius: 48, type: 'bode', isSearched: false, hidingGoatId: 'goat_3' },
      { id: 'b4', x: 1900, y: 1000, radius: 48, type: 'bode', isSearched: false, hidingGoatId: 'goat_4' },
      // Moitas de Cacto (Dano + Grito)
      { id: 'b_c1', x: 850, y: 350, radius: 44, type: 'cacto', isSearched: false },
      { id: 'b_c2', x: 1550, y: 350, radius: 44, type: 'cacto', isSearched: false },
      { id: 'b_c3', x: 800, y: 1100, radius: 44, type: 'cacto', isSearched: false },
      { id: 'b_c4', x: 1600, y: 1100, radius: 44, type: 'cacto', isSearched: false },
      // Moitas de Frutas Regionais (Cura +1 HP)
      { id: 'b_f1', x: 1200, y: 300, radius: 44, type: 'fruta', isSearched: false },
      { id: 'b_f2', x: 1200, y: 1150, radius: 44, type: 'fruta', isSearched: false },
      { id: 'b_f3', x: 350, y: 700, radius: 44, type: 'fruta', isSearched: false },
      { id: 'b_f4', x: 2050, y: 700, radius: 44, type: 'fruta', isSearched: false },
      // Moitas Comuns
      { id: 'b5', x: 950, y: 550, radius: 42, type: 'normal', isSearched: false },
      { id: 'b6', x: 1450, y: 550, radius: 42, type: 'normal', isSearched: false },
      { id: 'b7', x: 300, y: 350, radius: 42, type: 'normal', isSearched: false },
      { id: 'b8', x: 2100, y: 350, radius: 42, type: 'normal', isSearched: false }
    ];

    // 4 Bodes
    this.goats = [
      {
        id: 'goat_1',
        x: 600,
        y: 400,
        width: 36,
        height: 32,
        color: '#f8fafc',
        label: '[BODE 1]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b1',
        wanderTimer: 1.0,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_2',
        x: 1800,
        y: 400,
        width: 36,
        height: 32,
        color: '#f8fafc',
        label: '[BODE 2]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b2',
        wanderTimer: 1.5,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_3',
        x: 500,
        y: 1000,
        width: 36,
        height: 32,
        color: '#f8fafc',
        label: '[BODE 3]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b3',
        wanderTimer: 2.0,
        fleeTimer: 0,
        speed: 90
      },
      {
        id: 'goat_4',
        x: 1900,
        y: 1000,
        width: 36,
        height: 32,
        color: '#f8fafc',
        label: '[BODE 4]',
        shape: 'circle',
        hp: 100,
        maxHp: 100,
        isRescued: false,
        isLeashed: false,
        hiddenInBushId: 'b4',
        wanderTimer: 0.5,
        fleeTimer: 0,
        speed: 90
      }
    ];

    // Tela de Apresentação de Fase (Folheto de Cordel)
    this.narrative.showIntro({
      phaseNumber: 1,
      title: 'O Ataque do Chupa-Cabra',
      subtitle: 'Pastoreio, coragem e o mistério na Caatinga',
      verses: [
        'Na noite fria da caatinga o bicho feio atacou,',
        'Os quatro bodes do curral com pavor afugentou;',
        'Procure a corda nas moitas, com sabedoria e vigor,',
        'Traga os bodes de volta antes do golpe do traidor!'
      ],
      objective: 'Resgate os 4 bodes no curral central e espante o Chupa-Cabra com o grito!',
      itemReward: {
        id: 'carimbo',
        name: 'Carimbo Mágico',
        icon: '🪓'
      }
    });
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    this.animTime += dt;
    if (this.hurtCooldown > 0) this.hurtCooldown -= dt;

    // Atualiza Diálogos e Modais Narrativos
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

    // 1. Movimento do Jogador
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
        engine.juice.particles.emit('dust', this.player.x, this.player.y + 20, { count: 3, speed: 30 });
      }
    }

    const speed = this.player.speed || 240;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(this.mapWidth - 30, this.player.x));
    this.player.y = Math.max(30, Math.min(this.mapHeight - 30, this.player.y));

    // Câmera Suave com Lerp
    const targetCamX = Math.max(0, Math.min(this.mapWidth - 960, this.player.x - 480));
    const targetCamY = Math.max(0, Math.min(this.mapHeight - 540, this.player.y - 270));
    this.camera.x += (targetCamX - this.camera.x) * 6 * dt;
    this.camera.y += (targetCamY - this.camera.y) * 6 * dt;

    // 2. Ação Universal: Grito (Espaço) / Aboio
    if (input.action) {
      if (input.actionHeldTime > 0.35) {
        this.isGritoActive = true;
        this.isAboioActive = false;
        this.soundWaveRadius = Math.min(380, this.soundWaveRadius + 540 * dt);
        if (!this.lastActionWasGrito) {
          this.lastActionWasGrito = true;
          engine.sound.playGrito();
          engine.juice.shake.addTrauma(0.45);
          engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 12, speed: 75 });
          this.triggerSoundWave(this.soundWaveRadius, true, engine);
        }
      } else {
        this.isAboioActive = true;
        this.isGritoActive = false;
        this.soundWaveRadius = Math.min(160, this.soundWaveRadius + 320 * dt);
        if (!this.actionSoundTriggered) {
          this.actionSoundTriggered = true;
          engine.sound.playAboio(1.2);
          engine.juice.particles.emit('note', this.player.x, this.player.y - 20, { count: 2, speed: 20 });
          this.triggerSoundWave(this.soundWaveRadius, false, engine);
        }
      }
    } else {
      this.isAboioActive = false;
      this.isGritoActive = false;
      this.soundWaveRadius = 0;
      this.actionSoundTriggered = false;
      this.lastActionWasGrito = false;
    }

    // 3. Interação com o Fazendeiro [E no release / interactReleased] (Diálogo Canônico de Censura)
    const distToFazendeiro = Math.hypot(this.player.x - this.fazendeiro.x, this.player.y - this.fazendeiro.y);
    if (distToFazendeiro < 140 && input.interactReleased) {
      const rescuedCount = this.goats.filter((g) => g.isRescued).length;
      this.dialogs.startDialog(
        'fazendeiro',
        'Fazendeiro Zé do Bode',
        '👨🌾',
        [
          {
            speaker: 'Fazendeiro',
            avatarIcon: '👨🌾',
            text: `Então, Coisinha! Meus 4 bodes fugiram pelo pasto. Você já salvou ${rescuedCount} de 4!`
          },
          {
            speaker: 'Fazendeiro',
            avatarIcon: '👨🌾',
            text: 'O aboio faz o bode andar de leve. O grito faz o bode correr para se esconder na moita e AFUGENTA o Chupa-Cabra por 3 segundos!'
          }
        ],
        undefined,
        engine
      );
      return;
    }

    // 4. Interação com Moitas, Cactos e Frutas
    for (const bush of this.bushes) {
      const distHeroBush = Math.hypot(this.player.x - bush.x, this.player.y - bush.y);

      // Colisão física com cactos causa dano involuntário
      if (bush.type === 'cacto' && distHeroBush < bush.radius + 14 && this.hurtCooldown <= 0) {
        this.hurtCooldown = 1.2;
        this.heroHp = Math.max(1, this.heroHp - 1);
        engine.sound.playHurtCacto();
        engine.sound.playGrito();
        engine.juice.shake.addTrauma(0.5);
        engine.juice.particles.emit('dust', this.player.x, this.player.y, { count: 14, speed: 80 });
        this.message = '🌵 AI! ESPINHO DE MANDACARU! Você perdeu 1 HP e soltou um grito de dor!';

        // Grito involuntário afugenta o Chupa-Cabra e espanta bodes para outras moitas
        this.triggerSoundWave(320, true, engine);
      }

      if (distHeroBush < bush.radius + 35 && input.interactReleased) {
        if (!bush.isSearched) {
          bush.isSearched = true;

          if (bush.type === 'corda' && !this.hasRope) {
            this.hasRope = true;
            this.message = '🪢 CORDA ENCONTRADA! Agora você laça os bodes ao se aproximar!';
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', bush.x, bush.y, { count: 10, speed: 50 });
          } else if (bush.type === 'candeeiro' && !this.hasLantern) {
            this.hasLantern = true;
            this.message = '🏮 CANDEEIRO ENCONTRADO! Iluminação expandida na caatinga!';
            engine.sound.playPickup();
            engine.juice.particles.emit('sparkle', bush.x, bush.y, { count: 10, speed: 50 });
          } else if (bush.type === 'fruta') {
            if (this.heroHp < this.maxHeroHp) {
              this.heroHp = Math.min(this.maxHeroHp, this.heroHp + 1);
              this.message = '🍎 FRUTA SABOROSA DE UMBU! Você recuperou +1 HP!';
            } else {
              this.message = '🍎 Fruta deliciosa da caatinga!';
            }
            engine.sound.playFruitEat();
            engine.juice.particles.emit('sparkle', bush.x, bush.y, { count: 12, speed: 45 });
          } else if (bush.type === 'cacto') {
            this.heroHp = Math.max(1, this.heroHp - 1);
            engine.sound.playHurtCacto();
            engine.sound.playGrito();
            engine.juice.shake.addTrauma(0.5);
            this.triggerSoundWave(320, true, engine);
          } else {
            engine.juice.particles.emit('leaf', bush.x, bush.y, { count: 8, speed: 40 });
          }
        }

        // Se tiver bode escondido, faz sair
        if (bush.hidingGoatId) {
          const goat = this.goats.find((g) => g.id === bush.hidingGoatId);
          if (goat && goat.hiddenInBushId) {
            goat.hiddenInBushId = undefined;
            goat.targetBushId = undefined;
            goat.x = bush.x + 25;
            goat.y = bush.y + 25;
            bush.hidingGoatId = undefined;
            this.message = '🐐 Você descobriu um bode escondido na moita!';
            engine.sound.playBerroBode(false);
            engine.sound.playItemDescobrir();
            engine.juice.particles.emit('leaf', bush.x, bush.y, { count: 6, speed: 35 });
          }
        }
      }
    }

    // 5. IA do Chupa-Cabra (Comportamento de Fuga de 3s vs Caça)
    let isAttackingGoat = false;
    if (this.chupaCabra.active) {
      if (this.chupaFleeTimer > 0) {
        // Estado de Pânico e Fuga por 3s provocado pelo Grito
        this.chupaFleeTimer -= dt;
        const fleeAngle = Math.atan2(this.chupaCabra.y - this.player.y, this.chupaCabra.x - this.player.x);
        this.chupaCabra.x += Math.cos(fleeAngle) * 290 * dt;
        this.chupaCabra.y += Math.sin(fleeAngle) * 290 * dt;
      } else {
        // Estado Normal: Caça os bodes indefesos visíveis
        let targetGoat: Goat | null = null;
        let minDist = 9999;

        for (const g of this.goats) {
          if (!g.isRescued && !g.hiddenInBushId) {
            const d = Math.hypot(g.x - this.chupaCabra.x, g.y - this.chupaCabra.y);
            if (d < minDist) {
              minDist = d;
              targetGoat = g;
            }
          }
        }

        if (targetGoat) {
          const angle = Math.atan2(targetGoat.y - this.chupaCabra.y, targetGoat.x - this.chupaCabra.x);
          this.chupaCabra.x += Math.cos(angle) * 140 * dt;
          this.chupaCabra.y += Math.sin(angle) * 140 * dt;

          if (minDist < 32) {
            isAttackingGoat = true;
            targetGoat.hp -= 25 * dt;
            this.message = `🩸 O CHUPA-CABRA ESTÁ ATACANDO O ${targetGoat.label}! GRITE [ESPAÇO] PARA AFUGENTAR!`;

            this.rosnadoTimer += dt;
            if (this.rosnadoTimer >= 0.7) {
              this.rosnadoTimer = 0;
              engine.sound.playChupaCabraRosnado();
              engine.sound.playBerroPavorBode();
              engine.juice.shake.addTrauma(0.35);

              // Berro de pavor faz bodes próximos fugirem para outras moitas
              for (const otherGoat of this.goats) {
                if (otherGoat.id !== targetGoat.id && !otherGoat.isRescued && !otherGoat.hiddenInBushId) {
                  const distBetweenGoats = Math.hypot(otherGoat.x - targetGoat.x, otherGoat.y - targetGoat.y);
                  if (distBetweenGoats < 340) {
                    otherGoat.fleeTimer = 3.0;
                    // Procura moita para se esconder
                    let bestBush: Bush | null = null;
                    let bestD = 9999;
                    for (const b of this.bushes) {
                      if (!b.hidingGoatId && b.type !== 'cacto') {
                        const d = Math.hypot(b.x - otherGoat.x, b.y - otherGoat.y);
                        if (d < bestD) {
                          bestD = d;
                          bestBush = b;
                        }
                      }
                    }
                    if (bestBush) {
                      otherGoat.targetBushId = bestBush.id;
                    }
                  }
                }
              }
            }

            if (targetGoat.hp <= 0) {
              targetGoat.hp = 0;
              this.stateStatus = 'FAILED';
              this.message = '💀 UM BODE MORREU! Missão Falhou. Retornando ao Estúdio...';
              engine.sound.playDefeatJingle();
              setTimeout(() => engine.switchScene('STUDIO'), 2500);
              return;
            }
          }
        }
      }

      this.chupaCabra.x = Math.max(40, Math.min(this.mapWidth - 40, this.chupaCabra.x));
      this.chupaCabra.y = Math.max(40, Math.min(this.mapHeight - 40, this.chupaCabra.y));
    }

    engine.sound.setBGMState({ tension: isAttackingGoat ? 0.9 : this.chupaFleeTimer > 0 ? 0.1 : 0.3 });

    // 6. Condução e Comportamento dos Bodes (Aboio vs Grito & Esconder-se em Moitas)
    let leashedIdx = 1;
    for (const g of this.goats) {
      if (g.isRescued || g.hiddenInBushId) continue;

      const distToHero = Math.hypot(this.player.x - g.x, this.player.y - g.y);

      // Entrou no Curral Central -> Resgatado!
      if (
        Math.abs(g.x - this.curral.x) < this.curral.width / 2 - 15 &&
        Math.abs(g.y - this.curral.y) < this.curral.height / 2 - 15
      ) {
        g.isRescued = true;
        g.isLeashed = false;
        g.targetBushId = undefined;
        engine.sound.playPickup();
        engine.juice.particles.emit('sparkle', g.x, g.y, { count: 8, speed: 45 });
        continue;
      }

      // Laçar com a corda
      if (this.hasRope && distToHero < 75) {
        if (!g.isLeashed) {
          engine.sound.playBerroBode(false);
          engine.juice.particles.emit('dust', g.x, g.y, { count: 4, speed: 20 });
        }
        g.isLeashed = true;
        g.targetBushId = undefined;
      }

      if (g.isLeashed) {
        const followDist = leashedIdx * 34;
        leashedIdx++;

        const targetX = this.player.x - dx * followDist;
        const targetY = this.player.y - dy * followDist;
        const angle = Math.atan2(targetY - g.y, targetX - g.x);
        const dist = Math.hypot(targetX - g.x, targetY - g.y);

        if (dist > 22) {
          g.x += Math.cos(angle) * 200 * dt;
          g.y += Math.sin(angle) * 200 * dt;
        }
      } else {
        // Não está laçado
        if (g.fleeTimer > 0) {
          // Pânico pelo Grito: corre rápido em busca de uma moita para se esconder
          g.fleeTimer -= dt;

          let targetBush: Bush | undefined;
          if (g.targetBushId) {
            targetBush = this.bushes.find((b) => b.id === g.targetBushId && !b.hidingGoatId && b.type !== 'cacto');
          }

          if (targetBush) {
            const angle = Math.atan2(targetBush.y - g.y, targetBush.x - g.x);
            g.x += Math.cos(angle) * 230 * dt;
            g.y += Math.sin(angle) * 230 * dt;

            // Se entrou na moita, esconde-se dentro dela!
            if (Math.hypot(g.x - targetBush.x, g.y - targetBush.y) < targetBush.radius * 0.8) {
              g.hiddenInBushId = targetBush.id;
              targetBush.hidingGoatId = g.id;
              g.targetBushId = undefined;
              g.fleeTimer = 0;
              engine.juice.particles.emit('leaf', targetBush.x, targetBush.y, { count: 6, speed: 30 });
            }
          } else {
            // Se não encontrou moita, corre para longe do herói
            const panicAngle = Math.atan2(g.y - this.player.y, g.x - this.player.x);
            g.x += Math.cos(panicAngle) * 210 * dt;
            g.y += Math.sin(panicAngle) * 210 * dt;
          }
        } else {
          // Movimento calmo / empurrão leve de Aboio
          g.wanderTimer -= dt;
          if (g.wanderTimer <= 0) {
            g.wanderTimer = 1.0 + Math.random() * 2.0;
            g.vx = (Math.random() - 0.5) * 60;
            g.vy = (Math.random() - 0.5) * 60;
          }
          g.x += (g.vx || 0) * dt;
          g.y += (g.vy || 0) * dt;
        }
      }

      g.x = Math.max(40, Math.min(this.mapWidth - 40, g.x));
      g.y = Math.max(40, Math.min(this.mapHeight - 40, g.y));
    }

    // 7. Condição de Vitória (4 bodes resgatados no curral)
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    if (rescuedCount === 4 && this.stateStatus === 'PLAYING') {
      this.stateStatus = 'SUCCESS';
      engine.unlockItem('carimbo');
      engine.sound.playVictoryJingle();

      this.narrative.showOutro(
        {
          phaseNumber: 1,
          title: 'O Ataque do Chupa-Cabra',
          verses: [
            'Com laço firme e grito de vaqueiro destemido,',
            'O rebanho sagrado foi salvo e protegido;',
            'O Fazendeiro grato lhe entrega a matriz entalhada:',
            'O Carimbo Mágico da lenda consagrada!'
          ],
          itemReward: {
            id: 'carimbo',
            name: 'Carimbo Mágico',
            icon: '🪓'
          }
        },
        () => {
          engine.switchScene('STUDIO');
        }
      );
    }
  }

  private triggerSoundWave(radius: number, isGrito: boolean, engine: IGameEngine): void {
    if (isGrito) {
      // 1. Grito AFUGENTA o Chupa-Cabra por 3 segundos!
      const distToChupa = Math.hypot(this.player.x - this.chupaCabra.x, this.player.y - this.chupaCabra.y);
      if (distToChupa < radius + 90) {
        this.chupaFleeTimer = 3.0;
        this.message = '🦇 O CHUPA-CABRA FOI AFUGENTADO PELO GRITO! (Fuga de 3s)';
        engine.sound.playChupaCabraRosnado();
        engine.juice.particles.emit('dust', this.chupaCabra.x, this.chupaCabra.y, { count: 10, speed: 60 });
      }

      // 2. Grito faz os Bodes correrem em pânico e procurarem outra moita para se esconder!
      for (const goat of this.goats) {
        if (goat.isRescued || goat.isLeashed) continue;

        const distToGoat = Math.hypot(this.player.x - goat.x, this.player.y - goat.y);
        if (distToGoat < radius + 60) {
          // Se estava escondido em uma moita, sai assustado
          if (goat.hiddenInBushId) {
            const oldBush = this.bushes.find((b) => b.id === goat.hiddenInBushId);
            if (oldBush) oldBush.hidingGoatId = undefined;
            goat.hiddenInBushId = undefined;
          }

          goat.fleeTimer = 3.5;
          engine.sound.playBerroPavorBode();

          // Encontra ativamente a moita mais próxima livre (não cacto) para se esconder
          let bestBush: Bush | null = null;
          let bestD = 9999;
          for (const b of this.bushes) {
            if (!b.hidingGoatId && b.type !== 'cacto') {
              const d = Math.hypot(b.x - goat.x, b.y - goat.y);
              if (d > 30 && d < bestD) {
                bestD = d;
                bestBush = b;
              }
            }
          }
          if (bestBush) {
            goat.targetBushId = bestBush.id;
          }
        }
      }
    } else {
      // Aboio: NÃO afeta o Chupa-Cabra. Faz bodes andarem um pouco (deslocamento leve).
      for (const goat of this.goats) {
        if (goat.isRescued || goat.isLeashed) continue;

        const distToGoat = Math.hypot(this.player.x - goat.x, this.player.y - goat.y);
        if (distToGoat < radius + 45) {
          // Se estava na moita, sai calmamente
          if (goat.hiddenInBushId) {
            const oldBush = this.bushes.find((b) => b.id === goat.hiddenInBushId);
            if (oldBush) oldBush.hidingGoatId = undefined;
            goat.hiddenInBushId = undefined;
            goat.x = (oldBush ? oldBush.x : goat.x) + 20;
            goat.y = (oldBush ? oldBush.y : goat.y) + 20;
          }

          // Deslocamento leve na direção oposta ao herói
          const pushAngle = Math.atan2(goat.y - this.player.y, goat.x - this.player.x);
          goat.vx = Math.cos(pushAngle) * 85;
          goat.vy = Math.sin(pushAngle) * 85;
          goat.wanderTimer = 1.2;
          engine.sound.playBerroBode(false);
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Piso de Terra Batida da Caatinga
    drawChaoTerraBatida(ctx, 0, 0, this.mapWidth, this.mapHeight);

    // Iluminação do Candeeiro
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

    // Curral Central
    ctx.fillStyle = '#451a03';
    ctx.fillRect(
      this.curral.x - this.curral.width / 2,
      this.curral.y - this.curral.height / 2,
      this.curral.width,
      this.curral.height
    );
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 4;
    ctx.strokeRect(
      this.curral.x - this.curral.width / 2,
      this.curral.y - this.curral.height / 2,
      this.curral.width,
      this.curral.height
    );
    drawText(ctx, '[CURRAL CENTRAL]', this.curral.x, this.curral.y - 10, {
      font: 'bold 12px monospace',
      color: '#facc15',
      align: 'center'
    });

    // Fazendeiro
    drawFazendeiro(ctx, this.fazendeiro.x, this.fazendeiro.y, this.fazendeiro.width, this.fazendeiro.height);

    // Moitas Homogêneas (Visualmente Idênticas até serem vasculhadas)
    for (const bush of this.bushes) {
      if (bush.isSearched) {
        if (bush.type === 'cacto') {
          drawMoitaCactoEspinhos(ctx, bush.x, bush.y, bush.radius);
        } else if (bush.type === 'fruta') {
          drawMoitaFrutaRegional(ctx, bush.x, bush.y, bush.radius, { searched: true });
        } else {
          drawMoita(ctx, bush.x, bush.y, bush.radius, {
            hasItem: false,
            searched: true
          });
        }
      } else {
        // Moita clássica uniforme e misteriosa da xilogravura
        drawMoita(ctx, bush.x, bush.y, bush.radius, {
          hasItem: false,
          searched: false
        });
      }
    }

    // Bodes
    for (const g of this.goats) {
      if (g.hiddenInBushId) continue;

      drawBode(ctx, g.x, g.y, g.width, g.height, {
        isMoving: !g.isRescued,
        time: this.animTime
      });

      // Barra de HP
      const barW = 36;
      const barH = 5;
      const hpRatio = g.hp / g.maxHp;
      const hpColor = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#eab308' : '#ef4444';

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(g.x - barW / 2, g.y - 24, barW, barH);
      ctx.fillStyle = hpColor;
      ctx.fillRect(g.x - barW / 2, g.y - 24, barW * hpRatio, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(g.x - barW / 2, g.y - 24, barW, barH);

      if (g.isRescued) {
        drawText(ctx, '✓ Salvo', g.x, g.y + 18, { font: 'bold 10px monospace', color: '#4ade80', align: 'center' });
      } else if (g.isLeashed) {
        drawText(ctx, '🪢 Preso', g.x, g.y + 18, { font: 'bold 10px monospace', color: '#facc15', align: 'center' });
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        ctx.lineTo(g.x, g.y);
        ctx.stroke();
      }
    }

    // Chupa-Cabra
    if (this.chupaCabra.active) {
      drawChupaCabra(ctx, this.chupaCabra.x, this.chupaCabra.y, this.chupaCabra.width, this.chupaCabra.height, {
        time: this.animTime
      });

      if (this.chupaFleeTimer > 0) {
        drawText(ctx, `💨 FUGINDO! (${this.chupaFleeTimer.toFixed(1)}s)`, this.chupaCabra.x, this.chupaCabra.y - 28, {
          font: 'bold 10px monospace',
          color: '#38bdf8',
          align: 'center'
        });
      }
    }

    // Onda Sonora de Grito / Aboio
    if ((this.isAboioActive || this.isGritoActive) && this.soundWaveRadius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.soundWaveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = this.isGritoActive ? 'rgba(239, 68, 68, 0.9)' : 'rgba(250, 204, 21, 0.8)';
      ctx.lineWidth = this.isGritoActive ? 5 : 3;
      ctx.stroke();

      ctx.fillStyle = this.isGritoActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(250, 204, 21, 0.15)';
      ctx.fill();

      drawText(ctx, this.isGritoActive ? '📢 ÊÊÊ-BOOOI! (GRITO FORTE)' : '📣 ABOIO', this.player.x, this.player.y - 36, {
        font: 'bold 12px monospace',
        color: this.isGritoActive ? '#fca5a5' : '#fde047',
        align: 'center'
      });
      ctx.restore();
    }

    // Herói Coisinha
    drawCoisinha(ctx, this.player.x, this.player.y, this.player.width, this.player.height, {
      facing: this.facing,
      isMoving: this.isMoving,
      time: this.animTime
    });

    ctx.restore(); // Restaura Câmera para renderizar HUD estático

    // HUD Superior
    const rescuedCount = this.goats.filter((g) => g.isRescued).length;
    drawText(ctx, `🐐 FASE 1: O ATAQUE DO CHUPA-CABRA | Bodes Salvos: ${rescuedCount} / 4`, 480, 18, {
      font: 'bold 15px monospace',
      align: 'center',
      color: '#f7d070'
    });

    // Indicador de Vida do Herói (3 Corações / Pontos)
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

    // Toast Unificado
    drawUnifiedToast(ctx, this.message, 960, 540, {
      isError: this.stateStatus === 'FAILED',
      isSuccess: this.stateStatus === 'SUCCESS'
    });

    // Diálogos & Modais Narrativos por Cima
    this.dialogs.render(ctx, 960, 540);
    this.narrative.render(ctx, 960, 540);
  }

  public destroy(): void {}
}
