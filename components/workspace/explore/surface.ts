import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { Tone } from "./system";
import { dominantHue, paintBands, paintThumbnail } from "./textures";

interface Surface {
  texture: THREE.CanvasTexture;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
}

function createSurface(seed: number, hue: number, tone?: Tone): Surface {
  // smaller maps on phones: 11 planets' worth of GPU memory adds up
  const w = window.innerWidth < 640 ? 512 : 1024;
  const h = w / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  paintBands(ctx, w, h, seed, hue, tone);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return { texture, ctx, w, h };
}

// Through Next's image optimizer: a 640px version instead of the original,
// which for some thumbnails is several MB. (640 is one of its default sizes.)
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function repaint(surface: Surface, seed: number, hue: number, img: HTMLImageElement, tone?: Tone) {
  paintBands(surface.ctx, surface.w, surface.h, seed, hue, tone);
  paintThumbnail(surface.ctx, surface.w, surface.h, img);
  surface.texture.needsUpdate = true;
}

/**
 * A planet's surface, built from its project: procedural bands first (so
 * there's never an empty planet), then — once the thumbnail has loaded — the
 * bands are repainted in the thumbnail's own dominant colour and the
 * thumbnail itself is laid over them at 50%. Returns the texture and the hue
 * it ended up with, for the atmosphere and rings to match.
 */
export function usePlanetSurface(seed: number, baseHue: number, thumbnail?: string, tone?: Tone) {
  const sat = tone?.sat;
  const light = tone?.light;
  const surface = useMemo(
    () => createSurface(seed, baseHue, sat === undefined || light === undefined ? undefined : { sat, light }),
    [seed, baseHue, sat, light]
  );
  const [hue, setHue] = useState(baseHue);

  useEffect(() => {
    if (!thumbnail) return;
    let cancelled = false;
    loadImage(optimized(thumbnail))
      .catch(() => loadImage(thumbnail)) // optimizer unavailable: use the original
      .then((img) => {
        if (cancelled) return;
        // a planet with a theme colour keeps it; the thumbnail only overlays
        const h = tone ? baseHue : (dominantHue(img) ?? baseHue);
        repaint(surface, seed, h, img, tone);
        setHue(h);
      })
      .catch(() => {}); // no thumbnail: keep the procedural planet
    return () => {
      cancelled = true;
    };
    // tone is reduced to its primitives above (via surface); depending on the object would re-run every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface, seed, baseHue, thumbnail]);

  useEffect(() => () => surface.texture.dispose(), [surface]);

  return { map: surface.texture, hue };
}
