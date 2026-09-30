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
  - **Portões Internos:** Abrem e fecham periodicamente com os assobios.
  - **Porteiras de Borda:** Portagens de transição entre lotes adjacentes estão **sempre abertas**.
  - **Moitas:** Presentes em todos os lotes.
  ```
  [Lote 1a]                [Lote 1b] (Fumo na Moita)
      |                        |
  [Lote 2a] (Pedra) ------ [Lote 2b]
      |                        |
  [Lote 0] (Início)        [Lote 3b] (Cumade Fulozinha)
      |
  [Lote 3a]
  ```
* **Lote 0 (Entrada):** Tela inicial com porteira à direita. A **Pedra da Botija** está situada na saída para o Lote 2a.
* **Lote 1b:** O **Fumo de Rolo** está escondido dentro de uma moita.
* **Lote 3b:** Morada da Cumade Fulozinha. Ao entrar no Lote 3b, ela inicia perseguição ativa pelo labirinto e intensifica os assobios (inversão de controles: cima ⇄ baixo ou esq ⇄ dir).
* **Desfecho de Colisão com a Cumade:**
  - **Com o Fumo:** Ela aceita o agrado e entrega a **📄 Página / Folha Rasgada** ➔ **Sucesso** (retorno ao estúdio).
  - **Sem o Fumo:** Ataque de cipó ➔ **Falha** (retorno ao estúdio).

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha
* **Ambiente:** Vilarejo sertanejo com 5 casas coloridas (Amarela, Azul, Vermelha, Verde, Branca).
* **Mecânica de Puzzle (Arrastar Itens):**
  - Vários itens soltos no cenário representando as características do enigma de Einstein.
  - O jogador lê as 9 estrofes em cordel de @cascudo e deve **arrastar cada item para a sua casa correspondente**, completando toda a matriz lógica da vila.
* **Desfecho:**
  - **Confirmação com Erro:** Agouro da ave ➔ **Falha** (retorno ao estúdio).
  - **Confirmação Correta:** A Casa 4 (Verde / Ferrador do Tatu) é revelada, o jogador interage com a casa e recebe a **🪶 Pena Encantada** ➔ **Sucesso** (retorno ao estúdio).

---

### 🏺 FASE 4: A Botija de Mané Monteiro
* **Ambiente:** Mesma topologia dos 6 lotes da Fazenda da Cumade Fulozinha em plena noite escura.
* **Mecânicas Especiais:**
  - **Caça Global da Cumade:** A entidade agora **atravessa livremente entre todos os lotes**.
  - **Sem Fumo:** Se a Cumade colidir com o jogador ➔ **Falha** (retorno ao estúdio).
  - **Escuridão & Candeeiro:** Visão restrita ao círculo dinâmico de luz do Candeeiro.
  - **Desenterrar a Botija:** O jogador entra pelo Lote 1b, viaja até o Lote 0, desenterra o ouro sob a pedra (penalidade de -25% de velocidade pelo peso) e escapa até a Paróquia.
* **Desfecho:**
  - Entregar a botija ao Beato na Paróquia ➔ Concessão da **🖋️ Tinta Encantada** ➔ **Sucesso** (retorno ao estúdio).

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
│ Botija                   │ Quadrado Dourado `[BOTIJA]`      │
│ Fumo de Rolo             │ Quadrado Marrom `[FUMO]`         │
└──────────────────────────┴──────────────────────────────────┘
```

* **Prioridade 1:** Câmera dinâmica na Fase 1 e lógica de HP dos bodes.
* **Prioridade 2:** FSM de lotes individuais na Fase 2 e perseguição global na Fase 4.
* **Prioridade 3:** Drag-and-drop de itens no puzzle da Fase 3.
* **Prioridade 4:** Validação de QA com @glitch.

---
*GDD Revisado e Aprovado por @gunpei e @domaragao para a Tungão GameJam 2024.*
