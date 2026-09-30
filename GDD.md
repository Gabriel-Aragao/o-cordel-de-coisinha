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

### 1.2 Regra de Transição: Sucesso ou Falha (Sem Portais)
* **Sem portais manuais de volta nas fases.**
* O retorno ao Estúdio ocorre exclusivamente por dois gatilhos de State Machine:
  1. **Sucesso:** Atingimento do objetivo da fase ➔ Conquista do item místico ➔ Retorno comemorativo ao Estúdio.
  2. **Falha:** Condição de derrota (morte de um bode, colisão sem fumo na Cumade, erro no enigma) ➔ Retorno ao Estúdio sem o item para nova tentativa.

### 1.3 Estrutura Macro do Jogo
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
* **Ambiente & Câmera:** Cenário amplo de caatinga com rolagem de tela (*camera follow*) centralizada no jogador.
* **Moitas:** Vegetação densa espalhada pelo mapa.
  - Bodes podem estar escondidos dentro das moitas.
  - Ao interagir com uma moita (`E` / Ação), o jogador vasculha o arbusto. A **Corda** e o **Candeeiro** estão escondidos em moitas.
* **Mecânicas de Som:**
  - **Aboiar (Toque Curto):** Se o bode estiver na moita, faz o bode sair e o afasta levemente.
  - **Gritar (Segurar Botão):** Assusta o bode, fazendo-o disparar em fuga para procurar uma nova moita, além de espantar o Chupa-Cabra.
* **Chupa-Cabra & Barra de Vida dos Bodes:**
  - Bode fora da moita atrai o Chupa-Cabra.
  - Cada um dos 4 bodes possui **Barra de HP** visível. O Chupa-Cabra drena HP ao atacar.
  - **Falha:** Se 1 bode morrer (HP = 0) ➔ Retorno imediato ao estúdio.
  - **Sucesso:** Salvar e conduzir os 4 bodes ao curral central ➔ Fazendeiro entrega o **🪓 Carimbo Mágico** ➔ Retorno vitorioso ao estúdio.

---

### 🌿 FASE 2: A Fazenda da Cumade Fulozinha
* **Ambiente & Topologia (6 Lotes em Telas Individuais — Sem Lote 3c):**
  - Cada lote é exibido como uma tela individual fechada com seu próprio labirinto interno.
  - **Portões Internos com Bloqueio Real:** Portões abrem e fecham periodicamente com os assobios. Quando abertos, permitem passagem; quando fechados, bloqueiam rigidamente o movimento.
  - **Porteiras de Borda:** Portagens de transição entre lotes adjacentes estão **sempre abertas**.
  - **Moitas:** Presentes em todos os lotes; o **Fumo de Rolo** está escondido em uma moita no **Lote 1b**.
  ```
  [Lote 1a]                [Lote 1b] (Fumo na Moita)
      |                        |
  [Lote 2a] -------------- [Lote 2b]
      |                        |
  [Lote 0] (Início/Pedra)  [Lote 3b] (Cumade Fulozinha)
      |
  [Lote 3a]
  ```
* **Lote 0 (Entrada):** Tela inicial com porteira à direita. A **Pedra da Botija** está situada **exclusivamente na saída do Lote 0** para o Lote 2a.
* **Lote 3b:** Morada da Cumade Fulozinha. Ao entrar no Lote 3b, ela inicia perseguição ativa pelo labirinto e intensifica os assobios (inversão de controles: cima ⇄ baixo ou esq ⇄ dir).
* **Desfecho de Colisão com a Cumade:**
  - **Com o Fumo:** Ela aceita o agrado e entrega a **📄 Página / Folha Rasgada** ➔ **Sucesso** (retorno ao estúdio).
  - **Sem o Fumo:** Ataque de cipó ➔ **Falha** (retorno ao estúdio).

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha
* **Ambiente:** Vilarejo sertanejo com 5 casas coloridas (Amarela, Azul, Vermelha, Verde, Branca).
* **Paginação de Pistas em Cordel:**
  - As **9 estrofes poéticas** aparecem **uma a uma na tela**, avançando ou retrocedendo de acordo com o clique do jogador.
* **Mecânica de Puzzle (Drag-and-Drop):**
  - O jogador lê as estrofes e deve **arrastar cada item solto para a sua casa correspondente**, completando toda a matriz lógica da vila antes de investigar.
* **Desfecho:**
  - **Confirmação com Erro:** Agouro da ave ➔ **Falha** (retorno ao estúdio).
  - **Confirmação Correta:** A Casa 4 (Verde / Ferrador do Tatu) é revelada, o jogador interage com a casa e recebe a **🪶 Pena Encantada** ➔ **Sucesso** (retorno ao estúdio).

---

### 🏺 FASE 4: A Botija de Mané Monteiro
* **Ambiente:** Topologia da Fazenda com a adição do **Novo Lote da Igreja** à direita do Lote 1b.
  ```
  [Lote 1a]                [Lote 1b] -------------- [Lote Igreja] (Início & Santuário)
      |                        |
  [Lote 2a] -------------- [Lote 2b]
      |                        |
  [Lote 0] (Pedra/Botija)  [Lote 3b]
      |
  [Lote 3a]
  ```
* **Santuário Seguro da Igreja:** A Cumade Fulozinha **NÃO CONSEGUE ENTRAR** no Lote da Igreja.
* **Início da Fase:** O jogador **inicia dentro da Igreja** e acessa o Lote 1b pela porteira à esquerda.
* **Caça Global da Cumade:** Nos demais lotes da fazenda, a criatura **atravessa livremente entre todos os lotes**.
  - **Sem Fumo:** Se a Cumade colidir com o jogador ➔ **Falha** (retorno ao estúdio).
* **Escuridão & Candeeiro:** Visão restrita ao círculo dinâmico de luz do Candeeiro.
* **Desenterrar a Botija:** No Lote 0 sob a pedra (penalidade de -25% de velocidade pelo peso do ouro) e retorno até a Igreja.
* **Desfecho:** Entregar a botija ao Beato no Lote da Igreja ➔ Concessão da **🖋️ Tinta Encantada** ➔ **Sucesso** (retorno ao estúdio).

---

### 🏆 FASE FINAL: A Prensa do Destino & Vitória
1. **Desbloqueio:** A mesa de prensagem só aceita interação após a conquista dos **4 itens místicos**.
2. **Personalização:** O jogador digita seu **Nickname**.
3. **Prensagem:** Animação com estampagem xilográfica e abertura da porta mística.
4. **Capa Oficial:** Exibição da capa personalizada *"O Cordel de [Nickname]: O Herói do Sertão"*.

---

## 3. Diretrizes de Desenvolvimento do MVP (Fase 1 de Execução)

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP: FORMAS & LEGENDAS                   │
├──────────────────────────┬──────────────────────────────────┤
│ Coisinha (Jogador)       │ Quadrado Azul: `[HEROI]`         │
│ Bodes                    │ Círculos Brancos: `[BODE]`       │
│ Chupa-Cabra              │ Triângulo Vermelho: `[CHUPA]`    │
│ Cumade Fulozinha         │ Círculo Amarelo: `[FULÔ]`        │
│ Moitas                   │ Círculos Verdes: `[MOITA]`       │
│ Casas do Vilarejo        │ Retângulos Coloridos `[CASA 1..5]│
│ Igreja                   │ Retângulo Sagrado `[IGREJA]`     │
│ Botija                   │ Quadrado Dourado `[BOTIJA]`      │
│ Fumo de Rolo             │ Quadrado Marrom `[FUMO]`         │
└──────────────────────────┴──────────────────────────────────┘
```

---
*GDD Revisado e Aprovado por @gunpei e @domaragao para a Tungão GameJam 2024.*
