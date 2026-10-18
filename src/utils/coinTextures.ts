import * as THREE from 'three';

/**
 * Procedural Realistic Bitcoin Textures for Side Hustle 3D Medallion
 * Creates high-resolution 1024x1024 diffuse, bump, and reeded edge textures.
 */

// Helper to draw text curved along a circle arc
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  isBottom = false,
  fillColor = '#ffffff'
) {
  ctx.save();
  ctx.font = 'bold 36px "Cinzel", "Times New Roman", Georgia, serif';
  ctx.fillStyle = fillColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = isBottom ? 'bottom' : 'top';

  const chars = text.split('');
  const totalAngle = endAngle - startAngle;
  const angleStep = totalAngle / (chars.length - 1 || 1);

  for (let i = 0; i < chars.length; i++) {
    const angle = isBottom ? endAngle - i * angleStep : startAngle + i * angleStep;
    ctx.save();
    ctx.translate(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    );
    ctx.rotate(angle + (isBottom ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Creates the high-resolution front face diffuse color texture of the Bitcoin
 */
export function createBitcoinFaceTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.47;

  // 1. Radial metallic brushed gold background
  const bgGrad = ctx.createRadialGradient(cx - 80, cy - 80, 50, cx, cy, r);
  bgGrad.addColorStop(0, '#fde68a'); // bright gold specular center
  bgGrad.addColorStop(0.35, '#f59e0b'); // amber gold
  bgGrad.addColorStop(0.7, '#d97706'); // deep minted gold
  bgGrad.addColorStop(0.95, '#b45309'); // outer rim shadow
  bgGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 2. Micro-brushed concentric metallic rings
  ctx.save();
  for (let i = 40; i < r; i += 6) {
    ctx.strokeStyle = i % 12 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, i, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Thick outer minted rim
  ctx.save();
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fef3c7'; // bright highlight ring
  ctx.beginPath();
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. Denticles (beaded dots around the perimeter, classic physical coin feature)
  const numDots = 72;
  const dotRadius = r - 34;
  ctx.fillStyle = '#fde68a';
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * Math.PI * 2;
    const x = cx + Math.cos(angle) * dotRadius;
    const y = cy + Math.sin(angle) * dotRadius;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Inscribed Ring for Text
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(cx, cy, r - 80, 0, Math.PI * 2);
  ctx.stroke();

  // 6. TOP ARC TEXT: "★ SIDE HUSTLE ★"
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  drawCurvedText(
    ctx,
    '★  SIDE HUSTLE  ★',
    cx,
    cy,
    r - 60,
    -Math.PI * 0.78,
    -Math.PI * 0.22,
    false,
    '#fffbeb'
  );
  ctx.restore();

  // 7. BOTTOM ARC TEXT: "• PROOF OF WORK • 2026 •"
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 6;
  drawCurvedText(
    ctx,
    '• PROOF OF VALUE • 2026 •',
    cx,
    cy,
    r - 60,
    Math.PI * 0.22,
    Math.PI * 0.78,
    true,
    '#fef3c7'
  );
  ctx.restore();

  // 8. Circuit board trace lines (like physical Bitcoin token)
  ctx.save();
  ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#fde68a';

  const circuitAngles = [
    0, Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75,
    Math.PI, Math.PI * 1.25, Math.PI * 1.5, Math.PI * 1.75
  ];
  circuitAngles.forEach((a) => {
    const x1 = cx + Math.cos(a) * 160;
    const y1 = cy + Math.sin(a) * 160;
    const x2 = cx + Math.cos(a) * 280;
    const y2 = cy + Math.sin(a) * 280;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Solder pad / dot
    ctx.beginPath();
    ctx.arc(x2, y2, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 9. Center Medallion Inner Circle
  ctx.save();
  const innerGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, 150);
  innerGrad.addColorStop(0, '#fef08a');
  innerGrad.addColorStop(0.7, '#d97706');
  innerGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 155, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fef3c7';
  ctx.stroke();

  // Micro-beaded ring around center
  const innerDots = 48;
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < innerDots; i++) {
    const angle = (i / innerDots) * Math.PI * 2;
    const x = cx + Math.cos(angle) * 142;
    const y = cy + Math.sin(angle) * 142;
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 10. Central Monogram: Dual-stroke "SH" with Bitcoin currency bars
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  // Two vertical currency bars
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cx - 38, cy - 110, 10, 220);
  ctx.fillRect(cx + 28, cy - 110, 10, 220);

  // Bold "SH" Emblem
  ctx.font = '900 125px "Times New Roman", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SH', cx, cy - 5);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#78350f';
  ctx.strokeText('SH', cx, cy - 5);
  ctx.restore();

  // Micro-inscriptions
  ctx.save();
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#78350f';
  ctx.textAlign = 'center';
  ctx.fillText('LOCAL-FIRST • 100% PRIVATE • ZERO LEAKS', cx, cy + 90);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates the high-resolution bump map for tactile 3D relief on the coin face
 */
export function createBitcoinBumpTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.47;

  // Base neutral gray
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Outer recessed bevel
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.stroke();

  // Raised outer rim
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 18, 0, Math.PI * 2);
  ctx.stroke();

  // Raised Denticles (dots)
  const numDots = 72;
  const dotRadius = r - 34;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * Math.PI * 2;
    const x = cx + Math.cos(angle) * dotRadius;
    const y = cy + Math.sin(angle) * dotRadius;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Recessed circular groove
  ctx.strokeStyle = '#404040';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 80, 0, Math.PI * 2);
  ctx.stroke();

  // Raised text: "★ SIDE HUSTLE ★"
  drawCurvedText(
    ctx,
    '★  SIDE HUSTLE  ★',
    cx,
    cy,
    r - 60,
    -Math.PI * 0.78,
    -Math.PI * 0.22,
    false,
    '#ffffff'
  );

  drawCurvedText(
    ctx,
    '• PROOF OF VALUE • 2026 •',
    cx,
    cy,
    r - 60,
    Math.PI * 0.22,
    Math.PI * 0.78,
    true,
    '#ffffff'
  );

  // Center medallion raised rim
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 155, 0, Math.PI * 2);
  ctx.stroke();

  // Currency vertical bars
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 38, cy - 110, 10, 220);
  ctx.fillRect(cx + 28, cy - 110, 10, 220);

  // Raised "SH" text
  ctx.font = '900 125px "Times New Roman", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SH', cx, cy - 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Creates the reeded / milled coin edge texture (vertical ridges along cylinder perimeter)
 */
export function createReededEdgeTexture(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const w = 512;
  const h = 64;

  // Diffuse texture
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = w;
  mapCanvas.height = h;
  const mapCtx = mapCanvas.getContext('2d')!;

  mapCtx.fillStyle = '#b45309';
  mapCtx.fillRect(0, 0, w, h);

  // Bump texture
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, w, h);

  const numRidges = 96;
  const stripeWidth = w / numRidges;

  for (let i = 0; i < numRidges; i++) {
    const x = i * stripeWidth;
    // Map
    mapCtx.fillStyle = i % 2 === 0 ? '#fde68a' : '#92400e';
    mapCtx.fillRect(x, 0, stripeWidth * 0.65, h);

    // Bump
    bumpCtx.fillStyle = i % 2 === 0 ? '#ffffff' : '#202020';
    bumpCtx.fillRect(x, 0, stripeWidth * 0.65, h);
  }

  const mapTexture = new THREE.CanvasTexture(mapCanvas);
  mapTexture.wrapS = THREE.RepeatWrapping;
  mapTexture.wrapT = THREE.ClampToEdgeWrapping;
  mapTexture.repeat.set(4, 1);

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;
  bumpTexture.repeat.set(4, 1);

  return { map: mapTexture, bumpMap: bumpTexture };
}
