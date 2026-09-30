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

### 1.2 Sistema Global de Diálogos & Telas Narrativas
* **Diálogo de Censura na 1ª Interação com NPCs:**
  - Primeira conversa com qualquer NPC falante (**Fazendeiro, Padre/Beato, Violeiros, Bêbados**):
    * NPC pergunta: *"Como é teu nome, forasteiro?"*
    * Jogador responde: `"Meu nome é @#$!*&%#!"` *(áudio de erro/censura)*
    * NPC reage: `"Entendi foi nada!"`
  - Todas as falas seguintes iniciam chamando o herói de **"Coisinha"** (ex: *"Então, Coisinha. Meus bodes sumiram..."*).
  - NPCs-chave (fazendeiro, padre) fornecem dicas claras dos objetivos de cada fase.
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
* **Ambiente & Câmera:** Cenário expandido de caatinga com rolagem de tela (*camera lerp*).
* **Moitas com Cactos e Frutas:**
  - **Moitas de Cactos:** Causam dano (-1 HP) e fazem o herói **gritar involuntariamente de dor**.
  - **Moitas de Frutas (Umbu/Mandacaru):** Recuperam a vida do herói.
  - **Moitas com Itens:** Escondem a **Corda de Laçar** e o **Candeeiro**.
* **Comportamento dos Bodes:**
  - Bodes atacados pelo Chupa-Cabra **gritam de pavor**, espantando bodes próximos.
  - **Aboio:** Faz o bode sair da moita e se afastar.
  - **Grito:** Espanta o bode para procurar outra moita e afugenta o predador.
  - Cada bode possui barra individual de HP. Se 1 bode morrer ➔ **Falha**.
* **Vitória:** Resgatar os 4 bodes no curral ➔ **🪓 Carimbo Mágico**.

---

### 🌿 FASE 2: A Fazenda da Cumade Fulozinha
* **Topologia Fechada de Lotes & Paredes Perimétricas:**
  - Paredes sólidas de limite ao redor de cada lote, abertas **apenas nas conexões oficiais**:
    * **Lote 0:** Apenas conexão à direita com **Lote 2a** (Pedra da botija na saída).
    * **Lote 2a:** Conexão acima com **Lote 1a**, abaixo com **Lote 3a**, à direita com **Lote 2b**.
    * **Lote 1a:** Conexão à direita com **Lote 1b**.
    * **Lote 3a:** Conexão à direita com **Lote 3b**.
    * **Lote 2b:** Conexão acima com **Lote 1b**, abaixo com **Lote 3b**.
  - Labirintos internos com portões dinâmicos (colisão sólida quando fechados) e moitas.
* **Objetivo:** Fumo de rolo na moita do Lote 1b; entregar à Cumade no Lote 3b ➔ **📄 Página Rasgada**.

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha (Violeiros, Casas em Arco & 4 Mesas)
* **2 Violeiros no Canto Inferior Esquerdo:**
  - As estrofes poéticas são declamadas sob interação com os violeiros:
    * **Violeiro 1:** Repete as 4 primeiras estrofes.
    * **Violeiro 2:** Repete as 5 estrofes finais.
* **5 Casas em Arco:** Dispostas na parte superior sob o voo da ave.
* **4 Mesas Interativas:**
  1. **Mesa dos Moradores:** Moradores bêbados dizem sua profissão ao levantar e devem ser **empurrados** até suas casas.
  2. **Mesa das Bebidas:** Transportar 1 a 1 para as casas.
  3. **Mesa dos Fumos:** Depositar nas casas.
  4. **Área dos Animais:** Laçar com Corda ou tanger (o animal só sai da casa se o jogador gritar).
* **Vitória:** Organização correta da vila ➔ **🪶 Pena Encantada**.

---

### 🏺 FASE 4: A Botija de Mané Monteiro
* **Santuário da Igreja:** A Cumade Fulozinha **NÃO CONSEGUE ENTRAR** no Lote da Igreja.
* **Conexão Especial:** Abertura da porteira do Lote 1b para a Igreja (ativa apenas na Fase 4).
* **Ciclo:** Spawn na Igreja ➔ Ir ao Lote 0 desenterrar a botija (-25% vel) sob perseguição global da Fulô ➔ Retornar à Igreja e entregar ao Beato ➔ **🖋️ Tinta Encantada**.

---

### 🏆 FASE FINAL: A Prensa do Destino & Vitória
1. Destravada com os 4 itens místicos e 4 cordéis pendurados.
2. Digitação do **Nickname**.
3. Prensagem e abertura da porta mística com exibição da capa oficial do cordel.

---
*GDD Canônico atualizado para a Onda 3 de Refinamentos Globais.*
