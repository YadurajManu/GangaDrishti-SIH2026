export type Channel = 'green' | 'orange';
export type ImagePixels = { width: number; height: number; data: Uint8ClampedArray };
export type Detection = { id: number; x: number; y: number; width: number; height: number; areaPx: number; diameterUm: number; meanSignal: number };

export function thresholdImage(image: ImagePixels, channel: Channel): Uint8Array {
  const mask = new Uint8Array(image.width * image.height);
  for (let i = 0; i < mask.length; i++) {
    const p = i * 4;
    const [r, g, b] = [image.data[p], image.data[p + 1], image.data[p + 2]];
    mask[i] = channel === 'green'
      ? +(g > 90 && g > r * 1.32 && g > b * 1.08)
      : +(r > 100 && r > g * 1.17 && g > b * 1.12);
  }
  return mask;
}

export function findCandidates(image: ImagePixels, mask: Uint8Array, umPerPx: number): Detection[] {
  if (!(umPerPx > 0)) throw new Error('A positive image scale is required.');
  const seen = new Uint8Array(mask.length);
  const found: Detection[] = [];
  const { width, height, data } = image;
  for (let seed = 0; seed < mask.length; seed++) {
    if (!mask[seed] || seen[seed]) continue;
    const stack = [seed]; seen[seed] = 1;
    let area = 0, minX = width, minY = height, maxX = 0, maxY = 0, signal = 0;
    while (stack.length) {
      const i = stack.pop()!;
      const x = i % width, y = Math.floor(i / width);
      area++; minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      signal += Math.max(data[i * 4], data[i * 4 + 1]);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const next = ny * width + nx;
        if (mask[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
      }
    }
    const diameterUm = 2 * Math.sqrt(area / Math.PI) * umPerPx;
    if (area >= 5 && diameterUm >= 20) found.push({ id: found.length + 1, x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, areaPx: area, diameterUm, meanSignal: Math.round(signal / area) });
  }
  return found.sort((a, b) => b.areaPx - a.areaPx).map((d, i) => ({ ...d, id: i + 1 }));
}

function poissonCdf(k: number, lambda: number): number {
  let term = Math.exp(-lambda), sum = term;
  for (let i = 1; i <= k; i++) { term *= lambda / i; sum += term; }
  return sum;
}

export function poisson95(count: number): [number, number] {
  if (!Number.isInteger(count) || count < 0) throw new Error('Count must be a non-negative integer.');
  if (count > 200) {
    const spread = 1.96 * Math.sqrt(count);
    return [Math.max(0, count - spread), count + spread]; // ponytail: normal approximation above 200; use a statistics library if high-count precision matters.
  }
  const solve = (k: number, target: number) => {
    let lo = 0, hi = Math.max(8, count * 3 + 20);
    for (let i = 0; i < 65; i++) {
      const mid = (lo + hi) / 2;
      if (poissonCdf(k, mid) > target) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  };
  return [count ? solve(count - 1, 0.975) : 0, solve(count, 0.025)];
}
