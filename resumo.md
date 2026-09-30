# 📜 O Cordel de Coisinha: O Herói do Sertão

## 📖 Prólogo
Coisinha vai a uma feira de cordéis e visita alguns artistas locais. Ao entrar em uma das tendas, o vendedor lhe oferece um folheto especial: *"Os Contos..."*. O cordel está com as páginas em branco, mas subitamente o desenho de um personagem começa a se formar no papel: é o próprio Coisinha sendo traçado em xilogravura! 

O vendedor desaparece no ar. O cordel que Coisinha segurava cai no chão... cai porque seus próprios braços sumiram! Coisinha começa a se desvanecer e tudo ao redor fica completamente escuro.

Ele acorda no chão de terra batida de um **Estúdio de Xilogravura Místico**, com cordéis espalhados pelo chão. Há uma grande porta de madeira entalhada no estúdio, porém trancada com a seguinte inscrição:
> *"Só heróis têm a chave."*

Ao se virar para procurar outra saída, Coisinha pisa sobre o primeiro cordel encantado no chão e é transportado magicamente para a primeira história: **"O Ataque do Chupa-Cabra"**.

---

## 🎭 Sistema Global de Diálogos & Interface Unificada

### 1. Painel Dedicado Abaixo da Tela de Jogo (Sem Sobreposição):
* **Área Exclusiva Abaixo do Canvas de Jogo:** Todas as mensagens de informação, diálogos de NPCs, toasts e dicas são exibidas em um **painel dedicado posicionado estritamente abaixo da tela de jogo**, evitando qualquer sobreposição com itens da sala, personagens ou elementos de gameplay.
* **Fila Sequencial Sem Sobreposição:** As mensagens não se sobrepõem visualmente umas às outras; são enfileiradas e exibidas de forma clara e legível uma a uma.
* **Sem Textos Estáticos de Citação Obstruindo a Tela:** Qualquer bloco estático de texto no painel ou na tela (como citações) é **completamente removido**, mantendo a visibilidade 100% limpa.
* **Estética de Xilogravura:** O painel inferior adota a moldura de madeira entalhada em cordel, fundo em textura de papel kraft e tipografia xilográfica de alto contraste com indicador de avanço `[E]`.

### 2. Ciclo de Vida e Desbloqueio dos Diálogos:
* **Encerramento Fluido e Desbloqueio Imediato:** Ao atingir a última fala de um diálogo e soltar a tecla `E` / `Enter`, a caixa de diálogo **fecha imediatamente e desaparece**, liberando a movimentação e os controles do herói sem travamento.
* **Consumo Atômico de Input e Cooldown de Interação:** O fechamento consome o evento de input e impede que o mesmo clique/release reabra instantaneamente a conversa com o mesmo NPC.
* **Diálogo Canônico de Censura (1ª Interação com NPCs):**
  - A primeira vez que o jogador interage com qualquer NPC falante (**Fazendeiro, Padre/Beato, Violeiros, Bêbados/Moradores**):
    - **NPC:** *"Opa, forasteiro! Qual é o seu nome?"*
    - **Jogador:** *"Meu nome é @#$!*&%#!"* *(com som cômico de erro/glitch/censura)*
    - **NPC:** *"Entendi foi nada!"*
  - **Todas as falas subsequentes:** O NPC passa a chamar o personagem exclusivamente de **"Coisinha"** (ex: *"Então, Coisinha. Meus bodes não apareceram ainda..."*).
  - **Dicas de Gameplay:** Personagens-chave (dono do curral, padre, violeiros) fornecem dicas claras dos objetivos da fase.
  - **Avanço de Diálogos por Release da Tecla `E`:** Cada mensagem avança estritamente ao soltar (`keyUp` / release) a tecla `E` ou clique único.

### 2. Obtenção de Itens Especiais (Corda & Candeeiro):
* O herói **inicia sem a Corda e sem o Candeeiro**.
* A **Corda de Laçar** só é obtida se o jogador encontrá-la vasculhando uma moita.
* O **Candeeiro** só é obtido se o jogador encontrá-lo vasculhando uma moita.

### 3. Telas de Apresentação e Encerramento de Fase:
* **Entrada na Fase:** Tela de introdução com a narrativa do conto em folheto de cordel.
* **Conclusão da Fase:** Tela de encerramento celebrando o sucesso, apresentando a narrativa de desfecho e exibindo o **Item Místico** conquistado.

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
