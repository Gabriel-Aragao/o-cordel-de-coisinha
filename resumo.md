# 📜 O Cordel de Coisinha: O Herói do Sertão

## 📖 Prólogo
Coisinha vai a uma feira de cordéis e visita alguns artistas locais. Ao entrar em uma das tendas, o vendedor lhe oferece um folheto especial: *"Os Contos..."*. O cordel está com as páginas em branco, mas subitamente o desenho de um personagem começa a se formar no papel: é o próprio Coisinha sendo traçado em xilogravura! 

O vendedor desaparece no ar. O cordel que Coisinha segurava cai no chão... cai porque seus próprios braços sumiram! Coisinha começa a se desvanecer e tudo ao redor fica completamente escuro.

Ele acorda no chão de terra batida de um **Estúdio de Xilogravura Místico**, com cordéis espalhados pelo chão. Há uma grande porta de madeira entalhada no estúdio, porém trancada com a seguinte inscrição:
> *"Só heróis têm a chave."*

Ao se virar para procurar outra saída, Coisinha pisa sobre o primeiro cordel encantado no chão e é transportado magicamente para a primeira história: **"O Ataque do Chupa-Cabra"**.

---

## 🎭 Sistema Global de Diálogos & Controles de Interação

### 1. Diálogo Canônico de Censura (1ª Interação com NPCs):
* A primeira vez que o jogador interage com qualquer NPC falante (**Fazendeiro, Padre/Beato, Violeiros, Bêbados/Moradores**):
  - **NPC:** *"Opa, forasteiro! Qual é o seu nome?"*
  - **Jogador:** *"Meu nome é @#$!*&%#!"* *(com som cômico de erro/glitch/censura)*
  - **NPC:** *"Entendi foi nada!"*
* **Todas as falas subsequentes:** O NPC passa a chamar o personagem exclusivamente de **"Coisinha"** (ex: *"Então, Coisinha. Meus bodes não apareceram ainda..."*).
* **Dicas de Gameplay:** Personagens-chave (dono do curral, padre, violeiros) fornecem dicas claras dos objetivos da fase.
* **Avanço de Diálogos por Release da Tecla `E`:**
  - As mensagens de diálogo **NÃO disparam em repetição contínua (autofire)**. Cada mensagem avança estritamente no evento de soltar (`keyUp` / release) da tecla `E` ou clique único.

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

### Sistema de 3 Vidas, Moitas de Espinhos e Frutas:
* O sistema de **3 vidas (HP)**, **moitas de espinhos / cactos** (-1 HP + grito involuntário de dor) e **moitas de frutas regionais** (+1 HP) é **mantido e ativo nas Fases 2 e 4**.

### Topologia Rigorosa, Labirintos Densos & Corredor da Pedra:
* Paredes de contorno sólidas ao redor de cada lote, com passagens abertas apenas nas conexões oficiais:
  * **Lote 0:** Conexão à direita com **Lote 2a**.
    - **Pedra da Botija em Corredor Estreito:** A pedra fica posicionada obrigatoriamente no meio de um corredor estreito de passagem para o Lote 2a, fazendo o herói tropeçar nela na saída e na reentrada.
    - **Sem Legenda Textual na Pedra:** A pedra não possui texto/legenda fixa.
    - **Diálogos Cômicos de Tropeço:** Ao passar por cima e tropeçar na pedra, exibe uma das falas aleatórias:
      * *"Coisinha, tropeçou!"*
      * *"Coisinha vai arrancar um dedo!"*
      * *"Coisinha tá adivinhando butija!"*
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

* **Labirintos Mais Complexos:** Maior quantidade de paredes internas em cada lote, com mais passagens alternantes (portões dinâmicos que abrem e fecham com os assobios) e maior densidade de moitas.
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

## 🦉 Fase 3: A Pena da Rasga-Mortalha (Espaço Ampliado & Ciclo de Transporte)

### 1. Layout Amplo & 2 Violeiros:
* Mesas dos bêbados, bebidas, fumos e o curral dos animais são **significativamente maiores** para facilitar o trânsito do personagem.
* **2 Violeiros no Canto Inferior Esquerdo:** Violeiro 1 declama as primeiras 4 estrofes; Violeiro 2 declama as 5 estrofes finais sob interação (`E` release).
* **5 Casas em Arco:** Posicionadas na parte superior sob o voo da ave.

### 2. Regras de Transporte e Fixação:
* **Bebidas e Fumos:**
  - Ao pegar um item da mesa, ele **desaparece da mesa** e é carregado pelo herói.
  - Soltar o item **fora de uma casa** faz com que ele **retorne automaticamente para sua posição na mesa**.
  - Soltar o item **dentro de uma casa** fixa o item na casa (não volta mais para a mesa).
* **Moradores Bêbados:**
  - Interagir faz o bêbado levantar e dizer sua profissão. O jogador o empurra até sua respectiva casa.
  - Parar de empurrar o bêbado antes de colocá-lo na casa faz com que ele **retorne à mesa**.
  - Uma vez dentro da casa correta, o morador **não sai mais**.
* **Animais do Curral:**
  - **Com Corda:** Laça e conduz o animal.
  - **Sem Corda:** Tange o animal até a casa.
  - Parar de tanger o animal antes de entrar na casa faz com que ele **retorne ao curral**.
  - Uma vez dentro da casa, o animal **não sai mais**.
* **Desfecho:** Todas as casas preenchidas corretamente ➔ A ave entrega a **🪶 Pena Encantada** ➔ **Sucesso**!

---

## 🏆 Fase Final: A Prensa do Destino & Capa Oficial
* Destravada com os 4 itens. O jogador insere seu **Nickname**, aciona a prensa e gera a capa oficial de xilogravura.
