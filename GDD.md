# 📜 Game Design Document (GDD) — O Cordel de Coisinha: O Herói do Sertão

> **Projeto:** O Cordel de Coisinha: O Herói do Sertão  
> **Tema:** O Velho Sertão (Tungão GameJam — IFPB Campus Monteiro)  
> **Gênero:** 2D Top-Down Adventure / Escape Room / Puzzle & Action  
> **Público-Alvo:** Web / Navegadores (HTML5 / WebGL)  
> **Autores & Squad:** @domaragao (CTO/PO), @gunpei (PM), @ludens (Game Design), @draper (Direção Criativa), @cascudo (Folclorista), @maya (UI/UX), @alexey (Frontend), @carmack (Tech Lead), @gunther (Level Design), @koji (Áudio), @glitch (QA)

---

## 1. Visão Geral & Core Loop

### 1.1 Premissa Narrativa
Coisinha é um visitante de uma feira de cordéis no sertão da Paraíba. Ao folhear um folheto encantado em branco chamado *"Os Contos..."*, sua própria imagem começa a ser desenhada no papel. O vendedor some, os braços de Coisinha desvanecem e ele é transportado para um **Estúdio de Xilogravura Místico** selado por uma porta ancestral: *"Só heróis têm a chave"*.

Para escapar e voltar à realidade, Coisinha precisa mergulhar nas 4 histórias do folclore nordestino espalhadas pelo estúdio, desvendar seus mistérios e reunir os **4 Instrumentos Sagrados da Xilogravura** (Carimbo, Folha, Pena e Tinta) para estampar seu próprio cordel de herói.

### 1.2 Estrutura Macro do Jogo
```
                    ┌───────────────────────────────┐
                    │   HUB: ESTÚDIO DE XILOGRAVURA │
                    │ (Varal de Cordéis Encantados) │
                    └──────────────┬────────────────┘
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ FASE 1           │     │ FASE 2           │     │ FASE 3           │     │ FASE 4           │
│ O Ataque do      │     │ A Fazenda de     │     │ A Pena da        │     │ A Botija de      │
│ Chupa-Cabra      │     │ Cumade Fulozinha │     │ Rasga-Mortalha   │     │ Mané Monteiro    │
│ ➔ Carimbo Mágico │     │ ➔ Página Rasgada │     │ ➔ Pena Encantada │     │ ➔ Tinta Encantada│
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────────┐
                    │   CLÍMAX: A PRENSA DO DESTINO │
                    │ Impressão do Cordel c/ Nick   │
                    └───────────────────────────────┘
```

---

## 2. Detalhamento das Fases & Mecânicas

---

### 🐐 FASE 1: O Ataque do Chupa-Cabra
* **Ambiente:** Caatinga aberta ao entardecer com cercas de arame e curral central.
* **Objetivo:** Encontrar 4 bodes dispersos e conduzi-los em segurança ao curral antes que o Chupa-Cabra os ataque.
* **Entidades & Comportamentos:**
  - **Coisinha (Jogador):** Movimentação 8 direções + Ação de Aboiar (segurar barra de espaço/botão).
  - **Bodes (4):** Movimento autônomo errante. Ao ouvir o aboio sem corda, fogem na direção contrária. Com a corda, seguem o jogador em fila.
  - **Chupa-Cabra:** Surge pelas bordas da tela em intervalos e persegue o bode mais próximo. Se o jogador aboiar próximo a ele, a criatura se assusta e recua para fora da tela.
* **Itens:**
  - 🪢 **Corda de Amarrar:** Permite prender e conduzir os bodes diretamente.
  - 🏮 **Candeeiro:** Aumenta o raio de visão na penumbra.
* **Condição de Vitória:** 4 bodes no curral ➔ Fazendeiro entrega o **Carimbo Mágico**.

---

### 🌿 FASE 2: A Fazenda da Cumade Fulozinha
* **Ambiente:** Labirinto de 7 lotes interconectados com vegetação fechada e porteiras de madeira.
* **Topologia do Mapa (7 Lotes):**
  ```
  [1a]   [1b]
    |      |
  [2a] - [2b]
    |
  [Lote 0] (Início)
    |
  [3a] (Fumo) - [3b] - [3c] (Cumade Fulozinha)
  ```
* **Mecânicas Especiais:**
  - **Assobios Mágicos:** Em intervalos rítmicos, um assobio ecoa pela mata. Assobios alternam paredes abertas/fechadas e invertem temporariamente os controles do jogador (cima ⇄ baixo ou esquerda ⇄ direita por 4 segundos).
  - **A Pedra no Chão:** Pista secreta no Lote 0 onde o jogador tropeça em uma pedra grande (marcação da botija para a Fase 4).
* **Itens:**
  - 🍂 **Fumo de Rolo:** Localizado no Lote 3a.
* **Condição de Vitória:** Entregar o fumo à Cumade Fulozinha no Lote 3c ➔ Ela entrega a **Página Rasgada**. (Se alcançá-la sem fumo: dano/expulsão).

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha
* **Ambiente:** Rua com 5 casas coloridas do vilarejo sertanejo (Azul, Amarela, Vermelha, Verde, Branca).
* **Objetivo:** Descobrir em qual casa a Pena da Rasga-Mortalha caiu através de um **Enigma de Einstein no Sertão**.
* **Matriz de Dedução (5 Atributos x 5 Casas):**
  1. Cor da Casa (Azul, Amarela, Vermelha, Verde, Branca)
  2. Ofício do Morador (Ferreiro, Beato, Vaqueiro, Sanfoneiro, Xilógrafo)
  3. Bebida Típica (Garapa, Café, Cachaça, Água de Pote, Chá de Boldo)
  4. Animal de Estimação (Galo de Campina, Bode, Calango, Cachorro, Tatu)
  5. Tipo de Fumo (Fumo de Rolo, Cigarro de Palha, Cachimbo, Rapé, Desfiado)
* **Mecânica de Jogo:**
  - O jogador lê cartazes de cordel espalhados pela praça contendo as pistas lógicas.
  - Interface interativa de dedução (tabela de marcação estilo puzzle).
* **Condição de Vitória:** Selecionar a casa correta ➔ Recolher a **Pena Encantada**.

---

### 🏺 FASE 4: A Botija de Mané Monteiro
* **Ambiente:** A mesma Fazenda da Cumade Fulozinha, porém em noite profunda e chuvosa.
* **Objetivo:** Entrar pela porteira do Lote 1b, navegar no escuro até a pedra no Lote 0, cavar a botija e levá-la de volta à Paróquia.
* **Mecânicas Especiais:**
  - **Visão Limitada:** Escuridão severa. O Candeeiro (obtido na Fase 1) ilumina um círculo dinâmico de 120px ao redor do herói.
  - **Cumade Furiosa (Stealth):** Sem o fumo, a Cumade Fulozinha patrulha o labirinto em alta velocidade. O jogador precisa esgueirar-se pelas sombras e evitar cruzar sua linha de visão.
  - **Peso da Botija:** Carregar a botija reduz a velocidade de movimento em 25%.
* **Condição de Vitória:** Entregar a botija ao Beato na Paróquia ➔ Receber o frasco de **Tinta Encantada**.

---

### 🏆 FASE FINAL: O Estúdio de Xilogravura & O Grande Encerramento
1. O jogador retorna ao estúdio com os 4 cordéis e os 4 instrumentos.
2. Posiciona os 4 cordéis no varal com os pregadores.
3. Insere a Folha na prensa, derrama a Tinta, assina com a Pena e grava com o Carimbo.
4. Caixa de texto interativa: o jogador digita seu **Nickname**.
5. A prensa executa a animação de prensagem com efeito sonoro de impacto.
6. A porta mágica se abre em um feixe de luz.
7. **Tela Final de Vitória:** Capa de cordel personalizada em xilogravura:  
   > **"O Cordel de [Nickname]: O Herói do Sertão"**

---

## 3. Diretrizes de Desenvolvimento do MVP (Fase 1 de Execução)

Para garantir validação ágil e testes imediatos de jogabilidade:

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP: FORMAS & LEGENDAS                   │
├──────────────────────────┬──────────────────────────────────┤
│ Coisinha (Jogador)       │ Quadrado Azul: `[HEROI]`         │
│ Bodes                    │ Círculos Brancos: `[BODE]`       │
│ Chupa-Cabra              │ Triângulo Vermelho: `[CHUPA]`    │
│ Cumade Fulozinha         │ Círculo Amarelo: `[FULÔ]`        │
│ Casas do Vilarejo        │ Retângulos Coloridos `[CASA 1..5]│
│ Botija                   │ Quadrado Dourado `[BOTIJA]`      │
│ Fumo de Rolo             │ Quadrado Marrom `[FUMO]`         │
└──────────────────────────┴──────────────────────────────────┘
```

* **Prioridade 1:** Montar o Game Loop reativo (movimentação, colisões e troca de cenas/fases).
* **Prioridade 2:** Implementar as 4 lógicas de vitória de cada fase no estado global.
* **Prioridade 3:** Validação com QA (@glitch) antes de aplicar sprites e áudio.

---
*GDD Aprovado por @gunpei e @domaragao para a Tungão GameJam 2024.*
