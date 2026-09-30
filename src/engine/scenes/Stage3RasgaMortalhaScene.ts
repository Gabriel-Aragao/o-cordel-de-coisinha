import { IScene, IGameEngine, InputState, Entity, SceneId } from '../types';
import { drawText } from '../../renderer/shapes';

interface HouseSlot {
  index: number;
  corName: string;
  colorHex: string;
  morador: string;
  bebida: string;
  fumo: string;
  animal: string;
}

interface CordelStanza {
  title: string;
  lines: string[];
}

export class Stage3RasgaMortalhaScene implements IScene {
  public id: SceneId = 'STAGE_3_RASGAMORTALHA';
  public name = 'Fase 3: A Pena da Rasga-Mortalha';

  private owl: Entity = {
    id: 'owl',
    x: 100,
    y: 50,
    width: 36,
    height: 24,
    color: '#a855f7',
    label: '[RASGA-MORTALHA]',
    shape: 'triangle',
    speed: 130
  };

  private owlDirection: number = 1;

  // As 5 Casas Sertanejas
  private houses: HouseSlot[] = [];

  // Categorias de Seleção
  private moradores = ['(Vazio)', 'Vaqueiro', 'Rendeira', 'Cantador', 'Ferrador', 'Rezadeira'];
  private bebidas = ['(Vazio)', 'Água', 'Garapa', 'Cachaça', 'Umbu', 'Café'];
  private fumos = ['(Vazio)', 'Paieiro', 'Palha', 'Desfiado', 'Arapiraca', 'Trevo'];
  private animais = ['(Vazio)', 'Bode', 'Galo', 'Tatu', 'Cavalo', 'Canário'];

  private selectedHouseIndex: number = 0;
  private selectedRow: number = 0; // 0: morador, 1: bebida, 2: fumo, 3: animal

  private currentStanza: number = 0;

  // As 9 Estrofes Poéticas de Cordel Canônicas
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
        'O Vaqueiro sertanejo na Casa Amarela habita,',
        'E bebe Água de pote bem gelada que palpita;',
        'Ao seu lado a Casa Azul a cantiga ressuscita.'
      ]
    },
    {
      title: 'Estrofe III — A Rendeira e o Galo',
      lines: [
        'A Rendeira caprichosa mora na bela Casa Azul,',
        'Cria o Galo de Campina que canta de norte a sul;',
        'Bebendo doce Garapa na cuia do Cariri.'
      ]
    },
    {
      title: 'Estrofe IV — A Casa Vermelha e a Cachaça',
      lines: [
        'O Cantador de repente mora na Casa Vermelha,',
        'Bate o pé e toma Cachaça acendendo sua centelha;',
        'Pita Fumo Desfiado que na brasa se assemelha.'
      ]
    },
    {
      title: 'Estrofe V — A Casa Verde do Ferrador',
      lines: [
        'A Casa Verde e caiada fica ao lado da Branca,',
        'Seu dono bebe bom Umbu e no trabalho não manca;',
        'É o Ferrador afamado que qualquer prego arranca.'
      ]
    },
    {
      title: 'Estrofe VI — O Cavalo e o Fumo Arapiraca',
      lines: [
        'O Ferrador cria o Cavalo de trote veloz e forte,',
        'Pita o Fumo Arapiraca trazido lá do seu norte;',
        'E guarda o mistério antigo que desafia a morte.'
      ]
    },
    {
      title: 'Estrofe VII — A Rezadeira na Casa Branca',
      lines: [
        'A Rezadeira bendita habita a Casa Branca,',
        'Toma Café bem amargo e com fé tudo estanca;',
        'Pita o suave Trevo que a tristeza desbanca.'
      ]
    },
    {
      title: 'Estrofe VIII — O Bode e o Canário',
      lines: [
        'Na primeira Casa Amarela o Bode pasta no terreiro,',
        'Com o Fumo de Paieiro do bom vaqueiro rasteiro;',
        'E na Casa Branca o Canário é o canto pioneiro.'
      ]
    },
    {
      title: 'Estrofe IX — O Tatu e a Revelação Final',
      lines: [
        'O Cantador cria o Tatu que na terra fura o chão...',
        'Diga agora, forasteiro, com firme dedução:',
        'A CASA 4 (VERDE / FERRADOR) TEM A PENA DO SERTÃO!'
      ]
    }
  ];

  private message: string = 'Clique no painel superior para ler as 9 estrofes, deduza os dados das 5 casas e valide a solução!';
  private stateStatus: 'PLAYING' | 'SUCCESS' | 'FAILED' = 'PLAYING';
  private endTimer: number = 0;

  public init(engine: IGameEngine): void {
    this.stateStatus = 'PLAYING';
    this.endTimer = 0;
    this.selectedHouseIndex = 0;
    this.selectedRow = 0;
    this.currentStanza = 0;

    // Inicializa as 5 Casas com os valores de dedução
    this.houses = [
      { index: 1, corName: 'Amarela', colorHex: '#eab308', morador: 'Vaqueiro', bebida: 'Água', fumo: 'Paieiro', animal: 'Bode' },
      { index: 2, corName: 'Azul', colorHex: '#2563eb', morador: 'Rendeira', bebida: 'Garapa', fumo: 'Palha', animal: 'Galo' },
      { index: 3, corName: 'Vermelha', colorHex: '#dc2626', morador: 'Cantador', bebida: 'Cachaça', fumo: 'Desfiado', animal: 'Tatu' },
      { index: 4, corName: 'Verde', colorHex: '#16a34a', morador: 'Ferrador', bebida: 'Umbu', fumo: 'Arapiraca', animal: 'Cavalo' },
      { index: 5, corName: 'Branca', colorHex: '#f8fafc', morador: 'Rezadeira', bebida: 'Café', fumo: 'Trevo', animal: 'Canário' }
    ];

    if (engine.inventory.pena) {
      this.message = '✓ Enigma Resolvido! A 🪶 Pena Encantada já foi conquistada na Casa 4.';
    }
  }

  public update(dt: number, input: InputState, engine: IGameEngine): void {
    if (this.stateStatus !== 'PLAYING') {
      this.endTimer += dt;
      if (this.endTimer >= 2.5) {
        engine.switchScene('STUDIO');
      }
      return;
    }

    // Voo da coruja Rasga-Mortalha
    this.owl.x += this.owlDirection * (this.owl.speed || 130) * dt;
    if (this.owl.x > 880) this.owlDirection = -1;
    if (this.owl.x < 80) this.owlDirection = 1;

    // Navegação no Teclado
    if (input.left) {
      this.selectedHouseIndex = Math.max(0, this.selectedHouseIndex - 1);
    } else if (input.right) {
      this.selectedHouseIndex = Math.min(4, this.selectedHouseIndex + 1);
    }

    if (input.up) {
      this.selectedRow = Math.max(0, this.selectedRow - 1);
    } else if (input.down) {
      this.selectedRow = Math.min(3, this.selectedRow + 1);
    }

    // Suporte ao Clique / Mouse
    if (input.mouse.clicked) {
      const mx = input.mouse.x;
      const my = input.mouse.y;

      // 1. Clique no Painel de Estrofes de Cordel (topo) ➔ Avança estrofe
      if (mx >= 40 && mx <= 920 && my >= 38 && my <= 140) {
        // Checa clique nas setas ou no painel
        if (mx >= 40 && mx <= 120) {
          this.currentStanza = (this.currentStanza - 1 + this.stanzas.length) % this.stanzas.length;
        } else {
          this.currentStanza = (this.currentStanza + 1) % this.stanzas.length;
        }
      }

      // 2. Clique nas Casas Sertanejas
      for (let i = 0; i < this.houses.length; i++) {
        const hx = 60 + i * 170;
        const hy = 160;
        const hw = 150;
        const hh = 250;

        if (mx >= hx && mx <= hx + hw && my >= hy && my <= hy + hh) {
          this.selectedHouseIndex = i;
          const relativeY = my - hy;
          if (relativeY >= 40 && relativeY < 85) {
            this.selectedRow = 0;
            this.cycleAttribute(i, 0);
          } else if (relativeY >= 85 && relativeY < 130) {
            this.selectedRow = 1;
            this.cycleAttribute(i, 1);
          } else if (relativeY >= 130 && relativeY < 175) {
            this.selectedRow = 2;
            this.cycleAttribute(i, 2);
          } else if (relativeY >= 175) {
            this.selectedRow = 3;
            this.cycleAttribute(i, 3);
          }
        }
      }

      // 3. Clique no Botão de Validar Dedução
      if (mx >= 330 && mx <= 630 && my >= 430 && my <= 485) {
        this.validateSolution(engine);
      }
    }

    // Ação com Teclado (Espaço para avançar estrofe ou alternar atributo)
    if (input.action) {
      this.currentStanza = (this.currentStanza + 1) % this.stanzas.length;
    } else if (input.interact) {
      this.cycleAttribute(this.selectedHouseIndex, this.selectedRow);
    }
  }

  private cycleAttribute(houseIdx: number, row: number): void {
    const house = this.houses[houseIdx];
    if (row === 0) {
      const idx = this.moradores.indexOf(house.morador);
      house.morador = this.moradores[(idx + 1) % this.moradores.length];
    } else if (row === 1) {
      const idx = this.bebidas.indexOf(house.bebida);
      house.bebida = this.bebidas[(idx + 1) % this.bebidas.length];
    } else if (row === 2) {
      const idx = this.fumos.indexOf(house.fumo);
      house.fumo = this.fumos[(idx + 1) % this.fumos.length];
    } else if (row === 3) {
      const idx = this.animais.indexOf(house.animal);
      house.animal = this.animais[(idx + 1) % this.animais.length];
    }
  }

  private validateSolution(engine: IGameEngine): void {
    // Validação Canônica da Matriz
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

    if (isH1Valid && isH2Valid && isH3Valid && isH4Valid && isH5Valid) {
      // SUCESSO!
      this.stateStatus = 'SUCCESS';
      engine.unlockItem('pena');
      this.message = '🎉 DEDUÇÃO EXATA! O Ferrador da Casa Verde entregou a 🪶 Pena Encantada!';
    } else {
      // FALHA!
      this.stateStatus = 'FAILED';
      this.message = '💀 O PIADO DA RASGA-MORTALHA ECOOU! A dedução está incorreta!';
    }
  }

  public render(ctx: CanvasRenderingContext2D, _engine: IGameEngine): void {
    // Fundo Noturno Sertanejo
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, 960, 540);

    // Lua Cheia de Xilogravura
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(890, 50, 24, 0, Math.PI * 2);
    ctx.fill();

    // Voo da Rasga-Mortalha
    ctx.fillStyle = this.owl.color;
    ctx.beginPath();
    ctx.arc(this.owl.x, this.owl.y, 14, 0, Math.PI * 2);
    ctx.fill();
    drawText(ctx, '🦉 [RASGA-MORTALHA]', this.owl.x, this.owl.y - 18, {
      font: 'bold 10px monospace',
      color: '#d8b4fe',
      align: 'center'
    });

    // Cabeçalho
    drawText(ctx, '🦉 FASE 3: A PENA DA RASGA-MORTALHA (ENIGMA DAS 5 CASAS)', 480, 18, {
      font: 'bold 14px monospace',
      align: 'center',
      color: '#f7d070'
    });

    // Painel Dinâmico de Estrofe por Estrofe (9 Estrofes ao Clique)
    ctx.fillStyle = '#111827';
    ctx.fillRect(40, 40, 880, 102);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 880, 102);

    const s = this.stanzas[this.currentStanza];

    // Cabeçalho da Estrofe com Botões de Navegação
    drawText(
      ctx,
      `📜 ${s.title.toUpperCase()} (${this.currentStanza + 1}/9) — [Clique no Painel ou aperte Espaço p/ Avançar]`,
      480,
      48,
      { font: 'bold 12px monospace', color: '#facc15', align: 'center' }
    );

    // Versos da Estrofe Atual
    for (let i = 0; i < s.lines.length; i++) {
      drawText(ctx, s.lines[i], 480, 72 + i * 20, {
        font: 'bold 12px monospace',
        color: '#fef3c7',
        align: 'center'
      });
    }

    // Render das 5 Casas Interativas
    for (let i = 0; i < this.houses.length; i++) {
      const h = this.houses[i];
      const hx = 60 + i * 170;
      const hy = 160;
      const hw = 150;
      const hh = 250;

      const isSelected = this.selectedHouseIndex === i;

      // Telhado
      ctx.beginPath();
      ctx.moveTo(hx - 8, hy + 30);
      ctx.lineTo(hx + hw / 2, hy);
      ctx.lineTo(hx + hw + 8, hy + 30);
      ctx.closePath();
      ctx.fillStyle = '#7c2d12';
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corpo da Casa
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(hx, hy + 30, hw, hh - 30);
      ctx.strokeStyle = isSelected ? '#38bdf8' : h.colorHex;
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.strokeRect(hx, hy + 30, hw, hh - 30);

      // Título da Casa
      drawText(ctx, `Casa ${h.index} (${h.corName})`, hx + hw / 2, hy + 35, {
        font: 'bold 11px monospace',
        color: h.colorHex,
        align: 'center'
      });

      // 4 Slots de Atributos
      const rows = [
        { label: 'Morador', val: h.morador },
        { label: 'Bebida', val: h.bebida },
        { label: 'Fumo', val: h.fumo },
        { label: 'Animal', val: h.animal }
      ];

      for (let r = 0; r < rows.length; r++) {
        const ry = hy + 60 + r * 42;
        const isRowSel = isSelected && this.selectedRow === r;

        ctx.fillStyle = isRowSel ? '#0369a1' : '#111827';
        ctx.fillRect(hx + 6, ry, hw - 12, 36);
        ctx.strokeStyle = isRowSel ? '#38bdf8' : '#374151';
        ctx.lineWidth = 1;
        ctx.strokeRect(hx + 6, ry, hw - 12, 36);

        drawText(ctx, `${rows[r].label}:`, hx + 10, ry + 3, { font: '9px monospace', color: '#94a3b8' });
        drawText(ctx, rows[r].val, hx + hw / 2, ry + 16, {
          font: 'bold 11px monospace',
          color: '#f8fafc',
          align: 'center'
        });
      }
    }

    // Botão de Validação
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(350, 430, 260, 48);
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 3;
    ctx.strokeRect(350, 430, 260, 48);

    drawText(ctx, '✨ VALIDAR DEDUÇÃO & OBTER PENA ✨', 480, 446, {
      font: 'bold 12px monospace',
      color: '#ffffff',
      align: 'center'
    });

    drawText(ctx, this.message, 480, 510, {
      font: '12px monospace',
      align: 'center',
      color: this.stateStatus === 'FAILED' ? '#ef4444' : '#fde047'
    });

    // Banner de Sucesso ou Falha
    if (this.stateStatus === 'SUCCESS') {
      ctx.fillStyle = 'rgba(22, 101, 52, 0.94)';
      ctx.fillRect(240, 200, 480, 110);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 110);
      drawText(ctx, '🎉 SUCESSO! 🪶 PENA ENCANTADA CONQUISTADA!', 480, 230, {
        font: 'bold 16px monospace',
        color: '#bbf7d0',
        align: 'center'
      });
      drawText(ctx, 'Retornando vitorioso ao Estúdio de Xilogravura...', 480, 265, {
        font: '12px monospace',
        color: '#f0fdf4',
        align: 'center'
      });
    } else if (this.stateStatus === 'FAILED') {
      ctx.fillStyle = 'rgba(127, 29, 29, 0.95)';
      ctx.fillRect(240, 200, 480, 110);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 3;
      ctx.strokeRect(240, 200, 480, 110);
      drawText(ctx, '💀 O AGOURO DA RASGA-MORTALHA ECOOU!', 480, 230, {
        font: 'bold 16px monospace',
        color: '#fecaca',
        align: 'center'
      });
      drawText(ctx, 'Dedução incorreta! Retornando ao Estúdio...', 480, 265, {
        font: '12px monospace',
        color: '#fff',
        align: 'center'
      });
    }
  }

  public destroy(): void {}
}
