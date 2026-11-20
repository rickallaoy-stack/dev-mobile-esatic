/**
 * Génère public/widja/widja.riv — Widja, mascotte chibi de la section.
 * Deux rigs superposés (nuit glitch / jour calme) fondus par l'animation `jour`
 * (0 = nuit, fin = jour). Les poses sont des animations linéaires :
 * idle, wave, think, celebrate, plus blink et glitch.
 *
 * Le runtime web n'a pas d'éditeur : ce script est la source du .riv.
 * Lancer : node scripts/build-widja.mjs
 */
import { writeFileSync } from "node:fs";
import { RiveFile, hex, rgba, PropertyKey } from "@stevysmith/rive-generator";

const FPS = 60;
const JOUR_FRAMES = 100;
const ART_W = 520;
const ART_H = 780;
const ROOT_X = 260;
const ROOT_Y = 530;

const GLYPH = {
  C: ["1111", "1000", "1000", "1000", "1111"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  D: ["1110", "1001", "1001", "1001", "1110"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  R: ["1110", "1001", "1110", "1010", "1001"],
  I: ["111", "010", "010", "010", "111"],
  T: ["111", "010", "010", "010", "010"],
  " ": ["0", "0", "0", "0", "0"],
};

function paint(riv, shape, color, opacity) {
  const fill = riv.addFill(shape);
  const grad = riv.addLinearGradient(fill, {
    startX: 0,
    startY: -30,
    endX: 0,
    endY: 30,
    opacity,
  });
  const value = typeof color === "string" ? hex(color) : color;
  riv.addGradientStop(grad, { position: 0, color: value });
  riv.addGradientStop(grad, { position: 1, color: value });
  return grad;
}

function oval(riv, parent, name, x, y, w, h, color, bag) {
  const shape = riv.addShape(parent, { name, x, y });
  riv.addEllipse(shape, { width: w, height: h });
  bag.grads.push(paint(riv, shape, color, bag.opacity));
  return shape;
}

function box(riv, parent, name, x, y, w, h, color, bag, radius = 10) {
  const shape = riv.addShape(parent, { name, x, y });
  riv.addRectangle(shape, { width: w, height: h, cornerRadius: radius });
  bag.grads.push(paint(riv, shape, color, bag.opacity));
  return shape;
}

function turned(riv, parent, name, x, y, rotation, draw) {
  const node = riv.addNode(parent, { name, x, y, rotation });
  draw(node);
  return node;
}

function pixels(riv, parent, text, x, y, size, color, bag) {
  const shape = riv.addShape(parent, { name: `txt-${text}`, x, y });
  let cursor = 0;
  for (const ch of text) {
    const glyph = GLYPH[ch] ?? GLYPH[" "];
    const cols = glyph[0].length;
    glyph.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx += 1) {
        if (row[rx] !== "1") continue;
        riv.addRectangle(shape, {
          x: cursor + rx * size - (cols * size) / 2,
          y: ry * size,
          width: size * 0.82,
          height: size * 0.82,
          cornerRadius: 0.6,
        });
      }
    });
    cursor += (cols + 1) * size;
  }
  bag.grads.push(paint(riv, shape, color, bag.opacity));
}

function hairColors(night) {
  if (night) {
    return ["#2A1244", "#5A2784", "#8D4CB8", "#54C5F8"];
  }
  return ["#B85A22", "#E08A34", "#F2B56A", "#C4622D"];
}

function buildMode(riv, artboard, night) {
  const bag = { grads: [], opacity: night ? 1 : 0 };
  const hair = hairColors(night);
  const skin = "#A56B43";
  const skinDeep = "#7A4C30";
  const hoodie = night ? "#17141F" : "#7FC9B8";
  const hoodieDeep = night ? "#0C0A12" : "#4F9E90";
  const pants = night ? "#2A3140" : "#3C4A5E";
  const line = night ? "#1A0E16" : "#4A3024";

  const root = riv.addNode(artboard, {
    name: night ? "nuit" : "jour",
    x: ROOT_X,
    y: ROOT_Y,
  });

  oval(riv, root, "ombre", 0, 168, night ? 150 : 130, 22, rgba(8, 10, 20, night ? 90 : 50), bag);

  const spread = night ? 40 : 24;
  const leg = (side, name) => {
    const x = side * spread;
    box(riv, root, `${name}-jambe`, x, 78, 34, 86, pants, bag, 12);
    box(riv, root, `${name}-chaussure`, x + side * 4, 124, 48, 22, "#F6F3EC", bag, 10);
    box(riv, root, `${name}-semelle`, x + side * 6, 132, 40, 8, night ? "#54C5F8" : "#6BB3A4", bag, 4);
  };
  leg(-1, "g");
  leg(1, "d");

  oval(riv, root, "capuche", 0, -78, 150, 78, hoodieDeep, bag);
  box(riv, root, "torse-fond", 0, -8, 176, 156, hoodieDeep, bag, 46);
  box(riv, root, "torse", 0, -12, 162, 146, hoodie, bag, 44);

  if (!night) {
    box(riv, root, "poche", 0, 18, 72, 40, "#6BB5A6", bag, 14);
    oval(riv, root, "logo", 0, -36, 22, 22, "#F7F4EE", bag);
    oval(riv, root, "logo-trou", 0, -36, 10, 10, hoodie, bag);
    box(riv, root, "cordon-g", -16, -58, 5, 36, "#F4F0E6", bag, 2);
    box(riv, root, "cordon-d", 16, -58, 5, 36, "#F4F0E6", bag, 2);
    oval(riv, root, "cordon-bout-g", -16, -38, 8, 8, "#F4F0E6", bag);
    oval(riv, root, "cordon-bout-d", 16, -38, 8, 8, "#F4F0E6", bag);
  } else {
    box(riv, root, "badge", 0, 8, 92, 52, "#101018", bag, 8);
    pixels(riv, root, "CODE", -8, -6, 3.1, "#F4F7FF", bag);
    pixels(riv, root, "ERROR", -6, 16, 3.1, "#54C5F8", bag);
    box(riv, root, "trait-g", -78, -20, 18, 5, "#54C5F8", bag, 1);
    box(riv, root, "trait-d", 84, 24, 22, 5, "#E850C0", bag, 1);
  }

  const armLRest = night ? -0.48 : 0.12;
  const armRRest = night ? 0.62 : -0.08;
  const armL = riv.addNode(root, { name: night ? "bras-g-nuit" : "bras-g-jour", x: -78, y: -108, rotation: armLRest });
  const armR = riv.addNode(root, { name: night ? "bras-d-nuit" : "bras-d-jour", x: 78, y: -108, rotation: armRRest });

  const arm = (node, name, phone) => {
    box(riv, node, `${name}-manche`, 0, 46, 40, 78, hoodie, bag, 16);
    oval(riv, node, `${name}-main`, 0, 90, 32, 30, skin, bag);
    if (!phone) return;
    const tilt = night ? 0.35 : -0.25;
    turned(riv, node, `${name}-tel`, night ? 16 : -8, 78, tilt, (host) => {
      box(riv, host, `${name}-tel-corps`, 0, 0, 40, 64, night ? "#120E18" : "#F7FBFF", bag, 8);
      box(riv, host, `${name}-tel-ecran`, 0, -2, 30, 46, night ? "#2A1038" : "#D9F6FF", bag, 4);
      if (night) {
        pixels(riv, host, "IT", 0, -16, 3.2, "#E850C0", bag);
        turned(riv, host, `${name}-fente-a`, 2, 0, 0.7, (n) => box(riv, n, `${name}-f1`, 0, 0, 28, 2.5, "#54C5F8", bag, 1));
        turned(riv, host, `${name}-fente-b`, -2, 8, -0.5, (n) => box(riv, n, `${name}-f2`, 0, 0, 22, 2.5, "#E850C0", bag, 1));
      } else {
        pixels(riv, host, "IT", 0, -14, 3.4, "#1A6C86", bag);
      }
    });
  };
  arm(armL, night ? "ng" : "jg", !night);
  arm(armR, night ? "nd" : "jd", night);

  const head = riv.addNode(root, { name: night ? "tete-nuit" : "tete-jour", x: 0, y: -186 });

  const blobs = [
    [0, -78, 236, 206, 1],
    [-96, -18, 132, 156, 0],
    [98, -14, 132, 156, 0],
    [-48, -128, 142, 118, 2],
    [54, -122, 136, 112, 2],
    [0, -150, 118, 92, 2],
    [-124, -72, 78, 96, 1],
    [126, -68, 78, 96, 1],
    [0, -8, 196, 70, 0],
  ];
  for (const [x, y, w, h, tone] of blobs) {
    oval(riv, head, "cheveu", x, y, w, h, hair[tone], bag);
  }

  oval(riv, head, "oreille-g", -78, -6, 28, 34, skin, bag);
  oval(riv, head, "oreille-g-in", -78, -4, 12, 16, skinDeep, bag);
  oval(riv, head, "oreille-d", 78, -6, 28, 34, skin, bag);
  oval(riv, head, "oreille-d-in", 78, -4, 12, 16, skinDeep, bag);
  oval(riv, head, "cou", 0, 48, 46, 36, skin, bag);
  oval(riv, head, "visage", 0, -8, 148, 136, skin, bag);
  oval(riv, head, "nez", 0, 18, 10, 8, skinDeep, bag);

  if (!night) {
    oval(riv, head, "joue-g", -40, 22, 22, 12, rgba(232, 128, 90, 120), bag);
    oval(riv, head, "joue-d", 40, 22, 22, 12, rgba(232, 128, 90, 120), bag);
  }

  const bangs = [
    [0, -78, 156, 64, 1],
    [-58, -62, 78, 52, 2],
    [60, -60, 76, 50, 1],
    [-86, -6, 46, 64, 0],
    [88, -4, 46, 64, 0],
  ];
  for (const [x, y, w, h, tone] of bangs) {
    oval(riv, head, "frange", x, y, w, h, hair[tone], bag);
  }
  if (night) {
    oval(riv, head, "lueur-g", -118, -90, 28, 16, "#54C5F8", bag);
    oval(riv, head, "lueur-d", 120, -40, 22, 14, "#E850C0", bag);
    oval(riv, head, "lueur-h", 20, -168, 36, 12, "#54C5F8", bag);
  }

  const eyeLOpen = night ? 0.4 : 1;
  const eyeROpen = night ? 1.14 : 1;
  const eye = (x, open, name, wild) => {
    const node = riv.addNode(head, { name, x, y: -22, scaleY: open });
    oval(riv, node, `${name}-trait`, 0, 0, wild ? 40 : 34, wild ? 40 : 36, line, bag);
    oval(riv, node, `${name}-blanc`, 0, 0, wild ? 32 : 26, wild ? 32 : 28, wild ? "#F4F0FF" : "#FFFCF8", bag);
    oval(riv, node, `${name}-iris`, 0, 3, wild ? 18 : 15, wild ? 18 : 15, wild ? "#F3EEFF" : "#3A2418", bag);
    oval(riv, node, `${name}-pupille`, 0, 4, wild ? 7 : 8, wild ? 7 : 8, "#140E0C", bag);
    oval(riv, node, `${name}-eclat`, -5, -5, 6, 6, "#FFFFFF", bag);
    return node;
  };
  const eyeL = eye(-32, eyeLOpen, night ? "oeil-g-nuit" : "oeil-g-jour", false);
  const eyeR = eye(32, eyeROpen, night ? "oeil-d-nuit" : "oeil-d-jour", night);

  turned(riv, head, "sourcil-g", -32, -48, night ? 0.45 : 0.12, (n) => oval(riv, n, "sg", 0, 0, night ? 26 : 22, 5, line, bag));
  turned(riv, head, "sourcil-d", 32, -50, night ? -0.55 : -0.08, (n) => oval(riv, n, "sd", 0, 0, night ? 28 : 22, 5, line, bag));

  if (night) {
    oval(riv, head, "bouche", 2, 32, 52, 28, "#2A1218", bag);
    box(riv, head, "dents", 2, 28, 36, 12, "#FFFcf8", bag, 3);
    oval(riv, head, "bouche-haut", 2, 22, 48, 16, skin, bag);
  } else {
    oval(riv, head, "levre", 0, 36, 40, 18, "#A85A48", bag);
    oval(riv, head, "levre-masque", 0, 30, 46, 16, skin, bag);
  }

  const shards = [];
  if (night) {
    const specs = [
      [-168, -250, 34, 8, 0.2, "#111111"],
      [150, -280, 28, 7, -0.3, "#54C5F8"],
      [172, -160, 18, 10, 0.4, "#E850C0"],
      [-150, -120, 22, 6, -0.2, "#54C5F8"],
      [120, -80, 30, 7, 0.15, "#111111"],
      [-40, -340, 26, 6, 0, "#F4F7FF"],
    ];
    for (const [x, y, w, h, rot, color] of specs) {
      const node = riv.addNode(root, { name: "eclat", x, y, rotation: rot });
      box(riv, node, "eclat-forme", 0, 0, w, h, color, bag, 1);
      shards.push({ node, x });
    }
  }

  return { root, head, armL, armR, armLRest, armRRest, eyeL, eyeR, eyeLOpen, eyeROpen, shards, grads: bag.grads };
}

function track(riv, anim, objectId, property, keys) {
  const keyed = riv.addKeyedObject(anim, objectId);
  const prop = riv.addKeyedProperty(keyed, property);
  for (const key of keys) riv.addKeyFrameDouble(prop, key);
}

function hold(from, to, value) {
  return [
    { frame: from, value, interpolation: "linear" },
    { frame: to, value, interpolation: "linear" },
  ];
}

function breathe(duration, amp = 7) {
  const mid = Math.round(duration / 2);
  return [
    { frame: 0, value: ROOT_Y, interpolation: "cubic" },
    { frame: mid, value: ROOT_Y - amp, interpolation: "cubic" },
    { frame: duration, value: ROOT_Y, interpolation: "cubic" },
  ];
}

function addPose(riv, artboard, name, duration, loop, day, night, pose) {
  const anim = riv.addLinearAnimation(artboard, { name, fps: FPS, duration, loop });
  const yKeys = pose.jump
    ? [
        { frame: 0, value: ROOT_Y, interpolation: "cubic" },
        { frame: Math.round(duration * 0.45), value: ROOT_Y - 34, interpolation: "cubic" },
        { frame: duration, value: ROOT_Y, interpolation: "cubic" },
      ]
    : breathe(duration, pose.amp ?? 7);
  track(riv, anim, day.root, PropertyKey.y, yKeys);
  track(riv, anim, night.root, PropertyKey.y, yKeys);
  track(riv, anim, day.head, PropertyKey.rotation, hold(0, duration, pose.head ?? 0));
  track(riv, anim, night.head, PropertyKey.rotation, hold(0, duration, pose.headNight ?? pose.head ?? 0));
  const armKeys = (rest, lifted) =>
    pose.lift
      ? [
          { frame: 0, value: rest, interpolation: "cubic" },
          { frame: Math.round(duration / 2), value: lifted, interpolation: "cubic" },
          { frame: duration, value: rest, interpolation: "cubic" },
        ]
      : hold(0, duration, rest);
  track(riv, anim, day.armL, PropertyKey.rotation, armKeys(day.armLRest, pose.dayL ?? day.armLRest));
  track(riv, anim, day.armR, PropertyKey.rotation, armKeys(day.armRRest, pose.dayR ?? day.armRRest));
  track(riv, anim, night.armL, PropertyKey.rotation, armKeys(night.armLRest, pose.nightL ?? night.armLRest));
  track(riv, anim, night.armR, PropertyKey.rotation, armKeys(night.armRRest, pose.nightR ?? night.armRRest));
  return anim;
}

function build() {
  const riv = new RiveFile();
  const artboard = riv.addArtboard({ name: "Widja", width: ART_W, height: ART_H });
  const night = buildMode(riv, artboard, true);
  const day = buildMode(riv, artboard, false);

  addPose(riv, artboard, "idle", 80, "pingPong", day, night, {});
  addPose(riv, artboard, "wave", 56, "pingPong", day, night, {
    lift: true,
    dayL: -1.55,
    dayR: 0.4,
    nightL: -0.95,
    nightR: 1.6,
    amp: 5,
  });
  addPose(riv, artboard, "think", 64, "pingPong", day, night, {
    lift: true,
    head: -0.16,
    headNight: 0.2,
    dayL: -0.9,
    dayR: -0.08,
    nightL: -0.48,
    nightR: 1.05,
    amp: 3,
  });
  addPose(riv, artboard, "celebrate", 40, "loop", day, night, {
    lift: true,
    jump: true,
    dayL: -1.7,
    dayR: 1.45,
    nightL: -1.45,
    nightR: 1.75,
  });

  const blink = riv.addLinearAnimation(artboard, { name: "blink", fps: FPS, duration: 130, loop: "loop" });
  for (const rig of [day, night]) {
    for (const [eye, open] of [
      [rig.eyeL, rig.eyeLOpen],
      [rig.eyeR, rig.eyeROpen],
    ]) {
      track(riv, blink, eye, PropertyKey.scaleY, [
        { frame: 0, value: open, interpolation: "hold" },
        { frame: 96, value: open, interpolation: "linear" },
        { frame: 102, value: Math.min(open, 1) * 0.08, interpolation: "linear" },
        { frame: 110, value: open, interpolation: "linear" },
        { frame: 130, value: open, interpolation: "hold" },
      ]);
    }
  }

  const glitch = riv.addLinearAnimation(artboard, { name: "glitch", fps: FPS, duration: 18, loop: "loop" });
  night.shards.forEach((shard, index) => {
    const kick = index % 2 === 0 ? 14 : -12;
    track(riv, glitch, shard.node, PropertyKey.x, [
      { frame: 0, value: shard.x, interpolation: "hold" },
      { frame: 4, value: shard.x + kick, interpolation: "hold" },
      { frame: 9, value: shard.x - kick * 0.6, interpolation: "hold" },
      { frame: 14, value: shard.x + kick * 0.35, interpolation: "hold" },
      { frame: 18, value: shard.x, interpolation: "hold" },
    ]);
  });

  const jour = riv.addLinearAnimation(artboard, { name: "jour", fps: FPS, duration: JOUR_FRAMES, loop: "oneShot" });
  for (const id of night.grads) {
    track(riv, jour, id, PropertyKey.opacity, [
      { frame: 0, value: 1, interpolation: "linear" },
      { frame: JOUR_FRAMES, value: 0, interpolation: "linear" },
    ]);
  }
  for (const id of day.grads) {
    track(riv, jour, id, PropertyKey.opacity, [
      { frame: 0, value: 0, interpolation: "linear" },
      { frame: JOUR_FRAMES, value: 1, interpolation: "linear" },
    ]);
  }

  const bytes = riv.export();
  writeFileSync("public/widja/widja.riv", bytes);
  const meta = {
    artboard: "Widja",
    fps: FPS,
    width: ART_W,
    height: ART_H,
    states: ["idle", "wave", "think", "celebrate"],
    animations: {
      jour: { frames: JOUR_FRAMES, seconds: JOUR_FRAMES / FPS },
    },
  };
  writeFileSync("public/widja/widja.json", JSON.stringify(meta, null, 2));
  console.log(`widja.riv ${bytes.length} octets, ${day.grads.length + night.grads.length} dégradés`);
}

build();
