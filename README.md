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

### 🐐 1. O Ataque do Chupa-Cabra (Pastoreio, Moitas & Defesa)
* **Objetivo:** Salvar **4 bodes** e trancá-los no curral central antes que o Chupa-Cabra drene sua vida.
* **Mecânicas Principais:**
  - **Mapa Amplo & Câmera:** Cenário expandido com câmera que acompanha o jogador.
  - **Moitas & Itens:** Os bodes se escondem em moitas. Interagir com moitas permite encontrar a **Corda** e o **Candeeiro**.
  - **Aboiar vs. Gritar:** Aboiar faz o bode sair e afasta um pouco; Gritar espanta o bode para procurar outra moita e afasta o Chupa-Cabra.
  - **Vida dos Bodes:** Cada bode possui barra de HP individual. Se 1 bode morrer ➔ **Falha** (volta ao estúdio).
* **Recompensa (Sucesso):** 🪓 **Carimbo Mágico**.

### 🌿 2. A Fazenda da Cumade Fulozinha (6 Lotes em Telas Individuais & Portões)
* **Objetivo:** Encontrar o fumo de rolo na moita do **Lote 1b** e entregá-lo como oferenda à Cumade Fulozinha no **Lote 3b**. (Não existe Lote 3c).
* **Mecânicas Principais:**
  - **Telas Individuais de Lotes:** O mapa é composto por 6 lotes (`Lote 0, 1a, 1b, 2a, 2b, 3a, 3b`). Ao iniciar no Lote 0, a tela exibe apenas o Lote 0.
  - **Portões Internos com Colisão:** Portões abrem e fecham com assobios — permitem passagem quando abertos e bloqueiam quando fechados.
  - **Pedra da Botija:** Localizada **exclusivamente na saída do Lote 0** para o Lote 2a.
  - **Caça & Assobios:** No Lote 3b, a Cumade caça o jogador e intensifica os assobios (inversão de controles).
  - **Colisão:** Com fumo ➔ **Sucesso** (ganha a Página); Sem fumo ➔ **Falha** (expulso ao estúdio).
* **Recompensa (Sucesso):** 📄 **Página / Folha Rasgada**.

### 🦉 3. A Pena da Rasga-Mortalha (Dedução Lógica com Pistas Estrofe a Estrofe)
* **Objetivo:** Ler as pistas poéticas estrofe a estrofe, preencher a matriz do vilarejo arrastando os itens soltos para as 5 casas corretas e recolher a pena.
* **Mecânicas Principais:**
  - **Paginação de Pistas por Clique:** As 9 estrofes em cordel aparecem uma a uma na tela, avançando com clique.
  - **Drag-and-Drop:** O jogador arrasta todos os itens para as casas antes de investigar.
  - **Validação:** Qualquer erro ➔ **Falha** (volta ao estúdio); 100% correto (Casa 4 Verde / Ferrador do Tatu) ➔ **Sucesso** (conquista a pena).
* **Recompensa (Sucesso):** 🪶 **Pena Encantada**.

### 🏺 4. A Botija de Mané Monteiro (Lote da Igreja, Stealth Noturno & Caça Global)
* **Objetivo:** Iniciar no novo **Lote da Igreja** (zona segura à direita do 1b), cruzar a fazenda até o Lote 0, desenterrar a botija e retornar à Igreja.
* **Mecânicas Principais:**
  - **Novo Lote da Igreja (Santuário):** O jogador inicia na Igreja; a Cumade **NÃO consegue entrar** neste lote.
  - **Caça Global da Cumade:** Nos demais lotes, a entidade atravessa livremente entre as telas. Sem fumo, se alcançar o jogador ➔ **Falha**.
  - **Escuridão & Candeeiro:** Visão limitada ao círculo de luz do Candeeiro.
  - **Peso do Ouro:** Redução de velocidade ao carregar a botija pesada.
* **Recompensa (Sucesso):** 🖋️ **Tinta Encantada**.

### 🏆 Encerramento & Vitória
Somente após reunir os **4 itens místicos**, o jogador interage com a prensa, digita seu **Nickname** e estampa a capa do seu cordel:  
> **"O Cordel de [Nickname]: O Herói do Sertão"**

---

## 🚀 Diretriz de Desenvolvimento: Abordagem MVP First

1. **Protótipo em Formas Geométricas com Legendas:**
   - Jogador = `[HEROI]`, Bodes = `[BODE]`, Chupa-Cabra = `[CHUPA-CABRA]`, Moitas = `[MOITA]`, Igreja = `[IGREJA]`.
2. **Validação do Core Loop:**
   - Teste da colisão ativa de portões na Fase 2 e pedra única no Lote 0.
   - Teste da navegação de estrofes de cordel na Fase 3.
   - Teste do Lote da Igreja seguro e rota completa da Fase 4.

---
*Documentação oficial mantida pela equipe XIUD para a Tungão GameJam 2024.*
