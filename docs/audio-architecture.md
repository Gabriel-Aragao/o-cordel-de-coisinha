# 🎵 Arquitetura de Áudio e Sonoplastia Interativa — O Cordel de Coisinha

## 1. Visão Geral e Filosofia de Design
Desenvolvido por **Koji (@koji)** para a squad de Game JAM da equipe XIUD, o subsistema de áudio de *O Cordel de Coisinha* combina a riqueza da música folclórica nordestina (Baião, Forró, Arrasta-pé, Xaxado e Toadas) com a estética e economia do **Chiptune 8-bit procedural** sintetizado diretamente via **Web Audio API**.

### Vantagens Chave:
- **Zero Latência & Zero Dependências:** 100% sintetizado em tempo real no navegador, sem necessidade de carregar arquivos de áudio pesados via rede (.mp3/.wav).
- **Carregamento Instantâneo:** Inicialização imediata respeitando as políticas modernas de autoplay dos navegadores (ativação no primeiro gesto do usuário).
- **State Audio Reativo:** Modulação dinâmica de tensão, BPM e camadas harmônicas/percussivas conforme os acontecimentos in-game.

---

## 2. Estrutura de Módulos (`src/audio/`)

```
src/audio/
├── types.ts           # Interfaces, tipos de trilhas (BGMTrackId), SFX (SFXName) e SoundManager
├── SFXSynth.ts        # Sintetizador procedural de efeitos sonoros folclóricos (ADSR, FM/AM, ruído filtrado)
├── MusicTracker.ts    # Sequenciador chiptune de 4 canais (Lead, Harmonia, Baixo Zabumba, Percussão)
└── SoundManager.ts    # Fachada principal gerenciando AudioContext, volumes, transições e reatividade
```

---

## 3. Catálogo de Efeitos Sonoros Procedurais (`SFXSynth.ts`)

| Efeito Sonoro | Método | Síntese / Características Acústicas |
| :--- | :--- | :--- |
| **Aboio Tradicional** | `playAboio(duration)` | Canto ondulado de vaqueiro nordestino (*"Êeee-ôoooo"*) com vibrato de 5.5Hz, escala modal dórica sertaneja e portamento suave. |
| **Grito de Espantar** | `playGrito()` | Grito gutural agudo com queda rápida de frequência (750Hz a 180Hz) modulado por ruído e LFO de 30Hz. |
| **Berro dos Bodes** | `playBerroBode(scared)` | Balido caprino trêmulo (*"Bééé-é-é"*) com modulação AM/FM de 14-18Hz e filtro formante nasal. |
| **Rosnado do Chupa-Cabra** | `playChupaCabraRosnado()` | Rosnado cavernoso e ameaçador em baixa frequência (45-75Hz), sub-graves e distorção analógica. |
| **Assobio da Cumade** | `playCumadeAssobio(intensity)` | Assobio agudo sinoidal puro (1400Hz a 3100Hz) com glissando duplo, vibrato e linha de eco/reverb. |
| **Folhear de Cordel** | `playCordelFolhear()` | Estalo e farfalhar de papel artesanal xilográfico com duplo envelope percussivo e filtro passa-faixa. |
| **Badalo de Sino** | `playSinoBadalo()` | Sino de capela sertaneja com 7 harmônicos não-inteiros inharmônicos e decaimento longo ressonante. |
| **Impacto da Prensa** | `playPrensaImpacto()` | Batida pesada de prensa de xilogravura: sub-bass thump (140Hz -> 32Hz) + estalo seco de madeira e metal. |
| **Chicote de Cipó** | `playChicote()` | Chicotada cortante da Cumade Fulozinha com transiente rápido e corte de alta frequência. |
| **Coleta de Item** | `playPickup()` | Arpeggio pentatônico brilhante e triunfal (D5, F#5, A5, D6). |
| **Item Descoberto** | `playItemDescobrir()` | Shimmer místico de descoberta em moitas (E5, G#5, B5, E6). |
| **Passos na Terra** | `playPassos()` | Ruído abafado simulando passos em terra batida e poeira. |
| **Escavação da Botija** | `playEscavacao()` | Atrito arenoso de pá e ressonância cerâmica da botija de ouro. |
| **Grasnado Rasga-Mortalha** | `playRasgaCanto()` | Piado sinistro e agourento da coruja branca da meia-noite (1400Hz -> 650Hz). |
| **Jingles de Vitória/Derrota** | `playVictoryJingle()` / `playDefeatJingle()` | Fanfarra triunfal em Ré Maior sertanejo vs modinha fúnebre em Dó Menor. |

---

## 4. Composições Chiptune 8-Bit (`MusicTracker.ts`)

1. **Estúdio de Xilogravura (`STUDIO`):**
   - *Tema:* "O Baião da Xilogravura"
   - *Andamento:* 108 BPM | *Modo:* Dó/Ré Menor Dórico
   - *Clima:* Nostálgico, artesanal, aconchegante e misterioso.
2. **Fase 1: Chupa-Cabra (`STAGE1_CHUPACABRA`):**
   - *Tema:* "O Galope do Chupa-Cabra"
   - *Andamento:* 132 BPM | *Modo:* Mi Menor Frígio / Dórico
   - *Clima:* Corrida urgente e rítmica para pastorear e salvar o rebanho.
3. **Fase 2: Cumade Fulozinha (`STAGE2_FULOZINHA`):**
   - *Tema:* "O Mistério das Matas de Fulô"
   - *Andamento:* 118 BPM | *Modo:* Lá Menor com arpeggios ondulantes
   - *Clima:* Encantamento, suspense vegetal e alternância de portões.
4. **Fase 3: Rasga-Mortalha (`STAGE3_RASGAMORTALHA`):**
   - *Tema:* "A Toada da Meia-Noite"
   - *Andamento:* 98 BPM | *Modo:* Sol Dórico / Mixolídio
   - *Clima:* Dedilhado lírico de viola para leitura de estrofes e dedução do enigma.
5. **Fase 4: A Botija de Mané (`STAGE4_BOTIJA`):**
   - *Tema:* "A Botija e a Paróquia Sagrada"
   - *Andamento:* 124 BPM | *Modo:* Dó Menor Tenso
   - *Clima:* Tensão noturna fora da Igreja, alívio no Santuário e passos pesados com a botija.
6. **Clímax & Vitória (`VICTORY`):**
   - *Tema:* "O Grande Forró da Prensa Dourada"
   - *Andamento:* 140 BPM | *Modo:* Ré Maior Mixolídio Festivo
   - *Clima:* Forró apoteótico e comemorativo com estampa final do cordel do herói.

---

## 5. Controles e Acessibilidade
- **Botão de Áudio no HUD:** `🔊 Som: ON / 🔇 Som: OFF` permite controle instantâneo de mute.
- **Auto-Unlock:** Listener global nos eventos `click`, `keydown` e `touchstart` garante inicialização limpa do `AudioContext` sem avisos no console do navegador.
