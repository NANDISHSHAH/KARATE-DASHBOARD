import { useEffect, useState } from "react";

/** none keeps the painted art. red-flash turns the kick energy red. blue-gear turns the headband and gloves blue. */
export type ArtworkTint = "none" | "red-flash" | "blue-gear";

const cache = new Map<string, string>();

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number) {
  const i = Math.floor(h * 6) % 6;
  const f = h * 6 - Math.floor(h * 6);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const table = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ];
  const [rr, gg, bb] = table[i];
  return [Math.round(rr * 255), Math.round(gg * 255), Math.round(bb * 255)];
}

function paintFrame(image: HTMLImageElement, tint: ArtworkTint) {
  const maxEdge = 820;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return image.src;
  context.drawImage(image, 0, 0, width, height);
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i + 1];
    let b = pixels[i + 2];
    const max = Math.max(r, g, b);
    if (max < 22) {
      pixels[i + 3] = 0;
      continue;
    }
    if (max < 48 && r < 40 && g < 40 && b < 46) {
      pixels[i + 3] = Math.round(((max - 22) / 26) * 255);
    }

    if (tint === "red-flash") {
      const strong = b > 90 && b - r > 46 && g > r * 0.45;
      const pale = b > 145 && g > 145 && g > r + 16 && b > r + 20 && Math.abs(b - g) < 55;
      const { h, s, v } = rgbToHsv(r, g, b);
      const rim = h > 0.45 && h < 0.72 && s > 0.4 && v > 0.22 && r < 130 && b > r + 20;
      if (strong || pale || rim) {
        const hot = Math.max(g, b);
        r = Math.min(255, hot);
        g = Math.min(255, Math.round(g * 0.16 + (hot > 230 ? 36 : 6)));
        b = Math.min(70, Math.round(pixels[i] * 0.15));
        pixels[i] = r;
        pixels[i + 1] = g;
        pixels[i + 2] = b;
      }
    } else if (tint === "blue-gear") {
      const { h, s, v } = rgbToHsv(r, g, b);
      if ((h < 0.028 || h > 0.972) && s > 0.58 && v > 0.25) {
        const [nr, ng, nb] = hsvToRgb(0.58, Math.min(1, s * 0.92), v);
        pixels[i] = nr;
        pixels[i + 1] = ng;
        pixels[i + 2] = nb;
      }
    }
  }
  context.putImageData(frame, 0, 0);
  return canvas.toDataURL("image/png");
}

export function keyArtwork(src: string, tint: ArtworkTint = "none") {
  const key = `${src}|${tint}`;
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const keyed = paintFrame(image, tint);
      const warmed = new Image();
      warmed.onload = () => {
        cache.set(key, keyed);
        resolve(keyed);
      };
      warmed.onerror = () => {
        cache.set(key, keyed);
        resolve(keyed);
      };
      warmed.src = keyed;
    };
    image.onerror = () => resolve(src);
    image.src = src;
  });
}

export function useKeyedArtwork(src: string, tint: ArtworkTint = "none") {
  const key = `${src}|${tint}`;
  const [url, setUrl] = useState(cache.get(key) ?? src);

  useEffect(() => {
    let cancel = false;
    keyArtwork(src, tint).then((keyed) => {
      if (!cancel) setUrl(keyed);
    });
    return () => {
      cancel = true;
    };
  }, [src, tint]);

  return url;
}

export function KeyedArtwork({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const url = useKeyedArtwork(src);
  return <img src={url} alt={alt} className={className} draggable={false} />;
}
