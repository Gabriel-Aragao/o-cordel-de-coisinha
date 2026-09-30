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
