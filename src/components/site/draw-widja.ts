import type { Eye, Hoodie, Mouth, Widget } from "@/lib/widja-pose";

export type PaintInput = {
  chaos: number;
  eye: Eye;
  mouth: Mouth;
  widget: Widget;
  hoodie: Hoodie;
  showRig: boolean;
  time: number;
  look: { x: number; y: number } | null;
};

type Joint = { x: number; y: number };
type Joints = Record<string, Joint>;

const CURLS: [number, number, number, number][] = [
  [0, -112, 36, 0],
  [-40, -104, 33, 1],
  [42, -102, 34, 2],
  [-76, -82, 31, 0],
  [78, -80, 32, 1],
  [-102, -46, 30, 2],
  [104, -44, 31, 0],
  [-112, -6, 28, 1],
  [114, -4, 29, 2],
  [-100, 32, 26, 0],
  [102, 34, 27, 1],
  [-78, 60, 24, 2],
  [80, 62, 24, 0],
  [-48, -74, 28, 1],
  [46, -72, 27, 2],
  [0, -78, 26, 0],
  [-24, -48, 22, 1],
  [26, -46, 22, 2],
  [-58, -22, 24, 0],
  [60, -20, 24, 1],
  [-18, -88, 22, 2],
  [16, -90, 20, 0],
];

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function hex(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

function mix(a: string, b: string, t: number) {
  const u = clamp(t, 0, 1);
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * u));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function paintWidja(
  ctx: CanvasRenderingContext2D,
  cssW: number,
  cssH: number,
  input: PaintInput,
) {
  const chaos = clamp(input.chaos / 100, 0, 1);
  const designW = 480;
  const designH = 780;
  const scale = Math.min(cssW / designW, cssH / designH) * 0.86;
  const breath = Math.sin(input.time * 2.1) * (1 - chaos * 0.25) * 4;
  const sway = Math.sin(input.time * 1.3) * 2;

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.save();
  ctx.translate(cssW / 2 + sway, cssH / 2 - 8 + breath);
  ctx.rotate(lerp(0, -0.045, chaos));
  ctx.scale(scale, scale);
  ctx.translate(-240, -400);

  const joints: Joints = {};
  drawCharacter(ctx, chaos, input, joints);
  if (input.showRig) drawRig(ctx, joints, 1);
  ctx.restore();
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  chaos: number,
  input: PaintInput,
  joints: Joints,
) {
  const cx = 240;
  const headY = 214;
  const headR = 78;
  const hoodieMix = input.hoodie === "mint" ? 0 : input.hoodie === "void" ? 1 : chaos;
  const hairCalm: [string, string, string] = ["#F09A48", "#D56E2E", "#F2C48A"];
  const hairWild: [string, string, string] = ["#5A3484", "#2A1648", "#8A5CB8"];
  const hoodA = "#8FDDD2";
  const hoodB = "#1A1A22";
  const hoodDeepA = "#5BB5AA";
  const hoodDeepB = "#101016";
  const hoodLiteA = "#E7FAF6";
  const hoodLiteB = "#3A3A44";
  const pant = mix("#4A5362", "#23262E", chaos);
  const shoeA = "#8FDDD2";
  const shoeB = "#E7EEF2";
  const ink = "#241C22";
  const skin = mix("#C48458", "#A86B45", chaos * 0.25);
  const skinDeep = mix("#A86B43", "#7A4A32", chaos * 0.35);
  const blush = chaos;

  const stance = lerp(0, 18, chaos);
  const hipY = 492;
  const kneeY = 590;
  const footY = 688;
  const leftLeg = cx - 40 - stance;
  const rightLeg = cx + 40 + stance;

  const lShoulder = { x: cx - 96, y: 338 };
  const rShoulder = { x: cx + 98, y: 336 };
  const lElbow = {
    x: lerp(cx - 132, cx - 148, chaos),
    y: lerp(404, 392, chaos),
  };
  const lHand = {
    x: lerp(cx - 118, cx - 156, chaos),
    y: lerp(478, 456, chaos) + Math.sin(input.time * 3) * 2,
  };
  const rElbow = {
    x: lerp(cx + 124, cx + 150, chaos),
    y: lerp(420, 400, chaos),
  };
  const rHand = {
    x: lerp(cx + 112, cx + 168, chaos),
    y: lerp(500, 470, chaos),
  };

  joints.head = { x: cx, y: headY };
  joints.neck = { x: cx, y: 300 };
  joints.lShoulder = lShoulder;
  joints.rShoulder = rShoulder;
  joints.lElbow = lElbow;
  joints.rElbow = rElbow;
  joints.lWrist = lHand;
  joints.rWrist = rHand;
  joints.pelvis = { x: cx, y: hipY };
  joints.lKnee = { x: leftLeg, y: kneeY };
  joints.rKnee = { x: rightLeg, y: kneeY };
  joints.lAnkle = { x: leftLeg - 2, y: footY - 8 };
  joints.rAnkle = { x: rightLeg + 2, y: footY - 8 };

  // ground
  ctx.save();
  ctx.fillStyle = `rgb(20 20 28 / ${0.12 + chaos * 0.08})`;
  ctx.beginPath();
  ctx.ellipse(cx, footY + 18, 92 + stance, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // morph arc
  const ghost = Math.sin(clamp(chaos, 0, 1) * Math.PI);
  if (ghost > 0.05) {
    ctx.save();
    ctx.strokeStyle = `rgb(62 208 224 / ${0.35 + ghost * 0.45})`;
    ctx.setLineDash([5, 7]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 150, 78);
    ctx.quadraticCurveTo(cx, 18, cx + 150, 78);
    ctx.stroke();
    ctx.setLineDash([]);
    const u = (Math.sin(input.time * 1.4) * 0.5 + 0.5);
    const ax = lerp(cx - 150, cx + 150, u);
    const ay = 78 + (18 - 78) * Math.sin(u * Math.PI);
    ctx.fillStyle = "#fffcf8";
    ctx.beginPath();
    ctx.arc(ax, ay * 0.72 + 28, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawHair(ctx, cx, headY, hairCalm, hairWild, chaos, ink);
  drawEars(ctx, cx, headY, skin, skinDeep, ink);

  limb(ctx, leftLeg, hipY - 6, leftLeg - 2, footY - 18, 26, 22, pant, pant, 0, ink);
  limb(ctx, rightLeg, hipY - 6, rightLeg + 2, footY - 18, 26, 22, pant, pant, 0, ink);
  shoeShape(ctx, leftLeg - 4, footY - 4, shoeA, shoeB, chaos, ink);
  shoeShape(ctx, rightLeg + 4, footY - 4, shoeA, shoeB, chaos, ink);

  duoShape(ctx, () => torsoPath(ctx, cx, 312), hoodA, hoodB, hoodieMix, ink);
  duoShape(ctx, () => {
    roundRect(ctx, cx - 42, 436, 84, 46, 14);
  }, hoodDeepA, hoodDeepB, hoodieMix, ink);

  limb(ctx, cx - 70, 360, lElbow.x, lElbow.y, 28, 24, hoodA, hoodB, hoodieMix, ink);
  limb(ctx, lElbow.x, lElbow.y, lHand.x, lHand.y, 24, 20, hoodDeepA, hoodDeepB, hoodieMix, ink);
  limb(ctx, cx + 70, 358, rElbow.x, rElbow.y, 28, 24, hoodA, hoodB, hoodieMix, ink);
  limb(ctx, rElbow.x, rElbow.y, rHand.x, rHand.y, 24, 20, hoodA, hoodB, hoodieMix, ink);

  duoShape(
    ctx,
    () => {
      ctx.beginPath();
      ctx.ellipse(cx, 324, 54, 18, 0, 0, Math.PI * 2);
    },
    hoodDeepA,
    hoodDeepB,
    hoodieMix,
    ink,
  );

  drawStrings(ctx, cx, 334, mix(hoodLiteA, hoodLiteB, hoodieMix), ink);
  drawChest(ctx, cx, 392, hoodieMix, ink);

  // neck + head
  ctx.save();
  ctx.fillStyle = skin;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  roundRect(ctx, cx - 18, 286, 36, 36, 12);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = skin;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, headY, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // cheek shade
  ctx.fillStyle = skinDeep;
  ctx.globalAlpha = 0.18 + chaos * 0.12;
  ctx.beginPath();
  ctx.ellipse(cx + 36, headY + 18, 22, 16, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawFace(ctx, cx, headY, input, chaos, skin, ink, blush);

  // hands
  hand(ctx, lHand.x, lHand.y, skin, ink, 17);
  hand(ctx, rHand.x, rHand.y, skin, ink, 16);

  const phoneAngle = lerp(-0.18, 0.42, chaos) + Math.sin(input.time * 2.4) * 0.03;
  drawPhone(ctx, lHand.x - 8, lHand.y - 8, phoneAngle, input.widget, chaos, ink);

  if (chaos > 0.45) drawGlitchBits(ctx, cx, headY, chaos, input.time);
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  calm: [string, string, string],
  wild: [string, string, string],
  chaos: number,
  ink: string,
) {
  for (const [dx, dy, r, shade] of CURLS) {
    const colorA = calm[shade] ?? calm[0];
    const colorB = wild[shade] ?? wild[0];
    ctx.beginPath();
    ctx.arc(cx + dx, headY + dy, r, 0, Math.PI * 2);
    ctx.fillStyle = colorA;
    ctx.globalAlpha = 1 - chaos;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + dx, headY + dy, r, 0, Math.PI * 2);
    ctx.fillStyle = colorB;
    ctx.globalAlpha = chaos;
    ctx.fill();
  }
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  for (const [dx, dy, r] of CURLS.filter((_, i) => i % 2 === 0)) {
    ctx.beginPath();
    ctx.arc(cx + dx, headY + dy, r * 0.62, 0.6, 2.4);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (chaos > 0.55) {
    ctx.save();
    ctx.strokeStyle = `rgb(62 208 224 / ${0.25 + chaos * 0.55})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx + 98, headY - 24, 46, -1, 0.8);
    ctx.stroke();
    ctx.restore();
  }
}

function drawEars(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  skin: string,
  skinDeep: string,
  ink: string,
) {
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + side * 74, headY + 10);
    ctx.fillStyle = skin;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = skinDeep;
    ctx.beginPath();
    ctx.ellipse(side * 2, 2, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  input: PaintInput,
  chaos: number,
  skin: string,
  ink: string,
  blushAmt: number,
) {
  const blink = blinkAmount(input.time);
  const look = input.look;
  const lookX = look ? clamp((look.x - 0.5) * 10, -4, 4) : Math.sin(input.time * 0.7) * 2;
  const lookY = look ? clamp((look.y - 0.42) * 8, -3, 3) : Math.cos(input.time * 0.5) * 1.2;

  ctx.save();
  ctx.fillStyle = mix("#E7A48E", "#C4847A", blushAmt);
  ctx.globalAlpha = 0.45 * (1 - blushAmt * 0.55);
  ctx.beginPath();
  ctx.ellipse(cx - 40, headY + 22, 14, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 40, headY + 22, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const browMood = input.eye === "wild" ? 1 : input.eye === "lidded" ? 0.45 : input.eye === "bright" ? -0.7 : -0.15;
  brow(ctx, cx - 28, headY - 36, -1, browMood + chaos * 0.2, ink);
  brow(ctx, cx + 28, headY - 36, 1, browMood + chaos * 0.35, ink);

  const wild = input.eye === "wild";
  drawEye(ctx, cx - 28, headY - 6, wild ? 20 : input.eye === "bright" ? 18 : 16, {
    lid: wild ? 0.05 : input.eye === "lidded" ? 0.46 : 0.06,
    blink,
    lookX,
    lookY,
    iris: mix("#6A4228", "#7A4AD0", wild ? 0.85 : chaos * 0.35),
    skin,
    ink,
    sclera: wild || chaos > 0.7 ? "#F3EEFF" : "#FFFEFB",
  });
  drawEye(ctx, cx + 28, headY - 4, wild ? 15 : input.eye === "bright" ? 18 : 16, {
    lid: wild ? 0.55 : input.eye === "lidded" ? 0.5 : 0.08,
    blink: wild ? blink * 0.35 : blink,
    lookX,
    lookY,
    iris: mix("#6A4228", "#C026FF", wild ? 1 : chaos * 0.35),
    skin,
    ink,
    sclera: wild || chaos > 0.7 ? "#F3EEFF" : "#FFFEFB",
  });

  // nose
  ctx.save();
  ctx.strokeStyle = mix("#8A5340", "#5C382C", chaos);
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 3, headY + 16);
  ctx.quadraticCurveTo(cx + 2, headY + 24, cx + 7, headY + 16);
  ctx.stroke();
  ctx.restore();

  drawMouth(ctx, cx, headY + 40, input.mouth, ink);
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  opt: {
    lid: number;
    blink: number;
    lookX: number;
    lookY: number;
    iris: string;
    skin: string;
    ink: string;
    sclera: string;
  },
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.94, 0, 0, Math.PI * 2);
  ctx.fillStyle = opt.sclera;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = opt.ink;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(opt.lookX, opt.lookY + 1, r * 0.56, 0, Math.PI * 2);
  ctx.fillStyle = opt.iris;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(opt.lookX, opt.lookY + 1, r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = "#1A1220";
  ctx.fill();
  ctx.fillStyle = "#FFFEFB";
  ctx.beginPath();
  ctx.arc(opt.lookX - r * 0.16, opt.lookY - r * 0.16, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(opt.lookX + r * 0.18, opt.lookY + r * 0.16, r * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const cover = clamp(Math.max(opt.lid, opt.blink), 0, 1);
  if (cover > 0.02) {
    ctx.beginPath();
    ctx.rect(-r - 2, -r - 4, r * 2 + 4, r * 2 * cover + 2);
    ctx.fillStyle = opt.skin;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r + 1, -r + r * 2 * cover);
    ctx.quadraticCurveTo(0, -r + r * 2 * cover + 6, r - 1, -r + r * 2 * cover);
    ctx.strokeStyle = opt.ink;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
  ctx.restore();
}

function brow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  side: number,
  mood: number,
  ink: string,
) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  const inner = mood * 8;
  ctx.moveTo(x - 16 * side, y + inner * 0.2);
  ctx.quadraticCurveTo(x, y - 8 + mood * 6, x + 16 * side, y + inner);
  ctx.stroke();
  ctx.restore();
}

function drawMouth(ctx: CanvasRenderingContext2D, x: number, y: number, mouth: Mouth, ink: string) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 3.4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (mouth === "grin") {
    ctx.beginPath();
    ctx.moveTo(x - 24, y - 2);
    ctx.quadraticCurveTo(x, y + 28, x + 24, y - 2);
    ctx.quadraticCurveTo(x, y + 6, x - 24, y - 2);
    ctx.fillStyle = "#3A2422";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FFFEFB";
    ctx.beginPath();
    ctx.moveTo(x - 18, y + 1);
    ctx.quadraticCurveTo(x, y + 8, x + 18, y + 1);
    ctx.quadraticCurveTo(x, y + 10, x - 18, y + 1);
    ctx.fill();
    ctx.fillStyle = "#E07A8A";
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 10, 6, 0, 0, Math.PI);
    ctx.fill();
  } else if (mouth === "smirk") {
    ctx.beginPath();
    ctx.moveTo(x - 16, y + 2);
    ctx.quadraticCurveTo(x - 2, y + 6, x + 6, y);
    ctx.quadraticCurveTo(x + 16, y - 2, x + 24, y + 6);
    ctx.stroke();
  } else if (mouth === "smile") {
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.quadraticCurveTo(x, y + 18, x + 18, y);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 11, y + 2);
    ctx.quadraticCurveTo(x, y + 10, x + 11, y + 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStrings(ctx: CanvasRenderingContext2D, cx: number, y: number, color: string, ink: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 12, y);
  ctx.quadraticCurveTo(cx - 16, y + 36, cx - 8, y + 48);
  ctx.moveTo(cx + 12, y);
  ctx.quadraticCurveTo(cx + 18, y + 34, cx + 8, y + 50);
  ctx.stroke();
  ctx.fillStyle = ink;
  for (const [dx, dy] of [
    [-8, 48],
    [8, 50],
  ] as const) {
    ctx.beginPath();
    ctx.arc(cx + dx, y + dy, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawChest(ctx: CanvasRenderingContext2D, cx: number, y: number, hoodieMix: number, ink: string) {
  ctx.save();
  if (hoodieMix < 0.85) {
    ctx.globalAlpha = 1 - hoodieMix;
    ctx.strokeStyle = "#fffcf8";
    ctx.fillStyle = "#fffcf8";
    ctx.lineWidth = 2;
    roundRect(ctx, cx - 12, y - 16, 24, 32, 10);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, y - 12);
    ctx.lineTo(cx, y + 8);
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.45 * (1 - hoodieMix);
    ctx.stroke();
  }
  if (hoodieMix > 0.15) {
    ctx.globalAlpha = hoodieMix;
    ctx.fillStyle = "#ff4d8d";
    ctx.font = "700 13px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CODE", cx, y - 14);
    ctx.fillText("ERROR", cx, y + 2);
    ctx.fillText("1", cx, y + 18);
  }
  ctx.restore();
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  widget: Widget,
  chaos: number,
  ink: string,
) {
  const darkBezel = widget === "error" || widget === "code" || widget === "cracked";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = darkBezel ? "#16161C" : "#FFFEFB";
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  roundRect(ctx, -26, -48, 52, 86, 10);
  ctx.fill();
  ctx.stroke();

  const screen =
    widget === "itclub" ? "#E7F8F6" : widget === "cracked" ? "#3A1868" : "#0E0E14";
  ctx.fillStyle = screen;
  roundRect(ctx, -20, -40, 40, 64, 6);
  ctx.fill();

  ctx.fillStyle = widget === "itclub" ? "#147f8e" : widget === "code" ? "#3ed0e0" : "#ff4d8d";
  ctx.font = "600 9px 'IBM Plex Mono', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (widget === "itclub") {
    ctx.fillText("IT", 0, -16);
    ctx.fillText("CLUB", 0, -2);
  } else if (widget === "code") {
    ctx.fillText("CODE", 0, -14);
    ctx.fillText("1", 0, 2);
  } else {
    ctx.fillText("ERROR", 0, -16);
    ctx.fillText(widget === "cracked" ? "81" : "01", 0, -2);
  }

  if (widget === "cracked" || chaos > 0.72) {
    ctx.strokeStyle = "#fffcf8";
    ctx.globalAlpha = widget === "cracked" ? 0.9 : chaos;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-8, -30);
    ctx.lineTo(2, -10);
    ctx.lineTo(-4, 4);
    ctx.lineTo(8, 22);
    ctx.moveTo(2, -10);
    ctx.lineTo(12, -4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGlitchBits(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  chaos: number,
  time: number,
) {
  const bits: [number, number, number, number, string][] = [
    [cx + 120, headY - 90, 28, 8, "#3ed0e0"],
    [cx + 132, headY - 70, 16, 6, "#ff4d8d"],
    [cx - 130, headY - 60, 22, 7, "#3ed0e0"],
    [cx + 108, headY + 20, 18, 5, "#fffcf8"],
    [cx - 118, headY - 100, 12, 5, "#ff4d8d"],
  ];
  ctx.save();
  bits.forEach((bit, i) => {
    const jiggle = Math.sin(time * 14 + i) * 6 * chaos;
    const visible = Math.sin(time * 8 + i * 2) > -0.2;
    if (!visible) return;
    ctx.globalAlpha = 0.45 + chaos * 0.5;
    ctx.fillStyle = bit[4];
    ctx.fillRect(bit[0] + jiggle, bit[1], bit[2], bit[3]);
  });
  ctx.restore();
}

function drawRig(ctx: CanvasRenderingContext2D, joints: Joints, alpha: number) {
  const links: [string, string][] = [
    ["head", "neck"],
    ["neck", "lShoulder"],
    ["neck", "rShoulder"],
    ["lShoulder", "lElbow"],
    ["lElbow", "lWrist"],
    ["rShoulder", "rElbow"],
    ["rElbow", "rWrist"],
    ["neck", "pelvis"],
    ["pelvis", "lKnee"],
    ["pelvis", "rKnee"],
    ["lKnee", "lAnkle"],
    ["rKnee", "rAnkle"],
  ];
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#fffcf8";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 4]);
  for (const [a, b] of links) {
    const ja = joints[a];
    const jb = joints[b];
    if (!ja || !jb) continue;
    ctx.beginPath();
    ctx.moveTo(ja.x, ja.y);
    ctx.lineTo(jb.x, jb.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  for (const joint of Object.values(joints)) {
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fffcf8";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#147f8e";
    ctx.stroke();
  }
  ctx.restore();
}

function blinkAmount(time: number) {
  const period = 3.7;
  const phase = time % period;
  if (phase < 3.25) return 0;
  const u = (phase - 3.25) / 0.45;
  if (u < 0.35) return u / 0.35;
  if (u < 0.55) return 1;
  return clamp(1 - (u - 0.55) / 0.45, 0, 1);
}

function limb(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w1: number,
  w2: number,
  colorA: string,
  colorB: string,
  t: number,
  ink: string,
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const px = Math.sin(ang);
  const py = -Math.cos(ang);
  duoShape(
    ctx,
    () => {
      ctx.beginPath();
      ctx.moveTo(x1 + px * (w1 / 2), y1 + py * (w1 / 2));
      ctx.lineTo(x2 + px * (w2 / 2), y2 + py * (w2 / 2));
      ctx.lineTo(x2 - px * (w2 / 2), y2 - py * (w2 / 2));
      ctx.lineTo(x1 - px * (w1 / 2), y1 - py * (w1 / 2));
      ctx.closePath();
    },
    colorA,
    colorB,
    t,
    ink,
  );
}

function duoShape(
  ctx: CanvasRenderingContext2D,
  path: () => void,
  colorA: string,
  colorB: string,
  t: number,
  ink: string,
) {
  ctx.save();
  path();
  ctx.fillStyle = colorA;
  ctx.globalAlpha = 1 - t;
  ctx.fill();
  path();
  ctx.fillStyle = colorB;
  ctx.globalAlpha = t;
  ctx.fill();
  ctx.restore();
  ctx.save();
  path();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function torsoPath(ctx: CanvasRenderingContext2D, cx: number, top: number) {
  ctx.beginPath();
  ctx.moveTo(cx - 34, top + 6);
  ctx.quadraticCurveTo(cx, top - 18, cx + 34, top + 6);
  ctx.quadraticCurveTo(cx + 116, top + 20, cx + 102, top + 78);
  ctx.quadraticCurveTo(cx + 108, top + 148, cx + 70, top + 188);
  ctx.quadraticCurveTo(cx, top + 204, cx - 70, top + 188);
  ctx.quadraticCurveTo(cx - 108, top + 148, cx - 102, top + 78);
  ctx.quadraticCurveTo(cx - 116, top + 20, cx - 34, top + 6);
  ctx.closePath();
}

function hand(ctx: CanvasRenderingContext2D, x: number, y: number, skin: string, ink: string, r: number) {
  ctx.save();
  ctx.fillStyle = skin;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function shoeShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorA: string,
  colorB: string,
  t: number,
  ink: string,
) {
  duoShape(
    ctx,
    () => {
      roundRect(ctx, x - 22, y - 4, 44, 16, 8);
    },
    colorA,
    colorB,
    t,
    ink,
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
