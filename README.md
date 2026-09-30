# 📜 O Cordel de Coisinha: O Herói do Sertão

> **Projeto:** O Cordel de Coisinha: O Herói do Sertão  
> **Evento:** Tungão GameJam — X SEMIII (IFPB Campus Monteiro)  
> **Tema:** O Velho Sertão  
> **Gênero:** 2D Top-Down Adventure / Escape Room / Puzzle & Action  
> **Liderança:** @domaragao (CTO / Product Owner) & @gunpei (Produtor Ágil & PM)

---

## 📖 Sinopse & Prólogo

Ao visitar uma tradicional feira de cordéis no sertão paraibano, o protagonista **Coisinha** recebe de um vendedor misterioso um folheto encantado com páginas em branco intitulado *"Os Contos..."*. Subitamente, um desenho em xilogravura começa a se formar na folha: é o próprio Coisinha! O vendedor se desvanece no ar, os braços de Coisinha desaparecem e tudo escurece.

Coisinha acorda dentro de um **Estúdio de Xilogravura Místico**. No local, há um varal com cordéis mágicos inacabados e uma pesada porta trancada com a inscrição: *"Só heróis têm a chave"*. 

Para retornar ao mundo real, Coisinha precisa entrar em cada uma das 4 histórias encantadas espalhadas pelo chão, enfrentar e desvendar os mistérios das entidades do folclore nordestino e coletar os **4 Elementos da Xilogravura** para estampar seu próprio cordel mestre!

---

## 🎨 Os 4 Instrumentos da Xilogravura Mestre

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ 🪓 CARIMBO      │     │ 📄 FOLHA        │     │ 🪶 PENA         │     │ 🖋️ TINTA        │
│ O Ataque do     │ ──> │ A Fazenda de    │ ──> │ A Pena da       │ ──> │ A Botija de     │
│ Chupa-Cabra     │     │ Cumade Fulozinha│     │ Rasga-Mortalha  │     │ Mané Monteiro   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 🗺️ As 4 Fases & Mecânicas de Gameplay

### 🐐 1. O Ataque do Chupa-Cabra (Ação, Pastoreio & Resgate)
* **Objetivo:** Ajudar o fazendeiro a resgatar **4 bodes perdidos** na caatinga antes que o Chupa-Cabra os devore.
* **Mecânicas Principais:**
  - **Aboiar (Grito):** Segurar o botão de ação solta um grito potente que afasta o Chupa-Cabra, mas assusta os bodes soltos.
  - **Itens:** Corda (para laçar e conduzir bodes) e Candeeiro (ilumina uma área ao redor do jogador).
* **Recompensa:** 🪓 **Carimbo Mágico**.

### 🌿 2. A Fazenda da Cumade Fulozinha (Labirinto Dinâmico & Inversão)
* **Objetivo:** Navegar por um labirinto dinâmico de 7 lotes interconectados para encontrar o fumo de rolo no Lote 3a e entregá-lo como oferenda à Cumade Fulozinha no Lote 3c.
* **Mecânicas Principais:**
  - **Assobios Encantados:** Abrem/fecham passagens de paredes e invertem temporariamente os eixos de controle (cima ⇄ baixo / esquerda ⇄ direita).
  - **Pista Oculta:** O jogador descobre uma pedra solta no chão (local secreto da botija).
* **Recompensa:** 📄 **Página / Folha Rasgada**.

### 🦉 3. A Pena da Rasga-Mortalha (Dedução Lógica / Enigma de Einstein)
* **Objetivo:** Descobrir em qual das 5 casas de um vilarejo sertanejo caiu a pena mística da ave do agouro.
* **Mecânicas Principais:**
  - **Enigma das 5 Casas:** Pistas em sextilhas de cordel relacionando Cor da Casa, Ofício do Morador, Bebida Típica, Animal de Estimação e Tipo de Fumo.
* **Recompensa:** 🪶 **Pena Encantada**.

### 🏺 4. A Botija de Mané Monteiro (Stealth & Sobrevivência Noturna)
* **Objetivo:** Infiltrar-se na fazenda à noite pelo Lote 1b, desenterrar a botija sob a pedra no Lote 0 e entregá-la ao beato na paróquia.
* **Mecânicas Principais:**
  - **Escuridão & Candeeiro:** Campo de visão limitado sem a luz do candeeiro.
  - **Cumade Furiosa:** Sem oferenda de fumo, a entidade vaga velozmente pelo labirinto; o jogador deve desviar de seu raio de detecção.
* **Recompensa:** 🖋️ **Tinta Encantada**.

### 🏆 Encerramento & Vitória
De volta ao estúdio, o jogador fixa os 4 cordéis no varal, une os 4 instrumentos, digita seu nome/nickname e imprime a capa do seu próprio cordel:  
> **"O Cordel de [Nickname]: O Herói do Sertão"**

---

## 🚀 Diretriz de Desenvolvimento: Abordagem MVP First

Para garantir validação ágil da jogabilidade e mecânicas nas primeiras horas da Jam:

1. **Protótipo em Formas Geométricas com Legendas:**
   - Jogador = Quadrado/Círculo azul `[HEROI]`.
   - Bodes = Círculos brancos `[BODE]`.
   - Chupa-Cabra = Triângulo vermelho `[CHUPA-CABRA]`.
   - Lotes da Fazenda = Blocos retangulares em grade `[LOTE 0, 1a, 2a...]`.
2. **Validação do Core Loop:**
   - Teste de movimentação, condução de bodes e grito de aboio.
   - Teste de inversão temporária de controles por assobios.
   - Teste da máquina lógica de validação do enigma das 5 casas.
   - Teste de iluminação por raio de candeeiro no escuro.
3. **Segunda Onda de Polimento (Pós-MVP):**
   - Inserção de sprites em estilo xilogravura 2D.
   - Trilha sonora chiptune/baião e efeitos sonoros regionais (@koji).
   - Telas de HUD ricas desenhadas pela @maya.

---

## 🌐 Hub de Ferramentas & Plataformas Web

* **Framework Base:** Phaser 3 / HTML5 Canvas + Vite + TypeScript.
* **Áudio & SFX:** [jsfxr](https://sfxr.me/) | [Bfxr](https://www.bfxr.net/) | [BeepBox](https://www.beepbox.co/).
* **Arte & Pixel Art:** [Piskel](https://www.piskelapp.com/) | [LibreSprite](https://libresprite.github.io/) | [Lospec](https://lospec.com/).
* **Deploy Web em 1 Clique:** [Vercel](https://vercel.com/) | [GitHub Pages](https://pages.github.com/).

---
*Documentação oficial mantida pela equipe XIUD para a Tungão GameJam 2024.*
