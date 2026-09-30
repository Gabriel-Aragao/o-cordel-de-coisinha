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

## 🎭 Sistema Canônico de Diálogos & Controles

1. **Painel Dedicado Abaixo da Tela de Jogo:** Todas as mensagens, falas e toasts são exibidos em um painel inferior dedicado, localizado estritamente abaixo da área de gameplay, garantindo visibilidade 100% livre dos itens, cenários e personagens, com fila sequencial sem sobreposições e sem blocos estáticos de citações na tela.
2. **Ciclo de Vida e Desbloqueio dos Diálogos:** Ao terminar a última fala, o diálogo fecha imediatamente com a tecla `E`, consumindo o input e liberando a movimentação do personagem sem deixá-lo travado.
3. **Diálogo de Censura na 1ª Interação com NPCs:**
   - Ao conversar pela primeira vez com qualquer NPC (**Fazendeiro, Padre/Beato, Violeiros, Bêbados**), o NPC pergunta seu nome. O herói responde `"meu nome é @#$!*&%#!"` acompanhado de um som cômico de erro/censura. O NPC responde: `"Entendi foi nada!"`.
   - Nas próximas falas, os NPCs chamam-no exclusivamente de **"Coisinha"** e oferecem dicas contextuais para vencer cada fase.
   - **Avanço no Release (`keyUp`) da tecla `E`:** Cada mensagem avança estritamente ao soltar a tecla, sem autofire acelerado.
4. **Obtenção da Corda & Candeeiro:** Encontrados exclusivamente vasculhando moitas na caatinga.
5. **Telas de Abertura & Encerramento:** Cada fase possui tela introdutória com a narrativa do cordel e tela de vitória exibindo o **Item Místico** resgatado.
6. **Controles Universais:** O comando de **Grito** (`Espaço`) e **Interação** (`E`) funcionam em todas as cenas do jogo.

---

## 🚪 Regra Geral de Transição (Sem Portais)
* **Sem portais manuais de volta nas fases:** O jogador só retorna ao Estúdio de Xilogravura por **Sucesso** (cumprimento da missão e ganho do item) ou por **Falha** (morte de um bode, ser pego sem fumo pela criatura ou erro no enigma).

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

### 🐐 1. O Ataque do Chupa-Cabra (Moitas Homogêneas, Cactos & Frutas)
* **Objetivo:** Salvar **4 bodes** e trancá-los no curral central antes que o Chupa-Cabra drene sua vida.
* **Mecânicas Principais:**
  - **Moitas Idênticas:** Todas as moitas possuem visual exterior homogêneo de xilogravura. O conteúdo (Cactos, Frutas, Bodes, Corda ou Candeeiro) só é revelado ao interagir.
  - **Aboio vs. Grito para os Bodes:** O aboio faz o bode andar um pouco; o grito faz o bode correr em disparada procurando outra moita para se esconder.
  - **Aboio vs. Grito para o Chupa-Cabra:** O Chupa-Cabra ignora o aboio, mas o grito o afugenta por 3 segundos para o mais longe possível.
  - **Grito dos Bodes:** Bodes atacados berram de pavor, assustando e dispersando bodes vizinhos.
  - **Vida dos Bodes:** Morte de 1 bode ➔ **Falha**.
* **Recompensa (Sucesso):** 🪓 **Carimbo Mágico**.

### 🌿 2. A Fazenda da Cumade Fulozinha (Passagens Espaçosas, Queda na Pedra & Cadarços da Fulô)
* **Objetivo:** Encontrar o fumo de rolo na moita do **Lote 1b** e entregá-lo como oferenda à Cumade Fulozinha no **Lote 3b**.
* **Mecânicas Principais:**
  - **Passagens e Vãos Espaçosos:** Vãos e corredores calibrados para travessia livre sem colisões indesejadas.
  - **Tropeço com Dano na Pedra (Lote 0):** Ao pisar na pedra, o herói cai no chão e **perde 1 vida (-1 HP)** com diálogo cômico.
  - **Ataque da Fulô:** Ao ser pego sem fumo, o herói **cai e perde 1 vida (-1 HP)** (*"A Cumade amarrou seus cadarços!"*), com invulnerabilidade temporária.
  - **Derrota por Vidas (3 Vidas):** Se o HP zerar ➔ Retorno ao Estúdio (Falha).
* **Recompensa (Sucesso):** 📄 **Página / Folha Rasgada**.

### 🦉 3. A Pena da Rasga-Mortalha (Casas com Telas Interiores & Captura 'E')
* **Objetivo:** Ouvir os 2 violeiros, capturar os elementos com `E`, entrar fisicamente nas 5 casas e depositar cada item, morador e animal no interior correto.
* **Mecânicas Principais:**
  - **Captura Universal (`E`):** Bebidas, fumos, moradores e animais são capturados e soltos com a tecla `E`.
  - **Telas Interiores das Casas:** Entrar pela porta transporta o herói para o interior daquela casa para depositar com `E`.
  - **Remoção & Grito de Reset:** Capturar com `E` remove 1 item; Gritar (`Espaço`) dentro da casa expulsa todos os itens de volta para as mesas.
  - **Soltar Fora:** Soltar fora de casas retorna os itens às mesas de origem.
* **Recompensa (Sucesso):** 🪶 **Pena Encantada**.

### 🏺 4. A Botija de Mané Monteiro (Escuridão, Candeeiro & Santuário)
* **Objetivo:** Iniciar na Igreja (santuário seguro à direita do 1b), navegar pela fazenda no escuro até o Lote 0, desenterrar a botija e retornar à Igreja.
* **Mecânicas Principais:**
  - **Escuridão Total & Candeeiro:** Mapa escuro; raio de visão curto sem o Candeeiro e ampliado com o Candeeiro encontrado em moita.
  - **Portões Alternantes & Inversão de Controles:** Mantidos integralmente.
  - **Física da Fulô:** Respeita paredes sólidas e não entra no Santuário da Igreja.
* **Recompensa (Sucesso):** 🖋️ **Tinta Encantada**.

### 🏆 Encerramento & Vitória
Somente após reunir os **4 itens místicos**, o jogador interage com a prensa, digita seu **Nickname** e estampa a capa oficial:  
> **"O Cordel de [Nickname]: O Herói do Sertão"**

---
*Documentação oficial mantida pela equipe XIUD para a Tungão GameJam 2024.*
