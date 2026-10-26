"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode, Ref } from "react";
import { Caveat } from "next/font/google";

/* handwriting font for the note */
const hand = Caveat({ subsets: ["latin", "latin-ext"], variable: "--font-hand", display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

type Species =
  | "rose"
  | "gardenRose"
  | "daisy"
  | "oxeye"
  | "cornflower"
  | "cosmos"
  | "ranunculus"
  | "lavender"
  | "tulip"
  | "forgetMeNot"
  | "sweetPea"
  | "iris"
  | "poppy"
  | "sunflower"
  | "peony"
  | "dahlia"
  | "lily"
  | "hydrangea"
  | "anemone"
  | "bellflower"
  | "chinaRose"
  | "salvia"
  | "primrose"
  | "hyacinth"
  | "valley"
  | "lantana"
  | "moonflower"
  | "morningglory"
  | "nasturtium"
  | "impatiens"
  | "loosestrife"
  | "hibiscus"
  | "lotus"
  | "daffodil"
  | "rosemary"
  | "orchid"
  | "snowdrop"
  | "bluebell"
  | "carnation";

type Flower = {
  id: number;
  name: string;
  botanicalName: string;
  species: Species;
  color: string;
  center: string;
  x: number; // horizontal position of the flower's base, in % of the meadow width
  y: number; // vertical position of the flower's base, in % of the meadow height
  size: number; // relative bloom size
  rotation: number;
};

/*
 * Field no. 01: four depth rows. Back rows sit higher up, front rows
 * are lower and slightly larger. Small x / y offsets keep it organic.
 */
const fieldOneFlowers: Flower[] = [
  // back row
  { id: 6, name: "Lavender", botanicalName: "Lavandula", species: "lavender", color: "#A394C9", center: "#77639B", x: 7, y: 37, size: 108, rotation: 3 },
  { id: 15, name: "Sunflower", botanicalName: "Helianthus annuus", species: "sunflower", color: "#F2BE2E", center: "#5A3A1E", x: 22, y: 34, size: 118, rotation: -4 },
  { id: 3, name: "Cornflower", botanicalName: "Centaurea cyanus", species: "cornflower", color: "#7895B8", center: "#E8C56D", x: 38, y: 38, size: 102, rotation: -6 },
  { id: 16, name: "Blush Peony", botanicalName: "Paeonia lactiflora", species: "peony", color: "#F0B5C6", center: "#C9657F", x: 54, y: 35, size: 112, rotation: 5 },
  { id: 19, name: "Blue Hydrangea", botanicalName: "Hydrangea macrophylla", species: "hydrangea", color: "#8FA9D6", center: "#F1EBC4", x: 70, y: 38, size: 112, rotation: -4 },
  { id: 4, name: "Pink Cosmos", botanicalName: "Cosmos bipinnatus", species: "cosmos", color: "#E9A1AD", center: "#B66B69", x: 86, y: 35, size: 106, rotation: 6 },
  // second row
  { id: 1, name: "Blush Rose", botanicalName: "Rosa", species: "rose", color: "#D98791", center: "#A94D60", x: 13, y: 53, size: 112, rotation: 5 },
  { id: 2, name: "Wild Daisy", botanicalName: "Bellis perennis", species: "daisy", color: "#FFF9E8", center: "#D9A842", x: 28, y: 50, size: 104, rotation: 7 },
  { id: 18, name: "White Lily", botanicalName: "Lilium candidum", species: "lily", color: "#FBF4F1", center: "#E3B84F", x: 44, y: 54, size: 118, rotation: 6 },
  { id: 17, name: "Coral Dahlia", botanicalName: "Dahlia pinnata", species: "dahlia", color: "#E8806C", center: "#8E2F3B", x: 60, y: 51, size: 112, rotation: -5 },
  { id: 21, name: "Red Rose", botanicalName: "Rosa gallica", species: "rose", color: "#B83A4B", center: "#6E1B2B", x: 76, y: 55, size: 112, rotation: -5 },
  { id: 12, name: "Sweet Pea", botanicalName: "Lathyrus odoratus", species: "sweetPea", color: "#C4A0B7", center: "#926B91", x: 92, y: 52, size: 112, rotation: 5 },
  // third row
  { id: 8, name: "Peach Tulip", botanicalName: "Tulipa", species: "tulip", color: "#E9A17F", center: "#BF725C", x: 6, y: 71, size: 112, rotation: 6 },
  { id: 5, name: "Buttercup", botanicalName: "Ranunculus", species: "ranunculus", color: "#F2C75C", center: "#A77C37", x: 21, y: 69, size: 112, rotation: -6 },
  { id: 20, name: "Windflower", botanicalName: "Anemone coronaria", species: "anemone", color: "#F3E4EC", center: "#3A2F45", x: 36, y: 72, size: 108, rotation: 6 },
  { id: 10, name: "Garden Rose", botanicalName: "Rosa centifolia", species: "gardenRose", color: "#D98B9F", center: "#A95169", x: 52, y: 70, size: 126, rotation: 5 },
  { id: 11, name: "Golden Daisy", botanicalName: "Leucanthemum", species: "oxeye", color: "#F0CF67", center: "#A87935", x: 68, y: 72, size: 112, rotation: -4 },
  { id: 9, name: "Forget-me-not", botanicalName: "Myosotis", species: "forgetMeNot", color: "#87A9CE", center: "#E6C66C", x: 83, y: 69, size: 108, rotation: -5 },
  // front row
  { id: 13, name: "Blue Iris", botanicalName: "Iris germanica", species: "iris", color: "#8A91BD", center: "#E2C56D", x: 12, y: 88, size: 122, rotation: -5 },
  { id: 22, name: "White Rose", botanicalName: "Rosa alba", species: "rose", color: "#F6F0E4", center: "#CDB48F", x: 30, y: 86, size: 118, rotation: 5 },
  { id: 14, name: "Soft Poppy", botanicalName: "Papaver", species: "poppy", color: "#D98779", center: "#5D4939", x: 50, y: 89, size: 124, rotation: 7 },
  { id: 23, name: "Yellow Tulip", botanicalName: "Tulipa gesneriana", species: "tulip", color: "#F1CB5A", center: "#D18A2F", x: 69, y: 87, size: 120, rotation: -6 },
  { id: 7, name: "White Cosmos", botanicalName: "Cosmos bipinnatus", species: "cosmos", color: "#FFF9EC", center: "#D6AC52", x: 88, y: 88, size: 126, rotation: -7 },
];

/* Field no. 02: twenty more, in four rows of five. */
const fieldTwoFlowers: Flower[] = [
  // back row
  { id: 37, name: "Lotus", botanicalName: "Nelumbo nucifera", species: "lotus", color: "#F2A0BF", center: "#F2C84B", x: 10, y: 36, size: 122, rotation: -3 },
  { id: 28, name: "Hyacinth", botanicalName: "Hyacinthus orientalis", species: "hyacinth", color: "#9B86DA", center: "#E9DFFA", x: 30, y: 36, size: 116, rotation: 3 },
  { id: 24, name: "Bellflower", botanicalName: "Campanula", species: "bellflower", color: "#8A7FD8", center: "#F3E9A8", x: 50, y: 37, size: 118, rotation: -4 },
  { id: 40, name: "Orchid", botanicalName: "Phalaenopsis", species: "orchid", color: "#F6E8F0", center: "#B5307F", x: 70, y: 36, size: 124, rotation: 4 },
  { id: 31, name: "Moonflower", botanicalName: "Ipomoea alba", species: "moonflower", color: "#FBFBF4", center: "#D9E8B0", x: 90, y: 36, size: 120, rotation: -4 },
  // second row
  { id: 43, name: "Carnation", botanicalName: "Dianthus caryophyllus", species: "carnation", color: "#E85A7E", center: "#A5264D", x: 19, y: 54, size: 118, rotation: 5 },
  { id: 36, name: "Hibiscus", botanicalName: "Hibiscus rosa-sinensis", species: "hibiscus", color: "#E8475F", center: "#7A0E2E", x: 38, y: 54, size: 126, rotation: -5 },
  { id: 25, name: "China Rose", botanicalName: "Rosa chinensis", species: "chinaRose", color: "#EE8CA6", center: "#C65577", x: 57, y: 55, size: 118, rotation: 4 },
  { id: 27, name: "Primrose", botanicalName: "Primula vulgaris", species: "primrose", color: "#F6E27A", center: "#E0902A", x: 76, y: 54, size: 112, rotation: -5 },
  { id: 38, name: "Daffodil", botanicalName: "Narcissus pseudonarcissus", species: "daffodil", color: "#F7DA4C", center: "#F0A21C", x: 93, y: 55, size: 118, rotation: 5 },
  // third row
  { id: 34, name: "Impatiens", botanicalName: "Impatiens walleriana", species: "impatiens", color: "#F0629A", center: "#FFF1F6", x: 10, y: 72, size: 116, rotation: -4 },
  { id: 30, name: "Lantana", botanicalName: "Lantana camara", species: "lantana", color: "#EE8FB0", center: "#F5B63B", x: 30, y: 72, size: 114, rotation: 4 },
  { id: 26, name: "Salvia", botanicalName: "Salvia nemorosa", species: "salvia", color: "#6F6CD0", center: "#4B2E7E", x: 50, y: 72, size: 118, rotation: -3 },
  { id: 32, name: "Morning Glory", botanicalName: "Ipomoea purpurea", species: "morningglory", color: "#5C7BE2", center: "#F6E9A0", x: 70, y: 72, size: 120, rotation: 4 },
  { id: 29, name: "Lily of the Valley", botanicalName: "Convallaria majalis", species: "valley", color: "#FFFEF8", center: "#D8E2B0", x: 90, y: 72, size: 114, rotation: -4 },
  // front row
  { id: 33, name: "Nasturtium", botanicalName: "Tropaeolum majus", species: "nasturtium", color: "#F08A24", center: "#B52A1B", x: 19, y: 89, size: 122, rotation: 5 },
  { id: 35, name: "Loosestrife", botanicalName: "Lythrum salicaria", species: "loosestrife", color: "#D8479A", center: "#F5D36A", x: 38, y: 88, size: 122, rotation: -4 },
  { id: 39, name: "Rosemary", botanicalName: "Salvia rosmarinus", species: "rosemary", color: "#8FB8E0", center: "#5F7F62", x: 57, y: 89, size: 122, rotation: 3 },
  { id: 41, name: "Snowdrop", botanicalName: "Galanthus nivalis", species: "snowdrop", color: "#FBFBF7", center: "#86B066", x: 76, y: 88, size: 118, rotation: -5 },
  { id: 42, name: "Bluebell", botanicalName: "Hyacinthoides non-scripta", species: "bluebell", color: "#6D6BD6", center: "#E8E4FA", x: 93, y: 89, size: 120, rotation: 4 },
];

const flowers: Flower[] = [...fieldOneFlowers, ...fieldTwoFlowers];

const flowerById = new Map(flowers.map((flower) => [flower.id, flower] as const));

/*
 * Mobile compositions: three columns, zig-zag rows (3, 2, 3, 2 ...).
 * Positions are generated from a fixed order, so they never change.
 * The stage heights (246 and 224) are passed to the CSS as --mh.
 */
function layoutMobile(order: number[], rows: number[], stageH: number) {
  const map = new Map<number, { x: number; y: number }>();
  let cursor = 0;
  rows.forEach((count, row) => {
    const xs = count === 3 ? [17, 50, 83] : [34, 66];
    const base = 46 + row * 22;
    for (let i = 0; i < count; i++) {
      const id = order[cursor++];
      const wobble = (((id * 7) % 5) - 2) * 0.6;
      map.set(id, { x: xs[i], y: round(((base + wobble) / stageH) * 100) });
    }
  });
  return map;
}

const MOBILE_ORDER_ONE = [15, 6, 1, 16, 3, 4, 19, 2, 18, 21, 8, 17, 5, 10, 20, 12, 9, 11, 13, 22, 14, 7, 23];
const MOBILE_ORDER_TWO = [37, 28, 24, 40, 31, 43, 36, 25, 27, 38, 34, 30, 26, 32, 29, 33, 35, 39, 41, 42];

const MOBILE_POS = new Map([
  ...layoutMobile(MOBILE_ORDER_ONE, [3, 2, 3, 2, 3, 2, 3, 2, 3], 246).entries(),
  ...layoutMobile(MOBILE_ORDER_TWO, [3, 2, 3, 2, 3, 2, 3, 2], 224).entries(),
]);

type Field = {
  id: string;
  no: string;
  title: string;
  lines: [string, string];
  fig: string;
  name: string;
  flowers: Flower[];
  mobileH: number;
  next: { href: string; label: string };
};

const FIELDS: Field[] = [
  {
    id: "meadow",
    no: "01",
    title: "Take your time.",
    lines: ["Tap a flower to add it,", "tap again for more of the same ↗"],
    fig: "Fig. 01",
    name: "The wild meadow",
    flowers: fieldOneFlowers,
    mobileH: 246,
    next: { href: "#meadow-2", label: "On to field no. 02 ↓" },
  },
  {
    id: "meadow-2",
    no: "02",
    title: "A little further on.",
    lines: ["Twenty more to wander through,", "tap any flower to gather it ↗"],
    fig: "Fig. 02",
    name: "The cottage border",
    flowers: fieldTwoFlowers,
    mobileH: 224,
    next: { href: "#your-picks", label: "See what you have gathered ↓" },
  },
];

/* Bouquet customisation options */

const PAPERS = [
  { id: "ivory", label: "Warm ivory", color: "#efe5cf" },
  { id: "kraft", label: "Kraft brown", color: "#bc9468" },
  { id: "sage", label: "Soft sage", color: "#b3c3a3" },
  { id: "blush", label: "Blush pink", color: "#eec3c8" },
  { id: "peach", label: "Peach", color: "#f0c4a4" },
  { id: "butter", label: "Butter yellow", color: "#f2dc9c" },
  { id: "mist", label: "Mist blue", color: "#b4c6d9" },
  { id: "lilac", label: "Lilac", color: "#cfc2e2" },
  { id: "forest", label: "Forest green", color: "#58785f" },
  { id: "plum", label: "Deep plum", color: "#7d4a63" },
] as const;

const RIBBONS = [
  { id: "pink", label: "Muted pink", color: "#c9808f" },
  { id: "coral", label: "Coral", color: "#d9705e" },
  { id: "gold", label: "Antique gold", color: "#c9a24b" },
  { id: "ivory", label: "Ivory", color: "#f1e9d6" },
  { id: "lavender", label: "Lavender", color: "#9a85c0" },
  { id: "blue", label: "Dusty blue", color: "#6f8fb0" },
  { id: "forest", label: "Forest green", color: "#3d5f49" },
  { id: "burgundy", label: "Burgundy", color: "#7b2d3d" },
] as const;

const FILLERS = [
  { id: "eucalyptus", label: "Eucalyptus", color: "#8fae9a" },
  { id: "babysBreath", label: "Baby’s breath", color: "#f7f4e6" },
  { id: "fern", label: "Fern", color: "#6f9a6c" },
  { id: "wheat", label: "Wheat", color: "#d9b865" },
  { id: "olive", label: "Olive branch", color: "#94ad94" },
  {
    id: "butterflies",
    label: "Butterflies",
    color: "linear-gradient(135deg, #b7d3f3 50%, #cfc0ec 50%)",
  },
] as const;

const STYLES = [
  { id: "wrap", label: "Wrapped", hint: "In paper, tied with a bow" },
  { id: "bow", label: "Bow only", hint: "Bare stems, tied with a bow" },
] as const;

const NOTE_PAPERS = [
  { id: "cream", label: "Cream", color: "#fbf3df" },
  { id: "blush", label: "Blush", color: "#fbe1e3" },
  { id: "mint", label: "Mint", color: "#e0eedd" },
  { id: "lilac", label: "Lilac", color: "#e8e0f4" },
] as const;

type PaperId = (typeof PAPERS)[number]["id"];
type RibbonId = (typeof RIBBONS)[number]["id"];
type FillerId = (typeof FILLERS)[number]["id"];
type WrapStyle = (typeof STYLES)[number]["id"];
type NotePaperId = (typeof NOTE_PAPERS)[number]["id"];
type View = "garden" | "bouquet" | "note";

type ButterflyColors = { c1: string; c2: string };
const DEFAULT_BUTTERFLY_COLORS: ButterflyColors = { c1: "#9ec5f5", c2: "#c4aef0" };

/* One entry per stem: the same flower can appear many times. */
type StemEntry = { key: number; flowerId: number };
type BouquetItem = { key: number; flower: Flower };

/* -------------------------------------------------------------------------- */
/*  Gift link: the whole gift is packed into the "#g=" part of the address    */
/*  so no server or database is needed.                                       */
/* -------------------------------------------------------------------------- */

const NAME_LIMIT = 32;
const MESSAGE_LIMIT = 420;

type GiftData = {
  stems: number[];
  paper: PaperId;
  ribbon: RibbonId;
  fillers: FillerId[];
  style: WrapStyle;
  noteColor: NotePaperId;
  to: string;
  from: string;
  butterflyColors: ButterflyColors;
  message: string;
};

function encodeGift(gift: GiftData): string {
  const json = JSON.stringify({
    v: 1,
    s: gift.stems,
    p: gift.paper,
    r: gift.ribbon,
    f: gift.fillers,
    m: gift.style,
    n: gift.noteColor,
    t: gift.to,
    a: gift.from,
    x: gift.message,
    b: [gift.butterflyColors.c1, gift.butterflyColors.c2],
  });
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pickId<T extends string>(list: readonly { id: T }[], value: unknown, fallback: T): T {
  return list.find((item) => item.id === value)?.id ?? fallback;
}

function cleanText(value: unknown, limit: number) {
  return typeof value === "string" ? value.slice(0, limit) : "";
}

/* Anything that comes from a link is untrusted, so every field is validated. */
function decodeGift(code: string): GiftData | null {
  try {
    const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const raw: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!raw || typeof raw !== "object") return null;
    const data = raw as Record<string, unknown>;

    const stems = Array.isArray(data.s)
      ? data.s
          .filter((id): id is number => typeof id === "number" && flowerById.has(id))
          .slice(0, MAX_STEMS)
      : [];
    if (stems.length === 0) return null;

    const fillerList: unknown[] = Array.isArray(data.f) ? data.f : [];
        const bf: unknown[] = Array.isArray(data.b) ? data.b : [];
    const validHex = (v: unknown, fallback: string) =>
      typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;

    return {
      stems,
      paper: pickId(PAPERS, data.p, "ivory"),
      ribbon: pickId(RIBBONS, data.r, "pink"),
      fillers: FILLERS.filter((filler) => fillerList.includes(filler.id)).map((filler) => filler.id),
      style: pickId(STYLES, data.m, "wrap"),
      noteColor: pickId(NOTE_PAPERS, data.n, "cream"),
      to: cleanText(data.t, NAME_LIMIT),
      from: cleanText(data.a, NAME_LIMIT),
      message: cleanText(data.x, MESSAGE_LIMIT),
      butterflyColors: {
        c1: validHex(bf[0], DEFAULT_BUTTERFLY_COLORS.c1),
        c2: validHex(bf[1], DEFAULT_BUTTERFLY_COLORS.c2),
      },
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Small helpers (colour mixing, geometry)                                   */
/* -------------------------------------------------------------------------- */

type Pt = [number, number];

// Rounding keeps server and client SVG output identical (no hydration warnings).
function round(n: number) {
  return Math.round(n * 100) / 100;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex(n: number) {
  return n.toString(16).padStart(2, "0");
}

function mix(from: string, to: string, amount: number) {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * amount);
  return `#${toHex(channel(r1, r2))}${toHex(channel(g1, g2))}${toHex(channel(b1, b2))}`;
}

const lighten = (color: string, amount: number) => mix(color, "#ffffff", amount);
const darken = (color: string, amount: number) => mix(color, "#2b1f1c", amount);

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: round(cx + radius * Math.cos(rad)), y: round(cy + radius * Math.sin(rad)) };
}

function cubic(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    round(a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]),
    round(a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]),
  ];
}

function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GREEN = {
  stem: "#5f7f62",
  stemLight: "#8aa686",
  leaf: "#7a9f7a",
  leafDark: "#58795c",
  leafPale: "#9bb894",
};

/*
 * In the bouquet the bottom of every stem is hidden or replaced by a straight
 * stem segment, so the little grass tufts at the stem base are switched off.
 */
const BareStemContext = createContext(false);

/* -------------------------------------------------------------------------- */
/*  Shared SVG building blocks                                                */
/*  Every flower is drawn in a 120 x 180 box. The stem base sits at (60,178). */
/*  The flower head is centred on (60,54).                                    */
/* -------------------------------------------------------------------------- */

type BloomProps = { uid: string; color: string; center: string };

type LeafSpec = {
  t: number;
  side: 1 | -1;
  length: number;
  width: number;
  tilt: number;
  tone?: "light" | "dark" | "pale";
  feather?: boolean;
};

function leafFill(tone: LeafSpec["tone"]) {
  if (tone === "dark") return GREEN.leafDark;
  if (tone === "pale") return GREEN.leafPale;
  return GREEN.leaf;
}

function Leaf({
  x,
  y,
  angle,
  length,
  width,
  fill,
}: {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  fill: string;
}) {
  const outline = `M0 0 C${width} ${round(-length * 0.25)} ${round(width * 0.85)} ${round(-length * 0.72)} 0 ${-length} C${round(-width * 0.85)} ${round(-length * 0.72)} ${-width} ${round(-length * 0.25)} 0 0Z`;
  const half = `M0 0 C${width} ${round(-length * 0.25)} ${round(width * 0.85)} ${round(-length * 0.72)} 0 ${-length}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={outline} fill={fill} />
      <path d={half} fill="#1f3a2a" opacity="0.12" />
      <path
        d={`M0 -1 L0 ${round(-length * 0.88)}`}
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function FeatherLeaf({ x, y, angle, length }: { x: number; y: number; angle: number; length: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill="none"
      stroke={GREEN.leafDark}
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      {[-24, 0, 24].map((a) => {
        const rad = (a * Math.PI) / 180;
        const ex = round(length * Math.sin(rad));
        const ey = round(-length * Math.cos(rad));
        return <path key={a} d={`M0 0 Q${round(ex * 0.2)} ${round(ey * 0.6)} ${ex} ${ey}`} />;
      })}
    </g>
  );
}

function Stem({
  y0,
  lean = 3,
  width = 3,
  leaves = [],
}: {
  y0: number;
  lean?: number;
  width?: number;
  leaves?: LeafSpec[];
}) {
  const bare = useContext(BareStemContext);
  const span = 178 - y0;
  const p0: Pt = [60, y0];
  const p1: Pt = [round(60 + lean), round(y0 + span * 0.33)];
  const p2: Pt = [round(60 - lean), round(y0 + span * 0.66)];
  const p3: Pt = [60, 178];
  const d = `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;

  return (
    <g>
      {!bare && (
        <g fill={GREEN.leafDark} opacity="0.85">
          <path d="M51 178 C52 166 49 158 43 150 C51 155 56 164 58 178Z" />
          <path d="M63 178 C64 164 68 156 76 149 C72 160 70 168 69 178Z" />
          <path d="M57 178 C57 170 57 163 59 156 C61 164 62 171 64 178Z" fill={GREEN.leaf} />
        </g>
      )}
      <path d={d} fill="none" stroke={GREEN.stem} strokeWidth={width} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={GREEN.stemLight}
        strokeWidth={round(width * 0.3)}
        strokeLinecap="round"
        opacity="0.55"
        transform="translate(-0.6 0)"
      />
      {leaves.map((leaf, i) => {
        const [x, y] = cubic(p0, p1, p2, p3, leaf.t);
        const angle = leaf.side * leaf.tilt;
        if (leaf.feather) {
          return <FeatherLeaf key={i} x={x} y={y} angle={angle} length={leaf.length} />;
        }
        return (
          <Leaf
            key={i}
            x={x}
            y={y}
            angle={angle}
            length={leaf.length}
            width={leaf.width}
            fill={leafFill(leaf.tone)}
          />
        );
      })}
    </g>
  );
}

function Calyx({ cy = 76 }: { cy?: number }) {
  return (
    <g>
      <Leaf x={60} y={cy} angle={142} length={15} width={4} fill={GREEN.leafDark} />
      <Leaf x={60} y={cy} angle={218} length={15} width={4} fill={GREEN.leafDark} />
      <Leaf x={60} y={cy} angle={180} length={13} width={3.5} fill={GREEN.leaf} />
      <ellipse cx="60" cy={cy + 2} rx="6.5" ry="5" fill={GREEN.leafDark} />
    </g>
  );
}

function Dots({
  cx = 60,
  cy = 54,
  count,
  radius,
  r,
  fill,
  opacity = 1,
  offset = 0,
}: {
  cx?: number;
  cy?: number;
  count: number;
  radius: number;
  r: number;
  fill: string;
  opacity?: number;
  offset?: number;
}) {
  return (
    <g fill={fill} opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const p = polar(cx, cy, radius, offset + (360 / count) * i);
        return <circle key={i} cx={p.x} cy={p.y} r={r} />;
      })}
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roses, peonies & ranunculus: layered, cupped blooms                       */
/* -------------------------------------------------------------------------- */

type Layer = { n: number; dist: number; rx: number; ry: number; offset: number };

const ROSE_LAYERS: Layer[] = [
  { n: 5, dist: 14, rx: 14, ry: 15, offset: 0 },
  { n: 5, dist: 10, rx: 12, ry: 13, offset: 36 },
  { n: 4, dist: 6, rx: 10, ry: 11, offset: 15 },
  { n: 3, dist: 2.8, rx: 7, ry: 8.5, offset: 50 },
];

const GARDEN_ROSE_LAYERS: Layer[] = [
  { n: 7, dist: 17, rx: 12, ry: 14, offset: 0 },
  { n: 7, dist: 13, rx: 11.5, ry: 13, offset: 26 },
  { n: 6, dist: 9.5, rx: 10.5, ry: 12, offset: 12 },
  { n: 5, dist: 6, rx: 9, ry: 10.5, offset: 40 },
  { n: 3, dist: 2.8, rx: 6.5, ry: 8, offset: 20 },
];

const RANUNCULUS_LAYERS: Layer[] = [
  { n: 10, dist: 17, rx: 9.5, ry: 11, offset: 0 },
  { n: 9, dist: 13, rx: 9, ry: 10.5, offset: 18 },
  { n: 8, dist: 9.5, rx: 8, ry: 9.5, offset: 9 },
  { n: 6, dist: 6, rx: 7, ry: 8, offset: 30 },
  { n: 5, dist: 3, rx: 5.5, ry: 6.5, offset: 15 },
];

const PEONY_LAYERS: Layer[] = [
  { n: 8, dist: 17, rx: 15, ry: 15, offset: 0 },
  { n: 8, dist: 13, rx: 14, ry: 14.5, offset: 22 },
  { n: 7, dist: 9.5, rx: 12.5, ry: 13, offset: 10 },
  { n: 6, dist: 6, rx: 10.5, ry: 11, offset: 34 },
  { n: 5, dist: 3, rx: 8, ry: 9, offset: 18 },
];

const CHINA_LAYERS: Layer[] = [
  { n: 5, dist: 13, rx: 15, ry: 16, offset: 0 },
  { n: 5, dist: 8.5, rx: 12.5, ry: 13.5, offset: 36 },
  { n: 4, dist: 4, rx: 9, ry: 10, offset: 12 },
];

function LayeredBloom({
  uid,
  color,
  center,
  layers,
  core,
  depth = 0.5,
}: BloomProps & { layers: Layer[]; core: "spiral" | "eye" | "ruffle"; depth?: number }) {
  const total = layers.length;
  const tone = (i: number) => mix(lighten(color, 0.1), center, (i / total) * depth);

  return (
    <g transform="translate(60 54) scale(1 0.93) translate(-60 -54)">
      <defs>
        {layers.map((_, i) => (
          <radialGradient key={i} id={`${uid}-layer-${i}`} cx="50%" cy="62%" r="75%">
            <stop offset="0%" stopColor={lighten(tone(i), 0.3)} />
            <stop offset="60%" stopColor={tone(i)} />
            <stop offset="100%" stopColor={darken(tone(i), 0.16)} />
          </radialGradient>
        ))}
      </defs>

      {layers.map((layer, i) => (
        <g key={i}>
          {Array.from({ length: layer.n }, (_, k) => {
            const angle = layer.offset + (360 / layer.n) * k - 90;
            const p = polar(60, 54, layer.dist, angle);
            return (
              <ellipse
                key={k}
                cx={p.x}
                cy={p.y}
                rx={layer.rx}
                ry={layer.ry}
                fill={`url(#${uid}-layer-${i})`}
                stroke={darken(tone(i), 0.3)}
                strokeOpacity="0.3"
                strokeWidth="0.6"
                transform={`rotate(${round(angle - 90)} ${p.x} ${p.y})`}
              />
            );
          })}
        </g>
      ))}

      {core === "spiral" ? (
        <g fill="none" stroke={darken(center, 0.15)} strokeLinecap="round">
          <ellipse cx="60" cy="54" rx="6.5" ry="6" fill={darken(center, 0.1)} stroke="none" opacity="0.3" />
          <path
            d="M60 54 C58 52 62 50 63.5 53 C65 57 60 60 56.5 57 C52.5 53 56.5 47 62 47.5 C68 48 70 55 66 59"
            strokeWidth="0.9"
            opacity="0.55"
          />
          <path d="M60.5 53.5 C61.5 54 61.5 55.5 60 55.5" strokeWidth="0.8" opacity="0.6" />
        </g>
      ) : core === "ruffle" ? (
        <g>
          <g fill="none" stroke={darken(center, 0.1)} strokeLinecap="round" opacity="0.5">
            <path d="M54 54 C55 50 59 52 60 49 C61 52 65 50 66 54" strokeWidth="1" />
            <path d="M55 58 C58 55 60 59 62 56 C64 54 66 57 66 58" strokeWidth="0.9" />
            <path d="M57 51 C58 48 62 48 63 51" strokeWidth="0.8" />
          </g>
          <Dots count={8} radius={3} r={0.8} fill="#f3d98a" opacity={0.75} />
        </g>
      ) : (
        <g>
          <circle cx="60" cy="54" r="5" fill={darken(center, 0.1)} opacity="0.55" />
          <circle cx="60" cy="54" r="3.4" fill={center} />
          <Dots count={7} radius={5} r={0.7} fill={lighten(center, 0.55)} opacity={0.8} />
          <circle cx="58.8" cy="52.8" r="1.1" fill="#ffffff" opacity="0.4" />
        </g>
      )}
    </g>
  );
}

function Rose({ uid, color, center, full }: BloomProps & { full?: boolean }) {
  return (
    <>
      <Stem
        y0={80}
        lean={4}
        width={3.2}
        leaves={[
          { t: 0.5, side: -1, length: full ? 34 : 30, width: 10, tilt: 52, tone: "dark" },
          { t: 0.68, side: 1, length: full ? 32 : 28, width: 9, tilt: 55, tone: "light" },
          { t: 0.84, side: -1, length: 22, width: 7, tilt: 58, tone: "pale" },
        ]}
      />
      <Calyx />
      <LayeredBloom
        uid={uid}
        color={color}
        center={center}
        layers={full ? GARDEN_ROSE_LAYERS : ROSE_LAYERS}
        core="spiral"
      />
    </>
  );
}

function Peony({ uid, color, center }: BloomProps) {
  return (
    <>
      <Stem
        y0={80}
        lean={3}
        width={3.4}
        leaves={[
          { t: 0.5, side: -1, length: 36, width: 12, tilt: 50, tone: "dark" },
          { t: 0.7, side: 1, length: 34, width: 11, tilt: 54, tone: "light" },
          { t: 0.86, side: -1, length: 24, width: 8, tilt: 58, tone: "pale" },
        ]}
      />
      <Calyx cy={78} />
      <LayeredBloom
        uid={uid}
        color={color}
        center={center}
        layers={PEONY_LAYERS}
        core="ruffle"
        depth={0.42}
      />
    </>
  );
}

function Ranunculus({ uid, color, center }: BloomProps) {
  return (
    <>
      <Stem
        y0={80}
        lean={3}
        width={3}
        leaves={[
          { t: 0.55, side: -1, length: 32, width: 9, tilt: 50, tone: "light" },
          { t: 0.75, side: 1, length: 28, width: 8, tilt: 54, tone: "dark" },
        ]}
      />
      <Calyx cy={77} />
      <LayeredBloom
        uid={uid}
        color={color}
        center={center}
        layers={RANUNCULUS_LAYERS}
        core="eye"
        depth={0.35}
      />
    </>
  );
}

function ChinaRose({ uid, color, center }: BloomProps) {
  return (
    <>
      <Stem
        y0={80}
        lean={4}
        width={3}
        leaves={[
          { t: 0.45, side: -1, length: 32, width: 9, tilt: 50, tone: "dark" },
          { t: 0.62, side: 1, length: 30, width: 8.5, tilt: 54, tone: "light" },
          { t: 0.8, side: -1, length: 24, width: 7, tilt: 58, tone: "dark" },
        ]}
      />
      <Calyx cy={77} />
      <LayeredBloom uid={uid} color={color} center={center} layers={CHINA_LAYERS} core="eye" depth={0.32} />
      <Dots cx={60} cy={52} count={9} radius={3.6} r={0.9} fill="#f6d46a" opacity={0.95} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Daisies: two rings of slender petals around a dotted disc                 */
/* -------------------------------------------------------------------------- */

function petalPath(length: number, width: number) {
  const l = (n: number) => round(-length * n);
  return `M0 0 C${-width} ${l(0.2)} ${-width} ${l(0.92)} ${round(-width * 0.25)} ${-length} Q0 ${l(1.03)} ${round(width * 0.25)} ${-length} C${width} ${l(0.92)} ${width} ${l(0.2)} 0 0Z`;
}

function Daisy({
  uid,
  color,
  center,
  tip,
  count,
  length,
  width,
  disc,
}: BloomProps & { tip: string; count: number; length: number; width: number; disc: number }) {
  const front = petalPath(length, width);
  const back = petalPath(length * 0.9, width * 1.05);
  const gradient = `${uid}-petal`;
  const step = 360 / count;

  return (
    <>
      <Stem
        y0={78}
        lean={3}
        width={2.8}
        leaves={[
          { t: 0.7, side: -1, length: 26, width: 6, tilt: 52, tone: "light" },
          { t: 0.86, side: 1, length: 24, width: 5.5, tilt: 55, tone: "dark" },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.94) translate(-60 -54)">
        <defs>
          <linearGradient id={gradient} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={mix(color, center, 0.3)} />
            <stop offset="0.35" stopColor={color} />
            <stop offset="1" stopColor={tip} />
          </linearGradient>
          <radialGradient id={`${uid}-disc`} cx="42%" cy="38%" r="70%">
            <stop offset="0" stopColor={lighten(center, 0.45)} />
            <stop offset="0.55" stopColor={center} />
            <stop offset="1" stopColor={darken(center, 0.35)} />
          </radialGradient>
        </defs>

        {Array.from({ length: count }, (_, i) => (
          <path
            key={`b${i}`}
            d={back}
            transform={`translate(60 54) rotate(${round(step * (i + 0.5))}) translate(0 -4)`}
            fill={darken(color, 0.12)}
            stroke={darken(color, 0.3)}
            strokeOpacity="0.2"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: count }, (_, i) => (
          <g key={`f${i}`} transform={`translate(60 54) rotate(${round(step * i)}) translate(0 -4)`}>
            <path
              d={front}
              fill={`url(#${gradient})`}
              stroke={darken(color, 0.3)}
              strokeOpacity="0.22"
              strokeWidth="0.5"
            />
            <path
              d={`M0 -4 L0 ${round(-length * 0.72)}`}
              stroke={darken(color, 0.25)}
              strokeOpacity="0.14"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        <circle cx="60" cy="54" r={disc} fill={`url(#${uid}-disc)`} stroke={darken(center, 0.4)} strokeOpacity="0.35" strokeWidth="0.6" />
        <Dots count={10} radius={round(disc * 0.64)} r={0.9} fill={darken(center, 0.45)} opacity={0.5} />
        <Dots count={5} radius={round(disc * 0.3)} r={0.8} fill={darken(center, 0.45)} opacity={0.5} offset={20} />
        <circle cx="57.2" cy="51.2" r={round(disc * 0.25)} fill={lighten(center, 0.6)} opacity="0.4" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sunflower: two rings of pointed petals around a seed-spiral disc          */
/* -------------------------------------------------------------------------- */

const SUNFLOWER_PETAL = "M0 0 C-7 -7 -8 -22 0 -31 C8 -22 7 -7 0 0Z";

const SUNFLOWER_SEEDS = Array.from({ length: 70 }, (_, i) => {
  const r = 1.42 * Math.sqrt(i + 0.5);
  const p = polar(60, 54, round(r), i * 137.508);
  return { x: p.x, y: p.y, r: round(0.7 + (r / 12) * 0.5), i };
});

function Sunflower({ uid, color, center }: BloomProps) {
  const petal = `${uid}-sun-petal`;
  const disc = `${uid}-sun-disc`;
  const count = 18;
  const step = 360 / count;

  return (
    <>
      <Stem
        y0={84}
        lean={3}
        width={4.4}
        leaves={[
          { t: 0.55, side: -1, length: 40, width: 15, tilt: 50, tone: "dark" },
          { t: 0.75, side: 1, length: 36, width: 14, tilt: 54, tone: "light" },
        ]}
      />
      <g>
        <defs>
          <linearGradient id={petal} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={mix(color, "#c46a14", 0.45)} />
            <stop offset="0.45" stopColor={color} />
            <stop offset="1" stopColor={lighten(color, 0.2)} />
          </linearGradient>
          <radialGradient id={disc} cx="42%" cy="38%" r="70%">
            <stop offset="0" stopColor={mix(center, "#8a5a28", 0.5)} />
            <stop offset="0.6" stopColor={center} />
            <stop offset="1" stopColor={darken(center, 0.3)} />
          </radialGradient>
        </defs>

        {Array.from({ length: count }, (_, i) => (
          <path
            key={`b${i}`}
            d={SUNFLOWER_PETAL}
            transform={`translate(60 54) rotate(${round(step * (i + 0.5))}) translate(0 -9) scale(${round(1.02 + (i % 3) * 0.03)})`}
            fill={darken(color, 0.14)}
            stroke={darken(color, 0.35)}
            strokeOpacity="0.25"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        ))}
        {Array.from({ length: count }, (_, i) => (
          <g
            key={`f${i}`}
            transform={`translate(60 54) rotate(${round(step * i + (i % 2 ? 2 : -2))}) translate(0 -9) scale(${round(0.94 + (i % 3) * 0.04)})`}
          >
            <path
              d={SUNFLOWER_PETAL}
              fill={`url(#${petal})`}
              stroke={darken(color, 0.35)}
              strokeOpacity="0.28"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            <path d="M0 -3 L0 -23" stroke={darken(color, 0.3)} strokeOpacity="0.2" strokeWidth="0.5" strokeLinecap="round" />
          </g>
        ))}

        <circle cx="60" cy="54" r="14.6" fill="#7a5a24" opacity="0.9" />
        <circle cx="60" cy="54" r="13.8" fill={`url(#${disc})`} />
        <g>
          {SUNFLOWER_SEEDS.map((seed) => (
            <circle
              key={seed.i}
              cx={seed.x}
              cy={seed.y}
              r={seed.r}
              fill={seed.i % 2 ? lighten(center, 0.38) : darken(center, 0.45)}
              opacity="0.55"
            />
          ))}
        </g>
        <circle cx="55.5" cy="49.5" r="3.4" fill="#ffffff" opacity="0.12" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dahlia: rings of pointed, geometric petals                                */
/* -------------------------------------------------------------------------- */

const DAHLIA_RINGS = [
  { n: 16, len: 31, w: 7.5, off: 0 },
  { n: 14, len: 26, w: 7, off: 12 },
  { n: 12, len: 21, w: 6.5, off: 6 },
  { n: 10, len: 16, w: 5.8, off: 18 },
  { n: 8, len: 11, w: 5, off: 9 },
];

function dahliaPetal(len: number, w: number) {
  const l = (n: number) => round(-len * n);
  return `M0 0 C${-w} ${l(0.25)} ${round(-w * 0.95)} ${l(0.8)} 0 ${-len} C${round(w * 0.95)} ${l(0.8)} ${w} ${l(0.25)} 0 0Z`;
}

function Dahlia({ uid, color, center }: BloomProps) {
  return (
    <>
      <Stem
        y0={80}
        lean={3}
        width={3}
        leaves={[
          { t: 0.55, side: -1, length: 30, width: 9, tilt: 48, tone: "dark" },
          { t: 0.75, side: 1, length: 28, width: 8.5, tilt: 52, tone: "light" },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.96) translate(-60 -54)">
        <defs>
          {DAHLIA_RINGS.map((_, i) => {
            const tone = mix(color, center, i * 0.09);
            return (
              <linearGradient key={i} id={`${uid}-dahlia-${i}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor={darken(tone, 0.22)} />
                <stop offset="0.5" stopColor={tone} />
                <stop offset="1" stopColor={lighten(tone, 0.22)} />
              </linearGradient>
            );
          })}
        </defs>

        {DAHLIA_RINGS.map((ring, i) => {
          const d = dahliaPetal(ring.len, ring.w);
          const tone = mix(color, center, i * 0.09);
          return (
            <g key={i}>
              {Array.from({ length: ring.n }, (_, k) => (
                <path
                  key={k}
                  d={d}
                  transform={`translate(60 54) rotate(${round(ring.off + (360 / ring.n) * k)})`}
                  fill={`url(#${uid}-dahlia-${i})`}
                  stroke={darken(tone, 0.3)}
                  strokeOpacity="0.28"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        })}

        <circle cx="60" cy="54" r="3.2" fill={darken(center, 0.25)} />
        <Dots count={6} radius={2} r={0.7} fill={lighten(center, 0.5)} opacity={0.7} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cornflower: fringed trumpet florets                                       */
/* -------------------------------------------------------------------------- */

const FLORET =
  "M0 0 L-2.6 -11 L-8.6 -19.5 L-6 -23.5 L-3.4 -21 L-2.2 -27 L0 -23 L2.2 -27 L3.4 -21 L6 -23.5 L8.6 -19.5 L2.6 -11Z";

function Cornflower({ uid, color, center }: BloomProps) {
  const outer = `${uid}-floret`;
  const inner = `${uid}-floret-inner`;

  return (
    <>
      <Stem
        y0={84}
        lean={3}
        width={2.2}
        leaves={[
          { t: 0.5, side: -1, length: 36, width: 3, tilt: 30, tone: "pale" },
          { t: 0.72, side: 1, length: 32, width: 3, tilt: 34, tone: "dark" },
          { t: 0.88, side: -1, length: 24, width: 2.6, tilt: 40, tone: "pale" },
        ]}
      />
      <g>
        <ellipse cx="60" cy="80" rx="6.5" ry="7.5" fill={GREEN.leafDark} />
        <path
          d="M55 77 Q60 84 65 77 M54.5 81 Q60 88 65.5 81"
          stroke={GREEN.leafPale}
          strokeWidth="0.7"
          strokeOpacity="0.6"
          fill="none"
        />
      </g>
      <defs>
        <linearGradient id={outer} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={darken(color, 0.28)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.2)} />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={darken(color, 0.4)} />
          <stop offset="1" stopColor={darken(color, 0.1)} />
        </linearGradient>
      </defs>
      <g transform="translate(60 54)" strokeLinejoin="round">
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={`o${i}`}
            d={FLORET}
            transform={`rotate(${i * 40})`}
            fill={`url(#${outer})`}
            stroke={darken(color, 0.32)}
            strokeOpacity="0.3"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={`i${i}`}
            d={FLORET}
            transform={`rotate(${i * 40 + 20}) scale(0.62)`}
            fill={`url(#${inner})`}
            stroke={darken(color, 0.4)}
            strokeOpacity="0.3"
            strokeWidth="0.6"
          />
        ))}
        <circle r="6" fill={darken(color, 0.38)} />
        <Dots cx={0} cy={0} count={10} radius={3.4} r={0.95} fill={lighten(color, 0.55)} opacity={0.9} />
        <circle r="1.4" fill={center} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cosmos: eight broad, toothed petals with veins                            */
/* -------------------------------------------------------------------------- */

const COSMOS_PETAL =
  "M0 0 C-6 -3 -13 -14 -11 -24 Q-10 -27 -7.5 -26.5 L-5.5 -24.5 L-3.5 -27.5 Q0 -29 3.5 -27.5 L5.5 -24.5 L7.5 -26.5 Q10 -27 11 -24 C13 -14 6 -3 0 0Z";

function Cosmos({ uid, color, center }: BloomProps) {
  const gradient = `${uid}-cosmos`;
  const wobble = [-3, 4, -2, 3, -4, 2, -3, 4];

  return (
    <>
      <Stem
        y0={80}
        lean={4}
        width={2}
        leaves={[
          { t: 0.3, side: -1, length: 24, width: 0, tilt: 50, feather: true },
          { t: 0.42, side: 1, length: 22, width: 0, tilt: 52, feather: true },
          { t: 0.58, side: -1, length: 26, width: 0, tilt: 48, feather: true },
          { t: 0.72, side: 1, length: 24, width: 0, tilt: 54, feather: true },
          { t: 0.86, side: -1, length: 20, width: 0, tilt: 56, feather: true },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.93) translate(-60 -54)">
        <defs>
          <linearGradient id={gradient} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={mix(color, center, 0.55)} />
            <stop offset="0.38" stopColor={mix(color, center, 0.12)} />
            <stop offset="1" stopColor={lighten(color, 0.25)} />
          </linearGradient>
          <radialGradient id={`${uid}-cosmos-disc`} cx="42%" cy="38%" r="70%">
            <stop offset="0" stopColor="#F8E08A" />
            <stop offset="0.6" stopColor="#E3B84F" />
            <stop offset="1" stopColor="#B98A32" />
          </radialGradient>
        </defs>

        {Array.from({ length: 8 }, (_, i) => {
          const scale = round(0.96 + (i % 3) * 0.04);
          return (
            <g key={i} transform={`translate(60 54) rotate(${i * 45 + wobble[i]}) scale(${scale})`}>
              <path
                d={COSMOS_PETAL}
                fill={`url(#${gradient})`}
                stroke={darken(color, 0.3)}
                strokeOpacity="0.28"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
              <g
                fill="none"
                stroke={darken(color, 0.28)}
                strokeOpacity="0.22"
                strokeWidth="0.5"
                strokeLinecap="round"
              >
                <path d="M0 -3 L0 -22" />
                <path d="M-2 -4 C-5 -12 -7 -18 -8 -23" />
                <path d="M2 -4 C5 -12 7 -18 8 -23" />
              </g>
            </g>
          );
        })}

        <circle cx="60" cy="54" r="6.2" fill={`url(#${uid}-cosmos-disc)`} stroke="#8E6521" strokeOpacity="0.35" strokeWidth="0.5" />
        <Dots count={8} radius={3.8} r={0.7} fill="#8E6521" opacity={0.55} />
        <circle cx="58" cy="52" r="1.5" fill="#FFF3B8" opacity="0.5" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lavender: three slender spikes of paired florets                          */
/* -------------------------------------------------------------------------- */

function LavenderSpike({
  x,
  y,
  rotate,
  length,
  color,
}: {
  x: number;
  y: number;
  rotate: number;
  length: number;
  color: string;
}) {
  const whorls = Math.round(length / 4.4);
  const step = (length - 10) / (whorls - 1);
  const shades = [color, lighten(color, 0.22), darken(color, 0.1), lighten(color, 0.1)];

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={`M0 0 L0 ${-length}`} stroke={GREEN.leafDark} strokeWidth="1.3" strokeLinecap="round" />
      {Array.from({ length: whorls }, (_, i) => {
        const s = round(1 - (i / (whorls - 1)) * 0.5);
        const yy = round(-10 - i * step);
        const dx = round(4.2 * s);
        return (
          <g key={i} stroke={darken(color, 0.3)} strokeOpacity="0.28" strokeWidth="0.3">
            <ellipse
              cx={-dx}
              cy={yy}
              rx={round(3 * s)}
              ry={round(4.6 * s)}
              transform={`rotate(-24 ${-dx} ${yy})`}
              fill={shades[i % 4]}
            />
            <ellipse
              cx={dx}
              cy={yy}
              rx={round(3 * s)}
              ry={round(4.6 * s)}
              transform={`rotate(24 ${dx} ${yy})`}
              fill={shades[(i + 2) % 4]}
            />
            <ellipse
              cx="0"
              cy={round(yy - 2)}
              rx={round(2.6 * s)}
              ry={round(4.2 * s)}
              fill={shades[(i + 1) % 4]}
            />
          </g>
        );
      })}
      <ellipse cx="0" cy={-length - 1} rx="2" ry="3.4" fill={shades[1]} />
    </g>
  );
}

function Lavender({ color }: { color: string }) {
  const bare = useContext(BareStemContext);
  return (
    <>
      {!bare && (
        <g>
          <Leaf x={58} y={176} angle={-22} length={54} width={3.2} fill={GREEN.leafPale} />
          <Leaf x={58} y={176} angle={-42} length={46} width={3} fill={GREEN.leaf} />
          <Leaf x={62} y={176} angle={20} length={52} width={3.2} fill={GREEN.leaf} />
          <Leaf x={62} y={176} angle={40} length={44} width={3} fill={GREEN.leafPale} />
        </g>
      )}
      <g fill="none" stroke="#728f71" strokeWidth="1.7" strokeLinecap="round">
        <path d="M60 178 C60 150 60 120 60 92" />
        <path d="M59 178 C58 152 47 134 41 104" />
        <path d="M61 178 C62 156 74 138 80 110" />
      </g>
      <LavenderSpike x={41} y={104} rotate={-9} length={56} color={color} />
      <LavenderSpike x={80} y={110} rotate={10} length={52} color={color} />
      <LavenderSpike x={60} y={92} rotate={0} length={68} color={color} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tulip: three pointed petals forming a cup                                 */
/* -------------------------------------------------------------------------- */

function Tulip({ uid, color, center }: BloomProps) {
  const front = `${uid}-tulip`;
  const back = `${uid}-tulip-back`;
  const edge = darken(color, 0.3);

  return (
    <>
      <defs>
        <linearGradient id={front} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={lighten(color, 0.4)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={mix(color, center, 0.5)} />
        </linearGradient>
        <linearGradient id={back} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={mix(color, center, 0.25)} />
          <stop offset="1" stopColor={mix(color, center, 0.7)} />
        </linearGradient>
      </defs>
      <Stem
        y0={80}
        lean={2.5}
        width={4}
        leaves={[
          { t: 0.6, side: -1, length: 74, width: 12, tilt: 14, tone: "pale" },
          { t: 0.78, side: 1, length: 66, width: 11, tilt: 16, tone: "light" },
        ]}
      />
      <path
        d="M60 80 C50 74 47 50 53 30 C55 23 58 19 60 16 C62 19 65 23 67 30 C73 50 70 74 60 80Z"
        fill={`url(#${back})`}
        stroke={edge}
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      <path
        d="M60 82 C40 82 33 58 38 32 C39 27 42 25 44 28 C49 40 58 54 60 82Z"
        fill={`url(#${front})`}
        stroke={edge}
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <path
        d="M60 82 C80 82 87 58 82 32 C81 27 78 25 76 28 C71 40 62 54 60 82Z"
        fill={`url(#${front})`}
        stroke={edge}
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <g fill="none" strokeLinecap="round">
        <path d="M43 33 C46 52 50 64 56 76" stroke={edge} strokeOpacity="0.25" strokeWidth="0.6" />
        <path d="M77 33 C74 52 70 64 64 76" stroke={edge} strokeOpacity="0.25" strokeWidth="0.6" />
        <path d="M41 40 C42 50 46 60 51 68" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.2" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lily: six recurved, pointed tepals with long stamens                      */
/* -------------------------------------------------------------------------- */

const LILY_OUTER = "M0 0 C-10 -9 -13 -27 -4 -41 Q0 -46 4 -41 C13 -27 10 -9 0 0Z";
const LILY_INNER = "M0 0 C-12 -8 -15 -26 -5 -40 Q0 -45 5 -40 C15 -26 12 -8 0 0Z";

function Lily({ uid, color, center }: BloomProps) {
  const gradient = `${uid}-lily`;
  const edge = darken(color, 0.3);

  return (
    <>
      <Stem
        y0={84}
        lean={3}
        width={3.2}
        leaves={[
          { t: 0.5, side: -1, length: 62, width: 7, tilt: 16, tone: "dark" },
          { t: 0.66, side: 1, length: 58, width: 7, tilt: 18, tone: "light" },
          { t: 0.82, side: -1, length: 40, width: 6, tilt: 28, tone: "pale" },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.94) translate(-60 -54)">
        <defs>
          <linearGradient id={gradient} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#d9e3a2" />
            <stop offset="0.28" stopColor={lighten(color, 0.25)} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>

        {[0, 120, 240].map((a) => (
          <g key={`o${a}`} transform={`translate(60 54) rotate(${a})`}>
            <path d={LILY_OUTER} fill={`url(#${gradient})`} stroke={edge} strokeOpacity="0.25" strokeWidth="0.6" strokeLinejoin="round" />
            <path d="M0 -3 L0 -37" stroke={edge} strokeOpacity="0.2" strokeWidth="0.7" strokeLinecap="round" />
          </g>
        ))}
        {[60, 180, 300].map((a) => (
          <g key={`i${a}`} transform={`translate(60 54) rotate(${a})`}>
            <path d={LILY_INNER} fill={`url(#${gradient})`} stroke={edge} strokeOpacity="0.28" strokeWidth="0.6" strokeLinejoin="round" />
            <g fill="none" stroke={edge} strokeOpacity="0.2" strokeWidth="0.6" strokeLinecap="round">
              <path d="M0 -3 L0 -36" />
              <path d="M-1.5 -5 C-5 -16 -6 -27 -4 -36" />
              <path d="M1.5 -5 C5 -16 6 -27 4 -36" />
            </g>
          </g>
        ))}

        {Array.from({ length: 6 }, (_, k) => (
          <g key={k} transform={`translate(60 54) rotate(${k * 60 + 15})`}>
            <path d="M0 0 L0 -17" stroke="#e8e2b8" strokeWidth="0.9" strokeLinecap="round" />
            <ellipse cx="0" cy="-19" rx="1.8" ry="4.2" fill="#b8651f" />
          </g>
        ))}
        <path d="M60 54 L60 31" stroke="#c9d79a" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="60" cy="30" r="2" fill={center} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hydrangea: a round head of many tiny four-petal florets                   */
/* -------------------------------------------------------------------------- */

const HYDRANGEA_FLORETS = Array.from({ length: 48 }, (_, i) => {
  const r = 4.55 * Math.sqrt(i + 0.6);
  const p = polar(60, 52, round(r), i * 137.508);
  return {
    x: p.x,
    y: p.y,
    size: round(5.4 + ((i * 5) % 4) * 0.6),
    rot: (i * 31) % 90,
    shade: i % 4,
  };
}).reverse(); // draw the outer florets first so the centre ones sit on top

function Hydrangea({ uid, color, center }: BloomProps) {
  const shades = [color, lighten(color, 0.18), mix(color, "#c9a8d8", 0.35), darken(color, 0.08)];

  return (
    <>
      <Stem
        y0={90}
        lean={3}
        width={3.4}
        leaves={[
          { t: 0.4, side: -1, length: 42, width: 17, tilt: 55, tone: "dark" },
          { t: 0.58, side: 1, length: 40, width: 16, tilt: 58, tone: "light" },
        ]}
      />
      <g>
        <defs>
          <radialGradient id={`${uid}-hyd-shade`} cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#1d2a3a" stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {HYDRANGEA_FLORETS.map((f, i) => {
          const o = round(f.size * 0.42);
          const pr = round(f.size * 0.5);
          return (
            <g
              key={i}
              transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}
              fill={shades[f.shade]}
              stroke={darken(color, 0.3)}
              strokeOpacity="0.2"
              strokeWidth="0.4"
            >
              <circle cx="0" cy={-o} r={pr} />
              <circle cx={o} cy="0" r={pr} />
              <circle cx="0" cy={o} r={pr} />
              <circle cx={-o} cy="0" r={pr} />
              <circle cx="0" cy="0" r="1" fill={center} stroke="none" />
            </g>
          );
        })}
        <circle cx="60" cy="52" r="37" fill={`url(#${uid}-hyd-shade)`} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Anemone: broad petals, dark heart and a fringe of stamens                 */
/* -------------------------------------------------------------------------- */

const ANEMONE_PETAL = "M0 0 C-15 -4 -19 -23 -9 -33 Q0 -37 9 -33 C19 -23 15 -4 0 0Z";

function Anemone({ uid, color, center }: BloomProps) {
  const gradient = `${uid}-anemone`;
  const count = 7;

  return (
    <>
      <Stem
        y0={82}
        lean={3}
        width={2.4}
        leaves={[
          { t: 0.45, side: -1, length: 24, width: 0, tilt: 50, feather: true },
          { t: 0.6, side: 1, length: 22, width: 0, tilt: 52, feather: true },
          { t: 0.75, side: -1, length: 22, width: 0, tilt: 54, feather: true },
          { t: 0.88, side: 1, length: 18, width: 0, tilt: 56, feather: true },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.94) translate(-60 -54)">
        <defs>
          <linearGradient id={gradient} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={mix(color, "#6b4a86", 0.55)} />
            <stop offset="0.34" stopColor={color} />
            <stop offset="1" stopColor={lighten(color, 0.2)} />
          </linearGradient>
        </defs>

        {Array.from({ length: count }, (_, i) => (
          <g key={i} transform={`translate(60 54) rotate(${round(i * (360 / count) + (i % 2 ? 4 : -3))})`}>
            <path
              d={ANEMONE_PETAL}
              fill={`url(#${gradient})`}
              stroke={darken(color, 0.35)}
              strokeOpacity="0.28"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <g fill="none" stroke={darken(color, 0.3)} strokeOpacity="0.16" strokeWidth="0.5" strokeLinecap="round">
              <path d="M0 -5 L0 -30" />
              <path d="M-2 -6 C-6 -14 -8 -22 -7 -30" />
              <path d="M2 -6 C6 -14 8 -22 7 -30" />
            </g>
          </g>
        ))}

        <circle cx="60" cy="54" r="9.5" fill="#6b4a86" opacity="0.35" />
        {Array.from({ length: 28 }, (_, i) => {
          const a = i * (360 / 28);
          const p1 = polar(60, 54, 6, a);
          const p2 = polar(60, 54, 12, a);
          return (
            <g key={i}>
              <path d={`M${p1.x} ${p1.y} L${p2.x} ${p2.y}`} stroke={center} strokeWidth="0.55" />
              <circle cx={p2.x} cy={p2.y} r="0.9" fill={center} />
            </g>
          );
        })}
        <circle cx="60" cy="54" r="7" fill={center} />
        <circle cx="58" cy="52" r="2" fill="#ffffff" opacity="0.18" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Forget-me-not: sprays of tiny five-petal flowers                          */
/* -------------------------------------------------------------------------- */

function FivePetalFlower({
  x,
  y,
  r,
  color,
  center,
  rotate = 0,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  center: string;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const p = polar(0, 0, round(r * 0.56), i * 72 - 90);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={round(r * 0.47)}
            fill={i % 2 ? color : lighten(color, 0.08)}
            stroke={darken(color, 0.3)}
            strokeOpacity="0.22"
            strokeWidth="0.5"
          />
        );
      })}
      <circle r={round(r * 0.3)} fill="#fffdf2" />
      <circle r={round(r * 0.17)} fill={center} />
    </g>
  );
}

const FMN_FLOWERS = [
  { x: 60, y: 46, r: 10.5, rotate: 8 },
  { x: 41, y: 58, r: 9, rotate: -14 },
  { x: 79, y: 57, r: 9.5, rotate: 20 },
  { x: 48, y: 31, r: 8.5, rotate: 30 },
  { x: 73, y: 33, r: 8, rotate: -10 },
  { x: 60, y: 22, r: 6.5, rotate: 0 },
];
const FMN_BUDS = [
  { x: 31, y: 43, r: 3 },
  { x: 89, y: 44, r: 3.2 },
  { x: 61, y: 9, r: 2.8 },
];

function ForgetMeNot({ color, center }: Omit<BloomProps, "uid">) {
  return (
    <>
      <Stem
        y0={88}
        lean={4}
        width={2.2}
        leaves={[
          { t: 0.6, side: -1, length: 22, width: 5, tilt: 55, tone: "light" },
          { t: 0.8, side: 1, length: 20, width: 4.5, tilt: 50, tone: "dark" },
        ]}
      />
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.1" strokeLinecap="round">
        {[...FMN_FLOWERS, ...FMN_BUDS].map((item, i) => (
          <path
            key={i}
            d={`M60 88 Q${round((60 + item.x) / 2)} ${round((96 + item.y) / 2)} ${item.x} ${item.y}`}
          />
        ))}
      </g>
      {FMN_BUDS.map((bud, i) => (
        <g key={i}>
          <circle cx={bud.x} cy={bud.y} r={bud.r} fill={darken(color, 0.12)} />
          <circle cx={round(bud.x - 0.8)} cy={round(bud.y - 0.8)} r={round(bud.r * 0.4)} fill={lighten(color, 0.4)} opacity="0.7" />
        </g>
      ))}
      {FMN_FLOWERS.map((f, i) => (
        <FivePetalFlower key={i} x={f.x} y={f.y} r={f.r} rotate={f.rotate} color={color} center={center} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sweet pea: ruffled standards, wings and keel on a curved raceme           */
/* -------------------------------------------------------------------------- */

function SweetPeaBlossom({
  uid,
  x,
  y,
  rotate,
  scale,
  color,
  center,
}: BloomProps & { x: number; y: number; rotate: number; scale: number }) {
  const edge = darken(color, 0.3);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 -3 C-14 -6 -24 -20 -17 -31 C-14 -35 -9 -34 -6 -37 C-3 -40 3 -40 6 -37 C9 -34 14 -35 17 -31 C24 -20 14 -6 0 -3Z"
        fill={`url(#${uid}-sp-std)`}
        stroke={edge}
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <g fill="none" stroke={edge} strokeOpacity="0.22" strokeWidth="0.6" strokeLinecap="round">
        <path d="M0 -5 C-2 -17 -4 -27 -6 -36" />
        <path d="M0 -5 L0 -37" />
        <path d="M0 -5 C2 -17 4 -27 6 -36" />
      </g>
      <path
        d="M0 -2 C-13 1 -21 -9 -16 -20 C-12 -25 -4 -19 0 -2Z"
        fill={`url(#${uid}-sp-wing)`}
        stroke={edge}
        strokeOpacity="0.28"
        strokeWidth="0.6"
      />
      <path
        d="M0 -2 C13 1 21 -9 16 -20 C12 -25 4 -19 0 -2Z"
        fill={`url(#${uid}-sp-wing)`}
        stroke={edge}
        strokeOpacity="0.28"
        strokeWidth="0.6"
      />
      <path
        d="M-3.5 -3 C-5 -11 5 -11 3.5 -3 C2.5 0 -2.5 0 -3.5 -3Z"
        fill={lighten(color, 0.55)}
        stroke={edge}
        strokeOpacity="0.2"
        strokeWidth="0.5"
      />
      <path
        d="M-3.5 0 C-4 -3 -2 -5 0 -5 C2 -5 4 -3 3.5 0 C2 2 -2 2 -3.5 0Z"
        fill={GREEN.leafDark}
      />
      <circle cx="0" cy="-9" r="0.01" fill={center} />
    </g>
  );
}

function SweetPea({ uid, color, center }: BloomProps) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-sp-std`} cx="50%" cy="88%" r="85%">
          <stop offset="0" stopColor={mix(color, center, 0.45)} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.35)} />
        </radialGradient>
        <linearGradient id={`${uid}-sp-wing`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={mix(color, center, 0.55)} />
          <stop offset="1" stopColor={mix(color, center, 0.2)} />
        </linearGradient>
      </defs>
      <Stem
        y0={86}
        lean={4}
        width={2.6}
        leaves={[
          { t: 0.5, side: -1, length: 22, width: 6, tilt: 58, tone: "light" },
          { t: 0.68, side: 1, length: 20, width: 5.5, tilt: 60, tone: "dark" },
        ]}
      />
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.3" strokeLinecap="round">
        <path d="M60 88 Q50 84 44 74" />
        <path d="M60 86 Q72 82 76 70" />
        <path d="M60 84 Q60 66 66 48" />
        <path d="M60 104 C70 96 88 100 86 112 C84 122 74 118 77 110" strokeWidth="1" />
      </g>
      <SweetPeaBlossom uid={uid} x={44} y={74} rotate={-12} scale={0.95} color={color} center={center} />
      <SweetPeaBlossom uid={uid} x={76} y={70} rotate={16} scale={0.8} color={color} center={center} />
      <g transform="translate(66 48) rotate(5)">
        <path
          d="M0 0 C-5 -4 -6 -13 0 -19 C6 -13 5 -4 0 0Z"
          fill={mix(color, center, 0.3)}
          stroke={darken(color, 0.3)}
          strokeOpacity="0.25"
          strokeWidth="0.5"
        />
        <path d="M-3.4 1 C-4 -2 -2 -5 0 -5 C2 -5 4 -2 3.4 1 C2 3 -2 3 -3.4 1Z" fill={GREEN.leafDark} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Iris: standards, falls, veins and a yellow beard                          */
/* -------------------------------------------------------------------------- */

function Iris({ uid, color, center }: BloomProps) {
  const std = `${uid}-iris-std`;
  const fall = `${uid}-iris-fall`;
  const edge = darken(color, 0.35);

  const leftFall = (
    <g>
      <path
        d="M-1 2 C-10 -2 -26 2 -33 14 C-37 22 -32 31 -24 29 C-16 26 -6 18 -1 4Z"
        fill={`url(#${fall})`}
        stroke={edge}
        strokeOpacity="0.3"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="0.5" strokeLinecap="round">
        <path d="M-3 4 C-12 6 -22 11 -29 17" />
        <path d="M-3 5 C-10 10 -17 17 -22 24" />
        <path d="M-2 6 C-6 12 -10 17 -14 22" />
      </g>
      <ellipse cx="-12" cy="9" rx="1.9" ry="8" transform="rotate(66 -12 9)" fill={center} opacity="0.95" />
    </g>
  );

  return (
    <>
      <defs>
        <linearGradient id={std} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={lighten(color, 0.5)} />
          <stop offset="0.5" stopColor={lighten(color, 0.12)} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <radialGradient id={fall} cx="50%" cy="8%" r="95%">
          <stop offset="0" stopColor={lighten(color, 0.55)} />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={darken(color, 0.28)} />
        </radialGradient>
      </defs>
      <Stem
        y0={84}
        lean={2}
        width={3.4}
        leaves={[
          { t: 0.7, side: -1, length: 100, width: 7, tilt: 7, tone: "pale" },
          { t: 0.85, side: 1, length: 86, width: 7, tilt: 9, tone: "light" },
        ]}
      />
      <g transform="translate(60 54)">
        <g fill={`url(#${std})`} stroke={edge} strokeOpacity="0.28" strokeWidth="0.6" strokeLinejoin="round">
          <path d="M0 2 C-20 2 -30 -12 -25 -29 C-21 -33 -12 -26 -5 -12 C-2 -6 0 -1 0 2Z" />
          <path d="M0 2 C20 2 30 -12 25 -29 C21 -33 12 -26 5 -12 C2 -6 0 -1 0 2Z" />
          <path d="M0 2 C-9 -6 -10 -24 -3 -35 C-1 -38 1 -38 3 -35 C10 -24 9 -6 0 2Z" />
        </g>
        {leftFall}
        <g transform="scale(-1 1)">{leftFall}</g>
        <g>
          <path
            d="M0 2 C-9 6 -13 20 -10 31 C-8 37 8 37 10 31 C13 20 9 6 0 2Z"
            fill={`url(#${fall})`}
            stroke={edge}
            strokeOpacity="0.3"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <g fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="0.5" strokeLinecap="round">
            <path d="M-2 6 C-5 14 -7 22 -7 31" />
            <path d="M0 6 L0 33" />
            <path d="M2 6 C5 14 7 22 7 31" />
          </g>
          <ellipse cx="0" cy="13" rx="2.4" ry="9" fill={center} opacity="0.95" />
        </g>
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Poppy: crinkled silky petals, dark stamens and a seed pod                 */
/* -------------------------------------------------------------------------- */

const POPPY_PETAL =
  "M0 0 C-17 -3 -30 -15 -28 -31 C-27 -41 -17 -45 -9 -42 C-5 -46 5 -46 9 -42 C17 -45 27 -41 28 -31 C30 -15 17 -3 0 0Z";

function Poppy({ uid, color, center }: BloomProps) {
  const gradient = `${uid}-poppy`;
  const petals = [
    { angle: 8, scale: 0.78 },
    { angle: 188, scale: 0.78 },
    { angle: 98, scale: 0.7 },
    { angle: 278, scale: 0.7 },
  ];

  return (
    <>
      <Stem
        y0={80}
        lean={5}
        width={2.8}
        leaves={[
          { t: 0.55, side: -1, length: 40, width: 8, tilt: 48, tone: "dark" },
          { t: 0.75, side: 1, length: 36, width: 7.5, tilt: 52, tone: "light" },
        ]}
      />
      <g transform="translate(60 54) scale(1 0.9) translate(-60 -54)">
        <defs>
          <radialGradient id={gradient} cx="50%" cy="95%" r="90%">
            <stop offset="0" stopColor={mix(color, center, 0.7)} />
            <stop offset="0.18" stopColor={mix(color, center, 0.35)} />
            <stop offset="0.5" stopColor={color} />
            <stop offset="1" stopColor={lighten(color, 0.3)} />
          </radialGradient>
          <radialGradient id={`${uid}-pod`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#c3d3a8" />
            <stop offset="1" stopColor="#7f9a6c" />
          </radialGradient>
        </defs>

        {petals.map((p) => (
          <g key={p.angle} transform={`translate(60 54) rotate(${p.angle}) scale(${p.scale})`}>
            <path
              d={POPPY_PETAL}
              fill={`url(#${gradient})`}
              stroke={darken(color, 0.32)}
              strokeOpacity="0.25"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <g fill="none" strokeLinecap="round">
              <path d="M0 -4 C-6 -16 -10 -28 -14 -38" stroke={darken(color, 0.3)} strokeOpacity="0.2" strokeWidth="0.7" />
              <path d="M0 -4 C6 -16 10 -28 14 -38" stroke={darken(color, 0.3)} strokeOpacity="0.2" strokeWidth="0.7" />
              <path d="M0 -4 L0 -40" stroke={darken(color, 0.3)} strokeOpacity="0.16" strokeWidth="0.7" />
              <path d="M-9 -22 C-6 -30 -3 -35 -2 -40" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" />
            </g>
          </g>
        ))}

        <circle cx="60" cy="54" r="9.5" fill={center} opacity="0.92" />
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * (360 / 22);
          const p1 = polar(60, 54, 7, a);
          const p2 = polar(60, 54, 13, a);
          return (
            <g key={i}>
              <path d={`M${p1.x} ${p1.y} L${p2.x} ${p2.y}`} stroke={center} strokeWidth="0.6" />
              <circle cx={p2.x} cy={p2.y} r="1" fill={darken(center, 0.2)} />
            </g>
          );
        })}
        <circle cx="60" cy="54" r="5" fill={`url(#${uid}-pod)`} stroke="#5c7550" strokeOpacity="0.5" strokeWidth="0.5" />
        <g stroke="#5c7550" strokeOpacity="0.55" strokeWidth="0.5" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const p = polar(60, 54, 4.2, i * 45);
            return <path key={i} d={`M60 54 L${p.x} ${p.y}`} />;
          })}
        </g>
        <circle cx="58.4" cy="52.4" r="1.2" fill="#ffffff" opacity="0.4" />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field no. 02 flowers                                                      */
/* -------------------------------------------------------------------------- */

/* Bellflower: upright, scalloped bells on short stalks */

const BELL_SHAPE =
  "M0 0 C-8 2 -12 14 -15 26 L-11 31 L-7 26 L-3 32 L0 27 L3 32 L7 26 L11 31 L15 26 C12 14 8 2 0 0Z";

function Bellflower({ uid, color, center }: BloomProps) {
  const id = `${uid}-bell`;
  const edge = darken(color, 0.35);
  const bells = [
    { x: 60, y: 28, r: 0, s: 1.15, d: "M60 46 Q58 36 60 28" },
    { x: 36, y: 48, r: -24, s: 0.88, d: "M60 48 Q46 38 36 48" },
    { x: 84, y: 46, r: 24, s: 0.82, d: "M60 48 Q74 36 84 46" },
  ];

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darken(color, 0.12)} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.35)} />
        </linearGradient>
      </defs>
      <Stem
        y0={48}
        lean={3}
        width={2.4}
        leaves={[
          { t: 0.3, side: -1, length: 34, width: 6, tilt: 50, tone: "light" },
          { t: 0.55, side: 1, length: 30, width: 6, tilt: 54, tone: "dark" },
          { t: 0.8, side: -1, length: 24, width: 5, tilt: 58, tone: "pale" },
        ]}
      />
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.6" strokeLinecap="round">
        {bells.map((b) => (
          <path key={b.d} d={b.d} />
        ))}
      </g>
      {bells.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r}) scale(${b.s})`}>
          <path d={BELL_SHAPE} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.7" strokeLinejoin="round" />
          <g fill="none" stroke={edge} strokeOpacity="0.22" strokeWidth="0.6" strokeLinecap="round">
            <path d="M-4 3 C-6 12 -8 20 -9 27" />
            <path d="M0 3 L0 26" />
            <path d="M4 3 C6 12 8 20 9 27" />
          </g>
          <ellipse cx="0" cy="29" rx="1.8" ry="3.2" fill={center} />
        </g>
      ))}
    </>
  );
}

/* Salvia: tall spikes of two-lipped flowers in dark calyces */

function SalviaSpike({
  x,
  y,
  rotate,
  length,
  color,
  calyx,
}: {
  x: number;
  y: number;
  rotate: number;
  length: number;
  color: string;
  calyx: string;
}) {
  const n = Math.max(4, Math.round(length / 8));
  const step = (length - 10) / (n - 1);
  const lip = lighten(color, 0.22);

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d={`M0 0 L0 ${-length}`} stroke={GREEN.leafDark} strokeWidth="1.5" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const s = round(1 - t * 0.45);
        const yy = round(-8 - i * step);
        const dx = round(6 * s);
        return (
          <g key={i} stroke={darken(color, 0.35)} strokeOpacity="0.3" strokeWidth="0.35">
            <ellipse cx="0" cy={round(yy + 2.5 * s)} rx={round(3.6 * s)} ry={round(3 * s)} fill={calyx} />
            {([-1, 1] as const).map((side) => (
              <g key={side}>
                <ellipse
                  cx={round(side * dx)}
                  cy={yy}
                  rx={round(7 * s)}
                  ry={round(2.9 * s)}
                  transform={`rotate(${side * -34} ${round(side * dx)} ${yy})`}
                  fill={i % 2 ? color : lip}
                />
                <ellipse
                  cx={round(side * dx * 0.7)}
                  cy={round(yy + 3 * s)}
                  rx={round(3.8 * s)}
                  ry={round(2.2 * s)}
                  fill={darken(color, 0.12)}
                />
              </g>
            ))}
          </g>
        );
      })}
      <ellipse cx="0" cy={-length - 2} rx="2" ry="4" fill={calyx} />
    </g>
  );
}

function Salvia({ color, center }: Omit<BloomProps, "uid">) {
  return (
    <>
      <Stem
        y0={96}
        lean={2}
        width={2.8}
        leaves={[
          { t: 0.5, side: -1, length: 34, width: 11, tilt: 58, tone: "dark" },
          { t: 0.68, side: 1, length: 32, width: 10, tilt: 60, tone: "light" },
          { t: 0.86, side: -1, length: 26, width: 8, tilt: 62, tone: "pale" },
        ]}
      />
      <SalviaSpike x={60} y={126} rotate={-18} length={50} color={color} calyx={center} />
      <SalviaSpike x={60} y={132} rotate={20} length={44} color={color} calyx={center} />
      <SalviaSpike x={60} y={96} rotate={0} length={86} color={color} calyx={center} />
    </>
  );
}

/* Primrose: five notched petals around a star-shaped eye */

const PRIM_PETAL =
  "M0 0 C-12 -4 -18 -16 -11 -23 C-8 -25 -3 -23 0 -18 C3 -23 8 -25 11 -23 C18 -16 12 -4 0 0Z";

function Primrose({ uid, color, center }: BloomProps) {
  const id = `${uid}-prim`;
  const edge = darken(color, 0.35);

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={mix(color, center, 0.55)} />
          <stop offset="0.4" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.3)} />
        </linearGradient>
      </defs>
      <Stem
        y0={76}
        lean={3}
        width={2.4}
        leaves={[
          { t: 0.55, side: -1, length: 46, width: 15, tilt: 64, tone: "dark" },
          { t: 0.72, side: 1, length: 42, width: 14, tilt: 66, tone: "light" },
          { t: 0.9, side: -1, length: 30, width: 11, tilt: 70, tone: "pale" },
        ]}
      />
      <g transform="translate(60 52) scale(1 0.94)">
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 72})`}>
            <path d={PRIM_PETAL} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.28" strokeWidth="0.6" strokeLinejoin="round" />
            <g fill="none" stroke={edge} strokeOpacity="0.18" strokeWidth="0.5" strokeLinecap="round">
              <path d="M0 -4 L0 -16" />
              <path d="M-2 -4 C-5 -9 -7 -14 -7 -19" />
              <path d="M2 -4 C5 -9 7 -14 7 -19" />
            </g>
          </g>
        ))}
        <path
          d="M0 -7 L1.8 -2.4 L6.6 -2 L2.9 1.1 L4.1 6 L0 3.4 L-4.1 6 L-2.9 1.1 L-6.6 -2 L-1.8 -2.4Z"
          fill={center}
          opacity="0.85"
        />
        <circle r="2.6" fill="#b4c85a" />
        <circle cx="-0.8" cy="-0.8" r="0.9" fill="#ffffff" opacity="0.5" />
      </g>
    </>
  );
}

/* Hyacinth: a dense column of tiny six-pointed stars */

function Star6({ x, y, r, fill, edge }: { x: number; y: number; r: number; fill: string; edge: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={fill} stroke={edge} strokeOpacity="0.3" strokeWidth="0.3">
      {[0, 60, 120].map((a) => (
        <ellipse key={a} cx="0" cy="0" rx={round(r * 0.4)} ry={r} transform={`rotate(${a})`} />
      ))}
    </g>
  );
}

function Hyacinth({ color, center }: Omit<BloomProps, "uid">) {
  const rows = 10;
  const shades = [color, lighten(color, 0.2), darken(color, 0.1)];
  const edge = darken(color, 0.4);

  return (
    <>
      <Stem
        y0={104}
        lean={2}
        width={4.2}
        leaves={[
          { t: 0.55, side: -1, length: 92, width: 8, tilt: 10, tone: "dark" },
          { t: 0.7, side: 1, length: 84, width: 8, tilt: 12, tone: "light" },
        ]}
      />
      <path d="M60 106 L60 32" stroke={GREEN.stem} strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="60" cy="27" rx="2.8" ry="5" fill={shades[2]} />
      {Array.from({ length: rows }, (_, i) => {
        const w = 0.42 + (0.58 * i) / (rows - 1);
        const yy = round(34 + i * 7.4);
        const r = round(5.8 * (0.65 + 0.35 * w));
        const xs = i === 0 ? [0] : i < 3 ? [-4.5 * w, 4.5 * w] : [-9 * w, 0, 9 * w];
        return xs.map((dx, k) => (
          <Star6
            key={`${i}-${k}`}
            x={round(60 + dx)}
            y={yy}
            r={r}
            fill={shades[(i + k) % 3]}
            edge={edge}
          />
        ));
      })}
      <circle cx="60" cy="66" r="0.01" fill={center} />
    </>
  );
}

/* Lily of the valley: an arching stem hung with tiny white bells */

const VALLEY_BELL = "M0 0 C-5 1 -7 7 -8 12 C-5 14 -2 13 0 12 C2 13 5 14 8 12 C7 7 5 1 0 0Z";

function LilyOfTheValley({ uid, color, center }: BloomProps) {
  const bare = useContext(BareStemContext);
  const id = `${uid}-valley`;
  const p0: Pt = [60, 178];
  const p1: Pt = [60, 128];
  const p2: Pt = [52, 40];
  const p3: Pt = [90, 36];
  const edge = darken(color, 0.4);

  return (
    <>
      <defs>
        <radialGradient id={id} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={mix(color, center, 0.35)} />
        </radialGradient>
      </defs>
      {!bare && (
        <g>
          <Leaf x={57} y={176} angle={-12} length={98} width={20} fill={GREEN.leafDark} />
          <Leaf x={63} y={176} angle={14} length={88} width={18} fill={GREEN.leaf} />
        </g>
      )}
      <path
        d={`M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`}
        fill="none"
        stroke={GREEN.stem}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {[0.6, 0.68, 0.76, 0.84, 0.92].map((t, i) => {
        const [x, y] = cubic(p0, p1, p2, p3, t);
        const s = round(1.05 - i * 0.1);
        return (
          <g key={t}>
            <path
              d={`M${x} ${y} Q${round(x + 2)} ${round(y + 3)} ${round(x + 5)} ${round(y + 7)}`}
              fill="none"
              stroke={GREEN.stem}
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <g transform={`translate(${round(x + 5)} ${round(y + 7)}) rotate(${6 - i * 2}) scale(${s})`}>
              <path d={VALLEY_BELL} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.5" strokeLinejoin="round" />
              <path d="M-2 4 C-3 7 -3 9 -3 11 M2 4 C3 7 3 9 3 11" fill="none" stroke={edge} strokeOpacity="0.2" strokeWidth="0.4" />
            </g>
          </g>
        );
      })}
      <ellipse cx="91" cy="33" rx="2.2" ry="3" fill={lighten(center, 0.2)} />
    </>
  );
}

/* Lantana: a flat dome of tiny florets that change colour toward the rim */

const LANTANA_FLORETS = Array.from({ length: 34 }, (_, i) => {
  const r = 4.1 * Math.sqrt(i + 0.6);
  const p = polar(60, 52, round(r), i * 137.508);
  return { x: p.x, y: p.y, i };
}).reverse();

function Lantana({ uid, color, center }: BloomProps) {
  const mid = mix(center, color, 0.55);

  return (
    <>
      <defs>
        <radialGradient id={`${uid}-lan`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#3a1f24" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <Stem
        y0={84}
        lean={3}
        width={3}
        leaves={[
          { t: 0.4, side: -1, length: 36, width: 13, tilt: 55, tone: "dark" },
          { t: 0.6, side: 1, length: 34, width: 12, tilt: 58, tone: "light" },
          { t: 0.82, side: -1, length: 26, width: 9, tilt: 60, tone: "dark" },
        ]}
      />
      <g transform="translate(60 52) scale(1 0.9) translate(-60 -52)">
        {LANTANA_FLORETS.map((f) => {
          const fill = f.i < 9 ? center : f.i < 22 ? mid : color;
          return (
            <g key={f.i} transform={`translate(${f.x} ${f.y})`} fill={fill} stroke={darken(fill, 0.3)} strokeOpacity="0.25" strokeWidth="0.3">
              <circle cx="0" cy="-2.3" r="2.5" />
              <circle cx="2.3" cy="0" r="2.5" />
              <circle cx="0" cy="2.3" r="2.5" />
              <circle cx="-2.3" cy="0" r="2.5" />
              <circle r="0.9" fill={darken(fill, 0.25)} stroke="none" />
            </g>
          );
        })}
        <circle cx="60" cy="52" r="27" fill={`url(#${uid}-lan)`} />
      </g>
    </>
  );
}

/* Moonflower & morning glory: round funnels seen from the front */

const HEART_LEAF =
  "M0 0 C-14 -2 -18 -16 -6 -26 C-3 -29 -1 -31 0 -34 C1 -31 3 -29 6 -26 C18 -16 14 -2 0 0Z";

function HeartLeaf({ x, y, angle, s, fill }: { x: number; y: number; angle: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <path d={HEART_LEAF} fill={fill} />
      <path d={HEART_LEAF} fill="#1f3a2a" opacity="0.1" />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.6" strokeLinecap="round">
        <path d="M0 -1 L0 -29" />
        <path d="M0 -8 C-6 -10 -10 -14 -11 -18" />
        <path d="M0 -8 C6 -10 10 -14 11 -18" />
      </g>
    </g>
  );
}

function Funnel({
  uid,
  color,
  center,
  band,
  star,
  r,
  pointed,
}: BloomProps & { band: string; star: string; r: number; pointed: boolean }) {
  const id = `${uid}-funnel`;
  const ang = (k: number) => -90 + 72 * k;
  const edge = darken(color, 0.35);
  const starPath =
    Array.from({ length: 10 }, (_, k) => {
      const p = polar(0, 0, k % 2 ? r * 0.2 : r * 0.62, -90 + 36 * k);
      return `${k ? "L" : "M"}${p.x} ${p.y}`;
    }).join(" ") + "Z";

  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor={center} />
          <stop offset="0.3" stopColor={lighten(color, 0.45)} />
          <stop offset="1" stopColor={mix(color, "#8a8fa8", 0.12)} />
        </radialGradient>
      </defs>
      <Stem y0={86} lean={3} width={2.2} />
      <HeartLeaf x={59} y={112} angle={-62} s={0.9} fill={GREEN.leafDark} />
      <HeartLeaf x={61} y={138} angle={60} s={0.85} fill={GREEN.leaf} />
      <path d="M61 104 C70 98 74 90 68 86 C64 84 62 88 66 90" fill="none" stroke={GREEN.stem} strokeWidth="1" strokeLinecap="round" />
      <g transform="translate(60 54) scale(1 0.92)">
        {pointed &&
          Array.from({ length: 5 }, (_, k) => {
            const t = polar(0, 0, r * 1.12, ang(k));
            const b1 = polar(0, 0, r * 0.98, ang(k) - 16);
            const b2 = polar(0, 0, r * 0.98, ang(k) + 16);
            return (
              <path
                key={k}
                d={`M${b1.x} ${b1.y} L${t.x} ${t.y} L${b2.x} ${b2.y}Z`}
                fill={color}
                stroke={edge}
                strokeOpacity="0.3"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            );
          })}
        <circle r={r} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.7" />
        {Array.from({ length: 5 }, (_, k) => {
          const p1 = polar(0, 0, r * 0.98, ang(k) - 9);
          const p2 = polar(0, 0, r * 0.98, ang(k) + 9);
          return <path key={k} d={`M0 0 L${p1.x} ${p1.y} L${p2.x} ${p2.y}Z`} fill={band} opacity="0.5" />;
        })}
        <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.6" strokeLinecap="round">
          {Array.from({ length: 5 }, (_, k) => {
            const p = polar(0, 0, r * 0.96, ang(k) + 36);
            return <path key={k} d={`M0 0 L${p.x} ${p.y}`} />;
          })}
        </g>
        <path d={starPath} fill={star} opacity="0.85" />
        <circle r={round(r * 0.16)} fill={center} stroke={edge} strokeOpacity="0.25" strokeWidth="0.5" />
      </g>
    </>
  );
}

/* Nasturtium: a round, shield-like leaf and a spurred flower */

const NASTURTIUM_PETAL =
  "M0 0 C-10 -6 -16 -18 -10 -26 C-6 -30 -2 -28 0 -26 C2 -28 6 -30 10 -26 C16 -18 10 -6 0 0Z";

function NasturtiumLeaf({ x, y, r, fill, stalk }: { x: number; y: number; r: number; fill: string; stalk: string }) {
  return (
    <g>
      <path d={stalk} fill="none" stroke={GREEN.stem} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx={x} cy={y} r={r} fill={fill} />
      <circle cx={x} cy={y} r={r} fill="#1f3a2a" opacity="0.08" />
      <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.6" strokeLinecap="round">
        {Array.from({ length: 9 }, (_, i) => {
          const p = polar(x, y, r * 0.92, i * 40);
          return <path key={i} d={`M${x} ${y} L${p.x} ${p.y}`} />;
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={darken(fill, 0.3)} strokeOpacity="0.3" strokeWidth="0.6" />
    </g>
  );
}

function Nasturtium({ uid, color, center }: BloomProps) {
  const id = `${uid}-nas`;
  const edge = darken(color, 0.4);

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={mix(color, center, 0.45)} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.2)} />
        </linearGradient>
      </defs>
      <Stem y0={84} lean={3} width={2.4} />
      <NasturtiumLeaf x={30} y={112} r={18} fill={GREEN.leafDark} stalk="M30 112 C40 124 52 130 60 134" />
      <NasturtiumLeaf x={90} y={140} r={14} fill={GREEN.leaf} stalk="M90 140 C80 146 70 150 61 152" />
      <path
        d="M60 54 C74 50 88 56 94 72 C92 75 88 73 85 69 C79 60 70 59 60 58Z"
        fill={darken(color, 0.15)}
        stroke={edge}
        strokeOpacity="0.3"
        strokeWidth="0.6"
      />
      <g transform="translate(60 54) scale(1 0.94)">
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 72 + 12})`}>
            <path d={NASTURTIUM_PETAL} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.6" strokeLinejoin="round" />
            <g fill="none" stroke={center} strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round">
              <path d="M0 -3 L0 -14" />
              <path d="M-2 -3 L-5 -12" />
              <path d="M2 -3 L5 -12" />
            </g>
          </g>
        ))}
        <circle r="4" fill={mix(center, "#f6d46a", 0.4)} />
        <circle r="1.6" fill="#8a9a2a" />
      </g>
    </>
  );
}

/* Impatiens: flat, rounded petals and a long curved spur */

const IMP_PETAL = "M0 0 C-14 -4 -18 -20 -8 -25 C-3 -27 3 -27 8 -25 C18 -20 14 -4 0 0Z";

function ImpatiensFlower({
  id,
  x,
  y,
  s,
  rot,
  color,
  center,
}: {
  id: string;
  x: number;
  y: number;
  s: number;
  rot: number;
  color: string;
  center: string;
}) {
  const edge = darken(color, 0.4);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M0 4 C4 16 14 24 24 24 C24 28 14 28 6 22 C0 17 -2 10 0 4Z"
        fill={darken(color, 0.12)}
        stroke={edge}
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 72})`}>
          <path d={IMP_PETAL} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.28" strokeWidth="0.6" strokeLinejoin="round" />
          <path d="M0 -4 L0 -19" stroke={edge} strokeOpacity="0.16" strokeWidth="0.5" strokeLinecap="round" />
        </g>
      ))}
      <circle r="5" fill={center} opacity="0.9" />
      <circle r="2" fill="#f6d46a" />
    </g>
  );
}

function Impatiens({ uid, color, center }: BloomProps) {
  const id = `${uid}-imp`;

  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="100%" r="110%">
          <stop offset="0" stopColor={lighten(color, 0.6)} />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={darken(color, 0.12)} />
        </radialGradient>
      </defs>
      <Stem
        y0={88}
        lean={4}
        width={2.8}
        leaves={[
          { t: 0.45, side: -1, length: 34, width: 10, tilt: 54, tone: "dark" },
          { t: 0.62, side: 1, length: 32, width: 9, tilt: 56, tone: "light" },
          { t: 0.8, side: -1, length: 26, width: 8, tilt: 60, tone: "dark" },
        ]}
      />
      <path d="M60 90 Q74 90 84 76" fill="none" stroke={GREEN.stem} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 90 Q50 80 46 60" fill="none" stroke={GREEN.stem} strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="93" cy="38" rx="3.4" ry="5" fill={darken(color, 0.1)} />
      <ImpatiensFlower id={id} x={84} y={76} s={0.62} rot={14} color={color} center={center} />
      <ImpatiensFlower id={id} x={52} y={50} s={0.98} rot={-8} color={color} center={center} />
    </>
  );
}

/* Loosestrife: slim spikes of small five-petal flowers */

function Loosestrife({ color, center }: Omit<BloomProps, "uid">) {
  const spike = (x: number, y: number, rot: number, count: number, step: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 L0 ${-(count * step + 8)}`} stroke={GREEN.leafDark} strokeWidth="1.3" strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        return (
          <FivePetalFlower
            key={i}
            x={round((i % 2 ? 6 : -6) * (1 - t * 0.4))}
            y={round(-6 - i * step)}
            r={round(6.4 * (1 - t * 0.35))}
            color={color}
            center={center}
            rotate={(i * 37) % 72}
          />
        );
      })}
      <ellipse cx="0" cy={-(count * step + 8)} rx="1.8" ry="3.4" fill={darken(color, 0.1)} />
    </g>
  );

  return (
    <>
      <Stem
        y0={102}
        lean={2}
        width={2.8}
        leaves={[
          { t: 0.35, side: -1, length: 40, width: 5, tilt: 40, tone: "dark" },
          { t: 0.5, side: 1, length: 40, width: 5, tilt: 42, tone: "light" },
          { t: 0.68, side: -1, length: 34, width: 4.5, tilt: 46, tone: "pale" },
          { t: 0.84, side: 1, length: 30, width: 4, tilt: 48, tone: "dark" },
        ]}
      />
      {spike(60, 128, -18, 5, 7.4, "l")}
      {spike(60, 134, 20, 5, 7, "r")}
      {spike(60, 102, 0, 12, 7.2, "m")}
    </>
  );
}

/* Hibiscus: five wide petals, a dark eye and a long stamen column */

const HIBISCUS_PETAL =
  "M0 0 C-22 -6 -30 -24 -18 -34 C-10 -40 -2 -34 0 -30 C2 -34 10 -40 18 -34 C30 -24 22 -6 0 0Z";

function Hibiscus({ uid, color, center }: BloomProps) {
  const id = `${uid}-hib`;
  const edge = darken(color, 0.4);
  const tip = { x: 90, y: 26 };

  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="100%" r="105%">
          <stop offset="0" stopColor={center} />
          <stop offset="0.3" stopColor={mix(color, center, 0.4)} />
          <stop offset="0.6" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.18)} />
        </radialGradient>
      </defs>
      <Stem
        y0={82}
        lean={4}
        width={3.2}
        leaves={[
          { t: 0.42, side: -1, length: 38, width: 13, tilt: 52, tone: "dark" },
          { t: 0.62, side: 1, length: 36, width: 12, tilt: 56, tone: "light" },
          { t: 0.82, side: -1, length: 28, width: 9, tilt: 60, tone: "dark" },
        ]}
      />
      <Calyx cy={78} />
      <g transform="translate(60 54) scale(1 0.9)">
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 72 + 6})`}>
            <path d={HIBISCUS_PETAL} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.28" strokeWidth="0.7" strokeLinejoin="round" />
            <g fill="none" stroke={edge} strokeOpacity="0.2" strokeWidth="0.6" strokeLinecap="round">
              <path d="M0 -4 L0 -28" />
              <path d="M-2 -4 C-8 -12 -12 -20 -13 -28" />
              <path d="M2 -4 C8 -12 12 -20 13 -28" />
            </g>
          </g>
        ))}
        <circle r="5" fill={center} opacity="0.85" />
      </g>
      <path
        d={`M60 54 Q74 44 ${tip.x} ${tip.y}`}
        fill="none"
        stroke="#f4b9a6"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <g fill="#f4c94a" stroke="#c9972b" strokeOpacity="0.5" strokeWidth="0.4">
        {Array.from({ length: 8 }, (_, i) => {
          const t = 0.45 + i * 0.07;
          const px = round(60 + (tip.x - 60) * t + (i % 2 ? 2.4 : -2.4));
          const py = round(54 + (tip.y - 54) * t + (i % 2 ? -2 : 2));
          return <circle key={i} cx={px} cy={py} r="1.5" />;
        })}
      </g>
      <g fill="#c2263f">
        {Array.from({ length: 5 }, (_, i) => {
          const p = polar(tip.x, tip.y, 3, i * 72);
          return <circle key={i} cx={p.x} cy={p.y} r="1.5" />;
        })}
      </g>
    </>
  );
}

/* Lotus: layers of pointed petals, white at the base and pink at the tip */

const LOTUS_PETAL = "M0 0 C-12 -6 -17 -24 0 -42 C17 -24 12 -6 0 0Z";

function Lotus({ uid, color, center }: BloomProps) {
  const id = `${uid}-lotus`;
  const edge = darken(color, 0.4);
  const tier = (angles: number[], oy: number, s: number, key: string) =>
    angles.map((a) => (
      <path
        key={`${key}${a}`}
        d={LOTUS_PETAL}
        transform={`translate(60 ${oy}) rotate(${a}) scale(${s})`}
        fill={`url(#${id})`}
        stroke={edge}
        strokeOpacity="0.28"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    ));

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="0.35" stopColor={lighten(color, 0.55)} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <Stem
        y0={76}
        lean={3}
        width={3.4}
        leaves={[
          { t: 0.55, side: -1, length: 52, width: 24, tilt: 42, tone: "dark" },
          { t: 0.74, side: 1, length: 46, width: 22, tilt: 46, tone: "light" },
        ]}
      />
      {tier([-64, -32, 0, 32, 64], 72, 0.96, "b")}
      {tier([-48, -16, 16, 48], 74, 0.9, "m")}
      <ellipse cx="60" cy="62" rx="8" ry="4" fill={center} stroke="#c9972b" strokeOpacity="0.5" strokeWidth="0.5" />
      <Dots cx={60} cy={60} count={7} radius={5} r={1.1} fill="#e0a92e" opacity={0.9} />
      {tier([-24, 0, 24], 78, 0.84, "f")}
    </>
  );
}

/* Daffodil: six pointed petals behind a ruffled trumpet */

const DAFFODIL_RIM =
  Array.from({ length: 24 }, (_, k) => {
    const p = polar(0, 0, 12.5 + (k % 2 ? 1.8 : -0.6), k * 15);
    return `${k ? "L" : "M"}${p.x} ${p.y}`;
  }).join(" ") + "Z";

function Daffodil({ uid, color, center }: BloomProps) {
  const id = `${uid}-daff`;
  const edge = darken(color, 0.4);

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={mix(color, center, 0.4)} />
          <stop offset="0.4" stopColor={color} />
          <stop offset="1" stopColor={lighten(color, 0.25)} />
        </linearGradient>
        <radialGradient id={`${id}-cup`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor={darken(center, 0.2)} />
          <stop offset="0.55" stopColor={center} />
          <stop offset="1" stopColor={lighten(center, 0.2)} />
        </radialGradient>
      </defs>
      <Stem
        y0={86}
        lean={2}
        width={3.2}
        leaves={[
          { t: 0.5, side: -1, length: 84, width: 6, tilt: 9, tone: "pale" },
          { t: 0.7, side: 1, length: 76, width: 6, tilt: 12, tone: "light" },
        ]}
      />
      <ellipse cx="60" cy="82" rx="4.6" ry="7" fill="#c9b27a" stroke="#9c8650" strokeOpacity="0.4" strokeWidth="0.5" />
      <g transform="translate(60 54) scale(1 0.94)">
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 60 + 30}) scale(${i % 2 ? 0.94 : 1})`}>
            <path
              d="M0 0 C-9 -6 -12 -20 0 -34 C12 -20 9 -6 0 0Z"
              fill={`url(#${id})`}
              stroke={edge}
              strokeOpacity="0.28"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <path d="M0 -4 L0 -28" stroke={edge} strokeOpacity="0.16" strokeWidth="0.5" strokeLinecap="round" />
          </g>
        ))}
        <path d={DAFFODIL_RIM} fill={`url(#${id}-cup)`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.6" strokeLinejoin="round" />
        <circle r="8" fill={darken(center, 0.3)} opacity="0.55" />
        <Dots cx={0} cy={0} count={6} radius={4} r={1.1} fill="#f6d46a" opacity={0.9} />
      </g>
    </>
  );
}

/* Rosemary: a woody sprig of needle leaves and tiny blue flowers */

function Rosemary({ color, center }: Omit<BloomProps, "uid">) {
  const nodes = 22;
  const needle = "#6f8f6a";

  return (
    <>
      <path
        d="M60 178 C58 130 63 80 60 22"
        fill="none"
        stroke="#7a8a62"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {Array.from({ length: nodes }, (_, i) => {
        const t = i / (nodes - 1);
        const y = round(168 - i * 7);
        const x = round(60 + 2 * Math.sin(t * 3));
        const len = round(17 * (1 - t * 0.4));
        return ([-1, 1] as const).map((side) => (
          <g key={`${i}${side}`} transform={`translate(${x} ${y}) rotate(${side * 52})`}>
            <ellipse cx="0" cy={round(-len / 2)} rx="1.5" ry={round(len / 2)} fill={i % 2 ? needle : "#80a07a"} />
            <path d={`M0 -1 L0 ${-len + 2}`} stroke="#ffffff" strokeOpacity="0.25" strokeWidth="0.4" />
          </g>
        ));
      })}
      {[12, 14, 15, 17, 18, 19, 20].map((i, k) => {
        const t = i / (nodes - 1);
        const y = round(168 - i * 7);
        const side = k % 2 ? 1 : -1;
        const x = round(60 + 2 * Math.sin(t * 3) + side * 5);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${side * 40})`}>
            <ellipse cx="0" cy="-1" rx="3.3" ry="2" fill={color} stroke={darken(color, 0.35)} strokeOpacity="0.3" strokeWidth="0.3" />
            <ellipse cx="0" cy="1.6" rx="2.2" ry="1.4" fill={lighten(color, 0.3)} />
            <circle cx="0" cy="-1.6" r="0.7" fill={center} />
          </g>
        );
      })}
    </>
  );
}

/* Orchid: wide round petals, a small lip and an arching spray */

function OrchidBloom({
  id,
  x,
  y,
  s,
  rot,
  color,
  center,
}: {
  id: string;
  x: number;
  y: number;
  s: number;
  rot: number;
  color: string;
  center: string;
}) {
  const edge = darken(color, 0.3);
  const common = { fill: `url(#${id})`, stroke: edge, strokeOpacity: 0.3, strokeWidth: 0.6 };

  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="-9" cy="14" rx="8.5" ry="14" transform="rotate(24 -9 14)" {...common} />
      <ellipse cx="9" cy="14" rx="8.5" ry="14" transform="rotate(-24 9 14)" {...common} />
      <ellipse cx="0" cy="-18" rx="9" ry="14.5" {...common} />
      <ellipse cx="-16" cy="-2" rx="18" ry="13.5" transform="rotate(-12 -16 -2)" {...common} />
      <ellipse cx="16" cy="-2" rx="18" ry="13.5" transform="rotate(12 16 -2)" {...common} />
      <g fill="none" stroke={center} strokeOpacity="0.3" strokeWidth="0.5" strokeLinecap="round">
        <path d="M-6 -2 C-14 -4 -22 -4 -30 -2" />
        <path d="M6 -2 C14 -4 22 -4 30 -2" />
        <path d="M0 -8 L0 -28" />
      </g>
      <path d="M0 -3 C-8 -1 -10 9 -5 14 C-2 18 2 18 5 14 C10 9 8 -1 0 -3Z" fill={center} stroke={darken(center, 0.3)} strokeOpacity="0.3" strokeWidth="0.5" />
      <ellipse cx="0" cy="5" rx="3" ry="4.5" fill="#f2c84b" />
      <ellipse cx="0" cy="-6" rx="3.4" ry="4.2" fill="#ffffff" stroke={edge} strokeOpacity="0.25" strokeWidth="0.4" />
      <circle cx="0" cy="-6.5" r="1" fill="#f2c84b" />
    </g>
  );
}

function Orchid({ uid, color, center }: BloomProps) {
  const id = `${uid}-orch`;

  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="60%" r="70%">
          <stop offset="0" stopColor={mix(color, center, 0.22)} />
          <stop offset="0.45" stopColor={lighten(color, 0.3)} />
          <stop offset="1" stopColor={color} />
        </radialGradient>
      </defs>
      <Stem
        y0={92}
        lean={3}
        width={2.6}
        leaves={[
          { t: 0.55, side: -1, length: 48, width: 14, tilt: 62, tone: "dark" },
          { t: 0.78, side: 1, length: 44, width: 13, tilt: 64, tone: "light" },
        ]}
      />
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.8" strokeLinecap="round">
        <path d="M60 94 C60 76 78 70 90 62" />
        <path d="M70 90 Q82 96 91 88" />
      </g>
      <circle cx="94" cy="58" r="3.4" fill={lighten(color, 0.1)} stroke={darken(color, 0.3)} strokeOpacity="0.3" strokeWidth="0.5" />
      <circle cx="100" cy="68" r="2.6" fill={lighten(color, 0.1)} stroke={darken(color, 0.3)} strokeOpacity="0.3" strokeWidth="0.5" />
      <OrchidBloom id={id} x={92} y={88} s={0.6} rot={14} color={color} center={center} />
      <OrchidBloom id={id} x={54} y={50} s={1} rot={-6} color={color} center={center} />
    </>
  );
}

/* Snowdrop: nodding, teardrop-shaped petals with a green mark */

function SnowdropFlower({
  x,
  y,
  rot,
  s,
  color,
  green,
}: {
  x: number;
  y: number;
  rot: number;
  s: number;
  color: string;
  green: string;
}) {
  const edge = darken(color, 0.4);
  const petal = "M0 0 C-7 6 -9 22 0 34 C9 22 7 6 0 0Z";
  const props = { fill: color, stroke: edge, strokeOpacity: 0.3, strokeWidth: 0.6, strokeLinejoin: "round" as const };

  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="0" cy="-3" rx="3.6" ry="4.2" fill={green} />
      <path d={petal} transform="rotate(-26)" {...props} />
      <path d={petal} transform="rotate(26)" {...props} />
      <path d={petal} {...props} />
      <path d="M0 4 L0 26" stroke={edge} strokeOpacity="0.16" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M-5 13 C-5 23 5 23 5 13 C2 15 -2 15 -5 13Z" fill="#ffffff" stroke={edge} strokeOpacity="0.3" strokeWidth="0.5" />
      <path d="M-3.2 19 Q0 24 3.2 19 Q0 21 -3.2 19Z" fill={green} />
    </g>
  );
}

function Snowdrop({ color, center }: Omit<BloomProps, "uid">) {
  return (
    <>
      <Stem
        y0={72}
        lean={2}
        width={2.2}
        leaves={[
          { t: 0.55, side: -1, length: 74, width: 6, tilt: 12, tone: "pale" },
          { t: 0.7, side: 1, length: 66, width: 6, tilt: 14, tone: "light" },
        ]}
      />
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.8" strokeLinecap="round">
        <path d="M60 74 C60 58 70 48 82 44" />
        <path d="M60 80 Q48 74 40 80" />
      </g>
      <SnowdropFlower x={40} y={80} rot={-8} s={0.78} color={color} green={center} />
      <SnowdropFlower x={82} y={44} rot={8} s={1.05} color={color} green={center} />
    </>
  );
}

/* Bluebell: a one-sided, nodding raceme of narrow bells with curled tips */

const BLUEBELL_SHAPE =
  "M0 0 C-4 2 -6 10 -6 18 C-7 22 -10 24 -12 23 C-9 22 -8 20 -4 21 L4 21 C8 20 9 22 12 23 C10 24 7 22 6 18 C6 10 4 2 0 0Z";

function Bluebell({ uid, color, center }: BloomProps) {
  const id = `${uid}-blue`;
  const p0: Pt = [60, 178];
  const p1: Pt = [60, 110];
  const p2: Pt = [52, 36];
  const p3: Pt = [92, 36];
  const edge = darken(color, 0.4);

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darken(color, 0.1)} />
          <stop offset="1" stopColor={lighten(color, 0.25)} />
        </linearGradient>
      </defs>
      <Stem
        y0={120}
        lean={2}
        width={2.2}
        leaves={[
          { t: 0.4, side: -1, length: 70, width: 7, tilt: 14, tone: "dark" },
          { t: 0.62, side: 1, length: 62, width: 7, tilt: 18, tone: "light" },
        ]}
      />
      <path
        d={`M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`}
        fill="none"
        stroke={GREEN.stem}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[0.52, 0.6, 0.68, 0.76, 0.84, 0.92].map((t, i) => {
        const [x, y] = cubic(p0, p1, p2, p3, t);
        const s = round(1.0 - i * 0.07);
        return (
          <g key={t}>
            <path
              d={`M${x} ${y} Q${round(x + 3)} ${round(y + 2)} ${round(x + 5)} ${round(y + 5)}`}
              fill="none"
              stroke={GREEN.stem}
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <g transform={`translate(${round(x + 5)} ${round(y + 5)}) rotate(${-6 + i * 2}) scale(${s})`}>
              <path d={BLUEBELL_SHAPE} fill={`url(#${id})`} stroke={edge} strokeOpacity="0.3" strokeWidth="0.5" strokeLinejoin="round" />
              <path d="M-2 3 C-3 9 -3 14 -3 19 M2 3 C3 9 3 14 3 19" fill="none" stroke={edge} strokeOpacity="0.2" strokeWidth="0.4" />
            </g>
          </g>
        );
      })}
      <ellipse cx="93" cy="33" rx="2" ry="3.2" fill={lighten(center, 0.1)} stroke={edge} strokeOpacity="0.3" strokeWidth="0.4" />
    </>
  );
}

/* Carnation: rings of frilly, toothed petals in a green calyx */

const CARNATION_PETAL =
  "M0 0 C-7 -3 -11 -9 -10 -15 L-7.5 -13.5 L-6.5 -17.5 L-4 -14.5 L-2.5 -18.5 L0 -15 L2.5 -18.5 L4 -14.5 L6.5 -17.5 L7.5 -13.5 L10 -15 C11 -9 7 -3 0 0Z";

const CARNATION_RINGS = [
  { n: 11, len: 28, off: 0 },
  { n: 10, len: 23, off: 14 },
  { n: 9, len: 18, off: 5 },
  { n: 7, len: 12, off: 20 },
];

function Carnation({ uid, color, center }: BloomProps) {
  return (
    <>
      <defs>
        {CARNATION_RINGS.map((_, i) => {
          const tone = mix(color, center, i * 0.18);
          return (
            <linearGradient key={i} id={`${uid}-carn-${i}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={darken(tone, 0.25)} />
              <stop offset="0.6" stopColor={tone} />
              <stop offset="1" stopColor={lighten(tone, 0.28)} />
            </linearGradient>
          );
        })}
      </defs>
      <Stem
        y0={88}
        lean={3}
        width={2.6}
        leaves={[
          { t: 0.4, side: -1, length: 46, width: 4, tilt: 40, tone: "pale" },
          { t: 0.62, side: 1, length: 44, width: 4, tilt: 44, tone: "pale" },
          { t: 0.84, side: -1, length: 36, width: 3.6, tilt: 48, tone: "pale" },
        ]}
      />
      <g fill={GREEN.leaf} stroke={GREEN.leafDark} strokeOpacity="0.5" strokeWidth="0.5">
        <ellipse cx="60" cy="118" rx="4" ry="2.6" />
        <ellipse cx="60" cy="148" rx="4" ry="2.6" />
      </g>
      <path
        d="M51 70 C51 82 54 88 60 91 C66 88 69 82 69 70Z"
        fill={GREEN.leafDark}
        stroke={GREEN.leafDark}
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      <path d="M55 74 L56 88 M60 74 L60 90 M65 74 L64 88" stroke={GREEN.leafPale} strokeOpacity="0.45" strokeWidth="0.6" fill="none" />
      <g transform="translate(60 56) scale(1 0.92)">
        {CARNATION_RINGS.map((ring, i) => {
          const sc = round(ring.len / 18.5);
          const tone = mix(color, center, i * 0.18);
          return (
            <g key={i}>
              {Array.from({ length: ring.n }, (_, k) => (
                <path
                  key={k}
                  d={CARNATION_PETAL}
                  transform={`rotate(${round(ring.off + (360 / ring.n) * k)}) scale(${sc})`}
                  fill={`url(#${uid}-carn-${i})`}
                  stroke={darken(tone, 0.35)}
                  strokeOpacity="0.3"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        })}
        <circle r="3.4" fill={darken(center, 0.2)} opacity="0.7" />
        <Dots cx={0} cy={0} count={6} radius={2.2} r={0.9} fill={lighten(color, 0.5)} opacity={0.7} />
      </g>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  FlowerShape / FlowerArt: pick the right species illustration              */
/*  FlowerShape returns raw SVG content (used inside the bouquet as well).    */
/* -------------------------------------------------------------------------- */

function FlowerShape({ flower }: { flower: Flower }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { species, color, center } = flower;

  let art: ReactNode = null;

  switch (species) {
    case "rose":
      art = <Rose uid={uid} color={color} center={center} />;
      break;
    case "gardenRose":
      art = <Rose uid={uid} color={color} center={center} full />;
      break;
    case "peony":
      art = <Peony uid={uid} color={color} center={center} />;
      break;
    case "daisy":
      art = (
        <Daisy
          uid={uid}
          color={color}
          center={center}
          tip={mix(color, "#e7a2ac", 0.55)}
          count={18}
          length={27}
          width={3.7}
          disc={8}
        />
      );
      break;
    case "oxeye":
      art = (
        <Daisy
          uid={uid}
          color={color}
          center={center}
          tip={mix(color, "#f08f3a", 0.3)}
          count={14}
          length={29}
          width={5.4}
          disc={10.5}
        />
      );
      break;
    case "sunflower":
      art = <Sunflower uid={uid} color={color} center={center} />;
      break;
    case "dahlia":
      art = <Dahlia uid={uid} color={color} center={center} />;
      break;
    case "cornflower":
      art = <Cornflower uid={uid} color={color} center={center} />;
      break;
    case "cosmos":
      art = <Cosmos uid={uid} color={color} center={center} />;
      break;
    case "ranunculus":
      art = <Ranunculus uid={uid} color={color} center={center} />;
      break;
    case "lavender":
      art = <Lavender color={color} />;
      break;
    case "tulip":
      art = <Tulip uid={uid} color={color} center={center} />;
      break;
    case "lily":
      art = <Lily uid={uid} color={color} center={center} />;
      break;
    case "hydrangea":
      art = <Hydrangea uid={uid} color={color} center={center} />;
      break;
    case "anemone":
      art = <Anemone uid={uid} color={color} center={center} />;
      break;
    case "forgetMeNot":
      art = <ForgetMeNot color={color} center={center} />;
      break;
    case "sweetPea":
      art = <SweetPea uid={uid} color={color} center={center} />;
      break;
    case "iris":
      art = <Iris uid={uid} color={color} center={center} />;
      break;
    case "poppy":
      art = <Poppy uid={uid} color={color} center={center} />;
      break;
    case "bellflower":
      art = <Bellflower uid={uid} color={color} center={center} />;
      break;
    case "chinaRose":
      art = <ChinaRose uid={uid} color={color} center={center} />;
      break;
    case "salvia":
      art = <Salvia color={color} center={center} />;
      break;
    case "primrose":
      art = <Primrose uid={uid} color={color} center={center} />;
      break;
    case "hyacinth":
      art = <Hyacinth color={color} center={center} />;
      break;
    case "valley":
      art = <LilyOfTheValley uid={uid} color={color} center={center} />;
      break;
    case "lantana":
      art = <Lantana uid={uid} color={color} center={center} />;
      break;
    case "moonflower":
      art = (
        <Funnel
          uid={uid}
          color={color}
          center={center}
          band="#bcd6a8"
          star="#e6f0d6"
          r={31}
          pointed
        />
      );
      break;
    case "morningglory":
      art = (
        <Funnel
          uid={uid}
          color={color}
          center={center}
          band="#3a4fb8"
          star="#ffffff"
          r={27}
          pointed={false}
        />
      );
      break;
    case "nasturtium":
      art = <Nasturtium uid={uid} color={color} center={center} />;
      break;
    case "impatiens":
      art = <Impatiens uid={uid} color={color} center={center} />;
      break;
    case "loosestrife":
      art = <Loosestrife color={color} center={center} />;
      break;
    case "hibiscus":
      art = <Hibiscus uid={uid} color={color} center={center} />;
      break;
    case "lotus":
      art = <Lotus uid={uid} color={color} center={center} />;
      break;
    case "daffodil":
      art = <Daffodil uid={uid} color={color} center={center} />;
      break;
    case "rosemary":
      art = <Rosemary color={color} center={center} />;
      break;
    case "orchid":
      art = <Orchid uid={uid} color={color} center={center} />;
      break;
    case "snowdrop":
      art = <Snowdrop color={color} center={center} />;
      break;
    case "bluebell":
      art = <Bluebell uid={uid} color={color} center={center} />;
      break;
    case "carnation":
      art = <Carnation uid={uid} color={color} center={center} />;
      break;
  }

  return <>{art}</>;
}

function FlowerArt({ flower, thumb = false }: { flower: Flower; thumb?: boolean }) {
  return (
    <svg
      viewBox={thumb ? "6 2 108 108" : "0 0 120 180"}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerShape flower={flower} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bouquet: deterministic layout                                             */
/*                                                                            */
/*  The bouquet is one 640 x 800 SVG. All stems point at the tie (the ribbon  */
/*  knot). Each flower is rotated around its stem base so that its stem lies  */
/*  on the line from the tie to its slot, which gathers every stem into a     */
/*  narrow bundle. Slots are hand-placed on a dome and chosen by flower count.*/
/* -------------------------------------------------------------------------- */

type Slot = { dx: number; dy: number; s: number };

const TIE = { x: 320, y: 505 };

// distance between a flower head and its stem base at scale 1
const STEM_REACH = 124;

const SLOTS: Slot[] = [
  { dx: 0, dy: -250, s: 1.5 }, // 0  crown centre
  { dx: -92, dy: -258, s: 1.3 }, // 1  upper left
  { dx: 95, dy: -255, s: 1.3 }, // 2  upper right
  { dx: -62, dy: -165, s: 1.4 }, // 3  middle left
  { dx: 66, dy: -168, s: 1.4 }, // 4  middle right
  { dx: -170, dy: -215, s: 1.2 }, // 5  left shoulder
  { dx: 172, dy: -218, s: 1.2 }, // 6  right shoulder
  { dx: -150, dy: -140, s: 1.15 }, // 7  low left
  { dx: 152, dy: -142, s: 1.15 }, // 8  low right
  { dx: 0, dy: -128, s: 1.2 }, // 9  front centre
  { dx: -215, dy: -165, s: 1.05 }, // 10 far left
  { dx: 218, dy: -168, s: 1.05 }, // 11 far right
  { dx: -40, dy: -318, s: 1.0 }, // 12 high back left
  { dx: 46, dy: -322, s: 1.0 }, // 13 high back right
  { dx: -138, dy: -308, s: 1.0 }, // 14 high far left
  { dx: 142, dy: -310, s: 1.0 }, // 15 high far right
  { dx: -78, dy: -105, s: 1.0 }, // 16 front low left
  { dx: 80, dy: -108, s: 1.0 }, // 17 front low right
  { dx: -262, dy: -205, s: 0.95 }, // 18 outer left
  { dx: 264, dy: -208, s: 0.95 }, // 19 outer right
];

// the most stems a bouquet can hold (one per slot)
const MAX_STEMS = SLOTS.length;

// which slots are used for a given number of flowers (up to 14, then slots are appended)
const SLOT_SETS: Record<number, number[]> = {
  1: [0],
  2: [3, 4],
  3: [0, 3, 4],
  4: [0, 3, 4, 9],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 9],
  7: [0, 1, 2, 3, 4, 5, 6],
  8: [0, 1, 2, 3, 4, 5, 6, 9],
  9: [0, 1, 2, 3, 4, 5, 6, 9, 12],
  10: [0, 1, 2, 3, 4, 5, 6, 9, 12, 13],
  11: [0, 1, 2, 3, 4, 5, 6, 9, 12, 13, 7],
  12: [0, 1, 2, 3, 4, 5, 6, 9, 12, 13, 7, 8],
  13: [0, 1, 2, 3, 4, 5, 6, 9, 12, 13, 7, 8, 10],
  14: [0, 1, 2, 3, 4, 5, 6, 9, 12, 13, 7, 8, 10, 11],
};

const EXTRA_SLOTS = [14, 15, 16, 17, 18, 19];

function slotSetFor(n: number) {
  if (n <= 14) return SLOT_SETS[n];
  return [...SLOT_SETS[14], ...EXTRA_SLOTS.slice(0, n - 14)];
}

// few flowers get bigger heads, many flowers get slightly smaller heads
function sizeFactor(n: number) {
  if (n <= 1) return 1.3;
  if (n === 2) return 1.18;
  if (n <= 4) return 1.1;
  if (n <= 6) return 1.04;
  if (n <= 9) return 1;
  if (n <= 12) return 0.95;
  if (n <= 14) return 0.9;
  if (n <= 17) return 0.84;
  return 0.8;
}

// small optical corrections so delicate species do not vanish next to roses
const SPECIES_SCALE: Partial<Record<Species, number>> = {
  lavender: 1.08,
  forgetMeNot: 1.12,
  cornflower: 1.04,
  gardenRose: 0.96,
  iris: 0.96,
  poppy: 0.98,
  sunflower: 0.9,
  hydrangea: 0.9,
  peony: 0.96,
  lily: 0.96,
  dahlia: 1.0,
  anemone: 1.04,
  bellflower: 1.05,
  hyacinth: 1.05,
  loosestrife: 1.05,
  salvia: 1.05,
  rosemary: 1.1,
  valley: 1.1,
  snowdrop: 1.15,
  bluebell: 1.05,
  hibiscus: 0.92,
  lotus: 0.95,
  moonflower: 0.95,
};

type Placement = {
  key: number;
  flower: Flower;
  hy: number;
  bx: number;
  by: number;
  angle: number;
  scale: number;
  flip: 1 | -1;
};

function layoutBouquet(items: BouquetItem[]): Placement[] {
  const chosen = items.slice(0, MAX_STEMS);
  const n = chosen.length;
  if (n === 0) return [];

  const slotIndexes = slotSetFor(n);
  const factor = sizeFactor(n);

  return chosen
    .map((item, i) => {
      const slotIndex = slotIndexes[i];
      const slot = SLOTS[slotIndex];
      // tiny deterministic variation so repeated flowers never look cloned
      const jitter = 1 + (((slotIndex * 5) % 7) - 3) * 0.012;
      const scale = round(slot.s * factor * jitter * (SPECIES_SCALE[item.flower.species] ?? 1));
      const dist = Math.hypot(slot.dx, slot.dy);
      const ux = slot.dx / dist;
      const uy = slot.dy / dist;
      const hx = TIE.x + slot.dx;
      const hy = TIE.y + slot.dy;
      const reach = STEM_REACH * scale;

      return {
        key: item.key,
        flower: item.flower,
        hy,
        bx: round(hx - ux * reach),
        by: round(hy - uy * reach),
        angle: round((Math.atan2(slot.dx, -slot.dy) * 180) / Math.PI),
        scale,
        flip: (slotIndex % 2 === 1 ? -1 : 1) as 1 | -1,
      };
    })
    .sort((a, b) => a.hy - b.hy); // higher heads are drawn first, lower ones sit in front
}

const FILLER_LEAVES: { angle: number; length: number; width: number; tone: LeafSpec["tone"] }[] = [
  { angle: -64, length: 190, width: 26, tone: "dark" },
  { angle: -46, length: 238, width: 30, tone: "light" },
  { angle: -26, length: 262, width: 28, tone: "pale" },
  { angle: 22, length: 258, width: 28, tone: "dark" },
  { angle: 42, length: 236, width: 30, tone: "pale" },
  { angle: 62, length: 192, width: 26, tone: "light" },
];

/* -------------------------------------------------------------------------- */
/*  Filler plants: sprigs radiating from the tie, drawn behind the flowers    */
/*  Each sprig is drawn upwards in its own frame, then rotated into place.    */
/* -------------------------------------------------------------------------- */

type SprigSpec = { angle: number; length: number; c: number };

// point and tangent angle on the gentle curve  M0 0 Q c,-L/2  0,-L
function sprigPoint(t: number, c: number, length: number) {
  return {
    x: round(2 * c * t * (1 - t)),
    y: round(-length * t),
    tilt: round((Math.atan2(2 * c * (1 - 2 * t), length) * 180) / Math.PI),
  };
}

function sprigStem(length: number, c: number) {
  return `M0 0 Q${c} ${round(-length / 2)} 0 ${-length}`;
}

const FILLER_SPRIGS: Record<FillerId, SprigSpec[]> = {
  eucalyptus: [
    { angle: -62, length: 290, c: 16 },
    { angle: -40, length: 340, c: -14 },
    { angle: -16, length: 365, c: 14 },
    { angle: 10, length: 372, c: -16 },
    { angle: 34, length: 345, c: 14 },
    { angle: 58, length: 298, c: -14 },
  ],
  babysBreath: [
    { angle: -72, length: 270, c: -12 },
    { angle: -50, length: 320, c: 12 },
    { angle: -27, length: 350, c: -12 },
    { angle: -4, length: 362, c: 12 },
    { angle: 20, length: 355, c: -12 },
    { angle: 46, length: 330, c: 12 },
    { angle: 68, length: 275, c: -12 },
  ],
  fern: [
    { angle: -76, length: 250, c: 14 },
    { angle: -52, length: 300, c: -12 },
    { angle: -24, length: 300, c: 12 },
    { angle: 24, length: 300, c: -12 },
    { angle: 52, length: 300, c: 12 },
    { angle: 76, length: 250, c: -14 },
  ],
  wheat: [
    { angle: -48, length: 330, c: 8 },
    { angle: -22, length: 382, c: -8 },
    { angle: 6, length: 392, c: 8 },
    { angle: 30, length: 372, c: -8 },
    { angle: 54, length: 326, c: 8 },
  ],
  olive: [
    { angle: -68, length: 260, c: -14 },
    { angle: -44, length: 330, c: 14 },
    { angle: -8, length: 340, c: -14 },
    { angle: 18, length: 345, c: 14 },
    { angle: 40, length: 335, c: -14 },
    { angle: 66, length: 265, c: 14 },
  ],
  // the sign of c decides the colour: positive = light blue, negative = light purple
  butterflies: [
    { angle: -70, length: 310, c: 14 },
    { angle: -48, length: 372, c: -14 },
    { angle: -25, length: 410, c: 14 },
    { angle: -3, length: 425, c: -14 },
    { angle: 20, length: 412, c: 14 },
    { angle: 43, length: 368, c: -14 },
    { angle: 66, length: 312, c: 14 },
  ],
};

function EucalyptusSprig({ length, c }: { length: number; c: number }) {
  const count = Math.max(5, Math.round(length / 46));
  const tones = ["#8fae9a", "#a6c0ac", "#7d9f8b"];
  const tip = sprigPoint(1, c, length);

  return (
    <g>
      <path d={sprigStem(length, c)} fill="none" stroke="#6f8f78" strokeWidth="1.8" strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const t = round(0.2 + (i / (count - 1)) * 0.74);
        const { x, y, tilt } = sprigPoint(t, c, length);
        const s = round(1 - t * 0.42);
        return ([-1, 1] as const).map((side) => (
          <g
            key={`${i}${side}`}
            transform={`translate(${x} ${y}) rotate(${round(side * 48 + tilt)}) scale(${s})`}
          >
            <ellipse
              cx="0"
              cy="-10"
              rx="8.5"
              ry="10.5"
              fill={tones[(i + (side === 1 ? 1 : 0)) % 3]}
              stroke="#5d7d69"
              strokeOpacity="0.25"
              strokeWidth="0.5"
            />
            <path d="M0 -1 L0 -17" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.6" strokeLinecap="round" />
          </g>
        ));
      })}
      <g transform={`translate(${tip.x} ${tip.y})`}>
        <ellipse cx="0" cy="-8" rx="6" ry="9" fill={tones[0]} stroke="#5d7d69" strokeOpacity="0.25" strokeWidth="0.5" />
      </g>
    </g>
  );
}

const BREATH_CLUSTER: [number, number, number][] = [
  [0, 0, 3.2],
  [-4.2, 3, 2.5],
  [4.2, 2.4, 2.6],
  [0.6, -4.2, 2.4],
  [-3, -2.8, 2],
];

function BabysBreathSprig({ length, c }: { length: number; c: number }) {
  const branches = [0.32, 0.44, 0.56, 0.68, 0.8, 0.92];
  const tip = sprigPoint(1, c, length);

  const cluster = (key: string) => (
    <g key={key}>
      {BREATH_CLUSTER.map(([cx, cy, r], k) => (
        <circle
          key={k}
          cx={cx}
          cy={cy}
          r={r}
          fill="#fffdf3"
          stroke="#cfd2b8"
          strokeOpacity="0.7"
          strokeWidth="0.4"
        />
      ))}
      <circle cx="0" cy="0.4" r="0.7" fill="#e6d58c" />
    </g>
  );

  return (
    <g>
      <path d={sprigStem(length, c)} fill="none" stroke="#7f9a72" strokeWidth="1.3" strokeLinecap="round" />
      {branches.map((t, i) => {
        const { x, y, tilt } = sprigPoint(t, c, length);
        const side = i % 2 ? 1 : -1;
        const len = round(36 - t * 16);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${round(side * 36 + tilt)})`}>
            <path d={`M0 0 L0 ${-len}`} stroke="#7f9a72" strokeWidth="0.9" strokeLinecap="round" />
            <g transform={`translate(0 ${-len})`}>{cluster(`c${i}`)}</g>
            <g transform={`translate(${side * 3} ${round(-len * 0.55)}) rotate(${side * 40})`}>
              <path d="M0 0 L0 -12" stroke="#7f9a72" strokeWidth="0.7" strokeLinecap="round" />
              <g transform="translate(0 -12) scale(0.7)">{cluster(`d${i}`)}</g>
            </g>
          </g>
        );
      })}
      <g transform={`translate(${tip.x} ${tip.y})`}>{cluster("tip")}</g>
    </g>
  );
}

function FernSprig({ length, c }: { length: number; c: number }) {
  const pairs = Math.round(length / 15);
  const tones = ["#6f9a6c", "#7fa77a", "#5f8a62"];
  const tip = sprigPoint(1, c, length);

  return (
    <g>
      <path d={sprigStem(length, c)} fill="none" stroke="#5b8660" strokeWidth="1.6" strokeLinecap="round" />
      {Array.from({ length: pairs }, (_, i) => {
        const t = round(0.1 + (i / (pairs - 1)) * 0.86);
        const { x, y, tilt } = sprigPoint(t, c, length);
        const len = round(26 * (1 - t * 0.72) + 3);
        return ([-1, 1] as const).map((side) => (
          <g key={`${i}${side}`} transform={`translate(${x} ${y}) rotate(${round(side * 58 + tilt)})`}>
            <ellipse
              cx="0"
              cy={round(-len / 2)}
              rx={round(len * 0.17)}
              ry={round(len / 2)}
              fill={tones[(i + (side === 1 ? 1 : 0)) % 3]}
              stroke="#4f7853"
              strokeOpacity="0.25"
              strokeWidth="0.4"
            />
          </g>
        ));
      })}
      <g transform={`translate(${tip.x} ${tip.y})`}>
        <ellipse cx="0" cy="-5" rx="2.2" ry="6" fill={tones[0]} />
      </g>
    </g>
  );
}

function WheatSprig({ length, c }: { length: number; c: number }) {
  const tip = sprigPoint(1, c, length);

  return (
    <g>
      <path d={sprigStem(length, c)} fill="none" stroke="#b9a468" strokeWidth="1.7" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = round(0.7 + i * 0.032);
        const { x, y, tilt } = sprigPoint(t, c, length);
        return ([-1, 1] as const).map((side) => (
          <g key={`${i}${side}`} transform={`translate(${x} ${y}) rotate(${round(side * 24 + tilt)})`}>
            <ellipse
              cx="0"
              cy="-5"
              rx="2.7"
              ry="5.8"
              fill={i % 2 ? "#dcbd6c" : "#cfae58"}
              stroke="#a98a3c"
              strokeOpacity="0.4"
              strokeWidth="0.3"
            />
            <path d="M0 -9 L0 -23" stroke="#cdb06a" strokeOpacity="0.8" strokeWidth="0.5" strokeLinecap="round" />
          </g>
        ));
      })}
      <g transform={`translate(${tip.x} ${tip.y})`}>
        <ellipse cx="0" cy="-6" rx="2.6" ry="6" fill="#dcbd6c" stroke="#a98a3c" strokeOpacity="0.4" strokeWidth="0.3" />
        <path d="M0 -11 L0 -28" stroke="#cdb06a" strokeOpacity="0.85" strokeWidth="0.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

function OliveSprig({ length, c }: { length: number; c: number }) {
  const count = Math.round(length / 26);
  const tones = ["#94ad94", "#aebfa9"];
  const tip = sprigPoint(1, c, length);

  return (
    <g>
      <path d={sprigStem(length, c)} fill="none" stroke="#7d8a62" strokeWidth="1.6" strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const t = round(0.16 + (i / (count - 1)) * 0.8);
        const { x, y, tilt } = sprigPoint(t, c, length);
        const side = i % 2 ? 1 : -1;
        return (
          <g key={i}>
            <g transform={`translate(${x} ${y}) rotate(${round(side * 58 + tilt)})`}>
              <ellipse
                cx="0"
                cy="-9"
                rx="3.2"
                ry="10"
                fill={tones[i % 2]}
                stroke="#6f8a70"
                strokeOpacity="0.3"
                strokeWidth="0.4"
              />
              <path d="M0 -1 L0 -16" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="0.5" strokeLinecap="round" />
            </g>
            {i % 4 === 1 && (
              <g transform={`translate(${x} ${y}) rotate(${round(-side * 28 + tilt)})`}>
                <path d="M0 0 L0 -8" stroke="#7d8a62" strokeWidth="0.8" strokeLinecap="round" />
                <circle cx="0" cy="-11" r="3.4" fill="#66683f" />
                <circle cx="-1" cy="-12" r="1" fill="#ffffff" opacity="0.3" />
              </g>
            )}
          </g>
        );
      })}
      <g transform={`translate(${tip.x} ${tip.y})`}>
        <ellipse cx="0" cy="-8" rx="3" ry="9" fill={tones[0]} stroke="#6f8a70" strokeOpacity="0.3" strokeWidth="0.4" />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*  Butterflies: the two colours are chosen by the person (colour wheel).     */
/* -------------------------------------------------------------------------- */

type ButterflyPalette = { wing: string; wingDeep: string; spot: string; edge: string };
type ButterflyPair = [ButterflyPalette, ButterflyPalette];

function paletteFromColor(color: string): ButterflyPalette {
  return {
    wing: lighten(color, 0.25),
    wingDeep: color,
    spot: lighten(color, 0.8),
    edge: darken(color, 0.35),
  };
}

function butterflyPair(colors: ButterflyColors): ButterflyPair {
  return [paletteFromColor(colors.c1), paletteFromColor(colors.c2)];
}

const ButterflyContext = createContext<ButterflyPair>(butterflyPair(DEFAULT_BUTTERFLY_COLORS));

function Butterfly({
  x,
  y,
  scale,
  rotate,
  tone,
}: {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  tone: 0 | 1;
}) {
  const c = useContext(ButterflyContext)[tone];

  // the right-hand wings; the left-hand ones are the same shapes mirrored
  const wings = (
    <g strokeLinejoin="round">
      <path
        d="M1 -2 C5 -16 24 -32 37 -24 C46 -17 34 -2 1 2Z"
        fill={c.wing}
        stroke={c.edge}
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <path
        d="M1 1 C14 1 32 6 28 20 C24 31 8 26 1 9Z"
        fill={c.wingDeep}
        stroke={c.edge}
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <path d="M4 -4 C9 -14 22 -24 31 -20 C36 -15 28 -6 4 -1Z" fill={c.spot} opacity="0.5" />
      <circle cx="26" cy="-17" r="3" fill="#ffffff" opacity="0.55" />
      <circle cx="18" cy="14" r="2.4" fill={c.spot} opacity="0.75" />
      <path
        d="M5 -3 C14 -10 22 -16 30 -20"
        fill="none"
        stroke={c.edge}
        strokeOpacity="0.25"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {wings}
      <g transform="scale(-1 1)">{wings}</g>
      <ellipse cx="0" cy="2" rx="1.8" ry="10" fill={c.edge} />
      <path
        d="M0 -8 C-1 -15 -4 -19 -8 -21 M0 -8 C1 -15 4 -19 8 -21"
        fill="none"
        stroke={c.edge}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle cx="-8" cy="-21" r="1" fill={c.edge} />
      <circle cx="8" cy="-21" r="1" fill={c.edge} />
    </g>
  );
}

function ButterflySprig({ length, c }: { length: number; c: number }) {
  const tip = sprigPoint(1, c, length);
  const mid = sprigPoint(0.58, c, length);
  const side = c > 0 ? 1 : -1;
  const main: 0 | 1 = c > 0 ? 0 : 1;
  const small: 0 | 1 = c > 0 ? 1 : 0;

  return (
    <g>
      <path
        d={sprigStem(length, c)}
        fill="none"
        stroke="#8fa98f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {length > 330 && (
        <Butterfly
          x={round(mid.x + side * 8)}
          y={mid.y}
          scale={0.5}
          rotate={round(side * 32 + mid.tilt)}
          tone={small}
        />
      )}
      <Butterfly x={tip.x} y={tip.y} scale={0.95} rotate={round(side * 10 + tip.tilt)} tone={main} />
    </g>
  );
}

function FillerSprig({ kind, spec }: { kind: FillerId; spec: SprigSpec }) {
  let art: ReactNode = null;

  switch (kind) {
    case "eucalyptus":
      art = <EucalyptusSprig length={spec.length} c={spec.c} />;
      break;
    case "babysBreath":
      art = <BabysBreathSprig length={spec.length} c={spec.c} />;
      break;
    case "fern":
      art = <FernSprig length={spec.length} c={spec.c} />;
      break;
    case "wheat":
      art = <WheatSprig length={spec.length} c={spec.c} />;
      break;
    case "olive":
      art = <OliveSprig length={spec.length} c={spec.c} />;
      break;
    case "butterflies":
      art = <ButterflySprig length={spec.length} c={spec.c} />;
      break;
  }

  return <g transform={`translate(${TIE.x} ${TIE.y - 8}) rotate(${spec.angle})`}>{art}</g>;
}

/* -------------------------------------------------------------------------- */
/*  Wrapping paper shapes                                                     */
/*                                                                            */
/*  tissue  : ruffled tissue paper, the back-most layer                       */
/*  back    : the inside of the wrap (lining colour, dotted)                  */
/*  front   : the outer sheet, a cone that ends in a narrow point             */
/*  cuff    : the turned-over rim of the front sheet, showing the lining      */
/* -------------------------------------------------------------------------- */

const TISSUE_PATH =
  "M320 598 C226 562 94 432 46 302 Q76 262 122 298 Q170 252 232 294 Q276 260 320 288 Q364 260 408 294 Q470 252 518 298 Q564 262 594 302 C546 432 414 562 320 598Z";

const BACK_PAPER =
  "M320 600 C236 560 118 430 66 318 Q96 292 142 320 Q196 280 258 322 Q320 286 382 322 Q444 280 498 320 Q544 292 574 318 C522 430 404 560 320 600Z";

const FRONT_PAPER =
  "M80 322 C120 440 240 512 320 526 C400 512 520 440 560 322 C548 470 420 690 332 788 L308 788 C220 690 92 470 80 322Z";

const FRONT_RIM = "M80 322 C120 440 240 512 320 526 C400 512 520 440 560 322";

const CUFF =
  "M80 322 C120 440 240 512 320 526 C400 512 520 440 560 322 C520 440 400 548 320 562 C240 548 120 440 80 322Z";

const CUFF_EDGE = "M560 322 C520 440 400 548 320 562 C240 548 120 440 80 322";

/* -------------------------------------------------------------------------- */
/*  Bow: two double loops, a pinched knot and two notched tails               */
/* -------------------------------------------------------------------------- */

function Bow({ uid, ribbon }: { uid: string; ribbon: string }) {
  const dark = darken(ribbon, 0.28);
  const deep = darken(ribbon, 0.42);
  const light = lighten(ribbon, 0.38);
  const edge = { stroke: dark, strokeOpacity: 0.45, strokeWidth: 0.8, strokeLinejoin: "round" as const };

  // one half of the bow (right side); the left half is the same shape mirrored
  const half = (
    <g>
      {/* upper loop */}
      <path
        d="M324 519 C336 470 382 438 414 450 C438 460 428 494 398 506 C374 516 346 524 324 525Z"
        fill={`url(#${uid}-satin)`}
        {...edge}
      />
      <path
        d="M338 514 C350 480 386 458 408 466 C418 472 412 486 396 494 C376 504 356 512 338 516Z"
        fill={deep}
        opacity="0.42"
      />
      <path
        d="M333 502 C346 474 378 452 406 454"
        fill="none"
        stroke={light}
        strokeOpacity="0.6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* lower loop */}
      <path
        d="M324 523 C346 486 416 478 440 502 C458 521 438 556 404 556 C372 556 342 540 324 531Z"
        fill={`url(#${uid}-satin)`}
        {...edge}
      />
      <path
        d="M336 526 C354 502 402 498 420 512 C428 520 420 532 400 533 C376 534 352 530 336 528Z"
        fill={deep}
        opacity="0.42"
      />
      <path
        d="M340 516 C362 493 408 491 428 507"
        fill="none"
        stroke={light}
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M352 548 C376 552 404 550 424 538"
        fill="none"
        stroke={dark}
        strokeOpacity="0.28"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );

  return (
    <g>
      {/* tails */}
      <path
        d="M322 536 L338 534 C366 570 400 620 402 694 L388 676 L370 692 C372 640 346 590 322 536Z"
        fill={`url(#${uid}-ribbon)`}
        {...edge}
      />
      <path
        d="M318 536 L302 534 C274 570 244 620 240 688 L256 672 L272 692 C278 640 298 590 318 536Z"
        fill={deep}
        fillOpacity="0.88"
        {...edge}
      />
      <path
        d="M318 536 L302 534 C274 570 244 620 240 688 L256 672 L272 692 C278 640 298 590 318 536Z"
        fill={`url(#${uid}-ribbon)`}
        fillOpacity="0.55"
      />
      <g fill="none" stroke={light} strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
        <path d="M334 542 C360 580 390 630 391 684" />
        <path d="M309 542 C284 580 258 630 256 680" />
      </g>

      {/* loops */}
      {half}
      <g transform="translate(640 0) scale(-1 1)">{half}</g>

      {/* knot */}
      <ellipse cx="320" cy="529" rx="15" ry="13" fill={`url(#${uid}-satin)`} {...edge} />
      <g fill="none" stroke={dark} strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round">
        <path d="M311 522 C316 528 316 534 311 540" />
        <path d="M329 522 C324 528 324 534 329 540" />
      </g>
      <ellipse cx="316" cy="523" rx="6" ry="2.6" fill={light} opacity="0.5" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bare stems below the tie (used by the "Bow only" style)                   */
/* -------------------------------------------------------------------------- */

const BUNDLE_STEMS = [
  { top: -9, end: -38, bottom: 722, tone: "dark" },
  { top: 9, end: 42, bottom: 726, tone: "dark" },
  { top: -5, end: -20, bottom: 738, tone: "mid" },
  { top: 5, end: 22, bottom: 742, tone: "mid" },
  { top: -2, end: -4, bottom: 748, tone: "mid" },
  { top: 2, end: 8, bottom: 716, tone: "light" },
] as const;

function StemBundle() {
  return (
    <g>
      {BUNDLE_STEMS.map((stem, i) => {
        const x0 = TIE.x + stem.top;
        const x1 = TIE.x + stem.end;
        const stroke =
          stem.tone === "dark" ? GREEN.leafDark : stem.tone === "light" ? GREEN.stemLight : GREEN.stem;
        return (
          <g key={i}>
            <path
              d={`M${x0} 494 C${x0} 566 ${round(TIE.x + stem.end * 0.5)} 650 ${x1} ${stem.bottom}`}
              fill="none"
              stroke={stroke}
              strokeWidth="5.2"
              strokeLinecap="round"
            />
            <ellipse
              cx={x1}
              cy={stem.bottom}
              rx="3.4"
              ry="1.9"
              fill="#d9e4b9"
              stroke={GREEN.leafDark}
              strokeOpacity="0.5"
              strokeWidth="0.8"
            />
          </g>
        );
      })}
      <path
        d={`M${TIE.x - 1} 500 C${TIE.x - 1} 566 ${TIE.x - 3} 650 ${TIE.x - 4} 730`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>
  );
}

function BouquetArt({
  items,
  paper,
  ribbon,
  fillers,
  wrapStyle,
  butterflyColors,
}: {
  items: BouquetItem[];
  paper: string;
  ribbon: string;
  fillers: FillerId[];
  wrapStyle: WrapStyle;
  butterflyColors: ButterflyColors;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const placements = layoutBouquet(items);
  const wrapped = wrapStyle === "wrap";

  const paperEdge = darken(paper, 0.3);
  const ribbonDark = darken(ribbon, 0.28);
  const ribbonLight = lighten(ribbon, 0.34);
  const tissue = lighten(ribbon, 0.8);

  const activeFillers = FILLERS.filter((filler) => fillers.includes(filler.id));

  const label =
    items.length === 0
      ? "An empty bouquet"
      : `Bouquet of ${items.length} ${items.length === 1 ? "flower" : "flowers"}: ${items
          .map((item) => item.flower.name)
          .join(", ")}${
          activeFillers.length ? `, with ${activeFillers.map((filler) => filler.label).join(", ")}` : ""
        }, ${wrapped ? "wrapped in paper and tied with a bow" : "bare stems tied with a bow"}`;

  return (
    <svg className="bouquet-svg" viewBox="0 0 640 800" role="img" aria-label={label} focusable="false">
      <defs>
        <linearGradient id={`${uid}-back`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(paper, 0.5)} />
          <stop offset="1" stopColor={darken(paper, 0.06)} />
        </linearGradient>
        <linearGradient id={`${uid}-front`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={darken(paper, 0.1)} />
          <stop offset="0.42" stopColor={lighten(paper, 0.14)} />
          <stop offset="1" stopColor={darken(paper, 0.16)} />
        </linearGradient>
        <linearGradient id={`${uid}-cuff`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={lighten(paper, 0.3)} />
          <stop offset="0.5" stopColor={lighten(paper, 0.55)} />
          <stop offset="1" stopColor={lighten(paper, 0.28)} />
        </linearGradient>
        <linearGradient id={`${uid}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ribbonLight} />
          <stop offset="1" stopColor={ribbonDark} />
        </linearGradient>
        <linearGradient id={`${uid}-satin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ribbonLight} />
          <stop offset="0.45" stopColor={ribbon} />
          <stop offset="1" stopColor={ribbonDark} />
        </linearGradient>
        <radialGradient id={`${uid}-shade`} gradientUnits="userSpaceOnUse" cx="320" cy="540" r="230">
          <stop offset="0" stopColor="#1f2e24" stopOpacity="0.36" />
          <stop offset="1" stopColor="#1f2e24" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${uid}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.3" fill={paperEdge} fillOpacity="0.28" />
          <circle cx="12" cy="12" r="1.3" fill={paperEdge} fillOpacity="0.28" />
        </pattern>
      </defs>

      <ellipse
        cx="320"
        cy={wrapped ? 786 : 752}
        rx={wrapped ? 74 : 64}
        ry="8"
        fill="#223829"
        opacity="0.14"
      />

      {wrapped && (
        <>
          {/* tissue paper, peeking out behind the wrap */}
          <path
            d={TISSUE_PATH}
            fill={tissue}
            fillOpacity="0.85"
            stroke={darken(tissue, 0.2)}
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <g fill="none" stroke={darken(tissue, 0.25)} strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round">
            <path d="M122 300 C150 380 220 470 300 560" />
            <path d="M232 296 C250 380 286 470 316 570" />
            <path d="M518 300 C490 380 420 470 340 560" />
            <path d="M408 296 C390 380 354 470 324 570" />
          </g>

          {/* the inside of the wrap */}
          <path
            d={BACK_PAPER}
            fill={`url(#${uid}-back)`}
            stroke={paperEdge}
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d={BACK_PAPER} fill={`url(#${uid}-dots)`} />
          <path d={BACK_PAPER} fill={`url(#${uid}-shade)`} />
          <g fill="none" stroke={paperEdge} strokeOpacity="0.16" strokeWidth="1.1" strokeLinecap="round">
            <path d="M150 336 C190 430 260 520 320 590" />
            <path d="M490 336 C450 430 380 520 320 590" />
            <path d="M258 326 C268 400 292 470 320 560" />
            <path d="M382 326 C372 400 348 470 320 560" />
          </g>
        </>
      )}

      {/* base greenery */}
      <g>
        {FILLER_LEAVES.map((leaf, i) => (
          <Leaf
            key={i}
            x={TIE.x}
            y={TIE.y - 4}
            angle={leaf.angle}
            length={leaf.length}
            width={leaf.width}
            fill={leafFill(leaf.tone)}
          />
        ))}
      </g>

            {/* chosen filler plants */}
        <ButterflyContext.Provider value={butterflyPair(butterflyColors)}>
        {activeFillers.map((filler) => (
          <g key={filler.id} className="filler-in">
            {FILLER_SPRIGS[filler.id].map((spec, i) => (
              <FillerSprig key={i} kind={filler.id} spec={spec} />
            ))}
          </g>
        ))}
      </ButterflyContext.Provider>

      {/* flowers */}
      <BareStemContext.Provider value={true}>
        {placements.map((p) => (
          <g key={p.key}>
            {p.by < TIE.y && (
              <line
                x1={p.bx}
                y1={p.by}
                x2={TIE.x}
                y2={TIE.y + 7}
                stroke={GREEN.stem}
                strokeWidth={round(2.7 * p.scale)}
                strokeLinecap="round"
              />
            )}
            <g
              transform={`translate(${p.bx} ${p.by}) rotate(${p.angle}) scale(${round(p.flip * p.scale)} ${p.scale}) translate(-60 -178)`}
            >
              <g className="bloom-in">
                <FlowerShape flower={p.flower} />
              </g>
            </g>
          </g>
        ))}
      </BareStemContext.Provider>

      {wrapped ? (
        <>
          {/* gathered stems */}
          <g fill="none" strokeLinecap="round">
            <path d="M311 496 L308 548" stroke={GREEN.leafDark} strokeWidth="5" />
            <path d="M316 494 L314 550" stroke={GREEN.stem} strokeWidth="5" />
            <path d="M324 494 L326 550" stroke={GREEN.stem} strokeWidth="5" />
            <path d="M329 496 L332 548" stroke={GREEN.leafDark} strokeWidth="5" />
            <path d="M320 494 L320 552" stroke={GREEN.stemLight} strokeWidth="2" opacity="0.6" />
          </g>

          {/* the outer sheet */}
          <path
            d={FRONT_PAPER}
            fill={`url(#${uid}-front)`}
            stroke={paperEdge}
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <g fill="none" strokeLinecap="round">
            <path d="M320 562 C326 640 330 720 332 788" stroke={paperEdge} strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M134 417 C180 540 250 650 303 770" stroke={paperEdge} strokeOpacity="0.18" strokeWidth="1.2" />
            <path d="M506 417 C460 540 390 650 337 770" stroke={paperEdge} strokeOpacity="0.18" strokeWidth="1.2" />
            <path d="M176 470 C214 560 262 650 296 735" stroke={paperEdge} strokeOpacity="0.1" strokeWidth="1" />
            <path d="M464 470 C426 560 378 650 344 735" stroke={paperEdge} strokeOpacity="0.1" strokeWidth="1" />
            <path d="M150 440 C192 540 246 640 292 744" stroke={lighten(paper, 0.6)} strokeOpacity="0.32" strokeWidth="7" />
          </g>

          {/* the turned-over cuff */}
          <path d={CUFF} fill={`url(#${uid}-cuff)`} />
          <path d={CUFF} fill={`url(#${uid}-dots)`} />
          <path
            d={CUFF_EDGE}
            fill="none"
            stroke={paperEdge}
            strokeOpacity="0.3"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d={FRONT_RIM}
            fill="none"
            stroke={lighten(paper, 0.7)}
            strokeOpacity="0.9"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <g fill="none" stroke={paperEdge} strokeOpacity="0.14" strokeWidth="1" strokeLinecap="round">
            <path d="M150 396 C178 440 214 478 256 502" />
            <path d="M490 396 C462 440 426 478 384 502" />
          </g>

          {/* ribbon band around the stems, then the bow */}
          <path
            d="M296 500 Q320 507 344 500 L346 517 Q320 524 294 517Z"
            fill={`url(#${uid}-ribbon)`}
            stroke={ribbonDark}
            strokeOpacity="0.4"
            strokeWidth="0.8"
          />
          <path
            d="M300 503 Q320 509 340 503"
            fill="none"
            stroke={ribbonLight}
            strokeOpacity="0.55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <Bow uid={uid} ribbon={ribbon} />
        </>
      ) : (
        <>
          {/* bare stems fall below the tie, and the bow sits where they meet */}
          <StemBundle />
          <g transform="translate(320 512) scale(0.92) translate(-320 -529)">
            <Bow uid={uid} ribbon={ribbon} />
          </g>
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared UI: quantity stepper                                               */
/* -------------------------------------------------------------------------- */

function QtyControl({
  name,
  count,
  canAdd,
  onAdd,
  onRemove,
}: {
  name: string;
  count: number;
  canAdd: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <span className="qty" role="group" aria-label={`${name} quantity`}>
      <button type="button" className="qty-btn" onClick={onRemove} aria-label={`Remove one ${name}`}>
        −
      </button>
      <span className="qty-value" aria-live="polite">
        {count}
      </span>
      <button
        type="button"
        className="qty-btn"
        onClick={onAdd}
        disabled={!canAdd}
        aria-label={`Add one more ${name}`}
      >
        +
      </button>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  The handwritten note: a cute ruled notebook page                          */
/* -------------------------------------------------------------------------- */

function NoteCard({
  to,
  from,
  message,
  color,
  preview = false,
}: {
  to: string;
  from: string;
  message: string;
  color: string;
  preview?: boolean;
}) {
  const hasMessage = message.trim().length > 0;

  return (
    <article className="note" style={{ "--note-bg": color } as CSSProperties} aria-label="A handwritten note">
      <span className="tape tape-left" aria-hidden="true" />
      <span className="tape tape-right" aria-hidden="true" />

      <p className={`note-to${to.trim() || !preview ? "" : " note-empty"}`}>
        Dear {to.trim() || (preview ? "someone lovely" : "you")},
      </p>

      <p className={`note-body${hasMessage || !preview ? "" : " note-empty"}`}>
        {hasMessage ? message : preview ? "Your words will appear here, in little handwriting…" : ""}
      </p>

      <p className="note-from">
        <span className="note-with">with love,</span>
        <span className={`note-name${from.trim() || !preview ? "" : " note-empty"}`}>
          {from.trim() || (preview ? "you" : "someone")}
        </span>
        <svg className="squiggle" viewBox="0 0 64 10" aria-hidden="true" focusable="false">
          <path d="M2 6 C10 1 18 10 28 5 S46 2 62 6" fill="none" stroke="#c9707f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </p>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bouquet stage and gift scene (bouquet + note together)                    */
/* -------------------------------------------------------------------------- */

function describeBouquet(
  count: number,
  wrapStyle: WrapStyle,
  paperLabel: string,
  ribbonLabel: string,
  fillerNames: string[]
) {
  if (count === 0) return "An empty wrap, waiting for flowers.";
  const noun = count === 1 ? "flower" : "flowers";
  const base =
    wrapStyle === "wrap"
      ? `${count} ${noun} · wrapped in ${paperLabel.toLowerCase()}, tied with ${ribbonLabel.toLowerCase()}`
      : `${count} ${noun} · bare stems, tied with ${ribbonLabel.toLowerCase()}`;
  return fillerNames.length ? `${base}, with ${fillerNames.join(", ")}` : base;
}

function BouquetStage({
  items,
  wrapStyle,
  paper,
  ribbon,
  fillers,
  butterflyColors,
  caption,
}: {
  items: BouquetItem[];
  wrapStyle: WrapStyle;
  paper: string;
  ribbon: string;
  fillers: FillerId[];
  butterflyColors: ButterflyColors;
  caption: string;
}) {
  return (
    <figure className="bouquet-stage">
      <BouquetArt
        items={items}
        paper={paper}
        ribbon={ribbon}
        fillers={fillers}
        wrapStyle={wrapStyle}
        butterflyColors={butterflyColors}
      />
      <figcaption className="bouquet-caption">{caption}</figcaption>
    </figure>
  );
}

function paperOf(id: PaperId) {
  return PAPERS.find((option) => option.id === id) ?? PAPERS[0];
}

function ribbonOf(id: RibbonId) {
  return RIBBONS.find((option) => option.id === id) ?? RIBBONS[0];
}

function noteOf(id: NotePaperId) {
  return NOTE_PAPERS.find((option) => option.id === id) ?? NOTE_PAPERS[0];
}

function fillerNamesOf(ids: FillerId[]) {
  return FILLERS.filter((filler) => ids.includes(filler.id)).map((filler) => filler.label.toLowerCase());
}

/* -------------------------------------------------------------------------- */
/*  Bouquet builder UI                                                        */
/* -------------------------------------------------------------------------- */

function OptionGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { id: T; label: string; color: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const current = options.find((option) => option.id === value);

  return (
    <fieldset className="option-group">
      <legend className="panel-title">
        {legend}
        <span className="panel-value">{current?.label}</span>
      </legend>
      <div className="swatch-row">
        {options.map((option) => (
          <label key={option.id} className="swatch-option" title={option.label}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="visually-hidden"
            />
            <span
              className="swatch"
              style={{ "--swatch": option.color } as CSSProperties}
              aria-hidden="true"
            />
            <span className="visually-hidden">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function StyleIcon({ kind }: { kind: WrapStyle }) {
  return kind === "wrap" ? (
    <svg className="segment-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M5 8 C10 12 22 12 27 8 C24 18 19 25 16 29 C13 25 8 18 5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M11 7 C12 3 14 2 16 4 C18 2 20 3 21 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ) : (
    <svg className="segment-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 15 C10 7 3 8 5 14 C7 19 13 17 16 15Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 15 C22 7 29 8 27 14 C25 19 19 17 16 15Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 16 L11 29 M16 16 L21 29" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function StyleGroup({ value, onChange }: { value: WrapStyle; onChange: (id: WrapStyle) => void }) {
  return (
    <fieldset className="option-group">
      <legend className="panel-title">Bouquet style</legend>
      <div className="segment-row">
        {STYLES.map((option) => (
          <label key={option.id} className="segment">
            <input
              type="radio"
              name="wrapstyle"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="visually-hidden"
            />
            <span className="segment-face">
              <StyleIcon kind={option.id} />
              <span className="segment-label">{option.label}</span>
              <small>{option.hint}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FillerGroup({
  selected,
  onToggle,
}: {
  selected: FillerId[];
  onToggle: (id: FillerId) => void;
}) {
  return (
    <fieldset className="option-group">
      <legend className="panel-title">Filler plants</legend>
      <div className="option-row">
        {FILLERS.map((filler) => (
          <label key={filler.id} className="option">
            <input
              type="checkbox"
              value={filler.id}
              checked={selected.includes(filler.id)}
              onChange={() => onToggle(filler.id)}
              className="visually-hidden"
            />
            <span
              className="swatch"
              style={{ "--swatch": filler.color } as CSSProperties}
              aria-hidden="true"
            />
            <span className="option-label">{filler.label}</span>
          </label>
        ))}
      </div>
      <p className="panel-note panel-note-tight">Choose as many as you like, or none at all.</p>
    </fieldset>
  );
}

const BUTTERFLY_PRESETS: { label: string; c1: string; c2: string }[] = [
  { label: "Sky & lilac", c1: "#9ec5f5", c2: "#c4aef0" },
  { label: "Blush & peach", c1: "#f2a5b8", c2: "#f6c49a" },
  { label: "Gold & cream", c1: "#e8c25a", c2: "#f6ead0" },
  { label: "Mint & aqua", c1: "#8fd3b8", c2: "#9fd6ea" },
  { label: "Plum & rose", c1: "#a470b8", c2: "#e58fb0" },
  { label: "White & silver", c1: "#f4f4f4", c2: "#b9c2cc" },
];

function ButterflyColorGroup({
  value,
  onChange,
}: {
  value: ButterflyColors;
  onChange: (next: ButterflyColors) => void;
}) {
  return (
    <fieldset className="option-group">
      <legend className="panel-title">Butterfly colours</legend>

      <div className="bf-pickers">
        <label className="bf-picker">
          <input
            type="color"
            value={value.c1}
            onChange={(event) => onChange({ ...value, c1: event.target.value })}
            aria-label="Butterfly colour 1"
          />
          <span className="bf-picker-text">
            <span className="bf-picker-name">Colour 1</span>
            <span className="bf-picker-hex">{value.c1.toUpperCase()}</span>
          </span>
        </label>

        <label className="bf-picker">
          <input
            type="color"
            value={value.c2}
            onChange={(event) => onChange({ ...value, c2: event.target.value })}
            aria-label="Butterfly colour 2"
          />
          <span className="bf-picker-text">
            <span className="bf-picker-name">Colour 2</span>
            <span className="bf-picker-hex">{value.c2.toUpperCase()}</span>
          </span>
        </label>
      </div>

      <div className="bf-presets" role="group" aria-label="Butterfly colour presets">
        {BUTTERFLY_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="bf-preset"
            title={preset.label}
            aria-label={`Use ${preset.label}`}
            onClick={() => onChange({ c1: preset.c1, c2: preset.c2 })}
          >
            <span style={{ background: preset.c1 }} />
            <span style={{ background: preset.c2 }} />
          </button>
        ))}
      </div>

      <p className="panel-note panel-note-tight">
        Shown when Butterflies is chosen above. Pick any two colours that go with your flowers.
      </p>
    </fieldset>
  );
}

function BouquetBuilder({
  items,
  distinct,
  counts,
  isFull,
  wrapStyle,
  paperId,
  ribbonId,
  fillers,
  butterflyColors,
  onButterflyColorsChange,
  onStyleChange,
  onPaperChange,
  onRibbonChange,
  onFillerToggle,
  onAdd,
  onRemoveOne,
  onClear,
  onBack,
  onNext,
  headingRef,
}: {
  items: BouquetItem[];
  distinct: Flower[];
  counts: Map<number, number>;
  isFull: boolean;
  wrapStyle: WrapStyle;
  paperId: PaperId;
  ribbonId: RibbonId;
  fillers: FillerId[];
  butterflyColors: ButterflyColors;
  onButterflyColorsChange: (next: ButterflyColors) => void;
  onStyleChange: (id: WrapStyle) => void;
  onPaperChange: (id: PaperId) => void;
  onRibbonChange: (id: RibbonId) => void;
  onFillerToggle: (id: FillerId) => void;
  onAdd: (id: number) => void;
  onRemoveOne: (id: number) => void;
  onClear: () => void;
  onBack: () => void;
  onNext: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const paper = paperOf(paperId);
  const ribbon = ribbonOf(ribbonId);
  const count = items.length;
  const noun = count === 1 ? "flower" : "flowers";

  return (
    <section className="bouquet-section" aria-labelledby="bouquet-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your bouquet · No. 03</p>
          <h2 id="bouquet-title" className="bouquet-heading" ref={headingRef} tabIndex={-1}>
            Gathered with care.
          </h2>
        </div>
        <button type="button" className="link-button" onClick={onBack}>
          ← Back to the garden
        </button>
      </div>

      <div className="bouquet-layout">
        <BouquetStage
          items={items}
          wrapStyle={wrapStyle}
          paper={paper.color}
          ribbon={ribbon.color}
          fillers={fillers}
          butterflyColors={butterflyColors}
          caption={describeBouquet(count, wrapStyle, paper.label, ribbon.label, fillerNamesOf(fillers))}
        />

        <div className="bouquet-panel">
          <p className="visually-hidden" role="status">
            {count} {noun} in your bouquet{isFull ? ". The bouquet is full." : ""}
          </p>

          <div className="panel-block">
            <StyleGroup value={wrapStyle} onChange={onStyleChange} />
          </div>

          {wrapStyle === "wrap" && (
            <div className="panel-block">
              <OptionGroup
                legend="Wrapping paper"
                name="paper"
                options={PAPERS}
                value={paperId}
                onChange={onPaperChange}
              />
            </div>
          )}

          <div className="panel-block">
            <OptionGroup
              legend="Ribbon"
              name="ribbon"
              options={RIBBONS}
              value={ribbonId}
              onChange={onRibbonChange}
            />
          </div>

          <div className="panel-block">
            <FillerGroup selected={fillers} onToggle={onFillerToggle} />
            {fillers.includes("butterflies") && (
              <div className="bf-block">
                <ButterflyColorGroup value={butterflyColors} onChange={onButterflyColorsChange} />
              </div>
            )}
          </div>

          <div className="panel-block">
            <h3 className="panel-title">
              In this bouquet{" "}
              <span className="panel-count">
                {count.toString().padStart(2, "0")} / {MAX_STEMS}
              </span>
            </h3>

            {count === 0 ? (
              <p className="panel-empty">
                There is nothing in your bouquet yet. Return to the garden and pick a few flowers.
              </p>
            ) : (
              <>
                <ul className="bouquet-list">
                  {distinct.map((flower) => (
                    <li key={flower.id}>
                      <div className="picked-item">
                        <span className="picked-thumb" aria-hidden="true">
                          <FlowerArt flower={flower} thumb />
                        </span>
                        <span className="picked-text">
                          <strong>{flower.name}</strong>
                          <small>{flower.botanicalName}</small>
                        </span>
                        <QtyControl
                          name={flower.name}
                          count={counts.get(flower.id) ?? 0}
                          canAdd={!isFull}
                          onAdd={() => onAdd(flower.id)}
                          onRemove={() => onRemoveOne(flower.id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="panel-note">
                  {isFull
                    ? `Your bouquet is full (${MAX_STEMS} stems). Remove one to make room.`
                    : "The first flower you picked sits at the heart of the bouquet."}
                </p>
                <button type="button" className="link-button link-small" onClick={onClear}>
                  Clear the bouquet
                </button>
              </>
            )}
          </div>

          <div className="panel-actions">
            <button type="button" className="btn btn-primary" onClick={onNext} disabled={count === 0}>
              Write a note →
            </button>
            <button type="button" className="btn" onClick={onBack}>
              Pick more flowers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Note studio: write the note, then create the link                         */
/* -------------------------------------------------------------------------- */

function ShareBox({ url }: { url: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => window.clearTimeout(timer.current);
  }, []);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      inputRef.current?.select();
      ok = document.execCommand("copy");
    }
    setCopied(ok);
    window.clearTimeout(timer.current);
    if (ok) timer.current = window.setTimeout(() => setCopied(false), 2600);
  }

  return (
    <div className="share-box">
      <label className="panel-title" htmlFor="share-link">
        Your gift link
      </label>
      <div className="share-row">
        <input
          id="share-link"
          ref={inputRef}
          className="share-input"
          type="text"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
        />
        <button type="button" className="btn btn-primary" onClick={copy}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
      <p className="visually-hidden" role="status">
        {copied ? "Link copied to the clipboard" : ""}
      </p>
      <p className="panel-note panel-note-tight">
        Send this link to the person you are gifting. When they open it, they will see your bouquet and your
        note. Anyone who has the link can open it.{" "}
        <a className="inline-link" href={url} target="_blank" rel="noopener noreferrer">
          Preview what they will see ↗
        </a>
      </p>
    </div>
  );
}

function NoteStudio({
  items,
  wrapStyle,
  paperId,
  ribbonId,
  fillers,
  butterflyColors,
  to,
  from,
  message,
  noteId,
  onTo,
  onFrom,
  onMessage,
  onNote,
  showLink,
  shareUrl,
  canShare,
  missing,
  onCreate,
  onBack,
  headingRef,
}: {
  items: BouquetItem[];
  wrapStyle: WrapStyle;
  paperId: PaperId;
  ribbonId: RibbonId;
  fillers: FillerId[];
  butterflyColors: ButterflyColors;
  to: string;
  from: string;
  message: string;
  noteId: NotePaperId;
  onTo: (value: string) => void;
  onFrom: (value: string) => void;
  onMessage: (value: string) => void;
  onNote: (id: NotePaperId) => void;
  showLink: boolean;
  shareUrl: string;
  canShare: boolean;
  missing: string[];
  onCreate: () => void;
  onBack: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const paper = paperOf(paperId);
  const ribbon = ribbonOf(ribbonId);
  const note = noteOf(noteId);

  return (
    <section className="bouquet-section" aria-labelledby="note-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your note · No. 04</p>
          <h2 id="note-title" className="bouquet-heading" ref={headingRef} tabIndex={-1}>
            Say it sweetly.
          </h2>
        </div>
        <button type="button" className="link-button" onClick={onBack}>
          ← Back to the bouquet
        </button>
      </div>

      <div className="note-layout">
        <div className="note-form">
          <div className="field">
            <label className="panel-title" htmlFor="note-to">
              Who is it for?
            </label>
            <input
              id="note-to"
              className="field-input"
              type="text"
              value={to}
              maxLength={NAME_LIMIT}
              autoComplete="off"
              placeholder="their name"
              onChange={(event) => onTo(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="panel-title" htmlFor="note-from">
              And who is it from?
            </label>
            <input
              id="note-from"
              className="field-input"
              type="text"
              value={from}
              maxLength={NAME_LIMIT}
              autoComplete="off"
              placeholder="your name"
              onChange={(event) => onFrom(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="panel-title" htmlFor="note-message">
              Your message
            </label>
            <textarea
              id="note-message"
              className="field-input field-area"
              value={message}
              maxLength={MESSAGE_LIMIT}
              rows={5}
              placeholder="write something kind…"
              onChange={(event) => onMessage(event.target.value)}
            />
            <p className="field-count" aria-hidden="true">
              {message.length} / {MESSAGE_LIMIT}
            </p>
          </div>

          <OptionGroup
            legend="Note paper"
            name="notepaper"
            options={NOTE_PAPERS}
            value={noteId}
            onChange={onNote}
          />

          <div className="share-area">
            <button type="button" className="btn btn-primary" onClick={onCreate} disabled={!canShare}>
              {showLink ? "Update my link" : "Create my link"}
            </button>
            {!canShare && (
              <p className="panel-note panel-note-tight">Still needed: {missing.join(", ")}.</p>
            )}
            {showLink && shareUrl && <ShareBox url={shareUrl} />}
          </div>
        </div>

        <div className="note-preview">
          <div className="gift-scene gift-stack">
            <BouquetStage
              items={items}
              wrapStyle={wrapStyle}
              paper={paper.color}
              ribbon={ribbon.color}
              fillers={fillers}
              butterflyColors={butterflyColors}
              caption={describeBouquet(items.length, wrapStyle, paper.label, ribbon.label, fillerNamesOf(fillers))}
            />
            <NoteCard to={to} from={from} message={message} color={note.color} preview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What the receiver sees                                                    */
/* -------------------------------------------------------------------------- */

function GiftView({
  gift,
  onMakeOwn,
  headingRef,
}: {
  gift: GiftData;
  onMakeOwn: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const items: BouquetItem[] = gift.stems.flatMap((id, index) => {
    const flower = flowerById.get(id);
    return flower ? [{ key: index + 1, flower }] : [];
  });
  const paper = paperOf(gift.paper);
  const ribbon = ribbonOf(gift.ribbon);
  const note = noteOf(gift.noteColor);

  return (
    <section className="bouquet-section gift-section" aria-labelledby="gift-title">
      <header className="gift-head">
        <p className="eyebrow">{gift.from ? `${gift.from} sent you flowers` : "Someone sent you flowers"}</p>
        <h2 id="gift-title" className="gift-title" ref={headingRef} tabIndex={-1}>
          {gift.to ? (
            <>
              A bouquet for <em>{gift.to}.</em>
            </>
          ) : (
            <>
              A bouquet <em>for you.</em>
            </>
          )}
        </h2>
      </header>

      <div className="gift-scene gift-side">
        <BouquetStage
          items={items}
          wrapStyle={gift.style}
          paper={paper.color}
          ribbon={ribbon.color}
          fillers={gift.fillers}
          butterflyColors={gift.butterflyColors}
          caption={describeBouquet(items.length, gift.style, paper.label, ribbon.label, fillerNamesOf(gift.fillers))}
        />
        <NoteCard to={gift.to} from={gift.from} message={gift.message} color={note.color} />
      </div>

      <div className="gift-actions">
        <p className="collection-hint">Want to send someone flowers too?</p>
        <button type="button" className="btn btn-primary" onClick={onMakeOwn}>
          Make a bouquet of your own
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Decorative pieces: logo, hero sprigs, meadow ground, grass & sparkles     */
/* -------------------------------------------------------------------------- */

function WordmarkIcon() {
  return (
    <svg className="wordmark-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 22 C12 15 12 10 12 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M12 14 C7 14 4.5 11 4.5 7.5 C9 7.5 12 10 12 14Z" fill="currentColor" opacity="0.85" />
      <path d="M12 11 C16.5 11 19.5 8.5 19.5 5 C15 5 12 7.5 12 11Z" fill="currentColor" />
    </svg>
  );
}

/* a tall stem with a proper, generous bloom on top and two smaller ones below */
function HeroSprig({ className }: { className: string }) {
  const p0: Pt = [80, 380];
  const p1: Pt = [62, 290];
  const p2: Pt = [106, 190];
  const p3: Pt = [90, 36];
  const d = `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
  const [bx1, by1] = cubic(p0, p1, p2, p3, 0.84);
  const [bx2, by2] = cubic(p0, p1, p2, p3, 0.93);

  return (
    <svg className={`hero-sprig ${className}`} viewBox="0 0 160 380" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke={GREEN.stem} strokeWidth="2.6" strokeLinecap="round" />
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = cubic(p0, p1, p2, p3, round(0.1 + i * 0.09));
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <Leaf
            key={i}
            x={x}
            y={y}
            angle={side * round(52 - i * 1.5)}
            length={round(54 - i * 3.4)}
            width={round(13 - i * 0.7)}
            fill={i % 3 === 0 ? GREEN.leafDark : i % 3 === 1 ? GREEN.leaf : GREEN.leafPale}
          />
        );
      })}
      <g fill="none" stroke={GREEN.stem} strokeWidth="1.6" strokeLinecap="round">
        <path d={`M${bx1} ${by1} Q${round(bx1 - 20)} ${round(by1 - 14)} 52 96`} />
        <path d={`M${bx2} ${by2} Q${round(bx2 + 18)} ${round(by2 - 2)} 128 60`} />
      </g>
      <FivePetalFlower x={52} y={96} r={15} color="#f1d58a" center="#d99a3a" rotate={-10} />
      <FivePetalFlower x={128} y={60} r={13} color="#c9b8e8" center="#e6c66c" rotate={20} />
      <ellipse cx="74" cy="82" rx="3" ry="5" fill="#d99aa4" transform="rotate(-30 74 82)" />
      <FivePetalFlower x={90} y={34} r={24} color="#eaa6b4" center="#e6c66c" rotate={12} />
    </svg>
  );
}

/* tiny wild flowers scattered on the hills (round dots, so they never stretch) */

const SPECK_COLORS = ["#f6e9b8", "#f1c9cf", "#cfdcea", "#ffffff", "#e0d2ee", "#f4c9a8"];

const SPECKS = (() => {
  const rand = seeded(21);
  return Array.from({ length: 46 }, () => ({
    x: round(2 + rand() * 96),
    y: round(40 + rand() * 54),
    size: round(3 + rand() * 3.5),
    color: SPECK_COLORS[Math.floor(rand() * SPECK_COLORS.length)],
    opacity: round(0.55 + rand() * 0.4),
  }));
})();

function Specks() {
  return (
    <>
      {SPECKS.map((s, i) => (
        <span
          key={i}
          className="speck"
          aria-hidden="true"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            opacity: s.opacity,
          }}
        />
      ))}
    </>
  );
}

/* slowly drifting pollen */

const MOTES = (() => {
  const rand = seeded(99);
  return Array.from({ length: 16 }, () => ({
    x: round(3 + rand() * 94),
    y: round(8 + rand() * 78),
    size: round(3 + rand() * 4),
    delay: round(-rand() * 14),
    duration: round(11 + rand() * 9),
  }));
})();

function Motes() {
  return (
    <>
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="mote"
          aria-hidden="true"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </>
  );
}

/* layered hills, a far hedge and soft leaf shadows */

function MeadowBackdrop() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const hills = [
    { id: "far", top: "#bfd2bd", opacity: 0.6, d: "M0 236 C150 205 300 250 480 224 C660 198 840 246 1000 214 L1000 780 L0 780Z" },
    { id: "mid", top: "#aac49b", opacity: 0.55, d: "M0 372 C180 336 350 398 530 362 C710 328 870 386 1000 350 L1000 780 L0 780Z" },
    { id: "near", top: "#93b186", opacity: 0.52, d: "M0 520 C200 486 400 544 600 510 C790 478 910 528 1000 498 L1000 780 L0 780Z" },
    { id: "front", top: "#7da174", opacity: 0.5, d: "M0 668 C240 636 460 690 660 658 C820 632 930 672 1000 650 L1000 780 L0 780Z" },
  ];

  return (
    <svg
      className="meadow-backdrop"
      viewBox="0 0 1000 780"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {hills.map((hill) => (
          <linearGradient key={hill.id} id={`${uid}-${hill.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hill.top} stopOpacity={hill.opacity} />
            <stop offset="1" stopColor="#d9e3c9" stopOpacity="0.12" />
          </linearGradient>
        ))}
      </defs>

      <path d={hills[0].d} fill={`url(#${uid}-${hills[0].id})`} />
      <g fill="#86a583" opacity="0.26">
        {Array.from({ length: 13 }, (_, i) => (
          <ellipse key={i} cx={30 + i * 78} cy={220 + (i % 3) * 7} rx={48} ry={20 + (i % 2) * 5} />
        ))}
      </g>
      {hills.slice(1).map((hill) => (
        <path key={hill.id} d={hill.d} fill={`url(#${uid}-${hill.id})`} />
      ))}

      <g fill="#7f9f78" opacity="0.12">
        <ellipse cx="34" cy="600" rx="24" ry="96" transform="rotate(-24 34 600)" />
        <ellipse cx="70" cy="660" rx="20" ry="80" transform="rotate(14 70 660)" />
        <ellipse cx="966" cy="590" rx="24" ry="96" transform="rotate(24 966 590)" />
        <ellipse cx="930" cy="650" rx="20" ry="80" transform="rotate(-14 930 650)" />
        <ellipse cx="22" cy="400" rx="18" ry="70" transform="rotate(-18 22 400)" />
        <ellipse cx="980" cy="380" rx="18" ry="70" transform="rotate(18 980 380)" />
      </g>
    </svg>
  );
}

const BLADE_TONES = ["#6f9170", "#86a583", "#587a5d"];

const BLADES = (() => {
  const rand = seeded(7);
  return Array.from({ length: 110 }, (_, i) => {
    const x = round((i / 110) * 1000 + rand() * 12);
    const h = round(34 + rand() * 62);
    const bend = round((rand() - 0.5) * 34);
    const w = round(2 + rand() * 3);
    return {
      d: `M${round(x - w)} 120 Q${round(x + bend * 0.3)} ${round(120 - h * 0.55)} ${round(x + bend)} ${round(120 - h)} Q${round(x + bend * 0.6 + w * 0.3)} ${round(120 - h * 0.5)} ${round(x + w)} 120Z`,
      tone: i % 3,
      opacity: round(0.45 + rand() * 0.4),
    };
  });
})();

function GrassFringe() {
  return (
    <svg
      className="meadow-fringe"
      viewBox="0 0 1000 120"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {BLADES.map((blade, i) => (
        <path key={i} d={blade.d} fill={BLADE_TONES[blade.tone]} opacity={blade.opacity} />
      ))}
    </svg>
  );
}

/* a little clump of grass that hides the bottom of each stem */

const TUFT_TONES = ["#6f9170", "#86a583", "#587a5d", "#9bb894"];

function Tuft({ seed, style }: { seed: number; style: CSSProperties }) {
  const rand = seeded(seed * 17 + 3);
  const blades = Array.from({ length: 11 }, (_, i) => {
    const x = round(5 + i * 9.5 + rand() * 3);
    const h = round(16 + rand() * 24 + (i > 3 && i < 8 ? 6 : 0));
    const bend = round((rand() - 0.5) * 18);
    const w = round(2 + rand() * 1.6);
    return {
      d: `M${round(x - w)} 44 Q${round(x + bend * 0.3)} ${round(44 - h * 0.55)} ${round(x + bend)} ${round(44 - h)} Q${round(x + bend * 0.5 + w * 0.3)} ${round(44 - h * 0.5)} ${round(x + w)} 44Z`,
      fill: TUFT_TONES[Math.floor(rand() * TUFT_TONES.length)],
      opacity: round(0.75 + rand() * 0.25),
    };
  });

  return (
    <svg
      className="tuft"
      style={style}
      viewBox="0 0 110 44"
      aria-hidden="true"
      focusable="false"
    >
      {blades.map((blade, i) => (
        <path key={i} d={blade.d} fill={blade.fill} opacity={blade.opacity} />
      ))}
    </svg>
  );
}

/* CSS variables shared by a garden flower and its grass tuft */
function plantStyle(flower: Flower, index: number): CSSProperties {
  const mobile = MOBILE_POS.get(flower.id) ?? { x: 50, y: 50 };
  return {
    "--x": `${flower.x}%`,
    "--y": `${flower.y}%`,
    "--mx": `${mobile.x}%`,
    "--my": `${mobile.y}%`,
    "--zd": String(Math.round(flower.y)),
    "--zm": String(Math.round(mobile.y)),
    "--size": String(flower.size),
    "--rotation": `${flower.rotation}deg`,
    "--delay": `${round(-((index * 1.7) % 8))}s`,
    "--tone": flower.color,
  } as CSSProperties;
}

/* One flower field: a heading and a composed meadow of its own. */
function FlowerField({
  field,
  counts,
  isFull,
  onAdd,
}: {
  field: Field;
  counts: Map<number, number>;
  isFull: boolean;
  onAdd: (id: number) => void;
}) {
  return (
    <section className="garden-section" id={field.id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">The flower field · No. {field.no}</p>
          <h2>{field.title}</h2>
        </div>
        <p className="field-instruction">
          {field.lines[0]}
          <br />
          {field.lines[1]}
        </p>
      </div>

      <div className="meadow" style={{ "--mh": String(field.mobileH) } as CSSProperties}>
        <MeadowBackdrop />
        <div className="sun-wash" aria-hidden="true" />
        <div className="sun-rays" aria-hidden="true" />
        <Specks />
        <Motes />

        <div className="meadow-note meadow-note-top" aria-hidden="true">
          <span>{field.fig}</span>
          <span>{field.name}</span>
        </div>

        {field.flowers.map((flower, index) => (
          <Tuft key={`tuft-${flower.id}`} seed={flower.id} style={plantStyle(flower, index)} />
        ))}

        {field.flowers.map((flower, index) => {
          const count = counts.get(flower.id) ?? 0;
          const isPicked = count > 0;

          return (
            <button
              key={flower.id}
              type="button"
              className={`flower${isPicked ? " flower-picked" : ""}`}
              style={plantStyle(flower, index)}
              onClick={() => onAdd(flower.id)}
              aria-disabled={isFull}
              aria-label={`Add ${flower.name} (${flower.botanicalName}) to your bouquet${
                isPicked ? `, ${count} added so far` : ""
              }`}
              title={`${flower.name} · ${flower.botanicalName}`}
            >
              <span className="flower-halo" aria-hidden="true" />
              <span className="flower-art" aria-hidden="true">
                <span className="flower-sway">
                  <FlowerArt flower={flower} />
                </span>
              </span>
              {isPicked && (
                <span key={count} className="picked-mark" aria-hidden="true">
                  {count > 1 ? count : "✓"}
                </span>
              )}
              <span className="flower-label" aria-hidden="true">
                {flower.name}
              </span>
            </button>
          );
        })}

        <GrassFringe />

        <div className="meadow-note meadow-note-bottom" aria-hidden="true">
          <span>{field.flowers.length} varieties</span>
          <span>Growing in their own time</span>
        </div>
      </div>

      <a className="field-next" href={field.next.href}>
        {field.next.label}
      </a>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  // every entry is one stem, so the same flower can be added many times
  const [stems, setStems] = useState<StemEntry[]>([]);
  const [view, setView] = useState<View>("garden");
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>("wrap");
  const [paperId, setPaperId] = useState<PaperId>("ivory");
  const [ribbonId, setRibbonId] = useState<RibbonId>("pink");
  const [fillers, setFillers] = useState<FillerId[]>(["eucalyptus"]);
  const [butterflyColors, setButterflyColors] = useState<ButterflyColors>(DEFAULT_BUTTERFLY_COLORS);

  // the note
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [noteId, setNoteId] = useState<NotePaperId>("cream");
  const [showLink, setShowLink] = useState(false);

  // a gift opened from a link
  const [gift, setGift] = useState<GiftData | null>(null);
  const [badLink, setBadLink] = useState(false);
  const [origin, setOrigin] = useState("");
  const [checked, setChecked] = useState(false);

  const nextKey = useRef(1);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasSwitchedView = useRef(false);

  // Read a gift from the address bar (only after mount, so there is no hydration mismatch).
  useEffect(() => {
    function sync() {
      const hash = window.location.hash;
      if (hash.startsWith("#g=")) {
        const data = decodeGift(hash.slice(3));
        setGift(data);
        setBadLink(!data);
      } else {
        setGift(null);
        setBadLink(false);
      }
    }

    setOrigin(window.location.origin + window.location.pathname);
    sync();
    setChecked(true);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function addFlower(id: number) {
    const key = nextKey.current++;
    setStems((current) =>
      current.length >= MAX_STEMS ? current : [...current, { key, flowerId: id }]
    );
  }

  function removeOne(id: number) {
    setStems((current) => {
      const index = current.map((stem) => stem.flowerId).lastIndexOf(id);
      return index < 0 ? current : current.filter((_, i) => i !== index);
    });
  }

  function clearStems() {
    setStems([]);
  }

  function toggleFiller(id: FillerId) {
    setFillers((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  function changeView(next: View) {
    hasSwitchedView.current = true;
    setView(next);
  }

  function leaveGift() {
    hasSwitchedView.current = true;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setGift(null);
    setView("garden");
  }

  const showing = gift ? "gift" : view;

  // Move the reader to the right place after switching screens.
  useEffect(() => {
    if (!hasSwitchedView.current) return;

    if (showing === "garden") {
      document.getElementById("meadow")?.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo({ top: 0 });
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [showing]);

  const counts = new Map<number, number>();
  for (const stem of stems) {
    counts.set(stem.flowerId, (counts.get(stem.flowerId) ?? 0) + 1);
  }

  // distinct flowers, in the order they were first picked
  const distinctFlowers = Array.from(new Set(stems.map((stem) => stem.flowerId)))
    .map((id) => flowerById.get(id))
    .filter((flower): flower is Flower => Boolean(flower));

  // one entry per stem, in pick order (the first stem sits at the heart of the bouquet)
  const bouquetItems: BouquetItem[] = stems.flatMap((stem) => {
    const flower = flowerById.get(stem.flowerId);
    return flower ? [{ key: stem.key, flower }] : [];
  });

  const total = stems.length;
  const isFull = total >= MAX_STEMS;
  const countLabel = total.toString().padStart(2, "0");

  // what is still missing before a link can be made
  const missing: string[] = [];
  if (!toName.trim()) missing.push("their name");
  if (!fromName.trim()) missing.push("your name");
  if (!message.trim()) missing.push("a message");
  const canShare = total > 0 && missing.length === 0;

  const shareUrl =
    showLink && canShare && origin
      ? `${origin}#g=${encodeGift({
          stems: stems.map((stem) => stem.flowerId),
          paper: paperId,
          ribbon: ribbonId,
          fillers,
          style: wrapStyle,
          noteColor: noteId,
          to: toName.trim(),
          from: fromName.trim(),
          message: message.trim(),
          butterflyColors,
        })}`
      : "";

  // until the address bar has been read, show only an empty page (avoids a flash of the garden)
  if (!checked) {
    return <main className={`garden-page ${hand.variable}`} />;
  }

  return (
    <main className={`garden-page ${hand.variable}`}>
      <nav className="topbar" aria-label="Main">
        <a href="#" className="wordmark">
          <WordmarkIcon />
          Bloomlet<span className="wordmark-period">.</span>
        </a>
        {gift ? (
          <button type="button" className="picked-link" onClick={leaveGift}>
            Make your own →
          </button>
        ) : view === "garden" ? (
          <a className="picked-link" href="#your-picks">
            Your picks <span className="picked-count">{countLabel}</span>
          </a>
        ) : (
          <button type="button" className="picked-link" onClick={() => changeView("garden")}>
            ← Garden <span className="picked-count">{countLabel}</span>
          </button>
        )}
      </nav>

      {badLink && (
        <p className="link-alert" role="alert">
          That gift link could not be opened. It may have been cut short when it was copied. Please ask for it
          again.
        </p>
      )}

      {gift ? (
        <GiftView gift={gift} onMakeOwn={leaveGift} headingRef={headingRef} />
      ) : view === "garden" ? (
        <>
          <section className="hero">
            <HeroSprig className="hero-sprig-left" />
            <HeroSprig className="hero-sprig-right" />
            <div className="hero-copy">
              <p className="eyebrow">A little place to gather flowers</p>
              <h1>
                Gather a few,
                <br />
                <em>send a bouquet.</em>
              </h1>
              <p className="hero-description">
                Pick your favourite blooms, tie them with a ribbon,
                <br className="desktop-break" />
                and send them with a little note that says it all.
              </p>
              <a href="#meadow" className="scroll-cue">
                <span>Wander into the garden</span>
                <span className="scroll-arrow" aria-hidden="true">↓</span>
              </a>
            </div>
          </section>

          {FIELDS.map((field) => (
            <FlowerField key={field.id} field={field} counts={counts} isFull={isFull} onAdd={addFlower} />
          ))}

          <section className="collection" id="your-picks">
            <div className="collection-heading">
              <div>
                <p className="eyebrow">Your gathered flowers</p>
                <h2>A little collection.</h2>
              </div>
              <span className="collection-count">
                {countLabel} / {MAX_STEMS}
              </span>
            </div>

            <p className="visually-hidden" role="status">
              {total} {total === 1 ? "flower" : "flowers"} in your bouquet
              {isFull ? ". The bouquet is full." : ""}
            </p>

            {distinctFlowers.length === 0 ? (
              <p className="empty-collection">
                Your collection is waiting to bloom.
                <br />
                Choose a flower from the garden above to begin.
              </p>
            ) : (
              <div className="picked-list">
                {distinctFlowers.map((flower) => (
                  <div key={flower.id} className="picked-item">
                    <span className="picked-thumb" aria-hidden="true">
                      <FlowerArt flower={flower} thumb />
                    </span>
                    <span className="picked-text">
                      <strong>{flower.name}</strong>
                      <small>{flower.botanicalName}</small>
                    </span>
                    <QtyControl
                      name={flower.name}
                      count={counts.get(flower.id) ?? 0}
                      canAdd={!isFull}
                      onAdd={() => addFlower(flower.id)}
                      onRemove={() => removeOne(flower.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="collection-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={total === 0}
                onClick={() => changeView("bouquet")}
              >
                Create my bouquet
              </button>
              {total === 0 && (
                <span className="collection-hint">Pick at least one flower to begin.</span>
              )}
              {isFull && (
                <span className="collection-hint">
                  Your bouquet is full ({MAX_STEMS} stems). Remove one to add another.
                </span>
              )}
              {total > 0 && (
                <button type="button" className="link-button link-small" onClick={clearStems}>
                  Clear all
                </button>
              )}
            </div>

            <p className="collection-footnote">
              A small beginning. More flowers, more possibilities.
            </p>
          </section>

          {total > 0 && (
            <div className="cta-dock">
              <button type="button" className="btn btn-primary" onClick={() => changeView("bouquet")}>
                Create my bouquet <span className="btn-count">{countLabel}</span>
              </button>
            </div>
          )}
        </>
      ) : view === "bouquet" ? (
        <BouquetBuilder
          items={bouquetItems}
          distinct={distinctFlowers}
          counts={counts}
          isFull={isFull}
          wrapStyle={wrapStyle}
          paperId={paperId}
          ribbonId={ribbonId}
          fillers={fillers}
          butterflyColors={butterflyColors}
          onButterflyColorsChange={setButterflyColors}
          onStyleChange={setWrapStyle}
          onPaperChange={setPaperId}
          onRibbonChange={setRibbonId}
          onFillerToggle={toggleFiller}
          onAdd={addFlower}
          onRemoveOne={removeOne}
          onClear={clearStems}
          onBack={() => changeView("garden")}
          onNext={() => changeView("note")}
          headingRef={headingRef}
        />
      ) : (
        <NoteStudio
          items={bouquetItems}
          wrapStyle={wrapStyle}
          paperId={paperId}
          ribbonId={ribbonId}
          fillers={fillers}
          butterflyColors={butterflyColors}
          to={toName}
          from={fromName}
          message={message}
          noteId={noteId}
          onTo={setToName}
          onFrom={setFromName}
          onMessage={setMessage}
          onNote={setNoteId}
          showLink={showLink}
          shareUrl={shareUrl}
          canShare={canShare}
          missing={missing}
          onCreate={() => setShowLink(true)}
          onBack={() => changeView("bouquet")}
          headingRef={headingRef}
        />
      )}

      <footer className="garden-footer">
        <a href="#" className="wordmark">
          <WordmarkIcon />
          Bloomlet<span className="wordmark-period">.</span>
        </a>
        <span>Created with 🩷 by Fatima Tufail.</span>
      </footer>
    </main>
  );
}