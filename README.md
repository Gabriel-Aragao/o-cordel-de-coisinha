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

1. **Diálogo de Censura na 1ª Interação com NPCs:**
   - Ao conversar pela primeira vez com qualquer NPC (**Fazendeiro, Padre/Beato, Violeiros, Bêbados**), o NPC pergunta seu nome. O herói responde `"meu nome é @#$!*&%#!"` acompanhado de um som cômico de erro/censura. O NPC responde: `"Entendi foi nada!"`.
   - Nas próximas falas, os NPCs chamam-no exclusivamente de **"Coisinha"** e oferecem dicas contextuais para vencer cada fase.
   - **Avanço no Release (`keyUp`) da tecla `E`:** Cada mensagem avança estritamente ao soltar a tecla, sem autofire acelerado.
2. **Obtenção da Corda & Candeeiro:** Encontrados exclusivamente vasculhando moitas na caatinga.
3. **Telas de Abertura & Encerramento:** Cada fase possui tela introdutória com a narrativa do cordel e tela de vitória exibindo o **Item Místico** resgatado.
4. **Controles Universais:** O comando de **Grito** (`Espaço`) e **Interação** (`E`) funcionam em todas as cenas do jogo.

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
  - **Cactos vs. Frutas:** Cactos causam dano (-1 HP) e grito involuntário de dor; Frutas recuperam vida.
  - **Grito dos Bodes:** Bodes atacados berram de pavor, assustando e dispersando bodes vizinhos.
  - **Vida dos Bodes:** Morte de 1 bode ➔ **Falha**.
* **Recompensa (Sucesso):** 🪓 **Carimbo Mágico**.

### 🌿 2. A Fazenda da Cumade Fulozinha (Labirintos Complexos & Portões)
* **Objetivo:** Encontrar o fumo de rolo na moita do **Lote 1b** e entregá-lo como oferenda à Cumade Fulozinha no **Lote 3b**.
* **Mecânicas Principais:**
  - **Paredes Perimétricas Sólidas:** Conexões abertas estritamente nos trajetos canônicos.
  - **Labirintos Internos com Portões Alternantes:** Portões dinâmicos bloqueiam rigidamente quando fechados e liberam passagem quando abertos.
  - **Física da Cumade:** A Fulô **NÃO atravessa paredes**, movendo-se apenas por corredores livres e portões abertos.
* **Recompensa (Sucesso):** 📄 **Página / Folha Rasgada**.

### 🦉 3. A Pena da Rasga-Mortalha (Espaço Amplo, Violeiros & Ciclo de Mesas)
* **Objetivo:** Ouvir os 2 violeiros, empurrar moradores bêbados, transportar bebidas e fumos e conduzir os animais até as 5 casas em arco.
* **Mecânicas Principais:**
  - **2 Violeiros (Canto Inferior Esquerdo):** Violeiro 1 declama 4 estrofes; Violeiro 2 declama as 5 estrofes finais.
  - **Mesas & Curral Ampliados:** Maior área para manobras do personagem.
  - **Transporte de Bebidas/Fumos:** Ao pegar da mesa, o item some dela. Soltar fora da casa retorna o item à mesa; soltar dentro da casa fixa o item nela.
  - **Fixação de Bêbados e Animais:** Parar de conduzir antes da casa retorna à mesa/curral; uma vez dentro da casa, não saem mais.
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
