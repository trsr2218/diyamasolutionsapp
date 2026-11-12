import { supabase } from "@/integrations/supabase/client";

/* Reference screenshots for the site builder.
 *
 * Ernest, 12 November 2026: the builder had one look. Visitors must be able to upload
 * screenshots of websites they like, and the sample must come out similar. Three
 * pieces: shrink the picture in the browser so nothing heavy is stored or sent, read
 * its colours so the mock-up takes them on at once, and upload it with the order so
 * the demo is built to match. */

export interface Palette {
  bg: string;
  fg: string;
  card: string;
  muted: string;
  accent: string;
  dark: boolean;
  /** Serif headings, as Diyama AI read them from the screenshots. */
  serif?: boolean;
}

export interface SiteRef {
  /** JPEG data URL, longest side 1200px. */
  data: string;
  /** Public address once uploaded with the order. */
  url?: string;
}

export const MAX_REFS = 4;
export const REFS_STORAGE = "diyama-site-refs";
const BUCKET = "site-references";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("not an image"));
    img.src = src;
  });

/** Reads a chosen file and returns it as a JPEG data URL no longer than `max` on its long side. */
export async function shrink(file: File, max = 1200): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("unreadable"));
    r.readAsDataURL(file);
  });
  const img = await loadImage(raw);
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.82);
}

const hex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

const lum = (r: number, g: number, b: number) => {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const sat = (r: number, g: number, b: number) => {
  const mx = Math.max(r, g, b) / 255;
  const mn = Math.min(r, g, b) / 255;
  const l = (mx + mn) / 2;
  if (mx === mn) return 0;
  const d = mx - mn;
  return l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
};

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const mix = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** The colours of a screenshot: its ground, a text colour that reads on it, a card
 *  tone one step off the ground, and the strongest colour used against it. */
export async function paletteFrom(dataUrl: string, fallbackAccent: string): Promise<Palette> {
  const img = await loadImage(dataUrl);
  const N = 56;
  const c = document.createElement("canvas");
  c.width = N;
  c.height = N;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(img, 0, 0, N, N);
  const px = ctx.getImageData(0, 0, N, N).data;

  type Bin = { n: number; r: number; g: number; b: number };
  const bins = new Map<string, Bin>();
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const edge = x < 4 || y < 4 || x >= N - 4 || y >= N - 4;
      const w = edge ? 2 : 1;
      const key = `${r >> 4},${g >> 4},${b >> 4}`;
      const bin = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      bin.n += w;
      bin.r += r * w;
      bin.g += g * w;
      bin.b += b * w;
      bins.set(key, bin);
    }
  }
  const list = [...bins.values()]
    .map((b) => ({ n: b.n, rgb: [b.r / b.n, b.g / b.n, b.b / b.n] as [number, number, number] }))
    .sort((a, b) => b.n - a.n);
  if (!list.length) throw new Error("empty");

  const bg = list[0].rgb;
  const bgL = lum(...bg);
  const dark = bgL < 0.3;
  const fg: [number, number, number] = dark ? [250, 250, 250] : [20, 22, 28];

  /* The accent: a saturated colour that stands out from the ground, the more of it the better. */
  let best: { score: number; rgb: [number, number, number] } | null = null;
  for (const item of list) {
    const s = sat(...item.rgb);
    const ct = contrast(lum(...item.rgb), bgL);
    if (s < 0.3 || ct < 1.8) continue;
    const score = item.n * (0.5 + s);
    if (!best || score > best.score) best = { score, rgb: item.rgb };
  }
  const accentRgb = best?.rgb;
  const card = dark ? mix(bg, [255, 255, 255], 0.09) : mix(bg, [0, 0, 0], 0.035);
  const muted = mix(fg, bg, 0.45);

  return {
    bg: hex(...bg),
    fg: hex(...fg),
    card: hex(...card),
    muted: hex(...muted),
    accent: accentRgb ? hex(...accentRgb) : fallbackAccent,
    dark,
  };
}

const toBlob = (dataUrl: string) => {
  const [head, body] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(head)?.[1] ?? "image/jpeg";
  const bin = atob(body);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
};

/** Uploads the screenshots and returns their public addresses, in order. Throws if any fails. */
export async function uploadRefs(refs: SiteRef[]): Promise<string[]> {
  const folder = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const urls: string[] = [];
  for (let i = 0; i < refs.length; i++) {
    if (refs[i].url) {
      urls.push(refs[i].url as string);
      continue;
    }
    const path = `${folder}/${i + 1}.jpg`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, toBlob(refs[i].data), { contentType: "image/jpeg", upsert: false });
    if (error) throw error;
    urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

export const loadRefs = (): SiteRef[] => {
  try {
    const raw = localStorage.getItem(REFS_STORAGE);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.filter((r) => r && typeof r.data === "string" && r.data.startsWith("data:image/")).slice(0, MAX_REFS);
    }
  } catch {
    /* blocked storage, start fresh */
  }
  return [];
};

export const saveRefs = (refs: SiteRef[]) => {
  try {
    if (refs.length) localStorage.setItem(REFS_STORAGE, JSON.stringify(refs));
    else localStorage.removeItem(REFS_STORAGE);
  } catch {
    /* over quota or blocked: the pictures live for this visit only */
  }
};
