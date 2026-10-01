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

### 1.2 Sistema Global de Diálogos, Dano, Moitas & Controles
* **Reset Automático de Moitas:** Ao sair ou reiniciar qualquer fase, 100% das moitas têm seu estado resetado (`isSearched = false`), reocultando cactos e disponibilizando novamente itens e frutas.
* **Zero Knockback / Zero Teletransporte:** O herói permanece na mesma coordenada física ao receber dano (-1 HP), prevenindo travamentos em paredes.
* **Fuga da Cumade Fulozinha por 3s após Dano:** Nas Fases 2 e 4, a Fulô recua e foge na direção oposta por 3.0s após acertar o herói antes de retomar a perseguição.
* **Auto-Revelação de Moitas de Espinhos:** Ao esbarrar em uma moita de cactos/espinhos e sofrer dano, ela se revela imediatamente no mapa.
* **Invulnerabilidade de 5 Segundos (Piscar):** Perder 1 vida concede 5.0 segundos de i-frames com animação de piscar, impedindo danos consecutivos imediatos.
* **Diálogo Bloqueante ao Coletar Itens de Moita:** Ao obter Corda, Fumo ou Candeeiro, uma caixa de diálogo é aberta e o jogo pausa até o fechamento com `[E]`/`[Enter]`.
* **Painel de Diálogos Fora e Abaixo da Tela de Jogo:** Falas de NPCs e avisos de itens ocorrem exclusivamente fora do canvas no `#game-message-panel`.
* **Debounce de Falas:** Debounce de 0.3s por linha no avanço de diálogos.
* **Escala Vertical Integral (960x580px):** O canvas do jogo, folhetos e cenários operam em 960x580px.
* **Ciclo de Fechamento de Diálogo:** Conclusão da última fala libera instantaneamente o movimento do herói sem travamento ou loop infinito de interação.
* **Diálogo de Censura na 1ª Interação com NPCs:**
  - Primeira conversa com qualquer NPC falante (**Fazendeiro, Padre/Beato, Violeiros, Bêbados**):
    * NPC pergunta: *"Como é teu nome, forasteiro?"*
    * Jogador responde: `"Meu nome é @#$!*&%#!"` *(áudio de erro/censura)*
    * NPC reage: `"Entendi foi nada!"`
  - Todas as falas seguintes iniciam chamando o herói de **"Coisinha"** e fornecem dicas contextuais.
  - **Avanço de Diálogos no Release (`keyUp`) de `E`:** Sem repetição contínua.
* **Obtenção da Corda & Candeeiro:** Encontrados exclusivamente ao vasculhar moitas.
* **Telas de Abertura e Encerramento:** Apresentação poética em folheto antes de cada fase e tela de celebração no encerramento exibindo o item místico obtido.
* **Controles Universais:** O comando de **Grito** (`Espaço`) e **Interação** (`E`) funcionam em todas as telas.

### 1.3 Regra de Transição: Sucesso ou Falha (Sem Portais)
* **Sem portais manuais de volta nas fases.**
* O retorno ao Estúdio ocorre exclusivamente por dois gatilhos de State Machine:
  1. **Sucesso:** Atingimento do objetivo da fase ➔ Conquista do item místico ➔ Retorno comemorativo ao Estúdio.
  2. **Falha:** Condição de derrota ➔ Retorno ao Estúdio sem o item para nova tentativa.

---

## 2. Detalhamento das Fases & Mecânicas

---

### 🐐 FASE 1: O Ataque do Chupa-Cabra
* **Moitas 100% Homogêneas:** Todas as moitas possuem visual idêntico em xilogravura. O conteúdo só se revela ao interagir com `E`:
  - **Moitas de Cactos:** Causam dano (-1 HP) e fazem o herói **gritar involuntariamente de dor**.
  - **Moitas de Frutas (Umbu/Mandacaru):** Recuperam a vida do herói (+1 HP).
  - **Moitas com Itens:** Escondem a **Corda de Laçar** ou o **Candeeiro**.
* **Comportamento dos Bodes & Resposta ao Som:**
  - **Aboio:** Faz o bode andar um pouco (deslocamento suave).
  - **Grito:** Faz o bode correr rápido procurando outra moita para se esconder.
  - **Bode Atacado:** Grita de pavor ao sofrer ataque, espantando bodes próximos.
* **Comportamento do Chupa-Cabra ao Som:**
  - **Aboio:** Ignora completamente.
  - **Grito:** Foge imediatamente para o mais longe possível por 3 segundos antes de retomar a caça.
  - Cada bode possui barra individual de HP. Se 1 bode morrer ➔ **Falha**.
* **Vitória:** Resgatar os 4 bodes no curral ➔ **🪓 Carimbo Mágico**.

---

### 🌿 FASE 2: A Fazenda da Cumade Fulozinha
* **Passagens Espaçosas & Vãos Livres:** Corredores e vãos entre paredes desenhados com largura suficiente para travessia desimpedida.
* **Sistema de 3 Vidas & Quedas:**
  - **Tropeço na Pedra:** Ao pisar na pedra no Lote 0, o herói **cai e perde 1 vida (-1 HP)** com diálogo cômico.
  - **Cadarços Amarrados pela Fulô:** Ao colidir com a Fulô, o herói **cai e perde 1 vida (-1 HP)** (*"A Cumade amarrou seus cadarços!"*), ganhando invulnerabilidade temporária.
  - **Perda de Vidas:** Ao zerar as 3 vidas (HP = 0) ➔ Retorno ao Estúdio (Falha).
* **Topologia Fechada de Lotes & Paredes Perimétricas:**
  - Paredes sólidas de limite ao redor de cada lote, abertas apenas nas conexões oficiais:
    * **Lote 0:** Conexão à direita com **Lote 2a** (Pedra da botija na saída no mesmo local da F4).
    * **Lote 2a:** Conexão acima com **Lote 1a**, abaixo com **Lote 3a**, à direita com **Lote 2b**.
    * **Lote 1a:** Conexão à direita com **Lote 1b**.
    * **Lote 3a:** Conexão à direita com **Lote 3b**.
    * **Lote 2b:** Conexão acima com **Lote 1b**, abaixo com **Lote 3b**.
  - **Labirintos Densos & Espaçosos:** Múltiplas paredes internas e passagens dinâmicas que equilibram desafio de labirinto com trânsito livre.
  - **Física da Cumade:** A Fulô **NÃO atravessa paredes sólidas**, movendo-se apenas por caminhos livres e portões abertos.
* **Objetivo:** Fumo de rolo na moita do Lote 1b; entregar à Cumade no Lote 3b ➔ **📄 Página Rasgada**.

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha (Casas Interiores, Palco Central, Quadros em Arco & Timer)
* **Palco Central dos Violeiros:** Declamam 9 estrofes poéticas do repente no centro da praça.
* **Quadros Ampliados em Arco:** Bodega dos Moradores, Bebidas, Fumos e Curral de Animais distribuídos em arco ampliado na base da praça.
* **Emojis Autênticos de Animais & Café:** Bode (🐐), Galo (🐓), Tatu (🦔), Cavalo (🐎), Canário (🐤) com ícones fiéis, e representação nítida de Café.
* **Captura Universal (`E`):** Bebidas, fumos, moradores bêbados e animais são capturados e soltos com a tecla `E` (1 elemento carregado por vez).
* **Telas Interiores das Casas:** Cruzar a porta de qualquer casa transporta o jogador para a tela do interior daquela casa.
* **Transição Segura & Anti-Loop:** Ao sair da casa, o herói é posicionado com margem de segurança abaixo da porta (`y + 110px`) com cooldown de transição de 0.6s, eliminando reentradas em loop.
* **Depósito & Remoção:**
  - Apertar `E` dentro da casa deposita o elemento carregado.
  - Apertar `E` próximo a um elemento já depositado o recaptura.
  - **Grito de Limpeza (`Espaço`):** Gritar dentro de uma casa expulsa todos os elementos dela de volta para suas respectivas mesas.
* **Soltura Externa:** Soltar qualquer elemento fora de casas faz com que retorne automaticamente à mesa/curral de origem.
* **Timer de 5 Minutos (300s):** Se o tempo esgotar, a Rasga-Mortalha espalha mau agouro na vila, exibe tela de falha e retorna ao estúdio.
* **Grito da Rasga-Mortalha (a cada 30s):** Som característico de tecido rasgando a cada 30 segundos.
* **Folheto de Vitória:** Exibido em tela cheia ao completar as 5 casas ➔ **🪶 Pena Encantada**.

---

### 🏺 FASE 4: A Botija de Mané Monteiro (Assobios, Inversão & Ciclo da Fulô)
* **Inversão de Controles nos Assobios:** Assobios periódicos da Cumade Fulozinha na Fase 4 provocam alternância de portões e inversão de controles idêntica à Fase 2.
* **Ciclo Espacial da Fulô (5s / 3s):** Surge em posição aleatória no lote visitado pelo jogador, persegue por 5.0 segundos respeitando paredes sólidas, desaparece por 3.0 segundos e ressurge em outra posição aleatória do lote.
* **Santuário da Igreja:** A Cumade Fulozinha **NÃO CONSEGUE ENTRAR** no Lote da Igreja.
* **Escuridão Total & Candeeiro:** Área de visão curta no escuro; visão ampliada ao encontrar o Candeeiro em moita com diálogo modal.
* **Ciclo:** Spawn na Igreja ➔ Ir ao Lote 0 desenterrar a botija (-25% vel) ➔ Retornar à Igreja e entregar ao Beato ➔ **🖋️ Tinta Encantada**.

---

### 🏆 FASE FINAL: A Prensa do Destino & Vitória
1. Destravada com os 4 itens místicos e 4 cordéis pendurados.
2. Digitação do **Nickname**.
3. Prensagem e abertura da porta mística com exibição da capa oficial do cordel.

---
*GDD Canônico atualizado para a Onda 4 de Correções.*
