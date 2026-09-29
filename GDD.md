# 📜 Game Design Document (GDD) — O Labirinto do Salitre & A Botija do Coronel

> **Projeto:** O Labirinto do Salitre & A Botija do Coronel  
> **Tema:** O Velho Sertão (Tungão GameJam — IFPB Campus Monteiro)  
> **Gênero:** 2D Top-Down Adventure / Dungeon Crawler RPG  
> **Público-Alvo:** Web / Navegadores (HTML5 / WebGL)  
> **Autores & Squad:** @domaragao (CTO/PO), @gunpei (PM), @ludens (Game Design), @draper (Direção Criativa), @maya (UI/UX), @alexey (Frontend), @carmack (Tech Lead), @gunther (Level Design), @koji (Áudio), @glitch (QA)

---

## 1. Visão Geral & Core Loop

### 1.1 Premissa Narrativa
No coração do sertão da Paraíba, o temido **Coronel das Sete Almas** confiscou a lendária **Botija de Cachaça Benta** e o único rádio a pilha do vilarejo, trancando-os nas profundezas de sua mina de salitre abandonada e fortificada. O protagonista — **Zé do Pito**, um cabra da peste astuto e valente — decide invadir o labirinto subterrâneo de 5 alas para derrotar os capangas do coronel, desvendar enigmas antigos dos penitentes e recuperar o tesouro antes do meio-dia.

### 1.2 Core Loop (Segundo a Segundo)
```
[Entrar na Sala] ➔ [Desafio Lógico / Puzzle] ➔ [Combate Tático de Inimigos] ➔ [Coleta de Loot / Upgrade] ➔ [Destrancar Portão para Próxima Sala]
```

---

## 2. As 5 Salas / Cenários e Progressão

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Sala 1  │ ───> │ Sala 2  │ ───> │ Sala 3  │ ───> │ Sala 4  │ ───> │ Sala 5  │
│ Mina de │      │ Açude de│      │ Cristais│      │ Lajotas │      │ Chefe   │
│ Salitre │      │ Pedra   │      │ Quartzo │      │ Malditas│      │ Final   │
└─────────┘      └─────────┘      └─────────┘      └─────────┘      └─────────┘
```

### 📍 Sala 1: Entrada da Mina de Salitre (Tutorial & Fundação)
* **Objetivo:** Ensinar movimentação, ataque corpo a corpo, caixas e placas de pressão.
* **Puzzle Lógico:** Empurrar 2 caixotes de salitre sobre 2 placas de pressão de pedra para destravar a grade de ferro.
* **Inimigos:** 4 Escorpiões e Calangos gigantes da caatinga (combate básico de peixeira e rolamento).
* **Loot / Equipamento:**
  - 🗡️ **Peixeira Básica** (Dano 1, golpe curto em arco).
  - 📜 **Patuá de Couro** (Item passivo: +20% velocidade de movimento).

---

### 📍 Sala 2: O Açude de Pedra (Lógica de Alavancas & Cobertura)
* **Objetivo:** Introduzir combate à distância e quebra-cabeças de sequência lírica.
* **Puzzle Lógico:** 3 Alavancas de comportas d'água. Uma estrofe de cordel na parede dá a dica da ordem correta: *Sol ➔ Seca ➔ Chuva*. Puxar na ordem certa drena a água da passagem.
* **Inimigos:** 3 Soldados Fantasmas da Volante armados com fuzis (exige usar colunas de pedra para se proteger dos tiros).
* **Loot / Equipamento:**
  - 🤠 **Chapéu de Couro Estrela da Tarde** (+1 Coração de Vida Máxima).
  - 💥 **Bacamarte de Pólvora** (Arma secundária com tiro cônico de dispersão).

---

### 📍 Sala 3: Salão dos Cristais de Quartzo (Reflexo de Luz & Mini-Boss)
* **Objetivo:** Puzzle de alinhamento óptico e mecânica de vulnerabilidade de chefes.
* **Puzzle Lógico:** Rotacionar 2 estátuas com espelhos de cristal para refletir um feixe de sol do teto até queimar uma raiz de mandacaru gigante que bloqueia o centro.
* **Inimigo (Mini-Boss):** **Corisco das Sombras** (inimigo espectral super veloz que só se torna tangível e toma dano quando atraído para debaixo do feixe de luz refletido).
* **Loot / Equipamento:**
  - ✝️ **Amuleto de Padre Cícero** (Passiva: regenera 1 coração de vida a cada 5 inimigos derrotados).
  - ⚔️ **Peixeira de Prata** (Arma corpo a corpo aprimorada: Dano 2.5x contra almas e mortos-vivos).

---

### 📍 Sala 4: Pátio das Lajotas Amaldiçoadas (Memória & Inimigos Blindados)
* **Objetivo:** Teste de memória rápida, timing de esquiva e flanco tático.
* **Puzzle Lógico:** Tabuleiro de lajotas 3x4 no piso. O caminho seguro pisca em verde por 3 segundos; pisar na lajota errada aciona estacas de espinho de mandacaru.
* **Inimigos:** 2 Jagunços Blindados com escudo de couro cru (imunes a ataques frontais; o jogador precisa esquivar para as costas deles para golpear).
* **Loot / Equipamento:**
  - 🧪 **Garrafa de Cachaça da Peste** (Consumível: 6 segundos de invulnerabilidade e velocidade dobrada).
  - 🔑 **Chave Dourada do Santuário**.

---

### 📍 Sala 5: O Santuário do Coronel-Cão (Grande Batalha Final)
* **Chefe Final:** **O Coronel das Sete Almas** (Montado em um Bode de Chifres Flamejantes).
* **Fases do Combate:**
  * **Fase 1 (Duelo de Balas):** O Coronel cavalga pela arena disparando rajadas de pólvora em leque e lançando dinamites.
  * **Fase 2 (Fúria do Sertão - 50% de HP):** O Coronel ativa um escudo de chamas impenetrável. O jogador precisa ativar rapidamente duas placas de pressão nos cantos da sala sob fogo inimigo para quebrar o escudo e finalizar a batalha com a Peixeira de Prata.
* **Vitória:** Abertura do cofre, recuperação da Botija Sagrada e exibição da tela de vitória em xilogravura com repente comemorativo gerado em áudio e texto.

---

## 3. Sistema de Equipamentos & Atributos

| Tipo | Nome do Item | Efeito Mecânico | Onde é Obtido |
| :--- | :--- | :--- | :--- |
| **Arma Melee 1** | Peixeira de Lata | Dano 1.0 / Alcance curto | Início (Sala 1) |
| **Arma Melee 2** | Peixeira de Prata | Dano 2.5 / Efeito sagrado | Sala 3 (Mini-Boss) |
| **Arma Ranged** | Bacamarte de Pederneira | Dano 2.0 em cone / Consome pólvora | Sala 2 |
| **Acessório 1** | Patuá de Couro | +20% Velocidade de Movimento | Sala 1 (Loot) |
| **Acessório 2** | Chapéu Estrela da Tarde | +1 Coração de Vida Máxima (de 3 para 4) | Sala 2 (Loot) |
| **Acessório 3** | Amuleto de Padre Cícero | Cura 1 HP a cada 5 abates | Sala 3 (Loot) |
| **Consumível** | Cachaça da Peste | 6s de Invencibilidade e Fúria | Sala 4 (Loot) |

---

## 4. Easter Eggs Regionais & Interações Especiais

1. 🏺 **Filtro de Barro São João:**
   - Presente nas antessalas. Ao interagir: restaura 100% da vida com o som característico de água pingando e o texto *"Água fresca que desce benzendo as juntas."*
2. 🐐 **O Bode Que Julga:**
   - Um bode imóvel no canto das salas. Seus olhos seguem o jogador. Se o jogador errar uma alavanca ou pisar na lajota errada, ele solta um balido irônico.
3. 📻 **Rádio Spica Secreto:**
   - Escondido atrás de uma parede rachada na Sala 3 (quebrável com tiro de bacamarte). Toca *"Asa Branca"* em chiptune 8-bit.
4. 🍾 **Diabinho na Garrafa (Menu de Ajuda):**
   - NPC no menu de pausa que dá dicas cheias de ironia e sarcasmo.

---

## 5. Diretrizes Técnicas de Desenvolvimento (60 FPS WebGL)

* **Stack:** Vite + TypeScript + Phaser 3 (ou Canvas/PixiJS Reativo com React).
* **Fixed Timestep:** Física e balística operando a 60Hz desacoplados da renderização.
* **Spatial Hash Grid:** Particionamento espacial para detecção instantânea de colisões $O(1)$.
* **Object Pooling:** Projéteis, partículas de poeira e números de dano sem alocação dinâmica (`new`) em tempo de execução para garantir Zero Garbage Collection Stutter.
* **Formatos de Entrega:** Build Web SPA estática pronta para Vercel / GitHub Pages / Itch.io.

---
*GDD Aprovado pela equipe XIUD para a Tungão GameJam 2024.*
