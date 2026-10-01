# 📜 O Cordel de Coisinha: O Herói do Sertão

## 📖 Prólogo
Coisinha vai a uma feira de cordéis e visita alguns artistas locais. Ao entrar em uma das tendas, o vendedor lhe oferece um folheto especial: *"Os Contos..."*. O cordel está com as páginas em branco, mas subitamente o desenho de um personagem começa a se formar no papel: é o próprio Coisinha sendo traçado em xilogravura! 

O vendedor desaparece no ar. O cordel que Coisinha segurava cai no chão... cai porque seus próprios braços sumiram! Coisinha começa a se desvanecer e tudo ao redor fica completamente escuro.

Ele acorda no chão de terra batida de um **Estúdio de Xilogravura Místico**, com cordéis espalhados pelo chão. Há uma grande porta de madeira entalhada no estúdio, porém trancada com a seguinte inscrição:
> *"Só heróis têm a chave."*

Ao se virar para procurar outra saída, Coisinha pisa sobre o primeiro cordel encantado no chão e é transportado magicamente para a primeira história: **"O Ataque do Chupa-Cabra"**.

---

## 🎭 Sistema Global de Diálogos & Interface Unificada

### 1. Painel de Diálogo Fora e Abaixo da Tela de Jogo (Zero Sobreposição):
* **Renderização Fora do Canvas de Jogo:** Todas as mensagens de informação, diálogos de NPCs, toasts e orientações são exibidas em um **painel dedicado posicionado estritamente FORA e ABAIXO do canvas de jogo** (na estrutura de interface externa ao jogo).
* **Zero Sobreposição no Canvas:** **Nenhuma caixa de diálogo, texto ou notificação é desenhada por cima do canvas de jogo**, garantindo que 100% do mapa, itens, salas interiores e personagens fiquem totalmente visíveis e desobstruídos em todas as fases.
* **Renderização Estritamente Sob Demanda:** Em estado ocioso (idle), o painel inferior externo permanece recolhido/oculto, abrindo-se apenas no momento em que uma conversa for iniciada ou um toast for disparado.
* **Fila Sequencial Sem Conflito:** Mensagens são enfileiradas e exibidas uma a uma de forma limpa.
* **Estética de Xilogravura:** O painel conta com moldura e tipografia xilográfica, distintivo do locutor com cores temáticas e indicador de avanço `[Solte E para Avançar]`.

### 2. Ciclo de Vida, Ritmo e Desbloqueio dos Diálogos (Exclusividade de NPCs):
* **Renderização Exclusiva de Diálogos com NPCs:** Todas as mensagens secundárias, toasts e orientações de cordel de fundo foram removidas de todas as fases e do estúdio. O painel externo exibe **exclusivamente diálogos diretos com NPCs** (com censura inicial, apelido 'Coisinha' e dicas).
* **Controle de Ritmo e Prevenção de Pulo de Falas:** Cada fala intermediária exige um release intencional da tecla `E` / `Enter` com **debounce mínimo de 0.3s entre linhas**, garantindo que o jogador consiga ler com calma todas as estrofes e diálogos sem pulos acelerados acidentais.
* **Encerramento Fluido e Desbloqueio Imediato:** Ao atingir a última fala de um diálogo e soltar a tecla `E` / `Enter`, a caixa de diálogo **fecha imediatamente e desaparece**, liberando a movimentação e os controles do herói sem travamento.
* **Consumo Atômico de Input e Cooldown de Interação:** O fechamento consome o evento de input e impede que o mesmo clique/release reabra instantaneamente a conversa com o mesmo NPC.
* **Diálogo Canônico de Censura (1ª Interação com NPCs):**
  - A primeira vez que o jogador interage com qualquer NPC falante (**Fazendeiro, Padre/Beato, Violeiros, Bêbados/Moradores**):
    - **NPC:** *"Opa, forasteiro! Qual é o seu nome?"*
    - **Jogador:** *"Meu nome é @#$!*&%#!*" *(com som cômico de erro/glitch/censura)*
    - **NPC:** *"Entendi foi nada!"*
  - **Todas as falas subsequentes:** O NPC passa a chamar o personagem exclusivamente de **"Coisinha"** (ex: *"Então, Coisinha. Meus bodes não apareceram ainda..."*).
  - **Dicas de Gameplay:** Personagens-chave (dono do curral, padre, violeiros) fornecem dicas claras dos objetivos da fase.

### 3. Telas de Apresentação, Encerramento e Viewport em Escala Vertical (960x580px):
* **Escala Vertical Integral (960x580px):** O canvas do jogo e todas as subcenas operam na resolução padrão de **960x580 pixels**.
* **Preenchimento Vertical Completo:** Os folhetos de introdução e de vitória ocupam toda a extensão vertical da tela de jogo (580px de altura), sem faixas pretas ou vazios na base/topo.
* **Backgrounds de Cena em Altura Total:** Todos os cenários (incluindo praça e salas interiores da Fase 3) cobrem integralmente os 960x580 do canvas.

### 3. Fase 3 — A Pena da Rasga-Mortalha (Enigma das 5 Casas):
* **Palco Central dos Violeiros:** Os 2 violeiros ficam posicionados sobre um palco/tablado de madeira de xilogravura no centro da praça, cantando as pistas poéticas do repente.
* **Distribuição dos Quadros em Arco na Base:** Os 4 quadros (Bodega dos Moradores, Mesa de Bebidas, Mesa de Fumos e Curral de Animais) ficam distribuídos em um arco harmonioso e ampliado na parte inferior da praça, com espaço de sobra para acomodar os 5 itens de cada categoria.
* **Renderização Fiel de Emojis:**
  - O item **Café** utiliza representação nítida (`☕ / 🫖`).
  - Todos os 5 animais no Curral e nas casas (**Bode 🐐, Galo 🐓, Tatu 🦔, Cavalo 🐎, Canário 🐤**) renderizam seus respectivos emojis/ícones autênticos (eliminando a repetição do sprite de bode da Fase 1 para todos).
* **Timer de 5 Minutos (300s) & Mau Agouro:**
  - A Fase 3 possui um temporizador de **5 minutos** visível no HUD.
  - Se o tempo expirar antes da resolução completa: a Rasga-Mortalha espalha mau agouro sobre Monteiro, exibe a tela de falha e redireciona o herói de volta ao Estúdio.
* **Grito da Rasga-Mortalha (a cada 30s):** A coruja emite seu som característico de tecido rasgando a cada 30 segundos, reforçando a atmosfera tensa de meia-noite.
* **Folheto de Cordel de Encerramento:** Ao completar os 20 nichos das 5 casas, o folheto de vitória é exibido em tela cheia (tanto no interior da casa quanto na praça), entregando a **Pena Encantada** antes do retorno ao estúdio.

### 4. Mecânicas Globais de Moitas, Dano e Obtenção de Itens:
* **Auto-Revelação de Moitas de Espinhos:** Ao esbarrar ou colidir com uma moita de espinhos/cactos e perder 1 vida (-1 HP), a moita se **revela automaticamente** no mapa com seus espinhos e cactos visíveis, identificando o perigo.
* **Invulnerabilidade e Efeito de Piscar (5 Segundos de i-Frames):** Sempre que o herói perde uma vida (-1 HP por cacto, tropeço, ataque da Fulô ou Chupa-Cabra), o personagem entra em estado de **invulnerabilidade total por 5.0 segundos**, piscando continuamente na tela durante todo esse tempo e ficando imune a qualquer novo dano.
* **Diálogo Bloqueante ao Coletar Itens de Moita:**
  - Ao encontrar um item especial em moita (**Corda de Laçar**, **Fumo de Rolo** ou **Candeeiro**), abre-se imediatamente uma **caixa de diálogo explicativa** informando o item conquistado e suas propriedades.
  - O gameplay e a movimentação do personagem ficam pausados/bloqueados, continuando apenas após o jogador pressionar e soltar `[E]` ou `[Enter]` para fechar a caixa de diálogo.

### 5. Fase 4 — A Botija de Mané Monteiro (Stealth Noturno, Assobios & Ciclo da Fulô):
* **Inversão de Controles nos Assobios:** Os assobios misteriosos da Cumade Fulozinha na Fase 4 agora alternam os portões e **invertem temporariamente os controles de movimentação** (assim como na Fase 2), desorientando o herói na escuridão.
* **Ciclo de Perseguição e Desaparecimento da Fulô:**
  - Em cada lote visitado pelo jogador (exceto o Santuário da Igreja), a Cumade Fulozinha surge em um ponto aleatório do lote.
  - **Perseguição Implacável (5 segundos):** Persegue o herói ativamente por 5.0 segundos respeitando as paredes sólidas.
  - **Desaparecimento Místico (3 segundos):** Desaparece completamente por 3.0 segundos (invisível, sem colisão e com partículas de folhas/bruma).
  - **Reaparição:** Reaparece em outra posição aleatória do lote atual do jogador, reiniciando o ciclo de 5 segundos de caça.
* **Santuário da Igreja & Candeeiro:** Área sagrada livre da Fulô; Candeeiro no Lote 1b expande a visão na escuridão para 320px com diálogo bloqueante.
* **Recompensa:** Desenterrar a botija no Lote 0 e levar ao Beato ➔ 🖋️ **Tinta Encantada**.

### 6. Clímax & Estúdio de Impressão:

### 4. Controles Universais:
* Os comandos de **Grito** (`Espaço` / Segurar) e **Interação** (`E` / Soltar) funcionam universalmente em **todas as telas e fases do jogo**.
* O nome oficial do herói só é digitado e revelado na **Prensa do Destino** após a conquista dos 4 elementos.

---

## 🚪 Regra Geral de Transição (Sem Portais)
* **Nas fases NÃO existem portais manuais de volta ao estúdio.**
* Retorno ocorre apenas por **Sucesso** (com item) ou por **Falha** (derrota/morte/erro).

---

## 🎨 Os 4 Elementos Místicos do Cordel Mestre
* 🪓 **Carimbo Mágico:** Obtido em *"O Ataque do Chupa-Cabra"*.
* 📄 **Folha / Página Rasgada:** Obtida em *"A Fazenda da Cumade Fulozinha"*.
* 🪶 **Pena Encantada:** Obtida em *"A Pena da Rasga-Mortalha"*.
* 🖋️ **Tinta Encantada:** Obtida em *"A Botija de Mané Monteiro"*.

---

## 🐐 Fase 1: O Ataque do Chupa-Cabra

### Cenário Amplo & Moitas Visualmente Idênticas:
* Mapa expandido com câmera suave (*camera lerp*).
* **Moitas 100% Homogêneas:** Não há nenhuma diferença visual prévia entre as moitas. Todas possuem a mesma textura de xilogravura. O conteúdo interno só é revelado após a interação com a tecla `E`:
  - **Moitas de Cactos:** Retiram 1 barra de vida (HP) e fazem o herói **gritar involuntariamente de dor**.
  - **Moitas de Frutas Regionais (Umbu / Mandacaru):** Recuperam 1 barra de vida.
  - **Moitas com Itens:** Escondem a **Corda de Laçar** ou o **Candeeiro**.
  - **Moitas com Bodes:** Escondem os bodes do rebanho.
### Comportamento Sonoro dos Bodes & Reações Acústicas:
* **Reação dos Bodes:**
  - **Aboio:** Faz o bode andar um pouco (deslocamento suave, saindo da moita ou se afastando levemente).
  - **Grito:** Faz o bode correr em disparada e procurar ativamente outra moita para se esconder.
  - **Bode Atacado:** Ao ser atacado pelo Chupa-Cabra, o bode grita de pavor, assustando e espantando outros bodes soltos ou escondidos em arbustos próximos.
* **Reação do Chupa-Cabra ao Som:**
  - **Aboio:** NÃO afeta o Chupa-Cabra (o predador ignora o aboio).
  - **Grito:** Afugenta o Chupa-Cabra, fazendo-o fugir e se afastar o máximo que seu deslocamento permitir por **3 segundos**. Após esse tempo, ele retoma a caça aos bodes indefesos.
* **Condição de Vitória:** Resgatar os 4 bodes no curral ➔ Ganha o **🪓 Carimbo Mágico**.

---

## 🌿 Fases 2 e 4: A Fazenda da Cumade Fulozinha & A Botija de Mané Monteiro

### Sistema de 3 Vidas, Danos e Quedas Cômicas:
* O sistema de **3 vidas (HP)**, **moitas de espinhos / cactos** (-1 HP + grito de dor) e **moitas de frutas regionais** (+1 HP) é ativo nas Fases 2 e 4.
* **Tropeço Trágico na Pedra da Botija (Lote 0):** Ao passar por cima da pedra, o herói **tropeça, cai no chão e perde 1 vida (-1 HP)**, disparando o diálogo cômico (*"Coisinha, tropeçou!"*, *"Coisinha vai arrancar um dedo!"*, *"Coisinha tá adivinhando butija!"*).
* **Ataque da Cumade Fulozinha (Cadarços Amarrados):** Ao ser alcançado pela Cumade Fulozinha (sem fumo na F2 ou durante a perseguição na F4), o herói **perde 1 vida (-1 HP) e cai no chão** (*"A Cumade Fulozinha amarrou seus cadarços!"*), recebendo um breve período de invulnerabilidade e knockback para tentar fugir.
* **Condição de Derrota por Vidas (Falha):** Ao perder todas as 3 vidas (HP = 0), a missão falha e o herói retorna imediatamente ao Estúdio de Xilogravura.

### Topologia Rigorosa, Labirintos Espaçosos & Corredor da Pedra:
* **Passagens Espaçosas & Vãos Livres:** Todas as aberturas entre paredes, portões e corredores possuem largura generosa e espaçosa garantindo que o personagem transite com total fluidez sem ficar preso nas quinas.
* **Spawn Desimpedido no Lote 0 (Fase 2):** O jogador inicia em área livre e limpa do Lote 0, sem sobreposição com muros ou colisores de labirinto.
* Paredes de contorno sólidas ao redor de cada lote, com passagens abertas apenas nas conexões oficiais:
  * **Lote 0:** Conexão à direita com **Lote 2a**.
    - **Pedra da Botija em Posição Idêntica (Fases 2 e 4):** A pedra fica posicionada **exatamente nas mesmas coordenadas** na saída do Lote 0 no meio do corredor estreito, fazendo o herói tropeçar e cair na saída e na reentrada.
    - **Sem Legenda Textual na Pedra:** A pedra não possui texto/legenda fixa.
  * **Lote 2a:** Conexão acima com **Lote 1a**, abaixo com **Lote 3a**, à direita com **Lote 2b**.
  * **Lote 1a:** Conexão à direita com **Lote 1b**.
  * **Lote 3a:** Conexão à direita com **Lote 3b**.
  * **Lote 2b:** Conexão acima com **Lote 1b**, abaixo com **Lote 3b**.
  * **Lote 1b:** Conexão à direita com o **Lote da Igreja** (**EXCLUSIVAMENTE na Fase 4**).

```
[Lote 1a] ─────────────── [Lote 1b] ── (Fase 4 apenas) ── [Lote Igreja] (Santuário)
   │                           │
[Lote 2a] ─────────────── [Lote 2b]
   │                           │
[Lote 0] (Início/Pedra)   [Lote 3b] (Cumade Fulozinha)
   │
[Lote 3a] ─────────────── [Lote 3b]
```

* **Estrutura de Labirinto Fechado (Fases 2 e 4):** Construção densa de paredes internas, corredores intrincados e passagens alternantes dinâmicas (portões que abrem e fecham com os assobios), conferindo sensação total de labirinto fechado.
* **Física da Cumade Fulozinha:** A Fulô **NÃO atravessa paredes sólidas**. Ela se move exclusivamente por caminhos livres e passagens abertas.
* **Fase 2:** Fumo de rolo na moita do Lote 1b; entregar à Cumade no Lote 3b ➔ **📄 Página Rasgada**.

### Fase 4 (A Botija de Mané Monteiro — Escuridão & Candeeiro):
* Mapa idêntico à Fase 2, porém **completamente imerso em escuridão noturna**.
* **Área de Visão Dinâmica:** Apenas um círculo ao redor do herói revela as paredes, moitas e portões.
  - **Sem Candeeiro:** Raio de visão curto e limitado.
  - **Com Candeeiro (encontrado em moita):** Raio de visão significativamente maior e iluminado.
* Os efeitos de passagens alternantes e troca/inversão de controles com os assobios permanecem ativos.
* Início na Igreja (Santuário onde a Cumade não entra); desenterrar a botija no Lote 0 (-25% vel) e retornar à Igreja ➔ **🖋️ Tinta Encantada**.

---

## 🦉 Fase 3: A Pena da Rasga-Mortalha (Casas Interiores & Captura Universal com 'E')

### 1. Mecânica Universal de Captura e Soltura (`E`):
* Todos os elementos das casas (**Fumos, Bebidas, Moradores/Bêbados e Animais**) possuem **a mesma mecânica de interação**:
  - Pressionar/soltar a tecla `E` próximo ao elemento para **capturar / segurar** (o herói carrega 1 item/morador/animal por vez, que se move junto a ele).
  - Pressionar/soltar a tecla `E` novamente para **soltar**.
  - Soltar qualquer elemento **fora de uma casa** faz com que ele **retorne automaticamente para sua posição original na mesa ou curral**.

### 2. Telas Interiores das 5 Casas:
* As 5 casas no vilarejo são **espaços onde o personagem entra fisicamente (transportado para uma tela/cenário interior daquela casa)** ao cruzar a porta.
* **Saída Segura e Anti-Loop:** Ao sair de uma casa, o herói é posicionado bem abaixo da porta na praça (com margem de segurança de +110px) e é ativado um cooldown de porta (0.6s), **prevenindo qualquer reentrada involuntária ou loop de entrar e sair**.
* **Depósito:** Ao entrar na tela interior da casa, o herói aperta `E` para soltar e fixar o elemento nos nichos daquela casa.
* **Remoção de Itens da Casa:**
  - O jogador pode capturar individualmente um item de dentro da casa apertando `E` e levá-lo para fora.
  - **Grito de Reset da Casa:** Ao dar um **Grito (`Espaço`) dentro de uma casa**, **TODOS os itens, moradores e animais daquela casa são expulsos e retornam instantaneamente para suas respectivas mesas e curral**.

### 3. Violeiros & Desfecho:
* **2 Violeiros no Canto Inferior Esquerdo:** Violeiro 1 declama as primeiras 4 estrofes; Violeiro 2 declama as 5 estrofes finais sob interação (`E` release).
* **Desfecho:** Todas as 5 casas com os 4 elementos corretos em seus interiores ➔ A ave entrega a **🪶 Pena Encantada** ➔ **Sucesso**!

---

## 🏆 Fase Final: A Prensa do Destino & Capa Oficial
* Destravada com os 4 itens. O jogador insere seu **Nickname**, aciona a prensa e gera a capa oficial de xilogravura.
