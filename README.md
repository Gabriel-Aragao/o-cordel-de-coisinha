# 🎮 Tungão GameJam — Documentação & Guia de Preparação

> **Evento:** GameJam do X SEMIII — Instituto Federal da Paraíba (IFPB Campus Monteiro)  
> **Data:** 29/09 a 01/10  
> **Formato:** Equipe Híbrida (Pilotos Humanos no Lab + Squad de Agentes IA de Alta Performance)  
> **Liderança:** @domaragao (CTO/PO) & @gunpei (Produtor Ágil & Game Jam PM)

---

## 🏆 Visão Geral & Critérios de Avaliação

O objetivo é entregar um **MVP jogável (Vertical Slice)** polido, divertido e sem bugs, maximizando a pontuação em todos os critérios oficiais do edital:

| Critério | Peso / Foco | Estratégia da Equipe |
| :--- | :--- | :--- |
| **Adequação ao tema** | Relevância e criatividade | Brainstorm relâmpago pós-revelação do tema + narrativa/humor ácido integrado. |
| **Gameplay e Jogabilidade** | Core Loop, controles e diversão | Foco no *Core Fun* nas primeiras 24h. Controles responsivos e curva de aprendizado intuitiva. |
| **Arte e Design Visual** | Estilo visual e coerência de HUD | Estética 2D/Pixel Art coesa, paleta limitada, animações fluidas e UI limpa. |
| **Áudio e Sonoplastia** | SFX dinâmicos e trilha imersiva | Geradores de SFX chiptune, trilhas em loop dinâmico e feedback sonoro para cada ação. |
| **Estabilidade e Acabamento** | Ausência de bugs e polimento (*Juice*) | Build Web (HTML5) com 60 FPS cravados, zero erros de console e validação rigorosa de QA. |

---

## 👥 Estrutura da Equipe Híbrida

### 📍 Pilotos Humanos (No Laboratório do IFPB)
- **@domaragao (CTO / Product Owner):** Direção geral, tomada de decisões, alinhamento de escopo e ponte com a organização.
- **Colegas de Equipe (ADS / Suporte & Manutenção):** Testes de gameplay, validação de build em tempo real, feedback de jogabilidade e submissão.

### 🤖 Squad de Agentes de IA (Desenvolvimento Ágil em Tempo Real)
- **@gunpei (PM & Produtor Ágil):** Gestão de escopo, timeboxing, controle de marcos e coordenação das entregas.
- **@ludens (Game Designer):** Mecânicas centrais, regras, game loop e balanceamento.
- **@draper (Diretor Criativo):** Conceito, narrativa, tom de voz provocativo, humor ácido e copy.
- **@maya (UI/UX Designer):** Wireframes, telas, menus, HUD e design de experiência do jogador.
- **@alexey (Game Frontend):** Motor de jogo reativo em React / Phaser, componentes e animações.
- **@carmack (Game Tech Lead):** Algoritmos matemáticos, física, IA de inimigos e otimização.
- **@koji (Sound Designer):** Composição chiptune, efeitos sonoros (SFX) e áudio dinâmico.
- **@gunther (Level Designer):** Layout de fases, curva de dificuldade e economia do jogo.
- **@glitch (QA & Build Engineer):** Validação de PRs, caça a bugs de colisão/estado e estabilidade da build final.

---

## 🚀 Instruções de Preparação Prévia (A Priori)

### 1. Preparação dos Computadores (Lab e Pessoal)
- [ ] Instalar o **Node.js (LTS)** e **Git**.
- [ ] Instalar o **VS Code** com extensões: *Live Server*, *GitLens*, *Prettier*.
- [ ] Garantir navegador atualizado com DevTools habilitado (Chrome / Firefox / Brave).
- [ ] Testar acesso ao repositório GitHub e permissões de push/pull.

### 2. Kit Pendrive de Emergência (Para o Laboratório)
Caso haja instabilidade na internet ou restrições de download nos computadores do IFPB, mantenha em um pendrive:
- Instaladores offline do Node.js LTS e Git.
- Executável portátil do **Godot 4.x Standard** (~100 MB).
- Executável do **LibreSprite** / **Audacity**.
- Template base de projeto compactado (`.zip`).

### 3. Padrões Operacionais Obrigatórios
- **Commits:** Seguir o padrão de autoria (ex: `[gunpei] - mensagem descritiva`).
- **Branches & PRs:** Toda feature/correção é desenvolvida em branch própria e submetida via Pull Request validado por QA.
- **Formato de Entrega:** Build Web HTML5 pronta para rodar diretamente no navegador com 1 clique (Vercel / GitHub Pages / Itch.io).

---

## 🌐 Plataformas Web & Recursos Recomendados (Acesso Rápido)

### 🛠️ Engines & Frameworks (Code-First / Web-Ready)
* [Phaser 3](https://phaser.io/) — Framework 2D para Canvas e WebGL em JavaScript/TypeScript.
* [Kaplay (Kaboom.js)](https://kaplayjs.com/) — Biblioteca minimalista e ultra-rápida para jogos arcade 2D.
* [PixiJS](https://pixijs.com/) — Renderizador 2D de altíssima performance para WebGL.
* [Godot Engine](https://godotengine.org/) — Engine leve com exportação Web de 1 clique.

### 🔊 Geradores de Efeitos Sonoros (SFX) & Música Web
* [sfxr / jsfxr](https://sfxr.me/) — Gerador instantâneo de efeitos sonoros 8-bit no navegador (Pulos, Tiros, Explosões, Moedas).
* [Bfxr](https://www.bfxr.net/) — Ferramenta avançada para síntese de efeitos sonoros de videogame.
* [ChipTone](https://sfbgames.itch.io/chiptone) — Gerador de SFX com interface visual moderna e rica.
* [BeepBox](https://www.beepbox.co/) — Estúdio chiptune no navegador para criação de trilhas em loop.
* [JummBox](https://jummbus.bitbucket.io/) — Versão expandida do BeepBox com mais canais e instrumentos.
* [Audacity](https://www.audacityteam.org/) — Editor e conversor de áudio gratuito (WAV, OGG, MP3).

### 🎨 Arte 2D, Pixel Art & Paletas de Cores
* [Piskel](https://www.piskelapp.com/) — Editor online de pixel art e animação de sprite sheets.
* [LibreSprite](https://libresprite.github.io/) — Versão open-source e gratuita do Aseprite.
* [Lospec](https://lospec.com/) — Coleção de paletas de cores consagradas (GameBoy, PICO-8, NES) e tutoriais de pixel art.
* [Kenney.nl](https://kenney.nl/assets) — Maior acervo de assets 2D/UI sob licença livre (CC0 / Domínio Público).
* [OpenGameArt.org](https://opengameart.org/) — Repositório comunitário de sprites, músicas e texturas livres.
* [Itch.io Free Game Assets](https://itch.io/game-assets/free) — Assets e pacotes gráficos gratuitos para game jams.

### 🗺️ Level Design & Prototipagem
* [Tiled Map Editor](https://www.mapeditor.org/) — Editor de mapas tile-based flexível com export em JSON.
* [LDtk (Level Designer Toolkit)](https://ldtk.io/) — Editor moderno de fases 2D voltado para game jams.
* [Figma](https://www.figma.com/) — Prototipagem e wireframes de telas, menus e HUD.
* [Excalidraw](https://excalidraw.com/) — Quadro branco colaborativo para brainstorms de mecânicas e fluxos.

### 🚀 Hospedagem & Deploy Rápido (Play in Browser)
* [Vercel](https://vercel.com/) — Deploy contínuo e instantâneo via GitHub para aplicações Web/Vite.
* [GitHub Pages](https://pages.github.com/) — Hospedagem gratuita direta do branch do repositório.
* [Itch.io](https://itch.io/) — Plataforma padrão da indústria para submissão e publicação de jogos de Jam.

---

## ⏱️ Cronograma Tático de Jam (Timeboxing 48h)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CRONOGRAMA DE PRODUÇÃO                          │
├────────────────────────────────┬───────────────────────────────────────┤
│ 29/09 (Abertura & Dia 1)       │ • Revelação do Tema Surpresa          │
│                                │ • Brainstorm Relâmpago (Máx 2h)       │
│                                │ • Fechamento do Escopo do MVP         │
│                                │ • Core Loop Jogável no Navegador      │
├────────────────────────────────┼───────────────────────────────────────┤
│ 30/09 (Produção Pesada Dia 2)  │ • Integração de Arte, HUD e Telas     │
│                                │ • Injeção de SFX e Trilha Sonora      │
│                                │ • Montagem de Fases & Dificuldade     │
│                                │ • Testes de Gameplay e Balanceamento  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 01/10 (Polimento & Submissão)  │ • Code Freeze (Trava de Novas Features│
│                                │ • Caça a Bugs e Ajustes de Polish     │
│                                │ • Geração de GIFs/Screenshots e Pitch │
│                                │ • Submissão Final com 2h de Margem    │
└────────────────────────────────┴───────────────────────────────────────┘
```

---
*Documento mantido por @gunpei (Game Jam PM) para a equipe XIUD na Tungão GameJam 2024.*
