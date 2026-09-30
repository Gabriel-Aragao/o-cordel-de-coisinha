import './style.css';
import { GameEngine } from './engine/GameEngine';
import { SceneId } from './engine/types';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element não encontrado');
    return;
  }

  const fpsDisplay = document.getElementById('fps-display');
  const sceneDisplay = document.getElementById('scene-display');
  const itemCarimbo = document.getElementById('item-carimbo');
  const itemFolha = document.getElementById('item-folha');
  const itemPena = document.getElementById('item-pena');
  const itemTinta = document.getElementById('item-tinta');

  const engine = new GameEngine(canvas);

  const sceneLabels: Record<SceneId, string> = {
    STUDIO: '🏠 Estúdio de Xilogravura',
    STAGE_1_CHUPACABRA: '🐐 Fase 1: Chupa-Cabra',
    STAGE_2_FULOZINHA: '🌿 Fase 2: Cumade Fulozinha',
    STAGE_3_RASGAMORTALHA: '🦉 Fase 3: Rasga-Mortalha',
    STAGE_4_BOTIJA: '🏺 Fase 4: Botija de Mané',
    VICTORY: '🏆 Clímax & Vitória'
  };

  // Sincronização reativa com elementos do DOM
  engine.onStateChange = (eng) => {
    if (fpsDisplay) fpsDisplay.textContent = `FPS: ${eng.fps}`;
    if (sceneDisplay) sceneDisplay.textContent = `Cena: ${sceneLabels[eng.currentSceneId] || eng.currentSceneId}`;

    // Atualiza badges de inventário
    if (itemCarimbo) {
      itemCarimbo.className = `inv-badge ${eng.inventory.carimbo ? 'unlocked' : 'locked'}`;
    }
    if (itemFolha) {
      itemFolha.className = `inv-badge ${eng.inventory.folha ? 'unlocked' : 'locked'}`;
    }
    if (itemPena) {
      itemPena.className = `inv-badge ${eng.inventory.pena ? 'unlocked' : 'locked'}`;
    }
    if (itemTinta) {
      itemTinta.className = `inv-badge ${eng.inventory.tinta ? 'unlocked' : 'locked'}`;
    }

    // Atualiza botões ativos na barra de debug
    document.querySelectorAll('.btn-debug').forEach((btn) => {
      btn.classList.remove('active');
    });
    const currentBtn = document.getElementById(
      `btn-scene-${eng.currentSceneId.toLowerCase().replace('stage_', 'stage').replace('_chupacabra', '1').replace('_fulozinha', '2').replace('_rasgamortalha', '3').replace('_botija', '4')}`
    );
    if (currentBtn) {
      currentBtn.classList.add('active');
    }
  };

  // Botões de navegação rápida (Debug)
  const bindSceneButton = (btnId: string, sceneId: SceneId) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        engine.switchScene(sceneId);
      });
    }
  };

  bindSceneButton('btn-scene-studio', 'STUDIO');
  bindSceneButton('btn-scene-stage1', 'STAGE_1_CHUPACABRA');
  bindSceneButton('btn-scene-stage2', 'STAGE_2_FULOZINHA');
  bindSceneButton('btn-scene-stage3', 'STAGE_3_RASGAMORTALHA');
  bindSceneButton('btn-scene-stage4', 'STAGE_4_BOTIJA');
  bindSceneButton('btn-scene-victory', 'VICTORY');

  // Inicializa e inicia o motor
  engine.start();
  console.log('🎮 O Cordel de Coisinha Game Engine iniciado com sucesso a 60 FPS.');
});
