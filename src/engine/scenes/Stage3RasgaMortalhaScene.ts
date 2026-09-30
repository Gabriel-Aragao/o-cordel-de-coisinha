import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { renderEntity, drawText } from '../../renderer/shapes';

interface House extends Entity {
  index: number;
  corName: string;
  morador: string;
  bebida: string;
  fumo: string;
  animal: string;
  hasPena: boolean;
}

interface CordelStanza {
  title: string;
  lines: string[];
}

export class Stage3RasgaMortalhaScene implements IScene {
  public id: SceneId = 'STAGE_3_RASGAMORTALHA';
  public name = 'Fase 3: A Pena da Rasga-Mortalha';

  private player: Entity = {
    id: 'hero',
    x: 80,
    y: 430,
    width: 30,
    height: 30,
    color: '#3b82f6',
    label: '[HEROI]',
    shape: 'rect',
    speed: 220
  };

  private owl: Entity = {
    id: 'owl',
    x: 100,
    y: 70,
    width: 36,
    height: 24,
    color: '#a855f7',
    label: '[RASGA-MORTALHA]',
    shape: 'triangle',
    speed: 140
  };

  private returnPortal: Entity = {
    id: 'portal',
    x: 50,
    y: 490,
    width: 80,
    height: 32,
    color: '#475569',
    label: '[ESTÚDIO]',
    shape: 'rect'
  };

  private houses: House[] = [
    {
      id: 'house_1',
      index: 1,
      x: 140,
      y: 220,
      width: 120,
      height: 120,
      color: '#eab308',
      corName: 'Amarela',
      morador: 'Sanfoneiro',
      bebida: 'Água de Pote',
      fumo: 'Cachimbo de Barro',
      animal: 'Galo de Campina',
      label: '[CASA 1 - AMARELA]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_2',
      index: 2,
      x: 300,
      y: 220,
      width: 120,
      height: 120,
      color: '#2563eb',
      corName: 'Azul',
      morador: 'Vaqueiro',
      bebida: 'Aluá de Milho',
      fumo: 'Rapé de Imburana',
      animal: 'Cavalo',
      label: '[CASA 2 - AZUL]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_3',
      index: 3,
      x: 460,
      y: 220,
      width: 120,
      height: 120,
      color: '#dc2626',
      corName: 'Vermelha',
      morador: 'Rezadeira',
      bebida: 'Café c/ Rapadura',
      fumo: 'Fumo de Palha',
      animal: 'Bode',
      label: '[CASA 3 - VERMELHA]',
      shape: 'rect',
      hasPena: false
    },
    {
      id: 'house_4',
      index: 4,
      x: 620,
      y: 220,
      width: 120,
      height: 120,
      color: '#16a34a',
      corName: 'Verde',
      morador: 'Ferrador',
      bebida: 'Cachaça',
      fumo: 'Fumo de Rolo',
      animal: 'TATU 🏆',
      label: '[CASA 4 - VERDE]',
      shape: 'rect',
      hasPena: true
    },
    {
      id: 'house_5',
      index: 5,
      x: 780,
      y: 220,
      width: 120,
      height: 120,
      color: '#f8fafc',
      corName: 'Branca',
      morador: 'Xilógrafo',
      bebida: 'Garapa',
      fumo: 'Cachimbo de Angico',
      animal: 'Jumento',
      label: '[CASA 5 - BRANCA]',
      shape: 'rect',
      hasPena: false
    }
  ];

  private stanzas: CordelStanza[] = [
    {
      title: 'Estrofe I — A Vila da Meia-Noite',
      lines: [
        'Na vila da meia-noite, onde a coruja piava,',
        'Cinco casas em fileira o luar iluminava:',
        'Cada qual com sua cor, seu dono e o que criava.'
      ]
    },
    {
      title: 'Estrofe II — O Sanfoneiro e a Casa Azul',
      lines: [
        'Ouvindo o som do folfole, logo na primeira casa',
        'Mora o velho Sanfoneiro que a tristeza ali atrasa;',
        'E vizinho a sua porta a casa Azul se asasa.'
      ]
    },
    {
      title: 'Estrofe III — A Rezadeira e o Café no Meio',
      lines: [
        'A beata Rezadeira habita a casa Vermelha,',
        'Com devoção e preceito, acendendo sua centelha;',
        'E bebe Café amargo quem mora bem lá no meio.'
      ]
    },
    {
      title: 'Estrofe IV — A Casa Verde e a Cachaça',
      lines: [
        'A casa de cor de relva, toda Verde e caiada,',
        'Fica à esquerda da Branca, na mesma beira de estrada;',
        'E o dono da casa Verde bebe Cachaça aprumada.'
      ]
    },
    {
      title: 'Estrofe V — A Amarela e o Aluá do Vaqueiro',
      lines: [
        'O dono da Amarela pita Cachimbo de Barro;',
        'O Vaqueiro bebe Aluá sem pressa e sem esparro;',
        'Na caatinga ele não cansa, nem no sol nem no pigarro.'
      ]
    },
    {
      title: 'Estrofe VI — O Bode e o Cavalo Vizinho',
      lines: [
        'Quem pita Fumo de Palha tem um Bode no cercado;',
        'O dono do bom Cavalo mora colado, ao lado',
        'De quem no Cachimbo pisa o barro bem queimado.'
      ]
    },
    {
      title: 'Estrofe VII — O Ferrador e o Fumo de Rolo',
      lines: [
        'Quem no Cachimbo de Angico bebe Garapa bem doce,',
        'Pra ter força no trabalho como se o mundo fosse;',
        'E o Ferrador de renome pita Fumo de Rolo lento.'
      ]
    },
    {
      title: 'Estrofe VIII — O Xilógrafo e a Água de Pote',
      lines: [
        'O Xilógrafo famoso cria um Jumento ensinado;',
        'Quem aspira o pó do Rapé mora bem encostado',
        'Naquele que bebe Água do fundo do Pote areado.'
      ]
    },
    {
      title: 'Estrofe IX — O Galo e a Pergunta Final',
      lines: [
        'O homem do bom Rapé fica vizinho ao cantador',
        'Que cria Galo de Campina com carinho e com amor...',
        'Diga agora, forasteiro: Quem do TATU é o senhor? ➔ A PENA ESTÁ AQUI!'
      ]
    }
  ];

  private currentStanza: number = 0;
  private selectedHouse: House | null = null;
  private message: string = 'Leia as sextilhas de cordel com [Espaço] e aperte [E / Enter] na casa certa!';
  private victoryTriggered: boolean = false;
  private owlDirection: number = 1;

  public init(engine: IGameEngine): void {
    this.player.x = 80;
    this.player.y = 430;
    this.currentStanza = 0;
    this.selectedHouse = null;
    this.victoryTriggered = engine.inventory.pena;

    if (this.victoryTriggered) {
      this.message = '✓ Enigma Resolvido! A 🪶 Pena Encantada foi recolhida na Casa 4 (Verde / Ferrador).';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    // 1. Movimento do Jogador
    let dx = 0;
    let dy = 0;

    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    const speed = this.player.speed || 220;
    this.player.x += dx * speed * dt;
    this.player.y += dy * speed * dt;

    this.player.x = Math.max(30, Math.min(930, this.player.x));
    this.player.y = Math.max(300, Math.min(500, this.player.y));

    // 2. Voo da Rasga-Mortalha no céu
    this.owl.x += this.owlDirection * (this.owl.speed || 140) * dt;
    if (this.owl.x > 880) {
      this.owlDirection = -1;
    } else if (this.owl.x < 80) {
      this.owlDirection = 1;
    }

    // 3. Alternar Estrofes de Cordel (Espaço)
    if (input.action) {
      this.currentStanza = (this.currentStanza + 1) % this.stanzas.length;
    }

    // 4. Identifica a Casa mais próxima
    let nearest: House | null = null;
    for (const h of this.houses) {
      if (Math.hypot(this.player.x - h.x, this.player.y - (h.y + 60)) < 75) {
        nearest = h;
        break;
      }
    }
    this.selectedHouse = nearest;

    // 5. Investigar Casa (E / Enter)
    if (input.interact && this.selectedHouse) {
      if (this.selectedHouse.hasPena) {
        if (!this.victoryTriggered) {
          this.victoryTriggered = true;
          engine.unlockItem('pena');
          this.message = '🎉 DEDUÇÃO EXATA! O Ferrador (Casa Verde) cria o Tatu e entrega a 🪶 Pena Encantada!';
        }
      } else {
        this.message = `🔍 Casa ${this.selectedHouse.index} (${this.selectedHouse.corName}): ${this.selectedHouse.morador} cria ${this.selectedHouse.animal}. A pena não caiu aqui!`;
      }
    }

    // 6. Portal de Retorno ao Estúdio
    if (
      Math.abs(this.player.x - this.returnPortal.x) < (this.player.width + this.returnPortal.width) / 2 &&
      Math.abs(this.player.y - this.returnPortal.y) < (this.player.height + this.returnPortal.height) / 2
    ) {
      engine.switchScene('STUDIO');
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Céu Noturno do Sertão
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, 960, 540);

    // Lua Cheia de Xilogravura
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(880, 60, 26, 0, Math.PI * 2);
    ctx.fill();

    // Voo da Ave Espectral Rasga-Mortalha
    renderEntity(ctx, this.owl);

    // Faíscas Místicas sobre a Casa 4 se concluído ou destacando a ave
    if (this.victoryTriggered) {
      drawText(ctx, '✨ 🪶 PENA ENCONTRADA! ✨', 620, 110, {
        font: 'bold 12px monospace',
        color: '#4ade80',
        align: 'center'
      });
    }

    // Render das 5 Casas do Vilarejo
    for (const h of this.houses) {
      // Telhado de Barro Sertanejo desenhado primeiro
      ctx.beginPath();
      ctx.moveTo(h.x - h.width / 2 - 8, h.y - h.height / 2);
      ctx.lineTo(h.x, h.y - h.height / 2 - 38);
      ctx.lineTo(h.x + h.width / 2 + 8, h.y - h.height / 2);
      ctx.closePath();
      ctx.fillStyle = '#9a3412';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corpo da Casa
      renderEntity(ctx, h);

      // Porta de Madeira
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(h.x - 16, h.y + h.height / 2 - 40, 32, 40);
      ctx.strokeStyle = '#a8a29e';
      ctx.strokeRect(h.x - 16, h.y + h.height / 2 - 40, 32, 40);
    }

    // Portal de Retorno
    renderEntity(ctx, this.returnPortal);

    // Painel Superior de Folhetos de Cordel (Sextilhas de Cascudo)
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(40, 10, 800, 75);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 10, 800, 75);

    const currentS = this.stanzas[this.currentStanza];
    drawText(ctx, `📜 ${currentS.title} (${this.currentStanza + 1}/${this.stanzas.length}) [Espaço p/ Avançar]`, 55, 16, {
      font: 'bold 12px monospace',
      color: '#facc15'
    });

    for (let i = 0; i < currentS.lines.length; i++) {
      drawText(ctx, currentS.lines[i], 55, 34 + i * 16, {
        font: '11px monospace',
        color: '#fef3c7'
      });
    }

    // Painel de Detalhes da Casa Selecionada
    if (this.selectedHouse) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(160, 350, 640, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(160, 350, 640, 60);

      drawText(
        ctx,
        `🏠 CASA ${this.selectedHouse.index} (${this.selectedHouse.corName.toUpperCase()}) | Morador: ${this.selectedHouse.morador} | Criação: ${this.selectedHouse.animal}`,
        175,
        358,
        { font: 'bold 12px monospace', color: '#38bdf8' }
      );
      drawText(
        ctx,
        `Bebida: ${this.selectedHouse.bebida} | Fumo: ${this.selectedHouse.fumo} | [E / Enter] Confirmar Investigação`,
        175,
        380,
        { font: '11px monospace', color: '#e2e8f0' }
      );
    }

    // Jogador
    renderEntity(ctx, this.player);

    // Banner Superior
    drawText(ctx, '🦉 FASE 3: A PENA DA RASGA-MORTALHA (ENIGMA DE DEDUÇÃO)', 480, 95, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    drawText(ctx, this.message, 480, 510, {
      font: '12px monospace',
      align: 'center',
      color: '#fde047'
    });
  }

  public destroy(): void {}
}
