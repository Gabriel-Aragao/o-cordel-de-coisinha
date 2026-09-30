# 📜 O Cordel de Coisinha: O Herói do Sertão

## 📖 Prólogo
Coisinha vai a uma feira de cordéis e visita alguns artistas locais. Ao entrar em uma das tendas, o vendedor lhe oferece um folheto especial: *"Os Contos..."*. O cordel está com as páginas em branco, mas subitamente o desenho de um personagem começa a se formar no papel: é o próprio Coisinha sendo traçado em xilogravura! 

O vendedor desaparece no ar. O cordel que Coisinha segurava cai no chão... cai porque seus próprios braços sumiram! Coisinha começa a se desvanecer e tudo ao redor fica completamente escuro.

Ele acorda no chão de terra batida de um **Estúdio de Xilogravura Místico**, com cordéis espalhados pelo chão. Há uma grande porta de madeira entalhada no estúdio, porém trancada com a seguinte inscrição:
> *"Só heróis têm a chave."*

Ao se virar para procurar outra saída, Coisinha pisa sobre o primeiro cordel encantado no chão e é transportado magicamente para a primeira história: **"O Ataque do Chupa-Cabra"**.

---

## 🎭 Sistema Global de Diálogos & Apresentação Narrativa

### 1. Diálogo Canônico de Censura (1ª Interação com NPCs):
* A primeira vez que o jogador interage com qualquer NPC falante do jogo (**Fazendeiro, Padre/Beato, Violeiros, Bêbados/Moradores**):
  - **NPC:** *"Opa, forasteiro! Qual é o seu nome?"*
  - **Jogador:** *"Meu nome é @#$!*&%#!"* *(com som cômico de erro/glitch/censura)*
  - **NPC:** *"Entendi foi nada!"*
* **Todas as falas subsequentes:** O NPC passa a chamar o personagem exclusivamente de **"Coisinha"** (ex: *"Então, Coisinha. Meus bodes não apareceram ainda..."*).
* **Dicas de Gameplay:** Personagens-chave (dono do curral, padre, violeiros) fornecem dicas claras dos objetivos da fase.

### 2. Telas de Apresentação e Encerramento de Fase:
* **Entrada na Fase:** Tela de introdução com a narrativa do conto em folheto de cordel.
* **Conclusão da Fase:** Tela de encerramento celebrando o sucesso, apresentando a narrativa de desfecho e exibindo o **Item Místico** conquistado.

### 3. Controles Universais:
* Os comandos de **Grito** (`Espaço` / Segurar) e **Interação** (`E` / Clique) funcionam universalmente em **todas as telas e fases do jogo**.
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

### Cenário Amplo, Moitas, Cactos e Frutas Regionais:
* Mapa expandido com câmera suave (*camera lerp*).
* **Vegetação Diversificada em Moitas:**
  - **Moitas de Cactos (Espinhos):** Ao tocar ou vasculhar, o jogador perde 1 barra de vida (HP) e **solta um grito involuntário de dor**.
  - **Moitas de Frutas Regionais (Umbu / Mandacaru):** Ao vasculhar, recuperam a barra de vida perdida.
  - **Moitas com Itens:** Escondem a **Corda de Laçar** e o **Candeeiro**.
  - **Moitas com Bodes:** Bodes escondidos.
* **Comportamento Sonoro dos Bodes & Reação em Cadeia:**
  - Ao serem atacados pelo Chupa-Cabra, os bodes **gritam de pavor**, espantando e afugentando outros bodes que estejam soltos ou escondidos em arbustos próximos.
  - **Aboio:** Faz o bode sair da moita e se afastar levemente.
  - **Grito:** Espanta o bode para procurar outra moita e afasta o Chupa-Cabra.
* **Condição de Vitória:** Resgatar os 4 bodes no curral ➔ Ganha o **🪓 Carimbo Mágico**.

---

## 🌿 Fases 2 e 4: A Fazenda da Cumade Fulozinha & A Botija de Mané Monteiro

### Topologia Rigorosa de Lotes & Paredes Perimétricas:
Cada lote possui **paredes de limite sólidas ao redor**, com passagens abertas **estritamente nas seguintes conexões**:
* **Lote 0:** Apenas 1 conexão à direita com o **Lote 2a**. (Pedra da botija na saída).
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

* **Labirintos Mais Complexos:** Mais paredes internas, portões que abrem/fecham com assobios (colisão rígida quando fechados) e maior densidade de moitas.
* **Fase 2:** Fumo de rolo na moita do Lote 1b; entregar à Cumade no Lote 3b ➔ **📄 Página Rasgada**.
* **Fase 4:** Início na Igreja (Santuário onde a Cumade não entra); desenterrar a botija no Lote 0 (-25% vel) e retornar à Igreja ➔ **🖋️ Tinta Encantada**.

---

## 🦉 Fase 3: A Pena da Rasga-Mortalha (Novo Espaço & Mecânicas Vivas)

### 1. Os 2 Violeiros do Repente (Canto Inferior Esquerdo):
* As estrofes poéticas do enigma **NÃO ficam no topo da tela**.
* São declamadas pelos **2 Violeiros** ao interagir com eles:
  - **Violeiro 1:** Declamador das **4 primeiras estrofes** do cordel.
  - **Violeiro 2:** Declamador das **5 estrofes finais** do cordel.

### 2. As 5 Casas em Arco & 4 Mesas de Montagem:
* **Casas:** Dispostas em **arco na parte superior** com a ave Rasga-Mortalha sobrevoando nos céus.
* **4 Mesas Interativas na Parte Inferior:**
  1. **Mesa dos Bêbados/Moradores:** Moradores embriagados ao redor da mesa. Ao interagir, o morador levanta e revela sua profissão. O jogador deve **empurrar fisicamente o bêbado** até a sua respectiva casa.
  2. **Mesa das Bebidas:** 5 garrafas/cabaças que o jogador pega individualmente e transporta até a casa certa.
  3. **Mesa dos Fumos:** 5 tipos de fumo/tabaco que o jogador pega e deposita na casa.
  4. **Área/Mesa dos Animais:** 5 animais sertanejos.
     - **Com Corda:** O jogador laça 1 animal por vez e o conduz amarrado até a casa.
     - **Sem Corda:** O jogador precisa **tanger o animal** até a casa.
     - **Regra de Saída do Animal:** Uma vez dentro da casa correta, o animal **só sai se o jogador der um grito**.

### Desfecho da Fase 3:
* Organização 100% correta das 5 casas ➔ A ave entrega a **🪶 Pena Encantada** ➔ **Sucesso**!

---

## 🏆 Fase Final: A Prensa do Destino & Capa Oficial
* Destravada com os 4 itens. O jogador insere seu **Nickname**, aciona a prensa e gera a capa:
  > **"O Cordel de [Nickname]: O Herói do Sertão"**
