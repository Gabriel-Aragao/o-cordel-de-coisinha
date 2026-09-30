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

## 🎭 Sistema Canônico de Diálogos & Telas de Apresentação

1. **Diálogo de Censura na 1ª Interação com NPCs:**
   - Ao conversar pela primeira vez com qualquer NPC (**Fazendeiro, Padre/Beato, Violeiros, Bêbados**), o NPC pergunta seu nome. O herói responde `"meu nome é @#$!*&%#!"` acompanhado de um som cômico de erro/censura. O NPC responde: `"Entendi foi nada!"`.
   - Nas próximas falas, os NPCs chamam-no exclusivamente de **"Coisinha"** e oferecem dicas contextuais para vencer cada fase.
2. **Telas de Abertura & Encerramento:** Cada fase possui tela introdutória com a narrativa do cordel e tela de vitória exibindo o **Item Místico** resgatado.
3. **Controles Universais:** O comando de **Grito** (`Espaço`) e **Interação** (`E`) funcionam em todas as cenas do jogo.

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

### 🐐 1. O Ataque do Chupa-Cabra (Pastoreio, Cactos, Frutas & Moitas)
* **Objetivo:** Salvar **4 bodes** e trancá-los no curral central antes que o Chupa-Cabra drene sua vida.
* **Mecânicas Principais:**
  - **Mapa Amplo & Câmera:** Cenário expandido com câmera que acompanha o jogador.
  - **Moitas com Cactos & Frutas:** Cactos causam dano e fazem o herói gritar de dor involuntariamente; Frutas regionais (Umbu/Mandacaru) recuperam a vida. Moitas também escondem a **Corda** e o **Candeeiro**.
  - **Grito dos Bodes:** Bodes atacados pelo Chupa-Cabra berram de pavor, assustando outros bodes soltos ou em arbustos.
  - **Vida dos Bodes:** Cada bode possui barra de HP individual. Se 1 bode morrer ➔ **Falha**.
* **Recompensa (Sucesso):** 🪓 **Carimbo Mágico**.

### 🌿 2. A Fazenda da Cumade Fulozinha (Topologia Fechada de Lotes)
* **Objetivo:** Encontrar o fumo de rolo na moita do **Lote 1b** e entregá-lo como oferenda à Cumade Fulozinha no **Lote 3b**. (Não existe Lote 3c).
* **Mecânicas Principais:**
  - **Paredes Perimétricas:** Cada lote é fechado ao redor, com aberturas estritas nas conexões oficiais:
    * Lote 0 ➔ dir Lote 2a (Pedra da botija na saída).
    * Lote 2a ➔ cima Lote 1a, baixo Lote 3a, dir Lote 2b.
    * Lote 1a ➔ dir Lote 1b.
    * Lote 3a ➔ dir Lote 3b.
    * Lote 2b ➔ cima Lote 1b, baixo Lote 3b.
  - **Portões Internos com Colisão:** Portões dinâmicos bloqueiam quando fechados e liberam quando abertos com o assobio.
* **Recompensa (Sucesso):** 📄 **Página / Folha Rasgada**.

### 🦉 3. A Pena da Rasga-Mortalha (2 Violeiros, 5 Casas em Arco & 4 Mesas)
* **Objetivo:** Ouvir as sextilhas dos 2 violeiros, empurrar os moradores bêbados, transportar bebidas e fumos, e conduzir os animais até as 5 casas corretas em arco.
* **Mecânicas Principais:**
  - **2 Violeiros no Canto Inferior Esquerdo:** Violeiro 1 declama 4 estrofes; Violeiro 2 declama as 5 estrofes restantes sob interação.
  - **5 Casas em Arco:** Posicionadas na parte superior sob o voo da ave.
  - **4 Mesas Interativas:**
    1. *Moradores Bêbados:* Falam a profissão ao levantar e devem ser empurrados até a casa.
    2. *Bebidas:* Pegar e levar à casa.
    3. *Fumos:* Pegar e depositar na casa.
    4. *Animais:* Laçar com Corda ou tanger até a casa (só saem se o herói gritar).
* **Recompensa (Sucesso):** 🪶 **Pena Encantada**.

### 🏺 4. A Botija de Mané Monteiro (Lote da Igreja, Stealth Noturno & Caça Global)
* **Objetivo:** Iniciar no **Lote da Igreja** (santuário à direita do 1b onde a Cumade não entra), cruzar a fazenda até o Lote 0, desenterrar a botija e retornar à Igreja.
* **Mecânicas Principais:**
  - **Conexão Especial:** Abertura da porteira do Lote 1b para a Igreja (ativa apenas na Fase 4).
  - **Caça Global da Cumade:** Nos lotes da fazenda a entidade persegue livremente.
  - **Escuridão & Candeeiro:** Visão restrita ao círculo dinâmico de luz.
* **Recompensa (Sucesso):** 🖋️ **Tinta Encantada**.

### 🏆 Encerramento & Vitória
Somente após reunir os **4 itens místicos**, o jogador interage com a prensa, digita seu **Nickname** e estampa a capa do seu cordel:  
> **"O Cordel de [Nickname]: O Herói do Sertão"**

---
*Documentação oficial mantida pela equipe XIUD para a Tungão GameJam 2024.*
