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

### 1.2 Sistema Global de Diálogos & Controles
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
* **Topologia Fechada de Lotes & Paredes Perimétricas:**
  - Paredes sólidas de limite ao redor de cada lote, abertas **apenas nas conexões oficiais**:
    * **Lote 0:** Conexão à direita com **Lote 2a** (Pedra da botija na saída).
    * **Lote 2a:** Conexão acima com **Lote 1a**, abaixo com **Lote 3a**, à direita com **Lote 2b**.
    * **Lote 1a:** Conexão à direita com **Lote 1b**.
    * **Lote 3a:** Conexão à direita com **Lote 3b**.
    * **Lote 2b:** Conexão acima com **Lote 1b**, abaixo com **Lote 3b**.
  - Labirintos internos com mais paredes e portões dinâmicos alternantes.
  - **Física da Cumade:** A Fulô **NÃO atravessa paredes sólidas**, movendo-se apenas por caminhos livres e portões abertos.
* **Objetivo:** Fumo de rolo na moita do Lote 1b; entregar à Cumade no Lote 3b ➔ **📄 Página Rasgada**.

---

### 🦉 FASE 3: A Pena da Rasga-Mortalha (Layout Amplo & Ciclo de Mesas)
* **2 Violeiros no Canto Inferior Esquerdo:** Violeiro 1 declama 4 estrofes; Violeiro 2 declama 5 estrofes sob interação (`E` release).
* **5 Casas em Arco:** Posicionadas na parte superior sob o voo da ave.
* **Mesas & Curral Ampliados:**
  1. **Mesa dos Moradores:** Moradores bêbados dizem sua profissão ao levantar e devem ser **empurrados** até suas casas. Parar antes da casa retorna o bêbado à mesa; dentro da casa, não sai mais.
  2. **Mesa das Bebidas & Fumos:** Pegar da mesa faz o item sumir dela. Soltar fora da casa retorna à mesa; soltar na casa fixa o item nela.
  3. **Área dos Animais:** Laçar com Corda ou tanger até a casa. Parar antes da casa retorna o animal ao curral; dentro da casa, não sai mais.
* **Vitória:** Organização correta da vila ➔ **🪶 Pena Encantada**.

---

### 🏺 FASE 4: A Botija de Mané Monteiro
* **Santuário da Igreja:** A Cumade Fulozinha **NÃO CONSEGUE ENTRAR** no Lote da Igreja.
* **Escuridão Total & Candeeiro:** Área de visão curta no escuro; visão ampliada ao encontrar o Candeeiro em moita.
* **Portões Alternantes & Inversão:** Mantidos em todos os lotes.
* **Física da Fulô:** Respeita paredes sólidas e não atravessa obstáculos.
* **Ciclo:** Spawn na Igreja ➔ Ir ao Lote 0 desenterrar a botija (-25% vel) ➔ Retornar à Igreja e entregar ao Beato ➔ **🖋️ Tinta Encantada**.

---

### 🏆 FASE FINAL: A Prensa do Destino & Vitória
1. Destravada com os 4 itens místicos e 4 cordéis pendurados.
2. Digitação do **Nickname**.
3. Prensagem e abertura da porta mística com exibição da capa oficial do cordel.

---
*GDD Canônico atualizado para a Onda 4 de Correções.*
