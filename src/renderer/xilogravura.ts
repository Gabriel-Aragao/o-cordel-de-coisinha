/**
 * ============================================================================
 * MOTOR GRÁFICO DE XILOGRAVURA 2D & PAPEL KRAFT
 * O CORDEL DE COISINHA — IDENTIDADE VISUAL FOLCLÓRICA NORDESTINA
 * 
 * Arte & UI: @Maya (UI/UX Designer)
 * Paleta: Alto contraste, traços de entalhe em madeira, papel kraft e xilo pura.
 * ============================================================================
 */

export interface XiloRenderOptions {
  time?: number;
  facing?: 'left' | 'right' | 'up' | 'down';
  isMoving?: boolean;
  highlight?: boolean;
  scale?: number;
  alpha?: number;
  colorTint?: string;
  shadow?: boolean;
  isInvulnerable?: boolean;
  invulnerableTimer?: number;
}

// Cores canônicas da xilogravura
export const XILO_COLORS = {
  black: '#14100c',
  darkWood: '#241b14',
  kraftPaper: '#e6cfa8',
  kraftLight: '#f4ebd9',
  kraftDark: '#c2a170',
  whiteHatch: '#fefefe',
  redAccent: '#b91c1c',
  goldAccent: '#d97706',
  greenAccent: '#15803d',
  purpleAccent: '#7e22ce',
  cyanAccent: '#0284c7',
  brownWood: '#5c3a21',
  dirtRoad: '#a07844',
  stoneGrey: '#475569',
  stoneDark: '#334155',
};

// ============================================================================
// 1. SPRITES DOS PERSONAGENS & MONSTROS FOLCLÓRICOS
// ============================================================================

/**
 * 🤠 COISINHA (O HERÓI SERTANEJO)
 * Chapéu de couro meia-lua com estrela, gibão de vaqueiro e feições de xilo.
 */
export function drawCoisinha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const t = options.time || 0;
  const bob = options.isMoving ? Math.sin(t * 12) * 2 : Math.sin(t * 3) * 0.8;
  const w = width;
  const h = height;

  // Efeito de piscar durante invulnerabilidade (5s i-frames)
  if (options.isInvulnerable || (options.invulnerableTimer && options.invulnerableTimer > 0)) {
    const isBlinking = Math.floor(t * 14) % 2 === 0;
    ctx.globalAlpha = isBlinking ? 0.35 : 0.95;
  } else if (options.alpha !== undefined) {
    ctx.globalAlpha = options.alpha;
  }

  // Sombra no chão
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.45, w * 0.4, h * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo / Gibão de Couro
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(-w * 0.28, -h * 0.1 + bob, w * 0.56, h * 0.45);

  // Detalhe de corte do gibão (linhas brancas de costura de xilo)
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.1 + bob);
  ctx.lineTo(0, h * 0.35 + bob);
  // Costuras cruzadas
  ctx.moveTo(-w * 0.15, h * 0.05 + bob);
  ctx.lineTo(w * 0.15, h * 0.05 + bob);
  ctx.moveTo(-w * 0.18, h * 0.2 + bob);
  ctx.lineTo(w * 0.18, h * 0.2 + bob);
  ctx.stroke();

  // Cinto sertanejo
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(-w * 0.24, h * 0.26 + bob, w * 0.48, h * 0.08);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.strokeRect(-w * 0.24, h * 0.26 + bob, w * 0.48, h * 0.08);

  // Pernas / Botas de couro
  const legOffset = options.isMoving ? Math.sin(t * 12) * 4 : 0;
  ctx.fillStyle = XILO_COLORS.darkWood;
  // Perna esq
  ctx.fillRect(-w * 0.22, h * 0.35 + bob, w * 0.18, h * 0.2 - legOffset);
  // Perna dir
  ctx.fillRect(w * 0.04, h * 0.35 + bob, w * 0.18, h * 0.2 + legOffset);
  // Botas pretas
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(-w * 0.25, h * 0.46 + bob - legOffset, w * 0.22, h * 0.1);
  ctx.fillRect(w * 0.02, h * 0.46 + bob + legOffset, w * 0.22, h * 0.1);

  // Rosto de Xilogravura
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.arc(0, -h * 0.18 + bob, w * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Olhos atentos & Bigodinho sertanejo
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(-w * 0.1, -h * 0.22 + bob, w * 0.06, h * 0.06);
  ctx.fillRect(w * 0.04, -h * 0.22 + bob, w * 0.06, h * 0.06);
  // Bigode de xilo
  ctx.beginPath();
  ctx.arc(-w * 0.06, -h * 0.14 + bob, w * 0.08, 0, Math.PI);
  ctx.arc(w * 0.06, -h * 0.14 + bob, w * 0.08, 0, Math.PI);
  ctx.fill();

  // Lenço Vermelho no pescoço
  ctx.fillStyle = XILO_COLORS.redAccent;
  ctx.beginPath();
  ctx.moveTo(-w * 0.12, -h * 0.08 + bob);
  ctx.lineTo(w * 0.12, -h * 0.08 + bob);
  ctx.lineTo(0, h * 0.02 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 🤠 CHAPÉU DE COURO MEIA-LUA SERTANEJO (Símbolo Máximo)
  ctx.fillStyle = XILO_COLORS.darkWood;
  // Aba curvada
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.28 + bob, w * 0.52, h * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Copa frontal alta
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, -h * 0.32 + bob, w * 0.3, Math.PI, 0, false);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.kraftDark;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Estrela Sertaneja Branca de Xilo no Chapéu
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.font = `bold ${Math.round(w * 0.24)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 0, -h * 0.33 + bob);

  // Contorno externo de matriz de xilogravura
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

/**
 * 🐐 BODE SERTANEJO
 * Chifres curvados, barbicha, pelos talhados e sininho.
 */
export function drawBode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const t = options.time || 0;
  const wiggle = options.isMoving ? Math.sin(t * 10) * 3 : Math.sin(t * 2) * 1;
  const w = width;
  const h = height;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.4, w * 0.42, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo do Bode (Bloco preto com hachuras de xilo)
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.roundRect(-w * 0.35, -h * 0.1 + wiggle * 0.3, w * 0.65, h * 0.45, [12, 8, 8, 12]);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.darkWood;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hachuras brancas no pelo
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = -0.25; i <= 0.2; i += 0.1) {
    ctx.moveTo(w * i, -h * 0.02 + wiggle * 0.3);
    ctx.lineTo(w * (i - 0.05), h * 0.25 + wiggle * 0.3);
  }
  ctx.stroke();

  // 4 Patas de madeira talhada
  ctx.fillStyle = XILO_COLORS.black;
  const legOffset1 = options.isMoving ? Math.sin(t * 10) * 4 : 0;
  const legOffset2 = options.isMoving ? -Math.sin(t * 10) * 4 : 0;
  // Patas traseiras
  ctx.fillRect(-w * 0.3, h * 0.28 + legOffset1, w * 0.08, h * 0.2);
  ctx.fillRect(-w * 0.18, h * 0.28 + legOffset2, w * 0.08, h * 0.2);
  // Patas dianteiras
  ctx.fillRect(w * 0.12, h * 0.28 + legOffset2, w * 0.08, h * 0.2);
  ctx.fillRect(w * 0.22, h * 0.28 + legOffset1, w * 0.08, h * 0.2);

  // Rabinho empinado
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h * 0.05 + wiggle);
  ctx.lineTo(-w * 0.45, -h * 0.18 + wiggle);
  ctx.lineTo(-w * 0.38, -h * 0.02 + wiggle);
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fill();

  // Cabeça do Bode
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.ellipse(w * 0.28, -h * 0.15 + wiggle, w * 0.18, h * 0.2, Math.PI * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Olho branco de xilogravura
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.arc(w * 0.32, -h * 0.2 + wiggle, w * 0.045, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w * 0.31, -h * 0.21 + wiggle, w * 0.04, w * 0.02); // Pupila horizontal de bode

  // Barbicha branca de bode
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.moveTo(w * 0.28, -h * 0.02 + wiggle);
  ctx.lineTo(w * 0.22, h * 0.15 + wiggle);
  ctx.lineTo(w * 0.35, h * 0.0 + wiggle);
  ctx.closePath();
  ctx.fill();

  // Chifres Curvados Majestosos
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w * 0.24, -h * 0.28 + wiggle);
  ctx.quadraticCurveTo(w * 0.15, -h * 0.48 + wiggle, -w * 0.02, -h * 0.35 + wiggle);
  ctx.stroke();

  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.28, -h * 0.28 + wiggle);
  ctx.quadraticCurveTo(w * 0.2, -h * 0.45 + wiggle, w * 0.05, -h * 0.32 + wiggle);
  ctx.stroke();

  // Sininho / Guizo no pescoço
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(w * 0.24, 0 + wiggle, w * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * 🦇 CHUPA-CABRA (A FERA DA CAATINGA)
 * Criatura aterradora com presas afiadas, asas de morcego e olhos rubros de xilo.
 */
export function drawChupaCabra(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const t = options.time || 0;
  const flap = Math.sin(t * 8) * 0.2;
  const w = width;
  const h = height;

  // Aura ameaçadora
  ctx.fillStyle = 'rgba(185, 28, 28, 0.15)';
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Asas Membranosas de Morcego (Xilogravura com nervuras)
  ctx.fillStyle = XILO_COLORS.black;
  // Asa Esquerda
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, -h * 0.1);
  ctx.lineTo(-w * 0.7, -h * 0.5 + flap * h);
  ctx.lineTo(-w * 0.55, 0 + flap * h * 0.5);
  ctx.lineTo(-w * 0.35, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Asa Direita
  ctx.beginPath();
  ctx.moveTo(w * 0.15, -h * 0.1);
  ctx.lineTo(w * 0.7, -h * 0.5 + flap * h);
  ctx.lineTo(w * 0.55, 0 + flap * h * 0.5);
  ctx.lineTo(w * 0.35, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Nervuras brancas das asas
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, -h * 0.1);
  ctx.lineTo(-w * 0.7, -h * 0.5 + flap * h);
  ctx.moveTo(w * 0.15, -h * 0.1);
  ctx.lineTo(w * 0.7, -h * 0.5 + flap * h);
  ctx.stroke();

  // Corpo Demoníaco
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.26, h * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.redAccent;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Espinhos dorsais
  ctx.fillStyle = XILO_COLORS.redAccent;
  for (let i = -0.3; i <= 0.3; i += 0.15) {
    ctx.beginPath();
    ctx.moveTo(0, h * i - h * 0.05);
    ctx.lineTo(w * 0.12, h * i);
    ctx.lineTo(0, h * i + h * 0.05);
    ctx.fill();
  }

  // Cabeça Feroz
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, -h * 0.28, w * 0.24, 0, Math.PI * 2);
  ctx.fill();

  // Orelhas pontudas de morcego
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, -h * 0.3);
  ctx.lineTo(-w * 0.32, -h * 0.55);
  ctx.lineTo(-w * 0.08, -h * 0.4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w * 0.2, -h * 0.3);
  ctx.lineTo(w * 0.32, -h * 0.55);
  ctx.lineTo(w * 0.08, -h * 0.4);
  ctx.fill();

  // Olhos Rubros Brilhantes (Terror do Sertão)
  ctx.fillStyle = XILO_COLORS.redAccent;
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-w * 0.1, -h * 0.3, w * 0.06, 0, Math.PI * 2);
  ctx.arc(w * 0.1, -h * 0.3, w * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Presas Longas e Afiadas
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.moveTo(-w * 0.08, -h * 0.22);
  ctx.lineTo(-w * 0.05, -h * 0.1);
  ctx.lineTo(-w * 0.02, -h * 0.22);
  ctx.moveTo(w * 0.02, -h * 0.22);
  ctx.lineTo(w * 0.05, -h * 0.1);
  ctx.lineTo(w * 0.08, -h * 0.22);
  ctx.fill();

  // Garras afiadas nos pés
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.fillRect(-w * 0.2, h * 0.35, w * 0.08, h * 0.08);
  ctx.fillRect(w * 0.12, h * 0.35, w * 0.08, h * 0.08);

  ctx.restore();
}

/**
 * 🌿 CUMADE FULOZINHA (A DAMA MÍSTICA DA CAATINGA)
 * Cabelos negros longos como cipós, vestido de folhagens e silhueta mágica.
 */
export function drawCumadeFulozinha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);

  const t = options.time || 0;
  const hairWave = Math.sin(t * 6) * 6;
  const w = width;
  const h = height;

  // Brilho Místico Encantado
  ctx.fillStyle = options.colorTint || 'rgba(234, 179, 8, 0.18)';
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Cabelos Longos e Chicoteantes (Marca da Fulozinha)
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Mechas esquerdas
  ctx.moveTo(-w * 0.15, -h * 0.25);
  ctx.bezierCurveTo(-w * 0.6 + hairWave, 0, -w * 0.4 - hairWave, h * 0.4, -w * 0.7 + hairWave, h * 0.6);
  // Mechas direitas
  ctx.moveTo(w * 0.15, -h * 0.25);
  ctx.bezierCurveTo(w * 0.6 - hairWave, 0, w * 0.4 + hairWave, h * 0.4, w * 0.7 - hairWave, h * 0.6);
  ctx.stroke();

  // Vestido de Folhagens & Flores da Caatinga
  ctx.fillStyle = options.colorTint ? XILO_COLORS.redAccent : XILO_COLORS.greenAccent;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.1);
  ctx.lineTo(-w * 0.3, h * 0.35);
  ctx.lineTo(0, h * 0.45);
  ctx.lineTo(w * 0.3, h * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hachuras florais no vestido
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, h * 0.15, w * 0.1, 0, Math.PI * 2);
  ctx.stroke();

  // Rosto Delicado em Xilogravura
  ctx.fillStyle = XILO_COLORS.kraftLight;
  ctx.beginPath();
  ctx.arc(0, -h * 0.25, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Olhos Luminosos
  ctx.fillStyle = options.colorTint ? XILO_COLORS.redAccent : XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(-w * 0.07, -h * 0.26, w * 0.04, 0, Math.PI * 2);
  ctx.arc(w * 0.07, -h * 0.26, w * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Flor na Cabeça (Flor de Mandacaru)
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.arc(w * 0.16, -h * 0.4, w * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(w * 0.16, -h * 0.4, w * 0.03, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🦉 RASGA-MORTALHA (A CORUJA DA MEIA-NOITE)
 * Asas abertas com penas entalhadas, olhos hipnóticos e bico curvo.
 */
export function drawRasgaMortalha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);

  const t = options.time || 0;
  const wingFlap = Math.sin(t * 7) * 0.25;
  const w = width;
  const h = height;

  // Asas Abertas em Voo Rasante
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  // Asa Esquerda
  ctx.moveTo(-w * 0.1, -h * 0.1);
  ctx.lineTo(-w * 0.8, -h * 0.5 + wingFlap * h);
  ctx.lineTo(-w * 0.65, h * 0.1 + wingFlap * h * 0.5);
  ctx.lineTo(-w * 0.2, h * 0.15);
  // Asa Direita
  ctx.lineTo(w * 0.2, h * 0.15);
  ctx.lineTo(w * 0.65, h * 0.1 + wingFlap * h * 0.5);
  ctx.lineTo(w * 0.8, -h * 0.5 + wingFlap * h);
  ctx.lineTo(w * 0.1, -h * 0.1);
  ctx.closePath();
  ctx.fill();

  // Penas entalhadas (hachuras brancas em leque)
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let step = 0.3; step <= 0.75; step += 0.15) {
    ctx.moveTo(-w * 0.1, -h * 0.05);
    ctx.lineTo(-w * step, -h * 0.35 + wingFlap * h + step * 10);
    ctx.moveTo(w * 0.1, -h * 0.05);
    ctx.lineTo(w * step, -h * 0.35 + wingFlap * h + step * 10);
  }
  ctx.stroke();

  // Corpo da Coruja
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.22, h * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Penugem do Peito
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.12, 0.2, Math.PI - 0.2);
  ctx.arc(0, h * 0.1, w * 0.12, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Cabeça Redonda & Penachos de Orelha
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, -h * 0.25, w * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Penachos / Orelhas pontiagudas
  ctx.beginPath();
  ctx.moveTo(-w * 0.18, -h * 0.3);
  ctx.lineTo(-w * 0.24, -h * 0.48);
  ctx.lineTo(-w * 0.08, -h * 0.36);
  ctx.moveTo(w * 0.18, -h * 0.3);
  ctx.lineTo(w * 0.24, -h * 0.48);
  ctx.lineTo(w * 0.08, -h * 0.36);
  ctx.fill();

  // Olhos Grandes e Circulares Hipnóticos
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(-w * 0.09, -h * 0.25, w * 0.075, 0, Math.PI * 2);
  ctx.arc(w * 0.09, -h * 0.25, w * 0.075, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(-w * 0.09, -h * 0.25, w * 0.035, 0, Math.PI * 2);
  ctx.arc(w * 0.09, -h * 0.25, w * 0.035, 0, Math.PI * 2);
  ctx.fill();

  // Bico Curvo
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.22);
  ctx.lineTo(-w * 0.04, -h * 0.14);
  ctx.lineTo(w * 0.04, -h * 0.14);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * 👨‍🌾 FAZENDEIRO DO SERTÃO
 * Chapéu de palha/couro, bigode farto e camisa rústica.
 */
export function drawFazendeiro(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const w = width;
  const h = height;

  // Corpo / Camisa Xadrez de Xilogravura
  ctx.fillStyle = XILO_COLORS.greenAccent;
  ctx.fillRect(-w * 0.3, -h * 0.05, w * 0.6, h * 0.45);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w * 0.3, -h * 0.05, w * 0.6, h * 0.45);

  // Linhas de corte xadrez
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w * 0.1, -h * 0.05);
  ctx.lineTo(-w * 0.1, h * 0.4);
  ctx.moveTo(w * 0.1, -h * 0.05);
  ctx.lineTo(w * 0.1, h * 0.4);
  ctx.stroke();

  // Rosto
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.arc(0, -h * 0.2, w * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Bigode farto branco de sertanejo experiente
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.15, w * 0.18, h * 0.08, 0, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Chapéu de Palha Sertanejo
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.32, w * 0.5, h * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.beginPath();
  ctx.arc(0, -h * 0.36, w * 0.25, Math.PI, 0);
  ctx.fill();

  ctx.restore();
}

/**
 * 📿 BEATO DA PARÓQUIA (ROMEIRO DE PADRE CÍCERO)
 * Túnica de romeiro, terço e crucifixo talhado.
 */
export function drawBeato(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const w = width;
  const h = height;

  // Batina / Túnica Longa de Romeiro
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.beginPath();
  ctx.moveTo(-w * 0.2, -h * 0.1);
  ctx.lineTo(-w * 0.35, h * 0.45);
  ctx.lineTo(w * 0.35, h * 0.45);
  ctx.lineTo(w * 0.2, -h * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cordão Franciscano na cintura
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.24, h * 0.12);
  ctx.lineTo(w * 0.24, h * 0.12);
  ctx.moveTo(w * 0.1, h * 0.12);
  ctx.lineTo(w * 0.12, h * 0.32);
  ctx.stroke();

  // Rosto com Barba Branca Devota
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.arc(0, -h * 0.2, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Barba longa branca
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, -h * 0.18);
  ctx.lineTo(0, h * 0.02);
  ctx.lineTo(w * 0.15, -h * 0.18);
  ctx.fill();

  // Crucifixo de Madeira no Peito
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(-w * 0.04, -h * 0.02, w * 0.08, h * 0.18);
  ctx.fillRect(-w * 0.1, h * 0.02, w * 0.2, h * 0.06);

  // Auréola / Chapéu de Palha de Romeiro
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.38, w * 0.28, h * 0.08, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 2. OS 4 ITENS MÍSTICOS & ACESSÓRIOS DO SERTÃO
// ============================================================================

/**
 * 🪓 CARIMBO MÁGICO (MATRIZ DE XILOGRAVURA)
 */
export function drawItemCarimbo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size;

  // Bloco de Madeira
  ctx.fillStyle = XILO_COLORS.brownWood;
  ctx.fillRect(-s * 0.4, -s * 0.2, s * 0.8, s * 0.5);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.strokeRect(-s * 0.4, -s * 0.2, s * 0.8, s * 0.5);

  // Cabo de Madeira Torneado
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.fillRect(-s * 0.1, -s * 0.48, s * 0.2, s * 0.3);
  ctx.beginPath();
  ctx.arc(0, -s * 0.48, s * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // Matriz de Borracha / Relevo de Entalhe
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(-s * 0.32, s * 0.25, s * 0.64, s * 0.12);

  // Runa / Estrela Entalhada
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.font = `bold ${Math.round(s * 0.35)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 0, s * 0.05);

  ctx.restore();
}

/**
 * 📄 FOLHA / PÁGINA RASGADA DE CORDEL
 */
export function drawItemFolha(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size;

  // Papel Kraft com bordas irregulares de corte
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.moveTo(-s * 0.35, -s * 0.45);
  ctx.lineTo(s * 0.35, -s * 0.45);
  ctx.lineTo(s * 0.38, s * 0.35);
  // Borda inferior rasgada
  ctx.lineTo(s * 0.2, s * 0.45);
  ctx.lineTo(0, s * 0.38);
  ctx.lineTo(-s * 0.2, s * 0.48);
  ctx.lineTo(-s * 0.38, s * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Estrofes Escritas em Linhas de Xilo
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let ly = -0.25; ly <= 0.2; ly += 0.12) {
    ctx.moveTo(-s * 0.25, s * ly);
    ctx.lineTo(s * 0.25, s * ly);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * 🪶 PENA ENCANTADA DA RASGA-MORTALHA
 */
export function drawItemPena(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI * 0.25);
  const s = size;

  // Haste / Cálamo Central
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.45);
  ctx.lineTo(0, s * 0.45);
  ctx.stroke();

  // Barbas da Pena (Plumagem Roxa / Preta de Xilo)
  ctx.fillStyle = XILO_COLORS.purpleAccent;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.45);
  ctx.quadraticCurveTo(-s * 0.25, -s * 0.1, -s * 0.2, s * 0.2);
  ctx.lineTo(0, s * 0.3);
  ctx.lineTo(s * 0.2, s * 0.2);
  ctx.quadraticCurveTo(s * 0.25, -s * 0.1, 0, -s * 0.45);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ranhuras finas de entalhe
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let py = -0.3; py <= 0.15; py += 0.12) {
    ctx.moveTo(0, s * py);
    ctx.lineTo(-s * 0.15, s * (py + 0.08));
    ctx.moveTo(0, s * py);
    ctx.lineTo(s * 0.15, s * (py + 0.08));
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * 🖋️ TINTA ENCANTADA (TINTEIRO DE NANQUIM RÚSTICO)
 */
export function drawItemTinta(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size;

  // Frasco de Barro / Vidro Negro
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.roundRect(-s * 0.35, -s * 0.2, s * 0.7, s * 0.6, 6);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Gargalo & Rolha de Cortiça
  ctx.fillStyle = XILO_COLORS.brownWood;
  ctx.fillRect(-s * 0.15, -s * 0.38, s * 0.3, s * 0.2);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.strokeRect(-s * 0.15, -s * 0.38, s * 0.3, s * 0.2);

  // Rótulo Rústico com Gota de Tinta
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.fillRect(-s * 0.22, -s * 0.05, s * 0.44, s * 0.3);
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, s * 0.1, s * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🏺 BOTIJA DE OURO DE MANÉ MONTEIRO
 */
export function drawItemBotija(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size;

  // Vaso de Cerâmica de Barro
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, s * 0.1, s * 0.38, s * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Boca da Botija com Lacre de Cera
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(-s * 0.2, -s * 0.32, s * 0.4, s * 0.16);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-s * 0.2, -s * 0.32, s * 0.4, s * 0.16);

  // Moedas de Ouro reluzentes
  ctx.fillStyle = '#fde047';
  ctx.font = `bold ${Math.round(s * 0.28)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💰', 0, s * 0.1);

  ctx.restore();
}

/**
 * 🌿 MOITA DE VEGETAÇÃO DA CAATINGA (MANDACARU / ESPINHOS)
 */
export function drawMoita(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  options: { hasItem?: boolean; searched?: boolean } = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  const r = radius;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Base do arbusto (Folhagem de Xilo)
  ctx.fillStyle = options.searched ? '#27272a' : '#14532d';
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.1, r * 0.5, 0, Math.PI * 2);
  ctx.arc(r * 0.35, -r * 0.1, r * 0.5, 0, Math.PI * 2);
  ctx.arc(0, -r * 0.35, r * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Espinhos & Textura de Caatinga
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // Espinhos em leque
  ctx.moveTo(0, -r * 0.6);
  ctx.lineTo(0, -r * 0.2);
  ctx.moveTo(-r * 0.3, -r * 0.4);
  ctx.lineTo(-r * 0.1, -r * 0.1);
  ctx.moveTo(r * 0.3, -r * 0.4);
  ctx.lineTo(r * 0.1, -r * 0.1);
  ctx.stroke();

  // Florzinha amarela de cacto
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(0, -r * 0.55, r * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ============================================================================
// 3. TEXTURAS DE CHÃO EM XILOGRAVURA
// ============================================================================

/**
 * 🏜️ TERRA BATIDA & CAATINGA SECA
 */
export function drawChaoTerraBatida(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();
  // Fundo base kraft / terra
  ctx.fillStyle = '#261b11';
  ctx.fillRect(x, y, w, h);

  // Rachaduras de solo árido sertanejo
  ctx.strokeStyle = '#150e09';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let gx = x + 40; gx < x + w; gx += 80) {
    for (let gy = y + 40; gy < y + h; gy += 80) {
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + 25, gy + 15);
      ctx.lineTo(gx + 10, gy + 35);
      ctx.moveTo(gx + 25, gy + 15);
      ctx.lineTo(gx + 40, gy + 10);
    }
  }
  ctx.stroke();

  // Pedregulhos de xilogravura
  ctx.fillStyle = '#3a2b1c';
  for (let px = x + 30; px < x + w; px += 100) {
    for (let py = y + 50; py < y + h; py += 100) {
      ctx.beginPath();
      ctx.ellipse(px, py, 6, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * 🏛️ LAJOTAS DE PEDRA COLONIAL
 */
export function drawChaoLajotas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;

  const tileSize = 60;
  for (let row = 0; row < h / tileSize; row++) {
    const shift = (row % 2) * (tileSize / 2);
    for (let col = -1; col < w / tileSize + 1; col++) {
      const tx = x + col * tileSize + shift;
      const ty = y + row * tileSize;
      ctx.strokeRect(tx, ty, tileSize, tileSize);

      // Chanfro de xilo na quina da pedra
      ctx.fillStyle = '#334155';
      ctx.fillRect(tx + 4, ty + 4, tileSize - 8, tileSize - 8);
    }
  }
  ctx.restore();
}

/**
 * 🪵 PISO DE TÁBUAS DE MADEIRA (ESTÚDIO DE XILOGRAVURA)
 */
export function drawChaoEstudioMadeira(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  ctx.save();
  ctx.fillStyle = '#291d13';
  ctx.fillRect(x, y, w, h);

  const plankH = 40;
  ctx.strokeStyle = '#120b07';
  ctx.lineWidth = 2;

  for (let py = y; py < y + h; py += plankH) {
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py);
    ctx.stroke();

    // Nós de madeira e veios
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let px = x + 60; px < x + w; px += 180) {
      ctx.ellipse(px, py + plankH * 0.5, 14, 5, 0, 0, Math.PI * 2);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 4. MOLDURAS DE CORDEL & COMPONENTES DE AMBIENTAÇÃO
// ============================================================================

/**
 * 📜 MOLDURA DE FOLHETO DE CORDEL TRADICIONAL
 */
export function drawMolduraCordel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: { title?: string; borderWeight?: number } = {}
): void {
  ctx.save();
  const bw = options.borderWeight || 4;

  // Borda Externa Grossa
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = bw;
  ctx.strokeRect(x, y, w, h);

  // Borda Interna Fina
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);

  // Cantoneiras Tradicionais de Xilo
  const cornerSize = 14;
  const corners = [
    { cx: x + 6, cy: y + 6 },
    { cx: x + w - 6 - cornerSize, cy: y + 6 },
    { cx: x + 6, cy: y + h - 6 - cornerSize },
    { cx: x + w - 6 - cornerSize, cy: y + h - 6 - cornerSize },
  ];

  ctx.fillStyle = XILO_COLORS.black;
  for (const c of corners) {
    ctx.fillRect(c.cx, c.cy, cornerSize, cornerSize);
    // Pontinho de luz
    ctx.fillStyle = XILO_COLORS.whiteHatch;
    ctx.fillRect(c.cx + 4, c.cy + 4, cornerSize - 8, cornerSize - 8);
    ctx.fillStyle = XILO_COLORS.black;
  }

  // Dentes-de-serra ornamentais nas bordas superior e inferior
  ctx.beginPath();
  for (let dx = x + 30; dx < x + w - 30; dx += 12) {
    ctx.moveTo(dx, y + 6);
    ctx.lineTo(dx + 6, y + 12);
    ctx.lineTo(dx + 12, y + 6);

    ctx.moveTo(dx, y + h - 6);
    ctx.lineTo(dx + 6, y + h - 12);
    ctx.lineTo(dx + 12, y + h - 6);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * 🖨️ PRENSA DO DESTINO (MESA DE IMPRESSÃO ARTESANAL)
 */
export function drawPrensa(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isReady: boolean
): void {
  ctx.save();
  ctx.translate(x, y);

  // Mesa de Madeira Robusta
  ctx.fillStyle = XILO_COLORS.brownWood;
  ctx.fillRect(-w * 0.5, -h * 0.2, w, h * 0.7);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-w * 0.5, -h * 0.2, w, h * 0.7);

  // Tampo de Ferro / Base de Prensagem
  ctx.fillStyle = isReady ? '#10b981' : '#334155';
  ctx.fillRect(-w * 0.4, -h * 0.1, w * 0.8, h * 0.35);
  ctx.strokeStyle = isReady ? '#34d399' : XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.strokeRect(-w * 0.4, -h * 0.1, w * 0.8, h * 0.35);

  // Fuso de Ferro & Manivela Giratória
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(-w * 0.08, -h * 0.5, w * 0.16, h * 0.4);

  // Manivela
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, -h * 0.45);
  ctx.lineTo(w * 0.35, -h * 0.45);
  ctx.stroke();

  // Bolas de ferro nas pontas da manivela
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(-w * 0.35, -h * 0.45, 6, 0, Math.PI * 2);
  ctx.arc(w * 0.35, -h * 0.45, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🧵 VARAL DE CORDÉIS COM PREGADORES DE MADEIRA
 */
export function drawVaral(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  completed: { carimbo: boolean; folha: boolean; pena: boolean; tinta: boolean }
): void {
  ctx.save();
  ctx.translate(x, y);

  // Corda de Sisal Trançada
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-w * 0.5, 0);
  ctx.quadraticCurveTo(0, h * 0.2, w * 0.5, 0);
  ctx.stroke();

  // 4 Folhetos Pendurados no Varal
  const items = [
    { label: 'Conto 1', ok: completed.carimbo, icon: '🪓', color: '#f59e0b' },
    { label: 'Conto 2', ok: completed.folha, icon: '📄', color: '#10b981' },
    { label: 'Conto 3', ok: completed.pena, icon: '🪶', color: '#a855f7' },
    { label: 'Conto 4', ok: completed.tinta, icon: '🖋️', color: '#3b82f6' },
  ];

  const spacing = w * 0.22;
  items.forEach((item, idx) => {
    const fx = -w * 0.33 + idx * spacing;
    const fy = h * 0.08 + Math.sin(idx * 0.8) * 4;

    // Pregador de Madeira
    ctx.fillStyle = '#78350f';
    ctx.fillRect(fx - 3, fy - 12, 6, 14);
    ctx.strokeStyle = XILO_COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(fx - 3, fy - 12, 6, 14);

    // Folheto de Cordel
    ctx.fillStyle = item.ok ? XILO_COLORS.kraftPaper : '#262626';
    ctx.fillRect(fx - 18, fy, 36, 48);
    ctx.strokeStyle = item.ok ? item.color : '#525252';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(fx - 18, fy, 36, 48);

    if (item.ok) {
      // Ícone do Conto Concluído
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.icon, fx, fy + 24);
      // Linhas de texto simuladas
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx - 12, fy + 34);
      ctx.lineTo(fx + 12, fy + 34);
      ctx.moveTo(fx - 12, fy + 40);
      ctx.lineTo(fx + 12, fy + 40);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#737373';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', fx, fy + 30);
    }
  });

  ctx.restore();
}

// ============================================================================
// 5. NOVOS SPRITES: VIOLEIROS, MORADORES BÊBADOS, CACTOS & TELAS DE CORDEL
// ============================================================================

/**
 * 🪕 VIOLEIRO DO REPENTE (VIOLA DE 10 CORDAS DE XILO)
 */
export function drawVioleiro(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  if (options.facing === 'left') {
    ctx.scale(-1, 1);
  }

  const t = options.time || 0;
  const strum = Math.sin(t * 8) * 3;
  const w = width;
  const h = height;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.42, w * 0.4, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo / Camisa Xilogravada
  ctx.fillStyle = options.colorTint || XILO_COLORS.brownWood;
  ctx.fillRect(-w * 0.28, -h * 0.08, w * 0.56, h * 0.45);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w * 0.28, -h * 0.08, w * 0.56, h * 0.45);

  // Calça e Botas
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.fillRect(-w * 0.22, h * 0.35, w * 0.18, h * 0.15);
  ctx.fillRect(w * 0.04, h * 0.35, w * 0.18, h * 0.15);

  // Rosto & Expressão de Cantador
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.arc(0, -h * 0.2, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Bigode de Cantador
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, -h * 0.16, w * 0.1, 0, Math.PI);
  ctx.fill();

  // Boca Cantando
  ctx.fillStyle = XILO_COLORS.redAccent;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.12, w * 0.06, h * 0.04, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chapéu de Couro Sertanejo
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.32, w * 0.48, h * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 🪕 VIOLA DE CORDEL (Madeira Talhada)
  ctx.save();
  ctx.translate(w * 0.1, h * 0.08);
  ctx.rotate(-Math.PI * 0.2);

  // Bojo da Viola (em 8)
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(0, h * 0.08, w * 0.18, 0, Math.PI * 2);
  ctx.arc(0, -h * 0.05, w * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Boca da Viola
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Braço & Cravelhas
  ctx.fillStyle = XILO_COLORS.darkWood;
  ctx.fillRect(-w * 0.04, -h * 0.32, w * 0.08, h * 0.28);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.strokeRect(-w * 0.04, -h * 0.32, w * 0.08, h * 0.28);

  // Cordas
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-w * 0.02, -h * 0.3);
  ctx.lineTo(-w * 0.02, h * 0.15);
  ctx.moveTo(w * 0.02, -h * 0.3);
  ctx.lineTo(w * 0.02, h * 0.15);
  ctx.stroke();

  ctx.restore();

  // Braço do Cantador Dedilhando
  ctx.strokeStyle = XILO_COLORS.kraftPaper;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-w * 0.15, 0);
  ctx.lineTo(w * 0.05 + strum, h * 0.08);
  ctx.stroke();

  // Notas Musicais Flutuantes em Xilogravura
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.font = 'bold 12px monospace';
  ctx.fillText('♫', w * 0.35, -h * 0.3 + strum);

  ctx.restore();
}

/**
 * 🍻 MORADOR BÊBADO / FOLIÃO DO SERTÃO
 */
export function drawMoradorBebado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);

  const t = options.time || 0;
  const sway = Math.sin(t * 4) * 6;
  const w = width;
  const h = height;

  ctx.rotate((sway * Math.PI) / 180);

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.42, w * 0.38, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo / Camisa Aberta
  ctx.fillStyle = options.colorTint || '#475569';
  ctx.fillRect(-w * 0.26, -h * 0.08, w * 0.52, h * 0.45);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w * 0.26, -h * 0.08, w * 0.52, h * 0.45);

  // Rosto Bêbado & Bochechas Vermelhas
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.beginPath();
  ctx.arc(0, -h * 0.2, w * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Bochechas coradas de cachaça
  ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
  ctx.beginPath();
  ctx.arc(-w * 0.1, -h * 0.18, w * 0.05, 0, Math.PI * 2);
  ctx.arc(w * 0.1, -h * 0.18, w * 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Olhos vesgos / tontos
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillText('x', -w * 0.08, -h * 0.22);
  ctx.fillText('x', w * 0.04, -h * 0.22);

  // Chapéu Torto
  ctx.save();
  ctx.rotate(0.3);
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.32, w * 0.44, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Garrafa de Cachaça na Mão
  ctx.fillStyle = '#065f46';
  ctx.fillRect(w * 0.2, 0, w * 0.12, h * 0.22);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.2, 0, w * 0.12, h * 0.22);
  // Gargalo
  ctx.fillStyle = '#92400e';
  ctx.fillRect(w * 0.23, -h * 0.06, w * 0.06, h * 0.08);

  ctx.restore();
}

/**
 * 🌵 CACTO MANDACARU (ÁRVORE DA CAATINGA)
 */
export function drawCactoMandacaru(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  _options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);
  const w = width;
  const h = height;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.45, w * 0.4, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tronco Principal
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.roundRect(-w * 0.15, -h * 0.45, w * 0.3, h * 0.9, [8, 8, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Galho Esquerdo (Braço do Mandacaru)
  ctx.beginPath();
  ctx.roundRect(-w * 0.42, -h * 0.28, w * 0.28, h * 0.12, [6, 0, 0, 6]);
  ctx.roundRect(-w * 0.42, -h * 0.42, w * 0.14, h * 0.24, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Galho Direito
  ctx.beginPath();
  ctx.roundRect(w * 0.14, -h * 0.18, w * 0.28, h * 0.12, [0, 6, 6, 0]);
  ctx.roundRect(w * 0.28, -h * 0.36, w * 0.14, h * 0.28, [6, 6, 0, 0]);
  ctx.fill();
  ctx.stroke();

  // Espinhos Brancos de Xilo
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let py = -0.35; py <= 0.35; py += 0.12) {
    ctx.moveTo(-w * 0.15, h * py);
    ctx.lineTo(-w * 0.22, h * (py - 0.02));
    ctx.moveTo(w * 0.15, h * py);
    ctx.lineTo(w * 0.22, h * (py - 0.02));
  }
  ctx.stroke();

  // Flor Branca de Mandacaru no Topo
  ctx.fillStyle = XILO_COLORS.whiteHatch;
  ctx.beginPath();
  ctx.arc(0, -h * 0.46, w * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.beginPath();
  ctx.arc(0, -h * 0.46, w * 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🍎 MOITA COM FRUTAS REGIONAIS (UMBU / MANDACARU - RECUPERA VIDA)
 */
export function drawMoitaFrutaRegional(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  options: { searched?: boolean } = {}
): void {
  ctx.save();
  drawMoita(ctx, x, y, radius, { searched: options.searched });

  if (!options.searched) {
    // Frutas suculentas coloridas
    ctx.translate(x, y);
    const r = radius;
    // Fruta 1 (Vermelha)
    ctx.fillStyle = XILO_COLORS.redAccent;
    ctx.beginPath();
    ctx.arc(-r * 0.3, -r * 0.25, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = XILO_COLORS.black;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Fruta 2 (Amarela / Umbu)
    ctx.fillStyle = XILO_COLORS.goldAccent;
    ctx.beginPath();
    ctx.arc(r * 0.28, -r * 0.3, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Brilho saudável
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-r * 0.32, -r * 0.28, r * 0.05, 0, Math.PI * 2);
    ctx.arc(r * 0.26, -r * 0.33, r * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 🌵 MOITA DE CACTOS COM ESPINHOS (CAUSA DANO & GRITO)
 */
export function drawMoitaCactoEspinhos(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  ctx.save();
  ctx.translate(x, y);
  const r = radius;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.85, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Arbusto espinhoso agressivo
  ctx.fillStyle = '#1e3a1e';
  ctx.beginPath();
  ctx.arc(0, -r * 0.2, r * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dezenas de Espinhos Afiados
  ctx.strokeStyle = XILO_COLORS.whiteHatch;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
    const ex = Math.cos(angle) * r * 0.65;
    const ey = -r * 0.2 + Math.sin(angle) * r * 0.65;
    const tx = Math.cos(angle) * r * 0.95;
    const ty = -r * 0.2 + Math.sin(angle) * r * 0.95;
    ctx.moveTo(ex, ey);
    ctx.lineTo(tx, ty);
  }
  ctx.stroke();

  // Alerta de Espinhos
  ctx.fillStyle = XILO_COLORS.redAccent;
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚠', 0, -r * 0.2);

  ctx.restore();
}

/**
 * 📜 TELA DE APRESENTAÇÃO DE FASE EM FOLHETO DE CORDEL
 */
export function drawTelaApresentacaoCordel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  stageNum: number,
  title: string,
  stanzas: string[],
  options: { prompt?: string } = {}
): void {
  ctx.save();

  // Fundo Papel Kraft
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.fillRect(x, y, w, h);

  // Moldura Dupla de Xilogravura
  drawMolduraCordel(ctx, x + 16, y + 14, w - 32, h - 28, { borderWeight: 4 });

  // Cabeçalho de Folheto
  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 18px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`FOLHETO Nº ${stageNum} — DO VELHO SERTÃO`, x + w / 2, y + 50);

  ctx.font = '13px "Courier New", Courier, monospace';
  ctx.fillText('═══════════════════════════════════════════════════════════', x + w / 2, y + 68);

  // Título da História
  ctx.font = 'bold 22px "Courier New", Courier, monospace';
  ctx.fillText(`"${title.toUpperCase()}"`, x + w / 2, y + 105);

  ctx.font = '13px "Courier New", Courier, monospace';
  ctx.fillText('═══════════════════════════════════════════════════════════', x + w / 2, y + 124);

  // Estrofes Narrativas do Cordel
  ctx.font = '15px "Courier New", Courier, monospace';
  ctx.fillStyle = XILO_COLORS.black;
  let lineY = y + 165;
  for (const st of stanzas) {
    ctx.fillText(st, x + w / 2, lineY);
    lineY += 28;
  }

  // Prompt de Início
  const promptText = options.prompt || '[ Pressione ESPAÇO ou ENTER para Iniciar o Conto ]';
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(x + w / 2 - 240, y + h - 75, 480, 36);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + w / 2 - 240, y + h - 75, 480, 36);

  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 13px monospace';
  ctx.fillText(promptText, x + w / 2, y + h - 52);

  ctx.restore();
}

/**
 * 🏆 TELA DE ENCERRAMENTO DE FASE EM FOLHETO DE CORDEL
 */
export function drawTelaEncerramentoCordel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  stageNum: number,
  title: string,
  itemMistico: { name: string; icon: string; desc: string },
  stanzas: string[],
  options: { prompt?: string } = {}
): void {
  ctx.save();

  // Fundo Papel Kraft
  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.fillRect(x, y, w, h);

  // Moldura de Xilogravura
  drawMolduraCordel(ctx, x + 16, y + 14, w - 32, h - 28, { borderWeight: 4 });

  // Cabeçalho de Vitória
  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 18px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`🎉 DESFECHO DO CONTO ${stageNum} — VITÓRIA NO SERTÃO!`, x + w / 2, y + 48);

  ctx.font = '13px "Courier New", Courier, monospace';
  ctx.fillText('═══════════════════════════════════════════════════════════', x + w / 2, y + 66);

  // Título
  ctx.font = 'bold 20px "Courier New", Courier, monospace';
  ctx.fillText(`"${title.toUpperCase()}"`, x + w / 2, y + 98);

  // Box do Item Místico Conquistado
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(x + w / 2 - 180, y + 118, 360, 60);
  ctx.fillStyle = XILO_COLORS.kraftLight;
  ctx.fillRect(x + w / 2 - 177, y + 121, 354, 54);
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + w / 2 - 177, y + 121, 354, 54);

  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`${itemMistico.icon} ${itemMistico.name.toUpperCase()} CONQUISTADO!`, x + w / 2, y + 145);
  ctx.font = '11px monospace';
  ctx.fillStyle = '#525252';
  ctx.fillText(itemMistico.desc, x + w / 2, y + 163);

  // Estrofes de Fechamento
  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = '15px "Courier New", Courier, monospace';
  let lineY = y + 215;
  for (const st of stanzas) {
    ctx.fillText(st, x + w / 2, lineY);
    lineY += 28;
  }

  // Prompt de Retorno
  const promptText = options.prompt || '[ Pressione ESPAÇO ou ENTER para Voltar ao Estúdio ]';
  ctx.fillStyle = '#15803d';
  ctx.fillRect(x + w / 2 - 240, y + h - 75, 480, 36);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + w / 2 - 240, y + h - 75, 480, 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(promptText, x + w / 2, y + h - 52);

  ctx.restore();
}

/**
 * 🕯️ MÁSCARA DE ESCURIDÃO & FOCO DE CANDEEIRO (FASE 4 - NOTURNO)
 */
export function drawMascaraEscuridaoCandeeiro(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  playerX: number,
  playerY: number,
  hasLantern: boolean,
  time: number = 0
): void {
  ctx.save();

  // Raio de iluminação
  const flicker = Math.sin(time * 12) * 4;
  const innerRadius = hasLantern ? 50 : 25;
  const outerRadius = hasLantern ? 280 + flicker : 115 + flicker;

  // Gradiente radial de luz da lamparina
  const grad = ctx.createRadialGradient(
    playerX,
    playerY,
    innerRadius,
    playerX,
    playerY,
    outerRadius
  );

  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.65, hasLantern ? 'rgba(217, 119, 6, 0.15)' : 'rgba(10, 8, 6, 0.55)');
  grad.addColorStop(0.85, 'rgba(10, 8, 6, 0.88)');
  grad.addColorStop(1, 'rgba(10, 8, 6, 0.98)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Aura sutil dourada ao redor da lamparina quando equipada
  if (hasLantern) {
    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.08)';
    ctx.beginPath();
    ctx.arc(playerX, playerY, outerRadius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 🪵 MESA DE MONTAGEM & ÁREA AMPLA DE XILOGRAVURA (FASE 3)
 */
export function drawMesaMontagemXilo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  icon: string,
  options: { isHovered?: boolean; colorAccent?: string } = {}
): void {
  ctx.save();

  // Sombra no chão
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(x - w / 2 + 4, y - h / 2 + 6, w, h);

  // Tampo de Madeira Rústica
  ctx.fillStyle = options.colorAccent || '#3b2615';
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  // Moldura interna de entalhe
  ctx.strokeStyle = options.isHovered ? XILO_COLORS.goldAccent : XILO_COLORS.kraftDark;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8);

  // Placa / Rótulo de Xilogravura
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(x - w / 2 + 6, y - h / 2 - 16, w - 12, 18);
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - w / 2 + 6, y - h / 2 - 16, w - 12, 18);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${label}`, x, y - h / 2 - 7);

  ctx.restore();
}

/**
 * 🎪 PALCO CENTRAL DOS VIOLEIROS DE CORDEL (FASE 3)
 */
export function drawPalcoVioleirosXilo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: { time?: number } = {}
): void {
  ctx.save();
  const t = options.time || 0;

  // Sombra profunda do tablado
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(x - w / 2 + 6, y - h / 2 + 8, w, h);

  // Tablado de Madeira Rústica Entalhada
  ctx.fillStyle = '#2c1a0e';
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 3;
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  // Tábuas Verticais do Tablado
  ctx.strokeStyle = '#180e07';
  ctx.lineWidth = 1.5;
  for (let px = x - w / 2 + 20; px < x + w / 2; px += 24) {
    ctx.beginPath();
    ctx.moveTo(px, y - h / 2 + 2);
    ctx.lineTo(px, y + h / 2 - 2);
    ctx.stroke();
  }

  // Moldura dourada de xilogravura no tablado
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10);

  // Estandarte Superior: "PALCO DO REPENTE"
  const bannerW = Math.min(220, w - 20);
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(x - bannerW / 2, y - h / 2 - 16, bannerW, 20);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - bannerW / 2, y - h / 2 - 16, bannerW, 20);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🪕 PALCO DO REPENTE 🪕', x, y - h / 2 - 6);

  // Candeeiros e Luzes Rústicas nas pontas
  const flamePulse = Math.sin(t * 8) * 1.5;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(x - w / 2 + 14, y - h / 2 + 12, 4 + flamePulse, 0, Math.PI * 2);
  ctx.arc(x + w / 2 - 14, y - h / 2 + 12, 4 + flamePulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🐔 GALINHA DE CORDEL
 */
export function drawGalinha(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 28,
  h: number = 28
): void {
  ctx.save();
  ctx.translate(x, y);

  // Corpo
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.35, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cabeça e Crista
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(w * 0.22, -h * 0.25, 4, 0, Math.PI * 2);
  ctx.fill();

  // Bico
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(w * 0.35, -h * 0.15);
  ctx.lineTo(w * 0.48, -h * 0.1);
  ctx.lineTo(w * 0.35, -h * 0.05);
  ctx.closePath();
  ctx.fill();

  // Olho
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w * 0.25, -h * 0.18, 2, 2);

  // Patas
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, h * 0.28);
  ctx.lineTo(-2, h * 0.44);
  ctx.moveTo(4, h * 0.28);
  ctx.lineTo(4, h * 0.44);
  ctx.stroke();

  ctx.restore();
}

/**
 * 🐖 PORCO DE CORDEL
 */
export function drawPorco(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 34,
  h: number = 26
): void {
  ctx.save();
  ctx.translate(x, y);

  // Corpo
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(0, 0, w * 0.42, h * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Focinho
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.ellipse(w * 0.36, 0, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Narinas
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w * 0.36, -2, 1.5, 1.5);
  ctx.fillRect(w * 0.36, 2, 1.5, 1.5);

  // Olho
  ctx.fillRect(w * 0.18, -h * 0.18, 2, 2);

  // Orelha
  ctx.fillStyle = '#db2777';
  ctx.beginPath();
  ctx.moveTo(w * 0.08, -h * 0.25);
  ctx.lineTo(w * 0.18, -h * 0.45);
  ctx.lineTo(w * 0.25, -h * 0.2);
  ctx.closePath();
  ctx.fill();

  // Rabinho encaracolado
  ctx.strokeStyle = '#db2777';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-w * 0.42, -4, 4, 0, Math.PI);
  ctx.stroke();

  // Patas
  ctx.fillStyle = '#db2777';
  ctx.fillRect(-w * 0.28, h * 0.25, 4, 6);
  ctx.fillRect(w * 0.18, h * 0.25, 4, 6);

  ctx.restore();
}

/**
 * 🫏 JUMENTO / BURRO SERTANEJO DE CORDEL
 */
export function drawJumento(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 36,
  h: number = 30
): void {
  ctx.save();
  ctx.translate(x, y);

  // Corpo
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.4, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Pescoço e Cabeça
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.ellipse(w * 0.3, -h * 0.2, w * 0.18, h * 0.22, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Focinho branco
  ctx.fillStyle = '#e7e5e4';
  ctx.beginPath();
  ctx.ellipse(w * 0.44, -h * 0.12, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Orelhas longas de Jumento
  ctx.fillStyle = '#57534e';
  ctx.beginPath();
  ctx.ellipse(w * 0.24, -h * 0.48, 3, 9, -0.2, 0, Math.PI * 2);
  ctx.ellipse(w * 0.32, -h * 0.46, 3, 9, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Olho
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w * 0.32, -h * 0.24, 2, 2);

  // Patas
  ctx.fillStyle = '#44403c';
  ctx.fillRect(-w * 0.25, h * 0.25, 4, 8);
  ctx.fillRect(-w * 0.12, h * 0.25, 4, 8);
  ctx.fillRect(w * 0.15, h * 0.25, 4, 8);
  ctx.fillRect(w * 0.28, h * 0.25, 4, 8);

  ctx.restore();
}

/**
 * 🐕 CACHORRO VIRA-LATA DE CORDEL
 */
export function drawCachorro(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 32,
  h: number = 26
): void {
  ctx.save();
  ctx.translate(x, y);

  // Corpo
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, 2, w * 0.38, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cabeça
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(w * 0.28, -h * 0.15, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Orelha caída
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(w * 0.22, -h * 0.18, 3, 6, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Focinho
  ctx.fillStyle = '#d97706';
  ctx.fillRect(w * 0.34, -h * 0.14, 5, 4);
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w * 0.38, -h * 0.16, 2, 2);

  // Rabinho levantado
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * 0.35, 0);
  ctx.quadraticCurveTo(-w * 0.45, -h * 0.3, -w * 0.3, -h * 0.4);
  ctx.stroke();

  // Patas
  ctx.fillStyle = '#78350f';
  ctx.fillRect(-w * 0.22, h * 0.25, 3, 6);
  ctx.fillRect(w * 0.18, h * 0.25, 3, 6);

  ctx.restore();
}

/**
 * 🏠 INTERIOR DA CASA DE CORDEL (FASE 3 — 4 NICHOS / SLOTS DE XILOGRAVURA)
 */
export interface InteriorHouseData {
  index: number;
  corName: string;
  colorHex: string;
  morador?: string;
  bebida?: string;
  fumo?: string;
  animal?: string;
  clue?: string;
}

export function drawInteriorCasaXilo(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  house: InteriorHouseData,
  options: { time?: number; activeSlot?: string } = {}
): void {
  ctx.save();

  // 1. Fundo Rústico de Taipa / Piso de Barro Batido
  ctx.fillStyle = '#20150e';
  ctx.fillRect(0, 0, w, h);

  // Vigas e Paredes de Pau-a-Pique de Xilogravura
  ctx.strokeStyle = '#120b07';
  ctx.lineWidth = 2;
  for (let px = 40; px < w; px += 60) {
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
    ctx.stroke();
  }

  // Moldura Externa de Xilogravura
  drawMolduraCordel(ctx, 16, 14, w - 32, h - 28, { borderWeight: 4 });

  // 2. Cabeçalho da Casa
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w / 2 - 260, 24, 520, 56);
  ctx.fillStyle = XILO_COLORS.kraftLight;
  ctx.fillRect(w / 2 - 256, 28, 512, 48);
  ctx.strokeStyle = house.colorHex;
  ctx.lineWidth = 3;
  ctx.strokeRect(w / 2 - 256, 28, 512, 48);

  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 18px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`🏠 INTERIOR DA CASA ${house.index} — COR ${house.corName.toUpperCase()}`, w / 2, 50);

  ctx.font = '11px monospace';
  ctx.fillStyle = '#475569';
  ctx.fillText(house.clue || 'Deposite os 4 elementos sagrados correspondentes a esta moradia.', w / 2, 66);

  // 3. Os 4 Nichos / Slots de Encaixe de Xilogravura
  const slots = [
    { type: 'morador', label: 'MORADOR', icon: '👤', val: house.morador, color: '#f59e0b', x: w * 0.22, y: h * 0.40 },
    { type: 'bebida', label: 'BEBIDA', icon: '🍶', val: house.bebida, color: '#38bdf8', x: w * 0.41, y: h * 0.40 },
    { type: 'fumo', label: 'FUMO', icon: '🍂', val: house.fumo, color: '#f97316', x: w * 0.59, y: h * 0.40 },
    { type: 'animal', label: 'ANIMAL', icon: '🐾', val: house.animal, color: '#4ade80', x: w * 0.78, y: h * 0.40 },
  ];

  const slotW = 145;
  const slotH = 175;

  for (const s of slots) {
    const isHover = options.activeSlot === s.type;

    // Sombra do Nicho
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(s.x - slotW / 2 + 4, s.y - slotH / 2 + 6, slotW, slotH);

    // Corpo do Nicho (Madeira Talhada)
    ctx.fillStyle = s.val ? '#2a1a10' : '#170f09';
    ctx.fillRect(s.x - slotW / 2, s.y - slotH / 2, slotW, slotH);
    ctx.strokeStyle = isHover ? XILO_COLORS.goldAccent : XILO_COLORS.black;
    ctx.lineWidth = isHover ? 3 : 2;
    ctx.strokeRect(s.x - slotW / 2, s.y - slotH / 2, slotW, slotH);

    // Borda interna estilizada
    ctx.strokeStyle = s.val ? s.color : '#3f3f46';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(s.x - slotW / 2 + 5, s.y - slotH / 2 + 5, slotW - 10, slotH - 10);

    // Placa do Slot
    ctx.fillStyle = XILO_COLORS.black;
    ctx.fillRect(s.x - slotW / 2 + 8, s.y - slotH / 2 + 8, slotW - 16, 24);
    ctx.fillStyle = s.color;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${s.icon} ${s.label}`, s.x, s.y - slotH / 2 + 24);

    // Conteúdo / Estado do Slot
    if (s.val) {
      // Slot Preenchido
      ctx.fillStyle = XILO_COLORS.kraftPaper;
      ctx.fillRect(s.x - slotW / 2 + 12, s.y - 20, slotW - 24, 70);
      ctx.strokeStyle = XILO_COLORS.black;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(s.x - slotW / 2 + 12, s.y - 20, slotW - 24, 70);

      // Ícone Grande
      ctx.font = '26px sans-serif';
      ctx.fillText(s.icon, s.x, s.y + 12);

      // Nome do Item
      ctx.fillStyle = XILO_COLORS.black;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(s.val.toUpperCase(), s.x, s.y + 36);

      // Status
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('✓ ALOCADO', s.x, s.y - slotH / 2 + slotH - 14);
    } else {
      // Slot Vazio
      ctx.fillStyle = '#52525b';
      ctx.font = '28px sans-serif';
      ctx.fillText('🕳️', s.x, s.y + 10);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '11px monospace';
      ctx.fillText('[ VAZIO ]', s.x, s.y + 38);

      ctx.fillStyle = '#71717a';
      ctx.font = '9px monospace';
      ctx.fillText('Aperte [E] p/ Soltar', s.x, s.y - slotH / 2 + slotH - 14);
    }
  }

  // 4. Porta de Saída & Dicas de Controles no Rodapé
  ctx.fillStyle = XILO_COLORS.black;
  ctx.fillRect(w / 2 - 200, h - 85, 400, 48);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(w / 2 - 196, h - 81, 392, 40);
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 2;
  ctx.strokeRect(w / 2 - 196, h - 81, 392, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🚪 SAÍDA DA CASA — Pressione [E / Porta] para Voltar à Vila', w / 2, h - 62);
  ctx.font = '10px monospace';
  ctx.fillStyle = '#fde047';
  ctx.fillText('⚡ Dica: Dê um Grito [Espaço] para resetar todos os itens desta casa', w / 2, h - 48);

  ctx.restore();
}

/**
 * 📜 CAIXA DE DIÁLOGO & TOAST UNIFICADO EM XILOGRAVURA
 */
export function drawCaixaDialogoXilo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  speaker: string,
  text: string,
  options: {
    speaker?: string;
    prompt?: string;
    speakerColor?: string;
    isGlitchName?: boolean;
    isToast?: boolean;
    borderWeight?: number;
  } = {}
): void {
  ctx.save();

  const finalSpeaker = options.speaker || speaker;

  // Sombra profunda
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x + 4, y + 6, w, h);

  // Fundo Pergaminho / Kraft Escuro
  ctx.fillStyle = '#1e140d';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = options.borderWeight || 3;
  ctx.strokeRect(x, y, w, h);

  // Moldura interna de xilogravura
  ctx.strokeStyle = XILO_COLORS.goldAccent;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);

  // Cantoneiras ornamentais
  const cs = 10;
  ctx.fillStyle = XILO_COLORS.goldAccent;
  ctx.fillRect(x + 5, y + 5, cs, cs);
  ctx.fillRect(x + w - 5 - cs, y + 5, cs, cs);
  ctx.fillRect(x + 5, y + h - 5 - cs, cs, cs);
  ctx.fillRect(x + w - 5 - cs, y + h - 5 - cs, cs, cs);

  // Placa do Locutor / Título
  if (finalSpeaker) {
    const isGlitch = options.isGlitchName;
    ctx.fillStyle = XILO_COLORS.black;
    ctx.fillRect(x + 18, y - 12, finalSpeaker.length * 10 + 24, 22);
    ctx.strokeStyle = isGlitch ? '#ef4444' : options.speakerColor || XILO_COLORS.goldAccent;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 18, y - 12, finalSpeaker.length * 10 + 24, 22);

    ctx.fillStyle = isGlitch ? '#f87171' : options.speakerColor || '#fef08a';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(finalSpeaker.toUpperCase(), x + 28, y - 1);
  }

  // Texto da Fala / Notificação
  ctx.fillStyle = '#f4ebd9';
  ctx.font = '14px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Quebra de linha inteligente
  const words = text.split(' ');
  let line = '';
  let curY = y + 18;
  const maxLineW = w - 40;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineW && i > 0) {
      ctx.fillText(line, x + 20, curY);
      line = words[i] + ' ';
      curY += 20;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x + 20, curY);

  // Prompt de ação / avanço
  const prompt = options.prompt || '[ Solte E para Avançar ]';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(prompt, x + w - 16, y + h - 10);

  ctx.restore();
}

/**
 * 🪧 PLACA DE AVISO EM XILOGRAVURA (CORDEL)
 * Placa rústica de madeira cravada no chão com entalhes e sinalização folclórica.
 */
export function drawPlacaAviso(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number = 34,
  height: number = 34,
  _label?: string,
  options: XiloRenderOptions = {}
): void {
  ctx.save();
  ctx.translate(x, y);

  const t = options.time || 0;
  const sway = Math.sin(t * 2) * 0.02;
  ctx.rotate(sway);

  // 1. Sombra no chão de terra batida
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, height * 0.45, width * 0.45, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Estaca / Mourão de Madeira fincada no chão
  ctx.fillStyle = '#3b2615';
  ctx.fillRect(-3.5, -height * 0.1, 7, height * 0.55);
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(-3.5, -height * 0.1, 7, height * 0.55);

  // Ranhuras da estaca de madeira
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.moveTo(-0.5, 0);
  ctx.lineTo(-0.5, height * 0.38);
  ctx.stroke();

  // 3. Tábua da Placa (madeira rústica entalhada)
  const pw = width;
  const ph = height * 0.58;
  const py = -height * 0.22;

  ctx.fillStyle = '#854d0e'; // Madeira envelhecida
  ctx.fillRect(-pw / 2, py - ph / 2, pw, ph);

  // Borda grossa preta de xilogravura
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 2.2;
  ctx.strokeRect(-pw / 2, py - ph / 2, pw, ph);

  // Entalhe interno amarelo kraft
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.strokeRect(-pw / 2 + 2.5, py - ph / 2 + 2.5, pw - 5, ph - 5);

  // Pregos de ferro batido nos cantos
  ctx.fillStyle = XILO_COLORS.black;
  ctx.beginPath();
  ctx.arc(-pw / 2 + 5, py, 1.8, 0, Math.PI * 2);
  ctx.arc(pw / 2 - 5, py, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 4. Ícone de Alerta / Topada (Triângulo de advertência)
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(0, py - ph * 0.32);
  ctx.lineTo(-7, py + ph * 0.22);
  ctx.lineTo(7, py + ph * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = XILO_COLORS.black;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Ponto de exclamação
  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 0, py);

  ctx.restore();
}

/**
 * 🎵 ONDA SONORA DE ASSOBIO EM XILOGRAVURA (CUMADE FULOZINHA)
 */
export function drawOndaAssobioXilo(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  radius: number,
  options: { isClose?: boolean; time?: number; intensity?: number } = {}
): void {
  ctx.save();
  const t = options.time || 0;
  const isClose = options.isClose ?? false;
  const intensity = options.intensity ?? 1;

  const colorPrimary = isClose ? '#facc15' : '#38bdf8';
  const colorSecondary = isClose ? '#ea580c' : '#0284c7';

  // Ondas concêntricas entalhadas
  for (let i = 0; i < 3; i++) {
    const r = (radius + i * 22 + Math.sin(t * 8 + i) * 6) * intensity;
    if (r <= 0) continue;

    const alpha = Math.max(0, 1 - (r / 350));
    ctx.strokeStyle = i % 2 === 0 ? colorPrimary : colorSecondary;
    ctx.globalAlpha = alpha * 0.8;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(originX, originY, r, 0, Math.PI * 2);
    ctx.stroke();

    // Hachuras radiais de som
    ctx.lineWidth = 1.5;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const sx = originX + Math.cos(angle + t) * (r - 6);
      const sy = originY + Math.sin(angle + t) * (r - 6);
      const ex = originX + Math.cos(angle + t) * (r + 6);
      const ey = originY + Math.sin(angle + t) * (r + 6);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
  }

  // Notas / Ecos Místicos no ar
  ctx.fillStyle = colorPrimary;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.85;
  for (let a = 0; a < 4; a++) {
    const angle = a * (Math.PI / 2) + t * 2;
    const nx = originX + Math.cos(angle) * (radius * 0.8);
    const ny = originY + Math.sin(angle) * (radius * 0.8);
    ctx.fillText('≋ ♫', nx, ny);
  }

  ctx.restore();
}

/**
 * 🍃 BRUMA & FOLHAS DE SUMIÇO / REAPARECIMENTO DA FULÔ
 */
export function drawBrumaFuloXilo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  options: { time?: number; progress?: number; isSpawn?: boolean } = {}
): void {
  ctx.save();
  const t = options.time || 0;
  const progress = options.progress ?? 1;

  const currentRadius = radius * progress;

  // Bruma mágica de fundo
  const grad = ctx.createRadialGradient(x, y, 0, x, y, currentRadius);
  grad.addColorStop(0, 'rgba(21, 128, 61, 0.45)');
  grad.addColorStop(0.6, 'rgba(217, 119, 6, 0.25)');
  grad.addColorStop(1, 'rgba(10, 8, 6, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
  ctx.fill();

  // Partículas de folhas rodopiantes
  const leafCount = 10;
  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2 + t * 4;
    const dist = (currentRadius * 0.4) + Math.sin(t * 6 + i) * (currentRadius * 0.35);
    const lx = x + Math.cos(angle) * dist;
    const ly = y + Math.sin(angle) * dist;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle + Math.PI / 2);

    ctx.fillStyle = i % 2 === 0 ? XILO_COLORS.greenAccent : XILO_COLORS.goldAccent;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = XILO_COLORS.black;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * 🌪️ INDICADOR HUD DE CONTROLES INVERTIDOS (ASSOBIO DA FULÔ)
 */
export function drawIndicadorControlesInvertidosXilo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  options: { time?: number; durationTotal?: number; timeLeft?: number } = {}
): void {
  ctx.save();
  const t = options.time || 0;
  const pulse = Math.sin(t * 10) * 2;
  const timeLeft = options.timeLeft ?? 0;
  const w = 340;
  const h = 42;

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x - w / 2 + 4, y - h / 2 + 5, w, h);

  // Placa de Alerta em Xilogravura
  ctx.fillStyle = '#450a0a';
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);

  // Moldura interna dourada
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6);

  // Texto de Alerta
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🌪️ CONTROLES INVERTIDOS! (${timeLeft.toFixed(1)}s) 🌪️`, x, y - 6 + pulse * 0.2);

  // Setas invertidas
  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('⬆=BAIXO  ⬇=CIMA  ⬅=DIREITA  ➡=ESQUERDA', x, y + 10);

  ctx.restore();
}

/**
 * 📜 FOLHETO DE ABERTURA DO JOGO (ESTÚDIO DE XILOGRAVURA)
 */
export function drawFolhetoAberturaEstudioXilo(
  ctx: CanvasRenderingContext2D,
  width: number = 960,
  height: number = 580,
  options: { time?: number } = {}
): void {
  ctx.save();
  const t = options.time || 0;

  // Backdrop escuro
  ctx.fillStyle = 'rgba(10, 8, 6, 0.92)';
  ctx.fillRect(0, 0, width, height);

  // Folheto Central de Cordel (960x580)
  const modalW = Math.min(800, width - 48);
  const modalH = Math.min(520, height - 32);
  const modalX = (width - modalW) / 2;
  const modalY = (height - modalH) / 2;

  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.fillRect(modalX, modalY, modalW, modalH);

  drawMolduraCordel(ctx, modalX, modalY, modalW, modalH, { borderWeight: 4 });

  // Cabeçalho de Cordel
  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FOLHETO DE CORDEL — O INÍCIO DA JORNADA', width / 2, modalY + 38);

  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillText('"O ESTÚDIO DE XILOGRAVURA MALASSOMBRADO"', width / 2, modalY + 72);

  ctx.font = 'italic 13px "Courier New", monospace';
  ctx.fillStyle = '#78350f';
  ctx.fillText('Origens, mistérios e o chamado dos folhetos de cordel', width / 2, modalY + 96);

  // Linha divisória
  ctx.strokeStyle = '#8c6d46';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(modalX + 50, modalY + 112);
  ctx.lineTo(modalX + modalW - 50, modalY + 112);
  ctx.stroke();

  // Texto da História de Abertura
  const verses = [
    'Bem vindo, forasteiro.',
    'Por algum motivo, sabe-se lá Deus como,',
    'tu veio parar em um estúdio de xilogravura malassombrado.',
    'Agora tu só consegue sair daqui quando contar tua história.',
    'Então, Coisinha, como é teu nome mesmo?'
  ];

  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = '14px "Courier New", monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < verses.length; i++) {
    ctx.fillText(verses[i], width / 2, modalY + 148 + i * 26);
  }

  // Caixa de Missão
  const objY = modalY + 300;
  ctx.fillStyle = '#1e1b18';
  ctx.fillRect(modalX + 40, objY, modalW - 80, 80);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(modalX + 40, objY, modalW - 80, 80);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('🎯 MISSÃO DO CORDEL MESTRE:', width / 2, objY + 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  ctx.fillText('Reúna os 4 Elementos Místicos nos contos do chão e acione a Prensa!', width / 2, objY + 48);

  ctx.fillStyle = '#86efac';
  ctx.fillText('🪓 Carimbo | 📄 Folha | 🪶 Pena | 🖋️ Tinta', width / 2, objY + 68);

  // Botão de Iniciar
  const pulse = Math.sin(t * 5) * 3;
  ctx.fillStyle = '#15803d';
  ctx.fillRect(width / 2 - 160, modalY + modalH - 58, 320, 40);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 160, modalY + modalH - 58, 320, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('ENTRAR NO ESTÚDIO [E / Clique] ▶', width / 2, modalY + modalH - 33 + pulse * 0.3);

  ctx.restore();
}

/**
 * 📣 MODAL PRÉ-ENCERRAMENTO ("GRITA TEU NOME") NA PRENSA DO DESTINO
 */
export function drawModalPreEncerramentoNomeXilo(
  ctx: CanvasRenderingContext2D,
  currentName: string,
  width: number = 960,
  height: number = 580,
  options: { time?: number } = {}
): void {
  ctx.save();
  const t = options.time || 0;

  // Backdrop escuro
  ctx.fillStyle = 'rgba(10, 8, 6, 0.94)';
  ctx.fillRect(0, 0, width, height);

  // Folheto Central de Celebração e Nomeação
  const modalW = Math.min(800, width - 48);
  const modalH = Math.min(520, height - 32);
  const modalX = (width - modalW) / 2;
  const modalY = (height - modalH) / 2;

  ctx.fillStyle = XILO_COLORS.kraftPaper;
  ctx.fillRect(modalX, modalY, modalW, modalH);

  drawMolduraCordel(ctx, modalX, modalY, modalW, modalH, { borderWeight: 4 });

  // Cabeçalho de Glória
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✨ OS 4 INSTRUMENTOS MESTRES REUNIDOS! ✨', width / 2, modalY + 38);

  ctx.fillStyle = XILO_COLORS.black;
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillText('A PRENSA DO DESTINO TE CHAMA!', width / 2, modalY + 70);

  // Pergunta Canônica
  ctx.font = 'italic bold 18px "Courier New", monospace';
  ctx.fillStyle = '#78350f';
  ctx.fillText('"Como é teu nome mesmo, Coisinha?"', width / 2, modalY + 115);

  // Caixa / Input Estilizado em Xilogravura
  const inputW = 460;
  const inputH = 55;
  const inputX = width / 2 - inputW / 2;
  const inputY = modalY + 160;

  ctx.fillStyle = '#1e140d';
  ctx.fillRect(inputX, inputY, inputW, inputH);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(inputX, inputY, inputW, inputH);

  // Moldura interna dourada
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1;
  ctx.strokeRect(inputX + 3, inputY + 3, inputW - 6, inputH - 6);

  // Texto digitado com cursor piscante
  const isBlink = Math.floor(t * 3) % 2 === 0;
  const cursor = isBlink ? '|' : '';
  const displayName = currentName || '';

  if (displayName) {
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${displayName.toUpperCase()}${cursor}`, width / 2, inputY + inputH / 2);
  } else {
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'italic 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Digite teu nome de herói...${cursor}`, width / 2, inputY + inputH / 2);
  }

  // 4 Selos de Xilogravura
  const icons = ['🪓 Carimbo', '📄 Folha', '🪶 Pena', '🖋️ Tinta'];
  const iconY = modalY + 250;
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i < icons.length; i++) {
    const ix = width / 2 - 210 + i * 140;
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(ix - 55, iconY - 14, 110, 28);
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(ix - 55, iconY - 14, 110, 28);

    ctx.fillStyle = '#86efac';
    ctx.fillText(icons[i], ix, iconY + 5);
  }

  // Botão "Grita teu nome"
  const pulse = Math.sin(t * 6) * 3;
  const btnW = 340;
  const btnH = 46;
  const btnX = width / 2 - btnW / 2;
  const btnY = modalY + modalH - 70;

  ctx.fillStyle = '#15803d';
  ctx.fillRect(btnX, btnY, btnW, btnH);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(btnX, btnY, btnW, btnH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GRITA TEU NOME 📣 [Enter]', width / 2, btnY + btnH / 2 + pulse * 0.2);

  ctx.restore();
}

